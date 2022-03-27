import requests                  # 웹 페이지의 HTML을 가져오는 모듈
from bs4 import BeautifulSoup    # HTML을 파싱하는 모듈
import json
import urllib.request
import os
import sys

def GetData(url) :
    Data = {}
    
    Data_url = url
    Data_res = requests.get(Data_url)
    Data_soup = BeautifulSoup(Data_res.content, "html.parser")

    table = Data_soup.find('table')
    tbody = Data_soup.find('tbody')

    item_list = []

    i = 0
    for tr in table.find_all('tr'):
        tds = list(tr.find_all('td'))

        if (i == 1):
            item = {
                "name" : tds[1].text,
                "p" : tds[2].text.replace("%", "")
            }
            item_list.append(item)
        elif (i > 1):
            item = {
                "name" : tds[0].text,
                "p" : tds[1].text.replace("%", "")
            }
            item_list.append(item)
        i = i + 1
    Data["item_list"] = item_list
    return Data

def createFile(name, data):
    with open(name + '.json', 'w', encoding="utf-8") as make_file:
        json.dump(data, make_file, ensure_ascii=False, indent="\t")

if __name__ == "__main__" : 
    RoyalData = GetData("https://maplestory.nexon.com/Guide/CashShop/Probability/RoyalStyle")
    createFile("RoyalStyle", RoyalData)
    AppleData = GetData("https://maplestory.nexon.com/Guide/CashShop/Probability/GoldApple")
    createFile("GoldApple", AppleData)
