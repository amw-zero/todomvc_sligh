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

type Command<Action> = () => Promise<Action>;

export type Reducer<State, Action> = (s: State, a: Action) => [State, Command<Action> | null];

export function makeDispatch<State, Action>(
  reducer: Reducer<State, Action>, 
  init: State): (action: Action
) => Promise<[State, Command<Action> | null]> {
  const dispatch: (action: Action) => Promise<[State, Command<Action> | null]> = async (action: Action) => {
    let [nextState, cmd] = reducer(init, action);
    if (cmd !== null) {
      return dispatch(await cmd());
    }
    
    return [nextState, null]
  }
  
  return dispatch;
}

async function fetchTodo(): Promise<Action> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ type: "create_todo_complete", todo: { id: 1, name: "Test", isComplete: false }})
    }, 1000)
  })
}

function fetchTodoThunk(dispatch: any) {
  dispatch({ type: "create_todo" });
//  let todos = await fetchTodos();

  return new Promise((resolve) => {
    setTimeout(async () => {
      resolve(await dispatch({ type: "create_todo_complete", todo: { id: 1, name: "Test", isComplete: false }}))
    }, 1000)
  });
}

export function reducer(state: State, action: Action): [State, Command<Action> | null] {
  switch (action.type) {
    case "create_todo_complete":
      return [{
        ...state,
        isLoading: false,
        todos: [action.todo, ...state.todos]
      }, null];
    case "create_todo":
      return [{
        ...state,
        isLoading: true,
      }, fetchTodo]
  }
} 