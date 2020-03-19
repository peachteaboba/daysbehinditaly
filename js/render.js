var render = {};

render.dayColumn = function(count) {
    let html = [
        '<div class="day-title">Day</div>'
    ];
    for (let i=1; i <= count + 10; i++) {
        const dynamicClass = i % 2 !== 0 ? 'even' : '';
        html.push('<div class="'+dynamicClass+'"> ' + i + ' </div>');
    }
    return html.join('');
}

render.countryColumn = function(data) {

    console.log(data);

    let body = ['<div class="country-body">'];

    // Render Date
    body.push('<div class="country-date">');
    body.push('<div class="country-date-title">Date</div>');
    for (let i=0; i <= data.data.length - 1; i++) {
        console.log(data.data[i]);
        let date = new Date(data.data[i].date);
        date = moment(date).format('ddd, MMM D');
        const dynamicClass = i % 2 === 0 ? 'date even' : 'date';
        body.push('<div class="'+dynamicClass+'"> ' + date + ' </div>');
    }
    body.push('</div>');

    // Render Cases
    body.push('<div class="country-date">');
    body.push('<div class="country-date-title">Cases</div>');
    for (let i=0; i <= data.data.length - 1; i++) {
        const dynamicClass = i % 2 === 0 ? 'cases even' : 'cases';
        body.push('<div class="'+dynamicClass+'"> ' + data.data[i].confirmed + ' </div>');
    }
    body.push('</div>');


    // TODO: Make this toggleable ::::::::::::
    // :::::::::::::::::::::::::::::::::::::::
    // Render Deaths
    body.push('<div class="country-date">');
    body.push('<div class="country-date-title">Deaths</div>');
    for (let i=0; i <= data.data.length - 1; i++) {
        const dynamicClass = i % 2 === 0 ? 'cases even' : 'cases';
        body.push('<div class="'+dynamicClass+'"> ' + data.data[i].deaths + ' </div>');
    }
    body.push('</div>');
    // Render Recovered
    body.push('<div class="country-date">');
    body.push('<div class="country-date-title">Rec</div>');
    for (let i=0; i <= data.data.length - 1; i++) {
        const dynamicClass = i % 2 === 0 ? 'cases even' : 'cases';
        body.push('<div class="'+dynamicClass+'"> ' + data.data[i].recovered + ' </div>');
    }
    body.push('</div>');
    // ::::::::::::::::::::::::::::::::::::::
    // ::::::::::::::::::::::::::::::::::::::




    body.push('</div>');



    let html = [
        '<div class="country-title"><h1>'+data.name+'</h1><p>P - 60M</p></div>',
        body.join('')
    ]

    return html.join('');

}
