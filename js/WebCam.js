"use strict";
class WebCam {
  constructor(videoElement) {
    this.width = 640;
    this.height = 480;

    if (typeof videoElement !== "object") {
      this.webCamWindow = document.getElementById(videoElement);
    } else {
      this.webCamWindow = videoElement;
    }

    if (this.hasSupport()) {
      if (this.webCamWindow) {
        this.setSize();
        this.startStream();
      }
    } else {
      alert("Web cam is not supported");
    }
  }

  startStream() {
    (
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia
    ).call(
      navigator,
      { video: true },
      (localMediaStream) => {
        if (this.webCamWindow) {
          if (navigator.mozGetUserMedia) {
            webCamWindow.mozSrcObject = localMediaStream;
            webCamWindow.play();
          } else {
            webCamWindow.srcObject = localMediaStream;
          }
        }
      },
      console.error
    );
  }

  captureImage(append) {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.webCamWindow, 0, 0, this.width, this.height);
    
    if(append) {
        append.appendChild(canvas);	
    }

    return ctx;
  }

  getSize() {
      return {
          width: this.width,
          height: this.height
      }
  }

  setSize() {
    this.webCamWindow.style.width = this.width + "px";
    this.webCamWindow.style.height = this.height + "px";
  }

  hasSupport() {
    return !!(
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia
    );
  }
}
