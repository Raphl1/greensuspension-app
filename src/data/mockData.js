export const generateDailyEnergyData = () => {
  const data = [];
  let value = 5 + Math.random() * 5;
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    value += (Math.random() - 0.5) * 2;
    if (value < 0) value = 0;
    data.push({
      date: date.toLocaleDateString('de-DE'),
      kwh: parseFloat(value.toFixed(2)),
    });
  }
  return data;
};

export const ENERGY_PRICE_PER_KWH = 0.30; // 0,30 € pro kWh

export const ALERTS = [
    { id: 1, type: 'success', text: 'System funktioniert einwandfrei.', time: 'Vor 2 Minuten' },
    { id: 2, type: 'warning', text: 'Unregelmäßige Energiezufuhr zwischen 14:00 und 15:00 Uhr festgestellt.', time: 'Vor 3 Stunden' },
    { id: 3, type: 'info', text: 'Geplante Wartung für den 15.07.2025 bestätigt.', time: 'Vor 2 Tagen' },
];

export const MAINTENANCE_LOG = [
    { date: '12.01.2025', service: 'Jährliche Inspektion', technician: 'M. Mustermann' },
    { date: '15.01.2024', service: 'Erstinstallation & Inbetriebnahme', technician: 'M. Mustermann' },
];
