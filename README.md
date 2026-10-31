# watch-live

Player de TV ao vivo em página única, pronto para a Vercel, mais uma ferramenta
local que fecha o anúncio do embed sozinha.

## Estrutura

```
public/index.html   site estático (é isso que a Vercel publica)
tools/watch.js      ferramenta local (Playwright) que clica no ✕ do anúncio
assistir.bat        atalho Windows para rodar a ferramenta local
vercel.json         config da Vercel (serve a pasta public/)
```

## Deploy na Vercel

Opção 1, pelo site: importe o repositório em vercel.com/new. Framework
"Other", sem build. Output Directory já vem do `vercel.json`.

Opção 2, pelo terminal:

```
npm i -g vercel
vercel login
vercel --prod
```

## Fechar o anúncio automaticamente

O anúncio nasce dentro do iframe do embed (outro domínio), então nenhuma página
hospedada consegue tocá-lo. A ferramenta `tools/watch.js` abre o Chrome na sua
máquina e clica no ✕ sempre que o modal aparece. Precisa de Node e Chrome
instalados.

```
npm install
npx playwright install chromium   # só na primeira vez
assistir.bat https://seu-projeto.vercel.app
```

Sem argumento, `assistir.bat` abre o `public/index.html` local.
