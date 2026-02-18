'use client';

import { MapPin } from 'lucide-react';

export default function HospitalFinder() {
  const handleFindHospital = () => {
    window.open('https://www.google.com/maps/search/hospital+near+me', '_blank');
  };

  return (
    <button
      onClick={handleFindHospital}
      className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-4 px-5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl font-bold text-base group"
    >
      <div className="bg-white/20 p-2 rounded-xl group-hover:scale-110 transition-transform">
        <MapPin size={22} />
      </div>
      <span>Find Nearest Hospital</span>
    </button>
  );
}
