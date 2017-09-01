export const TYPES = {
    // Constants
    encryptionKey: Symbol('encryptionKey'),
    sessionTimeout: Symbol('sessionTimeout'),

    // Providers
    CryptoProvider: Symbol('CryptoProvider'),
    UserProvider: Symbol('UserProvider'),

    // Repositories
    TaskRepository: Symbol('TaskRepository'),
    UserRepository: Symbol('UserRepository'),

    // Services
    TaskService: Symbol('TaskService'),
    UserService: Symbol('UserService')
}
