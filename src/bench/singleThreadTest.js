export class SingleThreadTest {
  constructor() {
    this.from = 0;
    this.to = 3900000;
  }
  runTest(callback) {
    const startTime = Date.now();
    var blob = new Blob([document.querySelector("#scriptTag").textContent]);
    var blobURL = window.URL.createObjectURL(blob);

    var worker = new Worker(blobURL);
    worker.onmessage = (event) => {
        callback(Math.floor(100000000 / (Date.now() - startTime)));
    };
    worker.postMessage({ from: this.from, to: this.to });
  }
}