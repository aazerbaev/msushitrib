const gridSize = { cols: 60, rows: 20 };
const tileSize = 24;
const text = "MSUSHI";
const grid = document.getElementById("grid");

grid.style.gridTemplateColumns = `repeat(${gridSize.cols}, ${tileSize}px)`;
grid.style.gridTemplateRows = `repeat(${gridSize.rows}, ${tileSize}px)`;

let tiles = [];
let invert = false;

for (let y = 0; y < gridSize.rows; y++) {
    for (let x = 0; x < gridSize.cols; x++) {
        const tile = document.createElement("div");
        tile.classList.add("flipped");
        tile.classList.add("tile");
        tile.dataset.x = x;
        tile.dataset.y = y;
        grid.appendChild(tile);
        tiles.push(tile);
    }
}

function getTextPixelMap(text, width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${Math.floor(height * 0.8)}px monospace`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);

    const imageData = ctx.getImageData(0, 0, width, height).data;
    const map = [];

    for (let y = 0; y < height; y++) {
        let row = [];
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const brightness = imageData[i] + imageData[i + 1] + imageData[i + 2];
            row.push(brightness < 300 ? 1 : 0);
        }
        map.push(row);
    }

    return map;
}

function applyMap(map, invert = false) {
    for (let y = 0; y < gridSize.rows; y++) {
        for (let x = 0; x < gridSize.cols; x++) {
            const tile = tiles[y * gridSize.cols + x];
            const isText = map[y] && map[y][x];

            setTimeout(() => {
                tile.classList.toggle("flipped");

                if (invert) {
                    if (!isText) {
                        tile.classList.add("black");
                    } else {
                        tile.classList.remove("black");
                    }
                } else {
                    if (isText) {
                        tile.classList.add("black");
                    } else {
                        tile.classList.remove("black");
                    }
                }
            }, (x + y) * 20);
        }
    }
}

const map = getTextPixelMap(text, gridSize.cols, gridSize.rows);
setTimeout(() => {
    setTimeout(flipLoop, 500);
}, 500);

function flipLoop() {
    applyMap(map, invert);
    invert = !invert;
    setTimeout(flipLoop, 3000);
}
