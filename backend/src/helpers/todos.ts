import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

// TODO: Implement businessLogic
export const createTodo = async (item: CreateTodoRequest, docClient: any, TODOS_TABLE: string) => await docClient.put({
    tableName: TODOS_TABLE,
    Item: item
})


export const deleteTodo = () => console.log('delete todo')
export const updateTodo = (id: string, item: UpdateTodoRequest) => console.log('update Todo')
export const getTodosForUser = () => console.log('get Todo\'s For User')
export const createAttachmentPresignedUrl = () => console.log('create Attachment Presigned Url')
