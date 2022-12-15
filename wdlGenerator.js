export default class Generator {
  root = null;
  tasks = [];
  imports = {};

  constructor() {
    this.root = new WorkFlow("wf_echo");
  }

  pushTask(task) {
    if (task.type === "task") {
      // imports[task.label] = task.label;
    }
    this.tasks.push(task);
  }

  removeTask(id) {
    const index = this.tasks.findIndex(task => task.id === id);
    this.tasks.splice(index, 1);
  }

  generate() {
    let str = "";
    let s = "";
    this.root.children.forEach(child => {
      if (child.type === "call") {
        s += ` \t call ${child.task.label} { input: ${child.input}=${child.output} } \n`;
      } else if (child.type === "output") {
        s += ` \t output {
            ${child.source.label}.${child.input}
        }\n`;
      } else if (child.type === "input") {
        const {
          task: { outputParams }
        } = child;
        outputParams.forEach(output => {
          s += `\t${output.type} ${output.value} \n`;
        });
      }
    });

    str = `workflow ${this.root.label} {\n${s}\n}`;
    console.log(str);
  }
}

export class WorkFlow {
  label = "";
  children = [];

  constructor(label) {
    this.label = label;
  }
}
