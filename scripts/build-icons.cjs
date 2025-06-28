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
      viewBox={\`0 0 \${size} \${size}\`}
      fill={color}
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
import { IconComponent } from '../types';
${imports}

export const iconMapping: Record<string, IconComponent> = {
${mapping}
};

export const availableIcons = [
${availableIcons}
];
`;
}

// Função para gerar o arquivo de dados dos ícones
function generateIconDataFile(iconCategories) {
  const uniqueCategories = [...new Set(Object.values(iconCategories))];
  
  return `// Auto-generated file - Do not edit manually
export const iconCategories = ${JSON.stringify(iconCategories, null, 2)};

export const categories = ${JSON.stringify(uniqueCategories, null, 2)};
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
  
  const components = svgFiles.map(fileName => ({
    pascalName: fileNameToPascalCase(fileName),
    kebabName: fileNameToKebabCase(fileName),
  }));
  
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
  
  // Gera o arquivo de índice de ícones para tree-shaking
  try {
    const indexPath = path.join(iconsDir, 'index.ts');
    fs.writeFileSync(indexPath, generateIndexFile(components));
    console.log('✅ Arquivo de índice (index.ts) gerado para tree-shaking');
  } catch (error) {
    console.error('❌ Erro ao gerar arquivo de índice:', error.message);
    errorCount++;
  }
  
  // Gera o arquivo de dados dos ícones para a story
  try {
    const iconCategories = {};
    svgFiles.forEach(fileName => {
      const kebabName = fileNameToKebabCase(fileName);
      iconCategories[kebabName] = extractCategory(fileName);
    });
    
    const iconDataPath = path.join(__dirname, '..', 'src', 'Utils', 'icon-data.ts');
    const iconDataContent = generateIconDataFile(iconCategories);
    fs.writeFileSync(iconDataPath, iconDataContent);

    console.log('✅ Arquivo de dados de ícones gerado para o Storybook');
  } catch (error) {
    console.error('❌ Erro ao gerar arquivo de dados de ícones:', error.message);
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