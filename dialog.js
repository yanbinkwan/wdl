import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.7.0/+esm";

export function dialog() {
  let data;
  const ins = function () {};

  function change(f) {
    console.log(f);
  }

  function paramHtml() {
    return `
    <h3>${data.label}</h3>

    <ul class="params-ul">${data.params.map(param => {
      return `<li>
        <p class="name">${param.name}</p>
        <input type="number" value='${param.value}'/>
      </li>`;
    })}</ul>

    <h3>输入参数</h3>
    <ul class="params-ul">${data.inputParams.map(param => {
      return `<li>
        <p class="name">${param.label}</p>
        <input type="number" id="${param.label}" value='${
        param.value && param.value.value
      }'/>
      </li>`;
    })}</ul>

    <h3>输出参数</h3>
    <ul class="params-ul">${data.outputParams.map(param => {
      return `<li>
        <p class="name">${param.label}</p>
        <input type="number" id="${param.label}" value='${param.value}'/>
      </li>`;
    })}</ul>
  `;
  }

  function linkHtml() {
    return `<h3>Link</h3>
     <h4>From</h4>
     <p>${data.sourceNode.label}</p>
     <p>输出端口：${data.sourceOutput.value}</p>
      <br/>
     <h4>To</h4>
     <p>${data.targetNode.label}</p>
     <p>输入端口：${data.targetInput.label}</p>
    `;
  }

  ins.showup = function () {
    d3.select(".dialog").remove();
    d3.select("#app")
      .append("div")
      .attr("class", "dialog")
      .html(data.type === "link" ? linkHtml() : paramHtml());

    data.inputParams.forEach(p => {
      d3.select(`#${p.label}`).on("input", el => {
        const val = el.target.value;
        p.value = val;
      });
    });

    data.outputParams.forEach(p => {
      d3.select(`#${p.label}`).on("input", el => {
        const val = el.target.value;
        p.value = val;
      });
    });
  };

  ins.data = _ => (_ ? (data = _) && ins : data);

  ins.dismiss = function () {
    d3.select(".dialog").remove();
  };

  return ins;
}
