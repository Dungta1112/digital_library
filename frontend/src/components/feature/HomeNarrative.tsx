'use client';

import React, { useRef } from 'react';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';

export function HomeNarrative() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { gsap, ScrollTrigger, useIsomorphicLayoutEffect } = useScrollTrigger();

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray('.narrative-section');
      sections.forEach((section: any) => {
        gsap.fromTo(section, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1,
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play reverse play reverse"
            }
          }
        );
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, [gsap, ScrollTrigger]);

  return (
    <div ref={containerRef} className="space-y-48 py-32">
      <div className="narrative-section max-w-lg p-6 bg-white/80 backdrop-blur rounded-xl shadow-sm border">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6 text-2xl">📚</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Discover the Future of Learning</h2>
        <p className="text-lg text-gray-600 leading-relaxed">Access thousands of academic resources from a single, unified digital platform designed for modern education. Read, highlight, and save documents securely.</p>
      </div>
      
      <div className="narrative-section max-w-lg p-6 bg-white/80 backdrop-blur rounded-xl shadow-sm border">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6 text-2xl">🤖</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Assistant</h2>
        <p className="text-lg text-gray-600 leading-relaxed">Ask complex questions and receive deeply researched answers. Our AI provides precise citations directly linking back to source materials in the library.</p>
      </div>
      
      <div className="narrative-section max-w-lg p-6 bg-white/80 backdrop-blur rounded-xl shadow-sm border">
        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6 text-2xl">💬</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Collaborative Academic Forum</h2>
        <p className="text-lg text-gray-600 leading-relaxed">Engage in meaningful academic discussions. Join study groups, share knowledge seamlessly with your peers, and grow your network.</p>
      </div>
    </div>
  );
}
