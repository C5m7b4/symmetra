/// <reference types="node" />
import events from 'events';
export interface FileStats {
    size: number;
    mtime: Date;
    atime: Date;
}
export declare type functionFileList = (s: string[]) => void;
export declare type functionChange = (f: string, c: FileStats, p: FileStats) => void;
export declare class Watcher extends events.EventEmitter {
    private _watchDir;
    private _interval;
    private _excludeFiles;
    private _fileExtensions;
    private _fileListCallback;
    private _fileChangeCallback;
    private _doWatch;
    constructor(watchDir: string, fileExtensions: string[], excludeFiles: string[], interval: number, fileListCallback: functionFileList, fileChangeCallback: functionChange, doWatch: boolean);
    containsExtension(extension: string): boolean;
    testFile(filename: string): boolean;
    getAllFiles(dir: string, extn: string, files?: string[], result?: string[]): string[];
    start(): void;
}
