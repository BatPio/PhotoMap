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

}