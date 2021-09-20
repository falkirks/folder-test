import {TestFolderSchemaWithFilename} from "../src/types";
import {validateTests} from "../src/validateTests";
import {getDefaultOptions, joinWithDefaultOptions} from "../src/Options";
import {expect} from "chai";

describe("Test schema validation", function () {
    const baseTest: TestFolderSchemaWithFilename<string, number, false> = {
        input: "input",
        title: "test",
        filename: "test.json",
    };

    const expectingResult: TestFolderSchemaWithFilename<string, number, false> = {
        ...baseTest,
        errorExpected: false,
        with: -1,
    };

    const expectingError: TestFolderSchemaWithFilename<string, number, false> = {
        ...baseTest,
        errorExpected: true,
        with: false,
    };

    const omitKey = (o: any, key: string): any => {
        const copy = JSON.parse(JSON.stringify(o));
        delete copy[key];
        return copy;
    };

    it("should pass a valid test without optional properties", function () {
        validateTests([baseTest], getDefaultOptions());
    });

    it("should pass a valid test with optional properties", function () {
        validateTests([expectingResult], getDefaultOptions());
    });

    it("should pass a valid test with an input validator", function () {
        validateTests([baseTest], joinWithDefaultOptions<string, number, false>({
            inputValidator: (input): input is string => typeof input === "string"
        }));
    });

    it("should pass a valid test with an output validator", function () {
        validateTests([expectingResult], joinWithDefaultOptions<string, number, false>({
            outputValidator: (output): output is number => typeof output === "number"
        }));
    });

    it("should pass a valid test with an error validator", function () {
        validateTests([expectingError], joinWithDefaultOptions<string, number, false>({
            errorValidator: (error): error is false => error === false
        }));
    });

    it("should error on missing title", function () {
        expect(() => {
            validateTests([omitKey(baseTest, "title")], getDefaultOptions());
        }).to.throw;
    });

    it("should error on missing input", function () {
        expect(() => {
            validateTests([omitKey(baseTest, "input")], getDefaultOptions());
        }).to.throw;
    });

    it("should error on bad input by validator", function () {
        expect(() => {
            const badInput = {...baseTest, input: Infinity};
            validateTests([badInput], joinWithDefaultOptions<string, number, false>({
                inputValidator: (input): input is string => typeof input === "string"
            }));
        }).to.throw;
    });

    it("should error on bad output by validator", function () {
        expect(() => {
            const badOutput = {...expectingResult, with: "foo"};
            validateTests([badOutput], joinWithDefaultOptions<string, number, false>({
                outputValidator: (output): output is number => typeof output === "number"
            }));
        }).to.throw;
    });

    it("should error on bad error by validator", function () {
        expect(() => {
            const badError = {...expectingError, with: true};
            validateTests([badError], joinWithDefaultOptions<string, number, false>({
                errorValidator: (error): error is false => error === false
            }));
        }).to.throw;
    });

    it("should error given one good test and one bad test", function () {
        expect(() => {
            validateTests([baseTest, omitKey(baseTest, "title")], getDefaultOptions());
        }).to.throw;
    });

    it("should error given an extraneous key if check is enabled", function () {
        expect(() => {
            const test = {...baseTest, foo: "bar"};
            validateTests([test], joinWithDefaultOptions({checkForExcessKeys: true}));
        }).to.throw;
    });

    it("should not error given an extraneous key if check is disabled", function () {
        const test = {...baseTest, foo: "bar"};
        validateTests([test], getDefaultOptions());
    });
});
