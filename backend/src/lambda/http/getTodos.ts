import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getTodosForUser } from '../../businessLogic//todoBusinessLogic'
import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    try {
      // Write your code here
      const userId = await getUserId(event)

      const todos = await getTodosForUser(userId)

      // TODO implement
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          todos
        })
      }
    } catch (error) {

      const errorMessage = error.message
      console.log(error)
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error,
          errorMessage
        })
      }
    }

  })

handler.use(
  cors({
    credentials: true
  })
)
