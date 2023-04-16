// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma';
import { Todo } from "@prisma/client"

type CreateTodosResponse = {
  todo: Todo;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateTodosResponse>
) {
  const bodyJson = JSON.parse(req.body);
  const todoData = {...bodyJson, isComplete: false};
  const created = await prisma.todo.create({
    data: todoData
  });

  res.status(200).json({ todo: created });
}
