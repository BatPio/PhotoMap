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

namespace OCA\PhotoMap\Service;

use OCP\Files\FileInfo;
use OCP\IL10N;
use OCP\Files\IRootFolder;
use OCP\Files\Storage\IStorage;
use OCP\Files\Folder;
use OCP\Files\Node;
use OCA\PhotoMap\DB\Geophoto;
use OCA\PhotoMap\DB\GeophotoMapper;
use OCP\ILogger;

class PhotofilesService {

    private $l10n;
    private $root;
    private $photoMapper;
    private $logger;

    public function __construct (ILogger $logger, IRootFolder $root, IL10N $l10n, GeophotoMapper $photoMapper) {
        $this->root = $root;
        $this->l10n = $l10n;
        $this->photoMapper = $photoMapper;
        $this->logger = $logger;
    }

    public function rescan ($userId){
        $userFolder = $this->root->getUserFolder($userId);
        $photos = $this->gatherPhotoFiles($userFolder, true);
        $this->photoMapper->deleteAll($userId);
        foreach($photos as $photo) {
            $this->addPhoto($photo, $userId);
        }
    }

    public function addFile(Node $file) {
        $this->logger->warning("FIle hook" . $file->getInternalPath(). $file->getName());
        $userFolder = $this->root->getUserFolder($file->getOwner()->getUID());
        if($this->isPhoto($file)) {
            $this->addPhoto($file, $file->getOwner()->getUID());
        }
    }

    private function addPhoto($photo, $userId) {
        $geoExif = $this->getGeoExif($photo);
        if (!is_null($geoExif) AND !is_null($geoExif->lat)) {
            $photoEntity = new Geophoto();
            $photoEntity->setPhotoId($photo->getId());
            $photoEntity->setLat($geoExif->lat);
            $photoEntity->setLng($geoExif->lng);
            $photoEntity->setUserId($userId);
            $this->photoMapper->insert($photoEntity);
            $this->logger->warning("FIle hook inseted" . $photo->getName(). " fr:" . $userId);
        }
    }

    private function normalizePath($node) {
        return str_replace("files","", $node->getInternalPath());
    }

    public function getPhotosByFolder($userId, $path) {
        $userFolder = $this->root->getUserFolder($userId);
        $folder = $userFolder->get($path);
        return $this->getPhotosListForFolder($folder);
    }

    private function getPhotosListForFolder($folder) {
        $FilesList = $this->gatherPhotoFiles($folder, false);
        $notes = [];
        foreach($FilesList as $File) {
            $file_object = new \stdClass();
            $file_object->path = $this->normalizePath($File);
            $notes[] = $file_object;
        }
        return $notes;
    }

	private function gatherPhotoFiles ($folder, $recursive) {
		$notes = [];
		$nodes = $folder->getDirectoryListing();
		foreach($nodes as $node) {
			if($node->getType() === FileInfo::TYPE_FOLDER AND $recursive) {
				$notes = array_merge($notes, $this->gatherPhotoFiles($node, $recursive));
				continue;
			}
			if($this->isPhoto($node)) {
				$notes[] = $node;
			}
		}
		return $notes;
	}

    private function isPhoto($file) {
        $allowedExtensions = ['jpg', 'jpeg'];

        if($file->getType() !== \OCP\Files\FileInfo::TYPE_FILE) return false;
        if(!in_array(
            pathinfo($file->getName(), PATHINFO_EXTENSION),
            $allowedExtensions
        )) return false;

        return true;
    }

    private function hasExifGeoTags($exif) {
		if (count($exif["GPSLatitude"]) == 3 AND count($exif["GPSLongitude"]) == 3) {
			return true;
		}
		return false;
	}

    private function getGeoExif($file) {
        $path = $file->getStorage()->getLocalFile($file->getInternalPath());
        $exif = exif_read_data($path);
        //Check photos are on the earth
        if($this->hasExifGeoTags($exif) AND $exif["GPSLatitude"][0]<90 AND $exif["GPSLongitude"][0]<180){
            
            //Check photos are not on NULL island, remove if they should be.
            if($exif["GPSLatitude"][0]!=0 OR $exif["GPSLatitude"][1]!=0 OR $exif["GPSLongitude"][0]!=0 OR $exif["GPSLongitude"][1]!=0){
                //Check if there is exif infor
                $LatM = 1; $LongM = 1;
                if($exif["GPSLatitudeRef"] == 'S'){
                    $LatM = -1;
                }
                if($exif["GPSLongitudeRef"] == 'W'){
                    $LongM = -1;
                }
                //get the GPS data
                $gps['LatDegree']=$exif["GPSLatitude"][0];
                $gps['LatMinute']=$exif["GPSLatitude"][1];
                $gps['LatgSeconds']=$exif["GPSLatitude"][2];
                $gps['LongDegree']=$exif["GPSLongitude"][0];
                $gps['LongMinute']=$exif["GPSLongitude"][1];
                $gps['LongSeconds']=$exif["GPSLongitude"][2];

                //convert strings to numbers
                foreach($gps as $key => $value){
                    $pos = strpos($value, '/');
                    if($pos !== false){
                        $temp = explode('/',$value);
                        $gps[$key] = $temp[0] / $temp[1];
                    }
                }
                $file_object = new \stdClass();
                //calculate the decimal degree
                $file_object->lat = $LatM * ($gps['LatDegree'] + ($gps['LatMinute'] / 60) + ($gps['LatgSeconds'] / 3600));
                $file_object->lng = $LongM * ($gps['LongDegree'] + ($gps['LongMinute'] / 60) + ($gps['LongSeconds'] / 3600));
                return $file_object;
            }
        }
        return null;
    }

}
