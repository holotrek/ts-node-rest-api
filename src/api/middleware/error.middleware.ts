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
        // If error has stack trace, show generic error, otherwise show the error (validation/promise rejection, etc)
        if (err.stack) {
            res.status(500).json({error: environment.serverErrorMessage});
            console.error(err);
        }
        else {
            res.status(500).json({error: err});
            console.error(err);
        }

        // TODO: Log in a file?
        next();
    }
}
