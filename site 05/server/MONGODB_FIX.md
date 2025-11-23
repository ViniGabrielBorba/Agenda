# Problema de Conexão com MongoDB Atlas

## Erro Identificado
```
Server selection timeout: No available servers
I/O error: received fatal alert: InternalError
```

## Possíveis Causas e Soluções

### 1. IP não está na Whitelist do MongoDB Atlas
- Acesse: https://cloud.mongodb.com
- Vá em: Network Access
- Adicione seu IP atual ou use `0.0.0.0/0` para permitir todos os IPs (apenas para desenvolvimento)

### 2. String de Conexão Incorreta
A string deve estar no formato:
```
mongodb+srv://usuario:senha@cluster.mongodb.net/nome_do_banco?retryWrites=true&w=majority
```

### 3. Credenciais Incorretas
- Verifique se o usuário e senha estão corretos
- Certifique-se de que o usuário tem permissões no banco

### 4. Problema de Rede/Firewall
- Verifique se não há firewall bloqueando a conexão
- Tente usar uma VPN se estiver em rede restritiva

### 5. Cluster Pausado
- Verifique se o cluster do MongoDB Atlas não está pausado
- Clusters gratuitos podem pausar após inatividade

## Como Verificar a Conexão

1. Acesse o MongoDB Atlas
2. Clique em "Connect" no seu cluster
3. Escolha "Connect your application"
4. Copie a string de conexão
5. Substitua `<password>` pela senha real
6. Substitua `<dbname>` pelo nome do banco (ex: `flowgest`)

## Exemplo de String Correta
```
DATABASE_URL="mongodb+srv://usuario:senha123@cluster.mongodb.net/flowgest?retryWrites=true&w=majority"
```

