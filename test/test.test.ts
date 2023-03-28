import { expect, test } from 'vitest';
import { reducer, CreateTodoAction, State, Action, actionMapping } from '../lib/state-async';
import { Reducer, Store, makeAsyncStore } from "../lib/state-lib";
import fc from "fast-check";

// Abstract test structure  
function makeTest(init: State, action: Action) {
  
}

function makeTestStore<State, Action>(reducer: Reducer<State, Action>, init: State): Store<State, Action> {
  let store = init;
  const dispatch = (action: Action) => { store = reducer(init, action) };

  return {
    dispatch,
    getState: () => store
  }
}

test('reducer', async () => {
  const init = { todos: [], isLoading: false };
  const action: CreateTodoAction = { type: "create_todo", todo: { name: "T1", isComplete: false }};
  const store = makeTestStore(reducer, init);
  const [_, dispatch] = makeAsyncStore(actionMapping, init, store);

  await dispatch(action);

  console.log({store});

  expect(store.getState()).toEqual({
    isLoading: false,
    todos: [
      { id: 1, name: "Test", isComplete: false},
    ],
  });
//  fc.assert(fc.property(fc.string(), (text) => contains(text, text)));
})