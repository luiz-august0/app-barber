import axios from "axios";

export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL
});

//Rotas de apis externas
export const getDadosCEP = async(cep) => {
    return api.get(`https://viacep.com.br/ws/${cep}/json/`);
}
/**************************************************************/

//Rota de sessão
export const createSession = async (email, senha) => {
    return api.put('/sessions', { email, senha });
};
/**************************************************************/

//Rota de usuários
export const getUsuarios = async () => { 
    return api.get('/usuario');
};

export const verifyUsuario = async (email, cpf) => {
    return api.post('/usuario/verify', { email, cpf })
};

export const createUsuario = async (email, nome, senha, contato, cpf, tipo) => {
    return api.post('/usuario', { email, nome, senha, contato, cpf, tipo });
};

export const updateUsuario = async (email, nome, contato, cpf, usuarioID) => {
    return api.put(`/usuario/${usuarioID}`, { email, nome, contato, cpf });
};

export const updateUsuarioPassword = async (senhaAntiga, senhaNova, usuarioID) => {
    return api.put(`/usuario/password/${usuarioID}`, { senhaAntiga, senhaNova });
};

export const deleteUsuario = async (usuarioID) => {
    return api.delete(`/usuario/${usuarioID}`);
};

export const updateUsuarioFoto = async (usuarioID, file) => {
    return api.post(`/usuario/perfil/${usuarioID}`, { file });
};

export const getUsuario = async (usuarioID) => {
    return api.get(`/usuario/${usuarioID}`);
};

export const getUsuarioBarbeiroWithEmail = async(email) => {
    return api.post('/usuario/barbeiro/email', { email });
};

export const postEnviaEmailRecuperacaoSenha = async(email) => {
    return api.post('/usuario/email/recuperacao', { email });
};
/**************************************************************/

//Rotas barbearia
export const getBarbeariasUsuario = async (usuarioID) => {
    return api.get(`/barbearia/usuario/${usuarioID}`);
};

export const getDadosBarbearia = async (barbeariaID) => {
    return api.get(`/barbearia/${barbeariaID}`);
};

export const getBarbeariasPesquisa = async (nome, cidade, endRua, endNumero, endBairro, usuarioID) => {
    return api.post('/barbearia/pesquisa', { nome, cidade, endRua, endNumero, endBairro, usuarioID });
};

export const getBarbeariasVisitadas = async (id) => {
    return api.get(`/barbearia/visitadas/${id}`);
};

export const getContatosBarbearia = async (barbeariaID) => {
    return api.get(`/barbearia/contatos/${barbeariaID}`);
};

export const postContatosBarbearia = async (descricao, contato, barbeariaID) => {
    return api.post(`/barbearia/contatos/${barbeariaID}`, {descricao, contato});
};

export const deleteContatosBarbearia = async (contato, barbeariaID) => {
    return api.post(`/barbearia/contatos/remove/${barbeariaID}`, {contato});
};

export const getProprietariosBarbearia = async (barbeariaID) => {
    return api.get(`/barbearia/proprietarios/${barbeariaID}`);
};

export const postProprietariosBarbearia = async (proprietarioCod, barbeariaID) => {
    return api.post(`/barbearia/proprietarios/${barbeariaID}`, {proprietarioCod});
};

export const deleteProprietariosBarbearia = async (proprietarioCod, barbeariaID) => {
    return api.post(`/barbearia/proprietarios/remove/${barbeariaID}`, {proprietarioCod});
};

export const postBarbearia = async(nome, razao, cnpj, inscEstadual, cidade, cep, uf, rua, numero, bairro, complemento, latitude, longitude) => {
    return api.post('/barbearia', { nome, razao, cnpj, inscEstadual, cidade, cep, uf, rua, numero, bairro, complemento, latitude, longitude })
};

export const updateBarbearia = async(nome, razao, cnpj, inscEstadual, cidade, cep, uf, rua, numero, bairro, complemento, latitude, longitude, barbeariaID) => {
    return api.put(`/barbearia/${barbeariaID}`, { nome, razao, cnpj, inscEstadual, cidade, cep, uf, rua, numero, bairro, complemento, latitude, longitude })
};

export const deleteBarbearia = async(barbeariaID) => {
    return api.delete(`/barbearia/${barbeariaID}`)
};

export const postBarbeariaLogo = async (barbeariaID, file) => {
    return api.post(`/barbearia/logo/${barbeariaID}`, { file });
};

export const getHorarios = async () => {
    return api.get('/barbearia_horarios');
};

export const getBarbeariaHorariosDia = async (barbeariaID, dia) => {
    return api.post(`/barbearia/horariosdia/${barbeariaID}`, { dia });
};

export const postBarbeariaHorarioDia = async (barbeariaID, dia, hrInicial, hrFinal) => {
    return api.post(`/barbearia/horariodia/post/${barbeariaID}`, { dia, hrInicial, hrFinal });
};

export const updateBarbeariaHorarioDia = async (idSeq, hrInicial, hrFinal) => {
    return api.post(`/barbearia/horariodia/update/${idSeq}`, { hrInicial, hrFinal });
};

export const deleteBarbeariaHorarioDia = async (idSeq) => {
    return api.delete(`/barbearia/horariodia/delete/${idSeq}`);
};

