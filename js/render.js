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

render.countryColumn = function (data, idx, id) {
    let body = ['<div class="country-body">'];

    // Build Date HTML :::::::::::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::
    let date_html = [];
    date_html.push('<div class="country-date">');
    date_html.push('<div class="country-date-title date">Date</div>');
    for (let i = 0; i <= data.data.length - 1; i++) {
        let date = new Date(data.data[i]['date']);
        const moment_date = moment(date);
        date = moment(date).format('ddd, MMM DD');
        let isSameDayClass = '';
        if (moment_date.isSame(moment(), 'day')) isSameDayClass = ' today';
        const dynamicClass = i % 2 === 0 ? 'date even' + isSameDayClass : 'date' + isSameDayClass;
        date_html.push('<div class="' + dynamicClass + '"> ' + date);
        // Add days forward if needed
        const days = data.data[i]['days'];
        if (data['name'] !== 'Italy' && typeof days !== "undefined") {
            date_html.push('<div class="days-forward">+ ' + days + ' days</div>');
        }
        date_html.push('</div>');
    }
    date_html.push('</div>');

    // Build Cases HTML ::::::::::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::
    let cases_html = [];
    cases_html.push('<div class="country-date">');
    cases_html.push('<div class="country-date-title">Cases</div>');
    for (let i = 0; i <= data['data'].length - 1; i++) {
        let matchClass = '';
        if (idx && i === idx) {
            matchClass = ' match';
        }
        const dynamicClass = i % 2 === 0 ? 'cases total even' + matchClass : 'cases total' + matchClass;
        cases_html.push('<div class="' + dynamicClass + '"> ' + data.data[i]['confirmed'].toLocaleString() + ' </div>');
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
            deaths_html.push('<div class="' + dynamicClass + '"> ' + data.data[i]['deaths'].toLocaleString() + ' </div>');
        }
        deaths_html.push('</div>');
        // Render Recovered
        rec_html.push('<div class="country-date">');
        rec_html.push('<div class="country-date-title">Rec</div>');
        for (let i = 0; i <= data.data.length - 1; i++) {
            const dynamicClass = i % 2 === 0 ? 'cases rec even' : 'cases rec';
            rec_html.push('<div class="' + dynamicClass + '"> ' + data.data[i]['recovered'].toLocaleString() + ' </div>');
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

    // Image html
    let img_html = '';
    if (typeof id !== "undefined") {
        const img_src = 'img/' + id + '.png';
        img_html = '<img src="' + img_src + '" alt="' + data.name + '">';
    }

    // Days title html
    let days_title_html = '';
    if (data['name'] !== 'Italy') {
        days_title_html = [
            '<div class="days-total-title" style="color: ' + getDaysColor(data['days']) + '">',
            data['days'],

            '</div>'
        ].join('');
    }

    let html = [
        '<div class="country-title">',
        '<h1>' + data.name + '</h1>',
        img_html,
        days_title_html,
        '</div>',
        body.join('')
    ];

    return html.join('');
};

render.summaryRow = function (data, country) {
    // console.log('------');
    // console.log(data);
    // console.log(country);
    // console.log(data.id);

    const img_src = 'img/' + data['id'] + '.png';

    let title_html = [
        '<div class="title">',
        '<p>' + country['name'] + '</p>',
        '<img src="' + img_src + '" alt="' + country['name'] + '">',
        '</div>'
    ].join('');

    let cases_html = [
        '<div class="cases">',
        '<p>Total Cases</p>',
        '<h1>' + data['latest'].toLocaleString() + '</h1>',
        '</div>'
    ].join('');

    let days_html = [
        '<div class="days">',
        '<p>Days Behind Italy</p>',
        '<h1 style="color: ' + getDaysColor(country['days']) + '">' + country['days'] + '</h1>',
        '</div>'
    ].join('');

    let html = [
        '<div class="summary-el noselect" data-id="' + data['id'] + '">',
        title_html,
        cases_html,
        days_html,
        '</div>'
    ];

    return html.join('');
};

function getDaysColor(days) {
    let color = '#14C758';
    if (days <= 7) {
        color = '#EB443F';
    } else if (days <= 14) {
        color = '#FA8050';
    } else if (days <= 21) {
        color = '#FBD661';
    }
    return color;
}
