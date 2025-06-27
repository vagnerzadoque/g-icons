import type { Meta, StoryObj } from '@storybook/react';
import { Icon, IconList } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Nome do ícone a ser renderizado',
    },
    size: {
      control: { type: 'number', min: 16, max: 64, step: 4 },
      description: 'Tamanho do ícone em pixels',
    },
    color: {
      control: 'color',
      description: 'Cor do ícone',
    },
    className: {
      control: 'text',
      description: 'Classes CSS adicionais',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'FilledActionAdd',
    size: 24,
    color: '#007bff',
  },
};

export const Large: Story = {
  args: {
    name: 'FilledActionCheck',
    size: 48,
    color: '#28a745',
  },
};

export const Small: Story = {
  args: {
    name: 'FilledActionDelete',
    size: 16,
    color: '#dc3545',
  },
};

export const CustomColor: Story = {
  args: {
    name: 'FilledBrandFacebook',
    size: 32,
    color: '#1877f2',
  },
};

// Story para o IconList
const iconListMeta: Meta<typeof IconList> = {
  title: 'Components/IconList',
  component: IconList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'number', min: 16, max: 64, step: 4 },
    },
    color: {
      control: 'color',
    },
    onIconClick: {
      action: 'icon-clicked',
    },
  },
};

export const IconGallery: StoryObj<typeof IconList> = {
  args: {
    size: 32,
    color: '#333',
  },
}; 