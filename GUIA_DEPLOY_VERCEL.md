# 🚀 GUIA COMPLETO - DEPLOY PIXPOC NA VERCEL

---

## ✅ **STATUS: PROJETO PRONTO PARA DEPLOY!**

O PixPoc está 100% configurado para a Vercel com:
- ✅ `vercel.json` configurado
- ✅ Build otimizado para produção
- ✅ Analytics integrado (GA4 + Clarity)
- ✅ Região Brasil (GRU1) configurada
- ✅ Node.js 18 especificado

---

## 🎯 **ESCOLHA SEU MÉTODO:**

---

## 📦 **MÉTODO 1: UPLOAD DIRETO (Mais Rápido - 5 minutos)**

### **Passo 1: Criar Conta Vercel**
1. Acesse: **https://vercel.com**
2. Clique em **"Sign Up"**
3. Escolha uma opção:
   - **GitHub** (recomendado)
   - **GitLab**
   - **Bitbucket**
   - **Email**

### **Passo 2: Baixar o Projeto**
- Se estiver no Figma Make, clique em "Download"
- Salve em uma pasta no seu computador
- Descompacte se necessário

### **Passo 3: Deploy na Vercel**
1. Na dashboard da Vercel, clique **"Add New..."** → **"Project"**
2. Clique na aba **"Import from ZIP"** ou arraste a pasta
3. Configure:
   ```
   Project Name: pixpoc
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
4. Clique em **"Deploy"**
5. ⏱️ Aguarde 2-3 minutos

### **Passo 4: Pronto!**
✅ Seu site estará no ar em: `https://pixpoc.vercel.app`

---

## 🐙 **MÉTODO 2: VIA GITHUB (Recomendado - Deploy Automático)**

### **Passo 1: Criar Repositório no GitHub**
1. Acesse: **https://github.com/new**
2. Nome do repositório: `pixpoc`
3. Descrição: `PixPoc - Sorteio com Balões 3D`
4. Visibilidade: **Private** (recomendado) ou Public
5. Clique em **"Create repository"**

### **Passo 2: Fazer Upload do Código**

**Se você tem Git instalado:**
```bash
# Na pasta do projeto
git init
git add .
git commit -m "Initial commit - PixPoc v1.0"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/pixpoc.git
git push -u origin main
```

**Se NÃO tem Git:**
1. No GitHub, clique em **"uploading an existing file"**
2. Arraste TODOS os arquivos do projeto
3. Commit message: `Initial commit - PixPoc v1.0`
4. Clique em **"Commit changes"**

### **Passo 3: Conectar na Vercel**
1. Na Vercel, clique **"Add New..."** → **"Project"**
2. Clique em **"Import Git Repository"**
3. Autorize o acesso ao GitHub
4. Selecione o repositório **"pixpoc"**
5. Configurações (já detecta automaticamente):
   ```
   Framework Preset: Vite ✅ (auto-detectado)
   Build Command: npm run build ✅
   Output Directory: dist ✅
   Install Command: npm install ✅
   ```
6. **Environment Variables:** (deixe vazio por enquanto)
7. Clique em **"Deploy"**

### **Passo 4: Deploy Automático Configurado!**
✅ Agora toda vez que fizer `git push`, a Vercel atualiza automaticamente!

---

## 🌐 **CONECTAR DOMÍNIO CUSTOMIZADO (pixpoc.com.br)**

### **Passo 1: Comprar Domínio (se ainda não tem)**

**Opção 1: Registro.br** (Recomendado para .com.br)
1. Acesse: **https://registro.br**
2. Busque: `pixpoc.com.br`
3. Se disponível, clique em **"Registrar"**
4. Crie conta e pague (~R$ 40/ano)

**Opção 2: GoDaddy / Hostinger** (Para .com)
1. Acesse o site do registrador
2. Busque: `pixpoc.com`
3. Compre (~R$ 50-60/ano)

### **Passo 2: Adicionar Domínio na Vercel**
1. No projeto na Vercel, clique na aba **"Settings"**
2. No menu lateral, clique em **"Domains"**
3. Digite seu domínio: `pixpoc.com.br` ou `pixpoc.com`
4. Clique em **"Add"**
5. A Vercel vai mostrar os registros DNS necessários

### **Passo 3: Configurar DNS**

**A Vercel vai mostrar algo como:**

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**No painel do Registro.br:**
1. Faça login em **https://registro.br**
2. Clique em **"Meus Domínios"**
3. Clique no domínio `pixpoc.com.br`
4. Clique em **"Editar Zona"** ou **"DNS"**
5. Adicione os registros que a Vercel mostrou:
   - **Tipo:** A | **Nome:** @ | **Valor:** 76.76.21.21
   - **Tipo:** CNAME | **Nome:** www | **Valor:** cname.vercel-dns.com
