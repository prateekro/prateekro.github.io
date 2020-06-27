function getGithubChart(from, to) {
//    "url": "https://github.com/users/prateekro/contributions?from="+from+"&to="+to,
    return new Promise((resolve, reject) => {
    let settings = {
            "url": "https://github.com/users/prateekro/contributions?from=2019-06-01&to=2020-06-21",
            "method": "GET",
            "timeout": 0,
            "crossDomain": true,
            "dataType": "jsonp",
            "headers": {
                'Access-Control-Allow-Credentials' : true,
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Methods':'GET',
                'Access-Control-Allow-Headers':'application/json',
            },
            "statusCode": {
                200: function (data) {
                    console.log("Request completed 200");
                    console.log(data);
                    console.log(JSON.stringify(data));
                    console.log("Printed data");
                    resolve(data || {statusCode: 200});
                }
            }
        };

    $.ajax(settings).done(
        function (response) { 
            console.log('response' + JSON.stringify(response));
        }
    );

    });
}

function getSvg(from, to) {
//    "url": "https://github.com/users/prateekro/contributions?from="+from+"&to="+to,
    return new Promise((resolve, reject) => {
    let settings = {
            "url": "https://ctvey6shn9.execute-api.us-west-1.amazonaws.com/prod/contributions",
            "method": "GET",
            "timeout": 0,
            "statusCode": {
                200: function (data) {
                    console.log("Request completed 200");
                    resolve(data || {statusCode: 200});
                }
            }
        };

    $.ajax(settings);

    });
}

function getDate(last = 0) {
    let date = new Date().toISOString().split('T')[0];
    let ymd = date.split('-')[0];
    return ymd[0] + '-' + ymd[1] + '-' + (ymd[2] - last);
}

async function generateChart() {
    try {
        let data = await getSvg(getDate(1), getDate());
    } catch (e) {
        console.log('Issue found:' + JSON.stringify(e));
    }
    console.log("SVG filtering");
    let svg = '<svg>\n';
    flag = 0;
    for(let line of data.split('\n')) {
        if (line.indexOf('svg') != -1) {
            flag? flag = 0 : flag = 1
            continue;
        }
        if (flag) {
            svg += line + '\n'
        } else {
            continue;
        }
    }
    console.log("SVG filtered" + svg);
    return svg + '</svg>';
}

async function readyFn(jQuery) {
    // Code to run when the document is ready.
    console.log("Calling GET");
//    let svg = await getSvg(getDate(1), getDate())
//    let svg = `<svg width="100" height="100">
//                <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
//            </svg>`
    let svg = await getSvg(getDate(1), getDate())
    console.log("SVG Formed");
    $('#git-graph').append(svg);
    console.log("Chart Inserted");
}

$( document ).ready(function readyFunc() {
    console.log('This is test');
    readyFn();
});

