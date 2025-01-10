'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function About() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-400 to-gray-300">
      {/* Navigation Header */}
      <nav className="bg-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <a href="/" className="text-white font-bold text-xl">Object Identifier</a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <a href="/about" className="text-white hover:text-gray-200 transition-colors">About</a>
              <a href="/contact" className="text-white hover:text-gray-200 transition-colors">Contact</a>
              <a href="/terms" className="text-white hover:text-gray-200 transition-colors">Terms</a>
            </div>

            {/* Mobile Navigation Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a
                  href="/about"
                  className="block text-white hover:bg-white/10 rounded-md px-3 py-2 transition-colors"
                >
                  About
                </a>
                <a
                  href="/contact"
                  className="block text-white hover:bg-white/10 rounded-md px-3 py-2 transition-colors"
                >
                  Contact
                </a>
                <a
                  href="/terms"
                  className="block text-white hover:bg-white/10 rounded-md px-3 py-2 transition-colors"
                >
                  Terms
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="p-4">
        <div className="max-w-3xl mx-auto mt-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-6">About Object Identifier</h1>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
                <p className="text-gray-700">
                  Object Identifier leverages cutting-edge AI technology to help users identify and learn about objects in their surroundings. Our mission is to make object recognition technology accessible and useful for everyone.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">How It Works</h2>
                <p className="text-gray-700">
                  Using Google&apos;s advanced Gemini 1.5 Flash model, our application can analyze images and provide detailed information about objects, including their features, characteristics, and potential uses. Whether you&apos;re a student, professional, or just curious about the world around you, our tool is designed to help you learn more about any object you encounter.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Technology</h2>
                <p className="text-gray-700">
                  Our application is built using modern web technologies including Next.js, React, and Tailwind CSS. We utilize the Google Gemini 1.5 Flash model for precise and rapid object identification and analysis.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Privacy & Security</h2>
                <p className="text-gray-700">
                  We take your privacy seriously. Images uploaded to our service are processed securely and are not stored on our servers. All analysis is performed in real-time using encrypted connections to ensure your data remains protected.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Creator</h2>
                <p className="text-gray-700">
                  This Piece of Software was created by <a href="https://instagram.com/4fiq.x" className="text-red-500 hover:underline">Afiq</a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}