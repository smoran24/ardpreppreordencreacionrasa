sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/List",
	"sap/m/StandardListItem",
	"sap/m/Text",
	"sap/m/library",
	"sap/ui/core/IconPool",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/SimpleType",
	"sap/ui/model/ValidateException",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/m/MessageBox"
], function (Controller, Button, Dialog, List, StandardListItem, Text, mobileLibrary, IconPool, JSONModel, SimpleType, ValidateException,
	Export, ExportTypeCSV, MessageBox) {

	var oView, oSAPuser, t, company = "", nombreUsuario, isNissanUser,
		selected = "",
		PreOrden2,
		Respuesta = [],
		datosC = [];
	return Controller.extend("AR_DP_REP_CONVERSIONPREAPEDIDO_RA.AR_DP_REP_CONVERSIONPREAPEDIDO_RA.controller.master", {

		onInit: function () {
			t = this;
			oView = this.getView();
			var oRouter =
				sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("master").attachMatched(this._onRouteMatched, this);
			//Sentencia para minimizar contenido
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
            var appModulePath = jQuery.sap.getModulePath(appid);
			$.ajax({
				type: 'GET',
				dataType: 'json',
				url: appModulePath + "/services/userapi/currentUser",
				success: function (dataR, textStatus, jqXHR) {
					oSAPuser = dataR.name;
					// oSAPuser = "P001442";
					t.leerUsuario(oSAPuser);
				},
				error: function (jqXHR, textStatus, errorThrown) {}
			});
			//t.leerUsuario(oSAPuser);
			t.ConsultaSolicitante();

			// t.Consulta();
			//	t.ConsultaTpedido();
		},
		leerUsuario: function (oSAPuser) {
			var flagperfil = true;
            var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
            var appModulePath = jQuery.sap.getModulePath(appid);
			var url =appModulePath + '/destinations/IDP_Nissan/service/scim/Users/' + oSAPuser;
			//Consulta
			$.ajax({
				type: 'GET',
				url: url,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: false,
				success: function (dataR, textStatus, jqXHR) {
					var custom = dataR["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"].attributes;

					//	console.log(dataR.urn:sap:cloud:scim:schemas:extension:custom:2.0:User.attributes);
					for (var i = 0; i < dataR.groups.length; i++) {

						if (dataR.groups[i].value === "AR_DP_ADMINISTRADORDEALER" || dataR.groups[i].value === "AR_DP_USUARIODEALER") {
							// company = dataR.company;
							for (var x = 0; x < custom.length; x++) {
								if (custom[x].name === "customAttribute6") {
									company = custom[x].value;
								}
							}

							flagperfil = false;

						}
					}
					console.log(company)
					if (!flagperfil) {

						oView.byId("dealer").setSelectedKey("0000" + company);

						oView.byId("dealer").setEditable(false);

					} else {
						oView.byId("dealer").setEditable(true);
						oView.byId("dealer1").setVisible(true);

					}

					isNissanUser = flagperfil;
					nombreUsuario = dataR.name.givenName + " " + dataR.name.familyName;  
				},
				error: function (jqXHR, textStatus, errorThrown) {

				}
			});

		},
		ConsultaSolicitante: function () {
            var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
            var appModulePath = jQuery.sap.getModulePath(appid);
			var UrlSolicitante =appModulePath   + '/destinations/AR_DP_REP_DEST_HANA/ODATA_masterPedido.xsodata/solicitante';
			//Consulta
			$.ajax({
				type: 'GET',
				url: UrlSolicitante,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: true,
				success: function (dataR, textStatus, jqXHR) {
					var cliente = new sap.ui.model.json.JSONModel(dataR.d.results);
					oView.setModel(cliente, "cliente");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					//console.log(JSON.stringify(jqXHR));
				}
			});
		},

		ConsultaPedidos: function () {

			var total = [];

			if (oView.byId("Fecha").getValue() === "" && oView.byId("PreOrden").getValue() === "") {
				sap.m.MessageBox.show("Debe Seleccionar al menos una Fecha o Número de Pre Orden ", {
					icon: sap.m.MessageBox.Icon.ERROR,
					actions: sap.m.MessageBox.Action.CLOSE
				});
			} else {
				var descPedido, descFactura;
				this.popCarga();

				if (oView.byId("Fecha").getValue() === "") {
					var desde = "";
					var hasta = "";
				} else {
					var desde = oView.byId("Fecha").getDateValue();
					var hasta = oView.byId("Fecha").getSecondDateValue();
					desde = new Date(desde).toISOString().slice(0, 10).replace(/\-/g, "");
					hasta = new Date(hasta).toISOString().slice(0, 10).replace(/\-/g, "");
				}

				var arrjson = []; //***
				var json = {

					"HeaderSet": {
						"Header": {
							"Dealer": oView.byId("dealer").getSelectedKey(),
							"Fechadesde": desde,
							"Fechahasta": hasta,
							"Preorden": oView.byId("PreOrden").getValue(),
							"Vin": oView.byId("Vin").getValue(),
							"Referencia": oView.byId("Referencia").getValue(),
							"Nav_Header_Oferta": {
								"Oferta": [{
									"Preorden": "",
									"Iniciovigencia": "",
									"Fechafinvalidacion": "",
									"Fechacreacion": "",
									"Vin": "",
									"Referencia": "",
									"Material": "",
									"Cantidad": "",
									"Unidad": "",
									"Destinatario": ""
								}]
							}
						}
					}
				}
				arrjson = JSON.stringify(json);
				// console.log(arrjson);
                var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
               var appModulePath = jQuery.sap.getModulePath(appid);
				var url =appModulePath + '/destinations/AR_DP_DEST_CPI/http/AR/DealerPortal/Repuestos/PreOrden/Consultar';
				$.ajax({
					type: 'POST',
					url: url,
					contentType: 'application/json; charset=utf-8',
					dataType: 'json',
					async: true,
					data: arrjson,
					timeout: 180000,
					success: function (dataR, textStatus, jqXHR) {

						var arrT = [];
						var rutina = dataR.HeaderSet.Header.Nav_Header_Oferta.Oferta;
						//	console.log(rutina.length);
						if(rutina){
							if (rutina.length === undefined) {
								var fecha;
								var dia = rutina.Fechacreacion.substring(6, 8);
								var mes = rutina.Fechacreacion.substring(4, 6);
								var year = rutina.Fechacreacion.substring(0, 4);
								fecha = dia + "/" + mes + "/" + year;
								rutina.Fechacreacion = fecha;
	
								var dia1 = rutina.Iniciovigencia.substring(6, 8);
								var mes1 = rutina.Iniciovigencia.substring(4, 6);
								var year1 = rutina.Iniciovigencia.substring(0, 4);
								var fecha1 = dia1 + "/" + mes1 + "/" + year1;
								rutina.Iniciovigencia = fecha1;
	
								var dia2 = rutina.Fechafinvalidacion.substring(6, 8);
								var mes2 = rutina.Fechafinvalidacion.substring(4, 6);
								var year2 = rutina.Fechafinvalidacion.substring(0, 4);
								var fecha2 = dia2 + "/" + mes2 + "/" + year2;
								rutina.Fechafinvalidacion = fecha1;
	
								arrT.push({
									Cantidad: rutina.Cantidad,
									Destinatario: rutina.Destinatario,
									Fechacreacion: rutina.Fechacreacion,
									Fechafinvalidacion: rutina.Fechafinvalidacion,
									Iniciovigencia: rutina.Iniciovigencia,
									Material: rutina.Material,
									Preorden: rutina.Preorden,
									Referencia: rutina.Referencia,
									Unidad: rutina.Unidad,
									Vin: rutina.Vin
								});
							} else {
								for (var i = 0; i < rutina.length; i++) {
									var dia = rutina[i].Fechacreacion.substring(6, 8);
									var mes = rutina[i].Fechacreacion.substring(4, 6);
									var year = rutina[i].Fechacreacion.substring(0, 4);
									var fecha = dia + "/" + mes + "/" + year;
									rutina[i].Fechacreacion = fecha;
	
									var dia1 = rutina[i].Iniciovigencia.substring(6, 8);
									var mes1 = rutina[i].Iniciovigencia.substring(4, 6);
									var year1 = rutina[i].Iniciovigencia.substring(0, 4);
									var fecha1 = dia1 + "/" + mes1 + "/" + year1;
									rutina[i].Iniciovigencia = fecha1;
	
									var dia2 = rutina[i].Fechafinvalidacion.substring(6, 8);
									var mes2 = rutina[i].Fechafinvalidacion.substring(4, 6);
									var year2 = rutina[i].Fechafinvalidacion.substring(0, 4);
									var fecha2 = dia2 + "/" + mes2 + "/" + year2;
									rutina[i].Fechafinvalidacion = fecha1;
	
									arrT.push({
										Cantidad: rutina[i].Cantidad,
										Destinatario: rutina[i].Destinatario,
										Fechacreacion: rutina[i].Fechacreacion,
										Fechafinvalidacion: rutina[i].Fechafinvalidacion,
										Iniciovigencia: rutina[i].Iniciovigencia,
										Material: rutina[i].Material,
										Preorden: rutina[i].Preorden,
										Referencia: rutina[i].Referencia,
										Unidad: rutina[i].Unidad,
										Vin: rutina[i].Vin
									});
								}
							}
						}

						var dataT = new sap.ui.model.json.JSONModel(arrT);
						oView.setModel(dataT, "oferta");
						t.cerrarPopCarga2();
						t.Resultadofiltrado();

					},
					error: function (jqXHR, textStatus, errorThrown) {

						var arrT = [];
						var dataT = new sap.ui.model.json.JSONModel(arrT);
						oView.setModel(dataT, "oferta");
						t.cerrarPopCarga2();
					}

				});
			}

		},
		Resultadofiltrado: function () {
			var filtrado = [],
				flag = true;
			var json = oView.getModel("oferta").oData;

			for (var i = 0; i < json.length; i++) {
				if (filtrado !== []) {

					for (var j = 0; j < filtrado.length; j++) {
						if (filtrado[j].Preorden === json[i].Preorden) {
							flag = false;
							j = filtrado.length + 1;
						} else {
							flag = true;
						}
					}

					if (flag) {
						filtrado.push(json[i]);

					}
					flag = true;
				} else {
					console.log("else");
					filtrado.push(json[i])

				}

			}
			console.log(filtrado);
			var dataT = new sap.ui.model.json.JSONModel(filtrado);
			oView.setModel(dataT, "oferta2");
		},
		AgruparMateriales: function (oEvent) {
			selected = oEvent.getSource().getParent().mAggregations.content[1]._aSelectedPaths[0];
			selected = selected.replace(/\//g, "");
		},
		Verificar: function () {
			var arr = [];

			var json = oView.getModel("oferta").oData;

			var PreOrde = json[selected].Preorden;
			PreOrden2 = json[selected].Preorden;
			for (var i = 0; i < json.length; i++) {
				if (PreOrde === json[i].Preorden) {
					arr.push({
						"Material": json[i].Material,
						"Cliente": "",
						"CantPed": Number(json[i].Cantidad)
					});
					datosC.push({
						"Material": json[i].Material,
						"CantPed": Number(json[i].Cantidad),
						"PreOrden": json[i].Preorden,
						"Destino": json[i].Destinatario

					});
				}

			}
			t.Verificar2(arr);
		},
		Verificar2: function (arr) {
			t.popCarga();
			var json = {
				"HeaderSet": {
					"Header": {
						"Cliente": "",
						"Nav_Header_Stock_2": {
							"Stock": arr
						}
					}

				}
			};

			console.log(json);
			var arrjson = JSON.stringify(json);
            var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
            var appModulePath = jQuery.sap.getModulePath(appid);
			var url =appModulePath + '/destinations/AR_DP_DEST_CPI/http/AR/DealerPortal/Pedido/VerificarStock';

			$.ajax({
				type: 'POST',
				url: url,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: true,
				data: arrjson,
				success: function (dataR, textStatus, jqXHR) {
					t.cerrarPopCarga2();

					Respuesta = dataR;
					t.irVerificar();
				},
				error: function (jqXHR, textStatus, errorThrown) {
					t.cerrarPopCarga2();
					var obj2 = {
						codigo: "500",
						descripcion: "Error en la Verificación, favor intentar nuevamente "
					};
					var arr2 = [];
					arr2.push(obj2);
					t.popSuccesCorreo(arr2, "Error");
				}

			});

		},
		irVerificar: function () {

			var dealer = oView.byId("dealer").getSelectedKey();
			console.log(Respuesta);

			sap.ui.controller("AR_DP_REP_CONVERSIONPREAPEDIDO_RA.AR_DP_REP_CONVERSIONPREAPEDIDO_RA.controller.detalle").jsoncreacion(Respuesta,
				dealer, datosC, oSAPuser, nombreUsuario, isNissanUser);
			var oRouter =
				sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detalle", {
				data: Respuesta
			});

		},
		jsoncreacion2: function (a) {
			var arrT = [];
			var dataT = new sap.ui.model.json.JSONModel(arrT);
			oView.setModel(dataT, "oferta2");
			t.ConsultaPedidos();
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
		/*****************************/
		/*****************correo********************/
		EnvioCorreo: function (evt) {

			var oDialog = oView.byId("EnvioCorreo");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "AR_DP_REP_CONVERSIONPREAPEDIDO_RA.AR_DP_REP_CONVERSIONPREAPEDIDO_RA.view.Correo", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();

		},
		cerrarEnvioCorreo: function () {
			//	t.limpiezacorreo();
			oView.byId("EnvioCorreo").close();
		},

		estructura: function () {

			var json = oView.getModel("oferta").oData;

			var datos = "";
			var titulo =
				"<table><tr><td class= subhead><b>Conversión de Pre-orden a Pedido </b><p></td></tr><p><tr><td class= h1>  Desde el portal de Dealer Portal," +
				"se Envia Conversión de Pre-orden a Pedido <p> ";
			var final = "</tr></table><p>Saludos <p> Dealer Portal Argentina </td> </tr> </table>";
			var cuerpo =
				"<table><tr><th>Dealer</th><th>Fecha creación</th><th>Fecha fin validacion</th><th>Inicio vigencia</th>" +
				"<th>Material</th><th>Cantidad</th><th>PreOrden</th><th>Referencia</th><th>Unidad </th><th>Vin</th>";
			for (var i = 0; i < json.length; i++) {
				var dato = "<tr><td>" + json[i].Destinatario + "</td><td>" + json[i].Fechacreacion + "</td><td>" + json[i].Fechafinvalidacion +
					"</td><td>" +
					json[i].Iniciovigencia + "</td><td>" + json[i].Material +
					"</td><td>" + json[i].Cantidad + "</td><td>" + json[i].Preorden + "</td><td>" + json[i].Referencia + "</td><td>" + json[i].Unidad +
					"</td><td>" + json[i].Vin +
					"</tr> ";

				datos = datos + dato;
			}
			//	var datos = datos + dato
			var contexto = titulo + cuerpo + datos + final;
			//	console.log(contexto);
			t.envio(contexto);
		},
		envio: function (contexto) {
			t.popCarga();
			var arr = [];
			var json = {
				"root": {
					"strmailto": oView.byId("mail").getValue(),
					"strmailcc": "",
					"strsubject": oView.byId("descrpcion").getValue(),
					"strbody": contexto
				}
			};
            var appid = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");
            var appModulePath = jQuery.sap.getModulePath(appid);
			var arrjson = JSON.stringify(json);
			$.ajax({
				type: 'POST',
				url: appModulePath + '/destinations/AR_DP_DEST_CPI/http/AR/DealerPortal/Mail',
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: true,
				data: arrjson,
				success: function (dataR, textStatus, jqXHR) {

				},
				error: function (jqXHR, textStatus, errorThrown) {

					t.cerrarPopCarga2();

					var obj2 = {
						codigo: "200",
						descripcion: "Correo enviado exitosamente"
					};
					var arr2 = [];
					arr2.push(obj2);
					t.popSuccesCorreo(arr2, "Correo");
					oView.byId("mail").setValue();
					oView.byId("descrpcion").setValue();
				}
			});
			//	codigoeliminar = "";
		},

		popSuccesCorreo: function (obj, titulo) {
			var oDialog = oView.byId("SuccesCorreo");
			var log = new sap.ui.model.json.JSONModel(obj);
			oView.setModel(log, "Succes");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "AR_DP_REP_CONVERSIONPREAPEDIDO_RA.AR_DP_REP_CONVERSIONPREAPEDIDO_RA.view.SuccesCorreo",
					this); //aqui se debe cambiar ar_dp_rep
				oView.addDependent(oDialog);
			}
			oView.byId("SuccesCorreo").addStyleClass(this.getOwnerComponent().getContentDensityClass());
			oDialog.open();
			oView.byId("SuccesCorreo").setTitle("" + titulo);
			//	oView.byId("dialogSucces").setState("Succes");
		},
		cerrarPopSuccesCorreo: function () {
			oView.byId("SuccesCorreo").close();
			//t.limpiezacorreo();
			t.cerrarEnvioCorreo();
		},
		onSalir: function () {
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNavigator.toExternal({
				target: {
					shellHash: "#"
				}
			});
		},

		/******************************************/

		/*****************Excel********************/
		downloadExcel: sap.m.Table.prototype.exportData || function () {

			//var oModel =arregloT;
			var oModel = oView.getModel("oferta");

			var Destinatario = {
				name: " Dealer ",
				template: {
					content: "{Destinatario}"
				}
			};
			var Fechacreacion = {
				name: " Fecha creacion ",
				template: {
					content: "{Fechacreacion}"
				}
			};
			var Fechafinvalidacion = {
				name: " Fecha fin validacion  ",
				template: {
					content: "{Fechafinvalidacion}"
				}
			};
			var Iniciovigencia = {
				name: " Inicio vigencia ",
				template: {
					content: "{Iniciovigencia}"
				}
			};
			var Material = {
				name: " Material ",
				template: {
					content: "{Material}"
				}
			};
			var Preorden = {
				name: " PreOrden ",
				template: {
					content: "{Preorden}"
				}
			};
			var Referencia = {
				name: " Referencia ",
				template: {
					content: "{Referencia}"
				}
			};

			var Unidad = {
				name: " Unidad ",
				template: {
					content: "{Unidad}"
				}
			};
			var Vin = {
				name: " Vin ",
				template: {
					content: "{Vin}"
				}
			};
			var Cantidad = {
				name: " Cantidad ",
				template: {
					content: "{Cantidad}"
				}
			};

			var oExport = new Export({

				exportType: new ExportTypeCSV({
					fileExtension: "csv",
					separatorChar: ";"
				}),

				models: oModel,

				rows: {
					path: "/"
				},
				columns: [

					Destinatario,
					Fechacreacion,
					Fechafinvalidacion,
					Iniciovigencia,
					Material,
					Cantidad,
					Preorden,
					Referencia,
					Unidad,
					Vin

				]
			});
			oExport.saveFile("Listado").catch(function (oError) {

			}).then(function () {
				oExport.destroy();
				//	console.log("esto es una maravilla");
			});

		}

		/******************************************/
	});

});