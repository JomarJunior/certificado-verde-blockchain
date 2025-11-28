# 📗 Certificado Verde Blockchain - CVB

Este trabalho é apresentado como requisito parcial para aprovação na disciplina de **Engenharias e Sociedades** da ementa comum dos cursos de *Engenharia* da **Universidade Federal do Rio de Janeiro (UFRJ)**.

## 👨‍💻 Autores

> **Jomar Júnior de Souza Pereira** \[[GitHub](https://github.com/JomarJunior)\] \
> *Engenharia Eletrônica e de Computação* \
> *<jomarjunior@poli.ufrj.br>*
---
> **Manuella Andrade de Oliveira** \
> *Engenharia Eletrônica e de Computação* \
> *<Manuella.oliveira@poli.ufrj.br>*
---
> **Nichollas Marques** \[{GitHub}\] \
> *{Curso}*
---
> **Vitor Silva Toledo** \[{GitHub}\] \
> *{Curso}*
---

## 🗃️ Proposta

Veja a proposta completa do projeto em: [docs/proposta.md](./docs/proposta.md)

## 📄 Descrição do Projeto

O **Certificado Verde Blockchain (CVB)** é um sistema inovador projetado para garantir a autenticidade e rastreabilidade de certificados relacionados ao extrativismo legal, utilizando a tecnologia blockchain. O sistema visa combater fraudes e aumentar a transparência na cadeia produtiva de recursos florestais, como madeira, castanhas e óleos vegetais.

O CVB permite a emissão, armazenamento e monitoramento de certificados verdes de forma imutável e auditável. Cada etapa do ciclo do produto é registrada na blockchain, garantindo que os dados não possam ser alterados posteriormente. Isso facilita auditorias independentes e fortalece a confiança entre os atores envolvidos na cadeia produtiva.

## 🛠️ Tecnologias Utilizadas

- 🔗 **Blockchain**: Utilizada para garantir a imutabilidade e transparência dos certificados.
- 💠 **Solidity**: Linguagem de programação para desenvolvimento de contratos inteligentes na blockchain Ethereum.
- 🧢 **Hardhat**: Ambiente de desenvolvimento para compilar, testar e implantar contratos inteligentes.
- 🐳 **Docker**: Plataforma para criar, implantar e gerenciar containers, facilitando o desenvolvimento e a implantação do sistema.
- *🔨 ...Em construção*

## 🏛️ Arquitetura do Sistema

A arquitetura do CVB é composta por três componentes principais:

### 1. 🖥️ Frontend

O frontend é uma aplicação web que permite aos usuários interagir com o sistema. Ele oferece funcionalidades para emissão, consulta e verificação de certificados verdes. A interface é intuitiva e facilita o acesso às informações armazenadas na blockchain.

#### 📚 Stack Tecnológico

- ⚛️ **React.js**: Biblioteca JavaScript para construção de interfaces de usuário.
- 🎨 **Material UI**: Biblioteca de componentes React para design de interfaces modernas e responsivas.
- ⚡ **Vite**: Ferramenta de build rápida para projetos web modernos.
- 🏷️ **TypeScript**: Linguagem de programação que adiciona tipagem estática ao JavaScript.
- 🐞 **ESLint**: Ferramenta para identificar e corrigir problemas no código JavaScript/TypeScript.
- 🔐 **Keycloak.js**: Biblioteca para integração de autenticação e autorização com Keycloak.
- 🌐 **Axios.js**: Biblioteca para realizar requisições HTTP.

### 2. ⚙️ Backend

O backend é responsável por gerenciar a lógica de negócios do sistema, incluindo a interação com a blockchain e o banco de dados. Ele expõe uma API RESTful para o frontend consumir e é estruturado de forma limpa e escalável, seguindo práticas de DDD (Domain-Driven Design), TDD (Test-Driven Development), SOLID e Arquitetura Hexagonal.

#### 📚 Stack Tecnológico

- 🐍 **Python 3.10**: Linguagem de programação utilizada para desenvolver a lógica do backend.
- 🚀 **FastAPI + Uvicorn**: Framework ASGI para criar APIs rápidas e performáticas, com servidor de desenvolvimento leve.
- 📦 **Pydantic**: Validação e serialização de dados por meio de modelos fortemente tipados.
- 🤝 **miraveja-di**, 📝 **miraveja-log**, 🔐 **miraveja-authentication**: Bibliotecas pessoais para injeção de dependência, logging estruturado e gerenciamento de autenticação/autorização.
- 🧪 **pytest**: Framework de testes unitários e de integração, facilitando TDD.
- 🧹 **pylint**: Ferramenta de linting para garantir qualidade e padronização do código.
- 🎨 **black**: Formatador de código para manter estilo consistente em todo o projeto.
- 🔁 **pre-commit**: Hooks para automatizar verificações e formatação antes dos commits.
- 🔄 **GitHub Actions CI**: Pipelines de Integração Contínua para testes, lint e deploy automatizados.
- 🗄️ **SQLAlchemy + Alembic**: ORM para modelagem de dados e Alembic para versionamento e migrações do schema.

### 3. 🔗 Blockchain

A camada de blockchain é responsável pela emissão, registro e validação dos certificados verdes, garantindo a imutabilidade e transparência dos dados.

#### 📚 Stack Tecnológico

- 💠 **Solidity Smart Contracts**: Contratos inteligentes desenvolvidos em Solidity para a rede Ethereum.
- 🧢 **Hardhat Blockchain**: Ambiente de desenvolvimento, teste e deploy de contratos inteligentes.
- 🚀 **Ignition Deploy**: Ferramenta para automação do deploy dos contratos na blockchain.

### 🏭 4. Infraestrutura

A infraestrutura do CVB é composta por serviços e ferramentas que suportam o desenvolvimento, implantação e operação do sistema, garantindo escalabilidade, segurança e alta disponibilidade.

#### 📚 Stack Tecnológico

- 🐳 **Docker**: Plataforma para criar, implantar e gerenciar containers, facilitando o desenvolvimento e a implantação do sistema.
- 🐘 **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional utilizado para armazenar dados persistentes do sistema.
- 🔐 **Keycloak**: Sistema de gerenciamento de identidade e acesso para autenticação e autorização.
- ↔️ **Traefik**: Proxy reverso e balanceador de carga para gerenciar o tráfego de rede entre os serviços.

## 🗂️ Estrutura de Diretórios

O projeto será desenvolvido seguindo a abordagem de repositório único (*monorepo*) para facilitar a gestão e integração dos diferentes componentes do sistema. A estrutura de diretórios confere separação correta de responsabilidades e facilita a manutenção e escalabilidade do sistema.

```bash
certificado-verde-blockchain/   # Diretório principal e raíz do repositório
├── README.md                   # Documentação principal do projeto (📍 Você está aqui)
├── .gitignore                  # Especifica arquivos e pastas que o Git deve ignorar
├── docker-compose.yml          # Define e executa aplicações Docker multi-contêiner
│
├── blockchain/                 # 🔗 Diretório relacionado à implementação dos contratos (on-chain)
├── backend/                    # ⚙️ Diretório relacionado à implementação do backend (off-chain)
└── frontend/                   # 🖥️ Diretório relacionado à implementação do frontend
.
.
.
🛠️ Em construção ...
```

Em cada um dos módulos do projeto há arquivos `README.md` que detalham a implementação específica daquele módulo:

[🔗 Blockchain](blockchain/README.md) \
[⚙️ Backend](backend/README.md) \
[🖥️ Frontend](frontend/README.md)

## 🚀 Como Executar o Projeto

Todos os módulos do projeto seguem o padrão de desenvolvimento e execução em containers Docker, facilitando a portabilidade e garantindo um ambiente consistente para desenvolvimento, testes e produção.

### ▶️ Rodar localmente

```bash
docker-compose up -d
```

> Após iniciar os containers, você pode acessar os serviços através das portas configuradas no arquivo `docker-compose.yml`. Por padrão, o cliente frontend deve estar disponível em: \
**<http://localhost:8080/certificado-verde-blockchain>**

### ⏹️ Parar a execução

```bash
docker-compose down
```

## 📊 Atual estado de desenvolvimento

O certificado verde blockchain é desenvolvido para apresentação na disciplina de **Engenharias e Sociedades** do segundo semestre do ano de 2025. Seu desenvolvimento é esperado para manter as datas de entrega da disciplina e, após a apresentação, o repositório será mantido mas seu desenvolvimento será interrompido.

### 🛣️ Roadmap

#### ❇️ Emissão de Certificado Verde Blockchain

- 🚧 Interface simples para cadastro
- 🚧 Modelo padronizado de dados
- 🚧 Registro `hash` no blockchain

#### 🥸 Consulta Pública

- 🚧 Página de verificação do certificado
- 🚧 Prova criptográfica do documento

#### 👮 Auditoria Básica

- 🚧 Histórico imutável
- 🚧 Lista de alterações
- 🚧 Logs de quem emitiu e quando

## 📃 Licença

Este projeto está licensiado sob a Licensa MIT

## 🗣️ Glossário

Este glossário adota a prática de linguagem ubíqua (ubiquitous language): termos do domínio são definidos de forma consistente e compartilhada entre documentação, equipe e código para reduzir ambiguidades:

- **Certificado Verde (CVB)** — *Green Certificate (GVC)* — Documento digital que comprova origem legal e características de um lote de produto florestal.
- **Emissão** — *Issuance* — Ato de criar e registrar um Certificado Verde no sistema.
- **Emitente** — *Issuer* — Entidade autorizada a emitir certificados (empresa, órgão fiscalizador ou agente credenciado).
- **Produtor** — *Producer* — Pessoa ou organização responsável pela cadeia produtiva do recurso (ex.: extrativista, fazenda).
- **Auditor** — *Auditor* — Agente independente que valida conformidade do processo e das informações registradas.
- **Verificador** — *Verifier* — Ferramenta ou usuário que consulta e confirma a validade de um certificado via interface pública.
- **Documento Fonte** — *Source Document* — Arquivo ou registro off‑chain que contém as evidências originais do certificado (notas, fotos, relatórios).
- **Hash** — *Hash (cryptographic digest)* — Resumo criptográfico do Documento Fonte usado para provar integridade sem expor dados sensíveis.
- **Registro on‑chain** — *On‑chain record* — Entrada imutável na blockchain que liga um certificado ao seu hash e metadados essenciais.
- **Transação** — *Transaction* — Operação que grava dados on‑chain (ex.: emissão, transferência, revogação).
- **Contrato Inteligente** — *Smart Contract* — Código on‑chain que implementa regras de emissão, verificação e governança do certificado.
- **Rede / Blockchain** — *Network / Blockchain* — Infraestrutura distribuída que armazena registros imutáveis e executa contratos inteligentes.
- **Lote** — *Batch* — Unidade física ou lógica de produto florestal à qual um certificado se refere.
- **Rastreabilidade** — *Traceability* — Capacidade de seguir a jornada do lote desde origem até destino por meio de registros vinculados.
- **Identidade** — *Identity* — Identificador único (pessoa, organização ou serviço) usado para autenticação e autoria de ações.
- **Autenticação** — *Authentication* — Processo que verifica a identidade de um usuário ou serviço.
- **Autorização / Permissão** — *Authorization / Permission* — Conjunto de regras que define o que uma identidade pode fazer no sistema.
- **Prova Criptográfica** — *Cryptographic Proof* — Evidência baseada em criptografia (hashes, assinaturas) que garante integridade e autoria.
- **Ledger Imutável** — *Immutable Ledger* — Registro distribuído que não permite alteração retroativa dos dados armazenados.
- **Off‑chain** — *Off‑chain* — Dados e processos armazenados fora da blockchain (ex.: documentos, bancos de dados).
- **Metadados** — *Metadata* — Informações descritivas associadas ao certificado (datas, local, espécie, peso).
- **Validação** — *Validation* — Conjunto de verificações (integridade, permissões, regras do contrato) para aceitar um certificado.

Adicionalmente, para garantir compatibilidade com bibliotecas, ferramentas, convenções de mercado e facilitar contribuições externas, o código‑fonte, nomes, comentários e mensagens de commit serão escritos em inglês. Ao mesmo tempo, o documento apresenta equivalentes em português quando necessário, preservando a legibilidade para público local sem comprometer a interoperabilidade técnica.
