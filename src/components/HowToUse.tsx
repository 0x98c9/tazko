import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    title: 'Create a Group',
    description: 'Click "Create New Group" and enter a name for your subject or project.'
  },
  {
    title: 'Add Tasks',
    description: 'Click the "+" button in a group to add tasks. Fill in details like title, description, and tags.'
  },
  {
    title: 'Reorder',
    description: 'Drag and drop tasks or groups to reorder them as you like.'
  },
  {
    title: 'Export/Import',
    description: 'Use the Export menu to save your tasks or import them from a file.'
  },
  {
    title: 'Track Progress',
    description: 'Mark tasks as complete and view your statistics at a glance.'
  },
];

const HowToUse: React.FC = () => (
  <section id="how-to-use" className="py-20 px-2 sm:px-4 bg-background">
    <div className="container mx-auto max-w-5xl text-center">
      <h2 className="text-4xl font-bold mb-12">How to Use</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + idx * 0.15 }}
            className="glassmorphism p-6 sm:p-8 rounded-xl flex flex-col items-center shadow-lg w-full"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-purple/20 text-primary-purple text-2xl font-bold mb-4">
              {idx + 1}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
            <p className="text-gray-300 text-base">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowToUse;
