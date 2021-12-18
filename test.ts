import { fileExtensions, excludeFiles } from './utils';
import {
  Watcher,
  functionFileList,
  functionChange,
  FileStats,
} from './src/index';

// to use this test file change the main in package.json to point to this file

const watchDir = __dirname;
const doWatch = true;

const logFiles: functionFileList = (f: string[]) => {
  console.log(f);
};

const logChanges: functionChange = (
  f: string,
  curr: FileStats,
  prev: FileStats
): void => {
  console.log(f);
  console.log(curr.mtime);
  console.log(prev.mtime);
};

function testWatcher(): void {
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
