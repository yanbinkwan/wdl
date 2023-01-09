import TaskItem from "./TaskItem";
import TaskNode from "./TaskNode";
import Generator from "../wdlGenerator";
import { select } from "d3";

export default function (selection) {
  const generator = Generator.create();
  const dragEventHandler = value => {
    const {
      x,
      y,
      dataTransfer: { task }
    } = value;

    // transform position values
    const svgnode = select(".svg-box").node();
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
    select(".svg-box").call(TaskIns.data(generator.tasks));
  };
  const handleLinkEvent = params => {
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
  };
  const handleTaskDeleteEvent = data => {
    data.outputParams &&
      data.outputParams.forEach(output => {
        const { links = [] } = output;
        links.forEach(link => {
          select("." + link.id).remove();
        });
      });
    data.inputParams &&
      data.inputParams.forEach(input => {
        if (input.linkId) {
          select("." + input.linkId).remove();
        }
      });
    generator.removeTask(data.id);
    select(".svg-box").call(TaskIns.data(generator.tasks));
  };

  const TaskIns = TaskNode()
    .on("link", handleLinkEvent)
    .on("delete", handleTaskDeleteEvent);

  selection.call(TaskItem().on("dragend-g", dragEventHandler));

  const tasks = JSON.parse(localStorage.getItem("task"));
  if (!tasks) return;
  tasks.forEach(task => {
    generator.pushTask(task);
  });

  setTimeout(() => {
    select(".svg-box").call(TaskIns.data(generator.tasks));
  }, 0);
}
