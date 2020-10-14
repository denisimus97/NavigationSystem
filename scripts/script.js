
        //var originalHight = 690;
		var constH = 690;
        var constW = 1112;

        var constLagX = -190;
        var constLagY = 176;
        var dynamicCoef = 1.4; 

		//var windowPlansArray = [];
  //      //windowPlansArray.push(new WindowPlan(windowPlansArray.length, originalHight ));

		//console.log(windowPlansArray.length);
  //      class WindowPlan {
		//	constructor(index , ) {

  //          }
  //          методы
  //      }

      

        //var constLagX = 0;
        //var constLagY = 0;
        //var dynamicCoef = 1; 

		var lagX = 0;
		var lagY = 0;

		var viewBoxX = 0;
		var viewBoxY = 0;
        var viewBoxH = constH / dynamicCoef;
        var viewBoxW = constW / dynamicCoef;

        var mouse_x, mouse_y;
		var elem;
		
        var currentScale = 1;
		//-------------------------------------
		window.onload = function () {
            mouseMonitor(document.getElementById('svg'));
			function mouseMonitor(elem) {
				var first_x;
				var first_y;
				var elemCord;

				position = false;
				$(elem).mousedown(function () {
					position = true;
					elemCord = elem.getBoundingClientRect();
                    first_x = event.pageX - elemCord.left - window.pageXOffset; //window.pageYOffset;
                    first_y = event.pageY - elemCord.top - window.pageYOffset; /*- elem.offsetTop;*/
					
				})
			$("#resultsOfSearch").mousedown(function(){
				$(this).css('cursor', 'pointer')
			});
			$("#resultsOfSearch").mouseup(function(){
				$(this).css('cursor', 'default')
			});
				$(elem).mouseup(function () {
					position = false;
				})
                elem.onmousemove = mousemove;

				function mousemove(event) {
                    elemCord = elem.getBoundingClientRect();
                    if (elem.attachEvent != null) {
                        mouse_x = window.event.pageX - elemCord.left - window.pageXOffset;/*- elem.offsetLeft;*/
                        mouse_y = window.event.pageY - elemCord.top - window.pageYOffset; /*- elem.offsetTop;*/
                    } else if (!elem.attachEvent && elem.addEventListener) {
                        mouse_x = event.pageX - elemCord.left - window.pageXOffset;/*- elem.offsetLeft;*/
                        mouse_y = event.pageY - elemCord.top - window.pageYOffset; /*- elem.offsetTop;*/
                    }
                    console.log('x=' + mouse_x + '; ' + 'y=' + mouse_y + "width = " + $(elem).width() );

					if (position && (Math.random() * 10) % 2) {
                        dndSVG();
                    }
				}
                function dndSVG() {

                    dndLagX = mouse_x - first_x;
                    dndLagY = mouse_y - first_y;

                    console.log('dndx=' + dndLagX + '; ' + 'dndy=' + dndLagY + 'fx=' + first_x + 'fy=' + first_y);

                    if (Math.abs(dndLagX) >= 10 || Math.abs(dndLagY) >= 10) {

                        changeX(lagX - dndLagX / (currentScale * 5) );
						setNumberToRange(lagX, 'lineX', -1, 'rangeNumberX');
                        changeY(lagY - dndLagY / (currentScale * 5) );
                        setNumberToRange(lagY, 'lineY', 1, 'rangeNumberY');

                        //$('svg').attr('viewBox', ' ' + viewBoxX + ' ' + viewBoxY + ' ' + viewBoxW + ' ' + viewBoxH);
                    }
                }
				setScaleByWheel(elem);
				function setScaleByWheel(elem) {
                    if (elem.addEventListener) {
                        if ('onwheel' in document) {
                            // IE9+, FF17+
                            elem.addEventListener("wheel", onWheel);
                        } else if ('onmousewheel' in document) {
                            // устаревший вариант события
                            elem.addEventListener("mousewheel", onWheel);
                        } else {
                            // Firefox < 17
                            elem.addEventListener("MozMousePixelScroll", onWheel);
                        }
                    } else { // IE8-
                        elem.attachEvent("onmousewheel", onWheel);
                    }

					function onWheel(e) {
                        e = e || window.event;

                        // deltaY, detail содержат пиксели
                        // wheelDelta не дает возможность узнать количество пикселей
                        // onwheel || MozMousePixelScroll || onmousewheel
                        var delta = e.deltaY || e.detail || e.wheelDelta;

                        //var indicator = document.getElementById('rangeNumberSc');

                        currentScale -= delta / 2.5 / 100;

                        if (currentScale > 6) {
                            currentScale = 6;
                        } else {
                            if (currentScale < 0.6) {
                                currentScale = 0.6;
                            }
                        }
                        setNumberToRange(currentScale, 'lineSc', 100, 'rangeNumberSc', '%')
                        Scale();

                        //constH * dynamicCoef - mouse_y;

                        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
                    }
                }
		}
        }

		//--------------------------------------
		function search() {
			$("#resultsOfSearch").empty();
			var from = $("#from").val();
			var to = $("#to").val();
			var url = "Navigation/FindRoute?from=" + from + "&to=" + to;

			$.getJSON(url, function (result) {
				$("#resultsOfSearch").append(result);
				//changeWindow();
				Scale();
				
			});
		}

       
        function changeWindow(scale = dynamicCoef) {
            $('svg').attr('width', origW * scale);
            $('svg').attr('height', origH * scale);
        }
        function changeX(line = lagX) {
            lagX = line;
            viewBoxX = (constW / 2) + constLagX + lagX - (constW / 2) / (currentScale * dynamicCoef);
            $('svg').attr('viewBox', ' ' + viewBoxX + ' ' + viewBoxY + ' ' + viewBoxW + ' ' + viewBoxH);
        }
        function changeY(line = lagY) {
            lagY = line;
            viewBoxY = (constH / 2) + constLagY + lagY - (constH / 2) / (currentScale * dynamicCoef);

            $('svg').attr('viewBox', ' ' + viewBoxX + ' ' + viewBoxY + ' ' + viewBoxW + ' ' + viewBoxH);
        }
        function Scale(scale = currentScale) {
            currentScale = scale;
            viewBoxW = constW / (scale * dynamicCoef);
            viewBoxH = constH / (scale * dynamicCoef);
            viewBoxX = (constW/2) + constLagX + lagX - (constW/2) / (scale * dynamicCoef);
            viewBoxY = (constH/2) + constLagY + lagY - (constH/2)/ (scale * dynamicCoef);

            $('svg').attr('viewBox', ' ' + viewBoxX + ' ' + viewBoxY + ' ' + viewBoxW + ' ' + viewBoxH);
        }
		//--------------------------------------
       

        function getNumberFromRange (rangeInputID, multiplier = 1, indicatorID = null, indicatorAdditionalText = '') {
			line = document.getElementById(rangeInputID).value;
            if (indicatorID != null) {
                document.getElementById(indicatorID).innerHTML = line + indicatorAdditionalText;
			}
			return line * multiplier;
		}
		function setNumberToRange(number , rangeInputID, multiplier = 1, indicatorID = null, indicatorAdditionalText = '') {
            document.getElementById(rangeInputID).value = number * multiplier;
            if (indicatorID != null) {
                document.getElementById(indicatorID).innerHTML = Math.floor(number * multiplier) + indicatorAdditionalText;
            }
        }
