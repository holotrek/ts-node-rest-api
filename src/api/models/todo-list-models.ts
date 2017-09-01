import * as mongoose from 'mongoose';

import { TaskSchema } from '../../domain/task-model';
import { UserSchema } from '../../domain/user-model';

export class TodoListModels {
    public static initTaskSchema(): mongoose.Schema {
        return new mongoose.Schema(TaskSchema);
    }
    public static initUserSchema(): mongoose.Schema {
        return new mongoose.Schema(UserSchema);
    }
}
