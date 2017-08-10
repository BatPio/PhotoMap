var replace = require('replace');
var prompt = require('prompt');

prompt.start();

prompt.get(['appId', 'appName'], function (err, result) {
	if (err) {
		console.log(err);
		return;
	}

	replace({
		regex: "react_oc_boilerplate",
		replacement: result.appId,
		paths: ['appinfo/app.php', 'appinfo/info.xml', 'webpack/dev.config.js', 'controller/pagecontroller.php'],
		recursive: false,
		silent: true
	});

	replace({
		regex: "React Boilerplate",
		replacement: result.appName,
		paths: ['appinfo/app.php', 'appinfo/info.xml'],
		recursive: false,
		silent: true
	});
});


