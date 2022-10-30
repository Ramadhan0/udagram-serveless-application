import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const XAWS = AWSXRay.captureAWS(AWS)
// const docClient = new AWS.DynamoDB.DocumentClient()

const logger = createLogger('TodosAccess')

export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable: string = process.env.TODOS_TABLE
    ) { }

    async getTodosForUser(groupId: string, userId: string): Promise<TodoItem[]> {

        const todos = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: ['userId = :userId', 'groupId = :groupId'],
            ExpressionAttributeValues: {
                ':userId': userId,
                ':groupId': groupId,
            },
            scanIndexForward: false
        }).promise()

        return todos as unknown as TodoItem[]
    }

    async createTodo(item: TodoItem) {
        await this.docClient.put({
            Item: item,
            TableName: this.todosTable,
        })
    }

    async deleteTodo(itemId: string, userId: string) {
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                itemId,
                userId
            },
        })
    }

    async updateTodo(itemId: TodoItem, userId: string) {
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                itemId,
                userId
            },
        })
    }
}
