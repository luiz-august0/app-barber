const mysql = require('../config/mysql').pool;

class BarbeariaBarbeirosController {
	async postBarbeiro(req, res) {
		const { barbeariaID, usuarioID, especialidade } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
					`INSERT INTO barbearia_barbeiros SET Barb_Codigo = ${barbeariaID}, Usr_Codigo = ${usuarioID}, BarbB_Especialidade = "${especialidade}"`,
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

	async updateBarbeiro(req, res) {
		const { barbeariaID, usuarioID, especialidade } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
					`UPDATE barbearia_barbeiros SET BarbB_Especialidade = "${especialidade}"
					 WHERE Barb_Codigo = ${barbeariaID} AND Usr_Codigo = ${usuarioID}`,
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

	async deleteBarbeiro(req, res) {
		const { barbeariaID, usuarioID } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT Agdm_Barbeiro FROM agendamento WHERE Barb_Codigo = ${barbeariaID} AND Agdm_Barbeiro = ${usuarioID} AND Agdm_Data >= NOW()`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }

                        if (JSON.stringify(result) == "[]") {
                            conn.query(
                                `DELETE FROM agendamento WHERE Barb_Codigo = ${barbeariaID} AND Agdm_Barbeiro = ${usuarioID} AND Agdm_Data < NOW()`,
                                (error, result, fields) => {
                                    if (error) { return res.status(500).send({ error: error }) }
                                    conn.query(
                                        `DELETE FROM barbearia_barbeiros WHERE Barb_Codigo = ${barbeariaID} AND Usr_Codigo = ${usuarioID}`,
                                        (error, result, fields) => {
                                            if (error) { return res.status(500).send({ error: error }) }
											return res.status(201).json(result);
                                        }
                                    )
                                }
                            )
                        } else {
                            return res.status(401).json();
                        }
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }

	async getBarbeirosByBarbearia(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
					`SELECT * FROM barbearia_barbeiros BB INNER JOIN usuario U ON BB.Usr_Codigo = U.Usr_Codigo
					 WHERE BB.Barb_Codigo = ${id}`,
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

	async getBarbeariasByBarbeiro(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
					`SELECT * FROM barbearia_barbeiros BB INNER JOIN barbearia B ON BB.Barb_Codigo = B.Barb_Codigo
					 WHERE BB.Usr_Codigo = ${id}`,
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
}

export default new BarbeariaBarbeirosController();