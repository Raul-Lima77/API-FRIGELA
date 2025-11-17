import { Router } from 'express'
import { AgendamentoControle } from '../controle/agendamentoControle.js'

const rota = Router()
const controle = new AgendamentoControle()

rota.post('/', (req, res) => controle.cadastrar(req, res))
rota.get('/', (req, res) => controle.listarTodos(req, res))
rota.get('/:id', (req, res) => controle.buscarPorId(req, res))
rota.put('/:id', (req, res) => controle.atualizar(req, res))
rota.delete('/:id', (req, res) => controle.deletar(req, res))

export default rota
