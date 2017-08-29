import * as mongoose from 'mongoose';

import { TaskSchema } from '../../domain/task-model';

export class TodoListModels {
    public static initTaskSchema(): mongoose.Schema {
        return new mongoose.Schema(TaskSchema);
    }
}
