import { select } from "d3";
import Generator from "../wdlGenerator";

export default function () {
  const generator = Generator.create();
  const container = document.createElement("div");
  container.className = "container-fluid";
  const row = document.createElement("div");
  row.className = "row";
  container.appendChild(row);
  const col = document.createElement("div");
  col.className = "col";
  row.appendChild(col);
  select(col)
    .append("button")
    .attr("class", "btn btn-primary btn-sm")
    .attr("type", "button")
    .text("生成代码")
    .on("click", () => {
      const str = generator.generate();
      console.log(str);
    });

  select(col)
    .append("button")
    .attr("class", "btn btn-primary btn-sm")
    .style("margin", "10px")
    .attr("type", "button")
    .text("保存状态")
    .on("click", () => {
      localStorage.setItem("task", JSON.stringify(generator.tasks));
    });

  return container;
}