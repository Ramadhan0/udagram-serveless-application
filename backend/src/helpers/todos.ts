import { TodosAccess } from './todosAcess';
import { AttachmentUtils } from './attachmentUtils';
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const AWS = require('aws-sdk')
const todosAccess = new TodosAccess()

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

// TODO: Implement businessLogic
export const createTodo = async (item: CreateTodoRequest) => todosAccess.createTodo


export const deleteTodo = () => console.log('delete todo')
export const updateTodo = (id: string, item: UpdateTodoRequest) => console.log('update Todo')

export const getTodosForUser = (groupId: string, userId: string) => todosAccess.getTodosForUser

export const createAttachmentPresignedUrl = () => console.log('create Attachment Presigned Url')
