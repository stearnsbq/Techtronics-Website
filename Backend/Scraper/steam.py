import requests
import json
from scraper import AbstractScraper
from bs4 import BeautifulSoup
from time import sleep
from time import time
from collections import OrderedDict

class SteamScraper(AbstractScraper):

    def __init__(self):
        self.baseURL = "https://steamspy.com/api.php"  # steamspy for api as alot of the data is already parsed for us 
        self.headers = {'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36"}  # user agent 
        self.validGames = {}  #list of non FTP games

    def scrape(self):
        self.parseGames(self.getIDs())

    def getIDs(self):
        with open('./steam_ids.json', encoding="utf8") as steamGames:
            return sorted(json.load(steamGames).items())

    def parseGames(self, listOfGames):
        for game in listOfGames:
            if game[0] in self.validGames:
                continue
            if game[1]['initialprice'] != '0':
                self.validGames[game[0]] = game[1];
            

           

            


    

        
