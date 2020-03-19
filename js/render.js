const urlParams = new URLSearchParams(window.location.search);
let render = {};

render.dayColumn = function (count) {
    let html = [
        '<div class="day-title">Day</div>'
    ];
    for (let i = 1; i <= count; i++) {
        const dynamicClass = i % 2 !== 0 ? 'even' : '';
        html.push('<div class="' + dynamicClass + '"> ' + i + ' </div>');
    }
    return html.join('');
};

render.countryColumn = function (data) {
    let body = ['<div class="country-body">'];

    // Build Date HTML :::::::::::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::
    let date_html = [];
    date_html.push('<div class="country-date">');
    date_html.push('<div class="country-date-title">Date</div>');
    for (let i = 0; i <= data.data.length - 1; i++) {
        //console.log(data.data[i]);
        let date = new Date(data.data[i]['date']);
        date = moment(date).format('ddd, MMM DD');
        const dynamicClass = i % 2 === 0 ? 'date even' : 'date';
        date_html.push('<div class="' + dynamicClass + '"> ' + date + ' </div>');
    }
    date_html.push('</div>');

    // Build Cases HTML ::::::::::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::
    let cases_html = [];
    cases_html.push('<div class="country-date">');
    cases_html.push('<div class="country-date-title">Cases</div>');
    for (let i = 0; i <= data['data'].length - 1; i++) {
        const dynamicClass = i % 2 === 0 ? 'cases total even' : 'cases total';
        cases_html.push('<div class="' + dynamicClass + '"> ' + data.data[i]['confirmed'] + ' </div>');
    }
    cases_html.push('</div>');

    // Build Deaths / Rec HTML :::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::
    let deaths_html = [];
    let rec_html = [];
    //const urlParams = new URLSearchParams(window.location.search);
    if (expand) {
        // Render Deaths
        deaths_html.push('<div class="country-date">');
        deaths_html.push('<div class="country-date-title">Deaths</div>');
        for (let i = 0; i <= data['data'].length - 1; i++) {
            const dynamicClass = i % 2 === 0 ? 'cases deaths even ' : 'cases deaths';
            deaths_html.push('<div class="' + dynamicClass + '"> ' + data.data[i]['deaths'] + ' </div>');
        }
        deaths_html.push('</div>');
        // Render Recovered
        rec_html.push('<div class="country-date">');
        rec_html.push('<div class="country-date-title">Rec</div>');
        for (let i = 0; i <= data.data.length - 1; i++) {
            const dynamicClass = i % 2 === 0 ? 'cases rec even' : 'cases rec';
            rec_html.push('<div class="' + dynamicClass + '"> ' + data.data[i]['recovered'] + ' </div>');
        }
        rec_html.push('</div>');
    }

    // Combine components ::::::::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::
    if (data['name'] === 'Italy') {
        body.push(date_html.join(''));
        body.push(rec_html.join(''));
        body.push(deaths_html.join(''));
        body.push(cases_html.join(''));
    } else {
        body.push(cases_html.join(''));
        body.push(deaths_html.join(''));
        body.push(rec_html.join(''));
        body.push(date_html.join(''));
    }

    body.push('</div>');

    let html = [
        '<div class="country-title"><h1>' + data.name + '</h1><p>P · 60M</p></div>',
        body.join('')
    ];

    return html.join('');

};
