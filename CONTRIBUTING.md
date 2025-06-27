# Guia de Contribuição - G Icons

## 🚀 Como Contribuir

### Pré-requisitos

- Node.js 16+ 
- npm ou yarn
- Git

### Configuração Inicial

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/g-icons.git
   cd g-icons
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o ambiente de desenvolvimento**
   ```bash
   # Instale as dependências de desenvolvimento
   npm install
   
   # Gere os componentes dos ícones
   npm run build:icons
   ```

### Fluxo de Desenvolvimento

#### 1. Adicionando Novos Ícones

1. **Adicione o arquivo SVG** na pasta `svg/`
   - Use nomes descritivos: `filled-action-example.svg`
   - Mantenha a organização por categorias

2. **Gere os componentes**
   ```bash
   npm run build:icons
   ```

3. **Teste os novos ícones**
   ```bash
   npm run storybook
   ```

#### 2. Desenvolvimento Local

```bash
# Modo de desenvolvimento com watch
npm run dev

# Executar testes
npm run test

# Verificar tipos
npm run type-check

# Lint
npm run lint
```

#### 3. Testes

```bash
# Executar todos os testes
npm run test

# Testes com watch
npm run test:watch

# Cobertura de testes
npm run test:coverage
```

### Estrutura do Projeto

```
g-icons/
├── svg/                    # Arquivos SVG originais
│   ├── filled-action-*.svg
│   ├── filled-alert-*.svg
│   └── ...
├── src/
│   ├── icons/             # Componentes gerados (não editar manualmente)
│   ├── types.ts           # Definições de tipos
│   ├── Icon.tsx           # Componente principal
│   └── index.ts           # Exportações
├── scripts/
│   └── build-icons.js     # Script de geração
├── stories/               # Storybook
├── tests/                 # Testes
├── examples/              # Exemplos de uso
└── dist/                  # Build de produção
```

### Convenções

#### Nomenclatura de Arquivos SVG

- Use kebab-case: `filled-action-add.svg`
- Organize por categoria: `filled-{category}-{name}.svg`
- Seja descritivo e consistente

#### Commits

Use commits semânticos:

```bash
feat: adiciona novos ícones de ação
fix: corrige problema de renderização
docs: atualiza documentação
test: adiciona testes para novos ícones
refactor: melhora performance do build
```

#### Pull Requests

1. Crie uma branch para sua feature
2. Faça commits pequenos e focados
3. Escreva uma descrição clara do PR
4. Inclua testes quando apropriado
5. Verifique se todos os testes passam

### Checklist antes do PR

- [ ] Código segue as convenções do projeto
- [ ] Testes passam (`npm run test`)
- [ ] Lint passa (`npm run lint`)
- [ ] Tipos estão corretos (`npm run type-check`)
- [ ] Documentação atualizada
- [ ] Storybook funciona (`npm run storybook`)

### Problemas Comuns

#### Erro de tipos TypeScript
```bash
npm run type-check
```

#### Erro de lint
```bash
npm run lint:fix
```

#### Ícones não aparecem
```bash
npm run build:icons
```

### Contato

Para dúvidas ou problemas:
- Abra uma [issue](https://github.com/seu-usuario/g-icons/issues)
- Entre em contato com a equipe

---

Obrigado por contribuir! 🎉 