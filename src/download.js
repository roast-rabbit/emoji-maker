import {
  canvas,
  setLayerData,
  showCurrentLayerInfo,
  showSelectionOnLayerInfoList,
} from "./index.js";
import axios from "axios";
import loadSVGs from "./loadSVGs.js";
import { updateHistory } from "./undo.js";

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
  canvas.loadFromJSON(jsonData, () => {
    canvas.renderAll();
    setLayerData();
    showCurrentLayerInfo();
    showSelectionOnLayerInfoList();
    updateHistory();
  });
}

export async function readData(id) {
  return fetch(`./maker-${id}-data.json`)
    .then((res) => {
      if (res.status === 404) {
        throw new Error("file not found");
      }
      return res.json();
    })
    .then((data) => {
      renderCanvasFromJson(data);
    })
    .catch((err) => {
      loadSVGs(canvas);
    });
}

// readData();
