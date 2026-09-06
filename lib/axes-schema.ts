import { z } from 'zod';
import type { Axis } from './local-engine';

export const axesSchema = z.object({
  axes: z.array(z.object({
    key: z.string(),
    label: z.string(),
    left: z.string(),
    right: z.string(),
  })).length(3),
});

export const AXES_SYSTEM = `You are the creative layer of an interface generation engine, built for professional designers who hate templated design. Given a design brief, decide which design dimensions are genuinely worth exploring for this specific case. Always return exactly 3 axes.

Each axis needs:
- key: short English identifier
- label: short English name (1-3 words), e.g. 'Density', 'Hierarchy', 'Order', 'Narrative focus'
- left / right: SHORT labels only (1-4 words), like 'Suspense-first' or 'Info wall'. No sentences. No explanations.

Good:
- label:'Narrative focus' left:'Evidence-first' right:'Suspense-first'
- label:'Density' left:'One line only' right:'Info wall'

Bad (never):
- left:'Light' right:'Dark'
- left:'Less' right:'More'
- any label that restates the user's brief as a sentence

Always return exactly 3 axes. Respond entirely in English.`;

export function refineAxesSystem(currentAxes: Axis[], refinement: string) {
  return `You are redefining a set of 3 design axes based on new user direction. 

Current axes: ${JSON.stringify(currentAxes)}
User's new direction: ${refinement}

Regenerate all 3 axes to reflect this new direction. You may 
keep an axis's theme if still relevant, or replace it entirely 
with a different dimension that better fits the new direction.

CRITICAL: left and right must be SHORT labels only (1-4 words),
like 'Suspense-first' or 'Info wall'. NEVER repeat, paraphrase, 
or reference the user's instruction text itself in the output. 
The labels must describe a concrete design choice, not restate 
what the user asked for.

Bad output (never do this): 
left: 'Rewrite toward suspense' 
right: 'More creative direction'

Good output:
left: 'Evidence-first'
right: 'Suspense-first'

Return exactly 3 axes.`;
}
