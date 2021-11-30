const { fileExtensions, excludeFiles } = require("./utils");
const Watcher = require("./index");

const watchDir = "./watch";

function testWatcher() {
  console.log("testing");
  const watcher = new Watcher(
    watchDir,
    fileExtensions,
    excludeFiles,
    4000,
    (file, curr, prev) => {
      console.log(`modified file: ${file}`);
      console.log(`previous modified time: ${prev.mtime}`);
      console.log(`current modified time: ${curr.mtime}`);
    }
  );
  watcher.start();
}

testWatcher();
