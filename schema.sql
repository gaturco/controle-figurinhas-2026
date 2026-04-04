-- Schema Copa do Mundo 2026

CREATE TABLE IF NOT EXISTS selecoes (
  id SERIAL PRIMARY KEY,
  selecao VARCHAR(100) NOT NULL,
  grupo VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS figurinhas (
  id SERIAL PRIMARY KEY,
  numero INTEGER NOT NULL,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  selecao_id INTEGER REFERENCES selecoes(id) ON DELETE SET NULL,
  nome_jogador VARCHAR(150) NOT NULL,
  is_especial BOOLEAN DEFAULT FALSE,
  secao VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  nome VARCHAR(150),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS colecao_usuario (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  figurinha_id INTEGER REFERENCES figurinhas(id) ON DELETE CASCADE,
  status VARCHAR(20) CHECK (status IN ('collected', 'repeated')) DEFAULT 'collected',
  UNIQUE(usuario_id, figurinha_id)
);
