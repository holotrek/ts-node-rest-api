import * as mongoose from 'mongoose';

import { TaskSchema } from '../domain/task-model';
import { UserSchema } from '../domain/user-model';

export class ModelBinder {
    public static initSchema() {
        mongoose.model('Tasks', new mongoose.Schema(TaskSchema));
        mongoose.model('Users', new mongoose.Schema(UserSchema));
    }
}
