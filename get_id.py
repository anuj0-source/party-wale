import urllib.request, re
html = urllib.request.urlopen('https://www.youtube.com/results?search_query=bom+diggy+diggy').read().decode('utf-8')
print(re.search(r'\"videoId\":\"(.*?)\"', html).group(1))
