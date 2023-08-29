// Streams ->

// process.stdin.pipe(process.stdout);

import { Readable, Writable, Transform } from "node:stream";

class OneToHundreadStream extends Readable {
  index = 1;
  _read() {
    const i = this.index++;

    // Nessa configuração, é possível já obter os dados no terminal mesmo antes da finalização do processo
    // Essa é a chave dos streams

    setTimeout(() => {
      if (i > 100) {
        this.push(null);
      } else {
        const buf = Buffer.from(String(i));
        this.push(buf);
      }
    }, 1000);
  }
}

// A stream de transformação tem que estar no intermédio, para ler informação de um lugar e jogar para outro
class InverseNumberStream extends Transform {
  _transform(chunck, encoding, callback) {
    const transformed = Number(chunck.toString()) * -1;

    // Primeiro parâmetro do callback é um erro que eu posso enviar caso o passo anterior não dê certo
    // Segundo paâmetro será o retorno
    callback(null, Buffer.from(String(transformed)));
  }
}

class MutiplyByTenStream extends Writable {
  // Dentro de uma stream de escrita, não retorna-se nada. Ela apenas processa um dado, não transforma o dado em outra coisa
  _write(chunck, encoding, callback) {
    // o chunck é o que está vindo da stream de leitura
    console.log(Number(chunck.toString()) * 10);
    callback();
  }
}

// new OneToHundreadStream().pipe(process.stdout);

// Estou lendo os dados da stream de leitura e enviando para stream de escrita, que processa esses dados ENQUANTO a leitura ainda está sendo feita
new OneToHundreadStream()
  .pipe(new InverseNumberStream())
  .pipe(new MutiplyByTenStream());
