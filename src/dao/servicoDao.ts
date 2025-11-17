import { RowDataPacket } from "mysql2";
import conexao from "../util/conexao";
import Servico from "../modelo/servico";

export class ServicoDao {

  // BUSCAR TODOS
  async buscarTodos(): Promise<Servico[]> {
    const sql = `
      SELECT 
        id_servico,
        nome_servico,
        descricao,
        preco,
        tempo_estimado,
        data_cadastro
      FROM servicos
      ORDER BY nome_servico
    `;

    const [rows] = await conexao.execute<RowDataPacket[]>(sql);

    return rows.map((l: any) =>
      Servico.construir(
        l.id_servico,
        l.id_tecnico,
        l.nome_servico,
        l.descricao,
        l.preco,
        l.tempo_estimado,
        l.data_cadastro
      )
    );
  }

  // BUSCAR POR ID
  async buscarPorId(id: string): Promise<Servico | null> {
    const sql = `
      SELECT 
        id_servico,
        nome_servico,
        descricao,
        preco,
        tempo_estimado,
        data_cadastro
      FROM servicos
      WHERE id_servico = ?
    `;

    const [rows] = await conexao.execute<RowDataPacket[]>(sql, [id]);

    if (rows.length === 0) return null;

    const l: any = rows[0];

    return Servico.construir(
      l.id_servico,
      l.id_tecnico,
      l.nome_servico,
      l.descricao,
      l.preco,
      l.tempo_estimado,
      l.data_cadastro
    );
  }

  // CRIAR
  async criar(servico: Servico): Promise<string> {
    const sql = `
      INSERT INTO servicos
      (id_servico, nome_servico, descricao, preco, tempo_estimado, data_cadastro)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [
      servico.id,
      servico.idTecnico,
      servico.nome,
      servico.descricao,
      servico.preco,
      servico.tempoEstimado,
      servico.dataCadastro
    ];

    await conexao.execute(sql, params);

    return servico.id;
  }

  // ATUALIZAR
  async atualizar(servico: Servico): Promise<boolean> {
    const sql = `
      UPDATE servicos SET
        nome_servico = ?,
        descricao = ?,
        preco = ?,
        tempo_estimado = ?
      WHERE id_servico = ?
    `;

    const params = [
      servico.nome,
      servico.descricao,
      servico.preco,
      servico.tempoEstimado,
      servico.id
    ];

    const [result]: any = await conexao.execute(sql, params);

    return result.affectedRows > 0;
  }

  // DELETAR
  async deletar(id: string): Promise<boolean> {
    const sql = `
      DELETE FROM servicos
      WHERE id_servico = ?
    `;

    const [result]: any = await conexao.execute(sql, [id]);

    return result.affectedRows > 0;
  }
}
