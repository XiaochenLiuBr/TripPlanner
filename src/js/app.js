const transitApiKey = 'GtcxZUCX28g3094pNheS';
const mapboxgKey = 'pk.eyJ1Ijoic2hlcjEwY2siLCJhIjoiY2thNXUwaGR0MDBsYzJzcGJuN3pyNm9zZCJ9.7g0y2GWDRHDu7ClTgmD0NQ';
const originForm = document.querySelector('.origin-form');
const destForm = document.querySelector('.destination-form');
const originsEle = document.querySelector('.origins');
const destinationsEle = document.querySelector('.destinations');
const launchBtn = document.querySelector('button');

originForm.onsubmit = event => {
  displayLocations(event.target.firstElementChild.value, event);
};

destForm.onsubmit = event => {
  displayLocations(event.target.firstElementChild.value, event);
};

launchBtn.onclick = e => {
  displayTripPlanner();
};

originsEle.onclick = e => {
  if(e.target.nodeName === 'LI' ) {
    const locationEle = e.target.closet('ul').children;

    locationEle.forEach(li => {
      li.classList.remove('selected');
    })
    e.target.classList.add('selected');
    console.log(e.target.dataset.long, e.target.dataset.lat);
  }
}


function displayTripPlanner() {

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