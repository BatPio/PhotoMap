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
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;
use OCA\PhotoMap\Service\GeophotoService;
use OCP\ILogger;

class GeophotosController extends Controller {
	private $userId;
	private $geophotoService;
	private $logger;

	public function __construct($AppName, ILogger $logger, IRequest $request, GeophotoService $GeophotoService, $UserId){
		parent::__construct($AppName, $request);
		$this->logger = $logger;
		$this->userId = $UserId;
		$this->geophotoService = $GeophotoService;
	}

	/**
	 * @NoAdminRequired
	 */	
	public function getPhotosFromDb() {
		$result = $this->geophotoService->getAllFromDB($this->userId);
		return new DataResponse($result);
	}

}
