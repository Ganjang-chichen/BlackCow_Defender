function aHb(a, b) {
    if(a === 0 || b === 0) {
        return 1;
    }
    let x = a + b - 1;
    let result = 1;
    for(let i = 0; i < b; i ++) {
        result = result * (x - i) / (i + 1);
    }
    return result;
}

function showResult() {
    if(currState === "로얄스타일" || currState === "골드애플"){
        caseNotCube();
        return;
    }
    else if(currState === "블랙큐브" || currState === "레드큐브" ||
        currState === "에디셔널큐브" || currState === "명장의큐브" ||
        currState === "장인의큐브" || currState === "수상한큐브"){
        caseCube();
        return;
    }
    else if(currState === "환생의불꽃"){
        caseFire();
    }
}
function calc_OnlyI(p, tryed, expect) {
    let calc_list = [];
    
    for(let i = 0; i < expect; i++) {
        let H = aHb(tryed - i + 1, i);
        let p1_p = Math.pow(p, i) * Math.pow(1 - p, tryed - i);
        calc_list.push(H * p1_p);
    }

    return calc_list;
}

function caseNotCube() {
    const tryed = parseInt(document.querySelector(".try").value);
    const expect = parseInt(document.querySelector(".expect").value);

    let li_name = document.querySelector(".item-selected").querySelectorAll("div");
    let li_p = document.querySelector(".item-p").querySelectorAll("div");
    if(li_p.length === 0) {
        alert("아이템을 선택하고 눌러");
        return;
    }

    let itemList_p = "\\[ p = ";
    let p_sum = 0;
    for(let i = 0; i < li_p.length; i++) {
        p_sum += parseFloat(li_p[i].innerText.replace("%", "")) / 100;

        itemList_p += ` + ${parseFloat(li_p[i].innerText.replace("%", "")) / 100}`;

    }
    itemList_p += " \\]"

    // 딱 i 번 실패할 확률 계산
    let calc_list = calc_OnlyI(p_sum, tryed, expect);

    // 수식 표현
    let limit_ko = ``;
    let limit_no = `\\[ V = 1 `;
    let limit_sum = 0;
    for(let i = 0; i < calc_list.length; i++) {
        limit_no += ` - (${calc_list[i]})`;
        limit_ko += ` - (딱 ${i}번만 성공할 확률) `
        limit_sum += calc_list[i];
    }
    limit_no += ` \\] `;

    document.querySelector(".expression-ko").innerHTML = `
        \\[ p = \\Sigma (선택된 아이템 확률 합산) \\]
    `;
    document.querySelector(".value").innerHTML = `
        \\[ p = ${p_sum} \\]
    `;
    document.querySelector(".value-ko").innerHTML = `
        1회 독립시행 시 확률 : ${p_sum * 100}%
    `;
    document.querySelector(".finalvalue-ko").innerHTML = `
        (${tryed}번 도전해 ${expect}번 이상 뽑을 확률) = (전체확률) ${limit_ko}
    `;
    document.querySelector(".finalvalue-no").innerHTML = limit_no;
    document.querySelector(".finalvalue-result-no").innerHTML = `
        \\[ V = ${1 - limit_sum} \\]
    `;
    document.querySelector(".finalvalue-result-p").innerHTML = `
        ${tryed}회 도전 시 ${expect}회 이상 뽑을 확률 : ${(1 - limit_sum) * 100}%
    `;

    MathJax.typeset();

    // 그래프 생성
    let chart_box = document.querySelector(".chart-box");
    chart_box.innerHTML = "";
    chart_box.innerHTML = `
        <canvas class="chart chart-expect"></canvas>    
        <canvas class="chart chart-try"></canvas>
    `
    // 변수 기대 횟수
    let x_expect = [];
    let y_expect = [];

    for(let i = 1; i <= expect; i++) {
        x_expect.push(i);
        
        let sum = 0
        for(let j = 0; j < i; j++){
            sum += calc_list[j];
        }
        y_expect.push((1 - sum) * 100);
    }
    let ctx = document.querySelector('.chart-expect').getContext("2d");
    new Chart(
        document.querySelector('.chart-expect'),
        {
            type: "line",
            data: {
                labels: x_expect,
                datasets: [{
                    label: "각 기대 획득값 별 성공확률",
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: y_expect,
                }]
            },
            options: {
                plugins: {
                    subtitle: {
                        display: true,
                        text: `고정값: 도전 횟수 - ${tryed}`
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            // Include a dollar sign in the ticks
                            callback: function(value, index, ticks) {
                                return value + "%";
                            }
                        }
                    }
                }
            }
        }
    );

    // 변수: 도전횟수
    let x_try = [];
    let y_try = [];

    for(let i = expect; i <= tryed; i++) {
        x_try.push(i);

        let y_val = 0;
        let temp = calc_OnlyI(p_sum, i, expect);
        for(let j = 0; j < temp.length; j++) {
            y_val += temp[j];
        }
        y_try.push((1 - y_val) * 100);
    }

    new Chart(
        document.querySelector('.chart-try'),
        {
            type: "line",
            data: {
                labels: x_try,
                datasets: [{
                    label: "각 도전 횟수 별 성공확률",
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: y_try,
                }]
            },
            options: {
                plugins: {
                    subtitle: {
                        display: true,
                        text: `고정값: 기대 획득 개수 - ${expect}`
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function(value, index, ticks) {
                            return value + "%";
                        }
                    }
                }
            }
        }
    );
    
}

