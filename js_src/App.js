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

import AlbumInfosCache from './AlbumInfosCache'
import AlbumsView from './AlbumsView'
import MapView from './MapView'
import GeoPhotoHelper from './GeoPhotoHelper.js';

export default class App {

    TRACK_VISIBLITY_ZOOM_LEVEL = 12;

    SHOW_ONLY_GEOPHOTOS_IN_ALBUM = true;

    constructor() {
        this.albumsInfoCache = new AlbumInfosCache();
        this.albumsView = new AlbumsView(this);
        this.mapView = new MapView(this);
        this.gpHelper = new GeoPhotoHelper();
    }

    onShowTracksChanged() {
        this.renderTracks();
    }

    onFilterAlbumsToMapChanged() {
        this.renderAlbumsList();
    }

    onMapsBoundMoved() {
        this.renderAlbumsList();
        this.renderTracks();
    }

    onAlbumPhotosNeeded(albumId) {
        this.callForAlbumPhotos(albumId, this.albumsInfoCache.getAlbumInfo(albumId).path);
    }

    onAlbumClicked(albumId) {
        var geoPhotos = this.albumsInfoCache.getAlbumGeoPhotos(albumId);
        var boundPoints = this.gpHelper.calculateGeoPhotosBoundPoints(geoPhotos);
        if (boundPoints) {
            this.mapView.fitBounds(boundPoints[0], boundPoints[1]);
        }
    }

    renderTracks() {
        if (this.albumsView.isShowAlbumTracksChecked() && this.mapView.getZoomLevel() >= this.TRACK_VISIBLITY_ZOOM_LEVEL) {
            var visibleAlbumsIds = this.getMapVisibleAlbumsIds();
            var currentTracksIds = this.mapView.getTrackIds();
            var tracksOutOfMapBoundsIds = this.gpHelper.calculateOrphanedTracks(visibleAlbumsIds, currentTracksIds);
            if (tracksOutOfMapBoundsIds && tracksOutOfMapBoundsIds.length > 0) {
                //Hide tracks out of map bounds.
                this.mapView.hideTracks(tracksOutOfMapBoundsIds);
            }
            for (var i = 0; i < visibleAlbumsIds.length; i++) {
                var geoPhotos = this.albumsInfoCache.getAlbumGeoPhotos(visibleAlbumsIds[i]);
                var tracks = this.gpHelper.calculateTrack(geoPhotos, currentTracksIds);
                this.mapView.showTrackList(tracks);
            }
        } else {
            this.mapView.hideTracks();
        }
    }

    onAlbumItemClicked(albumId, photoId) {
        var pInfo = this.albumsInfoCache.getGeoPhotoInfo(albumId, photoId);
        this.mapView.centerMapOnPoint(pInfo.lat, pInfo.lng);
    }

    generateThumbnailUrl(filename) {
        return "/index.php/core/preview.png?file=" +filename + "&x=32&y=32";
    }

    generateImageUrl(filename) {
        return "/index.php/core/preview.png?file=" +filename + "&x=400&y=400";
    }

    generateGalleryUrl(path) {
        return OC.generateUrl("apps/gallery/#" + path);
    }

    showPhotosOnMap(photos) {
        var markers = this.preparePhotoMarkersForView(photos);
        this.mapView.showPhotoMarkers(markers);
    }

    preparePhotoMarkersForView(photos) {
        var markers = [];
        for (var i = 0; i < photos.length; i++) {
            markers.push({
                lat: photos[i].lat,
                lng: photos[i].lng,
                url: this.generateImageUrl(photos[i].path),
                thumbnail: this.generateThumbnailUrl(photos[i].path),
                albumId: photos[i].folderId
            });
        }
        return markers;
    }

    prepareAlbumInfosForView(albumInfosList) {
        var albumViewInfosList = [];
        albumInfosList.forEach(function(item) {
            var photosList = undefined;
            if(this.SHOW_ONLY_GEOPHOTOS_IN_ALBUM) {
                photosList = this.prepareAlbumPhotoInfosForView(item.geoPhotos);
            } else {
                photosList = item.filesList ? this.prepareAlbumPhotoInfosForView(item.filesList) : undefined;
            }
            albumViewInfosList.push({
                id: item.id,
                label: item.path,
                link: this.generateGalleryUrl(item.path.substring(1, item.path.length)),
                filesList : photosList
            });
        }, this);
        return albumViewInfosList;
    }

    prepareAlbumPhotoInfosForView(filesList) {
        var photoViewInfosList = [];
        filesList.forEach(function(item) {
            photoViewInfosList.push({
                id: item.fileId,
                name: item.name,
                thumb: this.generateThumbnailUrl(item.path)
            });
        }, this);
        return photoViewInfosList;
    }

    renderAlbumsList() {
        var albumsInfosList;
        if (this.albumsView.isFilterAlbumToMapChecked()) {
            var visibleAlbumsIds = this.getMapVisibleAlbumsIds();
            albumsInfosList = this.albumsInfoCache.getManyAlbumsInfo(visibleAlbumsIds);
        } else {
            albumsInfosList = this.albumsInfoCache.getAllAlbumsInfo();
        }
        var albumViewInfosList = this.prepareAlbumInfosForView(albumsInfosList);
        this.albumsView.renderAlbumsList(albumViewInfosList);
    }

    getMapVisibleAlbumsIds() {
        var mapBounds = this.mapView.getBounds();
        var ids = [];
        var albumInfosList = this.albumsInfoCache.getAllAlbumsInfo();
        albumInfosList.forEach(function(item){
            var albumBounds = this.gpHelper.calculateGeoPhotosBoundPoints(item.geoPhotos);
            if (this.gpHelper.boundsIntersecs(albumBounds, mapBounds)) {
                ids.push(item.id);
            }
        }, this);
        return ids;
    }

    callForImages() {
        $.ajax({
            'url' : OC.generateUrl('apps/photomap/geoPhotos/all'),
            'type': 'GET',
            'success': (function(_app) {
                return function(response) {
                    if (response[0].length == 0) {
                        _app.albumsView.hide();
                        _app.mapView.showFirstRunMessage();
                    } else {
                        _app.albumsInfoCache.addGeoPhotosToCache(response[0]);
                        _app.albumsInfoCache.addAlbumInfosToCache(response[1]);
                        _app.showPhotosOnMap(response[0]);
                    }
                }
            })(this)
        });
    }

    callForAlbumPhotos(folderId, folderPath) {
        $.ajax({
            'url' : OC.generateUrl('apps/photomap/photos/getPhotosByFolder/'+folderPath),
            'type': 'GET',
            'success': (function(_app) {
                return function(response) {
                    _app.albumsInfoCache.addAlbumPhotosToCache(folderId, response);
                    _app.renderAlbumsList();
                }
            })(this)
        });
    }

}