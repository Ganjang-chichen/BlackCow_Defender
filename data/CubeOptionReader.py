import json
import os
import sys

part_idx = [
    "무기",
    "엠블렘",
    "보조무기(포스실드, 소울링 제외)",
    "포스실드, 소울링",
    "방패",
    "모자",
    "상의",
    "한벌옷",
    "하의",
    "신발",
    "장갑",
    "망토",
    "벨트",
    "어깨장식",
    "얼굴장식",
    "눈장식",
    "귀고리",
    "반지",
    "펜던트",
    "기계심장"
]

cube_data = {}

with open("./CubeData.json", encoding="UTF8") as json_file:
    cube_data = json.load(json_file)

def openfile(idx, cube_name, option):

    path = "./CubeOptions/"
    
    no = ""
    if idx < 10:
        no = "0" + str(idx)
    else:
        no = "" + str(idx)

    part = part_idx[idx]

    option_str = " 번째 옵션"
    if option == 1:
        option_str = "첫" + option_str
    elif option == 2:
        option_str = "두" + option_str
    elif option == 3:
        option_str = "세" + option_str
    
    path = path + no + part + "/" + cube_name + str(option) + ".txt"
    print(path)
    f = open(path, 'r', encoding="UTF8")
    data = []

    idx = 0
    while True:
        line = f.readline()
        if not line: break
        line = line.replace("\n", "")
        li = line.split("\t")
        #print(li)

        data.append({
            "option" : li[0],
            "p" : li[1].replace("%", "")
        })
        idx = idx + 1
    f.close()

    if len(data) == 0:
        return

    cube_data[cube_name][part][option_str] = data

    with open("./CubeData.json", 'w', encoding="UTF8") as json_file:
        json.dump(cube_data, json_file, ensure_ascii=False, indent="\t")

if __name__ == "__main__" :
    #openfile("./data.txt", "블랙큐브", "무기", 1)

    idx = 0
    while (idx < 20) :
        
        for i in range(1, 4):
            openfile(idx, "블랙큐브", i)
            openfile(idx, "레드큐브", i)
            openfile(idx, "에디셔널큐브", i)
            openfile(idx, "명장의큐브", i)
            openfile(idx, "장인의큐브", i)
            openfile(idx, "수상한큐브", i)

        idx = idx + 1

    #print(json.dumps(cube_data, indent="\t", ensure_ascii=False))