//*******************************큐브 확률 계산**************************************

function getEachOtionsPoint(li) {
    let p_sum = 0;
    for(let i = 0; i < li.length; i++) {
        p_sum += parseFloat(li[i].querySelectorAll("div")[1].innerText.replace("%", "")) / 100;
    }
    if(p_sum === 0){
        p_sum = 1;
    }
    return p_sum;
}

function limitOptions(li, all) {
    let limit_list1 = {
        "쓸만한 미스틱 도어" : 0,
        "쓸만한 헤이스트" : 0,
        "쓸만한 하이퍼 바디" : 0,
        "쓸만한 샤프 아이즈" : 0,
        "쓸만한 컴뱃 오더스" : 0,
        "쓸만한 윈드 부스터" : 0,
        "쓸만한 어드밴스드 블레스": 0,
        "피격 후 무적시간" : 0,
        "몬스터 방어율 무시" : 0,
        "% 무시" : 0,
        "초간 무적" : 0,
        "보스 몬스터 공격 시 데미지" : 0,
        "아이템 드롭률" : 0
    }

    if(!all) {
        for(let i = 0; i < li.length; i++) {
            let name = li[i].querySelectorAll("div")[0].innerText;
            let p = li[i].querySelectorAll("div")[1].innerText.replace("%", "") / 100;

            for(let n of Object.keys(limit_list1)) {
                if(name.includes(n)) {
                    limit_list1[n] += p;
                }
            }

        }

        return limit_list1;
    }else {
        let list = CubeData[currState][currEquipment][li];
        for(let i = 0; i < list.length; i++) {
            let name = list[i].option;
            let p = list[i].p / 100;

            for(let n of Object.keys(limit_list1)) {
                if(name.includes(n)) {
                    limit_list1[n] += p;
                }
            }
        }

        return limit_list1;
    }
    

}

function limit_initialSet() {
    return {
        "쓸만한 미스틱 도어" : 0,
        "쓸만한 헤이스트" : 0,
        "쓸만한 하이퍼 바디" : 0,
        "쓸만한 샤프 아이즈" : 0,
        "쓸만한 컴뱃 오더스" : 0,
        "쓸만한 윈드 부스터" : 0,
        "쓸만한 어드밴스드 블레스": 0,
        "피격 후 무적시간" : 0,
        "몬스터 방어율 무시" : 0,
        "% 무시" : 0,
        "초간 무적" : 0,
        "보스 몬스터 공격 시 데미지" : 0,
        "아이템 드롭률" : 0
    };
}

