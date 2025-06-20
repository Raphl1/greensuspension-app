import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Sun, TrendingDown, Bell } from 'lucide-react';
import Card from '../components/Card';
import AlertItem from '../components/AlertItem';
import { ALERTS } from '../data/mockData';

// Simuliert das Abrufen von Daten
const generateDailyEnergyData = () => {
  const data = [];
  let value = 5 + Math.random() * 5;
  for (let i = 0; i < 30; i++) {
    value += (Math.random() - 0.5) * 2;
    if (value < 2) value = 2 + Math.random() * 2;
    if (value > 15) value = 15 - Math.random() * 2;
    data.push({ kwh: parseFloat(value.toFixed(2)) });
  }
  return data;
};

const ENERGY_PRICE_PER_KWH = 0.30;

const Dashboard = ({ userId }) => {
  const [energyData, setEnergyData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    setEnergyData(generateDailyEnergyData());
  }, []);
  
  const totalKWh = useMemo(() => energyData.reduce((acc, item) => acc + item.kwh, 0), [energyData]);
  const totalSavings = useMemo(() => totalKWh * ENERGY_PRICE_PER_KWH, [totalKWh]);

  const chartDimensions = { width: 500, height: 150 };

  const chartPoints = useMemo(() => {
    if (energyData.length < 2) return "";
    const maxVal = Math.max(...energyData.map(d => d.kwh), 0);
    
    return energyData.map((point, i) => {
        const x = (i / (energyData.length - 1)) * chartDimensions.width;
        const y = chartDimensions.height - (point.kwh / maxVal) * chartDimensions.height;
        return `${x},${y}`;
    }).join(' ');
  }, [energyData]);

  const handleMouseMove = (e) => {
    if (!chartRef.current || energyData.length === 0) return;
    const svgRect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const index = Math.round((x / svgRect.width) * (energyData.length - 1));
    if (index >= 0 && index < energyData.length) {
        setHoveredIndex(index);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };
  
  const getHoveredData = () => {
    if (hoveredIndex === null || !energyData[hoveredIndex]) return null;
    const maxVal = Math.max(...energyData.map(d => d.kwh), 0);
    const point = energyData[hoveredIndex];
    const x = (hoveredIndex / (energyData.length - 1)) * chartDimensions.width;
    const y = chartDimensions.height - (point.kwh / maxVal) * chartDimensions.height;
    return { x, y, kwh: point.kwh };
  };

  const hoveredData = getHoveredData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card icon={<Sun size={20} />} title="Erzeugte Energie (30 Tage)" value={totalKWh.toFixed(2)} unit="kWh" valueHasGradient={true} />
        <Card icon={<TrendingDown size={20} />} title="Geschätzte Ersparnis (30 Tage)" value={`€ ${totalSavings.toFixed(2)}`} unit="" valueHasGradient={true} />
      </div>
      <Card icon={<Bell size={20} />} title="System-Benachrichtigungen">
         <div className="space-y-3 mt-4">
            {ALERTS.map(alert => <AlertItem key={alert.id} {...alert} />)}
         </div>
      </Card>
       <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
         <h3 className="text-lg font-semibold text-white mb-4">Energieproduktion (letzte 30 Tage)</h3>
         <div 
            className="w-full cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            ref={chartRef}
        >
            {energyData.length > 1 ? (
              <svg viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height}`} className="w-full h-auto" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
                <path d={`M 0 ${chartDimensions.height} L ${chartPoints} L ${chartDimensions.width} ${chartDimensions.height} Z`} fill="url(#areaGradient)" />
                <path d={`M ${chartPoints}`} fill="none" stroke="url(#lineGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                
                {hoveredData && (
                    <g className="pointer-events-none">
                        <line x1={hoveredData.x} y1="0" x2={hoveredData.x} y2={chartDimensions.height} stroke="rgba(150, 150, 150, 0.3)" strokeWidth="1" strokeDasharray="3,3" />
                        <circle cx={hoveredData.x} cy={hoveredData.y} r="4" fill="#000" stroke="url(#lineGradient)" strokeWidth="2" />
                        <text 
                            x={hoveredData.x} 
                            y={hoveredData.y < 30 ? hoveredData.y + 25 : hoveredData.y - 15} // Positioniert den Text intelligent
                            textAnchor="middle" 
                            fill="white" 
                            fontSize="12" 
                            fontWeight="bold"
                            className="drop-shadow-lg"
                        >
                            {hoveredData.kwh.toFixed(2)} kWh
                        </text>
                    </g>
                )}
              </svg>
            ) : (
              <div className="h-48 flex items-center justify-center text-neutral-500">Daten werden geladen...</div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
