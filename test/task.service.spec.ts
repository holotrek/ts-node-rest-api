import { Mockgoose } from 'mockgoose';
import * as mongoose from 'mongoose';

import { TodoListModels } from '../src/api/models/todo-list-models';
import { TaskService } from '../src/services/task.service';

const mockgoose = new Mockgoose(mongoose);

describe('Task Service', () => {
    let taskService: TaskService;

    beforeEach(done => {
        mockgoose.prepareStorage().then(() => {
            mongoose.connect('mongodb://example/TestingDB', err => {
                done.fail(err);
            });
            mongoose.connection.on('connected', () => {
                console.log('mock db connection is open');
            });
        });

        TodoListModels.initTaskSchema();
        taskService = new TaskService();
    });

    it('Gets empty array if nothing is in DB', done => {
        taskService.listAllTasks().then(data => {
            expect(data.length).toBe(0);
            done();
        });
    });
});
