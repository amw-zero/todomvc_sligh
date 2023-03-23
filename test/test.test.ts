import { expect, test } from 'vitest';
import { reducer, CreateTodoAction } from '../lib/state';

test('reducer', () => {
  const init = { todos: [] };
  const action: CreateTodoAction = { type: "create_todo", todo: { name: "T1", isCompleted: false }};

  const state = reducer(init, action);

  expect(state).toEqual({
    todos: [
      {
        type: "create_todo",
        todo: { name: "T1", isComplete: false },
      }
    ]
  })
})