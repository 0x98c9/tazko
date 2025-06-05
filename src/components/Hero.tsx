import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, List } from 'lucide-react';

const Hero: React.FC<{ scrollToTaskBoard: () => void }> = ({ scrollToTaskBoard }) => {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden">
      <div className="container max-w-6xl mx-auto text-center z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-purple to-accent-softBlue bg-clip-text text-transparent">
              Tazko
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
          >
            Create, organize, and track your tasks with Tazko's modern task management system
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-6 flex flex-wrap gap-4 justify-center"
          >
            <Button 
              onClick={scrollToTaskBoard}
              size="lg" 
              className="bg-primary-purple hover:bg-primary-dark text-white btn-hover animate-pulse-glow"
            >
              <Check className="mr-2 h-5 w-5" />
              Create Your First Task
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary-purple text-primary-purple hover:bg-primary-purple/10 btn-hover"
              onClick={scrollToTaskBoard}
            >
              <List className="mr-2 h-5 w-5" />
              View Examples
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          {[
            {
              title: 'Organize by Categories',
              description: 'Group your tasks by subjects or projects for better organization',
              icon: '📂',
            },
            {
              title: 'Drag & Drop Interface',
              description: 'Easily reorder your tasks with an intuitive drag-and-drop interface',
              icon: '✋',
            },
            {
              title: 'Export & Share',
              description: 'Export your task lists as .txt or .pdf files to share with others',
              icon: '📤',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
              className="glassmorphism p-6 rounded-xl"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
