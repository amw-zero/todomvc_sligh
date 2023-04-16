import { Dispatch, SyncDispatch, GetState } from "./state-lib"
import { Todo, Prisma } from "@prisma/client"
import prisma from './prisma';

export type State = {
  isLoading: boolean;
  todos: Todo[];
}

export type GetTodosAction = {
  type: "get_todos";
}

export type GetTodosCompleteAction = {
  type: "get_todos_complete"
  todos: Todo[];
}

export type CreateTodo = {
  name: string;
  isCompleted: boolean;
}

export type CreateTodoAction = {
  type: "create_todo";
  todo: Prisma.TodoCreateInput
}

export type CreateTodoCompleteAction = {
  type: "create_todo_complete";
  todo: Todo;
}

export type AsyncAction = CreateTodoAction | GetTodosAction;

export type Action = AsyncAction | CreateTodoCompleteAction | GetTodosCompleteAction;

async function createTodo(todoData: Prisma.TodoCreateInput, dispatch: SyncDispatch<Action>, getState: GetState<State>): Promise<State> {
  dispatch({ type: "create_todo", todo: { name: "Test", isComplete: false } });
  const resp = await fetch("api/create-todo", { method: "POST", body: JSON.stringify(todoData) });
  const createdTodo = await resp.json();

  dispatch({ type: "create_todo_complete", todo: createdTodo });

  return getState();
}

async function getTodos(dispatch: SyncDispatch<Action>, getState: GetState<State>): Promise<State> {
  dispatch({ type: "get_todos" });
  const resp = await fetch("/api/todos");
  const { todos } = await resp.json();
  dispatch({ type: "get_todos_complete", todos });

  return getState();
}

export async function actionMapping(act: AsyncAction, dispatch: SyncDispatch<Action>, getState: GetState<State>): Promise<State> {
  switch (act.type) {
  case "create_todo": return createTodo(act.todo, dispatch, getState);
  case "get_todos": return getTodos(dispatch, getState);
  }
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
  case "create_todo":
    return {
      ...state,
      isLoading: true,
    }
  case "create_todo_complete":
    return {
      ...state,
      isLoading: false,
      todos: [...state.todos, action.todo]
    }
  case "get_todos":
    return {
      ...state,
      isLoading: true,
    }
  case "get_todos_complete":
    return {
      ...state,
      isLoading: false,
      todos: action.todos,
    }
  }
}