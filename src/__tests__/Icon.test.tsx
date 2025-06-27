import React from 'react';
import { render, screen } from '@testing-library/react';
import { Icon } from '../Icon';

// Mock do mapping de ícones
jest.mock('../icons/mapping', () => ({
  iconMapping: {
    TestIcon: () => <svg data-testid="test-icon">Test Icon</svg>,
  },
  availableIcons: ['TestIcon'],
}));

describe('Icon Component', () => {
  it('should render icon with correct props', () => {
    render(<Icon name="TestIcon" size={32} color="red" className="test-class" />);
    
    const icon = screen.getByTestId('test-icon');
    expect(icon).toBeInTheDocument();
  });

  it('should warn when icon name is not found', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    render(<Icon name="NonExistentIcon" />);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Ícone "NonExistentIcon" não encontrado. Ícones disponíveis:',
      ['TestIcon']
    );
    
    consoleSpy.mockRestore();
  });

  it('should return null for non-existent icon', () => {
    const { container } = render(<Icon name="NonExistentIcon" />);
    expect(container.firstChild).toBeNull();
  });
}); 