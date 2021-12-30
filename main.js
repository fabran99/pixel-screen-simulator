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
    duration: 0.1,
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

const numberPositions = [
  [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  [
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
  ],
  [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
];

const hourPositions = {
  hour_ten: [0, 0],
  hour_unit: [0, 4],
  minute_ten: [6, 0],
  minute_unit: [6, 4],
};

const drawNumber = (number, hourPosition) => {
  let rowStart = hourPosition[0];
  let colStart = hourPosition[1];
  let currentNumberPosition = numberPositions[number];
  for (let i = 0; i < currentNumberPosition.length; i++) {
    let row = currentNumberPosition[i];
    for (let j = 0; j < row.length; j++) {
      let cell = document.getElementById(
        (rowStart + i) * COLUMNS + colStart + j
      );
      if (row[j] === 1) {
        cell.style.backgroundColor = colorSelector.value;
      }
    }
  }
};

// drawNumber(2, hourPositions["hour_ten"]);
// drawNumber(9, hourPositions["hour_unit"]);
// drawNumber(3, hourPositions["minute_ten"]);
// drawNumber(2, hourPositions["minute_unit"]);
const rainbow1 = () => {
  var myRainbow = new Rainbow();
  myRainbow.setSpectrum("#f5520c", "#f5e50c");
  myRainbow.setNumberRange(0, ROWS);
  return myRainbow;
};

const generateRainbow = (c1, c2, n) => {
  var myRainbow = new Rainbow();
  myRainbow.setSpectrum(c1, c2);
  myRainbow.setNumberRange(0, n);
  return myRainbow;
};

// convert hex color to rgb, return a string in the format rgb(r,g,b)
const hexToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgb(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(
        result[3],
        16
      )})`
    : null;
};

const rgbToHex = (rgb) => {
  let components = rgb.match(/\d+/g).map((x) => parseInt(x));
  let r = components[0];
  let g = components[1];
  let b = components[2];
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

const moveColorList = (colorList, direction) => {
  // if direction is right, put the last color in the first position and move the others to the right
  // if direction is left, put the first color in the last position and move the others to the left
  if (direction === "right") {
    colorList.unshift(colorList.pop());
  } else {
    colorList.push(colorList.shift());
  }
};

const shadeColor = (col, amt) => {
  col = col.replace(/^#/, "");
  if (col.length === 3)
    col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];

  let [r, g, b] = col.match(/.{2}/g);
  [r, g, b] = [
    parseInt(r, 16) + amt,
    parseInt(g, 16) + amt,
    parseInt(b, 16) + amt,
  ];

  r = Math.max(Math.min(255, r), 0).toString(16);
  g = Math.max(Math.min(255, g), 0).toString(16);
  b = Math.max(Math.min(255, b), 0).toString(16);

  const rr = (r.length < 2 ? "0" : "") + r;
  const gg = (g.length < 2 ? "0" : "") + g;
  const bb = (b.length < 2 ? "0" : "") + b;

  return `#${rr}${gg}${bb}`;
};

const drawRainbow = async (
  color1,
  color2,
  direction,
  repetitions,
  randomizeDark
) => {
  let colorNumber = ["l", "r"].indexOf(direction) != -1 ? COLUMNS : ROWS;
  let animation = [];

  let rainbow = generateRainbow(color1, color2, colorNumber);
  let colorList = [];
  for (let i = 0; i < colorNumber; i++) {
    colorList.push(hexToRgb("#" + rainbow.colourAt(i)));
  }
  colorList.push("rgb(0,0,0)");

  let = currentIndex = 0;
  let = currentRepetition = 0;

  const applyCurrentColor = () => {
    let firstPosName = ["l", "r"].indexOf(direction) != -1 ? "COLUMNS" : "ROWS";
    let secondPosName =
      ["l", "r"].indexOf(direction) != -1 ? "ROWS" : "COLUMNS";
    let firstPos = firstPosName == "COLUMNS" ? COLUMNS : ROWS;
    let secondPos = secondPosName == "COLUMNS" ? COLUMNS : ROWS;

    for (let i = 0; i < firstPos; i++) {
      // change background color of each cell to the color of the rainbow
      for (let j = 0; j < secondPos; j++) {
        let cellNumber =
          firstPosName == "ROWS" ? i * COLUMNS + j : i + j * COLUMNS;
        let cell = document.getElementById(cellNumber);
        if (Math.random() < 0.7 || !randomizeDark) {
          cell.style.backgroundColor = colorList[i];
        } else {
          let darkenColor = hexToRgb(shadeColor(rgbToHex(colorList[i]), -35));
          cell.style.backgroundColor = darkenColor;
        }
      }
    }
    moveColorList(
      colorList,
      ["r", "u"].indexOf(direction) != -1 ? "left" : "right"
    );
    if (currentRepetition == 0) {
      animation.push(getDrawing());
    }
    if (currentIndex >= colorList.length) {
      currentIndex = 0;
      currentRepetition++;
    }
    currentIndex++;
  };

  while (repetitions == 0 || currentRepetition < repetitions) {
    applyCurrentColor();
    await sleep(100);
  }

  // if (repetitions === -1) {
  //   while (true) {
  //     applyCurrentColor();

  //     // wait for 1 second
  //     await sleep(100);
  //   }
  // } else {

  // }
  return animation;
};

const runRainbows = async () => {
  let animation1 = await drawRainbow("#f5520c", "#f5e50c", "d", 2, true);
  console.log(animation1);
  let animation2 = await drawRainbow("#0fff8b", "#0fbfff", "r", 0, true);
  console.log(animation2);
};

runRainbows();
