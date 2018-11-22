'use strict';

//var url_base = 'http://localhost/paestudiar_wp/';
var url_base = 'http://app.paestudiar.siesa.net/';
var ajax_url = url_base+'wp-admin/admin-ajax.php';

$(document).ready(function(){
	
	//AL HACER CLICK EN EL BOTON DE ESTADIAR SE COMPRUEBAN LOS PARAMETROS
	$('#estudiarbtn').click(function(){
		var element = $(this);
		var url = element.attr("href");
		
		if( url.indexOf("year") == -1 ){
			alert("Debes seleccionar un año");
			return false;
		}
	});
	
	//
	if( $('body').hasClass('seleccionexamen') ){
		//console.log(get_URL_parameter('materias'));
		if( get_URL_parameter('year') === undefined ){
			$('#examinaranios').hide();
			$('#examinaranios').prev().hide();
		}
		
		if( get_URL_parameter('materias') === undefined ){
			$('#examinarmaterias').hide();
			$('#examinarmaterias').prev().hide();
		}
		
		if( get_URL_parameter('cantidad') === undefined ){
			$('#cantidadpormateria').hide();
			$('#cantidadpormateria').parent().prev().hide();
		}
		
		var estudiarbtn = $('#estudiarbtn');
		if( get_URL_parameter('quiz') !== undefined && get_URL_parameter('quiz') === '1' ){
			var link = 'newquiz.html';
		} else {
			var link = estudiarbtn.attr('href');
		}
		if( $('body').hasClass('exam2') ){
			var complemento = [];
		} else {
			var complemento = '';
		}
		var complemento2 = [];
		var newlink = '';
		var newlink2 = '';
		var newlink3 = '';
		
		$('body.exam1').delegate('#examinaranios li','click',function(){
			var element = $(this);
			setTimeout(function(){
				if( element.hasClass('highlighted') ){
					var year = element.find('.title-list').text();
					complemento = year;
					newlink = link+'?year='+complemento;
				} else {
					newlink = link;
				}
				$('#estudiarbtn').attr('href',newlink);
			},500);
		});
		
		$('body').delegate('#examinarmaterias li','click',function(){
			var element = $(this);
			setTimeout(function(){
				var materias = element.find('.title-list').data('title');
				if( element.hasClass('highlighted') ){
					complemento2.push(materias);
				} else {
					for( var i = 0; i < complemento2.length; i++ ){
						if( complemento2[i] === materias ){
							complemento2.splice(i, 1);
						}
					}
				}
				newlink2 = newlink+'&materias='+complemento2.join('|');
				$('#estudiarbtn').attr('href',newlink2);
			},500);
		});
		
		$('#cantidadpormateria').focus();
		
		$('body').delegate('#cantidadpormateria','blur',function(){
			var cantidad = $(this);
			newlink3 = link+'?cantidad='+cantidad.val();
			$('#estudiarbtn').attr('href',newlink3);
		});
		
		$('body.exam2').delegate('#examinaranios li','click',function(){
			var element = $(this);
			setTimeout(function(){
				var anos = element.find('.title-list').text();
				if( element.hasClass('highlighted') ){
					complemento.push(anos);
				} else {
					for( var i = 0; i < complemento.length; i++ ){
						if( complemento[i] === anos ){
							complemento.splice(i, 1);
						}
					}
				}
				
				console.log($('#cantidadpormateria').css('display'));
				if( $('#cantidadpormateria').css('display') === 'block' || $('#cantidadpormateria').css('display') === 'inline-block' ){
					newlink = newlink3+'&years='+complemento.join('|');
				} else {
					newlink = link+'?years='+complemento.join('|');
				}
				$('#estudiarbtn').attr('href',newlink);
			},500);
		});
		
	}
	
	$("#animatedModal").click(function(){
		$(".close-animatedModal").trigger('click');
	});
	
	$('.dateformat').mask('00/00/0000');
	$('.phoneformat').mask('0000-0000');
	
	$('body').delegate('.paes-list li','click',function(){
		var element = $(this);
		
		if( !element.hasClass('highlighted') ){
			element.addClass('highlighted');
			element.addClass('grey');
			element.find('a').addClass('highlighted');
			element.find('a > div').addClass('highlighted');
			
			element.siblings('li').removeClass('highlighted');
			element.siblings('li').removeClass('grey');
			element.siblings('li').find('a').removeClass('highlighted');
			element.siblings('li').find('a > div').removeClass('highlighted');
		} else {
			element.removeClass('highlighted');
			element.removeClass('grey');
			element.find('a').removeClass('highlighted');
			element.find('a > div').removeClass('highlighted');
		}
	});
	
	$('body').delegate('.paes-list-multi li','click',function(){
		var element = $(this);
		
		if( !element.hasClass('highlighted') ){
			element.addClass('highlighted');
			element.addClass('grey');
			element.find('a').addClass('highlighted');
			element.find('a > div').addClass('highlighted');
		} else {
			element.removeClass('highlighted');
			element.removeClass('grey');
			element.find('a').removeClass('highlighted');
			element.find('a > div').removeClass('highlighted');
		}
	});
	
	window.chartColors = {
		red: 'rgb(241, 57, 96)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(244, 171, 33)',
		green: 'rgb(35, 218, 123)',
		blue: 'rgb(1, 128, 255)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(201, 203, 207)'
	};
	
	if( jQuery('#canvas_resultados').length ){
		//Globales
		var color = Chart.helpers.color;
		var materia = get_URL_parameter('materias');
		
		//alert('Materias: '+materia);
		//alert('Correctas: '+get_URL_parameter('correctas'));
		//alert('Incorrectas: '+get_URL_parameter('erroneas'));
		
		if( get_URL_parameter('correctas') !== undefined && get_URL_parameter('erroneas') !== undefined ){
			
			var f = new Date();
			var fecha = f.getDate()+"-"+(f.getMonth()+1)+"-"+f.getFullYear();
			
			var registro = {'correctas' : get_URL_parameter('correctas'), 'erroneas' : get_URL_parameter('erroneas'), 'fecha' : fecha};
			var evaluaciones;
			try {
				evaluaciones = $.parseJSON(localStorage.getItem('evalucaiones'));
				if( evaluaciones == null ){
					evaluaciones = [];
				}
			} catch(err) {
				evaluaciones = [];
			}
			
			evaluaciones.push(registro);
			localStorage.setItem('evalucaiones',JSON.stringify(evaluaciones));
			
			var barChartDatar = {
				labels: ["Global"],
				datasets: [{
					label: 'Correctas',
					backgroundColor: color(window.chartColors.blue).alpha(0.7).rgbString(),
					borderColor: window.chartColors.blue,
					borderWidth: 1,
					data: [get_URL_parameter('correctas'),0]
				}, {
					label: 'Erroneas',
					backgroundColor: color(window.chartColors.yellow).alpha(0.7).rgbString(),
					borderColor: window.chartColors.yellow,
					borderWidth: 1,
					data: [get_URL_parameter('erroneas'),0]
				}]

			};
		}
		else { $('#container_canvas_resultados').parent().hide(100) }
		//Matematicas
		if( materia !== undefined && materia.indexOf('matematicas') !== -1 ){
			var materias = get_URL_parameter('materias');
			var items = materias.split('|');
			var item = '';
			
			for( var i = 0; i < items.length; i++ ){
				if( items[i].indexOf('matematicas') !== -1 ){
					item = items[i];
				}
			}
			
			var parts = item.split(',');
			
			var barChartDatam = {
			labels: ["Matemáticas"],
			datasets: [{
				label: 'Correctas',
				backgroundColor: color(window.chartColors.blue).alpha(0.7).rgbString(),
				borderColor: window.chartColors.blue,
				borderWidth: 1,
				data: [parts[1],0]
			}, {
				label: 'Erróneas',
				backgroundColor: color(window.chartColors.yellow).alpha(0.7).rgbString(),
				borderColor: window.chartColors.yellow,
				borderWidth: 1,
				data: [parts[2],0]
			}]
		};
		}
		else { $('#container_canvas_resultados_mate').parent().hide(100) }
		//Lenguaje
		if( materia !== undefined && materia.indexOf('lenguaje') !== -1 ){
			var materias = get_URL_parameter('materias');
			var items = materias.split('|');
			var item = '';
			
			for( var i = 0; i < items.length; i++ ){
				if( items[i].indexOf('lenguaje') !== -1 ){
					item = items[i];
				}
			}
			
			var parts = item.split(',');
			var barChartDatal = {
			labels: ["Lenguaje y Literatura"],
			datasets: [{
				label: 'Correctas',
				backgroundColor: color(window.chartColors.blue).alpha(0.7).rgbString(),
				borderColor: window.chartColors.blue,
				borderWidth: 1,
				data: [parts[1],0]
			}, {
				label: 'Erróneas',
				backgroundColor: color(window.chartColors.yellow).alpha(0.7).rgbString(),
				borderColor: window.chartColors.yellow,
				borderWidth: 1,
				data: [parts[1],0]
			}]
		};
		}
		else { $('#container_canvas_resultados_lyl').parent().hide(100) }
		//Estudios Sociales
		if( materia !== undefined && materia.indexOf('sociales') !== -1 ){
			var materias = get_URL_parameter('materias');
			var items = materias.split('|');
			var item = '';
			
			for( var i = 0; i < items.length; i++ ){
				if( items[i].indexOf('sociales') !== -1 ){
					item = items[i];
				}
			}
			
			var parts = item.split(',');
			var barChartDatas = {
			labels: ["Estudios Sociales"],
			datasets: [{
				label: 'Correctas',
				backgroundColor: color(window.chartColors.blue).alpha(0.7).rgbString(),
				borderColor: window.chartColors.blue,
				borderWidth: 1,
				data: [parts[1],0]
			}, {
				label: 'Erróneas',
				backgroundColor: color(window.chartColors.yellow).alpha(0.7).rgbString(),
				borderColor: window.chartColors.yellow,
				borderWidth: 1,
				data: [parts[2],0]
			}]
		};
		}
		else { $('#container_canvas_resultados_es').parent().hide(100) }
		//Ciencias Naturales
		if( materia !== undefined && materia.indexOf('ciencias') !== -1 ){
			var materias = get_URL_parameter('materias');
			var items = materias.split('|');
			var item = '';
			
			for( var i = 0; i < items.length; i++ ){
				if( items[i].indexOf('ciencias') !== -1 ){
					item = items[i];
				}
			}
			
			var parts = item.split(',');
			var barChartDatac = {
			labels: ["Ciencias Naturales"],
			datasets: [{
				label: 'Correctas',
				backgroundColor: color(window.chartColors.blue).alpha(0.7).rgbString(),
				borderColor: window.chartColors.blue,
				borderWidth: 1,
				data: [parts[1],0]
			}, {
				label: 'Erróneas',
				backgroundColor: color(window.chartColors.yellow).alpha(0.7).rgbString(),
				borderColor: window.chartColors.yellow,
				borderWidth: 1,
				data: [parts[2],0]
			}]

		};
		}
		else { $('#container_canvas_resultados_cn').parent().hide(100) }
		
		/* HISTORIAL */
		
		
		
		var evaluaciones = $.parseJSON(localStorage.getItem('evalucaiones'));
		var correctas = [];
		var incorrectas = [];
		var labels = [];
		
		for( var a = 0; a < evaluaciones.length; a++ ){
			correctas.push(evaluaciones[a].correctas);
			incorrectas.push(evaluaciones[a].erroneas);
			labels.push(evaluaciones[a].fecha);
		}
		console.log(evaluaciones);
		
		var config = {
			type: 'line',
			data: {
				labels: labels,
				datasets: [{
					label: "Correctas",
					backgroundColor: color(window.chartColors.blue).alpha(0.7).rgbString(),
					borderColor: window.chartColors.blue,
					fill: false,
					data: correctas,
				}, {
					label: "Incorrectas",
					backgroundColor: color(window.chartColors.yellow).alpha(0.5).rgbString(),
					borderColor: window.chartColors.yellow,
					fill: false,
					data: incorrectas,
				}]
			},
			options: {
                title:{
                    text: "Chart.js Time Scale"
                },
				elements : {
					line : {
						tension : 0.01
					}
				}
			},
		};
		/**/
		
		

		window.onload = function() {
			
			if( get_URL_parameter('correctas') !== undefined && get_URL_parameter('erroneas') !== undefined ){
				var ctxr = document.getElementById("canvas_resultados").getContext("2d");
				window.myBar = new Chart(ctxr, {
					type: 'bar',
					data: barChartDatar,
					options: {
						responsive: true,
						legend: {
							position: 'top',
						},
						title: {
							display: true,
							text: 'Resultado de evaluacion'
						}
					}
				});
			}
			
			if( materia !== undefined && materia.indexOf('matematicas') !== -1 ){
				var ctxm = document.getElementById("canvas_resultados_mate").getContext("2d");
				window.myBar = new Chart(ctxm, {
					type: 'bar',
					data: barChartDatam,
					options: {
						responsive: true,
						legend: {
							position: 'top',
						},
						title: {
							display: true,
							text: 'Resultado Matemáticas'
						}
					}
				});
			}
			
			if( materia !== undefined && materia.indexOf('lenguaje') !== -1 ){
				var ctxl = document.getElementById("canvas_resultados_lyl").getContext("2d");
				window.myBar = new Chart(ctxl, {
					type: 'bar',
					data: barChartDatal,
					options: {
						responsive: true,
						legend: {
							position: 'top',
						},
						title: {
							display: true,
							text: 'Resultado Lenguaje y Literatura'
						}
					}
				});
			}
			
			if( materia !== undefined && materia.indexOf('sociales') !== -1 ){
				var ctxe = document.getElementById("canvas_resultados_es").getContext("2d");
				window.myBar = new Chart(ctxe, {
					type: 'bar',
					data: barChartDatas,
					options: {
						responsive: true,
						legend: {
							position: 'top',
						},
						title: {
							display: true,
							text: 'Resultado Estudios Sociales'
						}
					}
				});
			}
			
			if( materia !== undefined && materia.indexOf('ciencias') !== -1 ){
				var ctxc = document.getElementById("canvas_resultados_cn").getContext("2d");
				window.myBar = new Chart(ctxc, {
					type: 'bar',
					data: barChartDatac,
					options: {
						responsive: true,
						legend: {
							position: 'top',
						},
						title: {
							display: true,
							text: 'Resultado Ciencias Naturales'
						}
					}
				});
			}
			
			var ctxl = document.getElementById("canvas").getContext("2d");
			window.myLine = new Chart(ctxl, config);
			
		};
	}
	
	$('body').delegate('.toggle','click',function(e) {
		e.preventDefault();

		var $this = $(this);

		if ($this.next().hasClass('show')) {
			$this.next().removeClass('show');
			$this.next().slideUp(350);
		} else {
			$this.parent().parent().find('li .inner').removeClass('show');
			$this.parent().parent().find('li .inner').slideUp(350);
			$this.next().toggleClass('show');
			$this.next().slideToggle(350);
		}
	});
	
	//Obtener los datos gratuitos
	if( $('#freepaes').length ){
		$.ajax({
			type: "POST",
			url: ajax_url,
			data: {
				action: "get_paes_pdfs"
			},
			beforeSend: function(){
				loading_ajax();
			},
			success: function (data) {
				var dat_ = jQuery.parseJSON(data);
				var html = '';
				
				for( var i = 0; i < dat_.length; i++ ){
					html += '<ul class="accordion">'+
					  '<li>'+
						'<a class="toggle" href="javascript:void(0);">'+dat_[i].titulo+'</a>'+
						'<ul class="inner">';
						for( var f = 0; f < dat_[i].archivos.length; f++ ){
							html += '<li><a href="'+dat_[i].archivos[f].archivo+'" target="_blank"><img src="images/pdf-icon.png" width="50px">'+dat_[i].archivos[f].materia+'</a></li>';
						}
						html += '</ul>'+
					  '</li>'+
					'</ul>';
				}
				$('#freepaes').html(html);

				loading_ajax({estado:false});
			}
		});
	}
	
	//Practicar paes
	if( $('body').hasClass('practicar') ){
		var year = '';
		var materias = '';
		
		if( get_URL_parameter('year') !== undefined ){
			year = get_URL_parameter('year');
		} else {
			year = null;
		}
		
		if( get_URL_parameter('materias') !== undefined ){
			materias = get_URL_parameter('materias');
		} else {
			materias = null;
		}
		
		//console.log(materias);
		//console.log(year);
		
		$.ajax({
			type: "POST",
			cache:false,
			url: ajax_url,
			data: {
				ano : year,
				materias : materias,
				limit : 25,
				action : "get_paes_data"
			},
			beforeSend: function(){
				loading_ajax();
			},
			success: function (data) {
				data = jQuery.parseJSON(data);				
				
				var total = data.length;
				var html = '<ul class="wizard-steps" role="tablist">';
				for( var i = 1; i <= total; i++ ){
					if( i === 1 ){
						html += '<li class="active" role="tab">'+i+'</li>';
					} else {
						html += '<li role="tab">'+i+'</li>';
					}
				}
			  	html += '</ul>'+
				'<div class="wizard-content">';
				
					for( var f = 0; f < total; f++ ){
						//Verificamos si hay imagenes relacionadas
						html += '<div class="wizard-pane active" role="tabpanel">';
						if( data[f].imagenes[0] !== false ){
							html += '<ul class="examen_slider">';
								for( var a = 0; a < data[f].imagenes.length; a++ ){
									html += '<li><img src="'+data[f].imagenes[a]+'" /></li>';
								}
							html += '</ul>';
						}

						  html += '<div class="text-new">'+
						  	'<div class="separator-fields"></div>'+
						  	'<h2 class="title-new">'+data[f].nombre+'</h2>';
							if( data[f].dificultad.length > 0 ){
								var dificultad_ = '';
								if( data[f].dificultad == 'dificil' ){ dificultad_ = 'Difícil'; }
								if( data[f].dificultad == 'facil' ){ dificultad_ = 'Fácil'; }
								if( data[f].dificultad == 'medio' ){ dificultad_ = 'Medio'; }
								html += '<a class="category-link" href="#">'+dificultad_+'</a>';
							}
							html += '<a class="category-link" href="#">'+data[f].ano+'</a><a class="category-link" href="#">Estudio</a><a class="category-link" href="#">'+data[f].materia+'</a>'+
						  	'<div class="separator-fields"></div>'+
						  	'<p class="description-new"><strong>Indicador de logro</strong>: '+data[f].indicador_de_logro+'.<br>'+
							'<strong>Habilidad específica</strong>: '+data[f].habilidad_especifica+'.<br>'+
						  	'<br><strong>Enunciado</strong>: '+data[f].enunciado+'</p>'+
						  	'<div class="separator-button"></div>'+
						  	'<div class="separator-button"></div>'+
							'<div class="estudio">'+
								'<div class="w-clearfix radios-container">';
								  for( var b = 0; b < data[f].respuestas.length; b++ ){
									var classe = '';
									if( data[f].respuestas[b].correcta == 1 ){classe = 'done';
									} else {classe = 'error';}

									html += '<div class="w-radio w-clearfix radio-button">'+
									'<div class="radio-bullet-replacement"></div>'+
									'<input class="w-radio-input radio-bullet hidden" id="node'+f+b+'" type="radio" name="Radio1" value="1" data-name="Radio1">'+
									'<label class="w-form-label" for="node'+f+b+'">'+data[f].respuestas[b].respuesta+'</label>'+
									'<div class="hidden '+classe+' respuesta">'+
										data[f].respuestas[b].mensaje+
									'</div>'+
								  '</div>';
								 }	 

							html += '</div>';
						  html += '</div>';
						 html += '</div>';
						 html += '<div class="separator-button"></div>';
						html += '</div>';
					}
				
				html += '</div>';
				
				$('.wizard').html(html);
				$('.wizard').wizard({
					buttonLabels: {
						next: 'Siguiente',
						back: 'Atras',
						finish: 'Volver'
					},
					 onFinish: function(){
						 window.location.href = 'groups.html';
						 return false;
					 }
				});
				
				if( jQuery(".examen_slider").length ){
					jQuery(".examen_slider").slippry({
						transition: 'fade',
						useCSS: true,
						speed: 1000,
						pause: 5000,
						auto: false,
						preload: 'visible',
						responsive : true,
						autoHover : true
					});
				}
				loading_ajax({estado:false});
			},
			timeout:10000,
			error: function(){
				loading_ajax({estado:false});
				//navigator.notification.alert('No hay respuesta del servidor, si haces click en aceptar se volverá a intentar cargar los datos', function(){ window.location.reload() }, 'Servidor no responde','Aceptar');
				//navigator.notification.beep(2);
				//navigator.notification.vibrate(2);
			}
		});	
	}
	
	
	$('body.practicar .estudio').each(function(){
		var element = $(this);
	});
	
	$('body.practicar').delegate('.radios-container .w-radio','tap',function(){
		
		var element = $(this);
		
		element.find('.radio-bullet-replacement').addClass('checked');
		element.find('input').attr('checked','checked');
		element.siblings().find('.radio-bullet-replacement').removeClass('checked');
		element.siblings().find('input').removeAttr('checked');
		element.find('.respuesta').removeClass('hidden');
		element.siblings().find('.respuesta').addClass('checked');
		
	});
	
	$('body').delegate('.radios-container .w-radio','click',function(){
		var element = $(this);
		
		element.find('.radio-bullet-replacement').addClass('checked');
		element.find('input').attr('checked','checked');
		element.siblings().find('.radio-bullet-replacement').removeClass('checked');
		element.siblings().find('input').removeAttr('checked');
		element.siblings().find('.respuesta').addClass('checked');
		
	});
	
	//Evaluar paes
	if( $('body').hasClass('doquiz') ){
		$('body').delegate('.wizard-finish','click',function(){
			var correctas = 0;
			var erroneas = 0;
			var materiass = materias.split('|');
			var materia = [];
			 
			 //console.log(materiass);
			 
			$('.wizard .radio-bullet-replacement').each(function(){
				 var check = $(this);
				 
				 if( check.hasClass('checked') && check.siblings('input').hasClass('done') ){
					 correctas++;
				 }
				 if( check.hasClass('checked') && check.siblings('input').hasClass('error') ){
					 erroneas++;
				 }
			});
			 
			for( var i = 0; i < materiass.length; i++ ){
				 //console.log(materiass[i]);
				 var cantidad = $('.radio-bullet-replacement.checked[data-materia="'+materiass[i]+'"]').siblings('input.done').length;
				 var cantidad2 = $('.radio-bullet-replacement.checked[data-materia="'+materiass[i]+'"]').siblings('input.error').length;
				 materia.push(materiass[i]+','+cantidad+','+cantidad2);
			}
			 
			var url = 'results.html?correctas='+correctas+'&erroneas='+erroneas+'&materias='+materia.join('|');
			//alert("Metodo delegado: "+url);
			window.location.href = url;
			return false;
		});
		
		var year = '';
		var materias = '';
		var cantidad = '';
		
		if( get_URL_parameter('years') !== undefined ){
			year = get_URL_parameter('years');
		} else {
			year = null;
		}
		
		if( get_URL_parameter('materias') !== undefined ){
			materias = get_URL_parameter('materias');
		} else {
			materias = null;
		}
		
		if( get_URL_parameter('cantidad') !== undefined ){
			cantidad = get_URL_parameter('cantidad');
		} else {
			cantidad = 25;
		}
		
		//console.log(materias);
		//console.log(year);
		
		$.ajax({
			type: "POST",
			cache:false,
			url: ajax_url,
			data: {
				ano : year,
				materias : materias,
				limit : cantidad,
				action : "get_paes_data"
			},
			beforeSend: function(){
				loading_ajax();
			},
			success: function (data) {
				data = jQuery.parseJSON(data);				
				
				var total = data.length;
				var html = '<ul class="wizard-steps" role="tablist">';
				for( var i = 1; i <= total; i++ ){
					if( i === 1 ){
						html += '<li class="active" role="tab">'+i+'</li>';
					} else {
						html += '<li role="tab">'+i+'</li>';
					}
				}
			  	html += '</ul>'+
				'<div class="wizard-content">';
				
					for( var f = 0; f < total; f++ ){
						//Verificamos si hay imagenes relacionadas
						html += '<div class="wizard-pane active" role="tabpanel">';
						if( data[f].imagenes[0] !== false ){
							html += '<ul class="examen_slider">';
								for( var a = 0; a < data[f].imagenes.length; a++ ){
									html += '<li><img src="'+data[f].imagenes[a]+'" /></li>';
								}
							html += '</ul>';
						}

						  html += '<div class="text-new">'+
						  	'<div class="separator-fields"></div>'+
						  	'<h2 class="title-new">'+data[f].nombre+'</h2>'+
						  	'<a class="category-link" href="#">'+data[f].dificultad+'</a><a class="category-link" href="#">'+data[f].ano+'</a><a class="category-link" href="#">Examen</a><a class="category-link" href="#">'+data[f].materia+'</a>'+
						  	'<div class="separator-fields"></div>'+
						  	'<p class="description-new"><strong>Indicador de logro</strong>: '+data[f].indicador_de_logro+'.<br>'+
							'<strong>Habilidad específica</strong>: '+data[f].habilidad_especifica+'.<br>'+
						  	'<br><strong>Enunciado</strong>: '+data[f].enunciado+'</p>'+
						  	'<div class="separator-button"></div>'+
						  	'<div class="separator-button"></div>'+
							'<div class="estudio">'+
								'<div class="w-clearfix radios-container">';
								  for( var b = 0; b < data[f].respuestas.length; b++ ){
									var classe = '';
									if( data[f].respuestas[b].correcta == 1 ){classe = 'done';
									} else {classe = 'error';}

									html += '<div class="w-radio w-clearfix radio-button">'+
									'<div class="radio-bullet-replacement" data-materia="'+data[f].materia+'"></div>'+
									'<input class="w-radio-input radio-bullet hidden '+classe+'" id="node'+f+b+'" type="radio" name="Radio1" value="1" data-name="Radio1">'+
									'<label class="w-form-label" for="node'+f+b+'">'+data[f].respuestas[b].respuesta+'</label>'+
								  '</div>';
								 }	 

							html += '</div>';
						  html += '</div>';
						 html += '</div>';
						 html += '<div class="separator-button"></div>';
						html += '</div>';
					}
				
				html += '</div>';
				
				$('.wizard').html(html);
				$('.wizard').wizard({
					buttonLabels: {
						next: 'Siguiente',
						back: '',
						finish: 'Calificar'
					},
					onBeforeChange: function(){
						if( $('.wizard-content .wizard-pane.active .radios-container .w-radio-input:checked').hasClass('error') ){
							$('.wizard-steps li.current').css({
								'background-color':'#f9cdcd'
							});
						}
						if( $('.wizard-content .wizard-pane.active .radios-container .w-radio-input:checked').hasClass('done') ){
							$('.wizard-steps li.current').css({
								'background-color':'#e0f7c7'
							});
						}
					},
					onFinish: function(){
						 var correctas = 0;
						 var erroneas = 0;
						 var materiass = materias.split('|');
						 var materia = [];
						 
						 //console.log(materiass);
						 
						 $('.wizard .radio-bullet-replacement').each(function(){
							 var check = $(this);
							 
							 if( check.hasClass('checked') && check.siblings('input').hasClass('done') ){
								 correctas++;
							 }
							 if( check.hasClass('checked') && check.siblings('input').hasClass('error') ){
								 erroneas++;
							 }
						 });
						 
						 for( var i = 0; i < materiass.length; i++ ){
							 //console.log(materiass[i]);
							 var cantidad = $('.radio-bullet-replacement.checked[data-materia="'+materiass[i]+'"]').siblings('input.done').length;
							 var cantidad2 = $('.radio-bullet-replacement.checked[data-materia="'+materiass[i]+'"]').siblings('input.error').length;
							 materia.push(materiass[i]+','+cantidad+','+cantidad2);
						 }
						 
						 var url = 'results.html?correctas='+correctas+'&erroneas='+erroneas+'&materias='+materia.join('|');
						 alert("metodo interno: "+url);
						 window.location.href = url;
						//return false;
					 }
				});
				$(".wizard-back").hide();
				
				if( jQuery(".examen_slider").length ){
					jQuery(".examen_slider").slippry({
						transition: 'fade',
						useCSS: true,
						speed: 1000,
						pause: 5000,
						auto: false,
						preload: 'visible',
						responsive : true,
						autoHover : true
					});
				}
			},
			timeout:10000,
			error: function(){
				loading_ajax({estado:false});
				//navigator.notification.alert('No hay respuesta del servidor, si haces click en aceptar se volverá a intentar cargar los datos', function(){ window.location.reload() }, 'Servidor no responde','Aceptar');
				//navigator.notification.beep(2);
				//navigator.notification.vibrate(2);
			}
		});	
	}
	
	
	//Practicar paes
	if( $('body').hasClass('todolist') ){
		
		$.ajax({
			type: "POST",
			cache:false,
			url: ajax_url,
			data: {
				action : "get_paes_variables"
			},
			beforeSend: function(){
				loading_ajax();
			},
			success: function (data) {
				data = jQuery.parseJSON(data);
				var anios = '';
				var materias = '';
				
				data.anios = data.anios.sort();
				
				for( var i = data.anios.length-1; i >= 0; i-- ){
					anios += '<li class="list-item" data-ix="list-item" style="opacity: 1; transform: translateX(0px) translateY(0px); transition: opacity 500ms cubic-bezier(0.23, 1, 0.32, 1), transform 500ms cubic-bezier(0.23, 1, 0.32, 1);">'+
						'<a class="w-clearfix w-inline-block" href="#">'+
						  '<div class="icon-list">'+
							'<div class="icon ion-ios-checkmark-empty"></div>'+
						  '</div>'+
						  '<div class="title-list">'+data.anios[i]+'</div>'+
						'</a>'+
					  '</li>';
					$('#examinaranios').html(anios);
				}
				
				for( var f = 0; f < data.materias.length; f++ ){
					materias += '<li class="list-item" data-ix="list-item" style="opacity: 1; transform: translateX(0px) translateY(0px); transition: opacity 500ms cubic-bezier(0.23, 1, 0.32, 1), transform 500ms cubic-bezier(0.23, 1, 0.32, 1);">'+
						'<a class="w-clearfix w-inline-block" href="#">'+
						  '<div class="icon-list">'+
							'<div class="icon ion-ios-checkmark-empty"></div>'+
						  '</div>'+
						  '<div class="title-list" data-title="'+data.materias[f]+'">'+data.materias[f].ucfirst()+'</div>'+
						'</a>'+
					  '</li>';
					$('#examinarmaterias').html(materias);
				}
				
				loading_ajax({estado:false});
			},
			timeout:10000,
			error: function(){
				loading_ajax({estado:false});
				//navigator.notification.alert('No hay respuesta del servidor, si haces click en aceptar se volverá a intentar cargar los datos', function(){ window.location.reload() }, 'Servidor no responde','Aceptar');
				//navigator.notification.beep(2);
				//navigator.notification.vibrate(2);
			}
		});	
	}
	
	$('body').delegate('.estudio input[type="radio"]','change',function(){
		var element = $(this);
		
		element.parent().siblings().find('.respuesta').addClass('hidden');
		element.parent().find('.respuesta').removeClass('hidden');
	});
	
	
	$('#zoom-in').click(function() {
	   updateZoom(0.1);
	});

	$('#zoom-out').click(function() {
	   updateZoom(-0.1);
	});

});

