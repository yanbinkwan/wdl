import { select, create, zoom, selectAll } from "d3";
import * as d3 from "d3";

// const height = 120;
// const width = 280;

const height = window.innerHeight;
const width = window.innerWidth;

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
  // svg
  //   .append("g")
  //   .attr("class", "g-dots")
  //   .selectAll("circle.dot")
  //   .data(square_grid())
  //   .join("circle")
  //   .attr("class", "dot")
  //   .attr("cx", d => d.x)
  //   .attr("cy", d => d.y)
  //   .attr("r", 0.2)
  //   .attr("fill", "#e2e1eb")
  //   .lower();

  const view = svg.append("g").attr("class", "view");

  const z = zoom()
    .translateExtent([
      [0, 0],
      [width, height]
    ])
    .scaleExtent([1, 20])
    .filter(event => {
      event.preventDefault();
      return (!event.ctrlKey || event.type === "wheel") && !event.button;
    })
    .on("zoom", ({ transform }) => {
      view.attr("transform", transform);
    });
  svg.call(z);

  return svg.node();
}

// Parameters refs: https://observablehq.com/@danleesmith/grid-studies-vol-1
function square_grid(s = 480, n = 100, go = [0.5, 0.5], co = [0.5, 0.5]) {
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
