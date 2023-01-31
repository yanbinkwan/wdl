import * as d3 from "d3";
import { dialog } from "./ParamsDialog.js";
import ContextMenu from "./ContextMenu.js";

export default function () {
  let data;
  const dg = dialog();
  const panelWidth = 80;
  const panelHeight = 40;
  const streamSize = 4;

  const dispatch = d3.dispatch("link", "delete");

  const ins = selection => {
    const container = selection
      .selectAll("g.container")
      .data(data)
      .join("g")
      .classed("container", true)
      .attr("transform", d => `translate(${d.x}, ${d.y})`)
      .call(moveNode(selection));
    container
      .append("rect")
      .classed("panel", true)
      .attr("height", panelHeight)
      .attr("width", panelWidth)
      .attr("rx", 2.5)
      .attr("ry", 2.5)
      .attr("stroke", "#676785")
      .attr("stroke-width", 0.5)
      .attr("fill", "#313147")
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
    container
      .append("text")
      .text(d => d.type.toUpperCase())
      .attr("text-anchor", "end")
      .attr("dx", panelWidth - 5)
      .attr("y", 8)
      .attr("font-size", "4")
      .attr("fill", "#e9ecff");
    container
      .append("text")
      .text(d => d.label)
      .attr("text-anchor", "start")
      .attr("y", 8)
      .attr("dx", 5)
      .attr("font-size", "4")
      .attr("fill", "#e9ecff")
      .style("font-weight", "bold");
    container
      .append("text")
      .text(d => d.call_function)
      .attr("y", 16)
      .attr("dx", 5)
      .attr("font-size", "4")
      .attr("fill", "#e9ecff");
    container
      .selectAll("circle.inputs")
      .data(d => d.inputParams || [])
      .join("rect")
      .classed("inputs", true)
      .attr("width", streamSize)
      .attr("height", streamSize)
      .attr("rx", 1)
      .attr("ry", 1)
      .attr("x", d => {
        d.x = -2.5;
        return d.x;
      })
      .attr("y", (d, i, x) => {
        const y = 38 / (x.length + 1);
        d.y = (i + 1) * y - 2 / streamSize;
        return d.y;
      })
      .attr("fill", d => (d.linked ? "#85c9d1" : "#272643"))
      .attr("stroke", d => (d.linked ? "#656593" : "#656593"))
      .attr("stroke-width", 0.4);
    container
      .selectAll("circle.outputs")
      .data(d => d.outputParams || [])
      .join("rect")
      .attr("class", "outputs")
      .attr("width", streamSize)
      .attr("height", streamSize)
      .attr("rx", 1)
      .attr("ry", 1)
      .attr("x", d => {
        d.x = panelWidth - 1.5;
        return d.x;
      })
      .attr("y", (d, i, x) => {
        const y = 38 / (x.length + 1);
        d.y = (i + 1) * y - 2 / streamSize;
        return d.y;
      })
      .attr("fill", d => (d.linked ? "#85c9d1" : "#272643"))
      .attr("stroke", d => (d.linked ? "#656593" : "#656593"))
      .attr("stroke-width", 0.4)
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
      .on("click", (d, d1) => {
        dg.data({
          type: "link",
          ...d1.data
        }).showup();
      })
      .lower();
  };

  ins.data = _ => (_ ? (data = _) && ins : data);

  ins.on = function () {
    const value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? ins : value;
  };

  const moveNode = () => {
    function dragstarted() {
      d3.select(this).attr("class", "container grabing");
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
              d.target = [x + input.x + 2, y + input.y + 2];
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
                  d.source = [x + output.x + 2, y + output.y + 2];
                  return d.source;
                })
              );
          });
        });
    }

    function dragended() {
      d3.select(this).attr("class", "container");
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
      const x = event.x + parentData.x + 2;
      const y = event.y + parentData.y + 2;

      linkInfo.id = `path-${d.pid}-` + d3.randomInt(0, 9999)();
      linkInfo.source = [x, y];

      selection
        .append("path")
        .data([linkInfo])
        .attr("stroke", "#85c9d1")
        .attr("fill", "none")
        .attr("class", linkInfo.id)
        .lower();
    }

    function dragged(event, d) {
      const parentData = getParentData(d.pid);
      const x = event.x + parentData.x + 2;
      const y = event.y + parentData.y + 2;
      linkInfo.target = [x, y];
      selection.select("." + linkInfo.id).attr("d", d3.linkHorizontal());
    }

    function dragended(event, d) {
      const parentData = getParentData(d.pid);
      const x = event.x + parentData.x;
      const y = event.y + parentData.y;

      const hasLinked = d3
        .selectAll(".container .inputs")
        .filter(function (inputD) {
          const parentD = getParentData(inputD.pid);
          const xp = parentD.x + inputD.x + 2 - x;
          const yp = parentD.y + inputD.y + 2 - y;
          console.log(yp, xp);
          return xp >= 0 && xp <= 4 && yp >= 0 && yp <= 4 && !inputD.linked;
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

        hasLinked.each(link => {
          link.linkId = linkInfo.id;
          link.linked = true;
        });
        const targetInputData = hasLinked.datum();
        const targetParentData = getParentData(targetInputData.pid);

        const link = selection
          .select("." + linkInfo.id)
          .attr("d", d3.linkHorizontal())
          .lower()
          .each(d => {
            d.data = {
              type: "link",
              sourceLabel: parentData.label,
              sourceOutput: d.value,
              targetLabel: targetParentData.label,
              targetInput: targetInputData.label
            };
          });
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

  return ins;
}
