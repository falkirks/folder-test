import {TestFolderOptions, TestFolderSchemaWithFilename} from "./types";

import {expect} from "chai";
import {joinWithDefaultOptions} from "./Options";
import {readTestsFromDisk} from "./readTestsFromDisk";
import {validateTests} from "./validateTests";
import {ITest} from "mocha";

export function testFolder<I, O, E>(suiteName: string,
                                    target: (input: I) => O | PromiseLike<O>,
                                    folder= "", // TODO is this right??
                                    options: Partial<TestFolderOptions<I, O, E>> = {}): ITest {

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
    // Creates an extra "test" called "Should run dynamic tests" as a byproduct. Don't worry about it
    return it("Should run dynamic tests", function () {
        describe(suiteName, function () {
            for (const test of tests) {
                it(`[${test.filename}] ${test.title}`, async function () {
                    try {
                        // O could be a promise or not, this abstracts that away for us
                        const result = await target(test.input);
                        if (test.errorExpected) {
                            // if we want an error just reject again
                            return Promise.reject(new Error(`Expected an error but instead resolved or returned with ${result}`));
                        } else if (test.with !== undefined) {
                            mergedOptions.assertOnResult(test.with as O, result);
                        }
                    } catch (err) {
                        if (!test.errorExpected) {
                            // if we don't want an error just rethrow
                            throw err;
                        } else if (test.with !== undefined) {
                            mergedOptions.assertOnError(test.with as E, err);
                        }
                    }
                });
            }
        });
    });
}
