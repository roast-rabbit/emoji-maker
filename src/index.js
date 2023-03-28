import addDeleteControl from "./addDeleteControl.js";
import alterRotationControl from "./alterRotationControl.js";
import canvasOperations from "./canvasOperations.js";
import loadSVGs from "./loadSVGs.js";
import { loadPositionData } from "./loadPositionData.js";

import alterScaleControl from "./alterScaleControl.js";
import { makeListItemsDraggable } from "./dragDrop.js";
import { updateHistory, undo, redo } from "./undo.js";
import { fabric } from "fabric";
import "./text.js";

import "./css/styles.css";

import LazyLoad from "vanilla-lazyload";

import { currentMode, modes } from "./drawing.js";
import "./toggleTab.js";
import * as DownloadModule from "./download.js";
import "fabric-history";
import { renderAssetMenu } from "./renderAssetMenu.js";

// 初始化 懒加载
// const lazyContent = new LazyLoad();

// 初始化canvas
const initCanvas = (id) => {
  return new fabric.Canvas(id, {
    width: 300,
    height: 300,
    selection: false,
    selectionBorderColor: "#ddd",
    preserveObjectStacking: true,
    backgroundColor: "#666a82",
  });
};

export let canvas = initCanvas("c");

canvas.setBackgroundColor(null, canvas.renderAll.bind(canvas));

addDeleteControl();
alterRotationControl(canvas);
alterScaleControl(canvas);

// 获取 URL 上面的参数
let params = new URL(document.location).searchParams;
let id = params.get("id");

if (id) {
  id = parseInt(id);
  updateHistory();
  DownloadModule.readData(id);
} else {
  loadSVGs(canvas);
}

export function updateCanvas(newLayerData) {
  canvas.remove(...canvas.getObjects());

  newLayerData.forEach((layer) => {
    canvas.add(layer);
  });
  updateHistory();
}

// positionData 读取的是positionData.json 里面的数据
let positionData;

loadPositionData(positionData, canvas);

// layerData is a global object keeping track when all the layer info changes
export let layerData;

export function setLayerData(newLayerData, newOrder = [0]) {
  // 顺序变化
  if (!newLayerData) {
    const currentObjects = canvas.getObjects();
    const objectsToSet = newOrder.map((index) => {
      return currentObjects[index];
    });
    layerData = objectsToSet;
  } else {
    // layer data changes
    layerData = canvas.getObjects();
  }
}

// 在 document 上监听 "keydown"事件，在canvas上删除被激活的对象
document.addEventListener("keydown", function (event) {
  const { key } = event;
  if (key === "Backspace") {
    if (!canvas.getActiveObject()?.text) {
      removeActiveObject();
    }
  }
});

export function showCurrentLayerInfo(layerData, newOrder) {
  const layerList = document.querySelector("#layer-list");
  layerList.innerHTML = "";
  const obejcts = layerData ? layerData : canvas.getObjects();
  if (obejcts[0] === undefined) {
    return;
  }
  obejcts.forEach((obejct, index) => {
    layerList.insertAdjacentHTML(
      "afterbegin",
      `<li style="display: flex; justify-content: space-between;height:42px; align-items: center;" data-index=${
        newOrder?.[index] || index
      } class="draggable p-s" draggable="true">
          <div style="display:flex; align-items: center">
            <div class="mr_2"><img src="${obejct.toDataURL()}"/></div>
            <div  class="small text_gray">Layer ${obejcts.length - index}</div>
          </div>
            <img data-label="delete" src="data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E">
      </li>`
    );
  });
  makeListItemsDraggable();
}

document.querySelector("#container ul").addEventListener("click", (e) => {
  if (e.target.dataset.label === "delete") {
    const index = e.target.closest("li").dataset.index;
    deleteLayerByIndex(index);
  }
});

export function deleteLayerByIndex(index) {
  canvas.remove(canvas.getObjects()[index]);
  updateHistory();
  canvas.renderAll();

  setLayerData(canvas.getObjects());
  showCurrentLayerInfo(layerData);
}
export function removeActiveObject() {
  canvas.remove(canvas.getActiveObject());
  showCurrentLayerInfo();
}

document.querySelector("#clear-all").addEventListener("click", () => {
  canvas.remove(...canvas.getObjects());
  setLayerData();
  showCurrentLayerInfo(layerData);
});

document.getElementById("undo").addEventListener("click", () => {
  canvas.clear();
  undo();
});

document.querySelector("#redo").addEventListener("click", () => {
  redo();
});

export function getCurrentOrder() {
  const layers = document.querySelectorAll("li");
  if (layers.length !== 0) {
    return [...layers].map((layer) => {
      return layer.dataset.index;
    });
  } else {
    return [0];
  }
}

function onObjectSelected(e) {
  showSelectionOnLayerInfoList();
}

export function showSelectionOnLayerInfoList() {
  const selectedObject = canvas.getActiveObject();
  const selectedObjectIndex = canvas.getObjects().indexOf(selectedObject);

  const layerInfoList = document.querySelectorAll("#container li");
  layerInfoList.forEach((item) => {
    item.classList.remove("active");
  });

  if (selectedObjectIndex < 0) return;
  [...layerInfoList].reverse()[selectedObjectIndex].classList.add("active");
}
canvas.on("selection:created", onObjectSelected);
canvas.on("selection:updated", onObjectSelected);

// 画画时，每画一笔就更新一次历史数据
canvas.on("path:created", () => {
  updateHistory();
});

canvas.on("object:modified", () => {
  setLayerData(canvas.getObjects());
  showCurrentLayerInfo();
  showSelectionOnLayerInfoList();
  updateHistory();
});

export function setActiveObjectOnCanvas(indexToSet) {
  canvas.setActiveObject(canvas.item(indexToSet));
  canvas.renderAll();
}

document.querySelector("#container ul").addEventListener("click", (e) => {
  const selectedLayer = e.target.closest("li");
  const selectedLayerIndex = selectedLayer.dataset.index;
  setActiveObjectOnCanvas(selectedLayerIndex);
});
