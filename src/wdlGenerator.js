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
    if (task.type === 0) {
      this.imports[task.toolLabel] = task.wdl;
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

  generate(code) {
    let str = "";
    let s = "";
    this.root.children.forEach(child => {
      const { type } = child;
      switch (type) {
        case "call":
          s += ` \tcall ${child.task.toolLabel}.${
            child.task.callFunction
          } { input: ${child.input
            .map((i, index) => `${i.label}=${child.output[index]}`)
            .join(",")} } \n`;
          break;
        case "output":
          s += ` \toutput {
            ${child.input[0].type} ${child.input[0].label}=${child.output} 
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
workflow ${code} {\n${s}\n}`;
    return str;
  }
}

export class WorkFlow {
  label = "";
  children = [];

  constructor(label) {
    this.label = label;
  }
}
