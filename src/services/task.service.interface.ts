import { TaskModel } from '../domain/task-model';
import { TaskRepositoryInterface } from '../repositories/task.repository.interface';

export interface TaskServiceInterface {
    repository: TaskRepositoryInterface;
    listAllTasks(): Promise<TaskModel[]>;
    getTask(request: any): Promise<TaskModel>;
    createTask(request: any): Promise<TaskModel>;
    updateTask(request: any): Promise<TaskModel>;
    deleteTask(request: any): Promise<any>;
}
