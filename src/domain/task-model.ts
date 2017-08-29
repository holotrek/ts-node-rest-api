export class TaskModel {
    name: string;
    status: string;
    created: number;
    updated: number;
    createdBy: string;
    updatedBy: string;
}

export const TaskSchema = {
    name: {
        type: String,
        required: 'Task Name is required.'
    },
    status: {
        type: [{
            type: String,
            enum: ['pending', 'ongoing', 'completed']
        }],
        default: ['pending']
    },
    created: {
        type: Number,
        default: Date.now()
    },
    updated: {
        type: Number
    },
    createdBy: {
        type: String,
        required: 'Created By is required.'
    },
    updatedBy: {
        type: String
    }
};
