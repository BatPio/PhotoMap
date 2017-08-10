'use strict';

/**
 * PhotoMap
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Piotr Bator <prbator@gmail.com>
 * @copyright Piotr Bator 2017
 */

import App from './App';

$(document).ready(() => {
	var checkbox = document.getElementById('filter-albums-to-map');
	var app = new App();
	app.callForImages();
});



