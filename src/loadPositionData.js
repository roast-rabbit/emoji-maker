import loadSingleSVG from "./loadSingleSVG.js";
import { renderAssetMenu } from "./renderAssetMenu.js";

export const loadPositionData = async function (positionData, canvas) {
  const res = await fetch("./positionData.json");
  positionData = await res.json();
  renderAssetMenu(positionData);

  // attach event listeners to each button
  const buttons = document.querySelectorAll("button.shape");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      loadSingleSVG(this.dataset.name, canvas, positionData);
    });
  });
};
