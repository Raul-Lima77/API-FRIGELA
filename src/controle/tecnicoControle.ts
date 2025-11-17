import type { Request, Response } from "express"
import { TecnicoServico } from "../servico/tecnicoServico"
import type { TecnicoCreateDto, TecnicoUpdateDto, TecnicoLoginDto } from "../dto/tecnicoDto"

export class TecnicoControle {
  private tecnicoServico: TecnicoServico

  constructor() {
    this.tecnicoServico = new TecnicoServico()
  }

  async cadastrar(req: Request, res: Response): Promise<void> {
    try {
      const dadosTecnico: TecnicoCreateDto = req.body
      const tecnico = await this.tecnicoServico.criarTecnico(dadosTecnico)

      res.status(201).json({
        sucesso: true,
        mensagem: "Técnico cadastrado com sucesso",
        dados: tecnico,
      })
    } catch (error) {
      res.status(400).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const dadosLogin: TecnicoLoginDto = req.body
      const resultado = await this.tecnicoServico.login(dadosLogin)

      if (resultado.sucesso) {
        res.status(200).json(resultado)
      } else {
        res.status(401).json(resultado)
      }
    } catch (error) {
      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    }
  }

  async listar(req: Request, res: Response): Promise<void> {
    try {
      const tecnicos = await this.tecnicoServico.listarTecnicos()

      res.status(200).json({
        sucesso: true,
        mensagem: "Técnicos listados com sucesso",
        dados: tecnicos,
      })
    } catch (error) {
      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    }
  }

  async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id

      if (!id) {
        res.status(400).json({
          sucesso: false,
          mensagem: "ID do técnico é obrigatório",
        })
        return
      }

      const tecnico = await this.tecnicoServico.buscarTecnicoPorId(id)

      if (!tecnico) {
        res.status(404).json({
          sucesso: false,
          mensagem: "Técnico não encontrado",
        })
        return
      }

      res.status(200).json({
        sucesso: true,
        mensagem: "Técnico encontrado",
        dados: tecnico,
      })
    } catch (error) {
      res.status(400).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    }
  }

  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id
      const dadosAtualizacao: TecnicoUpdateDto = req.body

      if (!id) {
        res.status(400).json({
          sucesso: false,
          mensagem: "ID do técnico é obrigatório",
        })
        return
      }

      const tecnico = await this.tecnicoServico.atualizarTecnico(id, dadosAtualizacao)

      if (!tecnico) {
        res.status(404).json({
          sucesso: false,
          mensagem: "Técnico não encontrado",
        })
        return
      }

      res.status(200).json({
        sucesso: true,
        mensagem: "Técnico atualizado com sucesso",
        dados: tecnico,
      })
    } catch (error) {
      res.status(400).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    }
  }

  async deletar(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id

      if (!id) {
        res.status(400).json({
          sucesso: false,
          mensagem: "ID do técnico é obrigatório",
        })
        return
      }

      const deletado = await this.tecnicoServico.deletarTecnico(id)

      if (!deletado) {
        res.status(404).json({
          sucesso: false,
          mensagem: "Técnico não encontrado",
        })
        return
      }

      res.status(200).json({
        sucesso: true,
        mensagem: "Técnico deletado com sucesso",
      })
    } catch (error) {
      res.status(400).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    }
  }
}
