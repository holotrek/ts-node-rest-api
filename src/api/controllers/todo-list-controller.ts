import { inject, injectable } from 'inversify';

import { TYPES } from '../../ioc/types';
import { TaskServiceInterface } from '../../services/task.service.interface';

@injectable()
export class TodoListController {
    constructor(
        @inject(TYPES.TaskService) private taskService: TaskServiceInterface
    ) {
    }

    public listAllTasks(res: any): void {
        this.taskService.listAllTasks()
            .then(data => res.json(data))
            .catch(err => res.status(500).json({ error: err }));
    }

    public createTask(req: any, res: any): void {
        this.taskService.createTask(req)
            .then(data => res.json(data))
            .catch(err => res.status(500).json({ error: err }));
    }

    public getTask(req: any, res: any): void {
        this.taskService.getTask(req)
            .then(data => res.json(data))
            .catch(err => res.status(500).json({ error: err }));
    }

    public updateTask(req: any, res: any): void {
        this.taskService.updateTask(req)
            .then(data => res.json(data))
            .catch(err => res.status(500).json({ error: err }));
    }

    public deleteTask(req: any, res: any): void {
        this.taskService.deleteTask(req)
            .then(data => res.json(data))
            .catch(err => res.status(500).json({ error: err }));
    }
}
