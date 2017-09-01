import { injectable } from 'inversify';
import * as mongoose from 'mongoose';

import { TaskModel } from '../domain/task-model';
import { TaskRepositoryInterface } from '../repositories/task.repository.interface';

@injectable()
export class TaskRepository implements TaskRepositoryInterface {
    private static Task: mongoose.Model<any>;

    constructor() {
        TaskRepository.Task = mongoose.model('Tasks');
    }

    public getTasks(conditions: Object): Promise<TaskModel[]> {
        return new Promise<TaskModel[]>((resolve: any, reject: any) => {
            TaskRepository.Task.find(conditions, (err: any, task: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(task);
                }
            });
        });
    }

    public getTask(id: string): Promise<TaskModel> {
        return new Promise<TaskModel>((resolve: any, reject: any) => {
            TaskRepository.Task.findById(id, (err: any, task: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(task);
                }
            });
        });
    }

    public createTask(task: TaskModel): Promise<TaskModel> {
        return new Promise<any>((resolve: any, reject: any) => {
            const newTask = new TaskRepository.Task(task);
            newTask.save((err: any, taskOut: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(taskOut);
                }
            });
        });
    }

    public updateTask(id: string, task: TaskModel): Promise<TaskModel> {
        return new Promise<TaskModel>((resolve: any, reject: any) => {
            TaskRepository.Task.findOneAndUpdate({ _id: id }, task, { new: true }, (err: any, taskOut: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(taskOut);
                }
            });
        });
    }

    public deleteTask(id: string): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            TaskRepository.Task.remove({ _id: id }, err => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({ message: 'Task successfully deleted' });
                }
            });
        });
    }
}
