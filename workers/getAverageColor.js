onmessage = (e) => {
    const colors = {};
    const { originalImageData, numberOfTileX, numberOfTileY, tile } = e.data;
    for (let i = 0; i < numberOfTileY; i++) {
        const rowData = [];
        const originalRowData = getTilesByRow(originalImageData, i, tile, numberOfTileX);
        for (let j = 0; j < numberOfTileX; j++) {
            const originalTileData = getTileDataInRow(originalRowData, j, tile, numberOfTileX);
            const hexColor = getTileAverageColor(originalTileData);
            rowData.push(hexColor);
        }
        colors[i] = rowData;
    }
    postMessage(colors);
}
const getTilesByRow = (originalImageData, row, tile, numberOfTileX) => {
    return originalImageData.slice(
      row * numberOfTileX * tile.width * tile.height * 4,
      (row + 1) * numberOfTileX * tile.width * tile.height * 4
    );
}
const getTileDataInRow = (row, index, tile, numberOfTileX) => {
    let tileData = [];
    for (let i = 0; i < tile.height; i++) {
      const pxRow = row.slice(
        4 * index * tile.width + numberOfTileX * tile.width * 4 * i,
        4 * index * tile.width + numberOfTileX * tile.width * 4 * i + tile.width * 4
      )
      tileData = [...tileData, ...pxRow];
    }
    return tileData;
}
const getTileAverageColor = (tileColorData) => {
    const length = tileColorData.length;
    const numberOfPixel = length / 4;
    let r = 0,
      g = 0,
      b = 0;
    for (let i = 0; i < length; i += 4) {
      r += tileColorData[i];
      g += tileColorData[i + 1];
      b += tileColorData[i + 2];
    }
    r = Math.floor(r / numberOfPixel);
    g = Math.floor(g / numberOfPixel);
    b = Math.floor(b / numberOfPixel);
    return rgbToHex(r, g, b);
}
const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
const rgbToHex = (r, g, b) => {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}
