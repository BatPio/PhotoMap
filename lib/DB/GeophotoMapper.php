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

use OCP\IDBConnection;
use OCP\AppFramework\Db\Mapper;

class GeophotoMapper extends Mapper {

    public function __construct(IDBConnection $db) {
        parent::__construct($db, 'photomap_photos');
    }

    public function find($id) {
        $sql = 'SELECT * FROM `*PREFIX*photomap_photos` ' .
            'WHERE `id` = ?';
        return $this->findEntity($sql, [$id]);
    }


    public function findAll($userId, $limit=null, $offset=null) {
        $sql = 'SELECT * FROM `*PREFIX*photomap_photos` where `user_id` = ?';
        return $this->findEntities($sql, [$userId], $limit, $offset);
    }

    public function deleteByFileId($fileId) {
        $sql = 'DELETE FROM `*PREFIX*photomap_photos` where `file_id` = ?';
        return $this->execute($sql, [$fileId]);
    }

    public function deleteAll($userId) {
        $sql = 'DELETE FROM `*PREFIX*photomap_photos` where `user_id` = ?';
        return $this->execute($sql, [$userId]);
    }

}
