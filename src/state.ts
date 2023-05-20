import { createContext, useReducer } from "react";
import { makeAsyncStore, ActionMapping, Reducer, Dispatch } from "../lib/state-lib"
import { State, AsyncAction } from '../lib/state-async';

export function useAsyncReducer<State, AsyncAction, Action>(actionMapping: ActionMapping<State, AsyncAction, Action>, reducer: Reducer<State, Action>, init: State) {
  const [state, dispatch] = useReducer(reducer, init);
  const getState = () => state;

  const store = {
    dispatch,
    getState,
  }
    
  return makeAsyncStore(actionMapping, state, store);
}

const defaultState:  [State, Dispatch<State, AsyncAction>]= [{ isLoading: false, todos: []}, function() {}];
export const StateContext = createContext(defaultState)