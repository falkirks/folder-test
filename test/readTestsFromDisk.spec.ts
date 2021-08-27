import {expect} from "chai";
import {readTestsFromDisk} from "../src/readTestsFromDisk";

describe("Reading tests from disk", function () {
    const expected = [
        {foo: 0, filename: "bar.json"},
        {bar: 1, filename: "foo.json"}
    ];

    it("should error when reading a directory that does not exist", function () {
        expect(() => {
            readTestsFromDisk(`${__dirname}/resources/does-not-exist`);
        }).to.throw;
    });

    it("should error when reading a file", function () {
        expect(() => {
            readTestsFromDisk(`${__dirname}/resources/json/foo.json`);
        }).to.throw;
    });

    it("should read json in resources/json (and append filename)", function () {
        const result = readTestsFromDisk(`${__dirname}/resources/json`);
        expect(result).to.deep.equal(expected);
    });

    it("should read json in resources/json (and append filename) with a trailing slash", function () {
        const result = readTestsFromDisk(`${__dirname}/resources/json/`);
        expect(result).to.deep.equal(expected);
    });

    it("should read json in resources/json (and append filename) using relative path", function () {
        const result = readTestsFromDisk("./test/resources/json");
        expect(result).to.deep.equal(expected);
    });

    it("should error when bad unparseable json is supplied", function () {
        expect(() => {
            readTestsFromDisk(`${__dirname}/resources/bad-json`);
        }).to.throw;
    });
});
