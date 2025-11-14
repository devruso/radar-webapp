# Backend (Spring Boot) - RADAR

Este diretório reúne a documentação base para iniciar o backend em Spring Boot para o projeto RADAR (recomendador de disciplinas).

Objetivo
- Fornecer um contrato (OpenAPI) para o frontend
- Exemplos mínimos de entidades/DTOs/arquitetura
- Instruções para rodar localmente (PostgreSQL + app)

Índice
- Visão geral
- Tecnologias e dependências recomendadas
- Como gerar o projeto (Maven / Gradle)
- Execução com Docker Compose (Postgres)
- Esquema inicial do banco (schema.sql)
- OpenAPI (arquivo openapi.yaml)
- Exemplos de entidades, DTOs, controllers e serviços
- Autenticação (JWT) — fluxo sugerido
- Próximos passos

Visão geral
-----------

O backend será uma API REST em Spring Boot que expõe endpoints consumidos pelo frontend Next.js.
Recomendo usar PostgreSQL como banco relacional. A camada da aplicação deve seguir padrão controller -> service -> repository.

Tecnologias / dependências recomendadas
- Spring Boot (versão estável atual 3.x)
- Spring Web
- Spring Data JPA
- PostgreSQL Driver
- Spring Security (com JWT)
- Lombok (opcional, para reduzir boilerplate)
- MapStruct (opcional, para mapeamento DTO <-> Entity)
- Flyway ou Liquibase (migrations)
- JUnit + Mockito para testes

Gerar projeto (Maven)
---------------------

Você pode gerar o esqueleto via Spring Initializr (https://start.spring.io) com as dependências acima. Exemplo de comando curl (gera zip):

```bash
curl "https://start.spring.io/starter.zip?type=maven-project&language=java&bootVersion=3.1.4&baseDir=radar-backend&groupId=br.ufba.radar&artifactId=radar-backend&name=radar-backend&dependencies=web,data-jpa,postgresql,security,lombok" -o radar-backend.zip
unzip radar-backend.zip -d ./
```

Ou usando o `start.spring.io` web UI selecione: Java, Maven, Spring Boot 3.x, Spring Web, Spring Data JPA, Spring Security, PostgreSQL Driver, Lombok.

Executando Postgres local com Docker Compose
-------------------------------------------

No root do backend (ou na raiz do repo), há um `docker-compose.yml` que cria um container PostgreSQL e Adminer para inspeção.

Para subir:

```cmd
cd backend
docker compose up -d
```

Variáveis de ambiente (exemplo `.env`)

```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/radar_db
SPRING_DATASOURCE_USERNAME=radar_user
SPRING_DATASOURCE_PASSWORD=radar_pass
JWT_SECRET=uma-chave-secreta-muito-segura
JWT_EXPIRATION_MS=3600000
```

Esquema inicial (schema.sql)
----------------------------

Um arquivo `schema.sql` está incluído com tabelas básicas para `users`, `courses`, `disciplines`, `grades` e `grade_items`.
Você pode usar Flyway em produção; para desenvolvimento, rode o `schema.sql` manualmente ou configure Spring Boot para executar migrations.

OpenAPI / Contrato da API
-------------------------

Um arquivo `openapi.yaml` foi incluído com os endpoints públicos esperados pelo frontend. Use-o para gerar clientes ou para validar implementações.

Endpoints principais (resumo)
- POST /api/auth/register — criar conta
- POST /api/auth/login — autenticação, retorna JWT
- GET /api/courses — lista de cursos (autocomplete)
- GET /api/schedules?disciplineId= — lista de turmas/horários
- GET /api/grades?userId= — histórico de grades
- POST /api/grades — salvar nova grade/recomendação
- POST /api/recommendations — gerar recomendação (aceita preferências)

Exemplos de entidades (simplificado)
-----------------------------------

// Exemplo `User` (simplificado)
```java
@Entity
public class User {
  @Id @GeneratedValue
  private Long id;
  private String name;
  @Column(unique=true)
  private String email;
  @Column(unique=true)
  private String matricula;
  private String course;
  private String passwordHash;
  private Instant createdAt;
}
```

// Exemplo `Grade` + `GradeItem`
```java
@Entity
public class Grade {
  @Id @GeneratedValue
  private Long id;
  private String name;
  private Long userId; // FK via @ManyToOne(User)
  private Instant createdAt;
  @OneToMany(cascade = CascadeType.ALL)
  private List<GradeItem> items;
}

@Entity
public class GradeItem {
  @Id @GeneratedValue
  private Long id;
  private String disciplineCode;
  private String name;
  private String turma;
  private String horario; // ex: "Terça 18:30-20:10"
}
```

Controller / Service (exemplo simplificado)
```java
@RestController
@RequestMapping("/api/grades")
public class GradeController {
  private final GradeService gradeService;

  @PostMapping
  public ResponseEntity<GradeDto> save(@RequestBody CreateGradeRequest req, Principal p){
    GradeDto saved = gradeService.save(req, p.getName());
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
  }

  @GetMapping
  public List<GradeDto> list(@RequestParam Optional<Long> userId){
    return gradeService.list(userId);
  }
}
```

Autenticação (fluxo JWT)
------------------------

1. Usuário faz POST /api/auth/login com `matricula` e `senha`.
2. Backend valida senha (bcrypt) e gera JWT com payload (userId, roles).
3. Frontend guarda token (em memória/secure httpOnly cookie) e envia Authorization: Bearer <token> nas chamadas subsequentes.
4. Endpoints protegidos devem verificar token e popular contexto (UserDetails).

Exemplo de configuração
- Configure `SecurityFilter` que valida JWT no header Authorization.
- Usar `PasswordEncoder` (BCryptPasswordEncoder).

Próximos passos sugeridos
- Implementar esqueleto com Spring Initializr e adaptar pacote e nomes.
- Adicionar integração com Flyway para migrations.
- Implementar testes unitários para serviços principais.
- Gerar cliente TypeScript a partir do `openapi.yaml` (opcional): `openapi-generator` ou `swagger-codegen`.

Arquivo OpenAPI: `openapi.yaml` (na mesma pasta).

Docker Compose: `docker-compose.yml` (na mesma pasta) para Postgres + Adminer.

---

Se preferir, eu posso também:
- Gerar o skeleton Maven/Gradle do Spring Boot (código fonte) diretamente neste repositório;
- Implementar os controllers básicos e a autenticação JWT;
- Gerar um arquivo `application.yml` de exemplo e scripts de inicialização.
