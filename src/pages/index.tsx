import Head from 'next/head'
import Image from 'next/image'
import { GetStaticProps } from 'next'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import prisma from '../../lib/prisma'
import { Todo } from '@prisma/client'
import { useContext, useEffect, useReducer, useRef } from 'react'
  import { reducer, State, actionMapping } from '../../lib/state-async'
import { Formik, Field, Form, ErrorMessage, FormikState } from 'formik';
import { Table, TableRow, TableColumn } from '../components/table';
import { StateContext, useAsyncReducer } from '../state';

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

type TodoFormState = {
  name: string;
}

export default function Home({ todos }: Props) {
  console.log("Render running");
  const [state, dispatch] = useContext(StateContext);
  const initialTodo = {
    name: "",
  }

  const submitTodoForm = (values: TodoFormState) => {
    dispatch({ type: "create_todo", todo: values });
  }

  useEffect(() => {
    dispatch({ type: "get_todos" });
  }, []);

  let rows: TableRow<Todo>[] = [];
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

  if (state.todos.length >= 0) {
    rows = state.todos.map((todo: Todo) => (
      {
        data: todo,
        id: todo.name,
      }
    ))
  }

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
        <Table rows={rows} columns={columns} isLoading={state.isLoading}/>
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
