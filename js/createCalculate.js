const calculator = document.querySelector(".calculator");
let currState = "none";
let currEquipment = "none";

function NOT_SELECTED_IMG() {
    try {
        let itemCounter = document.querySelector(".item-counter");
        let icon = itemCounter.querySelectorAll("img");
        icon[0].src = `./img/빈화면.png`;
        icon[1].src = `./img/빈화면.png`;
    }
    catch(e) {

    }
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
    let itemCounter = document.querySelector(".item-counter");
    
    
    let img_src = "";
    if(value === "로얄스타일"){
        img_src = "Royal"
        
    }else if(value === "골드애플") {
        img_src = "독사과"
        
    }
    console.log(img_src);

    itemCounter.innerHTML = `
        <img src="./img/${img_src}.png">
        <div>도전 횟수:</div>
        <input type="number" class="count try" value="1" min="1">
        <div>기대 획득 개수:</div>
        <input type="number" class="count expect" value="1" min="1">
        <img src = "./img/${img_src}.png">
    `
    document.querySelector(".expect").addEventListener("input", () => {
        let v_try = document.querySelector(".try").value
        let v_expect = document.querySelector(".expect").value
    
        if(parseInt(v_try) < parseInt(v_expect)) {
            document.querySelector(".expect").value = v_try;
        }
    });

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
    let itemCounter = document.querySelector(".item-counter");
    if(value === undefined || value === "x"){
        return
    }

    currState = value;
    
    calculator.innerHTML = createCubeOptionSelectHTML();
    document.querySelector(".item-counter").innerHTML = `
        <img>
        <div>도전 횟수:</div>
        <input type="number" class="count try" value="1" min="1">
        <img>
    `
    let icon = itemCounter.querySelectorAll("img");
    icon[0].src = `./img/${value}.png`;
    icon[1].src = `./img/${value}.png`;
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


//****************************** 환불 화면 생성 **********************************

function addFireOptions(value){
    
    if(value === "x") {
        return;
    }

    let options_li = document.querySelectorAll(".fireOptions-selected");

    

    if(options_li.length >= 4) {
        return;
    }

    for(let i = 0; i < options_li.length; i++) {
        if(options_li[i].querySelector("div").innerText === value) {
            return;
        }
    }

    let html = `
    <div class="fireOptions-selected">
        <div>${value}</div>
        <input type="number" class="fireOptions-level" min="1" max="5" value="5">
        <div>추 이상</div>
        <button onclick="clickDelete_option(this)">x</button>
    </div>`

    let optionsBox = document.querySelector(".fireOptions-list");
    optionsBox.innerHTML += html;
    
}

function oncheckWeapon_fire(value) {
    const optionList = FireData[value];
    let fireOptions_html = ``;
    for(let i = 0; i < optionList.length; i++) {
        let temp = `<option value="${optionList[i]}">${optionList[i]}</option>`;
        fireOptions_html += temp;
    }
    document.querySelector(".fireOptions-select").innerHTML = fireOptions_html;
}

function selectFire(click) {
    currState = click;
    const fireOptions_weaponOptions_list = FireData["무기"];

    document.querySelector(".item-counter").innerHTML = `
        <div>환생의 불꽃 종류 선택</div>
        <select class="selectfire">
            <option value="강력한 환생의 불꽃">강력한 환생의 불꽃</option>
            <option value="영원한 환생의 불꽃">검은/영원한 환생의 불꽃</option>
        </select>
        <div>시도 횟수</div>
        <input type="number" min="1" value="1" class="count try" onchange="settingNatural(this)">
    
    `

    let fireOptions_html = ``;
    for(let i = 0; i < fireOptions_weaponOptions_list.length; i++) {
        let temp = `<option value="${fireOptions_weaponOptions_list[i]}">${fireOptions_weaponOptions_list[i]}</option>`;
        fireOptions_html += temp;
    }

    document.querySelector(".calculator").innerHTML = `
    <div class="fireOptions">
        <div>
            <select class="fireOptions-isBoss">
                <option value="0">보스 장비 외</option>
                <option value="1">보스 장비</option>
            </select>
        </div>
        <div>
            <select class="fireOptions-isweapon" onchange="oncheckWeapon_fire(this.value)">
                <option value="무기">무기</option>
                <option value="그외 장비">그외 장비</option>
            </select>
        </div>
        <select class="fireOptions-select" onchange="addFireOptions(this.value)">
            <option value="x">옵션 선택(최대4개)</option>
            ${fireOptions_html}
        </select>
        <div class="fireOptions-list">
            
        </div>
    </div>
    `
    
}

//****************************** 공용 함수 **********************************

function clickDelete_option(node) {
    node.parentNode.parentNode.removeChild(node.parentNode);
}

function settingNatural(node) {
    if(node.value < 1) {
        node.value = 1;
    }else {
        node.value = parseInt(node.value);
    }
}