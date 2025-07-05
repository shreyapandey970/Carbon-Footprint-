// src/ai/flows/reduction-suggestions.ts
'use server';
/**
 * @fileOverview Provides AI-powered suggestions for reducing a company's carbon footprint based on provided emissions data.
 *
 * - suggestReductionStrategies - A function that generates reduction suggestions based on company data.
 * - ReductionSuggestionsInput - The input type for the suggestReductionStrategies function.
 * - ReductionSuggestionsOutput - The return type for the suggestReductionStrategies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReductionSuggestionsInputSchema = z.object({
  companyName: z.string().describe('The name of the company.'),
  industrySector: z.string().describe('The industry sector of the company.'),
  scope1Emissions: z.number().describe('Scope 1 emissions in metric tons of CO2 equivalent.'),
  scope2Emissions: z.number().describe('Scope 2 emissions in metric tons of CO2 equivalent.'),
  scope3Emissions: z.number().describe('Scope 3 emissions in metric tons of CO2 equivalent.'),
  energyConsumption: z.number().describe('Total energy consumption in kWh.'),
  travelEmissions: z.number().describe('Emissions from business travel in metric tons of CO2 equivalent.'),
  wasteEmissions: z.number().describe('Emissions from waste generation in metric tons of CO2 equivalent.'),
});
export type ReductionSuggestionsInput = z.infer<typeof ReductionSuggestionsInputSchema>;

const ReductionSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of actionable suggestions for reducing emissions.'),
  overallAssessment: z.string().describe('A summary of the company performance based on collected data.'),
});
export type ReductionSuggestionsOutput = z.infer<typeof ReductionSuggestionsOutputSchema>;

export async function suggestReductionStrategies(input: ReductionSuggestionsInput): Promise<ReductionSuggestionsOutput> {
  return reductionSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reductionSuggestionsPrompt',
  input: {schema: ReductionSuggestionsInputSchema},
  output: {schema: ReductionSuggestionsOutputSchema},
  prompt: `You are an AI-powered sustainability consultant. Your task is to analyze a company's carbon footprint data and provide actionable suggestions for emissions reduction.

  Company Name: {{{companyName}}}
  Industry Sector: {{{industrySector}}}
  Scope 1 Emissions: {{{scope1Emissions}}} metric tons CO2e
  Scope 2 Emissions: {{{scope2Emissions}}} metric tons CO2e
  Scope 3 Emissions: {{{scope3Emissions}}} metric tons CO2e
  Energy Consumption: {{{energyConsumption}}} kWh
  Travel Emissions: {{{travelEmissions}}} metric tons CO2e
  Waste Emissions: {{{wasteEmissions}}} metric tons CO2e

  Based on this data, provide a list of specific, actionable suggestions for reducing emissions. Also, summarize the overall performance of the company.
  Consider industry best practices and innovative approaches to sustainability.
  The suggestions should be practical and tailored to the company's specific circumstances.
  The overall assessment should contain what is good, and what needs improvement.

  Output your answer in JSON format.
  `,
});

const reductionSuggestionsFlow = ai.defineFlow(
  {
    name: 'reductionSuggestionsFlow',
    inputSchema: ReductionSuggestionsInputSchema,
    outputSchema: ReductionSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
