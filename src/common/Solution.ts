import { inspect } from 'util';

export default abstract class Solution {
  protected input: string[];

  constructor(input: string[] = []) {
    this.input = input;
  }

  abstract run(): Promise<void>;

  protected static inspect(o: any): string {
    return inspect(o, false, null, true);
  }
}
