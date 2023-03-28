export type Dispatch<State, Action> = (action: Action) => Promise<State>;
export type SyncDispatch<Action> = (action: Action) => void;
export type GetState<State> = () => State;
export type ActionMapping<State, Action> = (action: Action, dispatch: SyncDispatch<Action>, getState: GetState<State>) => Promise<State>;

export type Reducer<State, Action> = (s: State, a: Action) => State

export function makeState<State, Action>(actionMapping: ActionMapping<State, Action>, init: State, dispatch: SyncDispatch<Action>, getState: GetState<State>): [State, Dispatch<State, Action>] {
  const wrappedDispatch: (action: Action) => Promise<State>  = async (action: Action) => {
    return actionMapping(action, dispatch, getState);
  };

  return [init, wrappedDispatch];
}