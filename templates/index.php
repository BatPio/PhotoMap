<?php
script('photomap', 'leaflet');
script('photomap', 'leaflet.markercluster');
script('photomap', 'Leaflet.Photo');
script('photomap', 'main');

style('photomap', 'leaflet');
style('photomap', 'Leaflet.Photo');
style('photomap', 'MarkerCluster');
style('photomap', 'map');
style('photomap', 'style');
?>



<div id="app">
	<div id="app-navigation">
		<?php print_unescaped($this->inc('navigation/index')); ?>
		<?php print_unescaped($this->inc('settings/index')); ?>
	</div>

	<div id="app-content">
        <div id="map" style="width: 100%; height: 100%; padding: 0; margin: 0; background: #fff;"></div>
	</div>
</div>
