import { TaskRepositoryInterface } from '../repositories/task-repository.interface';
import { TaskServiceInterface } from './task.service.interface';

export class TaskService implements TaskServiceInterface {
    constructor(
        private repository: TaskRepositoryInterface
    ) {
    }

    public listAllTasks(): Promise<any> {
        return this.repository.getTasks({});
    }

    public getTask(request: any): Promise<any> {
        return this.repository.getTask(request.params.taskId);
    }

    public createTask(request: any): Promise<any> {
        return this.repository.createTask(request.body);
    }

    public updateTask(request: any): Promise<any> {
        return this.repository.updateTask(request.params.taskId, request.body);
    }

    public deleteTask(request: any): Promise<any> {
        return this.repository.deleteTask(request.params.taskId);
    }
}
