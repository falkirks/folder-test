export interface FolderTestOptions<I, O, E> {
    assertOnResult: (actual: unknown, expected: O, input: I) => void | PromiseLike<void>;
    assertOnError: (actual: unknown, expected: E, input: I) => void | PromiseLike<void>;
    checkForExcessKeys: boolean;
    inputValidator?: (input: unknown) => input is I;
    outputValidator?: (output: unknown) => output is O;
    errorValidator?: (error: unknown) => error is E;
}

export interface FolderTestSchema<I, O, E> {
    title: string;
    input: I;
    errorExpected?: boolean;
    verbose?: boolean;
    expected?: O | E; // if an error is expected this MUST be E otherwise it must be O
}

export interface FolderTestSchemaWithFilename<I, O, E> extends FolderTestSchema<I, O, E> {
    filename: string;
}
