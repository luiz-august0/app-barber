import axios from "axios";

export const api = axios.create({
    baseURL: 'http://10.47.0.137:5000'
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
    return api.post('/usuarioVerify', { email, cpf })
};

export const createUsuario = async (email, nome, senha, contato, cpf, tipo) => {
    return api.post('/usuario', { email, nome, senha, contato, cpf, tipo });
};

export const updateUsuario = async (email, nome, contato, cpf, usuarioID) => {
    return api.put(`/usuario/${usuarioID}`, { email, nome, contato, cpf });
};

export const updateUsuarioPassword = async (senhaAntiga, senhaNova, usuarioID) => {
    return api.put(`/usuario_password/${usuarioID}`, { senhaAntiga, senhaNova });
};

export const deleteUsuario = async (usuarioID) => {
    return api.delete(`/usuario/${usuarioID}`);
};

export const updateUsuarioFoto = async (usuarioID, file) => {
    return api.post(`/usuario_perfil/${usuarioID}`, { file });
};

export const getUsuario = async (usuarioID) => {
    return api.get(`/usuario/${usuarioID}`);
};
/**************************************************************/

//Rotas barbearia
export const getBarbeariasUsuario = async (usuarioID) => {
    return api.get(`/barbearia_usuario/${usuarioID}`);
};

export const getDadosBarbearia = async (barbeariaID) => {
    return api.get(`/barbearia/${barbeariaID}`);
};

export const getContatosBarbearia = async (barbeariaID) => {
    return api.get(`/barbearia_contatos/${barbeariaID}`);
};

export const postContatosBarbearia = async (descricao, contato, barbeariaID) => {
    return api.post(`/barbearia_contatos/${barbeariaID}`, {descricao, contato});
};

export const deleteContatosBarbearia = async (contato, barbeariaID) => {
    return api.post(`/barbearia_contatos_remove/${barbeariaID}`, {contato});
};

export const getProprietariosBarbearia = async (barbeariaID) => {
    return api.get(`/barbearia_proprietarios/${barbeariaID}`);
};

export const postProprietariosBarbearia = async (proprietarioCod, barbeariaID) => {
    return api.post(`/barbearia_proprietarios/${barbeariaID}`, {proprietarioCod});
};

export const deleteProprietariosBarbearia = async (proprietarioCod, barbeariaID) => {
    return api.post(`/barbearia_proprietarios_remove/${barbeariaID}`, {proprietarioCod});
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

export const postBarbeariaFoto = async (barbeariaID, file) => {
    return api.post(`/barbearia_logo/${barbeariaID}`, { file });
};
/**************************************************************/