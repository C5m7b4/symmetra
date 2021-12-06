"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Watcher = void 0;
const events = require('events');
const util = require('util');
const fs = require('fs');
const path = require('path');
class Watcher extends events.EventEmitter {
    constructor(watchDir, fileExtensions, excludeFiles, interval, fileListCallback, fileChangeCallback, doWatch) {
        super();
        this._watchDir = watchDir;
        this._interval = interval;
        this._excludeFiles = excludeFiles;
        this._fileExtensions = fileExtensions;
        this._fileListCallback = fileListCallback;
        this._fileChangeCallback = fileChangeCallback;
        this._doWatch = doWatch;
    }
    containsExtension(extension) {
        for (var i = 0; i < this._fileExtensions.length; i++) {
            if (this._fileExtensions[i] === extension) {
                return true;
            }
        }
        return false;
    }
    testFile(filename) {
        var pos = filename.indexOf('.');
        var test = filename.substr(pos + 1);
        if (this.containsExtension(test)) {
            return true;
        }
        else {
            return false;
        }
    }
    getAllFiles(dir, extn, files, result) {
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
                    }
                    catch (error) {
                        console.log(error);
                        continue;
                    }
                }
                else {
                    if (this.testFile(file)) {
                        result.push(file);
                    }
                }
            }
        }
        return result;
    }
    start() {
        var watcher = this;
        const list = watcher.getAllFiles(this._watchDir, '.js');
        this._fileListCallback(list);
        if (list.length > 0) {
            if (this._doWatch) {
                list.forEach((file) => {
                    fs.watchFile(file, {
                        bigint: false,
                        persistent: true,
                        interval: this._interval,
                    }, (curr, prev) => {
                        this._fileChangeCallback(file, curr, prev);
                    });
                });
            }
        }
        else {
            console.log('No Test files detected');
        }
    }
}
exports.Watcher = Watcher;
