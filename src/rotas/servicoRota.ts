import { Router } from 'express'
import { ServicoControle } from '../controle/servicoControle'

const rota = Router()
const controle = new ServicoControle()

rota.post('/', (req, res) => controle.cadastrar(req, res))
rota.get('/', (req, res) => controle.listarTodos(req, res))
rota.get('/:id', (req, res) => controle.buscarPorId(req, res))
rota.get('/tecnico/:idTecnico', (req, res) => controle.buscarPorTecnico(req, res))
rota.put('/:id', (req, res) => controle.atualizar(req, res))
rota.delete('/:id', (req, res) => controle.deletar(req, res))

export default rota
