import { Router } from "express";
import SessionController from "./routes/SessionController";
import auth from "./middlewares/auth";
import UsuarioController from "./routes/UsuarioController";
import BarbeariaController from "./routes/BarbeariaController";
import BarbeariaHorariosController from "./routes/BarbeariaHorariosController";
import BarbeariaServicosController from "./routes/BarbeariaServicosController";
import BarbeariaBarbeirosController from "./routes/BarbeariaBarbeirosController";
import Queue from "./lib/Queue";
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const uploadFile = require('./services/uploadFile');

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({	
	queues: Queue.queues.map(queue => new BullAdapter(queue.bull)),
  	serverAdapter 
})

const routes = new Router();

routes.use('/admin/queues', serverAdapter.getRouter());
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
routes.get('/barbearia_horarios', BarbeariaHorariosController.getHorarios);
routes.post('/barbearia_horarios_dia/:id', BarbeariaHorariosController.getBarbeariaHorariosDia);
routes.post('/barbearia_horariodia_post/:id', BarbeariaHorariosController.postBarbeariaHorarioDia);
routes.post('/barbearia_horariodia_update/:id', BarbeariaHorariosController.updateBarbeariaHorarioDia);
routes.delete('/barbearia_horariodia_delete/:id', BarbeariaHorariosController.deleteBarbeariaHorarioDia);
routes.get('/barbearia_categoria/:id', BarbeariaServicosController.getBarbeariaCategorias);
routes.get('/barbearia_categoriaById/:id', BarbeariaServicosController.showBarbeariaCategoria);
routes.post('/barbearia_categoria', BarbeariaServicosController.postBarbeariaCategoria);
routes.put('/barbearia_categoria/:id', BarbeariaServicosController.updateBarbeariaCategoria);
routes.delete('/barbearia_categoria/:id', BarbeariaServicosController.deleteBarbeariaCategoria);
routes.get('/barbearia_servicoscategoria/:id', BarbeariaServicosController.getBarbeariaCategoriaServicos);
routes.get('/barbearia_servico/:id', BarbeariaServicosController.showBarbeariaServico);
routes.post('/barbearia_servico', BarbeariaServicosController.postBarbeariaServico);
routes.put('/barbearia_servico/:id', BarbeariaServicosController.updateBarbeariaServico);
routes.delete('/barbearia_servico/:id', BarbeariaServicosController.deleteBarbeariaServico);
routes.get('/barbearia_servicoimagens/:id', BarbeariaServicosController.getImagensServico);
routes.post('/barbearia_servicoimagem/:id', (req, res) => {
	uploadFile(req.body.file)
		.then((url) => {
			try {
				BarbeariaServicosController.postImagemServico(req.params.id, url);
				return res.status(201).json(url);
			} catch (err) {
				res.status(500).json(err);
			}
		})
		.catch((err) => res.status(500).json(err));
});
routes.post('/barbearia_servicoimagem_remove/:id', BarbeariaServicosController.deleteImagemServico);
routes.post('/barbearia_barbeiro', BarbeariaBarbeirosController.postBarbeiro);
routes.post('/barbearia_barbeiro_atualiza', BarbeariaBarbeirosController.updateBarbeiro);
routes.post('/barbearia_barbeiro_remove', BarbeariaBarbeirosController.deleteBarbeiro);
routes.get('/barbearia_barbeirosByBarbearia/:id', BarbeariaBarbeirosController.getBarbeirosByBarbearia);
routes.get('/barbearia_barbeariasByBarbeiro/:id', BarbeariaBarbeirosController.getBarbeariasByBarbeiro);
routes.post('/barbearia_barbeiroData', BarbeariaBarbeirosController.getDataBarbeiro);
routes.post('/barbeiro_servico_get', BarbeariaBarbeirosController.getServicosBarbeiro);
routes.post('/barbeiro_servico_post', BarbeariaBarbeirosController.postServicoBarbeiro);
routes.post('/barbeiro_servico_remove', BarbeariaBarbeirosController.deleteServicoBarbeiro);

export default routes;