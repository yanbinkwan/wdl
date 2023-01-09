export default class Generator {
  ins = null;
  root = null;
  tasks = [];
  imports = {};
  links = [];

  constructor() {
    this.root = new WorkFlow("wf_echo");
    return null;
  }

  static create() {
    if (!this.ins) {
      this.ins = new Generator();
    }
    return this.ins;
  }

  pushTask(task) {
    if (task.type === "task") {
      this.imports[task.label] = task.wdl_file;
    }
    this.tasks.push(task);
  }

  removeTask(id) {
    const index = this.tasks.findIndex(task => task.id === id);
    this.tasks.splice(index, 1);
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
      const { type } = child;
      switch (type) {
        case "call":
          s += ` \tcall ${child.task.label}.${
            child.task.call_function
          } { input: ${child.input
            .map((i, index) => `${i.label}=${child.output[index]}`)
            .join(",")} } \n`;
          break;
        case "output":
          s += ` \toutput {
            ${child.input.type} ${child.input.label}=${child.output} 
        }\n`;
          break;
        case "input":
          const {
            task: { outputParams }
          } = child;
          outputParams.forEach(output => {
            s += `\t${output.type} ${output.label} \n`;
          });
        default:
          break;
      }
    });
    let imports = "";
    Object.keys(this.imports).forEach(key => {
      const im = this.imports[key];
      imports += `import "${im}" as ${key} \n`;
    });

    str = `
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
