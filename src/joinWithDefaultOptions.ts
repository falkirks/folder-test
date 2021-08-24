import {expect} from "chai";
import {TestFolderOptions} from "./types";

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

function assertOnResult<O>(expected: O, actual: any) {
    expect(actual).to.deep.equal(expected);
}

function assertOnError<E>(expected: E, actual: any) {
    expect(actual).to.deep.equal(expected);
}

export {
    joinWithDefaultOptions,
};
