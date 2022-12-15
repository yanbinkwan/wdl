import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.7.0/+esm";

export function dialog() {
  let data;
  const ins = function () {};

  ins.showup = function () {
    console.log(data);
    d3.select("#app").append("div").attr("class", "dialog").html(`
      <h3>${data.label}</h3>
      ${data.outputParams.map(param => {})}
    `);
  };

  ins.data = _ => (_ ? (data = _) && ins : data);

  ins.dismiss = function () {
    d3.select(".dialog").remove();
  };

  return ins;
}
