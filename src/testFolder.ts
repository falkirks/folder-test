import {TestFolderOptions, TestFolderSchemaWithFilename} from "./types";

import {expect} from "chai";
import {joinWithDefaultOptions} from "./Options";
import {readTestsFromDisk} from "./readTestsFromDisk";
import {validateTests} from "./validateTests";
import {ISuite} from "mocha";

function testFolder<I, O, E>(suiteName: string,
                             target: (input: I) => O | PromiseLike<O>,
                             folder: string,
                             options: Partial<TestFolderOptions<I, O, E>> = {}): ISuite {

    const mergedOptions = joinWithDefaultOptions(options);
    let tests: Array<TestFolderSchemaWithFilename<I, O, E>>;
    try {
        const maybeTests = readTestsFromDisk(folder);
        if (validateTests(maybeTests, mergedOptions)) {
            tests = maybeTests;
        }
    } catch (err) {
        expect.fail("", "", `Failed to read one or more test queries. ${err}`);
    }

    // Dynamically create and run a test for each query in testQueries
    return describe(suiteName, function () {
        for (const test of tests) {
            it(`[${test.filename}] ${test.title}`, async function () {
                try {
                    // O could be a promise or not, this abstracts that away for us
                    const result = await target(test.input);
                    if (test.errorExpected) {
                        // if we want an error just reject again
                        const supplement = test.verbose ? ` with ${result}` : "";
                        return Promise.reject(new Error(`Expected an error but instead resolved or returned${supplement}`));
                    } else if (test.with !== undefined) {
                        return mergedOptions.assertOnResult(test.with as O, result, test.input);
                    }
                } catch (err) {
                    if (!test.errorExpected) {
                        // if we don't want an error just rethrow
                        throw err;
                    } else if (test.with !== undefined) {
                        return mergedOptions.assertOnError(test.with as E, err, test.input);
                    }
                }
            });
        }
    });
}

export {testFolder};
