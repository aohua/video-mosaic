const streamMosaic = async (webCam, mosaic) => {
    const originalImage = {
        context: webCam.captureImage(false),
        ...webCam.getSize()
    }
    const mosaicData = await mosaic.createMosaic(originalImage, true);
    const mosaicContainer = document.getElementById("mosaic");
    const tileSize = mosaic.getTileSize();
    mosaicContainer.innerHTML = "";
    Object.keys(mosaicData).forEach(key => {
        mosaicData[key].forEach(tile => {
            const newDiv = document.createElement("div");
            newDiv.style.backgroundColor = "#" + tile;
            newDiv.style.width = `${tileSize.width}px`;
            newDiv.style.height = `${tileSize.height}px`;
            newDiv.style.cssFloat = "left";
            newDiv.style.borderRadius = "50%";
            mosaicContainer.append(newDiv);
        });
    });
    streamMosaic(webCam, mosaic);
}
onload = (() => {
    const webCam = new WebCam("webCamWindow");
    const mosaic = new Mosaic({width: 10, height: 10});
    streamMosaic(webCam, mosaic);
})();