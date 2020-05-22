const transitApiKey = 'GtcxZUCX28g3094pNheS';
const mapboxgKey = 'pk.eyJ1Ijoic2hlcjEwY2siLCJhIjoiY2thNXUwaGR0MDBsYzJzcGJuN3pyNm9zZCJ9.7g0y2GWDRHDu7ClTgmD0NQ';
const originForm = document.querySelector('.origin-form');
const destForm = document.querySelector('.destination-form');
const originsEle = document.querySelector('.origins');
const destinationsEle = document.querySelector('.destinations');
const launchBtn = document.querySelector('button');
const geometries = {origin: [], destination: []};

originForm.onsubmit = event => {
  displayLocations(event.target.firstElementChild.value, event);
};

destForm.onsubmit = event => {
  displayLocations(event.target.firstElementChild.value, event);
};

launchBtn.onclick = e => {
  if(geometries.origin.length !== 0 && geometries.destination.length !== 0) {
    displayTripPlanner(geometries);
  }
};

originsEle.onclick = e => {
  getGeomtries(e)
}

destinationsEle.onclick = e => {
  getGeomtries(e)
}

function getGeomtries(e) {
  if(e.target.nodeName === 'LI' ) {
  const locationEle = e.target.closest('ul').children;

  for(let i = 0; i < locationEle.length; i++) {
    locationEle[i].classList.remove('selected');
  }

  e.target.classList.toggle('selected');

  if (e.target.closest('ul').classList.contains('origins')) {
    geometries.origin = [e.target.dataset.long, e.target.dataset.lat];
    } else {
    geometries.destination = [e.target.dataset.long, e.target.dataset.lat]
    }
  }
}

function displayTripPlanner(g) {
  fetch(`https://api.winnipegtransit.com/v3/trip-planner.json?api-key=${transitApiKey}&origin=geo/${g.origin[1]},${g.origin[0]}&destination=geo/${g.destination[1]},${g.destination[0]}`)
    .then(resp => {
      if(resp.ok) {
        return resp.json();
      } else {
        throw new Error('invalid input');
      }
    })
    .then(data => {
      console.log(data)
      insertTripPlan(data)
    })
}

function insertTripPlan(p) {
  const steps = p.plans[0].segments;
  const tripEle = document.querySelector('.my-trip');
  tripEle.innerHTML = "";

  let html = `<li>
        <i class="fas fa-walking" aria-hidden="true"></i>Walk for ${steps[0].times.durations.total} minutes
        to stop #${steps[0].to.stop.key} - ${steps[0].to.stop.name}
      </li>`;

  
  for(let i = 1; i < steps.length - 1; i ++) {
    
  }

  html += ``;

  tripEle.innerHTML = html;
}


function displayLocations(query, event) {
  event.preventDefault();

  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxgKey}&limit=10&bbox=-97.325875, 49.766204, -96.953987, 49.99275`)
   .then(resp => resp.json())
   .then(data => {
      console.log(data);
      insertLocationList(data, event);
    });
}

function insertLocationList(data, event) {
  let html = "";
  
  data.features.forEach(location => {
    if(location.properties.address !== undefined) {
      html +=  `<li data-long="${location.geometry.coordinates[0]}" data-lat="${location.geometry.coordinates[1]}" class="">
        <div class="name">${location.text}</div>
        <div>${location.properties.address}</div>
      </li>`;
    } else {
      html +=  `<li data-long="${location.geometry.coordinates[0]}" data-lat="${location.geometry.coordinates[1]}" class="">
        <div class="name">${location.text}</div>
        <div>${location.context[0].text}</div>
      </li>`;
    }
  });

  if(event.target === originForm) {
    originsEle.innerHTML = "";
    originsEle.insertAdjacentHTML('afterbegin', html);
  } else if (event.target === destForm) {
    destinationsEle.innerHTML = "";
    destinationsEle.insertAdjacentHTML('afterbegin', html);
  }
}