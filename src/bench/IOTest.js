export class IOTest {
  constructor(iter, onReady) {
    this.fourKB = this.generateData(4096);
    this.eightKB = this.generateData(8192);
    this.sixteenKB = this.generateData(16384);
    this.storage = new StorageModule(onReady);
    this.iter = iter;
  }

  generateData(length) {
    const result = [length];
    for (let i = 0; i < length; i++) {
      result[i] = String.fromCharCode(Math.floor(Math.random() * 126));
    }
    return result.join("");
  }

  run4KB(callback) {
    this.run(this.fourKB, this.iter, callback);
  }
  run8KB(callback) {
    this.run(this.eightKB, this.iter, callback);
  }
  run16KB(callback) {
    this.run(this.sixteenKB, this.iter, callback);
  }
  runAll(callback) {
    let count = 0;
    let iopsAvg = 0;
    const c = (iops) => {
      count++;
      iopsAvg += iops * count;
      if (count === 1) {
        this.run8KB(c);
      } else if (count === 2) {
        this.run16KB(c);
      } else if (count === 3) {
        callback(iopsAvg / 6);
      }
    };
    this.run4KB(c);
  }

  runAllMultiple(n, callback, context) {
    if (!context) {
      context = { count: 0, iops: 0 };
    }
    if (context.count <= n) {
      this.runAll((iops) => {
        context.iops += iops;
        context.count++;
        this.runAllMultiple(n, callback, context);
      });
    } else {
      callback(context.iops / context.count);
    }
  }

  run(data, iter, callback) {
    const time = Date.now();
    let count = 0;
    for (let i = 0; i < iter; i++) {
      this.storage.save(i, data, () => {
        count++;
        this.storage.delete(i, () => {
          count++;
          if (count >= iter * 2) {
            callback(count / ((Date.now() - time) / 1000));
          }
        });
      });
    }
  }
}

class StorageModule {
  constructor(onReady) {
    const request = indexedDB.open("IOTestDB");
    request.onerror = function (event) {
      onReady(false);
    };
    request.onupgradeneeded = (event) => {
      this.db = event.target.result;
      this.objectStore = this.db.createObjectStore("test", { keyPath: "id" });
    };
    request.onsuccess = (event) => {
      this.db = event.target.result;
      setTimeout(() => {
        this.objectStore = this.db
          .transaction(["test"], "readwrite")
          .objectStore("test");
        onReady(true);
      }, 1000);
    };
  }
  save(key, value, callback) {
    const req = this.objectStore.add({ id: key, val: value });
    req.onsuccess = (e) => {
      callback();
    };
  }
  delete(key, callback) {
    const req = this.objectStore.delete(key);
    req.onsuccess = (e) => {
      callback();
    };
  }
}
