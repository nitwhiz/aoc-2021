import SegmentController, {
  getSignal,
} from '../../src/08-seven-segment/Segment';

test('mapping', () => {
  const c = new SegmentController();

  const data =
    'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf';

  const signal = getSignal(data);

  c.processSignal(signal);
});
