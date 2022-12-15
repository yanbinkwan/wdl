import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.7.0/+esm";

export const items = () => {
  const dispatch = d3.dispatch("dragend-g");
  const ins = selection => {
    fetch("./tasks.json")
      .then(response => response.json())
      .then(json => json.tasks)
      .then(tasks => {
        selection
          .append("div")
          .attr("class", "drag-container")
          .selectAll("div")
          .data(tasks)
          .join("div")
          .attr("class", "items")
          .text(d => d.label)
          .attr("draggable", true)
          .on("dragstart", ev => {
            ev.dataTransfer.dropEffect = "copy";
          })
          .on("dragenter", ev => {
            ev.preventDefault();
          })
          .on("dragend", function (ev, d) {
            ev.preventDefault();
            const cObj = JSON.parse(JSON.stringify(d));
            cObj.id = cObj.id + "" + d3.randomInt(999)();
            cObj.inputParams &&
              cObj.inputParams.forEach(input => (input.pid = cObj.id));
            cObj.outputParams &&
              cObj.outputParams.forEach(output => (output.pid = cObj.id));
            ev.dataTransfer.task = cObj;
            dispatch.call("dragend-g", null, ev);
          });
      });
  };

  ins.on = function () {
    const value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? ins : value;
  };

  return ins;
};