import { Application, Request, Response } from "express";
import { UserRoutes } from "./../modules/user/controller";
import { AuthRoutes } from "./../modules/auth/controller";

export class Routes {

    public initRoutes(app: Application) {
        this.defaultRoute(app);
        this.initAuth(app);
        this.initUsers(app);

        this.notFoundRoute(app);
    }

    private initAuth(app: Application) {
        const user = new AuthRoutes();
        user.route(app);
    }

    private initUsers(app: Application) {
        const user = new UserRoutes();
        user.route(app);
    }

    private defaultRoute(app: Application) {
        app.all('/', (req: Request, res: Response) => {
            res.status(200).send({ message: 'SERVIDOR INICIADO' });
        });
        app.all('/api', (req: Request, res: Response) => {
            res.status(200).send({ message: 'API INICIADA' });
        });
    }

    private notFoundRoute(app: Application) {
        app.all('*', (req: Request, res: Response) => {
            res.status(404).send({ error: true, message: 'URL Invalida' });
        });
    }
}