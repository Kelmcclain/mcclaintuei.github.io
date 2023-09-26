
const incidents = JSON.parse(localStorage.getItem('incidents')) || [
    {
        incidentId: 'x8WpAgX1Rbe6333SNn37Uo8Fi',
        title: 'Fight At Circle K',
        update: 'Law enforcement units are on their way to the scene to investigate the incident',
        address: '10625 North 19th Avenue, Phoenix,AZ, USA',
        clip: 'SB194WcCSq0YkSQ',
        tags: ['commercial', 'assault', 'unconfirmed','low','active'],
        author: 'McClain',
        date: '9/18',
        time:'6:41',
        updates:[]


    }, {
        incidentId: 'x8WpAgX1Rbe6333SNn37jho8Fi',
        title: 'Vehicle Collision With Injuries',
        update: 'First responders are responding to a 911 report of a vehicle collision with injuries.',
        address: 'N Avondale Blvd & W McDowell Rd, Avondale, AZ, USA',
        clip: 'SB194WcCSq0YkSQ',
        tags: ['commercial', 'assault', 'unconfirmed','high','active'],
        author: 'McClain',
        date: '9/18',
        time:'6:35',
        updates:[]

    }
]

