import * as E from "fp-ts/lib/Either";
import * as A from "fp-ts/lib/Array";
import { constVoid, identity, pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { describe, expect, test } from "vitest";
import * as B from "../lib/Bracket";
import { testTaskEither } from "./helpers";

// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
const TEVoid = TE.of(constVoid());
const disposeVoid = () => TEVoid;

function expectFrom<E, R>(brackets: B.Bracket<E, R>[]) {
  return <T>(
    consume: (r: R) => TE.TaskEither<E, T>,
    expect: (values: readonly T[]) => void,
  ) =>
    pipe(
      brackets,
      A.map((bracket) => bracket(consume)),
      TE.sequenceArray,
      TE.map(expect),
    );
}

describe("Bracket", () => {
  testTaskEither("aquire and dispose a resource", () => {
    let resource = 0;
    const acquire = () => Promise.resolve(E.right(resource++));
    const dispose = () => {
      resource--;
      return TEVoid;
    };

    const withBracket = B.Bracket<Error, number>(acquire, dispose);

    return pipe(
      withBracket((n) => {
        expect(resource).toBe(1);
        expect(n).toBe(0);
        return TEVoid;
      }),
      TE.tapIO(() => () => {
        expect(resource).toBe(0);
      }),
    );
  });

  let resource = 0;
  const acquire = () => {
    resource++;
    return Promise.resolve(E.right("test"));
  };
  const dispose = () => {
    resource--;
    return TEVoid;
  };

  testTaskEither("Functor identity", () => {
    const expectIdentity = expectFrom([
      B.Bracket(acquire, dispose),
      pipe(B.Bracket(acquire, dispose), B.map(identity)),
    ]);

    return expectIdentity(
      (v) => TE.of(v),
      (values) => {
        expect(values[0]).toBe(values[1]);
      },
    );
  });

  testTaskEither("Functor composition", () => {
    const f = (str: string) => `${str} ${str.length}`;
    const g = (str: string) => `${str.length} ${str}`;

    const expectComposition = expectFrom([
      pipe(B.Bracket(acquire, dispose), B.map(f), B.map(g)),
      pipe(
        B.Bracket(acquire, dispose),
        B.map((n) => pipe(n, f, g)),
      ),
    ]);

    return expectComposition(
      (v) => TE.of(v),
      (values) => {
        expect(values[0]).toBe(values[1]);
      },
    );
  });

  testTaskEither("flatMap associativity", () => {
    const f = (str: string) => `${str} ${str.length}`;
    const g = (str: string) => `${str.length} ${str}`;

    const expectComposition = expectFrom([
      pipe(
        // ( a > f ) > g
        B.Bracket(acquire, dispose),
        B.flatMap((r) => B.Bracket(TE.of(f(r)), disposeVoid)),
        B.flatMap((r) => B.Bracket(TE.of(g(r)), disposeVoid)),
      ),
      pipe(
        // a > (f > g)
        B.Bracket(acquire, dispose),
        B.flatMap((r) =>
          pipe(
            B.Bracket(TE.of(f(r)), disposeVoid),
            B.flatMap((r) => B.Bracket(TE.of(g(r)), disposeVoid)),
          ),
        ),
      ),
    ]);

    return expectComposition(
      (v) => TE.of(v),
      (values) => {
        expect(values[0]).toBe(values[1]);
      },
    );
  });

  testTaskEither("of", () => {
    const expectComposition = expectFrom([
      B.Bracket(acquire, dispose),
      B.of("test"),
    ]);

    return expectComposition(
      (v) => TE.of(v),
      (values) => {
        expect(values[0]).toBe(values[1]);
      },
    );
  });

  test("All resources disposed", () => {
    expect(resource).toBe(0);
  });
});
