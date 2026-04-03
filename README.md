# 🎈 PixPoc - Aplicação de Sorteio com Balões 3D

<div align="center">
  <h3>🎯 Sorteios justos e transparentes com criptografia do navegador</h3>
  <p>Uma aplicação web gamificada de estourar balões com estética 3D realista e segurança criptográfica</p>
  
  <br />
  
  **🚀 [Ver Demo](https://pixpoc.vercel.app)** | **📖 [Documentação](./GUIA_DEPLOY_VERCEL.md)** | **📊 [Analytics](./ANALYTICS_README.md)**
</div>

---

## 🌟 Características

### 🎨 **Visual & UX**
- ✨ **Balões 3D realistas** com efeito glossy/metálico
- 🌊 **Animações de flutuação** suaves e naturais
- 💫 **Estados interativos**: hover, click/pop, reveal
- 📱 **Design mobile-first** totalmente responsivo
- 🌙 **Background escuro elegante** com gradientes
- 🖼️ **Sistema de banners** com upload e IA integrada

### 🔐 **Segurança & Transparência**
- 🛡️ **Web Crypto API** com rejection sampling
- 📊 **100% aleatório** sem viés algorítmico
- 📅 **Registro de data/hora** em tempo real
- 🌐 **Exibição de IP público** para auditoria
- 🔍 **Painel de transparência** com glassmorphism

### 🎮 **Funcionalidades**
- 🎯 **Controle total** sobre quantidade de balões
- 💰 **Seleção flexível** de valores (R$0,00 a R$200,00)
- ⚡ **Modo "Roleta Russa"** com valores zero para sorteios desafiadores
- 🔄 **Repetição de valores** permitida
- 🎨 **Embaralhamento de cores** a cada sorteio
- 🎵 **Efeitos sonoros** de estouro e processamento
- 🏆 **Sistema de destaque** de balões vencedores
- 📸 **Registro de ganhador** para captura de tela
- 📊 **Analytics integrado** (Google Analytics 4 + Microsoft Clarity)

---

## 🚀 Tecnologias

- **React 18.3.1** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite 6.3.5** - Build tool ultrarrápido
- **Tailwind CSS 4** - Estilização moderna
- **Lucide React** - Ícones elegantes
- **Web Crypto API** - Aleatoriedade criptográfica
- **Google Analytics 4** - Análise de tráfego
- **Microsoft Clarity** - Gravação de sessões e heatmaps

---

## 📦 Instalação

### **Pré-requisitos**
- Node.js 18+ 
- npm, yarn ou pnpm

### **Passos**

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/pixpoc.git

# 2. Entre na pasta do projeto
cd pixpoc

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev

# 5. Abra no navegador
# Acesse: http://localhost:5173
```

---

## 🏗️ Build para Produção

```bash
# Gerar build otimizado
npm run build

# Preview da build
npm run preview
```

O build será criado na pasta `dist/` e estará pronto para deploy!

---

## 🌐 Deploy

### **Vercel (Recomendado)** ⭐

📖 **[Guia Completo de Deploy](./GUIA_DEPLOY_VERCEL.md)**

**Deploy Rápido:**
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New..." → "Project"
3. Importe do GitHub ou faça upload da pasta
4. Deploy automático! 🎉

**Configuração incluída:**
- ✅ `vercel.json` pré-configurado
- ✅ Região Brasil (GRU1)
- ✅ Node.js 18
- ✅ Build otimizado

**Custos:**
```
Hospedagem Vercel:  R$ 0,00 (grátis - 100GB banda)
SSL/HTTPS:          R$ 0,00 (grátis - automático)
Analytics:          R$ 0,00 (grátis - GA4 + Clarity)
────────────────────────────────────────
Domínio .com.br:    R$ 40,00/ano (opcional)
────────────────────────────────────────
TOTAL:              R$ 0-40/ano
```

---

## 📊 Analytics Integrado

### **Google Analytics 4**
- 📈 Tráfego e comportamento
- 🌍 Localização geográfica
- 📱 Dispositivos e navegadores
- 🎯 Eventos customizados

### **Microsoft Clarity**
- 🎥 Gravação de sessões
- 🔥 Heatmaps de cliques
- 😤 Rage clicks (frustração)
- 📊 Scroll depth

📖 **[Documentação Analytics](./ANALYTICS_README.md)**

---

## 🎯 Como Usar

### **1️⃣ Configure o Sorteio**
- Defina a quantidade de balões
- Selecione os valores de moeda desejados
- Ative/desative som e cor única

### **2️⃣ Inicie o Sorteio**
- Clique em "**Sortear!**"
- Aguarde o embaralhamento (1.5s)
- Som de tic-tac indica o processamento

### **3️⃣ Estoure os Balões**
- Clique nos balões para revelar valores
- Balões estourados mostram o prêmio
- Clique novamente para destacar em amarelo/verde

### **4️⃣ Registre o Ganhador**
- Clique no ícone 👤 no painel lateral
- Preencha: Nome, Referência, Chave PIX
- Use print nativo para capturar a tela

### **5️⃣ Configure Banner (Senha: `5Eyl@eU!`)**
- Clique no ícone 🖼️ no canto superior direito
- Opção A: Cole URL de imagem externa
- Opção B: Crie banner com IA (4 estilos disponíveis)

---

## 🔒 Segurança Criptográfica

### **Web Crypto API + Rejection Sampling**

O PixPoc utiliza o padrão criptográfico do navegador para garantir aleatoriedade verdadeira:

```typescript
// Embaralhamento seguro com Web Crypto API
function secureArrayShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const maxValue = Math.pow(2, 32);
    const range = i + 1;
    let randomIndex: number;
    
    // Rejection sampling para evitar viés
    do {
      const randomValues = new Uint32Array(1);
      crypto.getRandomValues(randomValues);
      randomIndex = randomValues[0];
    } while (randomIndex >= maxValue - (maxValue % range));
    
    randomIndex = randomIndex % range;
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  
  return shuffled;
}
```

✅ **Sem viés algorítmico**  
✅ **Auditável pelo código-fonte**  
✅ **Transparente com IP e timestamp**

---

## 📂 Estrutura do Projeto

```
pixpoc/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Balloon.tsx           # Componente do balão 3D
│   │   │   ├── SettingsPanel.tsx     # Painel de configurações
│   │   │   ├── Banner.tsx            # Componente de banner
│   │   │   ├── BannerConfigModal.tsx # Modal de config do banner
│   │   │   ├── SplashScreen.tsx      # Tela inicial
│   │   │   └── ui/                   # Componentes UI reutilizáveis
│   │   ├── utils/
│   │   │   ├── analytics.ts          # Funções de analytics
│   │   │   └── randomUtils.ts        # Funções de aleatoriedade
│   │   └── App.tsx                   # Componente principal
│   ├── styles/
│   │   ├── index.css                 # Estilos globais
│   │   ├── tailwind.css              # Configuração Tailwind
│   │   ├── theme.css                 # Tokens de design
│   │   └── fonts.css                 # Importação de fontes
│   └── main.tsx                      # Ponto de entrada
├── index.html                        # HTML base + Scripts Analytics
├── package.json
├── vite.config.ts
├── vercel.json                       # Configuração Vercel
├── tsconfig.json
├── GUIA_DEPLOY_VERCEL.md            # Guia de deploy
├── ANALYTICS_README.md               # Documentação analytics
└── README.md
```

---

## 🎨 Valores Disponíveis

| Valor | Formato | Uso Sugerido |
|-------|---------|-----------------|
| R$ 0,00 | Zero | ⚡ **Roleta Russa**: ideal para criar sorteios com vários zeros e poucos prêmios |
| R$ 0,05 | Cinco centavos | Prêmios mínimos |
| R$ 0,10 | Dez centavos | Prêmios mínimos |
| R$ 0,25 | Vinte e cinco centavos | Prêmios pequenos |
| R$ 0,50 | Cinquenta centavos | Prêmios pequenos |
| R$ 1,00 | Um real | Prêmios baixos |
| R$ 2,00 | Dois reais | Prêmios baixos |
| R$ 5,00 | Cinco reais | Prêmios médios |
| R$ 10,00 | Dez reais | Prêmios médios |
| R$ 20,00 | Vinte reais | Prêmios médios |
| R$ 50,00 | Cinquenta reais | Prêmios altos |
| R$ 100,00 | Cem reais | Prêmios altos |
| R$ 200,00 | Duzentos reais | Prêmio máximo |

### 💡 Exemplo de "Roleta Russa"
Configure 10 balões com:
- **9x R$ 0,00** (zero)
- **1x R$ 100,00** (prêmio único)

O participante tem apenas 10% de chance de ganhar!