import {TestFolderOptions, TestFolderSchemaWithFilename} from "./types";
import Log from "./Log";

function validateTest<I, O, E>(content: any, options: TestFolderOptions<I, O, E>) {
    if (!content.hasOwnProperty("title") && typeof content["title"] !== "string") {
        throw new Error("required property title is missing or is not a string.");
    }
    if (!content.hasOwnProperty("desc") && typeof content["desc"] !== "string") {
        throw new Error("required property desc is missing or is not a string.");
    }
    if (!content.hasOwnProperty("input")) { // we don't validate input type
        throw new Error("required property input is missing.");
    }
    if (content.hasOwnProperty("errorExpected") && typeof content["errorExpected"] !== "boolean") {
        throw new Error("optional property errorExpected is not a boolean.");
    }
    if (options.inputValidator && !options.inputValidator(content.input)) {
        throw new Error("input is not valid.");
    }
    if (content.hasOwnProperty("with")) {
        if (options.outputValidator && !content.errorExpected && !options.outputValidator(content.with)) {
            throw new Error("output is not valid.");
        }
        if (options.errorValidator && content.errorExpected && !options.errorValidator(content.with)) {
            throw new Error("error is not valid.");
        }
    }
}

function validateTests<I, O, E>(maybeTests: Array<{ filename: string }>, options: TestFolderOptions<I, O, E>): maybeTests is Array<TestFolderSchemaWithFilename<I, O, E>> {
    let badTests = 0;
    for (const maybeTest of maybeTests) {
        try {
            validateTest(maybeTest, options);
        } catch (err) {
            Log.error(`${maybeTest.filename} does not conform to the test schema. (${err.message})`);
            badTests++;
        }
    }
    if (badTests > 0) {
        const subject = badTests === 1 ? "test" : "tests";
        throw new Error(`${badTests} ${subject} did not conform to the test schema.`);
    }
    return true;
}

export {validateTests};
