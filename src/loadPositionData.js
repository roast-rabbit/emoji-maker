import loadSingleSVG from "./loadSingleSVG.js";
import { renderAssetMenu } from "./renderAssetMenu.js";

export const loadPositionData = async function (canvas) {
  const [PositionDataRes, iconsRes] = await Promise.all([
    fetch("./positionData.json"),
    fetch("./icons.json"),
  ]);
  const [positionData, iconsData] = await Promise.all([PositionDataRes.json(), iconsRes.json()]);

  renderAssetMenu(positionData, iconsData);

  // attach event listeners to each button
  const buttons = document.querySelectorAll("button.shape");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      loadSingleSVG(this.dataset.name, canvas, positionData);
    });
  });
};
