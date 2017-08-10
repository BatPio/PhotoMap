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

export default class AlbumInfosCache {

    constructor() {
        this.infosArray = {};
    }

    addAlbumInfoToCache(albumInfo) {
        for (var property in albumInfo) {
            if (albumInfo.hasOwnProperty(property)) {
                var albumId = property;
                if (!this.infosArray[albumId]) {
                    this.infosArray[albumId] = {};
                }
                var folderEntry = this.infosArray[albumId];
                folderEntry.id = albumInfo[albumId].id;
                folderEntry.path = albumInfo[albumId].path;
                folderEntry.name = albumInfo[albumId].name;
            }
        }
    }

    addAlbumPhotosToCache(albumId, photos) {
        if (!this.infosArray[albumId]) {
            this.infosArray[albumId] = {};
        }
        var folderEntry = this.infosArray[albumId];
        folderEntry.filesList = photos;
    }

    getAlbumInfo(albumId) {
        return this.infosArray[albumId];
    }

    getManyAlbumsInfo(albumsIds) {
        return Object.keys(this.infosArray)
        .filter((key) => albumsIds.includes(Number(key)))
        .reduce((array, key) => {
            array.push(this.infosArray[key]);
            return array;
        }, []);
    }

    getAllAlbumsInfo() {
        return Object.keys(this.infosArray)
        .reduce((array, key) => {
            array.push(this.infosArray[key]);
            return array;
        }, []);
    }

}