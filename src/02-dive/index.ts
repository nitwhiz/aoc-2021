import Solution from '@/common/Solution';

export default class Dive extends Solution {
  public async run(): Promise<void> {
    const pos = {
      x: 0,
      y: 0,
      aim: 0,
    };

    for (const line of this.input) {
      const [cmd, arg] = line.split(' ');

      switch (cmd) {
        case 'forward':
          pos.x += Number(arg);
          pos.y += Number(arg) * pos.aim;
          break;
        case 'down':
          pos.aim += Number(arg);
          break;
        case 'up':
          pos.aim -= Number(arg);
          break;
        default:
          console.error(`unknown command '${cmd}' (arg: ${arg})`);
          return;
      }
    }

    console.log(pos.x * pos.y);
  }
}
