import { TaskModel } from '../domain/task-model';

export interface TaskRepositoryInterface {
    getTasks(conditions: Object): Promise<TaskModel[]>;
    getTask(id: string | number): Promise<TaskModel>;
    createTask(task: TaskModel): Promise<TaskModel>;
    updateTask(id: string | number, task: TaskModel): Promise<TaskModel>;
    deleteTask(id: string | number): Promise<any>;
}
