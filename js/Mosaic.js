"use strict";
class Mosaic {
  constructor(tile = { width: 20, height: 20 }) {
    this.tile = tile;
  }
  createMosaic(originalImage) {
    const { context, width, height } = originalImage;
    const originalImageData = context.getImageData(0, 0, width, height).data;
    this.numberOfTileX = Math.floor(width / this.tile.width);
    this.numberOfTileY = Math.floor(height / this.tile.height);
    const colors = {};
    for (let i = 0; i < this.numberOfTileY; i++) {
        const rowData = [];
        const originalRowData = this.getTilesByRow(originalImageData, i);
        for (let j = 0; j < this.numberOfTileX; j++) {
            const originalTileData = this.getTileDataInRow(originalRowData, j);
            const hexColor = this.getTileAverageColor(originalTileData);
            rowData.push(hexColor);
        }
        colors[i] = rowData;
    }
    return colors;
  }
  getTilesByRow(originalImageData, row) {
    return originalImageData.slice(
      row * this.numberOfTileX * this.tile.width * this.tile.height * 4,
      (row + 1) * this.numberOfTileX * this.tile.width * this.tile.height * 4
    );
  }
  getTileDataInRow(row, index) {
    let tileData = [];
    for (let i = 0; i < this.tile.height; i++) {
      const pxRow = row.slice(
        4 * index * this.tile.width + this.numberOfTileX * this.tile.width * 4 * i,
        4 * index * this.tile.width + this.numberOfTileX * this.tile.width * 4 * i + this.tile.width * 4
      )
      tileData = [...tileData, ...pxRow];
    }
    return tileData;
  }
  getTileAverageColor(tileColorData) {
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
    return this.rgbToHex(r, g, b);
  }
  componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  rgbToHex(r, g, b) {
    return this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }
  getTileSize() {
    return this.tile;
  }
}
