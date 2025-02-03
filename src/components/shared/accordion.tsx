import { useState } from "react";
import { Card } from "./card";

interface AccordionProps {
  children: React.ReactNode;
  title: string;
  defaultOpen?: boolean;
}

export function Accordion({ children, title, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const toggle = () => setIsOpen(!isOpen)

  return (
    <div className="rounded-base border-2 bg-white border-base-400 text-md font-base shadow-dark">
      <div 
        className="flex justify-between items-center w-full cursor-pointer p-4"
        onClick={toggle}
      >
        <p className="font-bold text-lg">{title}</p>
        <span className={`text-black text-xl transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`}>
          ▼
        </span>
      </div>
      <div 
        className={`grid transition-all duration-200 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className={`p-4 transition-opacity duration-200 ${isOpen ? 'opacity-100 transform-none' : 'opacity-0 '}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}