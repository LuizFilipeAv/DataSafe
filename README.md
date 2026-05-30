# DataSafe — Sistema de Gestão de EPIs

SaaS corporativo para gestão de Equipamentos de Proteção Individual (EPIs), construído com Next.js 14 (App Router), React Context API e Tailwind CSS.

## Como Iniciar

Clique no link abaixo:

[Link do projeto](data-safe-tawny.vercel.app)


## Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx              # Layout raiz com EPIProvider
│   ├── page.tsx                # Redireciona para /login
│   ├── globals.css             # Estilos globais + Tailwind
│   │
│   ├── login/                  # ÁREA PÚBLICA
│   │   ├── layout.tsx          # Layout sem sidebar
│   │   └── page.tsx            # Tela de login
│   │
│   ├── cadastro/               # ÁREA PÚBLICA
│   │   ├── layout.tsx
│   │   └── page.tsx            # Tela de cadastro de empresa
│   │
│   ├── dashboard/              # ÁREA PRIVADA ─────────────
│   │   └── page.tsx            # Painel com 4 cards + alertas
│   ├── funcionarios/
│   │   └── page.tsx            # CRUD de funcionários
│   ├── epis/
│   │   └── page.tsx            # CRUD de estoque de EPIs
│   └── relatorios/
│       └── page.tsx            # Registro e histórico de entregas
│
├── components/
│   ├── layout/
│   │   ├── AuthGuard.tsx       # Proteção de rotas privadas
│   │   ├── PrivateLayout.tsx   # Layout com sidebar
│   │   └── Sidebar.tsx         # Navegação lateral
│   └── ui/
│       └── index.tsx           # Button, Input, Select, Card, Badge, Modal...
│
├── context/
│   └── EPIContext.tsx          # CONTEXTO GLOBAL — toda a lógica de estado
│
├── lib/
│   └── storage.ts              # Utilitários do LocalStorage
│
└── types/
    └── index.ts                # Interfaces TypeScript globais
```

## Arquitetura e Decisões Técnicas

### Persistência: LocalStorage
Todos os dados são armazenados no `localStorage` do navegador com chaves prefixadas por `datasafe:`:
- `datasafe:empresas` — array de todas as empresas cadastradas
- `datasafe:funcionarios` — array global (filtrado por `empresaId`)
- `datasafe:epis` — array global (filtrado por `empresaId`)
- `datasafe:entregas` — array global (filtrado por `empresaId`)
- `datasafe:sessao` — sessão ativa (empresa logada)

### Multi-Tenant
O sistema suporta múltiplas empresas no mesmo dispositivo. Cada entidade (funcionário, EPI, entrega) possui um campo `empresaId`. Ao carregar dados, o contexto filtra apenas os registros da empresa logada.

### Gerenciamento de Estado
- **`EPIContext.tsx`** é o único ponto de verdade (single source of truth)
- `useEffect #1`: inicializa a sessão a partir do localStorage na montagem
- `useEffect #2`: recarrega os dados da empresa quando a sessão muda (login/logout)
- Todas as mutações (add/update/delete) atualizam simultaneamente o estado React e o localStorage

### Proteção de Rotas
O componente `AuthGuard` envolve todas as páginas privadas:
1. Verifica `isLoading` (evita flash de conteúdo)
2. Redireciona para `/login` se não houver sessão ativa
3. Renderiza os filhos somente com sessão confirmada

## Identidade Visual
- **Tema**: Dark Industrial
- **Fundo**: `bg-slate-900`
- **Cards**: `bg-slate-800`
- **Primária**: `#FF8C00` (Dark Orange)
- **Texto**: `text-slate-50`
- **Bordas**: `border-slate-700`
- **Ícones**: `lucide-react`

## Fluxo de Uso
1. Acesse `/cadastro` para criar a conta da sua empresa
2. Faça login em `/login`
3. Cadastre funcionários em `/funcionarios`
4. Cadastre EPIs com estoque em `/epis`
5. Registre entregas em `/relatorios`
6. Acompanhe métricas no `/dashboard`
"# DataSafe" 
