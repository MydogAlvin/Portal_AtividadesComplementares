# Portal de Atividades Complementares

Este repositório contém o código-fonte e a documentação do Portal de Atividades Complementares, um sistema web desenvolvido como parte do curso de Pós-Graduação em Desenvolvimento Full Stack.

O objetivo principal do projeto é oferecer uma plataforma centralizada para que alunos possam submeter suas atividades complementares e para que a secretaria possa gerenciar e validar essas submissões de forma eficiente.

## 📜 Sumário

* [Funcionalidades](#-funcionalidades)
* [Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [Pré-requisitos](#-pré-requisitos)
* [Instalação e Configuração](#-instalação-e-configuração)
* [Executando a Aplicação](#-executando-a-aplicação)
* [Autores](#-autores)

## ✨ Funcionalidades

* Autenticação de usuários (alunos e secretaria) via integração com Moodle (OAuth2).
* Dashboard para alunos com o status de suas horas complementares.
* Formulário para submissão de novas atividades (certificados, eventos, etc.).
* Painel administrativo para a secretaria visualizar, aprovar ou reprovar atividades.
* Notificações sobre o status das submissões.

## 💻 Tecnologias Utilizadas

A aplicação foi construída com as seguintes tecnologias:

* **Back-End:** `Node.js` com o framework `Express.js`.
* **View Engine:** `Handlebars` para renderização de páginas HTML dinâmicas.
* **Banco de Dados:** `MySQL` para persistência e armazenamento dos dados.
* **Comunicação:** A navegação é servida diretamente pelo back-end no padrão MVC (Model-View-Controller).

## 🛠️ Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
* [Git](https.git-scm.com)
* [Node.js](https.nodejs.org/en/) (que já inclui o `npm`)
* [MySQL Server](https://dev.mysql.com/downloads/mysql/)

## ⚙️ Instalação e Configuração

Siga os passos abaixo para configurar o ambiente de desenvolvimento local.

**1. Clone o repositório:**
```bash
git clone [https://github.com/MydogAlvin/Portal_AtividadesComplementares.git](https://github.com/MydogAlvin/Portal_AtividadesComplementares.git)
cd Portal_AtividadesComplementares
```

**2. Instale as dependências:**
```bash
npm install
```

**3. Configure as Variáveis de Ambiente:**
* Crie um arquivo chamado `.env` na raiz do projeto.
* Use o conteúdo abaixo como modelo e preencha com suas credenciais do banco de dados e as chaves do OAuth2 do Moodle.

```dotenv
# Configuração do Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua-senha-aqui
DB_NAME=atividades_portal

# Credenciais OAuth2 - Moodle
MOODLE_CLIENT_ID=SEU_CLIENT_ID_DO_MOODLE
MOODLE_CLIENT_SECRET=SEU_CLIENT_SECRET_DO_MOODLE
MOODLE_CALLBACK_URL=http://localhost:3000/auth/moodle/callback

# Porta do Servidor
PORT=3000
```

**4. Configure o Banco de Dados:**
* Certifique-se de que seu servidor MySQL está em execução.
* Crie um banco de dados com o mesmo nome que você definiu em `DB_NAME` (ex: `atividades_portal`).
* Execute as migrações ou scripts de criação de tabelas (se houver um comando para isso, adicione aqui. Ex: `npm run db:migrate`).

## 🚀 Executando a Aplicação

**1. Inicie o servidor:**
```bash
# Dentro da pasta do projeto
npm start
```

**2. Acesse a aplicação:**
A aplicação estará acessível em seu navegador no endereço `http://localhost:3000`.

## 👨‍💻 Autores

* **Thiago Siqueira da Silveira** - *Desenvolvimento* - [@MydogAlvin](https://github.com/MydogAlvin)

---