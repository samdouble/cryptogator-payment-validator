import { expect } from 'chai';
import div from './div';

describe('div', () => {
  it('Should return the result of numerator divided by the denominator', async () => {
    expect(div(5, 2)).to.equal(2.5);
  });

  it('Should return null if denominator is 0', async () => {
    expect(div(5, 0)).to.equal(null);
  });
});
