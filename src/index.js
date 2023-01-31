import { select, svg } from "d3";

import Generator from "./wdlGenerator";
import WdlCanvas from "./components/WdlCanvas.js";
import TaskList from "./components/TaskList.js";
import ActionButtons from "./components/ActionButtons.js";
import "./assets/style.sass";

export const ins = {
  init: () => {
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
  },

  setTaskList: tasks => {
    const tasksCol = document.createElement("div");
    tasksCol.className = "col-2";
    select(tasksCol).call(TaskList, tasks);
    document.querySelector(".container").append(tasksCol);
  },

  getCode: () => {
    return Generator.create().generate();
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
