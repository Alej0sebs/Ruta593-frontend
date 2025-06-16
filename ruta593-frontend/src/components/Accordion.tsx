import React, { useState, ReactNode } from 'react';
import { Plus, Minus } from 'lucide-react';

interface AccordionProps {
  title: string;
  color: string;
  children: ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, color, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border rounded-md mb-2.5" style={{ borderColor: color }}>
      <div 
        onClick={toggleAccordion} 
        className="flex justify-between items-center p-2.5 cursor-pointer"
        style={{ backgroundColor: color, color: '#fff' }}
      >
        <span>{title}</span>
        {isOpen ? (
          <Minus className="w-5 h-5" />
        ) : (
          <Plus className="w-5 h-5" />
        )}
      </div>
      {isOpen && (
        <div className="bg-white dark:bg-boxdark p-5 rounded">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;