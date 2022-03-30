const calculator = document.querySelector(".calculator");
const itemCounter = document.querySelector(".item-counter");
let currState = "none";
let currEquipment = "none";

function NOT_SELECTED_IMG() {
    let icon = itemCounter.querySelectorAll("img");
    icon[0].src = `./img/빈화면.png`;
    icon[1].src = `./img/빈화면.png`;
}
NOT_SELECTED_IMG();

//****************************** 로얄, 사과 화면 생성 **********************************

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
        <div class="item-container">
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
        </div>
    `
    return html;
}

// 로얄 똥사과 선택
function itemButtonClick(value){
    currState = value;
    calculator.innerHTML = createItemSelectHtml(value);
    let icon = itemCounter.querySelectorAll("img");
    if(value === "골드애플") {
        icon[0].src = "./img/독사과.png";
        icon[1].src = "./img/독사과.png";
    }else if(value === "로얄스타일") {
        icon[0].src = "./img/Royal.png";
        icon[1].src = "./img/Royal.png";
    }
}

// 로얄, 똥사과 목록 선택 시
function selectItem(value) {
    if(value === undefined || value === "x"){
        return
    }

    let item = {};
    if(currState === "골드애플") {
        item = GoldAppleData.item_list[value];
    }else if(currState === "로얄스타일") {
        item = RoyalStyleData.item_list[value];
    }

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
        calculator.querySelector(".item-p").innerHTML += `<div>${item.p}%</div>`;
        calculator.querySelector(".delete-btn-list").innerHTML += `<button class="delete-btn" onclick="clickDelete('${item.name}')">x</button>`;
    }
}

// 로얄, 골드에플 삭제버튼
function clickDelete(name) {

    let name_list = calculator.querySelector(".item-selected").querySelectorAll("div");
    let p_list = calculator.querySelector(".item-p").querySelectorAll("div");
    let btn_list = calculator.querySelector(".delete-btn-list").querySelectorAll("button");

    for(let i = 0; i < name_list.length; i++){
        if(name_list[i].innerText === name){
            name_list[i].parentNode.removeChild(name_list[i]);
            p_list[i].parentNode.removeChild(p_list[i]);
            btn_list[i].parentNode.removeChild(btn_list[i]);
            break;
        }
    }
}

//****************************** 큐브 화면 생성 **********************************

// 큐브 html 생성
function createCubeOptionSelectHTML(){

    if(!IsLoadingFinish){
        return;
    }
    
    let equipment_options = "";
    for(let i = 0; i < equipment_li.length; i++) {
        equipment_options += `<option value="${i}">${equipment_li[i]}</option>\n`;
    }

    let html = `
        <div class="select-equipment">
            <select class="equipment-option-select" onchange="showCubeOptions(this.value)">
                <option value="x">장비 종류 선택</option>
                ${equipment_options}
            </select>
        </div>
        <div class="cubeOption-select">
            <div>
                <select class="first-option-select" onchange="AddCubeOption(this.value, 'first')">
                    <option value="x">1줄 옵션 선택</option>
                </select>
                <div class="cubeOptionList-first">
                    
                </div>
            </div>
            <div>
                <select class="second-option-select" onchange="AddCubeOption(this.value, 'second')">
                    <option value="x">2줄 옵션 선택</option>
                </select>
                <div class="cubeOptionList-second">

                </div>
            </div>
            <div>
                <select class="third-option-select" onchange="AddCubeOption(this.value, 'third')">
                    <option value="x">3줄 옵션 선택</option>
                </select>
                <div class="cubeOptionList-third">

                </div>
            </div>
        </div>
    `
    return html;
}

// 큐브 클릭
function selectCube(value) {
    if(value === undefined || value === "x"){
        return
    }

    currState = value;
    let icon = itemCounter.querySelectorAll("img");
    icon[0].src = `./img/${value}.png`;
    icon[1].src = `./img/${value}.png`;
    calculator.innerHTML = createCubeOptionSelectHTML();

}

// 큐브 - 부위와 각 줄 에 맞는 select option html 생성
function createLineOptionSelectHTML(opt_li, line){
    let html = `<option value="x">${line}줄 옵션 선택</option>\n`
    for(let i = 0; i < opt_li.length; i++) {
        html += `<option value="${opt_li[i].option}&&&^^&&&${opt_li[i].p}">${opt_li[i].option}</option>\n`;
    }
    return html;
}

// 큐브 - 부위에 맞게 옵션 보여주기
function showCubeOptions(value){

    if(value === 'x') {
        currEquipment = "none";
        calculator.querySelector(".first-option-select").innerHTML = `<option value="x">1줄 옵션 선택</option>`;
        calculator.querySelector(".second-option-select").innerHTML = `<option value="x">2줄 옵션 선택</option>`;
        calculator.querySelector(".third-option-select").innerHTML = `<option value="x">3줄 옵션 선택</option>`;

        calculator.querySelector(".cubeOptionList-first").innerHTML = ``;
        calculator.querySelector(".cubeOptionList-second").innerHTML = ``;
        calculator.querySelector(".cubeOptionList-third").innerHTML = ``;
        return;
    }
    currEquipment = equipment_li[value];
    
    let data = CubeData[currState][equipment_li[value]];
    let first_option = data["첫 번째 옵션"];
    let second_option = data["두 번째 옵션"];
    let third_option = data["세 번째 옵션"];

    calculator.querySelector(".first-option-select").innerHTML = createLineOptionSelectHTML(first_option, 1);
    calculator.querySelector(".second-option-select").innerHTML = createLineOptionSelectHTML(second_option, 2);
    calculator.querySelector(".third-option-select").innerHTML = createLineOptionSelectHTML(third_option, 3);
    
    calculator.querySelector(".cubeOptionList-first").innerHTML = ``;
    calculator.querySelector(".cubeOptionList-second").innerHTML = ``;
    calculator.querySelector(".cubeOptionList-third").innerHTML = ``;
}

function AddCubeOption(value, idx) {
    if(value === "x" || currEquipment === "none") {
        return;
    }

    // 중복 제외
    let optionList = calculator.querySelectorAll(".cubeOption-" + idx);
    for(let i = 0; i < optionList.length; i++) {
        if(optionList[i].querySelector("div").innerText === value.split("&&&^^&&&")[0]){
            return;
        }
    }

    calculator.querySelector(".cubeOptionList-" + idx).innerHTML += `
        <div class="cubeOption-${idx}">
            <div>${value.split("&&&^^&&&")[0]}</div>
            <div>${value.split("&&&^^&&&")[1]}%</div>
            <button onclick="clickDelete_option(this)">x</button>
        </div>
    `
}

function clickDelete_option(node) {
    node.parentNode.parentNode.removeChild(node.parentNode);
}

