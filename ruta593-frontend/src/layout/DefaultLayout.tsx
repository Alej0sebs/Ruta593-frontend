import React, { ReactNode } from 'react';
import Header from '../components/Header/index';

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="bg-[#ffffff] text-gray-800 min-h-screen">
      {/* === HEADER === */}
      <Header />

      {/* === CONTENIDO PRINCIPAL === */}
      <main className="mt-16 px-4 py-6">
        <div className="mx-auto max-w-screen-2xl">{children}</div>
      </main>
    </div>
  );
};

export default DefaultLayout;
