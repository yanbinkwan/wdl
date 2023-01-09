import { select, create } from "d3";

const height = 200;
const width = 200;

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

  return svg.node();
}

function dropzone(selection) {
  selection
    .on("ondrop", ev => {
      console.log("Drop");
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
