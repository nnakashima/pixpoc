# 🚀 Comandos Rápidos para GitHub

## 📦 Subir para o GitHub pela Primeira Vez

```bash
# 1. Navegue até a pasta do projeto
cd caminho/para/seu/projeto/pixpoc

# 2. Inicializar Git
git init

# 3. Adicionar todos os arquivos
git add .

# 4. Fazer o primeiro commit
git commit -m "🎈 Commit inicial - PixPoc v1.0 completo"

# 5. Renomear branch para main
git branch -M main

# 6. Conectar ao GitHub (SUBSTITUA SEU-USUARIO!)
git remote add origin https://github.com/SEU-USUARIO/pixpoc.git

# 7. Enviar para o GitHub
git push -u origin main
```

---

## 🔄 Atualizar o Projeto (após mudanças)

```bash
# Ver o que mudou
git status

# Adicionar mudanças
git add .

# Fazer commit
git commit -m "Descrição da mudança"

# Enviar para o GitHub
git push
```

---

## 🌐 URLs Importantes

- **Criar repositório:** https://github.com/new
- **Vercel (Deploy):** https://vercel.com/new
- **Netlify (Deploy):** https://app.netlify.com/start

---

## ✅ Checklist Rápido

- [ ] Repositório criado no GitHub
- [ ] `git init` ✓
- [ ] `git add .` ✓
- [ ] `git commit -m "mensagem"` ✓
- [ ] `git remote add origin ...` ✓
- [ ] `git push -u origin main` ✓
- [ ] Código visível no GitHub ✓

---

## 🆘 Problemas?

### Erro de autenticação:
```bash
# Use token pessoal em vez de senha
# Crie em: https://github.com/settings/tokens
```

### Repositório já existe:
```bash
git remote set-url origin https://github.com/SEU-USUARIO/pixpoc.git
git push -u origin main --force
```

---

Consulte **GUIA_GITHUB.md** para instruções detalhadas!
