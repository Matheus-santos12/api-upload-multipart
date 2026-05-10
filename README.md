# api-upload-multipart

API REST construída com Fastify e TypeScript para upload e exclusão de arquivos via `multipart/form-data`.

## Tecnologias

- [Fastify](https://fastify.dev/) — framework web
- [@fastify/multipart](https://github.com/fastify/fastify-multipart) — plugin para processar arquivos
- TypeScript
- Node.js (fs, stream, crypto)

## Como rodar

```bash
# Instalar dependências
npm install

# Criar a pasta de uploads
mkdir uploads

# Rodar em modo desenvolvimento
npm run dev
```

O servidor sobe em `http://localhost:3333`.

## Estrutura

```
src/
├── server.ts              # bootstrap do Fastify
├── routes/
│   └── file-routes.ts     # rotas POST e DELETE
└── storage/
    ├── storage.ts         # classe abstrata e tipos
    ├── local-storage.ts   # implementação local (salva em ./uploads)
    └── s3-storage.ts      # implementação S3 (a implementar)
```

## Endpoints

### `POST /upload`

Recebe um arquivo via `multipart/form-data` e salva no storage local.

**Body:** `multipart/form-data` com o campo `file`

**Resposta `201`:**
```json
{
  "id": "b64a92d3-4c9e-408a-a638-409cdf003645",
  "name": "foto.png",
  "size": 0
}
```

**Resposta `400`** — nenhum arquivo enviado:
```json
{
  "message": "Nenhum arquivo enviado"
}
```

---

### `DELETE /upload/:id`

Remove o arquivo do storage pelo `id` retornado no upload.

**Params:** `id` — id do arquivo

**Resposta `204`** — arquivo deletado com sucesso (sem body)

**Resposta `404`** — arquivo não encontrado:
```json
{
  "message": "Arquivo não encontrado"
}
```

## Fluxo

1. Cliente envia `POST /upload` com o arquivo via multipart
2. A API salva o arquivo em `./uploads/` e guarda os metadados em memória
3. Cliente envia `DELETE /upload/:id` com o id retornado
4. A API remove o arquivo do disco e do registro em memória

## Observações

- Os metadados são armazenados em memória — ao reiniciar o servidor os registros são perdidos
- O campo `size` retorna `0` por limitação do multipart (o tamanho não é enviado pelo cliente)
- O suporte a S3 está previsto via `s3-storage.ts` mas ainda não implementado
