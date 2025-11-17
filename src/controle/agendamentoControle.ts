import type { Request, Response } from "express"
import { AgendamentoServico } from "../servico/agendamentoServico"
import type { AgendamentoCreateDto, AgendamentoUpdateDto } from "../dto/agendamentoDto"

export class AgendamentoControle {
  private agendamentoServico: AgendamentoServico

  constructor() {
    this.agendamentoServico = new AgendamentoServico()
  }

  async cadastrar(req: Request, res: Response): Promise<void> {
    try {
      const dto: AgendamentoCreateDto = req.body
      const agendamento = await this.agendamentoServico.cadastrar(dto)
      res.status(201).json(agendamento)
    } catch (erro: any) {
      res.status(400).json({ erro: erro.message })
    }
  }

  async listarTodos(req: Request, res: Response): Promise<void> {
    try {
      const agendamentos = await this.agendamentoServico.listarTodos()
      res.status(200).json(agendamentos)
    } catch (erro: any) {
      res.status(500).json({ erro: erro.message })
    }
  }

  async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      if (!id) {
        res.status(400).json({ erro: "ID do agendamento é obrigatório" })
        return
      }

      const agendamento = await this.agendamentoServico.buscarPorId(id)
      if (!agendamento) {
        res.status(404).json({ erro: "Agendamento não encontrado" })
        return
      }

      res.status(200).json(agendamento)
    } catch (erro: any) {
      res.status(500).json({ erro: erro.message })
    }
  }

  async buscarDetalhado(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      if (!id) {
        res.status(400).json({ erro: "ID do agendamento é obrigatório" })
        return
      }

      const agendamento = await this.agendamentoServico.buscarDetalhado(id)
      if (!agendamento) {
        res.status(404).json({ erro: "Agendamento não encontrado" })
        return
      }

      res.status(200).json(agendamento)
    } catch (erro: any) {
      res.status(500).json({ erro: erro.message })
    }
  }

  async buscarPorTecnico(req: Request, res: Response): Promise<void> {
    try {
      const { idTecnico } = req.params
      if (!idTecnico) {
        res.status(400).json({ erro: "ID do técnico é obrigatório" })
        return
      }

      const agendamentos = await this.agendamentoServico.buscarPorTecnico(idTecnico)
      res.status(200).json(agendamentos)
    } catch (erro: any) {
      res.status(500).json({ erro: erro.message })
    }
  }

  async buscarPorCliente(req: Request, res: Response): Promise<void> {
    try {
      const { idCliente } = req.params
      if (!idCliente) {
        res.status(400).json({ erro: "ID do cliente é obrigatório" })
        return
      }

      const agendamentos = await this.agendamentoServico.buscarPorCliente(idCliente)
      res.status(200).json(agendamentos)
    } catch (erro: any) {
      res.status(500).json({ erro: erro.message })
    }
  }

  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      if (!id) {
        res.status(400).json({ erro: "ID do agendamento é obrigatório" })
        return
      }

      const dto: AgendamentoUpdateDto = req.body
      const agendamento = await this.agendamentoServico.atualizar(id, dto)

      if (!agendamento) {
        res.status(404).json({ erro: "Agendamento não encontrado" })
        return
      }

      res.status(200).json(agendamento)
    } catch (erro: any) {
      res.status(400).json({ erro: erro.message })
    }
  }

  async deletar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      if (!id) {
        res.status(400).json({ erro: "ID do agendamento é obrigatório" })
        return
      }

      const sucesso = await this.agendamentoServico.deletar(id)
      if (!sucesso) {
        res.status(404).json({ erro: "Agendamento não encontrado" })
        return
      }

      res.status(204).send()
    } catch (erro: any) {
      res.status(500).json({ erro: erro.message })
    }
  }
}
