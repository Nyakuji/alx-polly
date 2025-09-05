export type MockPollOption = {
  id: string;
  text: string;
};

export type MockPoll = {
  id: string;
  title: string;
  description?: string;
  options: MockPollOption[];
};

const MOCK_POLLS: MockPoll[] = [
  {
    id: '1',
    title: 'What is your favorite frontend framework?',
    description: 'Pick one option to cast your vote.',
    options: [
      { id: 'react', text: 'React' },
      { id: 'vue', text: 'Vue' },
      { id: 'svelte', text: 'Svelte' },
      { id: 'angular', text: 'Angular' },
    ],
  },
  {
    id: '2',
    title: 'Preferred CSS strategy?',
    description: 'Utilities, components, or something else?',
    options: [
      { id: 'tailwind', text: 'Tailwind CSS' },
      { id: 'css-modules', text: 'CSS Modules' },
      { id: 'styled-components', text: 'Styled Components' },
      { id: 'vanilla', text: 'Vanilla CSS' },
    ],
  },
];

export function getMockPollById(id: string): MockPoll | null {
  return MOCK_POLLS.find(p => p.id === id) ?? null;
}


