import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.7.0/+esm";

export default function () {
  let data;

  const ins = selection => {
    const group = selection
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("class", "node-g")
      .attr("transform", d => `translate(${d.x}, ${d.y})`)
      .call(moveNode(selection));

    const inputs = group
      .selectAll(".inputs circle")
      .data(d => d.inputs)
      .join("circle")
      .attr("class", "inputs")
      .attr("cx", 0)
      .attr("cy", (d, i) => {
        d.y = i * 5 + 5;
        return d.y;
      })
      .attr("r", 1.4)
      .attr("fill", "red");
    // .call(linkNode(selection));

    const outputs = group
      .selectAll(".outputs circle")
      .data(d => d.outputs)
      .join("circle")
      .attr("class", "outputs")
      .attr("cx", d => d.x)
      .attr("cy", (d, i) => {
        d.y = i * 5 + 5;
        return d.y;
      })
      .attr("r", d => d.r)
      .attr("fill", "red")
      .call(linkNode(selection));

    const rects = group
      .append("rect")
      .attr("height", 20)
      .attr("width", 20)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("fill", "#272643");

    group
      .append("image")
      .attr("xlink:href", "/node.svg")
      .attr("width", 15)
      .attr("height", 15)
      .attr("x", 2.5)
      .attr("y", 2.5);
  };

  ins.data = _ => (_ ? (data = _) && ins : data);

  const moveNode = () => {
    function dragstarted() {
      d3.select(this).attr("class", "node-g grabing");
    }
    function dragged(event, d) {
      const { x, y } = event;
      d.x = x;
      d.y = y;

      d3.select(this).attr("transform", `translate(${d.x}, ${d.y})`);

      d.inputs.forEach(input => {
        if (input.path && input.link) {
          input.link.target(() => [x + input.x, y + input.y]);
          input.path.attr("d", input.link());
        }
      });

      d.outputs.forEach(output => {
        if (output.path && output.link) {
          output.link.source(() => [x + output.x, y + output.y]);
          output.path.attr("d", output.link());
        }
      });
    }
    function dragended() {
      d3.select(this).attr("class", "node-g");
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  const linkNode = (selection, type) => {
    let path, linkHorizontal, parentData;
    function dragstarted(event, d) {
      linkHorizontal = d3.linkHorizontal();
      parentData = data.find(pd => pd.id === d.id);
      path = selection.append("path").attr("class", `path-${parentData.id}`);

      const x = event.x + parentData.x;
      const y = event.y + parentData.y;
      d.link = linkHorizontal;
      d.start = [event.x, event.y];
      linkHorizontal.source(function () {
        return [x, y];
      });
    }
    function dragged(event) {
      const x = event.x + parentData.x;
      const y = event.y + parentData.y;
      linkHorizontal.target(function () {
        return [x, y];
      });
      path
        .attr("stroke", "black")
        .attr("fill", "none")
        .attr("d", linkHorizontal);
    }
    function dragended(event, d) {
      const x = event.x + parentData.x;
      const y = event.y + parentData.y;
      let flag = false;

      d3.selectAll(".node-g").each(function (gd) {
        d3.select(this)
          .selectAll("circle")
          .each(function (d) {
            const scx = gd.x + d.x - d.r;
            const ecx = gd.x + d.x + d.r;
            const scy = gd.y + d.y - d.r;
            const ecy = gd.y + d.y + d.r;
            if (x >= scx && x <= ecx && y >= scy && y <= ecy) {
              flag = true;
              d.path = path;
              d.link = linkHorizontal;
              d.start = [event.x, event.y];
            }
          });
      });

      if (!flag) {
        path.remove();
      } else {
        d.path = path;
        path.lower();
      }
      d.end = [x, y];
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  return ins;
}
