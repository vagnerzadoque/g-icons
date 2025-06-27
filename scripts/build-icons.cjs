const fs = require('fs');
const path = require('path');
const { optimizeAllSvgs } = require('./optimize-svgs.cjs');

// Função para converter nome de arquivo em PascalCase
function fileNameToPascalCase(fileName) {
  return fileName
    .replace(/\.svg$/, '')
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

// Função para converter nome de arquivo em kebab-case para o mapeamento
function fileNameToKebabCase(fileName) {
  return fileName.replace(/\.svg$/, '');
}

// Função para extrair categoria do nome do arquivo
function extractCategory(fileName) {
  const parts = fileName.replace(/\.svg$/, '').split('-');
  return parts.length > 1 ? parts[1] : 'other';
}

// Função para extrair o conteúdo SVG e converter para JSX
function svgToJSX(svgContent, componentName) {
  // Remove comentários e espaços extras
  let cleanedSvg = svgContent
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Remove a declaração XML
  cleanedSvg = cleanedSvg.replace(/<\?xml[^>]*\?>/g, '');

  // Converte atributos SVG para camelCase
  cleanedSvg = cleanedSvg
    .replace(/class=/g, 'className=')
    .replace(/stroke-width=/g, 'strokeWidth=')
    .replace(/stroke-linecap=/g, 'strokeLinecap=')
    .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
    .replace(/fill-rule=/g, 'fillRule=')
    .replace(/clip-rule=/g, 'clipRule=')
    .replace(/clip-path=/g, 'clipPath=')
    .replace(/fill-opacity=/g, 'fillOpacity=')
    .replace(/stroke-opacity=/g, 'strokeOpacity=')
    .replace(/stroke-miterlimit=/g, 'strokeMiterlimit=');

  // Remove atributos desnecessários
  cleanedSvg = cleanedSvg
    .replace(/xmlns="[^"]*"/g, '')
    .replace(/xmlns:xlink="[^"]*"/g, '')
    .replace(/xlink:href=/g, 'href=');

  // Extrai apenas o conteúdo dentro do <svg>
  let innerSvg = cleanedSvg.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '').trim();

  // Se houver múltiplos elementos irmãos, agrupa em <g>
  const topLevelElements = innerSvg.match(/<([a-zA-Z0-9\-]+)(\s|>)/g) || [];
  if (topLevelElements.length > 1) {
    innerSvg = `<g> ${innerSvg} </g>`;
  }

  return `import React from 'react';
import { IconProps } from '../types';

export const ${componentName}: React.FC<IconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  ...props 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      ${innerSvg}
    </svg>
  );
};
`;
}

// Função para gerar o arquivo de índice
function generateIndexFile(components) {
  const imports = components.map(comp => `export { ${comp.pascalName} } from './${comp.kebabName}';`).join('\n');
  
  return `// Auto-generated file - Do not edit manually
${imports}

// Re-export types
export type { IconProps } from './types';
`;
}

// Função para gerar o arquivo de tipos
function generateTypesFile() {
  return `import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  className?: string;
}

export type IconComponent = React.FC<IconProps>;
`;
}

// Função para gerar o arquivo de mapeamento
function generateMappingFile(iconFiles) {
  const imports = iconFiles.map(fileName => {
    const componentName = fileNameToPascalCase(fileName);
    return `import { ${componentName} } from './${fileName.replace('.svg', '')}';`;
  }).join('\n');

  const mapping = iconFiles.map(fileName => {
    const componentName = fileNameToPascalCase(fileName);
    const kebabName = fileNameToKebabCase(fileName);
    return `  '${kebabName}': ${componentName},`;
  }).join('\n');

  const availableIcons = iconFiles.map(fileName => `  '${fileNameToKebabCase(fileName)}'`).join(',\n');

  return `// Auto-generated icon mapping - Do not edit manually
import { IconComponent } from './types';
${imports}

export const iconMapping: Record<string, IconComponent> = {
${mapping}
};

export const availableIcons = [
${availableIcons}
];
`;
}

