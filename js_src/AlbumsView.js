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

import React from 'react';
import ReactDOM from 'react-dom';
import FoldersList from './FoldersList';

export default class AlbumsView {

    constructor(app) {
        this.app = app;
        this.filerAlbumsToMapCheckbox = document.getElementById('filter-albums-to-map');
        var filerAlbumsToMapCheckboxListener = (function(_app){
            return function (albumId) {
                _app.onFilterAlbumsToMapChanged();
            }
        })(this.app); 
        this.filerAlbumsToMapCheckbox.addEventListener('change', filerAlbumsToMapCheckboxListener);
        this.showTracksCheckbox = document.getElementById('show-album-tracks');
        var showTracksCheckboxListener = (function(_app){
            return function (albumId) {
                _app.onShowTracksChanged();
            }
        })(this.app); 
        this.showTracksCheckbox.addEventListener('change', showTracksCheckboxListener);
    }

    renderAlbumsList(albums) {
        var onItemsNeededFunc = (function(_app){
            return function (albumId) {
                _app.onAlbumPhotosNeeded(albumId);
            }
        })(this.app);
        var onAlbumClick = (function(_app){
            return function (albumId) {
                _app.onAlbumClicked(albumId);
            }
        })(this.app); 
        var onPhotoClick = (function(_app){
            return function (albumId, photoId) {
                _app.onAlbumItemClicked(albumId, photoId);
            }
        })(this.app); 
        
        ReactDOM.render(
            <FoldersList list={albums} onItemsNeededFunc={onItemsNeededFunc} onFolderClick={onAlbumClick} onFolderItemClick={onPhotoClick}/>,
            document.getElementById('visibleFolders')
        );

    }

    isFilterAlbumToMapChecked() {
        return this.filerAlbumsToMapCheckbox.checked;
    }

    isShowAlbumTracksChecked() {
        return this.showTracksCheckbox.checked;
    }

    hide() {
        document.getElementById('app-navigation').style.display = 'none';
    }

    show() {
        document.getElementById('app-navigation').style.display = 'block';
    }

}