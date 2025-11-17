import conexao from "../util/conexao"
import { Cliente } from "../modelo/cliente"
import type { RowDataPacket, ResultSetHeader } from "mysql2"

export class ClienteDao {
  async criar(cliente: Cliente): Promise<string> {
    const sql = "INSERT INTO clientes (id_cliente, nome, telefone, data_cadastro) VALUES (?, ?, ?, ?)"
    const valores = [cliente.id, cliente.nome, cliente.telefone, cliente.dataCadastro]

    await conexao.execute<ResultSetHeader>(sql, valores)
    return cliente.id
  }

  async buscarTodos(): Promise<Cliente[]> {
    const sql = "SELECT id_cliente, nome, telefone, data_cadastro FROM clientes ORDER BY nome"
    const [linhas] = await conexao.execute<RowDataPacket[]>(sql)

    return linhas.map((linha) =>
      Cliente.construir(linha.id_cliente, linha.nome, linha.telefone, new Date(linha.data_cadastro)),
    )
  }

  async buscarPorId(id: string): Promise<Cliente | null> {
    const sql = "SELECT id_cliente, nome, telefone, data_cadastro FROM clientes WHERE id_cliente = ?"
    const [linhas] = await conexao.execute<RowDataPacket[]>(sql, [id])

    if (linhas.length === 0) {
      return null
    }

    const linha = (linhas as RowDataPacket[])[0]
    if (!linha) {
      return null
    }
    return Cliente.construir(linha.id_cliente, linha.nome, linha.telefone, new Date(linha.data_cadastro))
  }

  async buscarPorTelefone(telefone: string): Promise<Cliente | null> {
    const sql = "SELECT id_cliente, nome, telefone, data_cadastro FROM clientes WHERE telefone = ?"
    const [linhas] = await conexao.execute<RowDataPacket[]>(sql, [telefone])

    if (linhas.length === 0) {
      return null
    }

    const linha = linhas[0]
    if (!linha) {
      return null
    }
    return Cliente.construir(linha.id_cliente, linha.nome, linha.telefone, new Date(linha.data_cadastro))
  }

  async atualizar(cliente: Cliente): Promise<boolean> {
    const sql = "UPDATE clientes SET nome = ?, telefone = ? WHERE id_cliente = ?"
    const valores = [cliente.nome, cliente.telefone, cliente.id]

    const [resultado] = await conexao.execute<ResultSetHeader>(sql, valores)
    return resultado.affectedRows > 0
  }

  async deletar(id: string): Promise<boolean> {
    const sql = "DELETE FROM clientes WHERE id_cliente = ?"
    const [resultado] = await conexao.execute<ResultSetHeader>(sql, [id])
    return resultado.affectedRows > 0
  }
}
