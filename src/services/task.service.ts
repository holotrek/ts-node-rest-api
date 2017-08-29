import { TaskModel } from '../domain/task-model';
import { UserProviderInterface } from '../providers/user.provider.interface';
import { TaskRepositoryInterface } from '../repositories/task-repository.interface';
import { TaskServiceInterface } from './task.service.interface';

export class TaskService implements TaskServiceInterface {
    constructor(
        private repository: TaskRepositoryInterface,
        private userProvider: UserProviderInterface
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
        const task = request.body as TaskModel;
        task.created = Date.now();
        task.createdBy = this.userProvider.userName;
        return this.repository.createTask(task);
    }

    public updateTask(request: any): Promise<any> {
        const task = request.body as TaskModel;
        task.updated = Date.now();
        task.updatedBy = this.userProvider.userName;
        return this.repository.updateTask(request.params.taskId, task);
    }

    public deleteTask(request: any): Promise<any> {
        return this.repository.deleteTask(request.params.taskId);
    }
}
