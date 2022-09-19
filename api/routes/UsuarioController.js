import { createPasswordHash } from '../services/auth';

const mysql = require('../config/mysql').pool;

class UsuarioController {
    async index(req, res) {
        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                        return res.status(201).json(result);
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }

    async show (req, res) {
        try {
            const { id } = req.params;

            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * from usuario WHERE Usr_Codigo = ${id}`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                        if (!result) {
                            return res.status(404).json();
                        }
                        return res.status(201).json(result);
                    }
                )
                conn.release();
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
        }
    }

    async create(req, res) {
        try {
            const { email, nome, senha, contato, cpf, tipo } = req.body;

            const encryptedPassword = await createPasswordHash(senha);
            
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario WHERE Usr_Email = "${email}"`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                    
                        if (JSON.stringify(result) != '[]') {
                            return res.status(401).json('Email ja cadastrado');
                        } else {
                            conn.query(
                                `INSERT INTO usuario (Usr_Email, Usr_Nome, Usr_Senha, Usr_Contato, Usr_CPF, Usr_Tipo) VALUES ` + 
                                `("${email}", "${nome}", "${encryptedPassword}", ${contato != ''?`"${contato}"`:'NULL'}, ${cpf != ''?`"${cpf}"`:'NULL'}, "${tipo}")`,
                                (error, result, fields) => {
                                    if (error) { return res.status(500).send({ error: error }) }
                                    return res.status(201).json(result);
                                }
                            )
                        }
                    }
                )
                conn.release();
            });
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { email, nome, senha, contato, cpf } = req.body;
            const encryptedPassword = await createPasswordHash(senha);

            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario WHERE Usr_Codigo = "${id}"`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }

                        if (JSON.stringify(result) === '[]') {
                            return res.status(404).json('Usuário não encontrado');
                        }
                        else {
                            conn.query(
                                `SELECT Usr_Email FROM usuario WHERE Usr_Codigo <> ${id} AND Usr_Email = "${email}"`,
                                (error, result, fields) => {
                                    if (error) { return res.status(500).send({ error: error }) }

                                    if (JSON.stringify(result) != '[]') {
                                        return res.status(401).json('Email ja cadastrado');
                                    } else {
                                        conn.query(
                                            `UPDATE usuario SET Usr_Email = "${email}", Usr_Nome = "${nome}", Usr_Senha = "${encryptedPassword}", ` + 
                                            `Usr_Contato = ${contato != ''?`"${contato}"`:'NULL'}, Usr_CPF = ${cpf != ''?`"${cpf}"`:'NULL'} ` + 
                                            `WHERE Usr_Codigo = ${id}`,
                                            (error, result, fields) => {
                                                if (error) { return res.status(500).send({ error: error }) };

                                                return res.status(201).json(result);
                                            }
                                        )
                                    }
                                }
                            )
                        }
                    }
                )
                conn.release();
            });
            
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
        }
    }

    async destroy(req, res) {
        try {
            const { id } = req.params;

            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario WHERE Usr_Codigo = "${id}"`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }

                        if (JSON.stringify(result) === '[]') {
                            return res.status(404).json('Usuário não encontrado');
                        }
                        
                        conn.query(
                            `DELETE FROM usuario WHERE Usr_Codigo = "${id}"`,
                        (error, result, fields) => {
                            if (error) { return res.status(500).send({ error: error }) }
                            return res.status(201).json(result);
                        }
                        )
                       
                    }
                )
                conn.release();
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
        }
    }
}

export default new UsuarioController();