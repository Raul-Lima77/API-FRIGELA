import conexao from "../util/conexao"
import { Tecnico } from "../modelo/tecnico"
import type { RowDataPacket, ResultSetHeader } from "mysql2"

export class TecnicoDao {
  async criar(tecnico: Tecnico): Promise<string> {
    const sql =
      "INSERT INTO tecnico (id_tecnico, nome, telefone, email, senha, data_cadastro) VALUES (?, ?, ?, ?, ?, ?)"
    const valores = [tecnico.id, tecnico.nome, tecnico.telefone, tecnico.email, tecnico.senha, tecnico.dataCadastro]

    await conexao.execute<ResultSetHeader>(sql, valores)
    return tecnico.id
  }

  async buscarTodos(): Promise<Tecnico[]> {
    const sql = "SELECT id_tecnico, nome, telefone, email, senha, data_cadastro FROM tecnico ORDER BY nome"
    const [linhas] = await conexao.execute<RowDataPacket[]>(sql)

    return linhas.map((linha) =>
      Tecnico.construir(
        linha.id_tecnico,
        linha.nome,
        linha.telefone,
        linha.email,
        linha.senha,
        new Date(linha.data_cadastro),
      ),
    )
  }

  async buscarPorId(id: string): Promise<Tecnico | null> {
    const sql = "SELECT id_tecnico, nome, telefone, email, senha, data_cadastro FROM tecnico WHERE id_tecnico = ?"
    const [linhas] = await conexao.execute<RowDataPacket[]>(sql, [id])

    if (linhas.length === 0) {
      return null
    }

    const linha = linhas[0]
    return Tecnico.construir(
      linha.id_tecnico,
      linha.nome,
      linha.telefone,
      linha.email,
      linha.senha,
      new Date(linha.data_cadastro),
    )
  }

  async buscarPorEmail(email: string): Promise<Tecnico | null> {
    const sql = "SELECT id_tecnico, nome, telefone, email, senha, data_cadastro FROM tecnico WHERE email = ?"
    const [linhas] = await conexao.execute<RowDataPacket[]>(sql, [email])

    if (linhas.length === 0) {
      return null
    }

    const linha = linhas[0]
    return Tecnico.construir(
      linha.id_tecnico,
      linha.nome,
      linha.telefone,
      linha.email,
      linha.senha,
      new Date(linha.data_cadastro),
    )
  }

  async atualizar(tecnico: Tecnico): Promise<boolean> {
    const sql = "UPDATE tecnico SET nome = ?, telefone = ?, email = ?, senha = ? WHERE id_tecnico = ?"
    const valores = [tecnico.nome, tecnico.telefone, tecnico.email, tecnico.senha, tecnico.id]

    const [resultado] = await conexao.execute<ResultSetHeader>(sql, valores)
    return resultado.affectedRows > 0
  }

  async deletar(id: string): Promise<boolean> {
    const sql = "DELETE FROM tecnico WHERE id_tecnico = ?"
    const [resultado] = await conexao.execute<ResultSetHeader>(sql, [id])
    return resultado.affectedRows > 0
  }
}
