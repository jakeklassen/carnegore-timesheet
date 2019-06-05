import expect from 'expect';

export const getHours = (elements: any[]): number => {
  const element = elements.find(element => {
    try {
      expect(element).toMatchObject({
        type: 'paragraph',
        text: expect.arrayContaining([
          expect.objectContaining({
            type: 'codespan',
            text: expect.stringMatching(/^hours: \d/i),
          }),
        ]),
      });

      return true;
    } catch {
      return false;
    }
  });

  if (element == null) {
    return 8;
  }

  const hoursText: string = element.text[0].text.replace('hours:', '').trim();
  return parseFloat(hoursText);
};

export const getSummary = (elements: any[]) => {
  const element = elements.find(element => {
    try {
      expect(element).toMatchObject({
        type: 'paragraph',
        text: expect.arrayContaining([
          expect.objectContaining({
            type: 'blockquote',
            text: expect.arrayContaining([
              expect.stringMatching(/^hours: \d/i),
            ]),
          }),
        ]),
      });

      return true;
    } catch {
      return false;
    }
  });

  return element.text[0].text[0];
};

export const getTicketId = (elements: any[]) => {
  const element = elements.find(element => {
    try {
      expect(element).toMatchObject({
        type: 'paragraph',
        text: expect.arrayContaining([
          expect.objectContaining({
            type: 'link',
            text: expect.arrayContaining([expect.stringMatching(/(IOTP-\d+)/)]),
          }),
        ]),
      });

      return true;
    } catch {
      return false;
    }
  });

  return element.text[0].text[0];
};
