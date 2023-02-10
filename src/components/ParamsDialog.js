import * as d3 from "d3";

export function dialog() {
  let data;
  const types = ["String", "File", "Boolean"];
  const ins = function () {};

  function paramHtml() {
    return `
    <div class="body">
        <h3>${data.name}</h3>
        ${
          data.inputParams.length > 0
            ? `
            <div style="display: flex;justify-content: space-between;border-top: 1px solid #676785;">
              <h4>输入参数</h4> 
              <div class="plus-sign add-button"></div>
            </div>

            <ul class="params-ul">
              ${data.inputParams
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
            <div style="display: flex;justify-content: space-between;border-top: 1px solid #676785;">
              <h4>输出参数</h4> 
              <div class="plus-sign add-button"></div>
            </div>
          <ul class="params-ul">${data.outputParams
            .map(
              param => `<li>
              <input type="text" id="output-label-${param.label}" value="${
                param.label
              }"/>
              <select id="params-type-select-${
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

        <button class=" button-success button-small pure-button close-button ">关闭</button>
    </div>
  `;
  }

  function linkHtml() {
    return `
    <div class="card" style="width: 12rem;">
      <div class="card-body">
        <h3 class="border-bottom">Link</h3>
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

  ins.showup = function (callback) {
    d3.select("#app-wdl .dialog").remove();
    ins.callback = callback;

    d3.select("#app-wdl .svg-container")
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

        d3.select(`#output-label-${p.label}`).on("input", el => {
          const val = el.target.value;
          p.label = val;
        });

        d3.select("#params-type-select-" + p.label).on("change", event => {
          const type = event.target.value;
          p.type = type;
        });
      });

    d3.select(".close-button").on("click", () => {
      this.dismiss();
    });

    d3.select(".add-button").on("click", () => {
      data.outputParams.push({
        pid: data.outputParams[0].pid,
        label: "label-j" + Math.round(Math.random() * 100),
        type: "File",
        linked: false,
        links: []
      });
      ins.callback();
      ins.showup(ins.callback);
    });
  };

  ins.data = _ => (_ ? (data = _) && ins : data);

  ins.dismiss = function () {
    d3.select(".dialog").remove();
  };

  return ins;
}
