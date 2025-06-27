const fs = require('fs');
const path = require('path');

// Função para converter nome de arquivo em nome de componente
function fileNameToComponentName(fileName) {
  return fileName
    .replace(/\.svg$/, '')
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

// Função para extrair o conteúdo SVG e converter para JSX
function svgToJSX(svgContent, componentName) {
  // Remove comentários e espaços extras
  let cleanedSvg = svgContent
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .trim();

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
      ${cleanedSvg.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '')}
    </svg>
  );
};
`;
}

// Função para gerar o arquivo de índice
function generateIndexFile(components) {
  const imports = components.map(comp => `export { ${comp} } from './${comp}';`).join('\n');
  
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

// Função para gerar o arquivo de mapeamento de ícones
function generateIconMapping(components) {
  const mapping = components.map(comp => `  '${comp}': ${comp}`).join(',\n');
  
  return `// Auto-generated icon mapping - Do not edit manually
import { IconComponent } from './types';
${components.map(comp => `import { ${comp} } from './${comp}';`).join('\n')}

export const iconMapping: Record<string, IconComponent> = {
${mapping}
};

export const availableIcons = Object.keys(iconMapping);
`;
}

// Função principal
function buildIcons() {
  const svgDir = path.join(__dirname, '../svg');
  const srcDir = path.join(__dirname, '../src');
  const iconsDir = path.join(srcDir, 'icons');

  // Criar diretórios se não existirem
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir);
  }
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
  }

  // Ler todos os arquivos SVG
  const svgFiles = fs.readdirSync(svgDir).filter(file => file.endsWith('.svg'));
  const components = [];

  console.log(`🔍 Encontrados ${svgFiles.length} arquivos SVG`);

  // Processar cada arquivo SVG
  svgFiles.forEach(file => {
    const componentName = fileNameToComponentName(file);
    const svgPath = path.join(svgDir, file);
    const componentPath = path.join(iconsDir, `${componentName}.tsx`);
    
    try {
      const svgContent = fs.readFileSync(svgPath, 'utf8');
      const jsxContent = svgToJSX(svgContent, componentName);
      
      fs.writeFileSync(componentPath, jsxContent);
      components.push(componentName);
      
      console.log(`✅ Gerado: ${componentName}`);
    } catch (error) {
      console.error(`❌ Erro ao processar ${file}:`, error.message);
    }
  });

  // Gerar arquivo de índice
  const indexContent = generateIndexFile(components);
  fs.writeFileSync(path.join(iconsDir, 'index.ts'), indexContent);

  // Gerar arquivo de tipos
  const typesContent = generateTypesFile();
  fs.writeFileSync(path.join(srcDir, 'types.ts'), typesContent);

  // Gerar arquivo de mapeamento
  const mappingContent = generateIconMapping(components);
  fs.writeFileSync(path.join(iconsDir, 'mapping.ts'), mappingContent);

  // Gerar arquivo principal de índice
  const mainIndexContent = `export * from './icons';
export * from './types';
export * from './Icon';
`;
  fs.writeFileSync(path.join(srcDir, 'index.ts'), mainIndexContent);

  // Gerar arquivo de lista de ícones para documentação
  const iconListContent = components.map(comp => `- ${comp}`).join('\n');
  fs.writeFileSync(path.join(__dirname, '../ICONS_LIST.md'), 
    `# Lista de Ícones Disponíveis\n\n${iconListContent}\n\nTotal: ${components.length} ícones`);

  console.log(`\n🎉 Build concluído!`);
  console.log(`📁 Componentes gerados: ${components.length}`);
  console.log(`📄 Arquivos criados:`);
  console.log(`   - src/icons/ (${components.length} componentes)`);
  console.log(`   - src/types.ts`);
  console.log(`   - src/index.ts`);
  console.log(`   - ICONS_LIST.md`);
}

// Executar se chamado diretamente
if (require.main === module) {
  buildIcons();
}

module.exports = { buildIcons }; 