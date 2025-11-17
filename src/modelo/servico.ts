import { randomUUID } from "crypto";

export type ServicoProps = {
  id: string;
  id_tecnico: string;
  nome: string;
  descricao: string;
  preco: number;
  tempoEstimado: number;
  dataCadastro: Date;
};

export default class Servico {
  private constructor(readonly props: ServicoProps) {}

  public static build(id_tecnico: string, nome: string, descricao: string, preco: number, tempoEstimado: number) {
    const props: ServicoProps = {
      id: randomUUID(),
      id_tecnico,
      nome,
      descricao,
      preco,
      tempoEstimado,
      dataCadastro: new Date(),
    };
    return new Servico(props);
  }

  public static construir(
    id: string,
    id_tecnico: string,
    nome: string,
    descricao: string,
    preco: number,
    tempoEstimado: number,
    dataCadastro: Date
  ) {
    return new Servico({ id, id_tecnico, nome, descricao, preco, tempoEstimado, dataCadastro });
  }

  // GETTERS
  get id() { return this.props.id; }
  get idTecnico() { return this.props.id_tecnico; }
  get nome() { return this.props.nome; }
  get descricao() { return this.props.descricao; }
  get preco() { return this.props.preco; }
  get tempoEstimado() { return this.props.tempoEstimado; }
  get dataCadastro() { return this.props.dataCadastro; }

  // MÉTODOS DE ALTERAÇÃO
  alterarNome(nome: string) {
    return new Servico({ ...this.props, nome });
  }

  alterarDescricao(descricao: string) {
    return new Servico({ ...this.props, descricao });
  }

  alterarPreco(preco: number) {
    return new Servico({ ...this.props, preco });
  }

  alterarTempoEstimado(tempoEstimado: number) {
    return new Servico({ ...this.props, tempoEstimado });
  }
}
