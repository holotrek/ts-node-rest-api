import * as express from 'express';

import { TaskRepository } from '../../data/task.repository';
import { AuthMiddlewareInterface } from '../../middleware/auth.middleware.interface';
import { UserProviderInterface } from '../../providers/user.provider.interface';
import { TaskService } from '../../services/task.service';
import { TodoListController } from '../controllers/todo-list-controller';

export class TodoListRoutes {
    public static configureRoutes(app: express.Express, userProvider: UserProviderInterface, authMiddleware: AuthMiddlewareInterface): void {

        // TODO: Remove need to manually configure dependencies (using an IoC option: electrolyte / InversifyJS?)
        const controller = new TodoListController(new TaskService(new TaskRepository(), userProvider));

        app.route('/tasks')
            .get((req, res) => controller.listAllTasks(res))
            .post(authMiddleware.isAuthenticated, (req, res) => controller.createTask(req, res));

        app.route('/tasks/:taskId')
            .get((req, res) => controller.getTask(req, res))
            .put(authMiddleware.isAuthenticated, (req, res) => controller.updateTask(req, res))
            .delete(authMiddleware.isAuthenticated, (req, res) => controller.deleteTask(req, res));
    }
}
