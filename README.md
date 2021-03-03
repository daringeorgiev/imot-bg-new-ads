# imot-bg-new-ads

Fixes the sort order by date added and returns only newly added ads on [imot.bg](https://www.imot.bg/pcgi/imot.cgi)

## Motivation

Sometimes [imot.bg](https://www.imot.bg/pcgi/imot.cgi) does not return the correct sort order by date added.

This app filters the newly added ads and paste them into a text file.

## Requirements

Node.js and npm are needed.

### Node

Go on [Node.js](https://nodejs.org/) website and download the installer

## Install

    git clone https://github.com/daringeorgiev/imot-bg-new-ads.git
    cd imot-bg-new-ads
    npm install

## Configure app

Command line settings

### Mandatory

* u - the url address of of the search, wrapped in quotes (e.g. 'https://www.imot.bg/pcgi/imot.cgi?act=1&slink=abcdef&f1=1')

### Optional

* p - number of pages that will be scanned (default is 2)

* r - rate limit in ms (default is 2000)

* d - output folder for the results (default is 'ads')

## Running the project

    node .\index.js -u 'https://www.imot.bg/pcgi/imot.cgi?act=1&slink=abcdef&f1=1' -p 2

## Built With

* [Node.js](https://nodejs.org/en/) - JavaScript runtime
