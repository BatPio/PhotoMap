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

namespace OCA\PhotoMap\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;
use OCP\ILogger;

use OCA\PhotoMap\Service\PhotofilesService;


class PhotofilesController extends Controller {
	private $userId;
	private $photofilesService;
	private $logger;

	public function __construct($AppName, ILogger $logger, IRequest $request, PhotofilesService $photofilesService, $UserId) {
		parent::__construct($AppName, $request);
		$this->logger = $logger;
		$this->userId = $UserId;
		$this->photofilesService = $photofilesService;
	}

	/**
	 * @NoAdminRequired
	 */	
	public function rescan() {
		$this->photofilesService->rescan($this->userId);
		return new DataResponse(true);
	}

	/**
	 * @NoAdminRequired
	 */	
	public function getPhotosByFolder($path) {
		$result = $this->photofilesService->getPhotosByFolder($this->userId, $path);
		return new DataResponse($result);
	}

}
