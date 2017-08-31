import * as express from 'express';

export class ErrorMiddleware {
    constructor(
        private environment: any
    ) { }

    public notFound(req: express.Request, res: express.Response, next: express.NextFunction) {
        // Show message for 404 errors
        res.status(404).json({error: req.originalUrl + ' not found'});
        next();
    }

    public internalServerError(environment: any, err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        // Show error without details (and log them) for 500 errors
        res.status(500).json({error: environment.serverErrorMessage});
        console.error(err);
        // TODO: Log in a file?
        next();
    }
}
