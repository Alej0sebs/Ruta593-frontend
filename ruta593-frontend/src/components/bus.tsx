import React from 'react';
import DriverSeat from '../images/icon/DriverSeat.svg';
import Door from '../images/icon/Door.svg';

interface BusTemplateProps {
  children: React.ReactNode;
  floorNumber: number;
}

const BusTemplate: React.FC<BusTemplateProps> = ({ children, floorNumber }) => {
  return (
    <div className="relative w-full h-full border border-gray-300 bg-white max-w-xs mx-auto rounded-2xl overflow-hidden">
      {floorNumber === 1 && (
        <div className="flex justify-between items-center p-2 border-b border-gray-300 bg-gray-100">
          <div className="w-12 h-12 min-h-[50px] flex items-center justify-center rounded-full">
            <img src={DriverSeat} alt="Driver Seat Icon" className="h-12" />
          </div>
          <div className="w-20 h-12 min-h-[50px] flex items-center justify-center rounded">
            <img src={Door} alt="Door side" className="h-12 w-20"/>
          </div>
        </div>
      )}
      <div className={`p-4 ${floorNumber !== 1 ? 'h-full' : ''}`}>
        {children}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-100"></div>
    </div>
  );
};

export default BusTemplate;
