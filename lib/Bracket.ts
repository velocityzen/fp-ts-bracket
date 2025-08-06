/**
 * The Bracket module provides provides a monadic interface over TE.bracket.
 *
 * @since 1.0.0
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */

import { Applicative2 } from "fp-ts/lib/Applicative";
import {
  Apply2,
  apFirst as apFirst_,
  apS as apS_,
  apSecond as apSecond_,
  sequenceS as sequenceS_,
  sequenceT as sequenceT_,
} from "fp-ts/lib/Apply";
import { Chain2, bind as bind_ } from "fp-ts/lib/Chain";
import * as E from "fp-ts/lib/Either";
import { FromEither2 } from "fp-ts/lib/FromEither";
import { FromIO2 } from "fp-ts/lib/FromIO";
import { FromTask2 } from "fp-ts/lib/FromTask";
import { pipe } from "fp-ts/lib/function";
import {
  Functor2,
  bindTo as bindTo_,
  flap as flap_,
  let as let_,
} from "fp-ts/lib/Functor";
import { IO } from "fp-ts/lib/IO";
import { Monad2 } from "fp-ts/lib/Monad";
import { MonadIO2 } from "fp-ts/lib/MonadIO";
import { MonadTask2 } from "fp-ts/lib/MonadTask";
import { NaturalTransformation22 } from "fp-ts/lib/NaturalTransformation";
import * as O from "fp-ts/lib/Option";
import { Pointed2 } from "fp-ts/lib/Pointed";
import * as RA from "fp-ts/lib/ReadonlyArray";
import * as RNEA from "fp-ts/lib/ReadonlyNonEmptyArray";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import {
  asUnit as asUnit_,
  as as as_,
  tapEither as tapEither_,
  tapIO as tapIO_,
  tapTask as tapTask_,
  tap as tap_,
} from "./internal";
import { dual } from "./internalGenreics";

/**
 * @category type lambdas
 * @since 1.0.0
 */
export const URI = "Bracket";

/**
 * @category type lambdas
 * @since 1.0.0
 */
export type URI = typeof URI;

declare module "fp-ts/HKT" {
  interface URItoKind2<E, A> {
    readonly [URI]: Bracket<E, A>;
  }
}

/**
 * @category model
 * @since 1.0.0
 */
export type Bracket<E, R> = <T>(
  use: (resource: R) => TE.TaskEither<E, T>,
) => TE.TaskEither<E, T>;

/**
 * Utility type for extraction Resource type from Bracket
 *
 * @category model
 * @since 1.0.0
 */
export type ResourceOf<B extends Bracket<any, any> | Bracket<never, any>> =
  B extends Bracket<any, infer R>
    ? R
    : B extends Bracket<never, infer R>
      ? R
      : never;

/**
 * @category instances
 * @since 1.0.0
 */
export const Bracket =
  <E, R>(
    acquire: TE.TaskEither<E, R>,
    dispose: (resource: R) => TE.TaskEither<E, void>,
  ): Bracket<E, R> =>
  (use) =>
    TE.bracket(acquire, use, dispose);

/**
 * @category utils
 * @since 1.0.0
 */
export const use =
  <E, R, T>(use: (r: R) => TE.TaskEither<E, T>) =>
  (bracket: Bracket<E, R>) =>
    bracket(use);

/**
 * @category instances
 * @since 1.0.0
 */
export const Pointed: Pointed2<URI> = {
  URI: URI,
  of: (x) => (use) => use(x),
};

/**
 * @category constructors
 * @since 1.0.0
 */
export const of: <E = never, T = never>(x: T) => Bracket<E, T> = Pointed.of;

/**
 * @category utils
 * @since 1.0.0
 */
export const noDispose = <E>(): TE.TaskEither<E, undefined> =>
  TE.of<E, undefined>(undefined);

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromIO = <E, R>(fa: IO<R>): Bracket<E, R> =>
  Bracket<E, R>(TE.fromIO(fa), noDispose);

/**
 * @category instances
 * @since 1.0.0
 */
export const FromIO: FromIO2<URI> = {
  URI,
  fromIO,
};

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromTask = <E, R>(fa: T.Task<R>) =>
  Bracket<E, R>(TE.fromTask(fa), noDispose);

/**
 * @category instances
 * @since 1.0.0
 */
export const FromTask: FromTask2<URI> = {
  URI,
  fromIO,
  fromTask,
};

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromTaskEither: NaturalTransformation22<TE.URI, URI> = <E, R>(
  fa: TE.TaskEither<E, R>,
) => Bracket<E, R>(fa, noDispose);

/**
 * alias for fromTaskEither
 *
 * @category constructors
 * @since 1.0.0
 */
export const fromAcquire = fromTaskEither;

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromEither = <E, R>(fa: E.Either<E, R>) =>
  Bracket<E, R>(TE.fromEither(fa), noDispose);

/**
 * @category instances
 * @since 1.0.0
 */
