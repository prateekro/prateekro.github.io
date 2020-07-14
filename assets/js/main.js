function getGithubChart(from, to) {
//    "url": "https://github.com/users/prateekro/contributions?from="+from+"&to="+to,
// Issue: CORS Block
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

function toHtml(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = String(htmlString).trim();
  
    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
}

function responsiveSvg(svgTag) {
    let svg = toHtml(svgTag);

    svg.setAttribute("preserveAspectRatio", "xMinYMin meet");
    svg.setAttribute("viewBox", [0, 0, svg.getAttribute("width"), svg.getAttribute("height")].join(" "));

    svg.removeAttribute("width");
    svg.removeAttribute("height");

    return svg;
}

// Svg tooltip - Add event listener
function addListenerToRects(svg) {
    let svg_list = svg.getElementsByTagName("rect");
      let total_count = 0;
      for(let i = 0; i < svg_list.length; i++) {
        let rect = svg_list[i];
        rect.addEventListener("mouseover", onMouseEnter);
        rect.addEventListener("mouseout", onMouseLeave);
        
        // Count total contributions
        total_count += parseInt(rect.getAttribute("data-count"));
    }

    return total_count;
}

var legend = 
`<div class="contrib-legend" title="A summary of pull requests, issues opened, and commits to the default and gh-pages branches.">
    Less
    <ul class="legend mx-0"><li></li><li></li><li></li><li></li><li></li></ul>
    More
</div>
`;

async function readyFn(jQuery) {
    // Code to run when the document is ready.
    console.log("Calling Contributions");
    let svg = await getSvg(getDate(1), getDate())
    
    console.log("Contributions received");
    responsivesvg = responsiveSvg(svg);
    $('#git-graph').append(responsivesvg);
    console.log("Contributions Inserted");
    
    let totalContri = addListenerToRects($('#git-graph')[0]);

    $('#git-graph').append('<div class="d-flex justify-content-around w-100" id="git-contribution"></div>');

    $('#git-contribution').append('<div class="total-contribution flex-fill text-left">' + totalContri + pluralize(totalContri , ' contribution') + '  in the last year</div>');
    
    $('#git-contribution').append(legend);


}

$( document ).ready(function readyFunc() {
    console.log('This is test');
    readyFn();
});

// Svg tooltip

function getDat(e) {
    // console.log('Reached in getDate');
    // console.log(e);
    // console.log('in getDate');
    var t = e.split("-").map(function(e) {
            return parseInt(e, 10)
        }),
    r = t[0],
    a = t[1],
    o = t[2];
    return new Date(Date.UTC(r, a - 1, o));
}
  
function pluralize(num, word) {
    if(num <= 1) {
      return word;
    } else {
      return word + "s";
    }
}
  
var month_name = ["January", "February", "March", "April", "May", "June", 
                "July", "August",
                "September", "October", "November", "December"];

function onMouseEnter(e) {
    e.target.matches("rect.day") && (onMouseLeave(), function(e) {
        var n = document.body;
        var r = e.getAttribute("data-date");
        var a = function(e, t) {
            // MMM DD, YYYY
            var n = month_name[t.getUTCMonth()].slice(0, 3) + 
                    " " + t.getUTCDate() + ", " + t.getUTCFullYear(),
            // No contribution or a string 
            r = 0 === e ? "No" : e.toString();
            // Create the element and add the class
            a = document.createElement("div");
            a.classList.add("svg-tip", "svg-tip-one-line");
            var o = document.createElement("strong");
            o.textContent = r + " " + pluralize(e, "contribution");
            a.append(o, " on " + n);
            return a;
        }(parseInt(e.getAttribute("data-count")), getDat(r));
        n.appendChild(a);
        var o = e.getBoundingClientRect(),
            s = o.left + window.pageXOffset - a.offsetWidth / 2 + o.width / 2,
            i = o.bottom + window.pageYOffset - a.offsetHeight - 2 * o.height;
        a.style.top = i + "px", a.style.left = s + "px"
    }(e.target));
  
    return;
}
  
function onMouseLeave() {
    var e = document.querySelector(".svg-tip");
    e && e.remove();

    return;
}

