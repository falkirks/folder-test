import {TestFolderOptions, TestFolderSchema, TestFolderSchemaWithFilename} from "./types";

import {expect} from "chai";
import * as chai from "chai";
import * as fs from "fs-extra";
import * as chaiAsPromised from "chai-as-promised";
import Log from "./Util";
import TestHelpers from "./TestHelpers";
import {fail} from "assert";

// This extends chai with assertions that natively support Promises
chai.use(chaiAsPromised);

export function testFolder<I, O, E>(suiteName: string,
                                    target: (input: I) => O,
                                    folder: string = "",
                                    options?: TestFolderOptions<O, E>) {

    /**
     * Recursively searches for test query JSON files in the path and returns those matching the specified schema.
     * @param path The path to the sample query JSON files.
     */
    const readTestQueries = (path: string = ""): Array<TestFolderSchemaWithFilename<I, O, E>> => {
        const methodName: string = "TestUtil::readTestQueries --";
        const testsLoaded: Array<TestFolderSchemaWithFilename<I, O, E>> = [];
        let files: string[];

        try {
            files = TestHelpers.readAllFiles(path);
            if (files.length === 0) {
                Log.warn(`${methodName} No folder-test files found in ${path}.`);
            }
        } catch (err) {
            Log.error(`${methodName} Exception reading files in ${path}.`);
            throw err;
        }

        for (const file of files) {
            const skipFile: string = file;
            let content: Buffer;

            try {
                content = fs.readFileSync(file);
            } catch (err) {
                Log.error(`${methodName} Could not read ${skipFile}.`);
                throw err;
            }

            try {
                const test = JSON.parse(content.toString());
                validate(test);
                test["filename"] = file.replace("folder", ""); // dont show absolute paths
                testsLoaded.push(test);
            } catch (err) {
                Log.error(`${methodName} ${skipFile} does not conform to the query schema.`);
                throw new Error(`In ${file} ${err.message}`);
            }
        }

        return testsLoaded;
    };

    const validate = (content: any) => {
        if (!content.hasOwnProperty("title") && typeof content["title"] !== "string") {
            throw new Error(`required property title is missing or is not a string.`);
        }
        if (!content.hasOwnProperty("desc") && typeof content["desc"] !== "string") {
            throw new Error(`required property desc is missing or is not a string.`);
        }
        if (!content.hasOwnProperty("input")) { // we don't validate input type
            throw new Error(`required property input is missing.`);
        }
        if (content.hasOwnProperty("errorExpected") && typeof content["errorExpected"] !== "boolean") { // we don't validate input type
            throw new Error(`optional property errorExpected is not a boolean.`);
        }
    };

    const mergedOptions = {...TestHelpers.getDefaultOptions(), ...options};

    let tests: Array<TestFolderSchemaWithFilename<I, O, E>>;
    try {
        tests = readTestQueries(folder);
    } catch (err) {
        expect.fail("", "", `Failed to read one or more test queries. ${err}`);
    }
    const handleError = (err: any, test: TestFolderSchema<I, O, E>): void => {
        if (!test.errorExpected) {
            throw err; // if we dont want an error just rethrow
        }
        if (test.with !== undefined) {
            mergedOptions.assertOnError(test.with, err);
        }
    };

    // Dynamically create and run a test for each query in testQueries
    // Creates an extra "test" called "Should run test queries" as a byproduct. Don't worry about it
    it("Should run dynamic tests run", function () {
        describe(suiteName, function () {
            for (const test of tests) {
                it(`[${test.filename}] ${test.title}`, function () {
                    try {
                        const futureResult: O = target(test.input);
                        let hasErrored = false;
                        return Promise.resolve(futureResult).catch((e) => { // O could be a promise or not, this abstracts that away for us
                            hasErrored = true; // I am sorry I couldn't think of a better way :(
                            handleError(e, test);
                        }).then((result) => {
                            if (test.errorExpected && !hasErrored) {
                                return Promise.reject(new Error(`Expected an error but instead resolved or returned with ${result}`)); // if we dont want an error just reject again
                            }
                            if (test.with !== undefined) {
                                mergedOptions.assertOnResult(test.with, result);
                            }
                        });
                    } catch (e) {
                        handleError(e, test);
                    }
                });
            }
        });
    });
}
