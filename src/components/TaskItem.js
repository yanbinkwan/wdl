import * as d3 from "d3";

export default () => {
  const dispatch = d3.dispatch("dragend-g");
  let data;

  const ins = selection => {
    selection
      .append("ul")
      .attr("class", "list-group")
      .selectAll("li")
      .data(data)
      .join("li")
      .attr("class", "list-group-item")
      .text(d => (d.type === "task" ? d.call_function : d.label))
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
    // fetch("http://localhost:8000/task/list", { method: "POST" })
    //   .then(response => response.json())
    //   .then(json => json.result.records)
    //   .then(tasks => {
    //     selection
    //       .append("ul")
    //       .attr("class", "list-group")
    //       .selectAll("li")
    //       .data(tasks)
    //       .join("li")
    //       .attr("class", "list-group-item")
    //       .text(d => (d.type === "task" ? d.call_function : d.label))
    //       .attr("draggable", true)
    //       .on("dragstart", ev => {
    //         ev.dataTransfer.dropEffect = "copy";
    //       })
    //       .on("dragenter", ev => {
    //         ev.preventDefault();
    //       })
    //       .on("dragend", function (ev, d) {
    //         ev.preventDefault();
    //         const cObj = JSON.parse(JSON.stringify(d));
    //         cObj.id = cObj.id + "" + d3.randomInt(999)();
    //         cObj.inputParams &&
    //           cObj.inputParams.forEach(input => (input.pid = cObj.id));
    //         cObj.outputParams &&
    //           cObj.outputParams.forEach(output => (output.pid = cObj.id));
    //         ev.dataTransfer.task = cObj;
    //         dispatch.call("dragend-g", null, ev);
    //       });
    //   });
  };

  ins.data = _ => (_ ? (data = _) && ins : data);

  ins.on = function () {
    const value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? ins : value;
  };

  return ins;
};
