import {expect} from "chai";
import {TestFolderOptions} from "./types";

function assertOnResult<O>(expected: O, actual: any): Chai.Assertion {
    return expect(actual).to.deep.equal(expected);
}

function assertOnError<E>(expected: E, actual: any): Chai.Assertion {
    return expect(actual).to.deep.equal(expected);
}

function getDefaultOptions<I, O, E>(): TestFolderOptions<I, O, E> {
    return {
        assertOnError,
        assertOnResult,
    };
}

function joinWithDefaultOptions<I, O, E>(provided: Partial<TestFolderOptions<I, O, E>>): TestFolderOptions<I, O, E> {
    return {
        ...getDefaultOptions<I, O, E>(),
        ...provided,
    };
}

export {
    joinWithDefaultOptions,
};
