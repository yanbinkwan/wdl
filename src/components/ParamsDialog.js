import * as d3 from "d3";
import x from "bootstrap-icons/icons/x.svg";
export function dialog() {
  let data;
  const types = ["String", "File", "Boolean"];
  const ins = function () {};
  //         <ul class="params-ul">${
  //   data.params &&
  //   data.params.map(param => {
  //     return `<li>
  //     <p class="name">${param.name}</p>
  //   </li>`;
  //   })
  // }</ul>

  // <span class="edit_param_label">
  // <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
  //   <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.75 19.25L9 18.25L18.2929 8.95711C18.6834 8.56658 18.6834 7.93342 18.2929 7.54289L16.4571 5.70711C16.0666 5.31658 15.4334 5.31658 15.0429 5.70711L5.75 15L4.75 19.25Z"></path>
  //   <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.25 19.25H13.75"></path>
  // </svg>
  // </span>
  function paramHtml() {
    return `
    <div class="card" style="width: 12rem;">
      <div class="card-body">
        <h3 class="border-bottom">节点：${
          data.label
        }</h3> <img src="${x}" class="closeBtn"/>

        ${
          data.inputParams.length > 0
            ? ` <h3>输入参数</h3> 
          <ul class="params-ul border-bottom mb-1">${data.inputParams
            .map(
              param => `<li >
              <p class="name">${param.label}</p>
            </li>`
            )
            .join("")}</ul>`
            : ""
        }
        ${
          data.outputParams.length > 0
            ? `
          <h3>输出参数</h3>
          <ul class="params-ul">${data.outputParams
            .map(
              param => `<li><p class="name">${param.label}</p>
            <select class="form-select form-select-sm" id="params-type-select-${
              param.label
            }" aria-label="Default select example"
            ">
            ${types.map(
              type => `
                <option value="${type}" ${
                type === param.type ? "selected" : ""
              }>${type}</option>
              `
            )}
            </select>
            </li>`
            )
            .join("")}</ul>`
            : ""
        }
      </div>
    </div>
  `;
    // <input type="text" id="output-label-${data.id}" value='${param.label}' "/>
    // <input type="number" id="${data.id}" value='${param.value}'/>
  }

  function linkHtml() {
    return `
    <div class="card" style="width: 12rem;">
      <div class="card-body">
        <h3 class="border-bottom">Link</h3>
        <img src="${x}" class="closeBtn"/>
        <h3>源: ${data.sourceLabel}</h3>
        <ul class="params-ul">
          <li><p class="name">输出端口：${data.sourceOutput}</p></li>
        </ul>
        <h3>目标：${data.targetLabel}</h3>
        <ul class="params-ul">
          <li><p class="name">输入端口：${data.targetInput}</p></li>
        </ul>
      </div>
    </div>`;
  }

  ins.showup = function () {
    d3.select(".dialog").remove();
    d3.select(".svg-container")
      .append("div")
      .attr("class", "dialog")
      .html(data.type === "link" ? linkHtml() : paramHtml());

    data.inputParams &&
      data.inputParams.forEach(p => {
        d3.select(`#${p.label}`).on("input", el => {
          const val = el.target.value;
          p.value = val;
        });
      });

    data.outputParams &&
      data.outputParams.forEach(p => {
        d3.select(`#${p.label}`).on("input", el => {
          const val = el.target.value;
          p.value = val;
        });

        d3.select(`#output-label-${data.id}`).on("input", el => {
          const val = el.target.value;
          p.label = val;
        });

        d3.select("#params-type-select-" + p.label).on("change", event => {
          const type = event.target.value;
          p.type = type;
          console.log(p);
        });
      });

    d3.select(".closeBtn").on("click", () => {
      this.dismiss();
    });
  };

  ins.data = _ => (_ ? (data = _) && ins : data);

  ins.dismiss = function () {
    d3.select(".dialog").remove();
  };

  return ins;
}
