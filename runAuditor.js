const fs = require('fs');
const yaml = require('js-yaml');

function runAuditor() {
  const swaggerFile = fs.existsSync('swagger.json') ? 'swagger.json' : fs.existsSync('swagger.yaml') ? 'swagger.yaml' : null;

  if (!swaggerFile) {
    console.error('Arquivo Swagger (swagger.json ou swagger.yaml) não encontrado.');
    process.exit(1);
  }

  let swaggerData;
  try {
    const fileContent = fs.readFileSync(swaggerFile, 'utf8');

    if (swaggerFile.endsWith('.json')) {
      swaggerData = JSON.parse(fileContent);
    } else if (swaggerFile.endsWith('.yaml') || swaggerFile.endsWith('.yml')) {
      swaggerData = yaml.load(fileContent);
    } else {
      throw new Error('Formato de arquivo Swagger não suportado.');
    }
  } catch (error) {
    console.error('Erro ao carregar o arquivo Swagger:', error);
    process.exit(1);
  }

  const postmanCollection = JSON.parse(fs.readFileSync('collection.json', 'utf8'));
  const swaggerRoutes = extractRoutes(swaggerData);
  const postmanRoutes = extractRoutesp(postmanCollection);
  const missingRoutes = findMissingRoutes(swaggerRoutes, postmanRoutes);

  if (missingRoutes.length > 0) {
    const missingRoutesText = missingRoutes.join('\n');
    fs.writeFileSync('missing_routes.txt', missingRoutesText);
    console.log(`Foram encontradas rotas ausentes. Detalhes no arquivo missing_routes.txt.`);
  } else {
    console.log('Todas as rotas do Swagger estão presentes na coleção do Postman.');
  }

  function extractRoutes(swaggerData) {
    const routes = [];

    for (const route in swaggerData.paths) {
      const methods = Object.keys(swaggerData.paths[route]);
      methods.forEach((method) => {
        const path = route.replace(/^\//, '');
        const description = swaggerData.paths[route][method].description || '';
        routes.push({ path, method: method.toUpperCase(), description });
      });
    }

    return routes;
  }

  function extractRoutesp(postmanCollection) {
    const routes = [];
    const items = postmanCollection.item;

    function extractRoutesFromItems(items) {
      items.forEach((item) => {
        if (item.request && item.request.method && item.request.description && item.request.url.path) {
          const path = item.request.url.path.join('/');
          const method = item.request.method.toUpperCase();
          const description = item.request.description;
          const pathWithoutBrackets = path.replace(/\{([^{}]+)\}/, '$1');
          routes.push({ path: pathWithoutBrackets, method, description });
        }

        if (item.item) {
          extractRoutesFromItems(item.item);
        }
      });
    }

    extractRoutesFromItems(items);

    return routes;
  }

  function findMissingRoutes(swaggerRoutes, postmanRoutes) {
    const missingRoutes = [];

    swaggerRoutes.forEach((swaggerRoute) => {
      const matchingRoutes = postmanRoutes.filter((postmanRoute) => {
        return (
          postmanRoute.path === swaggerRoute.path &&
          postmanRoute.description === swaggerRoute.description &&
          postmanRoute.method === swaggerRoute.method
        );
      });

      if (matchingRoutes.length === 0) {
        missingRoutes.push(`${swaggerRoute.method} ${swaggerRoute.path}`);
      }
    });

    return missingRoutes;
  }
}

