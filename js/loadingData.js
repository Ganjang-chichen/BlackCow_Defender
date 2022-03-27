const start = Date.now();

function get_delay_time(){
    return Date.now() - start;
}


let GoldAppleData = {};
let RoyalStyleData = {};
let CubeData = {};

fetch("./data/GoldApple.json")
.then((res) => {
    return res.json();
})
.then(jsondata => {
    console.log(jsondata);
    console.log(get_delay_time());
});

fetch("./data/RoyalStyle.json")
.then((res) => {
    return res.json();
})
.then(jsondata => {
    console.log(jsondata);
    console.log(get_delay_time());
});

fetch("./data/CubeData.json")
.then((res) => {
    return res.json();
})
.then(jsondata => {
    console.log(jsondata);
    console.log(get_delay_time());
});