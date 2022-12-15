import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.7.0/+esm";

const ContextMenu = function () {
  let x, y;

  const dispatch = d3.dispatch("delete");

  const ins = function (selection) {
    const options = ["删除", "修改"];
    const container = selection
      .selectAll(".context_menu")
      .data([null])
      .join("div")
      .classed("context_menu", true)
      .style("left", x + "px")
      .style("top", y + "px");

    container
      .selectAll("ul")
      .data([null])
      .join("ul")
      .selectAll("li")
      .data(options)
      .join("li")
      .text(d => d)
      .on("click", function (evnet, d) {
        if (d === "删除") {
          dispatch.call("delete", null, { action: "delete", ins });
        }
      });
  };

  ins.x = _ => (_ ? (x = _) && ins : x);

  ins.y = _ => (_ ? (y = _) && ins : y);

  ins.dismiss = function () {
    d3.select(".context_menu").remove();
  };

  ins.on = function () {
    const value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? ins : value;
  };

  return ins;
};

export default ContextMenu;
