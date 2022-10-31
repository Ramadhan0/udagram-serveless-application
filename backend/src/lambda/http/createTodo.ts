import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    // TODO: Implement creating a new TODO item
    const parsedBody = JSON.parse(event.body)
    const userId = getUserId(event)

    const newTodo = await createTodo(parsedBody, userId)

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