var zoomLevel = 1;
function updateZoom(zoom) {
	zoomLevel += zoom;
	$('body').css({ zoom: zoomLevel, '-moz-transform': 'scale(' + zoomLevel + ')' });
}

function loading_ajax(options){
	var defaults = {
		'estado' : true
	}
	jQuery.extend(defaults, options);
	
	if(defaults.estado == true){
		jQuery('body').append('<div class="sombra_popup sportive-ajax"><div class="sk-three-bounce"><div class="sk-child sk-bounce1"></div><div class="sk-child sk-bounce2"></div><div class="sk-child sk-bounce3"></div></div></div>');
		jQuery('.sombra_popup').fadeIn(1000);
	} else {
		jQuery('.sombra_popup').fadeOut(800, function(){
			jQuery('.sportive-ajax').remove();
		});
	}
}

function get_nonce(){
	jQuery.ajax({
		type: "GET",
		url: url_base+'api/get_nonce/?controller=auth&method=generate_auth_cookie',
		beforeSend: function(){
			loading_ajax();
		},
		success: function (data) {
			loading_ajax({estado:false});
			if( data.status == "ok" ){
				return data.nonce;
			} else {
				return false;
			}
		},
		timeout:10000,
		error: function(){
			loading_ajax({estado:false});
			navigator.notification.alert('No hay respuesta del servidor, si haces click en aceptar se volverá a intentar cargar los datos', function(){ window.location.reload() }, 'Servidor no responde','Aceptar');
			//navigator.notification.beep(1000);
			//navigator.notification.vibrate(2);
		}
	});
}

