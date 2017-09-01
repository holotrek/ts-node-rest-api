import { TaskModel } from '../domain/task-model';

export interface TaskRepositoryInterface {
    getTasks(conditions: Object): Promise<TaskModel[]>;
    getTask(id: string): Promise<TaskModel>;
    createTask(task: TaskModel): Promise<TaskModel>;
    updateTask(id: string, task: TaskModel): Promise<TaskModel>;
    deleteTask(id: string): Promise<any>;
}
