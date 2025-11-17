import { Router } from 'express'
import { EnderecoControle } from '../controle/enderecoControle'

const rota = Router()
const controle = new EnderecoControle()

rota.post('/', (req, res) => controle.cadastrar(req, res))
rota.get('/', (req, res) => controle.listarTodos(req, res))
rota.get('/:id', (req, res) => controle.buscarPorId(req, res))
rota.get('/cliente/:idCliente', (req, res) => controle.buscarPorCliente(req, res))
rota.put('/:id', (req, res) => controle.atualizar(req, res))
rota.delete('/:id', (req, res) => controle.deletar(req, res))

export default rota
