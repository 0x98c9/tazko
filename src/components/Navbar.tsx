import React, { useState } from 'react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from './ui/navigation-menu';
import { Github, Twitter, Menu } from "lucide-react";

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full py-4 px-4 md:px-6 bg-background/80 backdrop-blur border-b border-gray-800 fixed top-0 left-0 z-50">
      <div className="container mx-auto flex flex-row items-center justify-between gap-4 md:gap-0">
        <span className="text-2xl font-bold text-primary-purple flex-1 md:flex-none text-left">Tazko</span>
        {/* Mobile menu toggle button */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-purple"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <Menu className="w-7 h-7" />
        </button>
        {/* Desktop menu */}
        <div className="hidden md:flex flex-row items-center gap-4 w-full md:w-auto">
          <NavigationMenu>
            <NavigationMenuList className="flex flex-row items-center w-full md:w-auto">
              <NavigationMenuItem>
                <NavigationMenuLink href="#features" className="px-4 py-2 w-full md:w-auto text-center">Features</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#taskboard" className="px-4 py-2 w-full md:w-auto text-center">Task Board</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#how-to-use" className="px-4 py-2 w-full md:w-auto text-center">How to Use</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex gap-4 items-center justify-center md:ml-6">
            <a href="https://github.com/0x98c9/" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-primary-purple transition-colors"><Github className="w-6 h-6" /></a>
            <a href="https://x.com/0x98c9/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-primary-purple transition-colors"><Twitter className="w-6 h-6" /></a>
          </div>
        </div>
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background/95 shadow-lg border-b border-gray-800 animate-fade-in z-50">
            <div className="flex flex-col items-center gap-2 py-4">
              <a href="#features" className="block px-4 py-2 w-full text-center hover:text-primary-purple transition-colors" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#taskboard" className="block px-4 py-2 w-full text-center hover:text-primary-purple transition-colors" onClick={() => setMobileMenuOpen(false)}>Task Board</a>
              <a href="#how-to-use" className="block px-4 py-2 w-full text-center hover:text-primary-purple transition-colors" onClick={() => setMobileMenuOpen(false)}>How to Use</a>
              <div className="flex gap-6 mt-4">
                <a href="https://github.com/0x98c9/" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-primary-purple transition-colors"><Github className="w-6 h-6" /></a>
                <a href="https://x.com/0x98c9/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-primary-purple transition-colors"><Twitter className="w-6 h-6" /></a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
