let dataRaw;
let dataset = {};
let dataCount = [];
// const displayList = ['us', 'united_kingdom'];
const displayList = [];
const ignoreList = ['china', 'korea_south', 'cruise_ship'];
const minTotal = 100;
let startingCount = 1000;
let expand = false;

(function init() {
    $(document).ready(function () {
        initControls();
        initTwitter();

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
            processData();
        }, 500);
    }).val(startingCount);

    $('#expand').on('change', function () {
        expand = $(this).is(":checked");
        urlGenerator('expand', expand ? '1' : '0');
        processData();
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
    history.pushState('', 'Days Behind Italy - COVID19', location.href.split('?')[0] += '?' + newParams);
}

// ---------------------
// ------ TWITTER ------
// ---------------------
function initTwitter() {
    const twitterEl = $('#tweet-hashtag-wrapper');
    if (twitterEl) twitterEl.show();

    const twitterEmbedEl = $('#tweet-embeds');
    if (twitterEmbedEl) twitterEmbedEl.show();
}

function getData() {
    $.get("https://pomber.github.io/covid19/timeseries.json", function (data) {
        // console.log(data);
        dataRaw = data;
        processData();
    }).then(function () {
        // Done
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
            const id = prop.replace(/\s+/g, '_').toLowerCase().replace(/[^\w\s]/gi, '');
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
                        latest: latest
                    });
                }
            }
        }
    }
    dataCount.sort((a, b) => (a.latest < b.latest) ? 1 : -1);

    // -------------------------------------------------
    // ------------ Shift To Match Italy ---------------
    // -------------------------------------------------
    let delta = {};
    const italyData = processed['italy']['data'];
    for (let prop in processed) {
        if (Object.prototype.hasOwnProperty.call(processed, prop)) {
            let country = processed[prop];
            if (country['name'] !== 'Italy') {
                let countryData = country['data'];
                // Get max for country
                const countryMax = country['latest'];
                // Find index of lowest delta
                delta = {};
                let value;
                for (let i = 0; i < italyData.length; i++) {
                    // Record lowest delta
                    value = Math.abs(italyData[i]['confirmed'] - countryMax);
                    if (typeof delta.value === "undefined" || delta.value > value) {
                        delta.value = value;
                        delta.idx = i;
                    }
                }
                country['idx'] = delta.idx;
                // Make sure idx in delta obj matches with length of countryData
                if (countryData.length > delta.idx) {
                    // Need to Trim
                    country['data'] = countryData.slice(-1 * (delta.idx + 1));
                } else {
                    // Need to Add
                    let daysBehind = 0;
                    const earliestDate = countryData[0]['date'];
                    while (countryData.length !== (delta.idx + 1)) {
                        daysBehind++;
                        let d = new Date(earliestDate);
                        d.setDate(d.getDate() - daysBehind);
                        countryData.unshift({
                            date: d,
                            confirmed: '-',
                            deaths: '-',
                            recovered: '-'
                        });
                    }
                    country['data'] = countryData;
                }
                // ----------------------------------------------------
                // ------------ Populate Remaining Days ---------------
                // ----------------------------------------------------
                countryData = country['data'];
                let daysForward = 0;
                const latestDate = countryData[countryData.length - 1]['date'];
                while (countryData.length !== italyData.length) {
                    daysForward++;
                    let d = new Date(latestDate);
                    d.setDate(d.getDate() + daysForward);
                    countryData.push({
                        date: d,
                        confirmed: '-',
                        deaths: '-',
                        recovered: '-',
                        days: daysForward
                    });
                }
                country['days'] = daysForward;
            }
        }
    }

    // Proceed to render
    dataset = processed;
    renderList();
    renderSummary();
}

function renderList() {
    const bodyEl = $('#body');
    bodyEl.html('');

    let html_arr = [];
    dataCount.forEach(function (el) {
        if (el.id !== 'italy' && dataset[el.id] && dataset[el.id].data) {
            // Create body wrapper div
            html_arr.push([
                '<div class="body-wrapper" data-id="' + el.id + '">',
                // Render day element
                '<div class="day-wrapper">',
                render.dayColumn(dataset['italy'].count),
                '</div>',
                // Render italy element
                '<div class="italy-wrapper">',
                render.countryColumn(dataset['italy'], dataset[el.id]['idx']),
                '</div>',
                // Render country element
                '<div class="country-wrapper">',
                render.countryColumn(dataset[el.id], dataset[el.id]['idx'], el.id),
                '</div>',
                '</div>'
            ].join(''));
        }
    });
    bodyEl.html(html_arr.join(''));
}

function renderSummary() {
    // console.log(dataCount);

    // Reset div
    const summaryEl = $('#summary-wrapper');
    summaryEl.html('');

    let html_arr = [];
    dataCount.forEach(function (el) {
        if (el.id !== 'italy' && dataset[el.id] && dataset[el.id].data) {
            // Create body wrapper div
            html_arr.push([
                render.summaryRow(el, dataset[el.id])
            ].join(''));
        }
    });
    summaryEl.html(html_arr.join(''));

    // Assign event handlers
    $('.summary-el').on('click', function () {
        const id = $(this).attr('data-id');
        const targetEl = $('.body-wrapper[data-id="' + id + '"]');
        if (id && targetEl) {
            $([document.documentElement, document.body]).animate({
                scrollTop: targetEl.offset().top - 40
            }, 1000);
        }
    });
}


// end
