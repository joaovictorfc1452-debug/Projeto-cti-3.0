# Planta Elétrica BIM

Ambiente online para projetos elétricos residenciais no método BIM. Você desenha a planta uma vez e o programa gera desse mesmo modelo a vista 3D, a previsão de cargas, o quadro de cargas, o diagrama unifilar, a entrada CPFL, o SPDA, a NR-10, a lista de materiais e o relatório técnico.

Normas usadas: ABNT NBR 5410:2004, ABNT NBR 5419:2026, NR-10 e CPFL GED-13 (127/220 V).

## Estrutura do repositório

```
planta-eletrica-bim/
├── index.html              página do programa
├── assets/
│   ├── css/style.css       estilos (tema claro e escuro)
│   ├── js/engine.js        motor de cálculo (normas, circuitos, demanda, SPDA)
│   ├── js/app.js           interface (planta, 3D, abas, relatório, exportação)
│   └── img/favicon.svg     ícone da aba do navegador
├── server.js               servidor para rodar como Web Service no Render
├── package.json            diz ao Render como iniciar o servidor (yarn start)
├── render.yaml             configuração opcional do Render (Blueprint)
├── .gitignore
└── README.md
```

O programa roda todo no navegador. O `server.js` só entrega os arquivos: não tem banco de dados e não usa nenhuma biblioteca externa. Fontes e a biblioteca 3D (three.js r128) vêm de CDN.

## Testar no seu computador

Abra o `index.html` com dois cliques no Chrome ou no Edge. Para rodar como no Render, com o Node instalado:

```
npm start
```

e acesse `http://localhost:3000`.

## Publicar no GitHub

**Pelo site do GitHub (sem instalar nada):**

1. Em github.com, clique em **New repository**. Nome sugerido: `planta-eletrica-bim`. Deixe **Public** ou **Private** e clique em **Create repository**.
2. Na página do repositório vazio, clique em **uploading an existing file**.
3. Arraste para a janela **o conteúdo** da pasta `planta-eletrica-bim` (o `index.html`, a pasta `assets` e os demais arquivos), não a pasta em si. O `index.html` precisa ficar na raiz do repositório.
4. Clique em **Commit changes**.

**Pelo terminal (Git):**

```
cd planta-eletrica-bim
git init
git add .
git commit -m "Planta Elétrica BIM"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/planta-eletrica-bim.git
git push -u origin main
```

## Publicar no Render (Web Service)

1. Em dashboard.render.com, clique em **New → Web Service**.
2. Conecte sua conta do GitHub e escolha o repositório `planta-eletrica-bim`.
3. Preencha:
   - **Name:** `planta-eletrica-bim` (vira o endereço `planta-eletrica-bim.onrender.com`)
   - **Language / Runtime:** `Node`
   - **Branch:** `main`
   - **Root Directory:** deixe vazio
   - **Build Command:** `yarn`
   - **Start Command:** `yarn start`
   - **Instance Type:** Free
4. Opcional: em **Advanced → Health Check Path**, escreva `/healthz`.
5. Clique em **Deploy Web Service**. Quando o log mostrar "Planta Elétrica BIM no ar na porta…", o site está pronto.

No plano Free o serviço desliga depois de um tempo sem acessos; o primeiro acesso seguinte demora cerca de um minuto para abrir.

Alternativas: **New → Blueprint** lê o `render.yaml` e cria o mesmo Web Service. Como o programa também funciona como site estático, dá para usar **New → Static Site** (Build Command em branco, Publish Directory `.`) ou o GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root).

A cada novo commit na branch `main`, o Render publica a versão nova sozinho.

## Onde ficam os projetos

Os projetos são salvos no navegador de quem usa o site (armazenamento local). Cada pessoa vê só os próprios projetos, e nada vai para o servidor. Por isso:

- Projetos não passam de um computador para outro sozinhos. Use **Exportar → Projeto BIM (.json)** e depois **Projetos → Importar .json**.
- Limpar os dados do navegador apaga os projetos dele. Exporte o .json ao fim de cada etapa importante.

## Atualizar o programa

Substitua os arquivos alterados no GitHub (**Add file → Upload files**, ou `git add`, `git commit` e `git push`). O Render publica a mudança em seguida. Os projetos salvos nos navegadores continuam lá.

## Limites e responsabilidade técnica

- Ambientes retangulares, um quadro por projeto, sistema 127/220 V.
- Iluminação pela carga mínima da NBR 5410, sem cálculo luminotécnico.
- Não calcula corrente de curto-circuito.
- O SPDA é uma pré-avaliação do risco R1; a análise formal segue a NBR 5419-2:2026.
- Os disjuntores da Tabela 1A foram conferidos na GED-13 v2.24; confirme na revisão vigente antes do pedido de ligação.

O programa é uma ferramenta de apoio. O projeto final precisa da revisão e da ART de um profissional habilitado.
