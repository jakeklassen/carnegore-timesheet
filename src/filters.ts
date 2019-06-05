export const heading = (level: number) => (row: any) =>
  row.type === 'heading' && row.level === level;

export const heading1 = heading(1);
export const heading2 = heading(2);

export const paragraph = (row: any) => row.type === 'paragraph';

export const listitem = (row: any) => row.type === 'listitem';
