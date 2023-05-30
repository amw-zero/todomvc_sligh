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

async function createTodo(todoData: Prisma.TodoCreateInput, dispatch: SyncDispatch<Action>, getState: GetState<State>) {
  dispatch({ type: "create_todo", todo: { name: "Test", isComplete: false } });
  const resp = await fetch("api/create-todo", { method: "POST", body: JSON.stringify(todoData) });
  const createdTodo = await resp.json();

  dispatch({ type: "create_todo_complete", todo: createdTodo.todo });
}

async function getTodos(dispatch: SyncDispatch<Action>, getState: GetState<State>) {
  dispatch({ type: "get_todos" });
  setTimeout(async () => {
    const resp = await fetch("/api/todos");
    const { todos } = await resp.json();
  
    dispatch({ type: "get_todos_complete", todos });
  }, 2000);
}

export async function actionMapping(act: AsyncAction, dispatch: SyncDispatch<Action>, getState: GetState<State>) {
  switch (act.type) {
  case "create_todo": 
    createTodo(act.todo, dispatch, getState);
    break;
  case "get_todos": 
    getTodos(dispatch, getState);
    break;
  }
}

export function reducer(state: State, action: Action): State {
//  console.log("Reducer", { action: action.type });
  // monitor individual actions in context of parent action.
  switch (action.type) {
  case "create_todo":
    return {
      ...state,
      isLoading: true,
    }
  case "create_todo_complete":
    console.log("Create todo complete");
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