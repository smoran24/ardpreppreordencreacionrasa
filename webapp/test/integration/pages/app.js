sap.ui.define(["sap/ui/test/Opa5"],function(e){"use strict";var i="app";e.createPageObjects({onTheAppPage:{actions:{},assertions:{iShouldSeeTheApp:function(){return this.waitFor({id:"app",viewName:i,success:function(){e.assert.ok(true,"The app view is displayed")},errorMessage:"Did not find the app view"})}}}})});