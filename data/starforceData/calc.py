import json
import copy

global STARFORCE_start
global STARFORCE_END
BREAKDEFENCE_li = []
MVP = "없음"

# DISCOUNT LIST
SUNDAY_30p = False
SUNDAY_five100 = False
MVP_Li = {"없음" : 0 , "실버" : 0.03, "골드" : 0.05, "다이아, 레드" : 0.1}
DISCOUNT_PC = False
USING_BREAKDEFENSE = []

def calc_price(star, itemLV):
    value = pow(itemLV, 3) * pow(star + 1, 2.7)
    if star < 15 :
        value = 1000 + value / 400
    else :
        value = 1000 + value / 200
    
    BREAKDEFENCE = False
    for x in USING_BREAKDEFENSE:
        if x == star:
            BREAKDEFENCE = True
    
    if BREAKDEFENCE:
        value = value * 2
    
    discount = 1 - MVP_Li[MVP]
    if DISCOUNT_PC:
        discount = discount - 0.05
    if SUNDAY_30p:
        discount = discount * 0.7
    
    value = value * discount
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

Nodes = {
    "name" : 0,
    "star_force" : 10,
    "used_meso" : 0,
    "p" : 1,
    "fail_count" : 0,
    "log" : [],
    "flag" : None,
    "break_count" : 0,
    "children" : []
}

Root = copy.deepcopy(Nodes)


print(json.dumps(Nodes, indent=4, sort_keys=True))

if __name__ == "__main__":
    print("test")
    print(Nodes["children"][0]["children"])
    
    

