sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
],
	/** btest testtest
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, JSONModel, Filter, FilterOperator, MessageBox) {
		"use strict";

		return Controller.extend("createsalesorder.controller.DisplayOrder", {
			onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("DisplayOrder").attachMatched(this.onRouter, this);
                // var oModel = new JSONModel({
                //     header : {
                //         mandt : '100',  
                //         sono : '',
                //         gdcd : '',
                //         socnt : ''							
                //     },
                //     filter : {
                //     	sono : ''
                //     },
                //     it_data  : [],
                //     it_data2 : [],
                //     editMode : false
                // });
                // this.getView().setModel(oModel, "detail");
                // var oSettingsModel = this.getView().getModel('settingModel');
                // var test = oOrderId
                // debugger;
                var oModel = new JSONModel({
                    
                    filter : {
                    	sono : ''
                    },
                    it_data  : [],
                    it_data2 : [],
                    editMode : false
                });
                this.getView().setModel(oModel, "detail");
			},

            onRouter : function(oEvent){
                
                var oArguments = oEvent.getParameter("arguments");
                var oOrderNo = oArguments.orderNumber;
                this.getOwnerComponent().getModel("viewModel").setProperty("/filter", oOrderNo);
                // alert(oEvent.getParameter("arguments").orderNumber);
                
                // debugger;
                // 제이슨 모델 생성
                // var oModel = new JSONModel({
                //     header : {
                //         mandt : '100',  
                //         sono : '',
                //         gdcd : '',
                //         socnt : ''							
                //     },
                //     filter : {
                //     	sono : ''
                //     },
                //     it_data  : [],
                //     it_data2 : [],
                //     editMode : false
                // });
                
                // 오더 넘버 데이터 조회
                var oModel = this.getView().getModel("viewModel");
                var oEdit = oModel.setProperty('/editMode', false);
                        
                var oFilter = oModel.getProperty('/filter');
                // debugger;
                var mFilter = [];
                

                var sKey = oFilter
                var oVal = oFilter[sKey];
                mFilter.push(new Filter({
                    path: "sono",   
                    operator: FilterOperator.Contains,
                    value1: oFilter, 
                }));
                    


                
                var oModelS = this.getOwnerComponent().getModel("main");
                var oModel2 = this.getView().getModel("detail");
                debugger;
                oModelS.read('/ZAA_SOSet', { 
                    filters : mFilter,
                    success : function(oEvent){
                        var header = []; 
                        var items = []; 
                        if(oEvent.results.length > 0){
                            header = JSON.parse(oEvent.results[0].it_data);
                            items = JSON.parse(oEvent.results[0].it_data2);
                            oModel2.setProperty('/it_data', header[0]);
                            oModel2.setProperty('/it_data2', items);
                            oModel2.getProperty('/it_data')[0].gdpx = oModel2.getProperty('/it_data')[0].gdpx * 100; 
                            // oModel2.refresh();
                        }	
                    },
                    error : function(oEvent){
                        MessageBox.show('Search Error!');
                    }
                })
        
            },

            onBack: function() {
                this.getOwnerComponent().getRouter().navTo("MainList");
            }
		});
	});
