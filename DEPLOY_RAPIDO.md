# ⚡ DEPLOY RÁPIDO - PIXPOC NA VERCEL

## 🚀 **MÉTODO 1: UPLOAD DIRETO (5 MINUTOS)**

### **Passo 1: Conta Vercel**

1. 🌐 https://vercel.com → **"Sign Up"**
2. Escolha: **GitHub** (recomendado) ou Email
3. ✅ Conta criada!

### **Passo 2: Deploy**

1. Na Vercel: **"Add New..."** → **"Project"**
2. **Arraste a pasta do projeto** ou faça upload
3. Configurações:
   - Framework: **Vite** ✅ (auto-detectado)
   - Build Command: `npm run build` ✅
   - Output Directory: `dist` ✅
4. Clique: **"Deploy"**
5. ⏱️ Aguarde 2-3 minutos

### **Resultado:**

✅ Site no ar: `https://pixpoc.vercel.app`

---

## 🐙 **MÉTODO 2: VIA GITHUB (DEPLOY AUTOMÁTICO)**

### **Passo 1: GitHub**

1. 🌐 https://github.com/new
2. Nome: `pixpoc`
3. Visibilidade: **Private** (recomendado)
4. **Create repository**

### **Passo 2: Upload Código**

```bash
git init
git add .
git commit -m "Initial commit - PixPoc"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/pixpoc.git
git push -u origin main
```

### **Passo 3: Conectar Vercel**

1. Vercel: **"Add New..."** → **"Project"**
2. **"Import Git Repository"**
3. Autorize o GitHub
4. Selecione: **pixpoc**
5. Clique: **"Deploy"**

### **Resultado:**

✅ Deploy automático a cada commit no GitHub!

---

## 🌐 **CONECTAR DOMÍNIO (pixpoc.com.br)**

### **Passo 1: Adicionar na Vercel**

1. Projeto → **Settings** → **Domains**
2. Digite: `pixpoc.com.br`
3. Clique: **"Add"**
4. Copie os registros DNS mostrados

### **Passo 2: Configurar DNS**

No Registro.br (ou seu registrador):

```
Tipo: A
Nome: @
Valor: 76.76.21.21

Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
```

### **Passo 3: Aguardar**

⏱️ 1-24 horas (geralmente 2-4 horas)

✅ **SSL automático** pela Vercel!

---

## 📊 **VERIFICAR SE ESTÁ FUNCIONANDO**

### **1. Site no ar?**

✅ Acesse: `https://pixpoc.vercel.app`

### **2. Analytics funcionando?**

1. Abra o site
2. Pressione **F12** (DevTools)
3. Vá na aba **Console**
4. Estoure um balão
5. Veja: `📊 GA4 Event: balao_estourado`
6. ✅ Se aparecer = está funcionando!

### **3. Todos os recursos OK?**

- [ ] Balões aparecem
- [ ] Sons funcionam
- [ ] Banner aparece (se configurado)
- [ ] Sorteio funciona
- [ ] Modal de ganhador abre
- [ ] Mobile responsivo

---

## 💰 **CUSTOS FINAIS**

```
✅ Hospedagem Vercel:     R$ 0,00 (grátis)
✅ 100GB Banda/mês:       R$ 0,00 (grátis)
✅ SSL/HTTPS:             R$ 0,00 (grátis)
✅ CDN Global:            R$ 0,00 (grátis)
✅ Google Analytics:      R$ 0,00 (grátis)
✅ Microsoft Clarity:     R$ 0,00 (grátis)
───────────────────────────────────────
💰 Domínio .com.br:       R$ 40,00/ano
───────────────────────────────────────
💰 CUSTO TOTAL:           R$ 40/ano
                         (R$ 3,33/mês)
```

---

## 🆘 **PROBLEMAS?**

### **Build falhou:**

- Tente: Settings → Redeploy

### **Site não abre:**

- Aguarde alguns minutos
- Limpe cache (Ctrl+F5)

### **Analytics não funciona:**

- Aguarde 24-48h para GA4
- Aguarde 2-3h para Clarity

---

## 📞 **SUPORTE**

- 📖 **Guia Completo:** `/GUIA_DEPLOY_VERCEL.md`
- 📊 **Analytics:** `/ANALYTICS_README.md`
- 🌐 **Vercel Docs:** https://vercel.com/docs

---

## ✅ **PRONTO!**

Seu PixPoc está no ar e funcionando! 🎉

**Próximos passos:**

1. Compartilhe o link
2. Aguarde os dados de analytics
3. Monetize! 💰

🚀 **Bora fazer sucesso!**