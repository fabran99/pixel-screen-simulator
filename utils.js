const generateRainbow = (c1, c2, n, repeat = false) => {
  var myRainbow = new Rainbow();
  if (repeat) {
    myRainbow.setSpectrum(c1, c2, c1);
  } else {
    myRainbow.setSpectrum(c1, c2);
  }
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

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getRainbowMatrix = (colorList, horizontal) => {
  let matrix = [];
  for (let i = 0; i < ROWS; i++) {
    let currentRow = [];
    for (let j = 0; j < COLUMNS; j++) {
      currentRow.push(colorList[horizontal ? j : i]);
    }
    matrix.push(currentRow);
  }

  return matrix;
};
