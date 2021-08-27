# Folder Test

## Example

```typescript
import {testFolder} from "@ubccpsc310/folder-test";

type Input = string;
type Output = number;
type Error = "RedError" | "YellowError";

describe("Dynamic folder test", function () {
    before(function () {
        // Called before any of the tests are run
    });

    // `after` is also called before the tests are run, but after the `before`
    // `beforeEach` and `afterEach` do not work as expected

    testFolder<Input, Output, Error>(
        "Suite Name",
        (input: Input): Output => codeUnderTest(input),
        "./test/resources/json-spec",
        options
    );
});
```

## API
```typescript
/**
 * The main function!
 * @param suiteName Name of the mocha describe that will be created 
 * @param target A function that invokes the code under test
 * @param path A path where the json schemata are
 * @param options Described below
 */
function testFolder<I, O, E>(suiteName: string, target: (input: I) => O, path: string, options: Options) {
    // ...
}

interface Options {
    // The function that will be called on the result of the code under test
    // if errorExpected is false and the code under test does not throw
    //  if absent, defaults to `expect(actual).to.deep.equal(expected)`
    assertOnResult?: (expected: O, actual: any) => void | PromiseLike<void>;

    // The function that will be called on the result of the code under test
    // if errorExpected is true and the code under test throws
    //  if absent, defaults to `expect(actual).to.deep.equal(expected)`
    assertOnError?: (expected: E, actual: any) => void | PromiseLike<void>;

    // Called on the JSON files to ensure that the inputs are "correct" as specified this function
    //  if absent, the inputs are not validated
    inputValidator?: (input: any) => input is I;

    // Called on the JSON files to ensure that the outputs are "correct" as specified this function
    //  if absent, the outputs are not validated
    outputValidator?: (output: any) => output is O;

    // Called on the JSON files to ensure that the errors are "correct" as specified this function
    //  if absent, the errors are not validated
    errorValidator?: (error: any) => error is E;
}

/**
 * The schema of the JSON that folder-test will read in the provided directory
 */
interface Test {
    // The name of the test
    title: string;

    // The input provided to the code under test
    input: I;

    // Whether or not the code under test is expected to throw an error
    //  defaults to false
    errorExpected?: boolean;

    // The value that code under test must equal
    //  if absent, will only test that the code under test does/doesn't throw an error
    with?: O | E;
}
```
