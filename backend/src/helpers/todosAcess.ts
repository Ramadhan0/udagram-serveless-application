import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAccess')

export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable: string = process.env.TODOS_TABLE
    ) { }

    async getTodosForUser(groupId: string, userId: string): Promise<TodoItem[]> {

        logger.info('fetching todos for user', userId)

        const todos = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId AND groupId = :groupId',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':groupId': groupId

            }
        })
            .promise()

        return todos as unknown as TodoItem[]
    }

    async createTodo(item: TodoItem) {

        logger.info('creating todo for user', item)

        const todo = await this.docClient.put({
            Item: item,
            TableName: this.todosTable,
        })

        return todo as unknown as TodoItem
    }

    async deleteTodo(itemId: string, userId: string) {

        logger.info('User was authorized', { user: userId, todo: itemId })

        const todo = await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                itemId,
                userId
            },
        })

        return todo
    }

    async updateTodo(data: TodoUpdate, itemId: string, userId: string) {

        logger.info('updating user todo', { userId, itemId, data })

        const todo = await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                itemId,
                userId,
                data
            },
        })

        return todo as unknown as TodoItem
    }

}

// create dynamo db client

function createDynamoDBClient() {

    const { IS_OFFLINE } = process.env

    if (!IS_OFFLINE) return new XAWS.DynamoDB.DocumentClient()

    logger.info('creating dynamo db client', IS_OFFLINE)

    return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    })
}
