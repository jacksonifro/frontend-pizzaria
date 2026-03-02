# Endpoints da API - Sistema de Pizzaria

Este documento lista todos os endpoints implementados no backend, com propriedades, middlewares e exemplos de requisição/resposta.

Observações gerais:
- Autenticação via header `Authorization: Bearer <token>` onde aplicável.
- Middlewares principais: `autenticarTokenUser`, `verificarPerfilAdmin`, `validateSchema(schema)`.
- Campos de pedido/item usam nomes em português: `pedido_id`, `produto_id`, `quantidade`.
- Preços são enviados em centavos (inteiro) como string ou número, conforme o endpoint.

---

## Usuários

### POST /users
- Descrição: Cria um novo usuário.
- Middlewares: `validateSchema(createUserSchema)`
- Body (JSON):
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```
- Resposta Success (201):
```json
{
  "id": "uuid-gerado",
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "ahushuahsuhuhua",
  "perfil": "ADMIN",
  "createdAt": "2025-11-11T10:30:00.000Z"
}
```
- Erros:
  - 400: validação (campos faltando/invalidos)
  - 409: usuário já existe

---

### POST /session
- Descrição: Autentica usuário e retorna token JWT.
- Middlewares: `validateSchema(authUserSchema)`
- Body (JSON):
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```
- Resposta Success (200):
```json
{
  "id": "uuid-do-usuario",
  "name": "João Silva",
  "email": "joao@example.com",
  "token": "eyJhbGciOi..."
}
```
- Erros:
  - 400: validação
  - 401: credenciais inválidas

---

### GET /me
- Descrição: Retorna dados do usuário autenticado.
- Middlewares: `autenticarTokenUser`
- Headers:
```
Authorization: Bearer <token>
```
- Resposta Success (200):
```json
{
  "id": "uuid-do-usuario",
  "name": "João Silva",
  "email": "joao@example.com",
  "perfil": "STAFF"
}
```
- Erros:
  - 401: token ausente ou inválido

---

### PUT /users (opcional)
- Descrição: Edita dados do usuário autenticado.
- Middlewares: `autenticarTokenUser`, `validateSchema(editUserSchema)`
- Body (JSON): campos editáveis (`name`, `email`, `password`)
- Resposta Success (200): usuário atualizado

---

## Categorias

### POST /category
- Descrição: Cria nova categoria (ex: Pizzas Salgadas).
- Middlewares: `autenticarTokenUser`, `verificarPerfilAdmin`, `validateSchema(createCategorySchema)`
- Body (JSON):
```json
{ "name": "Pizzas Doces" }
```
- Resposta Success (201):
```json
{ "id": "uuid-gerado", "name": "Pizzas Doces", "createdAt": "2025-11-11T10:30:00.000Z" }
```
- Erros: 400 validação, 401/403 autorização

---

### GET /category
- Descrição: Lista todas as categorias.
- Middlewares: `autenticarTokenUser`
- Resposta Success (200):
```json
[
  { "id": "uuid-1", "name": "Pizzas Salgadas", "createdAt": "..." },
  { "id": "uuid-2", "name": "Pizzas Doces", "createdAt": "..." }
]
```

---

## Produtos

### POST /product
- Descrição: Cria novo produto com upload de imagem.
- Middlewares: `autenticarTokenUser`, `verificarPerfilAdmin`, `upload.single("file")`, `validateSchema(createProductSchema)`
- Body: FormData (multipart/form-data)
  - `name` (string)
  - `price` (string ou número, em centavos)
  - `description` (string)
  - `category_id` (string UUID)
  - `file` (imagem JPG/JPEG/PNG, max 4MB)
- Exemplo (curl):
```bash
curl -X POST http://localhost:3333/product \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=Pizza Margherita" \
  -F "price=3500" \
  -F "description=Molho de tomate..." \
  -F "category_id=uuid-da-categoria" \
  -F "file=@margherita.jpg"
```
- Resposta Success (200):
```json
{
  "id": "uuid-gerado",
  "name": "Pizza Margherita",
  "price": 3500,
  "description": "Molho de tomate, mussarela e manjericão",
  "category_id": "uuid-da-categoria",
  "banner": "https://res.cloudinary.com/.../products/123.jpg",
  "disabled": false,
  "createdAt": "2025-11-12T10:30:00.000Z"
}
```
- Erros: 400 validação, 401/403 autorização, 415 formato inválido, 413 arquivo grande

---

### GET /products
- Descrição: Lista produtos com filtro `disabled` opcional.
- Middlewares: `autenticarTokenUser`, `validateSchema(listProductSchema)`
- Query params:
  - `disabled` (string) - "true"|"false" opcional
- Exemplo:
```
GET /products?disabled=false
```
- Resposta Success (200): array de produtos (inclui `category`)

---

### GET /category/product
- Descrição: Lista produtos ativos por categoria.
- Middlewares: `autenticarTokenUser`, `validateSchema(listProductByCategorySchema)`
- Query params:
  - `category_id` (string UUID) obrigatório
- Resposta Success (200): array de produtos ativos da categoria

---

