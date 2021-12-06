import { FSWatcher } from 'fs';

import events from 'events';
import util from 'util';
import fs from 'fs';
import path from 'path';

export type functionFileList = (s: string[]) => void;
export type functionChange = (f: string, c: string, p: string) => void;

export class Watcher extends events.EventEmitter {
  _watchDir: string;
  _interval: number;
  _excludeFiles: string[];
  _fileExtensions: string[];
  _fileListCallback: any;
  _fileChangeCallback: any;
  _doWatch: boolean;

  constructor(
    watchDir: string,
    fileExtensions: string[],
    excludeFiles: string[],
    interval: number,
    fileListCallback: functionFileList,
    fileChangeCallback: functionChange,
    doWatch: boolean
  ) {
    super();
    this._watchDir = watchDir;
    this._interval = interval;
    this._excludeFiles = excludeFiles;
    this._fileExtensions = fileExtensions;
    this._fileListCallback = fileListCallback;
    this._fileChangeCallback = fileChangeCallback;
    this._doWatch = doWatch;
  }

  containsExtension(extension: string): boolean {
    for (var i = 0; i < this._fileExtensions.length; i++) {
      if (this._fileExtensions[i] === extension) {
        return true;
      }
    }
    return false;
  }

  testFile(filename: string): boolean {
    var pos = filename.indexOf('.');
    var test = filename.substr(pos + 1);
    if (this.containsExtension(test)) {
      return true;
    } else {
      return false;
    }
  }

  getAllFiles(
    dir: string,
    extn: string,
    files?: string[],
    result?: string[]
  ): string[] {
    files = files || fs.readdirSync(dir);
    result = result || [];

    if (!files) {
      return [];
    }
    for (let i = 0; i < files.length; i++) {
      const filename = files[i];
      if (!this._excludeFiles.includes(filename)) {
        let file = path.join(dir, filename);
        if (fs.statSync(file).isDirectory()) {
          try {
            result = this.getAllFiles(file, extn, fs.readdirSync(file), result);
          } catch (error) {
            console.log(error);
            continue;
          }
        } else {
          if (this.testFile(file)) {
            result.push(file);
          }
        }
      }
    }

    return result;
  }

  start(): void {
    var watcher = this;
    const list = watcher.getAllFiles(this._watchDir, '.js');
    this._fileListCallback(list);
    if (list.length > 0) {
      if (this._doWatch) {
        list.forEach((file) => {
          fs.watchFile(
            file,
            {
              bigint: false,
              persistent: true,
              interval: this._interval,
            },
            (curr: any, prev: any) => {
              this._fileChangeCallback(file, curr, prev);
            }
          );
        });
      }
    } else {
      console.log('No Test files detected');
    }
  }

  // end of class
}