export const postBarbeariaCategoria = async(idBarbearia, nome) => {
    return api.post('/barbearia/categoria', { idBarbearia, nome })
};

export const updateBarbeariaCategoria = async(id, idBarbearia, nome) => {
    return api.put(`/barbearia/categoria/${id}`, { idBarbearia, nome });
};

export const getBarbeariaCategorias = async(idBarbearia) => {
    return api.get(`/barbearia/categoria/${idBarbearia}`);
};

export const deleteBarbeariaCategoria = async(id) => {
    return api.delete(`/barbearia/categoria/${id}`);
};

export const getBarbeariaCategoriaServicos = async(id) => {
    return api.get(`/barbearia/servicoscategoria/${id}`);  
};

export const showBarbeariaServico = async(id) => {
    return api.get(`/barbearia/servico/${id}`)
}

export const postBarbeariaServico = async(nome, idCategoria, valor, duracao) => {
    return api.post('/barbearia/servico', { nome, idCategoria, valor, duracao });
};

export const updateBarbeariaServico = async(id, nome, valor, duracao) => {
    return api.put(`/barbearia/servico/${id}`, { nome, valor, duracao });
};

export const deleteBarbeariaServico = async(id) => {
    return api.delete(`/barbearia/servico/${id}`);
};

export const postImagemServico = async(id, file) => {
    return api.post(`/barbearia/servicoimagem/${id}`, { file });
};

export const deleteImagemServico = async(id, imgUrl) => {
    return api.post(`/barbearia/servicoimagem/remove/${id}`, { imgUrl });
};

export const getImagensServico = async(id) => {
    return api.get(`/barbearia/servicoimagens/${id}`); 
};

//Rotas Barbeiro
export const postBarbeiro = async(barbeariaID, usuarioID, especialidade) => {
    return api.post('/barbearia/barbeiro', { barbeariaID, usuarioID, especialidade });
};

export const updateBarbeiro = async(barbeariaID, usuarioID, especialidade) => {
    return api.post('/barbearia/barbeiro/atualiza', { barbeariaID, usuarioID, especialidade });
};

export const deleteBarbeiro = async(barbeariaID, usuarioID) => {
    return api.post('/barbearia/barbeiro/remove', { barbeariaID, usuarioID });
};

export const getBarbeirosByBarbearia = async(id) => {
    return api.get(`/barbearia/barbeiros/byBarbearia/${id}`);
};

export const getBarbeirosByServico = async(id, servicoID) => {
    return api.post(`/barbearia/barbeiros/byServico/${id}`, { servicoID });
};

export const getBarbeirosByUsuario = async(id) => {
    return api.get(`/barbearia/barbeiros/byUsuario/${id}`);
};

export const getBarbeariasByBarbeiro = async(id) => {
    return api.get(`/barbearia/barbearias/byBarbeiro/${id}`);
};

export const getDataBarbeiro = async(barbeariaID, usuarioID) => {
    return api.post('/barbearia/barbeiro/data', { barbeariaID, usuarioID });
};

export const getServicosBarbeiro = async(usuarioID, barbeariaID, categoriaID) => {
    return api.post('/barbeiro/servico/get', { usuarioID, barbeariaID, categoriaID });
};

export const postServicoBarbeiro = async(usuarioID, barbeariaID, servicoID) => {
    return api.post('/barbeiro/servico/post', { usuarioID, barbeariaID, servicoID });
};

export const deleteServicoBarbeiro = async(usuarioID, barbeariaID) => {
    return api.post('/barbeiro/servico/remove', { usuarioID, barbeariaID });
};

//Rotas agendamento
export const getHorariosDisponiveisBarbeiro = async(barbeariaID, barbeiroID, data, tempServ) => {
    return api.post("/barbeiro/agendamento/horarios", { barbeariaID, barbeiroID, data, tempServ });
};

export const postAgendamento = async(barbeariaID, barbeiroID, usuarioID, servicoID, tempServ, horaInicio, data) => {
    return api.post("/barbearia/agendamento", { barbeariaID, barbeiroID, usuarioID, servicoID, tempServ, horaInicio, data });
};

export const updateStatusAgendamento = async(id, status) => {
    return api.put(`/barbearia/agendamento/${id}`, { status });
};

export const deleteAgendamento = async(id) => {
    return api.delete(`/barbearia/agendamento/${id}`);
};

export const getAgendamentos = async(barbeariaID, barbeiroID, usuarioID, servicoID, dataInicio, dataFim, status) => {
    return api.post("/barbearia/agendamento/get", { barbeariaID, barbeiroID, usuarioID, servicoID, dataInicio, dataFim, status });
};

export const postAvaliacao = async(usuarioID, barbeariaID, barbeiroID, mensagem, rate) => {
    return api.post("/barbearia/agendamento/avaliacao", { usuarioID, barbeariaID, barbeiroID, mensagem, rate })
};
/**************************************************************/

/*GoogleMaps*/
export const getGeocoding = async (rua, numero, bairro, cidade, uf, cep) => {
    return api.post(`https://maps.googleapis.com/maps/api/geocode/json?address=${rua},+${numero}+-+${bairro},+${cidade}+-+${uf},+${cep}&key=${process.env.EXPO_PUBLIC_MAPS_KEY}`);
};