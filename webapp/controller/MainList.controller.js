sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	'sap/m/MessageToast'
], function(
	Controller, 
	MessageBox,
	MessageToast
) {
	"use strict";

	return Controller.extend("createsalesorder.controller.MainList", {
        onInit: function () {
			this.getOwnerComponent().getRouter().getRoute("MainList").attachMatched(this.onRouter, this);
		},

		onRouter : function(){
			this.getOwnerComponent().getModel("viewModel").setProperty("/park","조회클릭");

		},
		onSearch: function (evt) {
			MessageBox.show(this.getOwnerComponent().getModel("viewModel").getProperty("/order") + this.getOwnerComponent().getModel("viewModel").getProperty("/customer"));

			this.getModel().read({
				
			})
		},
		onCreate: function() {
			this.getOwnerComponent().getRouter().navTo("Object",{
				orderNumber : "New"
			});
		},
		onValueHelpRequested: function() {
			var aCols = this.oColModel.getData().cols;

			Fragment.load({
				name: "createsalesorder.controller.MainList",
				controller: this
			}).then(function name(oFragment) {
				this._oValueHelpDialog = sap.ui.xmlfragment("createsalesorder.controller.MainList", this);
				this.getView().addDependent(this._oValueHelpDialog);

				this._oValueHelpDialog.getTableAsync().then(function (oTable) {
					oTable.setModel(this.oProductsModel);
					oTable.setModel(this.oColModel, "columns");

					if (oTable.bindRows) {
						oTable.bindAggregation("rows", "/ProductCollection");
					}

					if (oTable.bindItems) {
						oTable.bindAggregation("items", "/ProductCollection", function () {
							return new ColumnListItem({
								cells: aCols.map(function (column) {
									return new Label({ text: "{" + column.template + "}" });
								})
							});
						});
					}
					this._oValueHelpDialog.update();
				}.bind(this));

				this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
				this._oValueHelpDialog.open();
			}.bind(this));
		},
	});
});