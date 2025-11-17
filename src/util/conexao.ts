import mysql2 from "mysql2";

const conexao = mysql2.createPool({
    host: "localhost",
    user: "root",
    password: "1",
    database: "agendamento"
}).promise()

export default conexao