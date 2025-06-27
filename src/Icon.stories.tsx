import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  argTypes: {
    name: { control: 'text', description: 'Nome do ícone a ser renderizado' },
    size: { control: { type: 'number', min: 16, max: 64, step: 4 }, description: 'Tamanho do ícone em pixels' },
    color: { control: 'color', description: 'Cor do ícone' },
    className: { control: 'text', description: 'Classes CSS adicionais' },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const FilledActionAdd: Story = {
  args: {
    name: 'filled-action-add',
    size: 32,
    color: '#007bff',
  },
};

export const FilledActionCheck: Story = {
  args: {
    name: 'filled-action-check',
    size: 32,
    color: '#28a745',
  },
};

export const FilledBrandFacebook: Story = {
  args: {
    name: 'filled-brand-facebook',
    size: 32,
    color: '#1877f2',
  },
};

export const FilledAlertWarning: Story = {
  args: {
    name: 'filled-alert-warning',
    size: 32,
    color: '#ffc107',
  },
};

export const FilledContentGiftpricefair: Story = {
  args: {
    name: 'filled-content-giftpricefair',
    size: 32,
    color: '#e83e8c',
  },
};

export const Large: Story = {
  args: {
    name: 'filled-action-check',
    size: 64,
    color: '#28a745',
  },
};

export const Small: Story = {
  args: {
    name: 'filled-action-check',
    size: 16,
    color: '#28a745',
  },
}; 