let favNumber = 11;
let numsApiURL = "http://numbersapi.com";

// Number 1:
// Make a request to the Numbers API to get a fact 
// about your favorite number. (Make sure you get back JSON by including 
// the json query key, specific to this API).

// PROMISE VERSION:

// $.getJSON(`${numsApiURL}/${favNumber}?json`).then(data => {
//     console.log(data);
// });

// for(let i = 1; i < 11; i++) {
//     $.getJSON(`${numsApiURL}/${i}?json`).then(data => {
//         console.log(data);
//     });
// };

// ASYNC / AWAIT VERSION:

// async function favNumberFact1() {
//     let data = await $.getJSON(`${numsApiURL}/${favNumber}?json`);
//     console.log(data);
// };
// favNumberFact1();




// #######################################################################
// Number 2:
// Figure out how to get data on multiple numbers in a single request. Make that request
// and when you get the data back, put all of the number facts on the page.


// PROMISE VERSION :
// let favNumbers = [9, 11, 13, 27, 94];
// $.getJSON(`${numsApiURL}/${favNumbers}?json`).then(data => {
//   console.log(data);
// });

// ASYNC / AWAIT VERSION:

// let favNumbers = [9, 11, 13, 27, 94];
// async function favNumberFacts2() {
//     let data = await $.getJSON(`${numsApiURL}/${favNumbers}?json`);
//     console.log(data);
// };
// favNumberFacts2();

// #######################################################################
// Number 3:


// Promise version: - - >
// Promise.all(
//     Array.from({ length: 4 }, () => {
//         return $.getJSON(`${numsApiURL}/${favNumber}?json`);
//     })
// ).then(facts => {
//     facts.forEach(data => $("body").append(`<p>${data.text}</p>`));
// });

// ASYNC / AWAIT VERSION - - >

async function part3() {
    let facts = await Promise.all(
        Array.from({ length: 4 }, () => $.getJSON(`${numsApiURL}/${favNumber}?json`))
    );

    facts.forEach(data => {
        $('body').append(`<p>${data.text}</p>`);
    });
};

// - - - - - - - - - 

// Promise.all() promise version - - >

// Promise.all(
//     Array.from({ length: 21 }, (_, i) => {
//         return $.getJSON(`${numsApiURL}/${i + 1}?json`);
//     })
// ).then(facts => {
//     facts.forEach(data => {
//         console.log(data);
//         $("body").append(`<p>${data.text}</p>`);
//     });
// });

// Promise.all() async / await version - - >

// async function part3v2() {
//     let facts = await Promise.all(
//         Array.from( {length: 21 }, (_, i) => {
//             return $.getJSON(`${numsApiURL}/${i + 1}?json`);
//         })
//     );

//     facts.forEach(data => {
//         console.log(data);
//         $('body').append(`<p>${data.text}</p>`);
//     });
// };

// - - - - - - - - -

// let specificArr = [11, 13, 21, 45];

// Promise.all() promise version - - >

// Promise.all(
//   Array.from({ length: specificArr.length }, (_, index) => {
//     const number = specificArr[index];
//     return $.getJSON(`${numsApiURL}/${number}?json`);
//   })
// ).then(facts => {
//   facts.forEach(data => {
//     console.log(data);
//     $("body").append(`<p>${data.text}</p>`);
//   });
// });

// Promise.all() async / await version - - >

let specificArr = [11, 13, 21, 45];

async function part3v3() {
    let facts = await Promise.all(
        Array.from( {length: specificArr.length }, (_, index) => {
            const number = specificArr[index];
            return $.getJSON(`${numsApiURL}/${number}?json`);
        })
    );

    facts.forEach(data => {
        console.log(data);
        $('body').append(`<p>${data.text}</p>`);
    });
};