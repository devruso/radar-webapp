# RADAR - Recomendador de Disciplinas

Sistema acadêmico para recomendação inteligente de grades de disciplinas, desenvolvido com Next.js 16, React 19 e TypeScript.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Páginas do Sistema](#páginas-do-sistema)
- [Fluxos de Navegação](#fluxos-de-navegação)
- [Características Técnicas](#características-técnicas)

---

## Visão Geral

O RADAR é uma plataforma que auxilia estudantes universitários a planejarem suas grades de disciplinas de forma otimizada, considerando pré-requisitos, horários, preferências pessoais e disponibilidade de professores.

---

## Tecnologias

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19.2, Tailwind CSS v4
- **Componentes**: shadcn/ui
- **Validação**: Validação customizada com feedback em tempo real
- **Acessibilidade**: ARIA labels, focus trap, keyboard navigation
- **PDF**: jsPDF para geração de documentos

---

## Páginas do Sistema

### 1. Página Inicial (`/`)

**Rota**: `/`

**Descrição**: Tela de entrada com dois modos de acesso.

**Layout**:
- Header fixo com logo do radar, título "Radar" e subtítulo "Recomendador de disciplinas"
- Duas colunas em desktop (tabs em mobile):
  - **Esquerda**: "Testar sem logar" com fundo azul marinho (#2B3E7E)
  - **Direita**: "Login" com fundo claro

**Funcionalidades**:

*Testar sem logar*:
- Campo de curso com autocomplete (12 cursos da UFBA)
- Dropdown de mês e ano de ingresso
- Botão "Começar teste" redireciona para `/grades`
- Dados salvos em sessionStorage

*Login*:
- Campo de matrícula com validação de formato
- Campo de senha com validação de campo vazio
- Link "Esqueceu a senha?" para `/forgot-password`
- Link "Cadastre-se" para `/register`
- Validação em tempo real com mensagens de erro inline
- Botão desabilitado se houver erros de validação

**Validações**:
- Matrícula: mínimo 8 caracteres
- Senha: campo obrigatório
- Curso: seleção obrigatória no modo teste

---

### 2. Cadastro (`/register`)

**Rota**: `/register`

**Descrição**: Formulário completo de registro de novo usuário.

**Seções do formulário**:

1. **Dados Pessoais**:
   - Nome completo (obrigatório, mínimo 3 caracteres)
   - Email (validação de formato email)
   - Matrícula (obrigatório, mínimo 8 caracteres)

2. **Informações Acadêmicas**:
   - Curso (autocomplete com 12 opções)
   - Ingresso (mês e ano via dropdowns)

3. **Segurança**:
   - Senha (validação de força com indicador visual)
   - Confirmar senha (validação de correspondência)

**Validações**:
- Email: formato válido (regex)
- Senha forte: mínimo 8 caracteres, maiúscula, minúscula, número e caractere especial
- Indicador visual de força da senha (Fraca/Média/Forte)
- Mensagens de erro específicas por campo
- Botão de submit desabilitado se houver erros

**Fluxo**:
1. Usuário preenche formulário
2. Validação em tempo real
3. Submit → `/register/success`
4. Confirmação → `/dashboard`

---

### 3. Confirmação de Cadastro (`/register/success`)

**Rota**: `/register/success`

**Descrição**: Tela de confirmação após cadastro bem-sucedido.

**Elementos**:
- Card centralizado com fundo branco
- Ícone de check verde em círculo
- Mensagem: "Cadastro realizado com sucesso!"
- Botão "Continuar" → redireciona para `/dashboard`

---

### 4. Recuperação de Senha (`/forgot-password`)

**Rota**: `/forgot-password`

**Descrição**: Fluxo completo de recuperação de senha em 4 etapas.

**Etapa 1 - Solicitar recuperação**:
- Campo de email com validação
- Botão "Enviar link de recuperação"
- Validação de formato de email
- Redireciona para `/forgot-password/sent`

**Etapa 2 - Email enviado** (`/forgot-password/sent`):
- Confirmação visual de envio
- Mensagem: "Link enviado para seu email"
- Botão voltar para login

**Etapa 3 - Nova senha** (`/reset-password`):
- Campo: Nova senha (validação de força)
- Campo: Confirmar nova senha (validação de correspondência)
- Indicador visual de força
- Botão "Redefinir senha"

**Etapa 4 - Sucesso** (`/reset-password/success`):
- Confirmação de senha alterada
- Botão "Fazer login" → redireciona para `/`

---

### 5. Espaço de Usuário (`/dashboard`)

**Rota**: `/dashboard`

**Descrição**: Dashboard centralizado para usuários autenticados.

**Header**:
- AppHeader com logo, título "Espaço de Usuário" e botão logout

**Cards de navegação** (ordem de exibição):

1. **Ver HISTÓRICO DE GRADES** (destaque):
   - Fundo com gradiente azul marinho
   - Texto branco em negrito
   - Ícone de relógio
   - Link: `/history`

2. **Gerar nova grade** (destaque):
   - Fundo com gradiente azul marinho
   - Texto branco em negrito
   - Ícone de +
   - Link: `/recommendations/schedules`

3. **Atualizar DISCIPLINAS FEITAS**:
   - Card branco com borda
   - Ícone de livro
   - Descrição: "Atualize quais disciplinas você já cursou"
   - Link: `/grades?from=dashboard`

4. **Atualizar PREFERÊNCIAS**:
   - Card branco com borda
   - Ícone de engrenagem
   - Descrição: "Ajuste suas preferências de horários e professores"
   - Link: `/recommendations?from=dashboard`

5. **Atualizar DADOS**:
   - Card branco com borda
   - Ícone de usuário
   - Descrição: "Edite informações pessoais e senha"
   - Link: `/profile`

**Layout**:
- Grid responsivo: 1 coluna (mobile), 2 colunas (tablet), 3 colunas (desktop)
- Cards com hover effect e transição suave

---

### 6. Atualizar Dados (`/profile`)

**Rota**: `/profile`

**Descrição**: Página para edição de informações pessoais e senha.

**Header**: AppHeader com botão voltar para `/dashboard`

**Seções**:

1. **Dados Pessoais**:
   - Nome completo (validação mínimo 3 caracteres)
   - Email (validação de formato)
   - Matrícula (somente leitura, desabilitado)
   - Curso (autocomplete)
   - Ingresso (dropdowns mês/ano)

2. **Atualizar Senha**:
   - Senha atual (obrigatório para alterar)
   - Nova senha (validação de força)
   - Confirmar nova senha (validação de correspondência)
   - Indicador visual de força

**Funcionalidades**:
- Validação em tempo real
- Mensagens de erro inline específicas
- Toast de sucesso: "Dados atualizados com sucesso!"
- Toast de erro se validação falhar
- Botão "Salvar alterações" com estado de loading

---

### 7. Disciplinas Feitas (`/grades`)

**Rota**: `/grades` (pode receber `?from=dashboard`)

**Descrição**: Interface para seleção de disciplinas já cursadas, organizadas por semestre.

**Header**: AppHeader com botão voltar condicional baseado em `from` parameter

**Card informativo superior**:
- Explicação sobre seleção de disciplinas
- Dica visual sobre checkboxes

**Funcionalidades principais**:

1. **Seleção de disciplinas**:
   - Cada semestre tem checkbox para selecionar todas
   - Disciplinas individuais selecionáveis
   - Destaque visual (ring azul) em disciplinas selecionadas
   - Lógica: desselecionar disciplina desmarca o semestre

2. **Semestres colapsáveis**:
   - Ícone chevron para expandir/colapsar
   - Quando colapsados, organizam-se em grid (lado a lado)
   - Sticky headers em cada semestre (mobile)
   - 10 semestres com disciplinas variadas

3. **Disciplinas por semestre**:
   - Tags coloridas por categoria (computação, matemática, etc.)
   - Informações: código da disciplina
   - Layout em grid responsivo

**Navegação condicional**:
- Se `from=dashboard`: botão "Concluir atualização" → volta para `/dashboard`
- Senão: botão "Seguir para preferências" → vai para `/recommendations`

**Estado persistido**: Disciplinas selecionadas salvas em state

---

### 8. Preferências (`/recommendations`)

**Rota**: `/recommendations` (pode receber `?from=dashboard`)

**Descrição**: Configuração de preferências para geração de grade.

**Header**: AppHeader com navegação condicional

**Formulário**:

1. **Turnos disponíveis**:
   - Checkboxes para seleção múltipla
   - Opções: Matutino, Vespertino, Noturno
   - Validação: ao menos um turno deve ser selecionado

2. **Professores a banir**:
   - Campo de busca com autocomplete
   - Lista de professores sugeridos (dropdown)
   - Adicionar múltiplos professores
   - Lista de professores banidos com botão de remoção (X)
   - Tags com nomes dos professores

**Validações**:
- Toast de erro se nenhum turno selecionado
- Campo de professor opcional

**Navegação condicional**:
- Se `from=dashboard`: botão "Concluir atualização" → volta para `/dashboard` com toast de sucesso
- Senão: botão "Gerar recomendação" → vai para `/recommendations/schedules`

**Responsividade**:
- Fieldsets com bordas e títulos de seção
- Espaçamento aumentado (gap-6)
- Labels maiores e mais legíveis

---

### 9. Resultados - Nova Grade (`/recommendations/schedules`)

**Rota**: `/recommendations/schedules`

**Descrição**: Exibição da grade recomendada e disciplinas reserva com funcionalidades avançadas.

**Header**: AppHeader com navegação condicional baseado em sessionStorage

**Card informativo**:
- Borda azul à esquerda
- Ícone de informação
- Critérios de ordenação: obrigatória > mais pré-requisitada > menor semestre

**Layout principal**:

**Desktop**: Duas colunas lado a lado
**Mobile**: Tabs para alternar entre seções

### Seção 1: Nova Grade (esquerda/tab 1)

**Cabeçalho editável**:
- Título "Nova grade" editável com ícone de lápis
- Clique no lápis ativa modo de edição
- Enter/check confirma, Escape/X cancela
- Subtítulo descritivo
- Sticky no mobile

**Lista de disciplinas**:
- Cards expandíveis por disciplina
- Cada card mostra:
  - Código e nome da disciplina
  - Tag colorida (obrigatória/optativa)
  - Chevron para expandir

**Ao expandir disciplina**:
- Dropdown de seleção de turma (T01, T02, T03, etc.)
- Card interno com fundo sutil contendo:
  - Ícone 🕐 + Horário (ex: "Terça 18h30 às 20h10")
  - Ícone 👤 + Professor(a) (nome do professor)
  - Ícone 📅 + Dias (ex: "Terça e Quinta")
- Botão de seta → para mover para reservas (desktop e mobile)

**Validação de conflitos**:
- Ao trocar turma, sistema detecta conflitos de horário
- Toast de erro específico se houver conflito
- Turma não é alterada em caso de conflito

**Alerta de grade vazia**:
- Se Nova Grade ficar sem disciplinas, toast avisa: "Grade vazia! Veja as disciplinas reserva"

**Botão inferior**:
- "VER ANÁLISE" abre modal com estatísticas

### Seção 2: Disciplinas Reserva (direita/tab 2)

**Cabeçalho**:
- Título "DISCIPLINAS RESERVA"
- Subtítulo: "arraste para adicionar à grade" (desktop)
- Sticky no mobile

**Lista de disciplinas**:
- Mesmo formato de cards da Nova Grade
- Botão de seta ← para mover para Nova Grade
- Drag and drop funcional (desktop)

**Drag and drop**:
- Cursor move ao hover
- Durante arraste: opacidade reduzida, escala 105%, sombra forte, ring azul
- Drop zones aceitam disciplinas
- Atualização automática das listas

### Modal de Análise

**Acionado por**: Botão "VER ANÁLISE" na Nova Grade

**Características técnicas**:
- Focus trap implementado (navegação por teclado)
- Backdrop escuro semi-transparente
- Overlay com scroll interno
- Header fixo e footer fixo

**Conteúdo**:

1. **Resumo Geral**:
   - Dias com aulas na semana
   - Carga horária do semestre
   - Carga horária semanal no campus
   - Previsão de semestres até formatura

2. **Distribuição por Turno**:
   - Lista de turnos com percentuais
   - Barra de progresso visual colorida

3. **Tempo Diário na Universidade**:
   - Por dia da semana
   - Horas estimadas por dia

4. **Disciplinas Obrigatórias Desbloqueadas**:
   - Lista de disciplinas em tags coloridas
   - Quebra de linha automática

**Botões**:
- X no header (aria-label: "Fechar análise")
- "Fechar" no footer
- ESC fecha o modal

### Ações Finais

**Rodapé com botões**:

1. **Baixar em PDF**:
   - Gera PDF completo com jsPDF
   - Inclui: título (nome editável), disciplinas da Nova Grade, Disciplinas Reserva, análise completa
   - Nome do arquivo: `{nome-da-grade}.pdf`
   - Estado de loading durante geração
   - Toast de sucesso ao completar

2. **Salvar/Criar conta** (condicional):
   - Se modo teste: "Salvar resultados/criar conta" → `/register`
   - Se logado: "Criar/Salvar resultados" → salva no histórico + toast de sucesso

**Acessibilidade**:
- Todos os botões com aria-labels descritivos
- Modal com role="dialog" e aria-labelledby
- Navegação completa por teclado
- Anúncios de ações via aria-live

---

### 10. Histórico de Grades (`/history`)

**Rota**: `/history`

**Descrição**: Visualização e gerenciamento de grades salvas anteriormente.

**Header**: AppHeader com botão voltar para `/dashboard`

**Seção de comparação** (condicional):
- Visível quando há grades selecionadas
- Layout responsivo:
  - Desktop: flex row com gap
  - Mobile: flex column (stack)
- Botões:
  - "Limpar seleção" (outline)
  - "Comparar grades" (solid azul) → `/history/compare`

**Lista de grades**:
- Cards em grid responsivo (1-3 colunas)
- Cada card contém:
  - Nome da grade (editável)
  - Data de criação
  - Resumo: X disciplinas, Y horas
  - Checkbox para seleção (comparação)
  - Botões de ação:
    - Editar nome (ícone lápis, aria-label)
    - Baixar PDF (ícone download)
    - Excluir (ícone lixeira)

**Funcionalidades**:

1. **Editar nome**:
   - Clique ativa input inline
   - Enter/check salva, Escape/X cancela
   - Toast: "Nome atualizado com sucesso!"

2. **Excluir**:
   - Confirmação via toast com ação "Desfazer"
   - Remoção do histórico
   - Toast: "Grade excluída"

3. **Baixar PDF**:
   - Gera PDF da grade específica
   - Toast de sucesso
   - Estado de loading

4. **Seleção múltipla**:
   - Checkbox em cada card
   - Máximo de grades selecionáveis
   - Botão "Comparar" aparece quando >= 2 selecionadas

**Estado vazio**:
- Mensagem: "Você ainda não possui grades salvas"
- Botão: "Criar primeira grade" → `/recommendations/schedules`

---

### 11. Comparação de Grades (`/history/compare`)

**Rota**: `/history/compare`

**Descrição**: Visualização lado a lado de múltiplas grades para comparação.

**Header**: AppHeader com botão voltar para `/history`

**Layout**:
- Desktop: Colunas lado a lado (grid)
- Mobile: Stack vertical com separadores

**Cada coluna de grade contém**:

1. **Cabeçalho**:
   - Nome da grade em destaque
   - Data de criação
   - Resumo (disciplinas, horas)

2. **Estatísticas comparativas**:
   - Carga horária total
   - Dias de aula
   - Distribuição por turno
   - Disciplinas obrigatórias vs optativas

3. **Lista de disciplinas**:
   - Cards expandíveis
   - Ao expandir: horários, professor, dias
   - Código de cores por tipo

**Funcionalidades**:
- Scroll sincronizado (opcional)
- Destaque visual de diferenças
- Botão "Voltar para histórico"

**Responsividade**:
- Desktop: max 3 colunas lado a lado
- Tablet: 2 colunas
- Mobile: 1 coluna (stack)

---

## Fluxos de Navegação

### Fluxo 1: Teste sem Login
\`\`\`
/ (teste) → /grades → /recommendations → /recommendations/schedules → /register
\`\`\`

### Fluxo 2: Login
\`\`\`
/ (login) → /dashboard → escolhe ação
\`\`\`

### Fluxo 3: Recuperação de Senha
\`\`\`
/ → /forgot-password → /forgot-password/sent → /reset-password → /reset-password/success → /
\`\`\`

### Fluxo 4: Cadastro
\`\`\`
/ → /register → /register/success → /dashboard
\`\`\`

### Fluxo 5: Atualização do Dashboard
\`\`\`
/dashboard → /grades?from=dashboard → /dashboard (concluir)
/dashboard → /recommendations?from=dashboard → /dashboard (concluir)
/dashboard → /profile → /dashboard (voltar)
\`\`\`

### Fluxo 6: Histórico
\`\`\`
/dashboard → /history → /history/compare → /history → /dashboard
\`\`\`

### Fluxo 7: Nova Grade do Dashboard
\`\`\`
/dashboard → /recommendations/schedules → /dashboard (voltar)
\`\`\`

---

## Características Técnicas

### Validação de Formulários

**Campos validados**:
- Email: regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Senha forte: mínimo 8 caracteres, maiúscula, minúscula, número, especial
- Matrícula: mínimo 8 caracteres
- Nome: mínimo 3 caracteres
- Correspondência de senhas

**Feedback visual**:
- Mensagens de erro inline (vermelho)
- Indicador de força de senha (cores progressivas)
- Bordas vermelhas em campos com erro
- Ícone de alerta nos erros
- Botões desabilitados se houver erros

**Biblioteca**: `lib/validation.ts` com funções reutilizáveis

### Sistema de Notificações (Toasts)

**Características**:
- Posicionamento: canto superior direito
- Auto-dismiss: 5 segundos
- Tipos: success, error, warning, info
- Cores distintas por tipo
- Ícones específicos
- Acessível: `aria-live="polite"` para screen readers
- Animações suaves de entrada/saída

**Uso**: `useToast()` hook em qualquer componente

### Acessibilidade (A11y)

**Implementações**:
- Focus trap em modais (`useFocusTrap` hook)
- ARIA labels em todos os botões de ícone
- ARIA live regions para anúncios dinâmicos
- Navegação por teclado em todos os elementos interativos
- Skip links (futuro)
- Indicadores visuais de foco fortes (outline azul)
- Roles semânticos (dialog, alert, status)

**Conformidade**: Segue diretrizes WCAG 2.1 nível AA

### Responsividade

**Breakpoints Tailwind**:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Estratégias**:
- Mobile-first approach
- Grid responsivo com `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Tabs para conteúdo denso no mobile
- Sticky headers em listas longas
- Botões full-width no mobile
- Espaçamentos reduzidos no mobile

### Geração de PDF

**Biblioteca**: jsPDF

**Conteúdo incluído**:
- Título da grade (editável)
- Lista de disciplinas recomendadas com detalhes (turma, horário, professor)
- Disciplinas reserva
- Análise completa (estatísticas, distribuição, horários, desbloqueios)
- Paginação automática
- Formatação profissional

**Processo**:
1. Coleta dados do state
2. Formata conteúdo em páginas
3. Gera PDF em memória
4. Dispara download automático
5. Toast de confirmação

### Detecção de Conflitos de Horário

**Lógica**:
1. Parseia strings de horário (ex: "Terça 18h30 às 20h10")
2. Extrai dia da semana e faixa horária
3. Converte horários em minutos desde meia-noite
4. Verifica sobreposição entre intervalos
5. Compara com todas as disciplinas da grade ativa
6. Previne mudança se houver conflito
7. Toast específico com disciplina conflitante

**Função**: `detectScheduleConflict()` em `/recommendations/schedules`

### Persistência de Estado

**SessionStorage**:
- Modo de teste (curso, ingresso)
- Origem de navegação (`from` parameter)
- Dados temporários do fluxo

**LocalStorage** (futuro):
- Histórico de grades
- Preferências salvas
- Cache de disciplinas

**State Management**:
- React hooks (useState, useEffect)
- Contexto via props drilling controlado
- Toast context global

---

## Paleta de Cores

**Primária**: `#2B3E7E` (Azul marinho)
**Secundária**: `#FFFFFF` (Branco)
**Acentos**:
- Verde: `#10B981` (sucesso)
- Vermelho: `#EF4444` (erro/obrigatória)
- Amarelo: `#F59E0B` (aviso)
- Azul claro: `#3B82F6` (informação)
- Roxo: `#8B5CF6` (optativa)
- Laranja: `#F97316` (matemática)
- Rosa: `#EC4899` (eletiva)

**Neutros**:
- Cinza 50-900 (escala Tailwind)

---

## Tipografia

**Font Family**:
- Sans: Geist
- Mono: Geist Mono

**Hierarquia**:
- H1: text-3xl md:text-4xl font-bold
- H2: text-2xl md:text-3xl font-semibold
- H3: text-xl md:text-2xl font-semibold
- Body: text-base
- Small: text-sm
- Tiny: text-xs

---

## Componentes Reutilizáveis

### AppHeader
- Logo + título + botão voltar + logout
- Usado em todas as páginas internas

### ToastProvider
- Context provider para notificações
- Container com posicionamento fixo

### FormFieldError
- Mensagem de erro inline
- Ícone + texto vermelho

### PasswordStrengthIndicator
- Barra de progresso colorida
- Texto descritivo (Fraca/Média/Forte)

### FocusTrap (hook)
- Captura foco em modais
- Tab cycling dentro do container

---

**Desenvolvido com Next.js 16 + React 19 + Tailwind CSS v4**
