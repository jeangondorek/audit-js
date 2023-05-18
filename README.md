# Confere se existem testes na collection do postman para a documentação do swagger

Essa função em js tem como objetivo fazer a conferencia de se todas as rotas presentes no swagger estão testadas pela collection do postman, que é utilizada pelos testes do newman.

A aplicação é capaz de ler o arquivo como sendo `swagger.yaml` ou `swagger.json`.

A collection do postman deve ser `collection.json`, e deve ser importada diretamente do postman.

Existem alguns requisitos para que a operação funcione.

- Os arquivos devem estar no mesmo repositório.
- Na montagem dos testes no postman os paramentros {id} devem ser definidos como variáveis dentro do postman. Ex: ```{{baseUrl}}/pessoas/{{id}}```

## Use case

Ele utiliza para base de comparação 3 informações, sendo elas obrigatórias, a descrição da rota, o path e o metodo.

Ao rodar o teste caso existam rotas documentadas que não tem os testes do postman ele irá gerar um arquivo `missing_routes.txt` com a rota e o metodo que não foi testado e a menssagem `Foram encontradas rotas ausentes. Detalhes no arquivo missing_routes.txt.` no console.

Caso contrário ira exibir a menssagem `Todas as rotas do Swagger estão presentes na coleção do Postman.` no console.

## Dependencias

Existem 2 pacotes do node que devem estar instalados

- `npm i fs js-yaml`

## Rodando o teste

Para rodar o teste use o node para rodar o seu arquivo que deve ter extensão .js: 

 ```bash
 node audit.js
 ```
