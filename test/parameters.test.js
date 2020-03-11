const expect = require('chai').expect;
const should = require('chai').should();
const parameters = require('../src/battleship/parameters');

const {maxRows, maxColumns} = parameters;

describe('Parameters', function() {
  it('should have a total ship count of 7', function() {
    expect(parameters.totalCount).to.equal(7);
  })
});
