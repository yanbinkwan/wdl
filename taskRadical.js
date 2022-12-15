import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.7.0/+esm";

export default function () {
  let data;

  const dispatch = d3.dispatch("link");

  const ins = selection => {
    const group = selection
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("class", "node-g")
      .attr("transform", d => `translate(${d.x}, ${d.y})`)
      .call(moveNode(selection));

    group
      .selectAll(".s text")
      .data(d => [d.label])
      .join("text")
      .text(d => d)
      .attr("y", 26)
      .attr("dx", -2)
      .attr("font-size", "6");

    const inputs = group
      .selectAll(".inputs circle")
      .data(d => d.inputParams || [])
      .join("circle")
      .attr("class", "inputs")
      .attr("cx", d => {
        d.x = 0;
        return d.x;
      })
      .attr("cy", (d, i) => {
        d.y = i * 5 + 5;
        return d.y;
      })
      .attr("r", 1.4)
      .attr("fill", "red");

    const outputs = group
      .selectAll(".outputs circle")
      .data(d => d.outputParams || [])
      .join("circle")
      .attr("class", "outputs")
      .attr("cx", d => {
        d.x = 20;
        return d.x;
      })
      .attr("cy", (d, i) => {
        d.y = i * 5 + 5;
        return d.y;
      })
      .attr("r", d => 1.4)
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
      .attr("xlink:href", "/wdl/wdl/node.svg")
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

      d.inputParams &&
        d.inputParams.forEach(input => {
          const { link, path } = input;
          if (link && path) {
            link.target(() => [x + input.x, y + input.y]);
            path.attr("d", input.link());
          }
        });

      d.outputParams &&
        d.outputParams.forEach(output => {
          output.path.forEach(p => {
            const { path, link } = p;
            link.source(() => [x + output.x, y + output.y]);
            path.attr("d", output.link());
          });
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
    let path,
      linkHorizontal,
      parentData,
      linkdata = { target: [], source: [] };

    function toRadial(p) {
      const angle = (p.x / 180) * Math.PI;
      const radius = p.y;
      return {
        angle: angle,
        radius: radius
      };
    }

    function dragstarted(event, d) {
      parentData = data.find(pd => pd.id === d.pid);
      const x = event.x + parentData.x;
      const y = event.y + parentData.y;
      linkdata.source = toRadial({ x: 2, y: 10 });
      selection
        .append(`path`)
        .attr("class", `path-${parentData.id}`)
        .data([linkdata])
        .attr(
          "d",
          d3
            .linkRadial()
            .angle(d => {
              return d.angle;
            })
            .radius(d => d.radius)
        );

      // linkHorizontal = d3.linkRadial();
      // parentData = data.find(pd => pd.id === d.pid);
      // path = selection.append("path").attr("class", `path-${parentData.id}`);

      // const x = event.x + parentData.x;
      // const y = event.y + parentData.y;
      // const angle = Math.atan2(y, x) + Math.PI / 2;
      // const radius = Math.sqrt(x ** 2 + y ** 2);
      // linkHorizontal.source(function () {
      //   return [x, y];
      // });

      // d.link = linkHorizontal;
      // linkHorizontal
      //   .angle(function (d) {
      //     return Math.atan2(d.y, d.x) + Math.PI / 2;
      //   })
      //   .radius(function (d) {
      //     return Math.sqrt(d.x ** 2 + d.y ** 2);
      //   });
    }
    function dragged(event) {
      const x = event.x + parentData.x;
      const y = event.y + parentData.y;
      linkdata.target = toRadial({ x, y });
      selection
        .select(`path.path-${parentData.id}`)
        .data([linkdata])
        .attr(
          "d",
          d3
            .linkRadial()
            .angle(d => {
              return d.angle;
            })
            .radius(d => d.radius)
        );

      // linkHorizontal.target(function () {
      //   return [x, y];
      // });
      // linkHorizontal
      //   .angle(function (d) {
      //     return Math.atan2(d.y, d.x) + Math.PI / 2;
      //   })
      //   .radius(function (d) {
      //     return Math.sqrt(d.x ** 2 + d.y ** 2);
      //   });
      // path
      //   .attr("stroke", "black")
      //   .attr("fill", "none")
      //   .attr("d", linkHorizontal);
    }
    function dragended(event, d) {
      const x = event.x + parentData.x;
      const y = event.y + parentData.y;
      const dragNodeType = d3.select(this).attr("class");
      let flag = false;
      let findNode = null;
      let findInput = null;

      d3.selectAll(".node-g").each(function (gd) {
        d3.select(this)
          .selectAll("circle")
          .each(function (cd) {
            const scx = gd.x + cd.x - 1.4;
            const ecx = gd.x + cd.x + 1.4;
            const scy = gd.y + cd.y - 1.4;
            const ecy = gd.y + cd.y + 1.4;
            if (x >= scx && x <= ecx && y >= scy && y <= ecy) {
              const type = d3.select(this).attr("class");
              if (dragNodeType !== type) {
                flag = true;
                findNode = gd;
                findInput = cd;
                cd.path = path;
                cd.link = linkHorizontal;
              }
            }
          });
      });
      if (!flag) {
        path.remove();
      } else {
        if (!d.path) d.path = [];
        d.path.push({ path, link: linkHorizontal });
        dispatch.call("link", null, {
          source: d,
          target: findNode,
          targetInput: findInput
        });
        path.lower();
      }
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  ins.on = function () {
    const value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? ins : value;
  };

  return ins;
}
