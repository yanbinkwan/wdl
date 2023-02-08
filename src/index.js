import { select } from "d3";

import Generator from "./wdlGenerator";
import WdlCanvas from "./components/WdlCanvas.js";
import TaskList from "./components/TaskList.js";
import ActionButtons from "./components/ActionButtons.js";
import "purecss/build/base-min.css";
import "purecss/build/pure-min.css";
import "./assets/style.css";

const ins = {
  init: (tasks = []) => {
    const row = document.createElement("div");
    row.className = "row container";

    const wdlCanvasCol = document.createElement("div");
    wdlCanvasCol.className = "col-10";
    wdlCanvasCol.appendChild(WdlCanvas());

    row.appendChild(wdlCanvasCol);
    // row.appendChild(tasksCol);

    const svgContainer = document.createElement("div");
    svgContainer.className = "container-fluid svg-container";
    svgContainer.appendChild(row);

    const app = document.getElementById("app-wdl");
    svgContainer.appendChild(ActionButtons());
    app.appendChild(svgContainer);

    if (tasks.length > 0) {
      const generator = Generator.create();
      tasks.forEach(task => {
        generator.pushTask(task);
      });
    }
  },

  setTaskList: (tasks, savedTasks) => {
    const tasksCol = document.createElement("div");
    tasksCol.className = "col-2";
    select(tasksCol).call(TaskList, tasks, savedTasks);
    if (tasks.length > 0) document.querySelector(".container").append(tasksCol);
  },

  getCode: code => {
    return Generator.create().generate(code);
  },

  getStates: () => {
    const generator = Generator.create();
    return {
      tasks: generator.tasks,
      children: generator.root.children
    };
  }
};

window.wdl = ins;

/** MAIN FUNCTION */
// !(function () {
//   const row = document.createElement("div");
//   row.className = "row";

//   const wdlCanvasCol = document.createElement("div");
//   wdlCanvasCol.className = "col-10";
//   wdlCanvasCol.appendChild(WdlCanvas());

//   // const tasksCol = document.createElement("div");
//   // tasksCol.className = "col-2";
//   // select(tasksCol).call(TaskList);

//   row.appendChild(wdlCanvasCol);
//   // row.appendChild(tasksCol);

//   const svgContainer = document.createElement("div");
//   svgContainer.className = "container-fluid svg-container";
//   svgContainer.appendChild(row);

//   const app = document.getElementById("app");
//   svgContainer.appendChild(ActionButtons());
//   app.appendChild(svgContainer);
// })();
