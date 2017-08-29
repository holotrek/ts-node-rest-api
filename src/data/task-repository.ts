import * as mongoose from 'mongoose';

import { TaskModel } from '../domain/task-model';
import { TaskRepositoryInterface } from '../repositories/task-repository.interface';

export class TaskRepository implements TaskRepositoryInterface {
    private static Task: mongoose.Model<any>;

    constructor() {
        TaskRepository.Task = mongoose.model('Tasks');
    }

    getTasks(conditions: Object): Promise<TaskModel[]> {
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

    getTask(id: string | number): Promise<TaskModel> {
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

    createTask(task: TaskModel): Promise<TaskModel> {
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

    updateTask(id: string | number, task: TaskModel): Promise<TaskModel> {
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

    deleteTask(id: string | number): Promise<any> {
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
