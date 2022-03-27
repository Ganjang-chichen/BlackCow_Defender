const calculator = document.querySelector(".calculator");
const itemCounter = document.querySelector(".item-counter");
let currState = "로얄스타일";

// 로얄 똥사과 전용 html 생성기
function createItemSelectHtml(item) {

    if(!IsLoadingFinish()){
        return "";
    }

    let data;
    if(item === "로얄스타일") {
        data = RoyalStyleData;
    }else if(item === "골드애플"){
        data = GoldAppleData;
    }
    let opts = "";
    for(let i = 0; i < data.item_list.length; i++) {
        opts += `<option value="${i}">${data.item_list[i].name}</option>\n`;
    }
    let html = `
        <select class="item-select" onchange="selectItem(this.value)">
            <option value="x">${item}</option>
            ${opts}
        </select>
        <div class="item-selected">
            
        </div>
        <div class="item-p">
            
        </div>
        <div class="delete-btn-list">
            
        </div>
    `
    return html;
}

// 로얄 똥사과 선택
function itemButtonClick(value){
    calculator.innerHTML = createItemSelectHtml(value);
    let icon = itemCounter.querySelectorAll("img");
    if(value === "골드애플") {
        icon[0].src = "./img/독사과.png";
        icon[1].src = "./img/독사과.png";
    }else if(value === "로얄스타일") {
        icon[0].src = "./img/Royal.png";
        icon[1].src = "./img/Royal.png";
    }
    currState = value;
}

// 로얄, 똥사과 선택 시
function selectItem(value) {
    if(value === undefined || value === "x"){
        return
    }

    let item = RoyalStyleData.item_list[value];
    let list = calculator.querySelector(".item-selected").querySelectorAll("div");
    let ISEXIST = false;
    for(let i = 0; i < list.length; i++) {
        if(list[i].innerText === item.name) {
            ISEXIST = true;
            return;
        }
    }
    if(!ISEXIST) {
        calculator.querySelector(".item-selected").innerHTML += `<div>${item.name}</div>`;
        calculator.querySelector(".item-p").innerHTML += `<div>${item.p}</div>`;
        calculator.querySelector(".delete-btn-list").innerHTML += `<button class="delete-btn" onclick="clickDelete('${item.name}')">x</button>`;
    }
}

function clickDelete(name) {
    console.log("call" + name);

    let name_list = calculator.querySelector(".item-selected").querySelectorAll("div");
    let p_list = calculator.querySelector(".item-p").querySelectorAll("div");
    let btn_list = calculator.querySelector(".delete-btn-list").querySelectorAll("button");

    for(let i = 0; i < name_list.length; i++){
        if(name_list[i].innerText === name){
            name_list[i].parentNode.removeChild(name_list[i]);
            p_list[i].parentNode.removeChild(p_list[i]);
            btn_list[i].parentNode.removeChild(btn_list[i]);
        }
    }
}