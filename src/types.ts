export interface TestFolderOptions<O, E> {
    assertOnResult?: (expected: any, actual: any) => void; // expected and actual are either O or if O = Promise<F> they will be F
    assertOnError?: (expected: any, actual: any) => void;
}

export interface TestFolderSchema<I, O, E> {
    title: string;
    desc: string;
    input: I;
    errorExpected?: boolean;
    with?: O | E; // if an error is expected this MUST be E otherwise it must be O
}


export interface TestFolderSchemaWithFilename<I, O, E> extends TestFolderSchema<I, O, E> {
    filename: string;
}
