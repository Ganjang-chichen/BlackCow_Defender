
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
}

function caseNotCube() {
    let li = document.querySelector(".item-p").querySelectorAll("div");
    if(li.length === 0) {
        alert("아이템을 선택하고 눌러");
        return;
    }

    let p_sum = 0;
    for(let i = 0; i < li.length; i++) {
        p_sum += parseFloat(li[i].innerText.replace("%", "")) / 100;
    }
    console.log(p_sum);

    const tryed = parseInt(document.querySelector(".try").value);
    const expect = parseInt(document.querySelector(".expect").value);

    console.log(tryed, expect);
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
        <div class="chart-box">
            <canvas class="chart"></canvas>
        </div>
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