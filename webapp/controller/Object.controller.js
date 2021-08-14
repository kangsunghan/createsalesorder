sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("createsalesorder.controller.Object", {
        onInit: function () {
			
			this.getOwnerComponent().getRouter().getRoute("Object").attachMatched(this.onRouter, this);
		},

		onRouter : function(oEvent){
			// abap -> json
			// abap - json

			// this.getOwnerComponent().getModel("viewModel").setProperty("/park","qq");
            alert(oEvent.getParameter("arguments").orderNumber);


			

		}
	});
});