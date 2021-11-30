const { fileExtensions, excludeFiles } = require("./utils");
const Watcher = require("./index");

// to use this test file change the main in package.json to point to this file

const watchDir = __dirname;
const doWatch = true;

function testWatcher() {
  console.log("testing");
  const watcher = new Watcher(
    watchDir,
    fileExtensions,
    excludeFiles,
    4000,
    (files) => {
      console.log(files);
    },
    (file, curr, prev) => {
      console.log(`modified file: ${file}`);
      console.log(`previous modified time: ${prev.mtime}`);
      console.log(`current modified time: ${curr.mtime}`);
    },
    doWatch
  );
  watcher.start();
}

testWatcher();
