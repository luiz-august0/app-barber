const mysql = require('../config/mysql').pool;

class BarbeariaController {
    async getBarbeariasUsuario(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT B.* FROM barbearia B ` + 
                    `INNER JOIN barbearia_proprietarios BP ` + 
                    `ON B.Barb_Codigo = BP.Barb_Codigo ` + 
                    `WHERE BP.Usr_Codigo = ${id} ` + 
                    `GROUP BY B.Barb_Codigo`,
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

    async getDadosBarbearia(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM barbearia WHERE Barb_Codigo = ${id}`,
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

    async getBarbearias (req, res) {
        try {
            const { nome, cidade, endRua, endNumero, endBairro } = req.body;

            let SQL = `SELECT * FROM barbearia WHERE 1 > 0 `;
            if ((nome !== null) && (nome !== '')) {
                SQL = SQL + `AND Barb_Nome LIKE "%${nome}%" `;
            }
            if ((cidade !== null) && (cidade !== '')) {
                SQL = SQL + `AND Barb_Cidade LIKE "%${cidade}%" `;
            }
            if ((endRua !== null) && (endRua !== '')) {
                SQL = SQL + `AND Barb_Rua LIKE "%${endRua}%" `;
            }
            if ((endNumero !== null) && (endNumero !== '')) {
                SQL = SQL + `AND Barb_Numero LIKE "%${endNumero}%" `;
            }
            if ((endBairro !== null) && (endBairro !== '')) {
                SQL = SQL + `AND Barb_Bairro LIKE "%${endBairro}%" `;
            }

            mysql.getConnection((error, conn) => {
                conn.query(
                    SQL,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
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

    async postBarbearia(req, res) {
        const { nome, razao, cnpj, inscEstadual, cidade, cep, uf, rua, numero, bairro, complemento, latitude, longitude } = req.body;

        let ie = inscEstadual;

        let SQL = `INSERT INTO barbearia ` + 
                  `SET Barb_Nome = "${nome}", ` + 
                  `Barb_RazaoSocial = "${razao}", ` + 
                  `Barb_CNPJ = "${cnpj}", ` + 
                  `Barb_Cidade = "${cidade}", ` + 
                  `Barb_CEP = "${cep}", ` + 
                  `Barb_UF = "${uf}", ` + 
                  `Barb_Rua = "${rua}", ` + 
                  `Barb_Numero = ${numero}, ` + 
                  `Barb_Bairro = "${bairro}" `;

        if ((inscEstadual === null) || (inscEstadual === '')) {
            ie = "ISENTO";
        } 

        SQL = SQL + `, Barb_InscEst = "${ie}" `;

        if ((complemento !== null) && (complemento !== '')) {
            SQL = SQL + `, Barb_Complemento = "${complemento}" `;
        }

        if ((latitude !== null) && (latitude !== '')) {
            SQL = SQL + `, Barb_GeoLatitude = ${latitude} `;
        }

        if ((longitude !== null) && (longitude !== '')) {
            SQL = SQL + `, Barb_GeoLongitude = ${longitude} `;
        }

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM barbearia WHERE Barb_CNPJ = "${cnpj}" AND Barb_InscEst = "${ie}"`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                        if (JSON.stringify(result) != '[]') {
                            return res.status(401).json();
                        } else {
                            conn.query(
                                SQL,
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


    async updateBarbearia(req, res) {
        const { nome, razao, cnpj, inscEstadual, cidade, cep, uf, rua, numero, bairro, complemento, latitude, longitude } = req.body;
        const { id } = req.params;

        let ie = inscEstadual;

        let SQL = `UPDATE barbearia ` + 
                  `SET Barb_Nome = "${nome}", ` + 
                  `Barb_RazaoSocial = "${razao}", ` + 
                  `Barb_CNPJ = "${cnpj}", ` +  
                  `Barb_Cidade = "${cidade}", ` + 
                  `Barb_CEP = "${cep}", ` + 
                  `Barb_UF = "${uf}", ` +
                  `Barb_Rua = "${rua}", ` + 
                  `Barb_Numero = ${numero}, ` + 
                  `Barb_Bairro = "${bairro}" `;

        if ((inscEstadual === null) || (inscEstadual === '')) {
            ie = "ISENTO";
        } 

        SQL = SQL + `, Barb_InscEst = "${ie}" `;

        if ((complemento !== null) && (complemento !== '')) {
            SQL = SQL + `, Barb_Complemento = "${complemento}" `;
        }

        if ((latitude !== null) && (latitude !== '')) {
            SQL = SQL + `, Barb_GeoLatitude = ${latitude} `;
        }

        if ((longitude !== null) && (longitude !== '')) {
            SQL = SQL + `, Barb_GeoLongitude = ${longitude} `;
        }

        SQL = SQL + ` WHERE Barb_Codigo = ${id}`;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM barbearia WHERE Barb_CNPJ = "${cnpj}" AND Barb_InscEst = "${ie}" AND Barb_Codigo <> ${id}`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                        if (JSON.stringify(result) != '[]') {
                            return res.status(401).json();
                        } else {
                            conn.query(
                                SQL,
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

    async deleteBarbearia(req, res) {
        try {
            const { id } = req.params;

            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM barbearia WHERE Barb_Codigo = ${id}`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }

                        if (JSON.stringify(result) === '[]') {
                            return res.status(404).json();
                        } else {
                            conn.query(
                                `DELETE FROM barbearia WHERE Barb_Codigo = "${id}"`,
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

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
        }
    }

    async getBarbeariaContatos(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM barbearia_contatos WHERE Barb_Codigo = ${id}`,
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

    async postBarbeariaContatos(req, res) {
        const { descricao, contato } = req.body;
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `INSERT INTO barbearia_contatos VALUES(${id}, "${descricao}", "${contato}")`,
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

    async deleteBarbeariaContatos(req, res) {
        const { contato } = req.body;
        const { id } = req.params;

        let SQL = `DELETE FROM barbearia_contatos WHERE Barb_Codigo = ${id}`;

        if ((contato !== null) && (contato !== '')) {
            SQL = SQL + ` AND BarbC_Contato = "${contato}" `;
        }

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    SQL,
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

    async getBarbeariaProprietarios(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT U.Usr_Codigo, U.Usr_Email, U.Usr_Nome,
                     U.Usr_Contato, U.Usr_CPF
                     FROM barbearia_proprietarios BP
                     INNER JOIN usuario U
                     ON BP.Usr_Codigo = U.Usr_Codigo 
                     WHERE BP.Barb_Codigo = ${id}`,
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

    async postBarbeariaProprietarios(req, res) {
        const { proprietarioCod } = req.body;
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `INSERT INTO barbearia_proprietarios VALUES(${id}, ${proprietarioCod})`,
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

    async deleteBarbeariaProprietarios(req, res) {
        const { proprietarioCod } = req.body;
        const { id } = req.params;

        let SQL = `DELETE FROM barbearia_proprietarios WHERE Barb_Codigo = ${id}`;

        if ((proprietarioCod !== null) && (proprietarioCod !== '')) {
            SQL = SQL + ` AND Usr_Codigo = ${proprietarioCod} `;
        }

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    SQL,
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

    async updateLogoBarbearia(id, filename) {
        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `UPDATE barbearia SET Barb_LogoUrl = "${filename}" WHERE Barb_Codigo = "${id}"`,
                )
                conn.release();
            });

        } catch (err) {
            console.error(err);
        }
    }

    async getHorarios(req, res) {
        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT Horario AS label, Horario AS text FROM horarios`,
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

    async getBarbeariaHorariosDia(req, res) {
        const { id } = req.params;
        const { dia } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM barbearia_horarios WHERE Barb_Codigo = ${id} AND BarbH_Dia = "${dia}"`,
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

    async postBarbeariaHorarioDia(req, res) {
        const { id } = req.params;
        const { dia, hrInicial, hrFinal } = req.body;

        try {
            mysql.getConnection((error, conn) => {  
                conn.query(
                    `INSERT INTO barbearia_horarios VALUES(NULL, ${id}, "${dia}", "${hrInicial}", "${hrFinal}")`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                        res.status(201).json(result);
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }

    async updateBarbeariaHorarioDia(req, res) {
        const { id } = req.params;
        const { hrInicial, hrFinal } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `UPDATE barbearia_horarios SET BarbH_HoraInicio = "${hrInicial}", BarbH_HoraFim = "${hrFinal}" 
                     WHERE BarbH_Seq = ${id}`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                        res.status(201).json(result);
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }

    async deleteBarbeariaHorarioDia(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `DELETE FROM barbearia_horarios WHERE BarbH_Seq = ${id}`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                        res.status(201).json(result);
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }

}

export default new BarbeariaController();