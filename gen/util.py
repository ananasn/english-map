import re
import json
import urllib.request

        
def get_coord(key):
    key = urllib.parse.quote(key)
    key =  "+".join(key.split(' '))
    
    req = f"https://nominatim.openstreetmap.org/search?q={key}&format=json&addressdetails=0"
    r = json.load(urllib.request.urlopen(req))
    
    if r != []:
        return(r[0]['lat'], r[0]['lon'])
    return ("00", "00")
    
    
res_arr = []
with open('study_org.txt', 'r') as f:
    with open('study_org.json', 'w', encoding="utf-8") as ff:
        for l in f: 
            r = re.findall('(.*) *\t *[0-9]\t(.*)', l.replace('\xa0',' '))[0]
            coordinates = get_coord(r[0])
            res_arr.append({"university": (r[0]),
                             "country": (r[1]),
                             "latitude":float(coordinates[0]),
                             "longitude":float(coordinates[1])})
        json.dump(res_arr, ff, ensure_ascii=False, indent=2)
        
        
res_arr = []
with open('comm_org.txt', 'r') as f:
    with open('comm_org.json', 'w', encoding="utf-8") as ff:
        for l in f: 
            r = re.findall('(.*) *\t *[0-9]\t(.*)', l.replace('\xa0',' '))[0]
            coordinates = get_coord(r[0])
            res_arr.append({"organization": (r[0]),
                             "country": (r[1]),
                             "latitude":float(coordinates[0]),
                             "longitude":float(coordinates[1])})
        json.dump(res_arr, ff, ensure_ascii=False, indent=2)
