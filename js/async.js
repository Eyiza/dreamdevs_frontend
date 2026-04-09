console.log("I am the First");

setTimeout(() => {
    console.log("I am the Second");
}, 2000);

setTimeout(() => {
    console.log("I am the Third");
}, 3000);

console.log("I am the Fourth");

const PRODUCT_URL = "https://dummyjson.com/products";

// function getProducts(url) {
//     fetch(url)
//         .then((response) => response.json())
//         .then(data => {
//             console.log(data);
//         })
//         .catch(error => {
//             console.log(error);
//         });
// }

async function getProducts(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error)
    }
}


getProducts(PRODUCT_URL);