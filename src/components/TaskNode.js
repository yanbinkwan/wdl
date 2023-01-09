import * as d3 from "d3";
import { dialog } from "../dialog.js";
import ContextMenu from "./ContextMenu.js";
import nodeImg from "../node.svg";

export default function () {
  let data;
  const dg = dialog();

  const dispatch = d3.dispatch("link", "delete");

  const ins = selection => {
    const group = selection
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("class", "node-g")
      .attr("transform", d => `translate(${d.x}, ${d.y})`)
      .call(moveNode(selection));

    group
      .selectAll("text")
      .data(d => [d.label])
      .join("text")
      .text(d => d)
      .attr("y", 26)
      .attr("dx", 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "5")
      .on("contextmenu", event => {
        event.preventDefault();
      });
    const rects = group
      .selectAll("rect.svg-container")
      .data([null])
      .join("rect")
      .attr("class", "svg-container")
      .attr("height", 20)
      .attr("width", 20)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("fill", "#272643");

    group
      .selectAll("image")
      .data(d => [d])
      .join("image")
      .attr("xlink:href", nodeImg)
      .attr("width", 15)
      .attr("height", 15)
      .attr("x", 2.5)
      .attr("y", 2.5)
      .on("click", (d, d1) => {
        dg.data(d1).showup();
      })
      .on("contextmenu", function (event, d) {
        event.preventDefault();
        d3.select("#app").call(
          ContextMenu()
            .x(event.pageX)
            .y(event.pageY)
            .on("delete", function ({ ins }) {
              dispatch.call("delete", null, d);
              ins.dismiss();
            })
        );
      });

    const inputs = group
      .selectAll("circle.inputs")
      .data(d => d.inputParams || [])
      .join("circle")
      .attr("class", "inputs")
      .attr("cx", d => {
        d.x = 0.1;
        return d.x;
      })
      .attr("cy", (d, i, x) => {
        const y = 20 / (x.length + 1);
        d.y = (i + 1) * y - 1.4 / 4;
        return d.y;
      })
      .attr("r", d => {
        d.r = 1.4;
        return d.r;
      })
      .attr("fill", d => (d.linked ? "#85c9d1" : "#272643"))
      .attr("stroke", d => (d.linked ? "#272643" : null))
      .attr("stroke-width", d => (d.linked ? "0.7" : null));
    const outputs = group
      .selectAll("circle.outputs")
      .data(d => d.outputParams || [])
      .join("circle")
      .attr("class", "outputs")
      .attr("cx", d => {
        d.x = 20;
        return d.x;
      })
      .attr("cy", (d, i, x) => {
        const y = 20 / (x.length + 1);
        d.y = (i + 1) * y - 1.4 / 4;
        return d.y;
      })
      .attr("r", d => {
        d.r = 1.4;
        return d.r;
      })
      .attr("fill", d => (d.linked ? "#85c9d1" : "#272643"))
      .attr("stroke", d => (d.linked ? "#272643" : null))
      .attr("stroke-width", d => (d.linked ? "0.7" : null))
      .call(linkNode(selection));

    const linksData = data
      .filter(d => d.outputParams)
      .map(d => d.outputParams)
      .flat()
      .filter(d => d.links)
      .map(d => d.links)
      .flat();

    selection
      .selectAll("path")
      .data(linksData)
      .join("path")
      .attr("stroke", "#85c9d1")
      .attr("fill", "none")
      .attr("class", d => d.id)
      .attr("d", d3.linkHorizontal())
      .lower();
  };

  ins.data = _ => (_ ? (data = _) && ins : data);

  const moveNode = () => {
    function dragstarted() {
      d3.select(this).attr("class", "node-g grabing");
    }

    function dragged(event, d) {
      // translate g element
      const { x, y } = event;
      d.x = x;
      d.y = y;
      d3.select(this).attr("transform", `translate(${d.x}, ${d.y})`);

      // translate circles inside of g
      d.inputParams &&
        d.inputParams.forEach(input => {
          d3.select("." + input.linkId).attr(
            "d",
            d3.linkHorizontal().target(d => {
              d.target = [x + input.x, y + input.y];
              return d.target;
            })
          );
        });

      d.outputParams &&
        d.outputParams.forEach(output => {
          const { links = [] } = output;
          links.forEach(link => {
            d3.select("." + link.id)
              .data([link])
              .attr(
                "d",
                d3.linkHorizontal().source(d => {
                  d.source = [x + output.x, y + output.y];
                  return d.source;
                })
              );
          });
        });
    }

    function dragended() {
      d3.select(this).attr("class", "node-g");
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  const linkNode = selection => {
    let linkInfo;

    function dragstarted(event, d) {
      linkInfo = Object.create(null);
      const parentData = getParentData(d.pid);
      const x = event.x + parentData.x;
      const y = event.y + parentData.y;
      linkInfo.id = `path-${d.pid}-` + d3.randomInt(0, 9999)();
      linkInfo.source = [x, y];

      selection
        .append("path")
        .data([linkInfo])
        .attr("stroke", "#85c9d1")
        .attr("fill", "none")
        .attr("class", linkInfo.id);
    }

    function dragged(event, d) {
      const parentData = getParentData(d.pid);
      const x = event.x + parentData.x;
      const y = event.y + parentData.y;
      linkInfo.target = [x, y];
      selection.select("." + linkInfo.id).attr("d", d3.linkHorizontal());
    }

    function dragended(event, d) {
      const parentData = getParentData(d.pid);
      const x = event.x + parentData.x;
      const y = event.y + parentData.y;

      const hasLinked = d3
        .selectAll(".node-g .inputs")
        .filter(function (inputD) {
          const parentD = getParentData(inputD.pid);
          const xp = parentD.x + inputD.x + inputD.r - x;
          const yp = parentD.y + inputD.y + inputD.r - y;
          const round = inputD.r * 2;
          return (
            xp >= 0 && xp <= round && yp >= 0 && yp <= round && !inputD.linked
          );
        });

      if (hasLinked.size() > 0) {
        d.links = d.links || [];
        d.links.push(linkInfo);
        d.linked = true;
        d3.select(this)
          .attr("fill", "#85c9d1")
          .attr("stroke", "#272643")
          .attr("stroke-width", "0.7");
        hasLinked
          .attr("fill", "#85c9d1")
          .attr("stroke", "#272643")
          .attr("stroke-width", "0.7");

        const link = selection
          .select("." + linkInfo.id)
          .attr("d", d3.linkHorizontal())
          .lower();
        hasLinked.each(link => {
          link.linkId = linkInfo.id;
          link.linked = true;
        });
        const targetInputData = hasLinked.datum();
        const targetParentData = getParentData(targetInputData.pid);
        console.log(parentData);
        dispatch.call("link", null, {
          sourceNamespace:
            parentData.type !== "input" ? parentData.call_function : null,
          source: d,
          target: targetParentData,
          targetInput: targetInputData
        });

        link.on("click", () => {
          dg.data({
            type: "link",
            sourceNode: parentData,
            sourceOutput: d,
            targetNode: targetParentData,
            targetInput: targetInputData
          }).showup();
          // d.link.attr("stroke", "#f5f5f5").attr("stroke-width", "0.2");
        });
      } else {
        selection.select("." + linkInfo.id).remove();
      }
    }

    function getParentData(pid) {
      return ins.data().find(pd => pd.id === pid);
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  ins.on = function () {
    const value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? ins : value;
  };

  return ins;
}
