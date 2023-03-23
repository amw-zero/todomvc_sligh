import { Todo } from "@prisma/client"

export type State = {
  todos: Todo[]
}

export type CreateTodo = {
  name: string;
  isCompleted: boolean;
}

export type CreateTodoAction = {
  type: "create_todo";
  todo: CreateTodo
}

type Action = CreateTodoAction;

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "create_todo":
      return { 
        todos: [...state.todos]
      }
  }
} 