// CommonJS => const http = require('http');
// ESModule

// Query Parameters: URL Stateful => Filtros, paginação, busca
// http://localhost:3333/users?userId=1&name=Luana
// Não deve ser usado para dados sensíveis

// Route Parameters: Identificação de recurso
// GET http://localhost:3333/users/1 fica subentendida a intenção de puxar usuário de id 1
// Não deve ser usado para dados sensíveis

// Request Body: envio de informação de um formulário
// Usam protocolo HTTPs -> maior segurança

// ---------------------------------------------------------
import http from "node:http";
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);

    const { query, ...params } = routeParams.groups;
    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }
  return res.writeHead(404).end();
});

server.listen(3333);
