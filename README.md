# Folder Test

## Installation

```console
$ yarn add --dev @ubccpsc310/folder-test
```

## Example

### Code under test
```typescript
/**
 * Converts a colour in RGB to a number
 * @param rgb An object with r, g, b properties
 * @throws RedError if colour is red
 * @throws YellowError if colour is yellow
 */
function rgbToNum(rgb: { r: number, g: number, b: number }): number {
    const num = (rgb.r << 16) + (rgb.g << 8) + rgb.b;
    if (num === 0xFF000) {
        throw new RedError();
    } else if (num === 0xFFFF00) {
        throw new YellowError();
    } else {
        return num;
    }
}
```

### Dynamic folder test
```typescript
import { expect } from 'chai'
import {testFolder} from "@ubccpsc310/folder-test";

type Input = { r: number, g: number, b: number };
type Output = number;
type Error = "RedError" | "YellowError";

describe("Dynamic folder test", function () {
    before(function () {
        // Called before any of the tests are run
    });

    beforeEach(function () {
        // Called before each test is run
    });
    
    // Assert value equals expected
    function assertResult(expected: Output, actual: any): void {
        expect(actual).to.equal(expected);
    }

    // Assert actual error is of expected type
    function assertError(expected: Error, actual: any): void {
        if (expected === "RedError") {
            expect(actual).to.be.an.instanceOf(RedError);
        } else {
            expect(actual).to.be.an.instanceOf(YellowError);
        }
    }

    testFolder<Input, Output, Error>(
        "rgbToNum tests",                               // suiteName
        (input: Input): Output => rgbToNum(input),      // target
        "./test/resources/json-spec",                   // path
        {
            assertOnResult: assertResult,
            assertOnError: assertError,                 // options
        }
    );
});
```

### ./test/resources/json-spec

Assert result
```json
{
  "title": "black",
  "input": {
    "r": 0,
    "g": 0,
    "b": 0
  },
  "errorExpected": false,
  "with": 0
}
```

Assert error
```json
{
  "title": "yellow",
  "input": {
    "r": 225,
    "g": 225,
    "b": 0
  },
  "errorExpected": true,
  "with": "YellowError"
}
```

## API
```typescript
/**
 * The main function!
 * @param suiteName Name of the mocha describe that will be created 
 * @param target A function that invokes the code under test and returns the result
 *          or a promise that resolves to the result
 *          if target returns a promise, it is resolved before the result is passed to `assertOnResult` function
 * @param path A path where the json schemata are
 * @param options Described below
 */
function testFolder<I, O, E>(suiteName: string, target: (input: I) => O | PromiseLike<O>, path: string, options: Options) {
    // ...
}

interface Options {
    // The function that will be called on the result of the code under test
    // if errorExpected is false and the code under test does not throw
    //  if absent, defaults to `expect(actual).to.deep.equal(expected)`
    assertOnResult?: (expected: O, actual: any, input: I) => void | PromiseLike<void>;

    // The function that will be called on the result of the code under test
    // if errorExpected is true and the code under test throws
    //  if absent, defaults to `expect(actual).to.deep.equal(expected)`
    assertOnError?: (expected: E, actual: any, input: I) => void | PromiseLike<void>;

    // Called on the JSON files to ensure that the inputs are "correct" as specified this function
    //  if absent, the inputs are not validated
    inputValidator?: (input: any) => input is I;

    // Called on the JSON files to ensure that the outputs are "correct" as specified this function
    //  if absent, the outputs are not validated
    outputValidator?: (output: any) => output is O;

    // Called on the JSON files to ensure that the errors are "correct" as specified this function
    //  if absent, the errors are not validated
    errorValidator?: (error: any) => error is E;

    // Whether or not to check the JSON for extraneous keys
    // Useful if you are prone to typos
    //  defaults to false
    checkForExcessKeys?: boolean;
}

/**
 * The schema of the JSON that folder-test will read in the provided directory
 */
interface TestFolderSchema<I, O, E> {
    // The name of the test
    title: string;

    // The input provided to the code under test
    input: I;

    // Whether or not the code under test is expected to throw an error
    //  defaults to false
    errorExpected?: boolean;

    // Whether or not error messages should include results
    //  defaults to false
    verbose?: boolean;

    // The value that code under test must equal
    //  if absent, will only test that the code under test does/doesn't throw an error
    with?: O | E;
}
```
