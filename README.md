# GDS-Icons-React

Uma biblioteca de ícones React moderna construída com Vite e TypeScript.

## 🚀 Características

- **Vite**: Build rápido e moderno
- **TypeScript**: Tipagem completa
- **Storybook v8+**: Documentação interativa
- **SVG Otimização**: Processo automático de limpeza e otimização
- **ESLint**: Linting de código
- **Rollup**: Bundling otimizado para bibliotecas

## 📦 Instalação

```bash
npm install g-icons
```

## 🎯 Uso

```tsx
import { Icon } from 'g-icons';

function App() {
  return (
    <div>
      <Icon name="filled-action-add" size={24} color="#007bff" />
      <Icon name="filled-action-check" size={32} color="#28a745" />
    </div>
  );
}
```

## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação das dependências

```bash
npm install
```

### Scripts disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia o servidor de desenvolvimento Vite
npm run storybook        # Inicia o Storybook

# Build
npm run build            # Build da biblioteca
npm run build:icons      # Otimiza SVGs e gera componentes React
npm run optimize:svgs    # Apenas otimiza os SVGs
npm run build-storybook  # Build do Storybook

# Testes
npm run test             # Executa testes
npm run test:watch       # Executa testes em modo watch

# Qualidade de código
npm run lint             # Executa ESLint
npm run lint:fix         # Corrige problemas do ESLint
npm run type-check       # Verifica tipos TypeScript
```

## 🔧 Processo de Otimização de SVGs

O projeto inclui um sistema automatizado de otimização de SVGs que:

### **1. Limpeza Automática**
- Remove declarações XML desnecessárias
- Remove comentários do Adobe Illustrator
- Remove atributos de estilo inline
- Remove IDs e classes específicas do Illustrator
- Remove elementos vazios

### **2. Otimização com SVGO**
- Compressão inteligente de paths
- Remoção de atributos redundantes
- Normalização de viewBox
- Conversão de atributos para camelCase

### **3. Fluxo de Trabalho**
```
svg/ (originais)
    ↓
svg-optimized/ (otimizados)
    ↓
src/icons/ (componentes React)
```

### **4. Diretórios**
- `svg/`: SVGs originais (não modificados)
- `svg-optimized/`: SVGs otimizados (gerado automaticamente)
- `src/icons/`: Componentes React gerados

## 📚 Storybook

O Storybook está configurado com:

- [Storybook - link](https://vagnerzadoque.github.io/g-icons/?path=/story/icons-icon-search--icon-gallery)

- **Icon Search**: Galeria interativa com busca por nome e categoria
- **Documentação automática**: Baseada em TypeScript
- **Controles interativos**: Para testar diferentes props
- **Layout responsivo**: Para diferentes tamanhos de tela

Para acessar: `http://localhost:6006`

## 🏗️ Estrutura do Projeto

```
g-icons/
├── src/
│   ├── icons/           # Componentes de ícones gerados automaticamente
│   ├── Icon.tsx         # Componente wrapper principal
│   ├── types.ts         # Tipos TypeScript
│   ├── index.ts         # Exports da biblioteca
│   └── *.stories.tsx    # Stories do Storybook
├── svg/                 # SVGs originais
├── svg-optimized/       # SVGs otimizados (gerado automaticamente)
├── scripts/
│   ├── optimize-svgs.cjs # Script de otimização
│   └── build-icons.cjs   # Script de geração de componentes
├── .storybook/          # Configuração do Storybook
├── vite.config.ts       # Configuração do Vite
└── package.json
```

## 🎨 Adicionando Novos Ícones

1. **Adicione o SVG** no diretório `svg/`
2. **Execute a otimização**: `npm run build:icons`
3. **Teste no Storybook**: `npm run storybook`

O processo é totalmente automatizado!

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato com a equipe. 