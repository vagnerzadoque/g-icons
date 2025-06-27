const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Limpando ambiente de desenvolvimento...');

// Remover arquivos desnecessários
const filesToRemove = [
  '.storybook/main.ts',
  '.storybook/preview.ts',
  'yarn.lock'
];

filesToRemove.forEach(file => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`✅ Removido: ${file}`);
  }
});

// Remover node_modules se existir
const nodeModulesPath = path.join(__dirname, '../node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('🗑️ Removendo node_modules...');
  fs.rmSync(nodeModulesPath, { recursive: true, force: true });
}

console.log('📦 Instalando dependências...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependências instaladas com sucesso!');
} catch (error) {
  console.error('❌ Erro ao instalar dependências:', error.message);
  process.exit(1);
}

console.log('🔨 Gerando ícones...');
try {
  execSync('npm run build:icons', { stdio: 'inherit' });
  console.log('✅ Ícones gerados com sucesso!');
} catch (error) {
  console.error('❌ Erro ao gerar ícones:', error.message);
  process.exit(1);
}

console.log('🎉 Ambiente configurado com sucesso!');
console.log('📖 Para iniciar o Storybook: npm run storybook');
console.log('🧪 Para executar testes: npm run test');
console.log('🔨 Para build: npm run build'); 