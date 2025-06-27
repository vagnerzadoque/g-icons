import React from 'react';
import { Icon, IconList } from '../src';

function BasicUsage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>G Icons - Exemplo de Uso</h1>
      
      <section style={{ marginBottom: '30px' }}>
        <h2>Ícones Individuais</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div>
            <Icon name="FilledActionAdd" size={24} color="#007bff" />
            <p>FilledActionAdd</p>
          </div>
          <div>
            <Icon name="FilledActionCheck" size={24} color="#28a745" />
            <p>FilledActionCheck</p>
          </div>
          <div>
            <Icon name="FilledActionDelete" size={24} color="#dc3545" />
            <p>FilledActionDelete</p>
          </div>
          <div>
            <Icon name="FilledBrandFacebook" size={24} color="#1877f2" />
            <p>FilledBrandFacebook</p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>Diferentes Tamanhos</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div>
            <Icon name="FilledActionAdd" size={16} color="#333" />
            <p>16px</p>
          </div>
          <div>
            <Icon name="FilledActionAdd" size={24} color="#333" />
            <p>24px</p>
          </div>
          <div>
            <Icon name="FilledActionAdd" size={32} color="#333" />
            <p>32px</p>
          </div>
          <div>
            <Icon name="FilledActionAdd" size={48} color="#333" />
            <p>48px</p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>Galeria de Ícones</h2>
        <IconList 
          size={24} 
          color="#333"
          onIconClick={(iconName) => console.log('Ícone clicado:', iconName)}
        />
      </section>
    </div>
  );
}

export default BasicUsage; 