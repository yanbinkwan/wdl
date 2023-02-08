import { select, create, zoom } from "d3";

const height = 280;
const width = 280;

export default function () {
  const svg = create("svg")
    .attr("class", "svg-box")
    .attr("viewBox", [0, 0, width, height])
    .attr("stroke-width", 2)
    .call(dropzone)
    .on("contextmenu", event => {
      // preventing right click
      event.preventDefault();
    })
    .on("click", () => {
      select(".context_menu").remove();
    });

  const view = svg
    .append("g")
    .attr("class", "view")
    .attr("x", 0.5)
    .attr("y", 0.5)
    .attr("width", width - 1)
    .attr("height", height - 1);
  const z = zoom()
    .filter(event => {
      event.preventDefault();
      return (!event.ctrlKey || event.type === "wheel") && !event.button;
    })
    .on("zoom", ({ transform }) => {
      console.log(transform);
      view.attr("transform", transform);
    });
  svg.call(z);
  view
    .append("g")
    .attr("class", "g-dots")
    .selectAll("circle.dot")
    .data(square_grid())
    .join("circle")
    .attr("class", "dot")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => 0.8)
    .attr("fill", "#e2e1eb")
    .lower();

  return svg.node();
}

// Parameters refs: https://observablehq.com/@danleesmith/grid-studies-vol-1
function square_grid(s = 1900, n = 180, go = [0.5, 0.5], co = [0.5, 0.5]) {
  const cs = s / n;
  const x = i => (i % n) * cs - cs * n * go[0] + cs * co[0];
  const y = i => Math.floor(i / n) * cs - cs * n * go[1] + cs * co[1];
  const grid = [...Array(n * n).keys()];
  grid.forEach((v, i) => {
    grid[i] = { i: i, x: x(i), y: y(i), r: cs };
  });
  return grid;
}

function dropzone(selection) {
  selection
    .on("ondrop", ev => {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "move";
      // Get the id of the target and add the moved element to the target's DOM
      // const data = ev.dataTransfer.getData("text/plain");
      // ev.target.appendChild(document.getElementById(data));
    })
    .on("dragover", ev => {
      ev.preventDefault();
    });
}
