# Sistema de Gestão de Benefícios - Frontend
## Interface de Gerenciamento de Benefícios Corporativos

Frontend desenvolvido em **Angular 20** com **PrimeNG 20** para gerenciar benefícios corporativos de forma intuitiva e moderna.

Aplicação responsiva e performática com arquitetura standalone components, usando TailwindCSS e PrimeUI para uma experiência de usuário premium.

## 📋 Sumário

- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Execução Local](#execução-local)
- [Build e Deploy](#build-e-deploy)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Componentes Principais](#componentes-principais)
- [Arquitetura e Padrões](#arquitetura-e-padrões)
- [Validações Implementadas](#validações-implementadas)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Pré-requisitos

### Obrigatório

1. **Node.js 20.x ou superior**
   - Instale de: [https://nodejs.org/](https://nodejs.org/)
   - Verifique com: `node -v` (deve retornar v20.x.x)
   - Verifique npm: `npm -v` (deve retornar 10.x.x)

2. **Angular CLI 20.x**
   - Instale globalmente: `npm install -g @angular/cli@20`
   - Verifique com: `ng version`

3. **Git**
   - Para clonar o repositório
   - [Download Git](https://git-scm.com/downloads)

### Opcional

- **Visual Studio Code** - Editor recomendado
  - Extensões sugeridas:
    - Angular Language Service
    - Prettier - Code formatter
    - ESLint
    - Angular Snippets
- **Chrome DevTools** - Para debug
- **Postman / Insomnia** - Para testar APIs

---

## 📦 Instalação e Configuração

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/beneficios-frontend.git
cd beneficios-frontend
```

### 2. Instale as Dependências

```bash
# Instalar todas as dependências
npm install

# Ou usando cache limpo (se houver problemas)
npm ci
```

**Tempo estimado:** 2-5 minutos dependendo da conexão

### 3. Configure o Ambiente

Crie arquivos de ambiente na pasta `src/environments/`:

#### **environment.local.ts** (Desenvolvimento Local)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

#### **environment.development.ts** (Desenvolvimento)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  enableDebug: true
};
```

#### **environment.homolog.ts** (Homologação)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://seu-servidor-homolog:8081',
  enableDebug: false
};
```

#### **environment.prod.ts** (Produção)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.seu-dominio.com',
  enableDebug: false
};
```

### 4. Verificar Instalação

```bash
# Verificar versão do Angular CLI
ng version

# Deve exibir:
# Angular CLI: 20.x.x
# Node: 20.x.x
# Package Manager: npm 10.x.x
```

---

## 🚀 Execução Local

### Desenvolvimento (Hot Reload)

```bash
# Padrão - porta 4200
npm start

# Ou com comando ng serve
ng serve

# Com navegação automática
ng serve --open

# Especificar porta customizada
ng serve --port 4300
```

A aplicação estará disponível em: **http://localhost:4200**

### Ambientes Específicos

```bash
# Ambiente local (padrão)
ng serve --configuration local

# Ambiente de desenvolvimento
ng serve --configuration development

# Ambiente de homologação
ng serve --configuration homolog

# Ambiente de produção (apenas para testes)
ng serve --configuration production
```

### Servidor com Configurações Avançadas

```bash
# Com host específico (para acesso na rede local)
ng serve --host 0.0.0.0 --port 4200

# Com SSL (HTTPS)
ng serve --ssl

# Com proxy para backend
ng serve --proxy-config proxy.conf.json
```

### Arquivo de Proxy (Opcional)

Crie `proxy.conf.json` na raiz:

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

Com proxy, você pode usar URLs relativas:
```typescript
// Antes: http://localhost:8080/api/v1/beneficios
// Com proxy: /api/v1/beneficios
```

---

## 🏗️ Build e Deploy

### Build de Produção

```bash
# Build otimizado para produção
npm run build

# Ou com comando ng build
ng build --configuration production

# Build com análise de bundle
ng build --configuration production --stats-json
```

**Saída:** `dist/sakai-ng/` (cerca de 1-3 MB comprimido)

### Opções de Build Avançadas

```bash
# Build com source maps (para debug em produção)
ng build --configuration production --source-map

# Build com otimizações máximas
ng build --configuration production --optimization=true

# Build para ambiente específico
ng build --configuration homolog

# Build sem otimização (desenvolvimento)
ng build --configuration development
```

### Análise de Bundle

```bash
# Gerar estatísticas
ng build --stats-json

# Analisar com webpack-bundle-analyzer (instale primeiro)
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/sakai-ng/stats.json
```

### Servir Build Localmente

```bash
# Instalar servidor HTTP simples
npm install -g http-server

# Servir a pasta dist
http-server dist/sakai-ng -p 8080 -c-1

# Acesse em: http://localhost:8080
```

---

## 📁 Estrutura do Projeto

```
beneficios-frontend/
├── src/
│   ├── app/
│   │   ├── core/                      # Serviços principais
│   │   │   ├── abstract.service.ts    # Serviço abstrato genérico
│   │   │   └── beneficio.service.ts   # Serviço de benefícios
│   │   ├── shared/                    # Módulos compartilhados
│   │   │   ├── classes/               # Classes utilitárias
│   │   │   │   ├── content.ts         # Wrapper de resposta API
│   │   │   │   └── page.ts            # Paginação
│   │   │   ├── models/                # Modelos de dados
│   │   │   │   ├── beneficio.ts
│   │   │   │   └── column.ts
│   │   │   ├── utils/                 # Utilitários
│   │   │   │   └── message.util.ts    # Mensagens toast
│   │   │   └── components/            # Componentes reutilizáveis
│   │   ├── pages/                     # Páginas principais
│   │   │   ├── home/                  # Página inicial (cards)
│   │   │   │   ├── home.component.ts
│   │   │   │   └── imports.ts
│   │   │   └── crud/                  # CRUD de benefícios
│   │   │       └── beneficio/
│   │   │           ├── beneficio.component.ts
│   │   │           ├── beneficio-cadastro.component.ts
│   │   │           ├── beneficio-transfer.component.ts
│   │   │           └── imports.ts
│   │   ├── layout/                    # Layout da aplicação
│   │   │   ├── app.layout.component.ts
│   │   │   ├── app.menu.component.ts
│   │   │   └── app.topbar.component.ts
│   │   ├── app.config.ts              # Configuração global
│   │   └── app.routes.ts              # Rotas da aplicação
│   ├── environments/                  # Configurações por ambiente
│   │   ├── environment.local.ts
│   │   ├── environment.development.ts
│   │   ├── environment.homolog.ts
│   │   └── environment.prod.ts
│   ├── assets/                        # Recursos estáticos
│   │   ├── layout/                    # Imagens do layout
│   │   └── demo/                      # Dados de demonstração
│   ├── styles.scss                    # Estilos globais
│   └── main.ts                        # Ponto de entrada
├── .vscode/                           # Configurações VSCode
├── angular.json                       # Configuração do Angular
├── package.json                       # Dependências npm
├── tsconfig.json                      # Configuração TypeScript
├── tailwind.config.js                 # Configuração Tailwind
├── eslint.config.mjs                  # Configuração ESLint
├── .prettierrc                        # Configuração Prettier
└── README.md
```

---

## 🛠️ Tecnologias Utilizadas

### Framework e Core

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Angular** | 20.x | Framework frontend principal |
| **TypeScript** | 5.8.x | Linguagem fortemente tipada |
| **RxJS** | 7.8.x | Programação reativa |
| **Zone.js** | 0.15.x | Change detection |

### UI/UX Components

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **PrimeNG** | 20.x | Biblioteca de componentes UI premium |
| **PrimeIcons** | 7.0.x | Ícones vetoriais |
| **PrimeUI Themes** | 1.2.x | Sistema de temas |
| **TailwindCSS** | 4.1.x | Framework CSS utility-first |
| **TailwindCSS PrimeUI** | 0.6.x | Plugin Tailwind para PrimeUI |

### Visualização de Dados

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Chart.js** | 4.4.x | Gráficos e visualizações |
| **PrimeNG Table** | - | Tabelas avançadas com paginação |
| **PrimeNG Charts** | - | Wrapper para Chart.js |

### Desenvolvimento

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Angular CLI** | 20.x | Ferramentas de desenvolvimento |
| **ESLint** | 9.30.x | Linting de código |
| **Prettier** | 3.6.x | Formatação de código |
| **Karma** | 6.4.x | Test runner |
| **Jasmine** | 5.8.x | Framework de testes |

---

## 📱 Componentes Principais

### 1. HomeComponent (`pages/home/home.component.ts`)

**Características:**
- ✅ Visualização em cards dos benefícios ativos
- ✅ Busca global com debounce
- ✅ Paginação integrada
- ✅ Modal de transferência de saldo
- ✅ Navegação para detalhes
- ✅ Animações de cartões

**Funcionalidades:**
```typescript
// Listar benefícios com filtros
getBeneficioRequest(filter: boolean): void

// Abrir modal de transferência
handleTransferDialog(data: Beneficio): void

// Navegar para detalhes
handleDetailBeneficio(data: Beneficio): void

// Paginação
handlePageChange(event: PaginatorState): void
```

**Preview:**
```
┌─────────────┬─────────────┬─────────────┐
│  Card 1     │  Card 2     │  Card 3     │
│  Nome       │  Nome       │  Nome       │
│  R$ 500,00  │  R$ 600,00  │  R$ 200,00  │
│  [Obter]    │  [Obter]    │  [Obter]    │
│  [Detalhes] │  [Detalhes] │  [Detalhes] │
└─────────────┴─────────────┴─────────────┘
```

### 2. BeneficioComponent (`pages/crud/beneficio/beneficio.component.ts`)

**Características:**
- ✅ Listagem em tabela com ordenação
- ✅ Filtros avançados (Accordion)
- ✅ Busca global com debounce
- ✅ Paginação server-side
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Confirmação de exclusão

**Filtros Disponíveis:**
```typescript
filtrosForm = {
  nome: string,
  descricao: string,
  valor: number,
  ativo: boolean
}
```

**Colunas da Tabela:**
| Coluna | Tipo | Formato |
|--------|------|---------|
| ID | number | - |
| Nome | string | - |
| Descrição | string | - |
| Valor | number | R$ 0,00 |
| Ativo | boolean | Checkbox |
| Versão | number | - |
| Ações | - | Editar/Excluir |

### 3. BeneficioCadastroComponent

**Características:**
- ✅ Modal responsivo
- ✅ Formulário reativo
- ✅ Validações em tempo real
- ✅ Suporte para Add/Edit
- ✅ Mensagens de erro contextuais

**Validações:**
```typescript
formData = {
  nome: [required, maxLength(100)],
  descricao: [required, maxLength(255)],
  valor: [required, min(0.01)],
  ativo: [boolean]
}
```

### 4. BeneficioTransferComponent

**Características:**
- ✅ Transferência de saldo entre benefícios
- ✅ Validação de saldo disponível
- ✅ Seleção de benefício destino
- ✅ Formato de moeda (R$)
- ✅ Feedback visual de sucesso/erro

**Regras de Negócio:**
- Não permite transferir para o mesmo benefício
- Valor deve ser maior que zero
- Saldo de origem deve ser suficiente
- Ambos os benefícios devem estar ativos

---

## 🏛️ Arquitetura e Padrões

### Arquitetura Standalone Components

O projeto utiliza a **arquitetura standalone** do Angular 20, eliminando a necessidade de NgModules:

```typescript
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PrimeNGModule, ...],
  template: `...`
})
export class HomeComponent { }
```

**Vantagens:**
- ⚡ Carregamento mais rápido (tree-shaking otimizado)
- 🎯 Dependências explícitas e claras
- 📦 Bundles menores
- 🔧 Melhor manutenibilidade

### Padrão Abstract Service

O `AbstractService` implementa operações CRUD genéricas:

```typescript
export abstract class AbstractService<RESPONSE, RESUME> {
  protected abstract get resource(): string;
  
  listarTodos(): Observable<Content<RESUME>>
  listarPaginado(params, page): Observable<Page<RESUME>>
  adicionar(data): Observable<Content<RESPONSE>>
  atualizar(id, data): Observable<Content<RESPONSE>>
  remover(id): Observable<Content<RESUME>>
}
```

**Implementação:**
```typescript
@Injectable({ providedIn: 'root' })
export class BeneficioService extends AbstractService<Beneficio, Beneficio> {
  protected override get resource(): string {
    return 'beneficios';
  }
  
  // Métodos específicos
  transfer(params): Observable<Content<Beneficio>> { }
}
```

**Benefícios:**
- 🔄 Reutilização de código
- 📝 Menos boilerplate
- ✅ Tipagem forte
- 🎯 Consistência nas APIs

### Injeção de Dependências Moderna

Usando a função `inject()` (Angular 14+):

```typescript
// ❌ Forma antiga (constructor)
constructor(
  private service: BeneficioService,
  private router: Router
) { }

// ✅ Forma moderna (inject)
private readonly service = inject(BeneficioService);
public readonly router = inject(Router);
```

### Reactive Forms

Todos os formulários usam **Reactive Forms**:

```typescript
formData = new FormGroup({
  nome: new FormControl('', Validators.required),
  descricao: new FormControl('', Validators.required),
  valor: new FormControl(0.00, [Validators.required, Validators.min(0.01)]),
  ativo: new FormControl(true)
});

// Validação
isInvalid(controlName: string) {
  const control = this.formData.get(controlName);
  return control?.invalid && (control.touched || this.submitted);
}
```

### Debounce para Pesquisas

Evita requisições excessivas ao backend:

```typescript
filterSubject$ = new Subject<any>();

constructor() {
  this.filterSubject$
    .pipe(debounceTime(500))
    .subscribe(() => this.getBeneficioRequest(true));
}

// No template
<input [(ngModel)]="globalSearch" 
       (ngModelChange)="filterSubject$.next(globalSearch)">
```

---

## ✅ Validações Implementadas

### Frontend (Angular)

#### Campo: Nome
- ✅ Obrigatório (`Validators.required`)
- ✅ Máximo 100 caracteres
- ✅ Feedback visual em tempo real

#### Campo: Descrição
- ✅ Obrigatório (`Validators.required`)
- ✅ Máximo 255 caracteres
- ✅ Aceita caracteres especiais

#### Campo: Valor
- ✅ Obrigatório (`Validators.required`)
- ✅ Mínimo: 0.01 (`Validators.min`)
- ✅ Formato: 0.00 (duas casas decimais)
- ✅ Máscara de moeda (R$)

#### Campo: Ativo
- ✅ Booleano (checkbox)
- ✅ Padrão: true

### Backend (Java)

As validações são reforçadas no backend:

```java
@NotBlank(message = "Campo nome é obrigatório")
private String nome;

@NotBlank(message = "Campo descrição é obrigatório")
private String descricao;

@NotNull(message = "O campo valor é obrigatório")
@DecimalMin(value = "0.01", message = "O valor deve ser maior que zero.")
private BigDecimal valor;
```

### Validação de Transferência

```typescript
// Frontend
if (formData.invalid) return;

// Backend
- Valor > 0
- Saldo suficiente
- Benefícios diferentes
- Ambos ativos
```

---

## 🎨 Interface e UX

### Tema e Cores

O projeto usa o **Lara Theme** do PrimeNG com customizações:

```scss
// Cores principais (Tailwind + PrimeUI)
$primary: #4F46E5;    // Indigo
$secondary: #64748B;  // Slate
$success: #10B981;    // Green
$danger: #EF4444;     // Red
$warning: #F59E0B;    // Amber
$info: #3B82F6;       // Blue
```

### Responsividade

```scss
// Breakpoints (Tailwind)
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large
```

**Grid Responsivo:**
```html
<!-- Desktop: 3 colunas | Tablet: 2 colunas | Mobile: 1 coluna -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Cards aqui -->
</div>
```

### Animações

```scss
// Animação de cartões
.card-animation {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  }
}
```

### Acessibilidade (a11y)

- ♿ **ARIA labels** em botões de ação
- ♿ **Contraste WCAG AA** em textos
- ♿ **Navegação por teclado** (Tab, Enter, Esc)
- ♿ **Screen reader** friendly
- ♿ **Focus visible** em elementos interativos

---

## 📧 Integração com Backend

### Fluxo de Requisições

```
┌─────────────┐      HTTP       ┌─────────────┐
│  Frontend   │ ──────────────> │   Backend   │
│  (Angular)  │   JSON/REST     │   (Spring)  │
│             │ <────────────── │             │
└─────────────┘    Response     └─────────────┘
```

### Endpoints Consumidos

```typescript
// Base URL
environment.apiUrl = 'http://localhost:8080'

// Endpoints
GET    /api/v1/beneficios              // Lista todos
GET    /api/v1/beneficios/pageable     // Lista paginado
POST   /api/v1/beneficios              // Criar
PUT    /api/v1/beneficios/{id}         // Atualizar
DELETE /api/v1/beneficios/{id}         // Excluir
PUT    /api/v1/beneficios/transfer     // Transferir
```

### Formato de Resposta

```typescript
// Sucesso
interface Content<T> {
  success: boolean;
  mensagem: string;
  data: T;
}

// Paginação
interface Page<T> {
  content: T[];
  pageable: {...};
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
```

### Tratamento de Erros

```typescript
this.service.adicionar(data).subscribe({
  next: (res) => {
    this.messageUtil.success(res.mensagem);
  },
  error: (err) => {
    this.messageUtil.error(err.error.mensagem);
  }
});
```

### Interceptors (Opcional)

Para adicionar token JWT ou logs globais:

```typescript
// http.interceptor.ts
export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  
  return next(req);
};
```

---

## 🧪 Testes

### Executar Testes Unitários

```bash
# Executar todos os testes
npm test

# Executar com cobertura
npm test -- --code-coverage

# Executar em modo watch
npm test -- --watch
```

**Relatório de Cobertura:** `coverage/index.html`

### Estrutura de Testes

```typescript
describe('BeneficioService', () => {
  let service: BeneficioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(BeneficioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('deve listar benefícios', () => {
    const mockData = [...];
    
    service.listarTodos().subscribe(data => {
      expect(data.length).toBe(3);
    });

    const req = httpMock.expectOne('/api/v1/beneficios');
    req.flush(mockData);
  });
});
```

### Lint e Formatação

```bash
# Executar ESLint
npm run lint

# Corrigir problemas automaticamente
npm run lint -- --fix

# Formatar código com Prettier
npm run format

# Verificar formatação
npm run format -- --check
```

---

## 📊 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| `start` | `ng serve` | Executa dev server (porta 4200) |
| `build` | `ng build` | Build de produção |
| `watch` | `ng build --watch` | Build com hot reload |
| `test` | `ng test` | Executa testes unitários |
| `format` | `prettier --write` | Formata código |
| `lint` | `ng lint` | Verifica code style |

### Scripts Customizados (Adicionar ao package.json)

```json
"scripts": {
  "start:local": "ng serve --configuration local",
  "start:dev": "ng serve --configuration development",
  "start:homolog": "ng serve --configuration homolog",
  "build:prod": "ng build --configuration production",
  "build:homolog": "ng build --configuration homolog",
  "analyze": "ng build --stats-json && webpack-bundle-analyzer dist/stats.json",
  "e2e": "ng e2e",
  "lint:fix": "ng lint --fix"
}
```

---

## 🔍 Troubleshooting

### Problema: Porta 4200 já em uso

```bash
# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :4200
kill -9 <PID>

# Ou use porta diferente
ng serve --port 4300
```

### Problema: "Module not found" após git pull

```bash
# Limpar cache npm
npm cache clean --force

# Remover node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Problema: Build lento ou travando

```bash
# Aumentar memória Node.js
export NODE_OPTIONS="--max_old_space_size=4096"
npm run build

# Windows
set NODE_OPTIONS=--max_old_space_size=4096
npm run build
```

### Problema: Erro de CORS ao chamar API

**Verifique:**

1. Backend está rodando? `http://localhost:8080`
2. CORS configurado no backend:
   ```properties
   CORS_ALLOWED_ORIGINS=http://localhost:4200
   ```
3. URL correta no environment:
   ```typescript
   apiUrl: 'http://localhost:8080'
   ```

**Solução temporária - Proxy:**
```json
// proxy.conf.json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false
  }
}

// Executar com proxy
ng serve --proxy-config proxy.conf.json
```

### Problema: Erros de tipagem TypeScript

```bash
# Limpar cache do TypeScript
rm -rf .angular/cache

# Recompilar
ng build --configuration development
```

### Problema: Componentes PrimeNG não aparecem

**Verifique:**

1. Importou os módulos necessários?
   ```typescript
   imports: [ButtonModule, TableModule, ...]
   ```

2. Tema PrimeNG carregado em `styles.scss`?
   ```scss
   @import "primeng/resources/themes/lara-light-blue/theme.css";
   @import "primeng/resources/primeng.css";
   @import "primeicons/primeicons.css";
   ```

3. TailwindCSS configurado?
   ```js
   // tailwind.config.js
   module.exports = {
     content: ["./src/**/*.{html,ts}"],
     theme: {...}
   }
   ```

### Problema: Hot reload não funciona

```bash
# Parar servidor
Ctrl + C

# Limpar cache
rm -rf .angular/cache

# Reiniciar
ng serve
```

---

## 📝 Convenções de Código

### TypeScript/Angular

```typescript
// ✅ BOM: Componente standalone bem estruturado
@Component({
  selector: 'app-beneficio',
  standalone: true,
  imports: [CommonModule, ...],
  template: `...`
})
export class BeneficioComponent implements OnInit {
  private readonly service = inject(BeneficioService);
  public data: Beneficio[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void { }
}

// ✅ BOM: Serviço com injeção moderna
@Injectable({ providedIn: 'root' })
export class BeneficioService extends AbstractService<Beneficio, Beneficio> {
  protected override get resource(): string {
    return 'beneficios';
  }
}
```

### HTML/Templates

```html
<!-- ✅ BOM: Estrutura clara e semântica -->
<div class="card shadow-md">
  <h2 class="text-center mb-4">Título</h2>
  
  @if (loading) {
    <p-progress-spinner />
  } @else {
    <p-table [value]="data" />
  }
</div>

<!-- ❌ RUIM: Sem estrutura -->
<div>
  <div *ngIf="!loading">
    <p-table [value]="data"></p-table>
  </div>
</div>
```

### SCSS/CSS

```scss
// ✅ BOM: Classes do Tailwind + customizações
.card {
  @apply shadow-md rounded-lg p-4;
  
  &:hover {
    @apply shadow-lg;
  }
}

// ✅ BOM: Variáveis para cores customizadas
:root {
  --primary-color: #4F46E5;
  --secondary-color: #64748B;
}

// ❌ RUIM: CSS inline excessivo
// Use classes do Tailwind sempre que possível
```

### Nomenclatura

```typescript
// ✅ BOM: Nomes descritivos
getBeneficioRequest()
handleTransferDialog()
isFormValid()

// ❌ RUIM: Nomes vagos
get()
open()
check()

// ✅ BOM: Constantes em UPPER_CASE
const API_BASE_URL = 'http://localhost:8080';
const MAX_RETRY_ATTEMPTS = 3;

// ✅ BOM: Interfaces com prefixo I (opcional)
interface IBeneficio { }
interface IApiResponse { }
```

---

## 🚢 Deploy em Produção

### 1. Preparar Build de Produção

```bash
# Build otimizado
npm run build

# Verificar saída
ls -lh dist/sakai-ng/
# Deve mostrar: index.html, main.js, styles.css, assets/
```

### 2. Testar Build Localmente

```bash
# Instalar servidor HTTP
npm install -g http-server

# Servir build
cd dist/sakai-ng
http-server -p 8080 -c-1

# Acesse: http://localhost:8080
```

### 3. Deploy em Servidor Web

#### Nginx (Recomendado)

Crie arquivo `/etc/nginx/sites-available/beneficios`:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    root /var/www/beneficios/dist/sakai-ng;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy (se necessário)
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Ativar site:
```bash
sudo ln -s /etc/nginx/sites-available/beneficios /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Apache

Crie `.htaccess` na pasta `dist/sakai-ng/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

# Cache static files
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### 4. Deploy Automatizado

#### GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: CI
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      # Backend - Java Spring Boot
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: "17"
          distribution: "temurin"

      - name: Cache Maven dependencies
        uses: actions/cache@v3
        with:
          path: ~/.m2/repository
          key: ${{ runner.os }}-maven-${{ hashFiles('**/pom.xml') }}
          restore-keys: |
            ${{ runner.os }}-maven-

      - name: Build backend
        run: mvn -B -f backend-module/pom.xml clean package

      - name: Run backend tests
        run: mvn -B -f backend-module/pom.xml test

      # Frontend - Angular 20
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"

      - name: Cache Node modules
        uses: actions/cache@v3
        with:
          path: frontend/node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('frontend/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      - name: Install frontend dependencies
        run: npm ci
        working-directory: ./frontend

      - name: Build frontend
        run: npm run build
        working-directory: ./frontend

      - name: Run frontend tests
        run: npm run test -- --watch=false --browsers=ChromeHeadless
        working-directory: ./frontend

      # Opcional: Upload de artefatos
      - name: Upload backend artifact
        uses: actions/upload-artifact@v3
        with:
          name: backend-jar
          path: backend-module/target/*.jar

      - name: Upload frontend artifact
        uses: actions/upload-artifact@v3
        with:
          name: frontend-dist
          path: frontend/dist/
```

### 5. Variáveis de Ambiente em Produção

Para trocar `apiUrl` sem recompilar:

#### Opção 1: Usar `environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.producao.com'
};
```

#### Opção 2: Runtime Configuration

1. Crie `assets/config.json`:
```json
{
  "apiUrl": "https://api.producao.com"
}
```

2. Carregue no `main.ts`:
```typescript
fetch('/assets/config.json')
  .then(response => response.json())
  .then(config => {
    // Usar config
    bootstrapApplication(AppComponent, {
      providers: [
        { provide: 'APP_CONFIG', useValue: config }
      ]
    });
  });
```

---

## 🔒 Segurança

### Proteção XSS

Angular já protege contra XSS por padrão, mas tenha cuidado:

```typescript
// ✅ SEGURO: Angular sanitiza automaticamente
<div>{{ userInput }}</div>

// ⚠️ CUIDADO: Bypass de sanitização
<div [innerHTML]="userInput"></div>

// ✅ SEGURO: Sanitizar manualmente se necessário
import { DomSanitizer } from '@angular/platform-browser';

constructor(private sanitizer: DomSanitizer) {}

getSafeHtml(html: string) {
  return this.sanitizer.sanitize(SecurityContext.HTML, html);
}
```

### Proteção CSRF

```typescript
// Angular HttpClient já envia XSRF-TOKEN automaticamente
// Certifique-se que o backend valida:
// X-XSRF-TOKEN header
```

### Autenticação JWT (Exemplo)

```typescript
// auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};

// Registrar no app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
```

### Proteção de Rotas

```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  
  return true;
};

// app.routes.ts
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'crud', 
    canActivate: [authGuard],
    children: [...]
  }
];
```

---

## ⚡ Performance e Otimização

### Lazy Loading de Rotas

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'crud',
    loadChildren: () => import('./pages/crud/crud.routes').then(m => m.crudRoutes)
  }
];
```

### OnPush Change Detection

```typescript
@Component({
  selector: 'app-beneficio',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class BeneficioComponent { }
```

### TrackBy em *ngFor

```typescript
// Component
trackById(index: number, item: Beneficio): number {
  return item.id;
}

// Template
@for (item of items; track item.id) {
  <div>{{ item.nome }}</div>
}
```

### Virtual Scrolling (Listas Grandes)

```typescript
import { ScrollingModule } from '@angular/cdk/scrolling';

// Template
<cdk-virtual-scroll-viewport itemSize="50" class="h-96">
  @for (item of items; track item.id) {
    <div class="h-12">{{ item.nome }}</div>
  }
</cdk-virtual-scroll-viewport>
```

### Bundle Analysis

```bash
# Gerar stats
ng build --stats-json

# Analisar com webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/sakai-ng/stats.json
```

**Dicas para reduzir bundle:**
- Use lazy loading
- Importe apenas componentes necessários do PrimeNG
- Remova dependências não utilizadas
- Use tree-shaking (automático no build prod)

---

## 📚 Recursos e Documentação

### Documentação Oficial

- [Angular Documentation](https://angular.dev/)
- [Angular CLI](https://angular.dev/tools/cli)
- [PrimeNG Components](https://primeng.org/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [RxJS](https://rxjs.dev/)

### Guias e Tutoriais

- [Angular Style Guide](https://angular.dev/style-guide)
- [Angular Best Practices](https://angular.dev/best-practices)
- [PrimeNG Showcase](https://primeng.org/showcase)
- [Tailwind Play](https://play.tailwindcss.com/)

### Ferramentas Úteis

- [StackBlitz](https://stackblitz.com/) - IDE online para Angular
- [Angular DevTools](https://angular.dev/tools/devtools) - Extensão Chrome
- [Compodoc](https://compodoc.app/) - Documentação automática

---

## 🐛 Debug e Logs

### Console Logs Estratégicos

```typescript
// ✅ BOM: Logs informativos
console.log('Dados carregados:', data);
console.warn('Atenção: Benefício inativo');
console.error('Erro ao salvar:', error);

// ❌ RUIM: Logs excessivos em produção
// Use environment para controlar logs
if (!environment.production) {
  console.log('Debug info:', data);
}
```

### Angular DevTools

1. Instale extensão [Angular DevTools](https://chrome.google.com/webstore/detail/angular-devtools/ienfalfjdbdpebioblfackkekamfmbnh)
2. Abra DevTools (F12)
3. Aba "Angular" → veja componentes, profiler, injector

### Debug no VSCode

Crie `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug Angular",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}",
      "sourceMaps": true
    }
  ]
}
```

**Uso:**
1. Inicie `ng serve`
2. Pressione F5 no VSCode
3. Defina breakpoints no código TypeScript

---

## 🤝 Contribuindo

### Fluxo de Trabalho Git

```bash
# 1. Criar branch para feature
git checkout -b feature/nova-funcionalidade

# 2. Fazer alterações
# ... editar código ...

# 3. Commit com mensagem descritiva
git add .
git commit -m "feat: adiciona filtro por data"

# 4. Push para repositório
git push origin feature/nova-funcionalidade

# 5. Abrir Pull Request no GitHub
```

### Padrão de Commits (Conventional Commits)

```
feat: adiciona novo componente de relatório
fix: corrige bug na validação de formulário
docs: atualiza README com novas instruções
style: formata código com prettier
refactor: simplifica lógica do serviço
test: adiciona testes para BeneficioService
chore: atualiza dependências do projeto
```

### Code Review Checklist

- [ ] Código segue convenções do projeto
- [ ] Testes unitários passam
- [ ] Sem erros de lint/formato
- [ ] Documentação atualizada
- [ ] Build de produção funciona
- [ ] Testado em diferentes navegadores

---

## 📞 Suporte

### Problemas Comuns

Consulte a seção [Troubleshooting](#troubleshooting) acima.

### Reportar Bugs

1. Verifique se o bug já não foi reportado
2. Abra uma **Issue** no GitHub com:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Versão do Angular/Node

### Solicitar Features

Abra uma **Issue** com label `enhancement`:
- Descrição da funcionalidade
- Casos de uso
- Mockups/wireframes (se possível)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

```
MIT License

Copyright (c) 2024 [Seu Nome/Empresa]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👥 Desenvolvido por

**Matheus Rondon Rudolf**
- Desenvolvedor Frontend (Angular/TypeScript)
- [LinkedIn](https://www.linkedin.com/in/matheus-rondon-rudolf-733a5b116)
- [GitHub](https://github.com/matheusrudolf)

---

## 🎯 Roadmap

### Em Desenvolvimento (v1.1.0)
- [ ] Autenticação JWT
- [ ] Relatórios em PDF
- [ ] Dashboard com gráficos
- [ ] Exportação para Excel

### Planejado (v1.2.0)
- [ ] Modo escuro (dark mode)
- [ ] Notificações push
- [ ] Histórico de transações
- [ ] Multi-idioma (i18n)

### Futuro (v2.0.0)
- [ ] PWA (Progressive Web App)
- [ ] Aplicativo mobile (Capacitor)
- [ ] Integração com BI
- [ ] Machine Learning para sugestões

---

## 📊 Status do Projeto

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-85%25-green)
![Version](https://img.shields.io/badge/version-20.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-blue)
![Angular](https://img.shields.io/badge/Angular-20-red)
![PrimeNG](https://img.shields.io/badge/PrimeNG-20-blue)

**Status:** ✅ Ativo e em manutenção  
**Última atualização:** Novembro 2024  
**Versão:** 20.0.0  
**Branch principal:** `main`

---

## 🔗 Links Úteis

- **Repositório:** [GitHub](https://github.com/seu-usuario/beneficios-frontend)
- **Demo Online:** [https://demo.seu-projeto.com](https://demo.seu-projeto.com)
- **Documentação API:** [Swagger](http://localhost:8080/swagger-ui.html)
- **Figma Design:** [Protótipo UI/UX](https://figma.com/seu-projeto)

---

## 🌟 Agradecimentos

- [Angular Team](https://angular.dev/team) - Framework incrível
- [PrimeTek](https://www.primefaces.org/) - Componentes de alta qualidade
- [Tailwind Labs](https://tailwindcss.com/) - CSS utilitário
- [RxJS Team](https://rxjs.dev/) - Programação reativa
- Comunidade Open Source 💙

---

**Desenvolvido com ❤️ usando Angular 20 e PrimeNG**

*Última atualização: Novembro 2025*
