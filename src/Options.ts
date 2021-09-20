import {expect} from "chai";
import {TestFolderOptions} from "./types";

function assertOnResult<O>(expected: O, actual: any): void {
    expect(actual).to.deep.equal(expected);
}

function assertOnError<E>(expected: E, actual: any): void {
    expect(actual).to.deep.equal(expected);
}

function getDefaultOptions<I, O, E>(): TestFolderOptions<I, O, E> {
    return {
        assertOnError,
        assertOnResult,
        checkForExcessKeys: false,
    };
}

function joinWithDefaultOptions<I, O, E>(provided: Partial<TestFolderOptions<I, O, E>>): TestFolderOptions<I, O, E> {
    return {
        ...getDefaultOptions<I, O, E>(),
        ...provided,
    };
}

export {
    getDefaultOptions,
    joinWithDefaultOptions,
};
