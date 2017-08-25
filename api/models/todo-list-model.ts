import * as mongoose from 'mongoose';

export class TodoListModel {
    public static initTaskSchema(): mongoose.Schema {
        return new mongoose.Schema({
            name: {
                type: String,
                required: 'Kindly enter the name of the task'
            },
            Created_date: {
                type: Date,
                default: Date.now
            },
            status: {
                type: [{
                    type: String,
                    enum: ['pending', 'ongoing', 'completed']
                }],
                default: ['pending']
            }
        });
    }
}
