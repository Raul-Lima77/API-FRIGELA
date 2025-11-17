import type { Request, Response } from "express"
import { ServicoServico } from "../servico/servicoServico"

export class ServicoControle {
  private servicoServico: ServicoServico

  constructor() {
    this.servicoServico = new ServicoServico()
  }

  async cadastrar(req: Request, res: Response): Promise<void> {
    try {
      const servico = await this.servicoServico.criarServico(req.body)
      res.status(201).json({ mensagem: "Serviço cadastrado com sucesso", servico })
    } catch (erro: any) {
      res.status(400).json({ mensagem: "Erro ao cadastrar serviço", erro: erro.message })
    }
  }

  async listarTodos(req: Request, res: Response): Promise<void> {
    try {
      const servicos = await this.servicoServico.listarServicos()
      res.status(200).json(servicos)
    } catch (erro: any) {
      res.status(500).json({ mensagem: "Erro ao listar serviços", erro: erro.message })
    }
  }

  async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      if (!id) {
        res.status(400).json({ mensagem: "ID do serviço é obrigatório" })
        return
      }

      const servico = await this.servicoServico.buscarServicoPorId(id)
      if (!servico) {
        res.status(404).json({ mensagem: "Serviço não encontrado" })
        return
      }

      res.status(200).json(servico)
    } catch (erro: any) {
      res.status(500).json({ mensagem: "Erro ao buscar serviço", erro: erro.message })
    }
  }

  async buscarPorTecnico(req: Request, res: Response): Promise<void> {
    try {
      const { idTecnico } = req.params
      if (!idTecnico) {
        res.status(400).json({ mensagem: "ID do técnico é obrigatório" })
        return
      }
      const servicos = await this.servicoServico.listarServicos()
      const filtrados = servicos.filter(s => s.idTecnico === idTecnico)
      res.status(200).json(filtrados)
    } catch (erro: any) {
      res.status(500).json({ mensagem: "Erro ao buscar serviços por técnico", erro: erro.message })
    }
  }
  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      if (!id) {
        res.status(400).json({ mensagem: "ID do serviço é obrigatório" })
        return
      }

      const servico = await this.servicoServico.atualizarServico(id, req.body)
      if (!servico) {
        res.status(404).json({ mensagem: "Serviço não encontrado" })
        return
      }

      res.status(200).json({ mensagem: "Serviço atualizado com sucesso", servico })
    } catch (erro: any) {
      res.status(400).json({ mensagem: "Erro ao atualizar serviço", erro: erro.message })
    }
  }

  async deletar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      if (!id) {
        res.status(400).json({ mensagem: "ID do serviço é obrigatório" })
        return
      }

      const deletado = await this.servicoServico.deletarServico(id)
      if (!deletado) {
        res.status(404).json({ mensagem: "Serviço não encontrado" })
        return
      }

      res.status(200).json({ mensagem: "Serviço deletado com sucesso" })
    } catch (erro: any) {
      res.status(400).json({ mensagem: "Erro ao deletar serviço", erro: erro.message })
    }
  }
}
