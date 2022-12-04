import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.7.0/+esm";

export const items = () => {
  const data = [
    {
      text: 1
    },
    {
      text: 2
    },
    {
      text: 3
    },
    {
      text: 4
    }
  ];
  const dispatch = d3.dispatch("dragend-g");
  const ins = selection => {
    selection
      .append("div")
      .attr("class", "drag-container")
      .selectAll("div")
      .data(data)
      .join("div")
      .attr("class", "items")
      .attr("draggable", true)
      .on("dragstart", ev => {
        ev.dataTransfer.dropEffect = "copy";
      })
      .on("dragenter", ev => {
        ev.preventDefault();
      })
      .on("dragend", function (ev) {
        ev.preventDefault();
        dispatch.call("dragend-g", null, ev);
      });
  };

  ins.on = function () {
    const value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? ins : value;
  };

  return ins;
};
