export default class Generator {
  root = null;
  tasks = [];
  imports = {};

  constructor() {
    this.root = new WorkFlow("wf_echo");
  }

  pushTask(task) {
    console.log(task);
    if (task.type === "task") {
      this.imports[task.label] = task.label;
    }
    this.tasks.push(task);
  }

  removeTask(id) {
    console.log(id);
    const index = this.tasks.findIndex(task => task.id === id);
    this.tasks.splice(index, 1);
    console.log(this.root.children);
    this.root.children.forEach((child, i) => {
      if (child.task.id === id) {
        this.root.children.splice(i, 1);
      }
    });
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
          s += `\t${output.type} ${output.label} \n`;
        });
      }
    });
    let imports = "";
    Object.keys(this.imports).forEach(key => {
      const im = this.imports[key];
      imports += `import "${im}" as ${im} \n`;
    });

    str = `
version 1.0

${imports}
workflow ${this.root.label} {\n${s}\n}`;

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
