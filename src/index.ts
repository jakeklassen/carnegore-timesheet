import { cli } from './cli';

export const run = async (argv: string[]) => {
  const [_bin, _script, ...args] = argv;

  cli.parse(argv);
};
