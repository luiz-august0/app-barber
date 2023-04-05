import { Router, static as Static } from "express";
import multer from "multer";
import SessionController from "./routes/SessionController";
import auth from "./middlewares/auth";
import UsuarioController from "./routes/UsuarioController";
import BarbeariaController from "./routes/BarbeariaController";
import { storage } from './uploadFile';
const uploadFile = require('./uploadFile');

const upload = multer({ storage: storage });

const routes = new Router();

routes.use('/upload_files', Static("upload_files"));
routes.post('/usuario', UsuarioController.create);
routes.post('/usuarioVerify', UsuarioController.verify);
routes.post('/usuario_emailrecuperacao', UsuarioController.postEnviaEmailRecuperacaoSenha);
routes.post('/usuario_recuperacao', UsuarioController.postRecuperacaoSenha);
routes.put('/sessions', SessionController.create);
routes.use(auth);

//Rotas usuário
routes.get('/usuario', UsuarioController.index);
routes.get('/usuario/:id', UsuarioController.show);
routes.put('/usuario/:id', UsuarioController.update);
routes.put('/usuario_password/:id', UsuarioController.updatePassword);
routes.post('/usuariobarbeiro_email', UsuarioController.getDataUsuarioBarbeiroWithEmail);
routes.post('/usuario_perfil/:id', (req, res) => {
	uploadFile(req.body.file)
		.then((url) => {
			try {
				UsuarioController.updateFotoPerfil(req.params.id, url);
				return res.status(201).json(url);
			} catch (err) {
				res.status(500).json(err);
			}
		})
		.catch((err) => res.status(500).json(err));
});
routes.delete('/usuario/:id', UsuarioController.destroy);

//Rotas barbearia
routes.get('/barbearia', BarbeariaController.getBarbearias);
routes.get('/barbearia/:id', BarbeariaController.getDadosBarbearia);
routes.get('/barbearia_usuario/:id', BarbeariaController.getBarbeariasUsuario);
routes.post('/barbearia', BarbeariaController.postBarbearia);
routes.put('/barbearia/:id', BarbeariaController.updateBarbearia);
routes.delete('/barbearia/:id', BarbeariaController.deleteBarbearia);
routes.get('/barbearia_contatos/:id', BarbeariaController.getBarbeariaContatos);
routes.post('/barbearia_contatos/:id', BarbeariaController.postBarbeariaContatos);
routes.post('/barbearia_contatos_remove/:id', BarbeariaController.deleteBarbeariaContatos);
routes.get('/barbearia_proprietarios/:id', BarbeariaController.getBarbeariaProprietarios);
routes.post('/barbearia_proprietarios/:id', BarbeariaController.postBarbeariaProprietarios);
routes.post('/barbearia_proprietarios_remove/:id', BarbeariaController.deleteBarbeariaProprietarios);
routes.post('/barbearia_logo/:id', (req, res) => {
	uploadFile(req.body.file)
		.then((url) => {
			try {
				BarbeariaController.updateLogoBarbearia(req.params.id, url);
				return res.status(201).json(url);
			} catch (err) {
				res.status(500).json(err);
			}
		})
		.catch((err) => res.status(500).json(err));
});
routes.get('/barbearia_horarios', BarbeariaController.getHorarios);
routes.post('/barbearia_horarios_dia/:id', BarbeariaController.getBarbeariaHorariosDia);

export default routes;