import * as d3 from "d3";
import { items } from "./items.js";
import Task from "./task.js";
import Generator from "./wdlGenerator.js";
import "./style.css";

const height = 200;
const width = 200;
const generator = new Generator();
const TaskIns = Task()
  .on("link", handleLinkEvent)
  .on("delete", handleTaskDeleteEvent);

function initSvg() {
  const svg = d3
    .create("svg")
    .attr("class", "svg-box")
    .attr("viewBox", [0, 0, width, height])
    .attr("stroke-width", 2)
    .call(dropzone)
    .on("contextmenu", event => {
      event.preventDefault();
    })
    .on("click", event => {
      d3.select(".context_menu").remove();
    });

  return svg.node();
}

function restore() {
  const tasks = JSON.parse(localStorage.getItem("task"));
  if (!tasks) return;
  tasks.forEach(task => {
    generator.pushTask(task);
  });
  d3.select(".svg-box").call(TaskIns.data(generator.tasks));
}

function loadTasks() {
  d3.select("#app").call(
    items().on("dragend-g", value => {
      const {
        x,
        y,
        dataTransfer: { task }
      } = value;
      const svgnode = d3.select(".svg-box").node();
      const pt = svgnode.createSVGPoint();
      pt.x = x;
      pt.y = y;
      const svgP = pt.matrixTransform(svgnode.getScreenCTM().inverse());
      task.x = svgP.x;
      task.y = svgP.y;

      generator.pushTask(task);
      if (task.type === "input") {
        generator.root.children.unshift({
          type: "input",
          task
        });
      }
      d3.select(".svg-box").call(TaskIns.data(generator.tasks));
    })
  );
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

function handleLinkEvent(params) {
  const { sourceNamespace, source, target, targetInput } = params;
  targetInput.value = source;

  const hasCalled = generator.root.children.find(
    child => child.type === "call" && child.task.id === target.id
  );

  if (!hasCalled) {
    generator.root.children.push({
      type: target.type === "task" ? "call" : "output",
      task: target,
      source,
      output: [
        `${sourceNamespace ? sourceNamespace + "." : ""}${source.label}`
      ],
      input: [targetInput]
    });
  } else {
    hasCalled.input.push(targetInput);
    hasCalled.output.push(
      `${sourceNamespace ? sourceNamespace + "." : ""}${source.label}`
    );
  }
}

function handleTaskDeleteEvent(data) {
  data.outputParams &&
    data.outputParams.forEach(output => {
      const { links = [] } = output;
      links.forEach(link => {
        d3.select("." + link.id).remove();
      });
    });
  data.inputParams &&
    data.inputParams.forEach(input => {
      if (input.linkId) {
        d3.select("." + input.linkId).remove();
      }
    });
  generator.removeTask(data.id);
  d3.select(".svg-box").call(TaskIns.data(generator.tasks));
}

function main() {
  document.getElementById("app").appendChild(initSvg());
  restore();
  loadTasks();
  // d3.select("#app")
  //   .append("div")
  //   .attr("class", "btns")
  //   .append("button")
  //   .text("generate wdl")
  //   .on("click", () => {
  //     const str = generator.generate();
  //     console.log(str);
  //   });
  // d3.select(".btns")
  //   .append("button")
  //   .text("save")
  //   .on("click", () => {
  //     console.log("save", generator.tasks);
  //     localStorage.setItem("task", JSON.stringify(generator.tasks));
  //   });
}

main();
