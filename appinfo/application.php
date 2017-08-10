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

namespace OCA\PhotoMap\AppInfo;

use OCP\AppFramework\App;

use OCA\PhotoMap\Hook\FileHooks;
use OCA\PhotoMap\Service\PhotofilesService;

class Application extends App {

	public function __construct () {
		parent::__construct('photomap');
		$this->getContainer()->registerService('FileHooks', function($c) {
			return new FileHooks(
				$c->query('ServerContainer')->getRootFolder(),
				\OC::$server->query(PhotofilesService::class),
				$c->query('ServerContainer')->getLogger(),
				$c->query('AppName')
			);
		});
	}

	public function register() {
		$this->getContainer()->query('FileHooks')->register();
	}
}
