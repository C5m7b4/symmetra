declare const events: any;
declare type functionFileList = (s: string[]) => string[];
declare type functionChange = (f: string, c: string, p: string) => string;
export declare class Watcher extends events.EventEmitter {
    constructor(watchDir: string, fileExtensions: string[], excludeFiles: string[], interval: number, fileListCallback: functionFileList, fileChangeCallback: functionChange, doWatch: boolean);
    containsExtension(extension: string): boolean;
    testFile(filename: string): boolean;
    getAllFiles(dir: string, extn: string, files?: string[], result?: string[]): string[];
    start(): void;
}
export {};
