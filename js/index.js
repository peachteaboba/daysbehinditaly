let dataset = {};
let dataCount = [];
const displayList = [];
const ignoreList = ['china', 'korea_south'];
const minTotal = 400;

(function init() {
    getData();

})();

function getData() {
    $.get( "https://pomber.github.io/covid19/timeseries.json", function( data ) {
        dataset = processData(data);
        renderList();
    });
}

function processData(obj) {
    let processed = {};
    for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            // Remove under 100 cases
            let arr = [];
            let latest = 0;
            if (obj[prop] && obj[prop].length > 0) {
                for (let i=0; i<obj[prop].length; i++) {
                    if (obj[prop][i].confirmed >= 100) {
                        arr.push(obj[prop][i]);
                        if (i === obj[prop].length -1) {
                            latest = obj[prop][i].confirmed;
                        }
                    }
                }
            }
            const id = prop.toLowerCase().replace(' ', '_').replace(',', '');
            if (arr.length > 0 && latest >= minTotal) {
                if (displayList.length > 0 && displayList.indexOf(id) === -1) {
                    // Skip this
                } else if (ignoreList.indexOf(id) === -1) {
                    processed[id] = {
                        name: prop,
                        data: arr,
                        count: arr.length,
                        latest: latest
                    }
                    dataCount.push({
                        id: id,
                        count: arr.length,
                        latest: latest
                    });
                }
            }
        }
    }
    dataCount.sort((a, b) => (a.latest < b.latest) ? 1 : -1)
    return processed;
}

function renderList() {
    console.log(dataset);
    console.log(dataCount);


    // Render day column
    const dayWrapper = $('#day-wrapper');
    dayWrapper.html(render.dayColumn(dataset.italy.count));

    // Render italy
    const italyWrapper = $('#italy-wrapper');
    italyWrapper.html(render.countryColumn(dataset.italy));







}
























// end
