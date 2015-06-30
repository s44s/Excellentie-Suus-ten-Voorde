Personen = new Mongo.Collection('persoon');

//maps opstarten
if (Meteor.isClient) {
    Meteor.startup(function() {
    GoogleMaps.load();
  });

  Template.map.helpers({
    mapOptions: function() {
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(52.359144, 4.909363),
          zoom: 12
        };
      }
    }
  });

// personen aanmaken wanneer er op een bepaalde plek geklikt wordt
  Template.map.onCreated(function() {
    GoogleMaps.ready('map', function(map) {
      google.maps.event.addListener(map.instance, 'click', function(event) {
        Personen.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      });

Template.body.onCreated(function() {
  
  GoogleMaps.ready('exampleMap', function(map) {
    
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance

    });

    var marker = new google.maps.Marker({
      position: Geolocation.latLng(),
      map: map.instance

    });
  });
});

      var persoon = {};

      Personen.find().observe({
        added: function (document) {
          var marker = new google.maps.Marker({
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(document.lat, document.lng),
            map: map.instance,
            id: document._id
          });

          google.maps.event.addListener(marker, 'dragend', function(event) {
            Personen.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
          });

          persoon[document._id] = marker;
        },
        changed: function (newDocument, oldDocument) {
          persoon[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
        },
      });
    });
  });


//inloggen
  Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

  Personen.insert({
  text: text,
  createdAt: new Date(),            
  owner: Meteor.userId(),           
  username: Meteor.user().username  
});

}

// bron: https://github.com/dburles/reactive-maps-example/blob/master/reactive-maps-example.js
