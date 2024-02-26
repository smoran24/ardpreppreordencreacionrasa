sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"AR_DP_REP_CONVERSIONPREAPEDIDO_RA/AR_DP_REP_CONVERSIONPREAPEDIDO_RA/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("AR_DP_REP_CONVERSIONPREAPEDIDO_RA.AR_DP_REP_CONVERSIONPREAPEDIDO_RA.Component", {

		metadata: {
			manifest: "json"
		},

	
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			let ODataV2Model = models.createHanaModel();
			this.setModel(ODataV2Model, "ODataHana");
			
		},	getContentDensityClass: function () {
			if (!this._sContentDensityClass) {
				if (!sap.ui.Device.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}
	});
});