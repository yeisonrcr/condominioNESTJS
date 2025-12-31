/**
 * COMPONENTE LAYOUT BASE
 * Layout con header y main content
 */

import React from 'react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      {children}
    </div>
  );
};

interface LayoutHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const LayoutHeader: React.FC<LayoutHeaderProps> = ({ children, className }) => {
  return (
    <header className={cn('bg-white shadow-sm', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {children}
      </div>
    </header>
  );
};

interface LayoutContentProps {
  children: React.ReactNode;
  className?: string;
}

export const LayoutContent: React.FC<LayoutContentProps> = ({ children, className }) => {
  return (
    <main className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8', className)}>
      {children}
    </main>
  );
};