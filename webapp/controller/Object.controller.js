sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	'sap/m/Token',
	'sap/ui/core/Fragment',
	"sap/m/Text",
	"sap/ui/model/type/Currency",
	"sap/ui/core/Item",
	"sap/ui/table/Column",
	"sap/m/Label",
	"sap/m/MessageToast"
], function(
	Controller, JSONModel, MessageBox, Token, Fragment, Text, Currency, Item, Column, Label, MessageToast
) {
	"use strict";

	return Controller.extend("createsalesorder.controller.Object", {
        onInit: function () {
			
			this.getOwnerComponent().getRouter().getRoute("Object").attachMatched(this.onRouter, this);
			
			var oModel = new JSONModel({
				create : {
					mandt : '100',  
					linno : '',
					gdcd : '',
					socnt : ''							
				},
				// filter : {
				// 	carrid : '',
				// 	connid : '',
				// 	fldate : ''
				// },
				it_data  : [],
				it_data2 : [],
				editMode : true
			});
			this.getView().setModel(oModel, "viewModel")

			let oAppModel = new JSONModel({
				fragments: []
			})
			this.getView().setModel(oAppModel, 'appState')
		},

		onRouter : function(oEvent){
			this.getOwnerComponent().getModel("viewModel").setProperty("/order","order");
            
			// alert(oEvent.getParameter("arguments").orderNumber);
			// debugger;

		},
		// 생성
		onCreate : function(oEvent){
			var that = this;
			var oModel = this.getView().getModel("viewModel");
			var aIt_data = oModel.getProperty("/it_data");
			
			var oData = {};
			oData.it_data = JSON.stringify(aIt_data);

			var oModelS = this.getOwnerComponent().getModel("main");
			//var sKey = oModelS.createKey('/ZAA_BUYSet', oData);
			console.log(oData);
			
			oModelS.create('/ZAA_SOSet', oData, {
				success : function(result){
				aIt_data.setData(null);
				MessageBox.show('Success!');
				
				},
				error : function(result){
				MessageBox.show('Fail');
				}   
				   
			})
			// if(oData.it_data[0] = "[]"){
			// 	MessageBox.show('Enter the values');
			// }else {
				     
			// }

			// this.getView().getModel('viewModel').getProperty("it_data").setData("")
			
			
			
			this.getOwnerComponent().getRouter().navTo("MainList")
			

		},

		
		// 편집 가능 유무
		onEdit : function(oEvent){
			var oModel = this.getView().getModel("viewModel");
			var oEdit = oModel.getProperty('/editMode');
			
			// if(oEdit == false){
			// 	oModel.setProperty('/editMode', true);
			// }else{
			// 	oModel.setProperty('/editMode', false);
			// }
		},





		// 화면에 보이는 테이블 DB 업데이트 및 저장(MODIFY)
	// 	onSave : function(oEvent){
	// 		var that = this;
	// 		var oModel = this.getView().getModel("viewModel");
	// 		var aIt_data = oModel.getProperty("/it_data");

	// 		var oData = {};
	// 		oData.mandt = String(100); 
	// 		oData.linno = String('AA');
	// 		oData.gdcd = String('S100');
	// 		oData.socnt = String('2020-01-01');
	// 		oData.it_data = JSON.stringify(aIt_data);


	// 		var oModelS = this.getOwnerComponent().getModel();

	// 		var sKey = oModelS.createKey('/ZAA_SOSet', oData);
	// 		oModelS.update(sKey, oData, {
	// 			success : function(result){
	// 				MessageBox.show('저장 성공');
	// 				that.onSearch();
	// 			},
	// 			error : function(result){
	// 				MessageBox.show('저장 실패');
	// 			}					
	// 		})

	// 	},

		// 테이블 라인 추가
		onAdd : function(oEvent){
			
			var oModel = this.getView().getModel("viewModel");
			var oData = oModel.getProperty('/it_data');

			var oAdd = {
				mandt : '100',
				linno : '',
				gdcd : '',
				socnt : ''		
			}				
			

			oData.unshift(oAdd);
			oModel.refresh();
			

		},
		
		// 테이블 라인 삭제 (DB 삭제 X)
		onDelete : function(oEvent){
			var oModel = this.getView().getModel("viewModel");
			var oData = oModel.getProperty('/it_data');

			var oTable = this.getView().byId('createtable');
			var select = oTable.getSelectedIndices();

			for(var i=0; i<select.length; i++){
				var index = select[select.length-i-1];
				if(index > -1){
					oData.splice(index, 1);
				}
			}

			oTable.clearSelection();
			oModel.refresh();
		},
		onValueHelpRequested: function (oEvent) {
			let pVH = this._getFragment('valuHelpDialogSingleSelect');
			var oToken = new Token();
			this.oInput = oEvent.getSource();
			
			oToken.setKey(this.oInput.getBindingContext('viewModel'));
			oToken.setText(this.oInput.getValue());
			// debugger;
			pVH.then(function (oFragment) {
				oFragment.getTableAsync().then(function (oTable) {
					oTable.setModel(this.getView().getModel('main'));
					// debugger;
					oTable.setModel(new JSONModel({
						cols: [
							{
								label: "Product",
								template: "Gdcd"
							},
							{
								label: "Description",
								template: "Gdnm"
							}
						]
					}), "columns");

					// debugger;
					oTable.bindAggregation("rows", "/ZshaProductSet");
					oFragment.update();

				}.bind(this));

				oFragment.setTokens([oToken]);
				oFragment.open();
			}.bind(this));
		},
		onValueHelpOkPress: function (oEvent) {
			// debugger;
			var arrTokens = oEvent.getParameter("tokens");
			this.oInput.setSelectedKey(arrTokens[0].getKey());

			let sPathGdcd = '/' + this.getView().getModel("main").createKey("ZshaProductSet", {
				Gdcd: arrTokens[0].getKey()
			});

			let oContextMain = this.getView().getModel('main').getProperty(sPathGdcd);
			let sPath = this.oInput.getBindingContext('viewModel').getPath();
			let oContextJsonData = this.getView().getModel('viewModel').getProperty(sPath);
			oContextJsonData.gdcd = oContextMain.Gdcd;
			oContextJsonData.gdnm = oContextMain.Gdnm;
			// debugger;
			// let 
			this.getView().getModel('viewModel').refresh();
			debugger;
			oEvent.getSource().close();
		},
		onValueHelpCancelPress: function (oEvent) {
			oEvent.getSource().close();
		},
		
		_getFragment: function (sFragmentName) {
			let arrFragments = this.getView().getModel('appState').getProperty('/fragments');
			let pFormFragment = arrFragments[sFragmentName];
			if (!pFormFragment) {
				pFormFragment = Fragment.load({
					id: sFragmentName,
					controller: this,
					name: "createsalesorder.view." + sFragmentName
				});
				arrFragments[sFragmentName] = pFormFragment;
			}
			// debugger;
			return pFormFragment;
		},
		onBack: function() {
			this.getOwnerComponent().getRouter().navTo("MainList");
		}

	// 	// 선택한 Line DB 삭제
	// 	onSelectedDelete : function(){

	// 		var that = this;

	// 		var oModel = this.getView().getModel("viewModel");
	// 		var oIt_data = oModel.getProperty('/it_data');
	// 		var oTable = this.getView().byId('createtable');

	// 		var select = oTable.getSelectedIndices();

	// 		var oData = {};
	// 		var oSelected = [];

	// 		for(var i=0; i<select.length; i++){
	// 			oSelected.push(oIt_data[select[i]]);
	// 		}

	// 		oData.mandt = String(100); 
	// 		oData.linno = String('AB');
	// 		oData.gdcd = String('11');
	// 		oData.socnt = String('2020-01-01');
	// 		oData.it_data = JSON.stringify(oSelected);

	// 		var oModelS = this.getOwnerComponent().getModel();
	// 		var sKey = oModelS.createKey('/ZAA_SOSet', oData);

	// 		oModelS.remove(sKey, {
	// 			success: function(event) {
	// 				MessageBox.show('삭제 성공.');
	// 				that.onSearch();
	// 			},
	// 			error: function(event) {
	// 				MessageBox.show('삭제 실패.');
	// 			}
	// 		});

	// 		   oTable.clearSelection();

	// 	}
	});
});