import { select, svg } from "d3";

import WdlCanvas from "./components/WdlCanvas.js";
import TaskList from "./components/TaskList.js";
import ActionButtons from "./components/ActionButtons.js";
import "./assets/style.sass";

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
  svgContainer.className = "container-fluid svg-container";
  svgContainer.appendChild(row);

  const app = document.getElementById("app");
  svgContainer.appendChild(ActionButtons());
  app.appendChild(svgContainer);
})();
