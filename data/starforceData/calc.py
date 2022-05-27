import json
import copy

def createFile(name, data):
    with open(name + '.json', 'w', encoding="utf-8") as make_file:
        json.dump(data, make_file, ensure_ascii=False, indent="\t")

# options
global STARFORCE_start
global STARFORCE_END
global BREAKDEFENCE_li
global MVP
global ITEM_LV
global ITEM_PRICE
global USING_RECOVERY
STARFORCE_start = 10
STARFORCE_END = 17
BREAKDEFENCE_li = []
MVP = "없음"
ITEM_LV = 200
ITEM_PRICE = 100000000
USING_RECOVERY = False

# DISCOUNT LIST
global SUNDAY_30p
global SUNDAY_five100
global MVP_Li
global DISCOUNT_PC
global USING_BREAKDEFENSE
SUNDAY_30p = True
SUNDAY_five100 = False
MVP_Li = {"없음" : 0 , "실버" : 0.03, "골드" : 0.05, "다이아, 레드" : 0.1}
DISCOUNT_PC = False
USING_BREAKDEFENSE = [12]

# count
global NODE_IDX
global SUCCESS
global FAIL
global BREAK
global RECOVERY
NODE_IDX = 0
SUCCESS = 444
FAIL = 445
BREAK = 446
RECOVERY = 447

def calc_price(star):
    global ITEM_LV

    value = pow(ITEM_LV, 3) * pow(star + 1, 2.7)
    if star < 15 :
        value = 1000 + value / 400
    else :
        value = 1000 + value / 200
    
    BREAKDEFENCE_PRICE = value
    BREAKDEFENCE = False
    for x in USING_BREAKDEFENSE:
        if x == star:
            BREAKDEFENCE = True
    
    discount = 1 - MVP_Li[MVP]
    if DISCOUNT_PC:
        discount = discount - 0.05
    if SUNDAY_30p:
        discount = discount * 0.7
    
    value = value * discount
    
    if BREAKDEFENCE:
        value = value + BREAKDEFENCE_PRICE

    value = round(value, -2)

    return value

UPGRADE_PERCENT = [ # [실패, 성공, 파괴]
    [0.5, 0.5, 0], # 10
    [0.55, 0.45, 0], # 11
    [0.5994, 0.40, 0.006], # 12
    [0.637, 0.35, 0.013], # 13
    [0.686, 0.30, 0.014], # 14
    [0.679, 0.3, 0.021], # 15
    [0.679, 0.3, 0.021], # 16
    [0.679, 0.3, 0.021], # 17
    [0.672, 0.3, 0.028], # 18
    [0.672, 0.3, 0.028], # 19
    [0.63, 0.3, 0.07], # 20
    [0.63, 0.3, 0.07], # 21
    [0.776, 0.03, 0.194], # 22
    [0.686, 0.02, 0.294], # 23
    [0.594, 0.01, 0.396]  # 24
]

global Nodes
Nodes = {
    "name" : 0,
    "star_force" : 10,
    "used_meso" : 0,
    "p" : 1,
    "fail_count" : 0,
    "log" : [],
    "flag" : None,
    "break_count" : 0,
    "children" : [],
    "parent" : None
}

global Root
Root = copy.deepcopy(Nodes)
Root["log"].append(STARFORCE_start)

def success(p):
    global Nodes
    global NODE_IDX
    global SUCCESS
    c = copy.deepcopy(Nodes)

    NODE_IDX = NODE_IDX + 1
    c["name"] = NODE_IDX
    c["star_force"] = p["star_force"] + 1
    c["used_meso"] = p["used_meso"] + calc_price(p["star_force"])

    if p["fail_count"] == 2:
        c["p"] = p["p"]
    else :
        c["p"] = p["p"] * UPGRADE_PERCENT[p["star_force"] - 10][1]
    c["fail_count"] = 0
    c["log"] = copy.deepcopy(p["log"])
    c["log"].append(c["star_force"])
    c["flag"] = SUCCESS
    c["break_count"] = p["break_count"]
    
    p["children"].append(c)

    return c

def fail(p) :
    global Nodes
    global NODE_IDX
    global FAIL
    c = copy.deepcopy(Nodes)

    NODE_IDX = NODE_IDX + 1
    c["name"] = NODE_IDX

    if p["star_force"] % 5 == 0:
        c['star_force'] = p["star_force"]
    else:
        c['star_force'] = p["star_force"] - 1
    
    c["used_meso"] = p["used_meso"] + calc_price(p["star_force"])
    c["p"] = p["p"] * UPGRADE_PERCENT[p["star_force"] - 10][0]
    c["fail_count"] = p["fail_count"] + 1
    c["log"] = copy.deepcopy(p["log"])
    c["log"].append(c["star_force"])
    c["flag"] = FAIL
    c["break_count"] = p["break_count"]
    
    p["children"].append(c)

    return c

def broken(p) :
    global Nodes
    global NODE_IDX
    global BREAK
    c = copy.deepcopy(Nodes)

    NODE_IDX = NODE_IDX + 1
    c["name"] = NODE_IDX
    c['star_force'] = -444
    c["used_meso"] = p["used_meso"] + calc_price(p["star_force"])
    c["p"] = p["p"] * UPGRADE_PERCENT[p["star_force"] - 10][2]
    c["fail_count"] = 0
    c["log"] = copy.deepcopy(p["log"])
    c["log"].append(c["star_force"])
    c["flag"] = BREAK
    c["break_count"] = p["break_count"] + 1
    
    p["children"].append(c)

    return c

def recovery(p) : 
    global Nodes
    global NODE_IDX
    global RECOVERY
    global ITEM_PRICE
    c = copy.deepcopy(Nodes)

    NODE_IDX = NODE_IDX + 1
    c["name"] = NODE_IDX
    c['star_force'] = 12
    c["used_meso"] = p["used_meso"] + ITEM_PRICE
    c["p"] = p["p"]
    c["fail_count"] = 0
    c["log"] = copy.deepcopy(p["log"])
    c["log"].append(c["star_force"])
    c["flag"] = RECOVERY
    c["break_count"] = p["break_count"]
    
    p["children"].append(c)

    return c

def BFS(Root) :
    
    head = []
    leaf = []
    successLi = []
    failLi = []
    head.append(Root)

    global STARFORCE_start
    global STARFORCE_END

    maxL = 10
    FINFLAG = False
    cnt = 0

    while True:
        
        for node in head:

            if len(node["log"]) >= maxL:
                FINFLAG = True
                break

            if node["star_force"] == STARFORCE_END:
                successLi.append(node)
                continue
            
            if node["flag"] == BREAK and USING_RECOVERY:
                recovery(node)
                continue
            
            if node["flag"] == BREAK and not USING_RECOVERY:
                failLi.append(node)
                continue
            
            if node["fail_count"] == 2:
                leaf.append(success(node))

            temp_s = success(node)

            leaf.append(temp_s)

            temp_f = fail(node)
            leaf.append(temp_f)

            if node["name"] >= 12:
                temp_b = broken(node)
                leaf.append(temp_b)

            print(NODE_IDX)
        
        if len(leaf) == 0:
            break
        
        if FINFLAG :
            break

        head = leaf
        leaf = []

        print("count : " + str(cnt) + "@@@@@@@@@@@@@@@@@@@@@@@@")
        cnt = cnt + 1


if __name__ == "__main__":
    ITEM_LV = 140
    
    print(calc_price(12))
    BFS(Root)
    
    createFile("result", Root)
    
    
    

