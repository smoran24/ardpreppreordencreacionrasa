sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/Dialog",
	"sap/m/Label",
	"sap/m/Button",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	'sap/m/MessagePopover',
	'sap/m/MessageItem',
	'sap/m/Link',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/Filter',
	"sap/ui/model/SimpleType",
	"sap/ui/model/ValidateException"
], function (Controller, Dialog, Label, Button, MessageBox, MessageToast, MessagePopover, MessageItem, Link, JSONModel, Filter,
	SimpleType, ValidateException) {

	var oView, generar = [],
		generar2, t, oSelectedItem, cliente, pedido, destino, data = [], isNissanUser,
		datosC = [],
		oUsuariosap, codigoeliminar, org = 0,nombreUsuario,
		PreOrden2;
	flagperfil = false;
	var msext = [];
	var superarr = [];

	var oMessagePopover;

	return Controller.extend("AR_DP_REP_CONVERSIONPREAPEDIDO_RA.AR_DP_REP_CONVERSIONPREAPEDIDO_RA.controller.detalle", {

		onInit: function () {
			var oRouter =
				sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("detalle").attachMatched(this._onRouteMatched, this);
			this._oDataHanaModel = this.getOwnerComponent().getModel("ODataHana");
		},

		onAfterRendering: function (oEvent) {
			t = this;
			oView = this.getView();
			//console.log(superarr.length);
			//console.log(superarr);
			if (superarr.length === undefined) {
				//console.log("entro")
				generar = [];
				generar.push({
					CantAsig: superarr.CantAsig,
					CantPed: superarr.CantPed,
					Cliente: superarr.Cliente,
					Descuento: superarr.Descuento,
					Material: superarr.Material,
					Mensaje: superarr.Mensaje,
					Precio: superarr.Precio,
					PrecioFinal: superarr.PrecioFinal,
					PrecioVenta: superarr.PrecioVenta,
					Recargo: superarr.Recargo,
					TipoMensaje: superarr.TipoMensaje

				});

			} else {
				generar = superarr;
			}
			//console.log(generar);
			t.materiales();

		},
		jsoncreacion: function (data, destino, dato3, usuarioSap, nombreCompletoUsuario, isNissanUserAux) {
			// t = this;
			// oView = this.getView();
			datosC = dato3;
			cliente = destino;
			oUsuariosap = usuarioSap;
			nombreUsuario = nombreCompletoUsuario;
			isNissanUser = isNissanUserAux;

			var datos = data.HeaderSet.Header.Nav_Header_Stock_2.Stock;

			// if (datos.length === undefined) {
			// 	data.push({0:datos});
			// } else {
			// 	data = datos;
			// }
			superarr = datos
				//console.warn(superarr)
			if (oView !== undefined) {
				this.cargar();
			}
		},
		cargar: function () {
			//console.log(superarr.length);
			//console.log(superarr);
			if (superarr.length === undefined) {
				//console.log("entro")
				generar = [];
				generar.push({
					CantAsig: superarr.CantAsig,
					CantPed: superarr.CantPed,
					Cliente: superarr.Cliente,
					Descuento: superarr.Descuento,
					Material: superarr.Material,
					Mensaje: superarr.Mensaje,
					Precio: superarr.Precio,
					PrecioFinal: superarr.PrecioFinal,
					PrecioVenta: superarr.PrecioVenta,
					Recargo: superarr.Recargo,
					TipoMensaje: superarr.TipoMensaje

				});

			} else {
				generar = superarr;
			}
			//console.log(generar);
			t.materiales();

		},
		materiales: function () {

			for (var i = 0; i < generar.length; i++) {
				t.ConsultaMaterial2(generar[i].Material);
			}
			//console.log(oView.getModel("validos").oData);
			t.proceso();
		},
		proceso: function () {

			var color, ncolor, arr3 = [];
			for (var i = 0; i < generar.length; i++) {
				t.ConsultaMaterial2(generar[i].Material);
			}

			for (var i = 0; i < generar.length; i++) {
				for (var j = 0; j < oView.getModel("validos").oData.length; j++) {
					if ((generar[i].Material === oView.getModel("validos").oData[j].Material)) {
						var nombre = oView.getModel("validos").oData[j].DESCRIPCION;
					}
				}
				if (parseInt(generar[i].CantAsig, 10) < parseInt(generar[i].CantPed, 10)) {
					color = 'sap-icon://status-critical';
					ncolor = '#ffbc05';
				}
				if (parseInt(generar[i].CantAsig, 10) === 0) {
					color = 'sap-icon://status-negative';

					ncolor = '#e30000';
				}
				if (parseInt(generar[i].CantAsig, 10) === parseInt(generar[i].CantPed, 10)) {
					color = 'sap-icon://status-positive';
					ncolor = '#00c753';

				}

				var preorden, dealer;

				for (var h = 0; h < datosC.length; h++) {

					if (generar[i].Material === datosC[h].Material) {

						preorden = datosC[h].PreOrden;
						dealer = datosC[h].Destino;
					}

				}

				var json5 = {
					"CantPed": generar[i].CantPed,
					"Description": nombre,
					"Recargo": Number(generar[i].Recargo),
					"TipoMensaje": generar[i].TipoMensaje,
					"PrecioVenta": Number(generar[i].PrecioVenta),
					"Mensaje": generar[i].Mensaje,
					"PrecioFinal": Number(generar[i].PrecioFinal),
					"CantAsig": parseInt(generar[i].CantAsig, 10), //generar[posT].CantAsig,
					"Descuento": Number(generar[i].Descuento),
					"codigopat": generar[i].Material,
					"Cliente": generar[i].Cliente,
					"Precio": Number(generar[i].Precio),
					"unidad": "PC",
					"backOrder": true,
					"color": color,
					"ncolor": ncolor,
					"preOrden": preorden,
					"dealer": dealer

				};
				arr3.push(json5);
			}
		
			var dataT = new sap.ui.model.json.JSONModel(arr3);
			this.getView().setModel(dataT, "listadoMateriales");

		},
		atras: function () {
			//console.log(this);
			//	flagperfil = false;
			var a = "00";
			sap.ui.controller("AR_DP_REP_CONVERSIONPREAPEDIDO_RA.AR_DP_REP_CONVERSIONPREAPEDIDO_RA.controller.master").jsoncreacion2(a);
			var arr3 = [];
			var dataT = new sap.ui.model.json.JSONModel(arr3);
			this.getView().setModel(dataT, "listadoMateriales");
			this.getOwnerComponent().getRouter().navTo("master");
		},
			atras2: function () {
			var arr3 = [];
			var dataT = new sap.ui.model.json.JSONModel(arr3);
			this.getView().setModel(dataT, "listadoMateriales");
			this.getOwnerComponent().getRouter().navTo("master");
		},
		ConsultaMaterial2: function (num) {
			var key = num;
            var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
           var appModulePath = jQuery.sap.getModulePath(appid);
			var material = appModulePath + '/destinations/AR_DP_REP_DEST_HANA/ODATA_masterPedido.xsodata/material?$filter=startswith(MATERIAL,%27' + key +
				'%27)';

			//Consulta
			$.ajax({
				type: 'GET',
				url: material,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: false,
				success: function (dataR, textStatus, jqXHR) {

					if (dataR.d.results.length !== 0) {
						var json = {
							"Material": dataR.d.results[0].MATERIAL,
							"DESCRIPCION": dataR.d.results[0].DESCRIPCION,
							"CANTMIN": dataR.d.results[0].CANTMIN,
							"MVENTA": dataR.d.results[0].MVENTA
						};

						msext.push(json);
					}

					var material = new sap.ui.model.json.JSONModel(msext);
					oView.setModel(material, "validos");

				},
				error: function (jqXHR, textStatus, errorThrown) {
					////console.log(JSON.stringify(jqXHR));
				}
			});
		},
		handleDelete: function (oEvent) {
			var arryT = [];
			oSelectedItem = oEvent.getSource().getParent();
			var deleteT = oSelectedItem.sId.toString().substring(oSelectedItem.sId.length - 1, oSelectedItem.sId.length);

			for (var i = 0; i < oView.getModel("listadoMateriales").oData.length; i++) {
				if (i.toString() !== deleteT) {
					arryT.push({
						CantPed: oView.getModel("listadoMateriales").oData[i].CantPed,
						CantOrg: oView.getModel("listadoMateriales").oData[i].CantOrg,
						Recargo: oView.getModel("listadoMateriales").oData[i].Recargo,
						TipoMensaje: oView.getModel("listadoMateriales").oData[i].TipoMensaje,
						PrecioVenta: oView.getModel("listadoMateriales").oData[i].PrecioVenta,
						Mensaje: oView.getModel("listadoMateriales").oData[i].Mensaje,
						PrecioFinal: oView.getModel("listadoMateriales").oData[i].PrecioFinal,
						CantAsig: oView.getModel("listadoMateriales").oData[i].CantAsig,
						Descuento: oView.getModel("listadoMateriales").oData[i].Descuento,
						codigopat: oView.getModel("listadoMateriales").oData[i].codigopat,
						Cliente: oView.getModel("listadoMateriales").oData[i].Cliente,
						Precio: oView.getModel("listadoMateriales").oData[i].Precio,
						Description: oView.getModel("listadoMateriales").oData[i].Description,
						CantMini: oView.getModel("listadoMateriales").oData[i].CantMini,
						MVenta: oView.getModel("listadoMateriales").oData[i].MVenta,
						unidad: oView.getModel("listadoMateriales").oData[i].unidad,
						backOrder: oView.getModel("listadoMateriales").oData[i].backOrder,
						color: oView.getModel("listadoMateriales").oData[i].color,
						ncolor: oView.getModel("listadoMateriales").oData[i].ncolor,
						preOrden: oView.getModel("listadoMateriales").oData[i].preOrden,
						dealer: oView.getModel("listadoMateriales").oData[i].dealer
					});
				}
			}
			console.log(arryT);
			var dataT = new sap.ui.model.json.JSONModel(arryT);
			oView.setModel(dataT, "listadoMateriales");
			oSelectedItem = undefined;
		},
		CreaPedido: function () {
			t.popCarga();
			var men = "";
			var arr = [];
			var status;
			var cantpedida;
			//	t.popCarga();
			var result = [];
			var json2 = oView.getModel("listadoMateriales").oData;

			console.log(json2);

			for (var i = 0; i < json2.length; i++) {
				if (json2[i].backOrder === false) {
					cantpedida = json2[i].CantAsig;
				} else {
					cantpedida = json2[i].CantPed;
				}
				console.log(json2[i].preOrden);
				var arrn = {

					"Material": json2[i].codigopat,
					"Cantidad": cantpedida,
					"Mensaje": "",
					"Oferta": ""
				};
				result.push(arrn);
			}
			console.log(result);
			var json = {
				"HeaderSet": {
					"Header": {
						"Oferta": json2[0].preOrden,
						"Dealer": cliente,
						"Destinatario": json2[0].dealer,
						"Nav_Header_Posiciones": {
							"Posiciones": result
						}
					}
				}
			};
			var arrjson = JSON.stringify(json);
			//	//console.log(arrjson);
            var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
            var appModulePath = jQuery.sap.getModulePath(appid);
			var url = appModulePath + '/destinations/AR_DP_DEST_CPI/http/AR/DealerPortal/Repuestos/PreOrden/Creacion';
			$.ajax({
				type: 'POST',
				url: url,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: true,
				data: arrjson,
				success: function (dataR, textStatus, jqXHR) {
					t.cerrarPopCarga2();
					//console.log(dataR)

					if (dataR.HeaderSet !== "" || dataR.HeaderSet !== undefined || dataR.HeaderSet !== null) {
						//	//console.log(dataR.HeaderSet);
						if (dataR.HeaderSet.Header.Nav_Header_Posiciones.Posiciones.Mensaje !== undefined) {
							var mensaje = dataR.HeaderSet.Header.Nav_Header_Posiciones.Posiciones.Mensaje;
						} else {
							var mensaje = dataR.HeaderSet.Header.Nav_Header_Posiciones.Posiciones[0].Mensaje;
						}

						try {
							console.log(dataR.HeaderSet.Header.Nav_Header_Posiciones.Posiciones[0].Mensaje);
							if (dataR.HeaderSet.Header.Nav_Header_Posiciones.Posiciones[0].Mensaje !== "E") {
								var obj = {
									codigo: "200",
									descripcion: mensaje
								};
								arr.push(obj);

								t.popSucces(arr, "Pedido Creado Exitosamente");

								let idPedidoCreado = mensaje.split(":")[1].trim();
								t.generarEntradaAuditoria(idPedidoCreado);

							} else {
								//console.log(mensaje);
								var obj = {
									codigo: "400",
									descripcion: "Pedido no Generado por favor informar a repuestos.soporte@nissan.cl, No Intente cargarlo nuevamente hasta comunicarse "
								};
								arr.push(obj);
								t.popSucces(arr, "Error de Comunicacion");
								//	t.popError(arr, "Error de Comunicacion");
							}
						} catch (e) {
							if (dataR.HeaderSet.Header.Nav_Header_Posiciones.Posiciones.Mensaje !== "E") {
								var obj = {
									codigo: "200",
									descripcion: mensaje
								};
								arr.push(obj);

								t.popSucces(arr, "Pedido Creado Exitosamente");

								let idPedidoCreado = mensaje.split(":")[1].trim();
								t.generarEntradaAuditoria(idPedidoCreado);

							} else {
								//console.log(mensaje);
								var obj = {
									codigo: "400",
									descripcion: "Pedido no Generado por favor informar a repuestos.soporte@nissan.cl, No Intente cargarlo nuevamente hasta comunicarse "
								};
								arr.push(obj);
								t.popSucces(arr, "Error de Comunicacion");
								//	t.popError(arr, "Error de Comunicacion");
							}
						}
					} else {
						var obj = {
							codigo: "400",
							descripcion: "Existen Problemas en la comunicación con los servicios favor contactar a soporte"
						};
						arr.push(obj);

						t.popError(arr, "Error de Comunicacion");
					}

				},
				error: function (jqXHR, textStatus, errorThrown) {
					t.cerrarPopCarga2();
					var obj = {
						codigo: "500",
						descripcion: "Existen Problemas en la comunicación con los servicios favor contactar a soporte"
					};
					arr.push(obj);

					t.popError(arr, "Error de Comunicacion");
				}
			});

		},

		generarEntradaAuditoria: function(nroPedido){
			let dfdGenerarEntrada = $.Deferred();
			let identificador = {
				"Número pedido": nroPedido
			}
			
			let data = {
				ID_OBJETO: JSON.stringify(identificador),
				ID_ACCION: 12,
				TIPO_USUARIO: isNissanUser ? "N" : "D",
				USUARIO: oUsuariosap,
				NOMBRE_USUARIO: nombreUsuario,
				FECHA: new Date()
			}
			
			// let oModel = new sap.ui.model.odata.ODataModel('/destinations/AR_DP_REP_DEST_HANA/ODATA_masterPedido.xsodata', false);
			// oModel.create("/EntradaAuditoria", data, {
			this._oDataHanaModel.create("/EntradaAuditoria", data, {
				success: function (odata, oResponse) {
					dfdGenerarEntrada.resolve();
				}
			});
			
			return dfdGenerarEntrada;
		},

		EntradaAuditoria: function(nroPedido){
			let dfdGenerarEntrada = $.Deferred();
			let identificador = {
				"Número pedido": nroPedido
			}
			
			let data = {
				ID_OBJETO: JSON.stringify(identificador),
				ID_ACCION: 12,
				TIPO_USUARIO: isNissanUser ? "N" : "D",
				USUARIO: oUsuariosap,
				NOMBRE_USUARIO: nombreUsuario,
				FECHA: new Date()
			}
			var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
			var appModulePath = jQuery.sap.getModulePath(appid);
			let oModel = new sap.ui.model.odata.ODataModel(appModulePath +'/destinations/AR_DP_REP_DEST_HANA/ODATA_masterPedido.xsodata', false);
			oModel.create("/EntradaAuditoria", data, {
				success: function (odata, oResponse) {
					dfdGenerarEntrada.resolve();
				}
			});
			
			return dfdGenerarEntrada;
		},
		/*****************POP-UPS********************/
		popCarga: function () {

			var oDialog = oView.byId("indicadorCarga");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "AR_DP_REP_CONVERSIONPREAPEDIDO_RA.AR_DP_REP_CONVERSIONPREAPEDIDO_RA.view.PopUp", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();
			//	oView.byId("textCarga").setText(titulo);
		},
		cerrarPopCarga2: function () {
			oView.byId("indicadorCarga").close();
		},
		popSucces: function (obj, titulo) {
			var oDialog = oView.byId("dialogSucces");
			var log = new sap.ui.model.json.JSONModel(obj);
			oView.setModel(log, "Succes");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "AR_DP_REP_CONVERSIONPREAPEDIDO_RA.AR_DP_REP_CONVERSIONPREAPEDIDO_RA.view.Succes", this); //aqui se debe cambiar ar_dp_rep
				oView.addDependent(oDialog);
			}
			oView.byId("dialogSucces").addStyleClass(this.getOwnerComponent().getContentDensityClass());
			oDialog.open();
			oView.byId("dialogSucces").setTitle(titulo);
			//	oView.byId("dialogSucces").setState("Succes");
		},
		cerrarPopSucces: function () {
				oView.byId("dialogSucces").close();
				t.atras();
			}
			/*****************************/

	});

});