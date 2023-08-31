export async function json(req, res) {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }

  // JSON parse irá transformar no objeto legível para o JavaScript
  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch {
    req.body = null;
  }

  res.setHeader("Content-type", "application/json");
}

// Middleware nada mais é que um interceptador;
// É uma função que intercepta a requisição e sempre recebendo os parêmtros req e res.
