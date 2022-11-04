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

    async getTodosForUser(userId: string): Promise<TodoItem[]> {

        logger.info('fetching todos for user', userId)

        const todos = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId,

            }
        }).promise()

        console.log(todos)

        const { Items } = todos

        return Items as TodoItem[]
    }

    async createTodo(todo: TodoItem) {

        logger.info('creating todo for user', todo)

        const createTodo = await this.docClient.put({
            Item: todo,
            TableName: this.todosTable,
        }).promise()

        console.log(createTodo)

        return todo as TodoItem
    }

    async deleteTodo(todoId: string, userId: string) {

        logger.info('User was authorized', { user: userId, todo: todoId })

        const todo = await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            },
        }).promise()

        return todo
    }

    async updateTodo(data: TodoUpdate, todoId: string, userId: string) {

        logger.info('updating user todo', { userId, todoId, data })

        const updateTodo = await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
            },
            UpdateExpression: "set #a = :a, #b = :b, #c = :c",
            ExpressionAttributeNames: {
                "#a": "name",
                "#b": "dueDate",
                "#c": "done"
            },
            ExpressionAttributeValues: {
                ":a": data['name'],
                ":b": data['dueDate'],
                ":c": data['done']
            },
            ReturnValues: "ALL_NEW"
        }).promise()

        const { Attributes } = updateTodo

        return Attributes as TodoUpdate
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