export const FromEither: FromEither2<URI> = {
  URI,
  fromEither,
};

/**
 * @category instances
 * @since 1.0.0
 */
export const Functor: Functor2<URI> = {
  URI: URI,
  map: (fa, f) => (use) => fa((a) => use(f(a))),
};

/**
 * @category mapping
 * @since 1.0.0
 */
export const map =
  <A, B>(f: (a: A) => B) =>
  <E>(fa: Bracket<E, A>) =>
    Functor.map(fa, f);

/**
 * Maps the value to the specified constant value.
 *
 * @category mapping
 * @since 1.0.0
 */
export const as: {
  <A>(a: A): <E, _>(self: Bracket<E, _>) => Bracket<E, A>;
  <E, A, _>(self: Bracket<E, _>, a: A): Bracket<E, A>;
} = dual(2, as_(Functor));

/**
 * @category mapping
 * @since 1.0.0
 */
export const flap = flap_(Functor);

/**
 * Maps every value to the void constant value.
 *
 * @category mapping
 * @since 1.0.0
 */
export const asUnit = asUnit_(Functor);

// -------------------------------------------------------------------------------------
// apply in sequence
// -------------------------------------------------------------------------------------

/**
 * @category instances
 * @since 1.0.0
 */
export const ApplySeq: Apply2<URI> = {
  ...Functor,
  ap: (fab, fa) => (use) => fab((ab) => fa((a) => use(ab(a)))),
};

/**
 * Runs computations sequentially.
 *
 * @category instances
 * @since 1.0.0
 */
export const ApplicativeSeq: Applicative2<URI> = {
  ...Pointed,
  ...ApplySeq,
};

/**
 * @category apply
 * @since 1.0.0
 */
export const apFirstSeq = apFirst_(ApplySeq);

/**
 * @category apply
 * @since 1.0.0
 */
export const apSecondSeq = apSecond_(ApplySeq);

/**
 * @category sequencing
 * @since 1.0.0
 */
export const sequenceTSeq = sequenceT_(ApplySeq);

/**
 * @category sequencing
 * @since 1.0.0
 */
export const sequenceSSeq = sequenceS_(ApplySeq);

// -------------------------------------------------------------------------------------
// apply in parallel
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 1.0.0
 */
export const ApplyPar: Apply2<URI> = {
  ...Functor,
  ap:
    <E, A, B>(fab: Bracket<E, (a: A) => B>, fa: Bracket<E, A>) =>
    <T>(use: (resource: B) => TE.TaskEither<E, T>): TE.TaskEither<E, T> =>
    () => {
      let ab: O.Option<(a: A) => B> = O.none;
      let a: O.Option<A> = O.none;

      let resolvedFa: O.Option<E.Either<E, T>> = O.none;
      let resolveFa = (value: E.Either<E, T>) => {
        resolvedFa = O.some(value);
      };

      let resolvedFab: O.Option<E.Either<E, T>> = O.none;
      let resolveFab = (value: E.Either<E, T>) => {
        resolvedFab = O.some(value);
      };

      const promiseFa = fa((x) => () => {
        if (O.isSome(resolvedFa)) {
          return Promise.resolve(resolvedFa.value);
        }
        if (O.isSome(ab)) {
          return use(ab.value(x))();
        }
        return new Promise<E.Either<E, T>>((resolve) => {
          a = O.some(x);
          resolveFa = resolve;
        });
      })().then((ea) => {
        resolveFab(ea);
        return ea;
      });

      const promiseFab = fab((f) => () => {
        if (O.isSome(resolvedFab)) {
          return Promise.resolve(resolvedFab.value);
        }
        if (O.isSome(a)) {
          return use(f(a.value))().then((ret) => {
            resolveFa(ret);
            return promiseFa.then((retFa) => pipe(retFa, E.apSecond(ret)));
          });
        }
        return new Promise<E.Either<E, T>>((resolve) => {
          ab = O.some(f);
          resolveFab = resolve;
        });
      })().then((eab) => {
        resolveFa(eab);
        return eab;
      });

      return Promise.all([promiseFab, promiseFa]).then(([eab]) => eab);
    },
};

/**
 * @category instances
 * @since 1.0.0
 */
export const ApplicativePar: Applicative2<URI> = { ...Pointed, ...ApplyPar };

/**
 * @category apply
 * @since 1.0.0
 */
export const ap =
  <E, A>(fa: Bracket<E, A>) =>
  <B>(fab: Bracket<E, (a: A) => B>) =>
    ApplyPar.ap(fab, fa);

/**
 * @category apply
 * @since 1.0.0
 */
export const apFirst = apFirst_(ApplyPar);

/**
 * @category apply
 * @since 1.0.0
 */
export const apSecond = apSecond_(ApplyPar);

/**
 * @category sequencing
 * @since 1.0.0
 */
export const sequenceT = sequenceT_(ApplyPar);

