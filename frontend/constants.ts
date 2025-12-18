import { Question } from './types';

export const QUESTIONS: Question[] = [
  { id: 1, key: 'emotion', text: 'How are you feeling right now? Use as many words as you like.', type: 'text' },
  { id: 2, key: 'trigger', text: 'What do you think might have caused or triggered this feeling?', type: 'text' },
  { id: 3, key: 'intensity', text: 'On a scale from 0 to 10, how strong is this feeling?', type: 'slider' },
  { id: 4, key: 'physical', text: 'Do you notice any physical reactions in your body right now?', type: 'text' },
  { id: 5, key: 'context', text: 'What’s been happening around you or in your life that might be affecting this?', type: 'text' },
  { id: 6, key: 'patterns', text: 'Does this remind you of a time in the past when you felt something similar?', type: 'text' },
  { id: 7, key: 'people', text: 'Who else is involved in this situation, if anyone?', type: 'text' },
  { id: 8, key: 'self_view', text: 'How does this experience make you see yourself, if at all?', type: 'text' },
  { id: 9, key: 'outcome', text: 'What would be the best resolution or outcome for you right now?', type: 'text' },
  { id: 10, key: 'plan', text: 'What steps are you thinking of taking next?', type: 'text' },
];
