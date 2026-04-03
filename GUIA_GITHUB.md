# 📋 Guia Completo: Como Subir o PixPoc para o GitHub

## 🎯 Passo a Passo Detalhado

### ✅ **1. Preparação Inicial**

Primeiro, verifique se você tem o Git instalado:

```bash
# Verificar se o Git está instalado
git --version

# Se não estiver instalado:
# Windows: baixe em https://git-scm.com/download/win
# Mac: brew install git
# Linux: sudo apt-get install git
```

---

### ✅ **2. Criar Repositório no GitHub**

1. Acesse [github.com](https://github.com)
2. Faça login na sua conta
3. Clique no botão **"+"** (canto superior direito) → **"New repository"**
4. Preencha os dados:
   - **Repository name:** `pixpoc`
   - **Description:** "Aplicação de sorteio com balões 3D e segurança criptográfica"
   - Deixe **Public** (gratuito)
   - ❌ **NÃO** marque "Initialize this repository with a README"
   - ❌ **NÃO** adicione .gitignore ou License (já criamos)
5. Clique em **"Create repository"**

---

### ✅ **3. Preparar o Projeto Localmente**

Abra o terminal/prompt de comando e navegue até a pasta do projeto PixPoc:

```bash
# Exemplo no Windows
cd C:\Users\SeuUsuario\Documents\pixpoc

# Exemplo no Mac/Linux
cd ~/Documents/pixpoc
```

---

### ✅ **4. Inicializar Git e Fazer o Primeiro Commit**

Execute os seguintes comandos **um por vez**:

```bash
# 1. Inicializar o repositório Git
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Fazer o primeiro commit
git commit -m "🎈 Commit inicial - PixPoc v1.0 completo"

# 4. Renomear a branch para 'main'
git branch -M main
```

---

### ✅ **5. Conectar ao Repositório Remoto do GitHub**

⚠️ **IMPORTANTE:** Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub!

```bash
# Conectar ao repositório remoto
git remote add origin https://github.com/SEU-USUARIO/pixpoc.git

# Exemplo real:
# git remote add origin https://github.com/joaosilva/pixpoc.git
```

---

### ✅ **6. Enviar o Código para o GitHub**

```bash
# Fazer o push (enviar) para o GitHub
git push -u origin main
```

---

### ✅ **7. Autenticação (se solicitado)**

#### **Opção A: Personal Access Token (Recomendado)**

Se o GitHub pedir senha:

1. No GitHub, vá em: **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Clique em **"Generate new token (classic)"**
3. Dê um nome: `PixPoc Deploy`
4. Marque a opção: ☑️ **repo** (controle total de repositórios)
5. Clique em **"Generate token"**
6. **COPIE O TOKEN** (só aparece uma vez!)
7. No terminal, quando pedir senha, **cole o token** (não a senha do GitHub)

#### **Opção B: GitHub CLI (Mais Fácil)**

```bash
# Instalar GitHub CLI
# Windows:
winget install --id GitHub.cli

# Mac:
brew install gh

# Linux (Ubuntu/Debian):
sudo apt install gh

# Fazer login
gh auth login

# Selecione: GitHub.com → HTTPS → Autenticação no navegador
```

---

### ✅ **8. Verificar se Funcionou**

1. Acesse: `https://github.com/SEU-USUARIO/pixpoc`
2. Você deve ver todos os arquivos do projeto! 🎉
3. O README.md será exibido na página inicial

---

## 🔄 Comandos para Atualizações Futuras

Sempre que você fizer mudanças no projeto:

```bash
# 1. Ver o que mudou
git status

# 2. Adicionar mudanças
git add .

# 3. Fazer commit com mensagem descritiva
git commit -m "Descrição da mudança"

# Exemplos de mensagens:
# git commit -m "✨ Adiciona novo efeito de confetes"
# git commit -m "🐛 Corrige bug no sorteio"
# git commit -m "🎨 Melhora design dos balões"

# 4. Enviar para o GitHub
git push
```

---

## 🚀 Deploy Automático com Vercel

Depois de estar no GitHub, você pode fazer deploy automático:

### **1. Conectar com Vercel**

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em **"Add New Project"**
4. Selecione o repositório **pixpoc**
5. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Clique em **"Deploy"**

### **2. Deploy Automático**

✨ A cada `git push`, o Vercel vai:
- Detectar automaticamente a mudança
- Fazer build do projeto
- Atualizar o site no ar

Você receberá uma URL tipo: `https://pixpoc.vercel.app`

---

## 📂 Arquivos Criados Automaticamente

Já criamos os seguintes arquivos essenciais para você:

- ✅ `.gitignore` - Ignora arquivos desnecessários
- ✅ `README.md` - Documentação completa do projeto
- ✅ `LICENSE` - Licença MIT
- ✅ `index.html` - Arquivo HTML principal
- ✅ `src/main.tsx` - Ponto de entrada do React
- ✅ `package.json` - Atualizado com scripts completos

---

## 🆘 Problemas Comuns

### **"Permission denied (publickey)"**

```bash
# Usar HTTPS em vez de SSH
git remote set-url origin https://github.com/SEU-USUARIO/pixpoc.git
```

### **"Failed to push some refs"**

```bash
# Forçar o push (só no primeiro commit)
git push -u origin main --force
```

### **"Updates were rejected"**

```bash
# Puxar mudanças primeiro
git pull origin main --rebase
git push
```

---

## ✅ Checklist Final

- [ ] Git instalado e configurado
- [ ] Repositório criado no GitHub
- [ ] `git init` executado
- [ ] `git add .` executado
- [ ] `git commit` executado
- [ ] `git remote add origin` configurado
- [ ] `git push` bem-sucedido
- [ ] Código visível no GitHub
- [ ] (Opcional) Deploy no Vercel configurado

---

## 🎉 Pronto!

Seu projeto **PixPoc** está agora salvo no GitHub e pronto para ser compartilhado ou fazer deploy!

**Próximos passos sugeridos:**
1. ⭐ Dar uma estrela no seu próprio repositório
2. 🚀 Fazer deploy no Vercel/Netlify
3. 📱 Compartilhar o link com amigos
4. 🔧 Continuar desenvolvendo novas features

---

## 📞 Precisa de Ajuda?

Se encontrar algum erro, anote a mensagem completa e procure ajuda com:
- Mensagem de erro exata
- Comando que você estava executando
- Sistema operacional (Windows/Mac/Linux)
