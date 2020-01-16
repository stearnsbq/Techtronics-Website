from ebay import EbayScraper
from origin import OriginScraper
from steam import SteamScraper
import threading 
import argparse

parser = argparse.ArgumentParser()
steam = SteamScraper()
origin = OriginScraper()
ebay = EbayScraper()

def init():
    parser.parse_args()


















if __name__ == "main":
    init()








