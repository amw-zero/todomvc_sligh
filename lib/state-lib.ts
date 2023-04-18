export type Dispatch<State, Action> = (action: Action) => void;

export type SyncDispatch<Action> = (action: Action) => void;

export type GetState<State> = () => State;

export type ActionMapping<State, AsyncAction, SyncAction> = (action: AsyncAction, dispatch: SyncDispatch<SyncAction>, getState: GetState<State>) => void;

export type Store<State, Action> = {
  dispatch: SyncDispatch<Action>;
  getState: () => State;
}

export type Reducer<State, Action> = (s: State, a: Action) => State

export function makeAsyncStore<State, AsyncAction, SyncAction>(
  actionMapping: ActionMapping<State, AsyncAction, SyncAction>,
  init: State,
  store: Store<State, SyncAction>
): [State, Dispatch<State, AsyncAction>] {
  const wrappedDispatch = async (action: AsyncAction) => {
    actionMapping(action, store.dispatch, store.getState);
  };

  return [init, wrappedDispatch];
}