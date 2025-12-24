// Chapter Index - Export all chapters
export { chapter1 } from './chapter1';
export { chapter2 } from './chapter2';
export { chapter3 } from './chapter3';
export { chapter4 } from './chapter4';
export { chapter5 } from './chapter5';
export { chapter6 } from './chapter6';
export { chapter7 } from './chapter7';
export { chapter8 } from './chapter8';
export { chapter9 } from './chapter9';

// Chapter type definition
export interface ChapterSection {
    heading: string;
    content: string;
}

export interface ChapterData {
    id: string;
    number: string;
    title: string;
    subtitle: string;
    color: string;
    sections: ChapterSection[];
    pullQuote: string;
}
