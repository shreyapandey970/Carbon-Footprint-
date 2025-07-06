export interface CarbonData {
  companyName: string;
  industrySector: string;
  scope1Emissions: number;
  scope2Emissions: number;
  scope3Emissions: number;
  energyConsumption: number;
  travelEmissions: number;
  wasteEmissions: number;
}

export interface HistoryEntry extends CarbonData {
  id: string;
  timestamp: string;
  totalEmissions: number;
  carbonScore: number | null;
}

export interface CarbonForecastData {
  forecastPeriod: string;
  forecastedEmissions: number;
  analysis: string;
}
