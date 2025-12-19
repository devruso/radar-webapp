-- ============================================
-- SCRIPT DE EMERGÊNCIA - CRIAR TABELAS RADAR
-- ============================================
-- Execute este script no PostgreSQL se as migrations do Flyway não rodaram
-- Database: radar
-- ============================================

-- 1. ESTRUTURA CURSO
CREATE TABLE IF NOT EXISTS estrutura_curso (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255),
    versao VARCHAR(50)
);

-- 2. GUIA MATRÍCULA
CREATE TABLE IF NOT EXISTS guia_matricula (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255),
    semestre VARCHAR(20)
);

-- 3. CURSOS
CREATE TABLE IF NOT EXISTS cursos (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    coordenador VARCHAR(255),
    turno VARCHAR(50),
    nivel INTEGER,
    estrutura_id BIGINT REFERENCES estrutura_curso(id),
    guia_id BIGINT REFERENCES guia_matricula(id)
);

-- 4. COMPONENTES CURRICULARES
CREATE TABLE IF NOT EXISTS componentes_curriculares (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    carga_horaria INTEGER,
    creditos INTEGER,
    nivel INTEGER,
    ementa TEXT,
    bibliografia TEXT
);

-- 5. VAGAS
CREATE TABLE IF NOT EXISTS vagas (
    id BIGSERIAL PRIMARY KEY,
    total INTEGER,
    ocupadas INTEGER,
    disponiveis INTEGER
);

-- 6. HORÁRIOS
CREATE TABLE IF NOT EXISTS horarios (
    id BIGSERIAL PRIMARY KEY,
    dia_semana VARCHAR(20),
    hora_inicio TIME,
    hora_fim TIME,
    turno VARCHAR(20)
);

-- 7. TURMAS
CREATE TABLE IF NOT EXISTS turmas (
    id BIGSERIAL PRIMARY KEY,
    numero VARCHAR(20),
    professor VARCHAR(255),
    local VARCHAR(255),
    tipo VARCHAR(50),
    componente_id BIGINT REFERENCES componentes_curriculares(id),
    horario_id BIGINT REFERENCES horarios(id),
    vagas_id BIGINT REFERENCES vagas(id),
    guia_id BIGINT REFERENCES guia_matricula(id)
);

-- 8. USUÁRIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    senha VARCHAR(255),
    curso_id BIGINT REFERENCES cursos(id),
    data_ingresso DATE,
    is_teste BOOLEAN DEFAULT false,
    turnos_livres BOOLEAN[] DEFAULT ARRAY[false, false, false],
    disciplinas_feitas TEXT[],
    professores_excluidos TEXT[],
    turmas_selecionadas_ids BIGINT[]
);

-- 9. HISTÓRICO ESTUDANTE
CREATE TABLE IF NOT EXISTS historico_estudante (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT REFERENCES usuarios(id) ON DELETE CASCADE,
    componente_id BIGINT REFERENCES componentes_curriculares(id),
    semestre VARCHAR(20),
    nota NUMERIC(4,2),
    status VARCHAR(50),
    data_conclusao DATE
);

-- 10. PREFERÊNCIAS USUÁRIO
CREATE TABLE IF NOT EXISTS preferencias_usuario (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT REFERENCES usuarios(id) ON DELETE CASCADE,
    turnos_disponiveis TEXT[],
    carga_maxima INTEGER,
    prioridades TEXT[]
);

-- 11. AVALIAÇÕES PROFESSOR
CREATE TABLE IF NOT EXISTS avaliacoes_professor (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT REFERENCES usuarios(id) ON DELETE CASCADE,
    professor_nome VARCHAR(255),
    componente_id BIGINT REFERENCES componentes_curriculares(id),
    nota INTEGER CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, professor_nome, componente_id)
);

-- 12. PRÉ-REQUISITOS
CREATE TABLE IF NOT EXISTS prerequisitos (
    id BIGSERIAL PRIMARY KEY,
    componente_id BIGINT REFERENCES componentes_curriculares(id),
    prerequisito_id BIGINT REFERENCES componentes_curriculares(id),
    tipo VARCHAR(50) CHECK (tipo IN ('PREREQUISITO', 'COREQUISITO', 'POSREQUISITO'))
);

-- CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_turmas_componente ON turmas(componente_id);
CREATE INDEX IF NOT EXISTS idx_turmas_guia ON turmas(guia_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_curso ON usuarios(curso_id);
CREATE INDEX IF NOT EXISTS idx_historico_usuario ON historico_estudante(usuario_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_usuario ON avaliacoes_professor(usuario_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_professor ON avaliacoes_professor(professor_nome);
CREATE INDEX IF NOT EXISTS idx_prerequisitos_componente ON prerequisitos(componente_id);

-- DADOS DE TESTE (OPCIONAL)
-- Inserir curso de exemplo
INSERT INTO cursos (nome, coordenador, turno, nivel) 
VALUES ('Sistemas de Informação', 'Prof. João Silva', 'INTEGRAL', 1)
ON CONFLICT DO NOTHING;

-- Inserir componente de exemplo
INSERT INTO componentes_curriculares (codigo, nome, carga_horaria, creditos, nivel, ementa)
VALUES 
    ('MATA01', 'Cálculo A', 68, 4, 1, 'Funções, limites, derivadas'),
    ('MATA02', 'Geometria Analítica', 68, 4, 1, 'Vetores, retas, planos'),
    ('MATA37', 'Introdução à Lógica de Programação', 68, 4, 1, 'Algoritmos, estruturas de controle')
ON CONFLICT (codigo) DO NOTHING;

COMMIT;

-- Verificar se as tabelas foram criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
