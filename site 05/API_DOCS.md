# Documentação da API

## Base URL

```
http://localhost:5000/api
```

## Autenticação

A maioria dos endpoints requer autenticação via JWT. Inclua o token no header:

```
Authorization: Bearer <seu_token>
```

## Endpoints

### Autenticação

#### POST /auth/register
Registrar novo usuário

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123",
  "name": "Nome do Usuário",
  "phone": "+5511999999999",
  "role": "CLIENT" // ou "PROFESSIONAL", "ADMIN"
}
```

**Response:**
```json
{
  "message": "Usuário criado com sucesso",
  "user": { ... },
  "token": "jwt_token_aqui"
}
```

#### POST /auth/login
Login com email ou telefone

**Body:**
```json
{
  "email": "usuario@email.com", // ou "phone": "+5511999999999"
  "password": "senha123"
}
```

**Response:**
```json
{
  "message": "Login realizado com sucesso",
  "user": { ... },
  "token": "jwt_token_aqui"
}
```

#### GET /auth/me
Obter usuário atual (requer autenticação)

---

### Usuários

#### GET /users/profile
Obter perfil do usuário autenticado

#### PUT /users/profile
Atualizar perfil

**Body:**
```json
{
  "name": "Novo Nome",
  "phone": "+5511999999999",
  "avatar": "https://..."
}
```

#### PUT /users/password
Alterar senha

**Body:**
```json
{
  "currentPassword": "senha_atual",
  "newPassword": "nova_senha"
}
```

#### GET /users/professionals
Listar profissionais disponíveis

---

### Serviços

#### GET /services
Listar todos os serviços

**Query params:**
- `professionalId` (opcional): Filtrar por profissional

#### GET /services/:id
Obter serviço específico

#### POST /services
Criar serviço (requer: PROFESSIONAL ou ADMIN)

**Body:**
```json
{
  "name": "Corte de Cabelo",
  "description": "Corte moderno",
  "duration": 30,
  "price": 50.00
}
```

#### PUT /services/:id
Atualizar serviço

#### DELETE /services/:id
Desativar serviço (soft delete)

---

### Agendamentos

#### GET /appointments
Listar agendamentos do usuário autenticado

**Query params:**
- `startDate` (opcional): Data inicial
- `endDate` (opcional): Data final
- `status` (opcional): Filtrar por status

#### GET /appointments/:id
Obter agendamento específico

#### POST /appointments
Criar novo agendamento (requer: CLIENT ou ADMIN)

**Body:**
```json
{
  "serviceId": "uuid",
  "professionalId": "uuid",
  "startTime": "2024-01-15T10:00:00Z",
  "notes": "Observações opcionais"
}
```

#### PATCH /appointments/:id/status
Atualizar status do agendamento

**Body:**
```json
{
  "status": "CONFIRMED" // PENDING, CONFIRMED, COMPLETED, CANCELLED
}
```

#### PUT /appointments/:id/reschedule
Reagendar

**Body:**
```json
{
  "startTime": "2024-01-15T14:00:00Z"
}
```

#### GET /appointments/availability/:professionalId
Obter horários disponíveis

**Query params:**
- `date`: Data no formato YYYY-MM-DD
- `serviceId`: ID do serviço

**Response:**
```json
{
  "availableSlots": [
    "2024-01-15T09:00:00Z",
    "2024-01-15T09:30:00Z",
    ...
  ]
}
```

---

### Pagamentos

#### POST /payments/create-intent
Criar intenção de pagamento

**Body:**
```json
{
  "appointmentId": "uuid",
  "method": "CREDIT_CARD" // ou "DEBIT_CARD", "PIX"
}
```

**Response (Cartão):**
```json
{
  "clientSecret": "pi_xxx_secret",
  "paymentId": "uuid"
}
```

**Response (PIX):**
```json
{
  "pixCode": "00020126...",
  "paymentId": "uuid",
  "qrCode": "data:image/png;base64,..."
}
```

#### POST /payments/webhook
Webhook do Stripe (não requer autenticação)

#### POST /payments/confirm-pix
Confirmar pagamento PIX (requer: ADMIN)

**Body:**
```json
{
  "paymentId": "uuid"
}
```

#### GET /payments/:paymentId
Obter status do pagamento

---

### Relatórios

#### GET /reports/popular-services
Serviços mais agendados (requer: PROFESSIONAL ou ADMIN)

**Query params:**
- `startDate` (opcional)
- `endDate` (opcional)

#### GET /reports/revenue
Receita total (requer: PROFESSIONAL ou ADMIN)

**Query params:**
- `startDate` (opcional)
- `endDate` (opcional)

#### GET /reports/recurring-clients
Clientes recorrentes (requer: PROFESSIONAL ou ADMIN)

#### GET /reports/stats
Estatísticas gerais (requer: PROFESSIONAL ou ADMIN)

---

### Horários de Trabalho

#### GET /working-hours
Listar horários de trabalho

**Query params:**
- `professionalId` (opcional): Filtrar por profissional

#### POST /working-hours
Criar/atualizar horário (requer: PROFESSIONAL ou ADMIN)

**Body:**
```json
{
  "dayOfWeek": 1, // 0=Domingo, 1=Segunda, ..., 6=Sábado
  "startTime": "09:00",
  "endTime": "18:00"
}
```

#### DELETE /working-hours/:id
Desativar horário

---

## Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação
- `401` - Não autenticado
- `403` - Acesso negado
- `404` - Não encontrado
- `500` - Erro interno do servidor

## Tratamento de Erros

Todos os erros retornam no formato:

```json
{
  "message": "Mensagem de erro",
  "errors": [ // opcional, para erros de validação
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

