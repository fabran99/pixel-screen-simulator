const gridContainer = document.getElementById("grid-container");
const colorSelector = document.getElementById("color-selector");
const saveDrawing = document.getElementById("save-drawing");
const cleanDrawing = document.getElementById("clean-drawing");
const runDrawing = document.getElementById("run-drawing");
// color buttons with the id white, red, blue, yellow and black
const whiteButton = document.getElementById("white");
const redButton = document.getElementById("red");
const blueButton = document.getElementById("blue");
const yellowButton = document.getElementById("yellow");
const blackButton = document.getElementById("black");
const greenButton = document.getElementById("green");

var drawingList = [];

const setColorBlack = (e) => {
  colorSelector.value = "#000000";
};
const setColorWhite = (e) => {
  colorSelector.value = "#ffffff";
};
const setColorRed = (e) => {
  colorSelector.value = "#ff2020";
};
const setColorBlue = (e) => {
  colorSelector.value = "#0b6dff";
};
const setColorYellow = (e) => {
  colorSelector.value = "#fffb19";
};
const setColorGreen = (e) => {
  colorSelector.value = "#33ff44";
};

// set event listener for all buttons
whiteButton.addEventListener("click", setColorWhite);
redButton.addEventListener("click", setColorRed);
blueButton.addEventListener("click", setColorBlue);
yellowButton.addEventListener("click", setColorYellow);
blackButton.addEventListener("click", setColorBlack);
greenButton.addEventListener("click", setColorGreen);

const body = document.querySelector("body");
const ROWS = 11;
const COLUMNS = 7;
var isMouseClicking = false;
var isDrawing = false;

// detect if mouse is clicked and change isMouseClicking to true or to false
body.addEventListener("mousedown", () => {
  isMouseClicking = true;
});
body.addEventListener("mouseup", () => {
  isMouseClicking = false;
});

cleanDrawing.addEventListener("click", () => {
  drawingList = [];
});

const setColorHover = (e) => {
  if (isDrawing) {
    return;
  }
  // set background color from current element equal to the value of colorSelector input
  if (!isMouseClicking) {
    return;
  }
  e.target.style.backgroundColor = colorSelector.value;
};

const setColor = (e) => {
  if (isDrawing) {
    return;
  }
  e.target.style.backgroundColor = colorSelector.value;
};

// gridContainer is a table element, add 8 rows and 8 columns to the table, numerating every cell
let celln = 0;
for (let i = 0; i < ROWS; i++) {
  let row = document.createElement("tr");
  for (let j = 0; j < COLUMNS; j++) {
    let cell = document.createElement("td");
    // add the id to the cell, with is the position of the cell in the grid from 0 to 63
    // add the id as text to the cell
    cell.id = celln;
    cell.innerText = celln;
    // when hovering in the cell, change the background color to the color of the colorSelector
    cell.addEventListener("mouseover", setColorHover);
    cell.addEventListener("click", setColor);
    cell.addEventListener("mousedown", setColor);
    // default background is black
    cell.style.backgroundColor = "rgb(0,0,0)";
    row.appendChild(cell);
    celln++;
  }
  gridContainer.appendChild(row);
}

const getDrawing = () => {
  let drawing = [];
  for (let i = 0; i < ROWS * COLUMNS; i++) {
    let cell = document.getElementById(i);
    let cellColor = cell.style.backgroundColor;
    // transform cellColor which can be a string like "black" to rgb in the format "r,g,b,a"
    let cellColorRgb = cellColor.match(/\d+/g).map((x) => parseInt(x));
    // transform cellColorRgb to a comma separated string
    let cellColorRgbString = cellColorRgb.join(",");
    drawing.push(cellColorRgbString);
  }
  return drawing;
};

// when clicking get drawing button, get the drawing and log to console
saveDrawing.addEventListener("click", () => {
  drawingList.push({
    duration: 0.5,
    drawing: getDrawing(),
  });
});

const draw = (drawing) => {
  for (let i = 0; i < drawing.length; i++) {
    let cell = document.getElementById(i);
    let cellColor = drawing[i];
    cell.style.backgroundColor = `rgb(${cellColor})`;
  }
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

runDrawing.addEventListener("click", async () => {
  isDrawing = true;
  //   iterate over drawinList and set the drawing to the grid, waiting the duration of the drawing
  // before setting the next drawing
  for (let i = 0; i < drawingList.length; i++) {
    let drawing = drawingList[i];
    draw(drawing.drawing);
    if (i !== drawingList.length - 1) {
      await sleep(drawing.duration * 1000);
    } else {
      isDrawing = false;
    }
  }
});
