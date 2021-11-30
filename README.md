# symmetra

A small file watcher utility

## Installation

```js
# using npm
npm install symmetra

# using yarn
yarn add symmetra
```

### What this library is for

I created this library to help with another library that I was creating (a small javascript testing framework called Chaaya). Here is some example usage:

```js
const { fileExtensions, excludeFiles, interval } = require("./utils");
const Watcher = require("symmetra");

const baseUrl = __dirname;
const doWatch = true;

function testWatcher() {
  const watcher = new Watcher(
    baseUrl,
    fileExtensions,
    excludeFiles,
    interval,
    acceptFileList,
    detectChange,
    doWatch
  );
  watcher.start();
}
```

First things first. There are a few things we need to pass into this class:

- Files to exclude
- File extensions to target
- Interval
- Callback when file list is created
- Callback when a file change is detected
- doWatch

### Files to exclude

Normally you will want to include files like these

- .git
- bin
- node_modules
- .gitignore
- package.json
- package-lock.json

I normally put these in a config file like this:

```js
module.exports = {
  extensions: ["test.js", "spec.js"],
  excludeFiles: [
    ".git",
    "bin",
    "node_modules",
    ".gitignore",
    "package.json",
    "package-lock.json",
    ".github",
  ],
  interval: 4000,
};
```

Then I will import this into my project to get the settings for the watcher.

### File extensions to target

This would include things like

- test.js
- spec.js

Once the javascript files are found, they are narrowed down by using this list of file extensions.

### Interval

This is used by fs.watchFile. This is the polling interval in which file changes are detected.

### Callback when file list is created

This funtion is used just to the get list of files that have been gathered by the current configuration. _Ex: Only test files that exist in this project._ By default, you do not have to have the watcher watch files. It can simply search your project directory and send you back a list of files that match your needs.

- ToDo: Add additional configuration to search base files that are not just .js file before filtering by the fileExtensions config.

### Callback when a file change is detected

This function is triggered when one of the watched files detects a change. Here is the signature for this function:

```js
function detectChange(file, curr, prev) {
  console.log("change detected");
  console.log(file);
  console.log(curr);
  console.log(prev);
  runSingleTestFile(file);
}
```

This utility is proving to be a sweet little utility to help me build my javascript testing library. Download and enjoy and if you find something that could be improved upon please fork and create a pull request.
