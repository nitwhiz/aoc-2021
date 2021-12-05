import path from 'path';
import process from 'process';
import fs from 'fs-extra';

(async () => {
  const solution = process.argv[2]!;

  const SolutionClass = (
    await import(path.join(__dirname, solution, 'index.ts'))
  ).default;

  const filePath = path.join(__dirname, solution, 'input');

  console.log(`reading input from ${filePath}`);

  const input: string | string[] = fs
    .readFileSync(filePath)
    .toString('utf8')
    .trim()
    .split('\n');

  console.log(`running ${solution} ...`);
  console.log('');

  await new SolutionClass(input).run();

  console.log('');
  console.log('done.');
})();
