import Queue from '../lib/Queue';

const mysql = require('../config/mysql').pool;

export async function teste() {
	try {
		mysql.getConnection((error, conn) => {
			conn.query(
				`SELECT Barb_Codigo, Barb_UF FROM barbearia WHERE Barb_UF <> "PR"`,
				(error, result, fields) => {
					if (error) { console.log(error) }

					if (JSON.stringify(result) !== "[]") {
						result.map((e) => {
							const data = { id: e.Barb_Codigo };
	
							const queueExec = async() => {
								//await Queue.add('Teste', data);
							}
	
							queueExec();
						})
					}

				}
			)
			conn.release();
		})
	} catch(err) {
		console.error(err);
	}
}