import type { Request, Response } from "express"
import { EnderecoServico } from "../servico/enderecoServico"

export class EnderecoControle {
  private enderecoServico: EnderecoServico

  constructor() {
    this.enderecoServico = new EnderecoServico()
  }

  async cadastrar(req: Request, res: Response): Promise<void> {
    try {
      const endereco = await this.enderecoServico.criarEndereco(req.body)
      res.status(201).json({
        mensagem: "Endereço cadastrado com sucesso",
        endereco,
      })
    } catch (erro: any) {
      res.status(400).json({
        mensagem: "Erro ao cadastrar endereço",
        erro: erro.message,
      })
    }
  }

  async listarTodos(req: Request, res: Response): Promise<void> {
    try {
      const enderecos = await this.enderecoServico.listarEnderecos()
      res.status(200).json(enderecos)
    } catch (erro: any) {
      res.status(500).json({
        mensagem: "Erro ao listar endereços",
        erro: erro.message,
      })
    }
  }

  async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params

      if (!id) {
        res.status(400).json({
          mensagem: "ID do endereço é obrigatório",
        })
        return
      }

      const endereco = await this.enderecoServico.buscarEnderecoPorId(id)

      if (!endereco) {
        res.status(404).json({
          mensagem: "Endereço não encontrado",
        })
        return
      }

      res.status(200).json(endereco)
    } catch (erro: any) {
      res.status(500).json({
        mensagem: "Erro ao buscar endereço",
        erro: erro.message,
      })
    }
  }

  async buscarPorCliente(req: Request, res: Response): Promise<void> {
    try {
      const { idCliente } = req.params

      if (!idCliente) {
        res.status(400).json({
          mensagem: "ID do cliente é obrigatório",
        })
        return
      }

      const enderecos = await this.enderecoServico.buscarEnderecosPorCliente(idCliente)
      res.status(200).json(enderecos)
    } catch (erro: any) {
      res.status(500).json({
        mensagem: "Erro ao buscar endereços",
        erro: erro.message,
      })
    }
  }

  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params

      if (!id) {
        res.status(400).json({
          mensagem: "ID do endereço é obrigatório",
        })
        return
      }

      const endereco = await this.enderecoServico.atualizarEndereco(id, req.body)

      if (!endereco) {
        res.status(404).json({
          mensagem: "Endereço não encontrado",
        })
        return
      }

      res.status(200).json({
        mensagem: "Endereço atualizado com sucesso",
        endereco,
      })
    } catch (erro: any) {
      res.status(400).json({
        mensagem: "Erro ao atualizar endereço",
        erro: erro.message,
      })
    }
  }

  async deletar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params

      if (!id) {
        res.status(400).json({
          mensagem: "ID do endereço é obrigatório",
        })
        return
      }

      const deletado = await this.enderecoServico.deletarEndereco(id)

      if (!deletado) {
        res.status(404).json({
          mensagem: "Endereço não encontrado",
        })
        return
      }

      res.status(200).json({
        mensagem: "Endereço deletado com sucesso",
      })
    } catch (erro: any) {
      res.status(400).json({
        mensagem: "Erro ao deletar endereço",
        erro: erro.message,
      })
    }
  }
}
