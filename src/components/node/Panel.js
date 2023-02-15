import * as d3 from "d3";
import { dialog } from "../ParamsDialog.js";
import Stream from "./Stream";
import ContextMenu from "../ContextMenu.js";
import Link from "./Link";
import { INPUT_TASK, OUTPUT_TASK, TOOL_TASK } from "../../Constants.js";
import Text from "./Text.js";

export default function () {
  let data;
  const dg = dialog();
  const panelWidth = 50;
  const panelHeight = 25;
  const streamSize = 2;
  const fontSize = 1.8;
  const mainColor = "#f5fcff";
  const secondColor = "#0065ba";
  const dispatch = d3.dispatch("link", "delete", "update");

  const ins = selection => {
    const container = selection
      .select(".view")
      .selectAll("g.container")
      .data(data)
      .join("g")
      .attr("class", "container")
      .attr("transform", d => `translate(${d.x}, ${d.y})`)
      .call(moveNode(selection));

    // background panel
    container
      .selectAll("rect")
      .data(d => [d])
      .join("rect")
      .attr("class", "panel")
      .attr("height", panelHeight)
      .attr("width", panelWidth)
      .attr("rx", 1)
      .attr("ry", 1)
      .attr("fill", mainColor)
      .attr("stroke", secondColor)
      .attr("stroke-width", 0.2)
      .on("click", (_, d) => {
        dg.data(d).showup(function () {
          dispatch.call("update");
        });
      })
      .on("contextmenu", function (event, d) {
        event.preventDefault();
        d3.select("#app-wdl").call(
          ContextMenu()
            .x(event.pageX)
            .y(event.pageY)
            .on("delete", function ({ ins }) {
              dispatch.call("delete", null, d);
              ins.dismiss();
            })
        );
      });

    // process output/input stream & text
    container.each(function (d) {
      const inputStreams = Stream()
        .data(d.inputParams)
        .streamSize(0.8)
        .mainColor(mainColor)
        .secondColor(secondColor)
        .containerHeight(panelHeight)
        .containerWidth(panelWidth);
      const outputStreams = Stream()
        .data(d.outputParams)
        .on("link", d => {
          dispatch.call("link", null, d);
        })
        .on("link-click", d => dg.data(d).showup())
        .streamSize(0.8)
        .mainColor(mainColor)
        .secondColor(secondColor)
        .containerHeight(panelHeight)
        .containerWidth(panelWidth);
      d3.select(this).call(inputStreams, "input");
      d3.select(this).call(outputStreams, "output");

      // process text data
      const tag = {
        type: "tag",
        text: "",
        anchor: "end",
        dx: panelWidth - 2.5,
        y: 4,
        fontSize
      };
      switch (d.type) {
        case INPUT_TASK:
          tag.text = "INPUT";
          break;
        case OUTPUT_TASK:
          tag.text = "OUTPUT";
          break;
        case TOOL_TASK:
          tag.text = "TASK";
          break;
        default:
          tag.text = "UNKNOW";
          break;
      }
      const name = {
        type: "name",
        text: d.name,
        anchor: "start",
        dx: 2.5,
        y: 4,
        fontSize,
        fontWeight: "bold"
      };
      const fun = {
        type: "function",
        text: d.callFunction,
        anchor: "start",
        dx: 2.5,
        y: 8,
        fontSize
      };

      d3.select(this).call(Text().data([tag, name, fun]));
    });

    // process link path
    const linksData = data
      .filter(d => d.outputParams)
      .map(d => d.outputParams)
      .flat()
      .filter(d => d.links)
      .map(d => {
        if (d.links) {
          d.links.forEach(link => {
            link.source = [link.source[0], link.y + d.cy + streamSize / 2];
          });
        }
        return d.links;
      })
      .flat();

    linksData.forEach(d =>
      selection.select(".view").call(
        Link()
          .data(d)
          .on("click", d => {
            dg.data(d.data).showup();
          })
      )
    );

    function moveNode() {
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
                d.target = [x + input.cx, y + input.cy];
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
                    d.x = x;
                    d.y = y;
                    d.source = [x + output.cx, y + output.cy];
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
    }
  };

  ins.data = _ => (_ ? (data = _) && ins : data);

  ins.on = function () {
    const value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? ins : value;
  };

  return ins;
}
