import React from 'react';
import { Phone, Mail, Play, Apple } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#c5bee9] pt-16 pb-8 md:pt-20 border-t border-brand-dark/10">
      <div className="w-full  mx-auto px-[4%] md:px-[6%]">

        {/* Top Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-8 mb-12">

          {/* Column 1: Branding & Intro */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-6">
              <img src="/solologo.webp" alt="Medi Study Go" className="h-12 md:h-16 w-auto object-contain" />
              <span className="text-2xl md:text-4xl font-black text-brand-dark tracking-tight">Medi Study Go</span>
            </div>
            <p className="text-xl md:text-[22px] font-medium text-brand-dark/80 leading-snug mb-8 max-w-md">
              India's trusted learning platform for students - built by doctors and educators, loved by toppers.
            </p>
            {/* Buttons Grid */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              {['BDS', 'MBBS', 'NURSING', 'BPT'].map(course => (
                <button key={course} className="bg-brand-dark text-white rounded-full py-2.5 px-6 font-bold text-center hover:bg-opacity-90 transition shadow-md">
                  {course}
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="lg:col-span-3 flex flex-col">
            <h3 className="text-xl md:text-2xl font-black text-brand-dark border-l-[6px] border-[#a196ce] pl-3 mb-6 uppercase tracking-wider">
              Explore
            </h3>
            <ul className="space-y-4">
              {['MBBS Bundles', 'BDS Bundles', 'PRO Pass', 'NEET MDS prep', 'Subject wise books'].map(link => (
                <li key={link}>
                  <a href="#" className="text-lg md:text-xl font-bold text-brand-dark hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="lg:col-span-3 flex flex-col">
            <h3 className="text-xl md:text-2xl font-black text-brand-dark border-l-[6px] border-[#a196ce] pl-3 mb-6 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {['About Medistudygo', 'Home', 'FAQs', 'Contact Us'].map(link => (
                <li key={link}>
                  <a href="#" className="text-lg md:text-xl font-bold text-brand-dark hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Contact Card */}
        <div className="bg-[#f2f0f5] rounded-xl p-6 md:p-10 shadow-lg flex flex-col lg:flex-row justify-between gap-10">

          {/* Left: Address */}
          <div className="max-w-lg">
            <h3 className="text-xl md:text-2xl font-black text-brand-dark border-l-[6px] border-[#a196ce] pl-3 mb-6 uppercase tracking-wider">
              Get In Touch
            </h3>
            <h4 className="text-xl font-bold text-brand-dark mb-2">Our address</h4>
            <p className="text-lg text-brand-dark/80 font-medium leading-relaxed">
              Kumar Plaza, Kalina Kurla Rd, near Market, Jamlipada, Kunchi Kurve Nagar, Kalina, Santacruz, Mumbai, Maharashtra 400029
            </p>
          </div>

          {/* Right: Contact & App */}
          <div className="flex flex-col gap-6">

            {/* Phone */}
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="bg-brand-dark p-2 rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-medium text-brand-dark/90 group-hover:text-brand-dark transition-colors">
                +91 91377 82263
              </span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="bg-brand-dark p-2 rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-medium text-brand-dark/90 group-hover:text-brand-dark transition-colors">
                support@medistudygo.com
              </span>
            </div>

            {/* App Badges */}
            <div className="mt-2">
              <h4 className="text-lg font-bold text-brand-dark mb-3 uppercase tracking-widest">APP</h4>
              <div className="flex flex-wrap gap-4">
                {/* Google Play */}
                <button className="bg-black text-white flex items-center gap-3 px-4 py-2 rounded-lg hover:scale-105 transition-transform active:scale-95 shadow-md">
                  <Play className="w-8 h-8 fill-current" />
                  <div className="text-left flex flex-col justify-center leading-none">
                    <span className="text-[10px] uppercase font-semibold">GET IT ON</span>
                    <span className="text-xl font-bold -mt-0.5">Google Play</span>
                  </div>
                </button>

                {/* App Store */}
                <button className="bg-black text-white flex items-center gap-3 px-4 py-2 rounded-lg hover:scale-105 transition-transform active:scale-95 shadow-md">
                  <Apple className="w-8 h-8 fill-current" />
                  <div className="text-left flex flex-col justify-center leading-none">
                    <span className="text-[10px] lowercase font-semibold">Download on the</span>
                    <span className="text-xl font-bold -mt-0.5">App Store</span>
                  </div>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
