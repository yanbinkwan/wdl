import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.7.0/+esm";

export function dialog() {
  let data;
  const ins = function () {};

  function paramHtml() {
    return `
    <h3>${data.label}</h3>

    <ul class="params-ul">${
      data.params &&
      data.params.map(param => {
        return `<li>
        <p class="name">${param.name}</p>
        <input type="number" value='${param.value}'/>
      </li>`;
      })
    }</ul>

    <h3>输入参数</h3>
    <ul class="params-ul">${data.inputParams.map(param => {
      return `<li>
      <p class="name">${
        param.label
      } <span class="edit_param_label"><svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.75 19.25L9 18.25L18.2929 8.95711C18.6834 8.56658 18.6834 7.93342 18.2929 7.54289L16.4571 5.70711C16.0666 5.31658 15.4334 5.31658 15.0429 5.70711L5.75 15L4.75 19.25Z"></path>
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.25 19.25H13.75"></path>
    </svg>
    </span></p>
        <input type="number" id="${param.label}" value='${
        param.value && param.value.value
      }'/>
      </li>`;
    })}</ul>

    <h3>输出参数</h3>
    <ul class="params-ul">${data.outputParams.map(param => {
      return `<li>
        <p class="name">${param.label} <span class="edit_param_label"><svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.75 19.25L9 18.25L18.2929 8.95711C18.6834 8.56658 18.6834 7.93342 18.2929 7.54289L16.4571 5.70711C16.0666 5.31658 15.4334 5.31658 15.0429 5.70711L5.75 15L4.75 19.25Z"></path>
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.25 19.25H13.75"></path>
      </svg>
      </span></p>
      <input type="text" id="output-label-${data.id}" value='${param.label}' "/>
        <input type="number" id="${data.id}" value='${param.value}'/>
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

      d3.select(`#output-label-${data.id}`).on("input", el => {
        const val = el.target.value;
        p.label = val;
      });
    });
  };

  ins.data = _ => (_ ? (data = _) && ins : data);

  ins.dismiss = function () {
    d3.select(".dialog").remove();
  };

  return ins;
}
