/**
 * https://github.com/turban/Leaflet.Photo
 *
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Bjorn Sandvik
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

L.Photo = L.FeatureGroup.extend({
	options: {
		icon: {						
			iconSize: [40, 40]
		}
	},

	initialize: function (photos, options) {
		L.setOptions(this, options);
		L.FeatureGroup.prototype.initialize.call(this, photos);
	},

	addLayers: function (photos) {
		if (photos) {
			for (var i = 0, len = photos.length; i < len; i++) {
				this.addLayer(photos[i]);
			}
		}
		return this;
	},

	addLayer: function (photo) {	
		L.FeatureGroup.prototype.addLayer.call(this, this.createMarker(photo));
	},

	createMarker: function (photo) {
		var marker = L.marker(photo, {
			icon: L.divIcon(L.extend({
				html: '<div style="background-image: url(' + photo.thumbnail + ');"></div>​',
				className: 'leaflet-marker-photo'
			}, photo, this.options.icon)),
			title: photo.caption || ''
		});		
		marker.photo = photo;
		return marker;
	}
});

L.photo = function (photos, options) {
	return new L.Photo(photos, options);
};

if (L.MarkerClusterGroup) {

	L.Photo.Cluster = L.MarkerClusterGroup.extend({
		options: {
			featureGroup: L.photo,		
			maxClusterRadius: 100,		
			showCoverageOnHover: false,
			iconCreateFunction: function(cluster) {
				return new L.DivIcon(L.extend({
					className: 'leaflet-marker-photo', 
					html: '<div style="background-image: url(' + cluster.getAllChildMarkers()[0].photo.thumbnail + ');"></div>​<b>' + cluster.getChildCount() + '</b>'
				}, this.icon));
		   	},	
			icon: {						
				iconSize: [40, 40]
			}		   		
		},

		initialize: function (options) {	
			options = L.Util.setOptions(this, options);
			L.MarkerClusterGroup.prototype.initialize.call(this);
			this._photos = options.featureGroup(null, options);
		},

		add: function (photos) {
			this.addLayer(this._photos.addLayers(photos));
			return this;
		},

		clear: function () {
			this._photos.clearLayers();
			this.clearLayers();
		}

	});

	L.photo.cluster = function (options) {
		return new L.Photo.Cluster(options);	
	};

}