## Para poder executar o projeto
Acesse `https://nodejs.org/`, baixe e instale no seu computador.

## Para instalar o json-server
Execute no terminal o comando `npm install -g json-server`.

Caso ocorra o erro `npm ERR! request to https://registry.npmjs.org/json-server failed, reason: self signed certificate in certificate chain`, use `npm set strict-ssl false`, depois `npm config set registry http://registry.npmjs.org/` e `npm install -g json-server`.

O json-server é uma biblioteca pra simular um banco de dados com API REST.

## Para executar o projeto
No terminal, dentro da pasta da aplicação execute `npx json-server db.json --port 8000`.

No endereço http://localhost:8000 você terá acesso a uma API REST.

Caso use uma porta diferente da 8000, acesse o arquivo `app.js` e altere o valor de `URL_API` pela porta que esteja usando.

Pronto, agora basta abrir o arquivo `index.html` com seu navegador.