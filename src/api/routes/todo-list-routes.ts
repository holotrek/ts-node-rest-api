import * as express from 'express';

import { TaskService } from '../../services/task.service';
import { TodoListController } from '../controllers/todo-list-controller';

export class TodoListRoutes {
    public static configureRoutes(app: express.Express): void {

        // TODO: Remove dependency (using an IoC option: electrolyte / InversifyJS?)
        const controller = new TodoListController(new TaskService());

        app.route('/tasks')
            .get(controller.listAllTasks)
            .post(controller.createTask);

        app.route('/tasks/:taskId')
            .get(controller.getTask)
            .put(controller.updateTask)
            .delete(controller.deleteTask);
    }
}
