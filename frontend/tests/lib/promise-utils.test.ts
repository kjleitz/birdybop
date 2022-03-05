import { debouncePromise, promiseDebouncer } from "@/lib/promise-utils";
import { describe, it, assert } from "vitest";

describe("promise-utils", () => {
  describe("debouncePromise", () => {
    it("should only execute one promise at a time for a given key when multiple are done simultaneously", (done) => {
      let callCount = 0;
      const makePromise = () => new Promise<number>((resolve, _reject) => {
        callCount += 1;
        setTimeout(() => { resolve(callCount) }, 30);
      });

      const doTheThingZhuLi = () => {
        const key = "promise-utils.test.ts#makePromise";
        return debouncePromise(key, () => makePromise());
      };

      const promise1 = doTheThingZhuLi();
      const promise2 = doTheThingZhuLi();
      const promise3 = doTheThingZhuLi();

      Promise.all([
        promise1.then((value1) => {
          assert.equal(value1, 1);
        }),

        promise2.then((value2) => {
          assert.equal(value2, 1);
        }),

        promise3.then((value3) => {
          assert.equal(value3, 1);
        }),
      ]).then(() => {
        done();
      });
    });

    it("should only execute one promise at a time for a given key when done in sequence while the first is still executing", (done) => {
      let callCount = 0;
      let resolveIt = () => { /* ... */ };
      const makePromise = () => new Promise<number>((resolve, _reject) => {
        callCount += 1;
        resolveIt = () => { resolve(callCount) };
      });

      const doTheThingZhuLi = () => {
        const key = "promise-utils.test.ts#makePromise";
        return debouncePromise(key, () => makePromise());
      };

      const promise1 = doTheThingZhuLi();

      setTimeout(() => {
        const promise2 = doTheThingZhuLi();

        setTimeout(() => {
          const promise3 = doTheThingZhuLi();

          setTimeout(() => {
            resolveIt();

            Promise.all([
              promise1.then((value1) => {
                assert.equal(value1, 1);
              }),

              promise2.then((value2) => {
                assert.equal(value2, 1);
              }),

              promise3.then((value3) => {
                assert.equal(value3, 1);
              }),
            ]).then(() => {
              done();
            });
          }, 10);
        }, 10);
      }, 10);
    });

    it("should execute again if it's called after the running one has finished", (done) => {
      let callCount = 0;
      let resolveIt = () => { /* ... */ };
      const makePromise = () => new Promise<number>((resolve, _reject) => {
        callCount += 1;
        resolveIt = () => { resolve(callCount) };
      });

      const doTheThingZhuLi = () => {
        const key = "promise-utils.test.ts#makePromise";
        return debouncePromise(key, () => makePromise());
      };

      const promise1 = doTheThingZhuLi();

      setTimeout(() => {
        const promise2 = doTheThingZhuLi();

        setTimeout(() => {
          const promise3 = doTheThingZhuLi();

          setTimeout(() => {
            Promise.all([
              promise1.then((value1) => {
                assert.equal(value1, 1);
              }),

              promise2.then((value2) => {
                assert.equal(value2, 1);
              }),

              promise3.then((value3) => {
                assert.equal(value3, 1);
              }),
            ]).then(() => {
              const latePromise = doTheThingZhuLi();

              latePromise.then((valueLate) => {
                assert.equal(valueLate, 2);
                done();
              });

              resolveIt();
            });

            resolveIt();
          }, 10);
        }, 10);
      }, 10);
    });

    it("should execute again if it's called after the running one has caught", (done) => {
      let callCount = 0;
      let resolveIt = () => { /* ... */ };
      let rejectIt = () => { /* ... */ };
      const makePromise = () => new Promise<number>((resolve, reject) => {
        callCount += 1;
        resolveIt = () => { resolve(callCount) };
        rejectIt = () => { reject(callCount) };
      });

      const doTheThingZhuLi = () => {
        const key = "promise-utils.test.ts#makePromise";
        return debouncePromise(key, () => makePromise());
      };

      const promise1 = doTheThingZhuLi();

      setTimeout(() => {
        const promise2 = doTheThingZhuLi();

        setTimeout(() => {
          const promise3 = doTheThingZhuLi();

          setTimeout(() => {
            Promise.allSettled([
              promise1.catch((value1) => {
                assert.equal(value1, 1);
              }),

              promise2.catch((value2) => {
                assert.equal(value2, 1);
              }),

              promise3.catch((value3) => {
                assert.equal(value3, 1);
              }),
            ]).then(() => {
              const latePromise = doTheThingZhuLi();

              latePromise.then((valueLate) => {
                assert.equal(valueLate, 2);
                done();
              });

              resolveIt();
            });

            rejectIt();
          }, 10);
        }, 10);
      }, 10);
    });

    it("should not debounce for different keys given", (done) => {
      let callCount = 0;
      const makePromise = () => new Promise<number>((resolve, _reject) => {
        callCount += 1;
        setTimeout(() => { resolve(callCount) }, 30);
      });

      const originalKey = "promise-utils.test.ts#makePromise";
      let key = originalKey;
      const doTheThingZhuLi = () => {
        key = `${key}!`;
        return debouncePromise(key, () => makePromise());
      };

      const promise1 = doTheThingZhuLi();
      assert.equal(key, `${originalKey}!`);

      const promise2 = doTheThingZhuLi();
      assert.equal(key, `${originalKey}!!`);

      const promise3 = doTheThingZhuLi();
      assert.equal(key, `${originalKey}!!!`);

      Promise.all([
        promise1.then((value1) => {
          assert.equal(value1, 3);
        }),

        promise2.then((value2) => {
          assert.equal(value2, 3);
        }),

        promise3.then((value3) => {
          assert.equal(value3, 3);
        }),
      ]).then(() => {
        done();
      });
    });
  });

  describe("promiseDebouncer", () => {
    it("should wrap a function to debounce the promise it returns", (done) => {
      let callCount = 0;
      const makePromise = () => new Promise<number>((resolve, _reject) => {
        callCount += 1;
        setTimeout(() => { resolve(callCount) }, 30);
      });

      const doTheThingZhuLi = promiseDebouncer(() => makePromise());

      const promise1 = doTheThingZhuLi();
      const promise2 = doTheThingZhuLi();
      const promise3 = doTheThingZhuLi();

      Promise.all([
        promise1.then((value1) => {
          assert.equal(value1, 1);
        }),

        promise2.then((value2) => {
          assert.equal(value2, 1);
        }),

        promise3.then((value3) => {
          assert.equal(value3, 1);
        }),
      ]).then(() => {
        const latePromise = doTheThingZhuLi();

        latePromise.then((valueLate) => {
          assert.equal(valueLate, 2);
          done();
        });
      });
    });

    it("should not debounce between different returned functions", (done) => {
      let callCount = 0;
      const makePromise = () => new Promise<number>((resolve, _reject) => {
        callCount += 1;
        setTimeout(() => { resolve(callCount) }, 30);
      });

      const doTheThingZhuLi = promiseDebouncer(() => makePromise());
      const doTheThingAgainZhuLi = promiseDebouncer(() => makePromise());

      const promise1 = doTheThingZhuLi();
      const promise2 = doTheThingZhuLi();
      const promise3 = doTheThingZhuLi();

      const promise4 = doTheThingAgainZhuLi();
      const promise5 = doTheThingAgainZhuLi();
      const promise6 = doTheThingAgainZhuLi();

      Promise.all([
        promise1.then((value1) => {
          assert.equal(value1, 2);
        }),

        promise2.then((value2) => {
          assert.equal(value2, 2);
        }),

        promise3.then((value3) => {
          assert.equal(value3, 2);
        }),

        promise4.then((value4) => {
          assert.equal(value4, 2);
        }),

        promise5.then((value5) => {
          assert.equal(value5, 2);
        }),

        promise6.then((value6) => {
          assert.equal(value6, 2);
        }),
      ]).then(() => {
        const latePromise = doTheThingZhuLi();

        latePromise.then((valueLate) => {
          assert.equal(valueLate, 3);
          done();
        });
      });
    });
  });
});
