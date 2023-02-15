export default function () {
  let data;
  let fill = "#000";

  const ins = selection => {
    selection
      .selectAll(`text`)
      .data(data)
      .join("text")
      .attr("class", d => d.type)
      .text(d => d.text)
      .attr("text-anchor", d => d.anchor)
      .attr("dx", d => d.dx)
      .attr("y", d => d.y)
      .attr("font-size", d => d.fontSize)
      .attr("font-weight", d => d.fontWeight || "normal")
      .attr("fill", fill);
  };

  ins.data = _ => (_ ? (data = _) && ins : data);
  ins.fill = _ => (_ ? (fill = _) && ins : fill);
  return ins;
}
