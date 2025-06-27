# G Icons - Biblioteca de Ícones React

Uma biblioteca moderna e flexível de ícones SVG para React, com suporte completo a TypeScript.

## 🚀 Características

- ✅ **TypeScript First** - Suporte completo a tipos
- ✅ **Tree Shaking** - Importação otimizada
- ✅ **Customização** - Tamanho, cor e classes CSS
- ✅ **Auto-geração** - Scripts para converter SVGs automaticamente
- ✅ **Documentação** - Storybook integrado
- ✅ **Testes** - Cobertura completa
- ✅ **Bundle Otimizado** - Rollup para produção

## 📦 Instalação

```bash
npm install g-icons
# ou
yarn add g-icons
```

## 🎯 Uso Básico

### Importação Individual (Recomendado)

```tsx
import { FilledActionAdd, FilledActionCheck } from 'g-icons';

function MyComponent() {
  return (
    <div>
      <FilledActionAdd size={24} color="#007bff" />
      <FilledActionCheck size={32} color="green" />
    </div>
  );
}
```

### Importação Dinâmica

```tsx
import { Icon } from 'g-icons';

function MyComponent() {
  return (
    <div>
      <Icon name="FilledActionAdd" size={24} color="#007bff" />
      <Icon name="FilledActionCheck" size={32} color="green" />
    </div>
  );
}
```

### Lista de Todos os Ícones

```tsx
import { IconList } from 'g-icons';

function IconGallery() {
  return (
    <IconList 
      size={32} 
      color="#333"
      onIconClick={(iconName) => console.log('Ícone clicado:', iconName)}
    />
  );
}
```

## 🎨 Props

Todos os ícones aceitam as seguintes props:

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `size` | `number \| string` | `24` | Tamanho do ícone em pixels |
| `color` | `string` | `currentColor` | Cor do ícone |
| `className` | `string` | `''` | Classes CSS adicionais |
| `...props` | `SVGProps` | - | Todas as props padrão do SVG |

## 📚 Desenvolvimento

### Pré-requisitos

```bash
npm install
```

### Scripts Disponíveis

```bash
# Gerar componentes dos SVGs
npm run build:icons

# Build da biblioteca
npm run build

# Desenvolvimento com watch
npm run dev

# Storybook
npm run storybook

# Testes
npm run test

# Lint
npm run lint
```

### Adicionando Novos Ícones

1. Adicione o arquivo SVG na pasta `svg/`
2. Execute `npm run build:icons`
3. Os componentes serão gerados automaticamente

### Estrutura do Projeto

```
g-icons/
├── svg/                    # Arquivos SVG originais
├── src/
│   ├── icons/             # Componentes gerados
│   ├── types.ts           # Definições de tipos
│   ├── Icon.tsx           # Componente principal
│   └── index.ts           # Exportações
├── scripts/
│   └── build-icons.js     # Script de geração
├── stories/               # Storybook
├── tests/                 # Testes
└── dist/                  # Build de produção
```

## 🧪 Testes

```bash
# Executar testes
npm run test

# Testes com watch
npm run test:watch

# Cobertura de testes
npm run test:coverage
```

## 📖 Storybook

```bash
# Iniciar Storybook
npm run storybook

# Build do Storybook
npm run build-storybook
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas, por favor abra uma [issue](https://github.com/seu-usuario/g-icons/issues).

---

Feito com ❤️ pela equipe G Icons 