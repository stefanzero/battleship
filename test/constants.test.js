const expect = require('chai').expect;
const should = require('chai').should();
const constants = require('../src/battleship/constants');

const {maxRows, maxColumns} = constants;

describe('Constants', function() {
  it('should have a total ship count of 7', function() {
    expect(constants.totalCount).to.equal(7);
  })
});
