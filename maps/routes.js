// Coordenada básica
class mwLatLng {
    constructor(lat, lng) {
      this.lat = lat;
      this.lng = lng;
    }
}
  
  // Ruta individual gestionada por el manager
class mwRoute {
    constructor(manager, origin, destination) {
      this.manager = manager;
      this.origin = origin;
      this.destination = destination;
      this.mode = manager.cfg.directionMode;
      this.waypoints = []; // puntos intermedios opcionales
      this.drawOnResponse = true;
      this.style = {
        color: '#4287f5',
        weight: 4
      };
    this.onResult = null; // función callback personalizada
    }
  
    setMode(mode) {
      this.mode = mode;
      return this;
    }
  
    addWaypoint(latlng) {
      this.waypoints.push(latlng);
      return this;
    }
  
    setWaypoints(pointsArray) {
      this.waypoints = pointsArray;
      return this;
    }
  
    setStyle(style) {
      Object.assign(this.style, style);
      return this;
    }
  
    onResponse(callback) {
      this.onResult = callback;
      return this;
    }
  
    request() {
      this.manager.requestRoute(this);
      return this;
    }
  }
  
  // Manager base
  function mwRouteManager(cfg) {
    const self = {};
    self.cfg = Object.assign({
      directionMode: "DRIVING",
      mapType: "google",
    }, cfg || {});
  
    self.setGoogleMap = function(map) {
      self.googleMap = map;
    };
  
    self.decodePolyline = function(encoded) {
      return google.maps.geometry.encoding.decodePath(encoded);
    };
  
    self.createRoute = function(origin, destination) {
      return new mwRoute(self, origin, destination);
    };
  
    return self;
  }
  
  // Google Manager
  function mwGoogleRouteManager(cfg) {
    const base = mwRouteManager(cfg);
    const self = base;
    
  
    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = null;
  
    self.initRenderer = function() {
      directionsRenderer = new google.maps.DirectionsRenderer({
        map: self.googleMap,
        suppressMarkers: true,
        preserveViewport: true
      });
    };
  
    self.translateMode = function(mode) {
      const map = {
        DRIVING: google.maps.TravelMode.DRIVING,
        WALKING: google.maps.TravelMode.WALKING,
        TRANSIT: google.maps.TravelMode.TRANSIT,
        BICYCLING: google.maps.TravelMode.BICYCLING,
      };
      return map[mode.toUpperCase()] || google.maps.TravelMode.DRIVING;
    };
  
    self.requestRoute = function(route) {
      if (!self.googleMap) return;
      if (!directionsRenderer) self.initRenderer();
  
      const request = {
        origin: route.origin,
        destination: route.destination,
        travelMode: self.translateMode(route.mode),
        waypoints: route.waypoints.map(p => ({ location: p }))
      };
  
      directionsService.route(request, function(result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          if (route.drawOnResponse) {
            directionsRenderer.setDirections(result);
          }
          if (typeof route.onResult === "function") {
            route.onResult(result);
          }
        } else {
          console.error("Google Directions API failed:", status);
        }
      });
    };
  
    return self;
  }
  
  // OSRM Manager
  function mwOSRMRouteManager(cfg) {
    const self = mwRouteManager(cfg);
    const baseURL = self.cfg.osrmURL || "http://localhost:5000";
  
    function translateMode(mode) {
      switch (mode.toLowerCase()) {
        case 'driving': return 'car';
        case 'walking': return 'foot';
        case 'bicycling': return 'bike';
        default: return 'car';
      }
    }
  
    self.buildRouteURL = function(route) {
      const mode = translateMode(route.mode);
      const coords = [route.origin]
        .concat(route.waypoints)
        .concat([route.destination])
        .map(p => `${p.lng},${p.lat}`)
        .join(";");
  
      return `${baseURL}/route/v1/${mode}/${coords}?overview=full&geometries=polyline&steps=true`;
    };
  
    self.requestRoute = function(route) {
      const url = self.buildRouteURL(route);
      fetch(url)
        .then(resp => resp.json())
        .then(data => {
          if (route.drawOnResponse && self.googleMap) {
            const points = self.decodePolyline(data.routes[0].geometry);
            const polyline = new google.maps.Polyline({
              path: points,
              geodesic: true,
              strokeColor: route.style.color,
              strokeOpacity: 1.0,
              strokeWeight: route.style.weight,
            });
            polyline.setMap(self.googleMap);
          }
          if (typeof route.onResult === "function") {
            route.onResult(data);
          }
        })
        .catch(err => {
          console.error("OSRM route error", err);
        });
    };
  
    return self;
  }
  function mwRoutesUtil() {
	this.distanceThresholdMeters = 50; // valor por defecto

	this.setThreshold = function(meters) {
		this.distanceThresholdMeters = meters;
	};

	this.calculateDistanceMeters = function(lat1, lng1, lat2, lng2) {
		const R = 6371000; // radio de la Tierra en metros
		const toRad = (deg) => deg * Math.PI / 180;

		const dLat = toRad(lat2 - lat1);
		const dLng = toRad(lng2 - lng1);
		const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
		          Math.sin(dLng / 2) * Math.sin(dLng / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	};

	this.positionsAreClose = function(pos1, pos2, thresholdMeters) {
		if (!pos1 || !pos2) return false;
		const threshold = thresholdMeters !== undefined ? thresholdMeters : this.distanceThresholdMeters;
		const distance = this.calculateDistanceMeters(pos1.lat, pos1.lng, pos2.lat, pos2.lng);
		return distance < threshold;
	};
}
