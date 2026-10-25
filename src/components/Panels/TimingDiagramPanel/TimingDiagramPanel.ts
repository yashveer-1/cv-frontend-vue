import { timingDiagramButtonActions } from "#/simulator/src/plotArea";
import _plotArea from "#/simulator/src/plotArea";
import { toRefs } from "vue";
import { useTimingDiagramPanelStore } from "#/store/timingDiagramPanelStore";

interface PlotArea {
  resize: () => void;
  [key: string]: () => void;
}

export const plotArea: PlotArea = _plotArea;

export function handleButtonClick(button: string) {
  const timingDiagramPanelStore = toRefs(useTimingDiagramPanelStore());
  const plotElement =
    timingDiagramPanelStore.plotRef.value ||
    (typeof document !== "undefined" ? document.getElementById("plot") : null);

  if (button === "smaller") {
    if (plotElement) {
      plotElement.style.width = `${Math.max(
        plotElement.offsetWidth - 20,
        560,
      )}px`;
    }
    plotArea.resize();
  } else if (button === "larger") {
    if (plotElement) {
      plotElement.style.width = `${plotElement.offsetWidth + 20}px`;
    }
    plotArea.resize();
  } else if (button === "smallHeight") {
    timingDiagramButtonActions.smallHeight();
    plotArea.resize();
  } else if (button === "largeHeight") {
    timingDiagramButtonActions.largeHeight();
    plotArea.resize();
  } else if (button === "reset") {
    if (plotElement) {
      plotElement.style.width = "";
      plotElement.style.height = "";
    }
    // Force resize to detect change after plotHeight resets
    _plotArea.height = 0;
    _plotArea.width = 0;
    plotArea.reset();
  } else {
    plotArea[button]();
  }
}

export function handleUnitsChange(event: Event) {
  const inputElem = event.target as HTMLInputElement;
  const timeUnits = parseInt(inputElem.value, 10);
  if (Number.isNaN(timeUnits) || timeUnits < 1) return;
  plotArea.cycleUnit = timeUnits;
}
