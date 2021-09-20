export interface TestFolderOptions<I, O, E> {
    assertOnResult: (expected: O, actual: any, input: I) => void | PromiseLike<void>;
    assertOnError: (expected: E, actual: any, input: I) => void | PromiseLike<void>;
    checkForExcessKeys: boolean;
    inputValidator?: (input: any) => input is I;
    outputValidator?: (output: any) => output is O;
    errorValidator?: (error: any) => error is E;
}

export interface TestFolderSchema<I, O, E> {
    title: string;
    input: I;
    errorExpected?: boolean;
    verbose?: boolean;
    with?: O | E; // if an error is expected this MUST be E otherwise it must be O
}

export interface TestFolderSchemaWithFilename<I, O, E> extends TestFolderSchema<I, O, E> {
    filename: string;
}