function caseCube() {

    // 시행 횟수
    const tryed = parseInt(document.querySelector(".try").value);

    // 확률 계산 파트
    // 선택된 확률
    let li1 = calculator.querySelectorAll(".cubeOption-first");
    let li2 = calculator.querySelectorAll(".cubeOption-second");
    let li3 = calculator.querySelectorAll(".cubeOption-third");

    if((li1.length === 0 && li2.length === 0 && li3.length === 0)) {
        alert("옵션 선택 할 것");
        return;
    }
    if(document.querySelector(".equipment-option-select").value === 'x') {
        alert("장비 선택 할 것");
    }

    // 각 라인 확률 합산
    let p_sum1 = getEachOtionsPoint(li1);
    let p_sum2 = getEachOtionsPoint(li2);
    let p_sum3 = getEachOtionsPoint(li3);

    let limit_onlyOne = [
        "쓸만한 미스틱 도어", "쓸만한 헤이스트",
        "쓸만한 하이퍼 바디", "쓸만한 샤프 아이즈",
        "쓸만한 컴뱃 오더스", "쓸만한 윈드 부스터",
        "쓸만한 어드밴스드 블레스", "피격 후 무적시간" 
    ];

    // 제한된 옵션 항목별
    let limit_list_all_calc123 = limit_initialSet();
    let limit_list_calc123 = limit_initialSet();

    let limit_list_all_calc222 = limit_initialSet();
    let limit_list_calc222 = limit_initialSet();

    let p_limit1_all = limitOptions("첫 번째 옵션", true);
    let p_limit2_all = limitOptions("두 번째 옵션", true);
    let p_limit3_all = limitOptions("세 번째 옵션", true);

    let p_limit1 = limitOptions(li1, false);
    let p_limit2 = limitOptions(li2, false);
    let p_limit3 = limitOptions(li3, false);

    // 제한된 옵션들 합산
    let p_limit_all_sum123 = 0;
    let p_limit_sum123 = 0;
    let p_limit_all_sum2 = 0;
    let p_limit_sum2 = 0;
   
    for(let name of Object.keys(limit_list_calc123)){
        limit_list_all_calc123[name] = (p_limit1_all[name]) * (p_limit2_all[name]) * (p_limit3_all[name]);
        limit_list_calc123[name] = (p_limit1[name]) * (p_limit2[name]) * (p_limit3[name]);
        p_limit_all_sum123 += limit_list_all_calc123[name];
        p_limit_sum123 += limit_list_calc123[name];

        if(limit_onlyOne.includes(name)){
            limit_list_all_calc222[name] = (p_limit1_all[name]) * (p_limit2_all[name]) 
                + (p_limit1_all[name]) * (p_limit3_all[name]) 
                + (p_limit2_all[name]) * (p_limit3_all[name]);
            limit_list_calc222[name] = (p_limit1[name]) * (p_limit2[name]) 
                + (p_limit1[name]) * (p_limit3[name]) 
                + (p_limit2[name]) * (p_limit3[name]);
            
            p_limit_all_sum2 += limit_list_all_calc222[name];
            p_limit_sum2 += limit_list_calc222[name];
        }

    }

    // 독립 시행 확률
    let p = (p_sum1 * p_sum2 * p_sum3 - p_limit_sum123 - p_limit_sum2) / (1 - p_limit_all_sum123 - p_limit_all_sum2);
    console.log(p);
    let V = 1 - Math.pow((1 - p), tryed);

    // 식 표기
    // 제외사항 한국어 표기
    let expression_limit_ko = ``;
    let expression_allLimit_ko = ``;
    // 제외사항 숫자 표기
    let expression_limit_no = ``;
    let expression_allLimit_no = ``;

    for(let name in limit_list_calc123) {
        if(limit_list_all_calc123[name] !== 0){
            expression_allLimit_ko += "-"
            expression_allLimit_no += "-"
            if(limit_onlyOne.includes(name)) {
                expression_allLimit_ko += "2줄이상";
            }else {
                expression_allLimit_ko += "3줄";
            }
            expression_allLimit_ko += (name + " ");
            expression_allLimit_no += `${limit_list_all_calc123[name] + limit_list_all_calc222[name]} `
        }
        if(limit_list_calc123[name] !== 0){
            expression_limit_ko += "-"
            expression_limit_no += "-"
            if(limit_onlyOne.includes(name)) {
                expression_limit_ko += "2줄이상";
            }else {
                expression_limit_ko += "3줄";
            }
            expression_limit_ko += (name + " ");
            expression_limit_no += `${limit_list_calc123[name] + limit_list_calc222[name]} `
        }
    }

    let expression_ko = `\\[ p = \\frac{(첫 번째 옵션 합) \\times (두 번째 옵션 합) \\times (세 번째 옵션합) ${expression_limit_ko}}{1 ${expression_allLimit_ko}} \\]`
    let expression_no = `\\[ p = \\frac{(${p_sum1}) \\times (${p_sum2}) \\times (${p_sum3}) ${expression_limit_no}}{1 ${expression_allLimit_no}} \\]`
    let independentE = "\\[ p = " + p + "\\]";
    let independent_ko = `1회 독립시행 시 확률 : ${p * 100}%`;
    let finalvalue_ko = `${tryed}번 도전 시 성공 확률 = {전체확률} - (${tryed} 회 전부 실패할 확률)`;
    let finalvalue_no = `\\[ V = 1 - (1 - p)^{${tryed}} \\]`;
    let finalvalue_result_no = `\\[ V = ${V} \\]`;
    let finalvalue_result_p = `${tryed}회 도전 시 성공 확률 : ${V * 100}%`;

    document.querySelector(".expression-ko").innerHTML = expression_ko;
    document.querySelector(".expression-no").innerHTML = expression_no;
    document.querySelector(".value").innerHTML = independentE;
    document.querySelector(".value-ko").innerHTML = independent_ko;
    document.querySelector(".finalvalue-ko").innerHTML = finalvalue_ko;
    document.querySelector(".finalvalue-no").innerHTML = finalvalue_no;
    document.querySelector(".finalvalue-result-no").innerHTML = finalvalue_result_no;
    document.querySelector(".finalvalue-result-p").innerHTML = finalvalue_result_p;
    
    MathJax.typeset();

    // 각 시행 횟수 별 그래프 출력
    
    let x = [0];
    let y = [0];

    for(let i = 1; i <= tryed; i++) {
        x.push(i);
        y.push((1 - Math.pow((1 - p), i)) * 100);
    }

    let chart_box = document.querySelector(".chart-box");
    chart_box.innerHTML = "";
    chart_box.innerHTML = `
        <canvas class="chart"></canvas>
    `
    new Chart(
        document.querySelector('.chart'),
        {
            type: "line",
            data: {
                labels: x,
                datasets: [{
                    label: "각 횟수별 성공확률",
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: y,
                }]
            },
            options: {}
        }
    )

}

