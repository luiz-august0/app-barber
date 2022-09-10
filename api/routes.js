import { Router } from "express";
import UsuarioController from "./routes/UsuarioController";
import auth from "./middlewares/auth";
import SessionController from "./routes/SessionController";
import AnimalController from "./routes/AnimalController";

const routes = new Router();

routes.put('/sessions', SessionController.create);
routes.use(auth);

//Rotas usuário
routes.post('/usuario', UsuarioController.create);
routes.get('/usuario', UsuarioController.index);
routes.get('/usuario/:login', UsuarioController.show);
routes.put('/usuario/:id', UsuarioController.update);
routes.delete('/usuario/:id', UsuarioController.destroy);
routes.get('/setor', UsuarioController.indexSetor);

//Rotas animal
routes.post('/animal', AnimalController.create);
routes.get('/animal', AnimalController.index);
routes.get('/animal/:id', AnimalController.show);
routes.put('/animal/:id', AnimalController.update);
routes.delete('/animal/:id', AnimalController.destroy);

export default routes;