import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Manual sidebar to properly organize the robotics textbook
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Introduction',
      items: ['intro/01-why-physical-ai'],
    },
    {
      type: 'category',
      label: 'Module 1: Robotic Nervous System',
      items: ['module-1-robotic-nervous-system/01-ros2-fundamentals'],
    },
    {
      type: 'category',
      label: 'Module 2: Digital Twin',
      items: ['module-2-digital-twin/01-gazebo-simulations', 'module-2-digital-twin/02-unity-simulations'],
    },
    {
      type: 'category',
      label: 'Module 3: AI Robot Brain',
      items: ['module-3-ai-robot-brain/01-nvidia-isaac-integration'],
    },
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action',
      items: ['module-4-vision-language-action/01-perception'],
    },
    'context7-integration',
    'github-integration'
  ],
};

export default sidebars;
