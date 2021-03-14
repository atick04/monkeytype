import * as ThemeColors from "./theme-colors";
import * as ChartController from "./chart-controller";
import * as Misc from "./misc";
import * as Notifications from "./notification-center";

let isPreviewingTheme = false;
let randomTheme = null;
//TODO remove current theme and customcolors once config is a module
let currentTheme = "serika_dark";
let customColors = [
  "#323437",
  "#e2b714",
  "#e2b714",
  "#646669",
  "#d1d0c5",
  "#ca4754",
  "#7e2a33",
  "#ca4754",
  "#7e2a33",
];
export const colorVars = [
  "--bg-color",
  "--main-color",
  "--caret-color",
  "--sub-color",
  "--text-color",
  "--error-color",
  "--error-extra-color",
  "--colorful-error-color",
  "--colorful-error-extra-color",
];

export function apply(themeName) {
  clearCustomTheme();

  let name = "serika_dark";
  if (themeName !== "custom") {
    name = themeName;
  }

  $(".keymap-key").attr("style", "");
  $("#currentTheme").attr("href", `themes/${name}.css`);
  $(".current-theme").text(themeName.replace("_", " "));

  if (themeName === "custom") {
    colorVars.forEach((e, index) => {
      document.documentElement.style.setProperty(e, customColors[index]);
    });
  }

  try {
    firebase.analytics().logEvent("changedTheme", {
      theme: themeName,
    });
  } catch (e) {
    console.log("Analytics unavailable");
  }
  setTimeout(() => {
    $(".keymap-key").attr("style", "");
    ChartController.updateAllChartColors();
    updateFavicon(32, 14);
    $("#metaThemeColor").attr("content", ThemeColors.main);
  }, 500);
}

export function preview(themeName) {
  isPreviewingTheme = true;
  apply(themeName);
}

export function set(themeName) {
  currentTheme = themeName;
  apply(themeName);
}

export function clearPreview() {
  if (isPreviewingTheme) {
    isPreviewingTheme = false;
    apply(currentTheme);
  }
}

export function setCustomColors(colors) {
  customColors = colors;
}

//TODO remove config once config is a module
export function randomiseTheme(config) {
  var randomList;
  Misc.getThemesList().then((themes) => {
    randomList = themes.map((t) => {
      return t.name;
    });

    if (config.randomTheme === "fav" && config.favThemes.length > 0)
      randomList = config.favThemes;
    randomTheme = randomList[Math.floor(Math.random() * randomList.length)];
    preview(randomTheme);
    Notifications.add(randomTheme.replace(/_/g, " "), 0);
  });
}

export function clearRandom() {
  randomTheme = null;
}

function updateFavicon(size, curveSize) {
  let maincolor, bgcolor;

  bgcolor = ThemeColors.bg;
  maincolor = ThemeColors.main;

  if (bgcolor == maincolor) {
    bgcolor = "#111";
    maincolor = "#eee";
  }

  var canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  let ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(0, curveSize);
  //top left
  ctx.quadraticCurveTo(0, 0, curveSize, 0);
  ctx.lineTo(size - curveSize, 0);
  //top right
  ctx.quadraticCurveTo(size, 0, size, curveSize);
  ctx.lineTo(size, size - curveSize);
  ctx.quadraticCurveTo(size, size, size - curveSize, size);
  ctx.lineTo(curveSize, size);
  ctx.quadraticCurveTo(0, size, 0, size - curveSize);
  ctx.fillStyle = bgcolor;
  ctx.fill();
  ctx.font = "900 " + (size / 2) * 1.2 + "px Roboto Mono";
  ctx.textAlign = "center";
  ctx.fillStyle = maincolor;
  ctx.fillText("mt", size / 2 + size / 32, (size / 3) * 2.1);
  $("#favicon").attr("href", canvas.toDataURL("image/png"));
}

function clearCustomTheme() {
  colorVars.forEach((e) => {
    document.documentElement.style.setProperty(e, "");
  });
}