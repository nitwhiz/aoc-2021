import fs from 'fs-extra';
import path from 'path';

interface InputSettings {
  /**
   * input is linewise
   */
  lines?: boolean;
  /**
   * keep empty lines in input
   */
  keepEmpty?: boolean;
}

export const input = (
  directory: string,
  settings: InputSettings = {},
): Function => {
  return (target: Object, propertyKey: string) => {
    const filePath = path.join(__dirname, '../', directory, 'input');

    const config: InputSettings = {
      lines: true,
      keepEmpty: false,
      ...settings,
    };

    console.log(`reading file ${filePath}`);

    let value: string | string[] = fs.readFileSync(filePath).toString('utf8');

    if (config.lines) {
      value = value.split('\n');

      if (!config.keepEmpty) {
        value = value.filter((v) => v !== '');
      }
    }

    Object.defineProperty(target, propertyKey, {
      value,
    });
  };
};

export const output = (
  solutionName: string,
  filename: string = 'output',
): Function => {
  return (target: Object, propertyKey: string) => {
    let value: any = undefined;
    let debounceTimeout: -1 | NodeJS.Timeout = -1;

    Object.defineProperty(target, propertyKey, {
      get: () => {
        return value;
      },
      set: (newValue: any) => {
        value = newValue;

        new Promise<void>((resolve) => {
          if (debounceTimeout !== -1) {
            clearTimeout(debounceTimeout);
            debounceTimeout = -1;
          }

          debounceTimeout = setTimeout(() => {
            const outputFilePath = path.join(
              __dirname,
              '../',
              solutionName,
              filename,
            );

            console.log(`flushing output to file ${outputFilePath}`);

            fs.writeFileSync(
              outputFilePath,
              JSON.stringify(value, null, 2),
              'utf8',
            );

            debounceTimeout = -1;
          }, 100);

          resolve();
        }).then(() => void 0);
      },
    });
  };
};

export const cached = () => {};
