export interface TaskServiceInterface {
    listAllTasks(): Promise<any>;
    createTask(request: any): Promise<any>;
    getTask(request: any): Promise<any>;
    updateTask(request: any): Promise<any>;
    deleteTask(request: any): Promise<any>;
}
