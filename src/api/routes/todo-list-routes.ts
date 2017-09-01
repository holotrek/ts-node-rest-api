import * as express from 'express';
import { Container } from 'inversify';

import { AuthMiddleware } from '../../middleware/auth.middleware';
import { TodoListController } from '../controllers/todo-list-controller';

export class TodoListRoutes {
    public static configureRoutes(app: express.Express, container: Container, authMiddleware: AuthMiddleware): void {

        const controller = container.get(TodoListController);

        app.route('/tasks')
            .get((req, res) => controller.listAllTasks(res))
            .post(authMiddleware.isAuthenticated, (req, res) => controller.createTask(req, res));

        app.route('/tasks/:taskId')
            .get((req, res) => controller.getTask(req, res))
            .put(authMiddleware.isAuthenticated, (req, res) => controller.updateTask(req, res))
            .delete(authMiddleware.isAuthenticated, (req, res) => controller.deleteTask(req, res));
    }
}
