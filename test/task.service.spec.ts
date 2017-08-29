import { TaskRepositoryInterface } from '../src/repositories/task-repository.interface';
import { TaskService } from '../src/services/task.service';

describe('Task Service', () => {
    let taskService: TaskService;
    const taskRepoSpy = jasmine.createSpyObj<TaskRepositoryInterface>('TaskRepositoryInterface', [
        'getTasks', 'getTask', 'createTask', 'updateTask', 'deleteTask'
    ]);

    beforeEach(() => {
        taskService = new TaskService(taskRepoSpy);
    });

    it('Calls getTasks with no conditions when listing all tasks', () => {
        taskService.listAllTasks();
        expect(taskRepoSpy.getTasks).toHaveBeenCalledWith({});
    });
});
