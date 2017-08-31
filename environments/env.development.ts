export const environment = {
    connectionString: 'mongodb://localhost/Tododb',
    serverUrl: 'http://localhost:3000',
    clientAuthUrl: 'http://localhost:4200',
    sessionTimeout: 365 * 24 * 60 * 60 * 1000, // one year in milliseconds
    useBasicAuth: true,
    useDigestAuth: false,
    useFacebookAuth: true,
    useGithubAuth: true,
    useGoogleAuth: true
}
