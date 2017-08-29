import * as express from 'express';

import { TaskRepository } from '../../data/task-repository';
import { TaskService } from '../../services/task.service';
import { TodoListController } from '../controllers/todo-list-controller';

export class TodoListRoutes {
    public static configureRoutes(app: express.Express): void {

        // TODO: Remove need to manually configure dependencies (using an IoC option: electrolyte / InversifyJS?)
        const controller = new TodoListController(new TaskService(new TaskRepository()));

        app.route('/tasks')
            .get((req, res) => controller.listAllTasks(res))
            .post((req, res) => controller.createTask(req, res));

        app.route('/tasks/:taskId')
            .get((req, res) => controller.getTask(req, res))
            .put((req, res) => controller.updateTask(req, res))
            .delete((req, res) => controller.deleteTask(req, res));
    }
}
