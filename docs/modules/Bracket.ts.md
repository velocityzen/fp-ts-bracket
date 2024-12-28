---
title: Bracket.ts
nav_order: 1
parent: Modules
---

## Bracket overview

The Bracket module provides provides a monadic interface over TE.bracket.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [apply](#apply)
  - [ap](#ap)
  - [apFirst](#apfirst)
  - [apFirstSeq](#apfirstseq)
  - [apSecond](#apsecond)
  - [apSecondSeq](#apsecondseq)
- [combinators](#combinators)
  - [tap](#tap)
  - [tapEither](#tapeither)
  - [tapIO](#tapio)
  - [tapTask](#taptask)
- [constructor](#constructor)
  - [fromAcquire](#fromacquire)
- [constructors](#constructors)
  - [of](#of)
- [conversions](#conversions)
  - [fromEither](#fromeither)
  - [fromIO](#fromio)
  - [fromTask](#fromtask)
  - [fromTaskEither](#fromtaskeither)
  - [use](#use)
- [do notation](#do-notation)
  - [Do](#do)
  - [apS](#aps)
  - [apSSeq](#apsseq)
  - [bind](#bind)
  - [bindTo](#bindto)
  - [let](#let)
- [instances](#instances)
  - [ApplicativePar](#applicativepar)
  - [ApplicativeSeq](#applicativeseq)
  - [ApplyPar](#applypar)
  - [ApplySeq](#applyseq)
  - [Bracket](#bracket)
  - [Chain](#chain)
  - [FromEither](#fromeither)
  - [FromIO](#fromio)
  - [FromTask](#fromtask)
  - [Functor](#functor)
  - [Monad](#monad)
  - [MonadIO](#monadio)
  - [MonadTask](#monadtask)
  - [Pointed](#pointed)
- [mapping](#mapping)
  - [as](#as)
  - [asUnit](#asunit)
  - [flap](#flap)
  - [map](#map)
- [model](#model)
  - [Bracket (type alias)](#bracket-type-alias)
  - [ResourceOf (type alias)](#resourceof-type-alias)
- [sequencing](#sequencing)
  - [flatMap](#flatmap)
  - [sequenceS](#sequences)
  - [sequenceSSeq](#sequencesseq)
  - [sequenceT](#sequencet)
  - [sequenceTSeq](#sequencetseq)
- [traversing](#traversing)
  - [sequenceArray](#sequencearray)
  - [sequenceSeqArray](#sequenceseqarray)
  - [traverseArray](#traversearray)
  - [traverseReadonlyArrayWithIndex](#traversereadonlyarraywithindex)
  - [traverseReadonlyNonEmptyArrayWithIndex](#traversereadonlynonemptyarraywithindex)
  - [traverseSeqArray](#traverseseqarray)
  - [traverseSeqReadonlyArrayWithIndex](#traverseseqreadonlyarraywithindex)
  - [traverseSeqReadonlyNonEmptyArrayWithIndex](#traverseseqreadonlynonemptyarraywithindex)
- [type lambdas](#type-lambdas)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
- [utils](#utils)
  - [noDispose](#nodispose)

---

# apply

## ap

**Signature**

```ts
export declare const ap: <E, A>(fa: Bracket<E, A>) => <B>(fab: Bracket<E, (a: A) => B>) => Bracket<E, B>
```

Added in v1.0.0

## apFirst

**Signature**

```ts
export declare const apFirst: <E, B>(second: Bracket<E, B>) => <A>(first: Bracket<E, A>) => Bracket<E, A>
```

Added in v1.0.0

## apFirstSeq

**Signature**

```ts
export declare const apFirstSeq: <E, B>(second: Bracket<E, B>) => <A>(first: Bracket<E, A>) => Bracket<E, A>
```

Added in v1.0.0

## apSecond

**Signature**

```ts
export declare const apSecond: <E, B>(second: Bracket<E, B>) => <A>(first: Bracket<E, A>) => Bracket<E, B>
```

Added in v1.0.0

## apSecondSeq

**Signature**

```ts
export declare const apSecondSeq: <E, B>(second: Bracket<E, B>) => <A>(first: Bracket<E, A>) => Bracket<E, B>
```

Added in v1.0.0

# combinators

## tap

Composes computations in sequence, using the return value of one computation to determine the next computation and
keeping only the result of the first.

**Signature**

```ts
export declare const tap: {
  <A, E, _>(self: Bracket<E, A>, f: (a: A) => Bracket<E, _>): Bracket<E, A>
  <A, E, _>(f: (a: A) => Bracket<E, _>): (self: Bracket<E, A>) => Bracket<E, A>
}
```

Added in v1.0.0

## tapEither

**Signature**

```ts
export declare const tapEither: {
  <A, E2, _>(f: (a: A) => E.Either<E2, _>): <E1>(self: Bracket<E1, A>) => Bracket<E2 | E1, A>
  <E1, A, E2, _>(self: Bracket<E1, A>, f: (a: A) => E.Either<E2, _>): Bracket<E1 | E2, A>
}
```

Added in v1.0.0

## tapIO

**Signature**

```ts
export declare const tapIO: {
  <A, _>(f: (a: A) => IO<_>): <E>(self: Bracket<E, A>) => Bracket<E, A>
  <E, A, _>(self: Bracket<E, A>, f: (a: A) => IO<_>): Bracket<E, A>
}
```

Added in v1.0.0

## tapTask

**Signature**

```ts
export declare const tapTask: {
  <A, _>(f: (a: A) => T.Task<_>): <E>(self: Bracket<E, A>) => Bracket<E, A>
  <E, A, _>(self: Bracket<E, A>, f: (a: A) => T.Task<_>): Bracket<E, A>
}
```

Added in v1.0.0

# constructor

## fromAcquire

alias for fromTaskEither

**Signature**

```ts
export declare const fromAcquire: NaturalTransformation22<'TaskEither', 'Bracket'>
```

Added in v1.0.0

# constructors

## of

**Signature**

```ts
export declare const of: <E = never, T = never>(x: T) => Bracket<E, T>
```

Added in v1.0.0

# conversions

## fromEither

**Signature**

```ts
export declare const fromEither: <E, R>(fa: E.Either<E, R>) => Bracket<E, R>
```

Added in v1.0.0

## fromIO

**Signature**

```ts
export declare const fromIO: <E, R>(fa: IO<R>) => Bracket<E, R>
```

Added in v1.0.0

## fromTask

**Signature**

```ts
export declare const fromTask: <E, R>(fa: T.Task<R>) => Bracket<E, R>
```

Added in v1.0.0

## fromTaskEither

**Signature**

```ts
export declare const fromTaskEither: NaturalTransformation22<'TaskEither', 'Bracket'>
```

Added in v1.0.0

## use

**Signature**

```ts
export declare const use: <E, R, T>(
  use: (r: R) => TE.TaskEither<E, T>
) => (bracket: Bracket<E, R>) => TE.TaskEither<E, T>
```

Added in v1.0.0

# do notation

## Do

**Signature**

```ts
export declare const Do: Bracket<never, {}>
```

Added in v1.0.0

## apS

**Signature**

```ts
export declare const apS: <N, A, E, B>(
  name: Exclude<N, keyof A>,
  fb: Bracket<E, B>
) => (fa: Bracket<E, A>) => Bracket<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## apSSeq

**Signature**

```ts
export declare const apSSeq: <N, A, E, B>(
  name: Exclude<N, keyof A>,
  fb: Bracket<E, B>
) => (fa: Bracket<E, A>) => Bracket<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## bind

**Signature**

```ts
export declare const bind: <N, A, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Bracket<E, B>
) => (ma: Bracket<E, A>) => Bracket<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## bindTo

**Signature**

```ts
export declare const bindTo: <N>(name: N) => <E, A>(fa: Bracket<E, A>) => Bracket<E, { readonly [K in N]: A }>
```

Added in v1.0.0

## let

**Signature**

```ts
export declare const let: <N, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => <E>(fa: Bracket<E, A>) => Bracket<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

# instances

## ApplicativePar

**Signature**

```ts
export declare const ApplicativePar: Applicative2<'Bracket'>
```

Added in v1.0.0

## ApplicativeSeq

Runs computations sequentially.

**Signature**

```ts
export declare const ApplicativeSeq: Applicative2<'Bracket'>
```

Added in v1.0.0

## ApplyPar

**Signature**

```ts
export declare const ApplyPar: Apply2<'Bracket'>
```

Added in v1.0.0

## ApplySeq

**Signature**

```ts
export declare const ApplySeq: Apply2<'Bracket'>
```

Added in v1.0.0

## Bracket

**Signature**

```ts
export declare const Bracket: <E, R>(
  acquire: TE.TaskEither<E, R>,
  dispose: (resource: R) => TE.TaskEither<E, void>
) => Bracket<E, R>
```

Added in v1.0.0

## Chain

**Signature**

```ts
export declare const Chain: Chain2<'Bracket'>
```

Added in v1.0.0

## FromEither

**Signature**

```ts
export declare const FromEither: FromEither2<'Bracket'>
```

Added in v1.0.0

## FromIO

**Signature**

```ts
export declare const FromIO: FromIO2<'Bracket'>
```

Added in v1.0.0

## FromTask

**Signature**

```ts
export declare const FromTask: FromTask2<'Bracket'>
```

Added in v1.0.0

## Functor

**Signature**

```ts
export declare const Functor: Functor2<'Bracket'>
```

Added in v1.0.0

## Monad

**Signature**

```ts
export declare const Monad: Monad2<'Bracket'>
```

Added in v1.0.0

## MonadIO

**Signature**

```ts
export declare const MonadIO: MonadIO2<'Bracket'>
```

Added in v1.0.0

## MonadTask

**Signature**

```ts
export declare const MonadTask: MonadTask2<'Bracket'>
```

Added in v1.0.0

## Pointed

**Signature**

```ts
export declare const Pointed: Pointed2<'Bracket'>
```

Added in v1.0.0

# mapping

## as

Maps the value to the specified constant value.

**Signature**

```ts
export declare const as: {
  <A>(a: A): <E, _>(self: Bracket<E, _>) => Bracket<E, A>
  <E, A, _>(self: Bracket<E, _>, a: A): Bracket<E, A>
}
```

Added in v1.0.0

## asUnit

Maps every value to the void constant value.

**Signature**

```ts
export declare const asUnit: <E, _>(self: Bracket<E, _>) => Bracket<E, void>
```

Added in v1.0.0

## flap

**Signature**

```ts
export declare const flap: <A>(a: A) => <E, B>(fab: Bracket<E, (a: A) => B>) => Bracket<E, B>
```

Added in v1.0.0

## map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: Bracket<E, A>) => Bracket<E, B>
```

Added in v1.0.0

# model

## Bracket (type alias)

**Signature**

```ts
export type Bracket<E, R> = <T>(use: (resource: R) => TE.TaskEither<E, T>) => TE.TaskEither<E, T>
```

Added in v1.0.0

## ResourceOf (type alias)

Utility type for extraction Resource type from Bracket

**Signature**

```ts
export type ResourceOf<B extends Bracket<any, any> | Bracket<never, any>> = B extends Bracket<any, infer R>
  ? R
  : B extends Bracket<never, infer R>
  ? R
  : never
```

Added in v1.0.0

# sequencing

## flatMap

**Signature**

```ts
export declare const flatMap: <E, A, B>(f: (a: A) => Bracket<E, B>) => (fa: Bracket<E, A>) => Bracket<E, B>
```

Added in v1.0.0

## sequenceS

**Signature**

```ts
export declare const sequenceS: <E, NER>(
  r: (keyof NER extends never ? never : NER) & Record<string, Bracket<E, any>>
) => Bracket<E, { [K in keyof NER]: [NER[K]] extends [Bracket<any, infer A>] ? A : never }>
```

Added in v1.0.0

## sequenceSSeq

**Signature**

```ts
export declare const sequenceSSeq: <E, NER>(
  r: (keyof NER extends never ? never : NER) & Record<string, Bracket<E, any>>
) => Bracket<E, { [K in keyof NER]: [NER[K]] extends [Bracket<any, infer A>] ? A : never }>
```

Added in v1.0.0

## sequenceT

**Signature**

```ts
export declare const sequenceT: <E, T>(
  ...t: T & { readonly 0: Bracket<E, any> }
) => Bracket<E, { [K in keyof T]: [T[K]] extends [Bracket<E, infer A>] ? A : never }>
```

Added in v1.0.0

## sequenceTSeq

**Signature**

```ts
export declare const sequenceTSeq: <E, T>(
  ...t: T & { readonly 0: Bracket<E, any> }
) => Bracket<E, { [K in keyof T]: [T[K]] extends [Bracket<E, infer A>] ? A : never }>
```

Added in v1.0.0

# traversing

## sequenceArray

Equivalent to `ReadonlyArray#sequence(ApplicativePar)`.

**Signature**

```ts
export declare const sequenceArray: <E, A>(ta: readonly Bracket<E, A>[]) => Bracket<E, readonly A[]>
```

Added in v1.0.0

## sequenceSeqArray

Equivalent to `ReadonlyArray#sequence(ApplicativeSeq)`.

**Signature**

```ts
export declare const sequenceSeqArray: <E, A>(ta: readonly Bracket<E, A>[]) => Bracket<E, readonly A[]>
```

Added in v1.0.0

## traverseArray

Equivalent to `ReadonlyArray#traverse(ApplicativePar)`.

**Signature**

```ts
export declare const traverseArray: <A, FE, B>(
  f: (a: A) => Bracket<FE, B>
) => (ta: readonly A[]) => Bracket<FE, readonly B[]>
```

Added in v1.0.0

## traverseReadonlyArrayWithIndex

Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativePar)`.

**Signature**

```ts
export declare const traverseReadonlyArrayWithIndex: <A, E, B>(
  f: (i: number, a: A) => Bracket<E, B>
) => (ta: readonly A[]) => Bracket<E, readonly B[]>
```

Added in v1.0.0

## traverseReadonlyNonEmptyArrayWithIndex

Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativePar)`.

**Signature**

```ts
export declare const traverseReadonlyNonEmptyArrayWithIndex: <A, E, B>(
  f: (i: number, a: A) => Bracket<E, B>
) => (ta: RNEA.ReadonlyNonEmptyArray<A>) => Bracket<E, RNEA.ReadonlyNonEmptyArray<B>>
```

Added in v1.0.0

## traverseSeqArray

Equivalent to `ReadonlyArray#traverse(ApplicativeSeq)`.

**Signature**

```ts
export declare const traverseSeqArray: <A, FE, B>(
  f: (a: A) => Bracket<FE, B>
) => (ta: readonly A[]) => Bracket<FE, readonly B[]>
```

Added in v1.0.0

## traverseSeqReadonlyArrayWithIndex

Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.

**Signature**

```ts
export declare const traverseSeqReadonlyArrayWithIndex: <A, E, B>(
  f: (i: number, a: A) => Bracket<E, B>
) => (ta: readonly A[]) => Bracket<E, readonly B[]>
```

Added in v1.0.0

## traverseSeqReadonlyNonEmptyArrayWithIndex

Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativeSeq)`.

**Signature**

```ts
export declare const traverseSeqReadonlyNonEmptyArrayWithIndex: <A, E, B>(
  f: (i: number, a: A) => Bracket<E, B>
) => (ta: RNEA.ReadonlyNonEmptyArray<A>) => Bracket<E, RNEA.ReadonlyNonEmptyArray<B>>
```

Added in v1.0.0

# type lambdas

## URI

**Signature**

```ts
export declare const URI: 'Bracket'
```

Added in v1.0.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v1.0.0

# utils

## noDispose

**Signature**

```ts
export declare const noDispose: <E>() => TE.TaskEither<E, undefined>
```

Added in v1.0.0
