const gridContainer = document.getElementById("grid-container");
const colorSelector = document.getElementById("color-selector");
const saveDrawing = document.getElementById("save-drawing");
const cleanDrawing = document.getElementById("clean-drawing");
const runDrawing = document.getElementById("run-drawing");
const downloadAnimation = document.getElementById("download-animation");
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

const generateOptimizedDrawing = () => {
  let dList = drawingList.map((el) => el.drawing);
  let optimizedDrawing = "";
  let framesIndexes = [];

  dList.forEach((drawing, dIndex) => {
    let pixelsPerColor = [];
    let uniqueColors = [];
    // Get the unique colors that are not '0,0,0';
    for (let i = 0; i < drawing.length; i++) {
      let color = drawing[i];
      if (color !== "0,0,0" && uniqueColors.indexOf(color) === -1) {
        uniqueColors.push(color);
      }
    }

    uniqueColors.forEach((color) => {
      let currentColorPixels = [];
      drawing.forEach((cellColor, index) => {
        if (cellColor == color) {
          currentColorPixels.push(index);
        }
      });
      pixelsPerColor.push(currentColorPixels);
    });

    // generate a string for the optimized drawing for c++
    optimizedDrawing += `const uint8_t dc${dIndex}[${uniqueColors.length}][3] PROGMEM={`;
    uniqueColors.forEach((color, index) => {
      optimizedDrawing += `{${color}}`;
      // Add a comma if it is not the last color
      if (index !== uniqueColors.length - 1) {
        optimizedDrawing += ",";
      }
    });
    optimizedDrawing += `};`;
    let maxPixelsPerColor = 0;
    pixelsPerColor.forEach((pixels) => {
      if (pixels.length > maxPixelsPerColor) {
        maxPixelsPerColor = pixels.length;
      }
    });
    optimizedDrawing += `const uint8_t ppc${dIndex}[${uniqueColors.length}][${maxPixelsPerColor}] PROGMEM ={`;
    pixelsPerColor.forEach((pixels, index) => {
      // Add one to every pixel, to prevent 0
      optimizedDrawing += `{${pixels.map((p) => p + 1).join(",")}}`;
      // Add a comma if it is not the last color
      if (index !== pixelsPerColor.length - 1) {
        optimizedDrawing += ",";
      }
    });
    optimizedDrawing += `};`;

    // Add to frame indexes, an object with the number of unique colors and max pixels per color
    framesIndexes.push({
      colors: uniqueColors.length,
      maxPixels: maxPixelsPerColor,
    });
  });

  // add a function that runs the optimized drawing
  optimizedDrawing += `void runOptimizedDrawing(){`;
  dList.forEach((drawing, index) => {
    let currentFramesIndex = framesIndexes[index];
    // Clear the screen
    optimizedDrawing += `FastLED.clear();`;
    // loop over the colors
    optimizedDrawing += `for(uint8_t i=0;i<${currentFramesIndex.colors};i++){`;
    // loop over the pixels
    optimizedDrawing += `for(uint8_t j=0;j<${currentFramesIndex.maxPixels};j++){`;
    // if pixel is not 0, set the color
    optimizedDrawing += `if(pgm_read_byte(&ppc${index}[i][j])!=0){`;
    optimizedDrawing += `leds[pgm_read_byte(&ppc${index}[i][j])-1]=CRGB(pgm_read_byte(&dc${index}[i][0]),pgm_read_byte(&dc${index}[i][1]),pgm_read_byte(&dc${index}[i][2]));`;
    optimizedDrawing += `}`;
    optimizedDrawing += `}`;
    optimizedDrawing += `}`;
    // show pixels
    optimizedDrawing += `FastLED.show();`;
    // wait for a while
    optimizedDrawing += `delay(100);`;
  });
  optimizedDrawing += `}`;

  return optimizedDrawing;
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

const drawRainbow = async (
  color1,
  color2,
  direction,
  repetitions,
  randomizeDark
) => {
  let colorNumber = ["l", "r"].indexOf(direction) != -1 ? COLUMNS : ROWS;
  let animation = [];

  let rainbow = generateRainbow(color1, color2, colorNumber, true);
  let colorList = [];
  for (let i = 0; i < colorNumber; i++) {
    colorList.push(hexToRgb("#" + rainbow.colourAt(i)));
  }
  // colorList.push("rgb(0,0,0)");

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

  return animation;
};

const runRainbows = async () => {
  // let animation1 = await drawRainbow("#f5520c", "#f5e50c", "d", 2, true);
  // console.log(animation1);
  let animation2 = await drawRainbow("#f5520c", "#f5e50c", "r", 1, true);
  return animation2;
};
let frames = null;
// runRainbows().then((res) => {
//   let parsedFrames = [];
//   res.forEach((frame) => {
//     parsedFrames.push([frame.map((x) => x.split(",").map((y) => parseInt(y)))]);
//   });
//   // get the first 5 frames
//   parsedFrames.slice(0, 5).forEach((frame) => {
//     let f = JSON.stringify(frame).replace(/\[/g, "{").replace(/\]/g, "}");
//     console.log(f);
//   });
//   console.log(parsedFrames.length);
// });

const drawNumber = (number, hourPosition, colorPallete, randomizeDark) => {
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
        if (randomizeDark && Math.random() < 0.7) {
          let current_color = colorPallete[rowStart + i][colStart + j];
          cell.style.backgroundColor = hexToRgb(
            shadeColor(rgbToHex(current_color), -15)
          );
        } else {
          cell.style.backgroundColor = colorPallete[rowStart + i][colStart + j];
        }
      }
    }
  }
};

