# 🔗 Blockchain - CVB

Este ambiente contém os arquivos e configurações necessários para o desenvolvimento, teste e deploy dos contratos inteligentes relacionados ao Certificado Verde Blockchain (CVB).

## 🗂️ Estrutura de Diretórios

```bash
blockchain/
├── README.md # Documentação do ambiente de blockchain (📍 Você está aqui)
├── Dockerfile # Dockerfile para construir a imagem do ambiente de blockchain
├── package.json # Gerenciador de dependências e scripts para o ambiente de blockchain
├── hardhat.config.js # Configuração do Hardhat para desenvolvimento e deploy dos contratos
│
├── contracts/ # Diretório contendo os contratos inteligentes Solidity
│   └── CertificateRegistry.sol # Contrato inteligente para registro de certificados
│
├── test/ # Diretório contendo os testes dos contratos inteligentes
│   └── CertificateRegistry.test.js # Testes para o contrato CertificateRegistry
│
├── scripts/ # Diretório contendo scripts para deploy e outras operações
│   └── deploy.js # Script para deploy dos contratos inteligentes
│
├── ignition/ # Diretório contendo módulos para integração com Ignition
│   └── modules/ # Diretório contendo módulos específicos para Ignition
│       └── CertRegistry.ts   (opcional, só se quiser Ignition agora) # Módulo para integração com Ignition
│
├── node_modules/ # Diretório contendo dependências instaladas (gerada automaticamente)
└── package-lock.json # Arquivo de bloqueio de dependências (gerado automaticamente)
```

Para navegar para os outros ambientes, utilize um dos links abaixo:

[📗 Certificado Verde Blockchain](../README.md) \
[⚙️ Backend](backend/README.md) \
[🖥️ Frontend](frontend/README.md)

## 📃 Contratos Inteligentes

Abaixo estão os principais contratos inteligentes utilizados neste módulo da aplicação. Cada contrato tem responsabilidades bem definidas e segue práticas modernas de desenvolvimento em Solidity, incluindo versionamento explícito, segurança padrão e facilidade de extensão.

---

### 🏦 `CertificateRegistry.sol` — Registro On-Chain de Certificados

O CertificateRegistry é o contrato responsável por manter o controle mínimo e auditável dos certificados emitidos dentro do sistema. Embora os detalhes completos do certificado permaneçam off-chain, este contrato garante:

- Integridade dos dados (via `dataHash`);
- Auditoria imutável (eventos em cada operação);
- Emissão controlada por uma autoridade confiável;
- Capacidade de verificação pública e independente.

Ele funciona como um registro de certificados, cada um contendo apenas o essencial para verificação e rastreabilidade.

#### 🔧 Estrutura do Certificado

Cada certificado armazenado contém:

- `id`: identificador único incremental;
- `issuer`: endereço que emitiu o certificado;
- `owner`: destinatário ou titular;
- `dataHash`: hash do payload off-chain (IPFS, banco de dados, S3, etc.);
- `timestamp`: momento da emissão;
- `revoked`: indica se o certificado foi revogado.

Essa abordagem mantém o contrato **leve**, **barato** e **escalável**, delegando dados completos para sistemas off-chain enquanto preserva a confiança através da blockchain.

#### 🛡️ Controle de Acesso

A emissão e revogação só podem ser realizadas pelo endereço `admin`, configurado no deploy.
O objetivo é refletir uma autoridade central reguladora ou backend autenticado responsável por validar operações.

\
🔑 **Funções Principais:**
> `issueCertificate(address owner, string dataHash)` \
> *Cria um novo certificado, vinculado a um titular e associado a um hash de dados off-chain.*
---
> `revokeCertificate(uint256 id)` \
> Revoga um certificado previamente emitido.
---
> `getCertificate(uint256 id)` \
> *Retorna todas as informações públicas do certificado.*

\
📡 **Eventos Registrados:**
> `CertificateIssued` \
> Emitido quando um novo certificado é criado — para auditoria de emissão.
---
> `CertificateRevoked` \
> Emitido quando um certificado é revogado — para trilhas de conformidade e governança.

\
🧩 **Quando usar este contrato:**

- Provas de integridade de documentos ou certificados;
- Registro confiável e minimalista;
- Auditoria pública de operações;
- Integração entre backend tradicional e blockchain.

## 👜 Pré-requisitos

### ✅ Recomendado (versões mínimas)

- Node.js >= 16 (preferível LTS 18)
- npm >= 8 ou yarn/pnpm
- Git
- Docker (opcional — para workflows isolados)
- MetaMask (ou outra carteira) para testes de integração front-end
- Conta em provedor RPC (Infura/Alchemy) para deploy em testnets/mainnet (opcional)

## 🛠️ Pacotes e ferramentas do projeto

- Hardhat
- ethers.js
- typescript

## 💾 Instalação rápida

```bash
# instalar dependências do ambiente blockchain
cd blockchain
npm install

# rodar nó local do hardhat
npx hardhat node

# executar testes
npx hardhat test

# deploy local (exemplo)
npx hardhat run --network localhost scripts/deploy.js
```

## 🔎 Links úteis

- Hardhat: <https://hardhat.org>
- ethers.js: <https://docs.ethers.org>
- OpenZeppelin: <https://docs.openzeppelin.com>
