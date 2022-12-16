import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.7.0/+esm";
import { dialog } from "./dialog.js";
import ContextMenu from "./components/ContextMenu.js";

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
      .attr("dx", -2)
      .attr("font-size", "5")
      .on("contextmenu", event => {
        event.preventDefault();
      });
    const rects = group
      .selectAll("rect.container")
      .data([null])
      .join("rect")
      .attr("class", "container")
      .attr("height", 20)
      .attr("width", 20)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("fill", "#272643");

    group
      .selectAll("image")
      .data(d => [d])
      .join("image")
      .attr("xlink:href", "/wdl/wdl/node.svg")
      .attr("width", 15)
      .attr("height", 15)
      .attr("x", 2.5)
      .attr("y", 2.5)
      .on("click", (d, d1) => {
        dg.data(d1).showup();
      })
      .on("contextmenu", function (event, d) {
        const self = this;
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
        const y = 20 / x.length;
        d.y = i * y + 1.4 * 2;
        return d.y;
      })
      .attr("r", d => {
        d.r = 1.4;
        return d.r;
      })
      .attr("fill", "#272643");

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
        const y = 20 / x.length;
        d.y = i * y + 1.4 * 2;
        return d.y;
      })
      .attr("r", d => {
        d.r = 1.4;
        return d.r;
      })
      .attr("fill", "#272643")
      .call(linkNode(selection));
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
          const { pathID } = input;
          if (pathID) {
            d3.select("." + pathID).attr(
              "d",
              d3.linkHorizontal().target(d => {
                d.target = [x + input.x, y + input.y];
                return d.target;
              })
            );
          }
        });

      d.outputParams &&
        d.outputParams.forEach(output => {
          const { pathID } = output;
          if (pathID.length > 0) {
            pathID.forEach(id => {
              d3.select("." + id).attr(
                "d",
                d3.linkHorizontal().source(d => {
                  d.source = [x + output.x, y + output.y];
                  return d.source;
                })
              );
            });
          }
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
    function dragstarted(event, d) {
      const parentData = getParentData(d.pid);
      if (!d.pathID) {
        d.pathID = [];
      }
      d.pathID.push(`path-${d.pid}-${d.value}` + d3.randomInt(0, 9999)());
      const x = event.x + parentData.x;
      const y = event.y + parentData.y;
      d.source = [x, y];

      selection
        .append("path")
        .data([{ sourceNode: d, source: d.source }])
        .attr(
          "class",
          d => d.sourceNode.pathID[d.sourceNode.pathID.length - 1]
        );
    }

    function dragged(event, d) {
      const parentData = getParentData(d.pid);
      const x = event.x + parentData.x;
      const y = event.y + parentData.y;
      d.target = [x, y];
      selection
        .select("." + d.pathID[d.pathID.length - 1])
        .attr("stroke", "#85c9d1")
        .attr("fill", "none")
        .attr(
          "d",
          d3.linkHorizontal().target(td => {
            td.target = td.sourceNode.target;
            return td.target;
          })
        );
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
          return xp >= 0 && xp <= round && yp >= 0 && yp <= round;
        });

      if (hasLinked.size() > 0) {
        d3.select(this)
          .attr("fill", "#85c9d1")
          .attr("stroke", "#272643")
          .attr("stroke-width", "0.7");
        d.target[(x, y)];
        d.link = selection
          .select("." + d.pathID[d.pathID.length - 1])

          .attr("d", d3.linkHorizontal())
          .lower();
        hasLinked.each(link => (link.pathID = d.pathID[d.pathID.length - 1]));
        // d.pathID = d.pathID;
        const targetInputData = hasLinked.datum();
        const targetParentData = getParentData(targetInputData.pid);
        dispatch.call("link", null, {
          source: d,
          target: targetParentData,
          targetInput: targetInputData
        });
      } else {
        selection.select("." + d.pathID[d.pathID.length - 1]).remove();
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
