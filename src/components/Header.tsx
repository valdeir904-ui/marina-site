'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, Menu, X } from 'lucide-react';

const InstagramIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const navLinks = [
  { href: '/#sobre', label: 'Sobre Mim' },
  { href: '/#especialidades', label: 'Especialidades' },
  { href: '/#abordagens', label: 'Abordagens' },
  { href: '/#videos', label: 'Vídeos' },
  { href: '/blog', label: 'Blog' },
];

interface HeaderProps {
  settings?: Record<string, string>;
}

export default function Header({ settings = {} }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappNumber = settings.whatsapp_number || '5516997712697';
  const whatsappMessage = encodeURIComponent(settings.whatsapp_message || 'Oi Marina! 🖐 Gostaria de agendar uma consulta de terapia!');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-warm-50/95 shadow-sm' : 'bg-warm-50/90'} backdrop-blur-md border-b border-warm-200/80`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="block">
          <span className="font-serif text-xl sm:text-2xl text-brand-700 tracking-tight block">
            Marina Falcão
          </span>
          <span className="text-[11px] text-slate-500 tracking-[0.14em] uppercase block">
            Psicóloga · CRP 06/162899
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand-700 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Button & Social */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-4 border-r border-warm-200 pr-6">
            <a
              href={settings.instagram_url || "https://instagram.com/marinafalcaopsi"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-brand-700 transition-colors p-1"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white px-5 py-2.5 rounded-full font-medium text-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Agendar sessão</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-brand-700 focus:outline-none"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-warm-50 border-t border-warm-200 px-4 pt-4 pb-6 space-y-1 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 text-base font-medium text-slate-800 hover:text-brand-700"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-2 border-t border-warm-200 mt-4">
            <a
              href={settings.instagram_url || "https://instagram.com/marinafalcaopsi"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-700 hover:text-brand-700 py-2 font-medium text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <InstagramIcon />
              <span>Instagram</span>
            </a>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white px-5 py-3 rounded-full font-medium text-sm transition-colors mt-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <MessageCircle className="w-5 h-5" />
            <span>Agendar pelo WhatsApp</span>
          </a>
        </div>
      )}
    </header>
  );
}
