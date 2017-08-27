import * as mongoose from 'mongoose';

export class TodoListController {
	private static Task: mongoose.Model<any>;

	constructor() {
		TodoListController.Task = mongoose.model('Tasks')
	}

	public listAllTasks(res: any): void {
        TodoListController.Task.find({}, (err: any, task: any) => {
            if (err) {
                res.send(err);
            }
            else {
                res.json(task);
            }
        });
    }

    public createTask(req: any, res: any): void {
        const newTask = new TodoListController.Task(req.body);
        newTask.save((err: any, task: any) => {
            if (err) {
                res.send(err);
            }
            else {
                res.json(task);
            }
        });
    }

    public getTask(req: any, res: any): void {
        TodoListController.Task.findById(req.params.taskId, (err: any, task: any) => {
            if (err) {
                res.send(err);
            }
            else {
                res.json(task);
            }
        });
    }

    public updateTask(req: any, res: any): void {
        TodoListController.Task.findOneAndUpdate({
            _id: req.params.taskId
        }, req.body, {new: true}, (err: any, task: any) => {
            if (err) {
                res.send(err);
            }
            else {
                res.json(task);
            }
        });
    }

    public deleteTask(req: any, res: any): void {
        TodoListController.Task.remove({
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
