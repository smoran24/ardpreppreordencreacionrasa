/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"AR_DP_REP_CONVERSIONPREAPEDIDO_RA/AR_DP_REP_CONVERSIONPREAPEDIDO_RA/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});