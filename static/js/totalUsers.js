'use strict';

// IIFE
(function () {

    // Init data
    let data = [];

    // Fetch json data
    d3.json('/load-data', (d) => {

        return d;
    }).then((d) => {

        // Redefine data
        data = d['users'];

        createVisUsers(data);
    }).catch((err) => {

        console.error(err);
    });

    /*
     Function :: createVis()
     */
})();

function createVisUsers(data) {

    const total = data.length;
    const textEl = d3.select('#total_users_text')
        .append('text')
        .text(total)
        .style('font-size', '32px')
        .style('font-style', 'italic')
        .style('color', 'rgb(67,0,0)');
}
