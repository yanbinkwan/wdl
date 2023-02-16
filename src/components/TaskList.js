import TaskItem from "./TaskItem";
import Panel from "./node/Panel";
import Generator from "../wdlGenerator";
import { select } from "d3";
import Link from "./node/Link";

export default function (selection, tasksData, savedTasks) {
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
    if (task.type === 98) {
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
      child => child.type === "call" && child.task.toolId === target.toolId
    );

    if (!hasCalled) {
      generator.root.children.push({
        type: target.type === 0 ? "call" : "output",
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

  const handleUpdate = () => {
    select(".svg-box").call(TaskIns.data(generator.tasks));
  };

  const TaskIns = Panel()
    .on("link", handleLinkEvent)
    .on("delete", data => {
      generator.removeTask(data.toolId);
      select(".svg-box").call(TaskIns.data(generator.tasks));
    })
    .on("update", handleUpdate);

  selection.call(TaskItem().data(tasksData).on("dragend-g", dragEventHandler));

  if (savedTasks) {
    savedTasks.tasks.forEach(task => {
      generator.pushTask(task);
    });
    generator.links = savedTasks.links;
    generator.root.children = savedTasks.children;
    setTimeout(() => {
      select(".svg-box").call(TaskIns.data(generator.tasks));
      select(".svg-box .view").call(Link().data(generator.links));
    }, 0);
  }
}
