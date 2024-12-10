<h1 align="center" style="font-weight: bold;">Fórum com Sistema de Notificações 💻</h1>

<p align="center">
 <a href="#tech">Tecnologias</a> • 
 <a href="#arch">Arquitetura</a> • 
 <a href="#diagram">Diagrama</a> • 
  <a href="#tests">Testes</a> • 
 <a href="#config">Configuração</a> • 
 <a href="#functions">Funcionalidades</a> • 
 <a href="#license">Licensa</a> • 
</p>

<p align="center">
    <b>Este projeto é uma API de fórum que permite aos usuários criar, editar e deletar perguntas e respostas, além de comentar em perguntas e respostas, adicionar anexos e também escolher a melhor resposta de uma pergunta. A aplicação também possui um sistema de notificações para alertar os usuários sobre atividades relevantes.</b>
</p>

<h2 id="tech">🛠️ Tecnologias</h2>

- 🌟 **NestJS**
- 🐳 **Docker**
- 📜 **Prisma**
- 🐘 **PostgreSQL**
- 🚀 **Redis**
- 🔑 **JWT**
- 📏 **ZOD**
- ☁️ **AWS S3**
- 🧪 **Vitest**
- E muito mais...

<h2 id="arch">📐 Arquitetura e Design de Software</h2>

- Clean Architecture
- Domain-driven Design (DDD)
- SOLID
- Design Patterns: Repository Pattern, Factory Pattern.
  
<h2 id="diagram">📊 Diagrama do Projeto</h2>

![diagrama](/src/utils/diagram.jpg)

<h2 id="tests">🧪 Testes Unitários </h2>

![testesUnitários](/src/utils/testes-unitarios.png)

<h2 id="">🧪 Testes E2E </h2>

![testese2e](/src/utils/testes-2e2.png)

<h2 id="config">⚙️ Configuração do Ambiente</h2>

1. **Clone o Repositório**:
   ```bash
   git clone git@github.com:jeanmbiz/nest-forum-api.git
   ```

2. **Crie o Banco de dados e Configure as Variáveis de ambiente**:
   - Configure as variáveis de ambiente no arquivo `.env` e `.env.test.local` utilizando os arquivos `.env.example` e `.env.test.local` como base para preencher as credenciais necessárias.

3. **Suba Dependências Docker**:
   ```bash
   docker compose up -d
   ```

4. **Instale as Dependências do Projeto**:
   ```bash
   npm install
   ```

5. **Execute as Migrações**:
   ```bash
   npx prisma migrate dev
   ```

6. **Iniciar a Aplicação**:
   ```bash
   npm run start:dev
   ```

7. **Executar Testes Unitários**:
   ```bash
   npm run test
   ```

8. **Executar Testes e2e**:
   ```bash
   npm run test:e2e
   ```

<h2 id="functions">✨ Funcionalidades Principais</h2>

1. **Gerenciamento de Perguntas e Respostas**:
   - Criar, editar e deletar perguntas.
   - Criar, editar e deletar respostas.
   - Escolher a melhor resposta para uma pergunta.

2. **Comentários**:
   - Comentar em perguntas e respostas.
   - Deletar comentários, com verificação de permissão.

3. **Notificações**:
   - Enviar notificações para usuários sobre atividades relevantes.
   - Marcar notificações como lidas.

4. **Anexos**:
   - Upload e gerenciamento de anexos para perguntas e respostas.
   - Validação de tipo e tamanho de arquivo.

5. **Autenticação e Autorização**:
   - Registro e autenticação de usuários.
   - Verificação de permissões para ações específicas.
  
<h2 id="license">📃 Licença</h2>

Este projeto está sob a licença [MIT](/LICENSE) license