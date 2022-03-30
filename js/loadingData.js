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

let equipment_li = [
    "무기", "엠블렘", "보조무기(포스실드, 소울링 제외)", "포스실드, 소울링", "방패",
    "모자", "상의", "한벌옷", "하의", "신발", 
    "장갑", "망토", "벨트", "어깨장식", "얼굴장식",
    "눈장식", "귀고리", "반지", "펜던트", "기계심장"
]

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