import {expect} from "chai";
import {FolderTestOptions} from "./types";

function assertOnResult<O>(actual: any, expected: Awaited<O>): void {
    expect(actual).to.deep.equal(expected);
}

function assertOnError<E>(actual: any, expected: E): void {
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
