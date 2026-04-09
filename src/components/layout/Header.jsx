import React from 'react';

const Header = () => {
  return (
    <header className="w-full">
      {/* Promo Bar */}
      <div className="w-full bg-brand-primary py-2 px-4 flex justify-center items-center gap-4">
        <span className="text-brand-dark font-bold text-sm tracking-wider uppercase">
          PROMO CODE
        </span>
        <div className="bg-white px-8 py-1 rounded-sm shadow-inner min-w-[120px]">
         12ABCXX
        </div>
      </div>
    </header>
  );
};

export default Header;
