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
        if (request && request.params && request.params.taskId) {
            return this.repository.getTask(request.params.taskId);
        }
        else {
            return Promise.reject('The Request Parameter {taskId} is required.');
        }
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
