import {
  canvas,
  setLayerData,
  showCurrentLayerInfo,
  showSelectionOnLayerInfoList,
} from "./index.js";
import axios from "axios";
import loadSVGs from "./loadSVGs.js";
import { updateHistory } from "./undo.js";
import { setCustomObjectBorders } from "./undo.js";

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
var save_status = 2;
document.getElementById("to-json").addEventListener("click", async (e) => {
  if (save_status < 2) {
    return false;
  }
  document.querySelector("#to-json .downloading").classList.remove("hide");

  save_status = 1;
  jsonData = JSON.stringify({ data: canvas });

  console.log(jsonData);

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonData,
  };

  fetch("/en/maker-save", requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      document.querySelector("#to-json .downloading").classList.add("hide");
      if (data.code != 200) {
        toast(data.msg);
      }
      save_status = 2;
    })
    .catch((err) => {
      document.querySelector("#to-json .downloading").classList.add("hide");
      toast("error");
      save_status = 2;
    });
  return false;
});

function toast(text) {
  document.querySelector(".toast-body p").textContent = text;
  document.querySelector(".toast").classList.remove("off");
  document.querySelector(".toast").classList.add("on");

  setTimeout(() => {
    document.querySelector(".toast-body p").textContent = "";
    document.querySelector(".toast").classList.remove("on");
    document.querySelector(".toast").classList.add("off");
  }, 2000);
}

// document.querySelector("#render-canvas-from-json").addEventListener("click", () => {
//   renderCanvasFromJson(jsonData);
// });
function renderCanvasFromJson(jsonData) {
  canvas.clear();
  canvas.loadFromJSON(jsonData, () => {
    canvas.renderAll();
    setCustomObjectBorders();

    setLayerData();
    showCurrentLayerInfo();
    showSelectionOnLayerInfoList();
    updateHistory();
  });
}

// var t = id.slice(6);

export async function readData(id, date) {
  return fetch(`/maker/${date}/maker-${id}-data.json`)
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