/**
 * @category sequencing
 * @since 1.0.0
 */
export const sequenceS = sequenceS_(ApplyPar);

// -------------------------------------------------------------------------------------
// monad
// -------------------------------------------------------------------------------------

/**
 * @category instances
 * @since 1.0.0
 */
export const Chain: Chain2<URI> = {
  ...ApplySeq,
  chain: (fa, f) => (use) => fa((a) => f(a)(use)),
};

/**
 * @category instances
 * @since 1.0.0
 */
export const Monad: Monad2<URI> = {
  ...Pointed,
  ...Chain,
};

/**
 * @category instances
 * @since 1.0.0
 */
export const MonadIO: MonadIO2<URI> = {
  ...Monad,
  fromIO,
};

/**
 * @category instances
 * @since 1.0.0
 */
export const MonadTask: MonadTask2<URI> = {
  ...MonadIO,
  fromTask,
};

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMap =
  <E, A, B>(f: (a: A) => Bracket<E, B>) =>
  (fa: Bracket<E, A>) =>
    Chain.chain(fa, f);

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 1.0.0
 */
export const tap: {
  <A, E, _>(self: Bracket<E, A>, f: (a: A) => Bracket<E, _>): Bracket<E, A>;
  <A, E, _>(f: (a: A) => Bracket<E, _>): (self: Bracket<E, A>) => Bracket<E, A>;
} = /*#__PURE__*/ dual(2, tap_(Chain));

/**
 * @category combinators
 * @since 1.0.0
 */
export const tapIO: {
  <A, _>(f: (a: A) => IO<_>): <E>(self: Bracket<E, A>) => Bracket<E, A>;
  <E, A, _>(self: Bracket<E, A>, f: (a: A) => IO<_>): Bracket<E, A>;
} = /*#__PURE__*/ dual(2, tapIO_(FromIO, Chain));

/**
 * @category combinators
 * @since 1.0.0
 */
export const tapEither: {
  <A, E2, _>(
    f: (a: A) => E.Either<E2, _>,
  ): <E1>(self: Bracket<E1, A>) => Bracket<E2 | E1, A>;
  <E1, A, E2, _>(
    self: Bracket<E1, A>,
    f: (a: A) => E.Either<E2, _>,
  ): Bracket<E1 | E2, A>;
} = /*#__PURE__*/ dual(2, tapEither_(FromEither, Chain));

/**
 * @category combinators
 * @since 1.0.0
 */
export const tapTask: {
  <A, _>(f: (a: A) => T.Task<_>): <E>(self: Bracket<E, A>) => Bracket<E, A>;
  <E, A, _>(self: Bracket<E, A>, f: (a: A) => T.Task<_>): Bracket<E, A>;
} = /*#__PURE__*/ dual(2, tapTask_(FromTask, Chain));

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------

/**
 * @category do notation
 * @since 1.0.0
 */
export const Do = of({});

/**
 * @category do notation
 * @since 1.0.0
 */
export const bind = bind_(Chain);

/**
 * @category do notation
 * @since 1.0.0
 */
export const bindTo = bindTo_(Functor);

const _let = let_(Functor);
export {
  /**
   * @category do notation
   * @since 1.0.0
   */
  _let as let,
};

/**
 * @category do notation
 * @since 1.0.0
 */
export const apS = apS_(ApplyPar);

/**
 * @category do notation
 * @since 1.0.0
 */
export const apSSeq = apS_(ApplySeq);

// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------

// In parallel

/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @category traversing
 * @since 1.0.0
 */
export const traverseReadonlyNonEmptyArrayWithIndex =
  RNEA.traverseWithIndex(ApplicativePar);

/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @category traversing
 * @since 1.0.0
 */
export const traverseReadonlyArrayWithIndex =
  RA.traverseWithIndex(ApplicativePar);

/**
 * Equivalent to `ReadonlyArray#traverse(ApplicativePar)`.
 *
 * @category traversing
 * @since 1.0.0
 */
export const traverseArray = RA.traverse(ApplicativePar);

/**
 * Equivalent to `ReadonlyArray#sequence(ApplicativePar)`.
 *
 * @category traversing
 * @since 1.0.0
 */
export const sequenceArray = RA.sequence(ApplicativePar);

// In sequence

/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 1.0.0
 */
export const traverseSeqReadonlyNonEmptyArrayWithIndex =
  RNEA.traverseWithIndex(ApplicativeSeq);

/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 1.0.0
 */
export const traverseSeqReadonlyArrayWithIndex =
  RA.traverseWithIndex(ApplicativeSeq);

/**
 * Equivalent to `ReadonlyArray#traverse(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 1.0.0
 */
export const traverseSeqArray = RA.traverse(ApplicativeSeq);

/**
 * Equivalent to `ReadonlyArray#sequence(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 1.0.0
 */
export const sequenceSeqArray = RA.sequence(ApplicativeSeq);
