export interface TestFolderOptions<I, O, E> {
    assertOnResult: (expected: Awaited<O>, actual: any, input: I) => void | PromiseLike<void>;
    assertOnError: (expected: E, actual: any, input: I) => void | PromiseLike<void>;
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

export type Awaited<O> = O extends Promise<infer T> ? T : O;
