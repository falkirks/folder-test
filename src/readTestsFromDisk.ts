import {TestFolderOptions, TestFolderSchemaWithFilename} from "./types";
import Log from "./Log";
import * as fs from "fs-extra";

/**
 * Recursively searches for test query JSON files in the path and returns those matching the specified schema.
 * @param path The path to the sample query JSON files.
 * @param options
 */
function readTestsFromDisk<I, O, E>(path: string, options: TestFolderOptions<I, O, E>): Array<{filename: string}> {
    const methodName: string = "TestUtil::readTests --";
    const testsLoaded: Array<TestFolderSchemaWithFilename<I, O, E>> = [];
    let files: string[];

    try {
        files = readAllFiles(path);
        if (files.length === 0) {
            Log.warn(`${methodName} No folder-test files found in ${path}.`);
        }
    } catch (err) {
        Log.error(`${methodName} Exception reading files in ${path}.`);
        throw err;
    }

    for (const file of files) {
        let content: Buffer;

        try {
            content = fs.readFileSync(file);
        } catch (err) {
            Log.error(`${methodName} Could not read ${file}.`);
            throw err;
        }

        try {
            const test = JSON.parse(content.toString());
            // TODO is this right?
            test.filename = file.replace("folder", ""); // dont show absolute paths
            testsLoaded.push(test);
        } catch (err) {
            Log.error(`${methodName} ${file} could not be read and parsed.`);
            throw new Error(`In ${file} ${err.message}`);
        }
    }

    return testsLoaded;
}

function readAllFiles(currentPath: string): string[] {
    let filePaths: string[] = [];
    const filesInDir = attemptDirRead(currentPath);
    for (const fileOrDirName of filesInDir) {
        const fullPath = `${currentPath}/${fileOrDirName}`;
        if (isDirectory(fullPath)) {
            filePaths = filePaths.concat(readAllFiles(fullPath));
        } else if (fileOrDirName.endsWith(".json")) {
            filePaths.push(fullPath);
        }
    }
    return filePaths;
}

function attemptDirRead(currentPath: string): string[] {
    try {
        return fs.readdirSync(currentPath);
    } catch (err) {
        Log.error(`Error reading directory ${currentPath}`);
        throw err;
    }
}

// From https://stackoverflow.com/questions/15630770/node-js-check-if-path-is-file-or-directory
function isDirectory(path: string) {
    try {
        const stat = fs.lstatSync(path);
        return stat.isDirectory();
    } catch (e) {
        return false;
    }
}

export {readTestsFromDisk};
