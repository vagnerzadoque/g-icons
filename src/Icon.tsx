import React from 'react';
import { IconProps } from './types';
import { iconMapping, availableIcons } from './icons/mapping';

export interface IconComponentProps extends IconProps {
  name: string;
}

export const Icon: React.FC<IconProps> = ({ name = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'block' }}>
    <circle cx="12" cy="12" r="10" />
    <text x="12" y="16" fontSize="8" textAnchor="middle" fill="#fff">{name ? name[0] : ''}</text>
  </svg>
);

// Componente utilitário para listar todos os ícones
export const IconList: React.FC<{ 
  size?: number; 
  color?: string; 
  className?: string;
  onIconClick?: (iconName: string) => void;
}> = ({ size = 24, color = 'currentColor', className = '', onIconClick }) => {
  return (
    <div className={className} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '16px' }}>
      {availableIcons.map(iconName => {
        const IconComponent = iconMapping[iconName];
        return (
          <div
            key={iconName}
            onClick={() => onIconClick?.(iconName)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '8px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              cursor: onIconClick ? 'pointer' : 'default',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (onIconClick) {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }
            }}
            onMouseLeave={(e) => {
              if (onIconClick) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <IconComponent size={size} color={color} />
            <span style={{ fontSize: '12px', marginTop: '4px', textAlign: 'center' }}>
              {iconName}
            </span>
          </div>
        );
      })}
    </div>
  );
}; 