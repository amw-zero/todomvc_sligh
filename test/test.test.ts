import { expect, test } from 'vitest';
import { reducer, CreateTodoAction, State, Action, actionMapping } from '../lib/state-async';
import { Reducer, Store, makeAsyncStore } from "../lib/state-lib";
import fc from "fast-check";

function testAction(init: State, action: Action, assertion: (s: State) => void, description: string) {
  test(description, async () => {
    const store = makeTestStore(reducer, init);
    const [_, dispatch] = makeAsyncStore(actionMapping, init, store);

    await dispatch(action);

    assertion(store.getState());
  })  
}

function makeTestStore<State, Action>(reducer: Reducer<State, Action>, init: State): Store<State, Action> {
  let store = init;
  const dispatch = (action: Action) => { store = reducer(init, action) };

  return {
    dispatch,
    getState: () => store
  }
}

testAction(
  { todos: [], isLoading: false },
  { type: "create_todo", todo: { name: "T1", isComplete: false }},
  (s: State) => {
    expect(s).toEqual({
      isLoading: false,
      todos: [
        { id: 1, name: "Test", isComplete: false},
      ],
    });
  },
  "Create todo"
);
