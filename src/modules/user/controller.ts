import { Request, Response, Application } from 'express';
import OperationsUser from './operations';
import jwt from 'express-jwt';

export class UserRoutes {
    private userController: UserController = new UserController();

    public route(app: Application) {
        app.post('/api/new/user', jwt({
            secret: app.get('secret'),
            credentialsRequired: true,
            algorithms: ['HS256']
        }), (req: Request, res: Response) => {
            this.userController.registerUser(req, res);
        });

        app.get('/api/get/user', jwt({
            secret: app.get('secret'),
            credentialsRequired: true,
            algorithms: ['HS256']
        }), (req: Request, res: Response) => {
            this.userController.getUsers(req, res);
        });

        // app.put('/api/user/:id', (req: Request, res: Response) => {
        //     userController.update_user(req, res);
        // });

        app.delete('/api/user', (req: Request, res: Response) => {
            this.userController.deleteUser(req, res);
        });

    }
}

class UserController {
    private operation: OperationsUser = new OperationsUser();

    public async registerUser(req: Request, res: Response) {
        try {
            let idNewUser = null;
            if (!!req.body.name && !!req.body.email && !!req.body.user && !!req.body.password) {
                idNewUser = await this.operation.createUser({
                    name: req.body.name,
                    email: req.body.email,
                    user: req.body.user,
                    password: req.body.password,
                    phone: req.body.phone || null,
                    age: req.body.age || null,
                    gender: req.body.gender || null,
                    hobby: req.body.hobby || null,
                });
            } else {
                throw new Error("Datos de registros no proporcionados o invalidos");
            }
            res.status(200).send({ user: idNewUser });
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    public async getUsers(req: Request, res: Response) {
        try {
            let data = null;
            const query: any = {};
            if (!!req.query.user) {
                query['user'] = req.query.user;
            }
            if (!!req.query.hobby) {
                try {
                    query['hobby'] = new RegExp(req.query.hobby.toString(), 'i');
                } catch (error) {
                    query['hobby'] = req.query.hobby;
                }
            }
            data = await this.operation.filterUsers(query);
            res.status(200).send(data);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    public async deleteUser(req: Request, res: Response) {
        try {
            if (!!req.query.id) {
                const query: any = {};
                query['_id'] = req.query.id;
                const deleted = await this.operation.deleteUser(query);
                if (deleted) {
                    res.status(200).send(true);
                } else {
                    throw new Error("Usuario a eliminar no econtrado");
                }
            } else {
                throw new Error("Usuario a eliminar no proporcionado");

            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
}
