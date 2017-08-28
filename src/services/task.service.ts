import * as mongoose from 'mongoose';

import { TaskServiceInterface } from './task.service.interface';

export class TaskService implements TaskServiceInterface {
	private static Task: mongoose.Model<any>;

	constructor() {
		TaskService.Task = mongoose.model('Tasks')
	}

	public listAllTasks(): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            TaskService.Task.find({}, (err: any, task: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(task);
                }
            });
        });
    }

    public createTask(request: any): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            const newTask = new TaskService.Task(request.body);
            newTask.save((err: any, task: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(task);
                }
            });
        });
    }

    public getTask(request: any): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            TaskService.Task.findById(request.params.taskId, (err: any, task: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(task);
                }
            });
        });
    }

    public updateTask(request: any): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            TaskService.Task.findOneAndUpdate({
                _id: request.params.taskId
            }, request.body, {new: true}, (err: any, task: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(task);
                }
            });
        });
    }

    public deleteTask(request: any): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            TaskService.Task.remove({
                _id: request.params.taskId
            }, err => {
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