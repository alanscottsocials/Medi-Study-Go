import React from 'react';
import { Check, X } from 'lucide-react';

const Comparison = () => {
  const features = [
    "1. Mind maps",
    "2. Competitive Exam Focused",
    "3. Detailed illustrations",
    "4. Free flashcard & videos on app",
    "5. Last minute refresher",
    "6. Lower cognitive load"
  ];

  return (
    <section className="w-full bg-gradient-to-br from-[#c4b5fd] to-[#ddd6fe] py-[40px] md:py-[60px]">
      <div className="w-full px-[4%] md:px-[6%] mx-auto flex flex-col items-center lg:items-start">
        
        {/* Header Block */}
        <div className="bg-brand-dark text-white px-6 py-4 md:px-10 md:py-6 rounded-br-3xl lg:self-start w-full md:w-auto shadow-xl mb-12">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2 uppercase">
            What Makes Us Better?
          </h2>
          <p className="text-lg md:text-xl font-medium opacity-90">
            There's a reason why students ❤️ Medi Study Go
          </p>
        </div>

        {/* Comparison Table */}
        <div className="w-full max-w-5xl mx-auto bg-white/40 backdrop-blur-md rounded-3xl p-4 md:p-8 shadow-2xl border border-white/50">
          
          {/* Table Headers */}
          <div className="grid grid-cols-12 gap-2 md:gap-4 mb-4 items-end px-4">
            <div className="col-span-6 md:col-span-8"></div>
            <div className="col-span-3 md:col-span-2 flex justify-center text-center">
              <span className="font-black text-brand-dark text-sm md:text-lg leading-tight uppercase">
                Medi Study Go<br/>Books
              </span>
            </div>
            <div className="col-span-3 md:col-span-2 flex justify-center text-center">
              <span className="font-black text-red-600 text-sm md:text-lg leading-tight uppercase">
                Other<br/>Books
              </span>
            </div>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col gap-3">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`grid grid-cols-12 gap-2 md:gap-4 items-center px-4 py-4 rounded-2xl transition-all duration-300 hover:scale-[1.01] ${index % 2 === 0 ? 'bg-brand-dark/80' : 'bg-brand-dark/90'}`}
              >
                {/* Feature Name */}
                <div className="col-span-6 md:col-span-8">
                  <span className="text-white font-bold text-sm md:text-xl md:pl-2">
                    {feature}
                  </span>
                </div>

                {/* Check / Cross */}
                <div className="col-span-3 md:col-span-2 flex justify-center">
                  <div className="bg-green-500 rounded-full p-1 md:p-1.5 shadow-lg shadow-green-500/40">
                    <Check className="w-5 h-5 md:w-8 md:h-8 text-white stroke-[4]" />
                  </div>
                </div>
                
                <div className="col-span-3 md:col-span-2 flex justify-center">
                  <div className="bg-red-500 rounded-full p-1 md:p-1.5 shadow-lg shadow-red-500/40">
                    <X className="w-5 h-5 md:w-8 md:h-8 text-white stroke-[4]" />
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Comparison;
