import * as mongoose from 'mongoose';

export const Task = mongoose.model('Tasks');

export class TodoListController {
    public listAllTasks(res: any): void {
        Task.find({}, (err, task) => {
            if (err) {
                res.send(err);
            }
            else {
                res.json(task);
            }
        });
    }

    public createTask(req: any, res: any): void {
        const newTask = new Task(req.body);
        newTask.save((err, task) => {
            if (err) {
                res.send(err);
            }
            else {
                res.json(task);
            }
        });
    }
    
    public getTask(req: any, res: any): void {
        Task.findById(req.params.taskId, (err, task) => {
            if (err) {
                res.send(err);
            }
            else {
                res.json(task);
            }
        });
    }
    
    public updateTask(req: any, res: any): void {
        Task.findOneAndUpdate({
            _id: req.params.taskId
        }, req.body, {new: true}, (err, task) => {
            if (err) {
                res.send(err);
            }
            else {
                res.json(task);
            }
        });
    }
    
    public deleteTask(req: any, res: any): void {
        Task.remove({
            _id: req.params.taskId
        }, err => {
            if (err) {
                res.send(err);
            }
            else {
                res.json({ message: 'Task successfully deleted' });
            }
        });
    }
}
