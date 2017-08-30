import { TaskModel } from '../domain/task-model';

export interface TaskServiceInterface {
    listAllTasks(): Promise<TaskModel[]>;
    getTask(request: any): Promise<TaskModel>;
    createTask(request: any): Promise<TaskModel>;
    updateTask(request: any): Promise<TaskModel>;
    deleteTask(request: any): Promise<any>;
}
