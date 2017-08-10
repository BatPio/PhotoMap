<?php
/**
 * PhotoMap
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Piotr Bator <prbator@gmail.com>
 * @copyright Piotr Bator 2017
 */
return [
    'routes' => [
	   ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],

       //geo photos
	   ['name' => 'geophotos#index', 'url' => '/geoPhotos', 'verb' => 'GET'],
       ['name' => 'geophotos#getPhotosFromDb', 'url' => '/geoPhotos/all', 'verb' => 'GET'],
       
       //photo files
       ['name' => 'photofiles#rescan', 'url' => '/photos/rescan', 'verb' => 'GET'],
       ['name' => 'photofiles#getPhotosByFolder', 'url' => '/photos/getPhotosByFolder/{path}', 'verb' => 'GET', 'requirements' => array('path' => '.+')],
    ]
];
