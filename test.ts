import { fileExtensions, excludeFiles } from './utils';
import { Watcher, functionFileList, functionChange } from './src/index';

// to use this test file change the main in package.json to point to this file

const watchDir = __dirname;
const doWatch = true;

const logFiles: (f: string[]) => void = (f: string[]) => {
  console.log(f);
};

const logChanges: (f: string, curr: any, prev: any) => void = (
  f: string,
  curr: any,
  prev: any
) => {
  console.log(f);
  console.log(curr);
  console.log(prev);
};

function testWatcher() {
  console.log('testing');
  const watcher = new Watcher(
    watchDir,
    fileExtensions,
    excludeFiles,
    4000,
    logFiles,
    logChanges,
    doWatch
  );
  watcher.start();
}

testWatcher();
