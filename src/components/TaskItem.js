import * as d3 from "d3";

export default () => {
  const dispatch = d3.dispatch("dragend-g");
  let data;

  const ins = selection => {
    const divc = selection
      .append("div")
      .attr("class", "pure-menu")
      .style("display", "inline-block");

    divc
      .append("div")
      .attr("class", "toggle")
      .on("click", function () {
        divc.classed("close", !divc.classed("close"));
      });

    divc
      .append("ul")
      .attr("class", "pure-menu-list")
      .selectAll("li")
      .data(data)
      .join("li")
      .attr("class", "pure-menu-item")
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
        cObj.inputParams &&
          cObj.inputParams.forEach(input => (input.pid = cObj.toolId));
        cObj.outputParams &&
          cObj.outputParams.forEach(output => (output.pid = cObj.toolId));
        ev.dataTransfer.task = cObj;
        dispatch.call("dragend-g", null, ev);
      })
      .append("a")
      .attr("class", "pure-menu-link")
      .attr("href", "#")
      .text(d => d.name);
  };

  ins.data = _ => (_ ? (data = _) && ins : data);

  ins.on = function () {
    const value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? ins : value;
  };

  return ins;
};
