import { TaskServiceInterface } from '../../services/task.service.interface';

export class TodoListController {
    constructor(
        private taskService: TaskServiceInterface
    ) {
    }

    public listAllTasks(res: any): void {
        this.taskService.listAllTasks()
            .then(data => res.json(data))
            .catch(err => res.send(err));
    }

    public createTask(req: any, res: any): void {
        this.taskService.createTask(req)
            .then(data => res.json(data))
            .catch(err => res.send(err));
    }

    public getTask(req: any, res: any): void {
        this.taskService.getTask(req)
            .then(data => res.json(data))
            .catch(err => res.send(err));
    }

    public updateTask(req: any, res: any): void {
        this.taskService.updateTask(req)
            .then(data => res.json(data))
            .catch(err => res.send(err));
    }

    public deleteTask(req: any, res: any): void {
        this.taskService.deleteTask(req)
            .then(data => res.json(data))
            .catch(err => res.send(err));
    }
}
