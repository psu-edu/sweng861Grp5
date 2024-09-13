import { expect } from "chai";

describe("My test", function () {
  it('foo should be "bar"', function () {
    const foo = "bar";
    expect(foo).to.be.a("string");
    expect(foo).to.equal("bar");
    expect(foo).to.have.lengthOf(3);
  });
});
