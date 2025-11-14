-- Schema SQL inicial para RADAR (desenvolvimento)

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  matricula VARCHAR(64) UNIQUE NOT NULL,
  course VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS courses (
  code VARCHAR(32) PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS disciplines (
  code VARCHAR(32) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  course_code VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS schedules (
  id BIGSERIAL PRIMARY KEY,
  discipline_code VARCHAR(32) REFERENCES disciplines(code),
  turma VARCHAR(32),
  professor VARCHAR(255),
  days VARCHAR(64),
  time_range VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS grades (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  user_id BIGINT REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS grade_items (
  id BIGSERIAL PRIMARY KEY,
  grade_id BIGINT REFERENCES grades(id) ON DELETE CASCADE,
  discipline_code VARCHAR(32),
  name VARCHAR(255),
  turma VARCHAR(64),
  horario VARCHAR(128)
);
