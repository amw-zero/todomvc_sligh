import { expect, test } from 'vitest';
import { reducer, CreateTodoAction, State, Action, actionMapping } from '../lib/state-async';
import { makeState, Reducer, SyncDispatch } from "../lib/state-lib";
import fc from "fast-check";

// Abstract test structure  
function makeTest(init: State, action: Action) {
  
}

function makeTestDispatch<State, Action>(reducer: Reducer<State, Action>, init: State, store: State): SyncDispatch<Action> {
  return (action: Action) => { console.log("Mutating store"); store = reducer(init, action); console.log("After store mutation", { store }) };
}

test('reducer', async () => {
  const init = { todos: [], isLoading: false };
  const action: CreateTodoAction = { type: "create_todo", todo: { name: "T1", isComplete: false }};
  let store = { todos: [], isLoading: false };
  const getState = () => store;
  const [_, dispatch] = makeState(actionMapping, init, makeTestDispatch(reducer, init, store), getState);

  await dispatch(action);

  console.log({store});

  expect(store.todos[0]).toEqual({
    isLoading: false,
    todos: [
      { id: 1, name: "Test", isComplete: false},
    ],
  });
//  fc.assert(fc.property(fc.string(), (text) => contains(text, text)));
})