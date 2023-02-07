import { Router, static as Static } from "express";
import multer from "multer";
import SessionController from "./routes/SessionController";
import auth from "./middlewares/auth";
import UsuarioController from "./routes/UsuarioController";
import { storage } from './uploadFile';

const upload = multer({ storage: storage });

const routes = new Router();

routes.use('/upload_files', Static("upload_files"));
routes.post('/usuario', UsuarioController.create);
routes.post('/usuarioVerify', UsuarioController.verify);
routes.put('/sessions', SessionController.create);
routes.use(auth);

//Rotas usuário
routes.get('/usuario', UsuarioController.index);
routes.get('/usuario/:id', UsuarioController.show);
routes.put('/usuario/:id', UsuarioController.update);
routes.put('/usuario_password/:id', UsuarioController.updatePassword);
routes.post('/usuario_perfil/:id', upload.single("file"), (req, res) => {
	UsuarioController.updateFotoPerfil(req.params.id, req.file.filename);
	return res.json(req.file.filename);
});
routes.delete('/usuario/:id', UsuarioController.destroy);

export default routes;