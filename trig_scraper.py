f = open("triggers.csv", "r")
Lines = f.readlines()
from bs4 import BeautifulSoup
Lines1 = Lines[0] #ebay link
#for link in Lines:
if True:
    link = Lines1
    print(link)
    import requests
    response = requests.get(link)
    #contents = response
    soup = BeautifulSoup(response.text, 'html.parser')
    contents = soup.prettify()
    contents = soup.find_all("h3", {"class": "s-item__title"})
    contents2 = soup.find_all("div", {"class": "s-item__wrapper clearfix"})
    #print(contents)
    end = []
    for item in contents2:

        price = item.find_all("span",  {"class": "s-item__price"} )[0].text
        title = item.find_all("h3", {"class": "s-item__title"})[0].text
        image = item.find_all("img")[0]['src']
        link = item.find_all("a")[0]['href'].split("?")[0]
        result = [price, title, image, link]
        end.append(result)

    #print(end[1:])
    link = Lines[1]
    print(link)
    import requests
    response = requests.get(link)
    #contents = response
    soup = BeautifulSoup(response.text, 'html.parser')
    contents = soup.prettify()
    print(contents)
out_p = open("triggers_item.txt", "w")
for item in end[1:]:
    out_str = ','.join(item)
    out_str += "\n"
    out_p.write(out_str)
out_p.close()
