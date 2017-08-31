import * as express from 'express';
import { Container } from 'inversify';

import { TodoListController } from '../controllers/todo-list-controller';

export class TodoListRoutes {
    public static configureRoutes(app: express.Express, container: Container): void {

        const controller = container.get(TodoListController);

        app.route('/tasks')
            .get((req, res) => controller.listAllTasks(res))
            .post((req, res) => controller.createTask(req, res));

        app.route('/tasks/:taskId')
            .get((req, res) => controller.getTask(req, res))
            .put((req, res) => controller.updateTask(req, res))
            .delete((req, res) => controller.deleteTask(req, res));
    }
}
