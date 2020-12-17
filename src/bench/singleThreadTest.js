class singleThreadTest {
  constructor() {
    this.from = 0;
    this.to = 200000;
    this.startTime = "";
    this.result = document.getElementById("status");
  }
  receivedWorkerMessage(event) {
    this.showMsg(`Done! </br> your Score is ${Date.now() - this.startTime}`);
  }
  showMsg(msg) {
    this.result.innerHTML = msg;
  }
  workerError() {}
  runTest(callback) {
    this.startTime = Date.now();
    var blob = new Blob([document.querySelector("#scriptTag").textContent]);
    var blobURL = window.URL.createObjectURL(blob);

    var worker = new Worker(blobURL);
    worker.onmessage = this.receivedWorkerMessage.bind(this, callback);
    worker.onerror = this.workerError;
    worker.postMessage({ from: this.from, to: this.to, callback: callback });
  }
}
let singleThreadTestObj = new singleThreadTest();
singleThreadTestObj.runTest();

module.exports = singleThreadTest;
