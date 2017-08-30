import { MongoModel } from './mongo-model';

export class UserModel extends MongoModel {
    name: string;
    authId: string;
    strategyId: string;
    accessToken: string;
    refreshToken: string;
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
    strategyId: {
        type: String,
        enum: ['google', 'twitter', 'github'],
        required: 'Auth Strategy is required.'
    },
    accessToken: {
        type: String
    },
    refreshToken: {
        type: String
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
