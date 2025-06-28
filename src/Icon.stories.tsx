import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import { getIconNames } from './Utils/getOptions';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  argTypes: {
    name: {
      options: getIconNames(),
      control: { type: 'select'}
    },
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

export const Default: Story = {
  args: {
    name: 'filled-action-add',
    size: 32,
    color: '#007bff',
  },
};
