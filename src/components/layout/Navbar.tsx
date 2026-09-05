'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { Container } from './Container';

interface NavbarProps {
  theme?: 'light' | 'dark';
}

export function Navbar({ theme = 'light' }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLight = theme === 'light';

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/about', label: 'ABOUT' },
    { href: '/community', label: 'COMMUNITY' },
    { href: '/projects', label: 'PROJECTS' },
    { href: '/events', label: 'EVENTS' },
    { href: '/blog', label: 'BLOG' },
  ];

  return (
    <header className={`w-full z-50 transition-colors ${isLight ? 'bg-[#F4F5F7] text-[#0A0D14] border-b border-[#E2E8F0]/60' : 'bg-[#060810] text-[#F1F5F9] border-b border-[#182238]'}`}>
      <Container className="flex items-center justify-between h-20">
        {/* Brand Monogram & Target Icon */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Minimalist Bullseye / Target Icon */}
            <div className={`w-[26px] h-[26px] rounded-full border-[2px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${isLight ? 'border-[#0A0D14]' : 'border-[#F1F5F9]'}`}>
              <div className={`w-[7px] h-[7px] rounded-full ${isLight ? 'bg-[#0A0D14]' : 'bg-[#F1F5F9]'}`} />
            </div>
            
            <div className="flex flex-col">
              <span className={`font-display font-black text-[15px] tracking-[0.14em] leading-none ${isLight ? 'text-[#0A0D14]' : 'text-[#FFFFFF]'}`}>
                GREVIX
              </span>
              <span className="text-[8.5px] font-mono tracking-[0.16em] text-[#64748B] uppercase leading-none mt-1 font-medium">
                STUDENT DRIVEN. IMPACT FOCUSED.
              </span>
            </div>
          </Link>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 font-mono text-[11.5px] tracking-[0.1em]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 font-medium transition-colors ${
                  isActive
                    ? isLight ? 'text-[#0A0D14] font-bold' : 'text-[#FFFFFF] font-bold'
                    : isLight ? 'text-[#64748B] hover:text-[#0A0D14]' : 'text-[#8092A8] hover:text-[#FFFFFF]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <div className="absolute -bottom-1.5 left-0 right-0 flex flex-col items-center pointer-events-none">
                    <span className={`w-full h-[1.5px] ${isLight ? 'bg-[#0A0D14]' : 'bg-[#38BDF8]'}`} />
                    <span className={`w-[3px] h-[3px] rounded-full mt-[3px] ${isLight ? 'bg-[#0A0D14]' : 'bg-[#38BDF8]'}`} />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action: Pill Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/community"
            className="inline-flex items-center gap-1.5 bg-[#0A0D14] hover:bg-[#1E293B] text-white px-5 py-2 rounded-full font-mono text-xs font-semibold tracking-wider transition-all duration-200 shadow-sm hover:shadow active:scale-95"
          >
            <span>JOIN GREVIX</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-xs font-mono px-3 py-1.5 border border-current rounded-full flex items-center gap-1"
          aria-label="Toggle Navigation Menu"
        >
          <span>{mobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
          <span className="text-[10px]">≡</span>
        </button>
      </Container>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-b px-6 py-4 font-mono text-xs space-y-2 ${isLight ? 'bg-[#F4F5F7] border-[#E2E8F0]' : 'bg-[#060810] border-[#182238]'}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#64748B] hover:text-[#0A0D14]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#E2E8F0] mt-2">
            <Link
              href="/community"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-1.5 bg-[#0A0D14] text-white px-4 py-2 rounded-full font-mono text-xs font-semibold tracking-wider"
            >
              <span>JOIN GREVIX</span>
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

