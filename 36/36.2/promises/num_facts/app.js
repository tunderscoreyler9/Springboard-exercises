let favNumber = 11;
let numsApiURL = "http://numbersapi.com";

// Number 1:
// $.getJSON(`${numsApiURL}/${favNumber}?json`).then(data => {
//     console.log(data);
// });

// for(let i = 1; i < 11; i++) {
//     $.getJSON(`${numsApiURL}/${i}?json`).then(data => {
//         console.log(data);
//     });
// };

// #######################################################################
// Number 2:
// let favNumbers = [9, 11, 13, 27, 94];
// $.getJSON(`${numsApiURL}/${favNumbers}?json`).then(data => {
//   console.log(data);
// });


// #######################################################################
// Number 3:
// Promise.all(
//     Array.from({ length: 4 }, () => {
//         return $.getJSON(`${numsApiURL}/${favNumber}?json`);
//     })
// ).then(facts => {
//     facts.forEach(data => $("body").append(`<p>${data.text}</p>`));
// });

// - - - - - - - - - 

Promise.all(
    Array.from({ length: 21 }, (_, i) => {
        return $.getJSON(`${numsApiURL}/${i + 1}?json`);
    })
).then(facts => {
    facts.forEach(data => {
        console.log(data);
        $("body").append(`<p>${data.text}</p>`);
    });
});

// - - - - - - - - -

// let specificArr = [11, 13, 21, 45];

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
