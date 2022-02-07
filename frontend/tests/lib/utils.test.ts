import { describe, it } from "mocha";
import { assert } from "chai";
import { uniqInPlace } from "@/lib/utils";

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
});
