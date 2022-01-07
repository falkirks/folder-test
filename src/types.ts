export interface TestFolderOptions<I, O, E> {
    assertOnResult: (actual: any, expected: Awaited<O>, input: I) => void | PromiseLike<void>;
    assertOnError: (actual: any, expected: E, input: I) => void | PromiseLike<void>;
    checkForExcessKeys: boolean;
    inputValidator?: (input: any) => input is I;
    outputValidator?: (output: any) => output is Awaited<O>;
    errorValidator?: (error: any) => error is E;
}

export interface TestFolderSchema<I, O, E> {
    title: string;
    input: I;
    errorExpected?: boolean;
    verbose?: boolean;
    expected?: Awaited<O> | E; // if an error is expected this MUST be E otherwise it must be O
}

export interface TestFolderSchemaWithFilename<I, O, E> extends TestFolderSchema<I, O, E> {
    filename: string;
}
