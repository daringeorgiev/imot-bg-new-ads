const fs = require('fs');
const Crawler = require("crawler");
const argv = require('minimist')(process.argv.slice(2), {
    string: ['u', 'd'],
    alias: {
        'u': 'url',
        'p': 'pages',
        'r': 'rateLimit',
        'd': 'dest'
    },
    default: {
        'p': 2,
        'r': 2000,
        'd': 'ads'
    }
});
const c = new Crawler({
    rateLimit: argv.rateLimit,
    callback: crawlerCallback
});
const ads = [];

main();

function main() {
    try {
        validateArgs(argv);
        const fixedUrl = getFixedUrl(argv.url);

        for (let page = 1; page <= argv.pages; page++) {
            c.queue(fixedUrl + page);
        }
    } catch (error) {
        console.log('Something goes wrong:\n', error);
    }
}

function validateArgs(argv) {
    if (!argv.url) {
        throw 'Missing url';
    }

    if (typeof argv.pages !== 'number') {
        throw 'Wrong pages value';
    }

    if (typeof argv.rateLimit !== 'number') {
        throw 'Wrong rateLimit value';
    }
}

function getFixedUrl(originalUrl) {
    let url = originalUrl.trim();

    if (url.indexOf('imot.bg') === -1) {
        throw 'Wrong url value';
    }

    if (url.indexOf('www.') === -1) {
        url = 'www.' + url;
    }

    if (url.indexOf('https://') === -1) {
        url = 'https://' + url;
    }

    return url.slice(0, -1);
}

function crawlerCallback(error, res, done) {
    if (error) {
        console.log(error);
    } else {
        const $ = res.$;
        const fontElements = $('font');

        for (let index = 0; index < fontElements.length; index++) {
            const element = fontElements[index].parentNode;

            if (isNewAd(element)) {
                ads.push(getAdObject(element));
            }
        }

        if (isLastPage(this.uri)) {
            writeToFile(ads);
        }
    }
    done();
}

function isNewAd(element) {
    return element && element.childNodes && element.childNodes[4]
        && element.childNodes[4].attribs && element.childNodes[4].attribs.href;
}

function getAdObject(element) {
    const price = element.childNodes[1].children[0].data;
    const type = element.childNodes[4].children[0].data.replace('Продава ', '');
    const area = element.childNodes[9].children[0].data.replace('град София, ', '');
    const link = element.childNodes[4].attribs.href.replace('//', '');
    const additionalInfo = getAdditionalInfo(element);

    return { price, type, area, link, additionalInfo };
}

function getAdditionalInfo(element) {
    let info = '';
    try {
        const data = element.parent.parent.children[5].children[1].children[0].data;
        info = data.trim().substr(0, 68);
    } catch (error) {
        console.log('Error in getting additional info:\n', error);
    }

    return info;
}

function isLastPage(url) {
    return Number(url.slice(-1)) === argv.pages;
}

function writeToFile(ads) {
    const dateString = new Date().toISOString().slice(0, 10);
    const fileName = 'ads-' + dateString;
    const dir = __dirname + '/' + argv.dest;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    const stream = fs.createWriteStream(dir + '/' + fileName);
    stream.once('open', function () {
        stream.write('# New ads ' + dateString + ' #\n\n');
        console.log('# New ads ' + dateString + ' #\n\n');

        for (let index = 0; index < ads.length; index++) {
            const a = ads[index];
            stream.write(index + 1 + ') ' + a.price + ', ' + a.type + ', ' + a.area + '\n'
                + a.additionalInfo + '...\n' + a.link + '\n\n');
            console.log(index + 1 + ') ' + a.price + ', ' + a.type + ', ' + a.area + '\n'
                + a.additionalInfo + '...\n' + a.link + '\n\n');
        }

        stream.end();
    });
}
