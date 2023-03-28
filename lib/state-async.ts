import { Dispatch, SyncDispatch, GetState } from "./state-lib"
import { Todo, Prisma } from "@prisma/client"

export type State = {
  isLoading: boolean;
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

export type Action = CreateTodoAction | CreateTodoCompleteAction;

function createTodo(dispatch: SyncDispatch<Action>, getState: GetState<State>): Promise<State> {
  dispatch({ type: "create_todo", todo: { name: "Test", isComplete: false } });
  //  let todos = await createTodo();

  console.log("Creating todo");
  return new Promise((resolve) => {
    setTimeout(async () => {
      console.log("Dispatching response");
      dispatch({ type: "create_todo_complete", todo: { id: 1, name: "Test", isComplete: false }})
      console.log("Resolving state");
      resolve(getState())
    }, 1000)
  });
}

export function actionMapping(act: Action, dispatch: SyncDispatch<Action>, getState: GetState<State>): Promise<State> {
  switch (act.type) {
  case "create_todo": return createTodo(dispatch, getState);
  }

  return new Promise((resolve) => resolve(getState()));
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
  }
}