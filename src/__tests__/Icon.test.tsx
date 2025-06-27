import React from 'react';
import { render, screen } from '@testing-library/react';
import { Icon } from '../Icon';

// Mock do mapping de ícones
jest.mock('../icons/mapping', () => ({
  iconMapping: {
    'test-icon': () => <svg data-testid="test-icon">Test Icon</svg>,
  },
  availableIcons: ['test-icon'],
}));

describe('Icon Component', () => {
  it('should render icon with correct props', () => {
    render(<Icon name="test-icon" size={32} color="red" className="test-class" />);
    
    const icon = screen.getByTestId('test-icon');
    expect(icon).toBeInTheDocument();
  });

  it('should warn when icon name is not found', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    render(<Icon name="non-existent-icon" />);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Ícone "non-existent-icon" não encontrado. Ícones disponíveis:',
      ['test-icon']
    );
    
    consoleSpy.mockRestore();
  });

  it('should return null for non-existent icon', () => {
    const { container } = render(<Icon name="non-existent-icon" />);
    expect(container.firstChild).toBeNull();
  });
}); 