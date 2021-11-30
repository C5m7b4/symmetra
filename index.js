const events = require("events");
const util = require("util");
const fs = require("fs");
const path = require("path");

const watchDir = "./watch";
const tolerance = 1000 * 6; // 6 seconds for testing

const extensions = ["test.js", "spec.js"];
const excludeFiles = [
  ".git",
  "bin",
  "node_modules",
  ".gitignore",
  "package.json",
  "package-lock.json",
];

class Watcher extends events.EventEmitter {
  constructor(watchDir) {
    super();
    this._watchDir = watchDir;
    this._processes = new Map();
    this._fileList = [];
  }

  process(eventType, filename) {
    if (!watcher.isFileProcessing(eventType, filename)) {
      console.log(`event: ${eventType}, filename: ${filename}`);
      this._processes.set(filename, { eventType, executed: new Date() });
      setTimeout(() => {
        this._processes.delete(filename);
      }, tolerance);
    }
  }

  isFileProcessing(eventType, filename) {
    let isProcessing = false;
    const process = this._processes.get(filename);
    if (process) {
      const now = new Date();
      const diff = now - new Date(process.executed);
      if (diff < tolerance) {
        isProcessing = true;
      }
    }
    return isProcessing;
  }

  removeProcess(eventType, process) {}

  containsExtension(extension) {
    for (var i = 0; i < fileExtensions.length; i++) {
      if (fileExtensions[i] === extension) {
        return true;
      }
    }
    return false;
  }

  testFile(filename) {
    var pos = filename.indexOf(".");
    var test = filename.substr(pos + 1);
    if (containsExtension(test)) {
      return true;
    } else {
      return false;
    }
  }

  getAllFiles(dir, extn, files, result, regex) {
    files = files || fs.readdirSync(dir);
    result = result || [];

    for (let i = 0; i < files.length; i++) {
      const filename = files[i];
      if (!excludeFiles.includes(filename)) {
        let file = path.join(dir, filename);
        if (fs.statSync(file).isDirectory()) {
          try {
            result = watcher.getAllFiles(
              file,
              extn,
              fs.readdirSync(file),
              result,
              regex
            );
          } catch (error) {
            console.log(error);
            continue;
          }
        } else {
          if (watcher.testFile(file)) {
            result.push(file);
          }
        }
      }
    }

    return result;
  }

  start() {
    var watcher = this;
    const list = watcher.getAllFiles(__dirname, ".js");
    // fs.watch(
    //   watchDir,
    //   {
    //     persistent: true,
    //     recursive: true,
    //     encoding: "utf8",
    //   },
    //   function (eventType, filename) {
    //     watcher.process(eventType, filename);
    //   }
    // );
  }

  // end of class
}

const watcher = new Watcher(watchDir);
watcher.start();