### DELETE /product
- Descrição: Desativa (soft delete) um produto.
- Middlewares: `autenticarTokenUser`, `verificarPerfilAdmin`
- Query params:
  - `produto_id` (string UUID) obrigatório
- Resposta Success (200):
```json
{ "message": "Produto deletado/arquivado com sucesso!" }
```

---

### PUT /product (opcional)
- Descrição: Edita produto (campo imagem também suportado via multipart).
- Middlewares: `autenticarTokenUser`, `verificarPerfilAdmin`, `validateSchema(editProductSchema)`
- Body/Multipart: campos editáveis

---

## Pedidos (Pedido)

### POST /order
- Descrição: Cria um novo pedido (rascunho).
- Middlewares: `autenticarTokenUser`, `validateSchema(createOrderSchema)`
- Body (JSON):
```json
{ "table": 5, "name": "Mesa do João" }
```
- Resposta Success (201):
```json
{
  "id": "uuid-gerado",
  "table": 5,
  "status": false,
  "draft": true,
  "name": "Mesa do João",
  "createdAt": "2025-11-12T10:30:00.000Z"
}
```
- Erros: 400 validação

---

### POST /order/add
- Descrição: Adiciona um item (produto) a um pedido existente.
- Middlewares: `autenticarTokenUser`, `validateSchema(createItemSchema)`
- Body (JSON):
```json
{
  "pedido_id": "uuid-do-pedido",
  "produto_id": "uuid-do-produto",
  "quantidade": 2
}
```
- Resposta Success (201):
```json
{
  "id": "uuid-item-gerado",
  "quantidade": 2,
  "pedido_id": "uuid-do-pedido",
  "produto": {
    "id": "uuid-do-produto",
    "nome": "Pizza Margherita",
    "preco": 3500,
    "descricao": "Molho...",
    "imagem": "https://.../margherita.jpg"
  }
}
```
- Erros: 400 validação, 404 pedido/produto não encontrado

---

### DELETE /order/remove
- Descrição: Remove um item do pedido (deleta `pedido_Item`).
- Middlewares: `autenticarTokenUser`, `validateSchema(removeItemSchema)`
- Query params:
  - `item_id` (string UUID) obrigatório
- Resposta Success (200):
```json
{ "message": "Item removido com sucesso" }
```

---

### PUT /order/send
- Descrição: Envia/Confirma o pedido (sai do rascunho).
- Middlewares: `autenticarTokenUser`, `validateSchema(sendOrderSchema)`
- Body (JSON):
```json
{ "pedido_id": "uuid-do-pedido", "name": "Mesa 5 - João" }
```
- Resposta Success (200): pedido com `draft: false`

---

### PUT /order/finish
- Descrição: Finaliza um pedido (status = true).
- Middlewares: `autenticarTokenUser`, `validateSchema(finishOrderSchema)`
- Body (JSON):
```json
{ "pedido_id": "uuid-do-pedido" }
```
- Resposta Success (200): pedido com `status: true`

---

### GET /orders
- Descrição: Lista pedidos, opcional filtro por `draft`.
- Middlewares: `autenticarTokenUser`
- Query params:
  - `draft` (string) -> "true"|"false" (opcional)
- Resposta Success (200): array de pedidos com `items` embutidos

---

### GET /order/detail
- Descrição: Detalhes completos de um pedido específico.
- Middlewares: `autenticarTokenUser`, `validateSchema(detailOrderSchema)`
- Query params:
  - `pedido_id` (string UUID) obrigatório
- Resposta Success (200): objeto com `items` e timestamps

---

### DELETE /order
- Descrição: Deleta permanentemente um pedido e seus itens (cascade).
- Middlewares: `autenticarTokenUser`, `validateSchema(deleteOrderSchema)`
- Query params:
  - `pedido_id` (string UUID) obrigatório
- Resposta Success (200): `{ "message": "Pedido deletado com sucesso!" }`

---

## Itens (Pedido_Item)

> Observação: endpoints de itens já listados em `/order/add` e `/order/remove`.

---

## Middlewares (referência rápida)
- `autenticarTokenUser` — verifica JWT e popula `req.user_id`.
- `verificarPerfilAdmin` — verifica se `req.user_id` corresponde a usuário com `perfil === 'ADMIN'`.
- `validateSchema(schema)` — valida `body`, `query`, `params` com Zod.

---

## Exemplos de uso (curl)

- Criar usuário:
```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@example.com","password":"senha123"}'
```

- Autenticar (obter token):
```bash
curl -X POST http://localhost:3333/session \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"senha123"}'
```

- Criar produto (multipart): exemplo no bloco `POST /product` acima.

---

## Observações finais
- Alguns nomes de campos no código podem variar (`order_id` vs `pedido_id`) — prefira os nomes em português (`pedido_id`, `produto_id`, `quantidade`) conforme os schemas em `src/schemas/`.
- Para detalhes adicionais e exemplos por rota (códigos de erro, casos de borda), consulte o código fonte em `src/controllers/` e `src/services/`.

---

Arquivo gerado automaticamente pelo time de desenvolvimento.
