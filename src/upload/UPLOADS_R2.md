Migração de uploads para Cloudflare R2

Resumo
- Objetivo: armazenar imagens de produtos em Object Storage (Cloudflare R2) em vez do diretório local `/uploads`.
- Estratégia: permitir envio direto do cliente para R2 ou upload via API. A implementação adicionada prioriza upload via API que grava diretamente no R2 quando as variáveis de ambiente estiverem configuradas.

Variáveis de ambiente (exemplos)
- USE_R2=true                      # (opcional) ativa lógica de upload para R2
- R2_BUCKET=meu-bucket             # nome do bucket R2
- R2_REGION=us-east-1              # região (opcional, padrão us-east-1)
- R2_ENDPOINT=https://<account>.r2.cloudflarestorage.com  # endpoint S3 compatível (opcional)
- R2_ACCESS_KEY_ID=AKIA...        # credenciais
- R2_SECRET_ACCESS_KEY=...        # credenciais
- R2_FORCE_PATH_STYLE=true        # se necessário para o endpoint
- R2_PUBLIC_BASE_URL=https://<account>.r2.dev  # se objetos forem servidos via domínio público

Comportamento implementado
- Se R2_BUCKET estiver definido (ou USE_R2=true), o UploadController fará upload do buffer recebido diretamente para o bucket (chave `<tenantId>/<uuid>.<ext>`).
- Após upload, se R2_PUBLIC_BASE_URL estiver configurada, o controller retornará a URL pública `<R2_PUBLIC_BASE_URL>/<bucket>/<key>`; caso contrário, retornará uma URL assinada (GET) válida por 1 hora.
- Caso R2 não esteja configurado, o sistema mantém o comportamento atual de gravar em `uploads/<tenantId>/` no filesystem.

Como usar
- Deploy: adicionar as variáveis de ambiente ao ambiente de execução (ex.: Docker, Kubernetes Secrets).
- Cliente: continues a usar o endpoint POST /upload/image (nome do campo `file`) — o fluxo permanece o mesmo, mas agora o arquivo será salvo no R2 se configurado.

Melhorias futuras
- Implementar geração de signed upload URLs (PUT) para permitir upload direto do cliente, reduzindo custo/uso da API.
- Adicionar lifecycle rules (expiração/transition) e políticas de bucket via console Cloudflare.
- Implementar processamento assíncrono (webhook/event S3) para gerar thumbnails.

Notas de segurança
- Nunca comitar credenciais em repositório.
- Usar roles/secrets seguros e rotacionar chaves periodicamente.
