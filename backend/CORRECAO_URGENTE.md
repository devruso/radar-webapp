# 🚨 CORREÇÃO URGENTE - BANCO DE DADOS

## Problema Identificado

O backend está rodando mas as tabelas não existem no banco:
```
ERROR: relation "cursos" does not exist
ERROR: relation "turmas" does not exist
```

## ✅ Solução Rápida

### Opção 1: Rodar o SQL de Emergência (RECOMENDADO)

1. Abra o PgAdmin ou psql
2. Conecte no banco `radar`
3. Execute o arquivo: `backend/CRIAR_TABELAS_URGENTE.sql`

```bash
# Via psql (terminal):
psql -U radar -d radar -f backend/CRIAR_TABELAS_URGENTE.sql
```

### Opção 2: Verificar Flyway

O backend usa Flyway para migrations. Verifique se as migrations rodaram:

```sql
-- No PostgreSQL
SELECT * FROM flyway_schema_history;
```

Se não rodaram, reinicie o backend Spring Boot que ele roda automaticamente.

## ✅ Verificar se Funcionou

Execute no PostgreSQL:

```sql
-- Listar todas as tabelas
\dt

-- Ou
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Deve mostrar 12 tabelas:
- cursos
- turmas
- componentes_curriculares
- usuarios
- historico_estudante
- preferencias_usuario
- avaliacoes_professor
- prerequisitos
- estrutura_curso
- guia_matricula
- horarios
- vagas

## ✅ Testar Integração

Após criar as tabelas:

1. **Backend rodando**: http://localhost:9090
2. **Frontend rodando**: http://localhost:3000
3. **Swagger**: http://localhost:9090/swagger-ui/index.html

### Teste o Fluxo:

1. Acesse http://localhost:3000
2. Selecione um curso (vem do backend agora)
3. Escolha mês e ano
4. Clique em "Testar sem logar"
5. Deve criar um usuário teste no backend
6. Redireciona para `/grades` com disciplinas do backend

## 🔧 Mudanças Feitas no Frontend

### app/page.tsx
- ✅ Trocado input autocomplete por **SELECT** simples
- ✅ Busca cursos do backend via `useCursos()` hook
- ✅ Adicionado mês e ano de ingresso (select dropdowns)
- ✅ Loading state enquanto carrega cursos

### Antes:
```tsx
<input type="text" placeholder="Digite seu curso" />
```

### Agora:
```tsx
<select>
  <option>Selecione seu curso</option>
  {cursos.map(curso => (
    <option value={curso.id}>{curso.nome}</option>
  ))}
</select>
```

## 📝 Próximos Passos

1. ✅ Criar tabelas no banco
2. ✅ Popular com dados de seed (Sistemas de Informação já incluído)
3. ✅ Testar criação de usuário teste
4. ✅ Testar seleção de disciplinas
5. ✅ Testar geração de recomendações

## ⚠️ Nota Importante

O SQL de emergência já inclui:
- Todas as 12 tabelas necessárias
- Índices para performance
- 1 curso de exemplo (Sistemas de Informação)
- 3 componentes de exemplo (Cálculo, Geometria, Lógica)

**Mas você precisa popular com mais dados se quiser testar completamente!**
