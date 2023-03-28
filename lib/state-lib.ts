export type Dispatch<State, Action> = (action: Action) => Promise<State>;

export type SyncDispatch<Action> = (action: Action) => void;

export type GetState<State> = () => State;

export type ActionMapping<State, Action> = (action: Action, dispatch: SyncDispatch<Action>, getState: GetState<State>) => Promise<State>;

export type Store<State, Action> = {
  dispatch: SyncDispatch<Action>;
  getState: () => State;
}
export type Reducer<State, Action> = (s: State, a: Action) => State

export function makeAsyncStore<State, Action>(actionMapping: ActionMapping<State, Action>, init: State, store: Store<State, Action>): [State, Dispatch<State, Action>] {
  const wrappedDispatch: (action: Action) => Promise<State>  = async (action: Action) => {
    return actionMapping(action, store.dispatch, store.getState);
  };

  return [init, wrappedDispatch];
}