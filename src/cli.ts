import { cac } from 'cac';
import { createArrayCsvWriter } from 'csv-writer';
import expect from 'expect';
import fs from 'fs';
import marked from 'marked-ast';
import { heading1, heading2, listitem } from './filters';
import { getHours } from './lib';

const NAME = 'carnegore-timesheet';
const VERSION = '0.0.0';

export const cli = cac(NAME);

cli.version(VERSION);

cli
  .command('<markdown> <csv>', 'Convert worklog markdown file to csv')
  .option('--verbose', 'Log mardown AST', {
    default: false,
  })
  .usage(`${NAME} path/to/log.md path/to/log.csv`)
  .action(async (markdownFilePath, csvFilePath, options) => {
    const markdownFile = fs.readFileSync(markdownFilePath).toString('utf-8');
    const ast = marked.parse(markdownFile);

    if (options.verbose === true) {
      console.log(markdownFilePath, csvFilePath, options);
      console.dir(ast, { depth: null, colors: true });
    }

    const timesheet = {
      title: null,
      rows: [],
    };

    timesheet.title = ast.find(heading1).raw;

    const days = ast
      .map((row, idx, astRows) => {
        if (heading2(row)) {
          const nextDayIdx = astRows.findIndex(
            (_row, _idx) => _idx > idx && heading2(_row),
          );

          // If the start and end indices are only 1 apart, this would be an empty
          // day log. Log a warning and continue.
          if (nextDayIdx - idx === 1) {
            console.warn(`Empty day log! ${row.raw}`);

            return;
          }

          return {
            titleData: row,
            logData: astRows.slice(
              idx,
              nextDayIdx === -1 ? astRows.length : nextDayIdx,
            ),
          };
        }

        return;
      })
      .filter((day): day is { titleData: any; logData: any[] } => day != null)
      .map(day => {
        const { titleData, logData } = day;

        const tickets = logData.reduce((acc, el, idx, elements) => {
          try {
            const tuple = [el, elements[idx + 1]];

            expect(tuple).toEqual([
              expect.objectContaining({
                type: 'paragraph',
                text: expect.arrayContaining([
                  expect.objectContaining({
                    type: 'link',
                    text: expect.arrayContaining([
                      expect.stringMatching(/(IOTP-\d+)/),
                    ]),
                  }),
                ]),
              }),

              expect.objectContaining({
                type: 'blockquote',
                quote: expect.arrayContaining([
                  expect.objectContaining({
                    type: 'paragraph',
                    text: expect.arrayContaining([expect.any(String)]),
                  }),
                ]),
              }),
            ]);

            return acc.concat({
              id: el.text[0].text[0],
              summary: tuple[1].quote[0].text[0],
            });
          } catch (error) {
            return acc;
          }
        }, []);

        const tasks = logData.reduce((acc, el, idx, elements) => {
          try {
            const tuple = [el, elements[idx + 1]];

            expect(tuple).toEqual([
              expect.objectContaining({
                type: 'paragraph',
                text: expect.arrayContaining([expect.stringMatching(/^Tasks/)]),
              }),
              expect.objectContaining({
                type: 'list',
                body: expect.any(Array),
              }),
            ]);

            const items = tuple[1].body
              .filter(listitem)
              .map((item: any) => item.text.filter((text: any) => text !== ''));

            return acc.concat(items);
          } catch {
            return acc;
          }
        }, []);

        if (tickets.length === 0) {
          return null;
        }

        const hours = getHours(logData);

        return [
          new Date(titleData.raw),
          [...tickets.map((ticket: any) => ticket.id)].join(' '),
          [...tickets.map((ticket: any) => ticket.summary), ...tasks].join(' '),
          hours,
        ];
      })
      .filter((row): row is any[] => row != null);

    const csvWriter = createArrayCsvWriter({
      header: [
        'Date (mm/dd/yyyy)',
        'Ticket # (optional)',
        'Description',
        'Total Hours',
        'Month Total',
      ],
      path: csvFilePath,
    });

    const csvData = [
      ...days,
      ['', '', '', '', days.reduce((acc, [, , , hours]) => acc + hours, 0)],
    ];

    await csvWriter.writeRecords(csvData);

    console.log(csvData);
  });

cli.help();

if (module.parent == null) {
  cli.parse();
}
