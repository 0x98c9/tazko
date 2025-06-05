import React from 'react';
import { Github, Twitter } from "lucide-react";

const Footer: React.FC = () => (
  <footer className="py-8 px-4 text-center text-gray-400 bg-background/80 border-t border-gray-800 relative z-10">
    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
      <span className="text-lg font-semibold text-primary-purple">Tazko &copy; {new Date().getFullYear()}</span>
      <span className="mx-2 hidden md:inline">|</span>
      <span className="text-sm">Built with ❤️ by Tazko</span>
      <span className="mx-2 hidden md:inline">|</span>
      <div className="flex gap-4 items-center justify-center mt-2 md:mt-0">
        <a href="https://github.com/0x98c9/" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-primary-purple transition-colors"><Github className="w-5 h-5" /></a>
        <a href="https://x.com/0x98c9/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-primary-purple transition-colors"><Twitter className="w-5 h-5" /></a>
      </div>
    </div>
  </footer>
);

export default Footer;
