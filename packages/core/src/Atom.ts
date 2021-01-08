import {
  createActionCreator,
  createMemo,
  createPatch,
  IAction,
  IAtom,
  IAtomCache,
  IComputerReducer,
  KIND,
} from './internal'

export function Atom<State>(computer: IComputerReducer<State>): IAtom<State> {
  // TODO: 🤔
  // if (typeof computer !== 'function') {
  //   const update = declareAction()
  //   return Object.assign(
  //     Atom(($, state = computer) => $(state, update)),
  //     { update },
  //   )
  // }
  function atom(action: IAction, state?: State): IAtomCache<State> {
    return (
      action.memo ??
      createMemo({
        action,
        cache: new WeakMap().set(
          atom,
          createPatch({
            deps: [createActionCreator(action.type)],
            state,
            types: new Set<string>().add(action.type),
          }),
        ),
        patch: new Map(),
      })
    )(atom)
  }
  atom[KIND] = 'atom' as const
  atom.computer = computer

  return atom
}
