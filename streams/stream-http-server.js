import http from "node:http";
import { Transform } from "node:stream";

class InverseNumberStream extends Transform {
  _transform(chunck, encoding, callback) {
    const transformed = Number(chunck.toString()) * -1;

    console.log(transformed);
    callback(null, Buffer.from(String(transformed)));
  }
}

// req => ReadableStream
// res => WritableStream
const server = http.createServer(async (req, res) => {
  const buffers = [];

  // Esperar a leitura total da stream antes de continuar
  for await (const chunk of req) {
    buffers.push(chunk);
  }

  const fullStreamBody = Buffer.concat(buffers).toString();

  console.log("fullStreamBody", fullStreamBody);

  return res.end(fullStreamBody);
});

server.listen(3334);
