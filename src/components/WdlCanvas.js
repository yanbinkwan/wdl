import { select, create, zoom } from "d3";

const height = window.innerHeight;
const width = window.innerWidth;

export default function () {
  const svg = create("svg")
    .attr("class", "svg-box")
    .attr("viewBox", [0, 0, width, height])
    .attr("stroke-width", 2)
    .style("pointer-events", "all")
    .call(dropzone)
    .on("contextmenu", event => {
      // preventing right click
      event.preventDefault();
    })
    .on("click", () => {
      select(".context_menu").remove();
    });

  svg
    .append("g")
    .attr("class", "g-dots")
    .selectAll("circle.dot")
    .data(square(width, height))
    .join("circle")
    .attr("class", "dot")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => d.r)
    .attr("fill", "#e2e1eb")
    .lower();

  const view = svg.append("g").attr("class", "view");
  const z = zoom()
    .translateExtent([
      [0, 0],
      [width, height]
    ])
    .scaleExtent([3, 15])
    .filter(event => {
      event.preventDefault();
      return (!event.ctrlKey || event.type === "wheel") && !event.button;
    })
    .on("zoom", ({ transform }) => {
      view.attr("transform", transform);
      select(".g-dots").attr("transform", transform);
    });
  z.scaleTo(svg, 3);
  z.translateTo(svg, width / 2, height / 2);
  svg.call(z);

  return { node: svg.node(), zoom: z };
}

function square(w = width, h = height) {
  const r = 1;
  const m = 25;
  const xl = Math.round(w / (r + m));
  const hl = Math.round(h / (r + m));

  const x = i => i * (r + m);

  const xa = Array(xl)
    .fill(0)
    .map((_, i) => {
      return Array(hl)
        .fill({})
        .map((_, j) => ({ x: x(i), y: x(j), r }));
    });
  return xa.flat();
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
