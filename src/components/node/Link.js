import { dispatch, linkHorizontal } from "d3";

export default function () {
  let data;
  let color = "#333333";
  let strokeWidth = 0.5;

  const disEvent = dispatch("click");

  const ins = selection => {
    selection
      .selectAll("path")
      .data(data)
      .join("path")
      .attr("class", d => d.id)
      .attr("stroke", color)
      .attr("stroke-width", strokeWidth)
      .attr("fill", "none")
      .attr("d", linkHorizontal())
      .on("click", (e, d) => {
        disEvent.call("click", null, d);
      })
      .lower();
    return this;
  };

  ins.data = _ => (_ ? (data = _) && ins : data);

  ins.on = function () {
    const value = disEvent.on.apply(disEvent, arguments);
    return value === disEvent ? ins : value;
  };

  ins.link = () => {};

  return ins;
}
