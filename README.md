# RADAR Web

Frontend Next.js do recomendador de grades da UFBA. A interface consome dados reais da API
RADAR: catálogo curricular sincronizado do Ementas, ofertas públicas coletadas do SIGAA,
preferências do estudante, recomendações sem conflito e simulações persistidas.

## Executar localmente

Pré-requisitos: Node.js 22.18+ (Node 24 recomendado pelo `.nvmrc`) e a API em
`http://localhost:9090`.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Acesse `http://localhost:3000`. Comandos de verificação:

```bash
npm run typecheck
npm run lint
npm run build
npm audit
```

O `package-lock.json` é o único lockfile e deve acompanhar qualquer alteração de dependência.

## Configuração

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:9090/api
```

Na Vercel, use a URL HTTPS da API. O domínio implantado também precisa constar em
`RADAR_ALLOWED_ORIGINS` no backend.

## Fluxos implementados

- cadastro e login com token Bearer;
- modo de teste com curso, perfil inicial, períodos regulares, CR e status formando;
- seleção de componentes concluídos por contexto curricular;
- preferências de turno e exclusão de professores;
- recomendação determinística pelas prioridades I-V da legenda oficial do SIGAA;
- agenda semanal sem sobreposição;
- salvar, listar, comparar, excluir e exportar simulações em PDF;
- edição dos dados acadêmicos, nome, email e senha para contas cadastradas.

A recuperação de senha por email ainda não possui provedor configurado. As telas informam
explicitamente essa limitação e não simulam envio ou alteração.

## Segurança

O token é enviado em `Authorization: Bearer ...`; a API valida que o usuário do token é o
dono do perfil, das preferências, das recomendações e das simulações acessadas. Dados de
catálogo, cursos, horários e ofertas são públicos. Nunca coloque segredos em variáveis
`NEXT_PUBLIC_*`.

## Stack

- Next.js 16.3.1 e React 19.2.8;
- TypeScript 6 e Tailwind CSS 4;
- Axios para contratos HTTP;
- jsPDF para exportação local.
