'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    <header className={`w-full z-50 transition-colors ${isLight ? 'bg-[#F4F5F7] text-[#0A0D14]' : 'bg-[#060810] text-[#F1F5F9]'}`}>
      <Container className="flex items-center justify-between h-20">
        {/* Brand Monogram */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Aperture / Eclipse Icon */}
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#0A0D14] via-[#1E293B] to-[#38BDF8] p-[1.5px] flex items-center justify-center shadow-sm">
              <div className="w-full h-full rounded-full bg-[#0A0D14] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#E2E8F0] shadow-inner"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-base tracking-[0.25em] leading-tight">
                GREViX
              </span>
              <span className="text-[8px] font-mono tracking-widest text-[#64748B] uppercase leading-none mt-0.5">
                STUDENT DRIVEN. IMPACT FOCUSED.
              </span>
            </div>
          </Link>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 font-mono text-[11px] tracking-wider">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors ${
                  isActive
                    ? isLight ? 'text-[#0A0D14] font-bold' : 'text-[#FFFFFF] font-bold'
                    : isLight ? 'text-[#64748B] hover:text-[#0A0D14]' : 'text-[#8092A8] hover:text-[#FFFFFF]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isLight ? 'bg-[#0A0D14]' : 'bg-[#38BDF8]'}`} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Pair */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/community"
            className={`px-4 py-2 text-xs font-mono tracking-wider border rounded-[3px] transition-all flex items-center gap-1.5 ${
              isLight
                ? 'border-[#0A0D14] text-[#0A0D14] hover:bg-[#0A0D14] hover:text-[#FFFFFF]'
                : 'border-[#334155] text-[#F1F5F9] hover:border-[#6F9FFF]'
            }`}
          >
            <span>JOIN GREViX</span>
            <span className="text-sm leading-none">→</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${
              isLight ? 'border-[#CBD5E1] text-[#0A0D14] hover:border-[#0A0D14]' : 'border-[#1E293B] text-[#F1F5F9] hover:border-[#38BDF8]'
            }`}
            aria-label="Toggle menu"
          >
            <span className="text-sm font-mono">≡</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden text-xs font-mono px-2.5 py-1.5 border border-current rounded-[3px]"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? 'CLOSE' : 'MENU'}
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
            <Link href="/community" className="font-bold flex items-center gap-1">
              JOIN GREViX →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
