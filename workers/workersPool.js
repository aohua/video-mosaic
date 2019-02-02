class WorkerPool {
  constructor(size = window.navigator.hardwareConcurrency) {
    this.poolSize = size;
    this.taskQueue = [];
    this.workerQueue = [];
  }
  init() {
    for (let i = 0; i < this.poolSize; i++) {
      this.workerQueue.push(new WorkerThread(this));
    }
  }
  addTask(workerTask) {
    if (this.workerQueue.length > 0) {
      // get the worker from the front of the queue
      const workerThread = this.workerQueue.shift();
      workerThread.run(workerTask);
    } else {
      // no free workers,
      this.taskQueue.push(workerTask);
    }
  }
  releaseWorkerThread(workerThread) {
    if (this.taskQueue.length > 0) {
      // if has remaining tasks, directly excute the task.
      const workerTask = this.taskQueue.shift();
      workerThread.run(workerTask);
    } else {
      // if no more tasks to do push the thread back to the pool.
      this.workerQueue.push(workerThread);
    }
  }
}

class WorkerThread {
  callback(e) {
    this.workerTask.callback(e);
    this.pool.releaseWorkerThread(this);
  }
  constructor(pool) {
    this.pool = pool;
    this.workerTask = {};
    this.run = (workerTask) => {
      this.workerTask = workerTask;
      // create a new web worker
      if (this.workerTask.url !== null) {
        var worker = new Worker(workerTask.url);
        worker.addEventListener("message", this.callback);
        worker.postMessage(workerTask.message);
      }
    };
  }
}

class WorkerTask {
  constructor(url, message, callback) {
    this.url = url;
    this.callback = callback;
    this.message = message;
  }
}
