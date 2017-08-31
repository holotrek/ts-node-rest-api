import { Container } from 'inversify';

import { TodoListController } from '../api/controllers/todo-list-controller';
import { TaskRepository } from '../data/task-repository';
import { TaskRepositoryInterface } from '../repositories/task-repository.interface';
import { TaskService } from '../services/task.service';
import { TaskServiceInterface } from '../services/task.service.interface';
import { TYPES } from './types';

export module IoC {
    // Configure container
    export const container = new Container();

    // Providers

    // Repositories
    container.bind<TaskRepositoryInterface>(TYPES.TaskRepository).to(TaskRepository);

    // Services
    container.bind<TaskServiceInterface>(TYPES.TaskService).to(TaskService);

    // Controllers
    container.bind<TodoListController>(TodoListController).toSelf();
}
