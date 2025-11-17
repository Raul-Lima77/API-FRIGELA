import conexao from "../util/conexao"
import { Agendamento } from "../modelo/agendamento"
import type { RowDataPacket, ResultSetHeader } from "mysql2"

export class AgendamentoDao {
  async criar(agendamento: Agendamento): Promise<string> {
    const sql =
      "INSERT INTO agendamentos (id_agendamento, id_endereco, id_tecnico, id_servico, id_cliente, data_hora, status_agendamento, observacoes, criado_em) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    const valores = [
      agendamento.id,
      agendamento.idEndereco,
      agendamento.idTecnico,
      agendamento.idServico,
      agendamento.idCliente,
      agendamento.dataHora,
      agendamento.statusAgendamento,
      agendamento.observacoes,
      agendamento.criadoEm,
    ]

    await conexao.execute<ResultSetHeader>(sql, valores)
    return agendamento.id
  }

  async buscarTodos(): Promise<Agendamento[]> {
    const sql =
      "SELECT id_agendamento, id_endereco, id_tecnico, id_servico, id_cliente, data_hora, status_agendamento, observacoes, criado_em FROM agendamentos ORDER BY data_hora DESC"
    const [linhas] = await conexao.execute<RowDataPacket[]>(sql)

    return linhas.map((linha) =>
      Agendamento.construir(
        linha.id_agendamento,
        linha.id_endereco,
        linha.id_tecnico,
        linha.id_servico,
        linha.id_cliente,
        new Date(linha.data_hora),
        linha.status_agendamento,
        linha.observacoes,
        new Date(linha.criado_em),
      ),
    )
  }

  async buscarPorId(id: string): Promise<Agendamento | null> {
    const sql =
      "SELECT id_agendamento, id_endereco, id_tecnico, id_servico, id_cliente, data_hora, status_agendamento, observacoes, criado_em FROM agendamentos WHERE id_agendamento = ?"
    const [linhas] = await conexao.execute<RowDataPacket[]>(sql, [id])

    if (linhas.length === 0) {
      return null
    }

    const linha = (linhas as RowDataPacket[])[0]
    if (!linha) {
      return null
    }

    return Agendamento.construir(
      linha.id_agendamento,
      linha.id_endereco,
      linha.id_tecnico,
      linha.id_servico,
      linha.id_cliente,
      new Date(linha.data_hora),
      linha.status_agendamento,
      linha.observacoes,
      new Date(linha.criado_em),
    )
  }

  async buscarPorTecnico(idTecnico: string): Promise<Agendamento[]> {
    const sql =
      "SELECT id_agendamento, id_endereco, id_tecnico, id_servico, id_cliente, data_hora, status_agendamento, observacoes, criado_em FROM agendamentos WHERE id_tecnico = ? ORDER BY data_hora DESC"
    const [linhas] = await conexao.execute<RowDataPacket[]>(sql, [idTecnico])

    return linhas.map((linha) =>
      Agendamento.construir(
        linha.id_agendamento,
        linha.id_endereco,
        linha.id_tecnico,
        linha.id_servico,
        linha.id_cliente,
        new Date(linha.data_hora),
        linha.status_agendamento,
        linha.observacoes,
        new Date(linha.criado_em),
      ),
    )
  }

  async buscarPorCliente(idCliente: string): Promise<Agendamento[]> {
    const sql =
      "SELECT id_agendamento, id_endereco, id_tecnico, id_servico, id_cliente, data_hora, status_agendamento, observacoes, criado_em FROM agendamentos WHERE id_cliente = ? ORDER BY data_hora DESC"
    const [linhas] = await conexao.execute<RowDataPacket[]>(sql, [idCliente])

    return linhas.map((linha) =>
      Agendamento.construir(
        linha.id_agendamento,
        linha.id_endereco,
        linha.id_tecnico,
        linha.id_servico,
        linha.id_cliente,
        new Date(linha.data_hora),
        linha.status_agendamento,
        linha.observacoes,
        new Date(linha.criado_em),
      ),
    )
  }

  async verificarConflitoHorario(idTecnico: string, dataHora: Date, idAgendamento?: string): Promise<boolean> {
    let sql =
      "SELECT COUNT(*) as total FROM agendamentos WHERE id_tecnico = ? AND DATE(data_hora) = DATE(?) AND TIME(data_hora) = TIME(?) AND status_agendamento NOT IN ('cancelado', 'concluido')"
    const valores: any[] = [idTecnico, dataHora, dataHora]

    if (idAgendamento) {
      sql += " AND id_agendamento != ?"
      valores.push(idAgendamento)
    }

    const [linhas] = await conexao.execute<RowDataPacket[]>(sql, valores)
    const row = (linhas as RowDataPacket[])[0]
    const total = row ? Number((row as any).total) : 0
    return total > 0
  }

  async buscarDetalhado(id: string): Promise<RowDataPacket | null> {
    const sql = `
      SELECT 
        a.id_agendamento,
        a.data_hora,
        a.status_agendamento,
        a.observacoes,
        a.criado_em,
        t.id_tecnico,
        t.nome as tecnico_nome,
        t.telefone as tecnico_telefone,
        t.email as tecnico_email,
        c.id_cliente,
        c.nome as cliente_nome,
        c.telefone as cliente_telefone,
        s.id_servico,
        s.nome as servico_nome,
        s.descricao as servico_descricao,
        s.preco as servico_preco,
        s.tempo_estimado as servico_tempo,
        e.id_endereco,
        e.rua,
        e.numero,
        e.bairro,
        e.cidade,
        e.uf,
        e.cep,
        e.complemento
      FROM agendamentos a
      INNER JOIN tecnico t ON a.id_tecnico = t.id_tecnico
      INNER JOIN clientes c ON a.id_cliente = c.id_cliente
      INNER JOIN servicos s ON a.id_servico = s.id_servico
      INNER JOIN enderecos e ON a.id_endereco = e.id_endereco
      WHERE a.id_agendamento = ?
    `
    const [linhas] = await conexao.execute<RowDataPacket[]>(sql, [id])

    if (linhas.length === 0) {
      return null
    }

    return linhas[0] ?? null
  }

  async atualizar(agendamento: Agendamento): Promise<boolean> {
    const sql =
      "UPDATE agendamentos SET data_hora = ?, status_agendamento = ?, observacoes = ? WHERE id_agendamento = ?"
    const valores = [agendamento.dataHora, agendamento.statusAgendamento, agendamento.observacoes, agendamento.id]

    const [resultado] = await conexao.execute<ResultSetHeader>(sql, valores)
    return resultado.affectedRows > 0
  }

  async deletar(id: string): Promise<boolean> {
    const sql = "DELETE FROM agendamentos WHERE id_agendamento = ?"
    const [resultado] = await conexao.execute<ResultSetHeader>(sql, [id])
    return resultado.affectedRows > 0
  }
}
