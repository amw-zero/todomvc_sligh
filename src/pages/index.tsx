import Head from 'next/head'
import Image from 'next/image'
import { GetStaticProps } from 'next'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import prisma from '../../lib/prisma'
import { Todo } from '@prisma/client'
import { useEffect, useReducer, useRef } from 'react'
  import { reducer, State, actionMapping } from '../../lib/state-async'
import { makeAsyncStore, ActionMapping, Reducer } from "../../lib/state-lib"
import { Formik, Field, Form, ErrorMessage, FormikState } from 'formik';
import { Table, TableRow } from '../components/table';

const inter = Inter({ subsets: ['latin'] })

export const getStaticProps: GetStaticProps = async () => {
  const todos: Todo[] = await prisma.todo.findMany();

  return {
    props: { todos },
    revalidate: 10,
  };
};

type Props = {
  todos: Todo[],
}

function useAsyncReducer<State, AsyncAction, Action>(actionMapping: ActionMapping<State, AsyncAction, Action>, reducer: Reducer<State, Action>, init: State) {
  const [state, dispatch] = useReducer(reducer, init);
  const getState = () => state;

  const stateRef = useRef(state);

  useEffect(() => {
    console.log("State changed, running stateRef effect")
    stateRef.current = state;
  }, [state]);
  
  const store = {
    dispatch,
    getState,
  }
    
  return makeAsyncStore(actionMapping, state, store);
}

type TodoFormState = {
  name: string;
}

export default function Home({ todos }: Props) {
  console.log("Render running");
  const [state, dispatch] = useAsyncReducer(actionMapping, reducer, { isLoading: false, todos });

  const initialTodo = {
    name: "",
  }

  const submitTodoForm = (values: TodoFormState) => {
    dispatch({ type: "create_todo", todo: values });
  }

  useEffect(() => {
    dispatch({ type: "get_todos" });
  }, []);

  const rows = [
    {
      data: { id: 1, name: "t1", isComplete: false },
      id: "t1",
    },
    {
      data: { id: 2, name: "t2", isComplete: true },
      id: "t2",
    },
  ];
  
  const columns = [
    {
      name: "name",
      accessor: (data: Todo) => <p>{data.name}</p>
    },
    {
      name: "isComplete",
      accessor: (data: Todo) => <p>{data.isComplete ? "true" : "false"}</p>
    },
  ];

  return (
    <>
      <Head>
        <title>Todo Sligh App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <p>Todos</p>
        {state.todos.map(t => t.name)}
        <Table rows={rows} columns={columns}/>
        <Formik
          initialValues={initialTodo}
          onSubmit={submitTodoForm}
          >
          <Form>
            <label htmlFor="name">Name</label>
            <Field name="name" type="text" />
            <button type="submit">Add Todo</button>
          </Form>
        </Formik>
      </main>
    </>
  )
}
