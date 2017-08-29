import { TaskModel } from '../src/domain/task-model';
import { TaskRepositoryInterface } from '../src/repositories/task-repository.interface';
import { TaskService } from '../src/services/task.service';
import { UserProviderInterface } from '../src/providers/user.provider.interface';

describe('Task Service', () => {
    let taskService: TaskService;
    const userProviderSpy = jasmine.createSpyObj<UserProviderInterface>('UserProviderInterface', [
        'userName', 'isAuthenticated', 'setCurrentUser'
    ]);
    const taskRepoSpy = jasmine.createSpyObj<TaskRepositoryInterface>('TaskRepositoryInterface', [
        'getTasks', 'getTask', 'createTask', 'updateTask', 'deleteTask'
    ]);

    beforeEach(() => {
        taskService = new TaskService(taskRepoSpy, userProviderSpy);
    });

    it('Gets tasks', done => {
        taskRepoSpy.getTasks.and.returnValue(Promise.resolve([]));
        taskService.listAllTasks().then(data => {
            expect(taskRepoSpy.getTasks).toHaveBeenCalledWith({});
            expect(data).toEqual([]);
            done();
        });
    });

    it('Gets task with specified ID', done => {
        const task = new TaskModel();
        taskRepoSpy.getTask.and.returnValue(Promise.resolve(task));
        const request = { params: { taskId: 1 } };
        taskService.getTask(request).then(data => {
            expect(taskRepoSpy.getTask).toHaveBeenCalledWith(1);
            expect(data).toEqual(task);
            done();
        });
    });

    it('Errors when getting task with no task ID', done => {
        const task = new TaskModel();
        taskRepoSpy.getTask.and.returnValue(Promise.resolve(task));
        const request = { params: null };
        taskService.getTask(request).catch(err => {
            expect(err).toBe('The Request Parameter {taskId} is required.');
            done();
        });
    });

    it('Creates task', done => {
        const task = new TaskModel();
        taskRepoSpy.createTask.and.returnValue(Promise.resolve(task));
        const request = { body: task };
        taskService.createTask(request).then(data => {
            expect(taskRepoSpy.createTask).toHaveBeenCalledWith(task);
            expect(data).toEqual(task);
            done();
        });
    });

    it('Updates task', done => {
        const task = new TaskModel();
        taskRepoSpy.updateTask.and.returnValue(Promise.resolve(task));
        const request = {
            params: { taskId: 1 },
            body: task
        };
        taskService.updateTask(request).then(data => {
            expect(taskRepoSpy.updateTask).toHaveBeenCalledWith(1, task);
            expect(data).toEqual(task);
            done();
        });
    });

    it('Deletes task with specified ID', done => {
        taskRepoSpy.deleteTask.and.returnValue(Promise.resolve({ message: 'Task successfully deleted' }));
        const request = { params: { taskId: 1 } };
        taskService.deleteTask(request).then(data => {
            expect(taskRepoSpy.deleteTask).toHaveBeenCalledWith(1);
            expect(data.message).toEqual('Task successfully deleted');
            done();
        });
    });
});