function verify_loggedin_cookie(){
	if(localStorage.getItem('wordpress_loggedin_admin') != null) {
		window.location.href = 'groups.html';
	}
}

function verify_loggedout_cookie(){
	if(!localStorage.getItem('wordpress_loggedin_admin') || localStorage.getItem('wordpress_loggedin_admin') == null ) {
		window.location.href = 'index.html';
	}
}

function get_URL_parameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for( var i = 0; i < sURLVariables.length; i++){
        var sParameterName = sURLVariables[i].split('=');
        if(sParameterName[0] == sParam){
            return sParameterName[1];
		}
	}
}

function check_role(role){
	var user = localStorage.getItem('app_user_id');
	jQuery.ajax({
		type: "POST",
		data: {
			role : role,
			user : user,
			action : 'lockout_app'
		},
		url: ajax_url,
		beforeSend: function(){
			loading_ajax();
		},
		success: function (data) {
			dat_ = jQuery.parseJSON(data);
			loading_ajax({estado:false});
			if( dat_.error == "1" ){
				localStorage.removeItem('wordpress_loggedin_admin');
				localStorage.removeItem('app_user_id');
				window.location.href = 'index.html';
			}
		}
	});
}

function check_user_exist(){
	var user = localStorage.getItem('app_user_id');
	jQuery.ajax({
		type: "POST",
		data: {
			user : user,
			action : 'user_exists_ajax'
		},
		url: ajax_url,
		beforeSend: function(){
			loading_ajax();
		},
		success: function (data) {
			var dat_ = jQuery.parseJSON(data);
			loading_ajax({estado:false});
			if( dat_.error == "1" ){
				localStorage.removeItem('wordpress_loggedin_admin');
				localStorage.removeItem('app_user_id');
				window.location.href = 'index.html';
			}
		}
	});
}

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';
	
	if( states[networkState] === states[Connection.UNKNOWN] || states[networkState] === states[Connection.NONE] ){
		navigator.notification.alert('No hay Conexión a internet o es muy lenta', function(){}, 'Error','Aceptar');
		//navigator.notification.vibrate(1000);
	}
	
	if( states[networkState] === states[Connection.CELL_2G] ){
		navigator.notification.alert('La conexión a internet es muy lentam esto puede generar problemas al cargar los datos', function(){}, 'Error','Aceptar');
		//navigator.notification.vibrate(1000);
	}
}

Array.prototype.unique = function(a){
  return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
});

String.prototype.ucfirst = function(){
    return this.charAt(0).toUpperCase() + this.substr(1);
}


var connectionStatus = false;

$(document).on('pagebeforeshow', 'body', function () {
    setInterval(function () {
        connectionStatus = navigator.onLine ? 'online' : 'offline';
		
		if( connectionStatus == 'offline' ){
			window.location.href = 'offline.html'
		}
    }, 1000);
});
