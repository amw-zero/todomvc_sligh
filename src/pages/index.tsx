import Head from 'next/head';
import { GetStaticProps } from 'next';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import prisma from '../../lib/prisma';
import { Todo } from '@prisma/client';
import { useEffect } from 'react';
import { useContextSelector } from 'use-context-selector';
import { Formik, Field, Form, ErrorMessage, FormikState } from 'formik';
import { Table, TableRow, TableColumn } from '../components/table';
import { StateContext } from '../state';

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

export default function Home() {
  const [todos, dispatch] = useContextSelector(StateContext, ([s, dispatch]) => [s.todos, dispatch]);
  const isLoading = useContextSelector(StateContext, ([s]) => s.isLoading);

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

  if (todos.length >= 0) {
    rows = todos.map((todo: Todo) => (
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
        <Table rows={rows} columns={columns} isLoading={isLoading}/>
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
