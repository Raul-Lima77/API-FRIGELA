import conexao from "../util/conexao"
import { Endereco } from "../modelo/endereco"
import type { RowDataPacket, ResultSetHeader } from "mysql2"

export class EnderecoDao {
  async criar(endereco: Endereco): Promise<string> {
    const sql =
      "INSERT INTO enderecos (id_endereco, id_cliente, rua, numero, bairro, cidade, uf, cep, complemento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    const valores = [
      endereco.id,
      endereco.idCliente,
      endereco.rua,
      endereco.numero,
      endereco.bairro,
      endereco.cidade,
      endereco.uf,
      endereco.cep,
      endereco.complemento || null,
    ]

    await conexao.execute<ResultSetHeader>(sql, valores)
    return endereco.id
  }

  async buscarTodos(): Promise<Endereco[]> {
    const sql =
      "SELECT id_endereco, id_cliente, rua, numero, bairro, cidade, uf, cep, complemento FROM enderecos ORDER BY cidade, bairro"
    const [linhas] = await conexao.execute<RowDataPacket[]>(sql)

    return linhas.map((linha) =>
      Endereco.construir(
        linha.id_endereco,
        linha.id_cliente,
        linha.rua,
        linha.numero,
        linha.bairro,
        linha.cidade,
        linha.uf,
        linha.cep,
        linha.complemento,
      ),
    )
  }

  async buscarPorId(id: string): Promise<Endereco | null> {
    const sql =
      "SELECT id_endereco, id_cliente, rua, numero, bairro, cidade, uf, cep, complemento FROM enderecos WHERE id_endereco = ?"
    const [linhas] = await conexao.execute<RowDataPacket[]>(sql, [id])

    if (linhas.length === 0) {
      return null
    }

    const linha = linhas[0]
    if (!linha) {
      return null
    }
    return Endereco.construir(
      linha.id_endereco,
      linha.id_cliente,
      linha.rua,
      linha.numero,
      linha.bairro,
      linha.cidade,
      linha.uf,
      linha.cep,
      linha.complemento,
    )
  }

  async buscarPorCliente(idCliente: string): Promise<Endereco[]> {
    const sql =
      "SELECT id_endereco, id_cliente, rua, numero, bairro, cidade, uf, cep, complemento FROM enderecos WHERE id_cliente = ?"
    const [linhas] = await conexao.execute<RowDataPacket[]>(sql, [idCliente])

    return linhas.map((linha) =>
      Endereco.construir(
        linha.id_endereco,
        linha.id_cliente,
        linha.rua,
        linha.numero,
        linha.bairro,
        linha.cidade,
        linha.uf,
        linha.cep,
        linha.complemento,
      ),
    )
  }

  async atualizar(endereco: Endereco): Promise<boolean> {
    const sql =
      "UPDATE enderecos SET rua = ?, numero = ?, bairro = ?, cidade = ?, uf = ?, cep = ?, complemento = ? WHERE id_endereco = ?"
    const valores = [
      endereco.rua,
      endereco.numero,
      endereco.bairro,
      endereco.cidade,
      endereco.uf,
      endereco.cep,
      endereco.complemento || null,
      endereco.id,
    ]

    const [resultado] = await conexao.execute<ResultSetHeader>(sql, valores)
    return resultado.affectedRows > 0
  }

  async deletar(id: string): Promise<boolean> {
    const sql = "DELETE FROM enderecos WHERE id_endereco = ?"
    const [resultado] = await conexao.execute<ResultSetHeader>(sql, [id])
    return resultado.affectedRows > 0
  }
}
