import { dispatch, drag, select, randomInt, selectAll } from "d3";
import Link from "./Link";
import Generator from "../../wdlGenerator";

export default function () {
  let data = [];
  let streamSize = 0.5;
  let containerHeight = 25;
  let containerWidth = 25;
  let strokeWidth = 0.3;
  let mainColor;
  let secondColor;
  let emitter;
  const generator = Generator.create();

  const disEvent = dispatch("link", "link-click", "delete", "update");

  /**
   *
   * @param {*} selection
   * @param {String} type "input" | "output"
   */
  const ins = (selection, type = "input") => {
    emitter = emitter;
    data.forEach((d, i, arr) => {
      d.cx = type === "input" ? 0 : containerWidth;
      const y = containerHeight / (arr.length + 1);
      d.cy = (i + 1) * y - streamSize / streamSize; // y - 2
      d.linkedIds = d.linkedIds || [];
      d.linked = d.linkedIds.length > 0;
    });

    const linkDrag = () => {
      let pd, linkInfo, linkPath;
      function dragstarted(_, d) {
        linkInfo = Object.create(null);

        pd = select(this.parentNode).datum();
        const { x: px, y: py } = pd;
        const { cx: x, cy: y } = d;
        linkInfo.id = `path-${d.pid}-${randomInt(0, Math.exp(10))()}`;
        linkInfo.x = px;
        linkInfo.y = py;
        linkInfo.source = [x + px, y + py];
        linkInfo.target = [x + px, y + py];
        generator.links.push(linkInfo);

        linkPath = new Link().data(generator.links);
        select(".svg-box .view").call(linkPath);
      }
      function dragged(event) {
        const { x: px, y: py } = pd;
        const { x, y } = event;
        linkInfo.target = [x + px, y + py];
        // linkPath.data(linkInfo);
        select(".svg-box .view").call(linkPath);
      }
      function dragended(event, d) {
        const { x, y } = event;
        let linkedInputNode;

        const ifLinkedSize = selectAll(".svg-box .container .input").filter(
          function (inputData) {
            const inputPData = select(this.parentNode).datum();
            const { x: px, y: py } = inputPData;
            const { cx, cy } = inputData;
            const xdiff = x + pd.x - (cx + px) + streamSize;
            const ydiff = y + pd.y - (cy + py) + streamSize;
            const isValid =
              xdiff > 0 &&
              xdiff < streamSize * 2 &&
              ydiff > 0 &&
              ydiff < streamSize * 2 &&
              !inputData.linked;
            isValid && (linkedInputNode = inputPData);
            return isValid;
          }
        );
        if (ifLinkedSize.size() <= 0) {
          generator.links = generator.links.filter(info => info !== linkInfo);
          select(".svg-box .view").call(
            linkPath
              .data(generator.links)
              .on("click", () =>
                disEvent.call("link-click", null, linkInfo.data)
              )
          );
          return;
        }

        d.linkedIds.push(linkInfo.id);
        d.linked = true;
        select(this)
          .attr("fill", mainColor)
          .attr("stroke", "#333333")
          .attr("stroke-width", strokeWidth);
        ifLinkedSize
          .attr("fill", mainColor)
          .attr("stroke", "#333333")
          .attr("stroke-width", strokeWidth);
        ifLinkedSize.each(link => {
          link.linkedIds = [linkInfo.id];
          link.linked = true;
        });
        const inputData = ifLinkedSize.datum();
        linkInfo.data = {
          type: "link",
          sourceLabel: pd.name,
          sourceOutput: d.label,
          targetLabel: linkedInputNode.name,
          targetInput: inputData.label
        };

        emitter.on(`${linkInfo.id}-delete`, id => {
          d.linkedIds = d.linkedIds.filter(dId => dId != id);
          inputData.linkedIds = inputData.linkedIds.filter(dId => dId != id);
          generator.links = generator.links.filter(link => link.id !== id);
          select(".svg-box .view").call(
            linkPath
              .data(generator.links)
              .on("click", () =>
                disEvent.call("link-click", null, linkInfo.data)
              )
          );
        });

        disEvent.call("link", null, {
          sourceNamespace: pd.callFunctiona,
          source: d,
          target: linkedInputNode,
          targetInput: inputData
        });
      }

      return drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    };

    selection
      .selectAll(`circle.${type}`)
      .data(data)
      .join("circle")
      .attr("class", type)
      .attr("r", streamSize)
      .attr("cx", d => d.cx)
      .attr("cy", d => d.cy)
      .attr("fill", mainColor)
      .attr("stroke", d => (d.linked ? "#333333" : secondColor))
      .attr("stroke-width", strokeWidth)
      .call(type === "output" ? linkDrag() : () => {});
    return this;
  };

  ins.data = _ => (_ ? (data = _) && ins : data);

  ins.on = function () {
    const value = disEvent.on.apply(disEvent, arguments);
    return value === disEvent ? ins : value;
  };

  ins.streamSize = _ => (_ ? (streamSize = _) && ins : streamSize);

  ins.emitter = _ => (_ ? (emitter = _) && ins : emitter);

  ins.strokeWidth = _ => (_ ? (strokeWidth = _) && ins : strokeWidth);

  ins.mainColor = _ => (_ ? (mainColor = _) && ins : mainColor);

  ins.secondColor = _ => (_ ? (secondColor = _) && ins : secondColor);

  ins.containerHeight = _ =>
    _ ? (containerHeight = _) && ins : containerHeight;

  ins.containerWidth = _ => (_ ? (containerWidth = _) && ins : containerWidth);

  return ins;
}
