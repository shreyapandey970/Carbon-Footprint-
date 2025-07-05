'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant carbon footprint metrics based on the user's industry sector.
 *
 * - suggestMetrics - A function that takes an industry sector as input and returns a list of suggested carbon footprint metrics.
 * - SuggestMetricsInput - The input type for the suggestMetrics function.
 * - SuggestMetricsOutput - The return type for the suggestMetrics function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMetricsInputSchema = z.object({
  industrySector: z
    .string()
    .describe('The industry sector of the company, e.g., manufacturing, retail, technology.'),
});
export type SuggestMetricsInput = z.infer<typeof SuggestMetricsInputSchema>;

const SuggestMetricsOutputSchema = z.object({
  suggestedMetrics: z
    .array(z.string())
    .describe('A list of suggested carbon footprint metrics relevant to the industry sector.'),
});
export type SuggestMetricsOutput = z.infer<typeof SuggestMetricsOutputSchema>;

export async function suggestMetrics(input: SuggestMetricsInput): Promise<SuggestMetricsOutput> {
  return suggestMetricsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMetricsPrompt',
  input: {schema: SuggestMetricsInputSchema},
  output: {schema: SuggestMetricsOutputSchema},
  prompt: `You are an AI assistant that suggests relevant carbon footprint metrics based on the company's industry sector.

  Given the following industry sector:
  {{industrySector}}

  Suggest a list of carbon footprint metrics that the company should track. The metrics should be specific and measurable.
  Return the metrics as a JSON array of strings.
  `,
});

const suggestMetricsFlow = ai.defineFlow(
  {
    name: 'suggestMetricsFlow',
    inputSchema: SuggestMetricsInputSchema,
    outputSchema: SuggestMetricsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
