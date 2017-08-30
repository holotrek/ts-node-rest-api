export class UserModel {
    name: string;
    authId: string;
    authStrategy: string;
    created: number;
    updated: number;
    createdBy: string;
    updatedBy: string;
}

export const UserSchema = {
    name: {
        type: String,
        required: 'Task Name is required.'
    },
    authId: {
        type: String,
        required: 'Auth ID is required.'
    },
    authStrategy: {
        type: String,
        enum: ['google', 'twitter', 'github'],
        required: 'Auth Strategy is required.'
    },
    created: {
        type: Number,
        default: Date.now()
    },
    updated: {
        type: Number,
        default: Date.now()
    },
    createdBy: {
        type: String,
        required: 'Created By is required.'
    },
    updatedBy: {
        type: String
    }
};
