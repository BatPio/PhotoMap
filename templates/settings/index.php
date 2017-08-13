<div id="app-settings">
	<div id="app-settings-header">
		<button class="settings-button"
				data-apps-slide-toggle="#app-settings-content"
		></button>
	</div>
	<div id="app-settings-content">
		<label><input id="filter-albums-to-map" type="checkbox"><?php p($l->t('Only map visible albums'));?></label>
		<label><input id="show-album-tracks" type="checkbox"><?php p($l->t('Show album track'));?></label>
		<!-- Your settings in here -->
	</div>
</div>
