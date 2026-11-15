import { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function WorkspaceLayout({ title, children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Navbar
          title={title}
          onOpenMenu={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          {children}
        </main>
      </div>
    </div>
  );
}
