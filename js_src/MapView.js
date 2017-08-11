'use strict'

/**
 * PhotoMap
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Piotr Bator <prbator@gmail.com>
 * @copyright Piotr Bator 2017
 */

export default class MapView {

    constructor(app) {
        this.app = app;
        this.initMap();
        this.initEventListeners();
    }

    initMap() {
        //Create a map
        var map = L.map('map', { maxZoom: 18});
        
        //Add Background Mapping
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '<a href="GISforThought.com">GISforThought</a> | <a href="http://blog.thematicmapping.org/2014/08/showing-geotagged-photos-on-leaflet-map.html">Leaflet.Photo</a> | Base map data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        //Create the photolayer
        var photoLayer = L.photo.cluster({ spiderfyDistanceMultiplier: 1.2 }).on('click', function (evt) {
            evt.layer.bindPopup(L.Util.template('<img src="{url}" height="auto" width="100%"/>', evt.layer.photo), {
                className: 'leaflet-popup-photo',
                minWidth: 400
            }).openPopup();
        });

        this.map = map;
        this.layer = photoLayer;
    }

    initEventListeners() {
        var onMapMoveEnd = (function(_app){
            return function () {
                _app.onMapsBoundMoved();
            }
        }) (this.app);
        this.map.on('moveend', onMapMoveEnd);
    }

    /**
     * 
     * @param {*} images array of markers: {id, lat, lng, url, thumbnail}
     */
    showPhotoMarkers(markers) {
        this.markers = markers;
        this.layer
            .add(markers)
            .addTo(this.map);
        this.map.fitBounds(this.layer.getBounds());
    }

    getVisibleMarkersIds() {
        if (this.markers === undefined) {
            return undefined;
        }
        var _map = this.map;
        var markersWithinBounds = this.markers.filter(function(marker) {
            return _map.getBounds().contains(L.latLng(marker.lat, marker.lng));
        });
        var idsSet = new Set();
        markersWithinBounds.forEach(function(item){
            idsSet.add(item.id);
        });
        return [...idsSet];
    }

    showFirstRunMessage() {
        var latlng = [25, 0];
        this.map.setView(latlng, 2);
        this.showPopup(latlng, "<h2>Nie dodałeś jeszcze zdięć?</h2><p>Dodaj zdięcia do chmury, jeśli zawierają dane o położeniu geograficznym zostaną automatycznie przypięte do mapy.</p><p>Jeśli zdięcia są w chmurze możesz przypiąć je do mapy używając polecenia: <b>occ&nbsp;photomap:rescanPhotos</b>.</p>");
    }

    showPopup(latlng, message) {
        L.popup()
        .setLatLng(latlng)
        .setContent(message)
        .openOn(this.map);
    }

}