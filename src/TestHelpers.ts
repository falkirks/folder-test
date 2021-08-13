import * as fs from "fs";
import Log from "../src/Util";
import {expect} from "chai";

export default class TestHelpers {

    public static getDefaultOptions<I, O, E>() {
        return {
            assertOnError: this.assertOnError,
            assertOnResult: this.assertOnResult,
        };
    }

    public static assertOnResult<O>(expected: any, actual: any) {
        expect(actual).to.deep.equal(expected);
    }

    public static assertOnError<O>(expected: any, actual: any) {
        expect(actual).to.deep.equal(expected);
    }

    public static readAllFiles(currentPath: string): string[] {
        let filePaths: string[] = [];
        const filesInDir = TestHelpers.attemptDirRead(currentPath);
        for (const fileOrDirName of filesInDir) {
            const fullPath = `${currentPath}/${fileOrDirName}`;
            if (TestHelpers.isDirectory(fullPath)) {
                filePaths = filePaths.concat(TestHelpers.readAllFiles(fullPath));
            } else if (fileOrDirName.endsWith(".json")) {
                filePaths.push(fullPath);
            }
        }
        return filePaths;
    }

    private static attemptDirRead(currentPath: string): string[] {
        try {
            return fs.readdirSync(currentPath);
        } catch (err) {
            Log.error(`Error reading directory ${currentPath}`);
            throw err;
        }
    }

    // From https://stackoverflow.com/questions/15630770/node-js-check-if-path-is-file-or-directory
    private static isDirectory(path: string) {
        try {
            const stat = fs.lstatSync(path);
            return stat.isDirectory();
        } catch (e) {
            return false;
        }
    }

    private static validate(content: any, schema: { [key: string]: string }) {
        for (const [property, type] of Object.entries(schema)) {
            if (!content.hasOwnProperty(property)) {
                throw new Error(`required property ${property} is missing.`);
            } else if (type !== null && typeof content[property] !== type) {
                throw new Error(`the value of ${property} is not ${type === "object" ? "an" : "a"} ${type}.`);
            }

        }
    }
}
