<div id="app-settings">
	<div id="app-settings-header">
		<button class="settings-button"
				data-apps-slide-toggle="#app-settings-content"
		></button>
	</div>
	<div id="app-settings-content">
		<p><input id="filter-albums-to-map" type="checkbox" class="checkbox"><label for="filter-albums-to-map"><?php p($l->t('Only map visible albums'));?></label></p>
		<p><input id="show-album-tracks" type="checkbox" class="checkbox"><label for="show-album-tracks"><?php p($l->t('Show album track'));?></label>
		<!-- Your settings in here -->
	</div>
</div>
