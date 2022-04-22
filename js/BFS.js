importScripts("./lib/lodash/lodash.js");
importScripts("http://d3js.org/d3.v3.min.js");
// FLAG
const FAIL = 0;
const SUCCESS = 1;
const BROKEN = 2;
const RECOVERY = 3;
let NODE_IDX = 0;

let loopCount = 0;

// OPTION SETTING
let meso = 300000000;
let START_FROCE = 10;
let END_FORCE = 17;
let item_lv = 200;
let MVP = "없음";
let item_price = 100000000;
let BREAK_RECOVERY = false;

// DISCOUNT LIST
let SUNDAY_30p = false;
let SUNDAY_five100 = false;
let MVP_Li = {"없음" : 0 , "실버" : 0.03, "골드" : 0.05, "다이아, 레드" : 0.1};
let DISCOUNT_PC = false;
let USING_BREAKDEFENSE = [];
// ex1) MVP 다이아 유저가 PC방에서 스타포스 강화를 시도하면
// 1 - 0.1 - 0.05 = 0.85배 비용으로 15% 할인된다.
// ex2) MVP 다이아 유저가 PC방에서 썬데이 메이플 스타포스 30% 할인 상태로 
// 스타포스 강화를 시도하면 
// ((1 - 0.1 - 0.05) × 0.7) = 0.595배 비용으로 무려 40.5% 할인된다.

function calc_price(star) {
    let value = (Math.pow(item_lv, 3) * Math.pow(star + 1, 2.7));
    if(star < 15) {
        value = 1000 + value / 400;
    }else {
        value = 1000 + value / 200;
    }

    let BREAKDEFENCE = false;
    for(let i = 0 ; i < USING_BREAKDEFENSE.length; i++) {
        if(USING_BREAKDEFENSE[i] === star) {
            BREAKDEFENCE = true;
        }
    }
    if(BREAKDEFENCE){
        value *= 2;
    }

    let discount = 1 - MVP_Li[MVP]
    if(DISCOUNT_PC) {
        discount -= 0.05;
    }
    if(SUNDAY_30p){
        discount *= 0.7;
    }

    value = value * discount;
    value = Math.round(value / 100) * 100;

    return value;
}

const UPGRADE_PERCENT = [ // [실패, 성공, 파괴]
    [0.5, 0.5, 0], // 10
    [0.55, 0.45, 0], // 11
    [0.5994, 0.40, 0.006], // 12
    [0.637, 0.35, 0.013], // 13
    [0.686, 0.30, 0.014], // 14
    [0.679, 0.3, 0.021], // 15
    [0.679, 0.3, 0.021], // 16
    [0.679, 0.3, 0.021], // 17
    [0.672, 0.3, 0.028], // 18
    [0.672, 0.3, 0.028], // 19
    [0.63, 0.3, 0.07], // 20
    [0.63, 0.3, 0.07], // 21
    [0.776, 0.03, 0.194], // 22
    [0.686, 0.02, 0.294], // 23
    [0.594, 0.01, 0.396]  // 24
]


let Nodes = {
    name : 0,
    star_force : 10,
    used_meso : 0,
    p : 1,
    fail_count : 0,
    log : [],
    flag : NaN,
    break_count : 0,
    children : []

}

let Root = _.cloneDeep(Nodes);
function SetRoot() {
    Root.name = 0;
    Root.star_force = START_FROCE;

    Root.log.push(START_FROCE);
}

function case_success(parent) {
    let child = _.cloneDeep(Nodes);

    NODE_IDX++;
    child.name       =  NODE_IDX;
    child.star_force =  parent.star_force + 1;
    child.used_meso  =  parent.used_meso + calc_price(parent.star_force);
    child.p          =  parent.p * UPGRADE_PERCENT[parent.star_force - 10][1];
    child.fail_count =  0;

    let past_log = [];
    for(let i = 0; i < parent.log.length; i++) {
        past_log.push(parent.log[i]);
    }
    past_log.push(child.star_force);
    child.log        =  past_log;

    child.flag       =  SUCCESS;
    child.break_count=  parent.break_count;
    
    parent.children.push(child);
    return child;
}

