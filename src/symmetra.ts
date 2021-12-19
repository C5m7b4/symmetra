import events from 'events';
import fs from 'fs';
import path from 'path';

/**
 * FileStats interface export
 */
export interface FileStats {
  size: number;
  mtime: Date;
  atime: Date;
}

/**
 * functionFileList
 */
export type functionFileList = (s: string[]) => void;

/**
 * functionChange
 */
export type functionChange = (f: string, c: FileStats, p: FileStats) => void;

/**
 * The Watcher class will allow you to pick files with certain
 * extensions and then alternatively watch these files for changes
 */
export class Watcher extends events.EventEmitter {
  private _watchDir: string;
  private _interval: number;
  private _excludeFiles: string[];
  private _fileExtensions: string[];
  private _fileListCallback: functionFileList;
  private _fileChangeCallback: functionChange;
  private _doWatch: boolean;

  /**
   * Constructor Method
   * @param watchDir
   * @param fileExtensions
   * @param excludeFiles
   * @param interval
   * @param fileListCallback
   * @param fileChangeCallback
   * @param doWatch
   */
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

  /**
   * function to check if a file has a certain file extension or not
   * @param extension
   * @returns
   */
  containsExtension(extension: string): boolean {
    for (let i = 0; i < this._fileExtensions.length; i++) {
      if (this._fileExtensions[i] === extension) {
        return true;
      }
    }
    return false;
  }

  /**
   * get the extension from a filename to use to test to see
   * if this is an extension that the user wants or not
   * @param filename
   * @returns
   */
  testFile(filename: string): boolean {
    const pos = filename.indexOf('.');
    const test = filename.substr(pos + 1);
    if (this.containsExtension(test)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Get list of files specified by the configs
   * @param dir
   * @param extn
   * @param files
   * @param result
   * @returns
   */
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
        const file = path.join(dir, filename);
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

  /**
   * Start the Watcher
   */
  start(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const watcher = this;
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
            (curr: FileStats, prev: FileStats) => {
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
