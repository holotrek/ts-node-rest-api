import { MongoModel } from './mongo-model';

export class UserModel extends MongoModel {
    name: string;
    authId: string;
    strategyId: string;
    created: number;
    updated: number;
    createdBy: string;
    updatedBy: string;
}

export class OAuthUserModel extends UserModel {
    accessToken: string;
    refreshToken: string;
}

export class HttpAuthUserModel extends UserModel {
    passwordHash: string;
    passwordSalt: string;
    sessionToken: string;
    sessions: [
        {
            sessionToken: string;
            expires: number;
        }
    ];
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
        enum: ['basic', 'digest', 'facebook', 'github', 'google'],
        required: 'Auth Strategy is required.'
    },
    accessToken: {
        type: String
    },
    refreshToken: {
        type: String
    },
    passwordHash: {
        type: String
    },
    passwordSalt: {
        type: String
    },
    sessionToken: {
        type: String
    },
    sessions: [
        {
            sessionToken: {
                type: String
            },
            expires: {
                type: Number,
                default: Date.now() + (24 * 60 * 60 * 1000)
            }
        }
    ],
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
