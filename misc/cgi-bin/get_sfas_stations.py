#!/usr/bin/python3

#
# AUTHOR:       John Graham (jgraham5@stevens.edu)
# DATE:         2024-03-03
# FILE:         get_sfas_stations.py
# DESCRIPTION:  Wrapper for 'https://hudson.dl.stevens-tech.edu/sfas/sfas_stations2.js'
#               to be used by SFAS2
#
# UPDATED BY: Samuel Miller (millersamuel807@gmail.com)

from time import time
import http.client

def getRequest(host: str, url: str, ts: int) -> str:
    ''' 
    makes a GET request to the supplied host and URL, returns response body as string
    `host` should be the host to which we are making a request (i.e. `"hudson.dl.stevens-tech.edu"`)
    `url` should be an absolute path from the root of `host` that represents the resource we are trying to request (i.e. `"/sfas/sfas_stations2.js"`)
    `ts` should be a timestamp for when the request was initiated (in unix epoch)
    '''
    conn = http.client.HTTPSConnection(host)
    conn.request("GET", url)
    res = conn.getresponse()
    if res.status != 200:
        return f"ERROR: request failed\nstatus = {res.status}\nreason = {res.reason}"
    bodyString = res.read().decode("utf-8") # returned as `bytes`, decode to utf 8 string
    return bodyString # return the body contents


if __name__ == "__main__":
    ts = time()
    result = getRequest("hudson.dl.stevens-tech.edu", "/sfas/sfas_stations2.js", ts)
    print("Content-type: text/html\n")
    print(result)

