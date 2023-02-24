import { select, zoomIdentity, zoomTransform } from "d3";
import Generator from "../wdlGenerator";
import ZoomIn from "../assets/zoom-in.svg";
import ZoomOut from "../assets/zoom-out.svg";
import ZoomReset from "../assets/zoom-reset.svg";

export default function (zoom) {
  const generator = Generator.create();
  const container = document.createElement("div");
  container.className = "action-buttons";
  setTimeout(() => {
    select(container)
      .append("img")
      .attr("src", ZoomIn)
      .attr("width", 24)
      .attr("height", 24)
      .on("click", () => {
        const transform = zoomTransform(select(".svg-box").node());
        if (transform.k < 15) zoom.scaleTo(select(".svg-box"), transform.k + 1);
        // console.log(transform.k);
        // transform.scale(transform.k + 1);
        // const str = generator.generate();
        // console.log(str);
      });
    select(container)
      .append("img")
      .attr("src", ZoomOut)
      .attr("width", 24)
      .attr("height", 24)
      .on("click", () => {
        const transform = zoomTransform(select(".svg-box").node());
        if (transform.k > 1) zoom.scaleTo(select(".svg-box"), transform.k - 1);
        // const str = generator.generate();
        // console.log(str);
      });
    select(container)
      .append("img")
      .attr("src", ZoomReset)
      .attr("width", 24)
      .attr("height", 24)
      .on("click", () => {
        select(".svg-box")
          .transition()
          .duration(750)
          .call(zoom.transform, zoomIdentity);
        // const str = generator.generate();
        // console.log(str);
      });
    select(container)
      .append("img")
      .attr("src", ZoomReset)
      .attr("width", 24)
      .attr("height", 24)
      .on("click", () => {
        const str = generator.generate();
        console.log(str);
      });
  }, 0);

  return container;
}
