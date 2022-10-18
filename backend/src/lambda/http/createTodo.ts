import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'
import { v4 } from 'uuid/v4'

const AWS = require('aws-sdk')

const docClient = new AWS.DynamoDB.DocumentClient()
const { TODOS_TABLE } = process.env

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item

    console.log(event)

    const itemId = v4()

    const parsedBody = JSON.parse(event.body)

    const newTodo: CreateTodoRequest = {
      id: itemId,
      ...parsedBody
    }

    await createTodo(newTodo, docClient, TODOS_TABLE)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        newTodo
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
