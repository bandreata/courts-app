# Aplicativo de Diários de Justiça e Intimação Eletrônica

Este é um projeto [Next.js](https://nextjs.org) configurado para gerar uma versão estática que pode ser instalada em qualquer servidor web sem depender do NPM.

## Desenvolvimento

Para executar o servidor de desenvolvimento:

```bash
npm run dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000).

## Gerando a versão estática

Para gerar uma versão estática do site que pode ser hospedada em qualquer servidor web:

```bash
npm run export
```

Isso irá criar uma pasta `out` com todos os arquivos estáticos necessários para hospedar o site.

## Instalando em um site externo

Após gerar a versão estática, siga os passos abaixo para instalar o site em um servidor externo:

### Opção 1: Upload direto para o servidor

1. Copie todo o conteúdo da pasta `out` para o diretório do seu servidor web (ex: pasta raíz do Apache, Nginx, etc.)
2. Nenhuma configuração adicional é necessária, já que todos os arquivos são estáticos (HTML, CSS, JavaScript).

### Opção 2: Hospedar em um subdiretório

Se você precisa hospedar o site em um subdiretório (ex: `seu-site.com/intimacao/`), faça as seguintes alterações:

1. Edite o arquivo `next.config.js` e descomente a linha `basePath`:

```js
basePath: '/intimacao', // Substitua pelo seu subdiretório
```

2. Execute novamente o comando `npm run export`
3. Copie o conteúdo da pasta `out` para o subdiretório correspondente no seu servidor

### Requisitos do servidor

- Qualquer servidor web básico (Apache, Nginx, IIS, etc.)
- Não é necessário Node.js ou qualquer runtime no servidor
- Certifique-se de que o arquivo `courts.json` esteja na pasta `/courts.json` relativa à raiz do site

### Atualizações

Para atualizar o site, simplesmente gere uma nova versão estática e substitua os arquivos no servidor.