// Função para gerar a story do Storybook com busca
function generateIconSearchStory(components, iconCategories) {
  // Extrair categorias únicas
  const uniqueCategories = [...new Set(Object.values(iconCategories))];
  
  return `import React, { useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta: Meta = {
  title: 'Icons/Icon Search',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Galeria de ícones com busca por nome ou categoria',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const IconSearchComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ${JSON.stringify(uniqueCategories, null, 2)};
  const iconCategories = ${JSON.stringify(iconCategories, null, 2)};

  const filteredIcons = useMemo(() => {
    let icons = Object.keys(iconCategories);
    
    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      icons = icons.filter(icon => iconCategories[icon] === selectedCategory);
    }
    
    // Filtrar por termo de busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      icons = icons.filter(icon => 
        icon.toLowerCase().includes(searchLower) ||
        iconCategories[icon].toLowerCase().includes(searchLower)
      );
    }
    
    return icons;
  }, [searchTerm, selectedCategory, iconCategories]);

  const handleIconClick = (iconName: string) => {
    console.log('Ícone clicado:', iconName);
    // Aqui você pode adicionar lógica para copiar o nome do ícone
    navigator.clipboard?.writeText(iconName);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ marginBottom: '16px', color: '#333' }}>Galeria de Ícones</h1>
        
        {/* Campo de busca */}
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Buscar ícones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '300px',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
        
        {/* Filtro por categoria */}
        <div style={{ marginBottom: '16px' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              marginRight: '8px'
            }}
          >
            <option value="all">Todas as categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          
          <span style={{ fontSize: '14px', color: '#666' }}>
            {filteredIcons.length} ícones encontrados
          </span>
        </div>
      </div>
      
      {/* Grid de ícones */}
      {filteredIcons.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
          gap: '16px' 
        }}>
          {filteredIcons.map(iconName => (
            <div
              key={iconName}
              onClick={() => handleIconClick(iconName)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: '#fff'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Icon name={iconName} size={32} color="#333" />
              <div style={{ 
                marginTop: '8px', 
                fontSize: '12px', 
                color: '#666',
                wordBreak: 'break-word',
                lineHeight: '1.3'
              }}>
                {iconName}
              </div>
              <div style={{ 
                fontSize: '10px', 
                color: '#999',
                marginTop: '4px'
              }}>
                {iconCategories[iconName]}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#666',
          fontSize: '16px'
        }}>
          Nenhum ícone encontrado com os filtros atuais.
        </div>
      )}
    </div>
  );
};

export const IconGallery: Story = {
  render: () => <IconSearchComponent />
};
`;
}

