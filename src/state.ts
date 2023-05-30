import { useReducer } from "react";
import { createContext } from "use-context-selector";
import { makeAsyncStore, ActionMapping, Reducer, Dispatch } from "../lib/state-lib"
import { State, AsyncAction } from '../lib/appstate';
import { Monitor } from '../lib/observe';

export function useAsyncReducer<State, AsyncAction, Action>(actionMapping: ActionMapping<State, AsyncAction, Action>, reducer: Reducer<State, Action>, init: State) {
  const [state, dispatch] = useReducer(reducer, init);
  const getState = () => state;

  const store = {
    dispatch,
    getState,
  };

  const monitor = new Monitor<State>();
    
  return makeAsyncStore(actionMapping, state, store, monitor);
}

const defaultState:  [State, Dispatch<State, AsyncAction>]= [{ isLoading: false, todos: []}, function() {}];
export const StateContext = createContext(defaultState)