import * as express from 'express';

import { TodoListController } from '../controllers/todo-list-controller';

export class TodoListRoutes {
    public static configureRoutes(app: express.Express): void {
        const controller = new TodoListController();
        app.route('/tasks')
            .get(controller.listAllTasks)
            .post(controller.createTask);
        
        app.route('/tasks/:taskId')
            .get(controller.getTask)
            .put(controller.updateTask)
            .delete(controller.deleteTask);
    }
}
