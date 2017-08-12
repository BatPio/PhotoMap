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

    TRACK_COLORS_ARRAY = ['#3772FF', '#3BB273', '#E1BC29', '#7768AE', '#AC3931'];

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
        this.trackLayer = L.layerGroup([]);
        this.trackLayer.addTo(map);
    }

    initEventListeners() {
        var onMapMoveEnd = (function(_app){
            return function () {
                _app.onMapsBoundMoved();
            }
        }) (this.app);
        this.map.on('moveend', onMapMoveEnd);
    }

    centerMapOnPoint(lat, lng) {
        this.map.setView(new L.LatLng(lat, lng), 18);
    }

    fitBounds(swPoint, nePoint) {
        var southWest = L.latLng(swPoint[0], swPoint[1]),
            northEast = L.latLng(nePoint[0], nePoint[1]),
            bounds = L.latLngBounds(southWest, northEast);
        this.map.fitBounds(bounds);
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

    showTrackList (tracks) {
        for (var i = 0; i < tracks.length ; i++) {
            this.showTrack(tracks[i], this.TRACK_COLORS_ARRAY[i % this.TRACK_COLORS_ARRAY.length]);
        }
    }

    showTrack(trackPoints, color) {
        var pointList = [];
        for (var i = 0; i < trackPoints.length ; i++) {
            var tPoint = trackPoints[i];
            pointList.push(new L.LatLng(tPoint.lat, tPoint.lng));
        }
        var trackPolyline = new L.Polyline(pointList, {
            color: color,
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1
        });
        trackPolyline.setText('  ►  ', {repeat: true,
            offset: 8,
            attributes: {
                'fill': color,
                'font-weight': 'bold',
                'font-size': '24'}
            }
        );
        this.trackLayer.addLayer(trackPolyline);
    }

    hideTracks() {
        this.trackLayer.clearLayers();
    }

    getVisibleMarkers() {
        if (this.markers === undefined) {
            return undefined;
        }
        var _map = this.map;
        return this.markers.filter(function(marker) {
            return _map.getBounds().contains(L.latLng(marker.lat, marker.lng));
        });
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

    getZoomLevel() {
        return this.map.getZoom();
    }

}