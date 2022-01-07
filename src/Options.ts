import {expect} from "chai";
import {FolderTestOptions} from "./types";

function assertOnResult<O>(expected: Awaited<O>, actual: any): void {
    expect(actual).to.deep.equal(expected);
}

function assertOnError<E>(expected: E, actual: any): void {
    expect(actual).to.deep.equal(expected);
}

function getDefaultOptions<I, O, E>(): FolderTestOptions<I, O, E> {
    return {
        assertOnError,
        assertOnResult,
        checkForExcessKeys: true,
    };
}

function joinWithDefaultOptions<I, O, E>(provided: Partial<FolderTestOptions<I, O, E>>): FolderTestOptions<I, O, E> {
    return {
        ...getDefaultOptions<I, O, E>(),
        ...provided,
    };
}

export {
    getDefaultOptions,
    joinWithDefaultOptions,
};
