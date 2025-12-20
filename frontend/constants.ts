import { Question, MemoryItem } from './types';

export const QUESTIONS: Question[] = [
  { id: 1, key: 'emotion', text: 'How are you feeling right now? Use as many words as you like.', type: 'text' },
  { id: 2, key: 'trigger', text: 'What do you think might have caused or triggered this feeling?', type: 'text' },
  { id: 3, key: 'intensity', text: 'On a scale from 0 to 10, how strong is this feeling?', type: 'slider' },
  { id: 4, key: 'physical_effect', text: 'Do you notice any physical reactions in your body right now?', type: 'text' },
  { id: 5, key: 'context', text: 'What’s been happening around you or in your life that might be affecting this?', type: 'text' },
  { id: 6, key: 'patterns', text: 'Does this remind you of a time in the past when you felt something similar?', type: 'text' },
  { id: 7, key: 'related_people', text: 'Who else is involved in this situation, if anyone?', type: 'text' },
  { id: 8, key: 'self_view_effect', text: 'How does this experience make you see yourself, if at all?', type: 'text' },
  { id: 9, key: 'preferred_outcome', text: 'What would be the best resolution or outcome for you right now?', type: 'text' },
  { id: 10, key: 'plan_to_do', text: 'What steps are you thinking of taking next?', type: 'text' },
];

export const MOCK_MEMORIES: MemoryItem[] = [
  {
    id: '1',
    text: "Work deadlines often make you feel anxious and tense.",
    occurrenceCount: 5
  },
  {
    id: '2',
    text: "You tend to be hard on yourself during periods of high responsibility.",
    occurrenceCount: 3
  }
];