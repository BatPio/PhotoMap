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

namespace OCA\PhotoMap\DB;

use OCP\AppFramework\Db\Entity;

class Geophoto extends Entity {

    protected $photoId;
    protected $lat;
    protected $lng;
    protected $userId;

    public function __construct() {
        // add types in constructor
        $this->addType('photoId', 'integer');
        $this->addType('lat', 'float');
        $this->addType('lng', 'float');
    }
}