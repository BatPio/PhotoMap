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

namespace OCA\PhotoMap\Hook;

use OCA\PhotoMap\Service\PhotofilesService;
use OC\Files\Filesystem;
use OC\Files\View;
use OCP\ILogger;
use OCP\Files\Node;
use OCP\Files\IRootFolder;

/**
 * Handles files events
 */
class FileHooks {

	private $photofilesService;

	private $logger;

	private $root;

	public function __construct(IRootFolder $root, PhotofilesService $photofilesService, ILogger $logger, $appName) {
		$this->photofilesService = $photofilesService;
		$this->logger = $logger;
		$this->root = $root;
	}

	public function register() {
		$callback = function(\OCP\Files\Node $node) {
			if($this->isUserNode($node)) {
				$this->logger->warning("LOGPHOTOMAP". $node->getInternalPath() .">>". $node->getStorage()->getId().">".$node->getStorage()->isLocal().">".$node->getType());
				$this->photofilesService->addFile($node);
			}
		};
		$this->root->listen('\OC\Files', 'postWrite', $callback);
	}


	/**
	 * Ugly Hack, find API way to check if file is added by user.
	 */
	private function isUserNode(\OCP\Files\Node $node) {
		return strpos($node->getStorage()->getId(), "home::", 0) === 0;
	}

}