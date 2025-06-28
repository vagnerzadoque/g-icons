import React from 'react';
import { IconProps } from './types';
import { iconMapping, availableIcons } from './icons/mapping';
import { FilledActionAdd } from './icons/filled-action-add';
export interface IconComponentProps extends IconProps {
  name: string;
}

export const Icon: React.FC<IconProps> = ({ name = '', size = 24, color = 'currentColor' }) => {
  let IconComponent = iconMapping[name];
 return (<>
     <IconComponent size={size} color={color} />
 </>)
 
};

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
            <IconComponent size={size} fill='red' />
            <span style={{ fontSize: '12px', marginTop: '4px', textAlign: 'center' }}>
              {iconName}
            </span>
          </div>
        );
      })}
    </div>
  );
}; 