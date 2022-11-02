import { v4 } from 'uuid/v4'
import { TodosAccess } from './todosAcess';
// import * as createError from 'http-errors'
import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'
import { AttachmentUtils } from './attachmentUtils'
// import { Todo } from './../../../client/src/types/Todo'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todosAccess = new TodosAccess()
const logger = createLogger('TodosBusinessLogic')

// TODO: Implement businessLogic
export const createTodo = async (item: CreateTodoRequest, userId: string) => {

    logger.info('creating todo', item)
    const todoId = v4()
    const createdAt = new Date().toISOString()

    const newTodo: TodoItem = {
        todoId,
        userId,
        done: false,
        createdAt,
        ...item
    }
    return todosAccess.createTodo(newTodo)
}

//  delete todos
export const deleteTodo = (userId: string, itemId: string) => {
    logger.info('deleting todo', { userId, itemId })
    return todosAccess.deleteTodo(itemId, userId)
}

// get todos for a single user
export const getTodosForUser = (groupId: string, userId: string) => {
    logger.info('getting users todos', { groupId, userId })
    return todosAccess.getTodosForUser(groupId, userId)
}

// update todo
export const updateTodo = (data: UpdateTodoRequest, userId: string, itemId: string) => {
    logger.info('updating Todo', { data, userId, itemId })
    return todosAccess.updateTodo(data, userId, itemId)
}

// create todo image
export const createAttachmentPresignedUrl = (todoId: string, userId: string) => {
    logger.info('creating attachment presigned url')
    return AttachmentUtils(todoId, userId)
}
