# Whitelabel

Painel whitelabel multi-marca em **React 19 + Vite + TypeScript**, com **Tailwind CSS + shadcn/ui**.

## Stack

- **React 19** + **Vite 6** + **TypeScript** (estrito)
- **Tailwind CSS** + **shadcn/ui** (`src/components/ui`)
- **Bun** como runtime e gerenciador de pacotes
- **Mise** para fixar as versões de Node e Bun
- **Portless** para rodar o app em `https://painel.localhost` em vez de `localhost:PORTA`
- **Docker** para build e execução em produção

## Pré-requisitos

- [Mise](https://mise.jdx.dev) instalado (`curl https://mise.run | sh`)

Não é necessário instalar Node ou Bun manualmente — o Mise cuida disso a partir do `.mise.toml`.

## Setup

```bash
# 1. Instala as versões fixas de Node/Bun definidas em .mise.toml
mise install

# 2. Ativa o mise no shell atual (necessário 1x por terminal novo)
eval "$(mise activate bash)"   # ou "zsh" se seu shell for zsh

# 3. Copia as variáveis de ambiente
cp .env.example .env

# 4. Instala as dependências
bun install
```

## Variáveis de ambiente (`.env`)

| Variável             | Padrão   | Descrição                                                              |
|----------------------|----------|--------------------------------------------------------------------------|
| `PORTLESS_APP_NAME`  | `painel` | Nome do host local: o app fica em `https://<valor>.localhost`            |
| `APP_PORT`           | `8080`   | Porta do host mapeada para o container Docker (`host:APP_PORT -> 80`)    |

## Rodando em desenvolvimento

### Com Portless (recomendado — `https://painel.localhost`)

```bash
bun run dev
```

Na primeira execução, o Portless gera e confia (via prompt do sistema) em um certificado local. Depois disso, o app fica sempre disponível em `https://painel.localhost` (ou no host definido em `PORTLESS_APP_NAME`), sem precisar decorar porta.

Comandos úteis do Portless:

```bash
bunx portless list      # lista as rotas ativas
bunx portless doctor    # verifica se o proxy/CA está saudável
bunx portless trust     # confia no certificado local (se necessário)
```

### Sem Portless (Vite puro, `http://localhost:5173`)

```bash
bun run dev:vite
```

## Toolbar de configuração visual (dev only)

Com o app rodando, aparece uma barra flutuante fixa no **canto inferior central** da tela (componente `src/components/ui/LayoutSwitcher.tsx`, montado em `src/components/layout/Layout.tsx` e em `src/pages/AuthPage.tsx`). É por ela que você ajusta visualmente, sem editar código:

- **Layers** — tema visual / variante de layout do dashboard.
- **Palette** — cor de destaque (accent color) da marca.
- **Raio/sombra** (ícone de forma) — border radius e shadows globais.
- **Settings2 / Wand2 + Panel** — configuração da sidebar (estilo do item ativo, tamanho/gap dos botões, cor dos ícones, opacidade da borda) no dashboard, ou largura/posição do formulário na tela de login.
- **Image** — efeito de fundo do dashboard/login (gradiente, opacidade, blur do header/sidebar/cards).
- **Sol/Lua** — alterna dark/light mode.

Todo ajuste feito na toolbar já fica valendo na hora (persistido em `localStorage` via `ThemeContext`) — use-a para explorar visualmente até chegar no resultado que você quer.

### Copiar o prompt e aplicar a configuração como padrão do projeto

O botão **"Prompt"** da toolbar copia para a área de transferência um texto (gerado por `buildConfigPrompt` em `LayoutSwitcher.tsx`) descrevendo toda a configuração visual atual (tema, cor, radius, shadows, sidebar, fundo, chrome do header/sidebar, cards, tabelas — ou, na tela de login, o efeito/posição/largura do formulário).

Passo a passo:

1. Ajuste o visual na toolbar até ficar do jeito desejado.
2. Clique em **Prompt** (o botão vira "Copiado!" por 2s confirmando).
3. Cole o texto copiado numa conversa com o Claude Code neste projeto e peça para aplicar como padrão, por exemplo:

   > Aplique esta configuração visual como padrão global do projeto (atualize os defaults em `ThemeContext.tsx` — `DEFAULT_DASHBOARD_CONFIG` e demais estados iniciais de tema/accent/radius/shadows/auth — para refletir exatamente esta config, em vez de depender do `localStorage`):
   >
   > [cole aqui o prompt copiado da toolbar]

O Claude então transforma a configuração escolhida visualmente em código (valores padrão no `ThemeContext`), tornando-a o estado inicial do projeto para todos os usuários/marcas, não só o que está salvo no seu navegador.

### Remover a toolbar quando ela não for mais necessária

Ela é só uma ferramenta de desenvolvimento — depois que a configuração visual final estiver definida em código, pode ser removida sem afetar nada (os componentes de dashboard/sidebar continuam lendo a configuração do `ThemeContext` normalmente). Peça ao Claude Code:

> Remova o componente de toolbar de configuração visual do projeto: apague `src/components/ui/LayoutSwitcher.tsx`, remova o import e o uso de `<LayoutSwitcher />` em `src/components/layout/Layout.tsx` e de `<LayoutSwitcher showFormWidthOption />` em `src/pages/AuthPage.tsx`. Não mexa no `ThemeContext`, `AuthBackground`, `AuthBgSettingsPanel` nem `authBgControls` — eles continuam em uso por outros componentes. Rode o build depois para confirmar que nada quebrou.

## Build e lint

```bash
bun run build     # tsc -b && vite build -> dist/
bun run lint       # eslint .
bun run preview    # serve o build de dist/ localmente
```

## shadcn/ui

O uso de componentes shadcn/ui é obrigatório para qualquer UI nova (ver `CLAUDE.md`). Configuração em `components.json`, componentes em `src/components/ui`.

```bash
bun run shadcn add <componente>   # ex.: bun run shadcn add avatar
```

Componentes já instalados: `button`, `input`, `label`, `card`, `badge`, `separator`, `checkbox`, `select`, `dialog`, `dropdown-menu`, `tabs`, `table`, `tooltip`, `sonner`.

## Docker

```bash
# Build + subir com docker compose (lê APP_PORT do .env)
docker compose up --build

# Ou manualmente
docker build -t whitelabel .
docker run --rm -p 8080:80 whitelabel
```

O `Dockerfile` faz build multi-stage com Bun e serve os arquivos estáticos via Nginx (com fallback de rotas para o React Router).

## Skills de IA do projeto

Instaladas em `.claude/skills/` via [skills.sh](https://skills.sh) para uso pelo Claude Code:

- **frontend-design** — design de interface de alta qualidade, evitando estética genérica de IA.
- **shadcn** (+ `migrate-radix-to-base`) — uso correto do CLI e composição de componentes shadcn/ui.
- **vercel-react-best-practices** — 70 regras de performance para React/Next.js.
- **tailwind-design-system** — design tokens e padrões de componentes com Tailwind v4/v3.

Para atualizar: `bunx skills update`.

Também está disponível como devDependency o [**agent-browser**](https://github.com/vercel-labs/agent-browser), uma CLI de automação de navegador para agentes de IA (não é uma skill). Ele só deve ser configurado/usado quando solicitado explicitamente:

```bash
bunx agent-browser install   # baixa o Chrome for Testing (só rode se for pedido)
```

## Estrutura de pastas

```
src/
  components/
    auth/       # telas de autenticação por marca
    layout/     # header/sidebar por marca
    ui/         # componentes reutilizáveis (shadcn/ui + efeitos visuais)
  features/
    dashboard/  # dashboard modular (drag-and-drop de widgets)
  pages/        # páginas por marca
  context/      # contexto de tema (dark/light, cor de marca)
  hooks/        # hooks compartilhados
  lib/          # utilitários (cn, cores, sidebar)
  styles/       # globals.css (tokens de cor, dark/light mode)
```