// Função principal
function buildIcons() {
  console.log('🚀 Iniciando build de ícones...');
  
  // Primeiro, otimiza todos os SVGs
  console.log('\n📦 Otimizando SVGs...');
  const optimizedSvgDir = optimizeAllSvgs();
  
  if (!optimizedSvgDir) {
    console.error('❌ Falha na otimização dos SVGs');
    return;
  }
  
  // OPT_CORRECTION: Garantir que estamos usando APENAS o diretório de SVGs otimizados
  console.log(`🔍 Verificando diretório de SVGs otimizados: ${optimizedSvgDir}`);
  
  if (!fs.existsSync(optimizedSvgDir)) {
    console.error('❌ Diretório de SVGs otimizados não encontrado!');
    return;
  }
  
  const iconsDir = path.join(__dirname, '..', 'src', 'icons');
  
  // Cria o diretório de ícones se não existir
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }
  
  // OPT_CORRECTION: Lê APENAS os arquivos SVG otimizados do diretório svg-optimized
  const svgFiles = fs.readdirSync(optimizedSvgDir)
    .filter(file => file.endsWith('.svg'))
    .sort();
  
  console.log(`\n🔄 Processando ${svgFiles.length} ícones otimizados de: ${optimizedSvgDir}`);
  
  // OPT_CORRECTION: Verificar se há arquivos para processar
  if (svgFiles.length === 0) {
    console.error('❌ Nenhum arquivo SVG encontrado no diretório otimizado!');
    console.log('📂 Verificando conteúdo do diretório svg-optimized:');
    const allFiles = fs.readdirSync(optimizedSvgDir);
    console.log('Arquivos encontrados:', allFiles);
    return;
  }
  
  let successCount = 0;
  let errorCount = 0;
  
  // OPT_CORRECTION: Processa cada arquivo SVG otimizado (NUNCA os originais)
  svgFiles.forEach(fileName => {
    try {
      // OPT_CORRECTION: Sempre usa o caminho dos SVGs otimizados
      const svgPath = path.join(optimizedSvgDir, fileName);
      console.log(`📖 Lendo SVG otimizado: ${svgPath}`);
      
      const svgContent = fs.readFileSync(svgPath, 'utf8');
      const componentName = fileNameToPascalCase(fileName);
      const componentCode = svgToJSX(svgContent, componentName);
      const componentPath = path.join(iconsDir, `${fileName.replace('.svg', '')}.tsx`);
      
      fs.writeFileSync(componentPath, componentCode);
      console.log(`✅ Gerado: ${componentName} (de SVG otimizado)`);
      successCount++;
    } catch (error) {
      console.error(`❌ Erro ao processar ${fileName}:`, error.message);
      errorCount++;
    }
  });
  
  // Gera o arquivo de tipos
  try {
    const typesPath = path.join(__dirname, '..', 'src', 'types.ts');
    fs.writeFileSync(typesPath, generateTypesFile());
    console.log('✅ Arquivo de tipos gerado');
  } catch (error) {
    console.error('❌ Erro ao gerar arquivo de tipos:', error.message);
    errorCount++;
  }
  
  // Gera o arquivo de mapeamento
  try {
    const mappingPath = path.join(iconsDir, 'mapping.ts');
    fs.writeFileSync(mappingPath, generateMappingFile(svgFiles));
    console.log('✅ Arquivo de mapeamento gerado');
  } catch (error) {
    console.error('❌ Erro ao gerar arquivo de mapeamento:', error.message);
    errorCount++;
  }
  
  // Gera a story do Storybook
  try {
    const iconCategories = {};
    svgFiles.forEach(fileName => {
      const kebabName = fileNameToKebabCase(fileName);
      iconCategories[kebabName] = extractCategory(fileName);
    });
    
    const storyPath = path.join(__dirname, '..', 'src', 'IconSearch.stories.tsx');
    const storyContent = generateIconSearchStory(svgFiles, iconCategories);
    fs.writeFileSync(storyPath, storyContent);
    console.log('✅ Story do Storybook gerada');
  } catch (error) {
    console.error('❌ Erro ao gerar story do Storybook:', error.message);
    errorCount++;
  }
  
  console.log(`\n📊 Resumo do build:`);
  console.log(`✅ Componentes gerados: ${successCount}`);
  console.log(`❌ Erros: ${errorCount}`);
  console.log(`📁 Total de SVGs: ${svgFiles.length}`);
  console.log(`📂 SVGs otimizados: ${optimizedSvgDir}`);
  console.log(`📂 Componentes gerados: ${iconsDir}`);
  
  if (errorCount === 0) {
    console.log(`\n🎉 Build de ícones concluído com sucesso!`);
    console.log(`🔍 IMPORTANTE: Componentes gerados a partir de SVGs otimizados!`);
  } else {
    console.log(`\n⚠️  ${errorCount} arquivos tiveram problemas durante o build.`);
  }
}

// Executa se chamado diretamente
if (require.main === module) {
  buildIcons();
}

module.exports = { buildIcons };