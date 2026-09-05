import React from 'react';
import Link from 'next/link';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="mt-auto bg-[#060810] border-t border-[#162032] text-[#8092A8] font-mono text-xs py-8">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#50627A]">
          {/* Left copyright */}
          <div className="flex items-center gap-2">
            <span className="text-[#8092A8]">© 2026 GREViX COMMUNITY</span>
          </div>

          {/* Center motto tag */}
          <div className="text-center text-[#64748B] tracking-wider">
            [ BUILT WITH PURPOSE. DRIVEN BY STUDENTS. ]
          </div>

          {/* Right links and crosshair icon */}
          <div className="flex items-center gap-5 text-[#8092A8]">
            <Link href="/privacy" className="hover:text-[#F1F5F9] transition-colors">PRIVACY</Link>
            <Link href="/terms" className="hover:text-[#F1F5F9] transition-colors">TERMS</Link>
            <Link href="/contact" className="hover:text-[#F1F5F9] transition-colors">CONTACT</Link>
            {/* Target / Crosshair Icon */}
            <span className="text-xs text-[#64748B] select-none pl-1" title="GREViX Target">
              ⊕
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
