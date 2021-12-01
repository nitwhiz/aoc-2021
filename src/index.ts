import path from 'path';
import process from 'process';

(async () => {
  const solution = process.argv[2]!;

  const SolutionClass = (
    await import(path.join(__dirname, solution, 'index.ts'))
  ).default;

  console.log(`running ${solution} ...`);
  console.log('');

  await new SolutionClass().run();

  console.log('');
  console.log('done.');
})();
