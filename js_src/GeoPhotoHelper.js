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

export default class GeoPhotoHelper {

    calculateGeoPhotosBoundPoints(geoPhotos) {
        if (geoPhotos && geoPhotos.length) {
            var fPhoto = geoPhotos[0];
            var minLat = fPhoto.lat, maxLat = fPhoto.lat, minLng = fPhoto.lng, maxLng = fPhoto.lng;
            for (var i = 0; i < geoPhotos.length; i++) {
                var lat = geoPhotos[i].lat;
                var lng = geoPhotos[i].lng;
                if (minLat > lat) {
                    minLat = lat;
                } else if (maxLat < lat) {
                    maxLat = lat;
                }
                if (minLng > lng) {
                    minLng = lng;
                } else if (maxLng < lng) {
                    maxLng = lng;
                }
            }
            return [[minLat, minLng],[maxLat, maxLng]];
        }
    }

    calculateTrack(geoPhotos, ignoreTrackIds) {
        var tracksData = [];
        for (var i = 0; i < geoPhotos.length; i++) {
            var geoPhoto = geoPhotos[i];
            var date = new Date(geoPhoto.dateTaken * 1000);
            var trackKey = geoPhotos[i].folderId + '_' + date.getFullYear() + date.getMonth() + date.getDay();
            if (ignoreTrackIds && ignoreTrackIds.includes(trackKey)) {
                continue;
            }
            if (!tracksData[trackKey]) {
                tracksData[trackKey] = [];
            }
            tracksData[trackKey].push({
                lat: geoPhoto.lat,
                lng: geoPhoto.lng,
                dateTaken: geoPhoto.dateTaken
            });
        }

        for (i in tracksData) {
            if (tracksData.hasOwnProperty(i)) {
                tracksData[i].sort(function(a ,b) {
                    return a.dateTaken - b.dateTaken;
                });
            }
        }
        return tracksData;
    }

    calculateOrphanedTracks(albumsIds, tracksIds) {
        var ids = [];
        for (var i = 0; i < tracksIds.length; i++) {
            var trackAlbumId = Number(tracksIds[i].substring(0, tracksIds[i].indexOf('_')));
            if(!albumsIds.includes(trackAlbumId)) {
                ids.push(tracksIds[i]);
            }
        }
        return ids;
    }

    boundsIntersecs(bound1, bound2) {
        var latIntersects = (bound2[1][0] >= bound1[0][0]) && (bound2[0][0] <= bound1[1][0]);
        var lngIntersects = (bound2[1][1] >= bound1[0][1]) && (bound2[0][1] <= bound1[1][1]);
        return latIntersects && lngIntersects;
    }

}