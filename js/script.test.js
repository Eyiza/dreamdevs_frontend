const {getSum, subtract} = require("./script")();

const numberOne = 4;
const numberTwo = 5;
test("sum two numbers", () => {
    const result = getSum(numberOne, numberTwo);
    expect(result).toBe(9);
});

test("subtract two numbers", () => {
    const result = subtract(numberOne, numberTwo);
    expect(result).toBe(1);
});

// npm test to start the test.