-- ======================================
-- Tabela: tecnicos
-- ======================================
CREATE TABLE tecnicos (
    id_tecnico VARCHAR(36) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100)
);

-- ======================================
-- Tabela: clientes
-- ======================================
CREATE TABLE clientes (
    id_cliente VARCHAR(36) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100)
);

-- ======================================
-- Tabela: enderecos
-- Cada cliente pode ter vários endereços
-- ======================================
CREATE TABLE enderecos (
    id_endereco VARCHAR(36) PRIMARY KEY,
    id_cliente VARCHAR(36) NOT NULL,
    numero VARCHAR(10),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

-- ======================================
-- Tabela: servicos
-- ======================================
CREATE TABLE servicos (
    id_servico VARCHAR(36) PRIMARY KEY,
    nome_servico VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL
);

-- ======================================
-- Tabela: agendamentos
-- Liga cliente + endereço + técnico + serviço
-- ======================================
CREATE TABLE agendamentos (
    id_agendamento VARCHAR(36) PRIMARY KEY,
    id_cliente VARCHAR(36) NOT NULL,
    id_endereco VARCHAR(36) NOT NULL,
    id_tecnico VARCHAR(36) NOT NULL,
    id_servico VARCHAR(36) NOT NULL,
    data_agendamento DATETIME NOT NULL,
    observacoes TEXT,

    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_endereco) REFERENCES enderecos(id_endereco),
    FOREIGN KEY (id_tecnico) REFERENCES tecnicos(id_tecnico),
    FOREIGN KEY (id_servico) REFERENCES servicos(id_servico)
);

