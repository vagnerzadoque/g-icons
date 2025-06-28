const fs = require('fs');
const path = require('path');
const { optimize } = require('svgo');
const cheerio = require('cheerio');

// Configuração do SVGO para otimização
const svgoConfig = {
  plugins: [
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeEditorsNSData',
    'cleanupAttrs',
    'mergeStyles',
    'inlineStyles',
    'convertStyleToAttrs',
    'minifyStyles',
    'cleanupIds',
    'removeUselessDefs',
    'cleanupNumericValues',
    'convertColors',
    'removeUnknownsAndDefaults',
    'removeNonInheritableGroupAttrs',
    'removeUselessStrokeAndFill',
    'removeViewBox',
    'cleanupEnableBackground',
    'removeHiddenElems',
    'removeEmptyText',
    'convertShapeToPath',
    'convertEllipseToCircle',
    'moveElemsAttrsToGroup',
    'moveGroupAttrsToElems',
    'collapseGroups',
    'convertPathData',
    'convertTransform',
    'removeEmptyAttrs',
    'removeEmptyContainers',
    'mergePaths',
    'removeUnusedNS',
    'sortDefsChildren',
    'removeTitle',
    'removeDesc',
    'removeStyleElement',
    // Plugin customizado para limpeza específica
    {
      name: 'removeAdobeAttributes',
      type: 'perItem',
      fn: (item) => {
        if (item && typeof item.isElem === 'function' && item.isElem()) {
          // Remove atributos específicos do Adobe Illustrator
          if (item.attr) {
            delete item.attr('x');
            delete item.attr('y');
            delete item.attr('style');
            delete item.attr('xml:space');
            delete item.attr('enable-background');
            
            // Remove IDs específicos do Illustrator
            if (item.attr('id')) {
              const idValue = item.attr('id').value;
              if (idValue === 'Layer_1' || 
                  idValue === 'Camada_1' || 
                  idValue === 'Info' || 
                  idValue === 'Keyline' || 
                  idValue === 'Create-Here') {
                delete item.attr('id');
              }
            }
          }
        }
        return item;
      },
    },
    // Plugin para garantir viewBox consistente
    {
      name: 'ensureViewBox',
      type: 'perItem',
      fn: (item) => {
        if (item && typeof item.isElem === 'function' && item.isElem('svg')) {
          if (!item.attr('viewBox')) {
            item.addAttr({
              name: 'viewBox',
              value: '0 0 24 24',
              prefix: '',
              local: 'viewBox',
            });
          }
        }
        return item;
      },
    },
  ],
};

// Função para limpar SVG com Cheerio (limpeza adicional)
function cleanSvgWithCheerio(svgContent) {
  const $ = cheerio.load(svgContent, { xmlMode: true });
  
  // Remove comentários
  $('*').contents().filter(function() {
    return this.type === 'comment';
  }).remove();
  
  // Remove elementos vazios
  $('g:empty, defs:empty').remove();
  
  // Remove atributos desnecessários
  $('*').removeAttr('style');
  $('svg').removeAttr('x y xml:space enable-background');
  $('*').removeAttr('id').removeAttr('class');
  
  // Garante viewBox
  if (!$('svg').attr('viewBox')) {
    $('svg').attr('viewBox', '0 0 24 24');
  }
  
  // Remove xmlns desnecessários
  $('svg').removeAttr('xmlns:xlink');
  
  return $.html('svg');
}

// Função para otimizar um SVG individual
function optimizeSvg(svgPath, outputPath) {
  try {
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // Primeira passagem: SVGO
    const result = optimize(svgContent, {
      path: svgPath,
      ...svgoConfig,
    });
    
    // Segunda passagem: Cheerio para limpeza adicional
    let cleanedSvg = cleanSvgWithCheerio(result.data);
    
    // Remove quebras de linha extras e espaços
    cleanedSvg = cleanedSvg
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Escreve o SVG otimizado no diretório de saída
    fs.writeFileSync(outputPath, cleanedSvg);
    
    console.log(`✅ Otimizado: ${path.basename(svgPath)}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao otimizar ${path.basename(svgPath)}:`, error.message);
    return false;
  }
}

// Função principal
function optimizeAllSvgs() {
  const svgDir = path.join(__dirname, '..', 'svg');
  const optimizedSvgDir = path.join(__dirname, '..', 'svg-optimized');
  
  if (!fs.existsSync(svgDir)) {
    console.error('❌ Diretório svg não encontrado');
    return;
  }
  
  // Cria o diretório de SVGs otimizados se não existir
  if (!fs.existsSync(optimizedSvgDir)) {
    fs.mkdirSync(optimizedSvgDir, { recursive: true });
    console.log('📁 Diretório svg-optimized criado');
  } else {
    // Limpa o diretório se já existir
    const existingFiles = fs.readdirSync(optimizedSvgDir);
    existingFiles.forEach(file => {
      if (file.endsWith('.svg')) {
        fs.unlinkSync(path.join(optimizedSvgDir, file));
      }
    });
    console.log('🧹 Diretório svg-optimized limpo');
  }
  
  const svgFiles = fs.readdirSync(svgDir)
    .filter(file => file.endsWith('.svg'))
    .map(file => ({
      input: path.join(svgDir, file),
      output: path.join(optimizedSvgDir, file)
    }));
  
  console.log(`🔄 Otimizando ${svgFiles.length} arquivos SVG...`);
  
  let successCount = 0;
  let errorCount = 0;
  
  svgFiles.forEach(({ input, output }) => {
    if (optimizeSvg(input, output)) {
      successCount++;
    } else {
      errorCount++;
    }
  });
  
  console.log(`\n📊 Resumo da otimização:`);
  console.log(`✅ Sucessos: ${successCount}`);
  console.log(`❌ Erros: ${errorCount}`);
  console.log(`📁 Total: ${svgFiles.length}`);
  console.log(`📂 Diretório de saída: ${optimizedSvgDir}`);
  
  if (errorCount === 0) {
    console.log(`\n🎉 Todos os SVGs foram otimizados com sucesso!`);
    console.log(`📂 SVGs otimizados salvos em: svg-optimized/`);
  } else {
    console.log(`\n⚠️  ${errorCount} arquivos tiveram problemas durante a otimização.`);
  }
  
  return optimizedSvgDir;
}

// Executa se chamado diretamente
if (require.main === module) {
  optimizeAllSvgs();
}

module.exports = { optimizeSvg, optimizeAllSvgs }; 