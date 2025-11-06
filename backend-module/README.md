# Sistema de Gestão de Benefícios

Backend desenvolvido em **Spring Boot 3.2.5** com **Java 17** para gerenciar benefícios corporativos, incluindo cadastro, consulta, atualização e transferência de valores entre benefícios.

Este projeto fornece uma API REST completa com validações, paginação, pesquisa avançada e documentação interativa via Swagger.

## 📋 Sumário

- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Build e Execução](#build-e-execução)
- [CI/CD com GitHub Actions](#cicd-com-github-actions)
- [Como Debugar a Aplicação](#como-debugar-a-aplicação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Endpoints da API](#endpoints-da-api)
- [Regras de Negócio](#regras-de-negócio)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Pré-requisitos

### Obrigatório

1. **Java 17**
    - Instale o JDK 17 e configure a variável de ambiente `JAVA_HOME`
    - Verifique com: `java -version`

2. **Maven 3.8+**
    - Ferramenta de build e gerenciamento de dependências
    - Verifique com: `mvn -version`

3. **PostgreSQL 15+**
    - Banco de dados principal da aplicação
    - [Download PostgreSQL](https://www.postgresql.org/download/)

### Opcional

- **IntelliJ IDEA / VS Code** - IDEs recomendadas para desenvolvimento
- **Postman / Insomnia** - Para testes de API
- **DBeaver / pgAdmin** - Para gerenciamento do banco de dados

---

## 📦 Instalação e Configuração

### 1. Instalação do Maven

#### No Windows:

1. Baixe Maven 3.8+ em: [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)

2. Extraia para um diretório (ex: `C:\Program Files\Apache\Maven`)

3. Configure variáveis de ambiente:
    - Crie variável `MAVEN_HOME` apontando para o diretório do Maven
    - Adicione `%MAVEN_HOME%\bin` à variável `PATH`

4. Verifique instalação:
   ```bash
   mvn -version
   ```

#### No Linux/Mac:

```bash
# Usando Homebrew (Mac)
brew install maven

# Usando apt (Ubuntu/Debian)
sudo apt install maven
```

### 2. Instalação do PostgreSQL

#### No Windows:

1. Download: [PostgreSQL Installer](https://www.postgresql.org/download/windows/)
2. Execute o instalador e configure a senha do usuário `postgres`
3. Anote a porta (padrão: 5432)

#### No Linux:

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Iniciar serviço
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 3. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/backend-beneficios.git
cd backend-beneficios/backend-module
```

---

## 🌍 Configuração do Ambiente

### 1. Criar o Banco de Dados

Conecte-se ao PostgreSQL e execute:

```sql
CREATE DATABASE bip_teste;
CREATE USER postgres WITH ENCRYPTED PASSWORD '123';
GRANT ALL PRIVILEGES ON DATABASE bip_teste TO postgres;
```

### 2. Arquivo `application.properties`

Crie o arquivo em `src/main/resources/application.properties`:

```properties
# Configs gerais
spring.application.name=backend-module

# Configs do JPA comuns
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
#spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Driver do banco comum
#spring.datasource.driver-class-name=org.postgresql.Driver
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Logs
logging.level.org.springframework.web=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
logging.level.org.springframework.security=DEBUG
server.error.include-message=always
server.error.include-stacktrace=always
```

### 3. Arquivo `application-local.properties`

Para desenvolvimento em ambiente local:

```properties
# Banco H2 em memória
# ==========================================
# BANCO DE DADOS LOCAL - PostgreSQL
# ==========================================
spring.datasource.url=jdbc:postgresql://localhost:5432/bip_teste
spring.datasource.username=postgres
spring.datasource.password=123
spring.datasource.driver-class-name=org.postgresql.Driver
# ==========================================
# JPA / HIBERNATE
# ==========================================
# Atualiza automaticamente as tabelas conforme as entidades
spring.jpa.hibernate.ddl-auto=update
# Mostra as queries SQL no console
spring.jpa.show-sql=true
# Dialeto especifico do PostgreSQL
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
# ==========================================
# LOGGING (NIVEIS DE DEBUG)
# ==========================================
logging.level.org.springframework.security=DEBUG
logging.level.org.springframework.web.cors=TRACE
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql=TRACE
# ==========================================
# ACTUATOR / MONITORAMENTO
# ==========================================
management.endpoints.web.exposure.include=health,info
# ==========================================
# CONFIGURACOES DE CORS (para integracao com Angular)
# ==========================================
cors.allowed-origins=http://localhost:4200
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS,PATCH
cors.allowed-headers=Authorization,Cache-Control,Content-Type
cors.exposed-headers=Authorization
cors.allow-credentials=true
```

### 3. Arquivo `application-teste.properties` (Desenvolvimento com H2)

Para testes rápidos sem PostgreSQL:

```properties
# ==========================================
# CONFIGURACOES TESTES
# ==========================================
spring.profiles.active=test

# Banco em memória para testes
spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.datasource.platform=h2

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect

# Evita carregar segurança ou configurações externas
spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration

# Evita inicialização automática de scripts SQL
spring.sql.init.mode=never

# Adicione esta linha ao seu application-test.properties
cors.allowed-origins=*
```


Execute com: `mvn spring-boot:run -Dspring-boot.run.profiles=dev`

**⚠️ Atenção:** Nunca comite arquivos com senhas reais no repositório. Use variáveis de ambiente em produção.

---

## 🏗️ Build e Execução

### 1. Compilar o Projeto

```bash
# Limpar builds anteriores
mvn clean

# Compilar e executar testes
mvn clean install

# Compilar sem testes
mvn clean install -DskipTests
```

### 2. Executar a Aplicação

```bash
# Executar diretamente
mvn spring-boot:run

# Ou executar o JAR gerado
java -jar target/backend-module-0.0.1-SNAPSHOT.jar
```

### 3. Acessar a Aplicação

- **API Base:** `http://localhost:8080/api/v1`
- **Swagger UI:** `http://localhost:8080/swagger-ui/index.html`
- **API Docs JSON:** `http://localhost:8080/v3/api-docs`
- **Home (Redirect):** `http://localhost:8080/` → Redireciona para Swagger

### 4. Credenciais Padrão

- **Usuário:** `postgres`
- **Senha:** `123`

---

## 🚀 CI/CD com GitHub Actions

### Workflow Atual

O projeto utiliza GitHub Actions para integração contínua. O arquivo `.github/workflows/ci.yml`:

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

### Badges de Status

Adicione ao topo do README:

```markdown
![CI Status](https://github.com/seu-usuario/backend-beneficios/workflows/CI/badge.svg)
![Java Version](https://img.shields.io/badge/Java-17-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-green)
```

---

## 🐛 Como Debugar a Aplicação

### Opção 1: Debug no IntelliJ IDEA (Recomendado)

1. Abra o projeto no IntelliJ
2. Localize a classe principal com `@SpringBootApplication`
3. Clique com botão direito → **Debug 'Application'**
4. Defina breakpoints clicando na margem esquerda do código
5. Use **F8** (step over), **F7** (step into) para navegar

### Opção 2: Debug Remoto

1. Inicie a aplicação com debug habilitado:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=*:5005"
   ```

2. No IntelliJ:
    - **Run → Edit Configurations → Add New → Remote JVM Debug**
    - **Host:** `localhost`
    - **Port:** `5005`
    - Clique em **Debug**

### Opção 3: Logs Detalhados

Configure em `application.properties`:

```properties
# Habilitar SQL logging
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# Logging de requisições HTTP
logging.level.org.springframework.web=DEBUG
```

---

## 📁 Estrutura do Projeto

```
backend-module/
├── src/
│   ├── main/
│   │   ├── java/com/example/backend/
│   │   │   ├── config/              # Configurações (Security, Swagger)
│   │   │   ├── controller/          # Controllers REST
│   │   │   │   ├── BeneficioController.java
│   │   │   │   └── HomeController.java
│   │   │   ├── model/
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   │   └── BeneficioDTO.java
│   │   │   │   └── entidades/       # Entidades JPA
│   │   │   │       └── Beneficio.java
│   │   │   ├── domain/
│   │   │   │   ├── repository/      # Repositórios JPA
│   │   │   │   │   └── BeneficiosRepository.java
│   │   │   │   └── specification/   # Specifications para queries
│   │   │   │       └── BeneficioSpecification.java
│   │   │   ├── service/             # Lógica de negócio
│   │   │   │   └── BeneficioService.java
│   │   │   ├── exception/           # Exceções customizadas
│   │   │   │   ├── DuplicateException.java
│   │   │   │   └── ResourceNotFoundException.java
│   │   │   ├── util/                # Classes utilitárias
│   │   │   │   └── ApiGenericResponse.java
│   │   │   └── BackendApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       └── application-prod.properties
│   └── test/
│       └── java/com/example/backend/
│           ├── controller/          # Testes de Controller
│           ├── service/             # Testes de Service
│           └── repository/          # Testes de Repository
├── pom.xml
├── README.md
└── .github/
    └── workflows/
        └── ci.yml
```

---

## 🔌 Endpoints da API

### Base URL
```
http://localhost:8080/api/v1
```

### Autenticação
Todos os endpoints requerem autenticação **HTTP Basic**:
- **Username:** `postgres`
- **Password:** `123`

### Benefícios

#### 1. Listar Todos os Benefícios

```http
GET /api/v1/beneficios
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Beneficios consultados com sucesso!",
  "data": [
    {
      "id": 1,
      "nome": "Vale Alimentação",
      "descricao": "Benefício para alimentação",
      "valor": 500.00,
      "ativo": true,
      "version": 0
    }
  ]
}
```

#### 2. Listar com Paginação e Filtros

```http
GET /api/v1/beneficios/pageable?page=0&size=10&nome=Vale&ativo=true&search=alimentação
```

**Parâmetros de Query:**
- `nome` (opcional): Filtrar por nome
- `descricao` (opcional): Filtrar por descrição
- `valor` (opcional): Filtrar por valor
- `ativo` (opcional): Filtrar por status (true/false)
- `search` (opcional): Busca global em todos os campos
- `page` (padrão: 0): Número da página
- `size` (padrão: 10): Itens por página

**Resposta de Sucesso (200):**
```json
{
  "content": [...],
  "pageable": {...},
  "totalPages": 5,
  "totalElements": 42,
  "size": 10,
  "number": 0
}
```

#### 3. Criar Novo Benefício

```http
POST /api/v1/beneficios
Content-Type: application/json
```

**Body:**
```json
{
  "nome": "Vale Refeição",
  "descricao": "Benefício para refeições",
  "valor": 600.00,
  "ativo": true
}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Beneficio inserido com sucesso!",
  "data": {
    "id": 2,
    "nome": "Vale Refeição",
    "descricao": "Benefício para refeições",
    "valor": 600.00,
    "ativo": true,
    "version": 0
  }
}
```

**Resposta de Erro - Duplicado (400):**
```json
{
  "success": false,
  "message": "Já existe um benefício cadastrado com esse nome.",
  "data": null
}
```

#### 4. Atualizar Benefício

```http
PUT /api/v1/beneficios/{id}
Content-Type: application/json
```

**Body:**
```json
{
  "nome": "Vale Refeição Atualizado",
  "descricao": "Nova descrição",
  "valor": 650.00,
  "ativo": true
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Beneficio alterado com sucesso!",
  "data": {...}
}
```

**Resposta de Erro - Não Encontrado (404):**
```json
{
  "success": false,
  "message": "Beneficio não encontrado ou inativo.",
  "data": null
}
```

#### 5. Excluir Benefício

```http
DELETE /api/v1/beneficios/{id}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Beneficio excluido com sucesso!",
  "data": null
}
```

#### 6. Transferir Valor Entre Benefícios

```http
PUT /api/v1/beneficios/transfer?fromId=1&toId=2&amount=100.00
```

**Parâmetros de Query:**
- `fromId`: ID do benefício de origem
- `toId`: ID do benefício de destino
- `amount`: Valor a transferir

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Transferência executada com sucesso!",
  "data": null
}
```

**Resposta de Erro - Saldo Insuficiente (400):**
```json
{
  "success": false,
  "message": "Saldo insuficiente no benefício de origem.",
  "data": null
}
```

---

## 📐 Regras de Negócio

### Validações de Campo

| Campo | Regra | Mensagem de Erro |
|-------|-------|------------------|
| `nome` | Obrigatório, único | "Campo nome é obrigatório" |
| `descricao` | Obrigatório | "Campo descrição é obrigatório" |
| `valor` | Obrigatório, > 0 | "O valor deve ser maior que zero" |
| `ativo` | Booleano | - |

### Regras de Transferência

1. **Não pode transferir para o mesmo benefício**
    - Erro: `IllegalArgumentException`

2. **Valor deve ser maior que zero**
    - Validação: `amount > 0`

3. **Origem deve ter saldo suficiente**
    - Validação: `valorOrigem >= amount`

4. **Ambos os benefícios devem estar ativos**
    - Benefícios inativos são ignorados nas operações

### Controle de Concorrência

A transferência utiliza **PESSIMISTIC_WRITE Lock** para evitar condições de corrida:

```java
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT b FROM Beneficio b WHERE b.id = :id AND b.ativo = true")
Optional<Beneficio> findByIdAndAtivoTrueForUpdate(@Param("id") Long id);
```

---

## 🗄️ Banco de Dados

### Schema da Tabela `beneficio`

```sql
CREATE TABLE BENEFICIO (
  ID BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  NOME VARCHAR(100) NOT NULL,
  DESCRICAO VARCHAR(255),
  VALOR DECIMAL(15,2) NOT NULL,
  ATIVO BOOLEAN DEFAULT TRUE,
  VERSION BIGINT DEFAULT 0
);
```

### Dados de Exemplo

```sql
INSERT INTO beneficio (nome, descricao, valor, ativo) VALUES
('Vale Alimentação', 'Benefício para compras em supermercados', 500.00, true),
('Vale Refeição', 'Benefício para refeições em restaurantes', 600.00, true),
('Vale Transporte', 'Benefício para deslocamento', 200.00, true),
('Plano de Saúde', 'Assistência médica e hospitalar', 350.00, true),
('Seguro de Vida', 'Seguro de vida em grupo', 50.00, true);
```

---

## 📊 Swagger/OpenAPI

### Acessar Documentação Interativa

```
http://localhost:8080/swagger-ui/index.html
```

### Features do Swagger

- ✅ Testes de endpoints diretamente no navegador
- ✅ Visualização de schemas de request/response
- ✅ Autenticação HTTP Basic integrada
- ✅ Download de especificação OpenAPI (JSON/YAML)
- ✅ Exemplos de uso para cada endpoint

### Exportar Especificação OpenAPI

```bash
# JSON
curl http://localhost:8080/v3/api-docs > api-docs.json

# YAML
curl http://localhost:8080/v3/api-docs.yaml > api-docs.yaml
```

---

## 🧪 Testes

### Executar Todos os Testes

```bash
mvn test
```

### Executar Testes com Cobertura

```bash
mvn clean test jacoco:report
```

Relatório gerado em: `target/site/jacoco/index.html`

### Estrutura de Testes

```java
@SpringBootTest
@AutoConfigureMockMvc
class BeneficioControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void deveListarTodosBeneficios() throws Exception {
        mockMvc.perform(get("/api/v1/beneficios")
                .with(httpBasic("postgres", "123")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
```

---

## 🔍 Troubleshooting

### Problema: "Port 8080 already in use"

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

### Problema: "Maven command not found"

```bash
# Verifique instalação
mvn -version

# Adicione ao PATH (Linux/Mac)
export PATH=$PATH:/caminho/para/maven/bin

# Windows - Configure variável de ambiente MAVEN_HOME
```

### Problema: "Connection refused to PostgreSQL"

1. Verifique se o serviço está rodando:
   ```bash
   # Linux
   sudo systemctl status postgresql
   
   # Windows - Verifique Serviços
   ```

2. Teste conexão:
   ```bash
   psql -U postgres -d bip_teste -h localhost
   ```

3. Verifique firewall e porta 5432

### Problema: "Authentication failed"

1. Verifique credenciais em `application.properties`
2. Redefina senha do usuário:
   ```sql
   ALTER USER postgres WITH PASSWORD 'nova_senha';
   ```

### Problema: "Hibernate dialect error"

Certifique-se de ter o dialect correto:
```properties
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

### Problema: "H2 console not accessible"

Para ambiente de desenvolvimento com H2:
```properties
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

Acesse: `http://localhost:8080/h2-console`

---

## 📝 Variáveis de Ambiente Importantes

| Variável | Descrição | Padrão                                     |
|----------|-----------|--------------------------------------------|
| `SERVER_PORT` | Porta do servidor | 8080                                       |
| `DB_URL` | URL do banco de dados | jdbc:postgresql://localhost:5432/bip_teste |
| `DB_USERNAME` | Usuário do banco | postgres                                   |
| `DB_PASSWORD` | Senha do banco | -                                          |
| `SPRING_PROFILES_ACTIVE` | Perfil ativo (dev, prod) | default                                    |

### Uso de Variáveis de Ambiente

```bash
# Linux/Mac
export DB_PASSWORD=123
mvn spring-boot:run

# Windows
set DB_PASSWORD=123
mvn spring-boot:run
```

---

## 📚 Dependências Principais

| Dependência | Versão | Propósito |
|-------------|--------|-----------|
| Spring Boot | 3.2.5 | Framework base |
| Spring Data JPA | - | ORM e persistência |
| Spring Security | - | Autenticação e autorização |
| PostgreSQL Driver | 42.7.3 | Conexão com PostgreSQL |
| H2 Database | - | Banco em memória para testes |
| SpringDoc OpenAPI | 2.5.0 | Documentação Swagger |
| Lombok | - | Redução de boilerplate |
| Bean Validation | - | Validações de DTO |

---

## 🚀 Deploy em Produção

### 1. Gerar JAR Otimizado

```bash
mvn clean package -DskipTests -Pprod
```

### 2. Configurar Perfil de Produção

Crie `application-prod.properties`:

```properties
# Banco de produção
spring.datasource.url=jdbc:postgresql://db-host:5432/beneficios_prod
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

# JPA - Nunca usar create ou create-drop em produção!
spring.jpa.hibernate.ddl-auto=validate

# Desabilitar logs SQL
spring.jpa.show-sql=false

# Security
spring.security.user.password=${ADMIN_PASSWORD}

# Swagger - Desabilitar em produção se necessário
springdoc.swagger-ui.enabled=false
```

### 3. Executar em Produção

```bash
java -jar -Dspring.profiles.active=prod target/backend-module-0.0.1-SNAPSHOT.jar
```

### 4. Usar Systemd (Linux)

Crie `/etc/systemd/system/beneficios.service`:

```ini
[Unit]
Description=Sistema de Gestão de Benefícios
After=network.target

[Service]
Type=simple
User=appuser
WorkingDirectory=/opt/beneficios
ExecStart=/usr/bin/java -jar -Dspring.profiles.active=prod /opt/beneficios/backend-module.jar
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Ativar:
```bash
sudo systemctl daemon-reload
sudo systemctl enable beneficios
sudo systemctl start beneficios
```

---

## 🔒 Segurança

### Recomendações para Produção

1. **Nunca exponha credenciais no código**
    - Use variáveis de ambiente ou cofres de segredos

2. **Configure HTTPS**
   ```properties
   server.ssl.enabled=true
   server.ssl.key-store=classpath:keystore.p12
   server.ssl.key-store-password=${KEYSTORE_PASSWORD}
   ```

3. **Implemente JWT ou OAuth2**
    - HTTP Basic é apenas para desenvolvimento

4. **Configure CORS adequadamente**
   ```java
   @Configuration
   public class WebConfig {
       @Bean
       public WebMvcConfigurer corsConfigurer() {
           return new WebMvcConfigurer() {
               @Override
               public void addCorsMappings(CorsRegistry registry) {
                   registry.addMapping("/api/**")
                           .allowedOrigins("https://seu-frontend.com")
                           .allowedMethods("GET", "POST", "PUT", "DELETE");
               }
           };
       }
   }
   ```

5. **Rate Limiting**
    - Use Spring Cloud Gateway ou Bucket4j

---

## 📞 Suporte e Contribuição

Para reportar bugs ou sugerir melhorias:
- Abra uma **Issue** no repositório
- Envie um **Pull Request** com suas alterações

### Padrões de Commit

```
feat: adiciona novo endpoint de relatórios
fix: corrige validação de valor negativo
docs: atualiza README com novos endpoints
test: adiciona testes para BeneficioService
refactor: melhora estrutura do controller
```

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👥 Desenvolvido por

**Matheus Rondon Rudolf**
- Desenvolvedor Backend Java
- [LinkedIn](https://www.linkedin.com/in/matheus-rondon-rudolf-733a5b116)
- [GitHub](https://github.com/matheusrudolf)

---

## 🎯 Roadmap

- [ ] Implementar autenticação JWT
- [ ] Adicionar auditoria de operações
- [ ] Criar relatórios em PDF/Excel
- [ ] Implementar cache com Redis
- [ ] Dockerizar a aplicação
- [ ] CI/CD com deploy automático

---

## 📖 Referências

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Swagger/OpenAPI](https://swagger.io/specification/)

---

**Última atualização:** Novembro 2025