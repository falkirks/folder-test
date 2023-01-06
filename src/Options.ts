import {FolderTestOptions} from "./types";

function assertOnResult(): void {
    // Assert nothing
}

function assertOnError(): void {
    // Assert nothing
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
