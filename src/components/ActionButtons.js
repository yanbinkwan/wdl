import { select } from "d3";
import Generator from "../wdlGenerator";

export default function () {
  const generator = Generator.create();
  const container = document.createElement("div");
  container.className = "container-fluid action-buttons";
  const row = document.createElement("div");
  row.className = "row";
  container.appendChild(row);
  const col = document.createElement("div");
  col.className = "col";
  row.appendChild(col);
  select(col)
    .append("button")
    .attr("class", "button-success button-small pure-button")
    .attr("type", "button")
    .text("生成代码")
    .on("click", () => {
      const str = generator.generate();
      console.log(str);
    });

  return container;
}
