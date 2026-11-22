# English Trainer — versão web

Aplicativo web responsivo para prática de inglês intermediário.

## Recursos
- Conversação e correção com IA.
- Correção de escrita com explicações em português.
- Leitura de frases em inglês pelo navegador.
- Ditado por voz usando o reconhecimento de fala do navegador.
- Vocabulário inicial de situações cotidianas e manutenção industrial.

## Requisitos
- Node.js 18 ou superior.
- Uma chave de API da OpenAI para habilitar correções inteligentes.
- Navegador atualizado. O reconhecimento de fala costuma funcionar melhor no Chrome/Edge e exige HTTPS quando publicado.

## Executar no computador
1. Extraia o ZIP.
2. Abra a pasta no terminal.
3. Execute `npm install`.
4. Copie `.env.example` para `.env`.
5. Coloque sua chave em `OPENAI_API_KEY` no arquivo `.env`. Não compartilhe essa chave e não a coloque no código do navegador.
6. Execute `npm start`.
7. Abra `http://localhost:3000`.

## Publicar na internet
Publique o projeto em um serviço de hospedagem que aceite Node.js (por exemplo, Render ou Railway). Configure as variáveis `OPENAI_API_KEY` e `OPENAI_MODEL` no painel seguro do serviço. O comando de inicialização é `npm start`.

A chave da API pode gerar custos conforme o uso e deve ser configurada e administrada por um adulto responsável. Não coloque a chave em mensagens, no HTML ou no JavaScript do navegador.

## Observações
- A correção por IA só funciona depois que o servidor recebe uma chave válida.
- A função de voz depende do suporte do navegador, da permissão do microfone e de uma conexão segura (HTTPS).
- O reconhecimento transforma fala em texto; não é uma medição acústica profissional da pronúncia.
- O histórico não é salvo em servidor nesta versão.


## Instalar no Android como aplicativo
Este projeto agora também é um PWA (aplicativo web instalável). Não é um APK nativo.
1. Publique o site em uma hospedagem HTTPS.
2. Abra o endereço publicado no Google Chrome do Android.
3. Toque no menu ⋮ e escolha **Instalar app** ou **Adicionar à tela inicial**.
4. Confirme. O ícone English Trainer aparecerá na tela inicial e abrirá em janela própria.

O recurso de instalação depende de HTTPS e de suporte do navegador. Para gerar um APK nativo, será necessário compilar um projeto Android separado.
