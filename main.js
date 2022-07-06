function initMap() {

    let map = new google.maps.Map(document.getElementById("map"), {
      zoom: 3,
      minZoom: 3,
      center: {lat: 10, lng: 20},
      mapTypeId: 'hybrid',
      disableDefaultUI: true,
    });
  
    // Search field 
    searchField.addEventListener('keyup', function(event){
  
      if (event.keyCode === 13) {
        event.preventDefault();
        this.blur();
        searchLocation();
      }
    });
  
    findLocation.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
  
            map.setCenter(pos);
  
            if (!markerPlaced){
              placeMarker(pos);
              markerPlaced = true;
            } 
            else {
              marker.setMap(null);
              placeMarker(pos);
            };
          }
        )
      }
    });
  
    map.addListener('click', function(e) {
        
        infoTitle = "";
        starRating = 0;
        waveHeight = Math.floor(Math.random() * 30);
        wavePeriod = Math.floor(Math.random() * 20);
        waveDirection = Math.floor(Math.random() * 360);
        windDirection = Math.floor(Math.random() * 360);
        windStrength = Math.floor(Math.random() * 50);
        lowTide = Math.floor(Math.random() * 11);
        highTide = lowTide + 12;
        
        if (waveHeight <= 5){
            starRating += 1;
        } 
        else if (waveHeight >= 5 && waveHeight <= 10) {
            starRating += 2;
        }
        else if (waveHeight >= 11 && waveHeight <= 20) {
            starRating += 4;
        }
        else {
            starRating += 5;
        }

        if (wavePeriod <= 5){
            starRating += 1; 
        } else if (wavePeriod >= 5 && wavePeriod <= 10){
            starRating += 3;
        } else {
            starRating += 5;
        }

        if ((waveDirection - windDirection) >= 0 && (waveDirection - windDirection) <= 45){
            starRating +=1;
        } else if ((waveDirection - windDirection) >= 46 && (waveDirection - windDirection) <= 90){
            starRating += 3;
        } else {
            starRating += 5;
        }

        if (windStrength <= 5){
            starRating += 5;
        } else if (windStrength > 5 && windStrength <= 30) {
            starRating += 3;
        } else {
            starRating += 1;
        }
        
        starRating /= 4;
        console.log(starRating);

       // Info window

       for (i = 0; i < starRating; i++) {
        infoTitle += "🌊";     
    };
  
      const content = `<h1>${infoTitle}</h1>
      <br>
      <p>Wave height - ${waveHeight} ft</p>
      <br>
      <p>Swell period - ${wavePeriod} seconds</p>
      <br>
      <p>Swell direction - ${waveDirection}°</p>
      <br>
      <p>Wind direction - ${windDirection}°</p>
      <br>
      <p>Wind strength - ${windStrength}km</p>`;

      const infowindow = new google.maps.InfoWindow({
        content: content,
      });

      data.lat = e.latLng.lat();
      data.lng = e.latLng.lng();
  
      // Remove previous marker when adding a new marker
      if (!markerPlaced){
        placeMarker(e.latLng);
        markerPlaced = true;
      } 
      else {
        marker.setMap(null);
        placeMarker(e.latLng);
      };
  
     
      // Allow user to click marker to open up info window
      marker.addListener("click", () => {
        infowindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
        });
      })
    }); // End of map click function
  
    function searchLocation(){
  
      let request = {
        query: searchField.value,
        fields: ["name", "geometry"],
      };
  
      service = new google.maps.places.PlacesService(map);
      service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
  
        if (!markerPlaced){
          placeMarker(results[0].geometry.location);
          markerPlaced = true;
        } 
        else {
          marker.setMap(null);
          placeMarker(results[0].geometry.location);
        };
  
        map.setCenter(results[0].geometry.location);
      }
      else {
        // Paste error message
        searchErrorText.innerHTML = "This place does not exist";
      };
      });
    };
  
    // Marker design
    const svgMarker = {
      path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: "aqua",
      fillOpacity: 1,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(15, 30),
    };
  
    // Place marker function
    function placeMarker(pos){
      marker = new google.maps.Marker({
        position: pos,
        animation: google.maps.Animation.DROP,
        icon: svgMarker,
        map
      })
    };
  
     // Disable view of businesses
     styles = [
      {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
          { "visibility": "off" }
        ]
      }
    ];  
  
    map.setOptions({ styles: styles })
  
  } // end of map init function
  
  // Global variables
  let infoModal;
  let infoTitle;
  let infoText;
  let data = [];
  let marker;
  let markerPlaced = false;
  let currentLat;
  let currentLng;
  let service;
  let searchField = document.getElementById('search-field');
  let searchErrorText = document.getElementById('search-error-text');
  let findLocation = document.getElementById('user-location');
  let waveHeight;
  let wavePeriod;
  let waveDirection;
  let windDirection;
  let windStrength;
  let lowTide;
  let highTide;
  let starRating;