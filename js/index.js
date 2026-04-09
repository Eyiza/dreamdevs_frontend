const array = [2,4,5,6,9];
console.log(array)

let newArray = []
array.forEach((number) => {
    let ans = number*2;
    newArray.push(ans)
})
console.log(newArray)

let newArray2 = array.map(number => number * 2)
console.log(newArray2)

let newArray3 = array.filter(number => number % 2 === 0)
console.log(newArray3)

let newArray4 = array.reduce((accumulator, currentValue) => {
    return accumulator += currentValue;
})
console.log(newArray4)

let newArray5 = array.every((number) => number % 2 === 0)
console.log(newArray5)