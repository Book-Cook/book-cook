import type { Meta, StoryObj } from '@storybook/nextjs';
import HomePage from '../components/HomePage/HomePage';

const meta: Meta<typeof HomePage> = {
  title: 'Pages/HomePage',
  component: HomePage,
};
export default meta;

export const Default: StoryObj<typeof HomePage> = {};
