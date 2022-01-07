import {expect} from "chai";
import {TestFolderOptions} from "./types";

function assertOnResult<O>(actual: any, expected: Awaited<O>): void {
    expect(actual).to.deep.equal(expected);
}

function assertOnError<E>(actual: any, expected: E): void {
    expect(actual).to.deep.equal(expected);
}

function getDefaultOptions<I, O, E>(): TestFolderOptions<I, O, E> {
    return {
        assertOnError,
        assertOnResult,
        checkForExcessKeys: true,
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
