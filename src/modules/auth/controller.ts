import { Request, Response, Application } from 'express';
import OperationsUser from './../user/operations';
import jwt from 'jsonwebtoken';

export class AuthRoutes {
    private authController: AuthController = new AuthController();

    public route(app: Application) {
        app.post('/auth', (req: Request, res: Response) => {
            this.authController.loginUser(req, res, app);
        });
    }
}

class AuthController {
    private operation: OperationsUser = new OperationsUser();

    public async loginUser(req: Request, res: Response, app: Application) {
        try {
            if (!!req.body.username && !!req.body.password) {
                const bcrypt = require('bcryptjs');
                const data: any = await this.operation.filterUser({ user: req.body.username });
                if (!!data && bcrypt.compareSync(req.body.password, data.password)) {
                    const payload = {
                        id: data._id,
                        name: data.name,
                        email: data.email
                    };
                    const token = jwt.sign(payload, app.get('secret'), {
                        expiresIn: 1440,
                    });
                    res.json({
                        mensaje: 'Autenticación correcta',
                        token: token
                    });
                } else {
                    throw new Error("Datos de acceso invalidos");
                }
            } else {
                throw new Error("Datos de acceso no encontrados");
            }
        } catch (error) {
            res.status(400).send(error.message);
        }

    }

}