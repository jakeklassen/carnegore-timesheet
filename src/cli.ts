import { cac } from 'cac';
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
  .action((markdownFilePath, csvFilePath, options) => {
    console.log(markdownFilePath, csvFilePath, options);

    const markdownFile = fs.readFileSync(markdownFilePath).toString('utf-8');
    const ast = marked.parse(markdownFile);

    if (options.verbose === true) {
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

            return null;
          }

          const data = {
            titleData: row,
            logData: astRows.slice(
              idx,
              nextDayIdx === -1 ? astRows.length : nextDayIdx,
            ),
          };

          return data;
        }

        return null;
      })
      .filter(day => day != null)
      .map((day: any) => {
        const { titleData, logData }: { titleData: any; logData: any[] } = day;
        const row = [new Date(titleData.raw)];

        const tickets = logData.reduce((acc, el, idx, col) => {
          try {
            expect(el).toMatchObject({
              type: 'paragraph',
              text: expect.arrayContaining([
                expect.objectContaining({
                  type: 'link',
                  text: expect.arrayContaining([
                    expect.stringMatching(/(IOTP-\d+)/),
                  ]),
                }),
              ]),
            });

            const nextEl = col[idx + 1];

            expect(nextEl).toMatchObject({
              type: 'blockquote',
              quote: expect.arrayContaining([
                expect.objectContaining({
                  type: 'paragraph',
                  text: expect.arrayContaining([expect.any(String)]),
                }),
              ]),
            });

            const summary = nextEl.quote[0].text[0];

            return acc.concat({
              id: el.text[0].text[0],
              summary,
            });
          } catch (error) {
            return acc;
          }
        }, []);

        const tasks = logData.reduce((acc, el, idx, col) => {
          if (el.type === 'paragraph' && typeof el.text[0] === 'string') {
            if (el.text[0].startsWith('Tasks')) {
              const nextEl = col[idx + 1];

              if (nextEl.type === 'list') {
                return acc.concat(
                  ...nextEl.body
                    .filter(listitem)
                    .map((item: any) =>
                      item.text.filter((text: any) => text !== ''),
                    ),
                );
              }
            }
          }

          return acc;
        }, []);

        if (tickets.length === 0) {
          return null;
        }

        const hours = getHours(logData);

        return [
          ...row,
          [...tickets.map((ticket: any) => ticket.id)].join(' '),
          [...tickets.map((ticket: any) => ticket.summary), ...tasks].join(' '),
          hours,
        ];
      })
      .filter(row => row != null);

    console.log([
      [
        'Date (mm/dd/yyyy)',
        'Ticket # (optional)',
        'Description',
        'Total Hours',
      ],
      ...days,
    ]);
  });

cli.help();

if (module.parent == null) {
  cli.parse();
}
