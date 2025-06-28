import React, { useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import { categories, iconCategories } from './Utils/icon-data';

const meta: Meta = {
  title: 'Icons/Icon Search',
  argTypes: {
    size: { control: { type: 'number', min: 16, max: 64, step: 4 }, description: 'Tamanho do ícone em pixels' },
    color: { control: 'color', description: 'Cor do ícone' },

  },
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

const IconSearchComponent: React.FC<{ size?: number, color?: string }> = ({ size = 32, color = '#333' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

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
  }, [searchTerm, selectedCategory]);

  const handleIconClick = (iconName: string) => {
    navigator.clipboard?.writeText(iconName);
    setCopiedIcon(iconName);
    setTimeout(() => {
      setCopiedIcon(null);
    }, 1500);
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
          {filteredIcons.map(iconName => {
            const isCopied = copiedIcon === iconName;
            
            const cardStyle: React.CSSProperties = {
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px',
              border: `1px solid ${isCopied ? '#4CAF50' : '#e0e0e0'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease-in-out',
              backgroundColor: '#fff',
              boxShadow: isCopied ? '0 0 8px rgba(76, 175, 80, 0.6)' : 'none',
              transform: isCopied ? 'translateY(-2px)' : 'translateY(0)',
            };

            const tooltipStyle: React.CSSProperties = {
              visibility: isCopied ? 'visible' : 'hidden',
              opacity: isCopied ? 1 : 0,
              position: 'absolute',
              top: '-30px',
              backgroundColor: '#28a745',
              color: '#fff',
              padding: '5px 10px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              zIndex: 10,
              transition: 'all 0.3s ease-in-out',
            };

            return (
              <div
                key={iconName}
                onClick={() => handleIconClick(iconName)}
                style={cardStyle}
                onMouseEnter={(e) => {
                  if (!isCopied) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCopied) {
                    e.currentTarget.style.backgroundColor = '#fff';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div style={tooltipStyle}>Copiado!</div>
                <Icon name={iconName} size={size} color={color} />
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
            );
          })}
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
  render: (args) => <IconSearchComponent {...args} />,
  args: {
    size: 32,
    color: '#333',
  },
};

