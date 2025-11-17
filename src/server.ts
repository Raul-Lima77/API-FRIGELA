import express from "express"
import cors from "cors"

// Importação das rotas
import tecnicoRota from "./rotas/tecnicoRota"
import clienteRota from "./rotas/clienteRota"
import enderecoRota from "./rotas/enderecoRota"
import servicoRota from "./rotas/servicoRota"
import agendamentoRota from "./rotas/agendamentoRota"

const app = express()

// CORS liberado para o front em http://localhost:3000
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}))

app.use(express.json())

//          ROTAS
app.use("/tecnicos", tecnicoRota)
app.use("/clientes", clienteRota)
app.use("/enderecos", enderecoRota)
app.use("/servicos", servicoRota)
app.use("/agendamentos", agendamentoRota)

// Página inicial
app.get("/", (req, res) => {
  res.send("API ClimaTec funcionando 🚀")
})

// Start
app.listen(4000, () => {
  console.log("🔥 Backend rodando em http://localhost:4000")
})