function case_fail(parent) {
    let child = _.cloneDeep(Nodes);

    NODE_IDX++;
    child.name       =  NODE_IDX;

    if(parent.star_force % 5 === 0){
        child.star_force = parent.star_force;
    }else {
        child.star_force = parent.star_force - 1;
    }

    child.used_meso  =  parent.used_meso + calc_price(parent.star_force);
    child.p          =  parent.p * UPGRADE_PERCENT[parent.star_force - 10][0];
    child.fail_count =  parent.fail_count + 1;
    
    let past_log = [];
    for(let i = 0; i < parent.log.length; i++) {
        past_log.push(parent.log[i]);
    }
    past_log.push(child.star_force);
    child.log        =  past_log;

    child.flag       =  FAIL;
    child.break_count=  parent.break_count;
    
    parent.children.push(child);
    return child;
}

function case_break(parent) {
    let child = _.cloneDeep(Nodes);
    
    NODE_IDX++;
    child.name       =  NODE_IDX;
    child.star_force = -1;
    child.used_meso = parent.used_meso + calc_price(parent.star_force);
    child.p          =  parent.p * UPGRADE_PERCENT[parent.star_force - 10][0];
    child.fail_count =  0;
    
    
    let past_log = [];
    for(let i = 0; i < parent.log.length; i++) {
        past_log.push(parent.log[i]);
    }
    past_log.push(child.star_force);
    child.log        =  past_log;

    child.flag       =  BROKEN;
    child.break_count=  parent.break_count + 1;

    parent.children.push(child);
    return child;
}

function case_recovery(parent) {
    let child = _.cloneDeep(Nodes);
    
    NODE_IDX++;
    child.name       =  NODE_IDX;
    child.star_force =  12;
    child.used_meso  =  parent.used_meso + item_price;
    child.p          =  parent.p;
    child.fail_count =  0;
    
    let past_log = [];
    for(let i = 0; i < parent.log.length; i++) {
        past_log.push(parent.log[i]);
    }
    past_log.push(child.star_force);
    child.log        =  past_log;

    child.flag       =  RECOVERY;
    child.break_count=  parent.break_count;
    
    parent.children.push(child);
    return child;
}

SetRoot();

function bfs() {

    let head = [];
    let leaf = [];
    let success = [];
    let fail = [];
    head.push(Root);

    for(;;) {

        //await new Promise(res => setTimeout(res, 10000));
        LOGD(loopCount++);
        LOGD(head);

        for(let i = 0; i < head.length; i++) {
            
            //LOGD(`star : ${head[i].star_force}, end : ${END_FORCE}\n sum meso: ${head[i].used_meso}, max meso : ${meso}`);

            if(head[i].star_force === END_FORCE){
                success.push(head[i]);
                continue;
            }
            if(head[i].used_meso >= meso) {
                fail.push(head[i]);
                continue;
            }
            if(head[i].flag === BROKEN && BREAK_RECOVERY){
                case_recovery(head[i]);
                continue;
            }
            if(head[i].flag === BROKEN && !BREAK_RECOVERY){
                fail.push(head[i]);
                continue;
            }

            leaf.push(case_success(head[i]));
            leaf.push(case_fail(head[i]));

            if(head[i].name >= 12) {
                leaf.push(case_break(head[i]));
            }
        }

        if(leaf.length === 0) {
            break;
        }

        head = leaf;
        leaf = [];

    }
    return {
        "success" : success,
        "fail" : fail
    }

}


let tree = d3.layout.tree()
      .size([400, 400]);
  


onmessage = (e) => {
    console.log("bfs", e);

    let result = bfs();

    postMessage({root : Root});
    postMessage({"BFS" : result});

    let nodes = tree.nodes(Root);
    postMessage({nodes: nodes});
    
}

function LOGD(str) {
    postMessage({"msg" : str});
}