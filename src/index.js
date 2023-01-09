import { select } from "d3";

import WdlCanvas from "./components/WdlCanvas.js";
import TaskList from "./components/TaskList.js";
import ActionButtons from "./components/ActionButtons.js";
import "./style.sass";

function restore() {
  const tasks = JSON.parse(localStorage.getItem("task"));
  if (!tasks) return;
  tasks.forEach(task => {
    generator.pushTask(task);
  });
  d3.select(".svg-box").call(TaskIns.data(generator.tasks));
}

/** MAIN FUNCTION */
!(function () {
  const row = document.createElement("div");
  row.className = "row";

  const wdlCanvasCol = document.createElement("div");
  wdlCanvasCol.className = "col-10";
  wdlCanvasCol.appendChild(WdlCanvas());

  const tasksCol = document.createElement("div");
  tasksCol.className = "col-2";
  select(tasksCol).call(TaskList);

  row.appendChild(wdlCanvasCol);
  row.appendChild(tasksCol);

  const svgContainer = document.createElement("div");
  svgContainer.className = "container-fluid";
  svgContainer.appendChild(row);

  const app = document.getElementById("app");
  app.appendChild(ActionButtons());
  app.appendChild(svgContainer);

  // restore();
})();