6. Salve as alterações

### **Passo 4: Aguardar Propagação**
⏱️ **Tempo:** 1-24 horas (geralmente 1-4 horas)

**Testar:**
- `https://pixpoc.com.br` → Deve funcionar
- `https://www.pixpoc.com.br` → Deve funcionar

✅ **SSL/HTTPS:** A Vercel configura automaticamente!

---

## ⚙️ **CONFIGURAÇÕES AVANÇADAS (Opcional)**

### **Variáveis de Ambiente:**
Se no futuro precisar de API keys:
1. Vercel → Settings → Environment Variables
2. Adicione: `VITE_API_KEY=seu_valor_aqui`
3. Redeploy automático

### **Preview Deployments:**
✅ Já configurado! Cada branch no Git terá uma URL de preview

### **Analytics da Vercel:**
Opcional, mas se quiser ativar:
1. Settings → Analytics → Enable
2. **Grátis:** 2.500 eventos/mês
3. **Pago:** $10/mês para 100k eventos

### **Domínios Adicionais:**
Pode adicionar múltiplos domínios:
- `pixpoc.com`
- `pixpoc.com.br`
- `www.pixpoc.com`
- Etc.

---

## 🔧 **COMANDOS ÚTEIS:**

### **Instalar Vercel CLI (Opcional):**
```bash
npm install -g vercel
```

### **Deploy via CLI:**
```bash
vercel
```

### **Deploy em Produção:**
```bash
vercel --prod
```

### **Ver Logs:**
```bash
vercel logs
```

---

## 📊 **PÓS-DEPLOY: VERIFICAR**

### **Checklist:**
- [ ] Site está no ar (vercel.app ou domínio customizado)
- [ ] Todos os balões aparecem corretamente
- [ ] Sons funcionam
- [ ] Banner aparece (se configurado)
- [ ] Configurações salvam no localStorage
- [ ] Analytics está funcionando (F12 → Console → veja eventos)
- [ ] Mobile responsivo
- [ ] HTTPS ativo (cadeado verde)

### **Testar Analytics:**
1. Acesse o site
2. Estoure um balão
3. Abra o Console (F12)
4. Veja: `📊 GA4 Event: balao_estourado`
5. ✅ Se aparecer = Analytics funcionando!

### **Google Analytics (24-48h):**
- https://analytics.google.com
- Propriedade: PixPoc
- Veja: Tempo Real (após algumas visitas)

### **Microsoft Clarity (2-3h):**
- https://clarity.microsoft.com
- Projeto: PixPoc
- Veja: Recordings + Heatmaps

---

## 💰 **CUSTOS:**

```
✅ Vercel Hosting:        R$ 0,00 (grátis)
✅ 100 GB Banda:          R$ 0,00 (grátis)
✅ SSL/HTTPS:             R$ 0,00 (grátis)
✅ CDN Global:            R$ 0,00 (grátis)
✅ Analytics (GA4+Clarity): R$ 0,00 (grátis)
✅ Deploy Ilimitados:     R$ 0,00 (grátis)
──────────────────────────────────────
💰 Domínio .com.br:       R$ 40,00/ano
💰 Domínio .com:          R$ 50,00/ano
──────────────────────────────────────
💰 TOTAL:                 R$ 40-50/ano
```

---

## 🆘 **PROBLEMAS COMUNS:**

### **Erro: "Build Failed"**
- Verifique se `package.json` está correto
- Tente: Settings → Node.js Version → 18.x

### **Erro: "Module not found"**
- Na Vercel: Redeploy
- Ou: Force clean install

### **Site não abre após DNS:**
- Aguarde mais tempo (até 24h)
- Limpe cache do navegador (Ctrl+F5)
- Teste em navegador anônimo

### **Analytics não aparece:**
- Aguarde 24-48h para GA4
- Aguarde 2-3h para Clarity
- Verifique console do navegador (F12)

---

## 🎉 **PRONTO PARA DEPLOY?**

**Escolha um método acima e siga o passo a passo!**

**Dica:** Método 2 (GitHub) é melhor para manutenção futura, mas Método 1 é mais rápido se quiser testar agora.

---

## 📞 **SUPORTE:**

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Discord:** https://vercel.com/discord
- **Status Vercel:** https://vercel-status.com

---

**🚀 Boa sorte com o deploy do PixPoc!**
