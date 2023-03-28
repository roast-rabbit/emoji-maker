import { canvas, showCurrentLayerInfo } from "./index";
import { updateHistory } from "./undo.js";

const tabs = document.querySelectorAll(".tab");

// const secondaryTabs = document.querySelectorAll(".secondary-tab");

const tabContents = document.querySelectorAll(".tab-content");

let currentOpenningLabel = document.querySelector(".tab.active");

tabs.forEach((tab) => {
  tab.addEventListener("click", function () {
    document.querySelector("#text-active-icon").classList.add("hide");

    if (canvas.isDrawingMode === true) {
      document.querySelector("#doodle-active-icon").classList.add("hide");
      showCurrentLayerInfo(canvas.getObjects());
      canvas.isDrawingMode = false;
    }

    tabs.forEach((tab) => {
      if (tab) tab.classList.remove("active");
    });

    this.classList.add("active");

    currentOpenningLabel = this.dataset.label;

    tabContents.forEach((tabContent) => {
      tabContent.classList.remove("active");

      if (tabContent.dataset.label === currentOpenningLabel) {
        tabContent.classList.add("active");
      }
    });
  });
});

// const secondaryTabContents = document.querySelectorAll(".secondary-tab-content");
// secondaryTabs.forEach(function (secondaryTab) {
//   secondaryTab.addEventListener("click", () => {
//     secondaryTabs.forEach((secondaryTab) => {
//       secondaryTab.classList.remove("active");
//     });

//     secondaryTabContents.forEach((secondaryTabContent) => {
//       secondaryTabContent.classList.remove("active");
//       if (secondaryTabContent.dataset.label === secondaryTab.dataset.label) {
//         secondaryTabContent.classList.add("active");
//       }
//     });
//     secondaryTab.classList.add("active");
//   });
// });
