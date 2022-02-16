import { describe, it, assert } from "vitest";
import { isArray, isBoolean, isDate, isError, isFunction, isNumber, isObject, isRegExp, isString, isSymbol, uniqInPlace } from "@/lib/utils";

describe("utils", () => {
  describe("uniqInPlace", () => {
    it("should mutate the array in place and only keep unique values", () => {
      const list = [1, 2, 4, 3, 2, 1, 3, 4, 5, 7, 3, 7, 8, 9, 5, 3, 2, 4, 2];
      uniqInPlace(list);
      assert.sameOrderedMembers(list, [1, 2, 4, 3, 5, 7, 8, 9]);
    });

    it("should use the callback to determine a unique key", () => {
      const list = [{ a: "hi" }, { a: "hello" }, { a: "goodbye" }, { a: "hello" }, { a: "hi" }, { a: "bye" }];
      uniqInPlace(list, item => item.a);
      assert.sameDeepOrderedMembers(list, [{ a: "hi" }, { a: "hello" }, { a: "goodbye" }, { a: "bye" }]);
    });
  });

  describe("type-checking functions", () => {
    const exampleValues = [
      ["Array", []],
      ["Array", new Array(10)],
      ["Boolean", new Boolean(true)],
      ["Boolean", true],
      ["Date", new Date()],
      ["Error", new Error("hi")],
      ["Function", () => "hi"],
      ["Function", new Function("return 'hi';")],
      ["null", null],
      ["Number", 123],
      ["Number", new Number(123)],
      ["Object", {}],
      ["Object", new Object()],
      ["RegExp", /hi/],
      ["RegExp", new RegExp("hi")],
      ["String", "hi"],
      ["String", new String("hi")],
      ["Symbol", Symbol("hi")],
      ["undefined", undefined],
    ];

    const forAllExamplesOf = (exampleType: string, callback: (value: any) => void): void => {
      exampleValues.forEach(([exampleOf, value]) => {
        if (exampleOf === exampleType) callback(value);
      });
    };

    const forAllExamplesExcept = (exampleType: string, callback: (value: any) => void): void => {
      exampleValues.forEach(([exampleOf, value]) => {
        if (exampleOf !== exampleType) callback(value);
      });
    };

    const expectedType = (value: any, exampleType: string, invert = false): string => {
      const asString = typeof value === "symbol" ? value.toString() : `${value}`;
      const startsWithVowel = exampleType.match(/^[aeiou]/i);
      return `expected ${asString} ${invert ? 'NOT' : ''} to be considered a${startsWithVowel ? 'n' : ''} ${exampleType.toLowerCase()}`;
    };

    const expectedNotType = (value: any, exampleType: string): string => {
      return expectedType(value, exampleType, true);
    };

    describe("isArray", () => {
      it("should return true when given an Array", () => {
        forAllExamplesOf("Array", value => assert.isTrue(isArray(value), expectedType(value, "Array")));
      });

      it("should return false when not given an Array", () => {
        forAllExamplesExcept("Array", value => assert.isFalse(isArray(value), expectedNotType(value, "Array")));
      });
    });

    describe("isBoolean", () => {
      it("should return true when given an Boolean", () => {
        forAllExamplesOf("Boolean", value => assert.isTrue(isBoolean(value), expectedType(value, "Boolean")));
      });

      it("should return false when not given an Boolean", () => {
        forAllExamplesExcept("Boolean", value => assert.isFalse(isBoolean(value), expectedNotType(value, "Boolean")));
      });
    });

    describe("isDate", () => {
      it("should return true when given an Date", () => {
        forAllExamplesOf("Date", value => assert.isTrue(isDate(value), expectedType(value, "Date")));
      });

      it("should return false when not given an Date", () => {
        forAllExamplesExcept("Date", value => assert.isFalse(isDate(value), expectedNotType(value, "Date")));
      });
    });

    describe("isError", () => {
      it("should return true when given an Error", () => {
        forAllExamplesOf("Error", value => assert.isTrue(isError(value), expectedType(value, "Error")));
      });

      it("should return false when not given an Error", () => {
        forAllExamplesExcept("Error", value => assert.isFalse(isError(value), expectedNotType(value, "Error")));
      });
    });

    describe("isFunction", () => {
      it("should return true when given an Function", () => {
        forAllExamplesOf("Function", value => assert.isTrue(isFunction(value), expectedType(value, "Function")));
      });

      it("should return false when not given an Function", () => {
        forAllExamplesExcept("Function", value => assert.isFalse(isFunction(value), expectedNotType(value, "Function")));
      });
    });

    describe("isNumber", () => {
      it("should return true when given an Number", () => {
        forAllExamplesOf("Number", value => assert.isTrue(isNumber(value), expectedType(value, "Number")));
      });

      it("should return false when not given an Number", () => {
        forAllExamplesExcept("Number", value => assert.isFalse(isNumber(value), expectedNotType(value, "Number")));
      });
    });

    describe("isObject", () => {
      it("should return true when given an Object", () => {
        forAllExamplesOf("Object", value => assert.isTrue(isObject(value), expectedType(value, "Object")));
      });

      it("should return false when not given an Object", () => {
        forAllExamplesExcept("Object", value => assert.isFalse(isObject(value), expectedNotType(value, "Object")));
      });
    });

    describe("isRegExp", () => {
      it("should return true when given an RegExp", () => {
        forAllExamplesOf("RegExp", value => assert.isTrue(isRegExp(value), expectedType(value, "RegExp")));
      });

      it("should return false when not given an RegExp", () => {
        forAllExamplesExcept("RegExp", value => assert.isFalse(isRegExp(value), expectedNotType(value, "RegExp")));
      });
    });

    describe("isString", () => {
      it("should return true when given an String", () => {
        forAllExamplesOf("String", value => assert.isTrue(isString(value), expectedType(value, "String")));
      });

      it("should return false when not given an String", () => {
        forAllExamplesExcept("String", value => assert.isFalse(isString(value), expectedNotType(value, "String")));
      });
    });

    describe("isSymbol", () => {
      it("should return true when given an Symbol", () => {
        forAllExamplesOf("Symbol", value => assert.isTrue(isSymbol(value), expectedType(value, "Symbol")));
      });

      it("should return false when not given an Symbol", () => {
        forAllExamplesExcept("Symbol", value => assert.isFalse(isSymbol(value), expectedNotType(value, "Symbol")));
      });
    });
  });
});
