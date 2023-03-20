import { canvas } from "./index.js";
import axios from "axios";

function savePng(uri, name) {
  const link = document.createElement("a");

  link.download = name;

  link.href = uri;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}

function saveSvg(filedata, name = "my_svg") {
  const svgFile = new Blob([filedata], { type: "image/svg+xml;charset=utf-8" });

  const svgFileSrc = URL.createObjectURL(svgFile); //mylocfile);

  const dwn = document.createElement("a");

  dwn.href = svgFileSrc;

  dwn.download = name;

  document.body.appendChild(dwn);

  dwn.click();

  document.body.removeChild(dwn);
}

document.getElementById("to-png").addEventListener("click", () => {
  savePng(canvas.toDataURL(), "download");
});

document.getElementById("to-svg").addEventListener("click", () => {
  saveSvg(canvas.toSVG());
});

let jsonData;

document.getElementById("to-json").addEventListener("click", async (e) => {
  jsonData = JSON.stringify(canvas);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonData,
  };

  fetch("http://localhost:3001/maker", requestOptions).then((res) => {
    console.log(res.status);
  });
  return false;
});
document.querySelector("#render-canvas-from-json").addEventListener("click", () => {
  renderCanvasFromJson(jsonData);
});
function renderCanvasFromJson(jsonData) {
  canvas.clear();
  canvas.loadFromJSON(jsonData);
}

export function readData() {
  console.log(location);
  // const urlParams = new URLSearchParams(location.search);
  // console.log(urlParams);

  // const id = urlParams.get("id");
  const id = 5;

  fetch(`http://localhost:3001/maker/${id}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      renderCanvasFromJson(data);
    });
}

readData();
