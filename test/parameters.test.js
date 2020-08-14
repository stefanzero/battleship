const expect = require('chai').expect;
const parameters = require('../src/battleship/parameters');

const {shipTypes} = parameters;

/**
 * @test {parameters}
 */
describe('Parameters', function() {
  it('should have a total ship count of 7', function() {
    expect(parameters.totalCount).to.equal(7);
  });
  it('should have a total of 5 ship types', function() {
    expect(Object.keys(shipTypes).length).to.equal(5);
  })
});