//*******************************환불 확률 계산**************************************

function aCb(a, b) {
    if(b < 1 || a <= b) {
        return 1;
    }
    let value = 1;
    for(let i = 0; i < b; i++) {
        value = value * (a - i) / (1 + i);
    }
    return value;
}

function caseFire() {
    let selectfire = document.querySelector(".selectfire").value;
    let isBoss = document.querySelector(".fireOptions-isBoss");
    let isweapon = document.querySelector(".fireOptions-isweapon");
    let options_li = document.querySelectorAll(".fireOptions-selected");
    let options_point_sum = FireData[selectfire].slice();
    
    let options_point_sumV = 0;
    for(let i = 4; i >= 0; i--){
        options_point_sumV += options_point_sum[i];
        options_point_sum[i] = options_point_sumV;
    }

    document.querySelector(".expression-ko").innerHTML = `
        \\[ p : 독립시행 확률, p_n : 각 옵션의 개수(n)별 확률, x_n : 각 옵션의 개수 확률 \\]
        단 보스 장비의 경우 옵션의 개수는 고정으로 4개이다.
        \\[ x1 = 0.4, x2 = 0.4, x3 = 0.16, x4 = 0.04 \\]
        \\[ p = \\Sigma_{k=n}^4 (p_k) \\times (원하는 등급 이상 확률1) \\times ... \\times (원하는 등급 이상 확률 n) \\]
        \\[ p_k =  x_k \\times \\frac{_{19-n}C_{k - n}}{ _{19}C_k} \\]
    `

    let expression_no = ``;
    let expression_no2 = "\\[ p = ( ";
    let expression_eachP = [0];
    for(let i = 4; i >= options_li.length; i--) {
        let Xk = FireData["옵션 개수"][i - 1];
        let C1 = aCb(19 - options_li.length, i - options_li.length);
        let C2 = aCb(19, i);
        let result = Xk * C1 / C2;
        expression_no += `\\[ p_${i} = ${Xk} \\times \\frac{${C1}}{${C2}} \\]`
        expression_eachP.push(result);
        expression_no2 += ` + ${result}`;
        expression_eachP[0] += result;
    } expression_no2 += ") "

    let expression_wantedP = [1];
    for(let i = 0; i < options_li.length; i++) {
        let getWanted = parseInt(5 - options_li[i].querySelector("input").value);
        if(getWanted > 4){
            getWanted = 4;
        }
        if(getWanted < 0){
            getWanted = 0;
        }
        let result = options_point_sum[getWanted];
        expression_wantedP[0] *= result;
        expression_wantedP.push(result);
        expression_no2 += ` \\times ${result}`;
    }

    expression_no2 += ` \\]`;
    let p = expression_eachP[0] * expression_wantedP[0];


    document.querySelector('.expression-no').innerHTML = expression_no;
    document.querySelector('.expression-no').innerHTML += expression_no2;
    document.querySelector('.value').innerHTML = `\\[  p = ${p} \\]`;
    document.querySelector('.value-ko').innerHTML = `독립 시행 확률 : ${p * 100}%`
    
    let tried = parseInt(document.querySelector(".try").value);
    document.querySelector(".finalvalue-ko").innerHTML = `P = (전체 확률) - (전부 실패 확률)`;
    document.querySelector(".finalvalue-no").innerHTML = `\\[ p = 1 - (1 - p)^{${tried}} \\]`

    let P = 1 - Math.pow((1 - p), tried);
    document.querySelector(".finalvalue-result-no").innerHTML = `\\[ P = ${P} \\]`;
    document.querySelector(".finalvalue-result-p").innerHTML = `P = ${P * 100}% `;

    MathJax.typeset();

    document.querySelector(".chart-box").innerHTML = "";

}