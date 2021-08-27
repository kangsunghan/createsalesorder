sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	'sap/m/MessageToast',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
], function(
	Controller, 
	MessageBox,
	MessageToast,
	Filter,
	FilterOperator,
	JSONModel
) {
	"use strict";

	return Controller.extend("createsalesorder.controller.MainList", {
        onInit: function () {
			var oModel = new JSONModel({
				create : {
					mandt : '100',  
					sono : '',
					sodat : '',
					cuscd : ''							
				}
				,filter : {
					sono : '',
					sodat : '',
					cuscd : ''
				},selected : {
					sono : ''
				},
				it_data  : [],
				it_data2 : [],
				editMode : false
			});

			this.getView().setModel(oModel, "viewModel");
			this.getOwnerComponent().getRouter().getRoute("Object").attachMatched(this.onSearch, this);
		},
		onSearch: function (evt) {
			// MessageBox.show(this.getOwnerComponent().getModel("viewModel").getProperty("/order") + this.getOwnerComponent().getModel("viewModel").getProperty("/customer"));

			// this.getModel().read({
				
			// })
			

			//////////////////////
			var oModel = this.getView().getModel("viewModel");
			var oEdit = oModel.setProperty('/editMode', false);
					
			var oFilter = oModel.getProperty('/filter');
			// debugger;
			var mFilter = [];
			for(var sKey in oFilter){
				var oVal = oFilter[sKey];
				if(oVal) {
					mFilter.push(new Filter({
						path: sKey,
						operator: FilterOperator.Contains,
						value1: oVal,
					}));
				}
			}

			var oModelS = this.getOwnerComponent().getModel("main");
			oModelS.read('/ZAA_SOSet', { 
				filters : mFilter,
				success : function(oEvent){
					var aData = []; 
					if(oEvent.results.length > 0){
						aData = JSON.parse(oEvent.results[0].it_data);
						oModel.setProperty('/it_data', aData);
						// debugger;
					}	
				},
				error : function(oEvent){
					MessageBox.show('Search Error!');
				}
			})
				
		},
		onCreate: function() {
			this.getOwnerComponent().getRouter().navTo("Object",{
				orderNumber : "New"
			});
		},

		onDetail: function(oEvent) {
			// var oOrder = this.getOwnerComponent().getModel("viewModel").getProperty("it_data");
			// var rowObject = this.getView().byId("orderTable");
			// var rowobject = oEvent.getParameter("orderTable").getBindingContext().getObject();

			// var oTable = this.getView().byId("orderTable");
			// var selectedIRow = oTable.getSelectedIndices();

			var oModel = this.getView().getModel("viewModel");
			var oData = oModel.getProperty("/selected")

			var oSelectedItem = oEvent.getSource().getParent();
      		var oBindingContext = oSelectedItem.getBindingContext();
			//   "{viewModel>/it_data/sono}"
			
			oData.sono = oEvent.getSource().getCells()[0].getText()
			// debugger;
			this.getOwnerComponent().getRouter().navTo("DisplayOrder",{
				orderNumber : oData.sono



			});
		}
		
	});
});