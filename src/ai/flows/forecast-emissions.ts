'use server';
/**
 * @fileOverview Provides AI-powered carbon emissions forecasting.
 *
 * - getCarbonForecast - A function that generates a forecast based on company data.
 * - ForecastInput - The input type for the getCarbonForecast function.
 * - ForecastOutput - The return type for the getCarbonForecast function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForecastInputSchema = z.object({
  companyName: z.string().describe('The name of the company.'),
  industrySector: z.string().describe('The industry sector of the company.'),
  scope1Emissions: z.number().describe('Scope 1 emissions in metric tons of CO2 equivalent.'),
  scope2Emissions: z.number().describe('Scope 2 emissions in metric tons of CO2 equivalent.'),
  scope3Emissions: z.number().describe('Scope 3 emissions in metric tons of CO2 equivalent.'),
  energyConsumption: z.number().describe('Total energy consumption in kWh.'),
  travelEmissions: z.number().describe('Emissions from business travel in metric tons of CO2 equivalent.'),
  wasteEmissions: z.number().describe('Emissions from waste generation in metric tons of CO2 equivalent.'),
});
export type ForecastInput = z.infer<typeof ForecastInputSchema>;

const ForecastOutputSchema = z.object({
  forecastPeriod: z.string().describe('The period for the forecast (e.g., "Next Quarter").'),
  forecastedEmissions: z.number().describe('The forecasted total emissions in metric tons of CO2e.'),
  analysis: z.string().describe('A brief analysis of the forecast and contributing factors.'),
});
export type ForecastOutput = z.infer<typeof ForecastOutputSchema>;

export async function getCarbonForecast(input: ForecastInput): Promise<ForecastOutput> {
  return forecastEmissionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastEmissionsPrompt',
  input: {schema: ForecastInputSchema},
  output: {schema: ForecastOutputSchema},
  prompt: `You are a sustainability data analyst. Based on the provided company data for the last reporting period, forecast their total carbon emissions (Scope 1 + Scope 2 + Scope 3) for the next quarter.

  Company Data:
  - Company Name: {{{companyName}}}
  - Industry Sector: {{{industrySector}}}
  - Scope 1 Emissions: {{{scope1Emissions}}} metric tons CO2e
  - Scope 2 Emissions: {{{scope2Emissions}}} metric tons CO2e
  - Scope 3 Emissions: {{{scope3Emissions}}} metric tons CO2e
  - Energy Consumption: {{{energyConsumption}}} kWh
  - Travel Emissions: {{{travelEmissions}}} metric tons CO2e
  - Waste Emissions: {{{wasteEmissions}}} metric tons CO2e

  Assume their current operations continue without significant changes.
  Provide a brief analysis of the key drivers for this forecast.
  The forecast period should be "Next Quarter".
  Calculate the forecastedEmissions by summing the scope emissions, and add a small random variance (+/- 5%) to simulate real-world fluctuations for the next quarter.
  Output your answer in JSON format.
  `,
});

const forecastEmissionsFlow = ai.defineFlow(
  {
    name: 'forecastEmissionsFlow',
    inputSchema: ForecastInputSchema,
    outputSchema: ForecastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
