# Auditor de Testes do Swagger no Postman

O Auditor de Testes do Swagger no Postman é uma função em JavaScript que tem como objetivo verificar se todas as rotas presentes no Swagger estão testadas na coleção do Postman, a qual é utilizada para os testes do Newman.

## Funcionalidades

- A aplicação é capaz de ler o arquivo Swagger em formato YAML (`swagger.yaml`) ou JSON (`swagger.json`).
- A coleção do Postman deve estar no formato JSON (`collection.json`) e deve ser importada diretamente do Postman.
- É necessário atender aos seguintes requisitos para que a operação funcione corretamente:
  - Os arquivos devem estar no mesmo repositório.
  - Na montagem dos testes no Postman, os parâmetros `{id}` devem ser definidos como variáveis dentro do Postman. Exemplo: `{{baseUrl}}/pessoas/{{id}}`

## Caso de Uso

A função utiliza três informações como base de comparação, todas obrigatórias: a descrição da rota, o path e o método HTTP.

Ao executar o teste, caso existam rotas documentadas que não tenham testes no Postman, será gerado um arquivo `missing_routes.txt` com a rota e o método que não foram testados. Além disso, será exibida a mensagem "Foram encontradas rotas ausentes. Detalhes no arquivo `missing_routes.txt`." no console.

Por outro lado, se todas as rotas do Swagger estiverem presentes na coleção do Postman, será exibida a mensagem "Todas as rotas do Swagger estão presentes na coleção do Postman." no console.

## Dependências

Para executar o teste, são necessários os seguintes pacotes do Node.js, que devem estar instalados:

```
npm i fs js-yaml
```

## Executando o Teste

Para executar o teste, utilize o Node.js para rodar o arquivo JavaScript com a extensão `.js`:

```bash
node audit.js
```
