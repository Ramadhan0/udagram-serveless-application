import { TodosAccess, AttachmentUtils } from '../dataLayer/todosDataLayer'
import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const uuidv4 = require('uuid/v4');

const todosAccess = new TodosAccess()
const logger = createLogger('TodosBusinessLogic')

// get todos for a single user
export const getTodosForUser = (userId: string) => {
    logger.info('getting users todos', { userId })
    return todosAccess.getTodosForUser(userId)
}

// TODO: Implement businessLogic
export const createTodo = async (item: CreateTodoRequest, userId: string) => {

    logger.info('creating todo', item)
    const todoId = uuidv4()
    const createdAt = new Date().toISOString()
    const { ATTACHMENT_S3_BUCKET } = process.env;

    const newTodo: TodoItem = {
        todoId,
        userId,
        done: false,
        createdAt,
        attachmentUrl: `https://${ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${todoId}`,
        ...item
    }
    return todosAccess.createTodo(newTodo)
}

//  delete todos
export const deleteTodo = (userId: string, itemId: string) => {
    logger.info('deleting todo', { userId, itemId })
    return todosAccess.deleteTodo(itemId, userId)
}

// update todo
export const updateTodo = (data: UpdateTodoRequest, userId: string, itemId: string) => {
    logger.info('updating Todo', { data, userId, itemId })
    return todosAccess.updateTodo(data, userId, itemId)
}

// create todo image
export const createAttachmentPresignedUrl = (todoId: string) => {
    logger.info('creating attachment presigned url')
    return AttachmentUtils(todoId)
}
