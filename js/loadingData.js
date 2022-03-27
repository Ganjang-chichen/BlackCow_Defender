let IsCubeDataLoadFin = false;
let IsRoyalDataLoadFin = false;
let IsAppleDataLoadFin = false;

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
    GoldAppleData = jsondata;
    console.log(get_delay_time());
    IsAppleDataLoadFin =  true;
});

fetch("./data/RoyalStyle.json")
.then((res) => {
    return res.json();
})
.then(jsondata => {
    RoyalStyleData = jsondata;
    console.log(get_delay_time());
    IsRoyalDataLoadFin = true;
});

fetch("./data/CubeData.json")
.then((res) => {
    return res.json();
})
.then(jsondata => {
    CubeData = jsondata;
    console.log(get_delay_time());
    IsCubeDataLoadFin = true;
});

function IsLoadingFinish() {
    return IsCubeDataLoadFin && IsRoyalDataLoadFin && IsAppleDataLoadFin;
}