const animateNumbers = async (horizontal = false, direction = "right") => {
  // let horizontal = false;
  // let direction = "right";
  let colorList = [];
  let rainbow = generateRainbow("#f5520c", "#f5e50c", COLUMNS, true);
  // let rainbow = generateRainbow("#0fbfff", "#0fbfff", COLUMNS, true);
  for (let i = 0; i < ROWS; i++) {
    colorList.push(hexToRgb("#" + rainbow.colourAt(i)));
  }

  let colorPallete = getRainbowMatrix(colorList, horizontal);
  let prevDate = new Date();
  let prevHourDigits = [
    Math.floor(prevDate.getHours() / 10),
    prevDate.getHours() % 10,
  ];
  let prevMinuteDigits = [
    Math.floor(prevDate.getMinutes() / 10),
    prevDate.getMinutes() % 10,
  ];
  while (true) {
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    // separate hours and minutes in digits
    let hourDigits = [Math.floor(hour / 10), hour % 10];
    let minuteDigits = [Math.floor(minute / 10), minute % 10];
    // if any of the digits changed, paint each cell with black
    if (
      hourDigits[0] != prevHourDigits[0] ||
      hourDigits[1] != prevHourDigits[1] ||
      minuteDigits[0] != prevMinuteDigits[0] ||
      minuteDigits[1] != prevMinuteDigits[1]
    ) {
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
          let cell = document.getElementById(i * COLUMNS + j);
          cell.style.backgroundColor = "rgb(0,0,0)";
        }
      }

      // update previous digits
      prevHourDigits = hourDigits;
      prevMinuteDigits = minuteDigits;
    }
    // log the seconds
    console.log(date.getSeconds());

    drawNumber(hourDigits[0], hourPositions["hour_ten"], colorPallete, true);
    drawNumber(hourDigits[1], hourPositions["hour_unit"], colorPallete, true);
    drawNumber(
      minuteDigits[0],
      hourPositions["minute_ten"],
      colorPallete,
      true
    );
    drawNumber(
      minuteDigits[1],
      hourPositions["minute_unit"],
      colorPallete,
      true
    );
    moveColorList(colorList, direction);
    colorPallete = getRainbowMatrix(colorList, horizontal);
    await sleep(100);
  }
};

// when clicking downloadAnimation, download a txt with the content of generateOptimizedDrawing()

downloadAnimation.addEventListener("click", () => {
  // ask for the name of the file
  let fileName = prompt("Enter the name of the file");
  let animation = generateOptimizedDrawing();
  let blob = new Blob([animation], { type: "text/plain" });
  let url = window.URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  // a.download = "animation.txt";
  a.download = fileName + ".txt";
  a.click();
});
