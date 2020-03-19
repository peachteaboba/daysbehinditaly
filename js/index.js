let dataRaw;
let dataset = {};
let dataCount = [];
// const displayList = ['us', 'united_kingdom'];
const displayList = [];
const ignoreList = ['china', 'korea_south', 'cruise_ship'];
const minTotal = 100;
let startingCount = 500;
let expand = false;

(function init() {
    $(document).ready(function () {
        initControls();


        getData();
    });
})();

function initControls() {

    // Set initial starting range from url param
    const urlStarting = urlParams.get('starting') ? parseInt(urlParams.get('starting')) : 0;
    if (urlStarting && urlStarting >= minTotal && urlStarting <= 10000) startingCount = urlStarting;

    // Expand
    if (urlParams.get('expand') && urlParams.get('expand') === '1') expand = true;

    // Bind event handlers
    $('#starting-range').mousemove(function () {
        startingCount = $(this).val();
        setSliders();
    }).on('change', function () {
        setTimeout(function () {
            urlGenerator('starting', startingCount);
            dataset = processData();
            renderList();
        }, 500);
    }).val(startingCount);

    $('#expand').on('change', function () {
        expand = $(this).is(":checked");
        urlGenerator('expand', expand ? '1' : '0');
        dataset = processData();
        renderList();
    });

    // Set initial values
    setSliders();
}

function setSliders() {
    // Starting
    $('#starting-range-label').text(startingCount);

    // Expand
    $('#expand').prop('checked', expand);
}

function urlGenerator(field, value) {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set(field, value);
    const newParams = searchParams.toString();
    let newUrl = location.href.split('?')[0];
    history.pushState('', 'Days Behind Italy - COVID19', newUrl += '?' + newParams);
}

function getData() {
    $.get("https://pomber.github.io/covid19/timeseries.json", function (data) {
        dataRaw = data;
        dataset = processData();
    }).then(function () {
        renderList();
    });
}

function processData() {
    dataCount = [];
    dataset = [];
    let obj = dataRaw;
    let processed = {};
    for (let prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            // Remove under 100 cases
            let arr = [];
            let latest = 0;
            if (obj[prop] && obj[prop].length > 0) {
                for (let i = 0; i < obj[prop].length; i++) {
                    if (obj[prop][i]['confirmed'] >= startingCount) {
                        arr.push(obj[prop][i]);
                        if (i === obj[prop].length - 1) {
                            latest = obj[prop][i]['confirmed'];
                        }
                    }
                }
            }
            const id = prop.toLowerCase().replace(' ', '_').replace(',', '');
            if (arr.length > 0 && latest >= minTotal) {
                if (displayList.length > 0 && displayList.indexOf(id) === -1 && id !== 'italy') {
                    // Skip this
                } else if (ignoreList.indexOf(id) === -1) {
                    processed[id] = {
                        name: prop,
                        data: arr,
                        count: arr.length,
                        latest: latest
                    };
                    dataCount.push({
                        id: id,
                        count: arr.length,
                        latest: latest
                    });
                }
            }
        }
    }
    dataCount.sort((a, b) => (a.latest < b.latest) ? 1 : -1);
    return processed;
}

function renderList() {
    console.log(dataset);
    console.log(dataCount);

    const bodyEl = $('#body');
    bodyEl.html('');

    let html_arr = [];
    dataCount.forEach(function (el) {
        if (el.id !== 'italy' && dataset[el.id] && dataset[el.id].data) {
            //const country = dataset[id];


            // Create body wrapper div
            html_arr.push([
                '<div class="body-wrapper">',

                // Render day element
                '<div class="day-wrapper">',
                render.dayColumn(dataset['italy'].count),
                '</div>',
                // Render italy element
                '<div class="italy-wrapper">',
                render.countryColumn(dataset['italy']),
                '</div>',
                // Render country element
                '<div class="country-wrapper">',
                render.countryColumn(dataset[el.id]),
                '</div>',


                '</div>'
            ].join(''));


        }
    });

    bodyEl.html(html_arr.join(''));


    // // Render day column
    // const dayWrapper = $('#day-wrapper');
    // dayWrapper.html();
    //
    // // Render italy
    // const italyWrapper = $('#italy-wrapper');
    // italyWrapper.html(render.countryColumn(dataset['italy']));
    //
    //


}


// end
