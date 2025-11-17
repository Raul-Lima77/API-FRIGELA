import { Router } from 'express'
import { TecnicoControle } from '../controle/tecnicoControle'

const rota = Router()
const controle = new TecnicoControle()

// Cadastrar técnico
rota.post('/', (req, res) => controle.cadastrar(req, res))

// Login de técnico
rota.post('/login', (req, res) => controle.login(req, res))

// Listar todos
rota.get('/', (req, res) => controle.listar(req, res))

// Buscar por ID
rota.get('/:id', (req, res) => controle.buscarPorId(req, res))

// Atualizar
rota.put('/:id', (req, res) => controle.atualizar(req, res))

// Deletar
rota.delete('/:id', (req, res) => controle.deletar(req, res))

export default rota
