/* dgf v.0.9.8, 2017-07-06T12:44:30.602Z, Copyright (c) 2016-2017 Thomas Müller Flury */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3'], factory) :
	(factory((global.dgf = global.dgf || {}),global.d3));
}(this, (function (exports,d3) { 'use strict';

function interval$1(interval$$1, repeat) {

	var _interval = interval$$1,
	    _repeat = repeat,
	    stopped,
	    callback,
	    startCallback,
	    stopCallback;

	function template(selection) {

		callback = callback || function () {
			return undefined;
		};
		startCallback = startCallback || callback;
		stopCallback = stopCallback || callback;

		selection.each(function () {

			stopped = false;
			selection.call(startCallback);

			var t = d3.interval(function (elapsed) {
				if (elapsed > _repeat * _interval && _repeat != -1) {
					t.stop();
					stopped = true;
					selection.call(stopCallback);
				}
				selection.call(callback);
			}, _interval);
		});
	}

	template.interval = function (_) {
		return arguments.length ? (_interval = +_, template) : _interval;
	};

	template.repeat = function (_) {
		return arguments.length ? (_repeat = +_, template) : _repeat;
	};

	template.isStopped = function () {
		return stopped;
	};

	template.callback = function (_) {
		return arguments.length ? (callback = _, template) : callback;
	};

	template.startCallback = function (_) {
		return arguments.length ? (startCallback = _, template) : startCallback;
	};

	template.stopCallback = function (_) {
		return arguments.length ? (stopCallback = _, template) : stopCallback;
	};

	return template;
}

function dsv(d, dlm) {

	var _data = d,
	    delimiter = dlm,
	    parserCallback,
	    callback,
	    errorCallback;

	function reader(selection) {

		selection.each(function (data, index) {

			// DEFAULTS
			parserCallback = parserCallback || function (data) {
				return data;
			};
			callback = callback || function () {
				return undefined;
			};
			errorCallback = errorCallback || function () {
				return undefined;
			};

			switch (delimiter) {
				case "comma":
					delimiter = ",";
					break;

				case "tab":
					delimiter = "\t";
					break;

				case "semicolon":
					delimiter = ";";
					break;
			}

			data = _data ? d3.dsvFormat(delimiter).parse(_data.trim()) : undefined;

			if (data) {
				parserCallback.call(this, data, index);

				selection.datum(data).call(callback, selection);

				/*
    try {
    	var data = d3.dsvFormat(delimiter).parse(_data);
    
    	selection
    		.datum(data)
    		.call(callback);
    } catch(exception) {
    	selection
    		.datum([exception])
    		.call(errorCallback);
    	
    	throw(exception);
    }
    */
			}
		});
	}

	reader.data = function (_) {
		return arguments.length ? (_data = _, reader) : _data;
	};

	reader.delimiter = function (_) {
		return arguments.length ? (delimiter = _, reader) : delimiter;
	};

	reader.parserCallback = function (_) {
		return arguments.length ? (parserCallback = _, reader) : parserCallback;
	};

	reader.callback = function (_) {
		return arguments.length ? (callback = _, reader) : callback;
	};

	reader.errorCallback = function (_) {
		return arguments.length ? (errorCallback = _, reader) : errorCallback;
	};

	return reader;
}

function json$1(url) {

	var _url = url,
	    _data,
	    cacheData,
	    parserCallback,
	    callback,
	    errorCallback;

	function reader(selection) {
		selection.each(function (data, index) {

			// DEFAULTS
			parserCallback = parserCallback || function (data) {
				return data;
			};
			callback = callback || function () {
				return undefined;
			};
			errorCallback = errorCallback || function () {
				return undefined;
			};

			if (_data && cacheData) {
				try {
					data = JSON.parse(_data);
					parserCallback.call(this, data, index);

					selection.datum(data).call(callback);
				} catch (error) {
					selection.call(errorCallback, error + " (" + error + ")");
				}
			} else {
				if (_url) {
					d3.json(_url, function (error, data) {
						if (error) {
							errorCallback.call(this, error);
						} else {
							parserCallback.call(this, data, index);
							selection.datum(data).call(callback);
						}
					});
				}
			}
		});
	}

	reader.url = function (_) {
		return arguments.length ? (_url = _, reader) : _url;
	};

	reader.data = function (_) {
		return arguments.length ? (_data = _, reader) : _data;
	};

	reader.cacheData = function (_) {
		return arguments.length ? (cacheData = _, reader) : cacheData;
	};

	reader.parserCallback = function (_) {
		return arguments.length ? (parserCallback = _, reader) : parserCallback;
	};

	reader.callback = function (_) {
		return arguments.length ? (callback = _, reader) : callback;
	};

	reader.errorCallback = function (_) {
		return arguments.length ? (errorCallback = _, reader) : errorCallback;
	};

	return reader;
}

function testData() {

	var xType, yMin, yMax, rows, exitProbability, parserCallback, callback, errorCallback;

	function reader(selection) {

		var scale = d3.scaleLinear().domain([0, 1]).range([yMin, yMax]),
		    format$$1 = d3.format(".4r");

		function rand() {
			return +format$$1(scale(Math.random()));
		}

		function idOf(i) {
			return (i >= 26 ? idOf((i / 26 >> 0) - 1) : "") + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[i % 26 >> 0];
		}

		selection.each(function () {

			// DEFAULTS
			xType = xType || "ordinal";

			parserCallback = parserCallback || function (data) {
				return data;
			};
			callback = callback || function () {
				return undefined;
			};
			errorCallback = errorCallback || function () {
				return undefined;
			};

			var i,
			    keys$$1 = [];
			for (i = 0; i < rows; i++) {
				keys$$1.push(idOf(i));
			}

			var copyOfKeys = keys$$1.slice();

			for (i = 0; i < copyOfKeys.length; i++) {
				if (Math.random() < exitProbability) copyOfKeys.splice(i, 1);
			}

			var date = new Date();

			var data = copyOfKeys.map(function (d, i) {
				return {
					"x": function (d, i) {
						switch (xType) {
							case "ordinal":
								return d;
							case "continous":
								return i;
							case "date":
								date.setDate(date.getDate() + 1);
								return date.toISOString().slice(0, 10);
							default:
								return d;
						}
					}(d, i),
					"y": rand(),
					"y1": rand() / 2,
					"key": d
				};
			});

			parserCallback.call(this, data);

			selection.datum(data).call(callback, selection);
		});
	}

	reader.xType = function (_) {
		return arguments.length ? (xType = _, reader) : xType;
	};

	reader.yMin = function (_) {
		return arguments.length ? (yMin = _, reader) : yMin;
	};

	reader.yMax = function (_) {
		return arguments.length ? (yMax = _, reader) : yMax;
	};

	reader.rows = function (_) {
		return arguments.length ? (rows = _, reader) : rows;
	};

	reader.exitProbability = function (_) {
		return arguments.length ? (exitProbability = _, reader) : exitProbability;
	};

	reader.parserCallback = function (_) {
		return arguments.length ? (parserCallback = _, reader) : parserCallback;
	};

	reader.callback = function (_) {
		return arguments.length ? (callback = _, reader) : callback;
	};

	reader.errorCallback = function (_) {
		return arguments.length ? (errorCallback = _, reader) : errorCallback;
	};

	return reader;
}

function arcLabel() {

	var layer, classed, orient, width, height, margin, key, x, y, y1, color, text, y1Scale, colorScale, yLabel, transition$$1, enterTransition, exitTransition, callback, enterCallback, exitCallback, mouseOverCallback, mouseLeaveCallback, touchStartCallback, touchEndCallback, textFormat, _pie, _arc;

	function template(selection) {

		// DEFAULTS		
		transition$$1 = transition$$1 || function (t) {
			return t.duration(0);
		};
		enterTransition = enterTransition || function (t) {
			return t.duration(0);
		};
		exitTransition = exitTransition || function (t) {
			return t.duration(0);
		};

		callback = callback || function () {
			return undefined;
		};
		enterCallback = enterCallback || function () {
			return undefined;
		};
		exitCallback = exitCallback || function () {
			return undefined;
		};

		mouseOverCallback = mouseOverCallback || function () {
			return undefined;
		};
		mouseLeaveCallback = mouseLeaveCallback || function () {
			return undefined;
		};

		touchStartCallback = touchStartCallback || function () {
			return undefined;
		};
		touchEndCallback = touchEndCallback || function () {
			return undefined;
		};

		classed = classed || "arcLabel";

		_pie = _pie || {};
		_arc = _arc || {};

		textFormat = textFormat || function (d) {
			return d;
		};

		var w = template.contentWidth(),
		    h = template.contentHeight(),
		    radius = Math.min(w, h) / 2;

		var pie$$1 = d3.pie().sort(null).value(function (d) {
			return y(d);
		}).startAngle(_pie.startAngle ? _pie.startAngle * Math.PI / 180 : 0).endAngle(_pie.endAngle ? _pie.endAngle * Math.PI / 180 : 2 * Math.PI).padAngle(_pie.padAngle ? _pie.padAngle * Math.PI / 180 : 0);

		var arc$$1 = d3.arc().outerRadius(radius * 0.8)
		//.innerRadius(radius * 0.4);
		.innerRadius(_arc.innerRadius ? radius * _arc.innerRadius : radius * 0.4);

		var outerArc = d3.arc().innerRadius(radius * 0.9).outerRadius(radius * 0.9);

		function midAngle(d) {
			return d.startAngle + (d.endAngle - d.startAngle) / 2;
		}

		selection.each(function (data) {

			var node = d3.select(this);

			// Center arc
			var g = node.select("g");
			if (g.empty()) {
				g = node.append("g").attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");
			}

			if (g.select(".label").empty()) {
				g.append("text").attr("class", "label").attr("dy", ".35em").style("text-anchor", "middle").text(function () {
					return typeof yLabel === "function" ? yLabel(data) : yLabel;
				});
			}

			/* TEXT */

			var labels = g.select(".labels");

			if (labels.empty()) {
				labels = g.append("g").attr("class", classed + " labels");
			}

			// UPDATE		
			var label = labels.selectAll(".label").data(pie$$1(data), function (d) {
				return key(d.data);
			}).attr("class", "label update");

			// ENTER	
			label.enter().append("text").attr("class", "label enter").attr("dy", ".35em").style("fill", function (d) {
				return colorScale(color(d.data));
			}).style("font-size", function (d) {
				return y1 && y1Scale ? y1Scale(y1(d.data)) + "em" : undefined;
			}).on("mouseover", mouseOverCallback).on("mouseleave", mouseLeaveCallback).on("touchstart", touchStartCallback).on("touchend", touchEndCallback).call(enterCallback).merge(label) // ENTER + UPDATE
			.text(function (d) {
				return textFormat(text(d.data));
			}).transition().call(transition$$1).style("fill", function (d) {
				return colorScale(color(d.data));
			}).style("font-size", function (d) {
				return y1 && y1Scale ? y1Scale(y1(d.data)) + "em" : undefined;
			}).attrTween("transform", function (d) {
				this._current = this._current || d;
				var interpolate$$1 = d3.interpolate(this._current, d);
				this._current = interpolate$$1(0);
				return function (t) {
					var d2 = interpolate$$1(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * (midAngle(d2) > 0 && midAngle(d2) < Math.PI ? 1 : -1);
					return "translate(" + pos + ")";
				};
			}).styleTween("text-anchor", function (d) {
				this._current = this._current || d;
				var interpolate$$1 = d3.interpolate(this._current, d);
				this._current = interpolate$$1(0);
				return function (t) {
					var d2 = interpolate$$1(t);
					return midAngle(d2) > 0 && midAngle(d2) < Math.PI ? "start" : "end";
				};
			}).on("end", function () {
				d3.select(this).call(callback);
			});

			// EXIT
			label.exit().attr("class", "label exit").transition().call(exitTransition).on("end", function () {
				d3.select(this).call(exitCallback);
			}).remove();

			/* LINES */

			var lines = g.select(".lines");

			if (lines.empty()) {
				lines = g.append("g").attr("class", classed + " lines");
			}

			var polyline = lines.selectAll(".line").data(pie$$1(data), function (d) {
				return key(d.data);
			}).attr("class", "line update");

			polyline.enter().append("polyline").attr("class", "line enter").merge(polyline).transition().call(transition$$1).attrTween("points", function (d) {
				this._current = this._current || d;
				var interpolate$$1 = d3.interpolate(this._current, d);
				this._current = interpolate$$1(0);
				return function (t) {
					var d2 = interpolate$$1(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * 0.95 * (midAngle(d2) > 0 && midAngle(d2) < Math.PI ? 1 : -1);
					return [arc$$1.centroid(d2), outerArc.centroid(d2), pos];
				};
			});

			polyline.exit().attr("class", "line exit").transition().call(exitTransition).remove();
		});
	}

	template.layer = function (_) {
		return arguments.length ? (layer = _, template) : layer || {};
	};

	template.classed = function (_) {
		return arguments.length ? (classed = _, template) : classed;
	};

	template.orient = function (_) {
		return arguments.length ? (orient = _, template) : orient;
	};

	template.width = function (_) {
		return arguments.length ? (width = _, template) : width;
	};

	template.height = function (_) {
		return arguments.length ? (height = _, template) : height;
	};

	template.margin = function (_) {
		return arguments.length ? (margin = _, template) : margin;
	};

	template.contentWidth = function () {
		return width - margin.right - margin.left;
	};

	template.contentHeight = function () {
		return height - margin.top - margin.bottom;
	};

	template.key = function (_) {
		return arguments.length ? (key = _, template) : key;
	};

	template.x = function (_) {
		return arguments.length ? (x = _, template) : x;
	};

	template.y = function (_) {
		return arguments.length ? (y = _, template) : y;
	};

	template.y1 = function (_) {
		return arguments.length ? (y1 = _, template) : y1;
	};

	template.color = function (_) {
		return arguments.length ? (color = _, template) : color;
	};

	template.text = function (_) {
		return arguments.length ? (text = _, template) : text;
	};

	template.y1Scale = function (_) {
		return arguments.length ? (y1Scale = _, template) : y1Scale;
	};

	template.colorScale = function (_) {
		return arguments.length ? (colorScale = _, template) : colorScale;
	};

	template.yLabel = function (_) {
		return arguments.length ? (yLabel = _, template) : yLabel;
	};

	template.transition = function (_) {
		return arguments.length ? (transition$$1 = _, template) : transition$$1;
	};

	template.enterTransition = function (_) {
		return arguments.length ? (enterTransition = _, template) : enterTransition;
	};

	template.exitTransition = function (_) {
		return arguments.length ? (exitTransition = _, template) : exitTransition;
	};

	template.callback = function (_) {
		return arguments.length ? (callback = _, template) : callback;
	};

	template.enterCallback = function (_) {
		return arguments.length ? (enterCallback = _, template) : enterCallback;
	};

	template.exitCallback = function (_) {
		return arguments.length ? (exitCallback = _, template) : exitCallback;
	};

	template.mouseOverCallback = function (_) {
		return arguments.length ? (mouseOverCallback = _, template) : mouseOverCallback;
	};

	template.mouseLeaveCallback = function (_) {
		return arguments.length ? (mouseLeaveCallback = _, template) : mouseLeaveCallback;
	};

	template.touchStartCallback = function (_) {
		return arguments.length ? (touchStartCallback = _, template) : touchStartCallback;
	};

	template.touchEndCallback = function (_) {
		return arguments.length ? (touchEndCallback = _, template) : touchEndCallback;
	};

	template.textFormat = function (_) {
		return arguments.length ? (textFormat = _, template) : textFormat;
	};

	template.arc = function (_) {
		return arguments.length ? (_arc = _, template) : _arc;
	};

	template.pie = function (_) {
		return arguments.length ? (_pie = _, template) : _pie;
	};

	return template;
}

function axis() {

	var layer, classed, orient, zIndex, hide, key, x, y, y1, xScale, yScale, y1Scale, xLabel, yLabel, y1Label, xFormat, yFormat, y1Format, xTicks, yTicks, y1Ticks, xTickValues, yTickValues, y1TickValues, xTickRotate, yTickRotate, y1TickRotate, xGrid, yGrid, y1Grid, xHide, yHide, y1Hide, transition$$1, enterTransition, exitTransition, callback, enterCallback, exitCallback;

	function template(selection) {

		// DEFAULTS
		classed = classed || "axis";

		transition$$1 = transition$$1 || function (t) {
			return t.duration(0);
		};
		enterTransition = enterTransition || function (t) {
			return t.duration(0);
		};
		exitTransition = exitTransition || function (t) {
			return t.duration(0);
		};

		callback = callback || function () {
			return undefined;
		};
		enterCallback = enterCallback || function () {
			return undefined;
		};
		exitCallback = exitCallback || function () {
			return undefined;
		};

		selection.each(function (data) {

			var xAxis = d3.axisBottom(xScale).ticks(xTicks).tickValues(xTickValues).tickFormat(xFormat),
			    yAxis = d3.axisLeft(yScale).ticks(yTicks).tickValues(yTickValues).tickFormat(yFormat),
			    y1Axis = d3.axisRight(y1Scale).ticks(y1Ticks).tickValues(y1TickValues).tickFormat(y1Format);

			// Grid settings
			if (xGrid) xAxis.tickPadding(8).tickSizeInner(-yScale.range()[0]);
			if (yGrid) yAxis.tickPadding(8).tickSizeInner(-xScale.range()[1]);
			if (y1Grid) y1Axis.tickPadding(8).tickSizeInner(-xScale.range()[1]);

			// UPDATE
			var xaxis = d3.select(this).selectAll("g.axis.x").data([1]),
			    yaxis = d3.select(this).selectAll("g.axis.y").data([1]),
			    y1axis = d3.select(this).selectAll("g.axis.y1").data([1]);

			// ENTER	
			var xAxisEnter = xaxis.enter().append("g").attr("class", "axis x");

			xAxisEnter.append("text").attr("class", "label").attr("transform", "translate(" + xScale.range()[1] + ",0)").attr("dy", "-0.5em").style("text-anchor", "end").text(typeof xLabel === "function" ? xLabel(data) : xLabel);

			xAxisEnter.merge(xaxis) // ENTER + UPDATE
			.attr("transform", "translate(0," + yScale.range()[0] + ")").style("display", xHide ? "none" : undefined).call(xAxis);

			if (d3.min(xScale.domain()) < 0) {
				xAxisEnter.append("path").attr("class", "zero").attr("stroke", "#ccc");

				xAxisEnter.merge(xaxis).select(".zero").attr("d", d3.line()([[xScale(0), -yScale.range()[0]], [xScale(0), 0]]));
			}

			if (xTickRotate) {
				xAxisEnter.merge(xaxis).selectAll(".tick text").style("text-anchor", "end").attr("dx", 0.012 * xTickRotate + "em").attr("dy", 0.006 * xTickRotate + "em").attr("transform", "rotate(" + xTickRotate + ")");
			}

			if (xGrid) {
				xAxisEnter.merge(xaxis).selectAll(".tick line").style("opacity", xGrid.opacity || 0.8).style("stroke", xGrid.stroke || "#ccc").style("stroke-dasharray", xGrid.strokeDashArray || "2,2");
			}

			var yAxisEnter = yaxis.enter().append("g").attr("class", "axis y").attr("transform", "translate(" + xScale.range()[0] + ",0)");

			yAxisEnter.append("text").attr("class", "label").attr("dx", "-6").attr("dy", "-0.54em").style("text-anchor", "start").text(typeof yLabel === "function" ? yLabel(data) : yLabel);

			yAxisEnter.merge(yaxis) // ENTER + UPDATE
			.style("display", yHide ? "none" : undefined).call(yAxis);

			if (d3.min(yScale.domain()) < 0) {
				yAxisEnter.append("path").attr("class", "zero").attr("stroke", "#ccc");

				yAxisEnter.merge(yaxis).select(".zero").attr("d", d3.line()([[xScale.range()[0], yScale(0)], [xScale.range()[1], yScale(0)]]));
			}

			if (yTickRotate) {
				yAxisEnter.merge(yaxis).selectAll(".tick text").style("text-anchor", "end").attr("dx", 0.006 * yTickRotate + 0.1 + "em").attr("dy", 0.012 * yTickRotate + "em").attr("transform", "rotate(" + yTickRotate + ")");
			}

			if (yGrid) {
				yAxisEnter.merge(yaxis).selectAll(".tick line").style("opacity", yGrid.opacity || 0.8).style("stroke", yGrid.stroke || "#ccc").style("stroke-dasharray", yGrid.strokeDashArray || "2,2");
			}

			if (y1Scale) {
				var y1AxisEnter = y1axis.enter().append("g").attr("class", "axis y1").attr("transform", "translate(" + xScale.range()[1] + ",0)");

				y1AxisEnter.append("text").attr("class", "label").attr("dx", "6").attr("dy", "-0.54em").style("text-anchor", "end").text(typeof y1Label === "function" ? y1Label(data) : y1Label);

				y1AxisEnter.merge(y1axis) // ENTER + UPDATE
				.style("display", y1Hide ? "none" : undefined).call(y1Axis);

				if (y1TickRotate) {
					y1AxisEnter.merge(y1axis).selectAll(".tick text").style("text-anchor", "start").attr("dx", 0.006 * y1TickRotate + 0.1 + "em").attr("dy", 0.012 * y1TickRotate + "em").attr("transform", "rotate(" + y1TickRotate + ")");
				}

				if (y1Grid) {
					y1AxisEnter.merge(y1axis).selectAll(".tick line").style("opacity", y1Grid.opacity || 0.8).style("stroke", y1Grid.stroke || "#ccc").style("stroke-dasharray", y1Grid.strokeDashArray || "2,2");
				}
			}
		});
	}

	template.layer = function (_) {
		return arguments.length ? (layer = _, template) : layer || {};
	};

	template.classed = function (_) {
		return arguments.length ? (classed = _, template) : classed;
	};

	template.orient = function (_) {
		return arguments.length ? (orient = _, template) : orient;
	};

	template.zIndex = function (_) {
		return arguments.length ? (zIndex = _, template) : +zIndex;
	};

	template.hide = function (_) {
		return arguments.length ? (hide = _, template) : hide;
	};

	template.key = function (_) {
		return arguments.length ? (key = _, template) : key;
	};

	template.x = function (_) {
		return arguments.length ? (x = _, template) : x;
	};

	template.y = function (_) {
		return arguments.length ? (y = _, template) : y;
	};

	template.y1 = function (_) {
		return arguments.length ? (y1 = _, template) : y1;
	};

	template.xScale = function (_) {
		return arguments.length ? (xScale = _, template) : xScale;
	};

	template.yScale = function (_) {
		return arguments.length ? (yScale = _, template) : yScale;
	};

	template.y1Scale = function (_) {
		return arguments.length ? (y1Scale = _, template) : y1Scale;
	};

	template.xLabel = function (_) {
		return arguments.length ? (xLabel = _, template) : xLabel;
	};

	template.yLabel = function (_) {
		return arguments.length ? (yLabel = _, template) : yLabel;
	};

	template.y1Label = function (_) {
		return arguments.length ? (y1Label = _, template) : y1Label;
	};

	template.xTicks = function (_) {
		return arguments.length ? (xTicks = _, template) : xTicks;
	};

	template.yTicks = function (_) {
		return arguments.length ? (yTicks = _, template) : yTicks;
	};

	template.y1Ticks = function (_) {
		return arguments.length ? (y1Ticks = _, template) : y1Ticks;
	};

	template.xTickValues = function (_) {
		return arguments.length ? (xTickValues = _, template) : xTickValues;
	};

	template.yTickValues = function (_) {
		return arguments.length ? (yTickValues = _, template) : yTickValues;
	};

	template.y1TickValues = function (_) {
		return arguments.length ? (y1TickValues = _, template) : y1TickValues;
	};

	template.xFormat = function (_) {
		return arguments.length ? (xFormat = _, template) : xFormat;
	};

	template.yFormat = function (_) {
		return arguments.length ? (yFormat = _, template) : yFormat;
	};

	template.y1Format = function (_) {
		return arguments.length ? (y1Format = _, template) : y1Format;
	};

	template.xTickRotate = function (_) {
		return arguments.length ? (xTickRotate = _, template) : xTickRotate;
	};

	template.yTickRotate = function (_) {
		return arguments.length ? (yTickRotate = _, template) : yTickRotate;
	};

	template.y1TickRotate = function (_) {
		return arguments.length ? (y1TickRotate = _, template) : y1TickRotate;
	};

	template.xGrid = function (_) {
		return arguments.length ? (xGrid = _, template) : xGrid;
	};

	template.yGrid = function (_) {
		return arguments.length ? (yGrid = _, template) : yGrid;
	};

	template.y1Grid = function (_) {
		return arguments.length ? (y1Grid = _, template) : y1Grid;
	};

	template.xHide = function (_) {
		return arguments.length ? (xHide = _, template) : xHide;
	};

	template.yHide = function (_) {
		return arguments.length ? (yHide = _, template) : yHide;
	};

	template.y1Hide = function (_) {
		return arguments.length ? (y1Hide = _, template) : y1Hide;
	};

	template.transition = function (_) {
		return arguments.length ? (transition$$1 = _, template) : transition$$1;
	};

	template.enterTransition = function (_) {
		return arguments.length ? (enterTransition = _, template) : enterTransition;
	};

	template.exitTransition = function (_) {
		return arguments.length ? (exitTransition = _, template) : exitTransition;
	};

	template.callback = function (_) {
		return arguments.length ? (callback = _, template) : callback;
	};

	template.enterCallback = function (_) {
		return arguments.length ? (enterCallback = _, template) : enterCallback;
	};

	template.exitCallback = function (_) {
		return arguments.length ? (exitCallback = _, template) : exitCallback;
	};

	return template;
}

function background() {

	var layer, classed, width, height, fill, opacity, transition$$1, callback;

	function template(selection) {

		// DEFAULTS
		classed = classed || "background";

		transition$$1 = transition$$1 || function (t) {
			return t.duration(0);
		};
		callback = callback || function () {
			return undefined;
		};

		selection.each(function () {

			var backgroundEnter = d3.select(this).selectAll("." + classed.replace(" ", ".")).data([1]).enter();

			backgroundEnter.append("rect").attr("class", classed + " enter").attr("x", width / 2).attr("y", height / 2).attr("width", 0).attr("height", 0).attr("fill", fill).style("opacity", opacity).transition().call(transition$$1).attr("x", 0).attr("y", 0).attr("width", width).attr("height", height).on("end", function () {
				d3.select(this).call(callback);
			});
		});
	}

	template.layer = function (_) {
		return arguments.length ? (layer = _, template) : layer || {};
	};

	template.classed = function (_) {
		return arguments.length ? (classed = _, template) : classed;
	};

	template.width = function (_) {
		return arguments.length ? (width = _, template) : width;
	};

	template.height = function (_) {
		return arguments.length ? (height = _, template) : height;
	};

	template.fill = function (_) {
		return arguments.length ? (fill = _, template) : fill;
	};

	template.opacity = function (_) {
		return arguments.length ? (opacity = _, template) : opacity;
	};

	template.transition = function (_) {
		return arguments.length ? (transition$$1 = _, template) : transition$$1;
	};

	template.callback = function (_) {
		return arguments.length ? (callback = _, template) : callback;
	};

	return template;
}

function bar() {

	var layer, classed, orient, key, x, y, color, xScale, yScale, colorScale, transition$$1, enterTransition, exitTransition, callback, enterCallback, exitCallback, mouseOverCallback, mouseLeaveCallback, touchStartCallback, touchEndCallback;

	function template(selection) {

		// DEFAULTS		
		transition$$1 = transition$$1 || function (t) {
			return t.duration(0);
		};
		enterTransition = enterTransition || function (t) {
			return t.duration(0);
		};
		exitTransition = exitTransition || function (t) {
			return t.duration(0);
		};

		callback = callback || function () {
			return undefined;
		};
		enterCallback = enterCallback || function () {
			return undefined;
		};
		exitCallback = exitCallback || function () {
			return undefined;
		};

		mouseOverCallback = mouseOverCallback || function () {
			return undefined;
		};
		mouseLeaveCallback = mouseLeaveCallback || function () {
			return undefined;
		};

		touchStartCallback = touchStartCallback || function () {
			return undefined;
		};
		touchEndCallback = touchEndCallback || function () {
			return undefined;
		};

		classed = classed || "bar";

		selection.each(function (data) {

			// UPDATE		
			var bar = d3.select(this).selectAll("." + classed.replace(" ", ".")).data(data, function (d) {
				return key(d);
			}).attr("class", classed + " update");

			// ENTER	
			bar.enter().append("rect").attr("class", classed + " enter").attr("x", function (d) {
				return xScale(x(d));
			}).attr("y", function () {
				return yScale(0);
			}).attr("width", function () {
				return xScale.bandwidth();
			}).attr("height", 0).on("mouseover", mouseOverCallback).on("mouseleave", mouseLeaveCallback).on("touchstart", touchStartCallback).on("touchend", touchEndCallback).call(enterCallback).merge(bar) // ENTER + UPDATE
			.attr("x", function (d) {
				return xScale(x(d));
			}).attr("width", function () {
				return xScale.bandwidth();
			}).transition().call(transition$$1).style("fill", function (d) {
				return colorScale(color(d));
			}).attr("y", function (d) {
				return y(d) > 0 ? yScale(y(d)) : yScale(0);
			}).attr("height", function (d) {
				return Math.abs(yScale(0) - yScale(y(d)));
			}).on("end", function () {
				d3.select(this).call(callback);
			});

			// EXIT
			bar.exit().attr("class", classed + " exit").transition().call(exitTransition).attr("width", 0).on("end", function () {
				d3.select(this).call(exitCallback);
			}).remove();
		});
	}

	template.layer = function (_) {
		return arguments.length ? (layer = _, template) : layer || {};
	};

	template.classed = function (_) {
		return arguments.length ? (classed = _, template) : classed;
	};

	template.orient = function (_) {
		return arguments.length ? (orient = _, template) : orient;
	};

	template.key = function (_) {
		return arguments.length ? (key = _, template) : key;
	};

	template.x = function (_) {
		return arguments.length ? (x = _, template) : x;
	};

	template.y = function (_) {
		return arguments.length ? (y = _, template) : y;
	};

	template.color = function (_) {
		return arguments.length ? (color = _, template) : color;
	};

	template.xScale = function (_) {
		return arguments.length ? (xScale = _, template) : xScale;
	};

	template.yScale = function (_) {
		return arguments.length ? (yScale = _, template) : yScale;
	};

	template.colorScale = function (_) {
		return arguments.length ? (colorScale = _, template) : colorScale;
	};

	template.transition = function (_) {
		return arguments.length ? (transition$$1 = _, template) : transition$$1;
	};

	template.enterTransition = function (_) {
		return arguments.length ? (enterTransition = _, template) : enterTransition;
	};

	template.exitTransition = function (_) {
		return arguments.length ? (exitTransition = _, template) : exitTransition;
	};

	template.callback = function (_) {
		return arguments.length ? (callback = _, template) : callback;
	};

	template.enterCallback = function (_) {
		return arguments.length ? (enterCallback = _, template) : enterCallback;
	};

	template.exitCallback = function (_) {
		return arguments.length ? (exitCallback = _, template) : exitCallback;
	};

	template.mouseOverCallback = function (_) {
		return arguments.length ? (mouseOverCallback = _, template) : mouseOverCallback;
	};

	template.mouseLeaveCallback = function (_) {
		return arguments.length ? (mouseLeaveCallback = _, template) : mouseLeaveCallback;
	};

	template.touchStartCallback = function (_) {
		return arguments.length ? (touchStartCallback = _, template) : touchStartCallback;
	};

	template.touchEndCallback = function (_) {
		return arguments.length ? (touchEndCallback = _, template) : touchEndCallback;
	};

	return template;
}

function bubble() {

	var layer, classed, width, height, margin, x, y, color, colorScale, yLabel, sort, stroke, transition$$1, enterTransition, exitTransition, callback, enterCallback, exitCallback, mouseOverCallback, mouseLeaveCallback, touchStartCallback, touchEndCallback, _pack, _bubble;

	function template(selection) {

		// DEFAULTS		
		transition$$1 = transition$$1 || function (t) {
			return t.duration(0);
		};
		enterTransition = enterTransition || function (t) {
			return t.duration(0);
		};
		exitTransition = exitTransition || function (t) {
			return t.duration(0);
		};

		callback = callback || function () {
			return undefined;
		};
		enterCallback = enterCallback || function () {
			return undefined;
		};
		exitCallback = exitCallback || function () {
			return undefined;
		};

		mouseOverCallback = mouseOverCallback || function () {
			return undefined;
		};
		mouseLeaveCallback = mouseLeaveCallback || function () {
			return undefined;
		};

		touchStartCallback = touchStartCallback || function () {
			return undefined;
		};
		touchEndCallback = touchEndCallback || function () {
			return undefined;
		};

		classed = classed || "bubble";

		stroke = stroke || {};

		_pack = _pack || { padding: 1.5 };
		_bubble = _bubble || {};

		var w = template.contentWidth(),
		    h = template.contentHeight(),
		    diameter = Math.min(w, h);

		var bubble = d3.pack().size([diameter, diameter]).padding(_pack.padding || 1.5);

		selection.each(function (data) {

			if (!data.name) {
				data = { name: "root", children: data };
			}

			var root = d3.hierarchy(classes(data)).sum(function (d) {
				return d.value;
			}).sort(function (a, b) {
				return sort ? sort(a.value, b.value) : true;
			});

			bubble(root);

			var node = d3.select(this);

			// Center bubbles
			var g = node.select("g");
			if (g.empty()) {
				g = node.append("g").attr("transform", "translate(" + (w / 2 - diameter / 2) + ",-" + (h / 2 - diameter / 2) + ")");
			}

			// Label
			if (g.select(".label").empty()) {
				g.append("text").attr("class", "label").attr("transform", "translate(" + diameter + "," + h + ")").style("text-anchor", "end").text(function () {
					return typeof yLabel === "function" ? yLabel(data.children) : yLabel;
				});
			}

			// UPDATE		
			var bubbles = g.selectAll("." + classed.replace(" ", ".")).data(root.children, function (d) {
				return d.data.packageName + "-" + d.data.className;
			}).attr("class", classed + " update");

			// ENTER	
			bubbles.enter().append("circle").attr("class", classed + " enter").attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")";
			}).attr("r", function () {
				return 0;
			}).style("fill", function (d) {
				return _bubble.noFill ? "transparent" : colorScale(color(d.data.data));
			}).style("stroke", function (d) {
				return colorScale(color(d.data.data));
			}).style("stroke-width", stroke.width).style("stroke-dasharray", stroke.dashArray).on("mouseover", mouseOverCallback).on("mouseleave", mouseLeaveCallback).on("touchstart", touchStartCallback).on("touchend", touchEndCallback).call(enterCallback).merge(bubbles) // ENTER + UPDATE
			.transition().call(transition$$1).attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")";
			}).attr("r", function (d) {
				return d.r;
			}).style("fill", function (d) {
				return _bubble.noFill ? "transparent" : colorScale(color(d.data.data));
			}).style("stroke", function (d) {
				return colorScale(color(d.data.data));
			}).style("stroke-width", stroke.width).style("stroke-dasharray", stroke.dashArray).on("end", function () {
				d3.select(this).call(callback);
			});

			// EXIT
			bubbles.exit().attr("class", classed + " exit").transition().call(exitTransition).attr("r", 0).on("end", function () {
				d3.select(this).call(exitCallback);
			}).remove();

			// Returns a flattened hierarchy containing all leaf nodes under the root.
			function classes(root) {
				var classes = [];

				function recurse(name, node) {
					if (node.children) {
						node.children.forEach(function (child) {
							recurse(node.name, child);
						});
					} else classes.push({ packageName: name, className: x(node), value: y(node), data: node });
				}

				recurse(null, root);
				return { children: classes };
			}
		});
	}

	template.layer = function (_) {
		return arguments.length ? (layer = _, template) : layer || {};
	};

	template.classed = function (_) {
		return arguments.length ? (classed = _, template) : classed;
	};

	template.width = function (_) {
		return arguments.length ? (width = _, template) : width;
	};

	template.height = function (_) {
		return arguments.length ? (height = _, template) : height;
	};

	template.margin = function (_) {
		return arguments.length ? (margin = _, template) : margin;
	};

	template.contentWidth = function () {
		return width - margin.right - margin.left;
	};

	template.contentHeight = function () {
		return height - margin.top - margin.bottom;
	};

	template.x = function (_) {
		return arguments.length ? (x = _, template) : x;
	};

	template.y = function (_) {
		return arguments.length ? (y = _, template) : y;
	};

	template.color = function (_) {
		return arguments.length ? (color = _, template) : color;
	};

	template.colorScale = function (_) {
		return arguments.length ? (colorScale = _, template) : colorScale;
	};

	template.yLabel = function (_) {
		return arguments.length ? (yLabel = _, template) : yLabel;
	};

	template.sort = function (_) {
		return arguments.length ? (sort = _, template) : sort;
	};

	template.stroke = function (_) {
		return arguments.length ? (stroke = _, template) : stroke;
	};

	template.transition = function (_) {
		return arguments.length ? (transition$$1 = _, template) : transition$$1;
	};

	template.enterTransition = function (_) {
		return arguments.length ? (enterTransition = _, template) : enterTransition;
	};

	template.exitTransition = function (_) {
		return arguments.length ? (exitTransition = _, template) : exitTransition;
	};

	template.callback = function (_) {
		return arguments.length ? (callback = _, template) : callback;
	};

	template.enterCallback = function (_) {
		return arguments.length ? (enterCallback = _, template) : enterCallback;
	};

	template.exitCallback = function (_) {
		return arguments.length ? (exitCallback = _, template) : exitCallback;
	};

	template.mouseOverCallback = function (_) {
		return arguments.length ? (mouseOverCallback = _, template) : mouseOverCallback;
	};

	template.mouseLeaveCallback = function (_) {
		return arguments.length ? (mouseLeaveCallback = _, template) : mouseLeaveCallback;
	};

	template.touchStartCallback = function (_) {
		return arguments.length ? (touchStartCallback = _, template) : touchStartCallback;
	};

	template.touchEndCallback = function (_) {
		return arguments.length ? (touchEndCallback = _, template) : touchEndCallback;
	};

	template.pack = function (_) {
		return arguments.length ? (_pack = _, template) : _pack;
	};

	template.bubble = function (_) {
		return arguments.length ? (_bubble = _, template) : _bubble;
	};

	return template;
}

function dot() {

	var layer, classed, orient, key, x, y, y1, color, xScale, yScale, y1Scale, colorScale, transition$$1, enterTransition, exitTransition, callback, enterCallback, exitCallback, mouseOverCallback, mouseLeaveCallback, touchStartCallback, touchEndCallback;

	function template(selection) {

		// DEFAULTS
		classed = classed || "dot";

		transition$$1 = transition$$1 || function (t) {
			return t.duration(0);
		};
		enterTransition = enterTransition || function (t) {
			return t.duration(0);
		};
		exitTransition = exitTransition || function (t) {
			return t.duration(0);
		};

		callback = callback || function () {
			return undefined;
		};
		enterCallback = enterCallback || function () {
			return undefined;
		};
		exitCallback = exitCallback || function () {
			return undefined;
		};

		mouseOverCallback = mouseOverCallback || function () {
			return undefined;
		};
		mouseLeaveCallback = mouseLeaveCallback || function () {
			return undefined;
		};

		touchStartCallback = touchStartCallback || function () {
			return undefined;
		};
		touchEndCallback = touchEndCallback || function () {
			return undefined;
		};

		// Adjust bandwidth if necessary
		function xScaleAdjusted(d) {
			return xScale(x(d)) + (xScale.bandwidth ? xScale.bandwidth() / 2 : 0);
		}

		function yScaleAdjusted(d) {
			return yScale(y(d)) + (yScale.bandwidth ? yScale.bandwidth() / 2 : 0);
		}

		selection.each(function (data) {

			// UPDATE		
			var dots = d3.select(this).selectAll("." + classed.replace(" ", ".")).data(data, function (d) {
				return key(d);
			}).attr("class", classed + " update");

			// ENTER	
			var dotsEnter = dots.enter().append("circle").attr("class", classed + " enter");

			dotsEnter.attr("cx", xScaleAdjusted).attr("cy", function () {
				return yScale(0);
			}).attr("r", function (d) {
				return y1Scale(y1(d));
			}).on("mouseover", mouseOverCallback).on("mouseleave", mouseLeaveCallback).on("touchstart", touchStartCallback).on("touchend", touchEndCallback).transition().call(enterTransition).on("end", function () {
				d3.select(this).call(enterCallback);
			});

			dotsEnter.merge(dots) // ENTER + UPDATE
			.transition().call(transition$$1).style("fill", function (d) {
				return colorScale(color(d));
			}).attr("cx", xScaleAdjusted).attr("cy", yScaleAdjusted).attr("r", function (d) {
				return y1Scale(y1(d));
			}).on("end", function () {
				return d3.select(this).call(callback);
			});

			// EXIT
			dots.exit().attr("class", classed + " exit").transition().call(exitTransition).attr("r", 0).on("end", function () {
				d3.select(this).call(exitCallback);
			}).remove();
		});
	}

	template.layer = function (_) {
		return arguments.length ? (layer = _, template) : layer || {};
	};

	template.classed = function (_) {
		return arguments.length ? (classed = _, template) : classed;
	};

	template.orient = function (_) {
		return arguments.length ? (orient = _, template) : orient;
	};

	template.key = function (_) {
		return arguments.length ? (key = _, template) : key;
	};

	template.x = function (_) {
		return arguments.length ? (x = _, template) : x;
	};

	template.y = function (_) {
		return arguments.length ? (y = _, template) : y;
	};

	template.y1 = function (_) {
		return arguments.length ? (y1 = _, template) : y1;
	};

	template.color = function (_) {
		return arguments.length ? (color = _, template) : color;
	};

	template.xScale = function (_) {
		return arguments.length ? (xScale = _, template) : xScale;
	};

	template.yScale = function (_) {
		return arguments.length ? (yScale = _, template) : yScale;
	};

	template.y1Scale = function (_) {
		return arguments.length ? (y1Scale = _, template) : y1Scale;
	};

	template.colorScale = function (_) {
		return arguments.length ? (colorScale = _, template) : colorScale;
	};

	template.transition = function (_) {
		return arguments.length ? (transition$$1 = _, template) : transition$$1;
	};

	template.enterTransition = function (_) {
		return arguments.length ? (enterTransition = _, template) : enterTransition;
	};

	template.exitTransition = function (_) {
		return arguments.length ? (exitTransition = _, template) : exitTransition;
	};

	template.callback = function (_) {
		return arguments.length ? (callback = _, template) : callback;
	};

	template.enterCallback = function (_) {
		return arguments.length ? (enterCallback = _, template) : enterCallback;
	};

	template.exitCallback = function (_) {
		return arguments.length ? (exitCallback = _, template) : exitCallback;
	};

	template.mouseOverCallback = function (_) {
		return arguments.length ? (mouseOverCallback = _, template) : mouseOverCallback;
	};

	template.mouseLeaveCallback = function (_) {
		return arguments.length ? (mouseLeaveCallback = _, template) : mouseLeaveCallback;
	};

	template.touchStartCallback = function (_) {
		return arguments.length ? (touchStartCallback = _, template) : touchStartCallback;
	};

	template.touchEndCallback = function (_) {
		return arguments.length ? (touchEndCallback = _, template) : touchEndCallback;
	};

	return template;
}

function image() {

	var layer, classed, url, width, height, preserveAspectRatio, transition$$1, callback;

	function template(selection) {

		// DEFAULTS
		classed = classed || "image";
		transition$$1 = transition$$1 || function (t) {
			return t.duration(0);
		};
		callback = callback || function () {
			return undefined;
		};

		selection.each(function () {

			var imageEnter = d3.select(this).selectAll("." + classed.replace(" ", ".")).data([1]).enter();

			imageEnter.append("image").attr("class", classed + " enter").attr("xlink:href", url).attr("x", width / 2).attr("y", height / 2).attr("width", 0).attr("height", 0).attr("preserveAspectRatio", preserveAspectRatio.align + " " + preserveAspectRatio.meetOrSlice).style("opacity", 0).transition().call(transition$$1).style("opacity", 1.0).attr("x", 0).attr("y", 0).attr("width", width).attr("height", width).on("end", function () {
				d3.select(this).call(callback);
			});
		});
	}

	template.layer = function (_) {
		return arguments.length ? (layer = _, template) : layer || {};
	};

	template.classed = function (_) {
		return arguments.length ? (classed = _, template) : classed;
	};

	template.url = function (_) {
		return arguments.length ? (url = _, template) : url;
	};

	template.width = function (_) {
		return arguments.length ? (width = _, template) : width;
	};

	template.height = function (_) {
		return arguments.length ? (height = _, template) : height;
	};

	template.preserveAspectRatio = function (_) {
		return arguments.length ? (preserveAspectRatio = _, template) : preserveAspectRatio;
	};

	template.transition = function (_) {
		return arguments.length ? (transition$$1 = _, template) : transition$$1;
	};

	template.callback = function (_) {
		return arguments.length ? (callback = _, template) : callback;
	};

	return template;
}

function label() {

	var layer, classed, orient, key, x, y, y1, color, text, xScale, yScale, y1Scale, colorScale, transition$$1, enterTransition, exitTransition, callback, enterCallback, exitCallback, textFormat, anchor, rotate, dx, dy;

	function template(selection) {

		// DEFAULTS
		classed = classed || "label";

		transition$$1 = transition$$1 || function (t) {
			return t.duration(0);
		};
		enterTransition = enterTransition || function (t) {
			return t.duration(0);
		};
		exitTransition = exitTransition || function (t) {
			return t.duration(0);
		};

		callback = callback || function () {
			return undefined;
		};
		enterCallback = enterCallback || function () {
			return undefined;
		};
		exitCallback = exitCallback || function () {
			return undefined;
		};

		textFormat = textFormat || function (d) {
			return d;
		};
		anchor = anchor || "middle";
		rotate = rotate || function () {
			return 0;
		};

		function xScaleBandwidth(d) {
			return xScale(x(d)) + (xScale.bandwidth ? xScale.bandwidth() / 2 : 0);
		}

		selection.each(function (data) {

			// UPDATE		
			var labels = d3.select(this).selectAll("." + classed.replace(" ", ".")).data(data, function (d) {
				return key(d);
			}).attr("class", classed + " update");

			// ENTER	
			var labelsEnter = labels.enter().append("text").attr("class", classed + " enter");

			labelsEnter.attr("x", xScaleBandwidth).attr("y", yScale(0)).style("text-anchor", anchor).style("dominant-baseline", "central").text(function (d) {
				return textFormat(text(d));
			}).transition().call(enterTransition)
			//.attr("y", function(d) { return yScale(y(d)); })
			.on("end", function () {
				d3.select(this).call(enterCallback);
			});

			labelsEnter.merge(labels) // ENTER + UPDATE
			.attr("dx", dx).attr("dy", dy).attr("transform", function (d, i) {
				return "rotate(" + (typeof rotate === "function" ? rotate(d, i) : rotate) + " " + xScaleBandwidth(d) + " " + yScale(y(d)) + ")";
			}).transition().call(transition$$1).style("fill", function (d) {
				return colorScale(color(d));
			}).style("font-size", function (d) {
				return y1 && y1Scale ? y1Scale(y1(d)) + "em" : undefined;
			}).style("text-anchor", anchor).attr("x", xScaleBandwidth).attr("y", function (d) {
				return yScale(y(d));
			}).text(function (d) {
				return textFormat(text(d));
			}).on("end", function () {
				d3.select(this).call(callback);
			});

			// EXIT
			labels.exit().attr("class", classed + " exit").transition().call(exitTransition)
			//.attr("r", 0)
			.on("end", function () {
				d3.select(this).call(exitCallback);
			}).remove();
		});
	}

	template.layer = function (_) {
		return arguments.length ? (layer = _, template) : layer || {};
	};

	template.classed = function (_) {
		return arguments.length ? (classed = _, template) : classed;
	};

	template.orient = function (_) {
		return arguments.length ? (orient = _, template) : orient;
	};

	template.key = function (_) {
		return arguments.length ? (key = _, template) : key;
	};

	template.x = function (_) {
		return arguments.length ? (x = _, template) : x;
	};

	template.y = function (_) {
		return arguments.length ? (y = _, template) : y;
	};

	template.y1 = function (_) {
		return arguments.length ? (y1 = _, template) : y1;
	};

	template.color = function (_) {
		return arguments.length ? (color = _, template) : color;
	};

	template.text = function (_) {
		return arguments.length ? (text = _, template) : text;
	};

	template.xScale = function (_) {
		return arguments.length ? (xScale = _, template) : xScale;
	};

	template.yScale = function (_) {
		return arguments.length ? (yScale = _, template) : yScale;
	};

	template.y1Scale = function (_) {
		return arguments.length ? (y1Scale = _, template) : y1Scale;
	};

	template.colorScale = function (_) {
		return arguments.length ? (colorScale = _, template) : colorScale;
	};

	template.transition = function (_) {
		return arguments.length ? (transition$$1 = _, template) : transition$$1;
	};

	template.enterTransition = function (_) {
		return arguments.length ? (enterTransition = _, template) : enterTransition;
	};

	template.exitTransition = function (_) {
		return arguments.length ? (exitTransition = _, template) : exitTransition;
	};

	template.callback = function (_) {
		return arguments.length ? (callback = _, template) : callback;
	};

	template.enterCallback = function (_) {
		return arguments.length ? (enterCallback = _, template) : enterCallback;
	};

	template.exitCallback = function (_) {
		return arguments.length ? (exitCallback = _, template) : exitCallback;
	};

	template.textFormat = function (_) {
		return arguments.length ? (textFormat = _, template) : textFormat;
	};

	template.anchor = function (_) {
		return arguments.length ? (anchor = _, template) : anchor;
	};

	template.rotate = function (_) {
		return arguments.length ? (rotate = _, template) : rotate;
	};

	template.dx = function (_) {
		return arguments.length ? (dx = _, template) : dx;
	};

	template.dy = function (_) {
		return arguments.length ? (dy = _, template) : dy;
	};

	return template;
}

function isIE() {
	return navigator.userAgent.indexOf("MSIE") > -1;
}

function svg() {

	var classed, width, height, viewbox, preserveAspectRatio, meetOrSlice, transition$$1, enterTransition, exitTransition, callback, enterCallback, exitCallback;

	function template(selection) {

		selection.each(function (data, index) {

			// DEFAULTS
			classed = classed || "svg";
			viewbox = viewbox || { "x": 0, "y": 0, "width": width, "height": height };

			callback = callback || function () {
				return undefined;
			};
			enterCallback = enterCallback || function () {
				return undefined;
			};
			exitCallback = exitCallback || function () {
				return undefined;
			};

			transition$$1 = transition$$1 || function (t) {
				return t.duration(0);
			};
			enterTransition = enterTransition || function (t) {
				return t.duration(0);
			};
			exitTransition = exitTransition || function (t) {
				return t.duration(0);
			};

			// Fix for older browsers
			if (document.width < width || document.height < height) {
				preserveAspectRatio = "xMinYMin";
			}

			var id = d3.select(this).attr("id");

			// UPDATE
			var svg = d3.select(this).selectAll("#" + id + "-svg-" + index).data(data).attr("class", classed + " update");

			// ENTER									
			svg.enter().append("svg").attr("id", id + "-svg-" + index).attr("class", classed + " enter").attr("width", width).attr("height", height).attr("viewBox", viewbox.x + " " + viewbox.y + " " + viewbox.width + " " + viewbox.height).attr("preserveAspectRatio", isIE() ? "none" : preserveAspectRatio || "xMidYMid").attr("meetOrSlice", meetOrSlice || "meet").attr("version", isIE() ? "1.1" : undefined).attr("xmlns", isIE() ? "http://www.w3.org/2000/svg" : undefined).call(enterCallback).merge(svg) // ENTER + UPDATE
			.call(callback);

			// EXIT
			svg.exit().attr("class", classed + " exit").call(exitCallback).remove();
		});
	}

	template.classed = function (_) {
		return arguments.length ? (classed = _, template) : classed;
	};

	template.width = function (_) {
		return arguments.length ? (width = _, template) : width;
	};

	template.height = function (_) {
		return arguments.length ? (height = _, template) : height;
	};

	template.viewbox = function (_) {
		return arguments.length ? (viewbox = _, template) : viewbox;
	};

	template.preserveAspectRatio = function (_) {
		return arguments.length ? (preserveAspectRatio = _, template) : preserveAspectRatio;
	};

	template.meetOrSlice = function (_) {
		return arguments.length ? (meetOrSlice = _, template) : meetOrSlice;
	};

	template.transition = function (_) {
		return arguments.length ? (transition$$1 = _, template) : transition$$1;
	};

	template.enterTransition = function (_) {
		return arguments.length ? (enterTransition = _, template) : enterTransition;
	};

	template.exitTransition = function (_) {
		return arguments.length ? (exitTransition = _, template) : exitTransition;
	};

	template.callback = function (_) {
		return arguments.length ? (callback = _, template) : callback;
	};

	template.enterCallback = function (_) {
		return arguments.length ? (enterCallback = _, template) : enterCallback;
	};

	template.exitCallback = function (_) {
		return arguments.length ? (exitCallback = _, template) : exitCallback;
	};

	return template;
}

function layers() {

	var classed, width, height, inheritSize, margin, key, x, y, y1, color, text, xScale, yScale, y1Scale, colorScale, xLabel, yLabel, y1Label, xFormat, yFormat, y1Format, textFormat, transition$$1, enterTransition, exitTransition, layer0, layer1, layer2, layer3, layer4, layer5, layer6, layer7, callback, enterCallback, exitCallback;

	function template(selection) {

		// DEFAULTS		
		classed = classed || "layers";

		transition$$1 = transition$$1 || function (t) {
			return t.duration(0);
		};
		enterTransition = enterTransition || function (t) {
			return t.duration(0);
		};
		exitTransition = exitTransition || function (t) {
			return t.duration(0);
		};

		callback = callback || function () {
			return undefined;
		};
		enterCallback = enterCallback || function () {
			return undefined;
		};
		exitCallback = exitCallback || function () {
			return undefined;
		};

		selection.each(function (data) {

			// Adapt to parent's clientWidth
			if (inheritSize === "clientWidth") {
				var ratio = width / height;

				width = this.clientWidth;
				height = width / ratio;
			}

			// Init scales
			if (xScale) xScale.range([0, template.contentWidth()]);
			if (yScale) yScale.range([template.contentHeight(), 0]);
			//if(y1Scale) y1Scale.range([template.contentHeight(), 0]);

			[[xScale, x], [yScale, y], [y1Scale, y1], [colorScale, color]].forEach(function (c) {
				if (c[0]) {
					if (c[0]["_domain"]) {
						c[0].domain(c[0]["_domain"].call(this, data, c[1]));
					}

					if (c[0]["_range"]) {
						c[0].range(c[0]["_range"].call(this, data, c[0].domain()));
					}
				}
			});

			// Init layers
			var layers = [layer0, layer1, layer2, layer3, layer4, layer5, layer6, layer7].filter(function (layer) {
				return layer !== undefined && !layer.layer().hide;
			}).sort(function (a, b) {
				return (a.layer().zIndex || 0) - (b.layer().zIndex || 0);
			}).map(function (layer) {
				if (layer.width && !layer.width()) layer.width(template.contentWidth());
				if (layer.height && !layer.height()) layer.height(template.contentHeight());
				if (layer.margin && !layer.margin()) layer.margin({ top: 0, right: 0, bottom: 0, left: 0 });

				[["key", key], ["x", x], ["y", y], ["y1", y1], ["color", color], ["text", text], ["xLabel", xLabel], ["yLabel", yLabel], ["y1Label", y1Label], ["xFormat", xFormat], ["yFormat", yFormat], ["y1Format", y1Format], ["textFormat", textFormat], ["transition", transition$$1], ["enterTransition", enterTransition], ["exitTransition", exitTransition]].forEach(function (c) {
					if (layer[c[0]] && !layer[c[0]]()) layer[c[0]](c[1]);
				});

				// Init scales
				if (layer.xScale) {
					if (!layer.xScale()) {
						layer.xScale(xScale);
					} else {
						if (layer.xScale()["_domain"]) {
							layer.xScale().domain(layer.xScale()["_domain"].call(this, data, layer.x()));
						}
						layer.xScale().range([0, template.contentWidth()]);
					}
				}

				if (layer.yScale) {
					if (!layer.yScale()) {
						layer.yScale(yScale);
					} else {
						if (layer.yScale()["_domain"]) {
							layer.yScale().domain(layer.yScale()["_domain"].call(this, data, layer.y()));
						}
						layer.yScale().range([template.contentHeight(), 0]);
					}
				}

				if (layer.y1Scale) {
					if (!layer.y1Scale()) {
						layer.y1Scale(y1Scale);
					} else {
						if (layer.y1Scale()["_domain"]) {
							layer.y1Scale().domain(layer.y1Scale()["_domain"].call(this, data, layer.y1()));
						}

						if (layer.y1Scale()["_range"]) {
							layer.y1Scale().range(layer.y1Scale()["_range"].call(this, data, layer.y1Scale().domain()));
						}
					}
				}

				if (layer.colorScale) {
					if (!layer.colorScale()) {
						layer.colorScale(colorScale);
					} else {
						if (layer.colorScale()["_domain"]) {
							layer.colorScale().domain(layer.colorScale()["_domain"].call(this, data, layer.color()));
						}

						if (layer.colorScale()["_range"]) {
							layer.colorScale().range(layer.colorScale()["_range"].call(this, data, layer.colorScale().domain()));
						}
					}
				}

				return layer;
			});

			// Create each layer in a separate svg g.
			function createLayer(node, templates) {

				var layers = node.selectAll(".layer"); // UPDATE

				// ENTER
				layers.data(templates.map(function (d, i) {
					return i;
				})).enter().append("g").attr("class", function (d) {
					return "layer i" + d;
				}).attr("transform", function (d) {
					var value = "",
					    transform = templates[d].layer().transform;

					if (transform) {
						if (transform.translate && (transform.translate.x || transform.translate.y)) {
							value += " translate(" + (transform.translate.x || 0) + ", " + (transform.translate.y || 0) + ")";
						}

						if (transform.scale && (transform.scale.x || transform.scale.y)) {
							value += " scale(" + (transform.scale.x || 1) + ", " + (transform.scale.y || 1) + ")";
						}

						if (transform.rotate && transform.rotate.a) {
							value += " rotate(" + (transform.rotate.a || 0) + ", " + (transform.rotate.x || 0) + ", " + (transform.rotate.y || 0) + ")";
						}
					}

					return value !== "" ? value.trim() : undefined;
				});

				node.selectAll(".layer").each(function (template, index) {
					d3.select(this).datum(data).call(templates[index]);
				});

				// EXIT
				layers.exit().remove();
			}

			// Add message section
			d3.select(this).selectAll(".message").data([1]).enter().append("p").attr("class", "message").html("&zwnj;");

			var tSVG = svg().classed(classed).width(inheritSize === "clientWidth" ? undefined : width).height(inheritSize === "clientWidth" ? undefined : height).viewbox({ "x": 0, "y": 0, "width": width, "height": height });

			var svg$$1 = d3.select(this).datum([1]).call(tSVG).select("svg"),
			    main = svg$$1.selectAll(".main").data([1]);

			main.enter().append("g").attr("class", "main").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			createLayer(d3.select(this).selectAll(".main"), layers);
		});
	}

	template.classed = function (_) {
		return arguments.length ? (classed = _, template) : classed;
	};

	template.width = function (_) {
		return arguments.length ? (width = _, template) : width;
	};

	template.height = function (_) {
		return arguments.length ? (height = _, template) : height;
	};

	template.inheritSize = function (_) {
		return arguments.length ? (inheritSize = _, template) : inheritSize;
	};

	template.margin = function (_) {
		return arguments.length ? (margin = _, template) : margin;
	};

	template.marginTop = function (_) {
		return arguments.length ? (margin.top = _, template) : margin.top;
	};

	template.marginRight = function (_) {
		return arguments.length ? (margin.right = _, template) : margin.right;
	};

	template.marginBottom = function (_) {
		return arguments.length ? (margin.bottom = _, template) : margin.bottom;
	};

	template.marginLeft = function (_) {
		return arguments.length ? (margin.Left = _, template) : margin.Left;
	};

	template.contentWidth = function () {
		return width - margin.right - margin.left;
	};

	template.contentHeight = function () {
		return height - margin.top - margin.bottom;
	};

	template.key = function (_) {
		return arguments.length ? (key = _, template) : key;
	};

	template.x = function (_) {
		return arguments.length ? (x = _, template) : x;
	};

	template.y = function (_) {
		return arguments.length ? (y = _, template) : y;
	};

	template.y1 = function (_) {
		return arguments.length ? (y1 = _, template) : y1;
	};

	template.color = function (_) {
		return arguments.length ? (color = _, template) : color;
	};

	template.text = function (_) {
		return arguments.length ? (text = _, template) : text;
	};

	template.xScale = function (_) {
		return arguments.length ? (xScale = _, template) : xScale;
	};

	template.yScale = function (_) {
		return arguments.length ? (yScale = _, template) : yScale;
	};

	template.y1Scale = function (_) {
		return arguments.length ? (y1Scale = _, template) : y1Scale;
	};

	template.colorScale = function (_) {
		return arguments.length ? (colorScale = _, template) : colorScale;
	};

	template.xLabel = function (_) {
		return arguments.length ? (xLabel = _, template) : xLabel;
	};

	template.yLabel = function (_) {
		return arguments.length ? (yLabel = _, template) : yLabel;
	};

	template.y1Label = function (_) {
		return arguments.length ? (y1Label = _, template) : y1Label;
	};

	template.xFormat = function (_) {
		return arguments.length ? (xFormat = _, template) : xFormat;
	};

	template.yFormat = function (_) {
		return arguments.length ? (yFormat = _, template) : yFormat;
	};

	template.y1Format = function (_) {
		return arguments.length ? (y1Format = _, template) : y1Format;
	};

	template.textFormat = function (_) {
		return arguments.length ? (textFormat = _, template) : textFormat;
	};

	template.transition = function (_) {
		return arguments.length ? (transition$$1 = _, template) : transition$$1;
	};

	template.enterTransition = function (_) {
		return arguments.length ? (enterTransition = _, template) : enterTransition;
	};

	template.exitTransition = function (_) {
		return arguments.length ? (exitTransition = _, template) : exitTransition;
	};

	template.callback = function (_) {
		return arguments.length ? (callback = _, template) : callback;
	};

	template.enterCallback = function (_) {
		return arguments.length ? (enterCallback = _, template) : enterCallback;
	};

	template.exitCallback = function (_) {
		return arguments.length ? (exitCallback = _, template) : exitCallback;
	};

	template.layer0 = function (_) {
		return arguments.length ? (layer0 = _, template) : layer0;
	};

	template.layer1 = function (_) {
		return arguments.length ? (layer1 = _, template) : layer1;
	};

	template.layer2 = function (_) {
		return arguments.length ? (layer2 = _, template) : layer2;
	};

	template.layer3 = function (_) {
		return arguments.length ? (layer3 = _, template) : layer3;
	};

	template.layer4 = function (_) {
		return arguments.length ? (layer4 = _, template) : layer4;
	};

	template.layer5 = function (_) {
		return arguments.length ? (layer5 = _, template) : layer5;
	};

	template.layer6 = function (_) {
		return arguments.length ? (layer6 = _, template) : layer6;
	};

	template.layer7 = function (_) {
		return arguments.length ? (layer7 = _, template) : layer7;
	};

	return template;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

function extend(target, source) {

	if (target === undefined) {
		return source;
	}

	for (var p in source) {
		if (source.hasOwnProperty(p)) {
			if (_typeof(source[p]) == "object") {
				target[p] = extend(target[p], source[p]);
			} else {
				target[p] = source[p];
			}
		}
	}
	return target;
}

function diff(prev, now) {
	var changes = {};

	for (var p in now) {
		if (!prev || prev[p] !== now[p]) {
			if (_typeof(now[p]) == "object" /* && !Array.isArray(now[p]) */) {
					prev = prev || {};
					var c = diff(prev[p], now[p]);
					if (!isEmpty(c)) changes[p] = c;
				} else {
				changes[p] = now[p];
			}
		}
	}
	return changes;
}

/* See: http://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects */
function flatten(object, separator) {
	separator = separator || "_";
	var result = {};

	function recurse(current, property) {
		if (Object(current) !== current) {
			result[property] = current;
		} else if (Array.isArray(current)) {
			for (var i = 0, l = current.length; i < l; i++) {
				recurse(current[i], property + "[" + i + "]");
			}if (l === 0) result[property] = [];
		} else {
			var isEmpty = true;
			for (var p in current) {
				isEmpty = false;
				recurse(current[p], property ? property + separator + p : p);
			}
			if (isEmpty && property) result[property] = {};
		}
	}
	recurse(object, "");
	return result;
}

/* See: http://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects */
function unflatten(object, separator) {
	separator = separator || "_";

	if (Object(object) !== object || Array.isArray(object)) return object;

	var regex = new RegExp("\\.?([^" + separator + "\\[\\]]+)|\\[(\\d+)\\]", "g"),
	    result = {};

	for (var p in object) {
		var current = result,
		    property = "",
		    m = regex.exec(p);
		while (m) {
			current = current[property] || (current[property] = m[2] ? [] : {});
			property = m[2] || m[1];
			m = regex.exec(p);
		}
		current[property] = object[p];
	}
	return result[""] || result;
}

function isEmpty(o) {
	return (typeof o === "undefined" ? "undefined" : _typeof(o)) === "object" && (o === null || Object.keys(o).length === 0);
}

function deepValue(object, path) {
	var paths = path.split("."),
	    current = object;

	for (var i = 0; i < paths.length; ++i) {
		if (current[paths[i]] == undefined) {
			return undefined;
		} else {
			current = current[paths[i]];
		}
	}
	return current;
}

// See: http://stackoverflow.com/questions/14234560/javascript-how-to-get-parent-element-by-selector
function findParentBySelector(element, selector) {

	function collectionHas(a, b) {
		//helper function (see below)
		for (var i = 0, len = a.length; i < len; i++) {
			if (a[i] == b) return true;
		}
		return false;
	}

	var docElem = element;

	// Find enclosing document or document fragment
	while (docElem && docElem.nodeType !== 9 && docElem.nodeType !== 11) {
		docElem = docElem.parentNode;
	}

	if (docElem) {
		var all = docElem.querySelectorAll(selector),
		    current = element.parentNode;

		while (current && !collectionHas(all, current)) {
			// keep going up until you find a match
			current = current.parentNode;
		}
		return current; // will return null if not found
	}
	return null;
}

/* See: https://gist.github.com/jasonrhodes/2321581 */

var instance = null;
var _ready = false;
var _registry = {};

function tagFactory() {

	if (instance) return instance;

	instance = {

		ready: function ready(_) {
			return arguments.length ? (_ready = _, this) : _ready;
		},

		registry: function registry(_) {
			return arguments.length ? (_registry = _, this) : _registry;
		},

		init: function init(o) {

			var self = this;

			if (o.setups && o.setups.length > 0) {
				for (var i in o.setups) {
					var setup = o.setups[i];

					if ((typeof setup === "undefined" ? "undefined" : _typeof(setup)) === "object") {
						this.addAll(setup);
					} else {
						// See: https://stackoverflow.com/questions/3277182/how-to-get-the-global-object-in-javascript/3277192#3277192
						this.addAll(deepValue(Function("return this")(), setup));
					}
				}
			}

			if (o.setup_urls && o.setup_urls.length > 0) {

				var queue$$1 = d3.queue();

				for (var j in o.setup_urls) {
					queue$$1.defer(d3.json, o.setup_urls[j]);
				}

				queue$$1.awaitAll(function (error, result) {
					if (error) throw error;

					for (var k in result) {
						self.addAll(result[k]);
						if (+k === result.length - 1) {
							self.addAll(o.setup_json);
							done(self);
						}
					}
				});
			} else {
				this.addAll(o.setup_json);
				done(this);
			}

			function done(o) {
				if (/complete|interactive|loaded/.test(document.readyState)) {
					o.ready(true).process(document);
				} else {
					document.addEventListener("DOMContentLoaded", function () {
						o.ready(true).process(document);
					});
				}
			}

			return this;
		},

		add: function add(key, o) {
			if (!o.create && o["data-dgf"]) {
				o.create = function () {
					return JSON.parse(JSON.stringify(o["data-dgf"]));
				};
			}
			_registry[key] = o;
			return this;
		},

		addAll: function addAll(o) {

			if (!o) return this;

			if (Array.isArray(o)) {
				for (var i in o) {
					this.addAll(o[i]);
				}
			} else {
				for (var key in o) {
					this.add(key, o[key]);
				}
			}

			return this;
		},

		lookup: function lookup(key) {
			return _registry[key];
		},

		create: function create(name, value, callees) {
			if (arguments.length < 2) {
				return this.create(null, arguments[0], callees);
			}

			if (value) {
				if (value.type) {
					var type = this.lookup(value.type);
					if (type === undefined) {
						throw "unknown type: '" + value.type + "'";
					}
					return typeof type.create === "function" ? type.create(this, "type", value, callees) : type.create;
				} else {
					switch (name) {
						case "parse":
							var o = {};
							for (var k in value) {
								o[value[k].attribute] = this.createExpression(value[k].parse);
							}
							return o;

						default:
							var v = this.createExpression(value);
							return v ? v : value;
					}
				}
			}
		},

		createTemplate: function createTemplate(name, value, callees, type) {
			for (name in value) {
				if (type[name]) {
					switch (name) {
						case "key":
						case "x":
						case "y":
						case "y1":
						case "color":
						case "text":
						case "label":
						case "xLabel":
						case "yLabel":
						case "y1Label":
							type[name].call(this, this.createExpression(value[name], type));
							break;

						case "xFormat":
						case "yFormat":
						case "y1Format":
						case "textFormat":
							type[name].call(this, this.createExpression(value[name]));
							break;

						case "xTickValues":
						case "yTickValues":
						case "y1TickValues":
							type[name].call(this, value[name].split(",").map(function (d) {
								return isNaN(d) ? d : +d;
							}));
							break;

						case "transition":
						case "enterTransition":
						case "exitTransition":
							type[name].call(this, this.createTransition(name, value[name]));
							break;

						default:
							type[name].call(this, this.create(name, value[name], callees));
					}
				}
			}
			return type;
		},

		createTransition: function createTransition(name, value) {
			var ease = value.ease ? this.lookup(value.ease).create() : undefined,
			    delay = this.createExpression(value.delay) || value.delay,
			    duration = this.createExpression(value.duration) || value.duration;

			return function (t) {
				if (ease) t.ease(ease);
				if (delay) t.delay(delay);
				if (duration) t.duration(duration);
				return t;
			};
		},

		createScale: function createScale(name, value, callees, type) {
			for (var _name in value) {
				if (type[_name]) {
					var v = this.create(_name, value[_name]);
					if (_name === "domain" || _name === "range") {
						if (typeof v === "function") {
							type["_" + _name] = v;
						} else if (Array.isArray(v) && (v[0] === undefined || Array.isArray(v[0]))) {
							type["_" + _name] = function (data, domain) {
								var i;
								for (i = domain.length; i < v.length; i++) {
									if (v[i]) return v[i];
								}
								for (i = v.length; i >= 0; i--) {
									if (v[i]) return v[i];
								}
							};
						} else if (Array.isArray(v)) {
							type[_name](v);
						} else {
							type[_name](v.split(",").map(function (d) {
								return !isNaN(d) ? +d : d;
							}));
						}
					} else {
						type[_name](v);
					}
				}
			}
			return type;
		},

		createExpression: function createExpression(value, type) {

			if (typeof value !== "string") return value;

			// Is it a registered expression?
			var v = this.lookup(value),
			    k,
			    s,
			    a,
			    b,
			    g;

			if (v) return v.create();

			//var m = value.match(/(.+)\((.*)\)/);
			var m = value.match(/(^[a-zA-Z]+)\((.*)\)/);

			if (m) {
				k = m[2];

				switch (m[1]) {

					case "data":
						return function (d, keyOnly) {
							return keyOnly ? k : d[k];
						};

					case "dataAt":
						return function (d, keyOnly) {
							return keyOnly ? d3.keys(d)[+k] : d[d3.keys(d)[+k]];
						};

					case "const":
						return function () {
							return k;
						};

					case "list":
						return function () {
							return k.split(",");
						};

					case "keyKey":
						return function (d) {
							return type.key()(d[0], true);
						};

					case "xKey":
						return function (d) {
							return type.x()(d[0], true);
						};

					case "yKey":
						return function (d) {
							return type.y()(d[0], true);
						};

					case "y1Key":
						return function (d) {
							return type.y1()(d[0], true);
						};

					case "colorKey":
						return function (d) {
							return type.color()(d[0], true);
						};

					case "textKey":
						return function (d) {
							return type.text()(d[0], true);
						};

					case "map":
						if (k === "") {
							return function (data, accessor) {
								return data.map(function (d) {
									return accessor(d);
								});
							};
						}

						return function (data) {
							return data.map(function (d) {
								return d[k];
							});
						};

					case "mapAt":
						return function (data) {
							return data.map(function (d) {
								return d[d3.keys(d)[+k]];
							});
						};

					case "extent":
						if (k === "") {
							return function (data, accessor) {
								return d3.extent(data.map(function (d) {
									return +accessor(d);
								}));
							};
						}

						return function (data) {
							return d3.extent(data.map(function (d) {
								return +d[k];
							}));
						};

					case "extentAt":
						return function (data) {
							return d3.extent(data.map(function (d) {
								return +d[d3.keys(d)[+k]];
							}));
						};

					case "extentZero":
						if (k === "") {
							return function (data, accessor) {
								return d3.extent(data.map(function (d) {
									return +accessor(d);
								}).concat(0));
							};
						}

						return function (data) {
							return d3.extent(data.map(function (d) {
								return +d[k];
							}).concat(0));
						};

					case "extentZeroAt":
						return function (data) {
							return d3.extent(data.map(function (d) {
								return +d[d3.keys(d)[+k]];
							}).concat(0));
						};

					case "keys":
						return function (data) {
							return d3.keys(data[0]);
						};

					case "keysAt":
						return function (data) {
							return d3.keys(data[0])[+k];
						};

					case "indexed":
						return function (d, i) {
							return i * k;
						};

					case "proportional":
						m = k.split(",");
						return function (d) {
							return d[m[0]] * m[1];
						};

					case "format":
						return d3.format(k);

					case "timeFormat":
						return d3.timeFormat(k);

					case "numberParse":
						switch (k) {
							case "%":
								return function (d) {
									return parseFloat(d.match(/-?\d+(\.\d+)?/g)[0]) * 0.01;
								};

							case "k":
								return function (d) {
									return parseFloat(d.match(/-?\d+(\.\d+)?/g)[0]) * 1000;
								};

							case "M":
								return function (d) {
									return parseFloat(d.match(/-?\d+(\.\d+)?/g)[0]) * 1000000;
								};

							case "B":
								return function (d) {
									return parseFloat(d.match(/-?\d+(\.\d+)?/g)[0]) * 1000000000;
								};

							default:
								return function (d) {
									return +d;
								};
						}

					case "timeParse":
						return d3.timeParse(k);

					case "utcParse":
						return d3.utcParse(k);

					case "isoParse":
						return d3.isoParse(k);

					case "threshold":
						k = k.split(",");
						s = d3.scaleThreshold().domain([+k[1]]).range([k[2], k[3]]);

						return function (d) {
							return s(d[k[0]]);
						};

					case "thresholdAt":
						k = k.split(",");
						s = d3.scaleThreshold().domain([+k[1]]).range([k[2], k[3]]);

						return function (d) {
							return s(d[d3.keys(d)[+k[0]]]);
						};

					case "interpolateRgb":
						k = k.split(",");
						a = k[0];
						b = k[1];
						g = k[2] || 1.0;

						return d3.interpolateRgb.gamma(g)(a, b);

					case "interpolateHsl":
						k = k.split(",");
						a = k[0];
						b = k[1];

						return d3.interpolateHsl(a, b);

					case "interpolateLab":
						k = k.split(",");
						a = k[0];
						b = k[1];

						return d3.interpolateLab(a, b);

					case "interpolateHcl":
						k = k.split(",");
						a = k[0];
						b = k[1];

						return d3.interpolateHcl(a, b);

					case "interpolateCubehelix":
						k = k.split(",");
						a = k[0];
						b = k[1];
						g = k[2] || 1.0;

						return d3.interpolateCubehelix.gamma(g)(a, b);

					default:
						throw "can't create expression: '" + value + "'";
				}
			}

			return undefined;
		},

		compress: function compress(p) {
			try {
				if (p.extend) {
					var e = this.lookup(p.extend);

					if (e === undefined) {
						throw "unknown extend: '" + p.extend + "'";
					}

					e = this.decompress(e.create());
					p = diff(e, p);

					var keys$$1 = Object.keys(e);
					for (var i in keys$$1) {
						var k = keys$$1[i];
						if (e[k].extend && p[k]) {
							p[k].extend = e[k].extend;
							p[k] = this.compress(p[k]);
						}
					}
				}

				return p;
			} catch (error) {
				throw "can't compress: '" + JSON.stringify(p) + "', " + error;
			}
		},

		decompress: function decompress(p) {
			try {
				if (p.extend) {
					var e = this.lookup(p.extend);
					if (e === undefined) {
						throw "unknown extend: '" + p.extend + "'";
					}

					e = this.decompress(e.create());
					p = extend(e, p);
				}

				var keys$$1 = Object.keys(p);
				for (var i in keys$$1) {
					var k = keys$$1[i];
					if (_typeof(p[k]) === "object") {
						p[k] = this.decompress(p[k]);
					}
				}

				return p;
			} catch (error) {
				throw "can't decompress: '" + JSON.stringify(p) + "', " + error;
			}
		},

		toHtml: function toHtml(node, p) {
			delete p.nodeId;

			var data = JSON.stringify(this.compress(p)),
			    figcaption = node.querySelector("figcaption");

			return "<figure id=\"" + node.id + "\" class=\"dgf mceNonEditable\" contenteditable=\"false\"" + " data-dgf=\"" + data.replace(/\"/g, "&quot;").replace(/\"/g, "%22") + "\"" + ">" + "<figcaption class=\"mceEditable\" contenteditable=\"true\">" + (figcaption ? figcaption.innerHTML : "New Diagram") + "</figcaption>" + "</figure>";
		},

		process: function process(node) {
			switch (node.nodeType) {
				case 1:
					// ELEMENT_NODE
					try {
						try {
							var p = JSON.parse(node.getAttribute("data-dgf"));
						} catch (error) {
							throw "can't parse data-dgf: " + error;
						}

						p = this.decompress(p);

						// Write the stylesheet
						if (p.style) {
							d3.select(node).call(this.create(null, p.style));
						}

						var template = this.create(null, p.template),
						    reader = this.create(null, p.reader, [template]),
						    scheduler = this.create(null, p.scheduler, [reader]);

						// call reader or scheduler if present.
						d3.select(node).call(scheduler || reader);
					} catch (error) {
						d3.select(node).append("figcaption").attr("class", "message error").append("text").text("Can't process diagram (" + error + ")");
						break;
					}
					break;

				case 9: // DOCUMENT_NODE
				case 11:
					// DOCUMENT_FRAGMENT_NODE
					var nodes = node.querySelectorAll("[data-dgf]");
					if (nodes) {
						for (var i in nodes) {
							this.process(nodes[i]);
						}
					}
					break;

				default:
					return this;
			}
		},

		typesByCategory: function typesByCategory(category) {
			var result = [];

			category = Array.isArray(category) ? category : category.split(",");

			reg: for (var key in _registry) {
				var o = _registry[key];

				if (o.category) {
					for (var i = 0; i < category.length; i++) {
						if (o.category[i] != category[i]) {
							continue reg;
						}
					}
					o.key = key;
					result.push(o);
				}
			}
			return result;
		}
	};

	return instance;
}

function init(o) {
	return tagFactory().init(o);
}

var setupD3 = {
	"d3.ascending": {
		title: "ascending",
		description: "Ascending sort",
		category: ["sort"],
		create: function create() {
			return d3.ascending;
		}
	},

	"d3.descending": {
		title: "descending",
		description: "Decending sort",
		category: ["sort"],
		create: function create() {
			return d3.descending;
		}
	},

	"d3.scaleOrdinal": {
		title: "Ordinal Scale",
		description: "Ordinal Scale",
		category: ["scale", "ordinal"],
		create: function create(tagFactory, name, value, callees) {
			return tagFactory.createScale(name, value, callees, d3.scaleOrdinal());
		}
	},

	"d3.scaleBand": {
		title: "Band Scale",
		description: "Band Scale",
		category: ["scale", "ordinal"],
		create: function create(tagFactory, name, value, callees) {
			return tagFactory.createScale(name, value, callees, d3.scaleBand());
		}
	},

	"d3.scalePoint": {
		title: "Point Scale",
		description: "Point Scale",
		category: ["scale", "ordinal"],
		create: function create(tagFactory, name, value, callees) {
			return tagFactory.createScale(name, value, callees, d3.scalePoint());
		}
	},

	"d3.scaleLinear": {
		title: "Linear Scale",
		description: "Linear Scale",
		category: ["scale", "continuous"],
		create: function create(tagFactory, name, value, callees) {
			return tagFactory.createScale(name, value, callees, d3.scaleLinear());
		}
	},

	"d3.scaleSqrt": {
		title: "Square Root Scale",
		description: "Square Root Scale",
		category: ["scale", "continuous"],
		create: function create(tagFactory, name, value, callees) {
			return tagFactory.createScale(name, value, callees, d3.scaleSqrt());
		}
	},

	"d3.scaleIdentity": {
		title: "Identity Scale",
		description: "Identity Scale",
		category: ["scale"],
		create: function create() {
			return d3.scaleIdentity();
		}
	},

	"d3.scaleThreshold": {
		title: "Threshold Scale",
		description: "Threshold Scale",
		category: ["scale"],
		create: function create(tagFactory, name, value, callees) {
			return tagFactory.createScale(name, value, callees, d3.scaleThreshold());
		}
	},

	"d3.scaleSequential": {
		title: "Sequential Scale",
		description: "Sequential Scale",
		category: ["scale"],
		create: function create(tagFactory, name, value) {
			var range = tagFactory.createExpression(value.range) || tagFactory.lookup(value.range).create(),
			    s = d3.scaleSequential(range);
			s["_domain"] = tagFactory.createExpression(value.domain);
			return s;
		}
	},

	"d3.scaleTime": {
		title: "Time Scale",
		description: "Time Scale",
		category: ["scale"],
		create: function create(tagFactory, name, value, callees) {
			return tagFactory.createScale(name, value, callees, d3.scaleTime());
		}
	},

	// Transitions

	"d3.transition": {
		title: "Transition",
		description: "Transition",
		category: ["transition"],
		create: function create() {
			return d3.transition();
		}
	},

	"d3.easeLinear": {
		title: "Linear",
		description: "Linear Easing",
		category: ["ease"],
		create: function create() {
			return d3.easeLinear;
		}
	},

	"d3.easePoly": {
		title: "Polynomial",
		description: "Polynomial InOut Easing",
		category: ["ease"],
		create: function create() {
			return d3.easePoly;
		}
	},

	"d3.easeQuad": {
		title: "Quadratic",
		description: "Quadratic InOut Easing",
		category: ["ease"],
		create: function create() {
			return d3.easeQuad;
		}
	},

	"d3.easeCubic": {
		title: "Cubic",
		description: "Cubic InOut Easing",
		category: ["ease"],
		create: function create() {
			return d3.easeCubic;
		}
	},

	"d3.easeSin": {
		title: "Sinusoidal",
		description: "Sinusoidal InOut Easing",
		category: ["ease"],
		create: function create() {
			return d3.easeSin;
		}
	},

	"d3.easeExp": {
		title: "Exponential",
		description: "Exponential InOut Easing",
		category: ["ease"],
		create: function create() {
			return d3.easeExp;
		}
	},

	"d3.easeCircle": {
		title: "Circle",
		description: "Circular InOut Easing",
		category: ["ease"],
		create: function create() {
			return d3.easeCircle;
		}
	},

	"d3.easeElastic": {
		title: "Elastic",
		description: "Elastic Out Easing",
		category: ["ease"],
		create: function create() {
			return d3.easeElastic;
		}
	},

	"d3.easeBack": {
		title: "Back",
		description: "Symmetric anticipatory InOut Easing",
		category: ["ease"],
		create: function create() {
			return d3.easeBack;
		}
	},

	"d3.easeBounce": {
		title: "Bounce",
		description: "Bounce Out Easing",
		category: ["ease"],
		create: function create() {
			return d3.easeBounce;
		}
	},

	// Lines

	"d3.line": {
		title: "Line",
		description: "Constructs a new line generator with the default settings",
		category: ["line generator"],
		create: function create(tagFactory, name, value, callees) {
			return tagFactory.createTemplate(name, value, callees, d3.line());
		}
	},

	"d3.radialLine": {
		title: "Radial Line",
		description: "Constructs a new radial line generator with the default settings.",
		category: ["line generator"],
		create: function create() {
			return d3.radialLine();
		}
	},

	"d3.area": {
		title: "Area",
		description: "Constructs a new area generator with the default settings.",
		category: ["line generator"],
		create: function create() {
			return d3.area();
		}
	},

	"d3.curveBasis": {
		title: "Basis",
		description: "Produces a cubic basis spline using the specified control points.",
		category: ["curve", "basis"],
		create: function create() {
			return d3.curveBasis;
		}
	},

	"d3.curveBasisClosed": {
		title: "Basis Closed",
		description: "Produces a closed cubic basis spline using the specified control points.",
		category: ["curve", "basis"],
		create: function create() {
			return d3.curveBasisClosed;
		}
	},

	"d3.curveBasisOpen": {
		title: "Basis Open",
		description: "Produces a open cubic basis spline using the specified control points.",
		category: ["curve", "basis"],
		create: function create() {
			return d3.curveBasisOpen;
		}
	},

	"d3.curveBundle": {
		title: "Bundle",
		description: "Produces a straightened cubic basis spline using the specified control points, with the spline straightened according to the curve’s beta, which defaults to 0.85.",
		category: ["curve"],
		create: function create(name, value) {
			return d3.curveBundle.beta(value.beta || 0.85);
		}
	},

	"d3.curveCardinal": {
		title: "Cardinal",
		description: "Produces a cubic cardinal spline using the specified control points, with one-sided differences used for the first and last piece.",
		category: ["curve", "cardinal"],
		create: function create() {
			return d3.curveCardinal;
		}
	},

	"d3.curveCardinalClosed": {
		title: "Cardinal Closed",
		description: "Produces a closed cubic cardinal spline using the specified control points.",
		category: ["curve", "cardinal"],
		create: function create(name, value) {
			return d3.curveCardinalClosed.tension(value.tension || 0);
		}
	},

	"d3.curveCardinalOpen": {
		title: "Cardinal Open",
		description: "Produces a cubic cardinal spline using the specified control points.",
		category: ["curve", "cardinal"],
		create: function create(name, value) {
			return d3.curveCardinalOpen.tension(value.tension || 0);
		}
	},

	"d3.curveCatmullRom": {
		title: "Catmull-Rom",
		description: "Produces a cubic Catmull–Rom spline using the specified control points and the parameter alpha.",
		category: ["curve", "Catmull-Rom"],
		create: function create(name, value) {
			return d3.curveCatmullRom.alpha(value.alpha || 0.5);
		}
	},

	"d3.curveCatmullRomClosed": {
		title: "Catmull-Rom Closed",
		description: "Produces a closed cubic Catmull–Rom spline using the specified control points and the parameter alpha.",
		category: ["curve", "Catmull-Rom"],
		create: function create(name, value) {
			return d3.curveCatmullRomClosed.alpha(value.alpha || 0.5);
		}
	},

	"d3.curveCatmullRomOpen": {
		title: "Catmull-Rom Open",
		description: "Produces a cubic Catmull–Rom spline using the specified control points and the parameter alpha.",
		category: ["curve", "Catmull-Rom"],
		create: function create(name, value) {
			return d3.curveCatmullRomOpen.alpha(value.alpha || 0.5);
		}
	},

	"d3.curveLinear": {
		title: "Linear",
		description: "Produces a polyline through the specified points.",
		category: ["curve", "linear"],
		create: function create() {
			return d3.curveLinear;
		}
	},

	"d3.curveLinearClosed": {
		title: "Linear Closed",
		description: "Produces a closed polyline through the specified points by repeating the first point when the line segment ends.",
		category: ["curve", "linear"],
		create: function create() {
			return d3.curveLinearClosed;
		}
	},

	"d3.curveMonotoneX": {
		title: "Monotone X",
		description: "Produces a cubic spline that preserves monotonicity in y, assuming monotonicity in x.",
		category: ["curve", "monotone"],
		create: function create() {
			return d3.curveMonotoneX;
		}
	},

	"d3.curveMonotoneY": {
		title: "Monotone Y",
		description: "Produces a cubic spline that preserves monotonicity in x, assuming monotonicity in y.",
		category: ["curve", "monotone"],
		create: function create() {
			return d3.curveMonotoneY;
		}
	},

	"d3.curveNatural": {
		title: "Natural",
		description: "Produces a natural cubic spline with the second derivative of the spline set to zero at the endpoints.",
		category: ["curve"],
		create: function create() {
			return d3.curveNatural;
		}
	},

	"d3.curveStep": {
		title: "Step",
		description: "Produces a piecewise constant function (a step function) consisting of alternating horizontal and vertical lines.",
		category: ["curve", "step"],
		create: function create() {
			return d3.curveStep;
		}
	},

	"d3.curveStepAfter": {
		title: "Step After",
		description: "Produces a piecewise constant function (a step function) consisting of alternating horizontal and vertical lines.",
		category: ["curve", "step"],
		create: function create() {
			return d3.curveStepAfter;
		}
	},

	"d3.curveStepBefore": {
		title: "Step Before",
		description: "Produces a piecewise constant function (a step function) consisting of alternating horizontal and vertical lines.",
		category: ["curve", "step"],
		create: function create() {
			return d3.curveStepBefore;
		}
	},

	// Schemes

	"d3.schemeCategory10": {
		title: "Category 10",
		description: "An array of ten categorical colors represented as RGB hexadecimal strings.",
		category: ["scheme", "categorical"],
		create: function create() {
			return d3.schemeCategory10;
		}
	},

	"d3.schemeCategory20": {
		title: "Category 20",
		description: "An array of twenty categorical colors represented as RGB hexadecimal strings.",
		category: ["scheme", "categorical"],
		create: function create() {
			return d3.schemeCategory20;
		}
	},

	"d3.schemeCategory20b": {
		title: "Category 20b",
		description: "An array of twenty categorical colors represented as RGB hexadecimal strings.",
		category: ["scheme", "categorical"],
		create: function create() {
			return d3.schemeCategory20b;
		}
	},

	"d3.schemeCategory20c": {
		title: "Category 20c",
		description: "An array of twenty categorical colors represented as RGB hexadecimal strings.",
		category: ["scheme", "categorical"],
		create: function create() {
			return d3.schemeCategory20c;
		}
	},

	"d3.interpolateViridis": {
		title: "Viridis",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'viridis' perceptually-uniform color scheme designed by van der Walt, Smith and Firing for matplotlib, represented as an RGB string.",
		category: ["interpolate", "sequential", "perceptually-uniform"],
		create: function create() {
			return d3.interpolateViridis;
		}
	},

	"d3.interpolateInferno": {
		title: "Inferno",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'inferno' perceptually-uniform color scheme designed by van der Walt and Smith for matplotlib, represented as an RGB string.",
		category: ["interpolate", "sequential", "perceptually-uniform"],
		create: function create() {
			return d3.interpolateInferno;
		}
	},

	"d3.interpolateMagma": {
		title: "Magma",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'magma' perceptually-uniform color scheme designed by van der Walt and Smith for matplotlib, represented as an RGB string.",
		category: ["interpolate", "sequential", "perceptually-uniform"],
		create: function create() {
			return d3.interpolateMagma;
		}
	},

	"d3.interpolatePlasma": {
		title: "Plasma",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'plasma' perceptually-uniform color scheme designed by van der Walt and Smith for matplotlib, represented as an RGB string.",
		category: ["interpolate", "sequential", "perceptually-uniform"],
		create: function create() {
			return d3.interpolatePlasma;
		}
	},

	"d3.interpolateWarm": {
		title: "Warm",
		description: "Given a number t in the range [0,1], returns the corresponding color from a 180 degree rotation of Niccoli\'s perceptual rainbow, represented as an RGB string.",
		category: ["interpolate", "sequential", "perceptually-uniform"],
		create: function create() {
			return d3.interpolateWarm;
		}
	},

	"d3.interpolateCool": {
		title: "Cool",
		description: "Given a number t in the range [0,1], returns the corresponding color from Niccoli\'s perceptual rainbow, represented as an RGB string.",
		category: ["interpolate", "sequential", "perceptually-uniform"],
		create: function create() {
			return d3.interpolateCool;
		}
	},

	"d3.interpolateRainbow": {
		title: "Rainbow",
		description: "Given a number t in the range [0,1], returns the corresponding color from d3.interpolateWarm scale from [0.0, 0.5] followed by the d3.interpolateCool scale from [0.5, 1.0], thus implementing the cyclical less-angry rainbow color scheme.",
		category: ["interpolate", "sequential", "perceptually-uniform"],
		create: function create() {
			return d3.interpolateRainbow;
		}
	},

	"d3.interpolateCubehelixDefault": {
		title: "Cubehelix Default",
		description: "Given a number t in the range [0,1], returns the corresponding color from Green\'s default Cubehelix represented as an RGB string.",
		category: ["interpolate", "sequential", "perceptually-uniform"],
		create: function create() {
			return d3.interpolateCubehelixDefault;
		}
	}
};

var colors = function (specifier) {
  var n = specifier.length / 6 | 0,
      colors = new Array(n),
      i = 0;
  while (i < n) {
    colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
  }return colors;
};

var Accent = colors("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666");

var Dark2 = colors("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666");

var Paired = colors("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928");

var Pastel1 = colors("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2");

var Pastel2 = colors("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc");

var Set1 = colors("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999");

var Set2 = colors("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3");

var Set3 = colors("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f");

var define = function (constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
};

function extend$1(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) {
    prototype[key] = definition[key];
  }return prototype;
}

function Color() {}

var _darker = 0.7;
var _brighter = 1 / _darker;

var reI = "\\s*([+-]?\\d+)\\s*";
var reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*";
var reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
var reHex3 = /^#([0-9a-f]{3})$/;
var reHex6 = /^#([0-9a-f]{6})$/;
var reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$");
var reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$");
var reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$");
var reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$");
var reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$");
var reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};

define(Color, color, {
  displayable: function displayable() {
    return this.rgb().displayable();
  },
  toString: function toString() {
    return this.rgb() + "";
  }
});

function color(format$$1) {
  var m;
  format$$1 = (format$$1 + "").trim().toLowerCase();
  return (m = reHex3.exec(format$$1)) ? (m = parseInt(m[1], 16), new Rgb(m >> 8 & 0xf | m >> 4 & 0x0f0, m >> 4 & 0xf | m & 0xf0, (m & 0xf) << 4 | m & 0xf, 1) // #f00
  ) : (m = reHex6.exec(format$$1)) ? rgbn(parseInt(m[1], 16)) // #ff0000
  : (m = reRgbInteger.exec(format$$1)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
  : (m = reRgbPercent.exec(format$$1)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
  : (m = reRgbaInteger.exec(format$$1)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
  : (m = reRgbaPercent.exec(format$$1)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
  : (m = reHslPercent.exec(format$$1)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
  : (m = reHslaPercent.exec(format$$1)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
  : named.hasOwnProperty(format$$1) ? rgbn(named[format$$1]) : format$$1 === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb();
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}

function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

define(Rgb, rgb, extend$1(Color, {
  brighter: function brighter(k) {
    k = k == null ? _brighter : Math.pow(_brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker: function darker(k) {
    k = k == null ? _darker : Math.pow(_darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb: function rgb() {
    return this;
  },
  displayable: function displayable() {
    return 0 <= this.r && this.r <= 255 && 0 <= this.g && this.g <= 255 && 0 <= this.b && this.b <= 255 && 0 <= this.opacity && this.opacity <= 1;
  },
  toString: function toString() {
    var a = this.opacity;a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (a === 1 ? ")" : ", " + a + ")");
  }
}));

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;else if (l <= 0 || l >= 1) h = s = NaN;else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl();
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min$$1 = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min$$1,
      l = (max + min$$1) / 2;
  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;else if (g === max) h = (b - r) / s + 2;else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min$$1 : 2 - max - min$$1;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}

function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Hsl, hsl, extend$1(Color, {
  brighter: function brighter(k) {
    k = k == null ? _brighter : Math.pow(_brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function darker(k) {
    k = k == null ? _darker : Math.pow(_darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function rgb() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
  },
  displayable: function displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  }
}));

/* From FvD 13.37, CSS Color Module Level 3 */
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}

var deg2rad = Math.PI / 180;
var rad2deg = 180 / Math.PI;

var Kn = 18;
var Xn = 0.950470;
var Yn = 1;
var Zn = 1.088830;
var t0 = 4 / 29;
var t1 = 6 / 29;
var t2 = 3 * t1 * t1;
var t3 = t1 * t1 * t1;

function labConvert(o) {
  if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
  if (o instanceof Hcl) {
    var h = o.h * deg2rad;
    return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
  }
  if (!(o instanceof Rgb)) o = rgbConvert(o);
  var b = rgb2xyz(o.r),
      a = rgb2xyz(o.g),
      l = rgb2xyz(o.b),
      x = xyz2lab((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn),
      y = xyz2lab((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn),
      z = xyz2lab((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn);
  return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
}

function lab(l, a, b, opacity) {
  return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
}

function Lab(l, a, b, opacity) {
  this.l = +l;
  this.a = +a;
  this.b = +b;
  this.opacity = +opacity;
}

define(Lab, lab, extend$1(Color, {
  brighter: function brighter$$1(k) {
    return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  darker: function darker$$1(k) {
    return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  rgb: function rgb$$1() {
    var y = (this.l + 16) / 116,
        x = isNaN(this.a) ? y : y + this.a / 500,
        z = isNaN(this.b) ? y : y - this.b / 200;
    y = Yn * lab2xyz(y);
    x = Xn * lab2xyz(x);
    z = Zn * lab2xyz(z);
    return new Rgb(xyz2rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
    xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z), xyz2rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z), this.opacity);
  }
}));

function xyz2lab(t) {
  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
}

function lab2xyz(t) {
  return t > t1 ? t * t * t : t2 * (t - t0);
}

function xyz2rgb(x) {
  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}

function rgb2xyz(x) {
  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function hclConvert(o) {
  if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
  if (!(o instanceof Lab)) o = labConvert(o);
  var h = Math.atan2(o.b, o.a) * rad2deg;
  return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
}

function hcl(h, c, l, opacity) {
  return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}

function Hcl(h, c, l, opacity) {
  this.h = +h;
  this.c = +c;
  this.l = +l;
  this.opacity = +opacity;
}

define(Hcl, hcl, extend$1(Color, {
  brighter: function brighter$$1(k) {
    return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k), this.opacity);
  },
  darker: function darker$$1(k) {
    return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k), this.opacity);
  },
  rgb: function rgb$$1() {
    return labConvert(this).rgb();
  }
}));

var A = -0.14861;
var B = +1.78277;
var C = -0.29227;
var D = -0.90649;
var E = +1.97294;
var ED = E * D;
var EB = E * B;
var BC_DA = B * C - D * A;

function cubehelixConvert(o) {
  if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Rgb)) o = rgbConvert(o);
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
      bl = b - l,
      k = (E * (g - l) - C * bl) / D,
      s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)),
      // NaN if l=0 or l=1
  h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
}

function cubehelix(h, s, l, opacity) {
  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
}

function Cubehelix(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Cubehelix, cubehelix, extend$1(Color, {
  brighter: function brighter$$1(k) {
    k = k == null ? _brighter : Math.pow(_brighter, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function darker$$1(k) {
    k = k == null ? _darker : Math.pow(_darker, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function rgb$$1() {
    var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
        l = +this.l,
        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
        cosh = Math.cos(h),
        sinh = Math.sin(h);
    return new Rgb(255 * (l + a * (A * cosh + B * sinh)), 255 * (l + a * (C * cosh + D * sinh)), 255 * (l + a * (E * cosh)), this.opacity);
  }
}));

function basis(t1, v0, v1, v2, v3) {
  var t2 = t1 * t1,
      t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
}

var basis$1 = function (values) {
  var n = values.length - 1;
  return function (t) {
    var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
        v1 = values[i],
        v2 = values[i + 1],
        v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
        v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
};

var constant = function (x) {
  return function () {
    return x;
  };
};

function linear(a, d) {
  return function (t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function (t) {
    return Math.pow(a + t * b, y);
  };
}

function hue(a, b) {
  var d = b - a;
  return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant(isNaN(a) ? b : a);
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function (a, b) {
    return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant(isNaN(a) ? b : a);
}

((function rgbGamma(y) {
  var color$$1 = gamma(y);

  function rgb$$1(start, end) {
    var r = color$$1((start = rgb(start)).r, (end = rgb(end)).r),
        g = color$$1(start.g, end.g),
        b = color$$1(start.b, end.b),
        opacity = nogamma(start.opacity, end.opacity);
    return function (t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  rgb$$1.gamma = rgbGamma;

  return rgb$$1;
}))(1);

function rgbSpline(spline) {
  return function (colors) {
    var n = colors.length,
        r = new Array(n),
        g = new Array(n),
        b = new Array(n),
        i,
        color$$1;
    for (i = 0; i < n; ++i) {
      color$$1 = rgb(colors[i]);
      r[i] = color$$1.r || 0;
      g[i] = color$$1.g || 0;
      b[i] = color$$1.b || 0;
    }
    r = spline(r);
    g = spline(g);
    b = spline(b);
    color$$1.opacity = 1;
    return function (t) {
      color$$1.r = r(t);
      color$$1.g = g(t);
      color$$1.b = b(t);
      return color$$1 + "";
    };
  };
}

var rgbBasis = rgbSpline(basis$1);

var number = function (a, b) {
  return a = +a, b -= a, function (t) {
    return a + b * t;
  };
};

var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
var reB = new RegExp(reA.source, "g");

function zero(b) {
  return function () {
    return b;
  };
}

function one(b) {
  return function (t) {
    return b(t) + "";
  };
}

// p0 = [ux0, uy0, w0]
// p1 = [ux1, uy1, w1]

function cubehelix$1(hue$$1) {
  return function cubehelixGamma(y) {
    y = +y;

    function cubehelix$$1(start, end) {
      var h = hue$$1((start = cubehelix(start)).h, (end = cubehelix(end)).h),
          s = nogamma(start.s, end.s),
          l = nogamma(start.l, end.l),
          opacity = nogamma(start.opacity, end.opacity);
      return function (t) {
        start.h = h(t);
        start.s = s(t);
        start.l = l(Math.pow(t, y));
        start.opacity = opacity(t);
        return start + "";
      };
    }

    cubehelix$$1.gamma = cubehelixGamma;

    return cubehelix$$1;
  }(1);
}

cubehelix$1(hue);
var cubehelixLong = cubehelix$1(nogamma);

var ramp = function (scheme) {
  return rgbBasis(scheme[scheme.length - 1]);
};

var scheme = new Array(3).concat("d8b365f5f5f55ab4ac", "a6611adfc27d80cdc1018571", "a6611adfc27df5f5f580cdc1018571", "8c510ad8b365f6e8c3c7eae55ab4ac01665e", "8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e", "8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e", "8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e", "5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30", "5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30").map(colors);

var BrBG = ramp(scheme);

var scheme$1 = new Array(3).concat("af8dc3f7f7f77fbf7b", "7b3294c2a5cfa6dba0008837", "7b3294c2a5cff7f7f7a6dba0008837", "762a83af8dc3e7d4e8d9f0d37fbf7b1b7837", "762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837", "762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837", "762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837", "40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b", "40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b").map(colors);

var PRGn = ramp(scheme$1);

var scheme$2 = new Array(3).concat("e9a3c9f7f7f7a1d76a", "d01c8bf1b6dab8e1864dac26", "d01c8bf1b6daf7f7f7b8e1864dac26", "c51b7de9a3c9fde0efe6f5d0a1d76a4d9221", "c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221", "c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221", "c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221", "8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419", "8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419").map(colors);

var PiYG = ramp(scheme$2);

var scheme$3 = new Array(3).concat("998ec3f7f7f7f1a340", "5e3c99b2abd2fdb863e66101", "5e3c99b2abd2f7f7f7fdb863e66101", "542788998ec3d8daebfee0b6f1a340b35806", "542788998ec3d8daebf7f7f7fee0b6f1a340b35806", "5427888073acb2abd2d8daebfee0b6fdb863e08214b35806", "5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b35806", "2d004b5427888073acb2abd2d8daebfee0b6fdb863e08214b358067f3b08", "2d004b5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b358067f3b08").map(colors);

var PuOr = ramp(scheme$3);

var scheme$4 = new Array(3).concat("ef8a62f7f7f767a9cf", "ca0020f4a58292c5de0571b0", "ca0020f4a582f7f7f792c5de0571b0", "b2182bef8a62fddbc7d1e5f067a9cf2166ac", "b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac", "b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac", "b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac", "67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061", "67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061").map(colors);

var RdBu = ramp(scheme$4);

var scheme$5 = new Array(3).concat("ef8a62ffffff999999", "ca0020f4a582bababa404040", "ca0020f4a582ffffffbababa404040", "b2182bef8a62fddbc7e0e0e09999994d4d4d", "b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d", "b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d", "b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d", "67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a", "67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a").map(colors);

var RdGy = ramp(scheme$5);

var scheme$6 = new Array(3).concat("fc8d59ffffbf91bfdb", "d7191cfdae61abd9e92c7bb6", "d7191cfdae61ffffbfabd9e92c7bb6", "d73027fc8d59fee090e0f3f891bfdb4575b4", "d73027fc8d59fee090ffffbfe0f3f891bfdb4575b4", "d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4", "d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4", "a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695", "a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695").map(colors);

var RdYlBu = ramp(scheme$6);

var scheme$7 = new Array(3).concat("fc8d59ffffbf91cf60", "d7191cfdae61a6d96a1a9641", "d7191cfdae61ffffbfa6d96a1a9641", "d73027fc8d59fee08bd9ef8b91cf601a9850", "d73027fc8d59fee08bffffbfd9ef8b91cf601a9850", "d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850", "d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850", "a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837", "a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837").map(colors);

var RdYlGn = ramp(scheme$7);

var scheme$8 = new Array(3).concat("fc8d59ffffbf99d594", "d7191cfdae61abdda42b83ba", "d7191cfdae61ffffbfabdda42b83ba", "d53e4ffc8d59fee08be6f59899d5943288bd", "d53e4ffc8d59fee08bffffbfe6f59899d5943288bd", "d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd", "d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd", "9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2", "9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2").map(colors);

var Spectral = ramp(scheme$8);

var scheme$9 = new Array(3).concat("e5f5f999d8c92ca25f", "edf8fbb2e2e266c2a4238b45", "edf8fbb2e2e266c2a42ca25f006d2c", "edf8fbccece699d8c966c2a42ca25f006d2c", "edf8fbccece699d8c966c2a441ae76238b45005824", "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824", "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b").map(colors);

var BuGn = ramp(scheme$9);

var scheme$10 = new Array(3).concat("e0ecf49ebcda8856a7", "edf8fbb3cde38c96c688419d", "edf8fbb3cde38c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b").map(colors);

var BuPu = ramp(scheme$10);

var scheme$11 = new Array(3).concat("e0f3dba8ddb543a2ca", "f0f9e8bae4bc7bccc42b8cbe", "f0f9e8bae4bc7bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081").map(colors);

var GnBu = ramp(scheme$11);

var scheme$12 = new Array(3).concat("fee8c8fdbb84e34a33", "fef0d9fdcc8afc8d59d7301f", "fef0d9fdcc8afc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000").map(colors);

var OrRd = ramp(scheme$12);

var scheme$13 = new Array(3).concat("ece2f0a6bddb1c9099", "f6eff7bdc9e167a9cf02818a", "f6eff7bdc9e167a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636").map(colors);

var PuBuGn = ramp(scheme$13);

var scheme$14 = new Array(3).concat("ece7f2a6bddb2b8cbe", "f1eef6bdc9e174a9cf0570b0", "f1eef6bdc9e174a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858").map(colors);

var PuBu = ramp(scheme$14);

var scheme$15 = new Array(3).concat("e7e1efc994c7dd1c77", "f1eef6d7b5d8df65b0ce1256", "f1eef6d7b5d8df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f").map(colors);

var PuRd = ramp(scheme$15);

var scheme$16 = new Array(3).concat("fde0ddfa9fb5c51b8a", "feebe2fbb4b9f768a1ae017e", "feebe2fbb4b9f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a").map(colors);

var RdPu = ramp(scheme$16);

var scheme$17 = new Array(3).concat("edf8b17fcdbb2c7fb8", "ffffcca1dab441b6c4225ea8", "ffffcca1dab441b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58").map(colors);

var YlGnBu = ramp(scheme$17);

var scheme$18 = new Array(3).concat("f7fcb9addd8e31a354", "ffffccc2e69978c679238443", "ffffccc2e69978c67931a354006837", "ffffccd9f0a3addd8e78c67931a354006837", "ffffccd9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529").map(colors);

var YlGn = ramp(scheme$18);

var scheme$19 = new Array(3).concat("fff7bcfec44fd95f0e", "ffffd4fed98efe9929cc4c02", "ffffd4fed98efe9929d95f0e993404", "ffffd4fee391fec44ffe9929d95f0e993404", "ffffd4fee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506").map(colors);

var YlOrBr = ramp(scheme$19);

var scheme$20 = new Array(3).concat("ffeda0feb24cf03b20", "ffffb2fecc5cfd8d3ce31a1c", "ffffb2fecc5cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026").map(colors);

var YlOrRd = ramp(scheme$20);

var scheme$21 = new Array(3).concat("deebf79ecae13182bd", "eff3ffbdd7e76baed62171b5", "eff3ffbdd7e76baed63182bd08519c", "eff3ffc6dbef9ecae16baed63182bd08519c", "eff3ffc6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b").map(colors);

var Blues = ramp(scheme$21);

var scheme$22 = new Array(3).concat("e5f5e0a1d99b31a354", "edf8e9bae4b374c476238b45", "edf8e9bae4b374c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b").map(colors);

var Greens = ramp(scheme$22);

var scheme$23 = new Array(3).concat("f0f0f0bdbdbd636363", "f7f7f7cccccc969696525252", "f7f7f7cccccc969696636363252525", "f7f7f7d9d9d9bdbdbd969696636363252525", "f7f7f7d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000").map(colors);

var Greys = ramp(scheme$23);

var scheme$24 = new Array(3).concat("efedf5bcbddc756bb1", "f2f0f7cbc9e29e9ac86a51a3", "f2f0f7cbc9e29e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d").map(colors);

var Purples = ramp(scheme$24);

var scheme$25 = new Array(3).concat("fee0d2fc9272de2d26", "fee5d9fcae91fb6a4acb181d", "fee5d9fcae91fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d").map(colors);

var Reds = ramp(scheme$25);

var scheme$26 = new Array(3).concat("fee6cefdae6be6550d", "feeddefdbe85fd8d3cd94701", "feeddefdbe85fd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704").map(colors);

var Oranges = ramp(scheme$26);

var setupD3ScaleChromatic = {
	"d3.schemeAccent": {
		title: "Accent",
		description: "An array of eight categorical colors represented as RGB hexadecimal strings.",
		category: ["scheme", "categorical"],
		create: function create() {
			return Accent;
		}
	},

	"d3.schemeDark2": {
		title: "Dark 2",
		description: "An array of eight categorical colors represented as RGB hexadecimal strings.",
		category: ["scheme", "categorical"],
		create: function create() {
			return Dark2;
		}
	},

	"d3.schemePaired": {
		title: "Paired",
		description: "An array of twelve categorical colors represented as RGB hexadecimal strings.",
		category: ["scheme", "categorical"],
		create: function create() {
			return Paired;
		}
	},

	"d3.schemePastel1": {
		title: "Pastel 1",
		description: "An array of nine categorical colors represented as RGB hexadecimal strings.",
		category: ["scheme", "categorical"],
		create: function create() {
			return Pastel1;
		}
	},

	"d3.schemePastel2": {
		title: "Pastel 2",
		description: "An array of eight categorical colors represented as RGB hexadecimal strings.",
		category: ["scheme", "categorical"],
		create: function create() {
			return Pastel2;
		}
	},

	"d3.schemeSet1": {
		title: "Set 1",
		description: "An array of nine categorical colors represented as RGB hexadecimal strings.",
		category: ["scheme", "categorical"],
		create: function create() {
			return Set1;
		}
	},

	"d3.schemeSet2": {
		title: "Set 2",
		description: "An array of eight categorical colors represented as RGB hexadecimal strings.",
		category: ["scheme", "categorical"],
		create: function create() {
			return Set2;
		}
	},

	"d3.schemeSet3": {
		title: "Set 3",
		description: "An array of twelve categorical colors represented as RGB hexadecimal strings.",
		category: ["scheme", "categorical"],
		create: function create() {
			return Set3;
		}
	},

	// Scheme Diverging

	"d3.schemeBrBG": {
		title: "BrBG",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'BrBG' diverging color scheme represented as an RGB string.",
		category: ["scheme", "diverging"],
		create: function create() {
			return scheme;
		}
	},

	"d3.schemePRGn": {
		title: "PRGn",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'PRGn' diverging color scheme represented as an RGB string.",
		category: ["scheme", "diverging"],
		create: function create() {
			return scheme$1;
		}
	},

	"d3.schemePiYG": {
		title: "PiYG",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'PiYG' diverging color scheme represented as an RGB string.",
		category: ["scheme", "diverging"],
		create: function create() {
			return scheme$2;
		}
	},

	"d3.schemePuOr": {
		title: "PuOr",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'PuOr' diverging color scheme represented as an RGB string.",
		category: ["scheme", "diverging"],
		create: function create() {
			return scheme$3;
		}
	},

	"d3.schemeRdBu": {
		title: "RdBu",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'RdBu' diverging color scheme represented as an RGB string.",
		category: ["scheme", "diverging"],
		create: function create() {
			return scheme$4;
		}
	},

	"d3.schemeRdGy": {
		title: "RdGy",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'RdGy' diverging color scheme represented as an RGB string.",
		category: ["scheme", "diverging"],
		create: function create() {
			return scheme$5;
		}
	},

	"d3.schemeRdYlBu": {
		title: "RdYlBu",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'RdYlBu' diverging color scheme represented as an RGB string.",
		category: ["scheme", "diverging"],
		create: function create() {
			return scheme$6;
		}
	},

	"d3.schemeRdYlGn": {
		title: "RdYlGn",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'RdYlGn' diverging color scheme represented as an RGB string.",
		category: ["scheme", "diverging"],
		create: function create() {
			return scheme$7;
		}
	},

	"d3.schemeSpectral": {
		title: "Spectral",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'Spectral' diverging color scheme represented as an RGB string.",
		category: ["scheme", "diverging"],
		create: function create() {
			return scheme$8;
		}
	},

	// Scheme Sequential

	"d3.schemeBlues": {
		title: "Blues",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'Blues' sequential color scheme represented as an RGB string.",
		category: ["scheme", "sequential", "single hue"],
		create: function create() {
			return scheme$21;
		}
	},

	"d3.schemeGreens": {
		title: "Greens",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'Greens' sequential color scheme represented as an RGB string.",
		category: ["scheme", "sequential", "single hue"],
		create: function create() {
			return scheme$22;
		}
	},

	"d3.schemeGreys": {
		title: "Greys",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'Greys' sequential color scheme represented as an RGB string.",
		category: ["scheme", "sequential", "single hue"],
		create: function create() {
			return scheme$23;
		}
	},

	"d3.schemeOranges": {
		title: "Oranges",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'Oranges' sequential color scheme represented as an RGB string.",
		category: ["scheme", "sequential", "single hue"],
		create: function create() {
			return scheme$26;
		}
	},

	"d3.schemePurples": {
		title: "Purples",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'Purples' sequential color scheme represented as an RGB string.",
		category: ["scheme", "sequential", "single hue"],
		create: function create() {
			return scheme$24;
		}
	},

	"d3.schemeReds": {
		title: "Reds",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'Reds' sequential color scheme represented as an RGB string.",
		category: ["scheme", "sequential", "single hue"],
		create: function create() {
			return scheme$25;
		}
	},

	"d3.schemeBuGn": {
		title: "BuGn",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'BuGn' sequential color scheme represented as an RGB string.",
		category: ["scheme", "sequential", "multi hue"],
		create: function create() {
			return scheme$9;
		}
	},

	"d3.schemeBuPu": {
		title: "BuPu",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'BuPu' sequential color scheme represented as an RGB string.",
		category: ["scheme", "sequential", "multi hue"],
		create: function create() {
			return scheme$10;
		}
	},

	"d3.schemeGnBu": {
		title: "GnBu",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'GnBu' sequential color scheme represented as an RGB string.",
		category: ["scheme", "sequential", "multi hue"],
		create: function create() {
			return scheme$11;
		}
	},

	"d3.schemeOrRd": {
		title: "OrRd",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'OrRd' sequential color scheme represented as an RGB string.",
		category: ["scheme", "sequential", "multi hue"],
		create: function create() {
			return scheme$12;
		}
	},

	"d3.schemePuBuGn": {
		title: "PuBuGn",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'PuBuGn' sequential color scheme represented as an RGB string.",
		category: ["scheme", "sequential", "multi hue"],
		create: function create() {
			return scheme$13;
		}
	},

	"d3.schemePuBu": {
		title: "PuBu",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'PuBu' sequential color scheme represented as an RGB string.",
		category: ["scheme", "sequential", "multi hue"],
		create: function create() {
			return scheme$14;
		}
	},

	"d3.schemePuRd": {
		title: "PuRd",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'PuRd' sequential color scheme represented as an RGB string.",
		category: ["scheme", "sequential", "multi hue"],
		create: function create() {
			return scheme$15;
		}
	},

	"d3.schemeRdPu": {
		title: "RdPu",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'RdPu' sequential color scheme represented as an RGB string.",
		category: ["scheme", "sequential", "multi hue"],
		create: function create() {
			return scheme$16;
		}
	},

	"d3.schemeYlGnBu": {
		title: "YlGnBu",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'YlGnBu' sequential color scheme represented as an RGB string.",
		category: ["scheme", "sequential", "multi hue"],
		create: function create() {
			return scheme$17;
		}
	},

	"d3.schemeYlGn": {
		title: "YlGn",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'YlGn' sequential color scheme represented as an RGB string.",
		category: ["scheme", "sequential", "multi hue"],
		create: function create() {
			return scheme$18;
		}
	},

	"d3.schemeYlOrBr": {
		title: "YlOrBr",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'YlOrBr' sequential color scheme represented as an RGB string.",
		category: ["scheme", "sequential", "multi hue"],
		create: function create() {
			return scheme$19;
		}
	},

	"d3.schemeYlOrRd": {
		title: "YlOrRd",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'YlOrRd' sequential color scheme represented as an RGB string.",
		category: ["scheme", "sequential", "multi hue"],
		create: function create() {
			return scheme$20;
		}
	},

	// Interpolate Diverging

	"d3.interpolateBrBG": {
		title: "BrBG",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'BrBG' diverging color scheme represented as an RGB string.",
		category: ["interpolate", "diverging"],
		create: function create() {
			return BrBG;
		}
	},

	"d3.interpolatePRGn": {
		title: "PRGn",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'PRGn' diverging color scheme represented as an RGB string.",
		category: ["interpolate", "diverging"],
		create: function create() {
			return PRGn;
		}
	},

	"d3.interpolatePiYG": {
		title: "PiYG",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'PiYG' diverging color scheme represented as an RGB string.",
		category: ["interpolate", "diverging"],
		create: function create() {
			return PiYG;
		}
	},

	"d3.interpolatePuOr": {
		title: "PuOr",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'PuOr' diverging color scheme represented as an RGB string.",
		category: ["interpolate", "diverging"],
		create: function create() {
			return PuOr;
		}
	},

	"d3.interpolateRdBu": {
		title: "RdBu",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'RdBu' diverging color scheme represented as an RGB string.",
		category: ["interpolate", "diverging"],
		create: function create() {
			return RdBu;
		}
	},

	"d3.interpolateRdGy": {
		title: "RdGy",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'RdGy' diverging color scheme represented as an RGB string.",
		category: ["interpolate", "diverging"],
		create: function create() {
			return RdGy;
		}
	},

	"d3.interpolateRdYlBu": {
		title: "RdYlBu",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'RdYlBu' diverging color scheme represented as an RGB string.",
		category: ["interpolate", "diverging"],
		create: function create() {
			return RdYlBu;
		}
	},

	"d3.interpolateRdYlGn": {
		title: "RdYlGn",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'RdYlGn' diverging color scheme represented as an RGB string.",
		category: ["interpolate", "diverging"],
		create: function create() {
			return RdYlGn;
		}
	},

	"d3.interpolateSpectral": {
		title: "Spectral",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'Spectral' diverging color scheme represented as an RGB string.",
		category: ["interpolate", "diverging"],
		create: function create() {
			return Spectral;
		}
	},

	// Interpolate Sequential

	"d3.interpolateBlues": {
		title: "Blues",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'Blues' sequential color scheme represented as an RGB string.",
		category: ["interpolate", "sequential", "single hue"],
		create: function create() {
			return Blues;
		}
	},

	"d3.interpolateGreens": {
		title: "Greens",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'Greens' sequential color scheme represented as an RGB string.",
		category: ["interpolate", "sequential", "single hue"],
		create: function create() {
			return Greens;
		}
	},

	"d3.interpolateGreys": {
		title: "Greys",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'Greys' sequential color scheme represented as an RGB string.",
		category: ["interpolate", "sequential", "single hue"],
		create: function create() {
			return Greys;
		}
	},

	"d3.interpolateOranges": {
		title: "Oranges",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'Oranges' sequential color scheme represented as an RGB string.",
		category: ["interpolate", "sequential", "single hue"],
		create: function create() {
			return Oranges;
		}
	},

	"d3.interpolatePurples": {
		title: "Purples",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'Purples' sequential color scheme represented as an RGB string.",
		category: ["interpolate", "sequential", "single hue"],
		create: function create() {
			return Purples;
		}
	},

	"d3.interpolateReds": {
		title: "Reds",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'Reds' sequential color scheme represented as an RGB string.",
		category: ["interpolate", "sequential", "single hue"],
		create: function create() {
			return Reds;
		}
	},

	"d3.interpolateBuGn": {
		title: "BuGn",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'BuGn' sequential color scheme represented as an RGB string.",
		category: ["interpolate", "sequential", "multi hue"],
		create: function create() {
			return BuGn;
		}
	},

	"d3.interpolateBuPu": {
		title: "BuPu",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'BuPu' sequential color scheme represented as an RGB string.",
		category: ["interpolate", "sequential", "multi hue"],
		create: function create() {
			return BuPu;
		}
	},

	"d3.interpolateGnBu": {
		title: "GnBu",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'GnBu' sequential color scheme represented as an RGB string.",
		category: ["interpolate", "sequential", "multi hue"],
		create: function create() {
			return GnBu;
		}
	},

	"d3.interpolateOrRd": {
		title: "OrRd",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'OrRd' sequential color scheme represented as an RGB string.",
		category: ["interpolate", "sequential", "multi hue"],
		create: function create() {
			return OrRd;
		}
	},

	"d3.interpolatePuBuGn": {
		title: "PuBuGn",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'PuBuGn' sequential color scheme represented as an RGB string.",
		category: ["interpolate", "sequential", "multi hue"],
		create: function create() {
			return PuBuGn;
		}
	},

	"d3.interpolatePuBu": {
		title: "PuBu",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'PuBu' sequential color scheme represented as an RGB string.",
		category: ["interpolate", "sequential", "multi hue"],
		create: function create() {
			return PuBu;
		}
	},

	"d3.interpolatePuRd": {
		title: "PuRd",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'PuRd' sequential color scheme represented as an RGB string.",
		category: ["interpolate", "sequential", "multi hue"],
		create: function create() {
			return PuRd;
		}
	},

	"d3.interpolateRdPu": {
		title: "RdPu",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'RdPu' sequential color scheme represented as an RGB string.",
		category: ["interpolate", "sequential", "multi hue"],
		create: function create() {
			return RdPu;
		}
	},

	"d3.interpolateYlGnBu": {
		title: "YlGnBu",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'YlGnBu' sequential color scheme represented as an RGB string.",
		category: ["interpolate", "sequential", "multi hue"],
		create: function create() {
			return YlGnBu;
		}
	},

	"d3.interpolateYlGn": {
		title: "YlGn",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'YlGn' sequential color scheme represented as an RGB string.",
		category: ["interpolate", "sequential", "multi hue"],
		create: function create() {
			return YlGn;
		}
	},

	"d3.interpolateYlOrBr": {
		title: "YlOrBr",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'YlOrBr' sequential color scheme represented as an RGB string.",
		category: ["interpolate", "sequential", "multi hue"],
		create: function create() {
			return YlOrBr;
		}
	},

	"d3.interpolateYlOrRd": {
		title: "YlOrRd",
		description: "Given a number t in the range [0,1], returns the corresponding color from the 'YlOrRd' sequential color scheme represented as an RGB string.",
		category: ["interpolate", "sequential", "multi hue"],
		create: function create() {
			return YlOrRd;
		}
	}
};

var greys = new Array(1).concat([["#cccccc"], ["#e3e3e3", "#696969"], ["#e3e3e3", "#a4a4a4", "#696969"], ["#e3e3e3", "#b9b9b9", "#8f8f8f", "#696969"], ["#e3e3e3", "#c2c2c2", "#a4a4a4", "#858585", "#696969"], ["#e3e3e3", "#cacaca", "#b0b0b0", "#979797", "#808080", "#696969"], ["#e3e3e3", "#cecece", "#b9b9b9", "#a4a4a4", "#8f8f8f", "#7c7c7c", "#696969"], ["#e3e3e3", "#d0d0d0", "#bebebe", "#adadad", "#9b9b9b", "#8a8a8a", "#797979", "#696969"], ["#e3e3e3", "#d3d3d3", "#c2c2c2", "#b3b3b3", "#a4a4a4", "#949494", "#858585", "#787878", "#696969"]]);

var blues = new Array(3).concat([["#ddd4e8", "#866aba", "#00008b"], ["#ddd4e8", "#a38cca", "#6648ab", "#00008b"], ["#ddd4e8", "#b29ed1", "#866aba", "#5537a3", "#00008b"], ["#ddd4e8", "#bba8d6", "#977ec4", "#7356b1", "#4a2d9e", "#00008b"], ["#ddd4e8", "#c0b0d9", "#a38cca", "#866aba", "#6648ab", "#42279b", "#00008b"], ["#ddd4e8", "#c4b5db", "#ac96ce", "#9378c1", "#785bb4", "#5c3fa6", "#3c2299", "#00008b"], ["#ddd4e8", "#c8b8dd", "#b29ed1", "#9c84c6", "#866aba", "#6e51af", "#5537a3", "#381e97", "#00008b"]]);

var fews9 = ["#4D4D4D", "#5DA5DA", "#FAA43A", "#60BD68", "#F17CB0", "#B2912F", "#B276B2", "#DECF3F", "#F15854"];

/*
	source: http://gka.github.io/palettes/
*/

var ylOrDr = new Array(3).concat([["#ffff00", "#d98300", "#8b0000"], ["#ffff00", "#edaa00", "#c15f01", "#8b0000"], ["#ffff00", "#f5be00", "#d98300", "#b44c02", "#8b0000"], ["#ffff00", "#f9ca00", "#e59b00", "#cb6c01", "#ac4002", "#8b0000"], ["#ffff00", "#fbd300", "#edaa00", "#d98300", "#c15f01", "#a73802", "#8b0000"], ["#ffff00", "#fdda00", "#f2b600", "#e29400", "#cf7401", "#ba5401", "#a33102", "#8b0000"], ["#ffff00", "#fdde00", "#f5be00", "#e8a100", "#d98300", "#c76801", "#b44c02", "#a02e02", "#8b0000"]]);

var dgOrDr = new Array(3).concat([["#006400", "#ff8c00", "#8b0000"], ["#006400", "#a48b00", "#ee4d00", "#8b0000"], ["#006400", "#798500", "#ff8c00", "#db3301", "#8b0000"], ["#006400", "#618100", "#c98d00", "#f96600", "#cd2401", "#8b0000"], ["#006400", "#4f7c00", "#a48b00", "#ff8c00", "#ee4d00", "#c31c02", "#8b0000"], ["#006400", "#437a00", "#8b8800", "#d78e00", "#fc6f00", "#e33e00", "#bb1502", "#8b0000"], ["#006400", "#3b7800", "#798500", "#b98d00", "#ff8c00", "#f55c00", "#db3301", "#b61102", "#8b0000"]]);

var greys$1 = d3.interpolateRgb("#d3d3d3", "#2a2a2a");
var blues$1 = d3.interpolateRgb("#add8e6", "#222b2e");
var blRd = d3.interpolateRgb("#0000ff", "#ff0000");

var setupDGF = {

	"dgf.schedulerInterval": {
		title: "Interval Scheduler",
		description: "Interval Scheduler",
		category: ["scheduler"],
		create: function create(tagFactory, name, value, callees) {
			var t = tagFactory.createTemplate(name, value, callees, interval$1());

			t.callback(function (selection) {
				selection.each(function () {
					var self = this;
					callees.forEach(function (c) {
						d3.select(self).call(c);
					});
				});
			});

			return t;
		}
	},

	"dgf.defaultReaderCallback": function dgfDefaultReaderCallback(callees) {
		return function (selection) {
			selection.each(function () {
				var self = this;
				callees.forEach(function (c) {
					d3.select(self).call(c);
				});
			});
		};
	},

	"dgf.defaultParserCallback": function dgfDefaultParserCallback(tagFactory, name, value) {
		return function (data) {
			if (value) {
				var parse = {};

				for (var i in value.parse) {
					var a = tagFactory.createExpression(value.parse[i].attribute) || value.parse[i].attribute,
					    p = tagFactory.createExpression(value.parse[i].parser) || value.parse[i].parser;

					if (typeof a === "function") {
						a = a.call(this, data);
					}
					parse[a] = p;
				}

				return data.map(function (d) {
					for (var a in parse) {
						if (typeof parse[a] === "function") {
							d[a] = parse[a].call(this, d[a]);
						}
					}
					return d;
				});
			}
		};
	},

	"dgf.readerDSV": {
		title: "DSV Reader",
		description: "Delimiter-Separated Reader",
		category: ["reader"],
		create: function create(tagFactory, name, value, callees) {
			var t = tagFactory.createTemplate(name, value, callees, dsv());
			t.parserCallback(tagFactory.lookup("dgf.defaultParserCallback").call(this, tagFactory, name, value));
			t.callback(tagFactory.lookup("dgf.defaultReaderCallback").call(this, callees));
			return t;
		}
	},

	"dgf.readerJSON": {
		title: "JSON Reader",
		description: "JSON Reader",
		category: ["reader"],
		create: function create(tagFactory, name, value, callees) {
			var t = tagFactory.createTemplate(name, value, callees, json$1());
			t.parserCallback(tagFactory.lookup("dgf.defaultParserCallback").call(this, tagFactory, name, value));
			t.callback(tagFactory.lookup("dgf.defaultReaderCallback").call(this, callees));
			return t;
		}
	},
	/*
 	"dgf.readerTestData": {
 		title: "Test Data Reader",
 		description: "Reader that creates random data",
 		category: ["reader"],
 		create: function(tagFactory, name, value, callees) {
 			var t = tagFactory.createTemplate(name, value, callees, readerTestData());
 			t.parserCallback(tagFactory.lookup("dgf.defaultParserCallback").call(this, name, value, callees));
 			t.callback(tagFactory.lookup("dgf.defaultReaderCallback").call(this, callees));			
 			return t;
 		}
 	},
 */

	"dgf.stylePlainCSS": {
		title: "Plain CSS",
		description: "Plain CSS Template",
		category: ["style"],
		create: function create(tagFactory, name, value, callees) {
			return tagFactory.createTemplate(name, value, callees, plainCSS());
		}
	},

	"dgf.styleResponsiveCSS": {
		title: "Responsive CSS",
		description: "Creates responsive css",
		category: ["style"],
		create: function create(tagFactory, name, value, callees) {
			return tagFactory.createTemplate(name, value, callees, responsiveCSS());
		}
	},

	"dgf.templateLayers": {
		title: "Layers Template (Container)",
		description: "Layered Template",
		category: ["template", "container"],
		create: function create(tagFactory, name, value, callees) {
			return tagFactory.createTemplate(name, value, callees, layers());
		}
	},

	"dgf.templateLegend": {
		title: "Legend",
		description: "Legend Template",
		category: ["template"],
		create: function create(tagFactory, name, value, callees) {
			return tagFactory.createTemplate(name, value, callees, legend());
		}
	},

	"dgf.templateBackground": {
		title: "Background",
		description: "Background Template",
		category: ["template"],
		create: function create(tagFactory, name, value, callees) {
			var t = tagFactory.createTemplate(name, value, callees, background()),
			    fill = t.fill();

			function findFirstColor(c) {
				if (typeof c === "string") return c;
				if (Array.isArray(c)) {
					for (var i = 0; i < c.length; i++) {
						if (c[i]) return findFirstColor(c[i]);
					}
				}
			}
			fill = findFirstColor(fill);
			t.fill(fill);
			return t;
		}
	},

	"dgf.templateImage": {
		title: "Image",
		description: "Image Template",
		category: ["template"],
		create: function create(tagFactory, name, value, callees) {
			return tagFactory.createTemplate(name, value, callees, image());
		}
	},

	"dgf.templateAxis": {
		title: "Axis",
		description: "X-/Y-Axis Template",
		category: ["template"],
		create: function create(tagFactory, name, value, callees) {
			return tagFactory.createTemplate(name, value, callees, axis());
		}
	},

	"dgf.templateBar": {
		title: "Bar",
		description: "Bar Template",
		category: ["template"],
		create: function create(tagFactory, name, value, callees) {
			var t = tagFactory.createTemplate(name, value, callees, bar());

			t.mouseOverCallback(function (d) {
				var figure = findParentBySelector(this, "figure"),
				    message = d3.select(figure).select("p.message");

				message.text(JSON.stringify(d).replace(/\"|{|}/g, "").replace(/,/g, ", "));
			});

			t.mouseLeaveCallback(function () {
				var figure = findParentBySelector(this, "figure"),
				    message = d3.select(figure).select("p.message");

				message.html("&zwnj;");
			});

			t.touchStartCallback(function (d) {
				var figure = findParentBySelector(this, "figure"),
				    message = d3.select(figure).select("p.message");

				message.text(JSON.stringify(d).replace(/\"|{|}/g, "").replace(/,/g, ", "));
			});

			return t;
		}
	},

	"dgf.templatePie": {
		title: "Pie",
		description: "Pie template",
		category: ["template"],
		create: function create(tagFactory, name, value, callees) {
			var t = tagFactory.createTemplate(name, value, callees, pie$1());

			t.mouseOverCallback(function (d) {
				var figure = findParentBySelector(this, "figure"),
				    message = d3.select(figure).select("p.message");

				message.text(JSON.stringify(d.data).replace(/\"|{|}/g, "").replace(/,/g, ", "));
			});

			t.mouseLeaveCallback(function () {
				var figure = findParentBySelector(this, "figure"),
				    message = d3.select(figure).select("p.message");

				message.html("&zwnj;");
			});

			t.touchStartCallback(function (d) {
				var figure = findParentBySelector(this, "figure"),
				    message = d3.select(figure).select("p.message");

				message.text(JSON.stringify(d.data).replace(/\"|{|}/g, "").replace(/,/g, ", "));
			});

			return t;
		}
	},

	"dgf.templateBubble": {
		title: "Bubble",
		description: "Bubble template",
		category: ["template"],
		create: function create(tagFactory, name, value, callees) {
			var t = tagFactory.createTemplate(name, value, callees, bubble());

			t.mouseOverCallback(function (d) {
				var figure = findParentBySelector(this, "figure"),
				    message = d3.select(figure).select("p.message");

				message.text(JSON.stringify(d.data.data).replace(/\"|{|}/g, "").replace(/,/g, ", "));
			});

			t.mouseLeaveCallback(function () {
				var figure = findParentBySelector(this, "figure"),
				    message = d3.select(figure).select("p.message");

				message.html("&zwnj;");
			});

			t.touchStartCallback(function (d) {
				var figure = findParentBySelector(this, "figure"),
				    message = d3.select(figure).select("p.message");

				message.text(JSON.stringify(d.data.data).replace(/\"|{|}/g, "").replace(/,/g, ", "));
			});

			return t;
		}
	},

	"dgf.templateLine": {
		title: "Line",
		description: "Line template",
		category: ["template"],
		create: function create(tagFactory, name, value, callees) {
			return tagFactory.createTemplate(name, value, callees, line$1());
		}
	},

	"dgf.templateDot": {
		title: "Dot",
		description: "Dot template",
		category: ["template"],
		create: function create(tagFactory, name, value, callees) {
			var t = tagFactory.createTemplate(name, value, callees, dot());
			t.mouseOverCallback(function (d) {
				var figure = findParentBySelector(this, "figure"),
				    message = d3.select(figure).select("p.message");

				message.text(JSON.stringify(d).replace(/\"|{|}/g, "").replace(/,/g, ", "));
			});

			t.mouseLeaveCallback(function () {
				var figure = findParentBySelector(this, "figure"),
				    message = d3.select(figure).select("p.message");

				message.html("&zwnj;");
			});

			t.touchStartCallback(function (d) {
				var figure = findParentBySelector(this, "figure"),
				    message = d3.select(figure).select("p.message");

				message.text(JSON.stringify(d).replace(/\"|{|}/g, "").replace(/,/g, ", "));
			});

			return t;
		}
	},

	"dgf.templateLabel": {
		title: "Label",
		description: "Label template",
		category: ["template"],
		create: function create(tagFactory, name, value, callees) {
			return tagFactory.createTemplate(name, value, callees, label());
		}
	},

	"dgf.templateArcLabel": {
		title: "Arc Label",
		description: "Arc label template",
		category: ["template"],
		create: function create(tagFactory, name, value, callees) {
			var t = tagFactory.createTemplate(name, value, callees, arcLabel());

			t.mouseOverCallback(function (d) {
				var figure = findParentBySelector(this, "figure"),
				    message = d3.select(figure).select("p.message");

				message.text(JSON.stringify(d.data).replace(/\"|{|}/g, "").replace(/,/g, ", "));
			});

			t.mouseLeaveCallback(function () {
				var figure = findParentBySelector(this, "figure"),
				    message = d3.select(figure).select("p.message");

				message.html("&zwnj;");
			});

			t.touchStartCallback(function (d) {
				var figure = findParentBySelector(this, "figure"),
				    message = d3.select(figure).select("p.message");

				message.text(JSON.stringify(d.data).replace(/\"|{|}/g, "").replace(/,/g, ", "));
			});

			return t;
		}
	},

	"dgf.templatePackLabel": {
		title: "Pack Label",
		description: "Pack label template",
		category: ["template"],
		create: function create(tagFactory, name, value, callees) {
			var t = tagFactory.createTemplate(name, value, callees, packLabel());

			t.mouseOverCallback(function (d) {
				var figure = findParentBySelector(this, "figure"),
				    message = d3.select(figure).select("p.message");

				message.text(JSON.stringify(d.data.data).replace(/\"|{|}/g, "").replace(/,/g, ", "));
			});

			t.mouseLeaveCallback(function () {
				var figure = findParentBySelector(this, "figure"),
				    message = d3.select(figure).select("p.message");

				message.html("&zwnj;");
			});

			t.touchStartCallback(function (d) {
				var figure = findParentBySelector(this, "figure"),
				    message = d3.select(figure).select("p.message");

				message.text(JSON.stringify(d.data.data).replace(/\"|{|}/g, "").replace(/,/g, ", "));
			});

			return t;
		}
	},

	"dgf.schemeFews9": {
		title: "Fews 9",
		description: "Fews 9",
		category: ["scheme", "categorical"],
		create: function create() {
			return fews9;
		}
	},

	"dgf.schemeGreys": {
		title: "Basic Greys",
		description: "Grey Shades",
		category: ["scheme", "sequential", "single hue"],
		create: function create() {
			return greys;
		}
	},

	"dgf.schemeBlues": {
		title: "Basic Blues",
		description: "Blue Shades",
		category: ["scheme", "sequential", "single hue"],
		create: function create() {
			return blues;
		}
	},

	"dgf.schemeDefault": {
		title: "Default",
		description: "Default Scheme",
		category: ["scheme"],
		create: function create() {
			return greys;
		}
	},

	"dgf.schemeYlOrDr": {
		title: "Basic YlOrDr",
		description: "Yellow Orange Darkred",
		category: ["scheme", "sequential", "multi hue"],
		create: function create() {
			return ylOrDr;
		}
	},

	"dgf.schemeDgOrDr": {
		title: "Basic DgOrDr",
		description: "Darkgreen Orange Darkred",
		category: ["scheme", "sequential", "multi hue"],
		create: function create() {
			return dgOrDr;
		}
	},

	// Interpolate
	"dgf.interpolateGreys": {
		title: "Basic Greys",
		description: "Interpolate Greys",
		category: ["interpolate", "sequential", "single hue"],
		create: function create() {
			return greys$1;
		}
	},

	"dgf.interpolateBlues": {
		title: "Basic Blues",
		description: "Interpolate Blues",
		category: ["interpolate", "sequential", "single hue"],
		create: function create() {
			return blues$1;
		}
	},

	"dgf.interpolateBlRd": {
		title: "Basic BlRd",
		description: "Interpolate Blue-Red",
		category: ["interpolate", "sequential", "multi hue"],
		create: function create() {
			return blRd;
		}
	}
};

var setupBasic = {
	"dgf.setupEmptyLayers": {
		"title": "Empty Layers",
		"description": "Empty Layers diagram setup",
		"category": ["setup"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersLarge",
			"reader": {
				"type": "dgf.readerDSV",
				"delimiter": "comma"
			},
			"template": {
				"type": "dgf.templateLayers",
				"width": 480,
				"height": 270,
				"inheritSize": "clientWidth",
				"margin": { "top": 40, "right": 40, "bottom": 40, "left": 40 }
			},
			"style": {
				"type": "dgf.styleResponsiveCSS",
				"smartphone": {
					"figure": {
						"width": "90%"
					}
				},
				"tablet": {
					"figure": {
						"width": "70%"
					}
				},
				"desktop": {
					"figure": {
						"width": "60%"
					}
				}
			}
		}
	},

	"dgf.setupAxisOrdinalLinear": {
		"title": "Axis Ordinal/Linear",
		"description": "Ordinal/linear axis setup",
		"category": ["setup", "ordinal/linear", "axis"],
		"data-dgf": {
			"reader": {
				"type": "dgf.readerDSV",
				"delimiter": "comma",
				"parse": {
					"rule0": {
						"attribute": "keysAt(1)",
						"parser": "numberParse()"
					}
				}
			},
			"template": {
				"x": "dataAt(0)",
				"y": "dataAt(1)",
				"key": "dataAt(0)",
				"color": "dataAt(0)",
				"xScale": {
					"type": "d3.scaleBand",
					"domain": "map()",
					"paddingInner": 0.1,
					"paddingOuter": 0.2
				},
				"yScale": {
					"type": "d3.scaleLinear",
					"domain": "extentZero()"
				},
				"colorScale": {
					"type": "d3.scaleOrdinal",
					"domain": "map()",
					"range": "dgf.schemeDefault"
				},
				"layer0": {
					"type": "dgf.templateAxis",
					"yLabel": "yKey()"
				}
			},
			"extend": "dgf.setupEmptyLayers"
		}
	},

	"dgf.setupBarDiagram": {
		"title": "Bar Diagram",
		"description": "Basic bar diagram",
		"category": ["setup", "ordinal/linear", "bar"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersSmall",
			"template": {
				"layer1": {
					"type": "dgf.templateBar"
				}
			},
			"extend": "dgf.setupAxisOrdinalLinear"
		}
	},

	"dgf.setupBarDiagramWithLabel": {
		"title": "Bar Diagram with Label",
		"description": "Basic bar diagram with label",
		"category": ["setup", "ordinal/linear", "bar"],
		"data-dgf": {
			"template": {
				"text": "dataAt(1)",
				"layer0": {
					"xHide": false,
					"yHide": false,
					"y1Hide": true
				},
				"layer2": {
					"type": "dgf.templateLabel",
					"dy": "thresholdAt(1,0,0.72em,-0.72em)"
				}
			},
			"extend": "dgf.setupBarDiagram"
		}
	},

	"dgf.setupBarDiagramStandard": {
		"title": "Bar Diagram",
		"description": "Standard bar diagram",
		"category": ["setup"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersSmall",
			"extend": "dgf.setupBarDiagramWithLabel"
		}
	},

	"dgf.setupPieDiagram": {
		"title": "Pie Diagram",
		"description": "Basic pie diagram",
		"category": ["setup", "ordinal/linear", "pie"],
		"data-dgf": {
			"reader": {
				"type": "dgf.readerDSV",
				"delimiter": "comma",
				"parse": {
					"rule0": {
						"attribute": "keysAt(1)",
						"parser": "numberParse()"
					}
				}
			},
			"template": {
				"x": "dataAt(0)",
				"y": "dataAt(1)",
				"key": "dataAt(0)",
				"color": "dataAt(0)",
				"text": "dataAt(0)",
				"colorScale": {
					"type": "d3.scaleOrdinal",
					"domain": "map()",
					"range": "dgf.schemeDefault"
				},
				"layer0": {
					"type": "dgf.templatePie"
				}
			},
			"extend": "dgf.setupEmptyLayers"
		}
	},

	"dgf.setupPieDiagramWithLabel": {
		"title": "Pie Diagram with Label",
		"description": "Basic pie diagram with label",
		"category": ["setup", "ordinal/linear", "pie"],
		"data-dgf": {
			"template": {
				"layer1": {
					"type": "dgf.templateArcLabel",
					"colorScale": {
						"type": "d3.scaleOrdinal",
						"domain": "0",
						"range": "black"
					}
				}
			},
			"extend": "dgf.setupPieDiagram"
		}
	},

	"dgf.setupPieDiagramStandard": {
		"title": "Pie Diagram",
		"description": "Standard pie diagram",
		"category": ["setup"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersSmall",
			"extend": "dgf.setupPieDiagramWithLabel"
		}
	},

	"dgf.setupDonutDiagram": {
		"title": "Donut Diagram",
		"description": "Basic donut diagram",
		"category": ["setup", "ordinal/linear", "donut"],
		"data-dgf": {
			"reader": {
				"type": "dgf.readerDSV",
				"delimiter": "comma",
				"parse": {
					"rule0": {
						"attribute": "keysAt(1)",
						"parser": "numberParse()"
					}
				}
			},
			"template": {
				"x": "dataAt(0)",
				"y": "dataAt(1)",
				"key": "dataAt(0)",
				"color": "dataAt(0)",
				"text": "dataAt(0)",
				"colorScale": {
					"type": "d3.scaleOrdinal",
					"domain": "map()",
					"range": "dgf.schemeDefault"
				},
				"layer0": {
					"type": "dgf.templatePie",
					"yLabel": "yKey()",
					"arc": {
						"innerRadius": "0.7"
					}
				}
			},
			"extend": "dgf.setupEmptyLayers"
		}
	},

	"dgf.setupDonutDiagramWithLabel": {
		"title": "Donut Diagram with Label",
		"description": "Basic donut diagram with label",
		"category": ["setup", "ordinal/linear", "donut"],
		"data-dgf": {
			"template": {
				"layer1": {
					"type": "dgf.templateArcLabel",
					"colorScale": {
						"type": "d3.scaleOrdinal",
						"domain": "0",
						"range": "black"
					},
					"arc": {
						"innerRadius": "0.9"
					}
				}
			},
			"extend": "dgf.setupDonutDiagram"
		}
	},

	"dgf.setupDonutDiagramStandard": {
		"title": "Donut Diagram",
		"description": "Standard donut diagram",
		"category": ["setup"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersSmall",
			"extend": "dgf.setupDonutDiagramWithLabel"
		}
	},

	"dgf.setupAxisLinearLinear": {
		"title": "Axis Linear/Linear",
		"description": "Linear/linear axis setup",
		"category": ["setup", "linear/linear", "axis"],
		"data-dgf": {
			"reader": {
				"delimiter": "comma",
				"parse": {
					"rule0": {
						"attribute": "keysAt(0)", "parser": "numberParse()"
					},
					"rule1": {
						"attribute": "keysAt(1)", "parser": "numberParse()"
					}
				}
			},
			"template": {
				"x": "dataAt(0)",
				"y": "dataAt(1)",
				"color": "dataAt(0)",
				"xScale": {
					"type": "d3.scaleLinear",
					"domain": "extentZero()"
				},
				"yScale": {
					"type": "d3.scaleLinear",
					"domain": "extentZero()"
				},
				"colorScale": {
					"type": "d3.scaleOrdinal",
					"domain": "map()",
					"range": "dgf.schemeDefault"
				},
				"layer0": {
					"type": "dgf.templateAxis",
					"xLabel": "xKey()",
					"yLabel": "yKey()",
					"xHide": false,
					"yHide": false,
					"y1Hide": false
				}
			},
			"extend": "dgf.setupEmptyLayers"
		}
	},

	"dgf.setupLineDiagram": {
		"title": "Line Diagram",
		"description": "Basic line diagram",
		"category": ["setup", "linear/linear", "line"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersSmall",
			"template": {
				"layer0": {
					"y1Hide": true
				},
				"layer1": {
					"type": "dgf.templateLine",
					"line": {
						"type": "d3.line"
					}
				}
			},
			"extend": "dgf.setupAxisLinearLinear"
		}
	},

	"dgf.setupLineDiagramWithDots": {
		"title": "Line Diagram with Dots",
		"description": "Line diagram with datapoints as dots",
		"category": ["setup", "linear/linear", "line"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersSmall",
			"template": {
				"y1": "dataAt(1)",
				"y1Scale": {
					"type": "d3.scaleSqrt",
					"domain": "extent()",
					"range": "6,6"
				},
				"layer2": {
					"type": "dgf.templateDot"
				}
			},
			"extend": "dgf.setupLineDiagram"
		}
	},

	"dgf.setupLineDiagramStandard": {
		"title": "Line Diagram",
		"description": "Standard line diagram",
		"category": ["setup"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersSmall",
			"extend": "dgf.setupLineDiagramWithDots"
		}
	},

	"dgf.setupLineDiagramNaturalCurve": {
		"title": "Line Diagram (Natural Curve)",
		"description": "Line diagram with natural curve",
		"category": ["setup", "linear/linear", "line"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersSmall",
			"template": {
				"layer0": {
					"y1Hide": true
				},
				"layer1": {
					"type": "dgf.templateLine",
					"line": {
						"type": "d3.line",
						"curve": {
							"type": "d3.curveNatural"
						}
					}
				}
			},
			"extend": "dgf.setupAxisLinearLinear"
		}
	},

	"dgf.setupScatterDiagramWithLabels": {
		"title": "Scatter Diagram With Labels",
		"description": "Scatter diagram with name (label), x and y",
		"category": ["setup", "linear/linear", "scatter"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersSmall",
			"reader": {
				"parse": {
					"rule0": {
						"attribute": "keysAt(1)"
					},
					"rule1": {
						"attribute": "keysAt(2)"
					}
				}
			},
			"template": {
				"margin": {
					"right": 60
				},
				"x": "dataAt(1)",
				"y": "dataAt(2)",
				"xScale": {
					"domain": "extentZero()"
				},
				"yScale": {
					"domain": "extentZero()"
				},
				"layer0": {
					"xLabel": "xKey()",
					"yLabel": "yKey()",
					"y1Hide": true
				},
				"text": "dataAt(0)",
				"layer1": {
					"type": "dgf.templateDot"
				},
				"layer2": {
					"type": "dgf.templateLabel",
					"anchor": "start",
					"dx": "1em",
					"y1Scale": {
						"type": "d3.scaleLinear",
						"domain": "extentAt(2)",
						"range": "0.74,2"
					}
				},
				"key": "dataAt(0)",
				"y1Scale": {
					"type": "d3.scaleSqrt",
					"domain": "extent()",
					"range": "4,20"
				},
				"y1": "dataAt(2)"
			},
			"extend": "dgf.setupAxisLinearLinear"
		}
	},

	"dgf.setupScatterDiagramStandard": {
		"title": "Scatter Diagram",
		"description": "Standard scatter diagram",
		"category": ["setup"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersSmall",
			"extend": "dgf.setupScatterDiagramWithLabels"
		}
	}
};

var setupHierarchic = {

	"dgf.setupBubbleDiagram": {
		"title": "Bubble Diagram",
		"description": "Basic bubble diagram",
		"category": ["setup", "hierarchic/linear", "bubble"],
		"data-dgf": {
			"reader": {
				"type": "dgf.readerDSV",
				"delimiter": "comma",
				"parse": {
					"rule0": {
						"attribute": "keysAt(1)",
						"parser": "numberParse()"
					}
				}
			},
			"template": {
				"width": 480,
				"height": 320,
				"inheritSize": "clientWidth",
				"margin": { "top": 10, "right": 10, "bottom": 10, "left": 10 },
				"x": "dataAt(0)",
				"y": "dataAt(1)",
				"color": "dataAt(0)",
				"text": "dataAt(0)",
				"colorScale": {
					"type": "d3.scaleOrdinal",
					"domain": "map()",
					"range": "dgf.schemeDefault"
				},
				"layer0": {
					"type": "dgf.templateBubble",
					"pack": {
						"padding": "1.5"
					},
					"sort": {
						"type": "d3.ascending"
					},
					"yLabel": "yKey()"
				}
			},
			"style": {
				"type": "dgf.styleResponsiveCSS",
				"smartphone": {
					"figure": {
						"width": "90%"
					}
				},
				"tablet": {
					"figure": {
						"width": "70%"
					}
				},
				"desktop": {
					"figure": {
						"width": "60%"
					}
				}
			},
			"extend": "dgf.setupEmptyLayers"
		}
	},

	"dgf.setupBubbleDiagramWithLabel": {
		"title": "Bubble Diagram with Label",
		"description": "Basic bubble diagram with label",
		"category": ["setup", "hierarchic/linear", "bubble"],
		"data-dgf": {
			"template": {
				"y1": "dataAt(1)",
				"y1Scale": {
					"type": "d3.scaleSqrt",
					"domain": "extentZeroAt(1)",
					"range": "0.1,1.2"
				},
				"layer1": {
					"type": "dgf.templatePackLabel",
					"pack": {
						"padding": "1.5"
					},
					"sort": {
						"type": "d3.ascending"
					},
					"colorScale": {
						"type": "d3.scaleOrdinal",
						"domain": "0",
						"range": "white"
					}
				}
			},
			"extend": "dgf.setupBubbleDiagram"
		}
	},

	"dgf.setupBubbleDiagramStandard": {
		"title": "Bubble Diagram",
		"description": "Standard bubble diagram",
		"category": ["setup"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersSmall",
			"extend": "dgf.setupBubbleDiagramWithLabel"
		}
	},

	"dgf.setupPackLabelDiagram": {
		"title": "Pack Label Diagram",
		"description": "Basic pack label diagram",
		"category": ["setup", "hierarchic/linear", "label"],
		"data-dgf": {
			"reader": {
				"type": "dgf.readerDSV",
				"delimiter": "comma",
				"parse": {
					"rule0": {
						"attribute": "keysAt(1)",
						"parser": "numberParse()"
					}
				}
			},
			"template": {
				"width": 480,
				"height": 320,
				"inheritSize": "clientWidth",
				"margin": { "top": 10, "right": 10, "bottom": 10, "left": 10 },
				"x": "dataAt(0)",
				"y": "dataAt(1)",
				"color": "dataAt(0)",
				"text": "dataAt(0)",
				"colorScale": {
					"type": "d3.scaleOrdinal",
					"domain": "map()",
					"range": "dgf.schemeDefault"
				},
				"layer0": {
					"type": "dgf.templatePackLabel",
					"pack": {
						"padding": "1.5"
					},
					"yLabel": "yKey()"
				}
			},
			"style": {
				"type": "dgf.styleResponsiveCSS",
				"smartphone": {
					"figure": {
						"width": "90%"
					}
				},
				"tablet": {
					"figure": {
						"width": "70%"
					}
				},
				"desktop": {
					"figure": {
						"width": "60%"
					}
				}
			},
			"extend": "dgf.setupEmptyLayers"
		}
	}
};

var setupTime = {
	"dgf.setupAxisTimeLinear": {
		"title": "Axis Time/Linear",
		"description": "Time/linear axis setup",
		"category": ["setup", "time/linear", "axis"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersSmall",
			"reader": {
				"parse": {
					"rule0": {
						"attribute": "keysAt(0)",
						"parser": "timeParse(%Y-%m-%d)"
					},
					"rule1": {
						"attribute": "keysAt(1)",
						"parser": "numberParse()"
					}
				}
			},
			"template": {
				"x": "dataAt(0)",
				"y": "dataAt(1)",
				"color": "dataAt(0)",
				"xScale": {
					"type": "d3.scaleTime",
					"domain": "extent()"
				},
				"yScale": {
					"type": "d3.scaleLinear",
					"domain": "extentZero()"
				},
				"colorScale": {
					"type": "d3.scaleOrdinal",
					"domain": "map()",
					"range": "dgf.schemeDefault"
				},
				"layer0": {
					"type": "dgf.templateAxis",
					"xHide": false,
					"yHide": false,
					"y1Hide": false,
					"yLabel": "yKey()",
					"xLabel": "xKey()"
				}
			},
			"extend": "dgf.setupEmptyLayers"
		}
	},

	"dgf.setupTimeLineDot": {
		"title": "Line/Dot Diagram with Time Scale",
		"description": "Line diagram with Dots with a time scale",
		"category": ["setup", "time/linear"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersSmall",
			"template": {
				"margin": {
					"top": 30
				},
				"layer1": {
					"type": "dgf.templateLine",
					"y1": "dataAt(1)",
					"line": {
						"type": "d3.line"
					}
				},
				"layer2": {
					"type": "dgf.templateDot",
					"line": {
						"type": "d3.line"
					},
					"y1Scale": {
						"type": "d3.scaleLinear",
						"domain": "extentAt(1)",
						"range": "6,6"
					}
				},
				"y1": "dataAt(1)",
				"layer3": {
					"type": "dgf.templateLabel",
					"y1Scale": {
						"type": "d3.scaleLinear",
						"domain": "extentAt(1)",
						"range": "1,1"
					},
					"dy": "-1.5em"
				},
				"text": "dataAt(1)"
			},
			"extend": "dgf.setupAxisTimeLinear"
		}
	}
};

var setupMultiSeries = {
	"dgf.setupMultiSeriesLineDiagram": {
		"title": "Lines Diagram",
		"description": "Basic multi-series line diagram",
		"category": ["setup", "multi-series", "linear/linear"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersSmall",
			"reader": {
				"parse": {
					"rule0": {
						"attribute": "keysAt(0)",
						"parser": "numberParse()"
					},
					"rule1": {
						"attribute": "keysAt(1)",
						"parser": "numberParse()"
					},
					"rule2": {
						"attribute": "keysAt(2)",
						"parser": "numberParse()"
					}
				}
			},
			"template": {
				"x": "dataAt(0)",
				"y": "dataAt(1)",
				"xScale": {
					"type": "d3.scaleLinear",
					"domain": "extentZero()"
				}, "yScale": {
					"type": "d3.scaleLinear",
					"domain": "extentZero()"
				},
				"colorScale": {
					"type": "d3.scaleOrdinal",
					"domain": "keys()",
					"range": "dgf.schemeDefault"
				},
				"layer0": {
					"type": "dgf.templateAxis",
					"xHide": false,
					"yHide": false,
					"y1Hide": false,
					"xLabel": "xKey()",
					"yLabel": "yKey()"
				},
				"layer1": {
					"type": "dgf.templateLine",
					"y": "dataAt(1)",
					"line": {
						"type": "d3.line"
					},
					"color": "keysAt(1)",
					"label": "keysAt(1)"
				},
				"layer2": {
					"type": "dgf.templateLine",
					"y": "dataAt(2)",
					"line": {
						"type": "d3.line"
					},
					"color": "keysAt(2)",
					"label": "keysAt(2)"
				}
			},
			"extend": "dgf.setupEmptyLayers"
		}
	},
	"dgf.setupMultiSeriesTwoBarsCompareDiagram": {
		"title": "Two Bars Compare Diagram",
		"description": "Two Bars Comparison: Compare two data series (e.g., old / new).",
		"category": ["setup", "multi-series", "ordinal/linear"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersSmall",
			"reader": {
				"parse": {
					"rule0": {
						"attribute": "keysAt(1)",
						"parser": "numberParse()"
					},
					"rule1": {
						"attribute": "keysAt(2)",
						"parser": "numberParse()"
					}
				}
			},
			"template": {
				"x": "dataAt(0)",
				"y": "dataAt(1)",
				"color": "dataAt(1)",
				"xScale": {
					"type": "d3.scaleBand",
					"domain": "map()",
					"paddingInner": 0.5,
					"paddingOuter": 0.25
				},
				"yScale": {
					"type": "d3.scaleLinear",
					"domain": "extentZero()"
				},
				"colorScale": {
					"type": "d3.scaleOrdinal",
					"domain": "0",
					"range": "dimgray"
				},
				"layer0": {
					"type": "dgf.templateAxis",
					"xHide": false,
					"yHide": false,
					"y1Hide": false
				},
				"layer1": {
					"type": "dgf.templateBar",
					"color": "dataAt(1)",
					"colorScale": {
						"type": "d3.scaleOrdinal",
						"domain": "0",
						"range": "gray"
					},
					"y": "dataAt(1)"
				},
				"layer2": {
					"type": "dgf.templateBar",
					"y": "dataAt(2)",
					"color": "dataAt(2)"
				},
				"layer3": {
					"type": "dgf.templateLabel",
					"y": "dataAt(1)",
					"color": "dataAt(1)",
					"text": "dataAt(1)",
					"colorScale": {
						"type": "d3.scaleOrdinal",
						"domain": "0",
						"range": "lightgray"
					},
					"dy": "thresholdAt(1,0,0.74em,-0.74em)"
				},
				"layer4": {
					"type": "dgf.templateLabel",
					"y": "dataAt(2)",
					"color": "dataAt(2)",
					"text": "dataAt(2)",
					"dy": "thresholdAt(2,0,0.74em,-0.74em)"
				}
			},
			"style": {
				"css": "#id g.i2 .bar { opacity: 0.4; }\n#id g.i3 .bar { opacity: 0.6; }"
			},
			"extend": "dgf.setupEmptyLayers"
		}
	}
};

var setupGallery = {
	"gallery.setupDonutDiagramWithLabel": {
		"title": "Donut Diagram with Labels",
		"description": "<b>Donut Diagramm</b>: The labels are automatically repositioned when data is updated. On <em>mouse over</em> (or <em>tap</em> on touch devices) the message below this caption shows the values of the data point.",
		"category": ["setup", "gallery"],
		"data-dgf": {
			"reader": {
				"data": "name,distance,speed,distance*speed\nAnna,15.5,9.5,147.3\nBeat,33.2,11.2,371.8\nCarl,9.5,14.9,141.6\nDiana,45.3,12.5,566.3\nEmma,9.7,11.6,112.5\nFrank,11.6,11.0,127.6\nGaby,21.6,9.8,211.7\nHans,35.2,14.3,503.4"
			},
			"template": {
				"colorScale": {
					"range": "dgf.schemeGreys"
				}
			},
			"extend": "dgf.setupDonutDiagramStandard"
		}
	},

	"gallery.setupBubbleDiagramWithLabel": {
		"title": "Bubble Diagram with Labels",
		"description": "<b>Bubble Diagram</b>: The size of the bubbles represents the running distance. The (interpolated) color the average speed.",
		"category": ["setup", "gallery"],
		"data-dgf": {
			"reader": {
				"parse": {
					"rule1": {
						"attribute": "keysAt(2)",
						"parser": "numberParse()"
					}
				},
				"data": "name,distance,speed,distance*speed\nAnna,15.5,9.5,147.3\nBeat,33.2,11.2,371.8\nCarl,9.5,14.9,141.6\nDiana,45.3,12.5,566.3\nEmma,9.7,11.6,112.5\nFrank,11.6,11.0,127.6\nGaby,21.6,9.8,211.7\nHans,35.2,14.3,503.4\nIrene,12.5,14.5,181.3\nJacob,29.5,13.7,404.2\nKonstantin,41.2,8.3,342\nLaura,33.7,12.9,434.7"
			},
			"template": {
				"color": "dataAt(3)",
				"colorScale": {
					"type": "d3.scaleSequential",
					"domain": "extentAt(3)",
					"range": "interpolateLab(lime,red)"
				},
				"layer0": {
					"bubble": {
						"noFill": false
					}
				}
			},
			"extend": "dgf.setupBubbleDiagramStandard"
		}
	},

	"gallery.setupScatterDiagramWithLabels": {
		"title": "Scatter Diagram with Labels",
		"description": "<b>Scatter Diagram with Labels</b>: The size of the data points shows distance x speed.<br />On <em>mouse over</em> (or <em>tap</em> on touch devices) the message below this caption shows the values of the data point.",
		"category": ["setup", "gallery"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersLarge",
			"reader": {
				"parse": {
					"rule2": {
						"attribute": "keysAt(3)",
						"parser": "numberParse()"
					}
				},
				"data": "name,distance,speed,distance*speed\nAnna,15.5,9.5,147.3\nBeat,33.2,11.2,371.8\nCarl,9.5,14.9,141.6\nDiana,45.3,12.5,566.3\nEmma,9.7,11.6,112.5\nFrank,11.6,11.0,127.6\nGaby,21.6,9.8,211.7\nHans,35.2,14.3,503.4\nIrene,12.5,14.5,181.3\nJacob,29.5,13.7,404.2\nKonstantin,41.2,8.3,342\nLaura,33.7,12.9,434.7"
			},
			"template": {
				"height": 350,
				"margin": {
					"right": 40
				},
				"color": "dataAt(3)",
				"xScale": {
					"domain": "5,50"
				},
				"yScale": {
					"domain": "7.5,15"
				},
				"colorScale": {
					"type": "d3.scaleSequential",
					"domain": "extentAt(3)",
					"range": "interpolateLab(lime,red)"
				},
				"layer0": {
					"yGrid": {
						"strokeDashArray": "2,2"
					},
					"xGrid": {
						"strokeDashArray": "2,2"
					},
					"xTicks": 5
				},
				"layer2": {
					"y1Scale": {
						"domain": "extentAt(3)",
						"range": "0.74,1.5"
					}
				},
				"y1Scale": {
					"range": "5,20"
				},
				"y1": "dataAt(3)"
			},
			"extend": "dgf.setupScatterDiagramWithLabels"
		}
	},

	"gallery.setupMultiSeriesTwoBarsCompareDiagram": {
		"title": "Two Bars Compare Diagram",
		"description": "<b>Two Bars Comparison</b>: Compare two data series (e.g., old / new).",
		"category": ["setup", "gallery"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersSmall",
			"reader": {
				"data": "x,old,new\nA,5,2\nB,3,4\nC,9,6\nE,7,8\nF,5,8\nG,3,2\nH,11,7",
				"cacheData": true
			},
			"template": {
				"colorScale": {
					"range": "red"
				}
			},
			"extend": "dgf.setupMultiSeriesTwoBarsCompareDiagram"
		}
	},

	"gallery.setupBarDiagramWithLabel": {
		"title": "Bar Diagram with Labels",
		"description": "<b>Bar Diagram with Labels</b>: On <em>mouse over</em> (or <em>tap</em> on touch devices) the message below this caption shows the values of the data point.",
		"category": ["setup", "gallery"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersMedium",
			"reader": {
				"data": "name,km/week\nAnna,15.5\nBeat,33.2\nCarl,9.5\nDoris,45.3\nEmma,9.7",
				"cacheData": true
			},
			"template": {
				"yScale": {
					"domain": "0,50"
				},
				"colorScale": {
					"range": "darkorange"
				}
			},
			"extend": "dgf.setupBarDiagramWithLabel"
		}
	},

	"gallery.setupLineDiagramWithDots": {
		"title": "Line Diagram with Dots",
		"description": "<b>Line Diagram with Dots</b>: The data points of the line are maked with dots.<br />On <em>mouse over</em> (or <em>tap</em> on touch devices) the message below this caption shows the values of the data point.",
		"category": ["setup", "gallery"],
		"data-dgf": {
			"template": {
				"colorScale": {
					"range": "darkblue"
				}
			},
			"reader": {
				"data": "x,y\n1,2\n3,4\n5,3\n9,1\n15,9\n19,11\n25,9\n31,6\n35,8\n40,12"
			},
			"extend": "dgf.setupLineDiagramWithDots"
		}
	},

	"gallery.setupLineDiagramNaturalCurve": {
		"title": "Line Diagram with Natural Curve",
		"description": "<b>Line Diagram with Natural Curve</b>: The line forms a natural curve between the data points.",
		"category": ["setup", "gallery"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersMedium",
			"reader": {
				"data": "x,y\n1,2\n3,4\n5,3\n9,1\n15,9\n19,11\n25,9\n31,6\n35,8\n40,12"
			},
			"template": {
				"colorScale": {
					"range": "darkblue"
				},
				"layer1": {
					"strokeWidth": "8px"
				}
			},
			"extend": "dgf.setupLineDiagramNaturalCurve"
		}
	},

	"gallery.setupBarDiagramWithBackgroundImage": {
		"title": "Bar Diagram with Background Image",
		"description": "<strong>Bar Diagram with Background Image</strong>: It is easy to set a background image to a diagram.",
		"category": ["setup", "gallery"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersLarge",
			"reader": {
				"data": "name,steps/week\nAnna,15.5\nBeat,33.2\nCarl,9.5\nDoris,45.3\nEmma,9.7",
				"cacheData": true
			},
			"template": {
				"yScale": {
					"domain": "0,50"
				},
				"colorScale": {
					"range": "tomato"
				},
				"layer3": {
					"type": "dgf.templateImage",
					"layer": { "zIndex": -1 },
					"url": "https://dgfjs.org/resources/stairway.jpg",
					"preserveAspectRatio": {
						"align": "xMidYMid",
						"meetOrSlice": "slice"
					},
					"transition": {
						"ease": "d3.easeLinear",
						"delay": "0",
						"duration": "0"
					}
				}
			},
			"style": {
				"css": "#id .bar { opacity: 0.8; }"
			},
			"extend": "dgf.setupBarDiagramWithLabel"
		}
	},

	"gallery.setupBarDiagramWithThresholdColorScale": {
		"title": "Bar Diagram with Threshold Color Scale",
		"description": "<b>Bar Diagram with a Threshold Color Scale</b>: The data is random and updated every 5 seconds from a remote data service. The bars update with a sinusoidal transitions with a duration of 1 second. The color scale uses the following thresholds:<br />&lt;25 <span style='color:lightblue'>lightblue</span>, &lt;50 <span style='color:blue'>blue</span>, &lt;75 <span style='color:orange'>orange</span>, &gt;=75 <span style='color:red'>red</span>",
		"category": ["setup", "gallery"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersSmall",
			"reader": {
				"type": "dgf.readerJSON",
				"url": "https://dgfjs.org/resources/random-data.php"
			},
			"template": {
				"color": "dataAt(1)",
				"xScale": {
					"paddingInner": 0.5
				},
				"yScale": {
					"domain": "0,100"
				},
				"colorScale": {
					"type": "d3.scaleThreshold",
					"domain": "25,50,75",
					"range": "lightblue,blue,orange,red"
				},
				"layer0": {
					"yTickValues": "25,50,75,100",
					"yGrid": {
						"strokeDashArray": "2,2"
					}
				},
				"transition": {
					"ease": "d3.easeSin",
					"delay": "indexed(250)",
					"duration": "1000"
				}
			},
			"extend": "dgf.setupBarDiagramWithLabel",
			"scheduler": {
				"type": "dgf.schedulerInterval",
				"interval": "5000",
				"repeat": "3"
			}
		}
	},

	"gallery.setupMultiSeriesLineDiagram": {
		"title": "Line Diagram with Two DataSeries",
		"description": "<b>Line diagram with two data series</b>: This setup uses two line diagrams on different layers one above the other.",
		"category": ["setup", "gallery"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersLarge",
			"reader": {
				"data": "x,distance,speed\n0,0.25,8\n1,0.5,4\n3,1,2\n5,2,1\n7,4,2\n9,8,4\n11,16,8",
				"cacheData": true
			},
			"template": {
				"margin": {
					"right": 100
				},
				"colorScale": {
					"range": "dgf.schemeFews9"
				},
				"layer1": {
					"strokeWidth": "2px"
				},
				"layer2": {
					"strokeWidth": "2px"
				}
			},
			"extend": "dgf.setupMultiSeriesLineDiagram"
		}
	},

	"gallery.setupTimeLineDotDiagram": {
		"title": "Line Diagram with Dots and a Time Based Scale",
		"description": "<b>Line Diagram with Dots and a Time Based Scale</b>: This setup uses a time-based x-axis.",
		"category": ["setup", "gallery"],
		"data-dgf": {
			"dialog": "dgf.dialogLayersSmall",
			"reader": {
				"data": "month,km/week\n2017-01-15,0.5\n2017-03-15,1.7\n2017-05-01,2.4\n2017-06-05,4\n2017-06-28,8.5\n2017-09-15,16.8",
				"cacheData": true
			},
			"template": {
				"colorScale": {
					"range": "darkgoldenrod"
				}
			},
			"extend": "dgf.setupTimeLineDot"
		}
	}
};

function legend() {

	var layer, classed, orient, width, height, margin, key, x, y, color, xScale, yScale, colorScale, transition$$1, enterTransition, exitTransition, callback, enterCallback, exitCallback, mouseOverCallback, mouseLeaveCallback, touchStartCallback, touchEndCallback, label, position, interpolateSteps, textFormat, handle;

	function template(selection) {

		// DEFAULTS		
		transition$$1 = transition$$1 || function (t) {
			return t.duration(0);
		};
		enterTransition = enterTransition || function (t) {
			return t.duration(0);
		};
		exitTransition = exitTransition || function (t) {
			return t.duration(0);
		};

		callback = callback || function () {
			return undefined;
		};
		enterCallback = enterCallback || function () {
			return undefined;
		};
		exitCallback = exitCallback || function () {
			return undefined;
		};

		mouseOverCallback = mouseOverCallback || function () {
			return undefined;
		};
		mouseLeaveCallback = mouseLeaveCallback || function () {
			return undefined;
		};

		touchStartCallback = touchStartCallback || function () {
			return undefined;
		};
		touchEndCallback = touchEndCallback || function () {
			return undefined;
		};

		classed = classed || "legend";

		position = position || "left";
		interpolateSteps = interpolateSteps || 10;
		handle = extend({ width: 16, height: 16, padding: 1.25 }, handle);

		selection.each(function (data) {

			var w = template.contentWidth(),
			    format$$1 = textFormat ? d3.format(textFormat) : function (d) {
				return d;
			};

			var node = d3.select(this);

			// Group legend
			var g = node.select("g");

			if (g.empty()) {
				g = node.append("g").attr("class", classed).attr("transform", function () {
					switch (position) {

						case "right":
							return "translate(" + (w - handle.width) + ", 0)";

						default:
							return undefined;
					}
				});

				g.append("text").attr("class", "label").style("text-anchor", position === "left" ? "start" : "end").attr("dy", "1.21em").text(label === "function" ? label(data) : label);
			}

			switch (colorScale.toString()) {

				case d3.scaleThreshold().toString():
					draw(g, "threshold", [d3.min(colorScale.domain()) - 1].concat(colorScale.domain()));
					break;

				case d3.scaleSequential().toString():
					var step = (colorScale.domain()[1] - colorScale.domain()[0]) / (interpolateSteps - 1),
					    values = [];

					for (var i = 0; i < interpolateSteps; i++) {
						values = values.concat(colorScale.domain()[1] - i * step);
					}

					draw(g, "sequential", values);
					break;

				default:
					draw(g, "ordinal", colorScale.domain());
			}

			function draw(g, type, values) {

				// Position label
				g.select("text.label").attr("transform", "translate(" + (position === "left" ? 10 : -10) + ", " + values.length * handle.height * handle.padding + ")");

				var item = g.selectAll(".item");

				var itemEnter = item.data(values).enter().append("g").attr("class", "item").attr("transform", function (d, i) {
					return "translate(0, " + i * handle.height * handle.padding + ")";
				});

				itemEnter.append("rect").attr("class", "handle").attr("width", handle.width).attr("height", handle.height);

				itemEnter.append("text").attr("transform", function () {
					switch (position) {

						case "right":
							return "translate(-10, " + 0.5 * handle.height + ")";

						default:
							return "translate(" + (handle.width + 10) + ", " + 0.5 * handle.height + ")";
					}
				}).attr("dy", "0.32em").style("text-anchor", function () {
					switch (position) {

						case "right":
							return "end";

						default:
							return "start";
					}
				});

				itemEnter.merge(item).select("rect").transition().call(transition$$1).style("fill", function (d) {
					return colorScale(d);
				});

				itemEnter.merge(item).select("text").text(function (d, i) {

					switch (type) {

						case "threshold":
							if (i === 0) return "<" + format$$1(values[1]);
							if (i === values.length - 1) return ">" + format$$1(d);
							return format$$1(values[i]) + "-" + format$$1(values[i + 1]);

						default:
							return format$$1(d);
					}
				});

				item.exit().transition().call(exitTransition).style("fill", "transparent").remove();
			}
		});
	}

	template.layer = function (_) {
		return arguments.length ? (layer = _, template) : layer || {};
	};

	template.classed = function (_) {
		return arguments.length ? (classed = _, template) : classed;
	};

	template.orient = function (_) {
		return arguments.length ? (orient = _, template) : orient;
	};

	template.width = function (_) {
		return arguments.length ? (width = _, template) : width;
	};

	template.height = function (_) {
		return arguments.length ? (height = _, template) : height;
	};

	template.margin = function (_) {
		return arguments.length ? (margin = _, template) : margin;
	};

	template.contentWidth = function () {
		return width - margin.right - margin.left;
	};

	template.contentHeight = function () {
		return height - margin.top - margin.bottom;
	};

	template.key = function (_) {
		return arguments.length ? (key = _, template) : key;
	};

	template.x = function (_) {
		return arguments.length ? (x = _, template) : x;
	};

	template.y = function (_) {
		return arguments.length ? (y = _, template) : y;
	};

	template.color = function (_) {
		return arguments.length ? (color = _, template) : color;
	};

	template.xScale = function (_) {
		return arguments.length ? (xScale = _, template) : xScale;
	};

	template.yScale = function (_) {
		return arguments.length ? (yScale = _, template) : yScale;
	};

	template.colorScale = function (_) {
		return arguments.length ? (colorScale = _, template) : colorScale;
	};

	template.transition = function (_) {
		return arguments.length ? (transition$$1 = _, template) : transition$$1;
	};

	template.enterTransition = function (_) {
		return arguments.length ? (enterTransition = _, template) : enterTransition;
	};

	template.exitTransition = function (_) {
		return arguments.length ? (exitTransition = _, template) : exitTransition;
	};

	template.callback = function (_) {
		return arguments.length ? (callback = _, template) : callback;
	};

	template.enterCallback = function (_) {
		return arguments.length ? (enterCallback = _, template) : enterCallback;
	};

	template.exitCallback = function (_) {
		return arguments.length ? (exitCallback = _, template) : exitCallback;
	};

	template.mouseOverCallback = function (_) {
		return arguments.length ? (mouseOverCallback = _, template) : mouseOverCallback;
	};

	template.mouseLeaveCallback = function (_) {
		return arguments.length ? (mouseLeaveCallback = _, template) : mouseLeaveCallback;
	};

	template.touchStartCallback = function (_) {
		return arguments.length ? (touchStartCallback = _, template) : touchStartCallback;
	};

	template.touchEndCallback = function (_) {
		return arguments.length ? (touchEndCallback = _, template) : touchEndCallback;
	};

	template.label = function (_) {
		return arguments.length ? (label = _, template) : label;
	};

	template.position = function (_) {
		return arguments.length ? (position = _, template) : position;
	};

	template.interpolateSteps = function (_) {
		return arguments.length ? (interpolateSteps = _, template) : interpolateSteps;
	};

	template.textFormat = function (_) {
		return arguments.length ? (textFormat = _, template) : textFormat;
	};

	template.handle = function (_) {
		return arguments.length ? (handle = _, template) : handle;
	};

	return template;
}

function line$1() {

	var layer, classed, orient, key, x, y, color, xScale, yScale, colorScale, transition$$1, enterTransition, exitTransition, callback, enterCallback, exitCallback, line$$1, strokeWidth, strokeDashArray, label;

	function template(selection) {

		// DEFAULTS
		classed = classed || "line";

		transition$$1 = transition$$1 || function (t) {
			return t.duration(0);
		};
		enterTransition = enterTransition || function (t) {
			return t.duration(0);
		};
		exitTransition = exitTransition || function (t) {
			return t.duration(0);
		};

		callback = callback || function () {
			return undefined;
		};
		enterCallback = enterCallback || function () {
			return undefined;
		};
		exitCallback = exitCallback || function () {
			return undefined;
		};

		// Adjust bandwidth if necessary
		function xScaleAdjusted(d) {
			return xScale(x(d)) + (xScale.bandwidth ? xScale.bandwidth() / 2 : 0);
		}

		function yScaleAdjusted(d) {
			return yScale(y(d)) + (yScale.bandwidth ? yScale.bandwidth() / 2 : 0);
		}

		line$$1 = line$$1 || d3.line();

		selection.each(function (data) {

			label = label || function () {
				return "";
			};

			line$$1.x(xScaleAdjusted).y(yScaleAdjusted);

			var lastPoint = data[data.length - 1];

			// UPDATE		
			var lines = d3.select(this).selectAll("." + classed.replace(" ", ".")).data([1]).attr("class", classed + " update"),
			    labels = d3.select(this).selectAll(".label").data([1]).attr("class", "label update");

			// ENTER
			lines.enter().append("path").attr("class", classed + " enter").style("stroke", function () {
				return colorScale(color(data));
			}).style("stroke-width", strokeWidth).style("stroke-dasharray", strokeDashArray).style("fill", "none").merge(lines) // ENTER + UPDATE
			.datum(data).transition().call(transition$$1).attr("d", line$$1).on("end", function () {
				return d3.select(this).call(callback);
			});

			labels.enter().append("text").attr("class", "label enter").text(typeof label === "function" ? label(data) : label).merge(labels) // ENTER + UPDATE
			.attr("x", xScale(x(lastPoint))).attr("dx", "0.24em").attr("dy", "0.24em").transition().call(transition$$1).attr("y", yScale(y(lastPoint))).style("fill", function () {
				return colorScale(color(data));
			});

			// EXIT
			lines.exit().attr("class", classed + " exit").transition().call(exitTransition).on("end", function () {
				d3.select(this).call(exitCallback);
			}).remove();

			labels.exit().attr("class", "label exit").transition().call(exitTransition).style("opacity", 0).remove();
		});
	}

	template.layer = function (_) {
		return arguments.length ? (layer = _, template) : layer || {};
	};

	template.classed = function (_) {
		return arguments.length ? (classed = _, template) : classed;
	};

	template.orient = function (_) {
		return arguments.length ? (orient = _, template) : orient;
	};

	template.key = function (_) {
		return arguments.length ? (key = _, template) : key;
	};

	template.x = function (_) {
		return arguments.length ? (x = _, template) : x;
	};

	template.y = function (_) {
		return arguments.length ? (y = _, template) : y;
	};

	template.color = function (_) {
		return arguments.length ? (color = _, template) : color;
	};

	template.xScale = function (_) {
		return arguments.length ? (xScale = _, template) : xScale;
	};

	template.yScale = function (_) {
		return arguments.length ? (yScale = _, template) : yScale;
	};

	template.colorScale = function (_) {
		return arguments.length ? (colorScale = _, template) : colorScale;
	};

	template.transition = function (_) {
		return arguments.length ? (transition$$1 = _, template) : transition$$1;
	};

	template.enterTransition = function (_) {
		return arguments.length ? (enterTransition = _, template) : enterTransition;
	};

	template.exitTransition = function (_) {
		return arguments.length ? (exitTransition = _, template) : exitTransition;
	};

	template.callback = function (_) {
		return arguments.length ? (callback = _, template) : callback;
	};

	template.enterCallback = function (_) {
		return arguments.length ? (enterCallback = _, template) : enterCallback;
	};

	template.exitCallback = function (_) {
		return arguments.length ? (exitCallback = _, template) : exitCallback;
	};

	template.line = function (_) {
		return arguments.length ? (line$$1 = _, template) : line$$1;
	};

	template.strokeWidth = function (_) {
		return arguments.length ? (strokeWidth = _, template) : strokeWidth;
	};

	template.strokeDashArray = function (_) {
		return arguments.length ? (strokeDashArray = _, template) : strokeDashArray;
	};

	template.label = function (_) {
		return arguments.length ? (label = _, template) : label;
	};

	return template;
}

function packLabel() {

	var layer, classed, width, height, margin, x, y, y1, color, text, y1Scale, colorScale, yLabel, sort, transition$$1, enterTransition, exitTransition, callback, enterCallback, exitCallback, mouseOverCallback, mouseLeaveCallback, touchStartCallback, touchEndCallback, _pack, _bubble;

	function template(selection) {

		// DEFAULTS		
		transition$$1 = transition$$1 || function (t) {
			return t.duration(0);
		};
		enterTransition = enterTransition || function (t) {
			return t.duration(0);
		};
		exitTransition = exitTransition || function (t) {
			return t.duration(0);
		};

		callback = callback || function () {
			return undefined;
		};
		enterCallback = enterCallback || function () {
			return undefined;
		};
		exitCallback = exitCallback || function () {
			return undefined;
		};

		mouseOverCallback = mouseOverCallback || function () {
			return undefined;
		};
		mouseLeaveCallback = mouseLeaveCallback || function () {
			return undefined;
		};

		touchStartCallback = touchStartCallback || function () {
			return undefined;
		};
		touchEndCallback = touchEndCallback || function () {
			return undefined;
		};

		classed = classed || "packLabel";

		_pack = _pack || { padding: 1.5 };
		_bubble = _bubble || {};

		var w = template.contentWidth(),
		    h = template.contentHeight(),
		    diameter = Math.min(w, h);

		var bubble = d3.pack().size([diameter, diameter]).padding(_pack.padding || 1.5);

		selection.each(function (data) {

			if (!data.name) {
				data = { name: "root", children: data };
			}

			var root = d3.hierarchy(classes(data)).sum(function (d) {
				return d.value;
			}).sort(function (a, b) {
				return sort ? sort(a.value, b.value) : true;
			});

			bubble(root);

			var node = d3.select(this);

			// Center bubbles
			var g = node.select("g");
			if (g.empty()) {
				g = node.append("g").attr("transform", "translate(" + (w / 2 - diameter / 2) + ",-" + (h / 2 - diameter / 2) + ")");
			}

			// Label
			if (g.select(".label").empty()) {
				g.append("text").attr("class", "label").attr("transform", "translate(" + diameter + "," + h + ")").style("text-anchor", "end").text(function () {
					return typeof yLabel === "function" ? yLabel(data.children) : yLabel;
				});
			}

			// UPDATE		
			var bubbles = g.selectAll("." + classed.replace(" ", ".")).data(root.children, function (d) {
				return d.data.packageName + "-" + d.data.className;
			}).attr("class", classed + " update");

			// ENTER	
			bubbles.enter().append("text").attr("class", classed + " enter").attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")";
			}).attr("dy", "0.34em").text(function (d) {
				return text(d.data.data);
			}).style("font-size", "1em").style("text-anchor", "middle").style("fill", function (d) {
				return colorScale(color(d.data.data));
			}).on("mouseover", mouseOverCallback).on("mouseleave", mouseLeaveCallback).on("touchstart", touchStartCallback).on("touchend", touchEndCallback).call(enterCallback).merge(bubbles) // ENTER + UPDATE
			.transition().call(transition$$1).attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")";
			}).style("fill", function (d) {
				return colorScale(color(d.data.data));
			}).style("font-size", function (d) {
				return y1Scale ? y1Scale(y1(d.data.data)) + "em" : undefined;
			}).on("end", function () {
				d3.select(this).call(callback);
			});

			// EXIT
			bubbles.exit().attr("class", classed + " exit").transition().call(exitTransition).on("end", function () {
				d3.select(this).call(exitCallback);
			}).remove();

			// Returns a flattened hierarchy containing all leaf nodes under the root.
			function classes(root) {
				var classes = [];

				function recurse(name, node) {
					if (node.children) {
						node.children.forEach(function (child) {
							recurse(node.name, child);
						});
					} else classes.push({ packageName: name, className: x(node), value: y(node), data: node });
				}

				recurse(null, root);
				return { children: classes };
			}
		});
	}

	template.layer = function (_) {
		return arguments.length ? (layer = _, template) : layer || {};
	};

	template.classed = function (_) {
		return arguments.length ? (classed = _, template) : classed;
	};

	template.width = function (_) {
		return arguments.length ? (width = _, template) : width;
	};

	template.height = function (_) {
		return arguments.length ? (height = _, template) : height;
	};

	template.margin = function (_) {
		return arguments.length ? (margin = _, template) : margin;
	};

	template.contentWidth = function () {
		return width - margin.right - margin.left;
	};

	template.contentHeight = function () {
		return height - margin.top - margin.bottom;
	};

	template.x = function (_) {
		return arguments.length ? (x = _, template) : x;
	};

	template.y = function (_) {
		return arguments.length ? (y = _, template) : y;
	};

	template.y1 = function (_) {
		return arguments.length ? (y1 = _, template) : y1;
	};

	template.color = function (_) {
		return arguments.length ? (color = _, template) : color;
	};

	template.text = function (_) {
		return arguments.length ? (text = _, template) : text;
	};

	template.y1Scale = function (_) {
		return arguments.length ? (y1Scale = _, template) : y1Scale;
	};

	template.colorScale = function (_) {
		return arguments.length ? (colorScale = _, template) : colorScale;
	};

	template.yLabel = function (_) {
		return arguments.length ? (yLabel = _, template) : yLabel;
	};

	template.sort = function (_) {
		return arguments.length ? (sort = _, template) : sort;
	};

	template.transition = function (_) {
		return arguments.length ? (transition$$1 = _, template) : transition$$1;
	};

	template.enterTransition = function (_) {
		return arguments.length ? (enterTransition = _, template) : enterTransition;
	};

	template.exitTransition = function (_) {
		return arguments.length ? (exitTransition = _, template) : exitTransition;
	};

	template.callback = function (_) {
		return arguments.length ? (callback = _, template) : callback;
	};

	template.enterCallback = function (_) {
		return arguments.length ? (enterCallback = _, template) : enterCallback;
	};

	template.exitCallback = function (_) {
		return arguments.length ? (exitCallback = _, template) : exitCallback;
	};

	template.mouseOverCallback = function (_) {
		return arguments.length ? (mouseOverCallback = _, template) : mouseOverCallback;
	};

	template.mouseLeaveCallback = function (_) {
		return arguments.length ? (mouseLeaveCallback = _, template) : mouseLeaveCallback;
	};

	template.touchStartCallback = function (_) {
		return arguments.length ? (touchStartCallback = _, template) : touchStartCallback;
	};

	template.touchEndCallback = function (_) {
		return arguments.length ? (touchEndCallback = _, template) : touchEndCallback;
	};

	template.pack = function (_) {
		return arguments.length ? (_pack = _, template) : _pack;
	};

	template.bubble = function (_) {
		return arguments.length ? (_bubble = _, template) : _bubble;
	};

	return template;
}

function pie$1() {

	var layer, classed, orient, width, height, margin, key, x, y, color, text, colorScale, yLabel, transition$$1, enterTransition, exitTransition, callback, enterCallback, exitCallback, mouseOverCallback, mouseLeaveCallback, touchStartCallback, touchEndCallback, _pie, _arc;

	function template(selection) {

		// DEFAULTS		
		transition$$1 = transition$$1 || function (t) {
			return t.duration(0);
		};
		enterTransition = enterTransition || function (t) {
			return t.duration(0);
		};
		exitTransition = exitTransition || function (t) {
			return t.duration(0);
		};

		callback = callback || function () {
			return undefined;
		};
		enterCallback = enterCallback || function () {
			return undefined;
		};
		exitCallback = exitCallback || function () {
			return undefined;
		};

		mouseOverCallback = mouseOverCallback || function () {
			return undefined;
		};
		mouseLeaveCallback = mouseLeaveCallback || function () {
			return undefined;
		};

		touchStartCallback = touchStartCallback || function () {
			return undefined;
		};
		touchEndCallback = touchEndCallback || function () {
			return undefined;
		};

		classed = classed || "pie";

		_pie = _pie || {};
		_arc = _arc || {};

		var w = template.contentWidth(),
		    h = template.contentHeight(),
		    radius = Math.min(w, h) / 2;

		var pie$$1 = d3.pie().sort(null).value(function (d) {
			return y(d);
		}).startAngle(_pie.startAngle ? _pie.startAngle * Math.PI / 180 : 0).endAngle(_pie.endAngle ? _pie.endAngle * Math.PI / 180 : 2 * Math.PI).padAngle(_pie.padAngle ? _pie.padAngle * Math.PI / 180 : 0);

		var arc$$1 = d3.arc().innerRadius(_arc.innerRadius ? radius * _arc.innerRadius : 0).outerRadius(radius);

		selection.each(function (data) {

			var node = d3.select(this);

			// Center pie
			var g = node.select("g");
			if (g.empty()) {
				g = node.append("g").attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");
			}

			if (g.select(".label").empty()) {
				g.append("text").attr("class", "label").attr("dy", ".35em").style("text-anchor", "middle").text(function () {
					return typeof yLabel === "function" ? yLabel(data) : yLabel;
				});
			}

			// UPDATE		
			var pies = g.selectAll("." + classed.replace(" ", ".")).data(pie$$1(data), function (d) {
				return key(d.data);
			}).attr("class", classed + " update");

			// ENTER	
			pies.enter().append("path").attr("class", classed + " enter").attr("d", arc$$1).style("fill", function (d) {
				return colorScale(color(d.data));
			}).on("mouseover", mouseOverCallback).on("mouseleave", mouseLeaveCallback).on("touchstart", touchStartCallback).on("touchend", touchEndCallback).call(enterCallback).merge(pies) // ENTER + UPDATE
			.transition().call(transition$$1).attrTween("d", arcTween).style("fill", function (d) {
				return colorScale(color(d.data));
			}).on("end", function () {
				d3.select(this).call(callback);
			});

			// EXIT
			pies.exit().attr("class", classed + " exit").transition().call(exitTransition).attrTween("d", arcTween(0)).on("end", function () {
				d3.select(this).call(exitCallback);
			}).remove();

			function arcTween(a) {
				if (!this) return function () {
					return arc$$1(0);
				};

				var i = d3.interpolate(this._current, a);
				this._current = i(0);
				return function (t) {
					return arc$$1(i(t));
				};
			}
		});
	}

	template.layer = function (_) {
		return arguments.length ? (layer = _, template) : layer || {};
	};

	template.classed = function (_) {
		return arguments.length ? (classed = _, template) : classed;
	};

	template.orient = function (_) {
		return arguments.length ? (orient = _, template) : orient;
	};

	template.width = function (_) {
		return arguments.length ? (width = _, template) : width;
	};

	template.height = function (_) {
		return arguments.length ? (height = _, template) : height;
	};

	template.margin = function (_) {
		return arguments.length ? (margin = _, template) : margin;
	};

	template.contentWidth = function () {
		return width - margin.right - margin.left;
	};

	template.contentHeight = function () {
		return height - margin.top - margin.bottom;
	};

	template.key = function (_) {
		return arguments.length ? (key = _, template) : key;
	};

	template.x = function (_) {
		return arguments.length ? (x = _, template) : x;
	};

	template.y = function (_) {
		return arguments.length ? (y = _, template) : y;
	};

	template.color = function (_) {
		return arguments.length ? (color = _, template) : color;
	};

	template.text = function (_) {
		return arguments.length ? (text = _, template) : text;
	};

	template.colorScale = function (_) {
		return arguments.length ? (colorScale = _, template) : colorScale;
	};

	template.yLabel = function (_) {
		return arguments.length ? (yLabel = _, template) : yLabel;
	};

	template.transition = function (_) {
		return arguments.length ? (transition$$1 = _, template) : transition$$1;
	};

	template.enterTransition = function (_) {
		return arguments.length ? (enterTransition = _, template) : enterTransition;
	};

	template.exitTransition = function (_) {
		return arguments.length ? (exitTransition = _, template) : exitTransition;
	};

	template.callback = function (_) {
		return arguments.length ? (callback = _, template) : callback;
	};

	template.enterCallback = function (_) {
		return arguments.length ? (enterCallback = _, template) : enterCallback;
	};

	template.exitCallback = function (_) {
		return arguments.length ? (exitCallback = _, template) : exitCallback;
	};

	template.mouseOverCallback = function (_) {
		return arguments.length ? (mouseOverCallback = _, template) : mouseOverCallback;
	};

	template.mouseLeaveCallback = function (_) {
		return arguments.length ? (mouseLeaveCallback = _, template) : mouseLeaveCallback;
	};

	template.touchStartCallback = function (_) {
		return arguments.length ? (touchStartCallback = _, template) : touchStartCallback;
	};

	template.touchEndCallback = function (_) {
		return arguments.length ? (touchEndCallback = _, template) : touchEndCallback;
	};

	template.arc = function (_) {
		return arguments.length ? (_arc = _, template) : _arc;
	};

	template.pie = function (_) {
		return arguments.length ? (_pie = _, template) : _pie;
	};

	return template;
}

function plainCSS() {

	var classed, css;

	function template(selection) {

		selection.each(function () {

			if (css) {
				var node = d3.select(this),
				    styleNode = node.select("style");

				if (styleNode.empty()) {
					styleNode = node.append("style").attr("type", "text/css");
				}

				styleNode.text(css.replace(/#id/g, "#" + node.attr("id")));
			}
		});
	}

	template.classed = function (_) {
		return arguments.length ? (classed = _, template) : classed;
	};

	template.css = function (_) {
		return arguments.length ? (css = _, template) : css;
	};

	return template;
}

function responsiveCSS() {

	// Default attributes
	var classed, desktop, tablet, smartphone, css;

	function template(selection) {

		selection.each(function () {

			if (smartphone || tablet || desktop || css) {

				var node = d3.select(this),
				    styleNode = node.select("style"),
				    result = "";

				if (styleNode.empty()) {
					styleNode = node.append("style").attr("type", "text/css");
				}

				if (smartphone) {
					result += "@media only screen and (max-device-width : 450px) {";
					result += rulesToString(smartphone);
					result += "}\n";
				}

				if (tablet) {
					result += "@media only screen and (min-device-width : 450px) and (max-device-width : 1200px) {";
					result += rulesToString(tablet);
					result += "}\n";
				}

				if (desktop) {
					result += "@media only screen and (min-device-width : 1200px) {";
					result += rulesToString(desktop);
					result += "}\n";
				}

				if (css) {
					result += css.replace(/#id/g, "#" + node.attr("id")) + "\n";
				}

				styleNode.text(result);
			}

			function rulesToString(o) {
				var s = "",
				    keys$$1 = Object.keys(o);

				for (var k in keys$$1) {
					s += keys$$1[k] + "#" + node.attr("id") + "{";

					var rules = Object.keys(o[keys$$1[k]]);
					for (var r in rules) {
						s += rules[r] + ":" + o[keys$$1[k]][rules[r]] + ";";
					}
				}
				return s + "}";
			}
		});
	}

	template.classed = function (_) {
		return arguments.length ? (classed = _, template) : classed;
	};

	template.desktop = function (_) {
		return arguments.length ? (desktop = _, template) : desktop;
	};

	template.tablet = function (_) {
		return arguments.length ? (tablet = _, template) : tablet;
	};

	template.smartphone = function (_) {
		return arguments.length ? (smartphone = _, template) : smartphone;
	};

	template.css = function (_) {
		return arguments.length ? (css = _, template) : css;
	};

	return template;
}

var version = "0.9.8";
exports.version = version;

exports.schedulerInterval = interval$1;
exports.readerDSV = dsv;
exports.readerJSON = json$1;
exports.readerTestData = testData;
exports.templateArcLabel = arcLabel;
exports.templateAxis = axis;
exports.templateBackground = background;
exports.templateBar = bar;
exports.templateBubble = bubble;
exports.templateDot = dot;
exports.templateImage = image;
exports.templateLabel = label;
exports.templateLayers = layers;
exports.templateLegend = legend;
exports.templateLine = line$1;
exports.templatePackLabel = packLabel;
exports.templatePie = pie$1;
exports.stylePlainCSS = plainCSS;
exports.styleResponsiveCSS = responsiveCSS;
exports.templateSVG = svg;
exports.schemeDefault = greys;
exports.schemeGreys = greys;
exports.schemeBlues = blues;
exports.schemeFews9 = fews9;
exports.schemeYlOrDr = ylOrDr;
exports.schemeDgOrDr = dgOrDr;
exports.interpolateGreys = greys$1;
exports.interpolateBlues = blues$1;
exports.interpolateBlRd = blRd;
exports.tagFactory = tagFactory;
exports.init = init;
exports.setupD3 = setupD3;
exports.setupD3ScaleChromatic = setupD3ScaleChromatic;
exports.setupDGF = setupDGF;
exports.setupBasic = setupBasic;
exports.setupHierarchic = setupHierarchic;
exports.setupTime = setupTime;
exports.setupMultiSeries = setupMultiSeries;
exports.setupGallery = setupGallery;
exports.isEmpty = isEmpty;
exports.extend = extend;
exports.diff = diff;
exports.flatten = flatten;
exports.unflatten = unflatten;
exports.deepValue = deepValue;
exports.findParentBySelector = findParentBySelector;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGdmLmpzIiwic291cmNlcyI6WyIuLi8uLi9kZ2Ytc2NoZWR1bGVyL3NyYy9pbnRlcnZhbC5qcyIsIi4uLy4uL2RnZi1yZWFkZXIvc3JjL2Rzdi5qcyIsIi4uLy4uL2RnZi1yZWFkZXIvc3JjL2pzb24uanMiLCIuLi8uLi9kZ2YtcmVhZGVyL3NyYy90ZXN0RGF0YS5qcyIsIi4uLy4uL2RnZi10ZW1wbGF0ZS9zcmMvYXJjTGFiZWwuanMiLCIuLi8uLi9kZ2YtdGVtcGxhdGUvc3JjL2F4aXMuanMiLCIuLi8uLi9kZ2YtdGVtcGxhdGUvc3JjL2JhY2tncm91bmQuanMiLCIuLi8uLi9kZ2YtdGVtcGxhdGUvc3JjL2Jhci5qcyIsIi4uLy4uL2RnZi10ZW1wbGF0ZS9zcmMvYnViYmxlLmpzIiwiLi4vLi4vZGdmLXRlbXBsYXRlL3NyYy9kb3QuanMiLCIuLi8uLi9kZ2YtdGVtcGxhdGUvc3JjL2ltYWdlLmpzIiwiLi4vLi4vZGdmLXRlbXBsYXRlL3NyYy9sYWJlbC5qcyIsIi4uLy4uL2RnZi10ZW1wbGF0ZS9zcmMvdXRpbC5qcyIsIi4uLy4uL2RnZi10ZW1wbGF0ZS9zcmMvc3ZnLmpzIiwiLi4vLi4vZGdmLXRlbXBsYXRlL3NyYy9sYXllcnMuanMiLCIuLi8uLi9kZ2YtdGFnL3NyYy91dGlsLmpzIiwiLi4vLi4vZGdmLXRhZy9zcmMvdGFnRmFjdG9yeS5qcyIsIi4uLy4uL2RnZi10YWcvc3JjL3NldHVwRDMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUtY2hyb21hdGljL3NyYy9jb2xvcnMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUtY2hyb21hdGljL3NyYy9jYXRlZ29yaWNhbC9BY2NlbnQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUtY2hyb21hdGljL3NyYy9jYXRlZ29yaWNhbC9EYXJrMi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS1jaHJvbWF0aWMvc3JjL2NhdGVnb3JpY2FsL1BhaXJlZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS1jaHJvbWF0aWMvc3JjL2NhdGVnb3JpY2FsL1Bhc3RlbDEuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUtY2hyb21hdGljL3NyYy9jYXRlZ29yaWNhbC9QYXN0ZWwyLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlLWNocm9tYXRpYy9zcmMvY2F0ZWdvcmljYWwvU2V0MS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS1jaHJvbWF0aWMvc3JjL2NhdGVnb3JpY2FsL1NldDIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUtY2hyb21hdGljL3NyYy9jYXRlZ29yaWNhbC9TZXQzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLWNvbG9yL3NyYy9kZWZpbmUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtY29sb3Ivc3JjL2NvbG9yLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLWNvbG9yL3NyYy9tYXRoLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLWNvbG9yL3NyYy9sYWIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtY29sb3Ivc3JjL2N1YmVoZWxpeC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvYmFzaXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL2NvbnN0YW50LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL3NyYy9jb2xvci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvcmdiLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL3NyYy9udW1iZXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL3N0cmluZy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvem9vbS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvY3ViZWhlbGl4LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlLWNocm9tYXRpYy9zcmMvcmFtcC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS1jaHJvbWF0aWMvc3JjL2RpdmVyZ2luZy9CckJHLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlLWNocm9tYXRpYy9zcmMvZGl2ZXJnaW5nL1BSR24uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUtY2hyb21hdGljL3NyYy9kaXZlcmdpbmcvUGlZRy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS1jaHJvbWF0aWMvc3JjL2RpdmVyZ2luZy9QdU9yLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlLWNocm9tYXRpYy9zcmMvZGl2ZXJnaW5nL1JkQnUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUtY2hyb21hdGljL3NyYy9kaXZlcmdpbmcvUmRHeS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS1jaHJvbWF0aWMvc3JjL2RpdmVyZ2luZy9SZFlsQnUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUtY2hyb21hdGljL3NyYy9kaXZlcmdpbmcvUmRZbEduLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlLWNocm9tYXRpYy9zcmMvZGl2ZXJnaW5nL1NwZWN0cmFsLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlLWNocm9tYXRpYy9zcmMvc2VxdWVudGlhbC1tdWx0aS9CdUduLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlLWNocm9tYXRpYy9zcmMvc2VxdWVudGlhbC1tdWx0aS9CdVB1LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlLWNocm9tYXRpYy9zcmMvc2VxdWVudGlhbC1tdWx0aS9HbkJ1LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlLWNocm9tYXRpYy9zcmMvc2VxdWVudGlhbC1tdWx0aS9PclJkLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlLWNocm9tYXRpYy9zcmMvc2VxdWVudGlhbC1tdWx0aS9QdUJ1R24uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUtY2hyb21hdGljL3NyYy9zZXF1ZW50aWFsLW11bHRpL1B1QnUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUtY2hyb21hdGljL3NyYy9zZXF1ZW50aWFsLW11bHRpL1B1UmQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUtY2hyb21hdGljL3NyYy9zZXF1ZW50aWFsLW11bHRpL1JkUHUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUtY2hyb21hdGljL3NyYy9zZXF1ZW50aWFsLW11bHRpL1lsR25CdS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS1jaHJvbWF0aWMvc3JjL3NlcXVlbnRpYWwtbXVsdGkvWWxHbi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS1jaHJvbWF0aWMvc3JjL3NlcXVlbnRpYWwtbXVsdGkvWWxPckJyLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlLWNocm9tYXRpYy9zcmMvc2VxdWVudGlhbC1tdWx0aS9ZbE9yUmQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUtY2hyb21hdGljL3NyYy9zZXF1ZW50aWFsLXNpbmdsZS9CbHVlcy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS1jaHJvbWF0aWMvc3JjL3NlcXVlbnRpYWwtc2luZ2xlL0dyZWVucy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS1jaHJvbWF0aWMvc3JjL3NlcXVlbnRpYWwtc2luZ2xlL0dyZXlzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlLWNocm9tYXRpYy9zcmMvc2VxdWVudGlhbC1zaW5nbGUvUHVycGxlcy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS1jaHJvbWF0aWMvc3JjL3NlcXVlbnRpYWwtc2luZ2xlL1JlZHMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUtY2hyb21hdGljL3NyYy9zZXF1ZW50aWFsLXNpbmdsZS9PcmFuZ2VzLmpzIiwiLi4vLi4vZGdmLXRhZy9zcmMvc2V0dXBEM1NjYWxlQ2hyb21hdGljLmpzIiwiLi4vLi4vZGdmLXNjaGVtZS9zcmMvc2NoZW1lLmpzIiwiLi4vLi4vZGdmLXNjaGVtZS9zcmMvaW50ZXJwb2xhdGUuanMiLCIuLi8uLi9kZ2YtdGFnL3NyYy9zZXR1cERHRi5qcyIsIi4uLy4uL2RnZi10YWcvc3JjL3NldHVwQmFzaWMuanMiLCIuLi8uLi9kZ2YtdGFnL3NyYy9zZXR1cEhpZXJhcmNoaWMuanMiLCIuLi8uLi9kZ2YtdGFnL3NyYy9zZXR1cFRpbWUuanMiLCIuLi8uLi9kZ2YtdGFnL3NyYy9zZXR1cE11bHRpU2VyaWVzLmpzIiwiLi4vLi4vZGdmLXRhZy9zcmMvc2V0dXBHYWxsZXJ5LmpzIiwiLi4vLi4vZGdmLXRlbXBsYXRlL3NyYy9sZWdlbmQuanMiLCIuLi8uLi9kZ2YtdGVtcGxhdGUvc3JjL2xpbmUuanMiLCIuLi8uLi9kZ2YtdGVtcGxhdGUvc3JjL3BhY2tMYWJlbC5qcyIsIi4uLy4uL2RnZi10ZW1wbGF0ZS9zcmMvcGllLmpzIiwiLi4vLi4vZGdmLXRlbXBsYXRlL3NyYy9wbGFpbkNTUy5qcyIsIi4uLy4uL2RnZi10ZW1wbGF0ZS9zcmMvcmVzcG9uc2l2ZUNTUy5qcyIsIi4uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGQzIGZyb20gXCJkM1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpbnRlcnZhbChpbnRlcnZhbCwgcmVwZWF0KSB7XG5cblx0dmFyXHRfaW50ZXJ2YWwgPSBpbnRlcnZhbCxcblx0XHRfcmVwZWF0ID0gcmVwZWF0LFxuXHRcdHN0b3BwZWQsXG5cdFx0Y2FsbGJhY2ssIHN0YXJ0Q2FsbGJhY2ssIHN0b3BDYWxsYmFjaztcblx0XHRcblx0ZnVuY3Rpb24gdGVtcGxhdGUoc2VsZWN0aW9uKSB7XG5cdFx0XHRcblx0XHRjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdHN0YXJ0Q2FsbGJhY2sgPSBzdGFydENhbGxiYWNrIHx8IGNhbGxiYWNrO1xuXHRcdHN0b3BDYWxsYmFjayA9IHN0b3BDYWxsYmFjayB8fCBjYWxsYmFjaztcblxuXHRcdHNlbGVjdGlvbi5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XG5cdFx0XHRzdG9wcGVkID0gZmFsc2U7XG5cdFx0XHRzZWxlY3Rpb24uY2FsbChzdGFydENhbGxiYWNrKTtcblx0XHRcdFx0XHRcblx0XHRcdHZhciB0ID0gZDMuaW50ZXJ2YWwoZnVuY3Rpb24oZWxhcHNlZCkge1xuXHRcdFx0XHRpZihlbGFwc2VkID4gX3JlcGVhdCAqIF9pbnRlcnZhbCAmJiBfcmVwZWF0ICE9IC0xKSB7XG5cdFx0XHRcdFx0dC5zdG9wKCk7XG5cdFx0XHRcdFx0c3RvcHBlZCA9IHRydWU7XG5cdFx0XHRcdFx0c2VsZWN0aW9uLmNhbGwoc3RvcENhbGxiYWNrKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzZWxlY3Rpb24uY2FsbChjYWxsYmFjayk7XG5cdFx0XHR9LCBfaW50ZXJ2YWwpO1xuXHRcdH0pO1xuXHR9XG5cblx0dGVtcGxhdGUuaW50ZXJ2YWwgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoX2ludGVydmFsID0gK18sIHRlbXBsYXRlKSA6IF9pbnRlcnZhbDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLnJlcGVhdCA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChfcmVwZWF0ID0gK18sIHRlbXBsYXRlKSA6IF9yZXBlYXQ7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5pc1N0b3BwZWQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc3RvcHBlZDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogY2FsbGJhY2s7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5zdGFydENhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHN0YXJ0Q2FsbGJhY2sgPSBfLCB0ZW1wbGF0ZSkgOiBzdGFydENhbGxiYWNrO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuc3RvcENhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHN0b3BDYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IHN0b3BDYWxsYmFjaztcblx0fTtcblx0XG5cdHJldHVybiB0ZW1wbGF0ZTtcbn0iLCJpbXBvcnQgKiBhcyBkMyBmcm9tIFwiZDNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZHN2KGQsIGRsbSkge1xuXG5cdHZhclx0X2RhdGEgPSBkLFxuXHRcdGRlbGltaXRlciA9IGRsbSxcblx0XHRwYXJzZXJDYWxsYmFjayxcblx0XHRjYWxsYmFjayxcblx0XHRlcnJvckNhbGxiYWNrO1xuXHRcdFxuXHRmdW5jdGlvbiByZWFkZXIoc2VsZWN0aW9uKSB7XG5cdFx0XG5cdFx0c2VsZWN0aW9uLmVhY2goZnVuY3Rpb24oZGF0YSwgaW5kZXgpIHtcdFxuXHRcdFxuXHRcdFx0Ly8gREVGQVVMVFNcblx0XHRcdHBhcnNlckNhbGxiYWNrID0gcGFyc2VyQ2FsbGJhY2sgfHwgZnVuY3Rpb24oZGF0YSkgeyByZXR1cm4gZGF0YTsgfTtcblx0XHRcdGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0XHRlcnJvckNhbGxiYWNrID0gZXJyb3JDYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHRcdFx0XHRcdFxuXHRcdFx0c3dpdGNoKGRlbGltaXRlcikge1xuXHRcdFx0Y2FzZSBcImNvbW1hXCI6XG5cdFx0XHRcdGRlbGltaXRlciA9IFwiLFwiO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0XG5cdFx0XHRjYXNlIFwidGFiXCI6XG5cdFx0XHRcdGRlbGltaXRlciA9IFwiXFx0XCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcblx0XHRcdGNhc2UgXCJzZW1pY29sb25cIjpcblx0XHRcdFx0ZGVsaW1pdGVyID0gXCI7XCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0ZGF0YSA9IF9kYXRhID8gZDMuZHN2Rm9ybWF0KGRlbGltaXRlcikucGFyc2UoX2RhdGEudHJpbSgpKSA6IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdFxuXHRcdFx0aWYoZGF0YSkge1xuXHRcdFx0XHRwYXJzZXJDYWxsYmFjay5jYWxsKHRoaXMsIGRhdGEsIGluZGV4KTtcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdHNlbGVjdGlvblxuXHRcdFx0XHRcdC5kYXR1bShkYXRhKVxuXHRcdFx0XHRcdC5jYWxsKGNhbGxiYWNrLCBzZWxlY3Rpb24pO1xuXHRcdFx0XHRcblx0XHRcdFx0Lypcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgZGF0YSA9IGQzLmRzdkZvcm1hdChkZWxpbWl0ZXIpLnBhcnNlKF9kYXRhKTtcblx0XHRcdFx0XG5cdFx0XHRcdFx0c2VsZWN0aW9uXG5cdFx0XHRcdFx0XHQuZGF0dW0oZGF0YSlcblx0XHRcdFx0XHRcdC5jYWxsKGNhbGxiYWNrKTtcblx0XHRcdFx0fSBjYXRjaChleGNlcHRpb24pIHtcblx0XHRcdFx0XHRzZWxlY3Rpb25cblx0XHRcdFx0XHRcdC5kYXR1bShbZXhjZXB0aW9uXSlcblx0XHRcdFx0XHRcdC5jYWxsKGVycm9yQ2FsbGJhY2spO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHRocm93KGV4Y2VwdGlvbik7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ki9cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRcdFx0XG5cdHJlYWRlci5kYXRhID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKF9kYXRhID0gXywgcmVhZGVyKSA6IF9kYXRhO1xuXHR9O1xuXHRcblx0cmVhZGVyLmRlbGltaXRlciA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChkZWxpbWl0ZXIgPSBfLCByZWFkZXIpIDogZGVsaW1pdGVyO1xuXHR9O1xuXHRcblx0cmVhZGVyLnBhcnNlckNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHBhcnNlckNhbGxiYWNrID0gXywgcmVhZGVyKSA6IHBhcnNlckNhbGxiYWNrO1xuXHR9O1xuXHRcblx0cmVhZGVyLmNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNhbGxiYWNrID0gXywgcmVhZGVyKSA6IGNhbGxiYWNrOyBcblx0fTtcblx0XG5cdHJlYWRlci5lcnJvckNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGVycm9yQ2FsbGJhY2sgPSBfLCByZWFkZXIpIDogZXJyb3JDYWxsYmFjazsgXG5cdH07XG5cdFx0XG5cdHJldHVybiByZWFkZXI7XG59IiwiaW1wb3J0ICogYXMgZDMgZnJvbSBcImQzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGpzb24odXJsKSB7XG5cblx0dmFyXHRfdXJsID0gdXJsLFxuXHRcdF9kYXRhLFxuXHRcdGNhY2hlRGF0YSxcblx0XHRwYXJzZXJDYWxsYmFjayxcblx0XHRjYWxsYmFjayxcblx0XHRlcnJvckNhbGxiYWNrO1xuXHRcdFxuXHRmdW5jdGlvbiByZWFkZXIoc2VsZWN0aW9uKSB7XHRcdFxuXHRcdHNlbGVjdGlvbi5lYWNoKGZ1bmN0aW9uKGRhdGEsIGluZGV4KSB7XHRcblx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0Ly8gREVGQVVMVFNcblx0XHRcdHBhcnNlckNhbGxiYWNrID0gcGFyc2VyQ2FsbGJhY2sgfHwgZnVuY3Rpb24oZGF0YSkgeyByZXR1cm4gZGF0YTsgfTtcblx0XHRcdGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0XHRlcnJvckNhbGxiYWNrID0gZXJyb3JDYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHRcdFxuXHRcdFx0aWYoX2RhdGEgJiYgY2FjaGVEYXRhKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZGF0YSA9IEpTT04ucGFyc2UoX2RhdGEpO1xuXHRcdFx0XHRcdHBhcnNlckNhbGxiYWNrLmNhbGwodGhpcywgZGF0YSwgaW5kZXgpO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0c2VsZWN0aW9uXG5cdFx0XHRcdFx0XHQuZGF0dW0oZGF0YSlcblx0XHRcdFx0XHRcdC5jYWxsKGNhbGxiYWNrKTtcblx0XHRcdFx0fSBjYXRjaChlcnJvcikge1xuXHRcdFx0XHRcdHNlbGVjdGlvbi5jYWxsKGVycm9yQ2FsbGJhY2ssIGVycm9yICsgXCIgKFwiICsgZXJyb3IgKyBcIilcIik7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmKF91cmwpIHtcblx0XHRcdFx0XHRkMy5qc29uKF91cmwsIGZ1bmN0aW9uKGVycm9yLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHRpZihlcnJvcikge1xuXHRcdFx0XHRcdFx0XHRlcnJvckNhbGxiYWNrLmNhbGwodGhpcywgZXJyb3IpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cGFyc2VyQ2FsbGJhY2suY2FsbCh0aGlzLCBkYXRhLCBpbmRleCk7XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0c2VsZWN0aW9uXG5cdFx0XHRcdFx0XHRcdFx0LmRhdHVtKGRhdGEpXG5cdFx0XHRcdFx0XHRcdFx0LmNhbGwoY2FsbGJhY2spO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0XHRcdFxuXHRyZWFkZXIudXJsID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKF91cmwgPSBfLCByZWFkZXIpIDogX3VybDtcblx0fTtcblx0XG5cdHJlYWRlci5kYXRhID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKF9kYXRhID0gXywgcmVhZGVyKSA6IF9kYXRhO1xuXHR9O1xuXHRcblx0cmVhZGVyLmNhY2hlRGF0YSA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjYWNoZURhdGEgPSBfLCByZWFkZXIpIDogY2FjaGVEYXRhO1xuXHR9O1xuXHRcblx0cmVhZGVyLnBhcnNlckNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHBhcnNlckNhbGxiYWNrID0gXywgcmVhZGVyKSA6IHBhcnNlckNhbGxiYWNrO1xuXHR9O1xuXHRcblx0cmVhZGVyLmNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNhbGxiYWNrID0gXywgcmVhZGVyKSA6IGNhbGxiYWNrOyBcblx0fTtcblx0XG5cdHJlYWRlci5lcnJvckNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGVycm9yQ2FsbGJhY2sgPSBfLCByZWFkZXIpIDogZXJyb3JDYWxsYmFjazsgXG5cdH07XG5cdFx0XG5cdHJldHVybiByZWFkZXI7XG59IiwiaW1wb3J0ICogYXMgZDMgZnJvbSBcImQzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRlc3REYXRhKCkge1xuXG5cdHZhclx0eFR5cGUsXG5cdFx0eU1pbiwgeU1heCwgcm93cyxcblx0XHRleGl0UHJvYmFiaWxpdHksXG5cdFx0cGFyc2VyQ2FsbGJhY2ssXG5cdFx0Y2FsbGJhY2ssXG5cdFx0ZXJyb3JDYWxsYmFjaztcblx0XHRcdFxuXHRmdW5jdGlvbiByZWFkZXIoc2VsZWN0aW9uKSB7XG5cdFxuXHRcdHZhciBzY2FsZSA9IGQzLnNjYWxlTGluZWFyKCkuZG9tYWluKFswLDFdKS5yYW5nZShbeU1pbiwgeU1heF0pLFxuXHRcdFx0Zm9ybWF0ID0gZDMuZm9ybWF0KFwiLjRyXCIpO1xuXHRcdFxuXHRcdGZ1bmN0aW9uIHJhbmQoKSB7XG5cdFx0XHRyZXR1cm4gK2Zvcm1hdChzY2FsZShNYXRoLnJhbmRvbSgpKSk7XG5cdFx0fVxuXHRcdFxuXHRcdGZ1bmN0aW9uIGlkT2YoaSkge1xuXHRcdFx0cmV0dXJuIChpID49IDI2ID8gaWRPZigoaSAvIDI2ID4+IDApIC0gMSkgOiBcIlwiKSArXG5cdFx0XHRcdFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpcIltpICUgMjYgPj4gMF07XG5cdFx0fVxuXHRcblx0XHRzZWxlY3Rpb24uZWFjaChmdW5jdGlvbigpIHtcdFxuXHRcdFx0XG5cdFx0XHQvLyBERUZBVUxUU1xuXHRcdFx0eFR5cGUgPSB4VHlwZSB8fCBcIm9yZGluYWxcIjtcblx0XHRcdFxuXHRcdFx0cGFyc2VyQ2FsbGJhY2sgPSBwYXJzZXJDYWxsYmFjayB8fCBmdW5jdGlvbihkYXRhKSB7IHJldHVybiBkYXRhOyB9O1xuXHRcdFx0Y2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHRcdGVycm9yQ2FsbGJhY2sgPSBlcnJvckNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdFx0XHRcdFx0XG5cdFx0XHR2YXIgaSxcblx0XHRcdFx0a2V5cyA9IFtdO1xuXHRcdFx0Zm9yKGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XG5cdFx0XHRcdGtleXMucHVzaChpZE9mKGkpKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0dmFyIGNvcHlPZktleXMgPSBrZXlzLnNsaWNlKCk7XG5cdFx0XHRcblx0XHRcdGZvcihpID0gMDsgaSA8IGNvcHlPZktleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYoTWF0aC5yYW5kb20oKSA8IGV4aXRQcm9iYWJpbGl0eSkgY29weU9mS2V5cy5zcGxpY2UoaSwgMSk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHZhciBkYXRlID0gbmV3IERhdGUoKTtcblx0XHRcdFx0XG5cdFx0XHR2YXIgZGF0YSA9IGNvcHlPZktleXMubWFwKGZ1bmN0aW9uKGQsIGkpIHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcInhcIjogZnVuY3Rpb24oZCwgaSkge1xuXHRcdFx0XHRcdFx0c3dpdGNoKHhUeXBlKSB7XG5cdFx0XHRcdFx0XHRjYXNlIFwib3JkaW5hbFwiOiByZXR1cm4gZDtcblx0XHRcdFx0XHRcdGNhc2UgXCJjb250aW5vdXNcIjogcmV0dXJuIGk7XG5cdFx0XHRcdFx0XHRjYXNlIFwiZGF0ZVwiOiBcblx0XHRcdFx0XHRcdFx0ZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgMSk7IFxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZGF0ZS50b0lTT1N0cmluZygpLnNsaWNlKDAsIDEwKTtcblx0XHRcdFx0XHRcdGRlZmF1bHQ6IHJldHVybiBkO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0oZCwgaSksXG5cdFx0XHRcdFx0XCJ5XCI6IHJhbmQoKSxcblx0XHRcdFx0XHRcInkxXCI6IHJhbmQoKS8yLFxuXHRcdFx0XHRcdFwia2V5XCI6IGRcblx0XHRcdFx0fTtcblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHRwYXJzZXJDYWxsYmFjay5jYWxsKHRoaXMsIGRhdGEpO1xuXHRcdFx0XG5cdFx0XHRzZWxlY3Rpb25cblx0XHRcdFx0LmRhdHVtKGRhdGEpXG5cdFx0XHRcdC5jYWxsKGNhbGxiYWNrLCBzZWxlY3Rpb24pO1xuXHRcdH0pO1xuXHR9XG5cblx0cmVhZGVyLnhUeXBlID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHhUeXBlID0gXywgcmVhZGVyKSA6IHhUeXBlO1xuXHR9O1xuXHRcdFx0XHRcblx0cmVhZGVyLnlNaW4gPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeU1pbiA9IF8sIHJlYWRlcikgOiB5TWluO1xuXHR9O1xuXHRcblx0cmVhZGVyLnlNYXggPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeU1heCA9IF8sIHJlYWRlcikgOiB5TWF4O1xuXHR9O1xuXHRcblx0cmVhZGVyLnJvd3MgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocm93cyA9IF8sIHJlYWRlcikgOiByb3dzO1xuXHR9O1xuXHRcblx0cmVhZGVyLmV4aXRQcm9iYWJpbGl0eSA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChleGl0UHJvYmFiaWxpdHkgPSBfLCByZWFkZXIpIDogZXhpdFByb2JhYmlsaXR5O1xuXHR9O1xuXHRcblx0cmVhZGVyLnBhcnNlckNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHBhcnNlckNhbGxiYWNrID0gXywgcmVhZGVyKSA6IHBhcnNlckNhbGxiYWNrO1xuXHR9O1xuXHRcblx0cmVhZGVyLmNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNhbGxiYWNrID0gXywgcmVhZGVyKSA6IGNhbGxiYWNrOyBcblx0fTtcblx0XG5cdHJlYWRlci5lcnJvckNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGVycm9yQ2FsbGJhY2sgPSBfLCByZWFkZXIpIDogZXJyb3JDYWxsYmFjazsgXG5cdH07XG5cdFx0XG5cdHJldHVybiByZWFkZXI7XG59IiwiaW1wb3J0ICogYXMgZDMgZnJvbSBcImQzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFyY0xhYmVsKCkge1xuXG5cdHZhclx0bGF5ZXIsXG5cdFx0Y2xhc3NlZCxcblx0XHRvcmllbnQsXG5cdFx0d2lkdGgsIGhlaWdodCxcblx0XHRtYXJnaW4sXG5cdFx0a2V5LCB4LCB5LCB5MSwgY29sb3IsIHRleHQsXG5cdFx0eTFTY2FsZSwgY29sb3JTY2FsZSxcblx0XHR5TGFiZWwsXG5cdFx0dHJhbnNpdGlvbiwgZW50ZXJUcmFuc2l0aW9uLCBleGl0VHJhbnNpdGlvbixcblx0XHRjYWxsYmFjaywgZW50ZXJDYWxsYmFjaywgZXhpdENhbGxiYWNrLFxuXHRcdG1vdXNlT3ZlckNhbGxiYWNrLCBtb3VzZUxlYXZlQ2FsbGJhY2ssXG5cdFx0dG91Y2hTdGFydENhbGxiYWNrLCB0b3VjaEVuZENhbGxiYWNrLFxuXHRcdFxuXHRcdHRleHRGb3JtYXQsXG5cdFx0X3BpZSxcblx0XHRfYXJjO1xuXHRcdFxuXHRmdW5jdGlvbiB0ZW1wbGF0ZShzZWxlY3Rpb24pIHtcblx0XHRcblx0XHQvLyBERUZBVUxUU1x0XHRcblx0XHR0cmFuc2l0aW9uID0gdHJhbnNpdGlvbiB8fCBmdW5jdGlvbih0KSB7IHJldHVybiB0LmR1cmF0aW9uKDApOyB9O1xuXHRcdGVudGVyVHJhbnNpdGlvbiA9IGVudGVyVHJhbnNpdGlvbiB8fCBmdW5jdGlvbih0KSB7IHJldHVybiB0LmR1cmF0aW9uKDApOyB9O1xuXHRcdGV4aXRUcmFuc2l0aW9uID0gZXhpdFRyYW5zaXRpb24gfHwgZnVuY3Rpb24odCkgeyByZXR1cm4gdC5kdXJhdGlvbigwKTsgfTtcblx0XHRcblx0XHRjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdGVudGVyQ2FsbGJhY2sgPSBlbnRlckNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdGV4aXRDYWxsYmFjayA9IGV4aXRDYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHRcblx0XHRtb3VzZU92ZXJDYWxsYmFjayA9IG1vdXNlT3ZlckNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdG1vdXNlTGVhdmVDYWxsYmFjayA9IG1vdXNlTGVhdmVDYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHRcblx0XHR0b3VjaFN0YXJ0Q2FsbGJhY2sgPSB0b3VjaFN0YXJ0Q2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0dG91Y2hFbmRDYWxsYmFjayA9IHRvdWNoRW5kQ2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0XG5cdFx0Y2xhc3NlZCA9IGNsYXNzZWQgfHwgXCJhcmNMYWJlbFwiO1xuXHRcdFxuXHRcdF9waWUgPSBfcGllIHx8IHt9O1xuXHRcdF9hcmMgPSBfYXJjIHx8IHt9O1xuXHRcdFxuXHRcdHRleHRGb3JtYXQgPSB0ZXh0Rm9ybWF0IHx8IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH07XG5cdFx0XG5cdFx0dmFyIHcgPSB0ZW1wbGF0ZS5jb250ZW50V2lkdGgoKSxcblx0XHRcdGggPSB0ZW1wbGF0ZS5jb250ZW50SGVpZ2h0KCksXG5cdFx0XHRyYWRpdXMgPSBNYXRoLm1pbih3LCBoKSAvIDI7XG5cdFx0XG5cdFx0dmFyIHBpZSA9IGQzLnBpZSgpXG5cdFx0XHQuc29ydChudWxsKVxuXHRcdFx0LnZhbHVlKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHkoZCk7IH0pXG5cdFx0XHQuc3RhcnRBbmdsZShfcGllLnN0YXJ0QW5nbGUgPyAgX3BpZS5zdGFydEFuZ2xlICogTWF0aC5QSS8xODAgOiAwKVxuXHRcdFx0LmVuZEFuZ2xlKF9waWUuZW5kQW5nbGUgPyBfcGllLmVuZEFuZ2xlICogTWF0aC5QSS8xODAgOiAyICogTWF0aC5QSSlcblx0XHRcdC5wYWRBbmdsZShfcGllLnBhZEFuZ2xlID8gX3BpZS5wYWRBbmdsZSAqIE1hdGguUEkvMTgwIDogMCk7XG5cdFx0XG5cdFx0dmFyIGFyYyA9IGQzLmFyYygpXG5cdFx0XHQub3V0ZXJSYWRpdXMocmFkaXVzICogMC44KVxuXHRcdFx0Ly8uaW5uZXJSYWRpdXMocmFkaXVzICogMC40KTtcblx0XHRcdC5pbm5lclJhZGl1cyhfYXJjLmlubmVyUmFkaXVzID8gcmFkaXVzICogX2FyYy5pbm5lclJhZGl1cyA6IHJhZGl1cyAqIDAuNCk7XG5cdFx0XG5cdFx0dmFyIG91dGVyQXJjID0gZDMuYXJjKClcblx0XHRcdC5pbm5lclJhZGl1cyhyYWRpdXMgKiAwLjkpXG5cdFx0XHQub3V0ZXJSYWRpdXMocmFkaXVzICogMC45KTtcblx0XHRcdFxuXHRcdGZ1bmN0aW9uIG1pZEFuZ2xlKGQpe1xuXHRcdFx0cmV0dXJuIGQuc3RhcnRBbmdsZSArIChkLmVuZEFuZ2xlIC0gZC5zdGFydEFuZ2xlKSAvIDI7XG5cdFx0fVxuXHRcdFx0XG5cdFx0c2VsZWN0aW9uLmVhY2goZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XG5cdFx0XHR2YXIgbm9kZSA9IGQzLnNlbGVjdCh0aGlzKTtcblx0XHRcdFxuXHRcdFx0Ly8gQ2VudGVyIGFyY1xuXHRcdFx0dmFyIGcgPSBub2RlLnNlbGVjdChcImdcIik7XG5cdFx0XHRpZihnLmVtcHR5KCkpIHtcblx0XHRcdFx0ZyA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgdyAvIDIgKyBcIixcIiArIGggLyAyICsgXCIpXCIpO1xuXHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdGlmKGcuc2VsZWN0KFwiLmxhYmVsXCIpLmVtcHR5KCkpIHtcblx0XHRcdFx0Zy5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcImxhYmVsXCIpXHRcdFx0XHRcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIFwiLjM1ZW1cIilcblx0XHRcdFx0XHQuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHR5cGVvZiB5TGFiZWwgPT09IFwiZnVuY3Rpb25cIiA/IHlMYWJlbChkYXRhKSA6IHlMYWJlbDsgXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRcdFx0XHRcblx0XHRcdC8qIFRFWFQgKi9cblx0XHRcdFxuXHRcdFx0dmFyIGxhYmVscyA9IGcuc2VsZWN0KFwiLmxhYmVsc1wiKTtcblx0XHRcdFxuXHRcdFx0aWYobGFiZWxzLmVtcHR5KCkpIHtcblx0XHRcdFx0bGFiZWxzID0gZy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJjbGFzc1wiLCBjbGFzc2VkICsgXCIgbGFiZWxzXCIpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHQvLyBVUERBVEVcdFx0XG5cdFx0XHR2YXIgbGFiZWwgPSBsYWJlbHMuc2VsZWN0QWxsKFwiLmxhYmVsXCIpXG5cdFx0XHRcdC5kYXRhKHBpZShkYXRhKSwgZnVuY3Rpb24oZCkgeyByZXR1cm4ga2V5KGQuZGF0YSk7IH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcImxhYmVsIHVwZGF0ZVwiKTtcblx0XHRcdFxuXHRcdFx0Ly8gRU5URVJcdFxuXHRcdFx0bGFiZWwuZW50ZXIoKVxuXHRcdFx0XHQuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJsYWJlbCBlbnRlclwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiZHlcIiwgXCIuMzVlbVwiKVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gY29sb3JTY2FsZShjb2xvcihkLmRhdGEpKTsgfSlcblx0XHRcdFx0XHQuc3R5bGUoXCJmb250LXNpemVcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4geTEgJiYgeTFTY2FsZSA/IHkxU2NhbGUoeTEoZC5kYXRhKSkgKyBcImVtXCIgOiB1bmRlZmluZWQ7IH0pXG5cdFx0XHRcdFx0Lm9uKFwibW91c2VvdmVyXCIsIG1vdXNlT3ZlckNhbGxiYWNrKVxuXHRcdFx0XHRcdC5vbihcIm1vdXNlbGVhdmVcIiwgbW91c2VMZWF2ZUNhbGxiYWNrKVxuXHRcdFx0XHRcdC5vbihcInRvdWNoc3RhcnRcIiwgdG91Y2hTdGFydENhbGxiYWNrKVxuXHRcdFx0XHRcdC5vbihcInRvdWNoZW5kXCIsIHRvdWNoRW5kQ2FsbGJhY2spXG5cdFx0XHRcdFx0LmNhbGwoZW50ZXJDYWxsYmFjaylcblx0XHRcdFx0XHQubWVyZ2UobGFiZWwpXHQvLyBFTlRFUiArIFVQREFURVxuXHRcdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24oZCkgeyByZXR1cm4gdGV4dEZvcm1hdCh0ZXh0KGQuZGF0YSkpOyB9KVxuXHRcdFx0XHRcdFx0LnRyYW5zaXRpb24oKS5jYWxsKHRyYW5zaXRpb24pXG5cdFx0XHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gY29sb3JTY2FsZShjb2xvcihkLmRhdGEpKTsgfSlcblx0XHRcdFx0XHRcdFx0LnN0eWxlKFwiZm9udC1zaXplXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHkxICYmIHkxU2NhbGUgPyB5MVNjYWxlKHkxKGQuZGF0YSkpICsgXCJlbVwiIDogdW5kZWZpbmVkOyB9KVxuXHRcdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9jdXJyZW50ID0gdGhpcy5fY3VycmVudCB8fCBkO1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpbnRlcnBvbGF0ZSA9IGQzLmludGVycG9sYXRlKHRoaXMuX2N1cnJlbnQsIGQpO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2N1cnJlbnQgPSBpbnRlcnBvbGF0ZSgwKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24odCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGQyID0gaW50ZXJwb2xhdGUodCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgcG9zID0gb3V0ZXJBcmMuY2VudHJvaWQoZDIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0cG9zWzBdID0gcmFkaXVzICogKG1pZEFuZ2xlKGQyKSA+IDAgJiYgbWlkQW5nbGUoZDIpIDwgTWF0aC5QSSA/IDEgOiAtMSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJ0cmFuc2xhdGUoXCIrIHBvcyArXCIpXCI7XG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0LnN0eWxlVHdlZW4oXCJ0ZXh0LWFuY2hvclwiLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9jdXJyZW50ID0gdGhpcy5fY3VycmVudCB8fCBkO1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpbnRlcnBvbGF0ZSA9IGQzLmludGVycG9sYXRlKHRoaXMuX2N1cnJlbnQsIGQpO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2N1cnJlbnQgPSBpbnRlcnBvbGF0ZSgwKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24odCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGQyID0gaW50ZXJwb2xhdGUodCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gbWlkQW5nbGUoZDIpID4gMCAmJiBtaWRBbmdsZShkMikgPCBNYXRoLlBJID8gXCJzdGFydFwiIDogXCJlbmRcIjtcblx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQub24oXCJlbmRcIiwgZnVuY3Rpb24oKSB7IGQzLnNlbGVjdCh0aGlzKS5jYWxsKGNhbGxiYWNrKTsgfSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdC8vIEVYSVRcblx0XHRcdGxhYmVsLmV4aXQoKVxuXHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwibGFiZWwgZXhpdFwiKVxuXHRcdFx0XHQudHJhbnNpdGlvbigpLmNhbGwoZXhpdFRyYW5zaXRpb24pXG5cdFx0XHRcdFx0Lm9uKFwiZW5kXCIsIGZ1bmN0aW9uKCkgeyBkMy5zZWxlY3QodGhpcykuY2FsbChleGl0Q2FsbGJhY2spOyB9KVxuXHRcdFx0XHRcdC5yZW1vdmUoKTtcblx0XHRcdFx0XHRcblx0XHRcdC8qIExJTkVTICovXG5cdFx0XHRcblx0XHRcdHZhciBsaW5lcyA9IGcuc2VsZWN0KFwiLmxpbmVzXCIpO1xuXHRcdFx0XG5cdFx0XHRpZihsaW5lcy5lbXB0eSgpKSB7XG5cdFx0XHRcdGxpbmVzID0gZy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJjbGFzc1wiLCBjbGFzc2VkICsgXCIgbGluZXNcIik7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHZhciBwb2x5bGluZSA9IGxpbmVzLnNlbGVjdEFsbChcIi5saW5lXCIpXG5cdFx0XHRcdC5kYXRhKHBpZShkYXRhKSwgZnVuY3Rpb24oZCkgeyByZXR1cm4ga2V5KGQuZGF0YSk7IH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcImxpbmUgdXBkYXRlXCIpO1xuXHRcblx0XHRcdHBvbHlsaW5lLmVudGVyKClcblx0XHRcdFx0LmFwcGVuZChcInBvbHlsaW5lXCIpXG5cdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJsaW5lIGVudGVyXCIpXG5cdFx0XHRcdC5tZXJnZShwb2x5bGluZSlcblx0XHRcdFx0XHQudHJhbnNpdGlvbigpLmNhbGwodHJhbnNpdGlvbilcblx0XHRcdFx0XHRcdC5hdHRyVHdlZW4oXCJwb2ludHNcIiwgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2N1cnJlbnQgPSB0aGlzLl9jdXJyZW50IHx8IGQ7XG5cdFx0XHRcdFx0XHRcdHZhciBpbnRlcnBvbGF0ZSA9IGQzLmludGVycG9sYXRlKHRoaXMuX2N1cnJlbnQsIGQpO1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9jdXJyZW50ID0gaW50ZXJwb2xhdGUoMCk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbih0KSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGQyID0gaW50ZXJwb2xhdGUodCk7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHBvcyA9IG91dGVyQXJjLmNlbnRyb2lkKGQyKTtcblx0XHRcdFx0XHRcdFx0XHRwb3NbMF0gPSByYWRpdXMgKiAwLjk1ICogKG1pZEFuZ2xlKGQyKSA+IDAgJiYgbWlkQW5nbGUoZDIpIDwgTWF0aC5QSSA/IDEgOiAtMSk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFthcmMuY2VudHJvaWQoZDIpLCBvdXRlckFyYy5jZW50cm9pZChkMiksIHBvc107XG5cdFx0XHRcdFx0XHRcdH07XHRcdFx0XG5cdFx0XHRcdFx0XHR9KTtcblx0XG5cdFx0XHRwb2x5bGluZS5leGl0KClcblx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcImxpbmUgZXhpdFwiKVxuXHRcdFx0XHQudHJhbnNpdGlvbigpLmNhbGwoZXhpdFRyYW5zaXRpb24pXG5cdFx0XHRcdFx0LnJlbW92ZSgpO1xuXHRcdH0pO1xuXHR9XG5cblx0dGVtcGxhdGUubGF5ZXIgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGxheWVyID0gXywgdGVtcGxhdGUpIDogbGF5ZXIgfHwge307XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5jbGFzc2VkID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjbGFzc2VkID0gXywgdGVtcGxhdGUpIDogY2xhc3NlZDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLm9yaWVudCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAob3JpZW50ID0gXywgdGVtcGxhdGUpIDogb3JpZW50O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUud2lkdGggPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHdpZHRoID0gXywgdGVtcGxhdGUpIDogd2lkdGg7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5oZWlnaHQgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGhlaWdodCA9IF8sIHRlbXBsYXRlKSA6IGhlaWdodDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLm1hcmdpbiA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobWFyZ2luID0gXywgdGVtcGxhdGUpIDogbWFyZ2luO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuY29udGVudFdpZHRoID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHdpZHRoIC0gbWFyZ2luLnJpZ2h0IC0gbWFyZ2luLmxlZnQ7XG5cdH07XG5cdFx0XG5cdHRlbXBsYXRlLmNvbnRlbnRIZWlnaHQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5rZXkgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoa2V5ID0gXywgdGVtcGxhdGUpIDoga2V5O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUueCA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh4ID0gXywgdGVtcGxhdGUpIDogeDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLnkgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeSA9IF8sIHRlbXBsYXRlKSA6IHk7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS55MSA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh5MSA9IF8sIHRlbXBsYXRlKSA6IHkxO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuY29sb3IgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY29sb3IgPSBfLCB0ZW1wbGF0ZSkgOiBjb2xvcjtcblx0fTtcblxuXHR0ZW1wbGF0ZS50ZXh0ID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRleHQgPSBfLCB0ZW1wbGF0ZSkgOiB0ZXh0O1xuXHR9O1xuXG5cdHRlbXBsYXRlLnkxU2NhbGUgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHkxU2NhbGUgPSBfLCB0ZW1wbGF0ZSkgOiB5MVNjYWxlO1xuXHR9O1xuXHRcdFxuXHR0ZW1wbGF0ZS5jb2xvclNjYWxlID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjb2xvclNjYWxlID0gXywgdGVtcGxhdGUpIDogY29sb3JTY2FsZTtcblx0fTtcblx0XG5cdHRlbXBsYXRlLnlMYWJlbCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeUxhYmVsID0gXywgdGVtcGxhdGUpIDogeUxhYmVsOyBcblx0fTtcblx0XHRcblx0dGVtcGxhdGUudHJhbnNpdGlvbiA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodHJhbnNpdGlvbiA9IF8sIHRlbXBsYXRlKSA6IHRyYW5zaXRpb247XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5lbnRlclRyYW5zaXRpb24gPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGVudGVyVHJhbnNpdGlvbiA9IF8sIHRlbXBsYXRlKSA6IGVudGVyVHJhbnNpdGlvbjtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmV4aXRUcmFuc2l0aW9uID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChleGl0VHJhbnNpdGlvbiA9IF8sIHRlbXBsYXRlKSA6IGV4aXRUcmFuc2l0aW9uO1xuXHR9O1xuXHRcdFx0XG5cdHRlbXBsYXRlLmNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogY2FsbGJhY2s7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5lbnRlckNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGVudGVyQ2FsbGJhY2sgPSBfLCB0ZW1wbGF0ZSkgOiBlbnRlckNhbGxiYWNrO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuZXhpdENhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGV4aXRDYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IGV4aXRDYWxsYmFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLm1vdXNlT3ZlckNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKG1vdXNlT3ZlckNhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogbW91c2VPdmVyQ2FsbGJhY2s7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5tb3VzZUxlYXZlQ2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobW91c2VMZWF2ZUNhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogbW91c2VMZWF2ZUNhbGxiYWNrO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUudG91Y2hTdGFydENhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRvdWNoU3RhcnRDYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IHRvdWNoU3RhcnRDYWxsYmFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLnRvdWNoRW5kQ2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodG91Y2hFbmRDYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IHRvdWNoRW5kQ2FsbGJhY2s7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS50ZXh0Rm9ybWF0ID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0ZXh0Rm9ybWF0ID0gXywgdGVtcGxhdGUpIDogdGV4dEZvcm1hdDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmFyYyA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChfYXJjID0gXywgdGVtcGxhdGUpIDogX2FyYztcblx0fTtcblx0XG5cdHRlbXBsYXRlLnBpZSA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChfcGllID0gXywgdGVtcGxhdGUpIDogX3BpZTtcblx0fTtcblx0XG5cdHJldHVybiB0ZW1wbGF0ZTtcbn0iLCJpbXBvcnQgKiBhcyBkMyBmcm9tIFwiZDNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXhpcygpIHtcblxuXHR2YXJcdGxheWVyLFxuXHRcdGNsYXNzZWQsXG5cdFx0b3JpZW50LFxuXHRcdHpJbmRleCwgaGlkZSxcblx0XHRrZXksIHgsIHksIHkxLFxuXHRcdHhTY2FsZSwgeVNjYWxlLCB5MVNjYWxlLFxuXHRcdFxuXHRcdHhMYWJlbCwgeUxhYmVsLCB5MUxhYmVsLFxuXHRcdHhGb3JtYXQsIHlGb3JtYXQsIHkxRm9ybWF0LFxuXHRcdFxuXHRcdHhUaWNrcywgeVRpY2tzLCB5MVRpY2tzLFxuXHRcdHhUaWNrVmFsdWVzLCB5VGlja1ZhbHVlcywgeTFUaWNrVmFsdWVzLFxuXHRcdHhUaWNrUm90YXRlLCB5VGlja1JvdGF0ZSwgeTFUaWNrUm90YXRlLFxuXHRcdHhHcmlkLCB5R3JpZCwgeTFHcmlkLFxuXHRcdHhIaWRlLCB5SGlkZSwgeTFIaWRlLFxuXHRcdFxuXHRcdHRyYW5zaXRpb24sIGVudGVyVHJhbnNpdGlvbiwgZXhpdFRyYW5zaXRpb24sXG5cdFx0Y2FsbGJhY2ssIGVudGVyQ2FsbGJhY2ssIGV4aXRDYWxsYmFjaztcblx0XHRcblx0ZnVuY3Rpb24gdGVtcGxhdGUoc2VsZWN0aW9uKSB7XG5cdFx0XG5cdFx0Ly8gREVGQVVMVFNcblx0XHRjbGFzc2VkID0gY2xhc3NlZCB8fCBcImF4aXNcIjtcblx0XHRcblx0XHR0cmFuc2l0aW9uID0gdHJhbnNpdGlvbiB8fCBmdW5jdGlvbih0KSB7IHJldHVybiB0LmR1cmF0aW9uKDApOyB9O1xuXHRcdGVudGVyVHJhbnNpdGlvbiA9IGVudGVyVHJhbnNpdGlvbiB8fCBmdW5jdGlvbih0KSB7IHJldHVybiB0LmR1cmF0aW9uKDApOyB9O1xuXHRcdGV4aXRUcmFuc2l0aW9uID0gZXhpdFRyYW5zaXRpb24gfHwgZnVuY3Rpb24odCkgeyByZXR1cm4gdC5kdXJhdGlvbigwKTsgfTtcblx0XHRcblx0XHRjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdGVudGVyQ2FsbGJhY2sgPSBlbnRlckNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdGV4aXRDYWxsYmFjayA9IGV4aXRDYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHRcdFx0XG5cdFx0c2VsZWN0aW9uLmVhY2goZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XG5cdFx0XHR2YXIgeEF4aXMgPSBkMy5heGlzQm90dG9tKHhTY2FsZSlcblx0XHRcdFx0XHQudGlja3MoeFRpY2tzKVxuXHRcdFx0XHRcdC50aWNrVmFsdWVzKHhUaWNrVmFsdWVzKVxuXHRcdFx0XHRcdC50aWNrRm9ybWF0KHhGb3JtYXQpLFx0XHRcdFx0XG5cdFx0XHRcdFx0XG5cdFx0XHRcdHlBeGlzID0gZDMuYXhpc0xlZnQoeVNjYWxlKVxuXHRcdFx0XHRcdC50aWNrcyh5VGlja3MpXG5cdFx0XHRcdFx0LnRpY2tWYWx1ZXMoeVRpY2tWYWx1ZXMpXG5cdFx0XHRcdFx0LnRpY2tGb3JtYXQoeUZvcm1hdCksXG5cdFx0XHRcdFx0XG5cdFx0XHRcdHkxQXhpcyA9IGQzLmF4aXNSaWdodCh5MVNjYWxlKVxuXHRcdFx0XHRcdC50aWNrcyh5MVRpY2tzKVxuXHRcdFx0XHRcdC50aWNrVmFsdWVzKHkxVGlja1ZhbHVlcylcblx0XHRcdFx0XHQudGlja0Zvcm1hdCh5MUZvcm1hdCk7XG5cdFx0XG5cdFx0XHQvLyBHcmlkIHNldHRpbmdzXG5cdFx0XHRpZih4R3JpZCkgeEF4aXMudGlja1BhZGRpbmcoOCkudGlja1NpemVJbm5lcigteVNjYWxlLnJhbmdlKClbMF0pO1xuXHRcdFx0aWYoeUdyaWQpIHlBeGlzLnRpY2tQYWRkaW5nKDgpLnRpY2tTaXplSW5uZXIoLXhTY2FsZS5yYW5nZSgpWzFdKTtcblx0XHRcdGlmKHkxR3JpZCkgeTFBeGlzLnRpY2tQYWRkaW5nKDgpLnRpY2tTaXplSW5uZXIoLXhTY2FsZS5yYW5nZSgpWzFdKTtcblx0XHRcdFx0XHRcblx0XHRcdFxuXHRcdFx0Ly8gVVBEQVRFXG5cdFx0XHR2YXIgeGF4aXMgPSBkMy5zZWxlY3QodGhpcykuc2VsZWN0QWxsKFwiZy5heGlzLnhcIikuZGF0YShbMV0pLFxuXHRcdFx0XHR5YXhpcyA9IGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoXCJnLmF4aXMueVwiKS5kYXRhKFsxXSksXG5cdFx0XHRcdHkxYXhpcyA9IGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoXCJnLmF4aXMueTFcIikuZGF0YShbMV0pO1xuXHRcdFx0XG5cdFx0XHQvLyBFTlRFUlx0XG5cdFx0XHR2YXIgeEF4aXNFbnRlciA9IHhheGlzLmVudGVyKClcblx0XHRcdFx0LmFwcGVuZChcImdcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwiYXhpcyB4XCIpO1xuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0eEF4aXNFbnRlci5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJsYWJlbFwiKVxuXHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIHhTY2FsZS5yYW5nZSgpWzFdICsgXCIsMClcIilcblx0XHRcdFx0LmF0dHIoXCJkeVwiLCBcIi0wLjVlbVwiKVxuXHRcdFx0XHQuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKVxuXHRcdFx0XHQudGV4dCh0eXBlb2YgeExhYmVsID09PSBcImZ1bmN0aW9uXCIgPyB4TGFiZWwoZGF0YSkgOiB4TGFiZWwpO1xuXHRcdFx0XHRcblx0XHRcdHhBeGlzRW50ZXIubWVyZ2UoeGF4aXMpXHQvLyBFTlRFUiArIFVQREFURVxuXHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgeVNjYWxlLnJhbmdlKClbMF0gKyBcIilcIilcblx0XHRcdFx0LnN0eWxlKFwiZGlzcGxheVwiLCB4SGlkZSA/IFwibm9uZVwiIDogdW5kZWZpbmVkKVxuXHRcdFx0XHQuY2FsbCh4QXhpcyk7XG5cdFx0XHRcdFxuXHRcdFx0aWYoZDMubWluKHhTY2FsZS5kb21haW4oKSkgPCAwKSB7XG5cdFx0XHRcdHhBeGlzRW50ZXIuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJ6ZXJvXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJzdHJva2VcIiwgXCIjY2NjXCIpO1xuXHRcdFx0XHRcblx0XHRcdFx0eEF4aXNFbnRlci5tZXJnZSh4YXhpcykuc2VsZWN0KFwiLnplcm9cIilcdFxuXHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBkMy5saW5lKCkoW1t4U2NhbGUoMCksIC15U2NhbGUucmFuZ2UoKVswXV0sW3hTY2FsZSgwKSwgMF1dKSk7XG5cdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0aWYoeFRpY2tSb3RhdGUpIHtcblx0XHRcdFx0eEF4aXNFbnRlci5tZXJnZSh4YXhpcykuc2VsZWN0QWxsKFwiLnRpY2sgdGV4dFwiKVxuXHRcdFx0XHRcdC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJkeFwiLCAoMC4wMTIgKiB4VGlja1JvdGF0ZSkgKyBcImVtXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCAoMC4wMDYgKiB4VGlja1JvdGF0ZSkgKyBcImVtXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJyb3RhdGUoXCIgKyB4VGlja1JvdGF0ZSArIFwiKVwiKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0aWYoeEdyaWQpIHtcblx0XHRcdFx0eEF4aXNFbnRlci5tZXJnZSh4YXhpcykuc2VsZWN0QWxsKFwiLnRpY2sgbGluZVwiKVxuXHRcdFx0XHRcdC5zdHlsZShcIm9wYWNpdHlcIiwgeEdyaWQub3BhY2l0eSB8fCAwLjgpXG5cdFx0XHRcdFx0LnN0eWxlKFwic3Ryb2tlXCIsIHhHcmlkLnN0cm9rZSB8fCBcIiNjY2NcIilcblx0XHRcdFx0XHQuc3R5bGUoXCJzdHJva2UtZGFzaGFycmF5XCIsIHhHcmlkLnN0cm9rZURhc2hBcnJheSB8fCBcIjIsMlwiKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHlBeGlzRW50ZXIgPSB5YXhpcy5lbnRlcigpXG5cdFx0XHRcdC5hcHBlbmQoXCJnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcImF4aXMgeVwiKVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgeFNjYWxlLnJhbmdlKClbMF0gKyBcIiwwKVwiKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHR5QXhpc0VudGVyLmFwcGVuZChcInRleHRcIilcblx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcImxhYmVsXCIpXHRcdFx0XHRcblx0XHRcdFx0LmF0dHIoXCJkeFwiLCBcIi02XCIpXG5cdFx0XHRcdC5hdHRyKFwiZHlcIiwgXCItMC41NGVtXCIpXG5cdFx0XHRcdC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwic3RhcnRcIilcblx0XHRcdFx0LnRleHQodHlwZW9mIHlMYWJlbCA9PT0gXCJmdW5jdGlvblwiID8geUxhYmVsKGRhdGEpIDogeUxhYmVsKTtcblx0XHRcdFx0XHRcblx0XHRcdHlBeGlzRW50ZXIubWVyZ2UoeWF4aXMpXHQvLyBFTlRFUiArIFVQREFURVxuXHRcdFx0XHQuc3R5bGUoXCJkaXNwbGF5XCIsIHlIaWRlID8gXCJub25lXCIgOiB1bmRlZmluZWQpXG5cdFx0XHRcdC5jYWxsKHlBeGlzKTtcblx0XHRcdFx0XG5cdFx0XHRpZihkMy5taW4oeVNjYWxlLmRvbWFpbigpKSA8IDApIHtcblx0XHRcdFx0eUF4aXNFbnRlci5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcInplcm9cIilcblx0XHRcdFx0XHQuYXR0cihcInN0cm9rZVwiLCBcIiNjY2NcIik7XG5cdFx0XHRcdFxuXHRcdFx0XHR5QXhpc0VudGVyLm1lcmdlKHlheGlzKS5zZWxlY3QoXCIuemVyb1wiKVx0XG5cdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGQzLmxpbmUoKShbW3hTY2FsZS5yYW5nZSgpWzBdLCB5U2NhbGUoMCldLCBbeFNjYWxlLnJhbmdlKClbMV0sIHlTY2FsZSgwKV1dKSk7XG5cdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0aWYoeVRpY2tSb3RhdGUpIHtcblx0XHRcdFx0eUF4aXNFbnRlci5tZXJnZSh5YXhpcykuc2VsZWN0QWxsKFwiLnRpY2sgdGV4dFwiKVxuXHRcdFx0XHRcdC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJkeFwiLCAoMC4wMDYgKiB5VGlja1JvdGF0ZSArIDAuMSkgKyBcImVtXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCAoMC4wMTIgKiB5VGlja1JvdGF0ZSkgKyBcImVtXCIgKVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwicm90YXRlKFwiICsgeVRpY2tSb3RhdGUgKyBcIilcIik7XG5cdFx0XHR9XG5cblx0XHRcdGlmKHlHcmlkKSB7XG5cdFx0XHRcdHlBeGlzRW50ZXIubWVyZ2UoeWF4aXMpLnNlbGVjdEFsbChcIi50aWNrIGxpbmVcIilcblx0XHRcdFx0XHQuc3R5bGUoXCJvcGFjaXR5XCIsIHlHcmlkLm9wYWNpdHkgfHwgMC44KVxuXHRcdFx0XHRcdC5zdHlsZShcInN0cm9rZVwiLCB5R3JpZC5zdHJva2UgfHwgXCIjY2NjXCIpXG5cdFx0XHRcdFx0LnN0eWxlKFwic3Ryb2tlLWRhc2hhcnJheVwiLCB5R3JpZC5zdHJva2VEYXNoQXJyYXkgfHwgXCIyLDJcIik7XG5cdFx0XHR9XG5cblx0XHRcdGlmKHkxU2NhbGUpIHtcblx0XHRcdFx0dmFyIHkxQXhpc0VudGVyID0geTFheGlzLmVudGVyKClcblx0XHRcdFx0XHQuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcImF4aXMgeTFcIilcblx0XHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgeFNjYWxlLnJhbmdlKClbMV0gKyBcIiwwKVwiKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0eTFBeGlzRW50ZXIuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJsYWJlbFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiZHhcIiwgXCI2XCIpXHRcdFx0XG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBcIi0wLjU0ZW1cIilcblx0XHRcdFx0XHQuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKVxuXHRcdFx0XHRcdC50ZXh0KHR5cGVvZiB5MUxhYmVsID09PSBcImZ1bmN0aW9uXCIgPyB5MUxhYmVsKGRhdGEpIDogeTFMYWJlbCk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdHkxQXhpc0VudGVyLm1lcmdlKHkxYXhpcylcdC8vIEVOVEVSICsgVVBEQVRFXG5cdFx0XHRcdFx0LnN0eWxlKFwiZGlzcGxheVwiLCB5MUhpZGUgPyBcIm5vbmVcIiA6IHVuZGVmaW5lZClcblx0XHRcdFx0XHQuY2FsbCh5MUF4aXMpO1xuXHRcdFx0XHRcblx0XHRcdFx0aWYoeTFUaWNrUm90YXRlKSB7XG5cdFx0XHRcdFx0eTFBeGlzRW50ZXIubWVyZ2UoeTFheGlzKS5zZWxlY3RBbGwoXCIudGljayB0ZXh0XCIpXG5cdFx0XHRcdFx0XHQuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcInN0YXJ0XCIpXG5cdFx0XHRcdFx0XHQuYXR0cihcImR4XCIsICgwLjAwNiAqIHkxVGlja1JvdGF0ZSArIDAuMSkgKyBcImVtXCIpXG5cdFx0XHRcdFx0XHQuYXR0cihcImR5XCIsICgwLjAxMiAqIHkxVGlja1JvdGF0ZSkgKyBcImVtXCIgKVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJyb3RhdGUoXCIgKyB5MVRpY2tSb3RhdGUgKyBcIilcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdGlmKHkxR3JpZCkge1xuXHRcdFx0XHRcdHkxQXhpc0VudGVyLm1lcmdlKHkxYXhpcykuc2VsZWN0QWxsKFwiLnRpY2sgbGluZVwiKVxuXHRcdFx0XHRcdFx0LnN0eWxlKFwib3BhY2l0eVwiLCB5MUdyaWQub3BhY2l0eSB8fCAwLjgpXG5cdFx0XHRcdFx0XHQuc3R5bGUoXCJzdHJva2VcIiwgeTFHcmlkLnN0cm9rZSB8fCBcIiNjY2NcIilcblx0XHRcdFx0XHRcdC5zdHlsZShcInN0cm9rZS1kYXNoYXJyYXlcIiwgeTFHcmlkLnN0cm9rZURhc2hBcnJheSB8fCBcIjIsMlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0dGVtcGxhdGUubGF5ZXIgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGxheWVyID0gXywgdGVtcGxhdGUpIDogbGF5ZXIgfHwge307XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5jbGFzc2VkID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjbGFzc2VkID0gXywgdGVtcGxhdGUpIDogY2xhc3NlZDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLm9yaWVudCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAob3JpZW50ID0gXywgdGVtcGxhdGUpIDogb3JpZW50O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuekluZGV4ID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh6SW5kZXggPSBfLCB0ZW1wbGF0ZSkgOiArekluZGV4O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuaGlkZSA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoaGlkZSA9IF8sIHRlbXBsYXRlKSA6IGhpZGU7XG5cdH07XG5cblx0dGVtcGxhdGUua2V5ID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChrZXkgPSBfLCB0ZW1wbGF0ZSkgOiBrZXk7XG5cdH07XG5cdFx0XG5cdHRlbXBsYXRlLnggPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHggPSBfLCB0ZW1wbGF0ZSkgOiB4O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUueSA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeSA9IF8sIHRlbXBsYXRlKSA6IHk7IFxuXHR9O1xuXHRcblx0dGVtcGxhdGUueTEgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHkxID0gXywgdGVtcGxhdGUpIDogeTE7IFxuXHR9O1xuXHRcdFx0XG5cdHRlbXBsYXRlLnhTY2FsZSA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeFNjYWxlID0gXywgdGVtcGxhdGUpIDogeFNjYWxlO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUueVNjYWxlID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh5U2NhbGUgPSBfLCB0ZW1wbGF0ZSkgOiB5U2NhbGU7IFxuXHR9O1xuXHRcblx0dGVtcGxhdGUueTFTY2FsZSA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeTFTY2FsZSA9IF8sIHRlbXBsYXRlKSA6IHkxU2NhbGU7IFxuXHR9O1xuXHRcblx0dGVtcGxhdGUueExhYmVsID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh4TGFiZWwgPSBfLCB0ZW1wbGF0ZSkgOiB4TGFiZWw7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS55TGFiZWwgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHlMYWJlbCA9IF8sIHRlbXBsYXRlKSA6IHlMYWJlbDsgXG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS55MUxhYmVsID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh5MUxhYmVsID0gXywgdGVtcGxhdGUpIDogeTFMYWJlbDsgXG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS54VGlja3MgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHhUaWNrcyA9IF8sIHRlbXBsYXRlKSA6IHhUaWNrcztcblx0fTtcblx0XG5cdHRlbXBsYXRlLnlUaWNrcyA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeVRpY2tzID0gXywgdGVtcGxhdGUpIDogeVRpY2tzOyBcblx0fTtcblx0XG5cdHRlbXBsYXRlLnkxVGlja3MgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHkxVGlja3MgPSBfLCB0ZW1wbGF0ZSkgOiB5MVRpY2tzOyBcblx0fTtcblx0XG5cdHRlbXBsYXRlLnhUaWNrVmFsdWVzID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh4VGlja1ZhbHVlcyA9IF8sIHRlbXBsYXRlKSA6IHhUaWNrVmFsdWVzO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUueVRpY2tWYWx1ZXMgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHlUaWNrVmFsdWVzID0gXywgdGVtcGxhdGUpIDogeVRpY2tWYWx1ZXM7IFxuXHR9O1xuXHRcblx0dGVtcGxhdGUueTFUaWNrVmFsdWVzID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh5MVRpY2tWYWx1ZXMgPSBfLCB0ZW1wbGF0ZSkgOiB5MVRpY2tWYWx1ZXM7IFxuXHR9O1xuXG5cdHRlbXBsYXRlLnhGb3JtYXQgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHhGb3JtYXQgPSBfLCB0ZW1wbGF0ZSkgOiB4Rm9ybWF0O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUueUZvcm1hdCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeUZvcm1hdCA9IF8sIHRlbXBsYXRlKSA6IHlGb3JtYXQ7IFxuXHR9O1xuXHRcblx0dGVtcGxhdGUueTFGb3JtYXQgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHkxRm9ybWF0ID0gXywgdGVtcGxhdGUpIDogeTFGb3JtYXQ7IFxuXHR9O1xuXHRcblx0dGVtcGxhdGUueFRpY2tSb3RhdGUgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHhUaWNrUm90YXRlID0gXywgdGVtcGxhdGUpIDogeFRpY2tSb3RhdGU7XG5cdH07XG5cblx0dGVtcGxhdGUueVRpY2tSb3RhdGUgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHlUaWNrUm90YXRlID0gXywgdGVtcGxhdGUpIDogeVRpY2tSb3RhdGU7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS55MVRpY2tSb3RhdGUgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHkxVGlja1JvdGF0ZSA9IF8sIHRlbXBsYXRlKSA6IHkxVGlja1JvdGF0ZTtcblx0fTtcblx0XG5cdHRlbXBsYXRlLnhHcmlkID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh4R3JpZCA9IF8sIHRlbXBsYXRlKSA6IHhHcmlkO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUueUdyaWQgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHlHcmlkID0gXywgdGVtcGxhdGUpIDogeUdyaWQ7IFxuXHR9O1xuXHRcblx0dGVtcGxhdGUueTFHcmlkID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh5MUdyaWQgPSBfLCB0ZW1wbGF0ZSkgOiB5MUdyaWQ7IFxuXHR9O1xuXHRcdFx0XG5cdHRlbXBsYXRlLnhIaWRlID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh4SGlkZSA9IF8sIHRlbXBsYXRlKSA6IHhIaWRlO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUueUhpZGUgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHlIaWRlID0gXywgdGVtcGxhdGUpIDogeUhpZGU7IFxuXHR9O1xuXHRcblx0dGVtcGxhdGUueTFIaWRlID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh5MUhpZGUgPSBfLCB0ZW1wbGF0ZSkgOiB5MUhpZGU7IFxuXHR9O1xuXHRcblx0dGVtcGxhdGUudHJhbnNpdGlvbiA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0cmFuc2l0aW9uID0gXywgdGVtcGxhdGUpIDogdHJhbnNpdGlvbjtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmVudGVyVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZW50ZXJUcmFuc2l0aW9uID0gXywgdGVtcGxhdGUpIDogZW50ZXJUcmFuc2l0aW9uO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuZXhpdFRyYW5zaXRpb24gPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGV4aXRUcmFuc2l0aW9uID0gXywgdGVtcGxhdGUpIDogZXhpdFRyYW5zaXRpb247XG5cdH07XG5cdFx0XHRcblx0dGVtcGxhdGUuY2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY2FsbGJhY2sgPSBfLCB0ZW1wbGF0ZSkgOiBjYWxsYmFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLmVudGVyQ2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZW50ZXJDYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IGVudGVyQ2FsbGJhY2s7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5leGl0Q2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZXhpdENhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogZXhpdENhbGxiYWNrO1xuXHR9O1xuXHRcblx0cmV0dXJuIHRlbXBsYXRlO1xufSIsImltcG9ydCAqIGFzIGQzIGZyb20gXCJkM1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBiYWNrZ3JvdW5kKCkge1xuXG5cdHZhciBsYXllcixcblx0XHRjbGFzc2VkLFxuXHRcdHdpZHRoLCBoZWlnaHQsXG5cdFx0ZmlsbCxcblx0XHRvcGFjaXR5LFxuXHRcdFxuXHRcdHRyYW5zaXRpb24sXG5cdFx0Y2FsbGJhY2s7XG5cdFx0XG5cdGZ1bmN0aW9uIHRlbXBsYXRlKHNlbGVjdGlvbikge1xuXHRcblx0XHQvLyBERUZBVUxUU1xuXHRcdGNsYXNzZWQgPSBjbGFzc2VkIHx8IFwiYmFja2dyb3VuZFwiO1xuXHRcdFx0XHRcblx0XHR0cmFuc2l0aW9uID0gdHJhbnNpdGlvbiB8fCBmdW5jdGlvbih0KSB7IHJldHVybiB0LmR1cmF0aW9uKDApOyB9O1xuXHRcdGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0XG5cdFx0c2VsZWN0aW9uLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XG5cdFx0XHR2YXIgYmFja2dyb3VuZEVudGVyID0gZDMuc2VsZWN0KHRoaXMpXG5cdFx0XHRcdC5zZWxlY3RBbGwoXCIuXCIgKyBjbGFzc2VkLnJlcGxhY2UoXCIgXCIsIFwiLlwiKSkuZGF0YShbMV0pLmVudGVyKCk7XG5cdFx0XHRcdFx0XG5cdFx0XHRiYWNrZ3JvdW5kRW50ZXIuYXBwZW5kKFwicmVjdFwiKVxuXHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGNsYXNzZWQgKyBcIiBlbnRlclwiKVxuXHRcdFx0XHQuYXR0cihcInhcIiwgd2lkdGgvMilcblx0XHRcdFx0LmF0dHIoXCJ5XCIsIGhlaWdodC8yKVxuXHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIDApXG5cdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIDApXG5cdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBmaWxsKVxuXHRcdFx0XHQuc3R5bGUoXCJvcGFjaXR5XCIsIG9wYWNpdHkpXG5cdFx0XHRcdC50cmFuc2l0aW9uKCkuY2FsbCh0cmFuc2l0aW9uKVxuXHRcdFx0XHRcdC5hdHRyKFwieFwiLCAwKVxuXHRcdFx0XHRcdC5hdHRyKFwieVwiLCAwKVxuXHRcdFx0XHRcdC5hdHRyKFwid2lkdGhcIiwgd2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KVxuXHRcdFx0XHRcdC5vbihcImVuZFwiLCBmdW5jdGlvbigpIHsgZDMuc2VsZWN0KHRoaXMpLmNhbGwoY2FsbGJhY2spOyB9KTtcblx0XHR9KTtcblx0fVxuXG5cdHRlbXBsYXRlLmxheWVyID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChsYXllciA9IF8sIHRlbXBsYXRlKSA6IGxheWVyIHx8IHt9O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuY2xhc3NlZCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY2xhc3NlZCA9IF8sIHRlbXBsYXRlKSA6IGNsYXNzZWQ7XG5cdH07XG5cdFx0XG5cdHRlbXBsYXRlLndpZHRoID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh3aWR0aCA9IF8sIHRlbXBsYXRlKSA6IHdpZHRoO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuaGVpZ2h0ID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChoZWlnaHQgPSBfLCB0ZW1wbGF0ZSkgOiBoZWlnaHQ7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5maWxsID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChmaWxsID0gXywgdGVtcGxhdGUpIDogZmlsbDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLm9wYWNpdHkgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKG9wYWNpdHkgPSBfLCB0ZW1wbGF0ZSkgOiBvcGFjaXR5O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUudHJhbnNpdGlvbiA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0cmFuc2l0aW9uID0gXywgdGVtcGxhdGUpIDogdHJhbnNpdGlvbjtcblx0fTtcblx0XHRcdFxuXHR0ZW1wbGF0ZS5jYWxsYmFjayA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IGNhbGxiYWNrO1xuXHR9O1xuXHRcdFx0XHRcdFx0XG5cdHJldHVybiB0ZW1wbGF0ZTtcbn0iLCJpbXBvcnQgKiBhcyBkMyBmcm9tIFwiZDNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYmFyKCkge1xuXG5cdHZhclx0bGF5ZXIsXG5cdFx0Y2xhc3NlZCxcblx0XHRvcmllbnQsXG5cdFx0a2V5LCB4LCB5LCBjb2xvcixcblx0XHR4U2NhbGUsIHlTY2FsZSwgY29sb3JTY2FsZSxcblx0XHR0cmFuc2l0aW9uLCBlbnRlclRyYW5zaXRpb24sIGV4aXRUcmFuc2l0aW9uLFxuXHRcdGNhbGxiYWNrLCBlbnRlckNhbGxiYWNrLCBleGl0Q2FsbGJhY2ssXG5cdFx0bW91c2VPdmVyQ2FsbGJhY2ssIG1vdXNlTGVhdmVDYWxsYmFjayxcblx0XHR0b3VjaFN0YXJ0Q2FsbGJhY2ssIHRvdWNoRW5kQ2FsbGJhY2s7XG5cdFx0XG5cdGZ1bmN0aW9uIHRlbXBsYXRlKHNlbGVjdGlvbikge1xuXHRcdFxuXHRcdC8vIERFRkFVTFRTXHRcdFxuXHRcdHRyYW5zaXRpb24gPSB0cmFuc2l0aW9uIHx8IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHQuZHVyYXRpb24oMCk7IH07XG5cdFx0ZW50ZXJUcmFuc2l0aW9uID0gZW50ZXJUcmFuc2l0aW9uIHx8IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHQuZHVyYXRpb24oMCk7IH07XG5cdFx0ZXhpdFRyYW5zaXRpb24gPSBleGl0VHJhbnNpdGlvbiB8fCBmdW5jdGlvbih0KSB7IHJldHVybiB0LmR1cmF0aW9uKDApOyB9O1xuXHRcdFxuXHRcdGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0ZW50ZXJDYWxsYmFjayA9IGVudGVyQ2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0ZXhpdENhbGxiYWNrID0gZXhpdENhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdFxuXHRcdG1vdXNlT3ZlckNhbGxiYWNrID0gbW91c2VPdmVyQ2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0bW91c2VMZWF2ZUNhbGxiYWNrID0gbW91c2VMZWF2ZUNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdFxuXHRcdHRvdWNoU3RhcnRDYWxsYmFjayA9IHRvdWNoU3RhcnRDYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHR0b3VjaEVuZENhbGxiYWNrID0gdG91Y2hFbmRDYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHRcblx0XHRjbGFzc2VkID0gY2xhc3NlZCB8fCBcImJhclwiO1xuXHRcdFxuXHRcdHNlbGVjdGlvbi5lYWNoKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcblx0XHRcdC8vIFVQREFURVx0XHRcblx0XHRcdHZhciBiYXIgPSBkMy5zZWxlY3QodGhpcykuc2VsZWN0QWxsKFwiLlwiICsgY2xhc3NlZC5yZXBsYWNlKFwiIFwiLCBcIi5cIikpLmRhdGEoZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4ga2V5KGQpOyB9KVxuXHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGNsYXNzZWQgKyBcIiB1cGRhdGVcIik7XG5cdFx0XHRcblx0XHRcdC8vIEVOVEVSXHRcblx0XHRcdGJhci5lbnRlcigpXG5cdFx0XHRcdC5hcHBlbmQoXCJyZWN0XCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBjbGFzc2VkICsgXCIgZW50ZXJcIilcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKHgoZCkpOyB9KVxuXHRcdFx0XHRcdC5hdHRyKFwieVwiLCBmdW5jdGlvbigpIHsgcmV0dXJuIHlTY2FsZSgwKTsgfSlcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIGZ1bmN0aW9uKCkgeyByZXR1cm4geFNjYWxlLmJhbmR3aWR0aCgpOyB9KVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIDApXG5cdFx0XHRcdFx0Lm9uKFwibW91c2VvdmVyXCIsIG1vdXNlT3ZlckNhbGxiYWNrKVxuXHRcdFx0XHRcdC5vbihcIm1vdXNlbGVhdmVcIiwgbW91c2VMZWF2ZUNhbGxiYWNrKVxuXHRcdFx0XHRcdC5vbihcInRvdWNoc3RhcnRcIiwgdG91Y2hTdGFydENhbGxiYWNrKVxuXHRcdFx0XHRcdC5vbihcInRvdWNoZW5kXCIsIHRvdWNoRW5kQ2FsbGJhY2spXG5cdFx0XHRcdFx0LmNhbGwoZW50ZXJDYWxsYmFjaylcblx0XHRcdFx0XHQubWVyZ2UoYmFyKVx0Ly8gRU5URVIgKyBVUERBVEVcblx0XHRcdFx0XHRcdC5hdHRyKFwieFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoeChkKSk7IH0pXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIGZ1bmN0aW9uKCkgeyByZXR1cm4geFNjYWxlLmJhbmR3aWR0aCgpOyB9KVxuXHRcdFx0XHRcdFx0LnRyYW5zaXRpb24oKS5jYWxsKHRyYW5zaXRpb24pXG5cdFx0XHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gY29sb3JTY2FsZShjb2xvcihkKSk7IH0pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwieVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiB5KGQpID4gMCA/IHlTY2FsZSh5KGQpKSA6IHlTY2FsZSgwKTsgfSlcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gTWF0aC5hYnMoeVNjYWxlKDApIC0geVNjYWxlKHkoZCkpKTsgfSlcblx0XHRcdFx0XHRcdFx0Lm9uKFwiZW5kXCIsIGZ1bmN0aW9uKCkgeyBkMy5zZWxlY3QodGhpcykuY2FsbChjYWxsYmFjayk7IH0pO1xuXHRcdFxuXHRcdFx0Ly8gRVhJVFxuXHRcdFx0YmFyLmV4aXQoKVxuXHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGNsYXNzZWQgKyBcIiBleGl0XCIpXG5cdFx0XHRcdC50cmFuc2l0aW9uKCkuY2FsbChleGl0VHJhbnNpdGlvbilcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIDApXG5cdFx0XHRcdFx0Lm9uKFwiZW5kXCIsIGZ1bmN0aW9uKCkgeyBkMy5zZWxlY3QodGhpcykuY2FsbChleGl0Q2FsbGJhY2spOyB9KVxuXHRcdFx0XHRcdC5yZW1vdmUoKTtcblx0XHR9KTtcblx0fVxuXG5cdHRlbXBsYXRlLmxheWVyID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChsYXllciA9IF8sIHRlbXBsYXRlKSA6IGxheWVyIHx8IHt9O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuY2xhc3NlZCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY2xhc3NlZCA9IF8sIHRlbXBsYXRlKSA6IGNsYXNzZWQ7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5vcmllbnQgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKG9yaWVudCA9IF8sIHRlbXBsYXRlKSA6IG9yaWVudDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmtleSA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChrZXkgPSBfLCB0ZW1wbGF0ZSkgOiBrZXk7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS54ID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHggPSBfLCB0ZW1wbGF0ZSkgOiB4O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUueSA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh5ID0gXywgdGVtcGxhdGUpIDogeTtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmNvbG9yID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNvbG9yID0gXywgdGVtcGxhdGUpIDogY29sb3I7XG5cdH07XG5cdFx0XHRcblx0dGVtcGxhdGUueFNjYWxlID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh4U2NhbGUgPSBfLCB0ZW1wbGF0ZSkgOiB4U2NhbGU7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS55U2NhbGUgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHlTY2FsZSA9IF8sIHRlbXBsYXRlKSA6IHlTY2FsZTsgXG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5jb2xvclNjYWxlID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjb2xvclNjYWxlID0gXywgdGVtcGxhdGUpIDogY29sb3JTY2FsZTtcblx0fTtcblx0XHRcblx0dGVtcGxhdGUudHJhbnNpdGlvbiA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodHJhbnNpdGlvbiA9IF8sIHRlbXBsYXRlKSA6IHRyYW5zaXRpb247XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5lbnRlclRyYW5zaXRpb24gPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGVudGVyVHJhbnNpdGlvbiA9IF8sIHRlbXBsYXRlKSA6IGVudGVyVHJhbnNpdGlvbjtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmV4aXRUcmFuc2l0aW9uID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChleGl0VHJhbnNpdGlvbiA9IF8sIHRlbXBsYXRlKSA6IGV4aXRUcmFuc2l0aW9uO1xuXHR9O1xuXHRcdFx0XG5cdHRlbXBsYXRlLmNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogY2FsbGJhY2s7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5lbnRlckNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGVudGVyQ2FsbGJhY2sgPSBfLCB0ZW1wbGF0ZSkgOiBlbnRlckNhbGxiYWNrO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuZXhpdENhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGV4aXRDYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IGV4aXRDYWxsYmFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLm1vdXNlT3ZlckNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKG1vdXNlT3ZlckNhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogbW91c2VPdmVyQ2FsbGJhY2s7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5tb3VzZUxlYXZlQ2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobW91c2VMZWF2ZUNhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogbW91c2VMZWF2ZUNhbGxiYWNrO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUudG91Y2hTdGFydENhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRvdWNoU3RhcnRDYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IHRvdWNoU3RhcnRDYWxsYmFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLnRvdWNoRW5kQ2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodG91Y2hFbmRDYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IHRvdWNoRW5kQ2FsbGJhY2s7XG5cdH07XG5cdFxuXHRyZXR1cm4gdGVtcGxhdGU7XG59IiwiaW1wb3J0ICogYXMgZDMgZnJvbSBcImQzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJ1YmJsZSgpIHtcblxuXHR2YXJcdGxheWVyLFxuXHRcdGNsYXNzZWQsXG5cdFx0d2lkdGgsIGhlaWdodCxcblx0XHRtYXJnaW4sXG5cdFx0eCwgeSwgY29sb3IsXG5cdFx0Y29sb3JTY2FsZSxcblx0XHR5TGFiZWwsXG5cdFx0c29ydCxcblx0XHRzdHJva2UsXG5cdFx0dHJhbnNpdGlvbiwgZW50ZXJUcmFuc2l0aW9uLCBleGl0VHJhbnNpdGlvbixcblx0XHRjYWxsYmFjaywgZW50ZXJDYWxsYmFjaywgZXhpdENhbGxiYWNrLFxuXHRcdG1vdXNlT3ZlckNhbGxiYWNrLCBtb3VzZUxlYXZlQ2FsbGJhY2ssXG5cdFx0dG91Y2hTdGFydENhbGxiYWNrLCB0b3VjaEVuZENhbGxiYWNrLFxuXHRcdFxuXHRcdF9wYWNrLFxuXHRcdF9idWJibGU7XG5cdFx0XG5cdGZ1bmN0aW9uIHRlbXBsYXRlKHNlbGVjdGlvbikge1xuXHRcdFxuXHRcdC8vIERFRkFVTFRTXHRcdFxuXHRcdHRyYW5zaXRpb24gPSB0cmFuc2l0aW9uIHx8IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHQuZHVyYXRpb24oMCk7IH07XG5cdFx0ZW50ZXJUcmFuc2l0aW9uID0gZW50ZXJUcmFuc2l0aW9uIHx8IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHQuZHVyYXRpb24oMCk7IH07XG5cdFx0ZXhpdFRyYW5zaXRpb24gPSBleGl0VHJhbnNpdGlvbiB8fCBmdW5jdGlvbih0KSB7IHJldHVybiB0LmR1cmF0aW9uKDApOyB9O1xuXHRcdFxuXHRcdGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0ZW50ZXJDYWxsYmFjayA9IGVudGVyQ2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0ZXhpdENhbGxiYWNrID0gZXhpdENhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdFxuXHRcdG1vdXNlT3ZlckNhbGxiYWNrID0gbW91c2VPdmVyQ2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0bW91c2VMZWF2ZUNhbGxiYWNrID0gbW91c2VMZWF2ZUNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdFxuXHRcdHRvdWNoU3RhcnRDYWxsYmFjayA9IHRvdWNoU3RhcnRDYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHR0b3VjaEVuZENhbGxiYWNrID0gdG91Y2hFbmRDYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHRcdFx0XG5cdFx0Y2xhc3NlZCA9IGNsYXNzZWQgfHwgXCJidWJibGVcIjtcblx0XHRcdFx0XG5cdFx0c3Ryb2tlID0gc3Ryb2tlIHx8IHt9O1xuXHRcdFxuXHRcdF9wYWNrID0gX3BhY2sgfHwgeyBwYWRkaW5nOiAxLjUgfTtcblx0XHRfYnViYmxlID0gX2J1YmJsZSB8fCB7fTtcblx0XHRcblx0XHR2YXIgdyA9IHRlbXBsYXRlLmNvbnRlbnRXaWR0aCgpLFxuXHRcdFx0aCA9IHRlbXBsYXRlLmNvbnRlbnRIZWlnaHQoKSxcblx0XHRcdGRpYW1ldGVyID0gTWF0aC5taW4odywgaCk7XG5cdFx0XHRcdFx0XHRcdFxuXHRcdHZhciBidWJibGUgPSBkMy5wYWNrKClcblx0XHRcdC5zaXplKFtkaWFtZXRlciwgZGlhbWV0ZXJdKVxuXHRcdFx0LnBhZGRpbmcoX3BhY2sucGFkZGluZyB8fCAxLjUpO1xuXHRcdFx0XHRcblx0XHRzZWxlY3Rpb24uZWFjaChmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcblx0XHRcdGlmKCFkYXRhLm5hbWUpIHtcblx0XHRcdFx0ZGF0YSA9IHsgbmFtZTogXCJyb290XCIsIGNoaWxkcmVuOiBkYXRhIH07XG5cdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHR2YXIgcm9vdCA9IGQzLmhpZXJhcmNoeShjbGFzc2VzKGRhdGEpKVxuXHRcdFx0XHQuc3VtKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQudmFsdWU7IH0pXG5cdFx0XHRcdC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIHNvcnQgPyBzb3J0KGEudmFsdWUsIGIudmFsdWUpIDogdHJ1ZTsgfSk7XG5cdFx0XHRcdFx0XHRcblx0XHRcdGJ1YmJsZShyb290KTtcblx0XHRcdFx0XHRcdFxuXHRcdFx0dmFyIG5vZGUgPSBkMy5zZWxlY3QodGhpcyk7XG5cdFx0XHRcblx0XHRcdC8vIENlbnRlciBidWJibGVzXG5cdFx0XHR2YXIgZyA9IG5vZGUuc2VsZWN0KFwiZ1wiKTtcblx0XHRcdGlmKGcuZW1wdHkoKSkge1xuXHRcdFx0XHRnID0gbm9kZS5hcHBlbmQoXCJnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAody8yIC0gZGlhbWV0ZXIvMikgKyBcIiwtXCIgKyAoaC8yIC0gZGlhbWV0ZXIvMikgKyBcIilcIik7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdC8vIExhYmVsXG5cdFx0XHRpZihnLnNlbGVjdChcIi5sYWJlbFwiKS5lbXB0eSgpKSB7XG5cdFx0XHRcdGcuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJsYWJlbFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgZGlhbWV0ZXIgKyBcIixcIiArIGggKyBcIilcIilcdFx0XHRcblx0XHRcdFx0XHQuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHR5cGVvZiB5TGFiZWwgPT09IFwiZnVuY3Rpb25cIiA/IHlMYWJlbChkYXRhLmNoaWxkcmVuKSA6IHlMYWJlbDsgXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFVQREFURVx0XHRcblx0XHRcdHZhciBidWJibGVzID0gZy5zZWxlY3RBbGwoXCIuXCIgKyBjbGFzc2VkLnJlcGxhY2UoXCIgXCIsIFwiLlwiKSlcblx0XHRcdFx0LmRhdGEocm9vdC5jaGlsZHJlbiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5kYXRhLnBhY2thZ2VOYW1lICsgXCItXCIgKyBkLmRhdGEuY2xhc3NOYW1lOyB9KVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgY2xhc3NlZCArIFwiIHVwZGF0ZVwiKTtcblx0XHRcdFxuXHRcdFx0Ly8gRU5URVJcdFxuXHRcdFx0YnViYmxlcy5lbnRlcigpXG5cdFx0XHRcdC5hcHBlbmQoXCJjaXJjbGVcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGNsYXNzZWQgKyBcIiBlbnRlclwiKVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgZC54ICsgXCIsXCIgKyBkLnkgKyBcIilcIjsgfSlcblx0XHRcdFx0XHQuYXR0cihcInJcIiwgZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9KVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gX2J1YmJsZS5ub0ZpbGwgPyBcInRyYW5zcGFyZW50XCIgOiBjb2xvclNjYWxlKGNvbG9yKGQuZGF0YS5kYXRhKSk7IH0pXG5cdFx0XHRcdFx0LnN0eWxlKFwic3Ryb2tlXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGNvbG9yU2NhbGUoY29sb3IoZC5kYXRhLmRhdGEpKTsgfSlcblx0XHRcdFx0XHQuc3R5bGUoXCJzdHJva2Utd2lkdGhcIiwgc3Ryb2tlLndpZHRoKVxuXHRcdFx0XHRcdC5zdHlsZShcInN0cm9rZS1kYXNoYXJyYXlcIiwgc3Ryb2tlLmRhc2hBcnJheSlcblx0XHRcdFx0XHQub24oXCJtb3VzZW92ZXJcIiwgbW91c2VPdmVyQ2FsbGJhY2spXG5cdFx0XHRcdFx0Lm9uKFwibW91c2VsZWF2ZVwiLCBtb3VzZUxlYXZlQ2FsbGJhY2spXG5cdFx0XHRcdFx0Lm9uKFwidG91Y2hzdGFydFwiLCB0b3VjaFN0YXJ0Q2FsbGJhY2spXG5cdFx0XHRcdFx0Lm9uKFwidG91Y2hlbmRcIiwgdG91Y2hFbmRDYWxsYmFjaylcblx0XHRcdFx0XHQuY2FsbChlbnRlckNhbGxiYWNrKVxuXHRcdFx0XHRcdC5tZXJnZShidWJibGVzKVx0Ly8gRU5URVIgKyBVUERBVEVcblx0XHRcdFx0XHRcdC50cmFuc2l0aW9uKCkuY2FsbCh0cmFuc2l0aW9uKVxuXHRcdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIGQueCArIFwiLFwiICsgZC55ICsgXCIpXCI7IH0pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwiclwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnI7IH0pXG5cdFx0XHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gX2J1YmJsZS5ub0ZpbGwgPyBcInRyYW5zcGFyZW50XCIgOiBjb2xvclNjYWxlKGNvbG9yKGQuZGF0YS5kYXRhKSk7IH0pXG5cdFx0XHRcdFx0XHRcdC5zdHlsZShcInN0cm9rZVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBjb2xvclNjYWxlKGNvbG9yKGQuZGF0YS5kYXRhKSk7IH0pXG5cdFx0XHRcdFx0XHRcdC5zdHlsZShcInN0cm9rZS13aWR0aFwiLCBzdHJva2Uud2lkdGgpXG5cdFx0XHRcdFx0XHRcdC5zdHlsZShcInN0cm9rZS1kYXNoYXJyYXlcIiwgc3Ryb2tlLmRhc2hBcnJheSlcblx0XHRcdFx0XHRcdFx0Lm9uKFwiZW5kXCIsIGZ1bmN0aW9uKCkgeyBkMy5zZWxlY3QodGhpcykuY2FsbChjYWxsYmFjayk7IH0pO1xuXHRcdFx0XHRcdFx0XHRcblx0XHRcdC8vIEVYSVRcblx0XHRcdGJ1YmJsZXMuZXhpdCgpXG5cdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgY2xhc3NlZCArIFwiIGV4aXRcIilcblx0XHRcdFx0LnRyYW5zaXRpb24oKS5jYWxsKGV4aXRUcmFuc2l0aW9uKVxuXHRcdFx0XHRcdC5hdHRyKFwiclwiLCAwKVxuXHRcdFx0XHRcdC5vbihcImVuZFwiLCBmdW5jdGlvbigpIHsgZDMuc2VsZWN0KHRoaXMpLmNhbGwoZXhpdENhbGxiYWNrKTsgfSlcblx0XHRcdFx0XHQucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdC8vIFJldHVybnMgYSBmbGF0dGVuZWQgaGllcmFyY2h5IGNvbnRhaW5pbmcgYWxsIGxlYWYgbm9kZXMgdW5kZXIgdGhlIHJvb3QuXG5cdFx0XHRmdW5jdGlvbiBjbGFzc2VzKHJvb3QpIHtcblx0XHRcdFx0dmFyIGNsYXNzZXMgPSBbXTtcblxuXHRcdFx0XHRmdW5jdGlvbiByZWN1cnNlKG5hbWUsIG5vZGUpIHtcblx0XHRcdFx0XHRpZihub2RlLmNoaWxkcmVuKSB7XG5cdFx0XHRcdFx0XHRub2RlLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcblx0XHRcdFx0XHRcdFx0cmVjdXJzZShub2RlLm5hbWUsIGNoaWxkKTsgXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9IGVsc2UgY2xhc3Nlcy5wdXNoKHsgcGFja2FnZU5hbWU6IG5hbWUsIGNsYXNzTmFtZTogeChub2RlKSwgdmFsdWU6IHkobm9kZSksIGRhdGE6IG5vZGUgfSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdHJlY3Vyc2UobnVsbCwgcm9vdCk7XHRcdFx0XHRcblx0XHRcdFx0cmV0dXJuIHsgY2hpbGRyZW46IGNsYXNzZXMgfTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHRlbXBsYXRlLmxheWVyID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChsYXllciA9IF8sIHRlbXBsYXRlKSA6IGxheWVyIHx8IHt9O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuY2xhc3NlZCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY2xhc3NlZCA9IF8sIHRlbXBsYXRlKSA6IGNsYXNzZWQ7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS53aWR0aCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAod2lkdGggPSBfLCB0ZW1wbGF0ZSkgOiB3aWR0aDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmhlaWdodCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoaGVpZ2h0ID0gXywgdGVtcGxhdGUpIDogaGVpZ2h0O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUubWFyZ2luID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChtYXJnaW4gPSBfLCB0ZW1wbGF0ZSkgOiBtYXJnaW47XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5jb250ZW50V2lkdGggPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gd2lkdGggLSBtYXJnaW4ucmlnaHQgLSBtYXJnaW4ubGVmdDtcblx0fTtcblx0XHRcblx0dGVtcGxhdGUuY29udGVudEhlaWdodCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBoZWlnaHQgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcblx0fTtcblx0XG5cdHRlbXBsYXRlLnggPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeCA9IF8sIHRlbXBsYXRlKSA6IHg7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS55ID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHkgPSBfLCB0ZW1wbGF0ZSkgOiB5O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuY29sb3IgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY29sb3IgPSBfLCB0ZW1wbGF0ZSkgOiBjb2xvcjtcblx0fTtcblx0XHRcdFxuXHR0ZW1wbGF0ZS5jb2xvclNjYWxlID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjb2xvclNjYWxlID0gXywgdGVtcGxhdGUpIDogY29sb3JTY2FsZTtcblx0fTtcblx0XG5cdHRlbXBsYXRlLnlMYWJlbCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeUxhYmVsID0gXywgdGVtcGxhdGUpIDogeUxhYmVsOyBcblx0fTtcblxuXHR0ZW1wbGF0ZS5zb3J0ID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChzb3J0ID0gXywgdGVtcGxhdGUpIDogc29ydDtcblx0fTtcblx0XHRcblx0dGVtcGxhdGUuc3Ryb2tlID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChzdHJva2UgPSBfLCB0ZW1wbGF0ZSkgOiBzdHJva2U7XG5cdH07XG5cdFx0XG5cdHRlbXBsYXRlLnRyYW5zaXRpb24gPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRyYW5zaXRpb24gPSBfLCB0ZW1wbGF0ZSkgOiB0cmFuc2l0aW9uO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuZW50ZXJUcmFuc2l0aW9uID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChlbnRlclRyYW5zaXRpb24gPSBfLCB0ZW1wbGF0ZSkgOiBlbnRlclRyYW5zaXRpb247XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5leGl0VHJhbnNpdGlvbiA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZXhpdFRyYW5zaXRpb24gPSBfLCB0ZW1wbGF0ZSkgOiBleGl0VHJhbnNpdGlvbjtcblx0fTtcblx0XHRcdFxuXHR0ZW1wbGF0ZS5jYWxsYmFjayA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IGNhbGxiYWNrO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuZW50ZXJDYWxsYmFjayA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChlbnRlckNhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogZW50ZXJDYWxsYmFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLmV4aXRDYWxsYmFjayA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChleGl0Q2FsbGJhY2sgPSBfLCB0ZW1wbGF0ZSkgOiBleGl0Q2FsbGJhY2s7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5tb3VzZU92ZXJDYWxsYmFjayA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChtb3VzZU92ZXJDYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IG1vdXNlT3ZlckNhbGxiYWNrO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUubW91c2VMZWF2ZUNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKG1vdXNlTGVhdmVDYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IG1vdXNlTGVhdmVDYWxsYmFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLnRvdWNoU3RhcnRDYWxsYmFjayA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0b3VjaFN0YXJ0Q2FsbGJhY2sgPSBfLCB0ZW1wbGF0ZSkgOiB0b3VjaFN0YXJ0Q2FsbGJhY2s7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS50b3VjaEVuZENhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRvdWNoRW5kQ2FsbGJhY2sgPSBfLCB0ZW1wbGF0ZSkgOiB0b3VjaEVuZENhbGxiYWNrO1xuXHR9O1xuXHRcdFxuXHR0ZW1wbGF0ZS5wYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKF9wYWNrID0gXywgdGVtcGxhdGUpIDogX3BhY2s7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5idWJibGUgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoX2J1YmJsZSA9IF8sIHRlbXBsYXRlKSA6IF9idWJibGU7XG5cdH07XG5cdFxuXHRyZXR1cm4gdGVtcGxhdGU7XG59IiwiaW1wb3J0ICogYXMgZDMgZnJvbSBcImQzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRvdCgpIHtcblxuXHR2YXJcdGxheWVyLFxuXHRcdGNsYXNzZWQsXG5cdFx0b3JpZW50LFxuXHRcdGtleSwgeCwgeSwgeTEsIGNvbG9yLCAgXG5cdFx0eFNjYWxlLCB5U2NhbGUsIHkxU2NhbGUsIGNvbG9yU2NhbGUsXG5cdFx0dHJhbnNpdGlvbiwgZW50ZXJUcmFuc2l0aW9uLCBleGl0VHJhbnNpdGlvbixcblx0XHRjYWxsYmFjaywgZW50ZXJDYWxsYmFjaywgZXhpdENhbGxiYWNrLFxuXHRcdG1vdXNlT3ZlckNhbGxiYWNrLCBtb3VzZUxlYXZlQ2FsbGJhY2ssXG5cdFx0dG91Y2hTdGFydENhbGxiYWNrLCB0b3VjaEVuZENhbGxiYWNrO1xuXHRcdFxuXHRmdW5jdGlvbiB0ZW1wbGF0ZShzZWxlY3Rpb24pIHtcblx0XHRcblx0XHQvLyBERUZBVUxUU1xuXHRcdGNsYXNzZWQgPSBjbGFzc2VkIHx8IFwiZG90XCI7XG5cdFx0XG5cdFx0dHJhbnNpdGlvbiA9IHRyYW5zaXRpb24gfHwgZnVuY3Rpb24odCkgeyByZXR1cm4gdC5kdXJhdGlvbigwKTsgfTtcblx0XHRlbnRlclRyYW5zaXRpb24gPSBlbnRlclRyYW5zaXRpb24gfHwgZnVuY3Rpb24odCkgeyByZXR1cm4gdC5kdXJhdGlvbigwKTsgfTtcblx0XHRleGl0VHJhbnNpdGlvbiA9IGV4aXRUcmFuc2l0aW9uIHx8IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHQuZHVyYXRpb24oMCk7IH07XG5cdFx0XG5cdFx0Y2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHRlbnRlckNhbGxiYWNrID0gZW50ZXJDYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHRleGl0Q2FsbGJhY2sgPSBleGl0Q2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0XG5cdFx0bW91c2VPdmVyQ2FsbGJhY2sgPSBtb3VzZU92ZXJDYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHRtb3VzZUxlYXZlQ2FsbGJhY2sgPSBtb3VzZUxlYXZlQ2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0XG5cdFx0dG91Y2hTdGFydENhbGxiYWNrID0gdG91Y2hTdGFydENhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdHRvdWNoRW5kQ2FsbGJhY2sgPSB0b3VjaEVuZENhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdFx0XHRcdFx0XG5cdFx0Ly8gQWRqdXN0IGJhbmR3aWR0aCBpZiBuZWNlc3Nhcnlcblx0XHRmdW5jdGlvbiB4U2NhbGVBZGp1c3RlZChkKSB7XG5cdFx0XHRyZXR1cm4geFNjYWxlKHgoZCkpICsgKHhTY2FsZS5iYW5kd2lkdGggPyB4U2NhbGUuYmFuZHdpZHRoKCkvMiA6IDApOyBcblx0XHR9XG5cdFx0XG5cdFx0ZnVuY3Rpb24geVNjYWxlQWRqdXN0ZWQoZCkge1xuXHRcdFx0cmV0dXJuIHlTY2FsZSh5KGQpKSArICh5U2NhbGUuYmFuZHdpZHRoID8geVNjYWxlLmJhbmR3aWR0aCgpLzIgOiAwKTsgXG5cdFx0fVxuXHRcdFx0XHRcblx0XHRzZWxlY3Rpb24uZWFjaChmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHQvLyBVUERBVEVcdFx0XG5cdFx0XHR2YXIgZG90cyA9IGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoXCIuXCIgKyBjbGFzc2VkLnJlcGxhY2UoXCIgXCIsIFwiLlwiKSkuZGF0YShkYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiBrZXkoZCk7IH0pXG5cdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgY2xhc3NlZCArIFwiIHVwZGF0ZVwiKTtcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHQvLyBFTlRFUlx0XG5cdFx0XHR2YXIgZG90c0VudGVyID0gZG90cy5lbnRlcigpXG5cdFx0XHRcdC5hcHBlbmQoXCJjaXJjbGVcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGNsYXNzZWQgKyBcIiBlbnRlclwiKTtcblxuXHRcdFx0ZG90c0VudGVyXG5cdFx0XHRcdC5hdHRyKFwiY3hcIiwgeFNjYWxlQWRqdXN0ZWQpXG5cdFx0XHRcdC5hdHRyKFwiY3lcIiwgZnVuY3Rpb24oKSB7IHJldHVybiB5U2NhbGUoMCk7IH0pXG5cdFx0XHRcdC5hdHRyKFwiclwiLCBmdW5jdGlvbihkKSB7IHJldHVybiB5MVNjYWxlKHkxKGQpKTsgfSlcblx0XHRcdFx0Lm9uKFwibW91c2VvdmVyXCIsIG1vdXNlT3ZlckNhbGxiYWNrKVxuXHRcdFx0XHQub24oXCJtb3VzZWxlYXZlXCIsIG1vdXNlTGVhdmVDYWxsYmFjaylcblx0XHRcdFx0Lm9uKFwidG91Y2hzdGFydFwiLCB0b3VjaFN0YXJ0Q2FsbGJhY2spXG5cdFx0XHRcdC5vbihcInRvdWNoZW5kXCIsIHRvdWNoRW5kQ2FsbGJhY2spXG5cdFx0XHRcdC50cmFuc2l0aW9uKCkuY2FsbChlbnRlclRyYW5zaXRpb24pXG5cdFx0XHRcdFx0Lm9uKFwiZW5kXCIsIGZ1bmN0aW9uKCkgeyBkMy5zZWxlY3QodGhpcykuY2FsbChlbnRlckNhbGxiYWNrKTsgfSk7XG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRkb3RzRW50ZXIubWVyZ2UoZG90cylcdC8vIEVOVEVSICsgVVBEQVRFXG5cdFx0XHRcdC50cmFuc2l0aW9uKCkuY2FsbCh0cmFuc2l0aW9uKVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gY29sb3JTY2FsZShjb2xvcihkKSk7IH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJjeFwiLCB4U2NhbGVBZGp1c3RlZClcblx0XHRcdFx0XHQuYXR0cihcImN5XCIsIHlTY2FsZUFkanVzdGVkKVxuXHRcdFx0XHRcdC5hdHRyKFwiclwiLCBmdW5jdGlvbihkKSB7IHJldHVybiB5MVNjYWxlKHkxKGQpKTsgfSlcblx0XHRcdFx0XHQub24oXCJlbmRcIiwgZnVuY3Rpb24oKSB7IHJldHVybiBkMy5zZWxlY3QodGhpcykuY2FsbChjYWxsYmFjayk7IH0pO1xuXHRcdFxuXHRcdFx0Ly8gRVhJVFxuXHRcdFx0ZG90cy5leGl0KClcblx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBjbGFzc2VkICsgXCIgZXhpdFwiKVxuXHRcdFx0XHQudHJhbnNpdGlvbigpLmNhbGwoZXhpdFRyYW5zaXRpb24pXG5cdFx0XHRcdFx0LmF0dHIoXCJyXCIsIDApXG5cdFx0XHRcdFx0Lm9uKFwiZW5kXCIsIGZ1bmN0aW9uKCkgeyBkMy5zZWxlY3QodGhpcykuY2FsbChleGl0Q2FsbGJhY2spOyB9KVxuXHRcdFx0XHRcdC5yZW1vdmUoKTtcblx0XHR9KTtcblx0fVxuXG5cdHRlbXBsYXRlLmxheWVyID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChsYXllciA9IF8sIHRlbXBsYXRlKSA6IGxheWVyIHx8IHt9O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuY2xhc3NlZCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY2xhc3NlZCA9IF8sIHRlbXBsYXRlKSA6IGNsYXNzZWQ7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5vcmllbnQgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKG9yaWVudCA9IF8sIHRlbXBsYXRlKSA6IG9yaWVudDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmtleSA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoa2V5ID0gXywgdGVtcGxhdGUpIDoga2V5O1xuXHR9O1xuXHRcdFxuXHR0ZW1wbGF0ZS54ID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh4ID0gXywgdGVtcGxhdGUpIDogeDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLnkgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHkgPSBfLCB0ZW1wbGF0ZSkgOiB5OyBcblx0fTtcblx0XG5cdHRlbXBsYXRlLnkxID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh5MSA9IF8sIHRlbXBsYXRlKSA6IHkxO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuY29sb3IgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNvbG9yID0gXywgdGVtcGxhdGUpIDogY29sb3I7XG5cdH07XG5cdFx0XHRcdFxuXHR0ZW1wbGF0ZS54U2NhbGUgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHhTY2FsZSA9IF8sIHRlbXBsYXRlKSA6IHhTY2FsZTtcblx0fTtcblx0XG5cdHRlbXBsYXRlLnlTY2FsZSA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeVNjYWxlID0gXywgdGVtcGxhdGUpIDogeVNjYWxlOyBcblx0fTtcblx0XG5cdHRlbXBsYXRlLnkxU2NhbGUgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHkxU2NhbGUgPSBfLCB0ZW1wbGF0ZSkgOiB5MVNjYWxlO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuY29sb3JTY2FsZSA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY29sb3JTY2FsZSA9IF8sIHRlbXBsYXRlKSA6IGNvbG9yU2NhbGU7XG5cdH07XG5cdFx0XG5cdHRlbXBsYXRlLnRyYW5zaXRpb24gPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodHJhbnNpdGlvbiA9IF8sIHRlbXBsYXRlKSA6IHRyYW5zaXRpb247XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5lbnRlclRyYW5zaXRpb24gPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGVudGVyVHJhbnNpdGlvbiA9IF8sIHRlbXBsYXRlKSA6IGVudGVyVHJhbnNpdGlvbjtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmV4aXRUcmFuc2l0aW9uID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChleGl0VHJhbnNpdGlvbiA9IF8sIHRlbXBsYXRlKSA6IGV4aXRUcmFuc2l0aW9uO1xuXHR9O1xuXHRcdFx0XG5cdHRlbXBsYXRlLmNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogY2FsbGJhY2s7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5lbnRlckNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGVudGVyQ2FsbGJhY2sgPSBfLCB0ZW1wbGF0ZSkgOiBlbnRlckNhbGxiYWNrO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuZXhpdENhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGV4aXRDYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IGV4aXRDYWxsYmFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLm1vdXNlT3ZlckNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKG1vdXNlT3ZlckNhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogbW91c2VPdmVyQ2FsbGJhY2s7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5tb3VzZUxlYXZlQ2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobW91c2VMZWF2ZUNhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogbW91c2VMZWF2ZUNhbGxiYWNrO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUudG91Y2hTdGFydENhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRvdWNoU3RhcnRDYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IHRvdWNoU3RhcnRDYWxsYmFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLnRvdWNoRW5kQ2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodG91Y2hFbmRDYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IHRvdWNoRW5kQ2FsbGJhY2s7XG5cdH07XG5cdFxuXHRyZXR1cm4gdGVtcGxhdGU7XG59IiwiaW1wb3J0ICogYXMgZDMgZnJvbSBcImQzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGltYWdlKCkge1xuXG5cdHZhciBsYXllcixcblx0XHRjbGFzc2VkLFxuXHRcdHVybCxcblx0XHR3aWR0aCwgaGVpZ2h0LFxuXHRcdHByZXNlcnZlQXNwZWN0UmF0aW8sXG5cdFx0XG5cdFx0dHJhbnNpdGlvbixcblx0XHRjYWxsYmFjaztcblx0XHRcblx0ZnVuY3Rpb24gdGVtcGxhdGUoc2VsZWN0aW9uKSB7XG5cdFxuXHRcdC8vIERFRkFVTFRTXG5cdFx0Y2xhc3NlZCA9IGNsYXNzZWQgfHwgXCJpbWFnZVwiO1x0XHRcdFxuXHRcdHRyYW5zaXRpb24gPSB0cmFuc2l0aW9uIHx8IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHQuZHVyYXRpb24oMCk7IH07XG5cdFx0Y2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHRcblx0XHRzZWxlY3Rpb24uZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFxuXHRcdFx0dmFyIGltYWdlRW50ZXIgPSBkMy5zZWxlY3QodGhpcylcblx0XHRcdFx0LnNlbGVjdEFsbChcIi5cIiArIGNsYXNzZWQucmVwbGFjZShcIiBcIiwgXCIuXCIpKS5kYXRhKFsxXSkuZW50ZXIoKTtcblx0XHRcdFx0XHRcdFxuXHRcdFx0aW1hZ2VFbnRlci5hcHBlbmQoXCJpbWFnZVwiKVxuXHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGNsYXNzZWQgKyBcIiBlbnRlclwiKVxuXHRcdFx0XHQuYXR0cihcInhsaW5rOmhyZWZcIiwgdXJsKVxuXHRcdFx0XHQuYXR0cihcInhcIiwgd2lkdGgvMilcblx0XHRcdFx0LmF0dHIoXCJ5XCIsIGhlaWdodC8yKVxuXHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIDApXG5cdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIDApXG5cdFx0XHRcdC5hdHRyKFwicHJlc2VydmVBc3BlY3RSYXRpb1wiLCBwcmVzZXJ2ZUFzcGVjdFJhdGlvLmFsaWduICsgXCIgXCIgKyBwcmVzZXJ2ZUFzcGVjdFJhdGlvLm1lZXRPclNsaWNlKVxuXHRcdFx0XHQuc3R5bGUoXCJvcGFjaXR5XCIsIDApXG5cdFx0XHRcdC50cmFuc2l0aW9uKCkuY2FsbCh0cmFuc2l0aW9uKVxuXHRcdFx0XHRcdC5zdHlsZShcIm9wYWNpdHlcIiwgMS4wKVxuXHRcdFx0XHRcdC5hdHRyKFwieFwiLCAwKVxuXHRcdFx0XHRcdC5hdHRyKFwieVwiLCAwKVxuXHRcdFx0XHRcdC5hdHRyKFwid2lkdGhcIiwgd2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgd2lkdGgpXG5cdFx0XHRcdFx0Lm9uKFwiZW5kXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0ZDMuc2VsZWN0KHRoaXMpLmNhbGwoY2FsbGJhY2spO1xuXHRcdFx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0dGVtcGxhdGUubGF5ZXIgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGxheWVyID0gXywgdGVtcGxhdGUpIDogbGF5ZXIgfHwge307XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5jbGFzc2VkID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjbGFzc2VkID0gXywgdGVtcGxhdGUpIDogY2xhc3NlZDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLnVybCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodXJsID0gXywgdGVtcGxhdGUpIDogdXJsO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUud2lkdGggPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHdpZHRoID0gXywgdGVtcGxhdGUpIDogd2lkdGg7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5oZWlnaHQgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGhlaWdodCA9IF8sIHRlbXBsYXRlKSA6IGhlaWdodDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLnByZXNlcnZlQXNwZWN0UmF0aW8gPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocHJlc2VydmVBc3BlY3RSYXRpbyA9IF8sIHRlbXBsYXRlKSA6IHByZXNlcnZlQXNwZWN0UmF0aW87XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS50cmFuc2l0aW9uID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRyYW5zaXRpb24gPSBfLCB0ZW1wbGF0ZSkgOiB0cmFuc2l0aW9uO1xuXHR9O1xuXHRcdFx0XG5cdHRlbXBsYXRlLmNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogY2FsbGJhY2s7XG5cdH07XG5cdFx0XHRcdFx0XHRcblx0cmV0dXJuIHRlbXBsYXRlO1xufVxuIiwiaW1wb3J0ICogYXMgZDMgZnJvbSBcImQzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxhYmVsKCkge1xuXG5cdHZhclx0bGF5ZXIsXG5cdFx0Y2xhc3NlZCxcblx0XHRvcmllbnQsXG5cdFx0a2V5LCB4LCB5LCB5MSwgY29sb3IsIHRleHQsXG5cdFx0eFNjYWxlLCB5U2NhbGUsIHkxU2NhbGUsIGNvbG9yU2NhbGUsXG5cdFx0dHJhbnNpdGlvbiwgZW50ZXJUcmFuc2l0aW9uLCBleGl0VHJhbnNpdGlvbixcblx0XHRjYWxsYmFjaywgZW50ZXJDYWxsYmFjaywgZXhpdENhbGxiYWNrLFxuXHRcdFxuXHRcdHRleHRGb3JtYXQsIGFuY2hvciwgcm90YXRlLCBkeCwgZHk7XG5cdFx0XHRcdFx0XHRcblx0ZnVuY3Rpb24gdGVtcGxhdGUoc2VsZWN0aW9uKSB7XG5cdFx0XG5cdFx0Ly8gREVGQVVMVFNcblx0XHRjbGFzc2VkID0gY2xhc3NlZCB8fCBcImxhYmVsXCI7XG5cdFx0XHRcblx0XHR0cmFuc2l0aW9uID0gdHJhbnNpdGlvbiB8fCBmdW5jdGlvbih0KSB7IHJldHVybiB0LmR1cmF0aW9uKDApOyB9O1xuXHRcdGVudGVyVHJhbnNpdGlvbiA9IGVudGVyVHJhbnNpdGlvbiB8fCBmdW5jdGlvbih0KSB7IHJldHVybiB0LmR1cmF0aW9uKDApOyB9O1xuXHRcdGV4aXRUcmFuc2l0aW9uID0gZXhpdFRyYW5zaXRpb24gfHwgZnVuY3Rpb24odCkgeyByZXR1cm4gdC5kdXJhdGlvbigwKTsgfTtcblx0XHRcblx0XHRjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdGVudGVyQ2FsbGJhY2sgPSBlbnRlckNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdGV4aXRDYWxsYmFjayA9IGV4aXRDYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHRcblx0XHR0ZXh0Rm9ybWF0ID0gdGV4dEZvcm1hdCB8fCBmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9O1xuXHRcdGFuY2hvciA9IGFuY2hvciB8fCBcIm1pZGRsZVwiO1xuXHRcdHJvdGF0ZSA9IHJvdGF0ZSB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cdFx0XG5cdFx0ZnVuY3Rpb24geFNjYWxlQmFuZHdpZHRoKGQpIHtcblx0XHRcdHJldHVybiB4U2NhbGUoeChkKSkgKyAoeFNjYWxlLmJhbmR3aWR0aCA/IHhTY2FsZS5iYW5kd2lkdGgoKS8yIDogMCk7IFxuXHRcdH1cblx0XHRcblx0XHRzZWxlY3Rpb24uZWFjaChmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0Ly8gVVBEQVRFXHRcdFxuXHRcdFx0dmFyIGxhYmVscyA9IGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoXCIuXCIgKyBjbGFzc2VkLnJlcGxhY2UoXCIgXCIsIFwiLlwiKSkuZGF0YShkYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiBrZXkoZCk7IH0pXG5cdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgY2xhc3NlZCArIFwiIHVwZGF0ZVwiKTtcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHQvLyBFTlRFUlx0XG5cdFx0XHR2YXIgbGFiZWxzRW50ZXIgPSBsYWJlbHMuZW50ZXIoKVxuXHRcdFx0XHQuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgY2xhc3NlZCArIFwiIGVudGVyXCIpO1xuXG5cdFx0XHRsYWJlbHNFbnRlclxuXHRcdFx0XHQuYXR0cihcInhcIiwgeFNjYWxlQmFuZHdpZHRoKVxuXHRcdFx0XHQuYXR0cihcInlcIiwgeVNjYWxlKDApKVxuXHRcdFx0XHQuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBhbmNob3IpXG5cdFx0XHRcdC5zdHlsZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwiY2VudHJhbFwiKVxuXHRcdFx0XHQudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiB0ZXh0Rm9ybWF0KHRleHQoZCkpOyB9KVxuXHRcdFx0XHQudHJhbnNpdGlvbigpLmNhbGwoZW50ZXJUcmFuc2l0aW9uKVxuXHRcdFx0XHRcdC8vLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZSh5KGQpKTsgfSlcblx0XHRcdFx0XHQub24oXCJlbmRcIiwgZnVuY3Rpb24oKSB7IGQzLnNlbGVjdCh0aGlzKS5jYWxsKGVudGVyQ2FsbGJhY2spOyB9KTtcblx0XHRcdFx0XHRcdFxuXHRcdFx0bGFiZWxzRW50ZXIubWVyZ2UobGFiZWxzKVx0Ly8gRU5URVIgKyBVUERBVEVcblx0XHRcdFx0LmF0dHIoXCJkeFwiLCBkeClcblx0XHRcdFx0LmF0dHIoXCJkeVwiLCBkeSlcblx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCwgaSkge1xuXHRcdFx0XHRcdHJldHVybiBcInJvdGF0ZShcIiArICh0eXBlb2Ygcm90YXRlID09PSBcImZ1bmN0aW9uXCIgPyByb3RhdGUoZCwgaSkgOiByb3RhdGUpIFxuXHRcdFx0XHRcdFx0KyBcIiBcIiArIHhTY2FsZUJhbmR3aWR0aChkKSArIFwiIFwiICsgeVNjYWxlKHkoZCkpICsgXCIpXCI7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC50cmFuc2l0aW9uKCkuY2FsbCh0cmFuc2l0aW9uKVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gY29sb3JTY2FsZShjb2xvcihkKSk7IH0pXG5cdFx0XHRcdFx0LnN0eWxlKFwiZm9udC1zaXplXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHkxICYmIHkxU2NhbGUgPyB5MVNjYWxlKHkxKGQpKSArIFwiZW1cIiA6IHVuZGVmaW5lZDsgfSlcblx0XHRcdFx0XHQuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBhbmNob3IpXG5cdFx0XHRcdFx0LmF0dHIoXCJ4XCIsIHhTY2FsZUJhbmR3aWR0aClcblx0XHRcdFx0XHQuYXR0cihcInlcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKHkoZCkpOyB9KVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHRleHRGb3JtYXQodGV4dChkKSk7IH0pXG5cdFx0XHRcdFx0Lm9uKFwiZW5kXCIsIGZ1bmN0aW9uKCkgeyAgZDMuc2VsZWN0KHRoaXMpLmNhbGwoY2FsbGJhY2spOyB9KTtcblx0XHRcblx0XHRcdC8vIEVYSVRcblx0XHRcdGxhYmVscy5leGl0KClcblx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBjbGFzc2VkICsgXCIgZXhpdFwiKVxuXHRcdFx0XHQudHJhbnNpdGlvbigpLmNhbGwoZXhpdFRyYW5zaXRpb24pXG5cdFx0XHRcdFx0Ly8uYXR0cihcInJcIiwgMClcblx0XHRcdFx0XHQub24oXCJlbmRcIiwgZnVuY3Rpb24oKSB7IGQzLnNlbGVjdCh0aGlzKS5jYWxsKGV4aXRDYWxsYmFjayk7IH0pXG5cdFx0XHRcdFx0LnJlbW92ZSgpO1xuXHRcdH0pO1xuXHR9XG5cblx0dGVtcGxhdGUubGF5ZXIgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGxheWVyID0gXywgdGVtcGxhdGUpIDogbGF5ZXIgfHwge307XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5jbGFzc2VkID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjbGFzc2VkID0gXywgdGVtcGxhdGUpIDogY2xhc3NlZDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLm9yaWVudCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAob3JpZW50ID0gXywgdGVtcGxhdGUpIDogb3JpZW50O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUua2V5ID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChrZXkgPSBfLCB0ZW1wbGF0ZSkgOiBrZXk7XG5cdH07XG5cdFx0XG5cdHRlbXBsYXRlLnggPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHggPSBfLCB0ZW1wbGF0ZSkgOiB4O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUueSA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeSA9IF8sIHRlbXBsYXRlKSA6IHk7IFxuXHR9O1xuXHRcblx0dGVtcGxhdGUueTEgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHkxID0gXywgdGVtcGxhdGUpIDogeTE7IFxuXHR9O1xuXHRcblx0dGVtcGxhdGUuY29sb3IgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNvbG9yID0gXywgdGVtcGxhdGUpIDogY29sb3I7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS50ZXh0ID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0ZXh0ID0gXywgdGVtcGxhdGUpIDogdGV4dDtcblx0fTtcblx0XHRcdFxuXHR0ZW1wbGF0ZS54U2NhbGUgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHhTY2FsZSA9IF8sIHRlbXBsYXRlKSA6IHhTY2FsZTtcblx0fTtcblx0XG5cdHRlbXBsYXRlLnlTY2FsZSA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeVNjYWxlID0gXywgdGVtcGxhdGUpIDogeVNjYWxlOyBcblx0fTtcblx0XG5cdHRlbXBsYXRlLnkxU2NhbGUgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHkxU2NhbGUgPSBfLCB0ZW1wbGF0ZSkgOiB5MVNjYWxlOyBcblx0fTtcblx0XG5cdHRlbXBsYXRlLmNvbG9yU2NhbGUgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNvbG9yU2NhbGUgPSBfLCB0ZW1wbGF0ZSkgOiBjb2xvclNjYWxlO1xuXHR9O1xuXHRcdFxuXHR0ZW1wbGF0ZS50cmFuc2l0aW9uID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRyYW5zaXRpb24gPSBfLCB0ZW1wbGF0ZSkgOiB0cmFuc2l0aW9uO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuZW50ZXJUcmFuc2l0aW9uID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChlbnRlclRyYW5zaXRpb24gPSBfLCB0ZW1wbGF0ZSkgOiBlbnRlclRyYW5zaXRpb247XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5leGl0VHJhbnNpdGlvbiA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZXhpdFRyYW5zaXRpb24gPSBfLCB0ZW1wbGF0ZSkgOiBleGl0VHJhbnNpdGlvbjtcblx0fTtcblx0XHRcdFxuXHR0ZW1wbGF0ZS5jYWxsYmFjayA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IGNhbGxiYWNrO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuZW50ZXJDYWxsYmFjayA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChlbnRlckNhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogZW50ZXJDYWxsYmFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLmV4aXRDYWxsYmFjayA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChleGl0Q2FsbGJhY2sgPSBfLCB0ZW1wbGF0ZSkgOiBleGl0Q2FsbGJhY2s7XG5cdH07XG5cdFx0XG5cdHRlbXBsYXRlLnRleHRGb3JtYXQgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRleHRGb3JtYXQgPSBfLCB0ZW1wbGF0ZSkgOiB0ZXh0Rm9ybWF0O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuYW5jaG9yID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChhbmNob3IgPSBfLCB0ZW1wbGF0ZSkgOiBhbmNob3I7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5yb3RhdGUgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHJvdGF0ZSA9IF8sIHRlbXBsYXRlKSA6IHJvdGF0ZTtcblx0fTtcblxuXHR0ZW1wbGF0ZS5keCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZHggPSBfLCB0ZW1wbGF0ZSkgOiBkeDtcblx0fTtcblxuXHR0ZW1wbGF0ZS5keSA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZHkgPSBfLCB0ZW1wbGF0ZSkgOiBkeTtcblx0fTtcblx0XHRcdFxuXHRyZXR1cm4gdGVtcGxhdGU7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gbWVkaWFEaW1lbnNpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0XCJ3aWR0aFwiOiArTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKSxcblx0XHRcImhlaWdodFwiOiArTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCwgd2luZG93LmlubmVySGVpZ2h0IHx8IDApXG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0lFKCkge1xuXHRyZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRVwiKSA+IC0xO1xufVx0XHRcblxuZXhwb3J0IGZ1bmN0aW9uIGlzRWRnZSgpIHtcblx0cmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkVkZ2VcIikgPiAtMSB8fCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJUcmlkZW50XCIpID4gLTE7XG59IiwiaW1wb3J0ICogYXMgZDMgZnJvbSBcImQzXCI7XG5pbXBvcnQgeyBpc0lFIH0gZnJvbSBcIi4vdXRpbFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdmcoKSB7XG5cblx0dmFyXHRjbGFzc2VkLFxuXHRcdHdpZHRoLCBoZWlnaHQsXG5cdFx0XHRcdFx0XHRcblx0XHR2aWV3Ym94LFxuXHRcdHByZXNlcnZlQXNwZWN0UmF0aW8sXG5cdFx0bWVldE9yU2xpY2UsXG5cdFx0XG5cdFx0dHJhbnNpdGlvbiwgZW50ZXJUcmFuc2l0aW9uLCBleGl0VHJhbnNpdGlvbixcblx0XHRjYWxsYmFjaywgZW50ZXJDYWxsYmFjaywgZXhpdENhbGxiYWNrO1xuXHRcdFx0XHRcblx0ZnVuY3Rpb24gdGVtcGxhdGUoc2VsZWN0aW9uKSB7XG5cdFxuXHRcdHNlbGVjdGlvbi5lYWNoKGZ1bmN0aW9uKGRhdGEsIGluZGV4KSB7XG5cdFx0XHRcblx0XHRcdC8vIERFRkFVTFRTXG5cdFx0XHRjbGFzc2VkID0gY2xhc3NlZCB8fCBcInN2Z1wiO1xuXHRcdFx0dmlld2JveCA9IHZpZXdib3ggfHwgeyBcInhcIjogMCwgXCJ5XCI6IDAsIFwid2lkdGhcIjogd2lkdGgsIFwiaGVpZ2h0XCI6IGhlaWdodCB9O1xuXHRcdFx0XG5cdFx0XHRjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdFx0ZW50ZXJDYWxsYmFjayA9IGVudGVyQ2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0XHRleGl0Q2FsbGJhY2sgPSBleGl0Q2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0XG5cdFx0XHR0cmFuc2l0aW9uID0gdHJhbnNpdGlvbiB8fCBmdW5jdGlvbih0KSB7IHJldHVybiB0LmR1cmF0aW9uKDApOyB9O1xuXHRcdFx0ZW50ZXJUcmFuc2l0aW9uID0gZW50ZXJUcmFuc2l0aW9uIHx8IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHQuZHVyYXRpb24oMCk7IH07XG5cdFx0XHRleGl0VHJhbnNpdGlvbiA9IGV4aXRUcmFuc2l0aW9uIHx8IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHQuZHVyYXRpb24oMCk7IH07XG5cdFx0XHRcblx0XHRcdC8vIEZpeCBmb3Igb2xkZXIgYnJvd3NlcnNcblx0XHRcdGlmKGRvY3VtZW50LndpZHRoIDwgd2lkdGggfHwgZG9jdW1lbnQuaGVpZ2h0IDwgaGVpZ2h0KSB7XG5cdFx0XHRcdHByZXNlcnZlQXNwZWN0UmF0aW8gPSBcInhNaW5ZTWluXCI7XG5cdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0dmFyIGlkID0gZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJpZFwiKTtcblx0XHRcdFxuXHRcdFx0Ly8gVVBEQVRFXG5cdFx0XHR2YXIgc3ZnID0gZDMuc2VsZWN0KHRoaXMpLnNlbGVjdEFsbChcIiNcIiArIGlkICsgXCItc3ZnLVwiICsgaW5kZXgpLmRhdGEoZGF0YSlcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGNsYXNzZWQgKyBcIiB1cGRhdGVcIik7XG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHQvLyBFTlRFUlx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0c3ZnLmVudGVyKClcblx0XHRcdFx0LmFwcGVuZChcInN2Z1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgaWQgKyBcIi1zdmctXCIgKyBpbmRleClcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGNsYXNzZWQgKyBcIiBlbnRlclwiKVxuXHRcdFx0XHRcdC5hdHRyKFwid2lkdGhcIiwgd2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KVxuXHRcdFx0XHRcdC5hdHRyKFwidmlld0JveFwiLCB2aWV3Ym94LnggKyBcIiBcIiArIHZpZXdib3gueSArIFwiIFwiICsgdmlld2JveC53aWR0aCArIFwiIFwiICsgdmlld2JveC5oZWlnaHQpXG5cdFx0XHRcdFx0LmF0dHIoXCJwcmVzZXJ2ZUFzcGVjdFJhdGlvXCIsIGlzSUUoKSA/IFwibm9uZVwiIDogcHJlc2VydmVBc3BlY3RSYXRpbyB8fCBcInhNaWRZTWlkXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJtZWV0T3JTbGljZVwiLCBtZWV0T3JTbGljZSB8fCBcIm1lZXRcIilcblx0XHRcdFx0XHQuYXR0cihcInZlcnNpb25cIiwgaXNJRSgpID8gXCIxLjFcIiA6IHVuZGVmaW5lZClcblx0XHRcdFx0XHQuYXR0cihcInhtbG5zXCIsIGlzSUUoKSA/IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiA6IHVuZGVmaW5lZClcblx0XHRcdFx0XHQuY2FsbChlbnRlckNhbGxiYWNrKVxuXHRcdFx0XHRcdC5tZXJnZShzdmcpIC8vIEVOVEVSICsgVVBEQVRFXG5cdFx0XHRcdFx0XHQuY2FsbChjYWxsYmFjayk7XG5cdFx0XHRcdFxuXHRcdFx0Ly8gRVhJVFxuXHRcdFx0c3ZnLmV4aXQoKVxuXHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGNsYXNzZWQgKyBcIiBleGl0XCIpXG5cdFx0XHRcdC5jYWxsKGV4aXRDYWxsYmFjaylcblx0XHRcdFx0LnJlbW92ZSgpO1xuXHRcdH0pO1xuXHR9XG5cdFx0XG5cdHRlbXBsYXRlLmNsYXNzZWQgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY2xhc3NlZCA9IF8sIHRlbXBsYXRlKSA6IGNsYXNzZWQ7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS53aWR0aCA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh3aWR0aCA9IF8sIHRlbXBsYXRlKSA6IHdpZHRoO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuaGVpZ2h0ID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGhlaWdodCA9IF8sIHRlbXBsYXRlKSA6IGhlaWdodDtcblx0fTtcblxuXHR0ZW1wbGF0ZS52aWV3Ym94ID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHZpZXdib3ggPSBfLCB0ZW1wbGF0ZSkgOiB2aWV3Ym94O1xuXHR9O1xuXHRcdFxuXHR0ZW1wbGF0ZS5wcmVzZXJ2ZUFzcGVjdFJhdGlvID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHByZXNlcnZlQXNwZWN0UmF0aW8gPSBfLCB0ZW1wbGF0ZSkgOiBwcmVzZXJ2ZUFzcGVjdFJhdGlvOyBcblx0fTtcblx0XG5cdHRlbXBsYXRlLm1lZXRPclNsaWNlID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKG1lZXRPclNsaWNlID0gXywgdGVtcGxhdGUpIDogbWVldE9yU2xpY2U7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS50cmFuc2l0aW9uID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0cmFuc2l0aW9uID0gXywgdGVtcGxhdGUpIDogdHJhbnNpdGlvbjtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmVudGVyVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZW50ZXJUcmFuc2l0aW9uID0gXywgdGVtcGxhdGUpIDogZW50ZXJUcmFuc2l0aW9uO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuZXhpdFRyYW5zaXRpb24gPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGV4aXRUcmFuc2l0aW9uID0gXywgdGVtcGxhdGUpIDogZXhpdFRyYW5zaXRpb247XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5jYWxsYmFjayA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IGNhbGxiYWNrO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuZW50ZXJDYWxsYmFjayA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChlbnRlckNhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogZW50ZXJDYWxsYmFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLmV4aXRDYWxsYmFjayA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChleGl0Q2FsbGJhY2sgPSBfLCB0ZW1wbGF0ZSkgOiBleGl0Q2FsbGJhY2s7XG5cdH07XG5cdFx0XG5cdHJldHVybiB0ZW1wbGF0ZTtcbn0iLCJpbXBvcnQgKiBhcyBkMyBmcm9tIFwiZDNcIjtcbmltcG9ydCB7IGRlZmF1bHQgYXMgdGVtcGxhdGVTVkcgfSBmcm9tIFwiLi9zdmdcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbGF5ZXJzKCkge1xuXG5cdHZhclx0Y2xhc3NlZCxcblx0XHRcblx0XHR3aWR0aCwgaGVpZ2h0LFxuXHRcdGluaGVyaXRTaXplLFxuXHRcdG1hcmdpbixcblx0XHRcdFx0XG5cdFx0a2V5LCB4LCB5LCB5MSwgY29sb3IsIHRleHQsXHRcblx0XHR4U2NhbGUsIHlTY2FsZSwgeTFTY2FsZSwgY29sb3JTY2FsZSxcblx0XHRcblx0XHR4TGFiZWwsIHlMYWJlbCwgeTFMYWJlbCxcblx0XHR4Rm9ybWF0LCB5Rm9ybWF0LCB5MUZvcm1hdCwgdGV4dEZvcm1hdCxcblx0XHRcblx0XHR0cmFuc2l0aW9uLCBlbnRlclRyYW5zaXRpb24sIGV4aXRUcmFuc2l0aW9uLFxuXHRcdFxuXHRcdGxheWVyMCwgbGF5ZXIxLCBsYXllcjIsIGxheWVyMywgbGF5ZXI0LCBsYXllcjUsXHRsYXllcjYsXHRsYXllcjcsXHRcblx0XHRjYWxsYmFjaywgZW50ZXJDYWxsYmFjaywgZXhpdENhbGxiYWNrO1xuXHRcdFxuXHRmdW5jdGlvbiB0ZW1wbGF0ZShzZWxlY3Rpb24pIHtcblxuXHRcdC8vIERFRkFVTFRTXHRcdFxuXHRcdGNsYXNzZWQgPSBjbGFzc2VkIHx8IFwibGF5ZXJzXCI7XG5cdFx0XG5cdFx0dHJhbnNpdGlvbiA9IHRyYW5zaXRpb24gfHwgZnVuY3Rpb24odCkgeyByZXR1cm4gdC5kdXJhdGlvbigwKTsgfTtcblx0XHRlbnRlclRyYW5zaXRpb24gPSBlbnRlclRyYW5zaXRpb24gfHwgZnVuY3Rpb24odCkgeyByZXR1cm4gdC5kdXJhdGlvbigwKTsgfTtcblx0XHRleGl0VHJhbnNpdGlvbiA9IGV4aXRUcmFuc2l0aW9uIHx8IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHQuZHVyYXRpb24oMCk7IH07XG5cdFx0XHRcdFxuXHRcdGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0ZW50ZXJDYWxsYmFjayA9IGVudGVyQ2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0ZXhpdENhbGxiYWNrID0gZXhpdENhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1x0XHRcblx0XHRcdFx0XG5cdFx0c2VsZWN0aW9uLmVhY2goZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XG5cdFx0XHQvLyBBZGFwdCB0byBwYXJlbnQncyBjbGllbnRXaWR0aFxuXHRcdFx0aWYoaW5oZXJpdFNpemUgPT09IFwiY2xpZW50V2lkdGhcIikge1xuXHRcdFx0XHR2YXIgcmF0aW8gPSB3aWR0aCAvIGhlaWdodDtcblx0XHRcdFxuXHRcdFx0XHR3aWR0aCA9IHRoaXMuY2xpZW50V2lkdGg7XG5cdFx0XHRcdGhlaWdodCA9IHdpZHRoIC8gcmF0aW87XG5cdFx0XHR9XG5cdFx0XHRcdFx0XHRcblx0XHRcdC8vIEluaXQgc2NhbGVzXG5cdFx0XHRpZih4U2NhbGUpIHhTY2FsZS5yYW5nZShbMCwgdGVtcGxhdGUuY29udGVudFdpZHRoKCldKTtcblx0XHRcdGlmKHlTY2FsZSkgeVNjYWxlLnJhbmdlKFt0ZW1wbGF0ZS5jb250ZW50SGVpZ2h0KCksIDBdKTtcblx0XHRcdC8vaWYoeTFTY2FsZSkgeTFTY2FsZS5yYW5nZShbdGVtcGxhdGUuY29udGVudEhlaWdodCgpLCAwXSk7XG5cdFx0XHRcblx0XHRcdFtbeFNjYWxlLCB4XSwgW3lTY2FsZSwgeV0sIFt5MVNjYWxlLCB5MV0sIFtjb2xvclNjYWxlLCBjb2xvcl1dLmZvckVhY2goZnVuY3Rpb24oYykge1xuXHRcdFx0XHRpZihjWzBdKSB7XG5cdFx0XHRcdFx0aWYoY1swXVtcIl9kb21haW5cIl0pIHtcblx0XHRcdFx0XHRcdGNbMF0uZG9tYWluKGNbMF1bXCJfZG9tYWluXCJdLmNhbGwodGhpcywgZGF0YSwgY1sxXSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcblx0XHRcdFx0XHRpZihjWzBdW1wiX3JhbmdlXCJdKSB7XG5cdFx0XHRcdFx0XHRjWzBdLnJhbmdlKGNbMF1bXCJfcmFuZ2VcIl0uY2FsbCh0aGlzLCBkYXRhLCBjWzBdLmRvbWFpbigpKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XHRcdFx0XG5cdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0Ly8gSW5pdCBsYXllcnNcblx0XHRcdHZhciBsYXllcnMgPSBbbGF5ZXIwLCBsYXllcjEsIGxheWVyMiwgbGF5ZXIzLCBsYXllcjQsIGxheWVyNSwgbGF5ZXI2LCBsYXllcjddXG5cdFx0XHRcdC5maWx0ZXIoZnVuY3Rpb24obGF5ZXIpIHtcblx0XHRcdFx0XHRyZXR1cm4gbGF5ZXIgIT09IHVuZGVmaW5lZCAmJiAhbGF5ZXIubGF5ZXIoKS5oaWRlO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuc29ydChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChhLmxheWVyKCkuekluZGV4IHx8IDApIC0gKGIubGF5ZXIoKS56SW5kZXggfHwgMCk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5tYXAoZnVuY3Rpb24obGF5ZXIpIHtcblx0XHRcdFx0XHRpZihsYXllci53aWR0aCAmJiAhbGF5ZXIud2lkdGgoKSkgbGF5ZXIud2lkdGgodGVtcGxhdGUuY29udGVudFdpZHRoKCkpO1xuXHRcdFx0XHRcdGlmKGxheWVyLmhlaWdodCAmJiAhbGF5ZXIuaGVpZ2h0KCkpIGxheWVyLmhlaWdodCh0ZW1wbGF0ZS5jb250ZW50SGVpZ2h0KCkpO1xuXHRcdFx0XHRcdGlmKGxheWVyLm1hcmdpbiAmJiAhbGF5ZXIubWFyZ2luKCkpIGxheWVyLm1hcmdpbih7IHRvcDogMCwgcmlnaHQ6IDAsIGJvdHRvbTogMCwgbGVmdDogMCB9KTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRbXG5cdFx0XHRcdFx0XHRbXCJrZXlcIiwga2V5XSxcblx0XHRcdFx0XHRcdFtcInhcIiwgeF0sXG5cdFx0XHRcdFx0XHRbXCJ5XCIsIHldLFxuXHRcdFx0XHRcdFx0W1wieTFcIiwgeTFdLFxuXHRcdFx0XHRcdFx0W1wiY29sb3JcIiwgY29sb3JdLFxuXHRcdFx0XHRcdFx0W1widGV4dFwiLCB0ZXh0XSxcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0W1wieExhYmVsXCIsIHhMYWJlbF0sXG5cdFx0XHRcdFx0XHRbXCJ5TGFiZWxcIiwgeUxhYmVsXSxcblx0XHRcdFx0XHRcdFtcInkxTGFiZWxcIiwgeTFMYWJlbF0sXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFtcInhGb3JtYXRcIiwgeEZvcm1hdF0sXG5cdFx0XHRcdFx0XHRbXCJ5Rm9ybWF0XCIsIHlGb3JtYXRdLFxuXHRcdFx0XHRcdFx0W1wieTFGb3JtYXRcIiwgeTFGb3JtYXRdLFxuXHRcdFx0XHRcdFx0W1widGV4dEZvcm1hdFwiLCB0ZXh0Rm9ybWF0XSxcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0W1widHJhbnNpdGlvblwiLCB0cmFuc2l0aW9uXSxcblx0XHRcdFx0XHRcdFtcImVudGVyVHJhbnNpdGlvblwiLCBlbnRlclRyYW5zaXRpb25dLFxuXHRcdFx0XHRcdFx0W1wiZXhpdFRyYW5zaXRpb25cIiwgZXhpdFRyYW5zaXRpb25dXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XS5mb3JFYWNoKGZ1bmN0aW9uKGMpIHtcblx0XHRcdFx0XHRcdGlmKGxheWVyW2NbMF1dICYmICFsYXllcltjWzBdXSgpKSBsYXllcltjWzBdXShjWzFdKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHQvLyBJbml0IHNjYWxlc1xuXHRcdFx0XHRcdGlmKGxheWVyLnhTY2FsZSkge1xuXHRcdFx0XHRcdFx0aWYoIWxheWVyLnhTY2FsZSgpKSB7XG5cdFx0XHRcdFx0XHRcdGxheWVyLnhTY2FsZSh4U2NhbGUpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0aWYobGF5ZXIueFNjYWxlKClbXCJfZG9tYWluXCJdKSB7XG5cdFx0XHRcdFx0XHRcdFx0bGF5ZXIueFNjYWxlKCkuZG9tYWluKGxheWVyLnhTY2FsZSgpW1wiX2RvbWFpblwiXS5jYWxsKHRoaXMsIGRhdGEsIGxheWVyLngoKSkpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGxheWVyLnhTY2FsZSgpLnJhbmdlKFswLCB0ZW1wbGF0ZS5jb250ZW50V2lkdGgoKV0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHRpZihsYXllci55U2NhbGUpIHtcblx0XHRcdFx0XHRcdGlmKCFsYXllci55U2NhbGUoKSkge1xuXHRcdFx0XHRcdFx0XHRsYXllci55U2NhbGUoeVNjYWxlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGlmKGxheWVyLnlTY2FsZSgpW1wiX2RvbWFpblwiXSkge1xuXHRcdFx0XHRcdFx0XHRcdGxheWVyLnlTY2FsZSgpLmRvbWFpbihsYXllci55U2NhbGUoKVtcIl9kb21haW5cIl0uY2FsbCh0aGlzLCBkYXRhLCBsYXllci55KCkpKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRsYXllci55U2NhbGUoKS5yYW5nZShbdGVtcGxhdGUuY29udGVudEhlaWdodCgpLCAwXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmKGxheWVyLnkxU2NhbGUpIHtcblx0XHRcdFx0XHRcdGlmKCFsYXllci55MVNjYWxlKCkpIHtcblx0XHRcdFx0XHRcdFx0bGF5ZXIueTFTY2FsZSh5MVNjYWxlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGlmKGxheWVyLnkxU2NhbGUoKVtcIl9kb21haW5cIl0pIHtcblx0XHRcdFx0XHRcdFx0XHRsYXllci55MVNjYWxlKCkuZG9tYWluKGxheWVyLnkxU2NhbGUoKVtcIl9kb21haW5cIl0uY2FsbCh0aGlzLCBkYXRhLCBsYXllci55MSgpKSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcblx0XHRcdFx0XHRcdFx0aWYobGF5ZXIueTFTY2FsZSgpW1wiX3JhbmdlXCJdKSB7XG5cdFx0XHRcdFx0XHRcdFx0bGF5ZXIueTFTY2FsZSgpLnJhbmdlKGxheWVyLnkxU2NhbGUoKVtcIl9yYW5nZVwiXS5jYWxsKHRoaXMsIGRhdGEsIGxheWVyLnkxU2NhbGUoKS5kb21haW4oKSkpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmKGxheWVyLmNvbG9yU2NhbGUpIHtcblx0XHRcdFx0XHRcdGlmKCFsYXllci5jb2xvclNjYWxlKCkpIHtcblx0XHRcdFx0XHRcdFx0bGF5ZXIuY29sb3JTY2FsZShjb2xvclNjYWxlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGlmKGxheWVyLmNvbG9yU2NhbGUoKVtcIl9kb21haW5cIl0pIHtcblx0XHRcdFx0XHRcdFx0XHRsYXllci5jb2xvclNjYWxlKCkuZG9tYWluKGxheWVyLmNvbG9yU2NhbGUoKVtcIl9kb21haW5cIl0uY2FsbCh0aGlzLCBkYXRhLCBsYXllci5jb2xvcigpKSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdGlmKGxheWVyLmNvbG9yU2NhbGUoKVtcIl9yYW5nZVwiXSkge1xuXHRcdFx0XHRcdFx0XHRcdGxheWVyLmNvbG9yU2NhbGUoKS5yYW5nZShsYXllci5jb2xvclNjYWxlKClbXCJfcmFuZ2VcIl0uY2FsbCh0aGlzLCBkYXRhLCBsYXllci5jb2xvclNjYWxlKCkuZG9tYWluKCkpKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0cmV0dXJuIGxheWVyO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0Ly8gQ3JlYXRlIGVhY2ggbGF5ZXIgaW4gYSBzZXBhcmF0ZSBzdmcgZy5cblx0XHRcdGZ1bmN0aW9uIGNyZWF0ZUxheWVyKG5vZGUsIHRlbXBsYXRlcykge1xuXHRcdFx0XHRcblx0XHRcdFx0dmFyIGxheWVycyA9IG5vZGUuc2VsZWN0QWxsKFwiLmxheWVyXCIpOyAvLyBVUERBVEVcblx0XHRcdFx0XG5cdFx0XHRcdC8vIEVOVEVSXG5cdFx0XHRcdGxheWVycy5kYXRhKHRlbXBsYXRlcy5tYXAoZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gaTsgfSkpLmVudGVyKClcblx0XHRcdFx0XHQuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkKSB7IHJldHVybiBcImxheWVyIGlcIiArIGQ7IH0pXG5cdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRcdHZhciB2YWx1ZSA9IFwiXCIsXHRcblx0XHRcdFx0XHRcdFx0XHR0cmFuc2Zvcm0gPSB0ZW1wbGF0ZXNbZF0ubGF5ZXIoKS50cmFuc2Zvcm07XHRcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdGlmKHRyYW5zZm9ybSkge1xuXHRcdFx0XHRcdFx0XHRcdGlmKHRyYW5zZm9ybS50cmFuc2xhdGUgJiYgKHRyYW5zZm9ybS50cmFuc2xhdGUueCB8fCB0cmFuc2Zvcm0udHJhbnNsYXRlLnkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZSArPSBcIiB0cmFuc2xhdGUoXCIgKyAodHJhbnNmb3JtLnRyYW5zbGF0ZS54IHx8IDApICsgXCIsIFwiICsgKHRyYW5zZm9ybS50cmFuc2xhdGUueSB8fCAwKSArIFwiKVwiO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRpZih0cmFuc2Zvcm0uc2NhbGUgJiYgKHRyYW5zZm9ybS5zY2FsZS54IHx8IHRyYW5zZm9ybS5zY2FsZS55KSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWUgKz0gXCIgc2NhbGUoXCIgKyAodHJhbnNmb3JtLnNjYWxlLnggfHwgMSkgKyBcIiwgXCIgKyAodHJhbnNmb3JtLnNjYWxlLnkgfHwgMSkgKyBcIilcIjtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0aWYodHJhbnNmb3JtLnJvdGF0ZSAmJiB0cmFuc2Zvcm0ucm90YXRlLmEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlICs9IFwiIHJvdGF0ZShcIiArICh0cmFuc2Zvcm0ucm90YXRlLmEgfHwgMCkgKyBcIiwgXCIgKyAodHJhbnNmb3JtLnJvdGF0ZS54IHx8IDApICsgXCIsIFwiICsgKHRyYW5zZm9ybS5yb3RhdGUueSB8fCAwKSArIFwiKVwiO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbHVlICE9PSBcIlwiID8gdmFsdWUudHJpbSgpIDogdW5kZWZpbmVkO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFxuXHRcdFx0XHRub2RlLnNlbGVjdEFsbChcIi5sYXllclwiKS5lYWNoKGZ1bmN0aW9uKHRlbXBsYXRlLCBpbmRleCkge1xuXHRcdFx0XHRcdGQzLnNlbGVjdCh0aGlzKS5kYXR1bShkYXRhKS5jYWxsKHRlbXBsYXRlc1tpbmRleF0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0Ly8gRVhJVFxuXHRcdFx0XHRsYXllcnMuZXhpdCgpXG5cdFx0XHRcdFx0LnJlbW92ZSgpO1x0XHRcdFxuXHRcdFx0fVxuXHRcdFx0XHRcdFx0XG5cdFx0XHQvLyBBZGQgbWVzc2FnZSBzZWN0aW9uXG5cdFx0XHRkMy5zZWxlY3QodGhpcykuc2VsZWN0QWxsKFwiLm1lc3NhZ2VcIikuZGF0YShbMV0pLmVudGVyKClcblx0XHRcdFx0LmFwcGVuZChcInBcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwibWVzc2FnZVwiKS5odG1sKFwiJnp3bmo7XCIpO1xuXHRcdFx0XHRcdFx0XHRcblx0XHRcdHZhciB0U1ZHID0gdGVtcGxhdGVTVkcoKVxuXHRcdFx0XHQuY2xhc3NlZChjbGFzc2VkKVxuXHRcdFx0XHQud2lkdGgoaW5oZXJpdFNpemUgPT09IFwiY2xpZW50V2lkdGhcIiA/IHVuZGVmaW5lZCA6IHdpZHRoKVxuXHRcdFx0XHQuaGVpZ2h0KGluaGVyaXRTaXplID09PSBcImNsaWVudFdpZHRoXCIgPyB1bmRlZmluZWQgOiBoZWlnaHQpXG5cdFx0XHRcdC52aWV3Ym94KHsgXCJ4XCI6IDAsIFwieVwiOiAwLCBcIndpZHRoXCI6IHdpZHRoLCBcImhlaWdodFwiOiBoZWlnaHQgfSk7XG5cdFx0XHRcdFxuXHRcdFx0dmFyIHN2ZyA9IGQzLnNlbGVjdCh0aGlzKS5kYXR1bShbMV0pLmNhbGwodFNWRykuc2VsZWN0KFwic3ZnXCIpLFxuXHRcdFx0XHRtYWluID0gc3ZnLnNlbGVjdEFsbChcIi5tYWluXCIpLmRhdGEoWzFdKTtcblx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0bWFpbi5lbnRlcigpXG5cdFx0XHRcdC5hcHBlbmQoXCJnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcIm1haW5cIilcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIG1hcmdpbi5sZWZ0ICsgXCIsXCIgKyBtYXJnaW4udG9wICsgXCIpXCIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRjcmVhdGVMYXllcihkMy5zZWxlY3QodGhpcykuc2VsZWN0QWxsKFwiLm1haW5cIiksIGxheWVycyk7XHRcdFx0XG5cdFx0fSk7XG5cdH1cblx0XHRcblx0dGVtcGxhdGUuY2xhc3NlZCA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjbGFzc2VkID0gXywgdGVtcGxhdGUpIDogY2xhc3NlZDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLndpZHRoID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh3aWR0aCA9IF8sIHRlbXBsYXRlKSA6IHdpZHRoO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuaGVpZ2h0ID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChoZWlnaHQgPSBfLCB0ZW1wbGF0ZSkgOiBoZWlnaHQ7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5pbmhlcml0U2l6ZSA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoaW5oZXJpdFNpemUgPSBfLCB0ZW1wbGF0ZSkgOiBpbmhlcml0U2l6ZTtcblx0fTtcblx0XG5cdHRlbXBsYXRlLm1hcmdpbiA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobWFyZ2luID0gXywgdGVtcGxhdGUpIDogbWFyZ2luO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUubWFyZ2luVG9wID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChtYXJnaW4udG9wID0gXywgdGVtcGxhdGUpIDogbWFyZ2luLnRvcDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLm1hcmdpblJpZ2h0ID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChtYXJnaW4ucmlnaHQgPSBfLCB0ZW1wbGF0ZSkgOiBtYXJnaW4ucmlnaHQ7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5tYXJnaW5Cb3R0b20gPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKG1hcmdpbi5ib3R0b20gPSBfLCB0ZW1wbGF0ZSkgOiBtYXJnaW4uYm90dG9tO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUubWFyZ2luTGVmdCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobWFyZ2luLkxlZnQgPSBfLCB0ZW1wbGF0ZSkgOiBtYXJnaW4uTGVmdDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmNvbnRlbnRXaWR0aCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB3aWR0aCAtIG1hcmdpbi5yaWdodCAtIG1hcmdpbi5sZWZ0O1xuXHR9O1xuXHRcdFxuXHR0ZW1wbGF0ZS5jb250ZW50SGVpZ2h0ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGhlaWdodCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tO1xuXHR9O1xuXG5cdHRlbXBsYXRlLmtleSA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoa2V5ID0gXywgdGVtcGxhdGUpIDoga2V5O1xuXHR9O1xuXHRcdFxuXHR0ZW1wbGF0ZS54ID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh4ID0gXywgdGVtcGxhdGUpIDogeDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLnkgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHkgPSBfLCB0ZW1wbGF0ZSkgOiB5OyBcblx0fTtcblx0XG5cdHRlbXBsYXRlLnkxID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh5MSA9IF8sIHRlbXBsYXRlKSA6IHkxOyBcblx0fTtcblx0XG5cdHRlbXBsYXRlLmNvbG9yID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjb2xvciA9IF8sIHRlbXBsYXRlKSA6IGNvbG9yO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUudGV4dCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodGV4dCA9IF8sIHRlbXBsYXRlKSA6IHRleHQ7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS54U2NhbGUgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHhTY2FsZSA9IF8sIHRlbXBsYXRlKSA6IHhTY2FsZTtcblx0fTtcblx0XG5cdHRlbXBsYXRlLnlTY2FsZSA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeVNjYWxlID0gXywgdGVtcGxhdGUpIDogeVNjYWxlO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUueTFTY2FsZSA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeTFTY2FsZSA9IF8sIHRlbXBsYXRlKSA6IHkxU2NhbGU7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5jb2xvclNjYWxlID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjb2xvclNjYWxlID0gXywgdGVtcGxhdGUpIDogY29sb3JTY2FsZTtcblx0fTtcblx0XG5cdHRlbXBsYXRlLnhMYWJlbCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeExhYmVsID0gXywgdGVtcGxhdGUpIDogeExhYmVsO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUueUxhYmVsID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh5TGFiZWwgPSBfLCB0ZW1wbGF0ZSkgOiB5TGFiZWw7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS55MUxhYmVsID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh5MUxhYmVsID0gXywgdGVtcGxhdGUpIDogeTFMYWJlbDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLnhGb3JtYXQgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHhGb3JtYXQgPSBfLCB0ZW1wbGF0ZSkgOiB4Rm9ybWF0O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUueUZvcm1hdCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeUZvcm1hdCA9IF8sIHRlbXBsYXRlKSA6IHlGb3JtYXQ7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS55MUZvcm1hdCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeTFGb3JtYXQgPSBfLCB0ZW1wbGF0ZSkgOiB5MUZvcm1hdDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLnRleHRGb3JtYXQgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRleHRGb3JtYXQgPSBfLCB0ZW1wbGF0ZSkgOiB0ZXh0Rm9ybWF0O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUudHJhbnNpdGlvbiA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodHJhbnNpdGlvbiA9IF8sIHRlbXBsYXRlKSA6IHRyYW5zaXRpb247XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5lbnRlclRyYW5zaXRpb24gPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGVudGVyVHJhbnNpdGlvbiA9IF8sIHRlbXBsYXRlKSA6IGVudGVyVHJhbnNpdGlvbjtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmV4aXRUcmFuc2l0aW9uID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChleGl0VHJhbnNpdGlvbiA9IF8sIHRlbXBsYXRlKSA6IGV4aXRUcmFuc2l0aW9uO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuY2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY2FsbGJhY2sgPSBfLCB0ZW1wbGF0ZSkgOiBjYWxsYmFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLmVudGVyQ2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZW50ZXJDYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IGVudGVyQ2FsbGJhY2s7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5leGl0Q2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZXhpdENhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogZXhpdENhbGxiYWNrO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUubGF5ZXIwID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGxheWVyMCA9IF8sIHRlbXBsYXRlKSA6IGxheWVyMDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmxheWVyMSA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChsYXllcjEgPSBfLCB0ZW1wbGF0ZSkgOiBsYXllcjE7XG5cdH07XG5cblx0dGVtcGxhdGUubGF5ZXIyID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGxheWVyMiA9IF8sIHRlbXBsYXRlKSA6IGxheWVyMjtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmxheWVyMyA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChsYXllcjMgPSBfLCB0ZW1wbGF0ZSkgOiBsYXllcjM7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5sYXllcjQgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobGF5ZXI0ID0gXywgdGVtcGxhdGUpIDogbGF5ZXI0O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUubGF5ZXI1ID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGxheWVyNSA9IF8sIHRlbXBsYXRlKSA6IGxheWVyNTtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmxheWVyNiA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChsYXllcjYgPSBfLCB0ZW1wbGF0ZSkgOiBsYXllcjY7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5sYXllcjcgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobGF5ZXI3ID0gXywgdGVtcGxhdGUpIDogbGF5ZXI3O1xuXHR9O1xuXHRcdFx0XG5cdHJldHVybiB0ZW1wbGF0ZTtcbn0iLCJleHBvcnQgZnVuY3Rpb24gZXh0ZW5kKHRhcmdldCwgc291cmNlKSB7XG5cdFx0XHRcdFx0XG5cdGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBzb3VyY2U7XG5cdH1cblx0XG5cdGZvciAodmFyIHAgaW4gc291cmNlKSB7XG5cdFx0aWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShwKSkge1xuXHRcdFx0aWYgKHR5cGVvZiBzb3VyY2VbcF0gPT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHR0YXJnZXRbcF0gPSBleHRlbmQodGFyZ2V0W3BdLCBzb3VyY2VbcF0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGFyZ2V0W3BdID0gc291cmNlW3BdO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gdGFyZ2V0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlmZihwcmV2LCBub3cpIHtcblx0dmFyIGNoYW5nZXMgPSB7fTtcbiAgICBcblx0Zm9yKHZhciBwIGluIG5vdykge1xuXHRcdGlmKCFwcmV2IHx8IHByZXZbcF0gIT09IG5vd1twXSkge1xuXHRcdFx0aWYodHlwZW9mIG5vd1twXSA9PSBcIm9iamVjdFwiIC8qICYmICFBcnJheS5pc0FycmF5KG5vd1twXSkgKi8pIHtcblx0XHRcdFx0cHJldiA9IHByZXYgfHwge307XG5cdFx0XHRcdHZhciBjID0gZGlmZihwcmV2W3BdLCBub3dbcF0pO1xuXHRcdFx0XHRpZighaXNFbXB0eShjKSlcblx0XHRcdFx0XHRjaGFuZ2VzW3BdID0gYztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNoYW5nZXNbcF0gPSBub3dbcF07XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBjaGFuZ2VzO1xufVxuXG4vKiBTZWU6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTkwOTg3OTcvZmFzdGVzdC13YXktdG8tZmxhdHRlbi11bi1mbGF0dGVuLW5lc3RlZC1qc29uLW9iamVjdHMgKi9cbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuKG9iamVjdCwgc2VwYXJhdG9yKSB7XG5cdHNlcGFyYXRvciA9IHNlcGFyYXRvciB8fCBcIl9cIjtcblx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcblx0ZnVuY3Rpb24gcmVjdXJzZShjdXJyZW50LCBwcm9wZXJ0eSkge1xuXHRcdGlmKE9iamVjdChjdXJyZW50KSAhPT0gY3VycmVudCkge1xuXHRcdFx0cmVzdWx0W3Byb3BlcnR5XSA9IGN1cnJlbnQ7XG5cdFx0fSBlbHNlIGlmKEFycmF5LmlzQXJyYXkoY3VycmVudCkpIHtcblx0XHRcdGZvcih2YXIgaSA9IDAsIGwgPSBjdXJyZW50Lmxlbmd0aDsgaSA8IGw7IGkrKylcblx0XHRcdFx0cmVjdXJzZShjdXJyZW50W2ldLCBwcm9wZXJ0eSArIFwiW1wiICsgaSArIFwiXVwiKTtcblx0XHRcdGlmIChsID09PSAwKVxuXHRcdFx0XHRyZXN1bHRbcHJvcGVydHldID0gW107XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBpc0VtcHR5ID0gdHJ1ZTtcblx0XHRcdGZvcih2YXIgcCBpbiBjdXJyZW50KSB7XG5cdFx0XHRcdGlzRW1wdHkgPSBmYWxzZTtcblx0XHRcdFx0cmVjdXJzZShjdXJyZW50W3BdLCBwcm9wZXJ0eSA/IHByb3BlcnR5ICsgc2VwYXJhdG9yICsgcCA6IHApO1xuXHRcdFx0fVxuXHRcdFx0aWYoaXNFbXB0eSAmJiBwcm9wZXJ0eSkgcmVzdWx0W3Byb3BlcnR5XSA9IHt9O1xuXHRcdH1cblx0fVxuXHRyZWN1cnNlKG9iamVjdCwgXCJcIik7XG5cdHJldHVybiByZXN1bHQ7XG59XG5cbi8qIFNlZTogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xOTA5ODc5Ny9mYXN0ZXN0LXdheS10by1mbGF0dGVuLXVuLWZsYXR0ZW4tbmVzdGVkLWpzb24tb2JqZWN0cyAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuZmxhdHRlbihvYmplY3QsIHNlcGFyYXRvcikge1xuXHRzZXBhcmF0b3IgPSBzZXBhcmF0b3IgfHwgXCJfXCI7XG5cblx0aWYgKE9iamVjdChvYmplY3QpICE9PSBvYmplY3QgfHwgQXJyYXkuaXNBcnJheShvYmplY3QpKVxuXHRcdHJldHVybiBvYmplY3Q7XG5cblx0dmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIlxcXFwuPyhbXlwiICsgc2VwYXJhdG9yICsgXCJcXFxcW1xcXFxdXSspfFxcXFxbKFxcXFxkKylcXFxcXVwiLCBcImdcIiksXG5cdFx0cmVzdWx0ID0ge307XG5cblx0Zm9yKHZhciBwIGluIG9iamVjdCkge1xuXHRcdHZhciBjdXJyZW50ID0gcmVzdWx0LFxuXHRcdFx0cHJvcGVydHkgPSBcIlwiLFxuXHRcdFx0bSA9IHJlZ2V4LmV4ZWMocCk7XG5cdFx0d2hpbGUobSkge1xuXHRcdFx0Y3VycmVudCA9IGN1cnJlbnRbcHJvcGVydHldIHx8IChjdXJyZW50W3Byb3BlcnR5XSA9IChtWzJdID8gW10gOiB7fSkpO1xuXHRcdFx0cHJvcGVydHkgPSBtWzJdIHx8IG1bMV07XG5cdFx0XHRtID0gcmVnZXguZXhlYyhwKTtcblx0XHR9XG5cdFx0Y3VycmVudFtwcm9wZXJ0eV0gPSBvYmplY3RbcF07XG5cdH1cblx0cmV0dXJuIHJlc3VsdFtcIlwiXSB8fCByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0VtcHR5KG8pIHtcblx0cmV0dXJuIHR5cGVvZiBvID09PSBcIm9iamVjdFwiICYmIChvID09PSBudWxsIHx8IE9iamVjdC5rZXlzKG8pLmxlbmd0aCA9PT0gMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWVwVmFsdWUob2JqZWN0LCBwYXRoKSB7XG5cdHZhciBwYXRocyA9IHBhdGguc3BsaXQoXCIuXCIpLFxuXHRcdGN1cnJlbnQgPSBvYmplY3Q7XG5cblx0Zm9yKHZhciBpID0gMDsgaSA8IHBhdGhzLmxlbmd0aDsgKytpKSB7XG5cdFx0aWYoY3VycmVudFtwYXRoc1tpXV0gPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdXJyZW50ID0gY3VycmVudFtwYXRoc1tpXV07XG5cdFx0fVxuXHR9XG5cdHJldHVybiBjdXJyZW50O1xufVxuXG4vLyBTZWU6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTQyMzQ1NjAvamF2YXNjcmlwdC1ob3ctdG8tZ2V0LXBhcmVudC1lbGVtZW50LWJ5LXNlbGVjdG9yXG5leHBvcnQgZnVuY3Rpb24gZmluZFBhcmVudEJ5U2VsZWN0b3IoZWxlbWVudCwgc2VsZWN0b3IpIHtcblx0XHRcblx0ZnVuY3Rpb24gY29sbGVjdGlvbkhhcyhhLCBiKSB7IC8vaGVscGVyIGZ1bmN0aW9uIChzZWUgYmVsb3cpXG5cdFx0Zm9yKHZhciBpID0gMCwgbGVuID0gYS5sZW5ndGg7IGkgPCBsZW47IGkgKyspIHtcblx0XHRcdGlmKGFbaV0gPT0gYikgcmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRcblx0dmFyIGRvY0VsZW0gPSBlbGVtZW50O1xuXHRcblx0Ly8gRmluZCBlbmNsb3NpbmcgZG9jdW1lbnQgb3IgZG9jdW1lbnQgZnJhZ21lbnRcblx0d2hpbGUoZG9jRWxlbSAmJiBkb2NFbGVtLm5vZGVUeXBlICE9PSA5ICYmIGRvY0VsZW0ubm9kZVR5cGUgIT09IDExKSB7XG5cdFx0ZG9jRWxlbSA9IGRvY0VsZW0ucGFyZW50Tm9kZTtcblx0fVxuXHRcblx0aWYoZG9jRWxlbSkge1xuXHRcdHZhciBhbGwgPSBkb2NFbGVtLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpLFxuXHRcdFx0Y3VycmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcblx0XG5cdFx0d2hpbGUoY3VycmVudCAmJiAhY29sbGVjdGlvbkhhcyhhbGwsIGN1cnJlbnQpKSB7IC8vIGtlZXAgZ29pbmcgdXAgdW50aWwgeW91IGZpbmQgYSBtYXRjaFxuXHRcdFx0Y3VycmVudCA9IGN1cnJlbnQucGFyZW50Tm9kZTtcblx0XHR9XG5cdFx0cmV0dXJuIGN1cnJlbnQ7IC8vIHdpbGwgcmV0dXJuIG51bGwgaWYgbm90IGZvdW5kXG5cdH1cblx0cmV0dXJuIG51bGw7XG59XG5cbi8qIFNlZTogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vamFzb25yaG9kZXMvMjMyMTU4MSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFByb3BlcnR5QXRQYXRoKHBhdGgsIG9iamVjdCwgc2VwYXJhdG9yKSB7XG5cdHZhciBuYW1lcyA9IHBhdGguc3BsaXQoc2VwYXJhdG9yIHx8IFwiX1wiKSxcblx0XHRsZW5ndGggPSBuYW1lcy5sZW5ndGgsXG5cdFx0aSwgcCA9IG9iamVjdCB8fCB0aGlzO1xuXG5cdGZvcihpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0cCA9IHBbbmFtZXNbaV1dO1xuXHRcdGlmKHAgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXHRyZXR1cm4gcDtcbn0iLCJpbXBvcnQgKiBhcyBkMyBmcm9tIFwiZDNcIjtcbmltcG9ydCB7IGV4dGVuZCwgZGlmZiwgZGVlcFZhbHVlIH0gZnJvbSBcIi4vdXRpbFwiO1xuXG52YXIgaW5zdGFuY2UgPSBudWxsLFxuXHRfcmVhZHkgPSBmYWxzZSxcblx0X3JlZ2lzdHJ5ID0ge307XHRcblxuZXhwb3J0IGZ1bmN0aW9uIHRhZ0ZhY3RvcnkoKSB7XG5cdFx0XG5cdGlmKGluc3RhbmNlKSByZXR1cm4gaW5zdGFuY2U7XG5cdFx0XG5cdGluc3RhbmNlID0ge1xuXHRcblx0XHRyZWFkeTogZnVuY3Rpb24oXykgeyBcblx0XHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKF9yZWFkeSA9IF8sIHRoaXMpIDogX3JlYWR5O1xuXHRcdH0sXG5cdFx0XG5cdFx0cmVnaXN0cnk6IGZ1bmN0aW9uKF8pIHsgXG5cdFx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChfcmVnaXN0cnkgPSBfLCB0aGlzKSA6IF9yZWdpc3RyeTtcblx0XHR9LFxuXHRcdFxuXHRcdGluaXQ6IGZ1bmN0aW9uKG8pIHtcblx0XHRcdFxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XG5cdFx0XHRpZihvLnNldHVwcyAmJiBvLnNldHVwcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGZvcih2YXIgaSBpbiBvLnNldHVwcykge1xuXHRcdFx0XHRcdHZhciBzZXR1cCA9IG8uc2V0dXBzW2ldO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmKHR5cGVvZiBzZXR1cCA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRcdFx0dGhpcy5hZGRBbGwoc2V0dXApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBTZWU6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMyNzcxODIvaG93LXRvLWdldC10aGUtZ2xvYmFsLW9iamVjdC1pbi1qYXZhc2NyaXB0LzMyNzcxOTIjMzI3NzE5MlxuXHRcdFx0XHRcdFx0dGhpcy5hZGRBbGwoZGVlcFZhbHVlKEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSwgc2V0dXApKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmKG8uc2V0dXBfdXJscyAmJiBvLnNldHVwX3VybHMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcblx0XHRcdFx0dmFyIHF1ZXVlID0gZDMucXVldWUoKTtcblx0XHRcdFx0XG5cdFx0XHRcdGZvcih2YXIgaiBpbiBvLnNldHVwX3VybHMpIHtcblx0XHRcdFx0XHRxdWV1ZS5kZWZlcihkMy5qc29uLCBvLnNldHVwX3VybHNbal0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcblx0XHRcdFx0cXVldWUuYXdhaXRBbGwoZnVuY3Rpb24oZXJyb3IsIHJlc3VsdCkge1xuXHRcdFx0XHRcdGlmKGVycm9yKSB0aHJvdyBlcnJvcjtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRmb3IodmFyIGsgaW4gcmVzdWx0KSB7XG5cdFx0XHRcdFx0XHRzZWxmLmFkZEFsbChyZXN1bHRba10pO1xuXHRcdFx0XHRcdFx0aWYoK2sgPT09IHJlc3VsdC5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdFx0XHRcdHNlbGYuYWRkQWxsKG8uc2V0dXBfanNvbik7XG5cdFx0XHRcdFx0XHRcdGRvbmUoc2VsZik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuYWRkQWxsKG8uc2V0dXBfanNvbik7XG5cdFx0XHRcdGRvbmUodGhpcyk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGZ1bmN0aW9uIGRvbmUobykge1xuXHRcdFx0XHRpZigvY29tcGxldGV8aW50ZXJhY3RpdmV8bG9hZGVkLy50ZXN0KGRvY3VtZW50LnJlYWR5U3RhdGUpKSB7XG5cdFx0XHRcdFx0by5yZWFkeSh0cnVlKS5wcm9jZXNzKGRvY3VtZW50KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdG8ucmVhZHkodHJ1ZSkucHJvY2Vzcyhkb2N1bWVudCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0cmV0dXJuIHRoaXM7XHRcdFx0XG5cdFx0fSxcblx0XHRcblx0XHRhZGQ6IGZ1bmN0aW9uKGtleSwgbykge1xuXHRcdFx0aWYoIW8uY3JlYXRlICYmIG9bXCJkYXRhLWRnZlwiXSkge1xuXHRcdFx0XHRvLmNyZWF0ZSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvW1wiZGF0YS1kZ2ZcIl0pKTsgfTtcblx0XHRcdH1cblx0XHRcdF9yZWdpc3RyeVtrZXldID0gbztcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cdFx0XG5cdFx0YWRkQWxsOiBmdW5jdGlvbihvKSB7XG5cdFx0XHRcblx0XHRcdGlmKCFvKSByZXR1cm4gdGhpcztcblx0XHRcdFxuXHRcdFx0aWYoQXJyYXkuaXNBcnJheShvKSkge1xuXHRcdFx0XHRmb3IodmFyIGkgaW4gbykge1xuXHRcdFx0XHRcdHRoaXMuYWRkQWxsKG9baV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1x0XHRcblx0XHRcdFx0Zm9yKHZhciBrZXkgaW4gbykge1xuXHRcdFx0XHRcdHRoaXMuYWRkKGtleSwgb1trZXldKTtcblx0XHRcdFx0fVx0XHRcblx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cdFx0XHRcblx0XHRsb29rdXA6IGZ1bmN0aW9uKGtleSkge1xuXHRcdFx0cmV0dXJuIF9yZWdpc3RyeVtrZXldO1xuXHRcdH0sXG5cdFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24obmFtZSwgdmFsdWUsIGNhbGxlZXMpIHtcdFx0XHRcblx0XHRcdGlmKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmNyZWF0ZShudWxsLCBhcmd1bWVudHNbMF0sIGNhbGxlZXMpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZih2YWx1ZSkge1xuXHRcdFx0XHRpZih2YWx1ZS50eXBlKSB7XG5cdFx0XHRcdFx0dmFyIHR5cGUgPSB0aGlzLmxvb2t1cCh2YWx1ZS50eXBlKTtcblx0XHRcdFx0XHRpZih0eXBlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdHRocm93IFwidW5rbm93biB0eXBlOiAnXCIgKyB2YWx1ZS50eXBlICsgXCInXCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiB0eXBlb2YgdHlwZS5jcmVhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHR5cGUuY3JlYXRlKHRoaXMsIFwidHlwZVwiLCB2YWx1ZSwgY2FsbGVlcykgOiB0eXBlLmNyZWF0ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzd2l0Y2gobmFtZSkge1xuXHRcdFx0XHRcdGNhc2UgXCJwYXJzZVwiOlxuXHRcdFx0XHRcdFx0dmFyIG8gPSB7fTtcblx0XHRcdFx0XHRcdGZvcih2YXIgayBpbiB2YWx1ZSkge1xuXHRcdFx0XHRcdFx0XHRvW3ZhbHVlW2tdLmF0dHJpYnV0ZV0gPSB0aGlzLmNyZWF0ZUV4cHJlc3Npb24odmFsdWVba10ucGFyc2UpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuIG87XG5cblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0dmFyIHYgPSB0aGlzLmNyZWF0ZUV4cHJlc3Npb24odmFsdWUpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHYgPyB2IDogdmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XG5cdFx0Y3JlYXRlVGVtcGxhdGU6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBjYWxsZWVzLCB0eXBlKSB7XG5cdFx0XHRmb3IobmFtZSBpbiB2YWx1ZSkge1xuXHRcdFx0XHRpZih0eXBlW25hbWVdKSB7XG5cdFx0XHRcdFx0c3dpdGNoKG5hbWUpIHtcblx0XHRcdFx0XHRjYXNlIFwia2V5XCI6XG5cdFx0XHRcdFx0Y2FzZSBcInhcIjpcblx0XHRcdFx0XHRjYXNlIFwieVwiOlxuXHRcdFx0XHRcdGNhc2UgXCJ5MVwiOlxuXHRcdFx0XHRcdGNhc2UgXCJjb2xvclwiOlxuXHRcdFx0XHRcdGNhc2UgXCJ0ZXh0XCI6XG5cdFx0XHRcdFx0Y2FzZSBcImxhYmVsXCI6XG5cdFx0XHRcdFx0Y2FzZSBcInhMYWJlbFwiOlxuXHRcdFx0XHRcdGNhc2UgXCJ5TGFiZWxcIjpcblx0XHRcdFx0XHRjYXNlIFwieTFMYWJlbFwiOlxuXHRcdFx0XHRcdFx0dHlwZVtuYW1lXS5jYWxsKHRoaXMsIHRoaXMuY3JlYXRlRXhwcmVzc2lvbih2YWx1ZVtuYW1lXSwgdHlwZSkpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNhc2UgXCJ4Rm9ybWF0XCI6XG5cdFx0XHRcdFx0Y2FzZSBcInlGb3JtYXRcIjpcblx0XHRcdFx0XHRjYXNlIFwieTFGb3JtYXRcIjpcblx0XHRcdFx0XHRjYXNlIFwidGV4dEZvcm1hdFwiOlxuXHRcdFx0XHRcdFx0dHlwZVtuYW1lXS5jYWxsKHRoaXMsIHRoaXMuY3JlYXRlRXhwcmVzc2lvbih2YWx1ZVtuYW1lXSkpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y2FzZSBcInhUaWNrVmFsdWVzXCI6XG5cdFx0XHRcdFx0Y2FzZSBcInlUaWNrVmFsdWVzXCI6XG5cdFx0XHRcdFx0Y2FzZSBcInkxVGlja1ZhbHVlc1wiOlxuXHRcdFx0XHRcdFx0dHlwZVtuYW1lXS5jYWxsKHRoaXMsIHZhbHVlW25hbWVdLnNwbGl0KFwiLFwiKS5tYXAoZnVuY3Rpb24oZCkgeyByZXR1cm4gaXNOYU4oZCkgPyBkIDogK2Q7IH0pKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNhc2UgXCJ0cmFuc2l0aW9uXCI6XG5cdFx0XHRcdFx0Y2FzZSBcImVudGVyVHJhbnNpdGlvblwiOlxuXHRcdFx0XHRcdGNhc2UgXCJleGl0VHJhbnNpdGlvblwiOlxuXHRcdFx0XHRcdFx0dHlwZVtuYW1lXS5jYWxsKHRoaXMsIHRoaXMuY3JlYXRlVHJhbnNpdGlvbihuYW1lLCB2YWx1ZVtuYW1lXSkpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHR5cGVbbmFtZV0uY2FsbCh0aGlzLCB0aGlzLmNyZWF0ZShuYW1lLCB2YWx1ZVtuYW1lXSwgY2FsbGVlcykpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHR5cGU7XG5cdFx0fSxcblx0XG5cdFx0Y3JlYXRlVHJhbnNpdGlvbjogZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcdFx0XG5cdFx0XHR2YXIgZWFzZSA9IHZhbHVlLmVhc2UgPyB0aGlzLmxvb2t1cCh2YWx1ZS5lYXNlKS5jcmVhdGUoKSA6IHVuZGVmaW5lZCxcblx0XHRcdFx0ZGVsYXkgPSB0aGlzLmNyZWF0ZUV4cHJlc3Npb24odmFsdWUuZGVsYXkpIHx8IHZhbHVlLmRlbGF5LFxuXHRcdFx0XHRkdXJhdGlvbiA9IHRoaXMuY3JlYXRlRXhwcmVzc2lvbih2YWx1ZS5kdXJhdGlvbikgfHwgdmFsdWUuZHVyYXRpb247XG5cdFx0XHRcblx0XHRcdHJldHVybiBmdW5jdGlvbih0KSB7XG5cdFx0XHRcdGlmKGVhc2UpIHQuZWFzZShlYXNlKTtcblx0XHRcdFx0aWYoZGVsYXkpIHQuZGVsYXkoZGVsYXkpO1xuXHRcdFx0XHRpZihkdXJhdGlvbikgdC5kdXJhdGlvbihkdXJhdGlvbik7XG5cdFx0XHRcdHJldHVybiB0O1xuXHRcdFx0fTtcblx0XHR9LFxuXHRcblx0XHRjcmVhdGVTY2FsZTogZnVuY3Rpb24obmFtZSwgdmFsdWUsIGNhbGxlZXMsIHR5cGUpIHtcdFx0XG5cdFx0XHRmb3IodmFyIF9uYW1lIGluIHZhbHVlKSB7XG5cdFx0XHRcdGlmKHR5cGVbX25hbWVdKSB7XG5cdFx0XHRcdFx0dmFyIHYgPSB0aGlzLmNyZWF0ZShfbmFtZSwgdmFsdWVbX25hbWVdKTtcblx0XHRcdFx0XHRpZihfbmFtZSA9PT0gXCJkb21haW5cIiB8fCBfbmFtZSA9PT0gXCJyYW5nZVwiKSB7XG5cdFx0XHRcdFx0XHRpZih0eXBlb2YgdiA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0XHRcdHR5cGVbXCJfXCIgKyBfbmFtZV0gPSB2O1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmKEFycmF5LmlzQXJyYXkodikgJiYgKHZbMF0gPT09IHVuZGVmaW5lZCB8fCBBcnJheS5pc0FycmF5KHZbMF0pKSkge1xuXHRcdFx0XHRcdFx0XHR0eXBlW1wiX1wiICsgX25hbWVdID0gZnVuY3Rpb24oZGF0YSwgZG9tYWluKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGk7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yKGkgPSBkb21haW4ubGVuZ3RoOyBpIDwgdi5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYodltpXSkgcmV0dXJuIHZbaV07XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGZvcihpID0gdi5sZW5ndGg7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZih2W2ldKSByZXR1cm4gdltpXTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYoQXJyYXkuaXNBcnJheSh2KSkge1xuXHRcdFx0XHRcdFx0XHR0eXBlW19uYW1lXSh2KTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHR5cGVbX25hbWVdKHYuc3BsaXQoXCIsXCIpLm1hcChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZCkgPyArZCA6IGQ7IH0pKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dHlwZVtfbmFtZV0odik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHlwZTtcblx0XHR9LFxuXHRcdFx0XG5cdFx0Y3JlYXRlRXhwcmVzc2lvbjogZnVuY3Rpb24odmFsdWUsIHR5cGUpIHtcblx0XHRcblx0XHRcdGlmKHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIHZhbHVlO1xuXHRcdFxuXHRcdFx0Ly8gSXMgaXQgYSByZWdpc3RlcmVkIGV4cHJlc3Npb24/XG5cdFx0XHR2YXIgdiA9IHRoaXMubG9va3VwKHZhbHVlKSxcblx0XHRcdFx0aywgcywgYSwgYiwgZztcblx0XHRcdFxuXHRcdFx0aWYodikgcmV0dXJuIHYuY3JlYXRlKCk7XG5cdFx0XG5cdFx0XHQvL3ZhciBtID0gdmFsdWUubWF0Y2goLyguKylcXCgoLiopXFwpLyk7XG5cdFx0XHR2YXIgbSA9IHZhbHVlLm1hdGNoKC8oXlthLXpBLVpdKylcXCgoLiopXFwpLyk7XG5cdFx0XHRcblx0XHRcdGlmKG0pIHtcblx0XHRcdFx0ayA9IG1bMl07XG5cdFx0XHRcblx0XHRcdFx0c3dpdGNoKG1bMV0pIHtcblx0XHRcdFxuXHRcdFx0XHRjYXNlIFwiZGF0YVwiOlxuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbihkLCBrZXlPbmx5KSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4ga2V5T25seSA/IGsgOiBkW2tdO1xuXHRcdFx0XHRcdH07XHRcdFx0XHRcdFx0XHRcblx0XHRcdFxuXHRcdFx0XHRjYXNlIFwiZGF0YUF0XCI6XG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKGQsIGtleU9ubHkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBrZXlPbmx5ID8gZDMua2V5cyhkKVsra10gOiBkW2QzLmtleXMoZClbK2tdXTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRjYXNlIFwiY29uc3RcIjpcdFxuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHJldHVybiBrO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFxuXHRcdFx0XHRjYXNlIFwibGlzdFwiOlxuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHJldHVybiBrLnNwbGl0KFwiLFwiKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRjYXNlIFwia2V5S2V5XCI6XG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiB0eXBlLmtleSgpKGRbMF0sIHRydWUpO1xuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0Y2FzZSBcInhLZXlcIjpcblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHR5cGUueCgpKGRbMF0sIHRydWUpO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRjYXNlIFwieUtleVwiOlxuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHlwZS55KCkoZFswXSwgdHJ1ZSk7XG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRjYXNlIFwieTFLZXlcIjpcblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHR5cGUueTEoKShkWzBdLCB0cnVlKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRjYXNlIFwiY29sb3JLZXlcIjpcblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHR5cGUuY29sb3IoKShkWzBdLCB0cnVlKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcblx0XHRcdFx0Y2FzZSBcInRleHRLZXlcIjpcblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHR5cGUudGV4dCgpKGRbMF0sIHRydWUpO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRjYXNlIFwibWFwXCI6XG5cdFx0XHRcdFx0aWYoayA9PT0gXCJcIikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKGRhdGEsIGFjY2Vzc29yKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkYXRhLm1hcChmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFjY2Vzc29yKGQpOyBcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkYXRhLm1hcChmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkW2tdO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XG5cdFx0XHRcdGNhc2UgXCJtYXBBdFwiOlxuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZGF0YS5tYXAoZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZFtkMy5rZXlzKGQpWytrXV07XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XG5cdFx0XHRcdGNhc2UgXCJleHRlbnRcIjpcblx0XHRcdFx0XHRpZihrID09PSBcIlwiKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oZGF0YSwgYWNjZXNzb3IpIHsgXG5cdFx0XHRcdFx0XHRcdHJldHVybiBkMy5leHRlbnQoZGF0YS5tYXAoZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiArYWNjZXNzb3IoZCk7XG5cdFx0XHRcdFx0XHRcdH0pKTsgXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQzLmV4dGVudChkYXRhLm1hcChmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiArZFtrXTtcblx0XHRcdFx0XHRcdH0pKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcblx0XHRcdFx0Y2FzZSBcImV4dGVudEF0XCI6XG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkMy5leHRlbnQoZGF0YS5tYXAoZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gK2RbZDMua2V5cyhkKVsra11dO1xuXHRcdFx0XHRcdFx0fSkpO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFxuXHRcdFx0XHRjYXNlIFwiZXh0ZW50WmVyb1wiOlxuXHRcdFx0XHRcdGlmKGsgPT09IFwiXCIpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbihkYXRhLCBhY2Nlc3Nvcikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZDMuZXh0ZW50KGRhdGEubWFwKGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gK2FjY2Vzc29yKGQpO1xuXHRcdFx0XHRcdFx0XHR9KS5jb25jYXQoMCkpO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZDMuZXh0ZW50KGRhdGEubWFwKGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuICtkW2tdO1xuXHRcdFx0XHRcdFx0fSkuY29uY2F0KDApKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcblx0XHRcdFx0Y2FzZSBcImV4dGVudFplcm9BdFwiOlxuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZDMuZXh0ZW50KGRhdGEubWFwKGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuICtkW2QzLmtleXMoZClbK2tdXTtcblx0XHRcdFx0XHRcdH0pLmNvbmNhdCgwKSk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XG5cdFx0XHRcdGNhc2UgXCJrZXlzXCI6XG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkMy5rZXlzKGRhdGFbMF0pO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcblx0XHRcdFx0Y2FzZSBcImtleXNBdFwiOlxuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZDMua2V5cyhkYXRhWzBdKVsra107XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRjYXNlIFwiaW5kZXhlZFwiOlxuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbihkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaSAqIGs7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XG5cdFx0XHRcdGNhc2UgXCJwcm9wb3J0aW9uYWxcIjpcblx0XHRcdFx0XHRtID0gay5zcGxpdChcIixcIik7XG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkW21bMF1dICogbVsxXTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcblx0XHRcdFx0Y2FzZSBcImZvcm1hdFwiOlxuXHRcdFx0XHRcdHJldHVybiBkMy5mb3JtYXQoayk7XG5cdFx0XHRcdFxuXHRcdFx0XHRjYXNlIFwidGltZUZvcm1hdFwiOlxuXHRcdFx0XHRcdHJldHVybiBkMy50aW1lRm9ybWF0KGspO1xuXHRcdFx0XHRcblx0XHRcdFx0Y2FzZSBcIm51bWJlclBhcnNlXCI6XG5cdFx0XHRcdFx0c3dpdGNoKGspIHtcblx0XHRcdFx0XHRjYXNlIFwiJVwiOlxuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHBhcnNlRmxvYXQoZC5tYXRjaCgvLT9cXGQrKFxcLlxcZCspPy9nKVswXSkgKiAwLjAxO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNhc2UgXCJrXCI6XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcGFyc2VGbG9hdChkLm1hdGNoKC8tP1xcZCsoXFwuXFxkKyk/L2cpWzBdKSAqIDEwMDA7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNhc2UgXCJNXCI6XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcGFyc2VGbG9hdChkLm1hdGNoKC8tP1xcZCsoXFwuXFxkKyk/L2cpWzBdKSAqIDEwMDAwMDA7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNhc2UgXCJCXCI6XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcGFyc2VGbG9hdChkLm1hdGNoKC8tP1xcZCsoXFwuXFxkKyk/L2cpWzBdKSAqIDEwMDAwMDAwMDA7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gK2Q7IFxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRjYXNlIFwidGltZVBhcnNlXCI6XG5cdFx0XHRcdFx0cmV0dXJuIGQzLnRpbWVQYXJzZShrKTtcblx0XHRcdFx0XG5cdFx0XHRcdGNhc2UgXCJ1dGNQYXJzZVwiOlxuXHRcdFx0XHRcdHJldHVybiBkMy51dGNQYXJzZShrKTtcblx0XHRcdFx0XG5cdFx0XHRcdGNhc2UgXCJpc29QYXJzZVwiOlxuXHRcdFx0XHRcdHJldHVybiBkMy5pc29QYXJzZShrKTtcblx0XHRcdFx0XG5cdFx0XHRcdGNhc2UgXCJ0aHJlc2hvbGRcIjpcblx0XHRcdFx0XHRrID0gay5zcGxpdChcIixcIik7XG5cdFx0XHRcdFx0cyA9IGQzLnNjYWxlVGhyZXNob2xkKCkuZG9tYWluKFsra1sxXV0pLnJhbmdlKFtrWzJdLCBrWzNdXSk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBzKGRba1swXV0pO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFxuXHRcdFx0XHRjYXNlIFwidGhyZXNob2xkQXRcIjpcblx0XHRcdFx0XHRrID0gay5zcGxpdChcIixcIik7XG5cdFx0XHRcdFx0cyA9IGQzLnNjYWxlVGhyZXNob2xkKCkuZG9tYWluKFsra1sxXV0pLnJhbmdlKFtrWzJdLCBrWzNdXSk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBzKGRbZDMua2V5cyhkKVsra1swXV1dKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcblx0XHRcdFx0Y2FzZSBcImludGVycG9sYXRlUmdiXCI6XG5cdFx0XHRcdFx0ayA9IGsuc3BsaXQoXCIsXCIpO1xuXHRcdFx0XHRcdGEgPSBrWzBdO1xuXHRcdFx0XHRcdGIgPSBrWzFdO1xuXHRcdFx0XHRcdGcgPSBrWzJdIHx8IDEuMDtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRyZXR1cm4gZDMuaW50ZXJwb2xhdGVSZ2IuZ2FtbWEoZykoYSwgYik7XG5cdFx0XHRcblx0XHRcdFx0Y2FzZSBcImludGVycG9sYXRlSHNsXCI6XG5cdFx0XHRcdFx0ayA9IGsuc3BsaXQoXCIsXCIpO1xuXHRcdFx0XHRcdGEgPSBrWzBdO1xuXHRcdFx0XHRcdGIgPSBrWzFdO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHJldHVybiBkMy5pbnRlcnBvbGF0ZUhzbChhLCBiKTtcblx0XHRcdFxuXHRcdFx0XHRjYXNlIFwiaW50ZXJwb2xhdGVMYWJcIjpcblx0XHRcdFx0XHRrID0gay5zcGxpdChcIixcIik7XG5cdFx0XHRcdFx0YSA9IGtbMF07XG5cdFx0XHRcdFx0YiA9IGtbMV07XG5cdFx0XHRcdFxuXHRcdFx0XHRcdHJldHVybiBkMy5pbnRlcnBvbGF0ZUxhYihhLCBiKTtcblx0XHRcdFx0XG5cdFx0XHRcdGNhc2UgXCJpbnRlcnBvbGF0ZUhjbFwiOlxuXHRcdFx0XHRcdGsgPSBrLnNwbGl0KFwiLFwiKTtcblx0XHRcdFx0XHRhID0ga1swXTtcblx0XHRcdFx0XHRiID0ga1sxXTtcblx0XHRcdFx0XG5cdFx0XHRcdFx0cmV0dXJuIGQzLmludGVycG9sYXRlSGNsKGEsIGIpO1xuXHRcdFx0XG5cdFx0XHRcdGNhc2UgXCJpbnRlcnBvbGF0ZUN1YmVoZWxpeFwiOlxuXHRcdFx0XHRcdGsgPSBrLnNwbGl0KFwiLFwiKTtcblx0XHRcdFx0XHRhID0ga1swXTtcblx0XHRcdFx0XHRiID0ga1sxXTtcblx0XHRcdFx0XHRnID0ga1syXSB8fCAxLjA7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdHJldHVybiBkMy5pbnRlcnBvbGF0ZUN1YmVoZWxpeC5nYW1tYShnKShhLCBiKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aHJvdyBcImNhbid0IGNyZWF0ZSBleHByZXNzaW9uOiAnXCIgKyB2YWx1ZSArIFwiJ1wiO1xuXHRcdFx0XHR9XHRcblx0XHRcdH1cblx0XHRcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fSxcblx0XG5cdFx0Y29tcHJlc3M6IGZ1bmN0aW9uKHApIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmKHAuZXh0ZW5kKSB7XG5cdFx0XHRcdFx0dmFyIGUgPSB0aGlzLmxvb2t1cChwLmV4dGVuZCk7XG5cblx0XHRcdFx0XHRpZihlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdHRocm93IFwidW5rbm93biBleHRlbmQ6ICdcIiArIHAuZXh0ZW5kICsgXCInXCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGUgPSB0aGlzLmRlY29tcHJlc3MoZS5jcmVhdGUoKSk7XHRcdFx0XHRcblx0XHRcdFx0XHRwID0gZGlmZihlLCBwKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR2YXIga2V5cyA9IE9iamVjdC5rZXlzKGUpO1x0XHRcdFx0XG5cdFx0XHRcdFx0Zm9yKHZhciBpIGluIGtleXMpIHtcblx0XHRcdFx0XHRcdHZhciBrID0ga2V5c1tpXTtcblx0XHRcdFx0XHRcdGlmKGVba10uZXh0ZW5kICYmIHBba10pIHtcblx0XHRcdFx0XHRcdFx0cFtrXS5leHRlbmQgPSBlW2tdLmV4dGVuZDtcblx0XHRcdFx0XHRcdFx0cFtrXSA9IHRoaXMuY29tcHJlc3MocFtrXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVx0XHRcdFxuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRyZXR1cm4gcDtcblx0XHRcdFx0XG5cdFx0XHR9IGNhdGNoKGVycm9yKSB7XG5cdFx0XHRcdHRocm93IFwiY2FuJ3QgY29tcHJlc3M6ICdcIiArIEpTT04uc3RyaW5naWZ5KHApICsgXCInLCBcIiArIGVycm9yO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XG5cdFx0ZGVjb21wcmVzczogZnVuY3Rpb24ocCkge1xuXHRcdFx0dHJ5IHtcdFx0XG5cdFx0XHRcdGlmKHAuZXh0ZW5kKSB7XG5cdFx0XHRcdFx0dmFyIGUgPSB0aGlzLmxvb2t1cChwLmV4dGVuZCk7XG5cdFx0XHRcdFx0aWYoZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBcInVua25vd24gZXh0ZW5kOiAnXCIgKyBwLmV4dGVuZCArIFwiJ1wiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHRlID0gdGhpcy5kZWNvbXByZXNzKGUuY3JlYXRlKCkpO1xuXHRcdFx0XHRcdHAgPSBleHRlbmQoZSwgcCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdHZhciBrZXlzID0gT2JqZWN0LmtleXMocCk7XG5cdFx0XHRcdGZvcih2YXIgaSBpbiBrZXlzKSB7XG5cdFx0XHRcdFx0dmFyIGsgPSBrZXlzW2ldO1xuXHRcdFx0XHRcdGlmKHR5cGVvZiBwW2tdID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdFx0XHRwW2tdID0gdGhpcy5kZWNvbXByZXNzKHBba10pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0cmV0dXJuIHA7XG5cdFx0XHRcdFxuXHRcdFx0fSBjYXRjaChlcnJvcikge1xuXHRcdFx0XHR0aHJvdyBcImNhbid0IGRlY29tcHJlc3M6ICdcIiArIEpTT04uc3RyaW5naWZ5KHApICsgXCInLCBcIiArIGVycm9yO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XHRcblx0XHR0b0h0bWw6IGZ1bmN0aW9uKG5vZGUsIHApIHtcdFx0XG5cdFx0XHRkZWxldGUgcC5ub2RlSWQ7XG5cdFx0XG5cdFx0XHR2YXIgZGF0YSA9IEpTT04uc3RyaW5naWZ5KHRoaXMuY29tcHJlc3MocCkpLFxuXHRcdFx0XHRmaWdjYXB0aW9uID0gbm9kZS5xdWVyeVNlbGVjdG9yKFwiZmlnY2FwdGlvblwiKTtcblx0XHRcdFx0XHRcblx0XHRcdHJldHVybiAoXCI8ZmlndXJlIGlkPVxcXCJcIiArIG5vZGUuaWQgKyBcIlxcXCIgY2xhc3M9XFxcImRnZiBtY2VOb25FZGl0YWJsZVxcXCIgY29udGVudGVkaXRhYmxlPVxcXCJmYWxzZVxcXCJcIiArXG5cdFx0XHRcdFx0XHRcIiBkYXRhLWRnZj1cXFwiXCIgKyBkYXRhLnJlcGxhY2UoL1xcXCIvZywgXCImcXVvdDtcIikucmVwbGFjZSgvXFxcIi9nLCBcIiUyMlwiKSAgKyBcIlxcXCJcIiArXG5cdFx0XHRcdFx0XHRcIj5cIiArIFxuXHRcdFx0XHRcdFx0XHRcIjxmaWdjYXB0aW9uIGNsYXNzPVxcXCJtY2VFZGl0YWJsZVxcXCIgY29udGVudGVkaXRhYmxlPVxcXCJ0cnVlXFxcIj5cIiArXG5cdFx0XHRcdFx0XHRcdChmaWdjYXB0aW9uID8gZmlnY2FwdGlvbi5pbm5lckhUTUwgOiBcIk5ldyBEaWFncmFtXCIpICsgXCI8L2ZpZ2NhcHRpb24+XCIgK1xuXHRcdFx0XHRcdFwiPC9maWd1cmU+XCIpO1xuXHRcdH0sXG5cdFxuXHRcdHByb2Nlc3M6IGZ1bmN0aW9uKG5vZGUpIHtcdFx0XG5cdFx0XHRzd2l0Y2gobm9kZS5ub2RlVHlwZSkge1x0XHRcblx0XHRcdGNhc2UgMTogLy8gRUxFTUVOVF9OT0RFXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhciBwID0gSlNPTi5wYXJzZShub2RlLmdldEF0dHJpYnV0ZShcImRhdGEtZGdmXCIpKTtcblx0XHRcdFx0XHR9IGNhdGNoKGVycm9yKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBcImNhbid0IHBhcnNlIGRhdGEtZGdmOiBcIiArIGVycm9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdFx0cCA9IHRoaXMuZGVjb21wcmVzcyhwKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHQvLyBXcml0ZSB0aGUgc3R5bGVzaGVldFxuXHRcdFx0XHRcdGlmKHAuc3R5bGUpIHtcblx0XHRcdFx0XHRcdGQzLnNlbGVjdChub2RlKS5jYWxsKHRoaXMuY3JlYXRlKG51bGwsIHAuc3R5bGUpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcblx0XHRcdFx0XHR2YXIgdGVtcGxhdGUgPSB0aGlzLmNyZWF0ZShudWxsLCBwLnRlbXBsYXRlKSxcblx0XHRcdFx0XHRcdHJlYWRlciA9IHRoaXMuY3JlYXRlKG51bGwsIHAucmVhZGVyLCBbdGVtcGxhdGVdKSxcblx0XHRcdFx0XHRcdHNjaGVkdWxlciA9IHRoaXMuY3JlYXRlKG51bGwsIHAuc2NoZWR1bGVyLCBbcmVhZGVyXSk7XG5cdFx0XHRcblx0XHRcdFx0XHQvLyBjYWxsIHJlYWRlciBvciBzY2hlZHVsZXIgaWYgcHJlc2VudC5cblx0XHRcdFx0XHRkMy5zZWxlY3Qobm9kZSkuY2FsbChzY2hlZHVsZXIgfHwgcmVhZGVyKTtcblx0XHRcdFx0fSBjYXRjaChlcnJvcikge1xuXHRcdFx0XHRcdGQzLnNlbGVjdChub2RlKVxuXHRcdFx0XHRcdFx0LmFwcGVuZChcImZpZ2NhcHRpb25cIilcblx0XHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJtZXNzYWdlIGVycm9yXCIpXG5cdFx0XHRcdFx0XHQuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdFx0XHQudGV4dChcIkNhbid0IHByb2Nlc3MgZGlhZ3JhbSAoXCIgKyBlcnJvciArIFwiKVwiKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XG5cdFx0XHRjYXNlIDk6ICAvLyBET0NVTUVOVF9OT0RFXG5cdFx0XHRjYXNlIDExOiAvLyBET0NVTUVOVF9GUkFHTUVOVF9OT0RFXG5cdFx0XHRcdHZhciBub2RlcyA9IG5vZGUucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWRnZl1cIik7XG5cdFx0XHRcdGlmKG5vZGVzKSB7XHRcdFx0XHRcdFxuXHRcdFx0XHRcdGZvcih2YXIgaSBpbiBub2Rlcykge1xuXHRcdFx0XHRcdFx0dGhpcy5wcm9jZXNzKG5vZGVzW2ldKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFxuXHRcdFx0ZGVmYXVsdDogXG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFxuXHRcdHR5cGVzQnlDYXRlZ29yeTogZnVuY3Rpb24oY2F0ZWdvcnkpIHtcblx0XHRcdHZhciByZXN1bHQgPSBbXTtcblx0XHRcblx0XHRcdGNhdGVnb3J5ID0gQXJyYXkuaXNBcnJheShjYXRlZ29yeSkgPyBjYXRlZ29yeSA6IGNhdGVnb3J5LnNwbGl0KFwiLFwiKTtcblx0XHRcblx0XHRcdHJlZzogZm9yKHZhciBrZXkgaW4gX3JlZ2lzdHJ5KSB7XG5cdFx0XHRcdHZhciBvID0gX3JlZ2lzdHJ5W2tleV07XG5cdFx0XHRcblx0XHRcdFx0aWYoby5jYXRlZ29yeSkge1xuXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBjYXRlZ29yeS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0aWYoby5jYXRlZ29yeVtpXSAhPSBjYXRlZ29yeVtpXSkge1xuXHRcdFx0XHRcdFx0XHRjb250aW51ZSByZWc7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG8ua2V5ID0ga2V5O1xuXHRcdFx0XHRcdHJlc3VsdC5wdXNoKG8pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblx0fTtcblx0XG5cdHJldHVybiBpbnN0YW5jZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQobykge1xuXHRyZXR1cm4gdGFnRmFjdG9yeSgpLmluaXQobyk7XG59IiwiaW1wb3J0ICogYXMgZDMgZnJvbSBcImQzXCI7XG5cbmV4cG9ydCBjb25zdCBzZXR1cEQzID0ge1xuXHRcImQzLmFzY2VuZGluZ1wiOiB7XG5cdFx0dGl0bGU6IFwiYXNjZW5kaW5nXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiQXNjZW5kaW5nIHNvcnRcIixcblx0XHRjYXRlZ29yeTogW1wic29ydFwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmFzY2VuZGluZztcdFx0XG5cdFx0fVxuXHR9LFxuXHRcblx0XCJkMy5kZXNjZW5kaW5nXCI6IHtcblx0XHR0aXRsZTogXCJkZXNjZW5kaW5nXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiRGVjZW5kaW5nIHNvcnRcIixcblx0XHRjYXRlZ29yeTogW1wic29ydFwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmRlc2NlbmRpbmc7XHRcdFxuXHRcdH1cblx0fSxcblxuXHRcImQzLnNjYWxlT3JkaW5hbFwiOiB7XG5cdFx0dGl0bGU6IFwiT3JkaW5hbCBTY2FsZVwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIk9yZGluYWwgU2NhbGVcIixcblx0XHRjYXRlZ29yeTogW1wic2NhbGVcIiwgXCJvcmRpbmFsXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24odGFnRmFjdG9yeSwgbmFtZSwgdmFsdWUsIGNhbGxlZXMpIHtcblx0XHRcdHJldHVybiB0YWdGYWN0b3J5LmNyZWF0ZVNjYWxlKG5hbWUsIHZhbHVlLCBjYWxsZWVzLCBkMy5zY2FsZU9yZGluYWwoKSk7XHRcdFxuXHRcdH1cblx0fSxcblxuXHRcImQzLnNjYWxlQmFuZFwiOiB7XG5cdFx0dGl0bGU6IFwiQmFuZCBTY2FsZVwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkJhbmQgU2NhbGVcIixcblx0XHRjYXRlZ29yeTogW1wic2NhbGVcIiwgXCJvcmRpbmFsXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24odGFnRmFjdG9yeSwgbmFtZSwgdmFsdWUsIGNhbGxlZXMpIHtcblx0XHRcdHJldHVybiB0YWdGYWN0b3J5LmNyZWF0ZVNjYWxlKG5hbWUsIHZhbHVlLCBjYWxsZWVzLCBkMy5zY2FsZUJhbmQoKSk7XHRcdFxuXHRcdH1cblx0fSxcblxuXHRcImQzLnNjYWxlUG9pbnRcIjoge1xuXHRcdHRpdGxlOiBcIlBvaW50IFNjYWxlXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiUG9pbnQgU2NhbGVcIixcblx0XHRjYXRlZ29yeTogW1wic2NhbGVcIiwgXCJvcmRpbmFsXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24odGFnRmFjdG9yeSwgbmFtZSwgdmFsdWUsIGNhbGxlZXMpIHsgXG5cdFx0XHRyZXR1cm4gdGFnRmFjdG9yeS5jcmVhdGVTY2FsZShuYW1lLCB2YWx1ZSwgY2FsbGVlcywgZDMuc2NhbGVQb2ludCgpKTtcblx0XHR9XG5cdH0sXG5cblx0XCJkMy5zY2FsZUxpbmVhclwiOiB7XG5cdFx0dGl0bGU6IFwiTGluZWFyIFNjYWxlXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiTGluZWFyIFNjYWxlXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcInNjYWxlXCIsIFwiY29udGludW91c1wiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKHRhZ0ZhY3RvcnksIG5hbWUsIHZhbHVlLCBjYWxsZWVzKSB7XG5cdFx0XHRyZXR1cm4gdGFnRmFjdG9yeS5jcmVhdGVTY2FsZShuYW1lLCB2YWx1ZSwgY2FsbGVlcywgZDMuc2NhbGVMaW5lYXIoKSk7XG5cdFx0fVxuXHR9LFxuXG5cdFwiZDMuc2NhbGVTcXJ0XCI6IHtcblx0XHR0aXRsZTogXCJTcXVhcmUgUm9vdCBTY2FsZVwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlNxdWFyZSBSb290IFNjYWxlXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcInNjYWxlXCIsIFwiY29udGludW91c1wiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKHRhZ0ZhY3RvcnksIG5hbWUsIHZhbHVlLCBjYWxsZWVzKSB7XG5cdFx0XHRyZXR1cm4gdGFnRmFjdG9yeS5jcmVhdGVTY2FsZShuYW1lLCB2YWx1ZSwgY2FsbGVlcywgZDMuc2NhbGVTcXJ0KCkpO1xuXHRcdH1cblx0fSxcblxuXHRcImQzLnNjYWxlSWRlbnRpdHlcIjoge1xuXHRcdHRpdGxlOiBcIklkZW50aXR5IFNjYWxlXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiSWRlbnRpdHkgU2NhbGVcIixcblx0XHRjYXRlZ29yeTogW1wic2NhbGVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHsgXG5cdFx0XHRyZXR1cm4gZDMuc2NhbGVJZGVudGl0eSgpO1xuXHRcdH1cblx0fSxcblxuXHRcImQzLnNjYWxlVGhyZXNob2xkXCI6IHtcblx0XHR0aXRsZTogXCJUaHJlc2hvbGQgU2NhbGVcIixcblx0XHRkZXNjcmlwdGlvbjogXCJUaHJlc2hvbGQgU2NhbGVcIixcblx0XHRjYXRlZ29yeTogW1wic2NhbGVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbih0YWdGYWN0b3J5LCBuYW1lLCB2YWx1ZSwgY2FsbGVlcykge1xuXHRcdFx0cmV0dXJuIHRhZ0ZhY3RvcnkuY3JlYXRlU2NhbGUobmFtZSwgdmFsdWUsIGNhbGxlZXMsIGQzLnNjYWxlVGhyZXNob2xkKCkpO1xuXHRcdH1cblx0fSxcblxuXHRcImQzLnNjYWxlU2VxdWVudGlhbFwiOiB7XG5cdFx0dGl0bGU6IFwiU2VxdWVudGlhbCBTY2FsZVwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlNlcXVlbnRpYWwgU2NhbGVcIixcblx0XHRjYXRlZ29yeTogW1wic2NhbGVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbih0YWdGYWN0b3J5LCBuYW1lLCB2YWx1ZSkge1xuXHRcdFx0dmFyIHJhbmdlID0gdGFnRmFjdG9yeS5jcmVhdGVFeHByZXNzaW9uKHZhbHVlLnJhbmdlKSB8fCB0YWdGYWN0b3J5Lmxvb2t1cCh2YWx1ZS5yYW5nZSkuY3JlYXRlKCksXG5cdFx0XHRcdHMgPSBkMy5zY2FsZVNlcXVlbnRpYWwocmFuZ2UpO1xuXHRcdFx0c1tcIl9kb21haW5cIl0gPSB0YWdGYWN0b3J5LmNyZWF0ZUV4cHJlc3Npb24odmFsdWUuZG9tYWluKTtcblx0XHRcdHJldHVybiBzO1x0XHRcdFx0XG5cdFx0fVxuXHR9LFxuXG5cdFwiZDMuc2NhbGVUaW1lXCI6IHtcblx0XHR0aXRsZTogXCJUaW1lIFNjYWxlXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiVGltZSBTY2FsZVwiLFxuXHRcdGNhdGVnb3J5OiBbXCJzY2FsZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKHRhZ0ZhY3RvcnksIG5hbWUsIHZhbHVlLCBjYWxsZWVzKSB7IFxuXHRcdFx0cmV0dXJuIHRhZ0ZhY3RvcnkuY3JlYXRlU2NhbGUobmFtZSwgdmFsdWUsIGNhbGxlZXMsIGQzLnNjYWxlVGltZSgpKTtcblx0XHR9XG5cdH0sXG5cblx0Ly8gVHJhbnNpdGlvbnNcblxuXHRcImQzLnRyYW5zaXRpb25cIjoge1xuXHRcdHRpdGxlOiBcIlRyYW5zaXRpb25cIixcblx0XHRkZXNjcmlwdGlvbjogXCJUcmFuc2l0aW9uXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcInRyYW5zaXRpb25cIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHsgXG5cdFx0XHRyZXR1cm4gZDMudHJhbnNpdGlvbigpO1xuXHRcdH1cblx0fSxcblxuXHRcImQzLmVhc2VMaW5lYXJcIjoge1xuXHRcdHRpdGxlOiBcIkxpbmVhclwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkxpbmVhciBFYXNpbmdcIixcblx0XHRjYXRlZ29yeTogW1wiZWFzZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmVhc2VMaW5lYXI7XG5cdFx0fVxuXHR9LFxuXG5cdFwiZDMuZWFzZVBvbHlcIjoge1xuXHRcdHRpdGxlOiBcIlBvbHlub21pYWxcIixcblx0XHRkZXNjcmlwdGlvbjogXCJQb2x5bm9taWFsIEluT3V0IEVhc2luZ1wiLFxuXHRcdGNhdGVnb3J5OiBbXCJlYXNlXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuZWFzZVBvbHk7XG5cdFx0fVxuXHR9LFxuXG5cdFwiZDMuZWFzZVF1YWRcIjoge1xuXHRcdHRpdGxlOiBcIlF1YWRyYXRpY1wiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlF1YWRyYXRpYyBJbk91dCBFYXNpbmdcIixcblx0XHRjYXRlZ29yeTogW1wiZWFzZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmVhc2VRdWFkO1xuXHRcdH1cblx0fSxcblxuXHRcImQzLmVhc2VDdWJpY1wiOiB7XG5cdFx0dGl0bGU6IFwiQ3ViaWNcIixcblx0XHRkZXNjcmlwdGlvbjogXCJDdWJpYyBJbk91dCBFYXNpbmdcIixcblx0XHRjYXRlZ29yeTogW1wiZWFzZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmVhc2VDdWJpYztcblx0XHR9XG5cdH0sXG5cblx0XCJkMy5lYXNlU2luXCI6IHtcblx0XHR0aXRsZTogXCJTaW51c29pZGFsXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiU2ludXNvaWRhbCBJbk91dCBFYXNpbmdcIixcblx0XHRjYXRlZ29yeTogW1wiZWFzZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmVhc2VTaW47XG5cdFx0fVxuXHR9LFxuXG5cdFwiZDMuZWFzZUV4cFwiOiB7XG5cdFx0dGl0bGU6IFwiRXhwb25lbnRpYWxcIixcblx0XHRkZXNjcmlwdGlvbjogXCJFeHBvbmVudGlhbCBJbk91dCBFYXNpbmdcIixcblx0XHRjYXRlZ29yeTogW1wiZWFzZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmVhc2VFeHA7XG5cdFx0fVxuXHR9LFxuXG5cdFwiZDMuZWFzZUNpcmNsZVwiOiB7XG5cdFx0dGl0bGU6IFwiQ2lyY2xlXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiQ2lyY3VsYXIgSW5PdXQgRWFzaW5nXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImVhc2VcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5lYXNlQ2lyY2xlO1xuXHRcdH1cblx0fSxcblxuXHRcImQzLmVhc2VFbGFzdGljXCI6IHtcblx0XHR0aXRsZTogXCJFbGFzdGljXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiRWxhc3RpYyBPdXQgRWFzaW5nXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImVhc2VcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5lYXNlRWxhc3RpYztcblx0XHR9XG5cdH0sXG5cblx0XCJkMy5lYXNlQmFja1wiOiB7XG5cdFx0dGl0bGU6IFwiQmFja1wiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlN5bW1ldHJpYyBhbnRpY2lwYXRvcnkgSW5PdXQgRWFzaW5nXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImVhc2VcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5lYXNlQmFjaztcblx0XHR9XG5cdH0sXG5cblx0XCJkMy5lYXNlQm91bmNlXCI6IHtcblx0XHR0aXRsZTogXCJCb3VuY2VcIixcblx0XHRkZXNjcmlwdGlvbjogXCJCb3VuY2UgT3V0IEVhc2luZ1wiLFxuXHRcdGNhdGVnb3J5OiBbXCJlYXNlXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuZWFzZUJvdW5jZTtcblx0XHR9XG5cdH0sXG5cblx0Ly8gTGluZXNcblxuXHRcImQzLmxpbmVcIjoge1xuXHRcdHRpdGxlOiBcIkxpbmVcIixcblx0XHRkZXNjcmlwdGlvbjogXCJDb25zdHJ1Y3RzIGEgbmV3IGxpbmUgZ2VuZXJhdG9yIHdpdGggdGhlIGRlZmF1bHQgc2V0dGluZ3NcIixcblx0XHRjYXRlZ29yeTogW1wibGluZSBnZW5lcmF0b3JcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbih0YWdGYWN0b3J5LCBuYW1lLCB2YWx1ZSwgY2FsbGVlcykge1xuXHRcdFx0cmV0dXJuIHRhZ0ZhY3RvcnkuY3JlYXRlVGVtcGxhdGUobmFtZSwgdmFsdWUsIGNhbGxlZXMsIGQzLmxpbmUoKSk7XG5cdFx0fVxuXHR9LFxuXG5cdFwiZDMucmFkaWFsTGluZVwiOiB7XG5cdFx0dGl0bGU6IFwiUmFkaWFsIExpbmVcIixcblx0XHRkZXNjcmlwdGlvbjogXCJDb25zdHJ1Y3RzIGEgbmV3IHJhZGlhbCBsaW5lIGdlbmVyYXRvciB3aXRoIHRoZSBkZWZhdWx0IHNldHRpbmdzLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJsaW5lIGdlbmVyYXRvclwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLnJhZGlhbExpbmUoKTtcblx0XHR9XG5cdH0sXG5cblx0XCJkMy5hcmVhXCI6IHtcblx0XHR0aXRsZTogXCJBcmVhXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiQ29uc3RydWN0cyBhIG5ldyBhcmVhIGdlbmVyYXRvciB3aXRoIHRoZSBkZWZhdWx0IHNldHRpbmdzLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJsaW5lIGdlbmVyYXRvclwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmFyZWEoKTtcblx0XHR9XG5cdH0sXG5cblx0XCJkMy5jdXJ2ZUJhc2lzXCI6IHtcblx0XHR0aXRsZTogXCJCYXNpc1wiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlByb2R1Y2VzIGEgY3ViaWMgYmFzaXMgc3BsaW5lIHVzaW5nIHRoZSBzcGVjaWZpZWQgY29udHJvbCBwb2ludHMuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImN1cnZlXCIsIFwiYmFzaXNcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5jdXJ2ZUJhc2lzO1xuXHRcdH1cblx0fSxcblxuXHRcImQzLmN1cnZlQmFzaXNDbG9zZWRcIjoge1xuXHRcdHRpdGxlOiBcIkJhc2lzIENsb3NlZFwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlByb2R1Y2VzIGEgY2xvc2VkIGN1YmljIGJhc2lzIHNwbGluZSB1c2luZyB0aGUgc3BlY2lmaWVkIGNvbnRyb2wgcG9pbnRzLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJjdXJ2ZVwiLCBcImJhc2lzXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuY3VydmVCYXNpc0Nsb3NlZDtcblx0XHR9XG5cdH0sXG5cblx0XCJkMy5jdXJ2ZUJhc2lzT3BlblwiOiB7XG5cdFx0dGl0bGU6IFwiQmFzaXMgT3BlblwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlByb2R1Y2VzIGEgb3BlbiBjdWJpYyBiYXNpcyBzcGxpbmUgdXNpbmcgdGhlIHNwZWNpZmllZCBjb250cm9sIHBvaW50cy5cIixcblx0XHRjYXRlZ29yeTogW1wiY3VydmVcIiwgXCJiYXNpc1wiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmN1cnZlQmFzaXNPcGVuO1xuXHRcdH1cblx0fSxcblxuXHRcImQzLmN1cnZlQnVuZGxlXCI6IHtcblx0XHR0aXRsZTogXCJCdW5kbGVcIixcblx0XHRkZXNjcmlwdGlvbjogXCJQcm9kdWNlcyBhIHN0cmFpZ2h0ZW5lZCBjdWJpYyBiYXNpcyBzcGxpbmUgdXNpbmcgdGhlIHNwZWNpZmllZCBjb250cm9sIHBvaW50cywgd2l0aCB0aGUgc3BsaW5lIHN0cmFpZ2h0ZW5lZCBhY2NvcmRpbmcgdG8gdGhlIGN1cnZl4oCZcyBiZXRhLCB3aGljaCBkZWZhdWx0cyB0byAwLjg1LlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJjdXJ2ZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gZDMuY3VydmVCdW5kbGUuYmV0YSh2YWx1ZS5iZXRhIHx8IDAuODUpO1xuXHRcdH1cblx0fSxcblxuXHRcImQzLmN1cnZlQ2FyZGluYWxcIjoge1xuXHRcdHRpdGxlOiBcIkNhcmRpbmFsXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiUHJvZHVjZXMgYSBjdWJpYyBjYXJkaW5hbCBzcGxpbmUgdXNpbmcgdGhlIHNwZWNpZmllZCBjb250cm9sIHBvaW50cywgd2l0aCBvbmUtc2lkZWQgZGlmZmVyZW5jZXMgdXNlZCBmb3IgdGhlIGZpcnN0IGFuZCBsYXN0IHBpZWNlLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJjdXJ2ZVwiLCBcImNhcmRpbmFsXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuY3VydmVDYXJkaW5hbDtcblx0XHR9XG5cdH0sXG5cblx0XCJkMy5jdXJ2ZUNhcmRpbmFsQ2xvc2VkXCI6IHtcblx0XHR0aXRsZTogXCJDYXJkaW5hbCBDbG9zZWRcIixcblx0XHRkZXNjcmlwdGlvbjogXCJQcm9kdWNlcyBhIGNsb3NlZCBjdWJpYyBjYXJkaW5hbCBzcGxpbmUgdXNpbmcgdGhlIHNwZWNpZmllZCBjb250cm9sIHBvaW50cy5cIixcblx0XHRjYXRlZ29yeTogW1wiY3VydmVcIiwgXCJjYXJkaW5hbFwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gZDMuY3VydmVDYXJkaW5hbENsb3NlZC50ZW5zaW9uKHZhbHVlLnRlbnNpb24gfHwgMCk7XG5cdFx0fVxuXHR9LFxuXG5cdFwiZDMuY3VydmVDYXJkaW5hbE9wZW5cIjoge1xuXHRcdHRpdGxlOiBcIkNhcmRpbmFsIE9wZW5cIixcblx0XHRkZXNjcmlwdGlvbjogXCJQcm9kdWNlcyBhIGN1YmljIGNhcmRpbmFsIHNwbGluZSB1c2luZyB0aGUgc3BlY2lmaWVkIGNvbnRyb2wgcG9pbnRzLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJjdXJ2ZVwiLCBcImNhcmRpbmFsXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcblx0XHRcdHJldHVybiBkMy5jdXJ2ZUNhcmRpbmFsT3Blbi50ZW5zaW9uKHZhbHVlLnRlbnNpb24gfHwgMCk7XG5cdFx0fVxuXHR9LFxuXG5cdFwiZDMuY3VydmVDYXRtdWxsUm9tXCI6IHtcblx0XHR0aXRsZTogXCJDYXRtdWxsLVJvbVwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlByb2R1Y2VzIGEgY3ViaWMgQ2F0bXVsbOKAk1JvbSBzcGxpbmUgdXNpbmcgdGhlIHNwZWNpZmllZCBjb250cm9sIHBvaW50cyBhbmQgdGhlIHBhcmFtZXRlciBhbHBoYS5cIixcblx0XHRjYXRlZ29yeTogW1wiY3VydmVcIiwgXCJDYXRtdWxsLVJvbVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gZDMuY3VydmVDYXRtdWxsUm9tLmFscGhhKHZhbHVlLmFscGhhIHx8IDAuNSk7XG5cdFx0fVxuXHR9LFxuXG5cdFwiZDMuY3VydmVDYXRtdWxsUm9tQ2xvc2VkXCI6IHtcblx0XHR0aXRsZTogXCJDYXRtdWxsLVJvbSBDbG9zZWRcIixcblx0XHRkZXNjcmlwdGlvbjogXCJQcm9kdWNlcyBhIGNsb3NlZCBjdWJpYyBDYXRtdWxs4oCTUm9tIHNwbGluZSB1c2luZyB0aGUgc3BlY2lmaWVkIGNvbnRyb2wgcG9pbnRzIGFuZCB0aGUgcGFyYW1ldGVyIGFscGhhLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJjdXJ2ZVwiLCBcIkNhdG11bGwtUm9tXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcblx0XHRcdHJldHVybiBkMy5jdXJ2ZUNhdG11bGxSb21DbG9zZWQuYWxwaGEodmFsdWUuYWxwaGEgfHwgMC41KTtcblx0XHR9XG5cdH0sXG5cblx0XCJkMy5jdXJ2ZUNhdG11bGxSb21PcGVuXCI6IHtcblx0XHR0aXRsZTogXCJDYXRtdWxsLVJvbSBPcGVuXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiUHJvZHVjZXMgYSBjdWJpYyBDYXRtdWxs4oCTUm9tIHNwbGluZSB1c2luZyB0aGUgc3BlY2lmaWVkIGNvbnRyb2wgcG9pbnRzIGFuZCB0aGUgcGFyYW1ldGVyIGFscGhhLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJjdXJ2ZVwiLCBcIkNhdG11bGwtUm9tXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcblx0XHRcdHJldHVybiBkMy5jdXJ2ZUNhdG11bGxSb21PcGVuLmFscGhhKHZhbHVlLmFscGhhIHx8IDAuNSk7XG5cdFx0fVxuXHR9LFxuXG5cdFwiZDMuY3VydmVMaW5lYXJcIjoge1xuXHRcdHRpdGxlOiBcIkxpbmVhclwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlByb2R1Y2VzIGEgcG9seWxpbmUgdGhyb3VnaCB0aGUgc3BlY2lmaWVkIHBvaW50cy5cIixcblx0XHRjYXRlZ29yeTogW1wiY3VydmVcIiwgXCJsaW5lYXJcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5jdXJ2ZUxpbmVhcjtcblx0XHR9XG5cdH0sXG5cblx0XCJkMy5jdXJ2ZUxpbmVhckNsb3NlZFwiOiB7XG5cdFx0dGl0bGU6IFwiTGluZWFyIENsb3NlZFwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlByb2R1Y2VzIGEgY2xvc2VkIHBvbHlsaW5lIHRocm91Z2ggdGhlIHNwZWNpZmllZCBwb2ludHMgYnkgcmVwZWF0aW5nIHRoZSBmaXJzdCBwb2ludCB3aGVuIHRoZSBsaW5lIHNlZ21lbnQgZW5kcy5cIixcblx0XHRjYXRlZ29yeTogW1wiY3VydmVcIiwgXCJsaW5lYXJcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5jdXJ2ZUxpbmVhckNsb3NlZDtcblx0XHR9XG5cdH0sXG5cblx0XCJkMy5jdXJ2ZU1vbm90b25lWFwiOiB7XG5cdFx0dGl0bGU6IFwiTW9ub3RvbmUgWFwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlByb2R1Y2VzIGEgY3ViaWMgc3BsaW5lIHRoYXQgcHJlc2VydmVzIG1vbm90b25pY2l0eSBpbiB5LCBhc3N1bWluZyBtb25vdG9uaWNpdHkgaW4geC5cIixcblx0XHRjYXRlZ29yeTogW1wiY3VydmVcIiwgXCJtb25vdG9uZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmN1cnZlTW9ub3RvbmVYO1xuXHRcdH1cblx0fSxcblxuXHRcImQzLmN1cnZlTW9ub3RvbmVZXCI6IHtcblx0XHR0aXRsZTogXCJNb25vdG9uZSBZXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiUHJvZHVjZXMgYSBjdWJpYyBzcGxpbmUgdGhhdCBwcmVzZXJ2ZXMgbW9ub3RvbmljaXR5IGluIHgsIGFzc3VtaW5nIG1vbm90b25pY2l0eSBpbiB5LlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJjdXJ2ZVwiLCBcIm1vbm90b25lXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuY3VydmVNb25vdG9uZVk7XG5cdFx0fVxuXHR9LFxuXG5cdFwiZDMuY3VydmVOYXR1cmFsXCI6IHtcblx0XHR0aXRsZTogXCJOYXR1cmFsXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiUHJvZHVjZXMgYSBuYXR1cmFsIGN1YmljIHNwbGluZSB3aXRoIHRoZSBzZWNvbmQgZGVyaXZhdGl2ZSBvZiB0aGUgc3BsaW5lIHNldCB0byB6ZXJvIGF0IHRoZSBlbmRwb2ludHMuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImN1cnZlXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuY3VydmVOYXR1cmFsO1xuXHRcdH1cblx0fSxcblxuXHRcImQzLmN1cnZlU3RlcFwiOiB7XG5cdFx0dGl0bGU6IFwiU3RlcFwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlByb2R1Y2VzIGEgcGllY2V3aXNlIGNvbnN0YW50IGZ1bmN0aW9uIChhIHN0ZXAgZnVuY3Rpb24pIGNvbnNpc3Rpbmcgb2YgYWx0ZXJuYXRpbmcgaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgbGluZXMuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImN1cnZlXCIsIFwic3RlcFwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmN1cnZlU3RlcDtcblx0XHR9XG5cdH0sXG5cblx0XCJkMy5jdXJ2ZVN0ZXBBZnRlclwiOiB7XG5cdFx0dGl0bGU6IFwiU3RlcCBBZnRlclwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlByb2R1Y2VzIGEgcGllY2V3aXNlIGNvbnN0YW50IGZ1bmN0aW9uIChhIHN0ZXAgZnVuY3Rpb24pIGNvbnNpc3Rpbmcgb2YgYWx0ZXJuYXRpbmcgaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgbGluZXMuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImN1cnZlXCIsIFwic3RlcFwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmN1cnZlU3RlcEFmdGVyO1xuXHRcdH1cblx0fSxcblxuXHRcImQzLmN1cnZlU3RlcEJlZm9yZVwiOiB7XG5cdFx0dGl0bGU6IFwiU3RlcCBCZWZvcmVcIixcblx0XHRkZXNjcmlwdGlvbjogXCJQcm9kdWNlcyBhIHBpZWNld2lzZSBjb25zdGFudCBmdW5jdGlvbiAoYSBzdGVwIGZ1bmN0aW9uKSBjb25zaXN0aW5nIG9mIGFsdGVybmF0aW5nIGhvcml6b250YWwgYW5kIHZlcnRpY2FsIGxpbmVzLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJjdXJ2ZVwiLCBcInN0ZXBcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5jdXJ2ZVN0ZXBCZWZvcmU7XG5cdFx0fVxuXHR9LFxuXHRcdFx0XHRcdFx0XG5cdC8vIFNjaGVtZXNcblxuXHRcImQzLnNjaGVtZUNhdGVnb3J5MTBcIjoge1xuXHRcdHRpdGxlOiBcIkNhdGVnb3J5IDEwXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiQW4gYXJyYXkgb2YgdGVuIGNhdGVnb3JpY2FsIGNvbG9ycyByZXByZXNlbnRlZCBhcyBSR0IgaGV4YWRlY2ltYWwgc3RyaW5ncy5cIixcblx0XHRjYXRlZ29yeTogW1wic2NoZW1lXCIsIFwiY2F0ZWdvcmljYWxcIl0sXHRcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLnNjaGVtZUNhdGVnb3J5MTA7XG5cdFx0fVxuXHR9LFxuXG5cdFwiZDMuc2NoZW1lQ2F0ZWdvcnkyMFwiOiB7XG5cdFx0dGl0bGU6IFwiQ2F0ZWdvcnkgMjBcIixcblx0XHRkZXNjcmlwdGlvbjogXCJBbiBhcnJheSBvZiB0d2VudHkgY2F0ZWdvcmljYWwgY29sb3JzIHJlcHJlc2VudGVkIGFzIFJHQiBoZXhhZGVjaW1hbCBzdHJpbmdzLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJzY2hlbWVcIiwgXCJjYXRlZ29yaWNhbFwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLnNjaGVtZUNhdGVnb3J5MjA7XG5cdFx0fVxuXHR9LFxuXG5cdFwiZDMuc2NoZW1lQ2F0ZWdvcnkyMGJcIjoge1xuXHRcdHRpdGxlOiBcIkNhdGVnb3J5IDIwYlwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkFuIGFycmF5IG9mIHR3ZW50eSBjYXRlZ29yaWNhbCBjb2xvcnMgcmVwcmVzZW50ZWQgYXMgUkdCIGhleGFkZWNpbWFsIHN0cmluZ3MuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcInNjaGVtZVwiLCBcImNhdGVnb3JpY2FsXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuc2NoZW1lQ2F0ZWdvcnkyMGI7XG5cdFx0fVxuXHR9LFxuXG5cdFwiZDMuc2NoZW1lQ2F0ZWdvcnkyMGNcIjoge1xuXHRcdHRpdGxlOiBcIkNhdGVnb3J5IDIwY1wiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkFuIGFycmF5IG9mIHR3ZW50eSBjYXRlZ29yaWNhbCBjb2xvcnMgcmVwcmVzZW50ZWQgYXMgUkdCIGhleGFkZWNpbWFsIHN0cmluZ3MuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcInNjaGVtZVwiLCBcImNhdGVnb3JpY2FsXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuc2NoZW1lQ2F0ZWdvcnkyMGM7XG5cdFx0fVxuXHR9LFxuXHRcdFxuXHRcImQzLmludGVycG9sYXRlVmlyaWRpc1wiOiB7XG5cdFx0dGl0bGU6IFwiVmlyaWRpc1wiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkdpdmVuIGEgbnVtYmVyIHQgaW4gdGhlIHJhbmdlIFswLDFdLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGNvbG9yIGZyb20gdGhlICd2aXJpZGlzJyBwZXJjZXB0dWFsbHktdW5pZm9ybSBjb2xvciBzY2hlbWUgZGVzaWduZWQgYnkgdmFuIGRlciBXYWx0LCBTbWl0aCBhbmQgRmlyaW5nIGZvciBtYXRwbG90bGliLCByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJpbnRlcnBvbGF0ZVwiLCBcInNlcXVlbnRpYWxcIiwgXCJwZXJjZXB0dWFsbHktdW5pZm9ybVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmludGVycG9sYXRlVmlyaWRpcztcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuaW50ZXJwb2xhdGVJbmZlcm5vXCI6IHtcblx0XHR0aXRsZTogXCJJbmZlcm5vXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR2l2ZW4gYSBudW1iZXIgdCBpbiB0aGUgcmFuZ2UgWzAsMV0sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgY29sb3IgZnJvbSB0aGUgJ2luZmVybm8nIHBlcmNlcHR1YWxseS11bmlmb3JtIGNvbG9yIHNjaGVtZSBkZXNpZ25lZCBieSB2YW4gZGVyIFdhbHQgYW5kIFNtaXRoIGZvciBtYXRwbG90bGliLCByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJpbnRlcnBvbGF0ZVwiLCBcInNlcXVlbnRpYWxcIiwgXCJwZXJjZXB0dWFsbHktdW5pZm9ybVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmludGVycG9sYXRlSW5mZXJubztcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuaW50ZXJwb2xhdGVNYWdtYVwiOiB7XG5cdFx0dGl0bGU6IFwiTWFnbWFcIixcblx0XHRkZXNjcmlwdGlvbjogXCJHaXZlbiBhIG51bWJlciB0IGluIHRoZSByYW5nZSBbMCwxXSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBjb2xvciBmcm9tIHRoZSAnbWFnbWEnIHBlcmNlcHR1YWxseS11bmlmb3JtIGNvbG9yIHNjaGVtZSBkZXNpZ25lZCBieSB2YW4gZGVyIFdhbHQgYW5kIFNtaXRoIGZvciBtYXRwbG90bGliLCByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJpbnRlcnBvbGF0ZVwiLCBcInNlcXVlbnRpYWxcIiwgXCJwZXJjZXB0dWFsbHktdW5pZm9ybVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmludGVycG9sYXRlTWFnbWE7XHRcblx0XHR9XG5cdH0sXG5cdFxuXHRcImQzLmludGVycG9sYXRlUGxhc21hXCI6IHtcblx0XHR0aXRsZTogXCJQbGFzbWFcIixcblx0XHRkZXNjcmlwdGlvbjogXCJHaXZlbiBhIG51bWJlciB0IGluIHRoZSByYW5nZSBbMCwxXSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBjb2xvciBmcm9tIHRoZSAncGxhc21hJyBwZXJjZXB0dWFsbHktdW5pZm9ybSBjb2xvciBzY2hlbWUgZGVzaWduZWQgYnkgdmFuIGRlciBXYWx0IGFuZCBTbWl0aCBmb3IgbWF0cGxvdGxpYiwgcmVwcmVzZW50ZWQgYXMgYW4gUkdCIHN0cmluZy5cIixcblx0XHRjYXRlZ29yeTogW1wiaW50ZXJwb2xhdGVcIiwgXCJzZXF1ZW50aWFsXCIsIFwicGVyY2VwdHVhbGx5LXVuaWZvcm1cIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5pbnRlcnBvbGF0ZVBsYXNtYTtcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuaW50ZXJwb2xhdGVXYXJtXCI6IHtcblx0XHR0aXRsZTogXCJXYXJtXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR2l2ZW4gYSBudW1iZXIgdCBpbiB0aGUgcmFuZ2UgWzAsMV0sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgY29sb3IgZnJvbSBhIDE4MCBkZWdyZWUgcm90YXRpb24gb2YgTmljY29saVxcJ3MgcGVyY2VwdHVhbCByYWluYm93LCByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJpbnRlcnBvbGF0ZVwiLCBcInNlcXVlbnRpYWxcIiwgXCJwZXJjZXB0dWFsbHktdW5pZm9ybVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmludGVycG9sYXRlV2FybTtcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuaW50ZXJwb2xhdGVDb29sXCI6IHtcblx0XHR0aXRsZTogXCJDb29sXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR2l2ZW4gYSBudW1iZXIgdCBpbiB0aGUgcmFuZ2UgWzAsMV0sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgY29sb3IgZnJvbSBOaWNjb2xpXFwncyBwZXJjZXB0dWFsIHJhaW5ib3csIHJlcHJlc2VudGVkIGFzIGFuIFJHQiBzdHJpbmcuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImludGVycG9sYXRlXCIsIFwic2VxdWVudGlhbFwiLCBcInBlcmNlcHR1YWxseS11bmlmb3JtXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuaW50ZXJwb2xhdGVDb29sO1x0XG5cdFx0fVxuXHR9LFxuXHRcblx0XCJkMy5pbnRlcnBvbGF0ZVJhaW5ib3dcIjoge1xuXHRcdHRpdGxlOiBcIlJhaW5ib3dcIixcblx0XHRkZXNjcmlwdGlvbjogXCJHaXZlbiBhIG51bWJlciB0IGluIHRoZSByYW5nZSBbMCwxXSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBjb2xvciBmcm9tIGQzLmludGVycG9sYXRlV2FybSBzY2FsZSBmcm9tIFswLjAsIDAuNV0gZm9sbG93ZWQgYnkgdGhlIGQzLmludGVycG9sYXRlQ29vbCBzY2FsZSBmcm9tIFswLjUsIDEuMF0sIHRodXMgaW1wbGVtZW50aW5nIHRoZSBjeWNsaWNhbCBsZXNzLWFuZ3J5IHJhaW5ib3cgY29sb3Igc2NoZW1lLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJpbnRlcnBvbGF0ZVwiLCBcInNlcXVlbnRpYWxcIiwgXCJwZXJjZXB0dWFsbHktdW5pZm9ybVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmludGVycG9sYXRlUmFpbmJvdztcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuaW50ZXJwb2xhdGVDdWJlaGVsaXhEZWZhdWx0XCI6IHtcblx0XHR0aXRsZTogXCJDdWJlaGVsaXggRGVmYXVsdFwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkdpdmVuIGEgbnVtYmVyIHQgaW4gdGhlIHJhbmdlIFswLDFdLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGNvbG9yIGZyb20gR3JlZW5cXCdzIGRlZmF1bHQgQ3ViZWhlbGl4IHJlcHJlc2VudGVkIGFzIGFuIFJHQiBzdHJpbmcuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImludGVycG9sYXRlXCIsIFwic2VxdWVudGlhbFwiLCBcInBlcmNlcHR1YWxseS11bmlmb3JtXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuaW50ZXJwb2xhdGVDdWJlaGVsaXhEZWZhdWx0O1x0XG5cdFx0fVxuXHR9XG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNwZWNpZmllcikge1xuICB2YXIgbiA9IHNwZWNpZmllci5sZW5ndGggLyA2IHwgMCwgY29sb3JzID0gbmV3IEFycmF5KG4pLCBpID0gMDtcbiAgd2hpbGUgKGkgPCBuKSBjb2xvcnNbaV0gPSBcIiNcIiArIHNwZWNpZmllci5zbGljZShpICogNiwgKytpICogNik7XG4gIHJldHVybiBjb2xvcnM7XG59XG4iLCJpbXBvcnQgY29sb3JzIGZyb20gXCIuLi9jb2xvcnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY29sb3JzKFwiN2ZjOTdmYmVhZWQ0ZmRjMDg2ZmZmZjk5Mzg2Y2IwZjAwMjdmYmY1YjE3NjY2NjY2XCIpO1xuIiwiaW1wb3J0IGNvbG9ycyBmcm9tIFwiLi4vY29sb3JzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbG9ycyhcIjFiOWU3N2Q5NWYwMjc1NzBiM2U3Mjk4YTY2YTYxZWU2YWIwMmE2NzYxZDY2NjY2NlwiKTtcbiIsImltcG9ydCBjb2xvcnMgZnJvbSBcIi4uL2NvbG9yc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjb2xvcnMoXCJhNmNlZTMxZjc4YjRiMmRmOGEzM2EwMmNmYjlhOTllMzFhMWNmZGJmNmZmZjdmMDBjYWIyZDY2YTNkOWFmZmZmOTliMTU5MjhcIik7XG4iLCJpbXBvcnQgY29sb3JzIGZyb20gXCIuLi9jb2xvcnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY29sb3JzKFwiZmJiNGFlYjNjZGUzY2NlYmM1ZGVjYmU0ZmVkOWE2ZmZmZmNjZTVkOGJkZmRkYWVjZjJmMmYyXCIpO1xuIiwiaW1wb3J0IGNvbG9ycyBmcm9tIFwiLi4vY29sb3JzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbG9ycyhcImIzZTJjZGZkY2RhY2NiZDVlOGY0Y2FlNGU2ZjVjOWZmZjJhZWYxZTJjY2NjY2NjY1wiKTtcbiIsImltcG9ydCBjb2xvcnMgZnJvbSBcIi4uL2NvbG9yc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjb2xvcnMoXCJlNDFhMWMzNzdlYjg0ZGFmNGE5ODRlYTNmZjdmMDBmZmZmMzNhNjU2MjhmNzgxYmY5OTk5OTlcIik7XG4iLCJpbXBvcnQgY29sb3JzIGZyb20gXCIuLi9jb2xvcnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY29sb3JzKFwiNjZjMmE1ZmM4ZDYyOGRhMGNiZTc4YWMzYTZkODU0ZmZkOTJmZTVjNDk0YjNiM2IzXCIpO1xuIiwiaW1wb3J0IGNvbG9ycyBmcm9tIFwiLi4vY29sb3JzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbG9ycyhcIjhkZDNjN2ZmZmZiM2JlYmFkYWZiODA3MjgwYjFkM2ZkYjQ2MmIzZGU2OWZjY2RlNWQ5ZDlkOWJjODBiZGNjZWJjNWZmZWQ2ZlwiKTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNvbnN0cnVjdG9yLCBmYWN0b3J5LCBwcm90b3R5cGUpIHtcbiAgY29uc3RydWN0b3IucHJvdG90eXBlID0gZmFjdG9yeS5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG4gIHByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKHBhcmVudCwgZGVmaW5pdGlvbikge1xuICB2YXIgcHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwYXJlbnQucHJvdG90eXBlKTtcbiAgZm9yICh2YXIga2V5IGluIGRlZmluaXRpb24pIHByb3RvdHlwZVtrZXldID0gZGVmaW5pdGlvbltrZXldO1xuICByZXR1cm4gcHJvdG90eXBlO1xufVxuIiwiaW1wb3J0IGRlZmluZSwge2V4dGVuZH0gZnJvbSBcIi4vZGVmaW5lXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBDb2xvcigpIHt9XG5cbmV4cG9ydCB2YXIgZGFya2VyID0gMC43O1xuZXhwb3J0IHZhciBicmlnaHRlciA9IDEgLyBkYXJrZXI7XG5cbnZhciByZUkgPSBcIlxcXFxzKihbKy1dP1xcXFxkKylcXFxccypcIixcbiAgICByZU4gPSBcIlxcXFxzKihbKy1dP1xcXFxkKlxcXFwuP1xcXFxkKyg/OltlRV1bKy1dP1xcXFxkKyk/KVxcXFxzKlwiLFxuICAgIHJlUCA9IFwiXFxcXHMqKFsrLV0/XFxcXGQqXFxcXC4/XFxcXGQrKD86W2VFXVsrLV0/XFxcXGQrKT8pJVxcXFxzKlwiLFxuICAgIHJlSGV4MyA9IC9eIyhbMC05YS1mXXszfSkkLyxcbiAgICByZUhleDYgPSAvXiMoWzAtOWEtZl17Nn0pJC8sXG4gICAgcmVSZ2JJbnRlZ2VyID0gbmV3IFJlZ0V4cChcIl5yZ2JcXFxcKFwiICsgW3JlSSwgcmVJLCByZUldICsgXCJcXFxcKSRcIiksXG4gICAgcmVSZ2JQZXJjZW50ID0gbmV3IFJlZ0V4cChcIl5yZ2JcXFxcKFwiICsgW3JlUCwgcmVQLCByZVBdICsgXCJcXFxcKSRcIiksXG4gICAgcmVSZ2JhSW50ZWdlciA9IG5ldyBSZWdFeHAoXCJecmdiYVxcXFwoXCIgKyBbcmVJLCByZUksIHJlSSwgcmVOXSArIFwiXFxcXCkkXCIpLFxuICAgIHJlUmdiYVBlcmNlbnQgPSBuZXcgUmVnRXhwKFwiXnJnYmFcXFxcKFwiICsgW3JlUCwgcmVQLCByZVAsIHJlTl0gKyBcIlxcXFwpJFwiKSxcbiAgICByZUhzbFBlcmNlbnQgPSBuZXcgUmVnRXhwKFwiXmhzbFxcXFwoXCIgKyBbcmVOLCByZVAsIHJlUF0gKyBcIlxcXFwpJFwiKSxcbiAgICByZUhzbGFQZXJjZW50ID0gbmV3IFJlZ0V4cChcIl5oc2xhXFxcXChcIiArIFtyZU4sIHJlUCwgcmVQLCByZU5dICsgXCJcXFxcKSRcIik7XG5cbnZhciBuYW1lZCA9IHtcbiAgYWxpY2VibHVlOiAweGYwZjhmZixcbiAgYW50aXF1ZXdoaXRlOiAweGZhZWJkNyxcbiAgYXF1YTogMHgwMGZmZmYsXG4gIGFxdWFtYXJpbmU6IDB4N2ZmZmQ0LFxuICBhenVyZTogMHhmMGZmZmYsXG4gIGJlaWdlOiAweGY1ZjVkYyxcbiAgYmlzcXVlOiAweGZmZTRjNCxcbiAgYmxhY2s6IDB4MDAwMDAwLFxuICBibGFuY2hlZGFsbW9uZDogMHhmZmViY2QsXG4gIGJsdWU6IDB4MDAwMGZmLFxuICBibHVldmlvbGV0OiAweDhhMmJlMixcbiAgYnJvd246IDB4YTUyYTJhLFxuICBidXJseXdvb2Q6IDB4ZGViODg3LFxuICBjYWRldGJsdWU6IDB4NWY5ZWEwLFxuICBjaGFydHJldXNlOiAweDdmZmYwMCxcbiAgY2hvY29sYXRlOiAweGQyNjkxZSxcbiAgY29yYWw6IDB4ZmY3ZjUwLFxuICBjb3JuZmxvd2VyYmx1ZTogMHg2NDk1ZWQsXG4gIGNvcm5zaWxrOiAweGZmZjhkYyxcbiAgY3JpbXNvbjogMHhkYzE0M2MsXG4gIGN5YW46IDB4MDBmZmZmLFxuICBkYXJrYmx1ZTogMHgwMDAwOGIsXG4gIGRhcmtjeWFuOiAweDAwOGI4YixcbiAgZGFya2dvbGRlbnJvZDogMHhiODg2MGIsXG4gIGRhcmtncmF5OiAweGE5YTlhOSxcbiAgZGFya2dyZWVuOiAweDAwNjQwMCxcbiAgZGFya2dyZXk6IDB4YTlhOWE5LFxuICBkYXJra2hha2k6IDB4YmRiNzZiLFxuICBkYXJrbWFnZW50YTogMHg4YjAwOGIsXG4gIGRhcmtvbGl2ZWdyZWVuOiAweDU1NmIyZixcbiAgZGFya29yYW5nZTogMHhmZjhjMDAsXG4gIGRhcmtvcmNoaWQ6IDB4OTkzMmNjLFxuICBkYXJrcmVkOiAweDhiMDAwMCxcbiAgZGFya3NhbG1vbjogMHhlOTk2N2EsXG4gIGRhcmtzZWFncmVlbjogMHg4ZmJjOGYsXG4gIGRhcmtzbGF0ZWJsdWU6IDB4NDgzZDhiLFxuICBkYXJrc2xhdGVncmF5OiAweDJmNGY0ZixcbiAgZGFya3NsYXRlZ3JleTogMHgyZjRmNGYsXG4gIGRhcmt0dXJxdW9pc2U6IDB4MDBjZWQxLFxuICBkYXJrdmlvbGV0OiAweDk0MDBkMyxcbiAgZGVlcHBpbms6IDB4ZmYxNDkzLFxuICBkZWVwc2t5Ymx1ZTogMHgwMGJmZmYsXG4gIGRpbWdyYXk6IDB4Njk2OTY5LFxuICBkaW1ncmV5OiAweDY5Njk2OSxcbiAgZG9kZ2VyYmx1ZTogMHgxZTkwZmYsXG4gIGZpcmVicmljazogMHhiMjIyMjIsXG4gIGZsb3JhbHdoaXRlOiAweGZmZmFmMCxcbiAgZm9yZXN0Z3JlZW46IDB4MjI4YjIyLFxuICBmdWNoc2lhOiAweGZmMDBmZixcbiAgZ2FpbnNib3JvOiAweGRjZGNkYyxcbiAgZ2hvc3R3aGl0ZTogMHhmOGY4ZmYsXG4gIGdvbGQ6IDB4ZmZkNzAwLFxuICBnb2xkZW5yb2Q6IDB4ZGFhNTIwLFxuICBncmF5OiAweDgwODA4MCxcbiAgZ3JlZW46IDB4MDA4MDAwLFxuICBncmVlbnllbGxvdzogMHhhZGZmMmYsXG4gIGdyZXk6IDB4ODA4MDgwLFxuICBob25leWRldzogMHhmMGZmZjAsXG4gIGhvdHBpbms6IDB4ZmY2OWI0LFxuICBpbmRpYW5yZWQ6IDB4Y2Q1YzVjLFxuICBpbmRpZ286IDB4NGIwMDgyLFxuICBpdm9yeTogMHhmZmZmZjAsXG4gIGtoYWtpOiAweGYwZTY4YyxcbiAgbGF2ZW5kZXI6IDB4ZTZlNmZhLFxuICBsYXZlbmRlcmJsdXNoOiAweGZmZjBmNSxcbiAgbGF3bmdyZWVuOiAweDdjZmMwMCxcbiAgbGVtb25jaGlmZm9uOiAweGZmZmFjZCxcbiAgbGlnaHRibHVlOiAweGFkZDhlNixcbiAgbGlnaHRjb3JhbDogMHhmMDgwODAsXG4gIGxpZ2h0Y3lhbjogMHhlMGZmZmYsXG4gIGxpZ2h0Z29sZGVucm9keWVsbG93OiAweGZhZmFkMixcbiAgbGlnaHRncmF5OiAweGQzZDNkMyxcbiAgbGlnaHRncmVlbjogMHg5MGVlOTAsXG4gIGxpZ2h0Z3JleTogMHhkM2QzZDMsXG4gIGxpZ2h0cGluazogMHhmZmI2YzEsXG4gIGxpZ2h0c2FsbW9uOiAweGZmYTA3YSxcbiAgbGlnaHRzZWFncmVlbjogMHgyMGIyYWEsXG4gIGxpZ2h0c2t5Ymx1ZTogMHg4N2NlZmEsXG4gIGxpZ2h0c2xhdGVncmF5OiAweDc3ODg5OSxcbiAgbGlnaHRzbGF0ZWdyZXk6IDB4Nzc4ODk5LFxuICBsaWdodHN0ZWVsYmx1ZTogMHhiMGM0ZGUsXG4gIGxpZ2h0eWVsbG93OiAweGZmZmZlMCxcbiAgbGltZTogMHgwMGZmMDAsXG4gIGxpbWVncmVlbjogMHgzMmNkMzIsXG4gIGxpbmVuOiAweGZhZjBlNixcbiAgbWFnZW50YTogMHhmZjAwZmYsXG4gIG1hcm9vbjogMHg4MDAwMDAsXG4gIG1lZGl1bWFxdWFtYXJpbmU6IDB4NjZjZGFhLFxuICBtZWRpdW1ibHVlOiAweDAwMDBjZCxcbiAgbWVkaXVtb3JjaGlkOiAweGJhNTVkMyxcbiAgbWVkaXVtcHVycGxlOiAweDkzNzBkYixcbiAgbWVkaXVtc2VhZ3JlZW46IDB4M2NiMzcxLFxuICBtZWRpdW1zbGF0ZWJsdWU6IDB4N2I2OGVlLFxuICBtZWRpdW1zcHJpbmdncmVlbjogMHgwMGZhOWEsXG4gIG1lZGl1bXR1cnF1b2lzZTogMHg0OGQxY2MsXG4gIG1lZGl1bXZpb2xldHJlZDogMHhjNzE1ODUsXG4gIG1pZG5pZ2h0Ymx1ZTogMHgxOTE5NzAsXG4gIG1pbnRjcmVhbTogMHhmNWZmZmEsXG4gIG1pc3R5cm9zZTogMHhmZmU0ZTEsXG4gIG1vY2Nhc2luOiAweGZmZTRiNSxcbiAgbmF2YWpvd2hpdGU6IDB4ZmZkZWFkLFxuICBuYXZ5OiAweDAwMDA4MCxcbiAgb2xkbGFjZTogMHhmZGY1ZTYsXG4gIG9saXZlOiAweDgwODAwMCxcbiAgb2xpdmVkcmFiOiAweDZiOGUyMyxcbiAgb3JhbmdlOiAweGZmYTUwMCxcbiAgb3JhbmdlcmVkOiAweGZmNDUwMCxcbiAgb3JjaGlkOiAweGRhNzBkNixcbiAgcGFsZWdvbGRlbnJvZDogMHhlZWU4YWEsXG4gIHBhbGVncmVlbjogMHg5OGZiOTgsXG4gIHBhbGV0dXJxdW9pc2U6IDB4YWZlZWVlLFxuICBwYWxldmlvbGV0cmVkOiAweGRiNzA5MyxcbiAgcGFwYXlhd2hpcDogMHhmZmVmZDUsXG4gIHBlYWNocHVmZjogMHhmZmRhYjksXG4gIHBlcnU6IDB4Y2Q4NTNmLFxuICBwaW5rOiAweGZmYzBjYixcbiAgcGx1bTogMHhkZGEwZGQsXG4gIHBvd2RlcmJsdWU6IDB4YjBlMGU2LFxuICBwdXJwbGU6IDB4ODAwMDgwLFxuICByZWJlY2NhcHVycGxlOiAweDY2MzM5OSxcbiAgcmVkOiAweGZmMDAwMCxcbiAgcm9zeWJyb3duOiAweGJjOGY4ZixcbiAgcm95YWxibHVlOiAweDQxNjllMSxcbiAgc2FkZGxlYnJvd246IDB4OGI0NTEzLFxuICBzYWxtb246IDB4ZmE4MDcyLFxuICBzYW5keWJyb3duOiAweGY0YTQ2MCxcbiAgc2VhZ3JlZW46IDB4MmU4YjU3LFxuICBzZWFzaGVsbDogMHhmZmY1ZWUsXG4gIHNpZW5uYTogMHhhMDUyMmQsXG4gIHNpbHZlcjogMHhjMGMwYzAsXG4gIHNreWJsdWU6IDB4ODdjZWViLFxuICBzbGF0ZWJsdWU6IDB4NmE1YWNkLFxuICBzbGF0ZWdyYXk6IDB4NzA4MDkwLFxuICBzbGF0ZWdyZXk6IDB4NzA4MDkwLFxuICBzbm93OiAweGZmZmFmYSxcbiAgc3ByaW5nZ3JlZW46IDB4MDBmZjdmLFxuICBzdGVlbGJsdWU6IDB4NDY4MmI0LFxuICB0YW46IDB4ZDJiNDhjLFxuICB0ZWFsOiAweDAwODA4MCxcbiAgdGhpc3RsZTogMHhkOGJmZDgsXG4gIHRvbWF0bzogMHhmZjYzNDcsXG4gIHR1cnF1b2lzZTogMHg0MGUwZDAsXG4gIHZpb2xldDogMHhlZTgyZWUsXG4gIHdoZWF0OiAweGY1ZGViMyxcbiAgd2hpdGU6IDB4ZmZmZmZmLFxuICB3aGl0ZXNtb2tlOiAweGY1ZjVmNSxcbiAgeWVsbG93OiAweGZmZmYwMCxcbiAgeWVsbG93Z3JlZW46IDB4OWFjZDMyXG59O1xuXG5kZWZpbmUoQ29sb3IsIGNvbG9yLCB7XG4gIGRpc3BsYXlhYmxlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yZ2IoKS5kaXNwbGF5YWJsZSgpO1xuICB9LFxuICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmdiKCkgKyBcIlwiO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29sb3IoZm9ybWF0KSB7XG4gIHZhciBtO1xuICBmb3JtYXQgPSAoZm9ybWF0ICsgXCJcIikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiAobSA9IHJlSGV4My5leGVjKGZvcm1hdCkpID8gKG0gPSBwYXJzZUludChtWzFdLCAxNiksIG5ldyBSZ2IoKG0gPj4gOCAmIDB4ZikgfCAobSA+PiA0ICYgMHgwZjApLCAobSA+PiA0ICYgMHhmKSB8IChtICYgMHhmMCksICgobSAmIDB4ZikgPDwgNCkgfCAobSAmIDB4ZiksIDEpKSAvLyAjZjAwXG4gICAgICA6IChtID0gcmVIZXg2LmV4ZWMoZm9ybWF0KSkgPyByZ2JuKHBhcnNlSW50KG1bMV0sIDE2KSkgLy8gI2ZmMDAwMFxuICAgICAgOiAobSA9IHJlUmdiSW50ZWdlci5leGVjKGZvcm1hdCkpID8gbmV3IFJnYihtWzFdLCBtWzJdLCBtWzNdLCAxKSAvLyByZ2IoMjU1LCAwLCAwKVxuICAgICAgOiAobSA9IHJlUmdiUGVyY2VudC5leGVjKGZvcm1hdCkpID8gbmV3IFJnYihtWzFdICogMjU1IC8gMTAwLCBtWzJdICogMjU1IC8gMTAwLCBtWzNdICogMjU1IC8gMTAwLCAxKSAvLyByZ2IoMTAwJSwgMCUsIDAlKVxuICAgICAgOiAobSA9IHJlUmdiYUludGVnZXIuZXhlYyhmb3JtYXQpKSA/IHJnYmEobVsxXSwgbVsyXSwgbVszXSwgbVs0XSkgLy8gcmdiYSgyNTUsIDAsIDAsIDEpXG4gICAgICA6IChtID0gcmVSZ2JhUGVyY2VudC5leGVjKGZvcm1hdCkpID8gcmdiYShtWzFdICogMjU1IC8gMTAwLCBtWzJdICogMjU1IC8gMTAwLCBtWzNdICogMjU1IC8gMTAwLCBtWzRdKSAvLyByZ2IoMTAwJSwgMCUsIDAlLCAxKVxuICAgICAgOiAobSA9IHJlSHNsUGVyY2VudC5leGVjKGZvcm1hdCkpID8gaHNsYShtWzFdLCBtWzJdIC8gMTAwLCBtWzNdIC8gMTAwLCAxKSAvLyBoc2woMTIwLCA1MCUsIDUwJSlcbiAgICAgIDogKG0gPSByZUhzbGFQZXJjZW50LmV4ZWMoZm9ybWF0KSkgPyBoc2xhKG1bMV0sIG1bMl0gLyAxMDAsIG1bM10gLyAxMDAsIG1bNF0pIC8vIGhzbGEoMTIwLCA1MCUsIDUwJSwgMSlcbiAgICAgIDogbmFtZWQuaGFzT3duUHJvcGVydHkoZm9ybWF0KSA/IHJnYm4obmFtZWRbZm9ybWF0XSlcbiAgICAgIDogZm9ybWF0ID09PSBcInRyYW5zcGFyZW50XCIgPyBuZXcgUmdiKE5hTiwgTmFOLCBOYU4sIDApXG4gICAgICA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIHJnYm4obikge1xuICByZXR1cm4gbmV3IFJnYihuID4+IDE2ICYgMHhmZiwgbiA+PiA4ICYgMHhmZiwgbiAmIDB4ZmYsIDEpO1xufVxuXG5mdW5jdGlvbiByZ2JhKHIsIGcsIGIsIGEpIHtcbiAgaWYgKGEgPD0gMCkgciA9IGcgPSBiID0gTmFOO1xuICByZXR1cm4gbmV3IFJnYihyLCBnLCBiLCBhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJnYkNvbnZlcnQobykge1xuICBpZiAoIShvIGluc3RhbmNlb2YgQ29sb3IpKSBvID0gY29sb3Iobyk7XG4gIGlmICghbykgcmV0dXJuIG5ldyBSZ2I7XG4gIG8gPSBvLnJnYigpO1xuICByZXR1cm4gbmV3IFJnYihvLnIsIG8uZywgby5iLCBvLm9wYWNpdHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmdiKHIsIGcsIGIsIG9wYWNpdHkpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgPyByZ2JDb252ZXJ0KHIpIDogbmV3IFJnYihyLCBnLCBiLCBvcGFjaXR5ID09IG51bGwgPyAxIDogb3BhY2l0eSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZ2IociwgZywgYiwgb3BhY2l0eSkge1xuICB0aGlzLnIgPSArcjtcbiAgdGhpcy5nID0gK2c7XG4gIHRoaXMuYiA9ICtiO1xuICB0aGlzLm9wYWNpdHkgPSArb3BhY2l0eTtcbn1cblxuZGVmaW5lKFJnYiwgcmdiLCBleHRlbmQoQ29sb3IsIHtcbiAgYnJpZ2h0ZXI6IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gYnJpZ2h0ZXIgOiBNYXRoLnBvdyhicmlnaHRlciwgayk7XG4gICAgcmV0dXJuIG5ldyBSZ2IodGhpcy5yICogaywgdGhpcy5nICogaywgdGhpcy5iICogaywgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgZGFya2VyOiBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGRhcmtlciA6IE1hdGgucG93KGRhcmtlciwgayk7XG4gICAgcmV0dXJuIG5ldyBSZ2IodGhpcy5yICogaywgdGhpcy5nICogaywgdGhpcy5iICogaywgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgcmdiOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgZGlzcGxheWFibGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoMCA8PSB0aGlzLnIgJiYgdGhpcy5yIDw9IDI1NSlcbiAgICAgICAgJiYgKDAgPD0gdGhpcy5nICYmIHRoaXMuZyA8PSAyNTUpXG4gICAgICAgICYmICgwIDw9IHRoaXMuYiAmJiB0aGlzLmIgPD0gMjU1KVxuICAgICAgICAmJiAoMCA8PSB0aGlzLm9wYWNpdHkgJiYgdGhpcy5vcGFjaXR5IDw9IDEpO1xuICB9LFxuICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGEgPSB0aGlzLm9wYWNpdHk7IGEgPSBpc05hTihhKSA/IDEgOiBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCBhKSk7XG4gICAgcmV0dXJuIChhID09PSAxID8gXCJyZ2IoXCIgOiBcInJnYmEoXCIpXG4gICAgICAgICsgTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCBNYXRoLnJvdW5kKHRoaXMucikgfHwgMCkpICsgXCIsIFwiXG4gICAgICAgICsgTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCBNYXRoLnJvdW5kKHRoaXMuZykgfHwgMCkpICsgXCIsIFwiXG4gICAgICAgICsgTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCBNYXRoLnJvdW5kKHRoaXMuYikgfHwgMCkpXG4gICAgICAgICsgKGEgPT09IDEgPyBcIilcIiA6IFwiLCBcIiArIGEgKyBcIilcIik7XG4gIH1cbn0pKTtcblxuZnVuY3Rpb24gaHNsYShoLCBzLCBsLCBhKSB7XG4gIGlmIChhIDw9IDApIGggPSBzID0gbCA9IE5hTjtcbiAgZWxzZSBpZiAobCA8PSAwIHx8IGwgPj0gMSkgaCA9IHMgPSBOYU47XG4gIGVsc2UgaWYgKHMgPD0gMCkgaCA9IE5hTjtcbiAgcmV0dXJuIG5ldyBIc2woaCwgcywgbCwgYSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoc2xDb252ZXJ0KG8pIHtcbiAgaWYgKG8gaW5zdGFuY2VvZiBIc2wpIHJldHVybiBuZXcgSHNsKG8uaCwgby5zLCBvLmwsIG8ub3BhY2l0eSk7XG4gIGlmICghKG8gaW5zdGFuY2VvZiBDb2xvcikpIG8gPSBjb2xvcihvKTtcbiAgaWYgKCFvKSByZXR1cm4gbmV3IEhzbDtcbiAgaWYgKG8gaW5zdGFuY2VvZiBIc2wpIHJldHVybiBvO1xuICBvID0gby5yZ2IoKTtcbiAgdmFyIHIgPSBvLnIgLyAyNTUsXG4gICAgICBnID0gby5nIC8gMjU1LFxuICAgICAgYiA9IG8uYiAvIDI1NSxcbiAgICAgIG1pbiA9IE1hdGgubWluKHIsIGcsIGIpLFxuICAgICAgbWF4ID0gTWF0aC5tYXgociwgZywgYiksXG4gICAgICBoID0gTmFOLFxuICAgICAgcyA9IG1heCAtIG1pbixcbiAgICAgIGwgPSAobWF4ICsgbWluKSAvIDI7XG4gIGlmIChzKSB7XG4gICAgaWYgKHIgPT09IG1heCkgaCA9IChnIC0gYikgLyBzICsgKGcgPCBiKSAqIDY7XG4gICAgZWxzZSBpZiAoZyA9PT0gbWF4KSBoID0gKGIgLSByKSAvIHMgKyAyO1xuICAgIGVsc2UgaCA9IChyIC0gZykgLyBzICsgNDtcbiAgICBzIC89IGwgPCAwLjUgPyBtYXggKyBtaW4gOiAyIC0gbWF4IC0gbWluO1xuICAgIGggKj0gNjA7XG4gIH0gZWxzZSB7XG4gICAgcyA9IGwgPiAwICYmIGwgPCAxID8gMCA6IGg7XG4gIH1cbiAgcmV0dXJuIG5ldyBIc2woaCwgcywgbCwgby5vcGFjaXR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhzbChoLCBzLCBsLCBvcGFjaXR5KSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID8gaHNsQ29udmVydChoKSA6IG5ldyBIc2woaCwgcywgbCwgb3BhY2l0eSA9PSBudWxsID8gMSA6IG9wYWNpdHkpO1xufVxuXG5mdW5jdGlvbiBIc2woaCwgcywgbCwgb3BhY2l0eSkge1xuICB0aGlzLmggPSAraDtcbiAgdGhpcy5zID0gK3M7XG4gIHRoaXMubCA9ICtsO1xuICB0aGlzLm9wYWNpdHkgPSArb3BhY2l0eTtcbn1cblxuZGVmaW5lKEhzbCwgaHNsLCBleHRlbmQoQ29sb3IsIHtcbiAgYnJpZ2h0ZXI6IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gYnJpZ2h0ZXIgOiBNYXRoLnBvdyhicmlnaHRlciwgayk7XG4gICAgcmV0dXJuIG5ldyBIc2wodGhpcy5oLCB0aGlzLnMsIHRoaXMubCAqIGssIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIGRhcmtlcjogZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBkYXJrZXIgOiBNYXRoLnBvdyhkYXJrZXIsIGspO1xuICAgIHJldHVybiBuZXcgSHNsKHRoaXMuaCwgdGhpcy5zLCB0aGlzLmwgKiBrLCB0aGlzLm9wYWNpdHkpO1xuICB9LFxuICByZ2I6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBoID0gdGhpcy5oICUgMzYwICsgKHRoaXMuaCA8IDApICogMzYwLFxuICAgICAgICBzID0gaXNOYU4oaCkgfHwgaXNOYU4odGhpcy5zKSA/IDAgOiB0aGlzLnMsXG4gICAgICAgIGwgPSB0aGlzLmwsXG4gICAgICAgIG0yID0gbCArIChsIDwgMC41ID8gbCA6IDEgLSBsKSAqIHMsXG4gICAgICAgIG0xID0gMiAqIGwgLSBtMjtcbiAgICByZXR1cm4gbmV3IFJnYihcbiAgICAgIGhzbDJyZ2IoaCA+PSAyNDAgPyBoIC0gMjQwIDogaCArIDEyMCwgbTEsIG0yKSxcbiAgICAgIGhzbDJyZ2IoaCwgbTEsIG0yKSxcbiAgICAgIGhzbDJyZ2IoaCA8IDEyMCA/IGggKyAyNDAgOiBoIC0gMTIwLCBtMSwgbTIpLFxuICAgICAgdGhpcy5vcGFjaXR5XG4gICAgKTtcbiAgfSxcbiAgZGlzcGxheWFibGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoMCA8PSB0aGlzLnMgJiYgdGhpcy5zIDw9IDEgfHwgaXNOYU4odGhpcy5zKSlcbiAgICAgICAgJiYgKDAgPD0gdGhpcy5sICYmIHRoaXMubCA8PSAxKVxuICAgICAgICAmJiAoMCA8PSB0aGlzLm9wYWNpdHkgJiYgdGhpcy5vcGFjaXR5IDw9IDEpO1xuICB9XG59KSk7XG5cbi8qIEZyb20gRnZEIDEzLjM3LCBDU1MgQ29sb3IgTW9kdWxlIExldmVsIDMgKi9cbmZ1bmN0aW9uIGhzbDJyZ2IoaCwgbTEsIG0yKSB7XG4gIHJldHVybiAoaCA8IDYwID8gbTEgKyAobTIgLSBtMSkgKiBoIC8gNjBcbiAgICAgIDogaCA8IDE4MCA/IG0yXG4gICAgICA6IGggPCAyNDAgPyBtMSArIChtMiAtIG0xKSAqICgyNDAgLSBoKSAvIDYwXG4gICAgICA6IG0xKSAqIDI1NTtcbn1cbiIsImV4cG9ydCB2YXIgZGVnMnJhZCA9IE1hdGguUEkgLyAxODA7XG5leHBvcnQgdmFyIHJhZDJkZWcgPSAxODAgLyBNYXRoLlBJO1xuIiwiaW1wb3J0IGRlZmluZSwge2V4dGVuZH0gZnJvbSBcIi4vZGVmaW5lXCI7XG5pbXBvcnQge0NvbG9yLCByZ2JDb252ZXJ0LCBSZ2J9IGZyb20gXCIuL2NvbG9yXCI7XG5pbXBvcnQge2RlZzJyYWQsIHJhZDJkZWd9IGZyb20gXCIuL21hdGhcIjtcblxudmFyIEtuID0gMTgsXG4gICAgWG4gPSAwLjk1MDQ3MCwgLy8gRDY1IHN0YW5kYXJkIHJlZmVyZW50XG4gICAgWW4gPSAxLFxuICAgIFpuID0gMS4wODg4MzAsXG4gICAgdDAgPSA0IC8gMjksXG4gICAgdDEgPSA2IC8gMjksXG4gICAgdDIgPSAzICogdDEgKiB0MSxcbiAgICB0MyA9IHQxICogdDEgKiB0MTtcblxuZnVuY3Rpb24gbGFiQ29udmVydChvKSB7XG4gIGlmIChvIGluc3RhbmNlb2YgTGFiKSByZXR1cm4gbmV3IExhYihvLmwsIG8uYSwgby5iLCBvLm9wYWNpdHkpO1xuICBpZiAobyBpbnN0YW5jZW9mIEhjbCkge1xuICAgIHZhciBoID0gby5oICogZGVnMnJhZDtcbiAgICByZXR1cm4gbmV3IExhYihvLmwsIE1hdGguY29zKGgpICogby5jLCBNYXRoLnNpbihoKSAqIG8uYywgby5vcGFjaXR5KTtcbiAgfVxuICBpZiAoIShvIGluc3RhbmNlb2YgUmdiKSkgbyA9IHJnYkNvbnZlcnQobyk7XG4gIHZhciBiID0gcmdiMnh5eihvLnIpLFxuICAgICAgYSA9IHJnYjJ4eXooby5nKSxcbiAgICAgIGwgPSByZ2IyeHl6KG8uYiksXG4gICAgICB4ID0geHl6MmxhYigoMC40MTI0NTY0ICogYiArIDAuMzU3NTc2MSAqIGEgKyAwLjE4MDQzNzUgKiBsKSAvIFhuKSxcbiAgICAgIHkgPSB4eXoybGFiKCgwLjIxMjY3MjkgKiBiICsgMC43MTUxNTIyICogYSArIDAuMDcyMTc1MCAqIGwpIC8gWW4pLFxuICAgICAgeiA9IHh5ejJsYWIoKDAuMDE5MzMzOSAqIGIgKyAwLjExOTE5MjAgKiBhICsgMC45NTAzMDQxICogbCkgLyBabik7XG4gIHJldHVybiBuZXcgTGFiKDExNiAqIHkgLSAxNiwgNTAwICogKHggLSB5KSwgMjAwICogKHkgLSB6KSwgby5vcGFjaXR5KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbGFiKGwsIGEsIGIsIG9wYWNpdHkpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgPyBsYWJDb252ZXJ0KGwpIDogbmV3IExhYihsLCBhLCBiLCBvcGFjaXR5ID09IG51bGwgPyAxIDogb3BhY2l0eSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBMYWIobCwgYSwgYiwgb3BhY2l0eSkge1xuICB0aGlzLmwgPSArbDtcbiAgdGhpcy5hID0gK2E7XG4gIHRoaXMuYiA9ICtiO1xuICB0aGlzLm9wYWNpdHkgPSArb3BhY2l0eTtcbn1cblxuZGVmaW5lKExhYiwgbGFiLCBleHRlbmQoQ29sb3IsIHtcbiAgYnJpZ2h0ZXI6IGZ1bmN0aW9uKGspIHtcbiAgICByZXR1cm4gbmV3IExhYih0aGlzLmwgKyBLbiAqIChrID09IG51bGwgPyAxIDogayksIHRoaXMuYSwgdGhpcy5iLCB0aGlzLm9wYWNpdHkpO1xuICB9LFxuICBkYXJrZXI6IGZ1bmN0aW9uKGspIHtcbiAgICByZXR1cm4gbmV3IExhYih0aGlzLmwgLSBLbiAqIChrID09IG51bGwgPyAxIDogayksIHRoaXMuYSwgdGhpcy5iLCB0aGlzLm9wYWNpdHkpO1xuICB9LFxuICByZ2I6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB5ID0gKHRoaXMubCArIDE2KSAvIDExNixcbiAgICAgICAgeCA9IGlzTmFOKHRoaXMuYSkgPyB5IDogeSArIHRoaXMuYSAvIDUwMCxcbiAgICAgICAgeiA9IGlzTmFOKHRoaXMuYikgPyB5IDogeSAtIHRoaXMuYiAvIDIwMDtcbiAgICB5ID0gWW4gKiBsYWIyeHl6KHkpO1xuICAgIHggPSBYbiAqIGxhYjJ4eXooeCk7XG4gICAgeiA9IFpuICogbGFiMnh5eih6KTtcbiAgICByZXR1cm4gbmV3IFJnYihcbiAgICAgIHh5ejJyZ2IoIDMuMjQwNDU0MiAqIHggLSAxLjUzNzEzODUgKiB5IC0gMC40OTg1MzE0ICogeiksIC8vIEQ2NSAtPiBzUkdCXG4gICAgICB4eXoycmdiKC0wLjk2OTI2NjAgKiB4ICsgMS44NzYwMTA4ICogeSArIDAuMDQxNTU2MCAqIHopLFxuICAgICAgeHl6MnJnYiggMC4wNTU2NDM0ICogeCAtIDAuMjA0MDI1OSAqIHkgKyAxLjA1NzIyNTIgKiB6KSxcbiAgICAgIHRoaXMub3BhY2l0eVxuICAgICk7XG4gIH1cbn0pKTtcblxuZnVuY3Rpb24geHl6MmxhYih0KSB7XG4gIHJldHVybiB0ID4gdDMgPyBNYXRoLnBvdyh0LCAxIC8gMykgOiB0IC8gdDIgKyB0MDtcbn1cblxuZnVuY3Rpb24gbGFiMnh5eih0KSB7XG4gIHJldHVybiB0ID4gdDEgPyB0ICogdCAqIHQgOiB0MiAqICh0IC0gdDApO1xufVxuXG5mdW5jdGlvbiB4eXoycmdiKHgpIHtcbiAgcmV0dXJuIDI1NSAqICh4IDw9IDAuMDAzMTMwOCA/IDEyLjkyICogeCA6IDEuMDU1ICogTWF0aC5wb3coeCwgMSAvIDIuNCkgLSAwLjA1NSk7XG59XG5cbmZ1bmN0aW9uIHJnYjJ4eXooeCkge1xuICByZXR1cm4gKHggLz0gMjU1KSA8PSAwLjA0MDQ1ID8geCAvIDEyLjkyIDogTWF0aC5wb3coKHggKyAwLjA1NSkgLyAxLjA1NSwgMi40KTtcbn1cblxuZnVuY3Rpb24gaGNsQ29udmVydChvKSB7XG4gIGlmIChvIGluc3RhbmNlb2YgSGNsKSByZXR1cm4gbmV3IEhjbChvLmgsIG8uYywgby5sLCBvLm9wYWNpdHkpO1xuICBpZiAoIShvIGluc3RhbmNlb2YgTGFiKSkgbyA9IGxhYkNvbnZlcnQobyk7XG4gIHZhciBoID0gTWF0aC5hdGFuMihvLmIsIG8uYSkgKiByYWQyZGVnO1xuICByZXR1cm4gbmV3IEhjbChoIDwgMCA/IGggKyAzNjAgOiBoLCBNYXRoLnNxcnQoby5hICogby5hICsgby5iICogby5iKSwgby5sLCBvLm9wYWNpdHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGNsKGgsIGMsIGwsIG9wYWNpdHkpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgPyBoY2xDb252ZXJ0KGgpIDogbmV3IEhjbChoLCBjLCBsLCBvcGFjaXR5ID09IG51bGwgPyAxIDogb3BhY2l0eSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIY2woaCwgYywgbCwgb3BhY2l0eSkge1xuICB0aGlzLmggPSAraDtcbiAgdGhpcy5jID0gK2M7XG4gIHRoaXMubCA9ICtsO1xuICB0aGlzLm9wYWNpdHkgPSArb3BhY2l0eTtcbn1cblxuZGVmaW5lKEhjbCwgaGNsLCBleHRlbmQoQ29sb3IsIHtcbiAgYnJpZ2h0ZXI6IGZ1bmN0aW9uKGspIHtcbiAgICByZXR1cm4gbmV3IEhjbCh0aGlzLmgsIHRoaXMuYywgdGhpcy5sICsgS24gKiAoayA9PSBudWxsID8gMSA6IGspLCB0aGlzLm9wYWNpdHkpO1xuICB9LFxuICBkYXJrZXI6IGZ1bmN0aW9uKGspIHtcbiAgICByZXR1cm4gbmV3IEhjbCh0aGlzLmgsIHRoaXMuYywgdGhpcy5sIC0gS24gKiAoayA9PSBudWxsID8gMSA6IGspLCB0aGlzLm9wYWNpdHkpO1xuICB9LFxuICByZ2I6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBsYWJDb252ZXJ0KHRoaXMpLnJnYigpO1xuICB9XG59KSk7XG4iLCJpbXBvcnQgZGVmaW5lLCB7ZXh0ZW5kfSBmcm9tIFwiLi9kZWZpbmVcIjtcbmltcG9ydCB7Q29sb3IsIHJnYkNvbnZlcnQsIFJnYiwgZGFya2VyLCBicmlnaHRlcn0gZnJvbSBcIi4vY29sb3JcIjtcbmltcG9ydCB7ZGVnMnJhZCwgcmFkMmRlZ30gZnJvbSBcIi4vbWF0aFwiO1xuXG52YXIgQSA9IC0wLjE0ODYxLFxuICAgIEIgPSArMS43ODI3NyxcbiAgICBDID0gLTAuMjkyMjcsXG4gICAgRCA9IC0wLjkwNjQ5LFxuICAgIEUgPSArMS45NzI5NCxcbiAgICBFRCA9IEUgKiBELFxuICAgIEVCID0gRSAqIEIsXG4gICAgQkNfREEgPSBCICogQyAtIEQgKiBBO1xuXG5mdW5jdGlvbiBjdWJlaGVsaXhDb252ZXJ0KG8pIHtcbiAgaWYgKG8gaW5zdGFuY2VvZiBDdWJlaGVsaXgpIHJldHVybiBuZXcgQ3ViZWhlbGl4KG8uaCwgby5zLCBvLmwsIG8ub3BhY2l0eSk7XG4gIGlmICghKG8gaW5zdGFuY2VvZiBSZ2IpKSBvID0gcmdiQ29udmVydChvKTtcbiAgdmFyIHIgPSBvLnIgLyAyNTUsXG4gICAgICBnID0gby5nIC8gMjU1LFxuICAgICAgYiA9IG8uYiAvIDI1NSxcbiAgICAgIGwgPSAoQkNfREEgKiBiICsgRUQgKiByIC0gRUIgKiBnKSAvIChCQ19EQSArIEVEIC0gRUIpLFxuICAgICAgYmwgPSBiIC0gbCxcbiAgICAgIGsgPSAoRSAqIChnIC0gbCkgLSBDICogYmwpIC8gRCxcbiAgICAgIHMgPSBNYXRoLnNxcnQoayAqIGsgKyBibCAqIGJsKSAvIChFICogbCAqICgxIC0gbCkpLCAvLyBOYU4gaWYgbD0wIG9yIGw9MVxuICAgICAgaCA9IHMgPyBNYXRoLmF0YW4yKGssIGJsKSAqIHJhZDJkZWcgLSAxMjAgOiBOYU47XG4gIHJldHVybiBuZXcgQ3ViZWhlbGl4KGggPCAwID8gaCArIDM2MCA6IGgsIHMsIGwsIG8ub3BhY2l0eSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGN1YmVoZWxpeChoLCBzLCBsLCBvcGFjaXR5KSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID8gY3ViZWhlbGl4Q29udmVydChoKSA6IG5ldyBDdWJlaGVsaXgoaCwgcywgbCwgb3BhY2l0eSA9PSBudWxsID8gMSA6IG9wYWNpdHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ3ViZWhlbGl4KGgsIHMsIGwsIG9wYWNpdHkpIHtcbiAgdGhpcy5oID0gK2g7XG4gIHRoaXMucyA9ICtzO1xuICB0aGlzLmwgPSArbDtcbiAgdGhpcy5vcGFjaXR5ID0gK29wYWNpdHk7XG59XG5cbmRlZmluZShDdWJlaGVsaXgsIGN1YmVoZWxpeCwgZXh0ZW5kKENvbG9yLCB7XG4gIGJyaWdodGVyOiBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGJyaWdodGVyIDogTWF0aC5wb3coYnJpZ2h0ZXIsIGspO1xuICAgIHJldHVybiBuZXcgQ3ViZWhlbGl4KHRoaXMuaCwgdGhpcy5zLCB0aGlzLmwgKiBrLCB0aGlzLm9wYWNpdHkpO1xuICB9LFxuICBkYXJrZXI6IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gZGFya2VyIDogTWF0aC5wb3coZGFya2VyLCBrKTtcbiAgICByZXR1cm4gbmV3IEN1YmVoZWxpeCh0aGlzLmgsIHRoaXMucywgdGhpcy5sICogaywgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgcmdiOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgaCA9IGlzTmFOKHRoaXMuaCkgPyAwIDogKHRoaXMuaCArIDEyMCkgKiBkZWcycmFkLFxuICAgICAgICBsID0gK3RoaXMubCxcbiAgICAgICAgYSA9IGlzTmFOKHRoaXMucykgPyAwIDogdGhpcy5zICogbCAqICgxIC0gbCksXG4gICAgICAgIGNvc2ggPSBNYXRoLmNvcyhoKSxcbiAgICAgICAgc2luaCA9IE1hdGguc2luKGgpO1xuICAgIHJldHVybiBuZXcgUmdiKFxuICAgICAgMjU1ICogKGwgKyBhICogKEEgKiBjb3NoICsgQiAqIHNpbmgpKSxcbiAgICAgIDI1NSAqIChsICsgYSAqIChDICogY29zaCArIEQgKiBzaW5oKSksXG4gICAgICAyNTUgKiAobCArIGEgKiAoRSAqIGNvc2gpKSxcbiAgICAgIHRoaXMub3BhY2l0eVxuICAgICk7XG4gIH1cbn0pKTtcbiIsImV4cG9ydCBmdW5jdGlvbiBiYXNpcyh0MSwgdjAsIHYxLCB2MiwgdjMpIHtcbiAgdmFyIHQyID0gdDEgKiB0MSwgdDMgPSB0MiAqIHQxO1xuICByZXR1cm4gKCgxIC0gMyAqIHQxICsgMyAqIHQyIC0gdDMpICogdjBcbiAgICAgICsgKDQgLSA2ICogdDIgKyAzICogdDMpICogdjFcbiAgICAgICsgKDEgKyAzICogdDEgKyAzICogdDIgLSAzICogdDMpICogdjJcbiAgICAgICsgdDMgKiB2MykgLyA2O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgdmFyIG4gPSB2YWx1ZXMubGVuZ3RoIC0gMTtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICB2YXIgaSA9IHQgPD0gMCA/ICh0ID0gMCkgOiB0ID49IDEgPyAodCA9IDEsIG4gLSAxKSA6IE1hdGguZmxvb3IodCAqIG4pLFxuICAgICAgICB2MSA9IHZhbHVlc1tpXSxcbiAgICAgICAgdjIgPSB2YWx1ZXNbaSArIDFdLFxuICAgICAgICB2MCA9IGkgPiAwID8gdmFsdWVzW2kgLSAxXSA6IDIgKiB2MSAtIHYyLFxuICAgICAgICB2MyA9IGkgPCBuIC0gMSA/IHZhbHVlc1tpICsgMl0gOiAyICogdjIgLSB2MTtcbiAgICByZXR1cm4gYmFzaXMoKHQgLSBpIC8gbikgKiBuLCB2MCwgdjEsIHYyLCB2Myk7XG4gIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geDtcbiAgfTtcbn1cbiIsImltcG9ydCBjb25zdGFudCBmcm9tIFwiLi9jb25zdGFudFwiO1xuXG5mdW5jdGlvbiBsaW5lYXIoYSwgZCkge1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBhICsgdCAqIGQ7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGV4cG9uZW50aWFsKGEsIGIsIHkpIHtcbiAgcmV0dXJuIGEgPSBNYXRoLnBvdyhhLCB5KSwgYiA9IE1hdGgucG93KGIsIHkpIC0gYSwgeSA9IDEgLyB5LCBmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIE1hdGgucG93KGEgKyB0ICogYiwgeSk7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBodWUoYSwgYikge1xuICB2YXIgZCA9IGIgLSBhO1xuICByZXR1cm4gZCA/IGxpbmVhcihhLCBkID4gMTgwIHx8IGQgPCAtMTgwID8gZCAtIDM2MCAqIE1hdGgucm91bmQoZCAvIDM2MCkgOiBkKSA6IGNvbnN0YW50KGlzTmFOKGEpID8gYiA6IGEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2FtbWEoeSkge1xuICByZXR1cm4gKHkgPSAreSkgPT09IDEgPyBub2dhbW1hIDogZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBiIC0gYSA/IGV4cG9uZW50aWFsKGEsIGIsIHkpIDogY29uc3RhbnQoaXNOYU4oYSkgPyBiIDogYSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vZ2FtbWEoYSwgYikge1xuICB2YXIgZCA9IGIgLSBhO1xuICByZXR1cm4gZCA/IGxpbmVhcihhLCBkKSA6IGNvbnN0YW50KGlzTmFOKGEpID8gYiA6IGEpO1xufVxuIiwiaW1wb3J0IHtyZ2IgYXMgY29sb3JSZ2J9IGZyb20gXCJkMy1jb2xvclwiO1xuaW1wb3J0IGJhc2lzIGZyb20gXCIuL2Jhc2lzXCI7XG5pbXBvcnQgYmFzaXNDbG9zZWQgZnJvbSBcIi4vYmFzaXNDbG9zZWRcIjtcbmltcG9ydCBub2dhbW1hLCB7Z2FtbWF9IGZyb20gXCIuL2NvbG9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiByZ2JHYW1tYSh5KSB7XG4gIHZhciBjb2xvciA9IGdhbW1hKHkpO1xuXG4gIGZ1bmN0aW9uIHJnYihzdGFydCwgZW5kKSB7XG4gICAgdmFyIHIgPSBjb2xvcigoc3RhcnQgPSBjb2xvclJnYihzdGFydCkpLnIsIChlbmQgPSBjb2xvclJnYihlbmQpKS5yKSxcbiAgICAgICAgZyA9IGNvbG9yKHN0YXJ0LmcsIGVuZC5nKSxcbiAgICAgICAgYiA9IGNvbG9yKHN0YXJ0LmIsIGVuZC5iKSxcbiAgICAgICAgb3BhY2l0eSA9IG5vZ2FtbWEoc3RhcnQub3BhY2l0eSwgZW5kLm9wYWNpdHkpO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICBzdGFydC5yID0gcih0KTtcbiAgICAgIHN0YXJ0LmcgPSBnKHQpO1xuICAgICAgc3RhcnQuYiA9IGIodCk7XG4gICAgICBzdGFydC5vcGFjaXR5ID0gb3BhY2l0eSh0KTtcbiAgICAgIHJldHVybiBzdGFydCArIFwiXCI7XG4gICAgfTtcbiAgfVxuXG4gIHJnYi5nYW1tYSA9IHJnYkdhbW1hO1xuXG4gIHJldHVybiByZ2I7XG59KSgxKTtcblxuZnVuY3Rpb24gcmdiU3BsaW5lKHNwbGluZSkge1xuICByZXR1cm4gZnVuY3Rpb24oY29sb3JzKSB7XG4gICAgdmFyIG4gPSBjb2xvcnMubGVuZ3RoLFxuICAgICAgICByID0gbmV3IEFycmF5KG4pLFxuICAgICAgICBnID0gbmV3IEFycmF5KG4pLFxuICAgICAgICBiID0gbmV3IEFycmF5KG4pLFxuICAgICAgICBpLCBjb2xvcjtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBjb2xvciA9IGNvbG9yUmdiKGNvbG9yc1tpXSk7XG4gICAgICByW2ldID0gY29sb3IuciB8fCAwO1xuICAgICAgZ1tpXSA9IGNvbG9yLmcgfHwgMDtcbiAgICAgIGJbaV0gPSBjb2xvci5iIHx8IDA7XG4gICAgfVxuICAgIHIgPSBzcGxpbmUocik7XG4gICAgZyA9IHNwbGluZShnKTtcbiAgICBiID0gc3BsaW5lKGIpO1xuICAgIGNvbG9yLm9wYWNpdHkgPSAxO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICBjb2xvci5yID0gcih0KTtcbiAgICAgIGNvbG9yLmcgPSBnKHQpO1xuICAgICAgY29sb3IuYiA9IGIodCk7XG4gICAgICByZXR1cm4gY29sb3IgKyBcIlwiO1xuICAgIH07XG4gIH07XG59XG5cbmV4cG9ydCB2YXIgcmdiQmFzaXMgPSByZ2JTcGxpbmUoYmFzaXMpO1xuZXhwb3J0IHZhciByZ2JCYXNpc0Nsb3NlZCA9IHJnYlNwbGluZShiYXNpc0Nsb3NlZCk7XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBhID0gK2EsIGIgLT0gYSwgZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBhICsgYiAqIHQ7XG4gIH07XG59XG4iLCJpbXBvcnQgbnVtYmVyIGZyb20gXCIuL251bWJlclwiO1xuXG52YXIgcmVBID0gL1stK10/KD86XFxkK1xcLj9cXGQqfFxcLj9cXGQrKSg/OltlRV1bLStdP1xcZCspPy9nLFxuICAgIHJlQiA9IG5ldyBSZWdFeHAocmVBLnNvdXJjZSwgXCJnXCIpO1xuXG5mdW5jdGlvbiB6ZXJvKGIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBiO1xuICB9O1xufVxuXG5mdW5jdGlvbiBvbmUoYikge1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBiKHQpICsgXCJcIjtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYSwgYikge1xuICB2YXIgYmkgPSByZUEubGFzdEluZGV4ID0gcmVCLmxhc3RJbmRleCA9IDAsIC8vIHNjYW4gaW5kZXggZm9yIG5leHQgbnVtYmVyIGluIGJcbiAgICAgIGFtLCAvLyBjdXJyZW50IG1hdGNoIGluIGFcbiAgICAgIGJtLCAvLyBjdXJyZW50IG1hdGNoIGluIGJcbiAgICAgIGJzLCAvLyBzdHJpbmcgcHJlY2VkaW5nIGN1cnJlbnQgbnVtYmVyIGluIGIsIGlmIGFueVxuICAgICAgaSA9IC0xLCAvLyBpbmRleCBpbiBzXG4gICAgICBzID0gW10sIC8vIHN0cmluZyBjb25zdGFudHMgYW5kIHBsYWNlaG9sZGVyc1xuICAgICAgcSA9IFtdOyAvLyBudW1iZXIgaW50ZXJwb2xhdG9yc1xuXG4gIC8vIENvZXJjZSBpbnB1dHMgdG8gc3RyaW5ncy5cbiAgYSA9IGEgKyBcIlwiLCBiID0gYiArIFwiXCI7XG5cbiAgLy8gSW50ZXJwb2xhdGUgcGFpcnMgb2YgbnVtYmVycyBpbiBhICYgYi5cbiAgd2hpbGUgKChhbSA9IHJlQS5leGVjKGEpKVxuICAgICAgJiYgKGJtID0gcmVCLmV4ZWMoYikpKSB7XG4gICAgaWYgKChicyA9IGJtLmluZGV4KSA+IGJpKSB7IC8vIGEgc3RyaW5nIHByZWNlZGVzIHRoZSBuZXh0IG51bWJlciBpbiBiXG4gICAgICBicyA9IGIuc2xpY2UoYmksIGJzKTtcbiAgICAgIGlmIChzW2ldKSBzW2ldICs9IGJzOyAvLyBjb2FsZXNjZSB3aXRoIHByZXZpb3VzIHN0cmluZ1xuICAgICAgZWxzZSBzWysraV0gPSBicztcbiAgICB9XG4gICAgaWYgKChhbSA9IGFtWzBdKSA9PT0gKGJtID0gYm1bMF0pKSB7IC8vIG51bWJlcnMgaW4gYSAmIGIgbWF0Y2hcbiAgICAgIGlmIChzW2ldKSBzW2ldICs9IGJtOyAvLyBjb2FsZXNjZSB3aXRoIHByZXZpb3VzIHN0cmluZ1xuICAgICAgZWxzZSBzWysraV0gPSBibTtcbiAgICB9IGVsc2UgeyAvLyBpbnRlcnBvbGF0ZSBub24tbWF0Y2hpbmcgbnVtYmVyc1xuICAgICAgc1srK2ldID0gbnVsbDtcbiAgICAgIHEucHVzaCh7aTogaSwgeDogbnVtYmVyKGFtLCBibSl9KTtcbiAgICB9XG4gICAgYmkgPSByZUIubGFzdEluZGV4O1xuICB9XG5cbiAgLy8gQWRkIHJlbWFpbnMgb2YgYi5cbiAgaWYgKGJpIDwgYi5sZW5ndGgpIHtcbiAgICBicyA9IGIuc2xpY2UoYmkpO1xuICAgIGlmIChzW2ldKSBzW2ldICs9IGJzOyAvLyBjb2FsZXNjZSB3aXRoIHByZXZpb3VzIHN0cmluZ1xuICAgIGVsc2Ugc1srK2ldID0gYnM7XG4gIH1cblxuICAvLyBTcGVjaWFsIG9wdGltaXphdGlvbiBmb3Igb25seSBhIHNpbmdsZSBtYXRjaC5cbiAgLy8gT3RoZXJ3aXNlLCBpbnRlcnBvbGF0ZSBlYWNoIG9mIHRoZSBudW1iZXJzIGFuZCByZWpvaW4gdGhlIHN0cmluZy5cbiAgcmV0dXJuIHMubGVuZ3RoIDwgMiA/IChxWzBdXG4gICAgICA/IG9uZShxWzBdLngpXG4gICAgICA6IHplcm8oYikpXG4gICAgICA6IChiID0gcS5sZW5ndGgsIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbzsgaSA8IGI7ICsraSkgc1sobyA9IHFbaV0pLmldID0gby54KHQpO1xuICAgICAgICAgIHJldHVybiBzLmpvaW4oXCJcIik7XG4gICAgICAgIH0pO1xufVxuIiwidmFyIHJobyA9IE1hdGguU1FSVDIsXG4gICAgcmhvMiA9IDIsXG4gICAgcmhvNCA9IDQsXG4gICAgZXBzaWxvbjIgPSAxZS0xMjtcblxuZnVuY3Rpb24gY29zaCh4KSB7XG4gIHJldHVybiAoKHggPSBNYXRoLmV4cCh4KSkgKyAxIC8geCkgLyAyO1xufVxuXG5mdW5jdGlvbiBzaW5oKHgpIHtcbiAgcmV0dXJuICgoeCA9IE1hdGguZXhwKHgpKSAtIDEgLyB4KSAvIDI7XG59XG5cbmZ1bmN0aW9uIHRhbmgoeCkge1xuICByZXR1cm4gKCh4ID0gTWF0aC5leHAoMiAqIHgpKSAtIDEpIC8gKHggKyAxKTtcbn1cblxuLy8gcDAgPSBbdXgwLCB1eTAsIHcwXVxuLy8gcDEgPSBbdXgxLCB1eTEsIHcxXVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ocDAsIHAxKSB7XG4gIHZhciB1eDAgPSBwMFswXSwgdXkwID0gcDBbMV0sIHcwID0gcDBbMl0sXG4gICAgICB1eDEgPSBwMVswXSwgdXkxID0gcDFbMV0sIHcxID0gcDFbMl0sXG4gICAgICBkeCA9IHV4MSAtIHV4MCxcbiAgICAgIGR5ID0gdXkxIC0gdXkwLFxuICAgICAgZDIgPSBkeCAqIGR4ICsgZHkgKiBkeSxcbiAgICAgIGksXG4gICAgICBTO1xuXG4gIC8vIFNwZWNpYWwgY2FzZSBmb3IgdTAg4omFIHUxLlxuICBpZiAoZDIgPCBlcHNpbG9uMikge1xuICAgIFMgPSBNYXRoLmxvZyh3MSAvIHcwKSAvIHJobztcbiAgICBpID0gZnVuY3Rpb24odCkge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgdXgwICsgdCAqIGR4LFxuICAgICAgICB1eTAgKyB0ICogZHksXG4gICAgICAgIHcwICogTWF0aC5leHAocmhvICogdCAqIFMpXG4gICAgICBdO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdlbmVyYWwgY2FzZS5cbiAgZWxzZSB7XG4gICAgdmFyIGQxID0gTWF0aC5zcXJ0KGQyKSxcbiAgICAgICAgYjAgPSAodzEgKiB3MSAtIHcwICogdzAgKyByaG80ICogZDIpIC8gKDIgKiB3MCAqIHJobzIgKiBkMSksXG4gICAgICAgIGIxID0gKHcxICogdzEgLSB3MCAqIHcwIC0gcmhvNCAqIGQyKSAvICgyICogdzEgKiByaG8yICogZDEpLFxuICAgICAgICByMCA9IE1hdGgubG9nKE1hdGguc3FydChiMCAqIGIwICsgMSkgLSBiMCksXG4gICAgICAgIHIxID0gTWF0aC5sb2coTWF0aC5zcXJ0KGIxICogYjEgKyAxKSAtIGIxKTtcbiAgICBTID0gKHIxIC0gcjApIC8gcmhvO1xuICAgIGkgPSBmdW5jdGlvbih0KSB7XG4gICAgICB2YXIgcyA9IHQgKiBTLFxuICAgICAgICAgIGNvc2hyMCA9IGNvc2gocjApLFxuICAgICAgICAgIHUgPSB3MCAvIChyaG8yICogZDEpICogKGNvc2hyMCAqIHRhbmgocmhvICogcyArIHIwKSAtIHNpbmgocjApKTtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHV4MCArIHUgKiBkeCxcbiAgICAgICAgdXkwICsgdSAqIGR5LFxuICAgICAgICB3MCAqIGNvc2hyMCAvIGNvc2gocmhvICogcyArIHIwKVxuICAgICAgXTtcbiAgICB9XG4gIH1cblxuICBpLmR1cmF0aW9uID0gUyAqIDEwMDA7XG5cbiAgcmV0dXJuIGk7XG59XG4iLCJpbXBvcnQge2N1YmVoZWxpeCBhcyBjb2xvckN1YmVoZWxpeH0gZnJvbSBcImQzLWNvbG9yXCI7XG5pbXBvcnQgY29sb3IsIHtodWV9IGZyb20gXCIuL2NvbG9yXCI7XG5cbmZ1bmN0aW9uIGN1YmVoZWxpeChodWUpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBjdWJlaGVsaXhHYW1tYSh5KSB7XG4gICAgeSA9ICt5O1xuXG4gICAgZnVuY3Rpb24gY3ViZWhlbGl4KHN0YXJ0LCBlbmQpIHtcbiAgICAgIHZhciBoID0gaHVlKChzdGFydCA9IGNvbG9yQ3ViZWhlbGl4KHN0YXJ0KSkuaCwgKGVuZCA9IGNvbG9yQ3ViZWhlbGl4KGVuZCkpLmgpLFxuICAgICAgICAgIHMgPSBjb2xvcihzdGFydC5zLCBlbmQucyksXG4gICAgICAgICAgbCA9IGNvbG9yKHN0YXJ0LmwsIGVuZC5sKSxcbiAgICAgICAgICBvcGFjaXR5ID0gY29sb3Ioc3RhcnQub3BhY2l0eSwgZW5kLm9wYWNpdHkpO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgc3RhcnQuaCA9IGgodCk7XG4gICAgICAgIHN0YXJ0LnMgPSBzKHQpO1xuICAgICAgICBzdGFydC5sID0gbChNYXRoLnBvdyh0LCB5KSk7XG4gICAgICAgIHN0YXJ0Lm9wYWNpdHkgPSBvcGFjaXR5KHQpO1xuICAgICAgICByZXR1cm4gc3RhcnQgKyBcIlwiO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBjdWJlaGVsaXguZ2FtbWEgPSBjdWJlaGVsaXhHYW1tYTtcblxuICAgIHJldHVybiBjdWJlaGVsaXg7XG4gIH0pKDEpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjdWJlaGVsaXgoaHVlKTtcbmV4cG9ydCB2YXIgY3ViZWhlbGl4TG9uZyA9IGN1YmVoZWxpeChjb2xvcik7XG4iLCJpbXBvcnQge2ludGVycG9sYXRlUmdiQmFzaXN9IGZyb20gXCJkMy1pbnRlcnBvbGF0ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzY2hlbWUpIHtcbiAgcmV0dXJuIGludGVycG9sYXRlUmdiQmFzaXMoc2NoZW1lW3NjaGVtZS5sZW5ndGggLSAxXSk7XG59XG4iLCJpbXBvcnQgY29sb3JzIGZyb20gXCIuLi9jb2xvcnNcIjtcbmltcG9ydCByYW1wIGZyb20gXCIuLi9yYW1wXCI7XG5cbmV4cG9ydCB2YXIgc2NoZW1lID0gbmV3IEFycmF5KDMpLmNvbmNhdChcbiAgXCJkOGIzNjVmNWY1ZjU1YWI0YWNcIixcbiAgXCJhNjYxMWFkZmMyN2Q4MGNkYzEwMTg1NzFcIixcbiAgXCJhNjYxMWFkZmMyN2RmNWY1ZjU4MGNkYzEwMTg1NzFcIixcbiAgXCI4YzUxMGFkOGIzNjVmNmU4YzNjN2VhZTU1YWI0YWMwMTY2NWVcIixcbiAgXCI4YzUxMGFkOGIzNjVmNmU4YzNmNWY1ZjVjN2VhZTU1YWI0YWMwMTY2NWVcIixcbiAgXCI4YzUxMGFiZjgxMmRkZmMyN2RmNmU4YzNjN2VhZTU4MGNkYzEzNTk3OGYwMTY2NWVcIixcbiAgXCI4YzUxMGFiZjgxMmRkZmMyN2RmNmU4YzNmNWY1ZjVjN2VhZTU4MGNkYzEzNTk3OGYwMTY2NWVcIixcbiAgXCI1NDMwMDU4YzUxMGFiZjgxMmRkZmMyN2RmNmU4YzNjN2VhZTU4MGNkYzEzNTk3OGYwMTY2NWUwMDNjMzBcIixcbiAgXCI1NDMwMDU4YzUxMGFiZjgxMmRkZmMyN2RmNmU4YzNmNWY1ZjVjN2VhZTU4MGNkYzEzNTk3OGYwMTY2NWUwMDNjMzBcIlxuKS5tYXAoY29sb3JzKTtcblxuZXhwb3J0IGRlZmF1bHQgcmFtcChzY2hlbWUpO1xuIiwiaW1wb3J0IGNvbG9ycyBmcm9tIFwiLi4vY29sb3JzXCI7XG5pbXBvcnQgcmFtcCBmcm9tIFwiLi4vcmFtcFwiO1xuXG5leHBvcnQgdmFyIHNjaGVtZSA9IG5ldyBBcnJheSgzKS5jb25jYXQoXG4gIFwiYWY4ZGMzZjdmN2Y3N2ZiZjdiXCIsXG4gIFwiN2IzMjk0YzJhNWNmYTZkYmEwMDA4ODM3XCIsXG4gIFwiN2IzMjk0YzJhNWNmZjdmN2Y3YTZkYmEwMDA4ODM3XCIsXG4gIFwiNzYyYTgzYWY4ZGMzZTdkNGU4ZDlmMGQzN2ZiZjdiMWI3ODM3XCIsXG4gIFwiNzYyYTgzYWY4ZGMzZTdkNGU4ZjdmN2Y3ZDlmMGQzN2ZiZjdiMWI3ODM3XCIsXG4gIFwiNzYyYTgzOTk3MGFiYzJhNWNmZTdkNGU4ZDlmMGQzYTZkYmEwNWFhZTYxMWI3ODM3XCIsXG4gIFwiNzYyYTgzOTk3MGFiYzJhNWNmZTdkNGU4ZjdmN2Y3ZDlmMGQzYTZkYmEwNWFhZTYxMWI3ODM3XCIsXG4gIFwiNDAwMDRiNzYyYTgzOTk3MGFiYzJhNWNmZTdkNGU4ZDlmMGQzYTZkYmEwNWFhZTYxMWI3ODM3MDA0NDFiXCIsXG4gIFwiNDAwMDRiNzYyYTgzOTk3MGFiYzJhNWNmZTdkNGU4ZjdmN2Y3ZDlmMGQzYTZkYmEwNWFhZTYxMWI3ODM3MDA0NDFiXCJcbikubWFwKGNvbG9ycyk7XG5cbmV4cG9ydCBkZWZhdWx0IHJhbXAoc2NoZW1lKTtcbiIsImltcG9ydCBjb2xvcnMgZnJvbSBcIi4uL2NvbG9yc1wiO1xuaW1wb3J0IHJhbXAgZnJvbSBcIi4uL3JhbXBcIjtcblxuZXhwb3J0IHZhciBzY2hlbWUgPSBuZXcgQXJyYXkoMykuY29uY2F0KFxuICBcImU5YTNjOWY3ZjdmN2ExZDc2YVwiLFxuICBcImQwMWM4YmYxYjZkYWI4ZTE4NjRkYWMyNlwiLFxuICBcImQwMWM4YmYxYjZkYWY3ZjdmN2I4ZTE4NjRkYWMyNlwiLFxuICBcImM1MWI3ZGU5YTNjOWZkZTBlZmU2ZjVkMGExZDc2YTRkOTIyMVwiLFxuICBcImM1MWI3ZGU5YTNjOWZkZTBlZmY3ZjdmN2U2ZjVkMGExZDc2YTRkOTIyMVwiLFxuICBcImM1MWI3ZGRlNzdhZWYxYjZkYWZkZTBlZmU2ZjVkMGI4ZTE4NjdmYmM0MTRkOTIyMVwiLFxuICBcImM1MWI3ZGRlNzdhZWYxYjZkYWZkZTBlZmY3ZjdmN2U2ZjVkMGI4ZTE4NjdmYmM0MTRkOTIyMVwiLFxuICBcIjhlMDE1MmM1MWI3ZGRlNzdhZWYxYjZkYWZkZTBlZmU2ZjVkMGI4ZTE4NjdmYmM0MTRkOTIyMTI3NjQxOVwiLFxuICBcIjhlMDE1MmM1MWI3ZGRlNzdhZWYxYjZkYWZkZTBlZmY3ZjdmN2U2ZjVkMGI4ZTE4NjdmYmM0MTRkOTIyMTI3NjQxOVwiXG4pLm1hcChjb2xvcnMpO1xuXG5leHBvcnQgZGVmYXVsdCByYW1wKHNjaGVtZSk7XG4iLCJpbXBvcnQgY29sb3JzIGZyb20gXCIuLi9jb2xvcnNcIjtcbmltcG9ydCByYW1wIGZyb20gXCIuLi9yYW1wXCI7XG5cbmV4cG9ydCB2YXIgc2NoZW1lID0gbmV3IEFycmF5KDMpLmNvbmNhdChcbiAgXCI5OThlYzNmN2Y3ZjdmMWEzNDBcIixcbiAgXCI1ZTNjOTliMmFiZDJmZGI4NjNlNjYxMDFcIixcbiAgXCI1ZTNjOTliMmFiZDJmN2Y3ZjdmZGI4NjNlNjYxMDFcIixcbiAgXCI1NDI3ODg5OThlYzNkOGRhZWJmZWUwYjZmMWEzNDBiMzU4MDZcIixcbiAgXCI1NDI3ODg5OThlYzNkOGRhZWJmN2Y3ZjdmZWUwYjZmMWEzNDBiMzU4MDZcIixcbiAgXCI1NDI3ODg4MDczYWNiMmFiZDJkOGRhZWJmZWUwYjZmZGI4NjNlMDgyMTRiMzU4MDZcIixcbiAgXCI1NDI3ODg4MDczYWNiMmFiZDJkOGRhZWJmN2Y3ZjdmZWUwYjZmZGI4NjNlMDgyMTRiMzU4MDZcIixcbiAgXCIyZDAwNGI1NDI3ODg4MDczYWNiMmFiZDJkOGRhZWJmZWUwYjZmZGI4NjNlMDgyMTRiMzU4MDY3ZjNiMDhcIixcbiAgXCIyZDAwNGI1NDI3ODg4MDczYWNiMmFiZDJkOGRhZWJmN2Y3ZjdmZWUwYjZmZGI4NjNlMDgyMTRiMzU4MDY3ZjNiMDhcIlxuKS5tYXAoY29sb3JzKTtcblxuZXhwb3J0IGRlZmF1bHQgcmFtcChzY2hlbWUpO1xuIiwiaW1wb3J0IGNvbG9ycyBmcm9tIFwiLi4vY29sb3JzXCI7XG5pbXBvcnQgcmFtcCBmcm9tIFwiLi4vcmFtcFwiO1xuXG5leHBvcnQgdmFyIHNjaGVtZSA9IG5ldyBBcnJheSgzKS5jb25jYXQoXG4gIFwiZWY4YTYyZjdmN2Y3NjdhOWNmXCIsXG4gIFwiY2EwMDIwZjRhNTgyOTJjNWRlMDU3MWIwXCIsXG4gIFwiY2EwMDIwZjRhNTgyZjdmN2Y3OTJjNWRlMDU3MWIwXCIsXG4gIFwiYjIxODJiZWY4YTYyZmRkYmM3ZDFlNWYwNjdhOWNmMjE2NmFjXCIsXG4gIFwiYjIxODJiZWY4YTYyZmRkYmM3ZjdmN2Y3ZDFlNWYwNjdhOWNmMjE2NmFjXCIsXG4gIFwiYjIxODJiZDY2MDRkZjRhNTgyZmRkYmM3ZDFlNWYwOTJjNWRlNDM5M2MzMjE2NmFjXCIsXG4gIFwiYjIxODJiZDY2MDRkZjRhNTgyZmRkYmM3ZjdmN2Y3ZDFlNWYwOTJjNWRlNDM5M2MzMjE2NmFjXCIsXG4gIFwiNjcwMDFmYjIxODJiZDY2MDRkZjRhNTgyZmRkYmM3ZDFlNWYwOTJjNWRlNDM5M2MzMjE2NmFjMDUzMDYxXCIsXG4gIFwiNjcwMDFmYjIxODJiZDY2MDRkZjRhNTgyZmRkYmM3ZjdmN2Y3ZDFlNWYwOTJjNWRlNDM5M2MzMjE2NmFjMDUzMDYxXCJcbikubWFwKGNvbG9ycyk7XG5cbmV4cG9ydCBkZWZhdWx0IHJhbXAoc2NoZW1lKTtcbiIsImltcG9ydCBjb2xvcnMgZnJvbSBcIi4uL2NvbG9yc1wiO1xuaW1wb3J0IHJhbXAgZnJvbSBcIi4uL3JhbXBcIjtcblxuZXhwb3J0IHZhciBzY2hlbWUgPSBuZXcgQXJyYXkoMykuY29uY2F0KFxuICBcImVmOGE2MmZmZmZmZjk5OTk5OVwiLFxuICBcImNhMDAyMGY0YTU4MmJhYmFiYTQwNDA0MFwiLFxuICBcImNhMDAyMGY0YTU4MmZmZmZmZmJhYmFiYTQwNDA0MFwiLFxuICBcImIyMTgyYmVmOGE2MmZkZGJjN2UwZTBlMDk5OTk5OTRkNGQ0ZFwiLFxuICBcImIyMTgyYmVmOGE2MmZkZGJjN2ZmZmZmZmUwZTBlMDk5OTk5OTRkNGQ0ZFwiLFxuICBcImIyMTgyYmQ2NjA0ZGY0YTU4MmZkZGJjN2UwZTBlMGJhYmFiYTg3ODc4NzRkNGQ0ZFwiLFxuICBcImIyMTgyYmQ2NjA0ZGY0YTU4MmZkZGJjN2ZmZmZmZmUwZTBlMGJhYmFiYTg3ODc4NzRkNGQ0ZFwiLFxuICBcIjY3MDAxZmIyMTgyYmQ2NjA0ZGY0YTU4MmZkZGJjN2UwZTBlMGJhYmFiYTg3ODc4NzRkNGQ0ZDFhMWExYVwiLFxuICBcIjY3MDAxZmIyMTgyYmQ2NjA0ZGY0YTU4MmZkZGJjN2ZmZmZmZmUwZTBlMGJhYmFiYTg3ODc4NzRkNGQ0ZDFhMWExYVwiXG4pLm1hcChjb2xvcnMpO1xuXG5leHBvcnQgZGVmYXVsdCByYW1wKHNjaGVtZSk7XG4iLCJpbXBvcnQgY29sb3JzIGZyb20gXCIuLi9jb2xvcnNcIjtcbmltcG9ydCByYW1wIGZyb20gXCIuLi9yYW1wXCI7XG5cbmV4cG9ydCB2YXIgc2NoZW1lID0gbmV3IEFycmF5KDMpLmNvbmNhdChcbiAgXCJmYzhkNTlmZmZmYmY5MWJmZGJcIixcbiAgXCJkNzE5MWNmZGFlNjFhYmQ5ZTkyYzdiYjZcIixcbiAgXCJkNzE5MWNmZGFlNjFmZmZmYmZhYmQ5ZTkyYzdiYjZcIixcbiAgXCJkNzMwMjdmYzhkNTlmZWUwOTBlMGYzZjg5MWJmZGI0NTc1YjRcIixcbiAgXCJkNzMwMjdmYzhkNTlmZWUwOTBmZmZmYmZlMGYzZjg5MWJmZGI0NTc1YjRcIixcbiAgXCJkNzMwMjdmNDZkNDNmZGFlNjFmZWUwOTBlMGYzZjhhYmQ5ZTk3NGFkZDE0NTc1YjRcIixcbiAgXCJkNzMwMjdmNDZkNDNmZGFlNjFmZWUwOTBmZmZmYmZlMGYzZjhhYmQ5ZTk3NGFkZDE0NTc1YjRcIixcbiAgXCJhNTAwMjZkNzMwMjdmNDZkNDNmZGFlNjFmZWUwOTBlMGYzZjhhYmQ5ZTk3NGFkZDE0NTc1YjQzMTM2OTVcIixcbiAgXCJhNTAwMjZkNzMwMjdmNDZkNDNmZGFlNjFmZWUwOTBmZmZmYmZlMGYzZjhhYmQ5ZTk3NGFkZDE0NTc1YjQzMTM2OTVcIlxuKS5tYXAoY29sb3JzKTtcblxuZXhwb3J0IGRlZmF1bHQgcmFtcChzY2hlbWUpO1xuIiwiaW1wb3J0IGNvbG9ycyBmcm9tIFwiLi4vY29sb3JzXCI7XG5pbXBvcnQgcmFtcCBmcm9tIFwiLi4vcmFtcFwiO1xuXG5leHBvcnQgdmFyIHNjaGVtZSA9IG5ldyBBcnJheSgzKS5jb25jYXQoXG4gIFwiZmM4ZDU5ZmZmZmJmOTFjZjYwXCIsXG4gIFwiZDcxOTFjZmRhZTYxYTZkOTZhMWE5NjQxXCIsXG4gIFwiZDcxOTFjZmRhZTYxZmZmZmJmYTZkOTZhMWE5NjQxXCIsXG4gIFwiZDczMDI3ZmM4ZDU5ZmVlMDhiZDllZjhiOTFjZjYwMWE5ODUwXCIsXG4gIFwiZDczMDI3ZmM4ZDU5ZmVlMDhiZmZmZmJmZDllZjhiOTFjZjYwMWE5ODUwXCIsXG4gIFwiZDczMDI3ZjQ2ZDQzZmRhZTYxZmVlMDhiZDllZjhiYTZkOTZhNjZiZDYzMWE5ODUwXCIsXG4gIFwiZDczMDI3ZjQ2ZDQzZmRhZTYxZmVlMDhiZmZmZmJmZDllZjhiYTZkOTZhNjZiZDYzMWE5ODUwXCIsXG4gIFwiYTUwMDI2ZDczMDI3ZjQ2ZDQzZmRhZTYxZmVlMDhiZDllZjhiYTZkOTZhNjZiZDYzMWE5ODUwMDA2ODM3XCIsXG4gIFwiYTUwMDI2ZDczMDI3ZjQ2ZDQzZmRhZTYxZmVlMDhiZmZmZmJmZDllZjhiYTZkOTZhNjZiZDYzMWE5ODUwMDA2ODM3XCJcbikubWFwKGNvbG9ycyk7XG5cbmV4cG9ydCBkZWZhdWx0IHJhbXAoc2NoZW1lKTtcbiIsImltcG9ydCBjb2xvcnMgZnJvbSBcIi4uL2NvbG9yc1wiO1xuaW1wb3J0IHJhbXAgZnJvbSBcIi4uL3JhbXBcIjtcblxuZXhwb3J0IHZhciBzY2hlbWUgPSBuZXcgQXJyYXkoMykuY29uY2F0KFxuICBcImZjOGQ1OWZmZmZiZjk5ZDU5NFwiLFxuICBcImQ3MTkxY2ZkYWU2MWFiZGRhNDJiODNiYVwiLFxuICBcImQ3MTkxY2ZkYWU2MWZmZmZiZmFiZGRhNDJiODNiYVwiLFxuICBcImQ1M2U0ZmZjOGQ1OWZlZTA4YmU2ZjU5ODk5ZDU5NDMyODhiZFwiLFxuICBcImQ1M2U0ZmZjOGQ1OWZlZTA4YmZmZmZiZmU2ZjU5ODk5ZDU5NDMyODhiZFwiLFxuICBcImQ1M2U0ZmY0NmQ0M2ZkYWU2MWZlZTA4YmU2ZjU5OGFiZGRhNDY2YzJhNTMyODhiZFwiLFxuICBcImQ1M2U0ZmY0NmQ0M2ZkYWU2MWZlZTA4YmZmZmZiZmU2ZjU5OGFiZGRhNDY2YzJhNTMyODhiZFwiLFxuICBcIjllMDE0MmQ1M2U0ZmY0NmQ0M2ZkYWU2MWZlZTA4YmU2ZjU5OGFiZGRhNDY2YzJhNTMyODhiZDVlNGZhMlwiLFxuICBcIjllMDE0MmQ1M2U0ZmY0NmQ0M2ZkYWU2MWZlZTA4YmZmZmZiZmU2ZjU5OGFiZGRhNDY2YzJhNTMyODhiZDVlNGZhMlwiXG4pLm1hcChjb2xvcnMpO1xuXG5leHBvcnQgZGVmYXVsdCByYW1wKHNjaGVtZSk7XG4iLCJpbXBvcnQgY29sb3JzIGZyb20gXCIuLi9jb2xvcnNcIjtcbmltcG9ydCByYW1wIGZyb20gXCIuLi9yYW1wXCI7XG5cbmV4cG9ydCB2YXIgc2NoZW1lID0gbmV3IEFycmF5KDMpLmNvbmNhdChcbiAgXCJlNWY1Zjk5OWQ4YzkyY2EyNWZcIixcbiAgXCJlZGY4ZmJiMmUyZTI2NmMyYTQyMzhiNDVcIixcbiAgXCJlZGY4ZmJiMmUyZTI2NmMyYTQyY2EyNWYwMDZkMmNcIixcbiAgXCJlZGY4ZmJjY2VjZTY5OWQ4Yzk2NmMyYTQyY2EyNWYwMDZkMmNcIixcbiAgXCJlZGY4ZmJjY2VjZTY5OWQ4Yzk2NmMyYTQ0MWFlNzYyMzhiNDUwMDU4MjRcIixcbiAgXCJmN2ZjZmRlNWY1ZjljY2VjZTY5OWQ4Yzk2NmMyYTQ0MWFlNzYyMzhiNDUwMDU4MjRcIixcbiAgXCJmN2ZjZmRlNWY1ZjljY2VjZTY5OWQ4Yzk2NmMyYTQ0MWFlNzYyMzhiNDUwMDZkMmMwMDQ0MWJcIlxuKS5tYXAoY29sb3JzKTtcblxuZXhwb3J0IGRlZmF1bHQgcmFtcChzY2hlbWUpO1xuIiwiaW1wb3J0IGNvbG9ycyBmcm9tIFwiLi4vY29sb3JzXCI7XG5pbXBvcnQgcmFtcCBmcm9tIFwiLi4vcmFtcFwiO1xuXG5leHBvcnQgdmFyIHNjaGVtZSA9IG5ldyBBcnJheSgzKS5jb25jYXQoXG4gIFwiZTBlY2Y0OWViY2RhODg1NmE3XCIsXG4gIFwiZWRmOGZiYjNjZGUzOGM5NmM2ODg0MTlkXCIsXG4gIFwiZWRmOGZiYjNjZGUzOGM5NmM2ODg1NmE3ODEwZjdjXCIsXG4gIFwiZWRmOGZiYmZkM2U2OWViY2RhOGM5NmM2ODg1NmE3ODEwZjdjXCIsXG4gIFwiZWRmOGZiYmZkM2U2OWViY2RhOGM5NmM2OGM2YmIxODg0MTlkNmUwMTZiXCIsXG4gIFwiZjdmY2ZkZTBlY2Y0YmZkM2U2OWViY2RhOGM5NmM2OGM2YmIxODg0MTlkNmUwMTZiXCIsXG4gIFwiZjdmY2ZkZTBlY2Y0YmZkM2U2OWViY2RhOGM5NmM2OGM2YmIxODg0MTlkODEwZjdjNGQwMDRiXCJcbikubWFwKGNvbG9ycyk7XG5cbmV4cG9ydCBkZWZhdWx0IHJhbXAoc2NoZW1lKTtcbiIsImltcG9ydCBjb2xvcnMgZnJvbSBcIi4uL2NvbG9yc1wiO1xuaW1wb3J0IHJhbXAgZnJvbSBcIi4uL3JhbXBcIjtcblxuZXhwb3J0IHZhciBzY2hlbWUgPSBuZXcgQXJyYXkoMykuY29uY2F0KFxuICBcImUwZjNkYmE4ZGRiNTQzYTJjYVwiLFxuICBcImYwZjllOGJhZTRiYzdiY2NjNDJiOGNiZVwiLFxuICBcImYwZjllOGJhZTRiYzdiY2NjNDQzYTJjYTA4NjhhY1wiLFxuICBcImYwZjllOGNjZWJjNWE4ZGRiNTdiY2NjNDQzYTJjYTA4NjhhY1wiLFxuICBcImYwZjllOGNjZWJjNWE4ZGRiNTdiY2NjNDRlYjNkMzJiOGNiZTA4NTg5ZVwiLFxuICBcImY3ZmNmMGUwZjNkYmNjZWJjNWE4ZGRiNTdiY2NjNDRlYjNkMzJiOGNiZTA4NTg5ZVwiLFxuICBcImY3ZmNmMGUwZjNkYmNjZWJjNWE4ZGRiNTdiY2NjNDRlYjNkMzJiOGNiZTA4NjhhYzA4NDA4MVwiXG4pLm1hcChjb2xvcnMpO1xuXG5leHBvcnQgZGVmYXVsdCByYW1wKHNjaGVtZSk7XG4iLCJpbXBvcnQgY29sb3JzIGZyb20gXCIuLi9jb2xvcnNcIjtcbmltcG9ydCByYW1wIGZyb20gXCIuLi9yYW1wXCI7XG5cbmV4cG9ydCB2YXIgc2NoZW1lID0gbmV3IEFycmF5KDMpLmNvbmNhdChcbiAgXCJmZWU4YzhmZGJiODRlMzRhMzNcIixcbiAgXCJmZWYwZDlmZGNjOGFmYzhkNTlkNzMwMWZcIixcbiAgXCJmZWYwZDlmZGNjOGFmYzhkNTllMzRhMzNiMzAwMDBcIixcbiAgXCJmZWYwZDlmZGQ0OWVmZGJiODRmYzhkNTllMzRhMzNiMzAwMDBcIixcbiAgXCJmZWYwZDlmZGQ0OWVmZGJiODRmYzhkNTllZjY1NDhkNzMwMWY5OTAwMDBcIixcbiAgXCJmZmY3ZWNmZWU4YzhmZGQ0OWVmZGJiODRmYzhkNTllZjY1NDhkNzMwMWY5OTAwMDBcIixcbiAgXCJmZmY3ZWNmZWU4YzhmZGQ0OWVmZGJiODRmYzhkNTllZjY1NDhkNzMwMWZiMzAwMDA3ZjAwMDBcIlxuKS5tYXAoY29sb3JzKTtcblxuZXhwb3J0IGRlZmF1bHQgcmFtcChzY2hlbWUpO1xuIiwiaW1wb3J0IGNvbG9ycyBmcm9tIFwiLi4vY29sb3JzXCI7XG5pbXBvcnQgcmFtcCBmcm9tIFwiLi4vcmFtcFwiO1xuXG5leHBvcnQgdmFyIHNjaGVtZSA9IG5ldyBBcnJheSgzKS5jb25jYXQoXG4gIFwiZWNlMmYwYTZiZGRiMWM5MDk5XCIsXG4gIFwiZjZlZmY3YmRjOWUxNjdhOWNmMDI4MThhXCIsXG4gIFwiZjZlZmY3YmRjOWUxNjdhOWNmMWM5MDk5MDE2YzU5XCIsXG4gIFwiZjZlZmY3ZDBkMWU2YTZiZGRiNjdhOWNmMWM5MDk5MDE2YzU5XCIsXG4gIFwiZjZlZmY3ZDBkMWU2YTZiZGRiNjdhOWNmMzY5MGMwMDI4MThhMDE2NDUwXCIsXG4gIFwiZmZmN2ZiZWNlMmYwZDBkMWU2YTZiZGRiNjdhOWNmMzY5MGMwMDI4MThhMDE2NDUwXCIsXG4gIFwiZmZmN2ZiZWNlMmYwZDBkMWU2YTZiZGRiNjdhOWNmMzY5MGMwMDI4MThhMDE2YzU5MDE0NjM2XCJcbikubWFwKGNvbG9ycyk7XG5cbmV4cG9ydCBkZWZhdWx0IHJhbXAoc2NoZW1lKTtcbiIsImltcG9ydCBjb2xvcnMgZnJvbSBcIi4uL2NvbG9yc1wiO1xuaW1wb3J0IHJhbXAgZnJvbSBcIi4uL3JhbXBcIjtcblxuZXhwb3J0IHZhciBzY2hlbWUgPSBuZXcgQXJyYXkoMykuY29uY2F0KFxuICBcImVjZTdmMmE2YmRkYjJiOGNiZVwiLFxuICBcImYxZWVmNmJkYzllMTc0YTljZjA1NzBiMFwiLFxuICBcImYxZWVmNmJkYzllMTc0YTljZjJiOGNiZTA0NWE4ZFwiLFxuICBcImYxZWVmNmQwZDFlNmE2YmRkYjc0YTljZjJiOGNiZTA0NWE4ZFwiLFxuICBcImYxZWVmNmQwZDFlNmE2YmRkYjc0YTljZjM2OTBjMDA1NzBiMDAzNGU3YlwiLFxuICBcImZmZjdmYmVjZTdmMmQwZDFlNmE2YmRkYjc0YTljZjM2OTBjMDA1NzBiMDAzNGU3YlwiLFxuICBcImZmZjdmYmVjZTdmMmQwZDFlNmE2YmRkYjc0YTljZjM2OTBjMDA1NzBiMDA0NWE4ZDAyMzg1OFwiXG4pLm1hcChjb2xvcnMpO1xuXG5leHBvcnQgZGVmYXVsdCByYW1wKHNjaGVtZSk7XG4iLCJpbXBvcnQgY29sb3JzIGZyb20gXCIuLi9jb2xvcnNcIjtcbmltcG9ydCByYW1wIGZyb20gXCIuLi9yYW1wXCI7XG5cbmV4cG9ydCB2YXIgc2NoZW1lID0gbmV3IEFycmF5KDMpLmNvbmNhdChcbiAgXCJlN2UxZWZjOTk0YzdkZDFjNzdcIixcbiAgXCJmMWVlZjZkN2I1ZDhkZjY1YjBjZTEyNTZcIixcbiAgXCJmMWVlZjZkN2I1ZDhkZjY1YjBkZDFjNzc5ODAwNDNcIixcbiAgXCJmMWVlZjZkNGI5ZGFjOTk0YzdkZjY1YjBkZDFjNzc5ODAwNDNcIixcbiAgXCJmMWVlZjZkNGI5ZGFjOTk0YzdkZjY1YjBlNzI5OGFjZTEyNTY5MTAwM2ZcIixcbiAgXCJmN2Y0ZjllN2UxZWZkNGI5ZGFjOTk0YzdkZjY1YjBlNzI5OGFjZTEyNTY5MTAwM2ZcIixcbiAgXCJmN2Y0ZjllN2UxZWZkNGI5ZGFjOTk0YzdkZjY1YjBlNzI5OGFjZTEyNTY5ODAwNDM2NzAwMWZcIlxuKS5tYXAoY29sb3JzKTtcblxuZXhwb3J0IGRlZmF1bHQgcmFtcChzY2hlbWUpO1xuIiwiaW1wb3J0IGNvbG9ycyBmcm9tIFwiLi4vY29sb3JzXCI7XG5pbXBvcnQgcmFtcCBmcm9tIFwiLi4vcmFtcFwiO1xuXG5leHBvcnQgdmFyIHNjaGVtZSA9IG5ldyBBcnJheSgzKS5jb25jYXQoXG4gIFwiZmRlMGRkZmE5ZmI1YzUxYjhhXCIsXG4gIFwiZmVlYmUyZmJiNGI5Zjc2OGExYWUwMTdlXCIsXG4gIFwiZmVlYmUyZmJiNGI5Zjc2OGExYzUxYjhhN2EwMTc3XCIsXG4gIFwiZmVlYmUyZmNjNWMwZmE5ZmI1Zjc2OGExYzUxYjhhN2EwMTc3XCIsXG4gIFwiZmVlYmUyZmNjNWMwZmE5ZmI1Zjc2OGExZGQzNDk3YWUwMTdlN2EwMTc3XCIsXG4gIFwiZmZmN2YzZmRlMGRkZmNjNWMwZmE5ZmI1Zjc2OGExZGQzNDk3YWUwMTdlN2EwMTc3XCIsXG4gIFwiZmZmN2YzZmRlMGRkZmNjNWMwZmE5ZmI1Zjc2OGExZGQzNDk3YWUwMTdlN2EwMTc3NDkwMDZhXCJcbikubWFwKGNvbG9ycyk7XG5cbmV4cG9ydCBkZWZhdWx0IHJhbXAoc2NoZW1lKTtcbiIsImltcG9ydCBjb2xvcnMgZnJvbSBcIi4uL2NvbG9yc1wiO1xuaW1wb3J0IHJhbXAgZnJvbSBcIi4uL3JhbXBcIjtcblxuZXhwb3J0IHZhciBzY2hlbWUgPSBuZXcgQXJyYXkoMykuY29uY2F0KFxuICBcImVkZjhiMTdmY2RiYjJjN2ZiOFwiLFxuICBcImZmZmZjY2ExZGFiNDQxYjZjNDIyNWVhOFwiLFxuICBcImZmZmZjY2ExZGFiNDQxYjZjNDJjN2ZiODI1MzQ5NFwiLFxuICBcImZmZmZjY2M3ZTliNDdmY2RiYjQxYjZjNDJjN2ZiODI1MzQ5NFwiLFxuICBcImZmZmZjY2M3ZTliNDdmY2RiYjQxYjZjNDFkOTFjMDIyNWVhODBjMmM4NFwiLFxuICBcImZmZmZkOWVkZjhiMWM3ZTliNDdmY2RiYjQxYjZjNDFkOTFjMDIyNWVhODBjMmM4NFwiLFxuICBcImZmZmZkOWVkZjhiMWM3ZTliNDdmY2RiYjQxYjZjNDFkOTFjMDIyNWVhODI1MzQ5NDA4MWQ1OFwiXG4pLm1hcChjb2xvcnMpO1xuXG5leHBvcnQgZGVmYXVsdCByYW1wKHNjaGVtZSk7XG4iLCJpbXBvcnQgY29sb3JzIGZyb20gXCIuLi9jb2xvcnNcIjtcbmltcG9ydCByYW1wIGZyb20gXCIuLi9yYW1wXCI7XG5cbmV4cG9ydCB2YXIgc2NoZW1lID0gbmV3IEFycmF5KDMpLmNvbmNhdChcbiAgXCJmN2ZjYjlhZGRkOGUzMWEzNTRcIixcbiAgXCJmZmZmY2NjMmU2OTk3OGM2NzkyMzg0NDNcIixcbiAgXCJmZmZmY2NjMmU2OTk3OGM2NzkzMWEzNTQwMDY4MzdcIixcbiAgXCJmZmZmY2NkOWYwYTNhZGRkOGU3OGM2NzkzMWEzNTQwMDY4MzdcIixcbiAgXCJmZmZmY2NkOWYwYTNhZGRkOGU3OGM2Nzk0MWFiNWQyMzg0NDMwMDVhMzJcIixcbiAgXCJmZmZmZTVmN2ZjYjlkOWYwYTNhZGRkOGU3OGM2Nzk0MWFiNWQyMzg0NDMwMDVhMzJcIixcbiAgXCJmZmZmZTVmN2ZjYjlkOWYwYTNhZGRkOGU3OGM2Nzk0MWFiNWQyMzg0NDMwMDY4MzcwMDQ1MjlcIlxuKS5tYXAoY29sb3JzKTtcblxuZXhwb3J0IGRlZmF1bHQgcmFtcChzY2hlbWUpO1xuIiwiaW1wb3J0IGNvbG9ycyBmcm9tIFwiLi4vY29sb3JzXCI7XG5pbXBvcnQgcmFtcCBmcm9tIFwiLi4vcmFtcFwiO1xuXG5leHBvcnQgdmFyIHNjaGVtZSA9IG5ldyBBcnJheSgzKS5jb25jYXQoXG4gIFwiZmZmN2JjZmVjNDRmZDk1ZjBlXCIsXG4gIFwiZmZmZmQ0ZmVkOThlZmU5OTI5Y2M0YzAyXCIsXG4gIFwiZmZmZmQ0ZmVkOThlZmU5OTI5ZDk1ZjBlOTkzNDA0XCIsXG4gIFwiZmZmZmQ0ZmVlMzkxZmVjNDRmZmU5OTI5ZDk1ZjBlOTkzNDA0XCIsXG4gIFwiZmZmZmQ0ZmVlMzkxZmVjNDRmZmU5OTI5ZWM3MDE0Y2M0YzAyOGMyZDA0XCIsXG4gIFwiZmZmZmU1ZmZmN2JjZmVlMzkxZmVjNDRmZmU5OTI5ZWM3MDE0Y2M0YzAyOGMyZDA0XCIsXG4gIFwiZmZmZmU1ZmZmN2JjZmVlMzkxZmVjNDRmZmU5OTI5ZWM3MDE0Y2M0YzAyOTkzNDA0NjYyNTA2XCJcbikubWFwKGNvbG9ycyk7XG5cbmV4cG9ydCBkZWZhdWx0IHJhbXAoc2NoZW1lKTtcbiIsImltcG9ydCBjb2xvcnMgZnJvbSBcIi4uL2NvbG9yc1wiO1xuaW1wb3J0IHJhbXAgZnJvbSBcIi4uL3JhbXBcIjtcblxuZXhwb3J0IHZhciBzY2hlbWUgPSBuZXcgQXJyYXkoMykuY29uY2F0KFxuICBcImZmZWRhMGZlYjI0Y2YwM2IyMFwiLFxuICBcImZmZmZiMmZlY2M1Y2ZkOGQzY2UzMWExY1wiLFxuICBcImZmZmZiMmZlY2M1Y2ZkOGQzY2YwM2IyMGJkMDAyNlwiLFxuICBcImZmZmZiMmZlZDk3NmZlYjI0Y2ZkOGQzY2YwM2IyMGJkMDAyNlwiLFxuICBcImZmZmZiMmZlZDk3NmZlYjI0Y2ZkOGQzY2ZjNGUyYWUzMWExY2IxMDAyNlwiLFxuICBcImZmZmZjY2ZmZWRhMGZlZDk3NmZlYjI0Y2ZkOGQzY2ZjNGUyYWUzMWExY2IxMDAyNlwiLFxuICBcImZmZmZjY2ZmZWRhMGZlZDk3NmZlYjI0Y2ZkOGQzY2ZjNGUyYWUzMWExY2JkMDAyNjgwMDAyNlwiXG4pLm1hcChjb2xvcnMpO1xuXG5leHBvcnQgZGVmYXVsdCByYW1wKHNjaGVtZSk7XG4iLCJpbXBvcnQgY29sb3JzIGZyb20gXCIuLi9jb2xvcnNcIjtcbmltcG9ydCByYW1wIGZyb20gXCIuLi9yYW1wXCI7XG5cbmV4cG9ydCB2YXIgc2NoZW1lID0gbmV3IEFycmF5KDMpLmNvbmNhdChcbiAgXCJkZWViZjc5ZWNhZTEzMTgyYmRcIixcbiAgXCJlZmYzZmZiZGQ3ZTc2YmFlZDYyMTcxYjVcIixcbiAgXCJlZmYzZmZiZGQ3ZTc2YmFlZDYzMTgyYmQwODUxOWNcIixcbiAgXCJlZmYzZmZjNmRiZWY5ZWNhZTE2YmFlZDYzMTgyYmQwODUxOWNcIixcbiAgXCJlZmYzZmZjNmRiZWY5ZWNhZTE2YmFlZDY0MjkyYzYyMTcxYjUwODQ1OTRcIixcbiAgXCJmN2ZiZmZkZWViZjdjNmRiZWY5ZWNhZTE2YmFlZDY0MjkyYzYyMTcxYjUwODQ1OTRcIixcbiAgXCJmN2ZiZmZkZWViZjdjNmRiZWY5ZWNhZTE2YmFlZDY0MjkyYzYyMTcxYjUwODUxOWMwODMwNmJcIlxuKS5tYXAoY29sb3JzKTtcblxuZXhwb3J0IGRlZmF1bHQgcmFtcChzY2hlbWUpO1xuIiwiaW1wb3J0IGNvbG9ycyBmcm9tIFwiLi4vY29sb3JzXCI7XG5pbXBvcnQgcmFtcCBmcm9tIFwiLi4vcmFtcFwiO1xuXG5leHBvcnQgdmFyIHNjaGVtZSA9IG5ldyBBcnJheSgzKS5jb25jYXQoXG4gIFwiZTVmNWUwYTFkOTliMzFhMzU0XCIsXG4gIFwiZWRmOGU5YmFlNGIzNzRjNDc2MjM4YjQ1XCIsXG4gIFwiZWRmOGU5YmFlNGIzNzRjNDc2MzFhMzU0MDA2ZDJjXCIsXG4gIFwiZWRmOGU5YzdlOWMwYTFkOTliNzRjNDc2MzFhMzU0MDA2ZDJjXCIsXG4gIFwiZWRmOGU5YzdlOWMwYTFkOTliNzRjNDc2NDFhYjVkMjM4YjQ1MDA1YTMyXCIsXG4gIFwiZjdmY2Y1ZTVmNWUwYzdlOWMwYTFkOTliNzRjNDc2NDFhYjVkMjM4YjQ1MDA1YTMyXCIsXG4gIFwiZjdmY2Y1ZTVmNWUwYzdlOWMwYTFkOTliNzRjNDc2NDFhYjVkMjM4YjQ1MDA2ZDJjMDA0NDFiXCJcbikubWFwKGNvbG9ycyk7XG5cbmV4cG9ydCBkZWZhdWx0IHJhbXAoc2NoZW1lKTtcbiIsImltcG9ydCBjb2xvcnMgZnJvbSBcIi4uL2NvbG9yc1wiO1xuaW1wb3J0IHJhbXAgZnJvbSBcIi4uL3JhbXBcIjtcblxuZXhwb3J0IHZhciBzY2hlbWUgPSBuZXcgQXJyYXkoMykuY29uY2F0KFxuICBcImYwZjBmMGJkYmRiZDYzNjM2M1wiLFxuICBcImY3ZjdmN2NjY2NjYzk2OTY5NjUyNTI1MlwiLFxuICBcImY3ZjdmN2NjY2NjYzk2OTY5NjYzNjM2MzI1MjUyNVwiLFxuICBcImY3ZjdmN2Q5ZDlkOWJkYmRiZDk2OTY5NjYzNjM2MzI1MjUyNVwiLFxuICBcImY3ZjdmN2Q5ZDlkOWJkYmRiZDk2OTY5NjczNzM3MzUyNTI1MjI1MjUyNVwiLFxuICBcImZmZmZmZmYwZjBmMGQ5ZDlkOWJkYmRiZDk2OTY5NjczNzM3MzUyNTI1MjI1MjUyNVwiLFxuICBcImZmZmZmZmYwZjBmMGQ5ZDlkOWJkYmRiZDk2OTY5NjczNzM3MzUyNTI1MjI1MjUyNTAwMDAwMFwiXG4pLm1hcChjb2xvcnMpO1xuXG5leHBvcnQgZGVmYXVsdCByYW1wKHNjaGVtZSk7XG4iLCJpbXBvcnQgY29sb3JzIGZyb20gXCIuLi9jb2xvcnNcIjtcbmltcG9ydCByYW1wIGZyb20gXCIuLi9yYW1wXCI7XG5cbmV4cG9ydCB2YXIgc2NoZW1lID0gbmV3IEFycmF5KDMpLmNvbmNhdChcbiAgXCJlZmVkZjViY2JkZGM3NTZiYjFcIixcbiAgXCJmMmYwZjdjYmM5ZTI5ZTlhYzg2YTUxYTNcIixcbiAgXCJmMmYwZjdjYmM5ZTI5ZTlhYzg3NTZiYjE1NDI3OGZcIixcbiAgXCJmMmYwZjdkYWRhZWJiY2JkZGM5ZTlhYzg3NTZiYjE1NDI3OGZcIixcbiAgXCJmMmYwZjdkYWRhZWJiY2JkZGM5ZTlhYzg4MDdkYmE2YTUxYTM0YTE0ODZcIixcbiAgXCJmY2ZiZmRlZmVkZjVkYWRhZWJiY2JkZGM5ZTlhYzg4MDdkYmE2YTUxYTM0YTE0ODZcIixcbiAgXCJmY2ZiZmRlZmVkZjVkYWRhZWJiY2JkZGM5ZTlhYzg4MDdkYmE2YTUxYTM1NDI3OGYzZjAwN2RcIlxuKS5tYXAoY29sb3JzKTtcblxuZXhwb3J0IGRlZmF1bHQgcmFtcChzY2hlbWUpO1xuIiwiaW1wb3J0IGNvbG9ycyBmcm9tIFwiLi4vY29sb3JzXCI7XG5pbXBvcnQgcmFtcCBmcm9tIFwiLi4vcmFtcFwiO1xuXG5leHBvcnQgdmFyIHNjaGVtZSA9IG5ldyBBcnJheSgzKS5jb25jYXQoXG4gIFwiZmVlMGQyZmM5MjcyZGUyZDI2XCIsXG4gIFwiZmVlNWQ5ZmNhZTkxZmI2YTRhY2IxODFkXCIsXG4gIFwiZmVlNWQ5ZmNhZTkxZmI2YTRhZGUyZDI2YTUwZjE1XCIsXG4gIFwiZmVlNWQ5ZmNiYmExZmM5MjcyZmI2YTRhZGUyZDI2YTUwZjE1XCIsXG4gIFwiZmVlNWQ5ZmNiYmExZmM5MjcyZmI2YTRhZWYzYjJjY2IxODFkOTkwMDBkXCIsXG4gIFwiZmZmNWYwZmVlMGQyZmNiYmExZmM5MjcyZmI2YTRhZWYzYjJjY2IxODFkOTkwMDBkXCIsXG4gIFwiZmZmNWYwZmVlMGQyZmNiYmExZmM5MjcyZmI2YTRhZWYzYjJjY2IxODFkYTUwZjE1NjcwMDBkXCJcbikubWFwKGNvbG9ycyk7XG5cbmV4cG9ydCBkZWZhdWx0IHJhbXAoc2NoZW1lKTtcbiIsImltcG9ydCBjb2xvcnMgZnJvbSBcIi4uL2NvbG9yc1wiO1xuaW1wb3J0IHJhbXAgZnJvbSBcIi4uL3JhbXBcIjtcblxuZXhwb3J0IHZhciBzY2hlbWUgPSBuZXcgQXJyYXkoMykuY29uY2F0KFxuICBcImZlZTZjZWZkYWU2YmU2NTUwZFwiLFxuICBcImZlZWRkZWZkYmU4NWZkOGQzY2Q5NDcwMVwiLFxuICBcImZlZWRkZWZkYmU4NWZkOGQzY2U2NTUwZGE2MzYwM1wiLFxuICBcImZlZWRkZWZkZDBhMmZkYWU2YmZkOGQzY2U2NTUwZGE2MzYwM1wiLFxuICBcImZlZWRkZWZkZDBhMmZkYWU2YmZkOGQzY2YxNjkxM2Q5NDgwMThjMmQwNFwiLFxuICBcImZmZjVlYmZlZTZjZWZkZDBhMmZkYWU2YmZkOGQzY2YxNjkxM2Q5NDgwMThjMmQwNFwiLFxuICBcImZmZjVlYmZlZTZjZWZkZDBhMmZkYWU2YmZkOGQzY2YxNjkxM2Q5NDgwMWE2MzYwMzdmMjcwNFwiXG4pLm1hcChjb2xvcnMpO1xuXG5leHBvcnQgZGVmYXVsdCByYW1wKHNjaGVtZSk7XG4iLCJpbXBvcnQgKiBhcyBkMyBmcm9tIFwiZDMtc2NhbGUtY2hyb21hdGljXCI7XG5cbmV4cG9ydCBjb25zdCBzZXR1cEQzU2NhbGVDaHJvbWF0aWMgPSB7XG5cdFwiZDMuc2NoZW1lQWNjZW50XCI6IHtcblx0XHR0aXRsZTogXCJBY2NlbnRcIixcblx0XHRkZXNjcmlwdGlvbjogXCJBbiBhcnJheSBvZiBlaWdodCBjYXRlZ29yaWNhbCBjb2xvcnMgcmVwcmVzZW50ZWQgYXMgUkdCIGhleGFkZWNpbWFsIHN0cmluZ3MuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcInNjaGVtZVwiLCBcImNhdGVnb3JpY2FsXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuc2NoZW1lQWNjZW50O1xuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuc2NoZW1lRGFyazJcIjoge1xuXHRcdHRpdGxlOiBcIkRhcmsgMlwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkFuIGFycmF5IG9mIGVpZ2h0IGNhdGVnb3JpY2FsIGNvbG9ycyByZXByZXNlbnRlZCBhcyBSR0IgaGV4YWRlY2ltYWwgc3RyaW5ncy5cIixcblx0XHRjYXRlZ29yeTogW1wic2NoZW1lXCIsIFwiY2F0ZWdvcmljYWxcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5zY2hlbWVEYXJrMjtcblx0XHR9XG5cdH0sXG5cdFxuXHRcImQzLnNjaGVtZVBhaXJlZFwiOiB7XG5cdFx0dGl0bGU6IFwiUGFpcmVkXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiQW4gYXJyYXkgb2YgdHdlbHZlIGNhdGVnb3JpY2FsIGNvbG9ycyByZXByZXNlbnRlZCBhcyBSR0IgaGV4YWRlY2ltYWwgc3RyaW5ncy5cIixcblx0XHRjYXRlZ29yeTogW1wic2NoZW1lXCIsIFwiY2F0ZWdvcmljYWxcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5zY2hlbWVQYWlyZWQ7XG5cdFx0fVxuXHR9LFxuXHRcblx0XCJkMy5zY2hlbWVQYXN0ZWwxXCI6IHtcblx0XHR0aXRsZTogXCJQYXN0ZWwgMVwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkFuIGFycmF5IG9mIG5pbmUgY2F0ZWdvcmljYWwgY29sb3JzIHJlcHJlc2VudGVkIGFzIFJHQiBoZXhhZGVjaW1hbCBzdHJpbmdzLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJzY2hlbWVcIiwgXCJjYXRlZ29yaWNhbFwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLnNjaGVtZVBhc3RlbDE7XG5cdFx0fVxuXHR9LFxuXG5cdFwiZDMuc2NoZW1lUGFzdGVsMlwiOiB7XG5cdFx0dGl0bGU6IFwiUGFzdGVsIDJcIixcblx0XHRkZXNjcmlwdGlvbjogXCJBbiBhcnJheSBvZiBlaWdodCBjYXRlZ29yaWNhbCBjb2xvcnMgcmVwcmVzZW50ZWQgYXMgUkdCIGhleGFkZWNpbWFsIHN0cmluZ3MuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcInNjaGVtZVwiLCBcImNhdGVnb3JpY2FsXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuc2NoZW1lUGFzdGVsMjtcblx0XHR9XG5cdH0sXG5cdFxuXHRcImQzLnNjaGVtZVNldDFcIjoge1xuXHRcdHRpdGxlOiBcIlNldCAxXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiQW4gYXJyYXkgb2YgbmluZSBjYXRlZ29yaWNhbCBjb2xvcnMgcmVwcmVzZW50ZWQgYXMgUkdCIGhleGFkZWNpbWFsIHN0cmluZ3MuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcInNjaGVtZVwiLCBcImNhdGVnb3JpY2FsXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuc2NoZW1lU2V0MTtcblx0XHR9XG5cdH0sXG5cdFxuXHRcImQzLnNjaGVtZVNldDJcIjoge1xuXHRcdHRpdGxlOiBcIlNldCAyXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiQW4gYXJyYXkgb2YgZWlnaHQgY2F0ZWdvcmljYWwgY29sb3JzIHJlcHJlc2VudGVkIGFzIFJHQiBoZXhhZGVjaW1hbCBzdHJpbmdzLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJzY2hlbWVcIiwgXCJjYXRlZ29yaWNhbFwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLnNjaGVtZVNldDI7XG5cdFx0fVxuXHR9LFxuXG5cdFwiZDMuc2NoZW1lU2V0M1wiOiB7XG5cdFx0dGl0bGU6IFwiU2V0IDNcIixcblx0XHRkZXNjcmlwdGlvbjogXCJBbiBhcnJheSBvZiB0d2VsdmUgY2F0ZWdvcmljYWwgY29sb3JzIHJlcHJlc2VudGVkIGFzIFJHQiBoZXhhZGVjaW1hbCBzdHJpbmdzLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJzY2hlbWVcIiwgXCJjYXRlZ29yaWNhbFwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLnNjaGVtZVNldDM7XG5cdFx0fVxuXHR9LFxuXHRcdFxuXHQvLyBTY2hlbWUgRGl2ZXJnaW5nXG5cdFxuXHRcImQzLnNjaGVtZUJyQkdcIjoge1xuXHRcdHRpdGxlOiBcIkJyQkdcIixcblx0XHRkZXNjcmlwdGlvbjogXCJHaXZlbiBhIG51bWJlciB0IGluIHRoZSByYW5nZSBbMCwxXSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBjb2xvciBmcm9tIHRoZSAnQnJCRycgZGl2ZXJnaW5nIGNvbG9yIHNjaGVtZSByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJzY2hlbWVcIiwgXCJkaXZlcmdpbmdcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5zY2hlbWVCckJHO1x0XG5cdFx0fVxuXHR9LFxuXHRcblx0XCJkMy5zY2hlbWVQUkduXCI6IHtcblx0XHR0aXRsZTogXCJQUkduXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR2l2ZW4gYSBudW1iZXIgdCBpbiB0aGUgcmFuZ2UgWzAsMV0sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgY29sb3IgZnJvbSB0aGUgJ1BSR24nIGRpdmVyZ2luZyBjb2xvciBzY2hlbWUgcmVwcmVzZW50ZWQgYXMgYW4gUkdCIHN0cmluZy5cIixcblx0XHRjYXRlZ29yeTogW1wic2NoZW1lXCIsIFwiZGl2ZXJnaW5nXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuc2NoZW1lUFJHbjtcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuc2NoZW1lUGlZR1wiOiB7XG5cdFx0dGl0bGU6IFwiUGlZR1wiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkdpdmVuIGEgbnVtYmVyIHQgaW4gdGhlIHJhbmdlIFswLDFdLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGNvbG9yIGZyb20gdGhlICdQaVlHJyBkaXZlcmdpbmcgY29sb3Igc2NoZW1lIHJlcHJlc2VudGVkIGFzIGFuIFJHQiBzdHJpbmcuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcInNjaGVtZVwiLCBcImRpdmVyZ2luZ1wiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLnNjaGVtZVBpWUc7XHRcblx0XHR9XG5cdH0sXG5cdFxuXHRcImQzLnNjaGVtZVB1T3JcIjoge1xuXHRcdHRpdGxlOiBcIlB1T3JcIixcblx0XHRkZXNjcmlwdGlvbjogXCJHaXZlbiBhIG51bWJlciB0IGluIHRoZSByYW5nZSBbMCwxXSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBjb2xvciBmcm9tIHRoZSAnUHVPcicgZGl2ZXJnaW5nIGNvbG9yIHNjaGVtZSByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJzY2hlbWVcIiwgXCJkaXZlcmdpbmdcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5zY2hlbWVQdU9yO1x0XG5cdFx0fVxuXHR9LFxuXHRcblx0XCJkMy5zY2hlbWVSZEJ1XCI6IHtcblx0XHR0aXRsZTogXCJSZEJ1XCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR2l2ZW4gYSBudW1iZXIgdCBpbiB0aGUgcmFuZ2UgWzAsMV0sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgY29sb3IgZnJvbSB0aGUgJ1JkQnUnIGRpdmVyZ2luZyBjb2xvciBzY2hlbWUgcmVwcmVzZW50ZWQgYXMgYW4gUkdCIHN0cmluZy5cIixcblx0XHRjYXRlZ29yeTogW1wic2NoZW1lXCIsIFwiZGl2ZXJnaW5nXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuc2NoZW1lUmRCdTtcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuc2NoZW1lUmRHeVwiOiB7XG5cdFx0dGl0bGU6IFwiUmRHeVwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkdpdmVuIGEgbnVtYmVyIHQgaW4gdGhlIHJhbmdlIFswLDFdLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGNvbG9yIGZyb20gdGhlICdSZEd5JyBkaXZlcmdpbmcgY29sb3Igc2NoZW1lIHJlcHJlc2VudGVkIGFzIGFuIFJHQiBzdHJpbmcuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcInNjaGVtZVwiLCBcImRpdmVyZ2luZ1wiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLnNjaGVtZVJkR3k7XHRcblx0XHR9XG5cdH0sXG5cdFxuXHRcImQzLnNjaGVtZVJkWWxCdVwiOiB7XG5cdFx0dGl0bGU6IFwiUmRZbEJ1XCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR2l2ZW4gYSBudW1iZXIgdCBpbiB0aGUgcmFuZ2UgWzAsMV0sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgY29sb3IgZnJvbSB0aGUgJ1JkWWxCdScgZGl2ZXJnaW5nIGNvbG9yIHNjaGVtZSByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJzY2hlbWVcIiwgXCJkaXZlcmdpbmdcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5zY2hlbWVSZFlsQnU7XHRcblx0XHR9XG5cdH0sXG5cdFxuXHRcImQzLnNjaGVtZVJkWWxHblwiOiB7XG5cdFx0dGl0bGU6IFwiUmRZbEduXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR2l2ZW4gYSBudW1iZXIgdCBpbiB0aGUgcmFuZ2UgWzAsMV0sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgY29sb3IgZnJvbSB0aGUgJ1JkWWxHbicgZGl2ZXJnaW5nIGNvbG9yIHNjaGVtZSByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJzY2hlbWVcIiwgXCJkaXZlcmdpbmdcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5zY2hlbWVSZFlsR247XHRcblx0XHR9XG5cdH0sXG5cdFxuXHRcImQzLnNjaGVtZVNwZWN0cmFsXCI6IHtcblx0XHR0aXRsZTogXCJTcGVjdHJhbFwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkdpdmVuIGEgbnVtYmVyIHQgaW4gdGhlIHJhbmdlIFswLDFdLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGNvbG9yIGZyb20gdGhlICdTcGVjdHJhbCcgZGl2ZXJnaW5nIGNvbG9yIHNjaGVtZSByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJzY2hlbWVcIiwgXCJkaXZlcmdpbmdcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5zY2hlbWVTcGVjdHJhbDtcdFxuXHRcdH1cblx0fSxcblx0XG5cdC8vIFNjaGVtZSBTZXF1ZW50aWFsXG5cdFxuXHRcImQzLnNjaGVtZUJsdWVzXCI6IHtcblx0XHR0aXRsZTogXCJCbHVlc1wiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkdpdmVuIGEgbnVtYmVyIHQgaW4gdGhlIHJhbmdlIFswLDFdLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGNvbG9yIGZyb20gdGhlICdCbHVlcycgc2VxdWVudGlhbCBjb2xvciBzY2hlbWUgcmVwcmVzZW50ZWQgYXMgYW4gUkdCIHN0cmluZy5cIixcblx0XHRjYXRlZ29yeTogW1wic2NoZW1lXCIsIFwic2VxdWVudGlhbFwiLCBcInNpbmdsZSBodWVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5zY2hlbWVCbHVlcztcdFxuXHRcdH1cblx0fSxcblxuXHRcImQzLnNjaGVtZUdyZWVuc1wiOiB7XG5cdFx0dGl0bGU6IFwiR3JlZW5zXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR2l2ZW4gYSBudW1iZXIgdCBpbiB0aGUgcmFuZ2UgWzAsMV0sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgY29sb3IgZnJvbSB0aGUgJ0dyZWVucycgc2VxdWVudGlhbCBjb2xvciBzY2hlbWUgcmVwcmVzZW50ZWQgYXMgYW4gUkdCIHN0cmluZy5cIixcblx0XHRjYXRlZ29yeTogW1wic2NoZW1lXCIsIFwic2VxdWVudGlhbFwiLCBcInNpbmdsZSBodWVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5zY2hlbWVHcmVlbnM7XHRcblx0XHR9XG5cdH0sXG5cdFxuXHRcImQzLnNjaGVtZUdyZXlzXCI6IHtcblx0XHR0aXRsZTogXCJHcmV5c1wiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkdpdmVuIGEgbnVtYmVyIHQgaW4gdGhlIHJhbmdlIFswLDFdLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGNvbG9yIGZyb20gdGhlICdHcmV5cycgc2VxdWVudGlhbCBjb2xvciBzY2hlbWUgcmVwcmVzZW50ZWQgYXMgYW4gUkdCIHN0cmluZy5cIixcblx0XHRjYXRlZ29yeTogW1wic2NoZW1lXCIsIFwic2VxdWVudGlhbFwiLCBcInNpbmdsZSBodWVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5zY2hlbWVHcmV5cztcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuc2NoZW1lT3Jhbmdlc1wiOiB7XG5cdFx0dGl0bGU6IFwiT3Jhbmdlc1wiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkdpdmVuIGEgbnVtYmVyIHQgaW4gdGhlIHJhbmdlIFswLDFdLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGNvbG9yIGZyb20gdGhlICdPcmFuZ2VzJyBzZXF1ZW50aWFsIGNvbG9yIHNjaGVtZSByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJzY2hlbWVcIiwgXCJzZXF1ZW50aWFsXCIsIFwic2luZ2xlIGh1ZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLnNjaGVtZU9yYW5nZXM7XHRcblx0XHR9XG5cdH0sXG5cdFxuXHRcImQzLnNjaGVtZVB1cnBsZXNcIjoge1xuXHRcdHRpdGxlOiBcIlB1cnBsZXNcIixcblx0XHRkZXNjcmlwdGlvbjogXCJHaXZlbiBhIG51bWJlciB0IGluIHRoZSByYW5nZSBbMCwxXSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBjb2xvciBmcm9tIHRoZSAnUHVycGxlcycgc2VxdWVudGlhbCBjb2xvciBzY2hlbWUgcmVwcmVzZW50ZWQgYXMgYW4gUkdCIHN0cmluZy5cIixcblx0XHRjYXRlZ29yeTogW1wic2NoZW1lXCIsIFwic2VxdWVudGlhbFwiLCBcInNpbmdsZSBodWVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5zY2hlbWVQdXJwbGVzO1x0XG5cdFx0fVxuXHR9LFxuXG5cdFwiZDMuc2NoZW1lUmVkc1wiOiB7XG5cdFx0dGl0bGU6IFwiUmVkc1wiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkdpdmVuIGEgbnVtYmVyIHQgaW4gdGhlIHJhbmdlIFswLDFdLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGNvbG9yIGZyb20gdGhlICdSZWRzJyBzZXF1ZW50aWFsIGNvbG9yIHNjaGVtZSByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJzY2hlbWVcIiwgXCJzZXF1ZW50aWFsXCIsIFwic2luZ2xlIGh1ZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLnNjaGVtZVJlZHM7XHRcblx0XHR9XG5cdH0sXG5cdFxuXHRcImQzLnNjaGVtZUJ1R25cIjoge1xuXHRcdHRpdGxlOiBcIkJ1R25cIixcblx0XHRkZXNjcmlwdGlvbjogXCJHaXZlbiBhIG51bWJlciB0IGluIHRoZSByYW5nZSBbMCwxXSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBjb2xvciBmcm9tIHRoZSAnQnVHbicgc2VxdWVudGlhbCBjb2xvciBzY2hlbWUgcmVwcmVzZW50ZWQgYXMgYW4gUkdCIHN0cmluZy5cIixcblx0XHRjYXRlZ29yeTogW1wic2NoZW1lXCIsIFwic2VxdWVudGlhbFwiLCBcIm11bHRpIGh1ZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLnNjaGVtZUJ1R247XHRcblx0XHR9XG5cdH0sXG5cdFxuXHRcImQzLnNjaGVtZUJ1UHVcIjoge1xuXHRcdHRpdGxlOiBcIkJ1UHVcIixcblx0XHRkZXNjcmlwdGlvbjogXCJHaXZlbiBhIG51bWJlciB0IGluIHRoZSByYW5nZSBbMCwxXSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBjb2xvciBmcm9tIHRoZSAnQnVQdScgc2VxdWVudGlhbCBjb2xvciBzY2hlbWUgcmVwcmVzZW50ZWQgYXMgYW4gUkdCIHN0cmluZy5cIixcblx0XHRjYXRlZ29yeTogW1wic2NoZW1lXCIsIFwic2VxdWVudGlhbFwiLCBcIm11bHRpIGh1ZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLnNjaGVtZUJ1UHU7XHRcblx0XHR9XG5cdH0sXG5cdFxuXHRcImQzLnNjaGVtZUduQnVcIjoge1xuXHRcdHRpdGxlOiBcIkduQnVcIixcblx0XHRkZXNjcmlwdGlvbjogXCJHaXZlbiBhIG51bWJlciB0IGluIHRoZSByYW5nZSBbMCwxXSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBjb2xvciBmcm9tIHRoZSAnR25CdScgc2VxdWVudGlhbCBjb2xvciBzY2hlbWUgcmVwcmVzZW50ZWQgYXMgYW4gUkdCIHN0cmluZy5cIixcblx0XHRjYXRlZ29yeTogW1wic2NoZW1lXCIsIFwic2VxdWVudGlhbFwiLCBcIm11bHRpIGh1ZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLnNjaGVtZUduQnU7XHRcblx0XHR9XG5cdH0sXG5cdFxuXHRcImQzLnNjaGVtZU9yUmRcIjoge1xuXHRcdHRpdGxlOiBcIk9yUmRcIixcblx0XHRkZXNjcmlwdGlvbjogXCJHaXZlbiBhIG51bWJlciB0IGluIHRoZSByYW5nZSBbMCwxXSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBjb2xvciBmcm9tIHRoZSAnT3JSZCcgc2VxdWVudGlhbCBjb2xvciBzY2hlbWUgcmVwcmVzZW50ZWQgYXMgYW4gUkdCIHN0cmluZy5cIixcblx0XHRjYXRlZ29yeTogW1wic2NoZW1lXCIsIFwic2VxdWVudGlhbFwiLCBcIm11bHRpIGh1ZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLnNjaGVtZU9yUmQ7XHRcblx0XHR9XG5cdH0sXG5cdFxuXHRcImQzLnNjaGVtZVB1QnVHblwiOiB7XG5cdFx0dGl0bGU6IFwiUHVCdUduXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR2l2ZW4gYSBudW1iZXIgdCBpbiB0aGUgcmFuZ2UgWzAsMV0sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgY29sb3IgZnJvbSB0aGUgJ1B1QnVHbicgc2VxdWVudGlhbCBjb2xvciBzY2hlbWUgcmVwcmVzZW50ZWQgYXMgYW4gUkdCIHN0cmluZy5cIixcblx0XHRjYXRlZ29yeTogW1wic2NoZW1lXCIsIFwic2VxdWVudGlhbFwiLCBcIm11bHRpIGh1ZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLnNjaGVtZVB1QnVHbjtcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuc2NoZW1lUHVCdVwiOiB7XG5cdFx0dGl0bGU6IFwiUHVCdVwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkdpdmVuIGEgbnVtYmVyIHQgaW4gdGhlIHJhbmdlIFswLDFdLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGNvbG9yIGZyb20gdGhlICdQdUJ1JyBzZXF1ZW50aWFsIGNvbG9yIHNjaGVtZSByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJzY2hlbWVcIiwgXCJzZXF1ZW50aWFsXCIsIFwibXVsdGkgaHVlXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuc2NoZW1lUHVCdTtcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuc2NoZW1lUHVSZFwiOiB7XG5cdFx0dGl0bGU6IFwiUHVSZFwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkdpdmVuIGEgbnVtYmVyIHQgaW4gdGhlIHJhbmdlIFswLDFdLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGNvbG9yIGZyb20gdGhlICdQdVJkJyBzZXF1ZW50aWFsIGNvbG9yIHNjaGVtZSByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJzY2hlbWVcIiwgXCJzZXF1ZW50aWFsXCIsIFwibXVsdGkgaHVlXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuc2NoZW1lUHVSZDtcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuc2NoZW1lUmRQdVwiOiB7XG5cdFx0dGl0bGU6IFwiUmRQdVwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkdpdmVuIGEgbnVtYmVyIHQgaW4gdGhlIHJhbmdlIFswLDFdLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGNvbG9yIGZyb20gdGhlICdSZFB1JyBzZXF1ZW50aWFsIGNvbG9yIHNjaGVtZSByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJzY2hlbWVcIiwgXCJzZXF1ZW50aWFsXCIsIFwibXVsdGkgaHVlXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuc2NoZW1lUmRQdTtcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuc2NoZW1lWWxHbkJ1XCI6IHtcblx0XHR0aXRsZTogXCJZbEduQnVcIixcblx0XHRkZXNjcmlwdGlvbjogXCJHaXZlbiBhIG51bWJlciB0IGluIHRoZSByYW5nZSBbMCwxXSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBjb2xvciBmcm9tIHRoZSAnWWxHbkJ1JyBzZXF1ZW50aWFsIGNvbG9yIHNjaGVtZSByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJzY2hlbWVcIiwgXCJzZXF1ZW50aWFsXCIsIFwibXVsdGkgaHVlXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuc2NoZW1lWWxHbkJ1O1x0XG5cdFx0fVxuXHR9LFxuXHRcblx0XCJkMy5zY2hlbWVZbEduXCI6IHtcblx0XHR0aXRsZTogXCJZbEduXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR2l2ZW4gYSBudW1iZXIgdCBpbiB0aGUgcmFuZ2UgWzAsMV0sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgY29sb3IgZnJvbSB0aGUgJ1lsR24nIHNlcXVlbnRpYWwgY29sb3Igc2NoZW1lIHJlcHJlc2VudGVkIGFzIGFuIFJHQiBzdHJpbmcuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcInNjaGVtZVwiLCBcInNlcXVlbnRpYWxcIiwgXCJtdWx0aSBodWVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5zY2hlbWVZbEduO1x0XG5cdFx0fVxuXHR9LFxuXHRcblx0XCJkMy5zY2hlbWVZbE9yQnJcIjoge1xuXHRcdHRpdGxlOiBcIllsT3JCclwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkdpdmVuIGEgbnVtYmVyIHQgaW4gdGhlIHJhbmdlIFswLDFdLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGNvbG9yIGZyb20gdGhlICdZbE9yQnInIHNlcXVlbnRpYWwgY29sb3Igc2NoZW1lIHJlcHJlc2VudGVkIGFzIGFuIFJHQiBzdHJpbmcuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcInNjaGVtZVwiLCBcInNlcXVlbnRpYWxcIiwgXCJtdWx0aSBodWVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5zY2hlbWVZbE9yQnI7XHRcblx0XHR9XG5cdH0sXG5cdFxuXHRcImQzLnNjaGVtZVlsT3JSZFwiOiB7XG5cdFx0dGl0bGU6IFwiWWxPclJkXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR2l2ZW4gYSBudW1iZXIgdCBpbiB0aGUgcmFuZ2UgWzAsMV0sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgY29sb3IgZnJvbSB0aGUgJ1lsT3JSZCcgc2VxdWVudGlhbCBjb2xvciBzY2hlbWUgcmVwcmVzZW50ZWQgYXMgYW4gUkdCIHN0cmluZy5cIixcblx0XHRjYXRlZ29yeTogW1wic2NoZW1lXCIsIFwic2VxdWVudGlhbFwiLCBcIm11bHRpIGh1ZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLnNjaGVtZVlsT3JSZDtcdFxuXHRcdH1cblx0fSxcblx0XG5cdC8vIEludGVycG9sYXRlIERpdmVyZ2luZ1xuXHRcblx0XCJkMy5pbnRlcnBvbGF0ZUJyQkdcIjoge1xuXHRcdHRpdGxlOiBcIkJyQkdcIixcblx0XHRkZXNjcmlwdGlvbjogXCJHaXZlbiBhIG51bWJlciB0IGluIHRoZSByYW5nZSBbMCwxXSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBjb2xvciBmcm9tIHRoZSAnQnJCRycgZGl2ZXJnaW5nIGNvbG9yIHNjaGVtZSByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJpbnRlcnBvbGF0ZVwiLCBcImRpdmVyZ2luZ1wiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmludGVycG9sYXRlQnJCRztcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuaW50ZXJwb2xhdGVQUkduXCI6IHtcblx0XHR0aXRsZTogXCJQUkduXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR2l2ZW4gYSBudW1iZXIgdCBpbiB0aGUgcmFuZ2UgWzAsMV0sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgY29sb3IgZnJvbSB0aGUgJ1BSR24nIGRpdmVyZ2luZyBjb2xvciBzY2hlbWUgcmVwcmVzZW50ZWQgYXMgYW4gUkdCIHN0cmluZy5cIixcblx0XHRjYXRlZ29yeTogW1wiaW50ZXJwb2xhdGVcIiwgXCJkaXZlcmdpbmdcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5pbnRlcnBvbGF0ZVBSR247XHRcblx0XHR9XG5cdH0sXG5cdFxuXHRcImQzLmludGVycG9sYXRlUGlZR1wiOiB7XG5cdFx0dGl0bGU6IFwiUGlZR1wiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkdpdmVuIGEgbnVtYmVyIHQgaW4gdGhlIHJhbmdlIFswLDFdLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGNvbG9yIGZyb20gdGhlICdQaVlHJyBkaXZlcmdpbmcgY29sb3Igc2NoZW1lIHJlcHJlc2VudGVkIGFzIGFuIFJHQiBzdHJpbmcuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImludGVycG9sYXRlXCIsIFwiZGl2ZXJnaW5nXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuaW50ZXJwb2xhdGVQaVlHO1x0XG5cdFx0fVxuXHR9LFxuXHRcblx0XCJkMy5pbnRlcnBvbGF0ZVB1T3JcIjoge1xuXHRcdHRpdGxlOiBcIlB1T3JcIixcblx0XHRkZXNjcmlwdGlvbjogXCJHaXZlbiBhIG51bWJlciB0IGluIHRoZSByYW5nZSBbMCwxXSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBjb2xvciBmcm9tIHRoZSAnUHVPcicgZGl2ZXJnaW5nIGNvbG9yIHNjaGVtZSByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJpbnRlcnBvbGF0ZVwiLCBcImRpdmVyZ2luZ1wiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmludGVycG9sYXRlUHVPcjtcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuaW50ZXJwb2xhdGVSZEJ1XCI6IHtcblx0XHR0aXRsZTogXCJSZEJ1XCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR2l2ZW4gYSBudW1iZXIgdCBpbiB0aGUgcmFuZ2UgWzAsMV0sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgY29sb3IgZnJvbSB0aGUgJ1JkQnUnIGRpdmVyZ2luZyBjb2xvciBzY2hlbWUgcmVwcmVzZW50ZWQgYXMgYW4gUkdCIHN0cmluZy5cIixcblx0XHRjYXRlZ29yeTogW1wiaW50ZXJwb2xhdGVcIiwgXCJkaXZlcmdpbmdcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5pbnRlcnBvbGF0ZVJkQnU7XHRcblx0XHR9XG5cdH0sXG5cdFxuXHRcImQzLmludGVycG9sYXRlUmRHeVwiOiB7XG5cdFx0dGl0bGU6IFwiUmRHeVwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkdpdmVuIGEgbnVtYmVyIHQgaW4gdGhlIHJhbmdlIFswLDFdLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGNvbG9yIGZyb20gdGhlICdSZEd5JyBkaXZlcmdpbmcgY29sb3Igc2NoZW1lIHJlcHJlc2VudGVkIGFzIGFuIFJHQiBzdHJpbmcuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImludGVycG9sYXRlXCIsIFwiZGl2ZXJnaW5nXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuaW50ZXJwb2xhdGVSZEd5O1x0XG5cdFx0fVxuXHR9LFxuXHRcblx0XCJkMy5pbnRlcnBvbGF0ZVJkWWxCdVwiOiB7XG5cdFx0dGl0bGU6IFwiUmRZbEJ1XCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR2l2ZW4gYSBudW1iZXIgdCBpbiB0aGUgcmFuZ2UgWzAsMV0sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgY29sb3IgZnJvbSB0aGUgJ1JkWWxCdScgZGl2ZXJnaW5nIGNvbG9yIHNjaGVtZSByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJpbnRlcnBvbGF0ZVwiLCBcImRpdmVyZ2luZ1wiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmludGVycG9sYXRlUmRZbEJ1O1x0XG5cdFx0fVxuXHR9LFxuXHRcblx0XCJkMy5pbnRlcnBvbGF0ZVJkWWxHblwiOiB7XG5cdFx0dGl0bGU6IFwiUmRZbEduXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR2l2ZW4gYSBudW1iZXIgdCBpbiB0aGUgcmFuZ2UgWzAsMV0sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgY29sb3IgZnJvbSB0aGUgJ1JkWWxHbicgZGl2ZXJnaW5nIGNvbG9yIHNjaGVtZSByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJpbnRlcnBvbGF0ZVwiLCBcImRpdmVyZ2luZ1wiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmludGVycG9sYXRlUmRZbEduO1x0XG5cdFx0fVxuXHR9LFxuXHRcblx0XCJkMy5pbnRlcnBvbGF0ZVNwZWN0cmFsXCI6IHtcblx0XHR0aXRsZTogXCJTcGVjdHJhbFwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkdpdmVuIGEgbnVtYmVyIHQgaW4gdGhlIHJhbmdlIFswLDFdLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGNvbG9yIGZyb20gdGhlICdTcGVjdHJhbCcgZGl2ZXJnaW5nIGNvbG9yIHNjaGVtZSByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJpbnRlcnBvbGF0ZVwiLCBcImRpdmVyZ2luZ1wiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmludGVycG9sYXRlU3BlY3RyYWw7XHRcblx0XHR9XG5cdH0sXG5cdFx0XG5cdC8vIEludGVycG9sYXRlIFNlcXVlbnRpYWxcblx0XG5cdFwiZDMuaW50ZXJwb2xhdGVCbHVlc1wiOiB7XG5cdFx0dGl0bGU6IFwiQmx1ZXNcIixcblx0XHRkZXNjcmlwdGlvbjogXCJHaXZlbiBhIG51bWJlciB0IGluIHRoZSByYW5nZSBbMCwxXSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBjb2xvciBmcm9tIHRoZSAnQmx1ZXMnIHNlcXVlbnRpYWwgY29sb3Igc2NoZW1lIHJlcHJlc2VudGVkIGFzIGFuIFJHQiBzdHJpbmcuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImludGVycG9sYXRlXCIsIFwic2VxdWVudGlhbFwiLCBcInNpbmdsZSBodWVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5pbnRlcnBvbGF0ZUJsdWVzO1x0XG5cdFx0fVxuXHR9LFxuXG5cdFwiZDMuaW50ZXJwb2xhdGVHcmVlbnNcIjoge1xuXHRcdHRpdGxlOiBcIkdyZWVuc1wiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkdpdmVuIGEgbnVtYmVyIHQgaW4gdGhlIHJhbmdlIFswLDFdLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGNvbG9yIGZyb20gdGhlICdHcmVlbnMnIHNlcXVlbnRpYWwgY29sb3Igc2NoZW1lIHJlcHJlc2VudGVkIGFzIGFuIFJHQiBzdHJpbmcuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImludGVycG9sYXRlXCIsIFwic2VxdWVudGlhbFwiLCBcInNpbmdsZSBodWVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5pbnRlcnBvbGF0ZUdyZWVucztcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuaW50ZXJwb2xhdGVHcmV5c1wiOiB7XG5cdFx0dGl0bGU6IFwiR3JleXNcIixcblx0XHRkZXNjcmlwdGlvbjogXCJHaXZlbiBhIG51bWJlciB0IGluIHRoZSByYW5nZSBbMCwxXSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBjb2xvciBmcm9tIHRoZSAnR3JleXMnIHNlcXVlbnRpYWwgY29sb3Igc2NoZW1lIHJlcHJlc2VudGVkIGFzIGFuIFJHQiBzdHJpbmcuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImludGVycG9sYXRlXCIsIFwic2VxdWVudGlhbFwiLCBcInNpbmdsZSBodWVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5pbnRlcnBvbGF0ZUdyZXlzO1x0XG5cdFx0fVxuXHR9LFxuXHRcblx0XCJkMy5pbnRlcnBvbGF0ZU9yYW5nZXNcIjoge1xuXHRcdHRpdGxlOiBcIk9yYW5nZXNcIixcblx0XHRkZXNjcmlwdGlvbjogXCJHaXZlbiBhIG51bWJlciB0IGluIHRoZSByYW5nZSBbMCwxXSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBjb2xvciBmcm9tIHRoZSAnT3Jhbmdlcycgc2VxdWVudGlhbCBjb2xvciBzY2hlbWUgcmVwcmVzZW50ZWQgYXMgYW4gUkdCIHN0cmluZy5cIixcblx0XHRjYXRlZ29yeTogW1wiaW50ZXJwb2xhdGVcIiwgXCJzZXF1ZW50aWFsXCIsIFwic2luZ2xlIGh1ZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmludGVycG9sYXRlT3JhbmdlcztcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuaW50ZXJwb2xhdGVQdXJwbGVzXCI6IHtcblx0XHR0aXRsZTogXCJQdXJwbGVzXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR2l2ZW4gYSBudW1iZXIgdCBpbiB0aGUgcmFuZ2UgWzAsMV0sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgY29sb3IgZnJvbSB0aGUgJ1B1cnBsZXMnIHNlcXVlbnRpYWwgY29sb3Igc2NoZW1lIHJlcHJlc2VudGVkIGFzIGFuIFJHQiBzdHJpbmcuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImludGVycG9sYXRlXCIsIFwic2VxdWVudGlhbFwiLCBcInNpbmdsZSBodWVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5pbnRlcnBvbGF0ZVB1cnBsZXM7XHRcblx0XHR9XG5cdH0sXG5cblx0XCJkMy5pbnRlcnBvbGF0ZVJlZHNcIjoge1xuXHRcdHRpdGxlOiBcIlJlZHNcIixcblx0XHRkZXNjcmlwdGlvbjogXCJHaXZlbiBhIG51bWJlciB0IGluIHRoZSByYW5nZSBbMCwxXSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBjb2xvciBmcm9tIHRoZSAnUmVkcycgc2VxdWVudGlhbCBjb2xvciBzY2hlbWUgcmVwcmVzZW50ZWQgYXMgYW4gUkdCIHN0cmluZy5cIixcblx0XHRjYXRlZ29yeTogW1wiaW50ZXJwb2xhdGVcIiwgXCJzZXF1ZW50aWFsXCIsIFwic2luZ2xlIGh1ZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmludGVycG9sYXRlUmVkcztcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuaW50ZXJwb2xhdGVCdUduXCI6IHtcblx0XHR0aXRsZTogXCJCdUduXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR2l2ZW4gYSBudW1iZXIgdCBpbiB0aGUgcmFuZ2UgWzAsMV0sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgY29sb3IgZnJvbSB0aGUgJ0J1R24nIHNlcXVlbnRpYWwgY29sb3Igc2NoZW1lIHJlcHJlc2VudGVkIGFzIGFuIFJHQiBzdHJpbmcuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImludGVycG9sYXRlXCIsIFwic2VxdWVudGlhbFwiLCBcIm11bHRpIGh1ZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmludGVycG9sYXRlQnVHbjtcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuaW50ZXJwb2xhdGVCdVB1XCI6IHtcblx0XHR0aXRsZTogXCJCdVB1XCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR2l2ZW4gYSBudW1iZXIgdCBpbiB0aGUgcmFuZ2UgWzAsMV0sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgY29sb3IgZnJvbSB0aGUgJ0J1UHUnIHNlcXVlbnRpYWwgY29sb3Igc2NoZW1lIHJlcHJlc2VudGVkIGFzIGFuIFJHQiBzdHJpbmcuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImludGVycG9sYXRlXCIsIFwic2VxdWVudGlhbFwiLCBcIm11bHRpIGh1ZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmludGVycG9sYXRlQnVQdTtcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuaW50ZXJwb2xhdGVHbkJ1XCI6IHtcblx0XHR0aXRsZTogXCJHbkJ1XCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR2l2ZW4gYSBudW1iZXIgdCBpbiB0aGUgcmFuZ2UgWzAsMV0sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgY29sb3IgZnJvbSB0aGUgJ0duQnUnIHNlcXVlbnRpYWwgY29sb3Igc2NoZW1lIHJlcHJlc2VudGVkIGFzIGFuIFJHQiBzdHJpbmcuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImludGVycG9sYXRlXCIsIFwic2VxdWVudGlhbFwiLCBcIm11bHRpIGh1ZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmludGVycG9sYXRlR25CdTtcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuaW50ZXJwb2xhdGVPclJkXCI6IHtcblx0XHR0aXRsZTogXCJPclJkXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR2l2ZW4gYSBudW1iZXIgdCBpbiB0aGUgcmFuZ2UgWzAsMV0sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgY29sb3IgZnJvbSB0aGUgJ09yUmQnIHNlcXVlbnRpYWwgY29sb3Igc2NoZW1lIHJlcHJlc2VudGVkIGFzIGFuIFJHQiBzdHJpbmcuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImludGVycG9sYXRlXCIsIFwic2VxdWVudGlhbFwiLCBcIm11bHRpIGh1ZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmludGVycG9sYXRlT3JSZDtcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuaW50ZXJwb2xhdGVQdUJ1R25cIjoge1xuXHRcdHRpdGxlOiBcIlB1QnVHblwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkdpdmVuIGEgbnVtYmVyIHQgaW4gdGhlIHJhbmdlIFswLDFdLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGNvbG9yIGZyb20gdGhlICdQdUJ1R24nIHNlcXVlbnRpYWwgY29sb3Igc2NoZW1lIHJlcHJlc2VudGVkIGFzIGFuIFJHQiBzdHJpbmcuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImludGVycG9sYXRlXCIsIFwic2VxdWVudGlhbFwiLCBcIm11bHRpIGh1ZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmludGVycG9sYXRlUHVCdUduO1x0XG5cdFx0fVxuXHR9LFxuXHRcblx0XCJkMy5pbnRlcnBvbGF0ZVB1QnVcIjoge1xuXHRcdHRpdGxlOiBcIlB1QnVcIixcblx0XHRkZXNjcmlwdGlvbjogXCJHaXZlbiBhIG51bWJlciB0IGluIHRoZSByYW5nZSBbMCwxXSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBjb2xvciBmcm9tIHRoZSAnUHVCdScgc2VxdWVudGlhbCBjb2xvciBzY2hlbWUgcmVwcmVzZW50ZWQgYXMgYW4gUkdCIHN0cmluZy5cIixcblx0XHRjYXRlZ29yeTogW1wiaW50ZXJwb2xhdGVcIiwgXCJzZXF1ZW50aWFsXCIsIFwibXVsdGkgaHVlXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuaW50ZXJwb2xhdGVQdUJ1O1x0XG5cdFx0fVxuXHR9LFxuXHRcblx0XCJkMy5pbnRlcnBvbGF0ZVB1UmRcIjoge1xuXHRcdHRpdGxlOiBcIlB1UmRcIixcblx0XHRkZXNjcmlwdGlvbjogXCJHaXZlbiBhIG51bWJlciB0IGluIHRoZSByYW5nZSBbMCwxXSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBjb2xvciBmcm9tIHRoZSAnUHVSZCcgc2VxdWVudGlhbCBjb2xvciBzY2hlbWUgcmVwcmVzZW50ZWQgYXMgYW4gUkdCIHN0cmluZy5cIixcblx0XHRjYXRlZ29yeTogW1wiaW50ZXJwb2xhdGVcIiwgXCJzZXF1ZW50aWFsXCIsIFwibXVsdGkgaHVlXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuaW50ZXJwb2xhdGVQdVJkO1x0XG5cdFx0fVxuXHR9LFxuXHRcblx0XCJkMy5pbnRlcnBvbGF0ZVJkUHVcIjoge1xuXHRcdHRpdGxlOiBcIlJkUHVcIixcblx0XHRkZXNjcmlwdGlvbjogXCJHaXZlbiBhIG51bWJlciB0IGluIHRoZSByYW5nZSBbMCwxXSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBjb2xvciBmcm9tIHRoZSAnUmRQdScgc2VxdWVudGlhbCBjb2xvciBzY2hlbWUgcmVwcmVzZW50ZWQgYXMgYW4gUkdCIHN0cmluZy5cIixcblx0XHRjYXRlZ29yeTogW1wiaW50ZXJwb2xhdGVcIiwgXCJzZXF1ZW50aWFsXCIsIFwibXVsdGkgaHVlXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuaW50ZXJwb2xhdGVSZFB1O1x0XG5cdFx0fVxuXHR9LFxuXHRcblx0XCJkMy5pbnRlcnBvbGF0ZVlsR25CdVwiOiB7XG5cdFx0dGl0bGU6IFwiWWxHbkJ1XCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR2l2ZW4gYSBudW1iZXIgdCBpbiB0aGUgcmFuZ2UgWzAsMV0sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgY29sb3IgZnJvbSB0aGUgJ1lsR25CdScgc2VxdWVudGlhbCBjb2xvciBzY2hlbWUgcmVwcmVzZW50ZWQgYXMgYW4gUkdCIHN0cmluZy5cIixcblx0XHRjYXRlZ29yeTogW1wiaW50ZXJwb2xhdGVcIiwgXCJzZXF1ZW50aWFsXCIsIFwibXVsdGkgaHVlXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZDMuaW50ZXJwb2xhdGVZbEduQnU7XHRcblx0XHR9XG5cdH0sXG5cdFxuXHRcImQzLmludGVycG9sYXRlWWxHblwiOiB7XG5cdFx0dGl0bGU6IFwiWWxHblwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkdpdmVuIGEgbnVtYmVyIHQgaW4gdGhlIHJhbmdlIFswLDFdLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGNvbG9yIGZyb20gdGhlICdZbEduJyBzZXF1ZW50aWFsIGNvbG9yIHNjaGVtZSByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJpbnRlcnBvbGF0ZVwiLCBcInNlcXVlbnRpYWxcIiwgXCJtdWx0aSBodWVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5pbnRlcnBvbGF0ZVlsR247XHRcblx0XHR9XG5cdH0sXG5cdFxuXHRcImQzLmludGVycG9sYXRlWWxPckJyXCI6IHtcblx0XHR0aXRsZTogXCJZbE9yQnJcIixcblx0XHRkZXNjcmlwdGlvbjogXCJHaXZlbiBhIG51bWJlciB0IGluIHRoZSByYW5nZSBbMCwxXSwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBjb2xvciBmcm9tIHRoZSAnWWxPckJyJyBzZXF1ZW50aWFsIGNvbG9yIHNjaGVtZSByZXByZXNlbnRlZCBhcyBhbiBSR0Igc3RyaW5nLlwiLFxuXHRcdGNhdGVnb3J5OiBbXCJpbnRlcnBvbGF0ZVwiLCBcInNlcXVlbnRpYWxcIiwgXCJtdWx0aSBodWVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkMy5pbnRlcnBvbGF0ZVlsT3JCcjtcdFxuXHRcdH1cblx0fSxcblx0XG5cdFwiZDMuaW50ZXJwb2xhdGVZbE9yUmRcIjoge1xuXHRcdHRpdGxlOiBcIllsT3JSZFwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkdpdmVuIGEgbnVtYmVyIHQgaW4gdGhlIHJhbmdlIFswLDFdLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGNvbG9yIGZyb20gdGhlICdZbE9yUmQnIHNlcXVlbnRpYWwgY29sb3Igc2NoZW1lIHJlcHJlc2VudGVkIGFzIGFuIFJHQiBzdHJpbmcuXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImludGVycG9sYXRlXCIsIFwic2VxdWVudGlhbFwiLCBcIm11bHRpIGh1ZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGQzLmludGVycG9sYXRlWWxPclJkO1x0XG5cdFx0fVxuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzZXR1cEQzU2NhbGVDaHJvbWF0aWM7IiwiZXhwb3J0IHZhciBncmV5cyA9IG5ldyBBcnJheSgxKS5jb25jYXQoW1xuXHRbXCIjY2NjY2NjXCJdLFxuXHRbXCIjZTNlM2UzXCIsXCIjNjk2OTY5XCJdLFxuXHRbXCIjZTNlM2UzXCIsXCIjYTRhNGE0XCIsXCIjNjk2OTY5XCJdLFxuXHRbXCIjZTNlM2UzXCIsXCIjYjliOWI5XCIsXCIjOGY4ZjhmXCIsXCIjNjk2OTY5XCJdLFxuXHRbXCIjZTNlM2UzXCIsXCIjYzJjMmMyXCIsXCIjYTRhNGE0XCIsXCIjODU4NTg1XCIsXCIjNjk2OTY5XCJdLFxuXHRbXCIjZTNlM2UzXCIsXCIjY2FjYWNhXCIsXCIjYjBiMGIwXCIsXCIjOTc5Nzk3XCIsXCIjODA4MDgwXCIsXCIjNjk2OTY5XCJdLFxuXHRbXCIjZTNlM2UzXCIsXCIjY2VjZWNlXCIsXCIjYjliOWI5XCIsXCIjYTRhNGE0XCIsXCIjOGY4ZjhmXCIsXCIjN2M3YzdjXCIsXCIjNjk2OTY5XCJdLFxuXHRbXCIjZTNlM2UzXCIsXCIjZDBkMGQwXCIsXCIjYmViZWJlXCIsXCIjYWRhZGFkXCIsXCIjOWI5YjliXCIsXCIjOGE4YThhXCIsXCIjNzk3OTc5XCIsXCIjNjk2OTY5XCJdLFxuXHRbXCIjZTNlM2UzXCIsXCIjZDNkM2QzXCIsXCIjYzJjMmMyXCIsXCIjYjNiM2IzXCIsXCIjYTRhNGE0XCIsXCIjOTQ5NDk0XCIsXCIjODU4NTg1XCIsXCIjNzg3ODc4XCIsXCIjNjk2OTY5XCJdXG5dKTtcblx0XHRcbmV4cG9ydCB2YXIgYmx1ZXMgPSBuZXcgQXJyYXkoMykuY29uY2F0KFtcblx0W1wiI2RkZDRlOFwiLFwiIzg2NmFiYVwiLFwiIzAwMDA4YlwiXSxcblx0W1wiI2RkZDRlOFwiLFwiI2EzOGNjYVwiLFwiIzY2NDhhYlwiLFwiIzAwMDA4YlwiXSxcblx0W1wiI2RkZDRlOFwiLFwiI2IyOWVkMVwiLFwiIzg2NmFiYVwiLFwiIzU1MzdhM1wiLFwiIzAwMDA4YlwiXSxcblx0W1wiI2RkZDRlOFwiLFwiI2JiYThkNlwiLFwiIzk3N2VjNFwiLFwiIzczNTZiMVwiLFwiIzRhMmQ5ZVwiLFwiIzAwMDA4YlwiXSxcblx0W1wiI2RkZDRlOFwiLFwiI2MwYjBkOVwiLFwiI2EzOGNjYVwiLFwiIzg2NmFiYVwiLFwiIzY2NDhhYlwiLFwiIzQyMjc5YlwiLFwiIzAwMDA4YlwiXSxcblx0W1wiI2RkZDRlOFwiLFwiI2M0YjVkYlwiLFwiI2FjOTZjZVwiLFwiIzkzNzhjMVwiLFwiIzc4NWJiNFwiLFwiIzVjM2ZhNlwiLFwiIzNjMjI5OVwiLFwiIzAwMDA4YlwiXSxcblx0W1wiI2RkZDRlOFwiLFwiI2M4YjhkZFwiLFwiI2IyOWVkMVwiLFwiIzljODRjNlwiLFwiIzg2NmFiYVwiLFwiIzZlNTFhZlwiLFwiIzU1MzdhM1wiLFwiIzM4MWU5N1wiLFwiIzAwMDA4YlwiXVxuXSk7XG5cdFx0XG5leHBvcnQgdmFyIGZld3M5ID0gW1wiIzRENEQ0RFwiLCBcIiM1REE1REFcIiwgXCIjRkFBNDNBXCIsIFwiIzYwQkQ2OFwiLCBcIiNGMTdDQjBcIiwgXCIjQjI5MTJGXCIsIFwiI0IyNzZCMlwiLCBcIiNERUNGM0ZcIiwgXCIjRjE1ODU0XCJdO1xuXG4vKlxuXHRzb3VyY2U6IGh0dHA6Ly9na2EuZ2l0aHViLmlvL3BhbGV0dGVzL1xuKi9cblxuZXhwb3J0IHZhciB5bE9yRHIgPSBuZXcgQXJyYXkoMykuY29uY2F0KFtcblx0W1wiI2ZmZmYwMFwiLFwiI2Q5ODMwMFwiLFwiIzhiMDAwMFwiXSxcblx0W1wiI2ZmZmYwMFwiLFwiI2VkYWEwMFwiLFwiI2MxNWYwMVwiLFwiIzhiMDAwMFwiXSxcblx0W1wiI2ZmZmYwMFwiLFwiI2Y1YmUwMFwiLFwiI2Q5ODMwMFwiLFwiI2I0NGMwMlwiLFwiIzhiMDAwMFwiXSxcblx0W1wiI2ZmZmYwMFwiLFwiI2Y5Y2EwMFwiLFwiI2U1OWIwMFwiLFwiI2NiNmMwMVwiLFwiI2FjNDAwMlwiLFwiIzhiMDAwMFwiXSxcblx0W1wiI2ZmZmYwMFwiLFwiI2ZiZDMwMFwiLFwiI2VkYWEwMFwiLFwiI2Q5ODMwMFwiLFwiI2MxNWYwMVwiLFwiI2E3MzgwMlwiLFwiIzhiMDAwMFwiXSxcblx0W1wiI2ZmZmYwMFwiLFwiI2ZkZGEwMFwiLFwiI2YyYjYwMFwiLFwiI2UyOTQwMFwiLFwiI2NmNzQwMVwiLFwiI2JhNTQwMVwiLFwiI2EzMzEwMlwiLFwiIzhiMDAwMFwiXSxcblx0W1wiI2ZmZmYwMFwiLFwiI2ZkZGUwMFwiLFwiI2Y1YmUwMFwiLFwiI2U4YTEwMFwiLFwiI2Q5ODMwMFwiLFwiI2M3NjgwMVwiLFwiI2I0NGMwMlwiLFwiI2EwMmUwMlwiLFwiIzhiMDAwMFwiXVxuXSk7XG5cdFxuZXhwb3J0IHZhciBkZ09yRHIgPSBuZXcgQXJyYXkoMykuY29uY2F0KFtcblx0W1wiIzAwNjQwMFwiLFwiI2ZmOGMwMFwiLFwiIzhiMDAwMFwiXSxcblx0W1wiIzAwNjQwMFwiLFwiI2E0OGIwMFwiLFwiI2VlNGQwMFwiLFwiIzhiMDAwMFwiXSxcblx0W1wiIzAwNjQwMFwiLFwiIzc5ODUwMFwiLFwiI2ZmOGMwMFwiLFwiI2RiMzMwMVwiLFwiIzhiMDAwMFwiXSxcblx0W1wiIzAwNjQwMFwiLFwiIzYxODEwMFwiLFwiI2M5OGQwMFwiLFwiI2Y5NjYwMFwiLFwiI2NkMjQwMVwiLFwiIzhiMDAwMFwiXSxcblx0W1wiIzAwNjQwMFwiLFwiIzRmN2MwMFwiLFwiI2E0OGIwMFwiLFwiI2ZmOGMwMFwiLFwiI2VlNGQwMFwiLFwiI2MzMWMwMlwiLFwiIzhiMDAwMFwiXSxcblx0W1wiIzAwNjQwMFwiLFwiIzQzN2EwMFwiLFwiIzhiODgwMFwiLFwiI2Q3OGUwMFwiLFwiI2ZjNmYwMFwiLFwiI2UzM2UwMFwiLFwiI2JiMTUwMlwiLFwiIzhiMDAwMFwiXSxcblx0W1wiIzAwNjQwMFwiLFwiIzNiNzgwMFwiLFwiIzc5ODUwMFwiLFwiI2I5OGQwMFwiLFwiI2ZmOGMwMFwiLFwiI2Y1NWMwMFwiLFwiI2RiMzMwMVwiLFwiI2I2MTEwMlwiLFwiIzhiMDAwMFwiXVxuXSk7XG4iLCJpbXBvcnQgKiBhcyBkMyBmcm9tIFwiZDNcIjtcblxuZXhwb3J0IHZhciBncmV5cyA9IGQzLmludGVycG9sYXRlUmdiKFwiI2QzZDNkM1wiLCBcIiMyYTJhMmFcIik7XG5leHBvcnQgdmFyIGJsdWVzID0gZDMuaW50ZXJwb2xhdGVSZ2IoXCIjYWRkOGU2XCIsIFwiIzIyMmIyZVwiKTtcbmV4cG9ydCB2YXIgYmxSZCA9IGQzLmludGVycG9sYXRlUmdiKFwiIzAwMDBmZlwiLFwiI2ZmMDAwMFwiKTsiLCJpbXBvcnQgKiBhcyBkMyBmcm9tIFwiZDNcIjtcblxuaW1wb3J0IHtcblx0c2NoZWR1bGVySW50ZXJ2YWxcbn0gZnJvbSBcIi4uLy4uL2RnZi1zY2hlZHVsZXJcIjtcblxuaW1wb3J0IHtcblx0cmVhZGVyRFNWLFxuXHRyZWFkZXJKU09OXG59IGZyb20gXCIuLi8uLi9kZ2YtcmVhZGVyXCI7XG5cbmltcG9ydCB7XG5cdHRlbXBsYXRlQXhpcyxcblx0dGVtcGxhdGVCYWNrZ3JvdW5kLFxuXHR0ZW1wbGF0ZUJhcixcblx0dGVtcGxhdGVCdWJibGUsXG5cdHRlbXBsYXRlRG90LFxuXHR0ZW1wbGF0ZVBpZSxcblx0dGVtcGxhdGVJbWFnZSxcblx0dGVtcGxhdGVMYWJlbCxcblx0dGVtcGxhdGVBcmNMYWJlbCxcblx0dGVtcGxhdGVQYWNrTGFiZWwsXG5cdHRlbXBsYXRlTGF5ZXJzLFxuXHR0ZW1wbGF0ZUxlZ2VuZCxcblx0dGVtcGxhdGVMaW5lLFxuXHRzdHlsZVBsYWluQ1NTLFxuXHRzdHlsZVJlc3BvbnNpdmVDU1Ncbn0gZnJvbSBcIi4uLy4uL2RnZi10ZW1wbGF0ZVwiO1xuXG5pbXBvcnQge1xuXHRzY2hlbWVEZWZhdWx0LFxuXHRzY2hlbWVHcmV5cyxcblx0c2NoZW1lQmx1ZXMsXG5cdHNjaGVtZUZld3M5LFxuXHRzY2hlbWVZbE9yRHIsXG5cdHNjaGVtZURnT3JEcixcblx0aW50ZXJwb2xhdGVHcmV5cyxcblx0aW50ZXJwb2xhdGVCbHVlcyxcblx0aW50ZXJwb2xhdGVCbFJkXG59IGZyb20gXCIuLi8uLi9kZ2Ytc2NoZW1lXCI7XG5cbmltcG9ydCB7IGZpbmRQYXJlbnRCeVNlbGVjdG9yIH0gZnJvbSBcIi4vdXRpbFwiO1xuXG5leHBvcnQgY29uc3Qgc2V0dXBER0YgPSB7XG5cblx0XCJkZ2Yuc2NoZWR1bGVySW50ZXJ2YWxcIjoge1x0XG5cdFx0dGl0bGU6IFwiSW50ZXJ2YWwgU2NoZWR1bGVyXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiSW50ZXJ2YWwgU2NoZWR1bGVyXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcInNjaGVkdWxlclwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKHRhZ0ZhY3RvcnksIG5hbWUsIHZhbHVlLCBjYWxsZWVzKSB7IFxuXHRcdFx0dmFyIHQgPSB0YWdGYWN0b3J5LmNyZWF0ZVRlbXBsYXRlKG5hbWUsIHZhbHVlLCBjYWxsZWVzLCBzY2hlZHVsZXJJbnRlcnZhbCgpKTtcblx0XHRcblx0XHRcdHQuY2FsbGJhY2soZnVuY3Rpb24oc2VsZWN0aW9uKSB7XG5cdFx0XHRcdHNlbGVjdGlvbi5lYWNoKGZ1bmN0aW9uKCkge1x0XHRcdFx0XG5cdFx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XHRcdGNhbGxlZXMuZm9yRWFjaChmdW5jdGlvbihjKSB7XG5cdFx0XHRcdFx0XHRkMy5zZWxlY3Qoc2VsZikuY2FsbChjKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHRcblx0XHRcdHJldHVybiB0O1xuXHRcdH1cblx0fSxcblxuXHRcImRnZi5kZWZhdWx0UmVhZGVyQ2FsbGJhY2tcIjogZnVuY3Rpb24oY2FsbGVlcykge1xuXHRcdHJldHVybiBmdW5jdGlvbihzZWxlY3Rpb24pIHtcblx0XHRcdHNlbGVjdGlvbi5lYWNoKGZ1bmN0aW9uKCkge1x0XHRcblx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XHRjYWxsZWVzLmZvckVhY2goZnVuY3Rpb24oYykge1xuXHRcdFx0XHRcdGQzLnNlbGVjdChzZWxmKS5jYWxsKGMpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH07XG5cdH0sXG5cblx0XCJkZ2YuZGVmYXVsdFBhcnNlckNhbGxiYWNrXCI6IGZ1bmN0aW9uKHRhZ0ZhY3RvcnksIG5hbWUsIHZhbHVlKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGRhdGEpIHtcdFx0XHRcblx0XHRcdGlmKHZhbHVlKSB7XG5cdFx0XHRcdHZhciBwYXJzZSA9IHt9O1xuXHRcdFx0XG5cdFx0XHRcdGZvcih2YXIgaSBpbiB2YWx1ZS5wYXJzZSkge1xuXHRcdFx0XHRcdHZhciBhID0gdGFnRmFjdG9yeS5jcmVhdGVFeHByZXNzaW9uKHZhbHVlLnBhcnNlW2ldLmF0dHJpYnV0ZSkgfHwgdmFsdWUucGFyc2VbaV0uYXR0cmlidXRlLFxuXHRcdFx0XHRcdFx0cCA9IHRhZ0ZhY3RvcnkuY3JlYXRlRXhwcmVzc2lvbih2YWx1ZS5wYXJzZVtpXS5wYXJzZXIpIHx8IHZhbHVlLnBhcnNlW2ldLnBhcnNlcjtcblx0XHRcblx0XHRcdFx0XHRpZih0eXBlb2YgYSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0XHRhID0gYS5jYWxsKHRoaXMsIGRhdGEpOyBcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cGFyc2VbYV0gPSBwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRyZXR1cm4gZGF0YS5tYXAoZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdGZvcih2YXIgYSBpbiBwYXJzZSkge1xuXHRcdFx0XHRcdFx0aWYodHlwZW9mIHBhcnNlW2FdID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRcdFx0ZFthXSA9IHBhcnNlW2FdLmNhbGwodGhpcywgZFthXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBkO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9LFxuXG5cdFwiZGdmLnJlYWRlckRTVlwiOiB7XG5cdFx0dGl0bGU6IFwiRFNWIFJlYWRlclwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkRlbGltaXRlci1TZXBhcmF0ZWQgUmVhZGVyXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcInJlYWRlclwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKHRhZ0ZhY3RvcnksIG5hbWUsIHZhbHVlLCBjYWxsZWVzKSB7XG5cdFx0XHR2YXIgdCA9IHRhZ0ZhY3RvcnkuY3JlYXRlVGVtcGxhdGUobmFtZSwgdmFsdWUsIGNhbGxlZXMsIHJlYWRlckRTVigpKTtcblx0XHRcdHQucGFyc2VyQ2FsbGJhY2sodGFnRmFjdG9yeS5sb29rdXAoXCJkZ2YuZGVmYXVsdFBhcnNlckNhbGxiYWNrXCIpLmNhbGwodGhpcywgdGFnRmFjdG9yeSwgbmFtZSwgdmFsdWUpKTtcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHR0LmNhbGxiYWNrKHRhZ0ZhY3RvcnkubG9va3VwKFwiZGdmLmRlZmF1bHRSZWFkZXJDYWxsYmFja1wiKS5jYWxsKHRoaXMsIGNhbGxlZXMpKTtcblx0XHRcdHJldHVybiB0O1xuXHRcdH1cblx0fSxcblxuXHRcImRnZi5yZWFkZXJKU09OXCI6IHtcblx0XHR0aXRsZTogXCJKU09OIFJlYWRlclwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkpTT04gUmVhZGVyXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcInJlYWRlclwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKHRhZ0ZhY3RvcnksIG5hbWUsIHZhbHVlLCBjYWxsZWVzKSB7XG5cdFx0XHR2YXIgdCA9IHRhZ0ZhY3RvcnkuY3JlYXRlVGVtcGxhdGUobmFtZSwgdmFsdWUsIGNhbGxlZXMsIHJlYWRlckpTT04oKSk7XG5cdFx0XHR0LnBhcnNlckNhbGxiYWNrKHRhZ0ZhY3RvcnkubG9va3VwKFwiZGdmLmRlZmF1bHRQYXJzZXJDYWxsYmFja1wiKS5jYWxsKHRoaXMsIHRhZ0ZhY3RvcnksIG5hbWUsIHZhbHVlKSk7XG5cdFx0XHR0LmNhbGxiYWNrKHRhZ0ZhY3RvcnkubG9va3VwKFwiZGdmLmRlZmF1bHRSZWFkZXJDYWxsYmFja1wiKS5jYWxsKHRoaXMsIGNhbGxlZXMpKTtcdFx0XHRcblx0XHRcdHJldHVybiB0O1xuXHRcdH1cblx0fSxcbi8qXG5cdFwiZGdmLnJlYWRlclRlc3REYXRhXCI6IHtcblx0XHR0aXRsZTogXCJUZXN0IERhdGEgUmVhZGVyXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiUmVhZGVyIHRoYXQgY3JlYXRlcyByYW5kb20gZGF0YVwiLFxuXHRcdGNhdGVnb3J5OiBbXCJyZWFkZXJcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbih0YWdGYWN0b3J5LCBuYW1lLCB2YWx1ZSwgY2FsbGVlcykge1xuXHRcdFx0dmFyIHQgPSB0YWdGYWN0b3J5LmNyZWF0ZVRlbXBsYXRlKG5hbWUsIHZhbHVlLCBjYWxsZWVzLCByZWFkZXJUZXN0RGF0YSgpKTtcblx0XHRcdHQucGFyc2VyQ2FsbGJhY2sodGFnRmFjdG9yeS5sb29rdXAoXCJkZ2YuZGVmYXVsdFBhcnNlckNhbGxiYWNrXCIpLmNhbGwodGhpcywgbmFtZSwgdmFsdWUsIGNhbGxlZXMpKTtcblx0XHRcdHQuY2FsbGJhY2sodGFnRmFjdG9yeS5sb29rdXAoXCJkZ2YuZGVmYXVsdFJlYWRlckNhbGxiYWNrXCIpLmNhbGwodGhpcywgY2FsbGVlcykpO1x0XHRcdFxuXHRcdFx0cmV0dXJuIHQ7XG5cdFx0fVxuXHR9LFxuKi9cblx0XG5cdFwiZGdmLnN0eWxlUGxhaW5DU1NcIjoge1xuXHRcdHRpdGxlOiBcIlBsYWluIENTU1wiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlBsYWluIENTUyBUZW1wbGF0ZVwiLFxuXHRcdGNhdGVnb3J5OiBbXCJzdHlsZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKHRhZ0ZhY3RvcnksIG5hbWUsIHZhbHVlLCBjYWxsZWVzKSB7XG5cdFx0XHRyZXR1cm4gdGFnRmFjdG9yeS5jcmVhdGVUZW1wbGF0ZShuYW1lLCB2YWx1ZSwgY2FsbGVlcywgc3R5bGVQbGFpbkNTUygpKTtcblx0XHR9XG5cdH0sXG5cblx0XCJkZ2Yuc3R5bGVSZXNwb25zaXZlQ1NTXCI6IHtcblx0XHR0aXRsZTogXCJSZXNwb25zaXZlIENTU1wiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkNyZWF0ZXMgcmVzcG9uc2l2ZSBjc3NcIixcblx0XHRjYXRlZ29yeTogW1wic3R5bGVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbih0YWdGYWN0b3J5LCBuYW1lLCB2YWx1ZSwgY2FsbGVlcykge1xuXHRcdFx0cmV0dXJuIHRhZ0ZhY3RvcnkuY3JlYXRlVGVtcGxhdGUobmFtZSwgdmFsdWUsIGNhbGxlZXMsIHN0eWxlUmVzcG9uc2l2ZUNTUygpKTtcblx0XHR9XG5cdH0sXG5cdFx0XHRcblx0XCJkZ2YudGVtcGxhdGVMYXllcnNcIjoge1xuXHRcdHRpdGxlOiBcIkxheWVycyBUZW1wbGF0ZSAoQ29udGFpbmVyKVwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkxheWVyZWQgVGVtcGxhdGVcIixcblx0XHRjYXRlZ29yeTogW1widGVtcGxhdGVcIiwgXCJjb250YWluZXJcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbih0YWdGYWN0b3J5LCBuYW1lLCB2YWx1ZSwgY2FsbGVlcykge1xuXHRcdFx0cmV0dXJuIHRhZ0ZhY3RvcnkuY3JlYXRlVGVtcGxhdGUobmFtZSwgdmFsdWUsIGNhbGxlZXMsIHRlbXBsYXRlTGF5ZXJzKCkpO1xuXHRcdH1cblx0fSxcblx0XG5cdFwiZGdmLnRlbXBsYXRlTGVnZW5kXCI6IHtcblx0XHR0aXRsZTogXCJMZWdlbmRcIixcblx0XHRkZXNjcmlwdGlvbjogXCJMZWdlbmQgVGVtcGxhdGVcIixcblx0XHRjYXRlZ29yeTogW1widGVtcGxhdGVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbih0YWdGYWN0b3J5LCBuYW1lLCB2YWx1ZSwgY2FsbGVlcykge1xuXHRcdFx0cmV0dXJuIHRhZ0ZhY3RvcnkuY3JlYXRlVGVtcGxhdGUobmFtZSwgdmFsdWUsIGNhbGxlZXMsIHRlbXBsYXRlTGVnZW5kKCkpO1xuXHRcdH1cblx0fSxcblxuXHRcImRnZi50ZW1wbGF0ZUJhY2tncm91bmRcIjoge1xuXHRcdHRpdGxlOiBcIkJhY2tncm91bmRcIixcblx0XHRkZXNjcmlwdGlvbjogXCJCYWNrZ3JvdW5kIFRlbXBsYXRlXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcInRlbXBsYXRlXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24odGFnRmFjdG9yeSwgbmFtZSwgdmFsdWUsIGNhbGxlZXMpIHtcblx0XHRcdHZhciB0ID0gdGFnRmFjdG9yeS5jcmVhdGVUZW1wbGF0ZShuYW1lLCB2YWx1ZSwgY2FsbGVlcywgdGVtcGxhdGVCYWNrZ3JvdW5kKCkpLFxuXHRcdFx0XHRmaWxsID0gdC5maWxsKCk7XG5cdFx0XHRcdFx0XHRcblx0XHRcdGZ1bmN0aW9uIGZpbmRGaXJzdENvbG9yKGMpIHtcblx0XHRcdFx0aWYodHlwZW9mIGMgPT09IFwic3RyaW5nXCIpIHJldHVybiBjO1xuXHRcdFx0XHRpZihBcnJheS5pc0FycmF5KGMpKSB7XG5cdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGlmKGNbaV0pIHJldHVybiBmaW5kRmlyc3RDb2xvcihjW2ldKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGZpbGwgPSBmaW5kRmlyc3RDb2xvcihmaWxsKTtcblx0XHRcdHQuZmlsbChmaWxsKTtcblx0XHRcdHJldHVybiB0O1xuXHRcdH1cblx0fSxcblxuXHRcImRnZi50ZW1wbGF0ZUltYWdlXCI6IHtcblx0XHR0aXRsZTogXCJJbWFnZVwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkltYWdlIFRlbXBsYXRlXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcInRlbXBsYXRlXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24odGFnRmFjdG9yeSwgbmFtZSwgdmFsdWUsIGNhbGxlZXMpIHtcblx0XHRcdHJldHVybiB0YWdGYWN0b3J5LmNyZWF0ZVRlbXBsYXRlKG5hbWUsIHZhbHVlLCBjYWxsZWVzLCB0ZW1wbGF0ZUltYWdlKCkpO1xuXHRcdH1cblx0fSxcblx0XG5cdFwiZGdmLnRlbXBsYXRlQXhpc1wiOiB7XG5cdFx0dGl0bGU6IFwiQXhpc1wiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlgtL1ktQXhpcyBUZW1wbGF0ZVwiLFxuXHRcdGNhdGVnb3J5OiBbXCJ0ZW1wbGF0ZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKHRhZ0ZhY3RvcnksIG5hbWUsIHZhbHVlLCBjYWxsZWVzKSB7XG5cdFx0XHRyZXR1cm4gdGFnRmFjdG9yeS5jcmVhdGVUZW1wbGF0ZShuYW1lLCB2YWx1ZSwgY2FsbGVlcywgdGVtcGxhdGVBeGlzKCkpO1xuXHRcdH1cblx0fSxcdFxuXG5cdFwiZGdmLnRlbXBsYXRlQmFyXCI6IHtcblx0XHR0aXRsZTogXCJCYXJcIixcblx0XHRkZXNjcmlwdGlvbjogXCJCYXIgVGVtcGxhdGVcIixcblx0XHRjYXRlZ29yeTogW1widGVtcGxhdGVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbih0YWdGYWN0b3J5LCBuYW1lLCB2YWx1ZSwgY2FsbGVlcykge1xuXHRcdFx0dmFyIHQgPSB0YWdGYWN0b3J5LmNyZWF0ZVRlbXBsYXRlKG5hbWUsIHZhbHVlLCBjYWxsZWVzLCB0ZW1wbGF0ZUJhcigpKTtcblx0XHRcdFxuXHRcdFx0dC5tb3VzZU92ZXJDYWxsYmFjayhmdW5jdGlvbihkKSB7IFxuXHRcdFx0XHR2YXIgZmlndXJlID0gZmluZFBhcmVudEJ5U2VsZWN0b3IodGhpcywgXCJmaWd1cmVcIiksXG5cdFx0XHRcdFx0bWVzc2FnZSA9IGQzLnNlbGVjdChmaWd1cmUpLnNlbGVjdChcInAubWVzc2FnZVwiKTtcblx0XHRcdFx0XG5cdFx0XHRcdG1lc3NhZ2UudGV4dChKU09OLnN0cmluZ2lmeShkKS5yZXBsYWNlKC9cXFwifHt8fS9nLCBcIlwiKS5yZXBsYWNlKC8sL2csIFwiLCBcIikpO1xuXHRcdFx0fSk7XG5cdFx0XG5cdFx0XHR0Lm1vdXNlTGVhdmVDYWxsYmFjayhmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIGZpZ3VyZSA9IGZpbmRQYXJlbnRCeVNlbGVjdG9yKHRoaXMsIFwiZmlndXJlXCIpLFxuXHRcdFx0XHRcdG1lc3NhZ2UgPSBkMy5zZWxlY3QoZmlndXJlKS5zZWxlY3QoXCJwLm1lc3NhZ2VcIik7XG5cdFx0XHRcdFxuXHRcdFx0XHRtZXNzYWdlLmh0bWwoXCImenduajtcIik7XG5cdFx0XHR9KTtcblx0XHRcdFxuXHRcdFx0dC50b3VjaFN0YXJ0Q2FsbGJhY2soZnVuY3Rpb24oZCkge1xuXHRcdFx0XHR2YXIgZmlndXJlID0gZmluZFBhcmVudEJ5U2VsZWN0b3IodGhpcywgXCJmaWd1cmVcIiksXG5cdFx0XHRcdFx0bWVzc2FnZSA9IGQzLnNlbGVjdChmaWd1cmUpLnNlbGVjdChcInAubWVzc2FnZVwiKTtcblx0XHRcdFx0XG5cdFx0XHRcdG1lc3NhZ2UudGV4dChKU09OLnN0cmluZ2lmeShkKS5yZXBsYWNlKC9cXFwifHt8fS9nLCBcIlwiKS5yZXBsYWNlKC8sL2csIFwiLCBcIikpO1xuXHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcblx0XHRcdHJldHVybiB0O1xuXHRcdH1cblx0fSxcblx0XG5cdFwiZGdmLnRlbXBsYXRlUGllXCI6IHtcblx0XHR0aXRsZTogXCJQaWVcIixcblx0XHRkZXNjcmlwdGlvbjogXCJQaWUgdGVtcGxhdGVcIixcblx0XHRjYXRlZ29yeTogW1widGVtcGxhdGVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbih0YWdGYWN0b3J5LCBuYW1lLCB2YWx1ZSwgY2FsbGVlcykge1xuXHRcdFx0dmFyIHQgPSB0YWdGYWN0b3J5LmNyZWF0ZVRlbXBsYXRlKG5hbWUsIHZhbHVlLCBjYWxsZWVzLCB0ZW1wbGF0ZVBpZSgpKTtcblx0XHRcdFxuXHRcdFx0dC5tb3VzZU92ZXJDYWxsYmFjayhmdW5jdGlvbihkKSB7IFxuXHRcdFx0XHR2YXIgZmlndXJlID0gZmluZFBhcmVudEJ5U2VsZWN0b3IodGhpcywgXCJmaWd1cmVcIiksXG5cdFx0XHRcdFx0bWVzc2FnZSA9IGQzLnNlbGVjdChmaWd1cmUpLnNlbGVjdChcInAubWVzc2FnZVwiKTtcblx0XHRcdFx0XG5cdFx0XHRcdG1lc3NhZ2UudGV4dChKU09OLnN0cmluZ2lmeShkLmRhdGEpLnJlcGxhY2UoL1xcXCJ8e3x9L2csIFwiXCIpLnJlcGxhY2UoLywvZywgXCIsIFwiKSk7XG5cdFx0XHR9KTtcblx0XHRcblx0XHRcdHQubW91c2VMZWF2ZUNhbGxiYWNrKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgZmlndXJlID0gZmluZFBhcmVudEJ5U2VsZWN0b3IodGhpcywgXCJmaWd1cmVcIiksXG5cdFx0XHRcdFx0bWVzc2FnZSA9IGQzLnNlbGVjdChmaWd1cmUpLnNlbGVjdChcInAubWVzc2FnZVwiKTtcblx0XHRcdFx0XG5cdFx0XHRcdG1lc3NhZ2UuaHRtbChcIiZ6d25qO1wiKTtcblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHR0LnRvdWNoU3RhcnRDYWxsYmFjayhmdW5jdGlvbihkKSB7XG5cdFx0XHRcdHZhciBmaWd1cmUgPSBmaW5kUGFyZW50QnlTZWxlY3Rvcih0aGlzLCBcImZpZ3VyZVwiKSxcblx0XHRcdFx0XHRtZXNzYWdlID0gZDMuc2VsZWN0KGZpZ3VyZSkuc2VsZWN0KFwicC5tZXNzYWdlXCIpO1xuXHRcdFx0XHRcblx0XHRcdFx0bWVzc2FnZS50ZXh0KEpTT04uc3RyaW5naWZ5KGQuZGF0YSkucmVwbGFjZSgvXFxcInx7fH0vZywgXCJcIikucmVwbGFjZSgvLC9nLCBcIiwgXCIpKTtcblx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRyZXR1cm4gdDtcblx0XHR9XG5cdH0sXG5cdFxuXHRcImRnZi50ZW1wbGF0ZUJ1YmJsZVwiOiB7XG5cdFx0dGl0bGU6IFwiQnViYmxlXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiQnViYmxlIHRlbXBsYXRlXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcInRlbXBsYXRlXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24odGFnRmFjdG9yeSwgbmFtZSwgdmFsdWUsIGNhbGxlZXMpIHtcblx0XHRcdHZhciB0ID0gdGFnRmFjdG9yeS5jcmVhdGVUZW1wbGF0ZShuYW1lLCB2YWx1ZSwgY2FsbGVlcywgdGVtcGxhdGVCdWJibGUoKSk7XG5cdFx0XHRcblx0XHRcdHQubW91c2VPdmVyQ2FsbGJhY2soZnVuY3Rpb24oZCkgeyBcblx0XHRcdFx0dmFyIGZpZ3VyZSA9IGZpbmRQYXJlbnRCeVNlbGVjdG9yKHRoaXMsIFwiZmlndXJlXCIpLFxuXHRcdFx0XHRcdG1lc3NhZ2UgPSBkMy5zZWxlY3QoZmlndXJlKS5zZWxlY3QoXCJwLm1lc3NhZ2VcIik7XG5cdFx0XHRcdFxuXHRcdFx0XHRtZXNzYWdlLnRleHQoSlNPTi5zdHJpbmdpZnkoZC5kYXRhLmRhdGEpLnJlcGxhY2UoL1xcXCJ8e3x9L2csIFwiXCIpLnJlcGxhY2UoLywvZywgXCIsIFwiKSk7XG5cdFx0XHR9KTtcblx0XHRcblx0XHRcdHQubW91c2VMZWF2ZUNhbGxiYWNrKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgZmlndXJlID0gZmluZFBhcmVudEJ5U2VsZWN0b3IodGhpcywgXCJmaWd1cmVcIiksXG5cdFx0XHRcdFx0bWVzc2FnZSA9IGQzLnNlbGVjdChmaWd1cmUpLnNlbGVjdChcInAubWVzc2FnZVwiKTtcblx0XHRcdFx0XG5cdFx0XHRcdG1lc3NhZ2UuaHRtbChcIiZ6d25qO1wiKTtcblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHR0LnRvdWNoU3RhcnRDYWxsYmFjayhmdW5jdGlvbihkKSB7XG5cdFx0XHRcdHZhciBmaWd1cmUgPSBmaW5kUGFyZW50QnlTZWxlY3Rvcih0aGlzLCBcImZpZ3VyZVwiKSxcblx0XHRcdFx0XHRtZXNzYWdlID0gZDMuc2VsZWN0KGZpZ3VyZSkuc2VsZWN0KFwicC5tZXNzYWdlXCIpO1xuXHRcdFx0XHRcblx0XHRcdFx0bWVzc2FnZS50ZXh0KEpTT04uc3RyaW5naWZ5KGQuZGF0YS5kYXRhKS5yZXBsYWNlKC9cXFwifHt8fS9nLCBcIlwiKS5yZXBsYWNlKC8sL2csIFwiLCBcIikpO1xuXHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcblx0XHRcdHJldHVybiB0O1xuXHRcdH1cblx0fSxcblxuXHRcImRnZi50ZW1wbGF0ZUxpbmVcIjoge1xuXHRcdHRpdGxlOiBcIkxpbmVcIixcblx0XHRkZXNjcmlwdGlvbjogXCJMaW5lIHRlbXBsYXRlXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcInRlbXBsYXRlXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24odGFnRmFjdG9yeSwgbmFtZSwgdmFsdWUsIGNhbGxlZXMpIHtcblx0XHRcdHJldHVybiB0YWdGYWN0b3J5LmNyZWF0ZVRlbXBsYXRlKG5hbWUsIHZhbHVlLCBjYWxsZWVzLCB0ZW1wbGF0ZUxpbmUoKSk7XG5cdFx0fVxuXHR9LFxuXG5cdFwiZGdmLnRlbXBsYXRlRG90XCI6IHtcblx0XHR0aXRsZTogXCJEb3RcIixcblx0XHRkZXNjcmlwdGlvbjogXCJEb3QgdGVtcGxhdGVcIixcblx0XHRjYXRlZ29yeTogW1widGVtcGxhdGVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbih0YWdGYWN0b3J5LCBuYW1lLCB2YWx1ZSwgY2FsbGVlcykge1xuXHRcdFx0dmFyIHQgPSB0YWdGYWN0b3J5LmNyZWF0ZVRlbXBsYXRlKG5hbWUsIHZhbHVlLCBjYWxsZWVzLCB0ZW1wbGF0ZURvdCgpKTtcblx0XHRcdHQubW91c2VPdmVyQ2FsbGJhY2soZnVuY3Rpb24oZCkgeyBcblx0XHRcdFx0dmFyIGZpZ3VyZSA9IGZpbmRQYXJlbnRCeVNlbGVjdG9yKHRoaXMsIFwiZmlndXJlXCIpLFxuXHRcdFx0XHRcdG1lc3NhZ2UgPSBkMy5zZWxlY3QoZmlndXJlKS5zZWxlY3QoXCJwLm1lc3NhZ2VcIik7XG5cdFx0XHRcdFxuXHRcdFx0XHRtZXNzYWdlLnRleHQoSlNPTi5zdHJpbmdpZnkoZCkucmVwbGFjZSgvXFxcInx7fH0vZywgXCJcIikucmVwbGFjZSgvLC9nLCBcIiwgXCIpKTtcblx0XHRcdH0pO1xuXHRcdFxuXHRcdFx0dC5tb3VzZUxlYXZlQ2FsbGJhY2soZnVuY3Rpb24oKSB7IFxuXHRcdFx0XHR2YXIgZmlndXJlID0gZmluZFBhcmVudEJ5U2VsZWN0b3IodGhpcywgXCJmaWd1cmVcIiksXG5cdFx0XHRcdFx0bWVzc2FnZSA9IGQzLnNlbGVjdChmaWd1cmUpLnNlbGVjdChcInAubWVzc2FnZVwiKTtcblx0XHRcdFx0XG5cdFx0XHRcdG1lc3NhZ2UuaHRtbChcIiZ6d25qO1wiKTtcblx0XHRcdH0pO1xuXHRcdFxuXHRcdFx0dC50b3VjaFN0YXJ0Q2FsbGJhY2soZnVuY3Rpb24oZCkgeyBcblx0XHRcdFx0dmFyIGZpZ3VyZSA9IGZpbmRQYXJlbnRCeVNlbGVjdG9yKHRoaXMsIFwiZmlndXJlXCIpLFxuXHRcdFx0XHRcdG1lc3NhZ2UgPSBkMy5zZWxlY3QoZmlndXJlKS5zZWxlY3QoXCJwLm1lc3NhZ2VcIik7XG5cdFx0XHRcdFxuXHRcdFx0XHRtZXNzYWdlLnRleHQoSlNPTi5zdHJpbmdpZnkoZCkucmVwbGFjZSgvXFxcInx7fH0vZywgXCJcIikucmVwbGFjZSgvLC9nLCBcIiwgXCIpKTtcblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHRyZXR1cm4gdDtcblx0XHR9XG5cdH0sXG5cblx0XCJkZ2YudGVtcGxhdGVMYWJlbFwiOiB7XG5cdFx0dGl0bGU6IFwiTGFiZWxcIixcblx0XHRkZXNjcmlwdGlvbjogXCJMYWJlbCB0ZW1wbGF0ZVwiLFxuXHRcdGNhdGVnb3J5OiBbXCJ0ZW1wbGF0ZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKHRhZ0ZhY3RvcnksIG5hbWUsIHZhbHVlLCBjYWxsZWVzKSB7XG5cdFx0XHRyZXR1cm4gdGFnRmFjdG9yeS5jcmVhdGVUZW1wbGF0ZShuYW1lLCB2YWx1ZSwgY2FsbGVlcywgdGVtcGxhdGVMYWJlbCgpKTtcblx0XHR9XG5cdH0sXG5cdFxuXHRcImRnZi50ZW1wbGF0ZUFyY0xhYmVsXCI6IHtcblx0XHR0aXRsZTogXCJBcmMgTGFiZWxcIixcblx0XHRkZXNjcmlwdGlvbjogXCJBcmMgbGFiZWwgdGVtcGxhdGVcIixcblx0XHRjYXRlZ29yeTogW1widGVtcGxhdGVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbih0YWdGYWN0b3J5LCBuYW1lLCB2YWx1ZSwgY2FsbGVlcykge1xuXHRcdFx0dmFyIHQgPSB0YWdGYWN0b3J5LmNyZWF0ZVRlbXBsYXRlKG5hbWUsIHZhbHVlLCBjYWxsZWVzLCB0ZW1wbGF0ZUFyY0xhYmVsKCkpO1xuXHRcdFx0XG5cdFx0XHR0Lm1vdXNlT3ZlckNhbGxiYWNrKGZ1bmN0aW9uKGQpIHsgXG5cdFx0XHRcdHZhciBmaWd1cmUgPSBmaW5kUGFyZW50QnlTZWxlY3Rvcih0aGlzLCBcImZpZ3VyZVwiKSxcblx0XHRcdFx0XHRtZXNzYWdlID0gZDMuc2VsZWN0KGZpZ3VyZSkuc2VsZWN0KFwicC5tZXNzYWdlXCIpO1xuXHRcdFx0XHRcblx0XHRcdFx0bWVzc2FnZS50ZXh0KEpTT04uc3RyaW5naWZ5KGQuZGF0YSkucmVwbGFjZSgvXFxcInx7fH0vZywgXCJcIikucmVwbGFjZSgvLC9nLCBcIiwgXCIpKTtcblx0XHRcdH0pO1xuXHRcdFxuXHRcdFx0dC5tb3VzZUxlYXZlQ2FsbGJhY2soZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBmaWd1cmUgPSBmaW5kUGFyZW50QnlTZWxlY3Rvcih0aGlzLCBcImZpZ3VyZVwiKSxcblx0XHRcdFx0XHRtZXNzYWdlID0gZDMuc2VsZWN0KGZpZ3VyZSkuc2VsZWN0KFwicC5tZXNzYWdlXCIpO1xuXHRcdFx0XHRcblx0XHRcdFx0bWVzc2FnZS5odG1sKFwiJnp3bmo7XCIpO1xuXHRcdFx0fSk7XG5cdFx0XHRcblx0XHRcdHQudG91Y2hTdGFydENhbGxiYWNrKGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0dmFyIGZpZ3VyZSA9IGZpbmRQYXJlbnRCeVNlbGVjdG9yKHRoaXMsIFwiZmlndXJlXCIpLFxuXHRcdFx0XHRcdG1lc3NhZ2UgPSBkMy5zZWxlY3QoZmlndXJlKS5zZWxlY3QoXCJwLm1lc3NhZ2VcIik7XG5cdFx0XHRcdFxuXHRcdFx0XHRtZXNzYWdlLnRleHQoSlNPTi5zdHJpbmdpZnkoZC5kYXRhKS5yZXBsYWNlKC9cXFwifHt8fS9nLCBcIlwiKS5yZXBsYWNlKC8sL2csIFwiLCBcIikpO1xuXHRcdFx0fSk7XG5cdFx0XHRcblx0XHRcdHJldHVybiB0O1xuXHRcdH1cblx0fSxcblx0XG5cdFwiZGdmLnRlbXBsYXRlUGFja0xhYmVsXCI6IHtcblx0XHR0aXRsZTogXCJQYWNrIExhYmVsXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiUGFjayBsYWJlbCB0ZW1wbGF0ZVwiLFxuXHRcdGNhdGVnb3J5OiBbXCJ0ZW1wbGF0ZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKHRhZ0ZhY3RvcnksIG5hbWUsIHZhbHVlLCBjYWxsZWVzKSB7XG5cdFx0XHR2YXIgdCA9IHRhZ0ZhY3RvcnkuY3JlYXRlVGVtcGxhdGUobmFtZSwgdmFsdWUsIGNhbGxlZXMsIHRlbXBsYXRlUGFja0xhYmVsKCkpO1xuXHRcdFx0XG5cdFx0XHR0Lm1vdXNlT3ZlckNhbGxiYWNrKGZ1bmN0aW9uKGQpIHsgXG5cdFx0XHRcdHZhciBmaWd1cmUgPSBmaW5kUGFyZW50QnlTZWxlY3Rvcih0aGlzLCBcImZpZ3VyZVwiKSxcblx0XHRcdFx0XHRtZXNzYWdlID0gZDMuc2VsZWN0KGZpZ3VyZSkuc2VsZWN0KFwicC5tZXNzYWdlXCIpO1xuXHRcdFx0XHRcblx0XHRcdFx0bWVzc2FnZS50ZXh0KEpTT04uc3RyaW5naWZ5KGQuZGF0YS5kYXRhKS5yZXBsYWNlKC9cXFwifHt8fS9nLCBcIlwiKS5yZXBsYWNlKC8sL2csIFwiLCBcIikpO1xuXHRcdFx0fSk7XG5cdFx0XG5cdFx0XHR0Lm1vdXNlTGVhdmVDYWxsYmFjayhmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIGZpZ3VyZSA9IGZpbmRQYXJlbnRCeVNlbGVjdG9yKHRoaXMsIFwiZmlndXJlXCIpLFxuXHRcdFx0XHRcdG1lc3NhZ2UgPSBkMy5zZWxlY3QoZmlndXJlKS5zZWxlY3QoXCJwLm1lc3NhZ2VcIik7XG5cdFx0XHRcdFxuXHRcdFx0XHRtZXNzYWdlLmh0bWwoXCImenduajtcIik7XG5cdFx0XHR9KTtcblx0XHRcdFxuXHRcdFx0dC50b3VjaFN0YXJ0Q2FsbGJhY2soZnVuY3Rpb24oZCkge1xuXHRcdFx0XHR2YXIgZmlndXJlID0gZmluZFBhcmVudEJ5U2VsZWN0b3IodGhpcywgXCJmaWd1cmVcIiksXG5cdFx0XHRcdFx0bWVzc2FnZSA9IGQzLnNlbGVjdChmaWd1cmUpLnNlbGVjdChcInAubWVzc2FnZVwiKTtcblx0XHRcdFx0XG5cdFx0XHRcdG1lc3NhZ2UudGV4dChKU09OLnN0cmluZ2lmeShkLmRhdGEuZGF0YSkucmVwbGFjZSgvXFxcInx7fH0vZywgXCJcIikucmVwbGFjZSgvLC9nLCBcIiwgXCIpKTtcblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHRyZXR1cm4gdDtcblx0XHR9XG5cdH0sXG5cdFx0XG5cdFwiZGdmLnNjaGVtZUZld3M5XCI6IHtcblx0XHR0aXRsZTogXCJGZXdzIDlcIixcblx0XHRkZXNjcmlwdGlvbjogXCJGZXdzIDlcIixcblx0XHRjYXRlZ29yeTogW1wic2NoZW1lXCIsIFwiY2F0ZWdvcmljYWxcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBzY2hlbWVGZXdzOTtcblx0XHR9XG5cdH0sXG5cblx0XCJkZ2Yuc2NoZW1lR3JleXNcIjoge1xuXHRcdHRpdGxlOiBcIkJhc2ljIEdyZXlzXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiR3JleSBTaGFkZXNcIixcblx0XHRjYXRlZ29yeTogW1wic2NoZW1lXCIsIFwic2VxdWVudGlhbFwiLCBcInNpbmdsZSBodWVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBzY2hlbWVHcmV5cztcblx0XHR9XG5cdH0sXG5cdFxuXHRcImRnZi5zY2hlbWVCbHVlc1wiOiB7XG5cdFx0dGl0bGU6IFwiQmFzaWMgQmx1ZXNcIixcblx0XHRkZXNjcmlwdGlvbjogXCJCbHVlIFNoYWRlc1wiLFxuXHRcdGNhdGVnb3J5OiBbXCJzY2hlbWVcIiwgXCJzZXF1ZW50aWFsXCIsIFwic2luZ2xlIGh1ZVwiXSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1x0XHRcdFxuXHRcdFx0cmV0dXJuIHNjaGVtZUJsdWVzO1xuXHRcdH1cblx0fSxcblx0XG5cdFwiZGdmLnNjaGVtZURlZmF1bHRcIjoge1xuXHRcdHRpdGxlOiBcIkRlZmF1bHRcIixcblx0XHRkZXNjcmlwdGlvbjogXCJEZWZhdWx0IFNjaGVtZVwiLFxuXHRcdGNhdGVnb3J5OiBbXCJzY2hlbWVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcdFx0XHRcblx0XHRcdHJldHVybiBzY2hlbWVEZWZhdWx0O1xuXHRcdH1cblx0fSxcblxuXHRcImRnZi5zY2hlbWVZbE9yRHJcIjoge1xuXHRcdHRpdGxlOiBcIkJhc2ljIFlsT3JEclwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlllbGxvdyBPcmFuZ2UgRGFya3JlZFwiLFxuXHRcdGNhdGVnb3J5OiBbXCJzY2hlbWVcIiwgXCJzZXF1ZW50aWFsXCIsIFwibXVsdGkgaHVlXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XHRcdFx0XG5cdFx0XHRyZXR1cm4gc2NoZW1lWWxPckRyO1xuXHRcdH1cblx0fSxcblxuXHRcImRnZi5zY2hlbWVEZ09yRHJcIjoge1xuXHRcdHRpdGxlOiBcIkJhc2ljIERnT3JEclwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkRhcmtncmVlbiBPcmFuZ2UgRGFya3JlZFwiLFxuXHRcdGNhdGVnb3J5OiBbXCJzY2hlbWVcIiwgXCJzZXF1ZW50aWFsXCIsIFwibXVsdGkgaHVlXCJdLFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XHRcdFx0XG5cdFx0XHRyZXR1cm4gc2NoZW1lRGdPckRyO1xuXHRcdH1cblx0fSxcblxuXHQvLyBJbnRlcnBvbGF0ZVxuXHRcImRnZi5pbnRlcnBvbGF0ZUdyZXlzXCI6IHtcblx0XHR0aXRsZTogXCJCYXNpYyBHcmV5c1wiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkludGVycG9sYXRlIEdyZXlzXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImludGVycG9sYXRlXCIsIFwic2VxdWVudGlhbFwiLCBcInNpbmdsZSBodWVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcdFx0XHRcblx0XHRcdHJldHVybiBpbnRlcnBvbGF0ZUdyZXlzO1xuXHRcdH1cblx0fSxcblxuXHRcImRnZi5pbnRlcnBvbGF0ZUJsdWVzXCI6IHtcblx0XHR0aXRsZTogXCJCYXNpYyBCbHVlc1wiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIkludGVycG9sYXRlIEJsdWVzXCIsXG5cdFx0Y2F0ZWdvcnk6IFtcImludGVycG9sYXRlXCIsIFwic2VxdWVudGlhbFwiLCBcInNpbmdsZSBodWVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcdFx0XHRcblx0XHRcdHJldHVybiBpbnRlcnBvbGF0ZUJsdWVzO1xuXHRcdH1cblx0fSxcblxuXHRcImRnZi5pbnRlcnBvbGF0ZUJsUmRcIjoge1xuXHRcdHRpdGxlOiBcIkJhc2ljIEJsUmRcIixcblx0XHRkZXNjcmlwdGlvbjogXCJJbnRlcnBvbGF0ZSBCbHVlLVJlZFwiLFxuXHRcdGNhdGVnb3J5OiBbXCJpbnRlcnBvbGF0ZVwiLCBcInNlcXVlbnRpYWxcIiwgXCJtdWx0aSBodWVcIl0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcdFx0XHRcblx0XHRcdHJldHVybiBpbnRlcnBvbGF0ZUJsUmQ7XG5cdFx0fVxuXHR9XG59OyIsImV4cG9ydCBjb25zdCBzZXR1cEJhc2ljID0ge1xuXHRcImRnZi5zZXR1cEVtcHR5TGF5ZXJzXCI6IHtcblx0XHRcInRpdGxlXCI6IFwiRW1wdHkgTGF5ZXJzXCIsXG5cdFx0XCJkZXNjcmlwdGlvblwiOiBcIkVtcHR5IExheWVycyBkaWFncmFtIHNldHVwXCIsXG5cdFx0XCJjYXRlZ29yeVwiOiBbXCJzZXR1cFwiXSxcblx0XHRcImRhdGEtZGdmXCI6IHtcblx0XHRcdFwiZGlhbG9nXCI6XCJkZ2YuZGlhbG9nTGF5ZXJzTGFyZ2VcIixcblx0XHRcdFwicmVhZGVyXCI6e1xuXHRcdFx0XHRcInR5cGVcIjogXCJkZ2YucmVhZGVyRFNWXCIsXG5cdFx0XHRcdFwiZGVsaW1pdGVyXCI6IFwiY29tbWFcIlxuXHRcdFx0fSxcblx0XHRcdFwidGVtcGxhdGVcIjoge1xuXHRcdFx0XHRcInR5cGVcIjogXCJkZ2YudGVtcGxhdGVMYXllcnNcIixcblx0XHRcdFx0XCJ3aWR0aFwiOiA0ODAsXG5cdFx0XHRcdFwiaGVpZ2h0XCI6IDI3MCxcblx0XHRcdFx0XCJpbmhlcml0U2l6ZVwiOiBcImNsaWVudFdpZHRoXCIsXG5cdFx0XHRcdFwibWFyZ2luXCI6IHsgXCJ0b3BcIjogNDAsIFwicmlnaHRcIjogNDAsIFwiYm90dG9tXCI6IDQwLCBcImxlZnRcIjogNDAgfVxuXHRcdFx0fSxcblx0XHRcdFwic3R5bGVcIjoge1xuXHRcdFx0XHRcInR5cGVcIjogXCJkZ2Yuc3R5bGVSZXNwb25zaXZlQ1NTXCIsXG5cdFx0XHRcdFwic21hcnRwaG9uZVwiOiB7XG5cdFx0XHRcdFx0XCJmaWd1cmVcIjoge1xuXHRcdFx0XHRcdFx0XCJ3aWR0aFwiOiBcIjkwJVwiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcInRhYmxldFwiOiB7XG5cdFx0XHRcdFx0XCJmaWd1cmVcIjoge1xuXHRcdFx0XHRcdFx0XCJ3aWR0aFwiOiBcIjcwJVwiLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0XCJkZXNrdG9wXCI6IHtcblx0XHRcdFx0XHRcImZpZ3VyZVwiOiB7XG5cdFx0XHRcdFx0XHRcIndpZHRoXCI6IFwiNjAlXCIsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRcblx0XCJkZ2Yuc2V0dXBBeGlzT3JkaW5hbExpbmVhclwiOiB7XG5cdFx0XCJ0aXRsZVwiOiBcIkF4aXMgT3JkaW5hbC9MaW5lYXJcIixcblx0XHRcImRlc2NyaXB0aW9uXCI6IFwiT3JkaW5hbC9saW5lYXIgYXhpcyBzZXR1cFwiLFxuXHRcdFwiY2F0ZWdvcnlcIjogW1wic2V0dXBcIiwgXCJvcmRpbmFsL2xpbmVhclwiLCBcImF4aXNcIl0sXG5cdFx0XCJkYXRhLWRnZlwiOiB7XG5cdFx0XHRcInJlYWRlclwiOiB7XG5cdFx0XHRcdFwidHlwZVwiOiBcImRnZi5yZWFkZXJEU1ZcIixcblx0XHRcdFx0XCJkZWxpbWl0ZXJcIjogXCJjb21tYVwiLFxuXHRcdFx0XHRcInBhcnNlXCI6e1xuXHRcdFx0XHRcdFwicnVsZTBcIjp7XG5cdFx0XHRcdFx0XHRcImF0dHJpYnV0ZVwiOiBcImtleXNBdCgxKVwiLFxuXHRcdFx0XHRcdFx0XCJwYXJzZXJcIjogXCJudW1iZXJQYXJzZSgpXCJcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRcInRlbXBsYXRlXCI6IHtcblx0XHRcdFx0XCJ4XCI6IFwiZGF0YUF0KDApXCIsXG5cdFx0XHRcdFwieVwiOiBcImRhdGFBdCgxKVwiLFxuXHRcdFx0XHRcImtleVwiOiBcImRhdGFBdCgwKVwiLFxuXHRcdFx0XHRcImNvbG9yXCI6IFwiZGF0YUF0KDApXCIsXG5cdFx0XHRcdFwieFNjYWxlXCI6IHtcblx0XHRcdFx0XHRcInR5cGVcIjogXCJkMy5zY2FsZUJhbmRcIixcblx0XHRcdFx0XHRcImRvbWFpblwiOiBcIm1hcCgpXCIsXG5cdFx0XHRcdFx0XCJwYWRkaW5nSW5uZXJcIjogMC4xLFxuXHRcdFx0XHRcdFwicGFkZGluZ091dGVyXCI6IDAuMiBcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJ5U2NhbGVcIjoge1xuXHRcdFx0XHRcdFwidHlwZVwiOiBcImQzLnNjYWxlTGluZWFyXCIsXG5cdFx0XHRcdFx0XCJkb21haW5cIjogXCJleHRlbnRaZXJvKClcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcImNvbG9yU2NhbGVcIjoge1xuXHRcdFx0XHRcdFwidHlwZVwiOiBcImQzLnNjYWxlT3JkaW5hbFwiLFxuXHRcdFx0XHRcdFwiZG9tYWluXCI6IFwibWFwKClcIixcblx0XHRcdFx0XHRcInJhbmdlXCI6IFwiZGdmLnNjaGVtZURlZmF1bHRcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcImxheWVyMFwiOntcblx0XHRcdFx0XHRcInR5cGVcIjogXCJkZ2YudGVtcGxhdGVBeGlzXCIsXG5cdFx0XHRcdFx0XCJ5TGFiZWxcIjogXCJ5S2V5KClcIlxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0XCJleHRlbmRcIjpcImRnZi5zZXR1cEVtcHR5TGF5ZXJzXCJcblx0XHR9XG5cdH0sXG5cdFxuXHRcImRnZi5zZXR1cEJhckRpYWdyYW1cIjoge1xuXHRcdFwidGl0bGVcIjogXCJCYXIgRGlhZ3JhbVwiLFxuXHRcdFwiZGVzY3JpcHRpb25cIjogXCJCYXNpYyBiYXIgZGlhZ3JhbVwiLFxuXHRcdFwiY2F0ZWdvcnlcIjogW1wic2V0dXBcIiwgXCJvcmRpbmFsL2xpbmVhclwiLCBcImJhclwiXSxcblx0XHRcImRhdGEtZGdmXCI6IHtcblx0XHRcdFwiZGlhbG9nXCI6IFwiZGdmLmRpYWxvZ0xheWVyc1NtYWxsXCIsXG5cdFx0XHRcInRlbXBsYXRlXCI6IHtcblx0XHRcdFx0XCJsYXllcjFcIjoge1xuXHRcdFx0XHRcdFwidHlwZVwiOiBcImRnZi50ZW1wbGF0ZUJhclwiXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRcImV4dGVuZFwiOiBcImRnZi5zZXR1cEF4aXNPcmRpbmFsTGluZWFyXCJcblx0XHR9XG5cdH0sXG5cdFxuXHRcImRnZi5zZXR1cEJhckRpYWdyYW1XaXRoTGFiZWxcIjoge1xuXHRcdFwidGl0bGVcIjogXCJCYXIgRGlhZ3JhbSB3aXRoIExhYmVsXCIsXG5cdFx0XCJkZXNjcmlwdGlvblwiOiBcIkJhc2ljIGJhciBkaWFncmFtIHdpdGggbGFiZWxcIixcblx0XHRcImNhdGVnb3J5XCI6IFtcInNldHVwXCIsIFwib3JkaW5hbC9saW5lYXJcIiwgXCJiYXJcIl0sXG5cdFx0XCJkYXRhLWRnZlwiOiB7XG5cdFx0XHRcInRlbXBsYXRlXCI6IHtcblx0XHRcdFx0XCJ0ZXh0XCI6XCJkYXRhQXQoMSlcIixcblx0XHRcdFx0XCJsYXllcjBcIjoge1xuXHRcdFx0XHRcdFwieEhpZGVcIjogZmFsc2UsXG5cdFx0XHRcdFx0XCJ5SGlkZVwiOiBmYWxzZSxcblx0XHRcdFx0XHRcInkxSGlkZVwiOiB0cnVlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwibGF5ZXIyXCI6IHtcblx0XHRcdFx0XHRcInR5cGVcIjogXCJkZ2YudGVtcGxhdGVMYWJlbFwiLFxuXHRcdFx0XHRcdFwiZHlcIjogXCJ0aHJlc2hvbGRBdCgxLDAsMC43MmVtLC0wLjcyZW0pXCJcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdFwiZXh0ZW5kXCI6IFwiZGdmLnNldHVwQmFyRGlhZ3JhbVwiXG5cdFx0fVxuXHR9LFxuXHRcblx0XCJkZ2Yuc2V0dXBCYXJEaWFncmFtU3RhbmRhcmRcIjoge1xuXHRcdFwidGl0bGVcIjogXCJCYXIgRGlhZ3JhbVwiLFxuXHRcdFwiZGVzY3JpcHRpb25cIjogXCJTdGFuZGFyZCBiYXIgZGlhZ3JhbVwiLFxuXHRcdFwiY2F0ZWdvcnlcIjogW1wic2V0dXBcIl0sXG5cdFx0XCJkYXRhLWRnZlwiOiB7XG5cdFx0XHRcImRpYWxvZ1wiOlwiZGdmLmRpYWxvZ0xheWVyc1NtYWxsXCIsXG5cdFx0XHRcImV4dGVuZFwiOiBcImRnZi5zZXR1cEJhckRpYWdyYW1XaXRoTGFiZWxcIlxuXHRcdH1cblx0fSxcblx0XG5cdFwiZGdmLnNldHVwUGllRGlhZ3JhbVwiOiB7XG5cdFx0XCJ0aXRsZVwiOiBcIlBpZSBEaWFncmFtXCIsXG5cdFx0XCJkZXNjcmlwdGlvblwiOiBcIkJhc2ljIHBpZSBkaWFncmFtXCIsXG5cdFx0XCJjYXRlZ29yeVwiOiBbXCJzZXR1cFwiLCBcIm9yZGluYWwvbGluZWFyXCIsIFwicGllXCJdLFxuXHRcdFwiZGF0YS1kZ2ZcIjoge1xuXHRcdFx0XCJyZWFkZXJcIjoge1xuXHRcdFx0XHRcInR5cGVcIjogXCJkZ2YucmVhZGVyRFNWXCIsXG5cdFx0XHRcdFwiZGVsaW1pdGVyXCI6IFwiY29tbWFcIixcblx0XHRcdFx0XCJwYXJzZVwiOntcblx0XHRcdFx0XHRcInJ1bGUwXCI6e1xuXHRcdFx0XHRcdFx0XCJhdHRyaWJ1dGVcIjogXCJrZXlzQXQoMSlcIixcblx0XHRcdFx0XHRcdFwicGFyc2VyXCI6IFwibnVtYmVyUGFyc2UoKVwiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0XCJ0ZW1wbGF0ZVwiOiB7XG5cdFx0XHRcdFwieFwiOiBcImRhdGFBdCgwKVwiLFxuXHRcdFx0XHRcInlcIjogXCJkYXRhQXQoMSlcIixcblx0XHRcdFx0XCJrZXlcIjogXCJkYXRhQXQoMClcIixcblx0XHRcdFx0XCJjb2xvclwiOiBcImRhdGFBdCgwKVwiLFxuXHRcdFx0XHRcInRleHRcIjogXCJkYXRhQXQoMClcIixcblx0XHRcdFx0XCJjb2xvclNjYWxlXCI6IHtcblx0XHRcdFx0XHRcInR5cGVcIjogXCJkMy5zY2FsZU9yZGluYWxcIixcblx0XHRcdFx0XHRcImRvbWFpblwiOiBcIm1hcCgpXCIsXG5cdFx0XHRcdFx0XCJyYW5nZVwiOiBcImRnZi5zY2hlbWVEZWZhdWx0XCJcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJsYXllcjBcIjp7XG5cdFx0XHRcdFx0XCJ0eXBlXCI6IFwiZGdmLnRlbXBsYXRlUGllXCJcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdFwiZXh0ZW5kXCI6XCJkZ2Yuc2V0dXBFbXB0eUxheWVyc1wiXG5cdFx0fVxuXHR9LFxuXHRcdFxuXHRcImRnZi5zZXR1cFBpZURpYWdyYW1XaXRoTGFiZWxcIjoge1xuXHRcdFwidGl0bGVcIjogXCJQaWUgRGlhZ3JhbSB3aXRoIExhYmVsXCIsXG5cdFx0XCJkZXNjcmlwdGlvblwiOiBcIkJhc2ljIHBpZSBkaWFncmFtIHdpdGggbGFiZWxcIixcblx0XHRcImNhdGVnb3J5XCI6IFtcInNldHVwXCIsIFwib3JkaW5hbC9saW5lYXJcIiwgXCJwaWVcIl0sXG5cdFx0XCJkYXRhLWRnZlwiOiB7XG5cdFx0XHRcInRlbXBsYXRlXCI6IHtcblx0XHRcdFx0XCJsYXllcjFcIjoge1xuXHRcdFx0XHRcdFwidHlwZVwiOiBcImRnZi50ZW1wbGF0ZUFyY0xhYmVsXCIsXG5cdFx0XHRcdFx0XCJjb2xvclNjYWxlXCI6IHtcblx0XHRcdFx0XHRcdFwidHlwZVwiOiBcImQzLnNjYWxlT3JkaW5hbFwiLFxuXHRcdFx0XHRcdFx0XCJkb21haW5cIjogXCIwXCIsXG5cdFx0XHRcdFx0XHRcInJhbmdlXCI6IFwiYmxhY2tcIlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdFwiZXh0ZW5kXCI6XCJkZ2Yuc2V0dXBQaWVEaWFncmFtXCJcblx0XHR9XG5cdH0sXG5cdFxuXHRcImRnZi5zZXR1cFBpZURpYWdyYW1TdGFuZGFyZFwiOiB7XG5cdFx0XCJ0aXRsZVwiOiBcIlBpZSBEaWFncmFtXCIsXG5cdFx0XCJkZXNjcmlwdGlvblwiOiBcIlN0YW5kYXJkIHBpZSBkaWFncmFtXCIsXG5cdFx0XCJjYXRlZ29yeVwiOiBbXCJzZXR1cFwiXSxcblx0XHRcImRhdGEtZGdmXCI6IHtcblx0XHRcdFwiZGlhbG9nXCI6XCJkZ2YuZGlhbG9nTGF5ZXJzU21hbGxcIixcblx0XHRcdFwiZXh0ZW5kXCI6IFwiZGdmLnNldHVwUGllRGlhZ3JhbVdpdGhMYWJlbFwiXG5cdFx0fVxuXHR9LFxuXHRcblx0XCJkZ2Yuc2V0dXBEb251dERpYWdyYW1cIjoge1xuXHRcdFwidGl0bGVcIjogXCJEb251dCBEaWFncmFtXCIsXG5cdFx0XCJkZXNjcmlwdGlvblwiOiBcIkJhc2ljIGRvbnV0IGRpYWdyYW1cIixcblx0XHRcImNhdGVnb3J5XCI6IFtcInNldHVwXCIsIFwib3JkaW5hbC9saW5lYXJcIiwgXCJkb251dFwiXSxcblx0XHRcImRhdGEtZGdmXCI6IHtcblx0XHRcdFwicmVhZGVyXCI6IHtcblx0XHRcdFx0XCJ0eXBlXCI6IFwiZGdmLnJlYWRlckRTVlwiLFxuXHRcdFx0XHRcImRlbGltaXRlclwiOiBcImNvbW1hXCIsXG5cdFx0XHRcdFwicGFyc2VcIjp7XG5cdFx0XHRcdFx0XCJydWxlMFwiOntcblx0XHRcdFx0XHRcdFwiYXR0cmlidXRlXCI6IFwia2V5c0F0KDEpXCIsXG5cdFx0XHRcdFx0XHRcInBhcnNlclwiOiBcIm51bWJlclBhcnNlKClcIlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdFwidGVtcGxhdGVcIjoge1xuXHRcdFx0XHRcInhcIjogXCJkYXRhQXQoMClcIixcblx0XHRcdFx0XCJ5XCI6IFwiZGF0YUF0KDEpXCIsXG5cdFx0XHRcdFwia2V5XCI6IFwiZGF0YUF0KDApXCIsXG5cdFx0XHRcdFwiY29sb3JcIjogXCJkYXRhQXQoMClcIixcblx0XHRcdFx0XCJ0ZXh0XCI6IFwiZGF0YUF0KDApXCIsXG5cdFx0XHRcdFwiY29sb3JTY2FsZVwiOiB7XG5cdFx0XHRcdFx0XCJ0eXBlXCI6IFwiZDMuc2NhbGVPcmRpbmFsXCIsXG5cdFx0XHRcdFx0XCJkb21haW5cIjogXCJtYXAoKVwiLFxuXHRcdFx0XHRcdFwicmFuZ2VcIjogXCJkZ2Yuc2NoZW1lRGVmYXVsdFwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwibGF5ZXIwXCI6e1xuXHRcdFx0XHRcdFwidHlwZVwiOiBcImRnZi50ZW1wbGF0ZVBpZVwiLFxuXHRcdFx0XHRcdFwieUxhYmVsXCI6IFwieUtleSgpXCIsXG5cdFx0XHRcdFx0XCJhcmNcIjoge1xuXHRcdFx0XHRcdFx0XCJpbm5lclJhZGl1c1wiOiBcIjAuN1wiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0XCJleHRlbmRcIjpcImRnZi5zZXR1cEVtcHR5TGF5ZXJzXCJcblx0XHR9XG5cdH0sXG5cdFxuXHRcImRnZi5zZXR1cERvbnV0RGlhZ3JhbVdpdGhMYWJlbFwiOiB7XG5cdFx0XCJ0aXRsZVwiOiBcIkRvbnV0IERpYWdyYW0gd2l0aCBMYWJlbFwiLFxuXHRcdFwiZGVzY3JpcHRpb25cIjogXCJCYXNpYyBkb251dCBkaWFncmFtIHdpdGggbGFiZWxcIixcblx0XHRcImNhdGVnb3J5XCI6IFtcInNldHVwXCIsIFwib3JkaW5hbC9saW5lYXJcIiwgXCJkb251dFwiXSxcblx0XHRcImRhdGEtZGdmXCI6IHtcblx0XHRcdFwidGVtcGxhdGVcIjoge1xuXHRcdFx0XHRcImxheWVyMVwiOiB7XG5cdFx0XHRcdFx0XCJ0eXBlXCI6IFwiZGdmLnRlbXBsYXRlQXJjTGFiZWxcIixcblx0XHRcdFx0XHRcImNvbG9yU2NhbGVcIjoge1xuXHRcdFx0XHRcdFx0XCJ0eXBlXCI6IFwiZDMuc2NhbGVPcmRpbmFsXCIsXG5cdFx0XHRcdFx0XHRcImRvbWFpblwiOiBcIjBcIixcblx0XHRcdFx0XHRcdFwicmFuZ2VcIjogXCJibGFja1wiXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcImFyY1wiOiB7XG5cdFx0XHRcdFx0XHRcImlubmVyUmFkaXVzXCI6IFwiMC45XCJcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRcImV4dGVuZFwiOlwiZGdmLnNldHVwRG9udXREaWFncmFtXCJcblx0XHR9XG5cdH0sXG5cdFxuXHRcImRnZi5zZXR1cERvbnV0RGlhZ3JhbVN0YW5kYXJkXCI6IHtcblx0XHRcInRpdGxlXCI6IFwiRG9udXQgRGlhZ3JhbVwiLFxuXHRcdFwiZGVzY3JpcHRpb25cIjogXCJTdGFuZGFyZCBkb251dCBkaWFncmFtXCIsXG5cdFx0XCJjYXRlZ29yeVwiOiBbXCJzZXR1cFwiXSxcblx0XHRcImRhdGEtZGdmXCI6IHtcblx0XHRcdFwiZGlhbG9nXCI6XCJkZ2YuZGlhbG9nTGF5ZXJzU21hbGxcIixcblx0XHRcdFwiZXh0ZW5kXCI6IFwiZGdmLnNldHVwRG9udXREaWFncmFtV2l0aExhYmVsXCJcblx0XHR9XG5cdH0sXG5cdFx0XG5cdFwiZGdmLnNldHVwQXhpc0xpbmVhckxpbmVhclwiOiB7XG5cdFx0XCJ0aXRsZVwiOiBcIkF4aXMgTGluZWFyL0xpbmVhclwiLFxuXHRcdFwiZGVzY3JpcHRpb25cIjogXCJMaW5lYXIvbGluZWFyIGF4aXMgc2V0dXBcIixcblx0XHRcImNhdGVnb3J5XCI6IFtcInNldHVwXCIsIFwibGluZWFyL2xpbmVhclwiLCBcImF4aXNcIl0sXG5cdFx0XCJkYXRhLWRnZlwiOiB7XG5cdFx0XHRcInJlYWRlclwiOiB7XG5cdFx0XHRcdFwiZGVsaW1pdGVyXCI6IFwiY29tbWFcIixcblx0XHRcdFx0XCJwYXJzZVwiOiB7XG5cdFx0XHRcdFx0XCJydWxlMFwiOiB7XG5cdFx0XHRcdFx0XHRcImF0dHJpYnV0ZVwiOiBcImtleXNBdCgwKVwiLCBcInBhcnNlclwiOiBcIm51bWJlclBhcnNlKClcIlxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XCJydWxlMVwiOiB7XG5cdFx0XHRcdFx0XHRcImF0dHJpYnV0ZVwiOiBcImtleXNBdCgxKVwiLCBcInBhcnNlclwiOiBcIm51bWJlclBhcnNlKClcIlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdFwidGVtcGxhdGVcIjoge1xuXHRcdFx0XHRcInhcIjogXCJkYXRhQXQoMClcIixcblx0XHRcdFx0XCJ5XCI6XCJkYXRhQXQoMSlcIixcblx0XHRcdFx0XCJjb2xvclwiOlwiZGF0YUF0KDApXCIsXG5cdFx0XHRcdFwieFNjYWxlXCI6IHtcblx0XHRcdFx0XHRcInR5cGVcIjpcImQzLnNjYWxlTGluZWFyXCIsXG5cdFx0XHRcdFx0XCJkb21haW5cIjpcImV4dGVudFplcm8oKVwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwieVNjYWxlXCI6IHsgXG5cdFx0XHRcdFx0XCJ0eXBlXCI6IFwiZDMuc2NhbGVMaW5lYXJcIixcblx0XHRcdFx0XHRcImRvbWFpblwiOlwiZXh0ZW50WmVybygpXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJjb2xvclNjYWxlXCI6e1xuXHRcdFx0XHRcdFwidHlwZVwiOlwiZDMuc2NhbGVPcmRpbmFsXCIsXG5cdFx0XHRcdFx0XCJkb21haW5cIjpcIm1hcCgpXCIsXG5cdFx0XHRcdFx0XCJyYW5nZVwiOlwiZGdmLnNjaGVtZURlZmF1bHRcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcImxheWVyMFwiOiB7XG5cdFx0XHRcdFx0XCJ0eXBlXCI6IFwiZGdmLnRlbXBsYXRlQXhpc1wiLFxuXHRcdFx0XHRcdFwieExhYmVsXCI6XCJ4S2V5KClcIixcblx0XHRcdFx0XHRcInlMYWJlbFwiOlwieUtleSgpXCIsXG5cdFx0XHRcdFx0XCJ4SGlkZVwiOmZhbHNlLFxuXHRcdFx0XHRcdFwieUhpZGVcIjpmYWxzZSxcblx0XHRcdFx0XHRcInkxSGlkZVwiOmZhbHNlXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRcImV4dGVuZFwiOlwiZGdmLnNldHVwRW1wdHlMYXllcnNcIlxuXHRcdH1cblx0fSxcblx0XG5cdFwiZGdmLnNldHVwTGluZURpYWdyYW1cIjoge1xuXHRcdFwidGl0bGVcIjogXCJMaW5lIERpYWdyYW1cIixcblx0XHRcImRlc2NyaXB0aW9uXCI6IFwiQmFzaWMgbGluZSBkaWFncmFtXCIsXG5cdFx0XCJjYXRlZ29yeVwiOiBbXCJzZXR1cFwiLCBcImxpbmVhci9saW5lYXJcIiwgXCJsaW5lXCJdLFxuXHRcdFwiZGF0YS1kZ2ZcIjoge1xuXHRcdFx0XCJkaWFsb2dcIjpcImRnZi5kaWFsb2dMYXllcnNTbWFsbFwiLFxuXHRcdFx0XCJ0ZW1wbGF0ZVwiOntcblx0XHRcdFx0XCJsYXllcjBcIjp7XG5cdFx0XHRcdFx0XCJ5MUhpZGVcIjp0cnVlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwibGF5ZXIxXCI6e1xuXHRcdFx0XHRcdFwidHlwZVwiOlwiZGdmLnRlbXBsYXRlTGluZVwiLFxuXHRcdFx0XHRcdFwibGluZVwiOntcblx0XHRcdFx0XHRcdFwidHlwZVwiOlwiZDMubGluZVwiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0XCJleHRlbmRcIjpcImRnZi5zZXR1cEF4aXNMaW5lYXJMaW5lYXJcIlxuXHRcdH1cblx0fSxcblx0XG5cdFwiZGdmLnNldHVwTGluZURpYWdyYW1XaXRoRG90c1wiOiB7XG5cdFx0XCJ0aXRsZVwiOiBcIkxpbmUgRGlhZ3JhbSB3aXRoIERvdHNcIixcblx0XHRcImRlc2NyaXB0aW9uXCI6IFwiTGluZSBkaWFncmFtIHdpdGggZGF0YXBvaW50cyBhcyBkb3RzXCIsXG5cdFx0XCJjYXRlZ29yeVwiOiBbXCJzZXR1cFwiLCBcImxpbmVhci9saW5lYXJcIiwgXCJsaW5lXCJdLFxuXHRcdFwiZGF0YS1kZ2ZcIjoge1xuXHRcdFx0XCJkaWFsb2dcIjpcImRnZi5kaWFsb2dMYXllcnNTbWFsbFwiLFxuXHRcdFx0XCJ0ZW1wbGF0ZVwiOntcblx0XHRcdFx0XCJ5MVwiOlwiZGF0YUF0KDEpXCIsXG5cdFx0XHRcdFwieTFTY2FsZVwiOntcblx0XHRcdFx0XHRcInR5cGVcIjpcImQzLnNjYWxlU3FydFwiLFxuXHRcdFx0XHRcdFwiZG9tYWluXCI6XCJleHRlbnQoKVwiLFxuXHRcdFx0XHRcdFwicmFuZ2VcIjpcIjYsNlwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwibGF5ZXIyXCI6e1xuXHRcdFx0XHRcdFwidHlwZVwiOlwiZGdmLnRlbXBsYXRlRG90XCJcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdFwiZXh0ZW5kXCI6XCJkZ2Yuc2V0dXBMaW5lRGlhZ3JhbVwiXG5cdFx0fVxuXHR9LFxuXHRcblx0XCJkZ2Yuc2V0dXBMaW5lRGlhZ3JhbVN0YW5kYXJkXCI6IHtcblx0XHRcInRpdGxlXCI6IFwiTGluZSBEaWFncmFtXCIsXG5cdFx0XCJkZXNjcmlwdGlvblwiOiBcIlN0YW5kYXJkIGxpbmUgZGlhZ3JhbVwiLFxuXHRcdFwiY2F0ZWdvcnlcIjogW1wic2V0dXBcIl0sXG5cdFx0XCJkYXRhLWRnZlwiOiB7XG5cdFx0XHRcImRpYWxvZ1wiOlwiZGdmLmRpYWxvZ0xheWVyc1NtYWxsXCIsXG5cdFx0XHRcImV4dGVuZFwiOiBcImRnZi5zZXR1cExpbmVEaWFncmFtV2l0aERvdHNcIlxuXHRcdH1cblx0fSxcblx0XG5cdFwiZGdmLnNldHVwTGluZURpYWdyYW1OYXR1cmFsQ3VydmVcIjoge1xuXHRcdFwidGl0bGVcIjogXCJMaW5lIERpYWdyYW0gKE5hdHVyYWwgQ3VydmUpXCIsXG5cdFx0XCJkZXNjcmlwdGlvblwiOiBcIkxpbmUgZGlhZ3JhbSB3aXRoIG5hdHVyYWwgY3VydmVcIixcblx0XHRcImNhdGVnb3J5XCI6IFtcInNldHVwXCIsIFwibGluZWFyL2xpbmVhclwiLCBcImxpbmVcIl0sXG5cdFx0XCJkYXRhLWRnZlwiOiB7XG5cdFx0XHRcImRpYWxvZ1wiOlwiZGdmLmRpYWxvZ0xheWVyc1NtYWxsXCIsXG5cdFx0XHRcInRlbXBsYXRlXCI6e1xuXHRcdFx0XHRcImxheWVyMFwiOntcblx0XHRcdFx0XHRcInkxSGlkZVwiOnRydWVcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJsYXllcjFcIjp7XG5cdFx0XHRcdFx0XCJ0eXBlXCI6XCJkZ2YudGVtcGxhdGVMaW5lXCIsXG5cdFx0XHRcdFx0XCJsaW5lXCI6e1xuXHRcdFx0XHRcdFx0XCJ0eXBlXCI6XCJkMy5saW5lXCIsXG5cdFx0XHRcdFx0XHRcImN1cnZlXCI6IHtcblx0XHRcdFx0XHRcdFx0XCJ0eXBlXCI6XCJkMy5jdXJ2ZU5hdHVyYWxcIlxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdFwiZXh0ZW5kXCI6XCJkZ2Yuc2V0dXBBeGlzTGluZWFyTGluZWFyXCJcblx0XHR9XG5cdH0sXG5cdFxuXHRcImRnZi5zZXR1cFNjYXR0ZXJEaWFncmFtV2l0aExhYmVsc1wiOiB7XG5cdFx0XCJ0aXRsZVwiOiBcIlNjYXR0ZXIgRGlhZ3JhbSBXaXRoIExhYmVsc1wiLFxuXHRcdFwiZGVzY3JpcHRpb25cIjogXCJTY2F0dGVyIGRpYWdyYW0gd2l0aCBuYW1lIChsYWJlbCksIHggYW5kIHlcIixcblx0XHRcImNhdGVnb3J5XCI6IFtcInNldHVwXCIsIFwibGluZWFyL2xpbmVhclwiLCBcInNjYXR0ZXJcIl0sXG5cdFx0XCJkYXRhLWRnZlwiOiB7XG5cdFx0XHRcImRpYWxvZ1wiOlwiZGdmLmRpYWxvZ0xheWVyc1NtYWxsXCIsXG5cdFx0XHRcInJlYWRlclwiOiB7XG5cdFx0XHRcdFwicGFyc2VcIjoge1xuXHRcdFx0XHRcdFwicnVsZTBcIjoge1xuXHRcdFx0XHRcdFx0XCJhdHRyaWJ1dGVcIjogXCJrZXlzQXQoMSlcIlxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XCJydWxlMVwiOiB7XG5cdFx0XHRcdFx0XHRcImF0dHJpYnV0ZVwiOiBcImtleXNBdCgyKVwiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0XCJ0ZW1wbGF0ZVwiOiB7XG5cdFx0XHRcdFwibWFyZ2luXCI6IHtcblx0XHRcdFx0XHRcInJpZ2h0XCI6IDYwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwieFwiOiBcImRhdGFBdCgxKVwiLFxuXHRcdFx0XHRcInlcIjogXCJkYXRhQXQoMilcIixcblx0XHRcdFx0XCJ4U2NhbGVcIjoge1xuXHRcdFx0XHRcdFwiZG9tYWluXCI6IFwiZXh0ZW50WmVybygpXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJ5U2NhbGVcIjoge1xuXHRcdFx0XHRcdFwiZG9tYWluXCI6IFwiZXh0ZW50WmVybygpXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJsYXllcjBcIjoge1xuXHRcdFx0XHRcdFwieExhYmVsXCI6IFwieEtleSgpXCIsXG5cdFx0XHRcdFx0XCJ5TGFiZWxcIjogXCJ5S2V5KClcIixcblx0XHRcdFx0XHRcInkxSGlkZVwiOiB0cnVlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwidGV4dFwiOiBcImRhdGFBdCgwKVwiLFxuXHRcdFx0XHRcImxheWVyMVwiOiB7XG5cdFx0XHRcdFx0XCJ0eXBlXCI6IFwiZGdmLnRlbXBsYXRlRG90XCJcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJsYXllcjJcIjoge1xuXHRcdFx0XHRcdFwidHlwZVwiOiBcImRnZi50ZW1wbGF0ZUxhYmVsXCIsXG5cdFx0XHRcdFx0XCJhbmNob3JcIjogXCJzdGFydFwiLFxuXHRcdFx0XHRcdFwiZHhcIjogXCIxZW1cIixcblx0XHRcdFx0XHRcInkxU2NhbGVcIjoge1xuXHRcdFx0XHRcdFx0XCJ0eXBlXCI6IFwiZDMuc2NhbGVMaW5lYXJcIixcblx0XHRcdFx0XHRcdFwiZG9tYWluXCI6IFwiZXh0ZW50QXQoMilcIixcblx0XHRcdFx0XHRcdFwicmFuZ2VcIjogXCIwLjc0LDJcIlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0XCJrZXlcIjogXCJkYXRhQXQoMClcIixcblx0XHRcdFx0XCJ5MVNjYWxlXCI6IHtcblx0XHRcdFx0XHRcInR5cGVcIjogXCJkMy5zY2FsZVNxcnRcIixcblx0XHRcdFx0XHRcImRvbWFpblwiOiBcImV4dGVudCgpXCIsXG5cdFx0XHRcdFx0XCJyYW5nZVwiOiBcIjQsMjBcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcInkxXCI6IFwiZGF0YUF0KDIpXCJcblx0XHRcdH0sXG5cdFx0XHRcImV4dGVuZFwiOiBcImRnZi5zZXR1cEF4aXNMaW5lYXJMaW5lYXJcIlxuXHRcdH1cblx0fSxcblx0XG5cdFwiZGdmLnNldHVwU2NhdHRlckRpYWdyYW1TdGFuZGFyZFwiOiB7XG5cdFx0XCJ0aXRsZVwiOiBcIlNjYXR0ZXIgRGlhZ3JhbVwiLFxuXHRcdFwiZGVzY3JpcHRpb25cIjogXCJTdGFuZGFyZCBzY2F0dGVyIGRpYWdyYW1cIixcblx0XHRcImNhdGVnb3J5XCI6IFtcInNldHVwXCJdLFxuXHRcdFwiZGF0YS1kZ2ZcIjoge1xuXHRcdFx0XCJkaWFsb2dcIjpcImRnZi5kaWFsb2dMYXllcnNTbWFsbFwiLFxuXHRcdFx0XCJleHRlbmRcIjogXCJkZ2Yuc2V0dXBTY2F0dGVyRGlhZ3JhbVdpdGhMYWJlbHNcIlxuXHRcdH1cblx0fVxufTsiLCJleHBvcnQgY29uc3Qgc2V0dXBIaWVyYXJjaGljID0ge1xuXG5cdFwiZGdmLnNldHVwQnViYmxlRGlhZ3JhbVwiOiB7XG5cdFx0XCJ0aXRsZVwiOiBcIkJ1YmJsZSBEaWFncmFtXCIsXG5cdFx0XCJkZXNjcmlwdGlvblwiOiBcIkJhc2ljIGJ1YmJsZSBkaWFncmFtXCIsXG5cdFx0XCJjYXRlZ29yeVwiOiBbXCJzZXR1cFwiLCBcImhpZXJhcmNoaWMvbGluZWFyXCIsIFwiYnViYmxlXCJdLFxuXHRcdFwiZGF0YS1kZ2ZcIjoge1xuXHRcdFx0XCJyZWFkZXJcIjoge1xuXHRcdFx0XHRcInR5cGVcIjogXCJkZ2YucmVhZGVyRFNWXCIsXG5cdFx0XHRcdFwiZGVsaW1pdGVyXCI6IFwiY29tbWFcIixcblx0XHRcdFx0XCJwYXJzZVwiOntcblx0XHRcdFx0XHRcInJ1bGUwXCI6e1xuXHRcdFx0XHRcdFx0XCJhdHRyaWJ1dGVcIjogXCJrZXlzQXQoMSlcIixcblx0XHRcdFx0XHRcdFwicGFyc2VyXCI6IFwibnVtYmVyUGFyc2UoKVwiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0XCJ0ZW1wbGF0ZVwiOiB7XG5cdFx0XHRcdFwid2lkdGhcIjogNDgwLFxuXHRcdFx0XHRcImhlaWdodFwiOiAzMjAsXG5cdFx0XHRcdFwiaW5oZXJpdFNpemVcIjogXCJjbGllbnRXaWR0aFwiLFxuXHRcdFx0XHRcIm1hcmdpblwiOiB7IFwidG9wXCI6IDEwLCBcInJpZ2h0XCI6IDEwLCBcImJvdHRvbVwiOiAxMCwgXCJsZWZ0XCI6IDEwIH0sXG5cdFx0XHRcdFwieFwiOiBcImRhdGFBdCgwKVwiLFxuXHRcdFx0XHRcInlcIjogXCJkYXRhQXQoMSlcIixcblx0XHRcdFx0XCJjb2xvclwiOiBcImRhdGFBdCgwKVwiLFxuXHRcdFx0XHRcInRleHRcIjogXCJkYXRhQXQoMClcIixcblx0XHRcdFx0XCJjb2xvclNjYWxlXCI6IHtcblx0XHRcdFx0XHRcInR5cGVcIjogXCJkMy5zY2FsZU9yZGluYWxcIixcblx0XHRcdFx0XHRcImRvbWFpblwiOiBcIm1hcCgpXCIsXG5cdFx0XHRcdFx0XCJyYW5nZVwiOiBcImRnZi5zY2hlbWVEZWZhdWx0XCJcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJsYXllcjBcIjp7XG5cdFx0XHRcdFx0XCJ0eXBlXCI6IFwiZGdmLnRlbXBsYXRlQnViYmxlXCIsXG5cdFx0XHRcdFx0XCJwYWNrXCI6IHtcblx0XHRcdFx0XHRcdFwicGFkZGluZ1wiOiBcIjEuNVwiXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcInNvcnRcIjoge1xuXHRcdFx0XHRcdFx0XCJ0eXBlXCI6IFwiZDMuYXNjZW5kaW5nXCJcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFwieUxhYmVsXCI6IFwieUtleSgpXCJcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdFwic3R5bGVcIjoge1xuXHRcdFx0XHRcInR5cGVcIjogXCJkZ2Yuc3R5bGVSZXNwb25zaXZlQ1NTXCIsXG5cdFx0XHRcdFwic21hcnRwaG9uZVwiOiB7XG5cdFx0XHRcdFx0XCJmaWd1cmVcIjoge1xuXHRcdFx0XHRcdFx0XCJ3aWR0aFwiOiBcIjkwJVwiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcInRhYmxldFwiOiB7XG5cdFx0XHRcdFx0XCJmaWd1cmVcIjoge1xuXHRcdFx0XHRcdFx0XCJ3aWR0aFwiOiBcIjcwJVwiLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0XCJkZXNrdG9wXCI6IHtcblx0XHRcdFx0XHRcImZpZ3VyZVwiOiB7XG5cdFx0XHRcdFx0XHRcIndpZHRoXCI6IFwiNjAlXCIsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0XCJleHRlbmRcIjpcImRnZi5zZXR1cEVtcHR5TGF5ZXJzXCJcblx0XHR9XG5cdH0sXG5cdFx0XG5cdFwiZGdmLnNldHVwQnViYmxlRGlhZ3JhbVdpdGhMYWJlbFwiOiB7XG5cdFx0XCJ0aXRsZVwiOiBcIkJ1YmJsZSBEaWFncmFtIHdpdGggTGFiZWxcIixcblx0XHRcImRlc2NyaXB0aW9uXCI6IFwiQmFzaWMgYnViYmxlIGRpYWdyYW0gd2l0aCBsYWJlbFwiLFxuXHRcdFwiY2F0ZWdvcnlcIjogW1wic2V0dXBcIiwgXCJoaWVyYXJjaGljL2xpbmVhclwiLCBcImJ1YmJsZVwiXSxcblx0XHRcImRhdGEtZGdmXCI6IHtcblx0XHRcdFwidGVtcGxhdGVcIjoge1xuXHRcdFx0XHRcInkxXCI6IFwiZGF0YUF0KDEpXCIsXG5cdFx0XHRcdFwieTFTY2FsZVwiOiB7XG5cdFx0XHRcdFx0XCJ0eXBlXCI6IFwiZDMuc2NhbGVTcXJ0XCIsXG5cdFx0XHRcdFx0XCJkb21haW5cIjogXCJleHRlbnRaZXJvQXQoMSlcIixcblx0XHRcdFx0XHRcInJhbmdlXCI6IFwiMC4xLDEuMlwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwibGF5ZXIxXCI6IHtcblx0XHRcdFx0XHRcInR5cGVcIjogXCJkZ2YudGVtcGxhdGVQYWNrTGFiZWxcIixcblx0XHRcdFx0XHRcInBhY2tcIjoge1xuXHRcdFx0XHRcdFx0XCJwYWRkaW5nXCI6IFwiMS41XCJcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFwic29ydFwiOiB7XG5cdFx0XHRcdFx0XHRcInR5cGVcIjogXCJkMy5hc2NlbmRpbmdcIlxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XCJjb2xvclNjYWxlXCI6IHtcblx0XHRcdFx0XHRcdFwidHlwZVwiOiBcImQzLnNjYWxlT3JkaW5hbFwiLFxuXHRcdFx0XHRcdFx0XCJkb21haW5cIjogXCIwXCIsXG5cdFx0XHRcdFx0XHRcInJhbmdlXCI6IFwid2hpdGVcIlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdFwiZXh0ZW5kXCI6XCJkZ2Yuc2V0dXBCdWJibGVEaWFncmFtXCJcblx0XHR9XG5cdH0sXG5cdFxuXHRcImRnZi5zZXR1cEJ1YmJsZURpYWdyYW1TdGFuZGFyZFwiOiB7XG5cdFx0XCJ0aXRsZVwiOiBcIkJ1YmJsZSBEaWFncmFtXCIsXG5cdFx0XCJkZXNjcmlwdGlvblwiOiBcIlN0YW5kYXJkIGJ1YmJsZSBkaWFncmFtXCIsXG5cdFx0XCJjYXRlZ29yeVwiOiBbXCJzZXR1cFwiXSxcblx0XHRcImRhdGEtZGdmXCI6IHtcblx0XHRcdFwiZGlhbG9nXCI6XCJkZ2YuZGlhbG9nTGF5ZXJzU21hbGxcIixcblx0XHRcdFwiZXh0ZW5kXCI6IFwiZGdmLnNldHVwQnViYmxlRGlhZ3JhbVdpdGhMYWJlbFwiXG5cdFx0fVxuXHR9LFxuXHRcblx0XCJkZ2Yuc2V0dXBQYWNrTGFiZWxEaWFncmFtXCI6IHtcblx0XHRcInRpdGxlXCI6IFwiUGFjayBMYWJlbCBEaWFncmFtXCIsXG5cdFx0XCJkZXNjcmlwdGlvblwiOiBcIkJhc2ljIHBhY2sgbGFiZWwgZGlhZ3JhbVwiLFxuXHRcdFwiY2F0ZWdvcnlcIjogW1wic2V0dXBcIiwgXCJoaWVyYXJjaGljL2xpbmVhclwiLCBcImxhYmVsXCJdLFxuXHRcdFwiZGF0YS1kZ2ZcIjoge1xuXHRcdFx0XCJyZWFkZXJcIjoge1xuXHRcdFx0XHRcInR5cGVcIjogXCJkZ2YucmVhZGVyRFNWXCIsXG5cdFx0XHRcdFwiZGVsaW1pdGVyXCI6IFwiY29tbWFcIixcblx0XHRcdFx0XCJwYXJzZVwiOntcblx0XHRcdFx0XHRcInJ1bGUwXCI6e1xuXHRcdFx0XHRcdFx0XCJhdHRyaWJ1dGVcIjogXCJrZXlzQXQoMSlcIixcblx0XHRcdFx0XHRcdFwicGFyc2VyXCI6IFwibnVtYmVyUGFyc2UoKVwiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0XCJ0ZW1wbGF0ZVwiOiB7XG5cdFx0XHRcdFwid2lkdGhcIjogNDgwLFxuXHRcdFx0XHRcImhlaWdodFwiOiAzMjAsXG5cdFx0XHRcdFwiaW5oZXJpdFNpemVcIjogXCJjbGllbnRXaWR0aFwiLFxuXHRcdFx0XHRcIm1hcmdpblwiOiB7IFwidG9wXCI6IDEwLCBcInJpZ2h0XCI6IDEwLCBcImJvdHRvbVwiOiAxMCwgXCJsZWZ0XCI6IDEwIH0sXG5cdFx0XHRcdFwieFwiOiBcImRhdGFBdCgwKVwiLFxuXHRcdFx0XHRcInlcIjogXCJkYXRhQXQoMSlcIixcblx0XHRcdFx0XCJjb2xvclwiOiBcImRhdGFBdCgwKVwiLFxuXHRcdFx0XHRcInRleHRcIjogXCJkYXRhQXQoMClcIixcblx0XHRcdFx0XCJjb2xvclNjYWxlXCI6IHtcblx0XHRcdFx0XHRcInR5cGVcIjogXCJkMy5zY2FsZU9yZGluYWxcIixcblx0XHRcdFx0XHRcImRvbWFpblwiOiBcIm1hcCgpXCIsXG5cdFx0XHRcdFx0XCJyYW5nZVwiOiBcImRnZi5zY2hlbWVEZWZhdWx0XCJcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJsYXllcjBcIjp7XG5cdFx0XHRcdFx0XCJ0eXBlXCI6IFwiZGdmLnRlbXBsYXRlUGFja0xhYmVsXCIsXG5cdFx0XHRcdFx0XCJwYWNrXCI6IHtcblx0XHRcdFx0XHRcdFwicGFkZGluZ1wiOiBcIjEuNVwiXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcInlMYWJlbFwiOiBcInlLZXkoKVwiXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRcInN0eWxlXCI6IHtcblx0XHRcdFx0XCJ0eXBlXCI6IFwiZGdmLnN0eWxlUmVzcG9uc2l2ZUNTU1wiLFxuXHRcdFx0XHRcInNtYXJ0cGhvbmVcIjoge1xuXHRcdFx0XHRcdFwiZmlndXJlXCI6IHtcblx0XHRcdFx0XHRcdFwid2lkdGhcIjogXCI5MCVcIlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0XCJ0YWJsZXRcIjoge1xuXHRcdFx0XHRcdFwiZmlndXJlXCI6IHtcblx0XHRcdFx0XHRcdFwid2lkdGhcIjogXCI3MCVcIixcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwiZGVza3RvcFwiOiB7XG5cdFx0XHRcdFx0XCJmaWd1cmVcIjoge1xuXHRcdFx0XHRcdFx0XCJ3aWR0aFwiOiBcIjYwJVwiLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdFwiZXh0ZW5kXCI6XCJkZ2Yuc2V0dXBFbXB0eUxheWVyc1wiXG5cdFx0fVxuXHR9XHRcbn07IiwiZXhwb3J0IGNvbnN0IHNldHVwVGltZSA9IHtcdFx0XG5cdFwiZGdmLnNldHVwQXhpc1RpbWVMaW5lYXJcIjoge1xuXHRcdFwidGl0bGVcIjogXCJBeGlzIFRpbWUvTGluZWFyXCIsXG5cdFx0XCJkZXNjcmlwdGlvblwiOiBcIlRpbWUvbGluZWFyIGF4aXMgc2V0dXBcIixcblx0XHRcImNhdGVnb3J5XCI6IFtcInNldHVwXCIsIFwidGltZS9saW5lYXJcIiwgXCJheGlzXCJdLFxuXHRcdFwiZGF0YS1kZ2ZcIjoge1xuXHRcdFx0XCJkaWFsb2dcIjpcImRnZi5kaWFsb2dMYXllcnNTbWFsbFwiLFxuXHRcdFx0XCJyZWFkZXJcIjp7XG5cdFx0XHRcdFwicGFyc2VcIjp7XG5cdFx0XHRcdFx0XCJydWxlMFwiOntcblx0XHRcdFx0XHRcdFwiYXR0cmlidXRlXCI6XCJrZXlzQXQoMClcIixcblx0XHRcdFx0XHRcdFwicGFyc2VyXCI6XCJ0aW1lUGFyc2UoJVktJW0tJWQpXCJcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFwicnVsZTFcIjp7XG5cdFx0XHRcdFx0XHRcImF0dHJpYnV0ZVwiOlwia2V5c0F0KDEpXCIsXG5cdFx0XHRcdFx0XHRcInBhcnNlclwiOlwibnVtYmVyUGFyc2UoKVwiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0XCJ0ZW1wbGF0ZVwiOntcblx0XHRcdFx0XCJ4XCI6XCJkYXRhQXQoMClcIixcblx0XHRcdFx0XCJ5XCI6XCJkYXRhQXQoMSlcIixcblx0XHRcdFx0XCJjb2xvclwiOlwiZGF0YUF0KDApXCIsXG5cdFx0XHRcdFwieFNjYWxlXCI6e1xuXHRcdFx0XHRcdFwidHlwZVwiOlwiZDMuc2NhbGVUaW1lXCIsXG5cdFx0XHRcdFx0XCJkb21haW5cIjpcImV4dGVudCgpXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJ5U2NhbGVcIjp7XG5cdFx0XHRcdFx0XCJ0eXBlXCI6XCJkMy5zY2FsZUxpbmVhclwiLFxuXHRcdFx0XHRcdFwiZG9tYWluXCI6XCJleHRlbnRaZXJvKClcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcImNvbG9yU2NhbGVcIjp7XG5cdFx0XHRcdFx0XCJ0eXBlXCI6XCJkMy5zY2FsZU9yZGluYWxcIixcblx0XHRcdFx0XHRcImRvbWFpblwiOlwibWFwKClcIixcblx0XHRcdFx0XHRcInJhbmdlXCI6XCJkZ2Yuc2NoZW1lRGVmYXVsdFwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwibGF5ZXIwXCI6e1xuXHRcdFx0XHRcdFwidHlwZVwiOlwiZGdmLnRlbXBsYXRlQXhpc1wiLFxuXHRcdFx0XHRcdFwieEhpZGVcIjpmYWxzZSxcblx0XHRcdFx0XHRcInlIaWRlXCI6ZmFsc2UsXG5cdFx0XHRcdFx0XCJ5MUhpZGVcIjpmYWxzZSxcblx0XHRcdFx0XHRcInlMYWJlbFwiOlwieUtleSgpXCIsXG5cdFx0XHRcdFx0XCJ4TGFiZWxcIjpcInhLZXkoKVwiXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRcImV4dGVuZFwiOlwiZGdmLnNldHVwRW1wdHlMYXllcnNcIlxuXHRcdH1cblx0fSxcblx0XG5cdFwiZGdmLnNldHVwVGltZUxpbmVEb3RcIjoge1xuXHRcdFwidGl0bGVcIjogXCJMaW5lL0RvdCBEaWFncmFtIHdpdGggVGltZSBTY2FsZVwiLFxuXHRcdFwiZGVzY3JpcHRpb25cIjogXCJMaW5lIGRpYWdyYW0gd2l0aCBEb3RzIHdpdGggYSB0aW1lIHNjYWxlXCIsXG5cdFx0XCJjYXRlZ29yeVwiOiBbXCJzZXR1cFwiLCBcInRpbWUvbGluZWFyXCJdLFxuXHRcdFwiZGF0YS1kZ2ZcIjoge1xuXHRcdFx0XCJkaWFsb2dcIjpcImRnZi5kaWFsb2dMYXllcnNTbWFsbFwiLFxuXHRcdFx0XCJ0ZW1wbGF0ZVwiOntcblx0XHRcdFx0XCJtYXJnaW5cIjoge1xuXHRcdFx0XHRcdFwidG9wXCI6IDMwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwibGF5ZXIxXCI6e1xuXHRcdFx0XHRcdFwidHlwZVwiOlwiZGdmLnRlbXBsYXRlTGluZVwiLFxuXHRcdFx0XHRcdFwieTFcIjpcImRhdGFBdCgxKVwiLFxuXHRcdFx0XHRcdFwibGluZVwiOntcblx0XHRcdFx0XHRcdFwidHlwZVwiOlwiZDMubGluZVwiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcImxheWVyMlwiOntcblx0XHRcdFx0XHRcInR5cGVcIjpcImRnZi50ZW1wbGF0ZURvdFwiLFxuXHRcdFx0XHRcdFwibGluZVwiOntcblx0XHRcdFx0XHRcdFwidHlwZVwiOlwiZDMubGluZVwiXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcInkxU2NhbGVcIjp7XG5cdFx0XHRcdFx0XHRcInR5cGVcIjpcImQzLnNjYWxlTGluZWFyXCIsXG5cdFx0XHRcdFx0XHRcImRvbWFpblwiOlwiZXh0ZW50QXQoMSlcIixcblx0XHRcdFx0XHRcdFwicmFuZ2VcIjpcIjYsNlwiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcInkxXCI6XCJkYXRhQXQoMSlcIixcblx0XHRcdFx0XCJsYXllcjNcIjp7XG5cdFx0XHRcdFx0XCJ0eXBlXCI6XCJkZ2YudGVtcGxhdGVMYWJlbFwiLFxuXHRcdFx0XHRcdFwieTFTY2FsZVwiOntcblx0XHRcdFx0XHRcdFwidHlwZVwiOlwiZDMuc2NhbGVMaW5lYXJcIixcblx0XHRcdFx0XHRcdFwiZG9tYWluXCI6XCJleHRlbnRBdCgxKVwiLFxuXHRcdFx0XHRcdFx0XCJyYW5nZVwiOlwiMSwxXCJcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFwiZHlcIjpcIi0xLjVlbVwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwidGV4dFwiOlwiZGF0YUF0KDEpXCJcblx0XHRcdH0sXG5cdFx0XHRcImV4dGVuZFwiOlwiZGdmLnNldHVwQXhpc1RpbWVMaW5lYXJcIlxuXHRcdH1cblx0fVxufTsiLCJleHBvcnQgY29uc3Qgc2V0dXBNdWx0aVNlcmllcyA9IHtcdFxuXHRcImRnZi5zZXR1cE11bHRpU2VyaWVzTGluZURpYWdyYW1cIjoge1xuXHRcdFwidGl0bGVcIjogXCJMaW5lcyBEaWFncmFtXCIsXG5cdFx0XCJkZXNjcmlwdGlvblwiOiBcIkJhc2ljIG11bHRpLXNlcmllcyBsaW5lIGRpYWdyYW1cIixcblx0XHRcImNhdGVnb3J5XCI6IFtcInNldHVwXCIsIFwibXVsdGktc2VyaWVzXCIsIFwibGluZWFyL2xpbmVhclwiXSxcblx0XHRcImRhdGEtZGdmXCI6IHtcblx0XHRcdFwiZGlhbG9nXCI6XCJkZ2YuZGlhbG9nTGF5ZXJzU21hbGxcIixcblx0XHRcdFwicmVhZGVyXCI6e1xuXHRcdFx0XHRcInBhcnNlXCI6e1xuXHRcdFx0XHRcdFwicnVsZTBcIjp7XG5cdFx0XHRcdFx0XHRcImF0dHJpYnV0ZVwiOlwia2V5c0F0KDApXCIsXG5cdFx0XHRcdFx0XHRcInBhcnNlclwiOlwibnVtYmVyUGFyc2UoKVwiXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcInJ1bGUxXCI6e1xuXHRcdFx0XHRcdFx0XCJhdHRyaWJ1dGVcIjpcImtleXNBdCgxKVwiLFxuXHRcdFx0XHRcdFx0XCJwYXJzZXJcIjpcIm51bWJlclBhcnNlKClcIlxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XCJydWxlMlwiOntcblx0XHRcdFx0XHRcdFwiYXR0cmlidXRlXCI6XCJrZXlzQXQoMilcIixcblx0XHRcdFx0XHRcdFwicGFyc2VyXCI6XCJudW1iZXJQYXJzZSgpXCJcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRcInRlbXBsYXRlXCI6e1xuXHRcdFx0XHRcInhcIjpcImRhdGFBdCgwKVwiLFxuXHRcdFx0XHRcInlcIjpcImRhdGFBdCgxKVwiLFxuXHRcdFx0XHRcInhTY2FsZVwiOntcblx0XHRcdFx0XHRcInR5cGVcIjpcImQzLnNjYWxlTGluZWFyXCIsXG5cdFx0XHRcdFx0XCJkb21haW5cIjpcImV4dGVudFplcm8oKVwiXG5cdFx0XHRcdH0sXCJ5U2NhbGVcIjp7XG5cdFx0XHRcdFx0XCJ0eXBlXCI6XCJkMy5zY2FsZUxpbmVhclwiLFxuXHRcdFx0XHRcdFwiZG9tYWluXCI6XCJleHRlbnRaZXJvKClcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcImNvbG9yU2NhbGVcIjp7XG5cdFx0XHRcdFx0XCJ0eXBlXCI6XCJkMy5zY2FsZU9yZGluYWxcIixcblx0XHRcdFx0XHRcImRvbWFpblwiOlwia2V5cygpXCIsXG5cdFx0XHRcdFx0XCJyYW5nZVwiOlwiZGdmLnNjaGVtZURlZmF1bHRcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcImxheWVyMFwiOntcblx0XHRcdFx0XHRcInR5cGVcIjpcImRnZi50ZW1wbGF0ZUF4aXNcIixcblx0XHRcdFx0XHRcInhIaWRlXCI6ZmFsc2UsXG5cdFx0XHRcdFx0XCJ5SGlkZVwiOmZhbHNlLFxuXHRcdFx0XHRcdFwieTFIaWRlXCI6ZmFsc2UsXG5cdFx0XHRcdFx0XCJ4TGFiZWxcIjpcInhLZXkoKVwiLFxuXHRcdFx0XHRcdFwieUxhYmVsXCI6XCJ5S2V5KClcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcImxheWVyMVwiOntcblx0XHRcdFx0XHRcInR5cGVcIjpcImRnZi50ZW1wbGF0ZUxpbmVcIixcblx0XHRcdFx0XHRcInlcIjpcImRhdGFBdCgxKVwiLFxuXHRcdFx0XHRcdFwibGluZVwiOntcblx0XHRcdFx0XHRcdFwidHlwZVwiOlwiZDMubGluZVwiXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcImNvbG9yXCI6XCJrZXlzQXQoMSlcIixcblx0XHRcdFx0XHRcImxhYmVsXCI6XCJrZXlzQXQoMSlcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcImxheWVyMlwiOntcblx0XHRcdFx0XHRcInR5cGVcIjpcImRnZi50ZW1wbGF0ZUxpbmVcIixcblx0XHRcdFx0XHRcInlcIjpcImRhdGFBdCgyKVwiLFxuXHRcdFx0XHRcdFwibGluZVwiOntcblx0XHRcdFx0XHRcdFwidHlwZVwiOlwiZDMubGluZVwiXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcImNvbG9yXCI6XCJrZXlzQXQoMilcIixcblx0XHRcdFx0XHRcImxhYmVsXCI6XCJrZXlzQXQoMilcIlxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0XCJleHRlbmRcIjpcImRnZi5zZXR1cEVtcHR5TGF5ZXJzXCJcblx0XHR9XG5cdH0sXG5cdFwiZGdmLnNldHVwTXVsdGlTZXJpZXNUd29CYXJzQ29tcGFyZURpYWdyYW1cIjoge1xuXHRcdFwidGl0bGVcIjogXCJUd28gQmFycyBDb21wYXJlIERpYWdyYW1cIixcblx0XHRcImRlc2NyaXB0aW9uXCI6IFwiVHdvIEJhcnMgQ29tcGFyaXNvbjogQ29tcGFyZSB0d28gZGF0YSBzZXJpZXMgKGUuZy4sIG9sZCAvIG5ldykuXCIsXG5cdFx0XCJjYXRlZ29yeVwiOiBbXCJzZXR1cFwiLCBcIm11bHRpLXNlcmllc1wiLCBcIm9yZGluYWwvbGluZWFyXCJdLFxuXHRcdFwiZGF0YS1kZ2ZcIjoge1xuXHRcdFx0XCJkaWFsb2dcIjpcImRnZi5kaWFsb2dMYXllcnNTbWFsbFwiLFxuXHRcdFx0XCJyZWFkZXJcIjoge1xuXHRcdFx0XHRcInBhcnNlXCI6IHtcblx0XHRcdFx0XHRcInJ1bGUwXCI6IHtcblx0XHRcdFx0XHRcdFwiYXR0cmlidXRlXCI6IFwia2V5c0F0KDEpXCIsXG5cdFx0XHRcdFx0XHRcInBhcnNlclwiOiBcIm51bWJlclBhcnNlKClcIlxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XCJydWxlMVwiOiB7XG5cdFx0XHRcdFx0XHRcImF0dHJpYnV0ZVwiOiBcImtleXNBdCgyKVwiLFxuXHRcdFx0XHRcdFx0XCJwYXJzZXJcIjogXCJudW1iZXJQYXJzZSgpXCJcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRcInRlbXBsYXRlXCI6IHtcblx0XHRcdFx0XCJ4XCI6IFwiZGF0YUF0KDApXCIsXG5cdFx0XHRcdFwieVwiOiBcImRhdGFBdCgxKVwiLFxuXHRcdFx0XHRcImNvbG9yXCI6IFwiZGF0YUF0KDEpXCIsXG5cdFx0XHRcdFwieFNjYWxlXCI6IHtcblx0XHRcdFx0XHRcInR5cGVcIjogXCJkMy5zY2FsZUJhbmRcIixcblx0XHRcdFx0XHRcImRvbWFpblwiOiBcIm1hcCgpXCIsXG5cdFx0XHRcdFx0XCJwYWRkaW5nSW5uZXJcIjogMC41LFxuXHRcdFx0XHRcdFwicGFkZGluZ091dGVyXCI6IDAuMjVcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJ5U2NhbGVcIjoge1xuXHRcdFx0XHRcdFwidHlwZVwiOiBcImQzLnNjYWxlTGluZWFyXCIsXG5cdFx0XHRcdFx0XCJkb21haW5cIjogXCJleHRlbnRaZXJvKClcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcImNvbG9yU2NhbGVcIjoge1xuXHRcdFx0XHRcdFwidHlwZVwiOiBcImQzLnNjYWxlT3JkaW5hbFwiLFxuXHRcdFx0XHRcdFwiZG9tYWluXCI6IFwiMFwiLFxuXHRcdFx0XHRcdFwicmFuZ2VcIjogXCJkaW1ncmF5XCJcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJsYXllcjBcIjoge1xuXHRcdFx0XHRcdFwidHlwZVwiOiBcImRnZi50ZW1wbGF0ZUF4aXNcIixcblx0XHRcdFx0XHRcInhIaWRlXCI6IGZhbHNlLFxuXHRcdFx0XHRcdFwieUhpZGVcIjogZmFsc2UsXG5cdFx0XHRcdFx0XCJ5MUhpZGVcIjogZmFsc2Vcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJsYXllcjFcIjoge1xuXHRcdFx0XHRcdFwidHlwZVwiOiBcImRnZi50ZW1wbGF0ZUJhclwiLFxuXHRcdFx0XHRcdFwiY29sb3JcIjogXCJkYXRhQXQoMSlcIixcblx0XHRcdFx0XHRcImNvbG9yU2NhbGVcIjoge1xuXHRcdFx0XHRcdFx0XCJ0eXBlXCI6IFwiZDMuc2NhbGVPcmRpbmFsXCIsXG5cdFx0XHRcdFx0XHRcImRvbWFpblwiOiBcIjBcIixcblx0XHRcdFx0XHRcdFwicmFuZ2VcIjogXCJncmF5XCJcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFwieVwiOiBcImRhdGFBdCgxKVwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwibGF5ZXIyXCI6IHtcblx0XHRcdFx0XHRcInR5cGVcIjogXCJkZ2YudGVtcGxhdGVCYXJcIixcblx0XHRcdFx0XHRcInlcIjogXCJkYXRhQXQoMilcIixcblx0XHRcdFx0XHRcImNvbG9yXCI6IFwiZGF0YUF0KDIpXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJsYXllcjNcIjoge1xuXHRcdFx0XHRcdFwidHlwZVwiOiBcImRnZi50ZW1wbGF0ZUxhYmVsXCIsXG5cdFx0XHRcdFx0XCJ5XCI6IFwiZGF0YUF0KDEpXCIsXG5cdFx0XHRcdFx0XCJjb2xvclwiOiBcImRhdGFBdCgxKVwiLFxuXHRcdFx0XHRcdFwidGV4dFwiOiBcImRhdGFBdCgxKVwiLFxuXHRcdFx0XHRcdFwiY29sb3JTY2FsZVwiOiB7XG5cdFx0XHRcdFx0XHRcInR5cGVcIjogXCJkMy5zY2FsZU9yZGluYWxcIixcblx0XHRcdFx0XHRcdFwiZG9tYWluXCI6IFwiMFwiLFxuXHRcdFx0XHRcdFx0XCJyYW5nZVwiOiBcImxpZ2h0Z3JheVwiXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcImR5XCI6IFwidGhyZXNob2xkQXQoMSwwLDAuNzRlbSwtMC43NGVtKVwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwibGF5ZXI0XCI6IHtcblx0XHRcdFx0XHRcInR5cGVcIjogXCJkZ2YudGVtcGxhdGVMYWJlbFwiLFxuXHRcdFx0XHRcdFwieVwiOiBcImRhdGFBdCgyKVwiLFxuXHRcdFx0XHRcdFwiY29sb3JcIjogXCJkYXRhQXQoMilcIixcblx0XHRcdFx0XHRcInRleHRcIjogXCJkYXRhQXQoMilcIixcblx0XHRcdFx0XHRcImR5XCI6IFwidGhyZXNob2xkQXQoMiwwLDAuNzRlbSwtMC43NGVtKVwiXG5cdFx0XHRcdH0sXG5cdFx0XHR9LFxuXHRcdFx0XCJzdHlsZVwiOiB7XG5cdFx0XHRcdFwiY3NzXCI6IFwiI2lkIGcuaTIgLmJhciB7IG9wYWNpdHk6IDAuNDsgfVxcbiNpZCBnLmkzIC5iYXIgeyBvcGFjaXR5OiAwLjY7IH1cIlxuXHRcdFx0fSxcblx0XHRcdFwiZXh0ZW5kXCI6IFwiZGdmLnNldHVwRW1wdHlMYXllcnNcIlxuXHRcdH1cblx0fVxufTsiLCJleHBvcnQgY29uc3Qgc2V0dXBHYWxsZXJ5ID0ge1xuXHRcImdhbGxlcnkuc2V0dXBEb251dERpYWdyYW1XaXRoTGFiZWxcIjoge1xuXHRcdFwidGl0bGVcIjogXCJEb251dCBEaWFncmFtIHdpdGggTGFiZWxzXCIsXG5cdFx0XCJkZXNjcmlwdGlvblwiOiBcIjxiPkRvbnV0IERpYWdyYW1tPC9iPjogVGhlIGxhYmVscyBhcmUgYXV0b21hdGljYWxseSByZXBvc2l0aW9uZWQgd2hlbiBkYXRhIGlzIHVwZGF0ZWQuIE9uIDxlbT5tb3VzZSBvdmVyPC9lbT4gKG9yIDxlbT50YXA8L2VtPiBvbiB0b3VjaCBkZXZpY2VzKSB0aGUgbWVzc2FnZSBiZWxvdyB0aGlzIGNhcHRpb24gc2hvd3MgdGhlIHZhbHVlcyBvZiB0aGUgZGF0YSBwb2ludC5cIixcblx0XHRcImNhdGVnb3J5XCI6IFtcInNldHVwXCIsIFwiZ2FsbGVyeVwiXSxcblx0XHRcImRhdGEtZGdmXCI6IHtcblx0XHRcdFwicmVhZGVyXCI6IHtcblx0XHRcdFx0XCJkYXRhXCI6IFwibmFtZSxkaXN0YW5jZSxzcGVlZCxkaXN0YW5jZSpzcGVlZFxcbkFubmEsMTUuNSw5LjUsMTQ3LjNcXG5CZWF0LDMzLjIsMTEuMiwzNzEuOFxcbkNhcmwsOS41LDE0LjksMTQxLjZcXG5EaWFuYSw0NS4zLDEyLjUsNTY2LjNcXG5FbW1hLDkuNywxMS42LDExMi41XFxuRnJhbmssMTEuNiwxMS4wLDEyNy42XFxuR2FieSwyMS42LDkuOCwyMTEuN1xcbkhhbnMsMzUuMiwxNC4zLDUwMy40XCJcblx0XHRcdH0sXG5cdFx0XHRcInRlbXBsYXRlXCI6IHtcblx0XHRcdFx0XCJjb2xvclNjYWxlXCI6IHtcblx0XHRcdFx0XHRcInJhbmdlXCI6IFwiZGdmLnNjaGVtZUdyZXlzXCJcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdFwiZXh0ZW5kXCI6IFwiZGdmLnNldHVwRG9udXREaWFncmFtU3RhbmRhcmRcIlxuXHRcdH1cblx0fSxcblx0XG5cdFwiZ2FsbGVyeS5zZXR1cEJ1YmJsZURpYWdyYW1XaXRoTGFiZWxcIjoge1xuXHRcdFwidGl0bGVcIjogXCJCdWJibGUgRGlhZ3JhbSB3aXRoIExhYmVsc1wiLFxuXHRcdFwiZGVzY3JpcHRpb25cIjogXCI8Yj5CdWJibGUgRGlhZ3JhbTwvYj46IFRoZSBzaXplIG9mIHRoZSBidWJibGVzIHJlcHJlc2VudHMgdGhlIHJ1bm5pbmcgZGlzdGFuY2UuIFRoZSAoaW50ZXJwb2xhdGVkKSBjb2xvciB0aGUgYXZlcmFnZSBzcGVlZC5cIixcblx0XHRcImNhdGVnb3J5XCI6IFsgXCJzZXR1cFwiLCBcImdhbGxlcnlcIiBdLFxuXHRcdFwiZGF0YS1kZ2ZcIjoge1xuXHRcdFx0XCJyZWFkZXJcIjoge1xuXHRcdFx0XHRcInBhcnNlXCI6IHtcblx0XHRcdFx0XHRcInJ1bGUxXCI6IHtcblx0XHRcdFx0XHRcdFwiYXR0cmlidXRlXCI6IFwia2V5c0F0KDIpXCIsXG5cdFx0XHRcdFx0XHRcInBhcnNlclwiOiBcIm51bWJlclBhcnNlKClcIlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0XCJkYXRhXCI6IFwibmFtZSxkaXN0YW5jZSxzcGVlZCxkaXN0YW5jZSpzcGVlZFxcbkFubmEsMTUuNSw5LjUsMTQ3LjNcXG5CZWF0LDMzLjIsMTEuMiwzNzEuOFxcbkNhcmwsOS41LDE0LjksMTQxLjZcXG5EaWFuYSw0NS4zLDEyLjUsNTY2LjNcXG5FbW1hLDkuNywxMS42LDExMi41XFxuRnJhbmssMTEuNiwxMS4wLDEyNy42XFxuR2FieSwyMS42LDkuOCwyMTEuN1xcbkhhbnMsMzUuMiwxNC4zLDUwMy40XFxuSXJlbmUsMTIuNSwxNC41LDE4MS4zXFxuSmFjb2IsMjkuNSwxMy43LDQwNC4yXFxuS29uc3RhbnRpbiw0MS4yLDguMywzNDJcXG5MYXVyYSwzMy43LDEyLjksNDM0LjdcIlxuXHRcdFx0fSxcblx0XHRcdFwidGVtcGxhdGVcIjoge1xuXHRcdFx0XHRcImNvbG9yXCI6IFwiZGF0YUF0KDMpXCIsXG5cdFx0XHRcdFwiY29sb3JTY2FsZVwiOiB7XG5cdFx0XHRcdFx0XCJ0eXBlXCI6IFwiZDMuc2NhbGVTZXF1ZW50aWFsXCIsXG5cdFx0XHRcdFx0XCJkb21haW5cIjogXCJleHRlbnRBdCgzKVwiLFxuXHRcdFx0XHRcdFwicmFuZ2VcIjogXCJpbnRlcnBvbGF0ZUxhYihsaW1lLHJlZClcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcImxheWVyMFwiOiB7XG5cdFx0XHRcdFx0XCJidWJibGVcIjoge1xuXHRcdFx0XHRcdFx0XCJub0ZpbGxcIjogZmFsc2Vcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRcImV4dGVuZFwiOiBcImRnZi5zZXR1cEJ1YmJsZURpYWdyYW1TdGFuZGFyZFwiXG5cdFx0fVxuXHR9LFxuXHRcblx0XCJnYWxsZXJ5LnNldHVwU2NhdHRlckRpYWdyYW1XaXRoTGFiZWxzXCI6IHtcblx0XHRcInRpdGxlXCI6IFwiU2NhdHRlciBEaWFncmFtIHdpdGggTGFiZWxzXCIsXG5cdFx0XCJkZXNjcmlwdGlvblwiOiBcIjxiPlNjYXR0ZXIgRGlhZ3JhbSB3aXRoIExhYmVsczwvYj46IFRoZSBzaXplIG9mIHRoZSBkYXRhIHBvaW50cyBzaG93cyBkaXN0YW5jZSB4IHNwZWVkLjxiciAvPk9uIDxlbT5tb3VzZSBvdmVyPC9lbT4gKG9yIDxlbT50YXA8L2VtPiBvbiB0b3VjaCBkZXZpY2VzKSB0aGUgbWVzc2FnZSBiZWxvdyB0aGlzIGNhcHRpb24gc2hvd3MgdGhlIHZhbHVlcyBvZiB0aGUgZGF0YSBwb2ludC5cIixcblx0XHRcImNhdGVnb3J5XCI6IFtcInNldHVwXCIsIFwiZ2FsbGVyeVwiXSxcblx0XHRcImRhdGEtZGdmXCI6IHtcblx0XHRcdFwiZGlhbG9nXCI6IFwiZGdmLmRpYWxvZ0xheWVyc0xhcmdlXCIsXG5cdFx0XHRcInJlYWRlclwiOiB7XG5cdFx0XHRcdFwicGFyc2VcIjoge1xuXHRcdFx0XHRcdFwicnVsZTJcIjoge1xuXHRcdFx0XHRcdFx0XCJhdHRyaWJ1dGVcIjogXCJrZXlzQXQoMylcIixcblx0XHRcdFx0XHRcdFwicGFyc2VyXCI6IFwibnVtYmVyUGFyc2UoKVwiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcImRhdGFcIjogXCJuYW1lLGRpc3RhbmNlLHNwZWVkLGRpc3RhbmNlKnNwZWVkXFxuQW5uYSwxNS41LDkuNSwxNDcuM1xcbkJlYXQsMzMuMiwxMS4yLDM3MS44XFxuQ2FybCw5LjUsMTQuOSwxNDEuNlxcbkRpYW5hLDQ1LjMsMTIuNSw1NjYuM1xcbkVtbWEsOS43LDExLjYsMTEyLjVcXG5GcmFuaywxMS42LDExLjAsMTI3LjZcXG5HYWJ5LDIxLjYsOS44LDIxMS43XFxuSGFucywzNS4yLDE0LjMsNTAzLjRcXG5JcmVuZSwxMi41LDE0LjUsMTgxLjNcXG5KYWNvYiwyOS41LDEzLjcsNDA0LjJcXG5Lb25zdGFudGluLDQxLjIsOC4zLDM0MlxcbkxhdXJhLDMzLjcsMTIuOSw0MzQuN1wiXG5cdFx0XHR9LFxuXHRcdFx0XCJ0ZW1wbGF0ZVwiOiB7XG5cdFx0XHRcdFwiaGVpZ2h0XCI6IDM1MCxcblx0XHRcdFx0XCJtYXJnaW5cIjoge1xuXHRcdFx0XHRcdFwicmlnaHRcIjogNDBcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJjb2xvclwiOiBcImRhdGFBdCgzKVwiLFxuXHRcdFx0XHRcInhTY2FsZVwiOiB7XG5cdFx0XHRcdFx0XCJkb21haW5cIjogXCI1LDUwXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJ5U2NhbGVcIjoge1xuXHRcdFx0XHRcdFwiZG9tYWluXCI6IFwiNy41LDE1XCJcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJjb2xvclNjYWxlXCI6IHtcblx0XHRcdFx0XHRcInR5cGVcIjogXCJkMy5zY2FsZVNlcXVlbnRpYWxcIixcblx0XHRcdFx0XHRcImRvbWFpblwiOiBcImV4dGVudEF0KDMpXCIsXG5cdFx0XHRcdFx0XCJyYW5nZVwiOiBcImludGVycG9sYXRlTGFiKGxpbWUscmVkKVwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwibGF5ZXIwXCI6IHtcblx0XHRcdFx0XHRcInlHcmlkXCI6IHtcblx0XHRcdFx0XHRcdFwic3Ryb2tlRGFzaEFycmF5XCI6IFwiMiwyXCJcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFwieEdyaWRcIjoge1xuXHRcdFx0XHRcdFx0XCJzdHJva2VEYXNoQXJyYXlcIjogXCIyLDJcIlxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XCJ4VGlja3NcIjogNVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcImxheWVyMlwiOiB7XG5cdFx0XHRcdFx0XCJ5MVNjYWxlXCI6IHtcblx0XHRcdFx0XHRcdFwiZG9tYWluXCI6IFwiZXh0ZW50QXQoMylcIixcblx0XHRcdFx0XHRcdFwicmFuZ2VcIjogXCIwLjc0LDEuNVwiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcInkxU2NhbGVcIjoge1xuXHRcdFx0XHRcdFwicmFuZ2VcIjogXCI1LDIwXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJ5MVwiOiBcImRhdGFBdCgzKVwiXG5cdFx0XHR9LFxuXHRcdFx0XCJleHRlbmRcIjogXCJkZ2Yuc2V0dXBTY2F0dGVyRGlhZ3JhbVdpdGhMYWJlbHNcIlxuXHRcdH1cblx0fSxcblx0XG5cdFwiZ2FsbGVyeS5zZXR1cE11bHRpU2VyaWVzVHdvQmFyc0NvbXBhcmVEaWFncmFtXCI6IHtcblx0XHRcInRpdGxlXCI6IFwiVHdvIEJhcnMgQ29tcGFyZSBEaWFncmFtXCIsXG5cdFx0XCJkZXNjcmlwdGlvblwiOiBcIjxiPlR3byBCYXJzIENvbXBhcmlzb248L2I+OiBDb21wYXJlIHR3byBkYXRhIHNlcmllcyAoZS5nLiwgb2xkIC8gbmV3KS5cIixcblx0XHRcImNhdGVnb3J5XCI6IFtcInNldHVwXCIsIFwiZ2FsbGVyeVwiXSxcblx0XHRcImRhdGEtZGdmXCI6IHtcblx0XHRcdFwiZGlhbG9nXCI6IFwiZGdmLmRpYWxvZ0xheWVyc1NtYWxsXCIsXG5cdFx0XHRcInJlYWRlclwiOiB7XG5cdFx0XHRcdFwiZGF0YVwiOiBcIngsb2xkLG5ld1xcbkEsNSwyXFxuQiwzLDRcXG5DLDksNlxcbkUsNyw4XFxuRiw1LDhcXG5HLDMsMlxcbkgsMTEsN1wiLFxuXHRcdFx0XHRcImNhY2hlRGF0YVwiOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0XCJ0ZW1wbGF0ZVwiOiB7XG5cdFx0XHRcdFwiY29sb3JTY2FsZVwiOiB7XG5cdFx0XHRcdFx0XCJyYW5nZVwiOiBcInJlZFwiXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRcImV4dGVuZFwiOiBcImRnZi5zZXR1cE11bHRpU2VyaWVzVHdvQmFyc0NvbXBhcmVEaWFncmFtXCJcblx0XHR9XG5cdH0sXG5cdFxuXHRcImdhbGxlcnkuc2V0dXBCYXJEaWFncmFtV2l0aExhYmVsXCI6IHtcblx0XHRcInRpdGxlXCI6IFwiQmFyIERpYWdyYW0gd2l0aCBMYWJlbHNcIixcblx0XHRcImRlc2NyaXB0aW9uXCI6IFwiPGI+QmFyIERpYWdyYW0gd2l0aCBMYWJlbHM8L2I+OiBPbiA8ZW0+bW91c2Ugb3ZlcjwvZW0+IChvciA8ZW0+dGFwPC9lbT4gb24gdG91Y2ggZGV2aWNlcykgdGhlIG1lc3NhZ2UgYmVsb3cgdGhpcyBjYXB0aW9uIHNob3dzIHRoZSB2YWx1ZXMgb2YgdGhlIGRhdGEgcG9pbnQuXCIsXG5cdFx0XCJjYXRlZ29yeVwiOiBbXCJzZXR1cFwiLCBcImdhbGxlcnlcIl0sXG5cdFx0XCJkYXRhLWRnZlwiOiB7XG5cdFx0XHRcImRpYWxvZ1wiOiBcImRnZi5kaWFsb2dMYXllcnNNZWRpdW1cIixcblx0XHRcdFwicmVhZGVyXCI6IHtcblx0XHRcdFx0XCJkYXRhXCI6IFwibmFtZSxrbS93ZWVrXFxuQW5uYSwxNS41XFxuQmVhdCwzMy4yXFxuQ2FybCw5LjVcXG5Eb3Jpcyw0NS4zXFxuRW1tYSw5LjdcIixcblx0XHRcdFx0XCJjYWNoZURhdGFcIjogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdFwidGVtcGxhdGVcIjoge1xuXHRcdFx0XHRcInlTY2FsZVwiOiB7XG5cdFx0XHRcdFx0XCJkb21haW5cIjogXCIwLDUwXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJjb2xvclNjYWxlXCI6IHtcblx0XHRcdFx0XHRcInJhbmdlXCI6IFwiZGFya29yYW5nZVwiXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRcImV4dGVuZFwiOiBcImRnZi5zZXR1cEJhckRpYWdyYW1XaXRoTGFiZWxcIlxuXHRcdH1cblx0fSxcblx0XG5cdFwiZ2FsbGVyeS5zZXR1cExpbmVEaWFncmFtV2l0aERvdHNcIjoge1xuXHRcdFwidGl0bGVcIjogXCJMaW5lIERpYWdyYW0gd2l0aCBEb3RzXCIsXG5cdFx0XCJkZXNjcmlwdGlvblwiOiBcIjxiPkxpbmUgRGlhZ3JhbSB3aXRoIERvdHM8L2I+OiBUaGUgZGF0YSBwb2ludHMgb2YgdGhlIGxpbmUgYXJlIG1ha2VkIHdpdGggZG90cy48YnIgLz5PbiA8ZW0+bW91c2Ugb3ZlcjwvZW0+IChvciA8ZW0+dGFwPC9lbT4gb24gdG91Y2ggZGV2aWNlcykgdGhlIG1lc3NhZ2UgYmVsb3cgdGhpcyBjYXB0aW9uIHNob3dzIHRoZSB2YWx1ZXMgb2YgdGhlIGRhdGEgcG9pbnQuXCIsXG5cdFx0XCJjYXRlZ29yeVwiOiBbXCJzZXR1cFwiLCBcImdhbGxlcnlcIl0sXG5cdFx0XCJkYXRhLWRnZlwiOiB7XG5cdFx0XHRcInRlbXBsYXRlXCI6IHtcblx0XHRcdFx0XCJjb2xvclNjYWxlXCI6IHtcblx0XHRcdFx0XHRcInJhbmdlXCI6IFwiZGFya2JsdWVcIlxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0XCJyZWFkZXJcIjp7XG5cdFx0XHRcdFwiZGF0YVwiOiBcIngseVxcbjEsMlxcbjMsNFxcbjUsM1xcbjksMVxcbjE1LDlcXG4xOSwxMVxcbjI1LDlcXG4zMSw2XFxuMzUsOFxcbjQwLDEyXCJcblx0XHRcdH0sXG5cdFx0XHRcImV4dGVuZFwiOiBcImRnZi5zZXR1cExpbmVEaWFncmFtV2l0aERvdHNcIlxuXHRcdH1cblx0fSxcblxuXHRcImdhbGxlcnkuc2V0dXBMaW5lRGlhZ3JhbU5hdHVyYWxDdXJ2ZVwiOiB7XG5cdFx0XCJ0aXRsZVwiOiBcIkxpbmUgRGlhZ3JhbSB3aXRoIE5hdHVyYWwgQ3VydmVcIixcblx0XHRcImRlc2NyaXB0aW9uXCI6IFwiPGI+TGluZSBEaWFncmFtIHdpdGggTmF0dXJhbCBDdXJ2ZTwvYj46IFRoZSBsaW5lIGZvcm1zIGEgbmF0dXJhbCBjdXJ2ZSBiZXR3ZWVuIHRoZSBkYXRhIHBvaW50cy5cIixcblx0XHRcImNhdGVnb3J5XCI6IFtcInNldHVwXCIsIFwiZ2FsbGVyeVwiXSxcblx0XHRcImRhdGEtZGdmXCI6IHtcblx0XHRcdFwiZGlhbG9nXCI6IFwiZGdmLmRpYWxvZ0xheWVyc01lZGl1bVwiLFxuXHRcdFx0XCJyZWFkZXJcIjoge1xuXHRcdFx0XHRcImRhdGFcIjogXCJ4LHlcXG4xLDJcXG4zLDRcXG41LDNcXG45LDFcXG4xNSw5XFxuMTksMTFcXG4yNSw5XFxuMzEsNlxcbjM1LDhcXG40MCwxMlwiXG5cdFx0XHR9LFxuXHRcdFx0XCJ0ZW1wbGF0ZVwiOiB7XG5cdFx0XHRcdFwiY29sb3JTY2FsZVwiOiB7XG5cdFx0XHRcdFx0XCJyYW5nZVwiOiBcImRhcmtibHVlXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJsYXllcjFcIjoge1xuXHRcdFx0XHRcdFwic3Ryb2tlV2lkdGhcIjogXCI4cHhcIlxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0XCJleHRlbmRcIjogXCJkZ2Yuc2V0dXBMaW5lRGlhZ3JhbU5hdHVyYWxDdXJ2ZVwiXG5cdFx0fVxuXHR9LFxuXHRcdFxuXHRcImdhbGxlcnkuc2V0dXBCYXJEaWFncmFtV2l0aEJhY2tncm91bmRJbWFnZVwiOiB7XG5cdFx0XCJ0aXRsZVwiOiBcIkJhciBEaWFncmFtIHdpdGggQmFja2dyb3VuZCBJbWFnZVwiLFxuXHRcdFwiZGVzY3JpcHRpb25cIjogXCI8c3Ryb25nPkJhciBEaWFncmFtIHdpdGggQmFja2dyb3VuZCBJbWFnZTwvc3Ryb25nPjogSXQgaXMgZWFzeSB0byBzZXQgYSBiYWNrZ3JvdW5kIGltYWdlIHRvIGEgZGlhZ3JhbS5cIixcblx0XHRcImNhdGVnb3J5XCI6IFtcInNldHVwXCIsIFwiZ2FsbGVyeVwiXSxcblx0XHRcImRhdGEtZGdmXCI6IHtcblx0XHRcdFwiZGlhbG9nXCI6IFwiZGdmLmRpYWxvZ0xheWVyc0xhcmdlXCIsXG5cdFx0XHRcInJlYWRlclwiOiB7XG5cdFx0XHRcdFwiZGF0YVwiOiBcIm5hbWUsc3RlcHMvd2Vla1xcbkFubmEsMTUuNVxcbkJlYXQsMzMuMlxcbkNhcmwsOS41XFxuRG9yaXMsNDUuM1xcbkVtbWEsOS43XCIsXG5cdFx0XHRcdFwiY2FjaGVEYXRhXCI6IHRydWVcblx0XHRcdH0sXG5cdFx0XHRcInRlbXBsYXRlXCI6IHtcblx0XHRcdFx0XCJ5U2NhbGVcIjoge1xuXHRcdFx0XHRcdFwiZG9tYWluXCI6IFwiMCw1MFwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwiY29sb3JTY2FsZVwiOiB7XG5cdFx0XHRcdFx0XCJyYW5nZVwiOiBcInRvbWF0b1wiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwibGF5ZXIzXCI6IHtcblx0XHRcdFx0XHRcInR5cGVcIjogXCJkZ2YudGVtcGxhdGVJbWFnZVwiLFxuXHRcdFx0XHRcdFwibGF5ZXJcIjogeyBcInpJbmRleFwiOiAtMSB9LFxuXHRcdFx0XHRcdFwidXJsXCI6IFwiaHR0cHM6Ly9kZ2Zqcy5vcmcvcmVzb3VyY2VzL3N0YWlyd2F5LmpwZ1wiLFxuXHRcdFx0XHRcdFwicHJlc2VydmVBc3BlY3RSYXRpb1wiOiB7XG5cdFx0XHRcdFx0XHRcImFsaWduXCI6IFwieE1pZFlNaWRcIixcblx0XHRcdFx0XHRcdFwibWVldE9yU2xpY2VcIjogXCJzbGljZVwiXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcInRyYW5zaXRpb25cIjoge1xuXHRcdFx0XHRcdFx0XCJlYXNlXCI6IFwiZDMuZWFzZUxpbmVhclwiLFxuXHRcdFx0XHRcdFx0XCJkZWxheVwiOiBcIjBcIixcblx0XHRcdFx0XHRcdFwiZHVyYXRpb25cIjogXCIwXCJcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRcInN0eWxlXCI6IHtcblx0XHRcdFx0XCJjc3NcIjogXCIjaWQgLmJhciB7IG9wYWNpdHk6IDAuODsgfVwiXG5cdFx0XHR9LFxuXHRcdFx0XCJleHRlbmRcIjogXCJkZ2Yuc2V0dXBCYXJEaWFncmFtV2l0aExhYmVsXCJcblx0XHR9XG5cdH0sXG5cdFxuXHRcImdhbGxlcnkuc2V0dXBCYXJEaWFncmFtV2l0aFRocmVzaG9sZENvbG9yU2NhbGVcIjoge1xuXHRcdFwidGl0bGVcIjogXCJCYXIgRGlhZ3JhbSB3aXRoIFRocmVzaG9sZCBDb2xvciBTY2FsZVwiLFxuXHRcdFwiZGVzY3JpcHRpb25cIjogXCI8Yj5CYXIgRGlhZ3JhbSB3aXRoIGEgVGhyZXNob2xkIENvbG9yIFNjYWxlPC9iPjogVGhlIGRhdGEgaXMgcmFuZG9tIGFuZCB1cGRhdGVkIGV2ZXJ5IDUgc2Vjb25kcyBmcm9tIGEgcmVtb3RlIGRhdGEgc2VydmljZS4gVGhlIGJhcnMgdXBkYXRlIHdpdGggYSBzaW51c29pZGFsIHRyYW5zaXRpb25zIHdpdGggYSBkdXJhdGlvbiBvZiAxIHNlY29uZC4gVGhlIGNvbG9yIHNjYWxlIHVzZXMgdGhlIGZvbGxvd2luZyB0aHJlc2hvbGRzOjxiciAvPiZsdDsyNSA8c3BhbiBzdHlsZT0nY29sb3I6bGlnaHRibHVlJz5saWdodGJsdWU8L3NwYW4+LCAmbHQ7NTAgPHNwYW4gc3R5bGU9J2NvbG9yOmJsdWUnPmJsdWU8L3NwYW4+LCAmbHQ7NzUgPHNwYW4gc3R5bGU9J2NvbG9yOm9yYW5nZSc+b3JhbmdlPC9zcGFuPiwgJmd0Oz03NSA8c3BhbiBzdHlsZT0nY29sb3I6cmVkJz5yZWQ8L3NwYW4+XCIsXG5cdFx0XCJjYXRlZ29yeVwiOiBbXCJzZXR1cFwiLCBcImdhbGxlcnlcIl0sXG5cdFx0XCJkYXRhLWRnZlwiOiB7XG5cdFx0XHRcImRpYWxvZ1wiOiBcImRnZi5kaWFsb2dMYXllcnNTbWFsbFwiLFxuXHRcdFx0XCJyZWFkZXJcIjoge1xuXHRcdFx0XHRcInR5cGVcIjogXCJkZ2YucmVhZGVySlNPTlwiLFxuXHRcdFx0XHRcInVybFwiOiBcImh0dHBzOi8vZGdmanMub3JnL3Jlc291cmNlcy9yYW5kb20tZGF0YS5waHBcIlxuXHRcdFx0fSxcblx0XHRcdFwidGVtcGxhdGVcIjoge1xuXHRcdFx0XHRcImNvbG9yXCI6IFwiZGF0YUF0KDEpXCIsXG5cdFx0XHRcdFwieFNjYWxlXCI6IHtcblx0XHRcdFx0XHRcInBhZGRpbmdJbm5lclwiOiAwLjVcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJ5U2NhbGVcIjoge1xuXHRcdFx0XHRcdFwiZG9tYWluXCI6IFwiMCwxMDBcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcImNvbG9yU2NhbGVcIjoge1xuXHRcdFx0XHRcdFwidHlwZVwiOiBcImQzLnNjYWxlVGhyZXNob2xkXCIsXG5cdFx0XHRcdFx0XCJkb21haW5cIjogXCIyNSw1MCw3NVwiLFxuXHRcdFx0XHRcdFwicmFuZ2VcIjogXCJsaWdodGJsdWUsYmx1ZSxvcmFuZ2UscmVkXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJsYXllcjBcIjoge1xuXHRcdFx0XHRcdFwieVRpY2tWYWx1ZXNcIjogXCIyNSw1MCw3NSwxMDBcIixcblx0XHRcdFx0XHRcInlHcmlkXCI6IHtcblx0XHRcdFx0XHRcdFwic3Ryb2tlRGFzaEFycmF5XCI6IFwiMiwyXCJcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwidHJhbnNpdGlvblwiOiB7XG5cdFx0XHRcdFx0XCJlYXNlXCI6IFwiZDMuZWFzZVNpblwiLFxuXHRcdFx0XHRcdFwiZGVsYXlcIjogXCJpbmRleGVkKDI1MClcIixcblx0XHRcdFx0XHRcImR1cmF0aW9uXCI6IFwiMTAwMFwiXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRcImV4dGVuZFwiOiBcImRnZi5zZXR1cEJhckRpYWdyYW1XaXRoTGFiZWxcIixcblx0XHRcdFwic2NoZWR1bGVyXCI6IHtcblx0XHRcdFx0XCJ0eXBlXCI6IFwiZGdmLnNjaGVkdWxlckludGVydmFsXCIsXG5cdFx0XHRcdFwiaW50ZXJ2YWxcIjogXCI1MDAwXCIsXG5cdFx0XHRcdFwicmVwZWF0XCI6IFwiM1wiXG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRcblx0XCJnYWxsZXJ5LnNldHVwTXVsdGlTZXJpZXNMaW5lRGlhZ3JhbVwiOiB7XG5cdFx0XCJ0aXRsZVwiOiBcIkxpbmUgRGlhZ3JhbSB3aXRoIFR3byBEYXRhU2VyaWVzXCIsXG5cdFx0XCJkZXNjcmlwdGlvblwiOiBcIjxiPkxpbmUgZGlhZ3JhbSB3aXRoIHR3byBkYXRhIHNlcmllczwvYj46IFRoaXMgc2V0dXAgdXNlcyB0d28gbGluZSBkaWFncmFtcyBvbiBkaWZmZXJlbnQgbGF5ZXJzIG9uZSBhYm92ZSB0aGUgb3RoZXIuXCIsXG5cdFx0XCJjYXRlZ29yeVwiOiBbXCJzZXR1cFwiLCBcImdhbGxlcnlcIl0sXG5cdFx0XCJkYXRhLWRnZlwiOiB7XG5cdFx0XHRcImRpYWxvZ1wiOiBcImRnZi5kaWFsb2dMYXllcnNMYXJnZVwiLFxuXHRcdFx0XCJyZWFkZXJcIjoge1xuXHRcdFx0XHRcImRhdGFcIjpcIngsZGlzdGFuY2Usc3BlZWRcXG4wLDAuMjUsOFxcbjEsMC41LDRcXG4zLDEsMlxcbjUsMiwxXFxuNyw0LDJcXG45LDgsNFxcbjExLDE2LDhcIixcblx0XHRcdFx0XCJjYWNoZURhdGFcIjogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdFwidGVtcGxhdGVcIjoge1xuXHRcdFx0XHRcIm1hcmdpblwiOiB7XG5cdFx0XHRcdFx0XCJyaWdodFwiOiAxMDBcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJjb2xvclNjYWxlXCI6IHtcblx0XHRcdFx0XHRcInJhbmdlXCI6IFwiZGdmLnNjaGVtZUZld3M5XCJcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJsYXllcjFcIjoge1xuXHRcdFx0XHRcdFwic3Ryb2tlV2lkdGhcIjogXCIycHhcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcImxheWVyMlwiOiB7XG5cdFx0XHRcdFx0XCJzdHJva2VXaWR0aFwiOiBcIjJweFwiXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRcImV4dGVuZFwiOiBcImRnZi5zZXR1cE11bHRpU2VyaWVzTGluZURpYWdyYW1cIlxuXHRcdH1cblx0fSxcblxuXHRcImdhbGxlcnkuc2V0dXBUaW1lTGluZURvdERpYWdyYW1cIjoge1xuXHRcdFwidGl0bGVcIjogXCJMaW5lIERpYWdyYW0gd2l0aCBEb3RzIGFuZCBhIFRpbWUgQmFzZWQgU2NhbGVcIixcblx0XHRcImRlc2NyaXB0aW9uXCI6IFwiPGI+TGluZSBEaWFncmFtIHdpdGggRG90cyBhbmQgYSBUaW1lIEJhc2VkIFNjYWxlPC9iPjogVGhpcyBzZXR1cCB1c2VzIGEgdGltZS1iYXNlZCB4LWF4aXMuXCIsXG5cdFx0XCJjYXRlZ29yeVwiOiBbXCJzZXR1cFwiLCBcImdhbGxlcnlcIl0sXG5cdFx0XCJkYXRhLWRnZlwiOiB7XG5cdFx0XHRcImRpYWxvZ1wiOiBcImRnZi5kaWFsb2dMYXllcnNTbWFsbFwiLFxuXHRcdFx0XCJyZWFkZXJcIjoge1xuXHRcdFx0XHRcImRhdGFcIjogXCJtb250aCxrbS93ZWVrXFxuMjAxNy0wMS0xNSwwLjVcXG4yMDE3LTAzLTE1LDEuN1xcbjIwMTctMDUtMDEsMi40XFxuMjAxNy0wNi0wNSw0XFxuMjAxNy0wNi0yOCw4LjVcXG4yMDE3LTA5LTE1LDE2LjhcIixcblx0XHRcdFx0XCJjYWNoZURhdGFcIjogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdFwidGVtcGxhdGVcIjoge1xuXHRcdFx0XHRcImNvbG9yU2NhbGVcIjoge1xuXHRcdFx0XHRcdFwicmFuZ2VcIjogXCJkYXJrZ29sZGVucm9kXCJcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdFwiZXh0ZW5kXCI6IFwiZGdmLnNldHVwVGltZUxpbmVEb3RcIlxuXHRcdH1cblx0fVxufTsiLCJpbXBvcnQgKiBhcyBkMyBmcm9tIFwiZDNcIjtcbmltcG9ydCB7IGV4dGVuZCB9IGZyb20gXCIuLi8uLi9kZ2YtdGFnXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxlZ2VuZCgpIHtcblxuXHR2YXJcdGxheWVyLFxuXHRcdGNsYXNzZWQsXG5cdFx0b3JpZW50LFxuXHRcdHdpZHRoLCBoZWlnaHQsXG5cdFx0bWFyZ2luLFxuXHRcdGtleSwgeCwgeSwgY29sb3IsXG5cdFx0eFNjYWxlLCB5U2NhbGUsIGNvbG9yU2NhbGUsXG5cdFx0dHJhbnNpdGlvbiwgZW50ZXJUcmFuc2l0aW9uLCBleGl0VHJhbnNpdGlvbixcblx0XHRjYWxsYmFjaywgZW50ZXJDYWxsYmFjaywgZXhpdENhbGxiYWNrLFxuXHRcdG1vdXNlT3ZlckNhbGxiYWNrLCBtb3VzZUxlYXZlQ2FsbGJhY2ssXG5cdFx0dG91Y2hTdGFydENhbGxiYWNrLCB0b3VjaEVuZENhbGxiYWNrLFxuXHRcdFxuXHRcdGxhYmVsLFxuXHRcdHBvc2l0aW9uLFxuXHRcdGludGVycG9sYXRlU3RlcHMsXG5cdFx0dGV4dEZvcm1hdCxcblx0XHRoYW5kbGU7XG5cdFx0XG5cdGZ1bmN0aW9uIHRlbXBsYXRlKHNlbGVjdGlvbikge1xuXHRcdFxuXHRcdC8vIERFRkFVTFRTXHRcdFxuXHRcdHRyYW5zaXRpb24gPSB0cmFuc2l0aW9uIHx8IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHQuZHVyYXRpb24oMCk7IH07XG5cdFx0ZW50ZXJUcmFuc2l0aW9uID0gZW50ZXJUcmFuc2l0aW9uIHx8IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHQuZHVyYXRpb24oMCk7IH07XG5cdFx0ZXhpdFRyYW5zaXRpb24gPSBleGl0VHJhbnNpdGlvbiB8fCBmdW5jdGlvbih0KSB7IHJldHVybiB0LmR1cmF0aW9uKDApOyB9O1xuXHRcdFxuXHRcdGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0ZW50ZXJDYWxsYmFjayA9IGVudGVyQ2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0ZXhpdENhbGxiYWNrID0gZXhpdENhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdFxuXHRcdG1vdXNlT3ZlckNhbGxiYWNrID0gbW91c2VPdmVyQ2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0bW91c2VMZWF2ZUNhbGxiYWNrID0gbW91c2VMZWF2ZUNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdFxuXHRcdHRvdWNoU3RhcnRDYWxsYmFjayA9IHRvdWNoU3RhcnRDYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHR0b3VjaEVuZENhbGxiYWNrID0gdG91Y2hFbmRDYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHRcblx0XHRjbGFzc2VkID0gY2xhc3NlZCB8fCBcImxlZ2VuZFwiO1xuXHRcdFxuXHRcdHBvc2l0aW9uID0gcG9zaXRpb24gfHwgXCJsZWZ0XCI7XG5cdFx0aW50ZXJwb2xhdGVTdGVwcyA9IGludGVycG9sYXRlU3RlcHMgfHwgMTA7XG5cdFx0aGFuZGxlID0gZXh0ZW5kKHsgd2lkdGg6IDE2LCBoZWlnaHQ6IDE2LCBwYWRkaW5nOiAxLjI1IH0sIGhhbmRsZSk7XG5cdFx0XG5cdFx0c2VsZWN0aW9uLmVhY2goZnVuY3Rpb24oZGF0YSkge1xuXHRcdFxuXHRcdFx0dmFyIHcgPSB0ZW1wbGF0ZS5jb250ZW50V2lkdGgoKSxcblx0XHRcdFx0Zm9ybWF0ID0gdGV4dEZvcm1hdCA/IGQzLmZvcm1hdCh0ZXh0Rm9ybWF0KSA6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH07XG5cdFx0XHRcblx0XHRcdHZhciBub2RlID0gZDMuc2VsZWN0KHRoaXMpO1xuXHRcdFx0XHRcblx0XHRcdC8vIEdyb3VwIGxlZ2VuZFxuXHRcdFx0dmFyIGcgPSBub2RlLnNlbGVjdChcImdcIik7XG5cdFx0XHRcblx0XHRcdGlmKGcuZW1wdHkoKSkge1xuXHRcdFx0XHRnID0gbm9kZS5hcHBlbmQoXCJnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBjbGFzc2VkKVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0c3dpdGNoKHBvc2l0aW9uKSB7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGNhc2UgXCJyaWdodFwiOlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAodyAtIGhhbmRsZS53aWR0aCkgKyBcIiwgMClcIjtcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcblx0XHRcdFx0Zy5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcImxhYmVsXCIpXG5cdFx0XHRcdFx0LnN0eWxlKFwidGV4dC1hbmNob3JcIiwgcG9zaXRpb24gPT09IFwibGVmdFwiID8gXCJzdGFydFwiIDogXCJlbmRcIilcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIFwiMS4yMWVtXCIpXG5cdFx0XHRcdFx0LnRleHQobGFiZWwgPT09IFwiZnVuY3Rpb25cIiA/IGxhYmVsKGRhdGEpIDogbGFiZWwpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRzd2l0Y2goY29sb3JTY2FsZS50b1N0cmluZygpKSB7XG5cdFx0XHRcdFxuXHRcdFx0Y2FzZSBkMy5zY2FsZVRocmVzaG9sZCgpLnRvU3RyaW5nKCk6XG5cdFx0XHRcdGRyYXcoZywgXCJ0aHJlc2hvbGRcIiwgW2QzLm1pbihjb2xvclNjYWxlLmRvbWFpbigpKS0xXS5jb25jYXQoY29sb3JTY2FsZS5kb21haW4oKSkpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0XG5cdFx0XHRjYXNlIGQzLnNjYWxlU2VxdWVudGlhbCgpLnRvU3RyaW5nKCk6XG5cdFx0XHRcdHZhciBzdGVwID0gKGNvbG9yU2NhbGUuZG9tYWluKClbMV0gLSBjb2xvclNjYWxlLmRvbWFpbigpWzBdKSAvIChpbnRlcnBvbGF0ZVN0ZXBzLTEpLFxuXHRcdFx0XHRcdHZhbHVlcyA9IFtdO1xuXHRcdFx0XG5cdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBpbnRlcnBvbGF0ZVN0ZXBzOyBpKyspIHtcblx0XHRcdFx0XHR2YWx1ZXMgPSB2YWx1ZXMuY29uY2F0KGNvbG9yU2NhbGUuZG9tYWluKClbMV0gLSBpICogc3RlcCk7XG5cdFx0XHRcdH1cblx0XHRcdFxuXHRcdFx0XHRkcmF3KGcsIFwic2VxdWVudGlhbFwiLCB2YWx1ZXMpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRkcmF3KGcsIFwib3JkaW5hbFwiLCBjb2xvclNjYWxlLmRvbWFpbigpKTtcblx0XHRcdH1cdFx0XHRcblx0XHRcdFxuXHRcdFx0ZnVuY3Rpb24gZHJhdyhnLCB0eXBlLCB2YWx1ZXMpIHtcblx0XHRcdFxuXHRcdFx0XHQvLyBQb3NpdGlvbiBsYWJlbFxuXHRcdFx0XHRnLnNlbGVjdChcInRleHQubGFiZWxcIilcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIlxuXHRcdFx0XHRcdFx0KyAocG9zaXRpb24gPT09IFwibGVmdFwiID8gMTAgOiAtMTApXG5cdFx0XHRcdFx0XHQrIFwiLCBcIiArICh2YWx1ZXMubGVuZ3RoICogaGFuZGxlLmhlaWdodCAqIGhhbmRsZS5wYWRkaW5nKSArIFwiKVwiKTtcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdHZhciBpdGVtID0gZy5zZWxlY3RBbGwoXCIuaXRlbVwiKTtcblx0XHRcdFx0XG5cdFx0XHRcdHZhciBpdGVtRW50ZXIgPSBpdGVtLmRhdGEodmFsdWVzKVxuXHRcdFx0XHRcdC5lbnRlcigpLmFwcGVuZChcImdcIilcblx0XHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJpdGVtXCIpXG5cdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBcInRyYW5zbGF0ZSgwLCBcIiArIChpICogaGFuZGxlLmhlaWdodCAqIGhhbmRsZS5wYWRkaW5nKSArIFwiKVwiOyB9KTtcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0aXRlbUVudGVyLmFwcGVuZChcInJlY3RcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwiaGFuZGxlXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCBoYW5kbGUud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgaGFuZGxlLmhlaWdodCk7XG5cdFx0XHRcdFxuXHRcdFx0XHRpdGVtRW50ZXIuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0c3dpdGNoKHBvc2l0aW9uKSB7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdFx0Y2FzZSBcInJpZ2h0XCI6XG5cdFx0XHRcdFx0XHRcdHJldHVybiBcInRyYW5zbGF0ZSgtMTAsIFwiICsgKDAuNSAqIGhhbmRsZS5oZWlnaHQpICsgXCIpXCI7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAoaGFuZGxlLndpZHRoICsgMTApICsgXCIsIFwiICsgKDAuNSAqIGhhbmRsZS5oZWlnaHQpICsgXCIpXCI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIFwiMC4zMmVtXCIpXG5cdFx0XHRcdFx0LnN0eWxlKFwidGV4dC1hbmNob3JcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRzd2l0Y2gocG9zaXRpb24pIHtcblx0XHRcdFx0XG5cdFx0XHRcdFx0XHRjYXNlIFwicmlnaHRcIjpcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiZW5kXCI7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJzdGFydFwiO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRpdGVtRW50ZXIubWVyZ2UoaXRlbSkuc2VsZWN0KFwicmVjdFwiKVxuXHRcdFx0XHRcdC50cmFuc2l0aW9uKCkuY2FsbCh0cmFuc2l0aW9uKVxuXHRcdFx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBjb2xvclNjYWxlKGQpOyB9KTtcblx0XHRcdFx0XHRcblx0XHRcdFx0aXRlbUVudGVyLm1lcmdlKGl0ZW0pLnNlbGVjdChcInRleHRcIilcblx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCwgaSkge1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRzd2l0Y2godHlwZSkge1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRjYXNlIFwidGhyZXNob2xkXCI6XG5cdFx0XHRcdFx0XHRcdGlmKGkgPT09IDApIHJldHVybiBcIjxcIiArIGZvcm1hdCh2YWx1ZXNbMV0pO1xuXHRcdFx0XHRcdFx0XHRpZihpID09PSB2YWx1ZXMubGVuZ3RoIC0gMSkgcmV0dXJuIFwiPlwiICsgZm9ybWF0KGQpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZm9ybWF0KHZhbHVlc1tpXSkgKyBcIi1cIiArIGZvcm1hdCh2YWx1ZXNbaSArIDFdKTtcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmb3JtYXQoZCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdGl0ZW0uZXhpdCgpXG5cdFx0XHRcdFx0LnRyYW5zaXRpb24oKS5jYWxsKGV4aXRUcmFuc2l0aW9uKVxuXHRcdFx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCBcInRyYW5zcGFyZW50XCIpXG5cdFx0XHRcdFx0XHQucmVtb3ZlKCk7XHRcdFx0XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHR0ZW1wbGF0ZS5sYXllciA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobGF5ZXIgPSBfLCB0ZW1wbGF0ZSkgOiBsYXllciB8fCB7fTtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmNsYXNzZWQgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNsYXNzZWQgPSBfLCB0ZW1wbGF0ZSkgOiBjbGFzc2VkO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUub3JpZW50ID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChvcmllbnQgPSBfLCB0ZW1wbGF0ZSkgOiBvcmllbnQ7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS53aWR0aCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAod2lkdGggPSBfLCB0ZW1wbGF0ZSkgOiB3aWR0aDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmhlaWdodCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoaGVpZ2h0ID0gXywgdGVtcGxhdGUpIDogaGVpZ2h0O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUubWFyZ2luID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChtYXJnaW4gPSBfLCB0ZW1wbGF0ZSkgOiBtYXJnaW47XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5jb250ZW50V2lkdGggPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gd2lkdGggLSBtYXJnaW4ucmlnaHQgLSBtYXJnaW4ubGVmdDtcblx0fTtcblx0XHRcblx0dGVtcGxhdGUuY29udGVudEhlaWdodCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBoZWlnaHQgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmtleSA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChrZXkgPSBfLCB0ZW1wbGF0ZSkgOiBrZXk7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS54ID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHggPSBfLCB0ZW1wbGF0ZSkgOiB4O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUueSA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh5ID0gXywgdGVtcGxhdGUpIDogeTtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmNvbG9yID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNvbG9yID0gXywgdGVtcGxhdGUpIDogY29sb3I7XG5cdH07XG5cdFx0XHRcblx0dGVtcGxhdGUueFNjYWxlID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh4U2NhbGUgPSBfLCB0ZW1wbGF0ZSkgOiB4U2NhbGU7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS55U2NhbGUgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHlTY2FsZSA9IF8sIHRlbXBsYXRlKSA6IHlTY2FsZTsgXG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5jb2xvclNjYWxlID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjb2xvclNjYWxlID0gXywgdGVtcGxhdGUpIDogY29sb3JTY2FsZTtcblx0fTtcblx0XHRcblx0dGVtcGxhdGUudHJhbnNpdGlvbiA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodHJhbnNpdGlvbiA9IF8sIHRlbXBsYXRlKSA6IHRyYW5zaXRpb247XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5lbnRlclRyYW5zaXRpb24gPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGVudGVyVHJhbnNpdGlvbiA9IF8sIHRlbXBsYXRlKSA6IGVudGVyVHJhbnNpdGlvbjtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmV4aXRUcmFuc2l0aW9uID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChleGl0VHJhbnNpdGlvbiA9IF8sIHRlbXBsYXRlKSA6IGV4aXRUcmFuc2l0aW9uO1xuXHR9O1xuXHRcdFx0XG5cdHRlbXBsYXRlLmNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogY2FsbGJhY2s7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5lbnRlckNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGVudGVyQ2FsbGJhY2sgPSBfLCB0ZW1wbGF0ZSkgOiBlbnRlckNhbGxiYWNrO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuZXhpdENhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGV4aXRDYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IGV4aXRDYWxsYmFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLm1vdXNlT3ZlckNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKG1vdXNlT3ZlckNhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogbW91c2VPdmVyQ2FsbGJhY2s7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5tb3VzZUxlYXZlQ2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobW91c2VMZWF2ZUNhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogbW91c2VMZWF2ZUNhbGxiYWNrO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUudG91Y2hTdGFydENhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRvdWNoU3RhcnRDYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IHRvdWNoU3RhcnRDYWxsYmFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLnRvdWNoRW5kQ2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodG91Y2hFbmRDYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IHRvdWNoRW5kQ2FsbGJhY2s7XG5cdH07XG5cblx0dGVtcGxhdGUubGFiZWwgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobGFiZWwgPSBfLCB0ZW1wbGF0ZSkgOiBsYWJlbDtcblx0fTtcblx0XHRcblx0dGVtcGxhdGUucG9zaXRpb24gPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocG9zaXRpb24gPSBfLCB0ZW1wbGF0ZSkgOiBwb3NpdGlvbjtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmludGVycG9sYXRlU3RlcHMgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoaW50ZXJwb2xhdGVTdGVwcyA9IF8sIHRlbXBsYXRlKSA6IGludGVycG9sYXRlU3RlcHM7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS50ZXh0Rm9ybWF0ID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRleHRGb3JtYXQgPSBfLCB0ZW1wbGF0ZSkgOiB0ZXh0Rm9ybWF0O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuaGFuZGxlID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGhhbmRsZSA9IF8sIHRlbXBsYXRlKSA6IGhhbmRsZTtcblx0fTtcblx0XG5cdHJldHVybiB0ZW1wbGF0ZTtcbn0iLCJpbXBvcnQgKiBhcyBkMyBmcm9tIFwiZDNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbGluZSgpIHtcblxuXHR2YXJcdGxheWVyLFxuXHRcdGNsYXNzZWQsXG5cdFx0b3JpZW50LFxuXHRcdGtleSwgeCwgeSwgY29sb3IsIFxuXHRcdHhTY2FsZSwgeVNjYWxlLCBjb2xvclNjYWxlLFxuXHRcdHRyYW5zaXRpb24sIGVudGVyVHJhbnNpdGlvbiwgZXhpdFRyYW5zaXRpb24sXG5cdFx0Y2FsbGJhY2ssIGVudGVyQ2FsbGJhY2ssIGV4aXRDYWxsYmFjayxcblx0XHRcblx0XHRsaW5lLFxuXHRcdHN0cm9rZVdpZHRoLCBzdHJva2VEYXNoQXJyYXksXG5cdFx0bGFiZWw7XG5cdFx0XG5cdGZ1bmN0aW9uIHRlbXBsYXRlKHNlbGVjdGlvbikge1xuXHRcdFxuXHRcdC8vIERFRkFVTFRTXG5cdFx0Y2xhc3NlZCA9IGNsYXNzZWQgfHwgXCJsaW5lXCI7XG5cdFx0XG5cdFx0dHJhbnNpdGlvbiA9IHRyYW5zaXRpb24gfHwgZnVuY3Rpb24odCkgeyByZXR1cm4gdC5kdXJhdGlvbigwKTsgfTtcblx0XHRlbnRlclRyYW5zaXRpb24gPSBlbnRlclRyYW5zaXRpb24gfHwgZnVuY3Rpb24odCkgeyByZXR1cm4gdC5kdXJhdGlvbigwKTsgfTtcblx0XHRleGl0VHJhbnNpdGlvbiA9IGV4aXRUcmFuc2l0aW9uIHx8IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHQuZHVyYXRpb24oMCk7IH07XG5cdFx0XG5cdFx0Y2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHRlbnRlckNhbGxiYWNrID0gZW50ZXJDYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHRleGl0Q2FsbGJhY2sgPSBleGl0Q2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0XG5cdFx0Ly8gQWRqdXN0IGJhbmR3aWR0aCBpZiBuZWNlc3Nhcnlcblx0XHRmdW5jdGlvbiB4U2NhbGVBZGp1c3RlZChkKSB7XG5cdFx0XHRyZXR1cm4geFNjYWxlKHgoZCkpICsgKHhTY2FsZS5iYW5kd2lkdGggPyB4U2NhbGUuYmFuZHdpZHRoKCkvMiA6IDApOyBcblx0XHR9XG5cdFx0XG5cdFx0ZnVuY3Rpb24geVNjYWxlQWRqdXN0ZWQoZCkge1xuXHRcdFx0cmV0dXJuIHlTY2FsZSh5KGQpKSArICh5U2NhbGUuYmFuZHdpZHRoID8geVNjYWxlLmJhbmR3aWR0aCgpLzIgOiAwKTsgXG5cdFx0fVxuXHRcdFxuXHRcdGxpbmUgPSBsaW5lIHx8IGQzLmxpbmUoKTtcblx0XHRcdFxuXHRcdHNlbGVjdGlvbi5lYWNoKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFxuXHRcdFx0bGFiZWwgPSBsYWJlbCB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIFwiXCI7IH07XG5cdFx0XHRcdFx0XHRcblx0XHRcdGxpbmVcblx0XHRcdFx0LngoeFNjYWxlQWRqdXN0ZWQpXG5cdFx0XHRcdC55KHlTY2FsZUFkanVzdGVkKTtcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdHZhciBsYXN0UG9pbnQgPSBkYXRhW2RhdGEubGVuZ3RoIC0gMV07XG5cdFx0XHRcblx0XHRcdC8vIFVQREFURVx0XHRcblx0XHRcdHZhciBsaW5lcyA9IGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoXCIuXCIgKyBjbGFzc2VkLnJlcGxhY2UoXCIgXCIsIFwiLlwiKSkuZGF0YShbMV0pXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBjbGFzc2VkICsgXCIgdXBkYXRlXCIpLFxuXHRcdFx0XHRcblx0XHRcdFx0bGFiZWxzID0gZDMuc2VsZWN0KHRoaXMpLnNlbGVjdEFsbChcIi5sYWJlbFwiKS5kYXRhKFsxXSlcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwibGFiZWwgdXBkYXRlXCIpO1xuXHRcdFx0XHRcdFx0XHRcblx0XHRcdC8vIEVOVEVSXG5cdFx0XHRsaW5lcy5lbnRlcigpLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBjbGFzc2VkICsgXCIgZW50ZXJcIilcblx0XHRcdFx0LnN0eWxlKFwic3Ryb2tlXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiBjb2xvclNjYWxlKGNvbG9yKGRhdGEpKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LnN0eWxlKFwic3Ryb2tlLXdpZHRoXCIsIHN0cm9rZVdpZHRoKVxuXHRcdFx0XHQuc3R5bGUoXCJzdHJva2UtZGFzaGFycmF5XCIsIHN0cm9rZURhc2hBcnJheSlcblx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCBcIm5vbmVcIilcblx0XHRcdFx0Lm1lcmdlKGxpbmVzKSBcdC8vIEVOVEVSICsgVVBEQVRFXG5cdFx0XHRcdFx0LmRhdHVtKGRhdGEpXG5cdFx0XHRcdFx0LnRyYW5zaXRpb24oKS5jYWxsKHRyYW5zaXRpb24pXG5cdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgbGluZSlcblx0XHRcdFx0XHRcdC5vbihcImVuZFwiLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQzLnNlbGVjdCh0aGlzKS5jYWxsKGNhbGxiYWNrKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRsYWJlbHMuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJsYWJlbCBlbnRlclwiKVxuXHRcdFx0XHQudGV4dCh0eXBlb2YgbGFiZWwgPT09IFwiZnVuY3Rpb25cIiA/IGxhYmVsKGRhdGEpIDogbGFiZWwpXG5cdFx0XHRcdC5tZXJnZShsYWJlbHMpIFx0Ly8gRU5URVIgKyBVUERBVEVcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgeFNjYWxlKHgobGFzdFBvaW50KSkpXG5cdFx0XHRcdFx0LmF0dHIoXCJkeFwiLCBcIjAuMjRlbVwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiZHlcIiwgXCIwLjI0ZW1cIilcblx0XHRcdFx0XHQudHJhbnNpdGlvbigpLmNhbGwodHJhbnNpdGlvbilcblx0XHRcdFx0XHRcdC5hdHRyKFwieVwiLCB5U2NhbGUoeShsYXN0UG9pbnQpKSlcblx0XHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBjb2xvclNjYWxlKGNvbG9yKGRhdGEpKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHQvLyBFWElUXG5cdFx0XHRsaW5lcy5leGl0KClcblx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBjbGFzc2VkICsgXCIgZXhpdFwiKVxuXHRcdFx0XHQudHJhbnNpdGlvbigpLmNhbGwoZXhpdFRyYW5zaXRpb24pXG5cdFx0XHRcdFx0Lm9uKFwiZW5kXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0ZDMuc2VsZWN0KHRoaXMpLmNhbGwoZXhpdENhbGxiYWNrKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5yZW1vdmUoKTtcblx0XHRcdFx0XHRcblx0XHRcdGxhYmVscy5leGl0KClcblx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcImxhYmVsIGV4aXRcIilcblx0XHRcdFx0LnRyYW5zaXRpb24oKS5jYWxsKGV4aXRUcmFuc2l0aW9uKVxuXHRcdFx0XHRcdC5zdHlsZShcIm9wYWNpdHlcIiwgMClcblx0XHRcdFx0XHQucmVtb3ZlKCk7XG5cdFx0fSk7XG5cdH1cblxuXHR0ZW1wbGF0ZS5sYXllciA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobGF5ZXIgPSBfLCB0ZW1wbGF0ZSkgOiBsYXllciB8fCB7fTtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmNsYXNzZWQgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNsYXNzZWQgPSBfLCB0ZW1wbGF0ZSkgOiBjbGFzc2VkO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUub3JpZW50ID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChvcmllbnQgPSBfLCB0ZW1wbGF0ZSkgOiBvcmllbnQ7XG5cdH07XG5cblx0dGVtcGxhdGUua2V5ID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChrZXkgPSBfLCB0ZW1wbGF0ZSkgOiBrZXk7XG5cdH07XG5cdFx0XG5cdHRlbXBsYXRlLnggPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHggPSBfLCB0ZW1wbGF0ZSkgOiB4O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUueSA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeSA9IF8sIHRlbXBsYXRlKSA6IHk7IFxuXHR9O1xuXHRcblx0dGVtcGxhdGUuY29sb3IgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNvbG9yID0gXywgdGVtcGxhdGUpIDogY29sb3I7XG5cdH07XG5cdFx0XHRcblx0dGVtcGxhdGUueFNjYWxlID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh4U2NhbGUgPSBfLCB0ZW1wbGF0ZSkgOiB4U2NhbGU7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS55U2NhbGUgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHlTY2FsZSA9IF8sIHRlbXBsYXRlKSA6IHlTY2FsZTsgXG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5jb2xvclNjYWxlID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjb2xvclNjYWxlID0gXywgdGVtcGxhdGUpIDogY29sb3JTY2FsZTtcblx0fTtcblx0XG5cdHRlbXBsYXRlLnRyYW5zaXRpb24gPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodHJhbnNpdGlvbiA9IF8sIHRlbXBsYXRlKSA6IHRyYW5zaXRpb247XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5lbnRlclRyYW5zaXRpb24gPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGVudGVyVHJhbnNpdGlvbiA9IF8sIHRlbXBsYXRlKSA6IGVudGVyVHJhbnNpdGlvbjtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmV4aXRUcmFuc2l0aW9uID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChleGl0VHJhbnNpdGlvbiA9IF8sIHRlbXBsYXRlKSA6IGV4aXRUcmFuc2l0aW9uO1xuXHR9O1xuXHRcdFx0XG5cdHRlbXBsYXRlLmNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogY2FsbGJhY2s7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5lbnRlckNhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGVudGVyQ2FsbGJhY2sgPSBfLCB0ZW1wbGF0ZSkgOiBlbnRlckNhbGxiYWNrO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuZXhpdENhbGxiYWNrID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGV4aXRDYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IGV4aXRDYWxsYmFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLmxpbmUgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobGluZSA9IF8sIHRlbXBsYXRlKSA6IGxpbmU7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5zdHJva2VXaWR0aCA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChzdHJva2VXaWR0aCA9IF8sIHRlbXBsYXRlKSA6IHN0cm9rZVdpZHRoO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuc3Ryb2tlRGFzaEFycmF5ID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHN0cm9rZURhc2hBcnJheSA9IF8sIHRlbXBsYXRlKSA6IHN0cm9rZURhc2hBcnJheTtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmxhYmVsID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGxhYmVsID0gXywgdGVtcGxhdGUpIDogbGFiZWw7XG5cdH07XG5cdFxuXHRyZXR1cm4gdGVtcGxhdGU7XG59XG4iLCJpbXBvcnQgKiBhcyBkMyBmcm9tIFwiZDNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGFja0xhYmVsKCkge1xuXG5cdHZhclx0bGF5ZXIsXG5cdFx0Y2xhc3NlZCxcblx0XHR3aWR0aCwgaGVpZ2h0LFxuXHRcdG1hcmdpbixcblx0XHR4LCB5LCB5MSwgY29sb3IsIHRleHQsXG5cdFx0eTFTY2FsZSxcblx0XHRjb2xvclNjYWxlLFxuXHRcdHlMYWJlbCxcblx0XHRzb3J0LFxuXHRcdHRyYW5zaXRpb24sIGVudGVyVHJhbnNpdGlvbiwgZXhpdFRyYW5zaXRpb24sXG5cdFx0Y2FsbGJhY2ssIGVudGVyQ2FsbGJhY2ssIGV4aXRDYWxsYmFjayxcblx0XHRtb3VzZU92ZXJDYWxsYmFjaywgbW91c2VMZWF2ZUNhbGxiYWNrLFxuXHRcdHRvdWNoU3RhcnRDYWxsYmFjaywgdG91Y2hFbmRDYWxsYmFjayxcblx0XHRcblx0XHRfcGFjayxcblx0XHRfYnViYmxlO1xuXHRcdFxuXHRmdW5jdGlvbiB0ZW1wbGF0ZShzZWxlY3Rpb24pIHtcblx0XHRcblx0XHQvLyBERUZBVUxUU1x0XHRcblx0XHR0cmFuc2l0aW9uID0gdHJhbnNpdGlvbiB8fCBmdW5jdGlvbih0KSB7IHJldHVybiB0LmR1cmF0aW9uKDApOyB9O1xuXHRcdGVudGVyVHJhbnNpdGlvbiA9IGVudGVyVHJhbnNpdGlvbiB8fCBmdW5jdGlvbih0KSB7IHJldHVybiB0LmR1cmF0aW9uKDApOyB9O1xuXHRcdGV4aXRUcmFuc2l0aW9uID0gZXhpdFRyYW5zaXRpb24gfHwgZnVuY3Rpb24odCkgeyByZXR1cm4gdC5kdXJhdGlvbigwKTsgfTtcblx0XHRcblx0XHRjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdGVudGVyQ2FsbGJhY2sgPSBlbnRlckNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdGV4aXRDYWxsYmFjayA9IGV4aXRDYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHRcblx0XHRtb3VzZU92ZXJDYWxsYmFjayA9IG1vdXNlT3ZlckNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdG1vdXNlTGVhdmVDYWxsYmFjayA9IG1vdXNlTGVhdmVDYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHRcblx0XHR0b3VjaFN0YXJ0Q2FsbGJhY2sgPSB0b3VjaFN0YXJ0Q2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0dG91Y2hFbmRDYWxsYmFjayA9IHRvdWNoRW5kQ2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0XHRcdFxuXHRcdGNsYXNzZWQgPSBjbGFzc2VkIHx8IFwicGFja0xhYmVsXCI7XG5cdFx0XHRcdFxuXHRcdF9wYWNrID0gX3BhY2sgfHwgeyBwYWRkaW5nOiAxLjUgfTtcblx0XHRfYnViYmxlID0gX2J1YmJsZSB8fCB7fTtcblx0XHRcblx0XHR2YXIgdyA9IHRlbXBsYXRlLmNvbnRlbnRXaWR0aCgpLFxuXHRcdFx0aCA9IHRlbXBsYXRlLmNvbnRlbnRIZWlnaHQoKSxcblx0XHRcdGRpYW1ldGVyID0gTWF0aC5taW4odywgaCk7XG5cdFx0XHRcdFx0XHRcdFxuXHRcdHZhciBidWJibGUgPSBkMy5wYWNrKClcblx0XHRcdC5zaXplKFtkaWFtZXRlciwgZGlhbWV0ZXJdKVxuXHRcdFx0LnBhZGRpbmcoX3BhY2sucGFkZGluZyB8fCAxLjUpO1xuXHRcdFx0XHRcblx0XHRzZWxlY3Rpb24uZWFjaChmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcblx0XHRcdGlmKCFkYXRhLm5hbWUpIHtcblx0XHRcdFx0ZGF0YSA9IHsgbmFtZTogXCJyb290XCIsIGNoaWxkcmVuOiBkYXRhIH07XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHZhciByb290ID0gZDMuaGllcmFyY2h5KGNsYXNzZXMoZGF0YSkpXG5cdFx0XHRcdC5zdW0oZnVuY3Rpb24oZCkgeyByZXR1cm4gZC52YWx1ZTsgfSlcblx0XHRcdFx0LnNvcnQoZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gc29ydCA/IHNvcnQoYS52YWx1ZSwgYi52YWx1ZSkgOiB0cnVlOyB9KTtcblx0XHRcdFx0XHRcdFxuXHRcdFx0YnViYmxlKHJvb3QpO1xuXHRcdFx0XG5cdFx0XHR2YXIgbm9kZSA9IGQzLnNlbGVjdCh0aGlzKTtcblx0XHRcdFxuXHRcdFx0Ly8gQ2VudGVyIGJ1YmJsZXNcblx0XHRcdHZhciBnID0gbm9kZS5zZWxlY3QoXCJnXCIpO1xuXHRcdFx0aWYoZy5lbXB0eSgpKSB7XG5cdFx0XHRcdGcgPSBub2RlLmFwcGVuZChcImdcIilcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICh3LzIgLSBkaWFtZXRlci8yKSArIFwiLC1cIiArIChoLzIgLSBkaWFtZXRlci8yKSArIFwiKVwiKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0Ly8gTGFiZWxcblx0XHRcdGlmKGcuc2VsZWN0KFwiLmxhYmVsXCIpLmVtcHR5KCkpIHtcblx0XHRcdFx0Zy5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcImxhYmVsXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBkaWFtZXRlciArIFwiLFwiICsgaCArIFwiKVwiKVx0XHRcblx0XHRcdFx0XHQuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHR5cGVvZiB5TGFiZWwgPT09IFwiZnVuY3Rpb25cIiA/IHlMYWJlbChkYXRhLmNoaWxkcmVuKSA6IHlMYWJlbDsgXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFVQREFURVx0XHRcblx0XHRcdHZhciBidWJibGVzID0gZy5zZWxlY3RBbGwoXCIuXCIgKyBjbGFzc2VkLnJlcGxhY2UoXCIgXCIsIFwiLlwiKSlcblx0XHRcdFx0LmRhdGEocm9vdC5jaGlsZHJlbiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5kYXRhLnBhY2thZ2VOYW1lICsgXCItXCIgKyBkLmRhdGEuY2xhc3NOYW1lOyB9KVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgY2xhc3NlZCArIFwiIHVwZGF0ZVwiKTtcblx0XHRcdFxuXHRcdFx0Ly8gRU5URVJcdFxuXHRcdFx0YnViYmxlcy5lbnRlcigpXG5cdFx0XHRcdC5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBjbGFzc2VkICsgXCIgZW50ZXJcIilcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIGQueCArIFwiLFwiICsgZC55ICsgXCIpXCI7IH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBcIjAuMzRlbVwiKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHRleHQoZC5kYXRhLmRhdGEpOyB9KVxuXHRcdFx0XHRcdC5zdHlsZShcImZvbnQtc2l6ZVwiLCBcIjFlbVwiKVxuXHRcdFx0XHRcdC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG5cdFx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBjb2xvclNjYWxlKGNvbG9yKGQuZGF0YS5kYXRhKSk7IH0pXG5cdFx0XHRcdFx0Lm9uKFwibW91c2VvdmVyXCIsIG1vdXNlT3ZlckNhbGxiYWNrKVxuXHRcdFx0XHRcdC5vbihcIm1vdXNlbGVhdmVcIiwgbW91c2VMZWF2ZUNhbGxiYWNrKVxuXHRcdFx0XHRcdC5vbihcInRvdWNoc3RhcnRcIiwgdG91Y2hTdGFydENhbGxiYWNrKVxuXHRcdFx0XHRcdC5vbihcInRvdWNoZW5kXCIsIHRvdWNoRW5kQ2FsbGJhY2spXG5cdFx0XHRcdFx0LmNhbGwoZW50ZXJDYWxsYmFjaylcblx0XHRcdFx0XHQubWVyZ2UoYnViYmxlcylcdC8vIEVOVEVSICsgVVBEQVRFXG5cdFx0XHRcdFx0XHQudHJhbnNpdGlvbigpLmNhbGwodHJhbnNpdGlvbilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBkLnggKyBcIixcIiArIGQueSArIFwiKVwiOyB9KVxuXHRcdFx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGNvbG9yU2NhbGUoY29sb3IoZC5kYXRhLmRhdGEpKTsgfSlcblx0XHRcdFx0XHRcdFx0LnN0eWxlKFwiZm9udC1zaXplXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHkxU2NhbGUgPyB5MVNjYWxlKHkxKGQuZGF0YS5kYXRhKSkgKyBcImVtXCIgOiB1bmRlZmluZWQ7IH0pXG5cdFx0XHRcdFx0XHRcdC5vbihcImVuZFwiLCBmdW5jdGlvbigpIHsgZDMuc2VsZWN0KHRoaXMpLmNhbGwoY2FsbGJhY2spOyB9KTtcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHQvLyBFWElUXG5cdFx0XHRidWJibGVzLmV4aXQoKVxuXHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGNsYXNzZWQgKyBcIiBleGl0XCIpXG5cdFx0XHRcdC50cmFuc2l0aW9uKCkuY2FsbChleGl0VHJhbnNpdGlvbilcblx0XHRcdFx0XHQub24oXCJlbmRcIiwgZnVuY3Rpb24oKSB7IGQzLnNlbGVjdCh0aGlzKS5jYWxsKGV4aXRDYWxsYmFjayk7IH0pXG5cdFx0XHRcdFx0LnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHQvLyBSZXR1cm5zIGEgZmxhdHRlbmVkIGhpZXJhcmNoeSBjb250YWluaW5nIGFsbCBsZWFmIG5vZGVzIHVuZGVyIHRoZSByb290LlxuXHRcdFx0ZnVuY3Rpb24gY2xhc3Nlcyhyb290KSB7XG5cdFx0XHRcdHZhciBjbGFzc2VzID0gW107XG5cblx0XHRcdFx0ZnVuY3Rpb24gcmVjdXJzZShuYW1lLCBub2RlKSB7XG5cdFx0XHRcdFx0aWYobm9kZS5jaGlsZHJlbikge1xuXHRcdFx0XHRcdFx0bm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XG5cdFx0XHRcdFx0XHRcdHJlY3Vyc2Uobm9kZS5uYW1lLCBjaGlsZCk7IFxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSBlbHNlIGNsYXNzZXMucHVzaCh7IHBhY2thZ2VOYW1lOiBuYW1lLCBjbGFzc05hbWU6IHgobm9kZSksIHZhbHVlOiB5KG5vZGUpLCBkYXRhOiBub2RlIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRyZWN1cnNlKG51bGwsIHJvb3QpO1x0XHRcdFx0XG5cdFx0XHRcdHJldHVybiB7IGNoaWxkcmVuOiBjbGFzc2VzIH07XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHR0ZW1wbGF0ZS5sYXllciA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobGF5ZXIgPSBfLCB0ZW1wbGF0ZSkgOiBsYXllciB8fCB7fTtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmNsYXNzZWQgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNsYXNzZWQgPSBfLCB0ZW1wbGF0ZSkgOiBjbGFzc2VkO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUud2lkdGggPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHdpZHRoID0gXywgdGVtcGxhdGUpIDogd2lkdGg7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5oZWlnaHQgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGhlaWdodCA9IF8sIHRlbXBsYXRlKSA6IGhlaWdodDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLm1hcmdpbiA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobWFyZ2luID0gXywgdGVtcGxhdGUpIDogbWFyZ2luO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuY29udGVudFdpZHRoID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHdpZHRoIC0gbWFyZ2luLnJpZ2h0IC0gbWFyZ2luLmxlZnQ7XG5cdH07XG5cdFx0XG5cdHRlbXBsYXRlLmNvbnRlbnRIZWlnaHQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS54ID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHggPSBfLCB0ZW1wbGF0ZSkgOiB4O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUueSA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh5ID0gXywgdGVtcGxhdGUpIDogeTtcblx0fTtcblx0XG5cdHRlbXBsYXRlLnkxID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHkxID0gXywgdGVtcGxhdGUpIDogeTE7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5jb2xvciA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjb2xvciA9IF8sIHRlbXBsYXRlKSA6IGNvbG9yO1xuXHR9O1xuXG5cdHRlbXBsYXRlLnRleHQgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodGV4dCA9IF8sIHRlbXBsYXRlKSA6IHRleHQ7XG5cdH07XG5cblx0dGVtcGxhdGUueTFTY2FsZSA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeTFTY2FsZSA9IF8sIHRlbXBsYXRlKSA6IHkxU2NhbGU7XG5cdH07XG5cdFx0XHRcdFx0XG5cdHRlbXBsYXRlLmNvbG9yU2NhbGUgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNvbG9yU2NhbGUgPSBfLCB0ZW1wbGF0ZSkgOiBjb2xvclNjYWxlO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUueUxhYmVsID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh5TGFiZWwgPSBfLCB0ZW1wbGF0ZSkgOiB5TGFiZWw7IFxuXHR9O1xuXG5cdHRlbXBsYXRlLnNvcnQgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHNvcnQgPSBfLCB0ZW1wbGF0ZSkgOiBzb3J0O1xuXHR9O1xuXHRcdFxuXHR0ZW1wbGF0ZS50cmFuc2l0aW9uID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0cmFuc2l0aW9uID0gXywgdGVtcGxhdGUpIDogdHJhbnNpdGlvbjtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmVudGVyVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZW50ZXJUcmFuc2l0aW9uID0gXywgdGVtcGxhdGUpIDogZW50ZXJUcmFuc2l0aW9uO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuZXhpdFRyYW5zaXRpb24gPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGV4aXRUcmFuc2l0aW9uID0gXywgdGVtcGxhdGUpIDogZXhpdFRyYW5zaXRpb247XG5cdH07XG5cdFx0XHRcblx0dGVtcGxhdGUuY2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY2FsbGJhY2sgPSBfLCB0ZW1wbGF0ZSkgOiBjYWxsYmFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLmVudGVyQ2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZW50ZXJDYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IGVudGVyQ2FsbGJhY2s7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5leGl0Q2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZXhpdENhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogZXhpdENhbGxiYWNrO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUubW91c2VPdmVyQ2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobW91c2VPdmVyQ2FsbGJhY2sgPSBfLCB0ZW1wbGF0ZSkgOiBtb3VzZU92ZXJDYWxsYmFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLm1vdXNlTGVhdmVDYWxsYmFjayA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChtb3VzZUxlYXZlQ2FsbGJhY2sgPSBfLCB0ZW1wbGF0ZSkgOiBtb3VzZUxlYXZlQ2FsbGJhY2s7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS50b3VjaFN0YXJ0Q2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodG91Y2hTdGFydENhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogdG91Y2hTdGFydENhbGxiYWNrO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUudG91Y2hFbmRDYWxsYmFjayA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0b3VjaEVuZENhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogdG91Y2hFbmRDYWxsYmFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLnBhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoX3BhY2sgPSBfLCB0ZW1wbGF0ZSkgOiBfcGFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLmJ1YmJsZSA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChfYnViYmxlID0gXywgdGVtcGxhdGUpIDogX2J1YmJsZTtcblx0fTtcblx0XG5cdHJldHVybiB0ZW1wbGF0ZTtcbn0iLCJpbXBvcnQgKiBhcyBkMyBmcm9tIFwiZDNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGllKCkge1xuXG5cdHZhclx0bGF5ZXIsXG5cdFx0Y2xhc3NlZCxcblx0XHRvcmllbnQsXG5cdFx0d2lkdGgsIGhlaWdodCxcblx0XHRtYXJnaW4sXG5cdFx0a2V5LCB4LCB5LCBjb2xvciwgdGV4dCxcblx0XHRjb2xvclNjYWxlLFxuXHRcdHlMYWJlbCxcblx0XHR0cmFuc2l0aW9uLCBlbnRlclRyYW5zaXRpb24sIGV4aXRUcmFuc2l0aW9uLFxuXHRcdGNhbGxiYWNrLCBlbnRlckNhbGxiYWNrLCBleGl0Q2FsbGJhY2ssXG5cdFx0bW91c2VPdmVyQ2FsbGJhY2ssIG1vdXNlTGVhdmVDYWxsYmFjayxcblx0XHR0b3VjaFN0YXJ0Q2FsbGJhY2ssIHRvdWNoRW5kQ2FsbGJhY2ssXG5cdFx0XG5cdFx0X3BpZSxcblx0XHRfYXJjO1xuXHRcdFxuXHRmdW5jdGlvbiB0ZW1wbGF0ZShzZWxlY3Rpb24pIHtcblx0XHRcblx0XHQvLyBERUZBVUxUU1x0XHRcblx0XHR0cmFuc2l0aW9uID0gdHJhbnNpdGlvbiB8fCBmdW5jdGlvbih0KSB7IHJldHVybiB0LmR1cmF0aW9uKDApOyB9O1xuXHRcdGVudGVyVHJhbnNpdGlvbiA9IGVudGVyVHJhbnNpdGlvbiB8fCBmdW5jdGlvbih0KSB7IHJldHVybiB0LmR1cmF0aW9uKDApOyB9O1xuXHRcdGV4aXRUcmFuc2l0aW9uID0gZXhpdFRyYW5zaXRpb24gfHwgZnVuY3Rpb24odCkgeyByZXR1cm4gdC5kdXJhdGlvbigwKTsgfTtcblx0XHRcblx0XHRjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdGVudGVyQ2FsbGJhY2sgPSBlbnRlckNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdGV4aXRDYWxsYmFjayA9IGV4aXRDYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHRcblx0XHRtb3VzZU92ZXJDYWxsYmFjayA9IG1vdXNlT3ZlckNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9O1xuXHRcdG1vdXNlTGVhdmVDYWxsYmFjayA9IG1vdXNlTGVhdmVDYWxsYmFjayB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfTtcblx0XHRcblx0XHR0b3VjaFN0YXJ0Q2FsbGJhY2sgPSB0b3VjaFN0YXJ0Q2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0dG91Y2hFbmRDYWxsYmFjayA9IHRvdWNoRW5kQ2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQ7IH07XG5cdFx0XG5cdFx0Y2xhc3NlZCA9IGNsYXNzZWQgfHwgXCJwaWVcIjtcblx0XHRcblx0XHRfcGllID0gX3BpZSB8fCB7fTtcblx0XHRfYXJjID0gX2FyYyB8fCB7fTtcblx0XHRcblx0XHR2YXIgdyA9IHRlbXBsYXRlLmNvbnRlbnRXaWR0aCgpLFxuXHRcdFx0aCA9IHRlbXBsYXRlLmNvbnRlbnRIZWlnaHQoKSxcblx0XHRcdHJhZGl1cyA9IE1hdGgubWluKHcsIGgpIC8gMjtcblx0XHRcdFx0XHRcdFx0XG5cdFx0dmFyIHBpZSA9IGQzLnBpZSgpXG5cdFx0XHQuc29ydChudWxsKVxuXHRcdFx0LnZhbHVlKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHkoZCk7IH0pXG5cdFx0XHQuc3RhcnRBbmdsZShfcGllLnN0YXJ0QW5nbGUgPyAgX3BpZS5zdGFydEFuZ2xlICogTWF0aC5QSS8xODAgOiAwKVxuXHRcdFx0LmVuZEFuZ2xlKF9waWUuZW5kQW5nbGUgPyBfcGllLmVuZEFuZ2xlICogTWF0aC5QSS8xODAgOiAyICogTWF0aC5QSSlcblx0XHRcdC5wYWRBbmdsZShfcGllLnBhZEFuZ2xlID8gX3BpZS5wYWRBbmdsZSAqIE1hdGguUEkvMTgwIDogMCk7XG5cdFx0XHRcblx0XHR2YXIgYXJjID0gZDMuYXJjKClcblx0XHRcdC5pbm5lclJhZGl1cyhfYXJjLmlubmVyUmFkaXVzID8gcmFkaXVzICogX2FyYy5pbm5lclJhZGl1cyA6IDApXG5cdFx0XHQub3V0ZXJSYWRpdXMocmFkaXVzKTtcdFx0XHRcblx0XHRcblx0XHRzZWxlY3Rpb24uZWFjaChmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcblx0XHRcdHZhciBub2RlID0gZDMuc2VsZWN0KHRoaXMpO1xuXHRcdFx0XHRcblx0XHRcdC8vIENlbnRlciBwaWVcblx0XHRcdHZhciBnID0gbm9kZS5zZWxlY3QoXCJnXCIpO1xuXHRcdFx0aWYoZy5lbXB0eSgpKSB7XG5cdFx0XHRcdGcgPSBub2RlLmFwcGVuZChcImdcIilcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIHcgLyAyICsgXCIsXCIgKyBoIC8gMiArIFwiKVwiKTtcblx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRpZihnLnNlbGVjdChcIi5sYWJlbFwiKS5lbXB0eSgpKSB7XG5cdFx0XHRcdGcuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJsYWJlbFwiKVx0XHRcdFx0XG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBcIi4zNWVtXCIpXG5cdFx0XHRcdFx0LnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcblx0XHRcdFx0XHQudGV4dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHJldHVybiB0eXBlb2YgeUxhYmVsID09PSBcImZ1bmN0aW9uXCIgPyB5TGFiZWwoZGF0YSkgOiB5TGFiZWw7IFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0XG5cdFx0XHQvLyBVUERBVEVcdFx0XG5cdFx0XHR2YXIgcGllcyA9IGcuc2VsZWN0QWxsKFwiLlwiICsgY2xhc3NlZC5yZXBsYWNlKFwiIFwiLCBcIi5cIikpXG5cdFx0XHRcdC5kYXRhKHBpZShkYXRhKSwgZnVuY3Rpb24oZCkgeyByZXR1cm4ga2V5KGQuZGF0YSk7IH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBjbGFzc2VkICsgXCIgdXBkYXRlXCIpO1xuXHRcdFx0XG5cdFx0XHQvLyBFTlRFUlx0XG5cdFx0XHRwaWVzLmVudGVyKClcblx0XHRcdFx0LmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGNsYXNzZWQgKyBcIiBlbnRlclwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmMpXG5cdFx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBjb2xvclNjYWxlKGNvbG9yKGQuZGF0YSkpOyB9KVxuXHRcdFx0XHRcdC5vbihcIm1vdXNlb3ZlclwiLCBtb3VzZU92ZXJDYWxsYmFjaylcblx0XHRcdFx0XHQub24oXCJtb3VzZWxlYXZlXCIsIG1vdXNlTGVhdmVDYWxsYmFjaylcblx0XHRcdFx0XHQub24oXCJ0b3VjaHN0YXJ0XCIsIHRvdWNoU3RhcnRDYWxsYmFjaylcblx0XHRcdFx0XHQub24oXCJ0b3VjaGVuZFwiLCB0b3VjaEVuZENhbGxiYWNrKVxuXHRcdFx0XHRcdC5jYWxsKGVudGVyQ2FsbGJhY2spXG5cdFx0XHRcdFx0Lm1lcmdlKHBpZXMpXHQvLyBFTlRFUiArIFVQREFURVxuXHRcdFx0XHRcdFx0LnRyYW5zaXRpb24oKS5jYWxsKHRyYW5zaXRpb24pXG5cdFx0XHRcdFx0XHRcdC5hdHRyVHdlZW4oXCJkXCIsIGFyY1R3ZWVuKVxuXHRcdFx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGNvbG9yU2NhbGUoY29sb3IoZC5kYXRhKSk7IH0pXG5cdFx0XHRcdFx0XHRcdC5vbihcImVuZFwiLCBmdW5jdGlvbigpIHsgZDMuc2VsZWN0KHRoaXMpLmNhbGwoY2FsbGJhY2spOyB9KTtcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHQvLyBFWElUXG5cdFx0XHRwaWVzLmV4aXQoKVxuXHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGNsYXNzZWQgKyBcIiBleGl0XCIpXG5cdFx0XHRcdC50cmFuc2l0aW9uKCkuY2FsbChleGl0VHJhbnNpdGlvbilcblx0XHRcdFx0XHQuYXR0clR3ZWVuKFwiZFwiLCBhcmNUd2VlbigwKSlcblx0XHRcdFx0XHQub24oXCJlbmRcIiwgZnVuY3Rpb24oKSB7IGQzLnNlbGVjdCh0aGlzKS5jYWxsKGV4aXRDYWxsYmFjayk7IH0pXG5cdFx0XHRcdFx0LnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRmdW5jdGlvbiBhcmNUd2VlbihhKSB7XG5cdFx0XHRcdGlmKCF0aGlzKSByZXR1cm4gZnVuY3Rpb24oKSB7IHJldHVybiBhcmMoMCk7IH07XG5cdFx0XHRcdFxuXHRcdFx0XHR2YXIgaSA9IGQzLmludGVycG9sYXRlKHRoaXMuX2N1cnJlbnQsIGEpO1xuXHRcdFx0XHR0aGlzLl9jdXJyZW50ID0gaSgwKTtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gYXJjKGkodCkpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0dGVtcGxhdGUubGF5ZXIgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGxheWVyID0gXywgdGVtcGxhdGUpIDogbGF5ZXIgfHwge307XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5jbGFzc2VkID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjbGFzc2VkID0gXywgdGVtcGxhdGUpIDogY2xhc3NlZDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLm9yaWVudCA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAob3JpZW50ID0gXywgdGVtcGxhdGUpIDogb3JpZW50O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUud2lkdGggPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHdpZHRoID0gXywgdGVtcGxhdGUpIDogd2lkdGg7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5oZWlnaHQgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGhlaWdodCA9IF8sIHRlbXBsYXRlKSA6IGhlaWdodDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLm1hcmdpbiA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobWFyZ2luID0gXywgdGVtcGxhdGUpIDogbWFyZ2luO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuY29udGVudFdpZHRoID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHdpZHRoIC0gbWFyZ2luLnJpZ2h0IC0gbWFyZ2luLmxlZnQ7XG5cdH07XG5cdFx0XG5cdHRlbXBsYXRlLmNvbnRlbnRIZWlnaHQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5rZXkgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoa2V5ID0gXywgdGVtcGxhdGUpIDoga2V5O1xuXHR9O1xuXHRcblx0dGVtcGxhdGUueCA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh4ID0gXywgdGVtcGxhdGUpIDogeDtcblx0fTtcblx0XG5cdHRlbXBsYXRlLnkgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeSA9IF8sIHRlbXBsYXRlKSA6IHk7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5jb2xvciA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjb2xvciA9IF8sIHRlbXBsYXRlKSA6IGNvbG9yO1xuXHR9O1xuXG5cdHRlbXBsYXRlLnRleHQgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodGV4dCA9IF8sIHRlbXBsYXRlKSA6IHRleHQ7XG5cdH07XG5cdFx0XG5cdHRlbXBsYXRlLmNvbG9yU2NhbGUgPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNvbG9yU2NhbGUgPSBfLCB0ZW1wbGF0ZSkgOiBjb2xvclNjYWxlO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUueUxhYmVsID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh5TGFiZWwgPSBfLCB0ZW1wbGF0ZSkgOiB5TGFiZWw7IFxuXHR9O1xuXHRcdFxuXHR0ZW1wbGF0ZS50cmFuc2l0aW9uID0gZnVuY3Rpb24oXykgeyBcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0cmFuc2l0aW9uID0gXywgdGVtcGxhdGUpIDogdHJhbnNpdGlvbjtcblx0fTtcblx0XG5cdHRlbXBsYXRlLmVudGVyVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKF8pIHsgXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZW50ZXJUcmFuc2l0aW9uID0gXywgdGVtcGxhdGUpIDogZW50ZXJUcmFuc2l0aW9uO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUuZXhpdFRyYW5zaXRpb24gPSBmdW5jdGlvbihfKSB7IFxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGV4aXRUcmFuc2l0aW9uID0gXywgdGVtcGxhdGUpIDogZXhpdFRyYW5zaXRpb247XG5cdH07XG5cdFx0XHRcblx0dGVtcGxhdGUuY2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY2FsbGJhY2sgPSBfLCB0ZW1wbGF0ZSkgOiBjYWxsYmFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLmVudGVyQ2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZW50ZXJDYWxsYmFjayA9IF8sIHRlbXBsYXRlKSA6IGVudGVyQ2FsbGJhY2s7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS5leGl0Q2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZXhpdENhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogZXhpdENhbGxiYWNrO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUubW91c2VPdmVyQ2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobW91c2VPdmVyQ2FsbGJhY2sgPSBfLCB0ZW1wbGF0ZSkgOiBtb3VzZU92ZXJDYWxsYmFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLm1vdXNlTGVhdmVDYWxsYmFjayA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChtb3VzZUxlYXZlQ2FsbGJhY2sgPSBfLCB0ZW1wbGF0ZSkgOiBtb3VzZUxlYXZlQ2FsbGJhY2s7XG5cdH07XG5cdFxuXHR0ZW1wbGF0ZS50b3VjaFN0YXJ0Q2FsbGJhY2sgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodG91Y2hTdGFydENhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogdG91Y2hTdGFydENhbGxiYWNrO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUudG91Y2hFbmRDYWxsYmFjayA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0b3VjaEVuZENhbGxiYWNrID0gXywgdGVtcGxhdGUpIDogdG91Y2hFbmRDYWxsYmFjaztcblx0fTtcblx0XG5cdHRlbXBsYXRlLmFyYyA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChfYXJjID0gXywgdGVtcGxhdGUpIDogX2FyYztcblx0fTtcblx0XG5cdHRlbXBsYXRlLnBpZSA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChfcGllID0gXywgdGVtcGxhdGUpIDogX3BpZTtcblx0fTtcblx0XG5cdHJldHVybiB0ZW1wbGF0ZTtcbn0iLCJpbXBvcnQgKiBhcyBkMyBmcm9tIFwiZDNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGxhaW5DU1MoKSB7XG5cblx0dmFyIGNsYXNzZWQsXG5cdFx0Y3NzO1xuXHRcdFxuXHRmdW5jdGlvbiB0ZW1wbGF0ZShzZWxlY3Rpb24pIHtcblx0XHRcdFx0XG5cdFx0c2VsZWN0aW9uLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcblx0XHRcdGlmKGNzcykge1xuXHRcdFx0XHR2YXIgbm9kZSA9IGQzLnNlbGVjdCh0aGlzKSxcblx0XHRcdFx0XHRzdHlsZU5vZGUgPSBub2RlLnNlbGVjdChcInN0eWxlXCIpO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRpZihzdHlsZU5vZGUuZW1wdHkoKSkge1xuXHRcdFx0XHRcdHN0eWxlTm9kZSA9IG5vZGUuYXBwZW5kKFwic3R5bGVcIikuYXR0cihcInR5cGVcIiwgXCJ0ZXh0L2Nzc1wiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRzdHlsZU5vZGUudGV4dChjc3MucmVwbGFjZSgvI2lkL2csIFwiI1wiICsgbm9kZS5hdHRyKFwiaWRcIikpKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHRlbXBsYXRlLmNsYXNzZWQgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY2xhc3NlZCA9IF8sIHRlbXBsYXRlKSA6IGNsYXNzZWQ7XG5cdH07XG5cblx0dGVtcGxhdGUuY3NzID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNzcyA9IF8sIHRlbXBsYXRlKSA6IGNzcztcblx0fTtcblx0XHRcdFx0XG5cdHJldHVybiB0ZW1wbGF0ZTtcbn1cbiIsImltcG9ydCAqIGFzIGQzIGZyb20gXCJkM1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZXNwb25zaXZlQ1NTKCkge1xuXHRcdFxuXHQvLyBEZWZhdWx0IGF0dHJpYnV0ZXNcblx0dmFyIGNsYXNzZWQsXG5cdFx0ZGVza3RvcCxcblx0XHR0YWJsZXQsXG5cdFx0c21hcnRwaG9uZSxcblx0XHRjc3M7XG5cdFx0XG5cdGZ1bmN0aW9uIHRlbXBsYXRlKHNlbGVjdGlvbikge1xuXHRcdFx0XHRcblx0XHRzZWxlY3Rpb24uZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcblx0XHRcdGlmKHNtYXJ0cGhvbmUgfHwgdGFibGV0IHx8IGRlc2t0b3AgfHwgY3NzKSB7XG5cdFx0XHRcblx0XHRcdFx0dmFyIG5vZGUgPSBkMy5zZWxlY3QodGhpcyksXG5cdFx0XHRcdFx0c3R5bGVOb2RlID0gbm9kZS5zZWxlY3QoXCJzdHlsZVwiKSxcblx0XHRcdFx0XHRyZXN1bHQgPSBcIlwiO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRpZihzdHlsZU5vZGUuZW1wdHkoKSkge1xuXHRcdFx0XHRcdHN0eWxlTm9kZSA9IG5vZGUuYXBwZW5kKFwic3R5bGVcIikuYXR0cihcInR5cGVcIiwgXCJ0ZXh0L2Nzc1wiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRpZihzbWFydHBob25lKSB7XHRcblx0XHRcdFx0XHRyZXN1bHQgKz0gXCJAbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtZGV2aWNlLXdpZHRoIDogNDUwcHgpIHtcIjtcdFxuXHRcdFx0XHRcdHJlc3VsdCArPSBydWxlc1RvU3RyaW5nKHNtYXJ0cGhvbmUpO1xuXHRcdFx0XHRcdHJlc3VsdCArPSBcIn1cXG5cIjtcblx0XHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRcdGlmKHRhYmxldCkge1x0XG5cdFx0XHRcdFx0cmVzdWx0ICs9IFwiQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWluLWRldmljZS13aWR0aCA6IDQ1MHB4KSBhbmQgKG1heC1kZXZpY2Utd2lkdGggOiAxMjAwcHgpIHtcIjtcdFxuXHRcdFx0XHRcdHJlc3VsdCArPSBydWxlc1RvU3RyaW5nKHRhYmxldCk7XG5cdFx0XHRcdFx0cmVzdWx0ICs9IFwifVxcblwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcblx0XHRcdFx0aWYoZGVza3RvcCkge1xuXHRcdFx0XHRcdHJlc3VsdCArPSBcIkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1pbi1kZXZpY2Utd2lkdGggOiAxMjAwcHgpIHtcIjtcdFx0XHRcblx0XHRcdFx0XHRyZXN1bHQgKz0gcnVsZXNUb1N0cmluZyhkZXNrdG9wKTtcblx0XHRcdFx0XHRyZXN1bHQgKz0gXCJ9XFxuXCI7XG5cdFx0XHRcdH1cblx0XG5cdFx0XHRcdGlmKGNzcykge1x0XHRcdFx0XG5cdFx0XHRcdFx0cmVzdWx0ICs9IGNzcy5yZXBsYWNlKC8jaWQvZywgXCIjXCIgKyBub2RlLmF0dHIoXCJpZFwiKSkgKyBcIlxcblwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRzdHlsZU5vZGUudGV4dChyZXN1bHQpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRmdW5jdGlvbiBydWxlc1RvU3RyaW5nKG8pIHtcblx0XHRcdFx0dmFyIHMgPSBcIlwiLFxuXHRcdFx0XHRcdGtleXMgPSBPYmplY3Qua2V5cyhvKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0Zm9yKHZhciBrIGluIGtleXMpIHsgIFxuXHRcdFx0XHRcdHMgKz0ga2V5c1trXSArIFwiI1wiICsgbm9kZS5hdHRyKFwiaWRcIikgKyBcIntcIjtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR2YXIgcnVsZXMgPSBPYmplY3Qua2V5cyhvW2tleXNba11dKTtcblx0XHRcdFx0XHRmb3IodmFyIHIgaW4gcnVsZXMpIHtcblx0XHRcdFx0XHRcdHMgKz0gIHJ1bGVzW3JdICsgXCI6XCIgKyBvW2tleXNba11dW3J1bGVzW3JdXSArIFwiO1wiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcyArIFwifVwiO1xuXHRcdFx0fVx0XHRcdFxuXHRcdH0pO1xuXHR9XG5cblx0dGVtcGxhdGUuY2xhc3NlZCA9IGZ1bmN0aW9uKF8pIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjbGFzc2VkID0gXywgdGVtcGxhdGUpIDogY2xhc3NlZDtcblx0fTtcblxuXHR0ZW1wbGF0ZS5kZXNrdG9wID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGRlc2t0b3AgPSBfLCB0ZW1wbGF0ZSkgOiBkZXNrdG9wO1xuXHR9O1xuXHRcblx0dGVtcGxhdGUudGFibGV0ID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRhYmxldCA9IF8sIHRlbXBsYXRlKSA6IHRhYmxldDtcblx0fTtcblxuXHR0ZW1wbGF0ZS5zbWFydHBob25lID0gZnVuY3Rpb24oXykge1xuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHNtYXJ0cGhvbmUgPSBfLCB0ZW1wbGF0ZSkgOiBzbWFydHBob25lO1xuXHR9O1xuXHRcdFxuXHR0ZW1wbGF0ZS5jc3MgPSBmdW5jdGlvbihfKSB7XG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY3NzID0gXywgdGVtcGxhdGUpIDogY3NzO1xuXHR9O1xuXHRcdFx0XHRcblx0cmV0dXJuIHRlbXBsYXRlO1xufVxuIiwidmFyIHZlcnNpb24gPSBcIlZFUlNJT05cIjtcbmV4cG9ydHMudmVyc2lvbiA9IHZlcnNpb247XG5cbmV4cG9ydCAqIGZyb20gXCIuLi9kZ2Ytc2NoZWR1bGVyXCI7XG5leHBvcnQgKiBmcm9tIFwiLi4vZGdmLXJlYWRlclwiO1xuZXhwb3J0ICogZnJvbSBcIi4uL2RnZi10ZW1wbGF0ZVwiO1xuZXhwb3J0ICogZnJvbSBcIi4uL2RnZi1zY2hlbWVcIjtcbmV4cG9ydCAqIGZyb20gXCIuLi9kZ2YtdGFnXCI7Il0sIm5hbWVzIjpbImludGVydmFsIiwicmVwZWF0IiwiX2ludGVydmFsIiwiX3JlcGVhdCIsInN0b3BwZWQiLCJjYWxsYmFjayIsInN0YXJ0Q2FsbGJhY2siLCJzdG9wQ2FsbGJhY2siLCJ0ZW1wbGF0ZSIsInNlbGVjdGlvbiIsInVuZGVmaW5lZCIsImVhY2giLCJjYWxsIiwidCIsImQzIiwiZWxhcHNlZCIsInN0b3AiLCJfIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiaXNTdG9wcGVkIiwiZHN2IiwiZCIsImRsbSIsIl9kYXRhIiwiZGVsaW1pdGVyIiwicGFyc2VyQ2FsbGJhY2siLCJlcnJvckNhbGxiYWNrIiwicmVhZGVyIiwiZGF0YSIsImluZGV4IiwicGFyc2UiLCJ0cmltIiwiZGF0dW0iLCJqc29uIiwidXJsIiwiX3VybCIsImNhY2hlRGF0YSIsIkpTT04iLCJlcnJvciIsInRlc3REYXRhIiwieFR5cGUiLCJ5TWluIiwieU1heCIsInJvd3MiLCJleGl0UHJvYmFiaWxpdHkiLCJzY2FsZSIsImRvbWFpbiIsInJhbmdlIiwiZm9ybWF0IiwicmFuZCIsIk1hdGgiLCJyYW5kb20iLCJpZE9mIiwiaSIsImtleXMiLCJwdXNoIiwiY29weU9mS2V5cyIsInNsaWNlIiwic3BsaWNlIiwiZGF0ZSIsIkRhdGUiLCJtYXAiLCJzZXREYXRlIiwiZ2V0RGF0ZSIsInRvSVNPU3RyaW5nIiwiYXJjTGFiZWwiLCJsYXllciIsImNsYXNzZWQiLCJvcmllbnQiLCJ3aWR0aCIsImhlaWdodCIsIm1hcmdpbiIsImtleSIsIngiLCJ5IiwieTEiLCJjb2xvciIsInRleHQiLCJ5MVNjYWxlIiwiY29sb3JTY2FsZSIsInlMYWJlbCIsInRyYW5zaXRpb24iLCJlbnRlclRyYW5zaXRpb24iLCJleGl0VHJhbnNpdGlvbiIsImVudGVyQ2FsbGJhY2siLCJleGl0Q2FsbGJhY2siLCJtb3VzZU92ZXJDYWxsYmFjayIsIm1vdXNlTGVhdmVDYWxsYmFjayIsInRvdWNoU3RhcnRDYWxsYmFjayIsInRvdWNoRW5kQ2FsbGJhY2siLCJ0ZXh0Rm9ybWF0IiwiX3BpZSIsIl9hcmMiLCJkdXJhdGlvbiIsInciLCJjb250ZW50V2lkdGgiLCJoIiwiY29udGVudEhlaWdodCIsInJhZGl1cyIsIm1pbiIsInBpZSIsInNvcnQiLCJ2YWx1ZSIsInN0YXJ0QW5nbGUiLCJQSSIsImVuZEFuZ2xlIiwicGFkQW5nbGUiLCJhcmMiLCJvdXRlclJhZGl1cyIsImlubmVyUmFkaXVzIiwib3V0ZXJBcmMiLCJtaWRBbmdsZSIsIm5vZGUiLCJnIiwic2VsZWN0IiwiZW1wdHkiLCJhcHBlbmQiLCJhdHRyIiwic3R5bGUiLCJsYWJlbHMiLCJsYWJlbCIsInNlbGVjdEFsbCIsImVudGVyIiwib24iLCJtZXJnZSIsImF0dHJUd2VlbiIsIl9jdXJyZW50IiwiaW50ZXJwb2xhdGUiLCJkMiIsInBvcyIsImNlbnRyb2lkIiwic3R5bGVUd2VlbiIsImV4aXQiLCJyZW1vdmUiLCJsaW5lcyIsInBvbHlsaW5lIiwicmlnaHQiLCJsZWZ0IiwidG9wIiwiYm90dG9tIiwiYXhpcyIsInpJbmRleCIsImhpZGUiLCJ4U2NhbGUiLCJ5U2NhbGUiLCJ4TGFiZWwiLCJ5MUxhYmVsIiwieEZvcm1hdCIsInlGb3JtYXQiLCJ5MUZvcm1hdCIsInhUaWNrcyIsInlUaWNrcyIsInkxVGlja3MiLCJ4VGlja1ZhbHVlcyIsInlUaWNrVmFsdWVzIiwieTFUaWNrVmFsdWVzIiwieFRpY2tSb3RhdGUiLCJ5VGlja1JvdGF0ZSIsInkxVGlja1JvdGF0ZSIsInhHcmlkIiwieUdyaWQiLCJ5MUdyaWQiLCJ4SGlkZSIsInlIaWRlIiwieTFIaWRlIiwieEF4aXMiLCJ0aWNrcyIsInRpY2tWYWx1ZXMiLCJ0aWNrRm9ybWF0IiwieUF4aXMiLCJ5MUF4aXMiLCJ0aWNrUGFkZGluZyIsInRpY2tTaXplSW5uZXIiLCJ4YXhpcyIsInlheGlzIiwieTFheGlzIiwieEF4aXNFbnRlciIsIm9wYWNpdHkiLCJzdHJva2UiLCJzdHJva2VEYXNoQXJyYXkiLCJ5QXhpc0VudGVyIiwieTFBeGlzRW50ZXIiLCJiYWNrZ3JvdW5kIiwiZmlsbCIsImJhY2tncm91bmRFbnRlciIsInJlcGxhY2UiLCJiYXIiLCJiYW5kd2lkdGgiLCJhYnMiLCJidWJibGUiLCJfcGFjayIsIl9idWJibGUiLCJwYWRkaW5nIiwiZGlhbWV0ZXIiLCJzaXplIiwibmFtZSIsImNoaWxkcmVuIiwicm9vdCIsImNsYXNzZXMiLCJzdW0iLCJhIiwiYiIsImJ1YmJsZXMiLCJwYWNrYWdlTmFtZSIsImNsYXNzTmFtZSIsIm5vRmlsbCIsImRhc2hBcnJheSIsInIiLCJyZWN1cnNlIiwiZm9yRWFjaCIsImNoaWxkIiwicGFjayIsImRvdCIsInhTY2FsZUFkanVzdGVkIiwieVNjYWxlQWRqdXN0ZWQiLCJkb3RzIiwiZG90c0VudGVyIiwiaW1hZ2UiLCJwcmVzZXJ2ZUFzcGVjdFJhdGlvIiwiaW1hZ2VFbnRlciIsImFsaWduIiwibWVldE9yU2xpY2UiLCJhbmNob3IiLCJyb3RhdGUiLCJkeCIsImR5IiwieFNjYWxlQmFuZHdpZHRoIiwibGFiZWxzRW50ZXIiLCJpc0lFIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwiaW5kZXhPZiIsInN2ZyIsInZpZXdib3giLCJkb2N1bWVudCIsImlkIiwibGF5ZXJzIiwiaW5oZXJpdFNpemUiLCJsYXllcjAiLCJsYXllcjEiLCJsYXllcjIiLCJsYXllcjMiLCJsYXllcjQiLCJsYXllcjUiLCJsYXllcjYiLCJsYXllcjciLCJyYXRpbyIsImNsaWVudFdpZHRoIiwiYyIsImZpbHRlciIsImNyZWF0ZUxheWVyIiwidGVtcGxhdGVzIiwidHJhbnNmb3JtIiwidHJhbnNsYXRlIiwiaHRtbCIsInRTVkciLCJ0ZW1wbGF0ZVNWRyIsIm1haW4iLCJtYXJnaW5Ub3AiLCJtYXJnaW5SaWdodCIsIm1hcmdpbkJvdHRvbSIsIm1hcmdpbkxlZnQiLCJMZWZ0IiwiZXh0ZW5kIiwidGFyZ2V0Iiwic291cmNlIiwicCIsImhhc093blByb3BlcnR5IiwiYmFiZWxIZWxwZXJzLnR5cGVvZiIsImRpZmYiLCJwcmV2Iiwibm93IiwiY2hhbmdlcyIsImlzRW1wdHkiLCJmbGF0dGVuIiwib2JqZWN0Iiwic2VwYXJhdG9yIiwicmVzdWx0IiwiY3VycmVudCIsInByb3BlcnR5IiwiT2JqZWN0IiwiQXJyYXkiLCJpc0FycmF5IiwibCIsInVuZmxhdHRlbiIsInJlZ2V4IiwiUmVnRXhwIiwibSIsImV4ZWMiLCJvIiwiZGVlcFZhbHVlIiwicGF0aCIsInBhdGhzIiwic3BsaXQiLCJmaW5kUGFyZW50QnlTZWxlY3RvciIsImVsZW1lbnQiLCJzZWxlY3RvciIsImNvbGxlY3Rpb25IYXMiLCJsZW4iLCJkb2NFbGVtIiwibm9kZVR5cGUiLCJwYXJlbnROb2RlIiwiYWxsIiwicXVlcnlTZWxlY3RvckFsbCIsImluc3RhbmNlIiwiX3JlYWR5IiwiX3JlZ2lzdHJ5IiwidGFnRmFjdG9yeSIsInNlbGYiLCJzZXR1cHMiLCJzZXR1cCIsImFkZEFsbCIsIkZ1bmN0aW9uIiwic2V0dXBfdXJscyIsInF1ZXVlIiwiaiIsImRlZmVyIiwiYXdhaXRBbGwiLCJrIiwic2V0dXBfanNvbiIsImRvbmUiLCJ0ZXN0IiwicmVhZHlTdGF0ZSIsInJlYWR5IiwicHJvY2VzcyIsImFkZEV2ZW50TGlzdGVuZXIiLCJjcmVhdGUiLCJzdHJpbmdpZnkiLCJhZGQiLCJjYWxsZWVzIiwidHlwZSIsImxvb2t1cCIsImF0dHJpYnV0ZSIsImNyZWF0ZUV4cHJlc3Npb24iLCJ2IiwiaXNOYU4iLCJjcmVhdGVUcmFuc2l0aW9uIiwiZWFzZSIsImRlbGF5IiwiX25hbWUiLCJzIiwibWF0Y2giLCJrZXlPbmx5IiwiYWNjZXNzb3IiLCJjb25jYXQiLCJwYXJzZUZsb2F0IiwiZ2FtbWEiLCJlIiwiZGVjb21wcmVzcyIsImNvbXByZXNzIiwibm9kZUlkIiwiZmlnY2FwdGlvbiIsInF1ZXJ5U2VsZWN0b3IiLCJpbm5lckhUTUwiLCJnZXRBdHRyaWJ1dGUiLCJzY2hlZHVsZXIiLCJub2RlcyIsImNhdGVnb3J5IiwicmVnIiwiaW5pdCIsInNldHVwRDMiLCJjcmVhdGVTY2FsZSIsImNyZWF0ZVRlbXBsYXRlIiwiYmV0YSIsInRlbnNpb24iLCJhbHBoYSIsInNwZWNpZmllciIsIm4iLCJjb2xvcnMiLCJjb25zdHJ1Y3RvciIsImZhY3RvcnkiLCJwcm90b3R5cGUiLCJwYXJlbnQiLCJkZWZpbml0aW9uIiwiQ29sb3IiLCJkYXJrZXIiLCJicmlnaHRlciIsInJlSSIsInJlTiIsInJlUCIsInJlSGV4MyIsInJlSGV4NiIsInJlUmdiSW50ZWdlciIsInJlUmdiUGVyY2VudCIsInJlUmdiYUludGVnZXIiLCJyZVJnYmFQZXJjZW50IiwicmVIc2xQZXJjZW50IiwicmVIc2xhUGVyY2VudCIsIm5hbWVkIiwiZGVmaW5lIiwicmdiIiwiZGlzcGxheWFibGUiLCJ0b0xvd2VyQ2FzZSIsInBhcnNlSW50IiwiUmdiIiwicmdibiIsInJnYmEiLCJoc2xhIiwiTmFOIiwicmdiQ29udmVydCIsInBvdyIsIm1heCIsInJvdW5kIiwiSHNsIiwiaHNsQ29udmVydCIsImhzbCIsIm0yIiwibTEiLCJoc2wycmdiIiwiZGVnMnJhZCIsInJhZDJkZWciLCJLbiIsIlhuIiwiWW4iLCJabiIsInQwIiwidDEiLCJ0MiIsInQzIiwibGFiQ29udmVydCIsIkxhYiIsIkhjbCIsImNvcyIsInNpbiIsInJnYjJ4eXoiLCJ4eXoybGFiIiwieiIsImxhYiIsImxhYjJ4eXoiLCJ4eXoycmdiIiwiaGNsQ29udmVydCIsImF0YW4yIiwic3FydCIsImhjbCIsIkEiLCJCIiwiQyIsIkQiLCJFIiwiRUQiLCJFQiIsIkJDX0RBIiwiY3ViZWhlbGl4Q29udmVydCIsIkN1YmVoZWxpeCIsImJsIiwiY3ViZWhlbGl4IiwiY29zaCIsInNpbmgiLCJiYXNpcyIsInYwIiwidjEiLCJ2MiIsInYzIiwidmFsdWVzIiwiZmxvb3IiLCJsaW5lYXIiLCJleHBvbmVudGlhbCIsImh1ZSIsImNvbnN0YW50Iiwibm9nYW1tYSIsInJnYkdhbW1hIiwic3RhcnQiLCJlbmQiLCJjb2xvclJnYiIsInJnYlNwbGluZSIsInNwbGluZSIsInJnYkJhc2lzIiwicmVBIiwicmVCIiwiemVybyIsIm9uZSIsImN1YmVoZWxpeEdhbW1hIiwiY29sb3JDdWJlaGVsaXgiLCJjdWJlaGVsaXhMb25nIiwic2NoZW1lIiwiaW50ZXJwb2xhdGVSZ2JCYXNpcyIsInJhbXAiLCJzZXR1cEQzU2NhbGVDaHJvbWF0aWMiLCJncmV5cyIsImJsdWVzIiwiZmV3czkiLCJ5bE9yRHIiLCJkZ09yRHIiLCJibFJkIiwic2V0dXBER0YiLCJzY2hlZHVsZXJJbnRlcnZhbCIsInBhcnNlciIsInJlYWRlckRTViIsInJlYWRlckpTT04iLCJzdHlsZVBsYWluQ1NTIiwic3R5bGVSZXNwb25zaXZlQ1NTIiwidGVtcGxhdGVMYXllcnMiLCJ0ZW1wbGF0ZUxlZ2VuZCIsInRlbXBsYXRlQmFja2dyb3VuZCIsImZpbmRGaXJzdENvbG9yIiwidGVtcGxhdGVJbWFnZSIsInRlbXBsYXRlQXhpcyIsInRlbXBsYXRlQmFyIiwiZmlndXJlIiwibWVzc2FnZSIsInRlbXBsYXRlUGllIiwidGVtcGxhdGVCdWJibGUiLCJ0ZW1wbGF0ZUxpbmUiLCJ0ZW1wbGF0ZURvdCIsInRlbXBsYXRlTGFiZWwiLCJ0ZW1wbGF0ZUFyY0xhYmVsIiwidGVtcGxhdGVQYWNrTGFiZWwiLCJzY2hlbWVGZXdzOSIsInNjaGVtZUdyZXlzIiwic2NoZW1lQmx1ZXMiLCJzY2hlbWVEZWZhdWx0Iiwic2NoZW1lWWxPckRyIiwic2NoZW1lRGdPckRyIiwiaW50ZXJwb2xhdGVHcmV5cyIsImludGVycG9sYXRlQmx1ZXMiLCJpbnRlcnBvbGF0ZUJsUmQiLCJzZXR1cEJhc2ljIiwic2V0dXBIaWVyYXJjaGljIiwic2V0dXBUaW1lIiwic2V0dXBNdWx0aVNlcmllcyIsInNldHVwR2FsbGVyeSIsImxlZ2VuZCIsInBvc2l0aW9uIiwiaW50ZXJwb2xhdGVTdGVwcyIsImhhbmRsZSIsInRvU3RyaW5nIiwic3RlcCIsImRyYXciLCJpdGVtIiwiaXRlbUVudGVyIiwibGluZSIsInN0cm9rZVdpZHRoIiwibGFzdFBvaW50IiwicGFja0xhYmVsIiwicGllcyIsImFyY1R3ZWVuIiwicGxhaW5DU1MiLCJjc3MiLCJzdHlsZU5vZGUiLCJyZXNwb25zaXZlQ1NTIiwiZGVza3RvcCIsInRhYmxldCIsInNtYXJ0cGhvbmUiLCJydWxlc1RvU3RyaW5nIiwicnVsZXMiLCJ2ZXJzaW9uIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVlLFNBQVNBLFVBQVQsQ0FBa0JBLFdBQWxCLEVBQTRCQyxNQUE1QixFQUFvQzs7S0FFOUNDLFlBQVlGLFdBQWhCO0tBQ0NHLFVBQVVGLE1BRFg7S0FFQ0csT0FGRDtLQUdDQyxRQUhEO0tBR1dDLGFBSFg7S0FHMEJDLFlBSDFCOztVQUtTQyxRQUFULENBQWtCQyxTQUFsQixFQUE2Qjs7YUFFakJKLFlBQVksWUFBVztVQUFTSyxTQUFQO0dBQXBDO2tCQUNnQkosaUJBQWlCRCxRQUFqQztpQkFDZUUsZ0JBQWdCRixRQUEvQjs7WUFFVU0sSUFBVixDQUFlLFlBQVc7O2FBRWYsS0FBVjthQUNVQyxJQUFWLENBQWVOLGFBQWY7O09BRUlPLElBQUlDLFdBQUEsQ0FBWSxVQUFTQyxPQUFULEVBQWtCO1FBQ2xDQSxVQUFVWixVQUFVRCxTQUFwQixJQUFpQ0MsV0FBVyxDQUFDLENBQWhELEVBQW1EO09BQ2hEYSxJQUFGO2VBQ1UsSUFBVjtlQUNVSixJQUFWLENBQWVMLFlBQWY7O2NBRVNLLElBQVYsQ0FBZVAsUUFBZjtJQU5PLEVBT0xILFNBUEssQ0FBUjtHQUxEOzs7VUFnQlFGLFFBQVQsR0FBb0IsVUFBU2lCLENBQVQsRUFBWTtTQUN4QkMsVUFBVUMsTUFBVixJQUFvQmpCLFlBQVksQ0FBQ2UsQ0FBYixFQUFnQlQsUUFBcEMsSUFBZ0ROLFNBQXZEO0VBREQ7O1VBSVNELE1BQVQsR0FBa0IsVUFBU2dCLENBQVQsRUFBWTtTQUN0QkMsVUFBVUMsTUFBVixJQUFvQmhCLFVBQVUsQ0FBQ2MsQ0FBWCxFQUFjVCxRQUFsQyxJQUE4Q0wsT0FBckQ7RUFERDs7VUFJU2lCLFNBQVQsR0FBcUIsWUFBVztTQUN4QmhCLE9BQVA7RUFERDs7VUFJU0MsUUFBVCxHQUFvQixVQUFTWSxDQUFULEVBQVk7U0FDeEJDLFVBQVVDLE1BQVYsSUFBb0JkLFdBQVdZLENBQVgsRUFBY1QsUUFBbEMsSUFBOENILFFBQXJEO0VBREQ7O1VBSVNDLGFBQVQsR0FBeUIsVUFBU1csQ0FBVCxFQUFZO1NBQzdCQyxVQUFVQyxNQUFWLElBQW9CYixnQkFBZ0JXLENBQWhCLEVBQW1CVCxRQUF2QyxJQUFtREYsYUFBMUQ7RUFERDs7VUFJU0MsWUFBVCxHQUF3QixVQUFTVSxDQUFULEVBQVk7U0FDNUJDLFVBQVVDLE1BQVYsSUFBb0JaLGVBQWVVLENBQWYsRUFBa0JULFFBQXRDLElBQWtERCxZQUF6RDtFQUREOztRQUlPQyxRQUFQOzs7QUNyRGMsU0FBU2EsR0FBVCxDQUFhQyxDQUFiLEVBQWdCQyxHQUFoQixFQUFxQjs7S0FFL0JDLFFBQVFGLENBQVo7S0FDQ0csWUFBWUYsR0FEYjtLQUVDRyxjQUZEO0tBR0NyQixRQUhEO0tBSUNzQixhQUpEOztVQU1TQyxNQUFULENBQWdCbkIsU0FBaEIsRUFBMkI7O1lBRWhCRSxJQUFWLENBQWUsVUFBU2tCLElBQVQsRUFBZUMsS0FBZixFQUFzQjs7O29CQUduQkosa0JBQWtCLFVBQVNHLElBQVQsRUFBZTtXQUFTQSxJQUFQO0lBQXBEO2NBQ1d4QixZQUFZLFlBQVc7V0FBU0ssU0FBUDtJQUFwQzttQkFDZ0JpQixpQkFBaUIsWUFBVztXQUFTakIsU0FBUDtJQUE5Qzs7V0FFT2UsU0FBUDtTQUNLLE9BQUw7aUJBQ2EsR0FBWjs7O1NBR0ksS0FBTDtpQkFDYSxJQUFaOzs7U0FHSSxXQUFMO2lCQUNhLEdBQVo7Ozs7VUFJTUQsUUFBUVYsWUFBQSxDQUFhVyxTQUFiLEVBQXdCTSxLQUF4QixDQUE4QlAsTUFBTVEsSUFBTixFQUE5QixDQUFSLEdBQXNEdEIsU0FBN0Q7O09BRUdtQixJQUFILEVBQVM7bUJBQ09qQixJQUFmLENBQW9CLElBQXBCLEVBQTBCaUIsSUFBMUIsRUFBZ0NDLEtBQWhDOztjQUdFRyxLQURGLENBQ1FKLElBRFIsRUFFRWpCLElBRkYsQ0FFT1AsUUFGUCxFQUVpQkksU0FGakI7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTFCRjs7O1FBaURNb0IsSUFBUCxHQUFjLFVBQVNaLENBQVQsRUFBWTtTQUNsQkMsVUFBVUMsTUFBVixJQUFvQkssUUFBUVAsQ0FBUixFQUFXVyxNQUEvQixJQUF5Q0osS0FBaEQ7RUFERDs7UUFJT0MsU0FBUCxHQUFtQixVQUFTUixDQUFULEVBQVk7U0FDdkJDLFVBQVVDLE1BQVYsSUFBb0JNLFlBQVlSLENBQVosRUFBZVcsTUFBbkMsSUFBNkNILFNBQXBEO0VBREQ7O1FBSU9DLGNBQVAsR0FBd0IsVUFBU1QsQ0FBVCxFQUFZO1NBQzVCQyxVQUFVQyxNQUFWLElBQW9CTyxpQkFBaUJULENBQWpCLEVBQW9CVyxNQUF4QyxJQUFrREYsY0FBekQ7RUFERDs7UUFJT3JCLFFBQVAsR0FBa0IsVUFBU1ksQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9CZCxXQUFXWSxDQUFYLEVBQWNXLE1BQWxDLElBQTRDdkIsUUFBbkQ7RUFERDs7UUFJT3NCLGFBQVAsR0FBdUIsVUFBU1YsQ0FBVCxFQUFZO1NBQzNCQyxVQUFVQyxNQUFWLElBQW9CUSxnQkFBZ0JWLENBQWhCLEVBQW1CVyxNQUF2QyxJQUFpREQsYUFBeEQ7RUFERDs7UUFJT0MsTUFBUDs7O0FDL0VjLFNBQVNNLE1BQVQsQ0FBY0MsR0FBZCxFQUFtQjs7S0FFN0JDLE9BQU9ELEdBQVg7S0FDQ1gsS0FERDtLQUVDYSxTQUZEO0tBR0NYLGNBSEQ7S0FJQ3JCLFFBSkQ7S0FLQ3NCLGFBTEQ7O1VBT1NDLE1BQVQsQ0FBZ0JuQixTQUFoQixFQUEyQjtZQUNoQkUsSUFBVixDQUFlLFVBQVNrQixJQUFULEVBQWVDLEtBQWYsRUFBc0I7OztvQkFHbkJKLGtCQUFrQixVQUFTRyxJQUFULEVBQWU7V0FBU0EsSUFBUDtJQUFwRDtjQUNXeEIsWUFBWSxZQUFXO1dBQVNLLFNBQVA7SUFBcEM7bUJBQ2dCaUIsaUJBQWlCLFlBQVc7V0FBU2pCLFNBQVA7SUFBOUM7O09BRUdjLFNBQVNhLFNBQVosRUFBdUI7UUFDbEI7WUFDSUMsS0FBS1AsS0FBTCxDQUFXUCxLQUFYLENBQVA7b0JBQ2VaLElBQWYsQ0FBb0IsSUFBcEIsRUFBMEJpQixJQUExQixFQUFnQ0MsS0FBaEM7O2VBR0VHLEtBREYsQ0FDUUosSUFEUixFQUVFakIsSUFGRixDQUVPUCxRQUZQO0tBSkQsQ0FPRSxPQUFNa0MsS0FBTixFQUFhO2VBQ0ozQixJQUFWLENBQWVlLGFBQWYsRUFBOEJZLFFBQVEsSUFBUixHQUFlQSxLQUFmLEdBQXVCLEdBQXJEOztJQVRGLE1BV087UUFDSEgsSUFBSCxFQUFTO1lBQ1IsQ0FBUUEsSUFBUixFQUFjLFVBQVNHLEtBQVQsRUFBZ0JWLElBQWhCLEVBQXNCO1VBQ2hDVSxLQUFILEVBQVU7cUJBQ0szQixJQUFkLENBQW1CLElBQW5CLEVBQXlCMkIsS0FBekI7T0FERCxNQUVPO3NCQUNTM0IsSUFBZixDQUFvQixJQUFwQixFQUEwQmlCLElBQTFCLEVBQWdDQyxLQUFoQztpQkFFRUcsS0FERixDQUNRSixJQURSLEVBRUVqQixJQUZGLENBRU9QLFFBRlA7O01BTEY7OztHQXBCSDs7O1FBbUNNOEIsR0FBUCxHQUFhLFVBQVNsQixDQUFULEVBQVk7U0FDakJDLFVBQVVDLE1BQVYsSUFBb0JpQixPQUFPbkIsQ0FBUCxFQUFVVyxNQUE5QixJQUF3Q1EsSUFBL0M7RUFERDs7UUFJT1AsSUFBUCxHQUFjLFVBQVNaLENBQVQsRUFBWTtTQUNsQkMsVUFBVUMsTUFBVixJQUFvQkssUUFBUVAsQ0FBUixFQUFXVyxNQUEvQixJQUF5Q0osS0FBaEQ7RUFERDs7UUFJT2EsU0FBUCxHQUFtQixVQUFTcEIsQ0FBVCxFQUFZO1NBQ3ZCQyxVQUFVQyxNQUFWLElBQW9Ca0IsWUFBWXBCLENBQVosRUFBZVcsTUFBbkMsSUFBNkNTLFNBQXBEO0VBREQ7O1FBSU9YLGNBQVAsR0FBd0IsVUFBU1QsQ0FBVCxFQUFZO1NBQzVCQyxVQUFVQyxNQUFWLElBQW9CTyxpQkFBaUJULENBQWpCLEVBQW9CVyxNQUF4QyxJQUFrREYsY0FBekQ7RUFERDs7UUFJT3JCLFFBQVAsR0FBa0IsVUFBU1ksQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9CZCxXQUFXWSxDQUFYLEVBQWNXLE1BQWxDLElBQTRDdkIsUUFBbkQ7RUFERDs7UUFJT3NCLGFBQVAsR0FBdUIsVUFBU1YsQ0FBVCxFQUFZO1NBQzNCQyxVQUFVQyxNQUFWLElBQW9CUSxnQkFBZ0JWLENBQWhCLEVBQW1CVyxNQUF2QyxJQUFpREQsYUFBeEQ7RUFERDs7UUFJT0MsTUFBUDs7O0FDckVjLFNBQVNZLFFBQVQsR0FBb0I7O0tBRTlCQyxLQUFKLEVBQ0NDLElBREQsRUFDT0MsSUFEUCxFQUNhQyxJQURiLEVBRUNDLGVBRkQsRUFHQ25CLGNBSEQsRUFJQ3JCLFFBSkQsRUFLQ3NCLGFBTEQ7O1VBT1NDLE1BQVQsQ0FBZ0JuQixTQUFoQixFQUEyQjs7TUFFdEJxQyxRQUFRaEMsY0FBQSxHQUFpQmlDLE1BQWpCLENBQXdCLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBeEIsRUFBK0JDLEtBQS9CLENBQXFDLENBQUNOLElBQUQsRUFBT0MsSUFBUCxDQUFyQyxDQUFaO01BQ0NNLFlBQVNuQyxTQUFBLENBQVUsS0FBVixDQURWOztXQUdTb0MsSUFBVCxHQUFnQjtVQUNSLENBQUNELFVBQU9ILE1BQU1LLEtBQUtDLE1BQUwsRUFBTixDQUFQLENBQVI7OztXQUdRQyxJQUFULENBQWNDLENBQWQsRUFBaUI7VUFDVCxDQUFDQSxLQUFLLEVBQUwsR0FBVUQsS0FBSyxDQUFDQyxJQUFJLEVBQUosSUFBVSxDQUFYLElBQWdCLENBQXJCLENBQVYsR0FBb0MsRUFBckMsSUFDTiw2QkFBNkJBLElBQUksRUFBSixJQUFVLENBQXZDLENBREQ7OztZQUlTM0MsSUFBVixDQUFlLFlBQVc7OztXQUdqQjhCLFNBQVMsU0FBakI7O29CQUVpQmYsa0JBQWtCLFVBQVNHLElBQVQsRUFBZTtXQUFTQSxJQUFQO0lBQXBEO2NBQ1d4QixZQUFZLFlBQVc7V0FBU0ssU0FBUDtJQUFwQzttQkFDZ0JpQixpQkFBaUIsWUFBVztXQUFTakIsU0FBUDtJQUE5Qzs7T0FFSTRDLENBQUo7T0FDQ0MsVUFBTyxFQURSO1FBRUlELElBQUksQ0FBUixFQUFXQSxJQUFJVixJQUFmLEVBQXFCVSxHQUFyQixFQUEwQjtZQUNwQkUsSUFBTCxDQUFVSCxLQUFLQyxDQUFMLENBQVY7OztPQUdHRyxhQUFhRixRQUFLRyxLQUFMLEVBQWpCOztRQUVJSixJQUFJLENBQVIsRUFBV0EsSUFBSUcsV0FBV3RDLE1BQTFCLEVBQWtDbUMsR0FBbEMsRUFBdUM7UUFDbkNILEtBQUtDLE1BQUwsS0FBZ0JQLGVBQW5CLEVBQW9DWSxXQUFXRSxNQUFYLENBQWtCTCxDQUFsQixFQUFxQixDQUFyQjs7O09BR2pDTSxPQUFPLElBQUlDLElBQUosRUFBWDs7T0FFSWhDLE9BQU80QixXQUFXSyxHQUFYLENBQWUsVUFBU3hDLENBQVQsRUFBWWdDLENBQVosRUFBZTtXQUNqQztVQUNELFVBQVNoQyxDQUFULEVBQVlnQyxDQUFaLEVBQWU7Y0FDWmIsS0FBUDtZQUNLLFNBQUw7ZUFBdUJuQixDQUFQO1lBQ1gsV0FBTDtlQUF5QmdDLENBQVA7WUFDYixNQUFMO2FBQ01TLE9BQUwsQ0FBYUgsS0FBS0ksT0FBTCxLQUFpQixDQUE5QjtlQUNPSixLQUFLSyxXQUFMLEdBQW1CUCxLQUFuQixDQUF5QixDQUF6QixFQUE0QixFQUE1QixDQUFQOztlQUNlcEMsQ0FBUDs7TUFQTCxDQVNIQSxDQVRHLEVBU0FnQyxDQVRBLENBREM7VUFXREosTUFYQztXQVlBQSxTQUFPLENBWlA7WUFhQzVCO0tBYlI7SUFEVSxDQUFYOztrQkFrQmVWLElBQWYsQ0FBb0IsSUFBcEIsRUFBMEJpQixJQUExQjs7YUFHRUksS0FERixDQUNRSixJQURSLEVBRUVqQixJQUZGLENBRU9QLFFBRlAsRUFFaUJJLFNBRmpCO0dBM0NEOzs7UUFpRE1nQyxLQUFQLEdBQWUsVUFBU3hCLENBQVQsRUFBWTtTQUNuQkMsVUFBVUMsTUFBVixJQUFvQnNCLFFBQVF4QixDQUFSLEVBQVdXLE1BQS9CLElBQXlDYSxLQUFoRDtFQUREOztRQUlPQyxJQUFQLEdBQWMsVUFBU3pCLENBQVQsRUFBWTtTQUNsQkMsVUFBVUMsTUFBVixJQUFvQnVCLE9BQU96QixDQUFQLEVBQVVXLE1BQTlCLElBQXdDYyxJQUEvQztFQUREOztRQUlPQyxJQUFQLEdBQWMsVUFBUzFCLENBQVQsRUFBWTtTQUNsQkMsVUFBVUMsTUFBVixJQUFvQndCLE9BQU8xQixDQUFQLEVBQVVXLE1BQTlCLElBQXdDZSxJQUEvQztFQUREOztRQUlPQyxJQUFQLEdBQWMsVUFBUzNCLENBQVQsRUFBWTtTQUNsQkMsVUFBVUMsTUFBVixJQUFvQnlCLE9BQU8zQixDQUFQLEVBQVVXLE1BQTlCLElBQXdDZ0IsSUFBL0M7RUFERDs7UUFJT0MsZUFBUCxHQUF5QixVQUFTNUIsQ0FBVCxFQUFZO1NBQzdCQyxVQUFVQyxNQUFWLElBQW9CMEIsa0JBQWtCNUIsQ0FBbEIsRUFBcUJXLE1BQXpDLElBQW1EaUIsZUFBMUQ7RUFERDs7UUFJT25CLGNBQVAsR0FBd0IsVUFBU1QsQ0FBVCxFQUFZO1NBQzVCQyxVQUFVQyxNQUFWLElBQW9CTyxpQkFBaUJULENBQWpCLEVBQW9CVyxNQUF4QyxJQUFrREYsY0FBekQ7RUFERDs7UUFJT3JCLFFBQVAsR0FBa0IsVUFBU1ksQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9CZCxXQUFXWSxDQUFYLEVBQWNXLE1BQWxDLElBQTRDdkIsUUFBbkQ7RUFERDs7UUFJT3NCLGFBQVAsR0FBdUIsVUFBU1YsQ0FBVCxFQUFZO1NBQzNCQyxVQUFVQyxNQUFWLElBQW9CUSxnQkFBZ0JWLENBQWhCLEVBQW1CVyxNQUF2QyxJQUFpREQsYUFBeEQ7RUFERDs7UUFJT0MsTUFBUDs7O0FDeEdjLFNBQVNzQyxRQUFULEdBQW9COztLQUU5QkMsS0FBSixFQUNDQyxPQURELEVBRUNDLE1BRkQsRUFHQ0MsS0FIRCxFQUdRQyxNQUhSLEVBSUNDLE1BSkQsRUFLQ0MsR0FMRCxFQUtNQyxDQUxOLEVBS1NDLENBTFQsRUFLWUMsRUFMWixFQUtnQkMsS0FMaEIsRUFLdUJDLElBTHZCLEVBTUNDLE9BTkQsRUFNVUMsVUFOVixFQU9DQyxNQVBELEVBUUNDLGFBUkQsRUFRYUMsZUFSYixFQVE4QkMsY0FSOUIsRUFTQy9FLFFBVEQsRUFTV2dGLGFBVFgsRUFTMEJDLFlBVDFCLEVBVUNDLGlCQVZELEVBVW9CQyxrQkFWcEIsRUFXQ0Msa0JBWEQsRUFXcUJDLGdCQVhyQixFQWFDQyxVQWJELEVBY0NDLElBZEQsRUFlQ0MsSUFmRDs7VUFpQlNyRixRQUFULENBQWtCQyxTQUFsQixFQUE2Qjs7O2tCQUdmeUUsaUJBQWMsVUFBU3JFLENBQVQsRUFBWTtVQUFTQSxFQUFFaUYsUUFBRixDQUFXLENBQVgsQ0FBUDtHQUF6QztvQkFDa0JYLG1CQUFtQixVQUFTdEUsQ0FBVCxFQUFZO1VBQVNBLEVBQUVpRixRQUFGLENBQVcsQ0FBWCxDQUFQO0dBQW5EO21CQUNpQlYsa0JBQWtCLFVBQVN2RSxDQUFULEVBQVk7VUFBU0EsRUFBRWlGLFFBQUYsQ0FBVyxDQUFYLENBQVA7R0FBakQ7O2FBRVd6RixZQUFZLFlBQVc7VUFBU0ssU0FBUDtHQUFwQztrQkFDZ0IyRSxpQkFBaUIsWUFBVztVQUFTM0UsU0FBUDtHQUE5QztpQkFDZTRFLGdCQUFnQixZQUFXO1VBQVM1RSxTQUFQO0dBQTVDOztzQkFFb0I2RSxxQkFBcUIsWUFBVztVQUFTN0UsU0FBUDtHQUF0RDt1QkFDcUI4RSxzQkFBc0IsWUFBVztVQUFTOUUsU0FBUDtHQUF4RDs7dUJBRXFCK0Usc0JBQXNCLFlBQVc7VUFBUy9FLFNBQVA7R0FBeEQ7cUJBQ21CZ0Ysb0JBQW9CLFlBQVc7VUFBU2hGLFNBQVA7R0FBcEQ7O1lBRVUwRCxXQUFXLFVBQXJCOztTQUVPd0IsUUFBUSxFQUFmO1NBQ09DLFFBQVEsRUFBZjs7ZUFFYUYsY0FBYyxVQUFTckUsQ0FBVCxFQUFZO1VBQVNBLENBQVA7R0FBekM7O01BRUl5RSxJQUFJdkYsU0FBU3dGLFlBQVQsRUFBUjtNQUNDQyxJQUFJekYsU0FBUzBGLGFBQVQsRUFETDtNQUVDQyxTQUFTaEQsS0FBS2lELEdBQUwsQ0FBU0wsQ0FBVCxFQUFZRSxDQUFaLElBQWlCLENBRjNCOztNQUlJSSxTQUFNdkYsTUFBQSxHQUNSd0YsSUFEUSxDQUNILElBREcsRUFFUkMsS0FGUSxDQUVGLFVBQVNqRixDQUFULEVBQVk7VUFBU3FELEVBQUVyRCxDQUFGLENBQVA7R0FGWixFQUdSa0YsVUFIUSxDQUdHWixLQUFLWSxVQUFMLEdBQW1CWixLQUFLWSxVQUFMLEdBQWtCckQsS0FBS3NELEVBQXZCLEdBQTBCLEdBQTdDLEdBQW1ELENBSHRELEVBSVJDLFFBSlEsQ0FJQ2QsS0FBS2MsUUFBTCxHQUFnQmQsS0FBS2MsUUFBTCxHQUFnQnZELEtBQUtzRCxFQUFyQixHQUF3QixHQUF4QyxHQUE4QyxJQUFJdEQsS0FBS3NELEVBSnhELEVBS1JFLFFBTFEsQ0FLQ2YsS0FBS2UsUUFBTCxHQUFnQmYsS0FBS2UsUUFBTCxHQUFnQnhELEtBQUtzRCxFQUFyQixHQUF3QixHQUF4QyxHQUE4QyxDQUwvQyxDQUFWOztNQU9JRyxTQUFNOUYsTUFBQSxHQUNSK0YsV0FEUSxDQUNJVixTQUFTLEdBRGI7O0dBR1JXLFdBSFEsQ0FHSWpCLEtBQUtpQixXQUFMLEdBQW1CWCxTQUFTTixLQUFLaUIsV0FBakMsR0FBK0NYLFNBQVMsR0FINUQsQ0FBVjs7TUFLSVksV0FBV2pHLE1BQUEsR0FDYmdHLFdBRGEsQ0FDRFgsU0FBUyxHQURSLEVBRWJVLFdBRmEsQ0FFRFYsU0FBUyxHQUZSLENBQWY7O1dBSVNhLFFBQVQsQ0FBa0IxRixDQUFsQixFQUFvQjtVQUNaQSxFQUFFa0YsVUFBRixHQUFlLENBQUNsRixFQUFFb0YsUUFBRixHQUFhcEYsRUFBRWtGLFVBQWhCLElBQThCLENBQXBEOzs7WUFHUzdGLElBQVYsQ0FBZSxVQUFTa0IsSUFBVCxFQUFlOztPQUV6Qm9GLE9BQU9uRyxTQUFBLENBQVUsSUFBVixDQUFYOzs7T0FHSW9HLElBQUlELEtBQUtFLE1BQUwsQ0FBWSxHQUFaLENBQVI7T0FDR0QsRUFBRUUsS0FBRixFQUFILEVBQWM7UUFDVEgsS0FBS0ksTUFBTCxDQUFZLEdBQVosRUFDRkMsSUFERSxDQUNHLFdBREgsRUFDZ0IsZUFBZXZCLElBQUksQ0FBbkIsR0FBdUIsR0FBdkIsR0FBNkJFLElBQUksQ0FBakMsR0FBcUMsR0FEckQsQ0FBSjs7O09BSUVpQixFQUFFQyxNQUFGLENBQVMsUUFBVCxFQUFtQkMsS0FBbkIsRUFBSCxFQUErQjtNQUM1QkMsTUFBRixDQUFTLE1BQVQsRUFDRUMsSUFERixDQUNPLE9BRFAsRUFDZ0IsT0FEaEIsRUFFRUEsSUFGRixDQUVPLElBRlAsRUFFYSxPQUZiLEVBR0VDLEtBSEYsQ0FHUSxhQUhSLEVBR3VCLFFBSHZCLEVBSUV6QyxJQUpGLENBSU8sWUFBVztZQUNULE9BQU9HLE1BQVAsS0FBa0IsVUFBbEIsR0FBK0JBLE9BQU9wRCxJQUFQLENBQS9CLEdBQThDb0QsTUFBckQ7S0FMRjs7Ozs7T0FXR3VDLFNBQVNOLEVBQUVDLE1BQUYsQ0FBUyxTQUFULENBQWI7O09BRUdLLE9BQU9KLEtBQVAsRUFBSCxFQUFtQjthQUNURixFQUFFRyxNQUFGLENBQVMsR0FBVCxFQUFjQyxJQUFkLENBQW1CLE9BQW5CLEVBQTRCbEQsVUFBVSxTQUF0QyxDQUFUOzs7O09BSUdxRCxRQUFRRCxPQUFPRSxTQUFQLENBQWlCLFFBQWpCLEVBQ1Y3RixJQURVLENBQ0x3RSxPQUFJeEUsSUFBSixDQURLLEVBQ00sVUFBU1AsQ0FBVCxFQUFZO1dBQVNtRCxJQUFJbkQsRUFBRU8sSUFBTixDQUFQO0lBRHBCLEVBRVR5RixJQUZTLENBRUosT0FGSSxFQUVLLGNBRkwsQ0FBWjs7O1NBS01LLEtBQU4sR0FDRU4sTUFERixDQUNTLE1BRFQsRUFFR0MsSUFGSCxDQUVRLE9BRlIsRUFFaUIsYUFGakIsRUFHR0EsSUFISCxDQUdRLElBSFIsRUFHYyxPQUhkLEVBSUdDLEtBSkgsQ0FJUyxNQUpULEVBSWlCLFVBQVNqRyxDQUFULEVBQVk7V0FBUzBELFdBQVdILE1BQU12RCxFQUFFTyxJQUFSLENBQVgsQ0FBUDtJQUovQixFQUtHMEYsS0FMSCxDQUtTLFdBTFQsRUFLc0IsVUFBU2pHLENBQVQsRUFBWTtXQUFTc0QsTUFBTUcsT0FBTixHQUFnQkEsUUFBUUgsR0FBR3RELEVBQUVPLElBQUwsQ0FBUixJQUFzQixJQUF0QyxHQUE2Q25CLFNBQXBEO0lBTHBDLEVBTUdrSCxFQU5ILENBTU0sV0FOTixFQU1tQnJDLGlCQU5uQixFQU9HcUMsRUFQSCxDQU9NLFlBUE4sRUFPb0JwQyxrQkFQcEIsRUFRR29DLEVBUkgsQ0FRTSxZQVJOLEVBUW9CbkMsa0JBUnBCLEVBU0dtQyxFQVRILENBU00sVUFUTixFQVNrQmxDLGdCQVRsQixFQVVHOUUsSUFWSCxDQVVReUUsYUFWUixFQVdHd0MsS0FYSCxDQVdTSixLQVhUO0lBWUkzQyxJQVpKLENBWVMsVUFBU3hELENBQVQsRUFBWTtXQUFTcUUsV0FBV2IsS0FBS3hELEVBQUVPLElBQVAsQ0FBWCxDQUFQO0lBWnZCLEVBYUlxRCxVQWJKLEdBYWlCdEUsSUFiakIsQ0Fhc0JzRSxhQWJ0QixFQWNLcUMsS0FkTCxDQWNXLE1BZFgsRUFjbUIsVUFBU2pHLENBQVQsRUFBWTtXQUFTMEQsV0FBV0gsTUFBTXZELEVBQUVPLElBQVIsQ0FBWCxDQUFQO0lBZGpDLEVBZUswRixLQWZMLENBZVcsV0FmWCxFQWV3QixVQUFTakcsQ0FBVCxFQUFZO1dBQVNzRCxNQUFNRyxPQUFOLEdBQWdCQSxRQUFRSCxHQUFHdEQsRUFBRU8sSUFBTCxDQUFSLElBQXNCLElBQXRDLEdBQTZDbkIsU0FBcEQ7SUFmdEMsRUFnQktvSCxTQWhCTCxDQWdCZSxXQWhCZixFQWdCNEIsVUFBU3hHLENBQVQsRUFBWTtTQUM5QnlHLFFBQUwsR0FBZ0IsS0FBS0EsUUFBTCxJQUFpQnpHLENBQWpDO1FBQ0kwRyxpQkFBY2xILGNBQUEsQ0FBZSxLQUFLaUgsUUFBcEIsRUFBOEJ6RyxDQUE5QixDQUFsQjtTQUNLeUcsUUFBTCxHQUFnQkMsZUFBWSxDQUFaLENBQWhCO1dBQ08sVUFBU25ILENBQVQsRUFBWTtTQUNkb0gsS0FBS0QsZUFBWW5ILENBQVosQ0FBVDtTQUNJcUgsTUFBTW5CLFNBQVNvQixRQUFULENBQWtCRixFQUFsQixDQUFWO1NBQ0ksQ0FBSixJQUFTOUIsVUFBVWEsU0FBU2lCLEVBQVQsSUFBZSxDQUFmLElBQW9CakIsU0FBU2lCLEVBQVQsSUFBZTlFLEtBQUtzRCxFQUF4QyxHQUE2QyxDQUE3QyxHQUFpRCxDQUFDLENBQTVELENBQVQ7WUFDTyxlQUFjeUIsR0FBZCxHQUFtQixHQUExQjtLQUpEO0lBcEJMLEVBMkJLRSxVQTNCTCxDQTJCZ0IsYUEzQmhCLEVBMkIrQixVQUFTOUcsQ0FBVCxFQUFXO1NBQ2hDeUcsUUFBTCxHQUFnQixLQUFLQSxRQUFMLElBQWlCekcsQ0FBakM7UUFDSTBHLGlCQUFjbEgsY0FBQSxDQUFlLEtBQUtpSCxRQUFwQixFQUE4QnpHLENBQTlCLENBQWxCO1NBQ0t5RyxRQUFMLEdBQWdCQyxlQUFZLENBQVosQ0FBaEI7V0FDTyxVQUFTbkgsQ0FBVCxFQUFZO1NBQ2RvSCxLQUFLRCxlQUFZbkgsQ0FBWixDQUFUO1lBQ09tRyxTQUFTaUIsRUFBVCxJQUFlLENBQWYsSUFBb0JqQixTQUFTaUIsRUFBVCxJQUFlOUUsS0FBS3NELEVBQXhDLEdBQTZDLE9BQTdDLEdBQXVELEtBQTlEO0tBRkQ7SUEvQkwsRUFvQ0ttQixFQXBDTCxDQW9DUSxLQXBDUixFQW9DZSxZQUFXO2FBQUUsQ0FBVSxJQUFWLEVBQWdCaEgsSUFBaEIsQ0FBcUJQLFFBQXJCO0lBcEM1Qjs7O1NBdUNNZ0ksSUFBTixHQUNFZixJQURGLENBQ08sT0FEUCxFQUNnQixZQURoQixFQUVFcEMsVUFGRixHQUVldEUsSUFGZixDQUVvQndFLGNBRnBCLEVBR0d3QyxFQUhILENBR00sS0FITixFQUdhLFlBQVc7YUFBRSxDQUFVLElBQVYsRUFBZ0JoSCxJQUFoQixDQUFxQjBFLFlBQXJCO0lBSDFCLEVBSUdnRCxNQUpIOzs7O09BUUlDLFFBQVFyQixFQUFFQyxNQUFGLENBQVMsUUFBVCxDQUFaOztPQUVHb0IsTUFBTW5CLEtBQU4sRUFBSCxFQUFrQjtZQUNURixFQUFFRyxNQUFGLENBQVMsR0FBVCxFQUFjQyxJQUFkLENBQW1CLE9BQW5CLEVBQTRCbEQsVUFBVSxRQUF0QyxDQUFSOzs7T0FHR29FLFdBQVdELE1BQU1iLFNBQU4sQ0FBZ0IsT0FBaEIsRUFDYjdGLElBRGEsQ0FDUndFLE9BQUl4RSxJQUFKLENBRFEsRUFDRyxVQUFTUCxDQUFULEVBQVk7V0FBU21ELElBQUluRCxFQUFFTyxJQUFOLENBQVA7SUFEakIsRUFFWnlGLElBRlksQ0FFUCxPQUZPLEVBRUUsYUFGRixDQUFmOztZQUlTSyxLQUFULEdBQ0VOLE1BREYsQ0FDUyxVQURULEVBRUVDLElBRkYsQ0FFTyxPQUZQLEVBRWdCLFlBRmhCLEVBR0VPLEtBSEYsQ0FHUVcsUUFIUixFQUlHdEQsVUFKSCxHQUlnQnRFLElBSmhCLENBSXFCc0UsYUFKckIsRUFLSTRDLFNBTEosQ0FLYyxRQUxkLEVBS3dCLFVBQVN4RyxDQUFULEVBQVc7U0FDMUJ5RyxRQUFMLEdBQWdCLEtBQUtBLFFBQUwsSUFBaUJ6RyxDQUFqQztRQUNJMEcsaUJBQWNsSCxjQUFBLENBQWUsS0FBS2lILFFBQXBCLEVBQThCekcsQ0FBOUIsQ0FBbEI7U0FDS3lHLFFBQUwsR0FBZ0JDLGVBQVksQ0FBWixDQUFoQjtXQUNPLFVBQVNuSCxDQUFULEVBQVk7U0FDZG9ILEtBQUtELGVBQVluSCxDQUFaLENBQVQ7U0FDSXFILE1BQU1uQixTQUFTb0IsUUFBVCxDQUFrQkYsRUFBbEIsQ0FBVjtTQUNJLENBQUosSUFBUzlCLFNBQVMsSUFBVCxJQUFpQmEsU0FBU2lCLEVBQVQsSUFBZSxDQUFmLElBQW9CakIsU0FBU2lCLEVBQVQsSUFBZTlFLEtBQUtzRCxFQUF4QyxHQUE2QyxDQUE3QyxHQUFpRCxDQUFDLENBQW5FLENBQVQ7WUFDTyxDQUFDRyxPQUFJdUIsUUFBSixDQUFhRixFQUFiLENBQUQsRUFBbUJsQixTQUFTb0IsUUFBVCxDQUFrQkYsRUFBbEIsQ0FBbkIsRUFBMENDLEdBQTFDLENBQVA7S0FKRDtJQVRKOztZQWlCU0csSUFBVCxHQUNFZixJQURGLENBQ08sT0FEUCxFQUNnQixXQURoQixFQUVFcEMsVUFGRixHQUVldEUsSUFGZixDQUVvQndFLGNBRnBCLEVBR0drRCxNQUhIO0dBN0dEOzs7VUFvSFFuRSxLQUFULEdBQWlCLFVBQVNsRCxDQUFULEVBQVk7U0FDckJDLFVBQVVDLE1BQVYsSUFBb0JnRCxRQUFRbEQsQ0FBUixFQUFXVCxRQUEvQixJQUEyQzJELFNBQVMsRUFBM0Q7RUFERDs7VUFJU0MsT0FBVCxHQUFtQixVQUFTbkQsQ0FBVCxFQUFZO1NBQ3ZCQyxVQUFVQyxNQUFWLElBQW9CaUQsVUFBVW5ELENBQVYsRUFBYVQsUUFBakMsSUFBNkM0RCxPQUFwRDtFQUREOztVQUlTQyxNQUFULEdBQWtCLFVBQVNwRCxDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0JrRCxTQUFTcEQsQ0FBVCxFQUFZVCxRQUFoQyxJQUE0QzZELE1BQW5EO0VBREQ7O1VBSVNDLEtBQVQsR0FBaUIsVUFBU3JELENBQVQsRUFBWTtTQUNyQkMsVUFBVUMsTUFBVixJQUFvQm1ELFFBQVFyRCxDQUFSLEVBQVdULFFBQS9CLElBQTJDOEQsS0FBbEQ7RUFERDs7VUFJU0MsTUFBVCxHQUFrQixVQUFTdEQsQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9Cb0QsU0FBU3RELENBQVQsRUFBWVQsUUFBaEMsSUFBNEMrRCxNQUFuRDtFQUREOztVQUlTQyxNQUFULEdBQWtCLFVBQVN2RCxDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0JxRCxTQUFTdkQsQ0FBVCxFQUFZVCxRQUFoQyxJQUE0Q2dFLE1BQW5EO0VBREQ7O1VBSVN3QixZQUFULEdBQXdCLFlBQVc7U0FDM0IxQixRQUFRRSxPQUFPaUUsS0FBZixHQUF1QmpFLE9BQU9rRSxJQUFyQztFQUREOztVQUlTeEMsYUFBVCxHQUF5QixZQUFXO1NBQzVCM0IsU0FBU0MsT0FBT21FLEdBQWhCLEdBQXNCbkUsT0FBT29FLE1BQXBDO0VBREQ7O1VBSVNuRSxHQUFULEdBQWUsVUFBU3hELENBQVQsRUFBWTtTQUNuQkMsVUFBVUMsTUFBVixJQUFvQnNELE1BQU14RCxDQUFOLEVBQVNULFFBQTdCLElBQXlDaUUsR0FBaEQ7RUFERDs7VUFJU0MsQ0FBVCxHQUFhLFVBQVN6RCxDQUFULEVBQVk7U0FDakJDLFVBQVVDLE1BQVYsSUFBb0J1RCxJQUFJekQsQ0FBSixFQUFPVCxRQUEzQixJQUF1Q2tFLENBQTlDO0VBREQ7O1VBSVNDLENBQVQsR0FBYSxVQUFTMUQsQ0FBVCxFQUFZO1NBQ2pCQyxVQUFVQyxNQUFWLElBQW9Cd0QsSUFBSTFELENBQUosRUFBT1QsUUFBM0IsSUFBdUNtRSxDQUE5QztFQUREOztVQUlTQyxFQUFULEdBQWMsVUFBUzNELENBQVQsRUFBWTtTQUNsQkMsVUFBVUMsTUFBVixJQUFvQnlELEtBQUszRCxDQUFMLEVBQVFULFFBQTVCLElBQXdDb0UsRUFBL0M7RUFERDs7VUFJU0MsS0FBVCxHQUFpQixVQUFTNUQsQ0FBVCxFQUFZO1NBQ3JCQyxVQUFVQyxNQUFWLElBQW9CMEQsUUFBUTVELENBQVIsRUFBV1QsUUFBL0IsSUFBMkNxRSxLQUFsRDtFQUREOztVQUlTQyxJQUFULEdBQWdCLFVBQVM3RCxDQUFULEVBQVk7U0FDcEJDLFVBQVVDLE1BQVYsSUFBb0IyRCxPQUFPN0QsQ0FBUCxFQUFVVCxRQUE5QixJQUEwQ3NFLElBQWpEO0VBREQ7O1VBSVNDLE9BQVQsR0FBbUIsVUFBUzlELENBQVQsRUFBWTtTQUN2QkMsVUFBVUMsTUFBVixJQUFvQjRELFVBQVU5RCxDQUFWLEVBQWFULFFBQWpDLElBQTZDdUUsT0FBcEQ7RUFERDs7VUFJU0MsVUFBVCxHQUFzQixVQUFTL0QsQ0FBVCxFQUFZO1NBQzFCQyxVQUFVQyxNQUFWLElBQW9CNkQsYUFBYS9ELENBQWIsRUFBZ0JULFFBQXBDLElBQWdEd0UsVUFBdkQ7RUFERDs7VUFJU0MsTUFBVCxHQUFrQixVQUFTaEUsQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9COEQsU0FBU2hFLENBQVQsRUFBWVQsUUFBaEMsSUFBNEN5RSxNQUFuRDtFQUREOztVQUlTQyxVQUFULEdBQXNCLFVBQVNqRSxDQUFULEVBQVk7U0FDMUJDLFVBQVVDLE1BQVYsSUFBb0IrRCxnQkFBYWpFLENBQWIsRUFBZ0JULFFBQXBDLElBQWdEMEUsYUFBdkQ7RUFERDs7VUFJU0MsZUFBVCxHQUEyQixVQUFTbEUsQ0FBVCxFQUFZO1NBQy9CQyxVQUFVQyxNQUFWLElBQW9CZ0Usa0JBQWtCbEUsQ0FBbEIsRUFBcUJULFFBQXpDLElBQXFEMkUsZUFBNUQ7RUFERDs7VUFJU0MsY0FBVCxHQUEwQixVQUFTbkUsQ0FBVCxFQUFZO1NBQzlCQyxVQUFVQyxNQUFWLElBQW9CaUUsaUJBQWlCbkUsQ0FBakIsRUFBb0JULFFBQXhDLElBQW9ENEUsY0FBM0Q7RUFERDs7VUFJUy9FLFFBQVQsR0FBb0IsVUFBU1ksQ0FBVCxFQUFZO1NBQ3hCQyxVQUFVQyxNQUFWLElBQW9CZCxXQUFXWSxDQUFYLEVBQWNULFFBQWxDLElBQThDSCxRQUFyRDtFQUREOztVQUlTZ0YsYUFBVCxHQUF5QixVQUFTcEUsQ0FBVCxFQUFZO1NBQzdCQyxVQUFVQyxNQUFWLElBQW9Ca0UsZ0JBQWdCcEUsQ0FBaEIsRUFBbUJULFFBQXZDLElBQW1ENkUsYUFBMUQ7RUFERDs7VUFJU0MsWUFBVCxHQUF3QixVQUFTckUsQ0FBVCxFQUFZO1NBQzVCQyxVQUFVQyxNQUFWLElBQW9CbUUsZUFBZXJFLENBQWYsRUFBa0JULFFBQXRDLElBQWtEOEUsWUFBekQ7RUFERDs7VUFJU0MsaUJBQVQsR0FBNkIsVUFBU3RFLENBQVQsRUFBWTtTQUNqQ0MsVUFBVUMsTUFBVixJQUFvQm9FLG9CQUFvQnRFLENBQXBCLEVBQXVCVCxRQUEzQyxJQUF1RCtFLGlCQUE5RDtFQUREOztVQUlTQyxrQkFBVCxHQUE4QixVQUFTdkUsQ0FBVCxFQUFZO1NBQ2xDQyxVQUFVQyxNQUFWLElBQW9CcUUscUJBQXFCdkUsQ0FBckIsRUFBd0JULFFBQTVDLElBQXdEZ0Ysa0JBQS9EO0VBREQ7O1VBSVNDLGtCQUFULEdBQThCLFVBQVN4RSxDQUFULEVBQVk7U0FDbENDLFVBQVVDLE1BQVYsSUFBb0JzRSxxQkFBcUJ4RSxDQUFyQixFQUF3QlQsUUFBNUMsSUFBd0RpRixrQkFBL0Q7RUFERDs7VUFJU0MsZ0JBQVQsR0FBNEIsVUFBU3pFLENBQVQsRUFBWTtTQUNoQ0MsVUFBVUMsTUFBVixJQUFvQnVFLG1CQUFtQnpFLENBQW5CLEVBQXNCVCxRQUExQyxJQUFzRGtGLGdCQUE3RDtFQUREOztVQUlTQyxVQUFULEdBQXNCLFVBQVMxRSxDQUFULEVBQVk7U0FDMUJDLFVBQVVDLE1BQVYsSUFBb0J3RSxhQUFhMUUsQ0FBYixFQUFnQlQsUUFBcEMsSUFBZ0RtRixVQUF2RDtFQUREOztVQUlTaUIsR0FBVCxHQUFlLFVBQVMzRixDQUFULEVBQVk7U0FDbkJDLFVBQVVDLE1BQVYsSUFBb0IwRSxPQUFPNUUsQ0FBUCxFQUFVVCxRQUE5QixJQUEwQ3FGLElBQWpEO0VBREQ7O1VBSVNRLEdBQVQsR0FBZSxVQUFTcEYsQ0FBVCxFQUFZO1NBQ25CQyxVQUFVQyxNQUFWLElBQW9CeUUsT0FBTzNFLENBQVAsRUFBVVQsUUFBOUIsSUFBMENvRixJQUFqRDtFQUREOztRQUlPcEYsUUFBUDs7O0FDL1NjLFNBQVNxSSxJQUFULEdBQWdCOztLQUUxQjFFLEtBQUosRUFDQ0MsT0FERCxFQUVDQyxNQUZELEVBR0N5RSxNQUhELEVBR1NDLElBSFQsRUFJQ3RFLEdBSkQsRUFJTUMsQ0FKTixFQUlTQyxDQUpULEVBSVlDLEVBSlosRUFLQ29FLE1BTEQsRUFLU0MsTUFMVCxFQUtpQmxFLE9BTGpCLEVBT0NtRSxNQVBELEVBT1NqRSxNQVBULEVBT2lCa0UsT0FQakIsRUFRQ0MsT0FSRCxFQVFVQyxPQVJWLEVBUW1CQyxRQVJuQixFQVVDQyxNQVZELEVBVVNDLE1BVlQsRUFVaUJDLE9BVmpCLEVBV0NDLFdBWEQsRUFXY0MsV0FYZCxFQVcyQkMsWUFYM0IsRUFZQ0MsV0FaRCxFQVljQyxXQVpkLEVBWTJCQyxZQVozQixFQWFDQyxLQWJELEVBYVFDLEtBYlIsRUFhZUMsTUFiZixFQWNDQyxLQWRELEVBY1FDLEtBZFIsRUFjZUMsTUFkZixFQWdCQ25GLGFBaEJELEVBZ0JhQyxlQWhCYixFQWdCOEJDLGNBaEI5QixFQWlCQy9FLFFBakJELEVBaUJXZ0YsYUFqQlgsRUFpQjBCQyxZQWpCMUI7O1VBbUJTOUUsUUFBVCxDQUFrQkMsU0FBbEIsRUFBNkI7OztZQUdsQjJELFdBQVcsTUFBckI7O2tCQUVhYyxpQkFBYyxVQUFTckUsQ0FBVCxFQUFZO1VBQVNBLEVBQUVpRixRQUFGLENBQVcsQ0FBWCxDQUFQO0dBQXpDO29CQUNrQlgsbUJBQW1CLFVBQVN0RSxDQUFULEVBQVk7VUFBU0EsRUFBRWlGLFFBQUYsQ0FBVyxDQUFYLENBQVA7R0FBbkQ7bUJBQ2lCVixrQkFBa0IsVUFBU3ZFLENBQVQsRUFBWTtVQUFTQSxFQUFFaUYsUUFBRixDQUFXLENBQVgsQ0FBUDtHQUFqRDs7YUFFV3pGLFlBQVksWUFBVztVQUFTSyxTQUFQO0dBQXBDO2tCQUNnQjJFLGlCQUFpQixZQUFXO1VBQVMzRSxTQUFQO0dBQTlDO2lCQUNlNEUsZ0JBQWdCLFlBQVc7VUFBUzVFLFNBQVA7R0FBNUM7O1lBRVVDLElBQVYsQ0FBZSxVQUFTa0IsSUFBVCxFQUFlOztPQUV6QnlJLFFBQVF4SixhQUFBLENBQWNrSSxNQUFkLEVBQ1R1QixLQURTLENBQ0hoQixNQURHLEVBRVRpQixVQUZTLENBRUVkLFdBRkYsRUFHVGUsVUFIUyxDQUdFckIsT0FIRixDQUFaO09BS0NzQixRQUFRNUosV0FBQSxDQUFZbUksTUFBWixFQUNOc0IsS0FETSxDQUNBZixNQURBLEVBRU5nQixVQUZNLENBRUtiLFdBRkwsRUFHTmMsVUFITSxDQUdLcEIsT0FITCxDQUxUO09BVUNzQixTQUFTN0osWUFBQSxDQUFhaUUsT0FBYixFQUNQd0YsS0FETyxDQUNEZCxPQURDLEVBRVBlLFVBRk8sQ0FFSVosWUFGSixFQUdQYSxVQUhPLENBR0luQixRQUhKLENBVlY7OztPQWdCR1UsS0FBSCxFQUFVTSxNQUFNTSxXQUFOLENBQWtCLENBQWxCLEVBQXFCQyxhQUFyQixDQUFtQyxDQUFDNUIsT0FBT2pHLEtBQVAsR0FBZSxDQUFmLENBQXBDO09BQ1BpSCxLQUFILEVBQVVTLE1BQU1FLFdBQU4sQ0FBa0IsQ0FBbEIsRUFBcUJDLGFBQXJCLENBQW1DLENBQUM3QixPQUFPaEcsS0FBUCxHQUFlLENBQWYsQ0FBcEM7T0FDUGtILE1BQUgsRUFBV1MsT0FBT0MsV0FBUCxDQUFtQixDQUFuQixFQUFzQkMsYUFBdEIsQ0FBb0MsQ0FBQzdCLE9BQU9oRyxLQUFQLEdBQWUsQ0FBZixDQUFyQzs7O09BSVA4SCxRQUFRaEssU0FBQSxDQUFVLElBQVYsRUFBZ0I0RyxTQUFoQixDQUEwQixVQUExQixFQUFzQzdGLElBQXRDLENBQTJDLENBQUMsQ0FBRCxDQUEzQyxDQUFaO09BQ0NrSixRQUFRakssU0FBQSxDQUFVLElBQVYsRUFBZ0I0RyxTQUFoQixDQUEwQixVQUExQixFQUFzQzdGLElBQXRDLENBQTJDLENBQUMsQ0FBRCxDQUEzQyxDQURUO09BRUNtSixTQUFTbEssU0FBQSxDQUFVLElBQVYsRUFBZ0I0RyxTQUFoQixDQUEwQixXQUExQixFQUF1QzdGLElBQXZDLENBQTRDLENBQUMsQ0FBRCxDQUE1QyxDQUZWOzs7T0FLSW9KLGFBQWFILE1BQU1uRCxLQUFOLEdBQ2ZOLE1BRGUsQ0FDUixHQURRLEVBRWRDLElBRmMsQ0FFVCxPQUZTLEVBRUEsUUFGQSxDQUFqQjs7Y0FJV0QsTUFBWCxDQUFrQixNQUFsQixFQUNFQyxJQURGLENBQ08sT0FEUCxFQUNnQixPQURoQixFQUVFQSxJQUZGLENBRU8sV0FGUCxFQUVvQixlQUFlMEIsT0FBT2hHLEtBQVAsR0FBZSxDQUFmLENBQWYsR0FBbUMsS0FGdkQsRUFHRXNFLElBSEYsQ0FHTyxJQUhQLEVBR2EsUUFIYixFQUlFQyxLQUpGLENBSVEsYUFKUixFQUl1QixLQUp2QixFQUtFekMsSUFMRixDQUtPLE9BQU9vRSxNQUFQLEtBQWtCLFVBQWxCLEdBQStCQSxPQUFPckgsSUFBUCxDQUEvQixHQUE4Q3FILE1BTHJEOztjQU9XckIsS0FBWCxDQUFpQmlELEtBQWpCO0lBQ0V4RCxJQURGLENBQ08sV0FEUCxFQUNvQixpQkFBaUIyQixPQUFPakcsS0FBUCxHQUFlLENBQWYsQ0FBakIsR0FBcUMsR0FEekQsRUFFRXVFLEtBRkYsQ0FFUSxTQUZSLEVBRW1CNEMsUUFBUSxNQUFSLEdBQWlCekosU0FGcEMsRUFHRUUsSUFIRixDQUdPMEosS0FIUDs7T0FLR3hKLE1BQUEsQ0FBT2tJLE9BQU9qRyxNQUFQLEVBQVAsSUFBMEIsQ0FBN0IsRUFBZ0M7ZUFDcEJzRSxNQUFYLENBQWtCLE1BQWxCLEVBQ0VDLElBREYsQ0FDTyxPQURQLEVBQ2dCLE1BRGhCLEVBRUVBLElBRkYsQ0FFTyxRQUZQLEVBRWlCLE1BRmpCOztlQUlXTyxLQUFYLENBQWlCaUQsS0FBakIsRUFBd0IzRCxNQUF4QixDQUErQixPQUEvQixFQUNFRyxJQURGLENBQ08sR0FEUCxFQUNZeEcsT0FBQSxHQUFVLENBQUMsQ0FBQ2tJLE9BQU8sQ0FBUCxDQUFELEVBQVksQ0FBQ0MsT0FBT2pHLEtBQVAsR0FBZSxDQUFmLENBQWIsQ0FBRCxFQUFpQyxDQUFDZ0csT0FBTyxDQUFQLENBQUQsRUFBWSxDQUFaLENBQWpDLENBQVYsQ0FEWjs7O09BSUVhLFdBQUgsRUFBZ0I7ZUFDSmhDLEtBQVgsQ0FBaUJpRCxLQUFqQixFQUF3QnBELFNBQXhCLENBQWtDLFlBQWxDLEVBQ0VILEtBREYsQ0FDUSxhQURSLEVBQ3VCLEtBRHZCLEVBRUVELElBRkYsQ0FFTyxJQUZQLEVBRWMsUUFBUXVDLFdBQVQsR0FBd0IsSUFGckMsRUFHRXZDLElBSEYsQ0FHTyxJQUhQLEVBR2MsUUFBUXVDLFdBQVQsR0FBd0IsSUFIckMsRUFJRXZDLElBSkYsQ0FJTyxXQUpQLEVBSW9CLFlBQVl1QyxXQUFaLEdBQTBCLEdBSjlDOzs7T0FPRUcsS0FBSCxFQUFVO2VBQ0VuQyxLQUFYLENBQWlCaUQsS0FBakIsRUFBd0JwRCxTQUF4QixDQUFrQyxZQUFsQyxFQUNFSCxLQURGLENBQ1EsU0FEUixFQUNtQnlDLE1BQU1rQixPQUFOLElBQWlCLEdBRHBDLEVBRUUzRCxLQUZGLENBRVEsUUFGUixFQUVrQnlDLE1BQU1tQixNQUFOLElBQWdCLE1BRmxDLEVBR0U1RCxLQUhGLENBR1Esa0JBSFIsRUFHNEJ5QyxNQUFNb0IsZUFBTixJQUF5QixLQUhyRDs7O09BTUdDLGFBQWFOLE1BQU1wRCxLQUFOLEdBQ2ZOLE1BRGUsQ0FDUixHQURRLEVBRWRDLElBRmMsQ0FFVCxPQUZTLEVBRUEsUUFGQSxFQUdkQSxJQUhjLENBR1QsV0FIUyxFQUdJLGVBQWUwQixPQUFPaEcsS0FBUCxHQUFlLENBQWYsQ0FBZixHQUFtQyxLQUh2QyxDQUFqQjs7Y0FLV3FFLE1BQVgsQ0FBa0IsTUFBbEIsRUFDRUMsSUFERixDQUNPLE9BRFAsRUFDZ0IsT0FEaEIsRUFFRUEsSUFGRixDQUVPLElBRlAsRUFFYSxJQUZiLEVBR0VBLElBSEYsQ0FHTyxJQUhQLEVBR2EsU0FIYixFQUlFQyxLQUpGLENBSVEsYUFKUixFQUl1QixPQUp2QixFQUtFekMsSUFMRixDQUtPLE9BQU9HLE1BQVAsS0FBa0IsVUFBbEIsR0FBK0JBLE9BQU9wRCxJQUFQLENBQS9CLEdBQThDb0QsTUFMckQ7O2NBT1c0QyxLQUFYLENBQWlCa0QsS0FBakI7SUFDRXhELEtBREYsQ0FDUSxTQURSLEVBQ21CNkMsUUFBUSxNQUFSLEdBQWlCMUosU0FEcEMsRUFFRUUsSUFGRixDQUVPOEosS0FGUDs7T0FJRzVKLE1BQUEsQ0FBT21JLE9BQU9sRyxNQUFQLEVBQVAsSUFBMEIsQ0FBN0IsRUFBZ0M7ZUFDcEJzRSxNQUFYLENBQWtCLE1BQWxCLEVBQ0VDLElBREYsQ0FDTyxPQURQLEVBQ2dCLE1BRGhCLEVBRUVBLElBRkYsQ0FFTyxRQUZQLEVBRWlCLE1BRmpCOztlQUlXTyxLQUFYLENBQWlCa0QsS0FBakIsRUFBd0I1RCxNQUF4QixDQUErQixPQUEvQixFQUNFRyxJQURGLENBQ08sR0FEUCxFQUNZeEcsT0FBQSxHQUFVLENBQUMsQ0FBQ2tJLE9BQU9oRyxLQUFQLEdBQWUsQ0FBZixDQUFELEVBQW9CaUcsT0FBTyxDQUFQLENBQXBCLENBQUQsRUFBaUMsQ0FBQ0QsT0FBT2hHLEtBQVAsR0FBZSxDQUFmLENBQUQsRUFBb0JpRyxPQUFPLENBQVAsQ0FBcEIsQ0FBakMsQ0FBVixDQURaOzs7T0FJRWEsV0FBSCxFQUFnQjtlQUNKakMsS0FBWCxDQUFpQmtELEtBQWpCLEVBQXdCckQsU0FBeEIsQ0FBa0MsWUFBbEMsRUFDRUgsS0FERixDQUNRLGFBRFIsRUFDdUIsS0FEdkIsRUFFRUQsSUFGRixDQUVPLElBRlAsRUFFYyxRQUFRd0MsV0FBUixHQUFzQixHQUF2QixHQUE4QixJQUYzQyxFQUdFeEMsSUFIRixDQUdPLElBSFAsRUFHYyxRQUFRd0MsV0FBVCxHQUF3QixJQUhyQyxFQUlFeEMsSUFKRixDQUlPLFdBSlAsRUFJb0IsWUFBWXdDLFdBQVosR0FBMEIsR0FKOUM7OztPQU9FRyxLQUFILEVBQVU7ZUFDRXBDLEtBQVgsQ0FBaUJrRCxLQUFqQixFQUF3QnJELFNBQXhCLENBQWtDLFlBQWxDLEVBQ0VILEtBREYsQ0FDUSxTQURSLEVBQ21CMEMsTUFBTWlCLE9BQU4sSUFBaUIsR0FEcEMsRUFFRTNELEtBRkYsQ0FFUSxRQUZSLEVBRWtCMEMsTUFBTWtCLE1BQU4sSUFBZ0IsTUFGbEMsRUFHRTVELEtBSEYsQ0FHUSxrQkFIUixFQUc0QjBDLE1BQU1tQixlQUFOLElBQXlCLEtBSHJEOzs7T0FNRXJHLE9BQUgsRUFBWTtRQUNQdUcsY0FBY04sT0FBT3JELEtBQVAsR0FDaEJOLE1BRGdCLENBQ1QsR0FEUyxFQUVmQyxJQUZlLENBRVYsT0FGVSxFQUVELFNBRkMsRUFHZkEsSUFIZSxDQUdWLFdBSFUsRUFHRyxlQUFlMEIsT0FBT2hHLEtBQVAsR0FBZSxDQUFmLENBQWYsR0FBbUMsS0FIdEMsQ0FBbEI7O2dCQUtZcUUsTUFBWixDQUFtQixNQUFuQixFQUNFQyxJQURGLENBQ08sT0FEUCxFQUNnQixPQURoQixFQUVFQSxJQUZGLENBRU8sSUFGUCxFQUVhLEdBRmIsRUFHRUEsSUFIRixDQUdPLElBSFAsRUFHYSxTQUhiLEVBSUVDLEtBSkYsQ0FJUSxhQUpSLEVBSXVCLEtBSnZCLEVBS0V6QyxJQUxGLENBS08sT0FBT3FFLE9BQVAsS0FBbUIsVUFBbkIsR0FBZ0NBLFFBQVF0SCxJQUFSLENBQWhDLEdBQWdEc0gsT0FMdkQ7O2dCQU9ZdEIsS0FBWixDQUFrQm1ELE1BQWxCO0tBQ0V6RCxLQURGLENBQ1EsU0FEUixFQUNtQjhDLFNBQVMsTUFBVCxHQUFrQjNKLFNBRHJDLEVBRUVFLElBRkYsQ0FFTytKLE1BRlA7O1FBSUdaLFlBQUgsRUFBaUI7aUJBQ0psQyxLQUFaLENBQWtCbUQsTUFBbEIsRUFBMEJ0RCxTQUExQixDQUFvQyxZQUFwQyxFQUNFSCxLQURGLENBQ1EsYUFEUixFQUN1QixPQUR2QixFQUVFRCxJQUZGLENBRU8sSUFGUCxFQUVjLFFBQVF5QyxZQUFSLEdBQXVCLEdBQXhCLEdBQStCLElBRjVDLEVBR0V6QyxJQUhGLENBR08sSUFIUCxFQUdjLFFBQVF5QyxZQUFULEdBQXlCLElBSHRDLEVBSUV6QyxJQUpGLENBSU8sV0FKUCxFQUlvQixZQUFZeUMsWUFBWixHQUEyQixHQUovQzs7O1FBT0VHLE1BQUgsRUFBVztpQkFDRXJDLEtBQVosQ0FBa0JtRCxNQUFsQixFQUEwQnRELFNBQTFCLENBQW9DLFlBQXBDLEVBQ0VILEtBREYsQ0FDUSxTQURSLEVBQ21CMkMsT0FBT2dCLE9BQVAsSUFBa0IsR0FEckMsRUFFRTNELEtBRkYsQ0FFUSxRQUZSLEVBRWtCMkMsT0FBT2lCLE1BQVAsSUFBaUIsTUFGbkMsRUFHRTVELEtBSEYsQ0FHUSxrQkFIUixFQUc0QjJDLE9BQU9rQixlQUFQLElBQTBCLEtBSHREOzs7R0F2SUg7OztVQWdKUWpILEtBQVQsR0FBaUIsVUFBU2xELENBQVQsRUFBWTtTQUNyQkMsVUFBVUMsTUFBVixJQUFvQmdELFFBQVFsRCxDQUFSLEVBQVdULFFBQS9CLElBQTJDMkQsU0FBUyxFQUEzRDtFQUREOztVQUlTQyxPQUFULEdBQW1CLFVBQVNuRCxDQUFULEVBQVk7U0FDdkJDLFVBQVVDLE1BQVYsSUFBb0JpRCxVQUFVbkQsQ0FBVixFQUFhVCxRQUFqQyxJQUE2QzRELE9BQXBEO0VBREQ7O1VBSVNDLE1BQVQsR0FBa0IsVUFBU3BELENBQVQsRUFBWTtTQUN0QkMsVUFBVUMsTUFBVixJQUFvQmtELFNBQVNwRCxDQUFULEVBQVlULFFBQWhDLElBQTRDNkQsTUFBbkQ7RUFERDs7VUFJU3lFLE1BQVQsR0FBa0IsVUFBUzdILENBQVQsRUFBWTtTQUN0QkMsVUFBVUMsTUFBVixJQUFvQjJILFNBQVM3SCxDQUFULEVBQVlULFFBQWhDLElBQTRDLENBQUNzSSxNQUFwRDtFQUREOztVQUlTQyxJQUFULEdBQWdCLFVBQVM5SCxDQUFULEVBQVk7U0FDcEJDLFVBQVVDLE1BQVYsSUFBb0I0SCxPQUFPOUgsQ0FBUCxFQUFVVCxRQUE5QixJQUEwQ3VJLElBQWpEO0VBREQ7O1VBSVN0RSxHQUFULEdBQWUsVUFBU3hELENBQVQsRUFBWTtTQUNuQkMsVUFBVUMsTUFBVixJQUFvQnNELE1BQU14RCxDQUFOLEVBQVNULFFBQTdCLElBQXlDaUUsR0FBaEQ7RUFERDs7VUFJU0MsQ0FBVCxHQUFhLFVBQVN6RCxDQUFULEVBQVk7U0FDakJDLFVBQVVDLE1BQVYsSUFBb0J1RCxJQUFJekQsQ0FBSixFQUFPVCxRQUEzQixJQUF1Q2tFLENBQTlDO0VBREQ7O1VBSVNDLENBQVQsR0FBYSxVQUFTMUQsQ0FBVCxFQUFZO1NBQ2pCQyxVQUFVQyxNQUFWLElBQW9Cd0QsSUFBSTFELENBQUosRUFBT1QsUUFBM0IsSUFBdUNtRSxDQUE5QztFQUREOztVQUlTQyxFQUFULEdBQWMsVUFBUzNELENBQVQsRUFBWTtTQUNsQkMsVUFBVUMsTUFBVixJQUFvQnlELEtBQUszRCxDQUFMLEVBQVFULFFBQTVCLElBQXdDb0UsRUFBL0M7RUFERDs7VUFJU29FLE1BQVQsR0FBa0IsVUFBUy9ILENBQVQsRUFBWTtTQUN0QkMsVUFBVUMsTUFBVixJQUFvQjZILFNBQVMvSCxDQUFULEVBQVlULFFBQWhDLElBQTRDd0ksTUFBbkQ7RUFERDs7VUFJU0MsTUFBVCxHQUFrQixVQUFTaEksQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9COEgsU0FBU2hJLENBQVQsRUFBWVQsUUFBaEMsSUFBNEN5SSxNQUFuRDtFQUREOztVQUlTbEUsT0FBVCxHQUFtQixVQUFTOUQsQ0FBVCxFQUFZO1NBQ3ZCQyxVQUFVQyxNQUFWLElBQW9CNEQsVUFBVTlELENBQVYsRUFBYVQsUUFBakMsSUFBNkN1RSxPQUFwRDtFQUREOztVQUlTbUUsTUFBVCxHQUFrQixVQUFTakksQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9CK0gsU0FBU2pJLENBQVQsRUFBWVQsUUFBaEMsSUFBNEMwSSxNQUFuRDtFQUREOztVQUlTakUsTUFBVCxHQUFrQixVQUFTaEUsQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9COEQsU0FBU2hFLENBQVQsRUFBWVQsUUFBaEMsSUFBNEN5RSxNQUFuRDtFQUREOztVQUlTa0UsT0FBVCxHQUFtQixVQUFTbEksQ0FBVCxFQUFZO1NBQ3ZCQyxVQUFVQyxNQUFWLElBQW9CZ0ksVUFBVWxJLENBQVYsRUFBYVQsUUFBakMsSUFBNkMySSxPQUFwRDtFQUREOztVQUlTSSxNQUFULEdBQWtCLFVBQVN0SSxDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0JvSSxTQUFTdEksQ0FBVCxFQUFZVCxRQUFoQyxJQUE0QytJLE1BQW5EO0VBREQ7O1VBSVNDLE1BQVQsR0FBa0IsVUFBU3ZJLENBQVQsRUFBWTtTQUN0QkMsVUFBVUMsTUFBVixJQUFvQnFJLFNBQVN2SSxDQUFULEVBQVlULFFBQWhDLElBQTRDZ0osTUFBbkQ7RUFERDs7VUFJU0MsT0FBVCxHQUFtQixVQUFTeEksQ0FBVCxFQUFZO1NBQ3ZCQyxVQUFVQyxNQUFWLElBQW9Cc0ksVUFBVXhJLENBQVYsRUFBYVQsUUFBakMsSUFBNkNpSixPQUFwRDtFQUREOztVQUlTQyxXQUFULEdBQXVCLFVBQVN6SSxDQUFULEVBQVk7U0FDM0JDLFVBQVVDLE1BQVYsSUFBb0J1SSxjQUFjekksQ0FBZCxFQUFpQlQsUUFBckMsSUFBaURrSixXQUF4RDtFQUREOztVQUlTQyxXQUFULEdBQXVCLFVBQVMxSSxDQUFULEVBQVk7U0FDM0JDLFVBQVVDLE1BQVYsSUFBb0J3SSxjQUFjMUksQ0FBZCxFQUFpQlQsUUFBckMsSUFBaURtSixXQUF4RDtFQUREOztVQUlTQyxZQUFULEdBQXdCLFVBQVMzSSxDQUFULEVBQVk7U0FDNUJDLFVBQVVDLE1BQVYsSUFBb0J5SSxlQUFlM0ksQ0FBZixFQUFrQlQsUUFBdEMsSUFBa0RvSixZQUF6RDtFQUREOztVQUlTUixPQUFULEdBQW1CLFVBQVNuSSxDQUFULEVBQVk7U0FDdkJDLFVBQVVDLE1BQVYsSUFBb0JpSSxVQUFVbkksQ0FBVixFQUFhVCxRQUFqQyxJQUE2QzRJLE9BQXBEO0VBREQ7O1VBSVNDLE9BQVQsR0FBbUIsVUFBU3BJLENBQVQsRUFBWTtTQUN2QkMsVUFBVUMsTUFBVixJQUFvQmtJLFVBQVVwSSxDQUFWLEVBQWFULFFBQWpDLElBQTZDNkksT0FBcEQ7RUFERDs7VUFJU0MsUUFBVCxHQUFvQixVQUFTckksQ0FBVCxFQUFZO1NBQ3hCQyxVQUFVQyxNQUFWLElBQW9CbUksV0FBV3JJLENBQVgsRUFBY1QsUUFBbEMsSUFBOEM4SSxRQUFyRDtFQUREOztVQUlTTyxXQUFULEdBQXVCLFVBQVM1SSxDQUFULEVBQVk7U0FDM0JDLFVBQVVDLE1BQVYsSUFBb0IwSSxjQUFjNUksQ0FBZCxFQUFpQlQsUUFBckMsSUFBaURxSixXQUF4RDtFQUREOztVQUlTQyxXQUFULEdBQXVCLFVBQVM3SSxDQUFULEVBQVk7U0FDM0JDLFVBQVVDLE1BQVYsSUFBb0IySSxjQUFjN0ksQ0FBZCxFQUFpQlQsUUFBckMsSUFBaURzSixXQUF4RDtFQUREOztVQUlTQyxZQUFULEdBQXdCLFVBQVM5SSxDQUFULEVBQVk7U0FDNUJDLFVBQVVDLE1BQVYsSUFBb0I0SSxlQUFlOUksQ0FBZixFQUFrQlQsUUFBdEMsSUFBa0R1SixZQUF6RDtFQUREOztVQUlTQyxLQUFULEdBQWlCLFVBQVMvSSxDQUFULEVBQVk7U0FDckJDLFVBQVVDLE1BQVYsSUFBb0I2SSxRQUFRL0ksQ0FBUixFQUFXVCxRQUEvQixJQUEyQ3dKLEtBQWxEO0VBREQ7O1VBSVNDLEtBQVQsR0FBaUIsVUFBU2hKLENBQVQsRUFBWTtTQUNyQkMsVUFBVUMsTUFBVixJQUFvQjhJLFFBQVFoSixDQUFSLEVBQVdULFFBQS9CLElBQTJDeUosS0FBbEQ7RUFERDs7VUFJU0MsTUFBVCxHQUFrQixVQUFTakosQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9CK0ksU0FBU2pKLENBQVQsRUFBWVQsUUFBaEMsSUFBNEMwSixNQUFuRDtFQUREOztVQUlTQyxLQUFULEdBQWlCLFVBQVNsSixDQUFULEVBQVk7U0FDckJDLFVBQVVDLE1BQVYsSUFBb0JnSixRQUFRbEosQ0FBUixFQUFXVCxRQUEvQixJQUEyQzJKLEtBQWxEO0VBREQ7O1VBSVNDLEtBQVQsR0FBaUIsVUFBU25KLENBQVQsRUFBWTtTQUNyQkMsVUFBVUMsTUFBVixJQUFvQmlKLFFBQVFuSixDQUFSLEVBQVdULFFBQS9CLElBQTJDNEosS0FBbEQ7RUFERDs7VUFJU0MsTUFBVCxHQUFrQixVQUFTcEosQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9Ca0osU0FBU3BKLENBQVQsRUFBWVQsUUFBaEMsSUFBNEM2SixNQUFuRDtFQUREOztVQUlTbkYsVUFBVCxHQUFzQixVQUFTakUsQ0FBVCxFQUFZO1NBQzFCQyxVQUFVQyxNQUFWLElBQW9CK0QsZ0JBQWFqRSxDQUFiLEVBQWdCVCxRQUFwQyxJQUFnRDBFLGFBQXZEO0VBREQ7O1VBSVNDLGVBQVQsR0FBMkIsVUFBU2xFLENBQVQsRUFBWTtTQUMvQkMsVUFBVUMsTUFBVixJQUFvQmdFLGtCQUFrQmxFLENBQWxCLEVBQXFCVCxRQUF6QyxJQUFxRDJFLGVBQTVEO0VBREQ7O1VBSVNDLGNBQVQsR0FBMEIsVUFBU25FLENBQVQsRUFBWTtTQUM5QkMsVUFBVUMsTUFBVixJQUFvQmlFLGlCQUFpQm5FLENBQWpCLEVBQW9CVCxRQUF4QyxJQUFvRDRFLGNBQTNEO0VBREQ7O1VBSVMvRSxRQUFULEdBQW9CLFVBQVNZLENBQVQsRUFBWTtTQUN4QkMsVUFBVUMsTUFBVixJQUFvQmQsV0FBV1ksQ0FBWCxFQUFjVCxRQUFsQyxJQUE4Q0gsUUFBckQ7RUFERDs7VUFJU2dGLGFBQVQsR0FBeUIsVUFBU3BFLENBQVQsRUFBWTtTQUM3QkMsVUFBVUMsTUFBVixJQUFvQmtFLGdCQUFnQnBFLENBQWhCLEVBQW1CVCxRQUF2QyxJQUFtRDZFLGFBQTFEO0VBREQ7O1VBSVNDLFlBQVQsR0FBd0IsVUFBU3JFLENBQVQsRUFBWTtTQUM1QkMsVUFBVUMsTUFBVixJQUFvQm1FLGVBQWVyRSxDQUFmLEVBQWtCVCxRQUF0QyxJQUFrRDhFLFlBQXpEO0VBREQ7O1FBSU85RSxRQUFQOzs7QUM5VWMsU0FBUytLLFVBQVQsR0FBc0I7O0tBRWhDcEgsS0FBSixFQUNDQyxPQURELEVBRUNFLEtBRkQsRUFFUUMsTUFGUixFQUdDaUgsSUFIRCxFQUlDTixPQUpELEVBTUNoRyxhQU5ELEVBT0M3RSxRQVBEOztVQVNTRyxRQUFULENBQWtCQyxTQUFsQixFQUE2Qjs7O1lBR2xCMkQsV0FBVyxZQUFyQjs7a0JBRWFjLGlCQUFjLFVBQVNyRSxDQUFULEVBQVk7VUFBU0EsRUFBRWlGLFFBQUYsQ0FBVyxDQUFYLENBQVA7R0FBekM7YUFDV3pGLFlBQVksWUFBVztVQUFTSyxTQUFQO0dBQXBDOztZQUVVQyxJQUFWLENBQWUsWUFBVzs7T0FFckI4SyxrQkFBa0IzSyxTQUFBLENBQVUsSUFBVixFQUNwQjRHLFNBRG9CLENBQ1YsTUFBTXRELFFBQVFzSCxPQUFSLENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLENBREksRUFDdUI3SixJQUR2QixDQUM0QixDQUFDLENBQUQsQ0FENUIsRUFDaUM4RixLQURqQyxFQUF0Qjs7bUJBR2dCTixNQUFoQixDQUF1QixNQUF2QixFQUNFQyxJQURGLENBQ08sT0FEUCxFQUNnQmxELFVBQVUsUUFEMUIsRUFFRWtELElBRkYsQ0FFTyxHQUZQLEVBRVloRCxRQUFNLENBRmxCLEVBR0VnRCxJQUhGLENBR08sR0FIUCxFQUdZL0MsU0FBTyxDQUhuQixFQUlFK0MsSUFKRixDQUlPLE9BSlAsRUFJZ0IsQ0FKaEIsRUFLRUEsSUFMRixDQUtPLFFBTFAsRUFLaUIsQ0FMakIsRUFNRUEsSUFORixDQU1PLE1BTlAsRUFNZWtFLElBTmYsRUFPRWpFLEtBUEYsQ0FPUSxTQVBSLEVBT21CMkQsT0FQbkIsRUFRRWhHLFVBUkYsR0FRZXRFLElBUmYsQ0FRb0JzRSxhQVJwQixFQVNHb0MsSUFUSCxDQVNRLEdBVFIsRUFTYSxDQVRiLEVBVUdBLElBVkgsQ0FVUSxHQVZSLEVBVWEsQ0FWYixFQVdHQSxJQVhILENBV1EsT0FYUixFQVdpQmhELEtBWGpCLEVBWUdnRCxJQVpILENBWVEsUUFaUixFQVlrQi9DLE1BWmxCLEVBYUdxRCxFQWJILENBYU0sS0FiTixFQWFhLFlBQVc7YUFBRSxDQUFVLElBQVYsRUFBZ0JoSCxJQUFoQixDQUFxQlAsUUFBckI7SUFiMUI7R0FMRDs7O1VBc0JROEQsS0FBVCxHQUFpQixVQUFTbEQsQ0FBVCxFQUFZO1NBQ3JCQyxVQUFVQyxNQUFWLElBQW9CZ0QsUUFBUWxELENBQVIsRUFBV1QsUUFBL0IsSUFBMkMyRCxTQUFTLEVBQTNEO0VBREQ7O1VBSVNDLE9BQVQsR0FBbUIsVUFBU25ELENBQVQsRUFBWTtTQUN2QkMsVUFBVUMsTUFBVixJQUFvQmlELFVBQVVuRCxDQUFWLEVBQWFULFFBQWpDLElBQTZDNEQsT0FBcEQ7RUFERDs7VUFJU0UsS0FBVCxHQUFpQixVQUFTckQsQ0FBVCxFQUFZO1NBQ3JCQyxVQUFVQyxNQUFWLElBQW9CbUQsUUFBUXJELENBQVIsRUFBV1QsUUFBL0IsSUFBMkM4RCxLQUFsRDtFQUREOztVQUlTQyxNQUFULEdBQWtCLFVBQVN0RCxDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0JvRCxTQUFTdEQsQ0FBVCxFQUFZVCxRQUFoQyxJQUE0QytELE1BQW5EO0VBREQ7O1VBSVNpSCxJQUFULEdBQWdCLFVBQVN2SyxDQUFULEVBQVk7U0FDcEJDLFVBQVVDLE1BQVYsSUFBb0JxSyxPQUFPdkssQ0FBUCxFQUFVVCxRQUE5QixJQUEwQ2dMLElBQWpEO0VBREQ7O1VBSVNOLE9BQVQsR0FBbUIsVUFBU2pLLENBQVQsRUFBWTtTQUN2QkMsVUFBVUMsTUFBVixJQUFvQitKLFVBQVVqSyxDQUFWLEVBQWFULFFBQWpDLElBQTZDMEssT0FBcEQ7RUFERDs7VUFJU2hHLFVBQVQsR0FBc0IsVUFBU2pFLENBQVQsRUFBWTtTQUMxQkMsVUFBVUMsTUFBVixJQUFvQitELGdCQUFhakUsQ0FBYixFQUFnQlQsUUFBcEMsSUFBZ0QwRSxhQUF2RDtFQUREOztVQUlTN0UsUUFBVCxHQUFvQixVQUFTWSxDQUFULEVBQVk7U0FDeEJDLFVBQVVDLE1BQVYsSUFBb0JkLFdBQVdZLENBQVgsRUFBY1QsUUFBbEMsSUFBOENILFFBQXJEO0VBREQ7O1FBSU9HLFFBQVA7OztBQ3pFYyxTQUFTbUwsR0FBVCxHQUFlOztLQUV6QnhILEtBQUosRUFDQ0MsT0FERCxFQUVDQyxNQUZELEVBR0NJLEdBSEQsRUFHTUMsQ0FITixFQUdTQyxDQUhULEVBR1lFLEtBSFosRUFJQ21FLE1BSkQsRUFJU0MsTUFKVCxFQUlpQmpFLFVBSmpCLEVBS0NFLGFBTEQsRUFLYUMsZUFMYixFQUs4QkMsY0FMOUIsRUFNQy9FLFFBTkQsRUFNV2dGLGFBTlgsRUFNMEJDLFlBTjFCLEVBT0NDLGlCQVBELEVBT29CQyxrQkFQcEIsRUFRQ0Msa0JBUkQsRUFRcUJDLGdCQVJyQjs7VUFVU2xGLFFBQVQsQ0FBa0JDLFNBQWxCLEVBQTZCOzs7a0JBR2Z5RSxpQkFBYyxVQUFTckUsQ0FBVCxFQUFZO1VBQVNBLEVBQUVpRixRQUFGLENBQVcsQ0FBWCxDQUFQO0dBQXpDO29CQUNrQlgsbUJBQW1CLFVBQVN0RSxDQUFULEVBQVk7VUFBU0EsRUFBRWlGLFFBQUYsQ0FBVyxDQUFYLENBQVA7R0FBbkQ7bUJBQ2lCVixrQkFBa0IsVUFBU3ZFLENBQVQsRUFBWTtVQUFTQSxFQUFFaUYsUUFBRixDQUFXLENBQVgsQ0FBUDtHQUFqRDs7YUFFV3pGLFlBQVksWUFBVztVQUFTSyxTQUFQO0dBQXBDO2tCQUNnQjJFLGlCQUFpQixZQUFXO1VBQVMzRSxTQUFQO0dBQTlDO2lCQUNlNEUsZ0JBQWdCLFlBQVc7VUFBUzVFLFNBQVA7R0FBNUM7O3NCQUVvQjZFLHFCQUFxQixZQUFXO1VBQVM3RSxTQUFQO0dBQXREO3VCQUNxQjhFLHNCQUFzQixZQUFXO1VBQVM5RSxTQUFQO0dBQXhEOzt1QkFFcUIrRSxzQkFBc0IsWUFBVztVQUFTL0UsU0FBUDtHQUF4RDtxQkFDbUJnRixvQkFBb0IsWUFBVztVQUFTaEYsU0FBUDtHQUFwRDs7WUFFVTBELFdBQVcsS0FBckI7O1lBRVV6RCxJQUFWLENBQWUsVUFBU2tCLElBQVQsRUFBZTs7O09BR3pCOEosTUFBTTdLLFNBQUEsQ0FBVSxJQUFWLEVBQWdCNEcsU0FBaEIsQ0FBMEIsTUFBTXRELFFBQVFzSCxPQUFSLENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLENBQWhDLEVBQTJEN0osSUFBM0QsQ0FBZ0VBLElBQWhFLEVBQXNFLFVBQVNQLENBQVQsRUFBWTtXQUFTbUQsSUFBSW5ELENBQUosQ0FBUDtJQUFwRixFQUNSZ0csSUFEUSxDQUNILE9BREcsRUFDTWxELFVBQVUsU0FEaEIsQ0FBVjs7O09BSUl1RCxLQUFKLEdBQ0VOLE1BREYsQ0FDUyxNQURULEVBRUdDLElBRkgsQ0FFUSxPQUZSLEVBRWlCbEQsVUFBVSxRQUYzQixFQUdHa0QsSUFISCxDQUdRLEdBSFIsRUFHYSxVQUFTaEcsQ0FBVCxFQUFZO1dBQVMwSCxPQUFPdEUsRUFBRXBELENBQUYsQ0FBUCxDQUFQO0lBSDNCLEVBSUdnRyxJQUpILENBSVEsR0FKUixFQUlhLFlBQVc7V0FBUzJCLE9BQU8sQ0FBUCxDQUFQO0lBSjFCLEVBS0czQixJQUxILENBS1EsT0FMUixFQUtpQixZQUFXO1dBQVMwQixPQUFPNEMsU0FBUCxFQUFQO0lBTDlCLEVBTUd0RSxJQU5ILENBTVEsUUFOUixFQU1rQixDQU5sQixFQU9HTSxFQVBILENBT00sV0FQTixFQU9tQnJDLGlCQVBuQixFQVFHcUMsRUFSSCxDQVFNLFlBUk4sRUFRb0JwQyxrQkFScEIsRUFTR29DLEVBVEgsQ0FTTSxZQVROLEVBU29CbkMsa0JBVHBCLEVBVUdtQyxFQVZILENBVU0sVUFWTixFQVVrQmxDLGdCQVZsQixFQVdHOUUsSUFYSCxDQVdReUUsYUFYUixFQVlHd0MsS0FaSCxDQVlTOEQsR0FaVDtJQWFJckUsSUFiSixDQWFTLEdBYlQsRUFhYyxVQUFTaEcsQ0FBVCxFQUFZO1dBQVMwSCxPQUFPdEUsRUFBRXBELENBQUYsQ0FBUCxDQUFQO0lBYjVCLEVBY0lnRyxJQWRKLENBY1MsT0FkVCxFQWNrQixZQUFXO1dBQVMwQixPQUFPNEMsU0FBUCxFQUFQO0lBZC9CLEVBZUkxRyxVQWZKLEdBZWlCdEUsSUFmakIsQ0Flc0JzRSxhQWZ0QixFQWdCS3FDLEtBaEJMLENBZ0JXLE1BaEJYLEVBZ0JtQixVQUFTakcsQ0FBVCxFQUFZO1dBQVMwRCxXQUFXSCxNQUFNdkQsQ0FBTixDQUFYLENBQVA7SUFoQmpDLEVBaUJLZ0csSUFqQkwsQ0FpQlUsR0FqQlYsRUFpQmUsVUFBU2hHLENBQVQsRUFBWTtXQUFTcUQsRUFBRXJELENBQUYsSUFBTyxDQUFQLEdBQVcySCxPQUFPdEUsRUFBRXJELENBQUYsQ0FBUCxDQUFYLEdBQTBCMkgsT0FBTyxDQUFQLENBQWpDO0lBakI3QixFQWtCSzNCLElBbEJMLENBa0JVLFFBbEJWLEVBa0JvQixVQUFTaEcsQ0FBVCxFQUFZO1dBQVM2QixLQUFLMEksR0FBTCxDQUFTNUMsT0FBTyxDQUFQLElBQVlBLE9BQU90RSxFQUFFckQsQ0FBRixDQUFQLENBQXJCLENBQVA7SUFsQmxDLEVBbUJLc0csRUFuQkwsQ0FtQlEsS0FuQlIsRUFtQmUsWUFBVzthQUFFLENBQVUsSUFBVixFQUFnQmhILElBQWhCLENBQXFCUCxRQUFyQjtJQW5CNUI7OztPQXNCSWdJLElBQUosR0FDRWYsSUFERixDQUNPLE9BRFAsRUFDZ0JsRCxVQUFVLE9BRDFCLEVBRUVjLFVBRkYsR0FFZXRFLElBRmYsQ0FFb0J3RSxjQUZwQixFQUdHa0MsSUFISCxDQUdRLE9BSFIsRUFHaUIsQ0FIakIsRUFJR00sRUFKSCxDQUlNLEtBSk4sRUFJYSxZQUFXO2FBQUUsQ0FBVSxJQUFWLEVBQWdCaEgsSUFBaEIsQ0FBcUIwRSxZQUFyQjtJQUoxQixFQUtHZ0QsTUFMSDtHQTdCRDs7O1VBc0NRbkUsS0FBVCxHQUFpQixVQUFTbEQsQ0FBVCxFQUFZO1NBQ3JCQyxVQUFVQyxNQUFWLElBQW9CZ0QsUUFBUWxELENBQVIsRUFBV1QsUUFBL0IsSUFBMkMyRCxTQUFTLEVBQTNEO0VBREQ7O1VBSVNDLE9BQVQsR0FBbUIsVUFBU25ELENBQVQsRUFBWTtTQUN2QkMsVUFBVUMsTUFBVixJQUFvQmlELFVBQVVuRCxDQUFWLEVBQWFULFFBQWpDLElBQTZDNEQsT0FBcEQ7RUFERDs7VUFJU0MsTUFBVCxHQUFrQixVQUFTcEQsQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9Ca0QsU0FBU3BELENBQVQsRUFBWVQsUUFBaEMsSUFBNEM2RCxNQUFuRDtFQUREOztVQUlTSSxHQUFULEdBQWUsVUFBU3hELENBQVQsRUFBWTtTQUNuQkMsVUFBVUMsTUFBVixJQUFvQnNELE1BQU14RCxDQUFOLEVBQVNULFFBQTdCLElBQXlDaUUsR0FBaEQ7RUFERDs7VUFJU0MsQ0FBVCxHQUFhLFVBQVN6RCxDQUFULEVBQVk7U0FDakJDLFVBQVVDLE1BQVYsSUFBb0J1RCxJQUFJekQsQ0FBSixFQUFPVCxRQUEzQixJQUF1Q2tFLENBQTlDO0VBREQ7O1VBSVNDLENBQVQsR0FBYSxVQUFTMUQsQ0FBVCxFQUFZO1NBQ2pCQyxVQUFVQyxNQUFWLElBQW9Cd0QsSUFBSTFELENBQUosRUFBT1QsUUFBM0IsSUFBdUNtRSxDQUE5QztFQUREOztVQUlTRSxLQUFULEdBQWlCLFVBQVM1RCxDQUFULEVBQVk7U0FDckJDLFVBQVVDLE1BQVYsSUFBb0IwRCxRQUFRNUQsQ0FBUixFQUFXVCxRQUEvQixJQUEyQ3FFLEtBQWxEO0VBREQ7O1VBSVNtRSxNQUFULEdBQWtCLFVBQVMvSCxDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0I2SCxTQUFTL0gsQ0FBVCxFQUFZVCxRQUFoQyxJQUE0Q3dJLE1BQW5EO0VBREQ7O1VBSVNDLE1BQVQsR0FBa0IsVUFBU2hJLENBQVQsRUFBWTtTQUN0QkMsVUFBVUMsTUFBVixJQUFvQjhILFNBQVNoSSxDQUFULEVBQVlULFFBQWhDLElBQTRDeUksTUFBbkQ7RUFERDs7VUFJU2pFLFVBQVQsR0FBc0IsVUFBUy9ELENBQVQsRUFBWTtTQUMxQkMsVUFBVUMsTUFBVixJQUFvQjZELGFBQWEvRCxDQUFiLEVBQWdCVCxRQUFwQyxJQUFnRHdFLFVBQXZEO0VBREQ7O1VBSVNFLFVBQVQsR0FBc0IsVUFBU2pFLENBQVQsRUFBWTtTQUMxQkMsVUFBVUMsTUFBVixJQUFvQitELGdCQUFhakUsQ0FBYixFQUFnQlQsUUFBcEMsSUFBZ0QwRSxhQUF2RDtFQUREOztVQUlTQyxlQUFULEdBQTJCLFVBQVNsRSxDQUFULEVBQVk7U0FDL0JDLFVBQVVDLE1BQVYsSUFBb0JnRSxrQkFBa0JsRSxDQUFsQixFQUFxQlQsUUFBekMsSUFBcUQyRSxlQUE1RDtFQUREOztVQUlTQyxjQUFULEdBQTBCLFVBQVNuRSxDQUFULEVBQVk7U0FDOUJDLFVBQVVDLE1BQVYsSUFBb0JpRSxpQkFBaUJuRSxDQUFqQixFQUFvQlQsUUFBeEMsSUFBb0Q0RSxjQUEzRDtFQUREOztVQUlTL0UsUUFBVCxHQUFvQixVQUFTWSxDQUFULEVBQVk7U0FDeEJDLFVBQVVDLE1BQVYsSUFBb0JkLFdBQVdZLENBQVgsRUFBY1QsUUFBbEMsSUFBOENILFFBQXJEO0VBREQ7O1VBSVNnRixhQUFULEdBQXlCLFVBQVNwRSxDQUFULEVBQVk7U0FDN0JDLFVBQVVDLE1BQVYsSUFBb0JrRSxnQkFBZ0JwRSxDQUFoQixFQUFtQlQsUUFBdkMsSUFBbUQ2RSxhQUExRDtFQUREOztVQUlTQyxZQUFULEdBQXdCLFVBQVNyRSxDQUFULEVBQVk7U0FDNUJDLFVBQVVDLE1BQVYsSUFBb0JtRSxlQUFlckUsQ0FBZixFQUFrQlQsUUFBdEMsSUFBa0Q4RSxZQUF6RDtFQUREOztVQUlTQyxpQkFBVCxHQUE2QixVQUFTdEUsQ0FBVCxFQUFZO1NBQ2pDQyxVQUFVQyxNQUFWLElBQW9Cb0Usb0JBQW9CdEUsQ0FBcEIsRUFBdUJULFFBQTNDLElBQXVEK0UsaUJBQTlEO0VBREQ7O1VBSVNDLGtCQUFULEdBQThCLFVBQVN2RSxDQUFULEVBQVk7U0FDbENDLFVBQVVDLE1BQVYsSUFBb0JxRSxxQkFBcUJ2RSxDQUFyQixFQUF3QlQsUUFBNUMsSUFBd0RnRixrQkFBL0Q7RUFERDs7VUFJU0Msa0JBQVQsR0FBOEIsVUFBU3hFLENBQVQsRUFBWTtTQUNsQ0MsVUFBVUMsTUFBVixJQUFvQnNFLHFCQUFxQnhFLENBQXJCLEVBQXdCVCxRQUE1QyxJQUF3RGlGLGtCQUEvRDtFQUREOztVQUlTQyxnQkFBVCxHQUE0QixVQUFTekUsQ0FBVCxFQUFZO1NBQ2hDQyxVQUFVQyxNQUFWLElBQW9CdUUsbUJBQW1CekUsQ0FBbkIsRUFBc0JULFFBQTFDLElBQXNEa0YsZ0JBQTdEO0VBREQ7O1FBSU9sRixRQUFQOzs7QUNySmMsU0FBU3NMLE1BQVQsR0FBa0I7O0tBRTVCM0gsS0FBSixFQUNDQyxPQURELEVBRUNFLEtBRkQsRUFFUUMsTUFGUixFQUdDQyxNQUhELEVBSUNFLENBSkQsRUFJSUMsQ0FKSixFQUlPRSxLQUpQLEVBS0NHLFVBTEQsRUFNQ0MsTUFORCxFQU9DcUIsSUFQRCxFQVFDNkUsTUFSRCxFQVNDakcsYUFURCxFQVNhQyxlQVRiLEVBUzhCQyxjQVQ5QixFQVVDL0UsUUFWRCxFQVVXZ0YsYUFWWCxFQVUwQkMsWUFWMUIsRUFXQ0MsaUJBWEQsRUFXb0JDLGtCQVhwQixFQVlDQyxrQkFaRCxFQVlxQkMsZ0JBWnJCLEVBY0NxRyxLQWRELEVBZUNDLE9BZkQ7O1VBaUJTeEwsUUFBVCxDQUFrQkMsU0FBbEIsRUFBNkI7OztrQkFHZnlFLGlCQUFjLFVBQVNyRSxDQUFULEVBQVk7VUFBU0EsRUFBRWlGLFFBQUYsQ0FBVyxDQUFYLENBQVA7R0FBekM7b0JBQ2tCWCxtQkFBbUIsVUFBU3RFLENBQVQsRUFBWTtVQUFTQSxFQUFFaUYsUUFBRixDQUFXLENBQVgsQ0FBUDtHQUFuRDttQkFDaUJWLGtCQUFrQixVQUFTdkUsQ0FBVCxFQUFZO1VBQVNBLEVBQUVpRixRQUFGLENBQVcsQ0FBWCxDQUFQO0dBQWpEOzthQUVXekYsWUFBWSxZQUFXO1VBQVNLLFNBQVA7R0FBcEM7a0JBQ2dCMkUsaUJBQWlCLFlBQVc7VUFBUzNFLFNBQVA7R0FBOUM7aUJBQ2U0RSxnQkFBZ0IsWUFBVztVQUFTNUUsU0FBUDtHQUE1Qzs7c0JBRW9CNkUscUJBQXFCLFlBQVc7VUFBUzdFLFNBQVA7R0FBdEQ7dUJBQ3FCOEUsc0JBQXNCLFlBQVc7VUFBUzlFLFNBQVA7R0FBeEQ7O3VCQUVxQitFLHNCQUFzQixZQUFXO1VBQVMvRSxTQUFQO0dBQXhEO3FCQUNtQmdGLG9CQUFvQixZQUFXO1VBQVNoRixTQUFQO0dBQXBEOztZQUVVMEQsV0FBVyxRQUFyQjs7V0FFUytHLFVBQVUsRUFBbkI7O1VBRVFZLFNBQVMsRUFBRUUsU0FBUyxHQUFYLEVBQWpCO1lBQ1VELFdBQVcsRUFBckI7O01BRUlqRyxJQUFJdkYsU0FBU3dGLFlBQVQsRUFBUjtNQUNDQyxJQUFJekYsU0FBUzBGLGFBQVQsRUFETDtNQUVDZ0csV0FBVy9JLEtBQUtpRCxHQUFMLENBQVNMLENBQVQsRUFBWUUsQ0FBWixDQUZaOztNQUlJNkYsU0FBU2hMLE9BQUEsR0FDWHFMLElBRFcsQ0FDTixDQUFDRCxRQUFELEVBQVdBLFFBQVgsQ0FETSxFQUVYRCxPQUZXLENBRUhGLE1BQU1FLE9BQU4sSUFBaUIsR0FGZCxDQUFiOztZQUlVdEwsSUFBVixDQUFlLFVBQVNrQixJQUFULEVBQWU7O09BRTFCLENBQUNBLEtBQUt1SyxJQUFULEVBQWU7V0FDUCxFQUFFQSxNQUFNLE1BQVIsRUFBZ0JDLFVBQVV4SyxJQUExQixFQUFQOzs7T0FHR3lLLE9BQU94TCxZQUFBLENBQWF5TCxRQUFRMUssSUFBUixDQUFiLEVBQ1QySyxHQURTLENBQ0wsVUFBU2xMLENBQVQsRUFBWTtXQUFTQSxFQUFFaUYsS0FBVDtJQURULEVBRVRELElBRlMsQ0FFSixVQUFTbUcsQ0FBVCxFQUFZQyxDQUFaLEVBQWU7V0FBU3BHLE9BQU9BLEtBQUttRyxFQUFFbEcsS0FBUCxFQUFjbUcsRUFBRW5HLEtBQWhCLENBQVAsR0FBZ0MsSUFBdkM7SUFGYixDQUFYOztVQUlPK0YsSUFBUDs7T0FFSXJGLE9BQU9uRyxTQUFBLENBQVUsSUFBVixDQUFYOzs7T0FHSW9HLElBQUlELEtBQUtFLE1BQUwsQ0FBWSxHQUFaLENBQVI7T0FDR0QsRUFBRUUsS0FBRixFQUFILEVBQWM7UUFDVEgsS0FBS0ksTUFBTCxDQUFZLEdBQVosRUFDRkMsSUFERSxDQUNHLFdBREgsRUFDZ0IsZ0JBQWdCdkIsSUFBRSxDQUFGLEdBQU1tRyxXQUFTLENBQS9CLElBQW9DLElBQXBDLElBQTRDakcsSUFBRSxDQUFGLEdBQU1pRyxXQUFTLENBQTNELElBQWdFLEdBRGhGLENBQUo7Ozs7T0FLRWhGLEVBQUVDLE1BQUYsQ0FBUyxRQUFULEVBQW1CQyxLQUFuQixFQUFILEVBQStCO01BQzVCQyxNQUFGLENBQVMsTUFBVCxFQUNFQyxJQURGLENBQ08sT0FEUCxFQUNnQixPQURoQixFQUVFQSxJQUZGLENBRU8sV0FGUCxFQUVvQixlQUFlNEUsUUFBZixHQUEwQixHQUExQixHQUFnQ2pHLENBQWhDLEdBQW9DLEdBRnhELEVBR0VzQixLQUhGLENBR1EsYUFIUixFQUd1QixLQUh2QixFQUlFekMsSUFKRixDQUlPLFlBQVc7WUFDVCxPQUFPRyxNQUFQLEtBQWtCLFVBQWxCLEdBQStCQSxPQUFPcEQsS0FBS3dLLFFBQVosQ0FBL0IsR0FBdURwSCxNQUE5RDtLQUxGOzs7O09BVUcwSCxVQUFVekYsRUFBRVEsU0FBRixDQUFZLE1BQU10RCxRQUFRc0gsT0FBUixDQUFnQixHQUFoQixFQUFxQixHQUFyQixDQUFsQixFQUNaN0osSUFEWSxDQUNQeUssS0FBS0QsUUFERSxFQUNRLFVBQVMvSyxDQUFULEVBQVk7V0FBU0EsRUFBRU8sSUFBRixDQUFPK0ssV0FBUCxHQUFxQixHQUFyQixHQUEyQnRMLEVBQUVPLElBQUYsQ0FBT2dMLFNBQXpDO0lBRHRCLEVBRVh2RixJQUZXLENBRU4sT0FGTSxFQUVHbEQsVUFBVSxTQUZiLENBQWQ7OztXQUtRdUQsS0FBUixHQUNFTixNQURGLENBQ1MsUUFEVCxFQUVHQyxJQUZILENBRVEsT0FGUixFQUVpQmxELFVBQVUsUUFGM0IsRUFHR2tELElBSEgsQ0FHUSxXQUhSLEVBR3FCLFVBQVNoRyxDQUFULEVBQVk7V0FBUyxlQUFlQSxFQUFFb0QsQ0FBakIsR0FBcUIsR0FBckIsR0FBMkJwRCxFQUFFcUQsQ0FBN0IsR0FBaUMsR0FBeEM7SUFIbkMsRUFJRzJDLElBSkgsQ0FJUSxHQUpSLEVBSWEsWUFBVztXQUFTLENBQVA7SUFKMUIsRUFLR0MsS0FMSCxDQUtTLE1BTFQsRUFLaUIsVUFBU2pHLENBQVQsRUFBWTtXQUFTMEssUUFBUWMsTUFBUixHQUFpQixhQUFqQixHQUFpQzlILFdBQVdILE1BQU12RCxFQUFFTyxJQUFGLENBQU9BLElBQWIsQ0FBWCxDQUF4QztJQUwvQixFQU1HMEYsS0FOSCxDQU1TLFFBTlQsRUFNbUIsVUFBU2pHLENBQVQsRUFBWTtXQUFTMEQsV0FBV0gsTUFBTXZELEVBQUVPLElBQUYsQ0FBT0EsSUFBYixDQUFYLENBQVA7SUFOakMsRUFPRzBGLEtBUEgsQ0FPUyxjQVBULEVBT3lCNEQsT0FBTzdHLEtBUGhDLEVBUUdpRCxLQVJILENBUVMsa0JBUlQsRUFRNkI0RCxPQUFPNEIsU0FScEMsRUFTR25GLEVBVEgsQ0FTTSxXQVROLEVBU21CckMsaUJBVG5CLEVBVUdxQyxFQVZILENBVU0sWUFWTixFQVVvQnBDLGtCQVZwQixFQVdHb0MsRUFYSCxDQVdNLFlBWE4sRUFXb0JuQyxrQkFYcEIsRUFZR21DLEVBWkgsQ0FZTSxVQVpOLEVBWWtCbEMsZ0JBWmxCLEVBYUc5RSxJQWJILENBYVF5RSxhQWJSLEVBY0d3QyxLQWRILENBY1M4RSxPQWRUO0lBZUl6SCxVQWZKLEdBZWlCdEUsSUFmakIsQ0Flc0JzRSxhQWZ0QixFQWdCS29DLElBaEJMLENBZ0JVLFdBaEJWLEVBZ0J1QixVQUFTaEcsQ0FBVCxFQUFZO1dBQVMsZUFBZUEsRUFBRW9ELENBQWpCLEdBQXFCLEdBQXJCLEdBQTJCcEQsRUFBRXFELENBQTdCLEdBQWlDLEdBQXhDO0lBaEJyQyxFQWlCSzJDLElBakJMLENBaUJVLEdBakJWLEVBaUJlLFVBQVNoRyxDQUFULEVBQVk7V0FBU0EsRUFBRTBMLENBQVQ7SUFqQjdCLEVBa0JLekYsS0FsQkwsQ0FrQlcsTUFsQlgsRUFrQm1CLFVBQVNqRyxDQUFULEVBQVk7V0FBUzBLLFFBQVFjLE1BQVIsR0FBaUIsYUFBakIsR0FBaUM5SCxXQUFXSCxNQUFNdkQsRUFBRU8sSUFBRixDQUFPQSxJQUFiLENBQVgsQ0FBeEM7SUFsQmpDLEVBbUJLMEYsS0FuQkwsQ0FtQlcsUUFuQlgsRUFtQnFCLFVBQVNqRyxDQUFULEVBQVk7V0FBUzBELFdBQVdILE1BQU12RCxFQUFFTyxJQUFGLENBQU9BLElBQWIsQ0FBWCxDQUFQO0lBbkJuQyxFQW9CSzBGLEtBcEJMLENBb0JXLGNBcEJYLEVBb0IyQjRELE9BQU83RyxLQXBCbEMsRUFxQktpRCxLQXJCTCxDQXFCVyxrQkFyQlgsRUFxQitCNEQsT0FBTzRCLFNBckJ0QyxFQXNCS25GLEVBdEJMLENBc0JRLEtBdEJSLEVBc0JlLFlBQVc7YUFBRSxDQUFVLElBQVYsRUFBZ0JoSCxJQUFoQixDQUFxQlAsUUFBckI7SUF0QjVCOzs7V0F5QlFnSSxJQUFSLEdBQ0VmLElBREYsQ0FDTyxPQURQLEVBQ2dCbEQsVUFBVSxPQUQxQixFQUVFYyxVQUZGLEdBRWV0RSxJQUZmLENBRW9Cd0UsY0FGcEIsRUFHR2tDLElBSEgsQ0FHUSxHQUhSLEVBR2EsQ0FIYixFQUlHTSxFQUpILENBSU0sS0FKTixFQUlhLFlBQVc7YUFBRSxDQUFVLElBQVYsRUFBZ0JoSCxJQUFoQixDQUFxQjBFLFlBQXJCO0lBSjFCLEVBS0dnRCxNQUxIOzs7WUFRU2lFLE9BQVQsQ0FBaUJELElBQWpCLEVBQXVCO1FBQ2xCQyxVQUFVLEVBQWQ7O2FBRVNVLE9BQVQsQ0FBaUJiLElBQWpCLEVBQXVCbkYsSUFBdkIsRUFBNkI7U0FDekJBLEtBQUtvRixRQUFSLEVBQWtCO1dBQ1pBLFFBQUwsQ0FBY2EsT0FBZCxDQUFzQixVQUFTQyxLQUFULEVBQWdCO2VBQzdCbEcsS0FBS21GLElBQWIsRUFBbUJlLEtBQW5CO09BREQ7TUFERCxNQUlPWixRQUFRL0ksSUFBUixDQUFhLEVBQUVvSixhQUFhUixJQUFmLEVBQXFCUyxXQUFXbkksRUFBRXVDLElBQUYsQ0FBaEMsRUFBeUNWLE9BQU81QixFQUFFc0MsSUFBRixDQUFoRCxFQUF5RHBGLE1BQU1vRixJQUEvRCxFQUFiOzs7WUFHQSxJQUFSLEVBQWNxRixJQUFkO1dBQ08sRUFBRUQsVUFBVUUsT0FBWixFQUFQOztHQW5GRjs7O1VBd0ZRcEksS0FBVCxHQUFpQixVQUFTbEQsQ0FBVCxFQUFZO1NBQ3JCQyxVQUFVQyxNQUFWLElBQW9CZ0QsUUFBUWxELENBQVIsRUFBV1QsUUFBL0IsSUFBMkMyRCxTQUFTLEVBQTNEO0VBREQ7O1VBSVNDLE9BQVQsR0FBbUIsVUFBU25ELENBQVQsRUFBWTtTQUN2QkMsVUFBVUMsTUFBVixJQUFvQmlELFVBQVVuRCxDQUFWLEVBQWFULFFBQWpDLElBQTZDNEQsT0FBcEQ7RUFERDs7VUFJU0UsS0FBVCxHQUFpQixVQUFTckQsQ0FBVCxFQUFZO1NBQ3JCQyxVQUFVQyxNQUFWLElBQW9CbUQsUUFBUXJELENBQVIsRUFBV1QsUUFBL0IsSUFBMkM4RCxLQUFsRDtFQUREOztVQUlTQyxNQUFULEdBQWtCLFVBQVN0RCxDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0JvRCxTQUFTdEQsQ0FBVCxFQUFZVCxRQUFoQyxJQUE0QytELE1BQW5EO0VBREQ7O1VBSVNDLE1BQVQsR0FBa0IsVUFBU3ZELENBQVQsRUFBWTtTQUN0QkMsVUFBVUMsTUFBVixJQUFvQnFELFNBQVN2RCxDQUFULEVBQVlULFFBQWhDLElBQTRDZ0UsTUFBbkQ7RUFERDs7VUFJU3dCLFlBQVQsR0FBd0IsWUFBVztTQUMzQjFCLFFBQVFFLE9BQU9pRSxLQUFmLEdBQXVCakUsT0FBT2tFLElBQXJDO0VBREQ7O1VBSVN4QyxhQUFULEdBQXlCLFlBQVc7U0FDNUIzQixTQUFTQyxPQUFPbUUsR0FBaEIsR0FBc0JuRSxPQUFPb0UsTUFBcEM7RUFERDs7VUFJU2xFLENBQVQsR0FBYSxVQUFTekQsQ0FBVCxFQUFZO1NBQ2pCQyxVQUFVQyxNQUFWLElBQW9CdUQsSUFBSXpELENBQUosRUFBT1QsUUFBM0IsSUFBdUNrRSxDQUE5QztFQUREOztVQUlTQyxDQUFULEdBQWEsVUFBUzFELENBQVQsRUFBWTtTQUNqQkMsVUFBVUMsTUFBVixJQUFvQndELElBQUkxRCxDQUFKLEVBQU9ULFFBQTNCLElBQXVDbUUsQ0FBOUM7RUFERDs7VUFJU0UsS0FBVCxHQUFpQixVQUFTNUQsQ0FBVCxFQUFZO1NBQ3JCQyxVQUFVQyxNQUFWLElBQW9CMEQsUUFBUTVELENBQVIsRUFBV1QsUUFBL0IsSUFBMkNxRSxLQUFsRDtFQUREOztVQUlTRyxVQUFULEdBQXNCLFVBQVMvRCxDQUFULEVBQVk7U0FDMUJDLFVBQVVDLE1BQVYsSUFBb0I2RCxhQUFhL0QsQ0FBYixFQUFnQlQsUUFBcEMsSUFBZ0R3RSxVQUF2RDtFQUREOztVQUlTQyxNQUFULEdBQWtCLFVBQVNoRSxDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0I4RCxTQUFTaEUsQ0FBVCxFQUFZVCxRQUFoQyxJQUE0Q3lFLE1BQW5EO0VBREQ7O1VBSVNxQixJQUFULEdBQWdCLFVBQVNyRixDQUFULEVBQVk7U0FDcEJDLFVBQVVDLE1BQVYsSUFBb0JtRixPQUFPckYsQ0FBUCxFQUFVVCxRQUE5QixJQUEwQzhGLElBQWpEO0VBREQ7O1VBSVM2RSxNQUFULEdBQWtCLFVBQVNsSyxDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0JnSyxTQUFTbEssQ0FBVCxFQUFZVCxRQUFoQyxJQUE0QzJLLE1BQW5EO0VBREQ7O1VBSVNqRyxVQUFULEdBQXNCLFVBQVNqRSxDQUFULEVBQVk7U0FDMUJDLFVBQVVDLE1BQVYsSUFBb0IrRCxnQkFBYWpFLENBQWIsRUFBZ0JULFFBQXBDLElBQWdEMEUsYUFBdkQ7RUFERDs7VUFJU0MsZUFBVCxHQUEyQixVQUFTbEUsQ0FBVCxFQUFZO1NBQy9CQyxVQUFVQyxNQUFWLElBQW9CZ0Usa0JBQWtCbEUsQ0FBbEIsRUFBcUJULFFBQXpDLElBQXFEMkUsZUFBNUQ7RUFERDs7VUFJU0MsY0FBVCxHQUEwQixVQUFTbkUsQ0FBVCxFQUFZO1NBQzlCQyxVQUFVQyxNQUFWLElBQW9CaUUsaUJBQWlCbkUsQ0FBakIsRUFBb0JULFFBQXhDLElBQW9ENEUsY0FBM0Q7RUFERDs7VUFJUy9FLFFBQVQsR0FBb0IsVUFBU1ksQ0FBVCxFQUFZO1NBQ3hCQyxVQUFVQyxNQUFWLElBQW9CZCxXQUFXWSxDQUFYLEVBQWNULFFBQWxDLElBQThDSCxRQUFyRDtFQUREOztVQUlTZ0YsYUFBVCxHQUF5QixVQUFTcEUsQ0FBVCxFQUFZO1NBQzdCQyxVQUFVQyxNQUFWLElBQW9Ca0UsZ0JBQWdCcEUsQ0FBaEIsRUFBbUJULFFBQXZDLElBQW1ENkUsYUFBMUQ7RUFERDs7VUFJU0MsWUFBVCxHQUF3QixVQUFTckUsQ0FBVCxFQUFZO1NBQzVCQyxVQUFVQyxNQUFWLElBQW9CbUUsZUFBZXJFLENBQWYsRUFBa0JULFFBQXRDLElBQWtEOEUsWUFBekQ7RUFERDs7VUFJU0MsaUJBQVQsR0FBNkIsVUFBU3RFLENBQVQsRUFBWTtTQUNqQ0MsVUFBVUMsTUFBVixJQUFvQm9FLG9CQUFvQnRFLENBQXBCLEVBQXVCVCxRQUEzQyxJQUF1RCtFLGlCQUE5RDtFQUREOztVQUlTQyxrQkFBVCxHQUE4QixVQUFTdkUsQ0FBVCxFQUFZO1NBQ2xDQyxVQUFVQyxNQUFWLElBQW9CcUUscUJBQXFCdkUsQ0FBckIsRUFBd0JULFFBQTVDLElBQXdEZ0Ysa0JBQS9EO0VBREQ7O1VBSVNDLGtCQUFULEdBQThCLFVBQVN4RSxDQUFULEVBQVk7U0FDbENDLFVBQVVDLE1BQVYsSUFBb0JzRSxxQkFBcUJ4RSxDQUFyQixFQUF3QlQsUUFBNUMsSUFBd0RpRixrQkFBL0Q7RUFERDs7VUFJU0MsZ0JBQVQsR0FBNEIsVUFBU3pFLENBQVQsRUFBWTtTQUNoQ0MsVUFBVUMsTUFBVixJQUFvQnVFLG1CQUFtQnpFLENBQW5CLEVBQXNCVCxRQUExQyxJQUFzRGtGLGdCQUE3RDtFQUREOztVQUlTMEgsSUFBVCxHQUFnQixVQUFTbk0sQ0FBVCxFQUFZO1NBQ3BCQyxVQUFVQyxNQUFWLElBQW9CNEssUUFBUTlLLENBQVIsRUFBV1QsUUFBL0IsSUFBMkN1TCxLQUFsRDtFQUREOztVQUlTRCxNQUFULEdBQWtCLFVBQVM3SyxDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0I2SyxVQUFVL0ssQ0FBVixFQUFhVCxRQUFqQyxJQUE2Q3dMLE9BQXBEO0VBREQ7O1FBSU94TCxRQUFQOzs7QUNuUGMsU0FBUzZNLEdBQVQsR0FBZTs7S0FFekJsSixLQUFKLEVBQ0NDLE9BREQsRUFFQ0MsTUFGRCxFQUdDSSxHQUhELEVBR01DLENBSE4sRUFHU0MsQ0FIVCxFQUdZQyxFQUhaLEVBR2dCQyxLQUhoQixFQUlDbUUsTUFKRCxFQUlTQyxNQUpULEVBSWlCbEUsT0FKakIsRUFJMEJDLFVBSjFCLEVBS0NFLGFBTEQsRUFLYUMsZUFMYixFQUs4QkMsY0FMOUIsRUFNQy9FLFFBTkQsRUFNV2dGLGFBTlgsRUFNMEJDLFlBTjFCLEVBT0NDLGlCQVBELEVBT29CQyxrQkFQcEIsRUFRQ0Msa0JBUkQsRUFRcUJDLGdCQVJyQjs7VUFVU2xGLFFBQVQsQ0FBa0JDLFNBQWxCLEVBQTZCOzs7WUFHbEIyRCxXQUFXLEtBQXJCOztrQkFFYWMsaUJBQWMsVUFBU3JFLENBQVQsRUFBWTtVQUFTQSxFQUFFaUYsUUFBRixDQUFXLENBQVgsQ0FBUDtHQUF6QztvQkFDa0JYLG1CQUFtQixVQUFTdEUsQ0FBVCxFQUFZO1VBQVNBLEVBQUVpRixRQUFGLENBQVcsQ0FBWCxDQUFQO0dBQW5EO21CQUNpQlYsa0JBQWtCLFVBQVN2RSxDQUFULEVBQVk7VUFBU0EsRUFBRWlGLFFBQUYsQ0FBVyxDQUFYLENBQVA7R0FBakQ7O2FBRVd6RixZQUFZLFlBQVc7VUFBU0ssU0FBUDtHQUFwQztrQkFDZ0IyRSxpQkFBaUIsWUFBVztVQUFTM0UsU0FBUDtHQUE5QztpQkFDZTRFLGdCQUFnQixZQUFXO1VBQVM1RSxTQUFQO0dBQTVDOztzQkFFb0I2RSxxQkFBcUIsWUFBVztVQUFTN0UsU0FBUDtHQUF0RDt1QkFDcUI4RSxzQkFBc0IsWUFBVztVQUFTOUUsU0FBUDtHQUF4RDs7dUJBRXFCK0Usc0JBQXNCLFlBQVc7VUFBUy9FLFNBQVA7R0FBeEQ7cUJBQ21CZ0Ysb0JBQW9CLFlBQVc7VUFBU2hGLFNBQVA7R0FBcEQ7OztXQUdTNE0sY0FBVCxDQUF3QmhNLENBQXhCLEVBQTJCO1VBQ25CMEgsT0FBT3RFLEVBQUVwRCxDQUFGLENBQVAsS0FBZ0IwSCxPQUFPNEMsU0FBUCxHQUFtQjVDLE9BQU80QyxTQUFQLEtBQW1CLENBQXRDLEdBQTBDLENBQTFELENBQVA7OztXQUdRMkIsY0FBVCxDQUF3QmpNLENBQXhCLEVBQTJCO1VBQ25CMkgsT0FBT3RFLEVBQUVyRCxDQUFGLENBQVAsS0FBZ0IySCxPQUFPMkMsU0FBUCxHQUFtQjNDLE9BQU8yQyxTQUFQLEtBQW1CLENBQXRDLEdBQTBDLENBQTFELENBQVA7OztZQUdTakwsSUFBVixDQUFlLFVBQVNrQixJQUFULEVBQWU7OztPQUd6QjJMLE9BQU8xTSxTQUFBLENBQVUsSUFBVixFQUFnQjRHLFNBQWhCLENBQTBCLE1BQU10RCxRQUFRc0gsT0FBUixDQUFnQixHQUFoQixFQUFxQixHQUFyQixDQUFoQyxFQUEyRDdKLElBQTNELENBQWdFQSxJQUFoRSxFQUFzRSxVQUFTUCxDQUFULEVBQVk7V0FBU21ELElBQUluRCxDQUFKLENBQVA7SUFBcEYsRUFDVGdHLElBRFMsQ0FDSixPQURJLEVBQ0tsRCxVQUFVLFNBRGYsQ0FBWDs7O09BSUlxSixZQUFZRCxLQUFLN0YsS0FBTCxHQUNkTixNQURjLENBQ1AsUUFETyxFQUViQyxJQUZhLENBRVIsT0FGUSxFQUVDbEQsVUFBVSxRQUZYLENBQWhCOzthQUtFa0QsSUFERixDQUNPLElBRFAsRUFDYWdHLGNBRGIsRUFFRWhHLElBRkYsQ0FFTyxJQUZQLEVBRWEsWUFBVztXQUFTMkIsT0FBTyxDQUFQLENBQVA7SUFGMUIsRUFHRTNCLElBSEYsQ0FHTyxHQUhQLEVBR1ksVUFBU2hHLENBQVQsRUFBWTtXQUFTeUQsUUFBUUgsR0FBR3RELENBQUgsQ0FBUixDQUFQO0lBSDFCLEVBSUVzRyxFQUpGLENBSUssV0FKTCxFQUlrQnJDLGlCQUpsQixFQUtFcUMsRUFMRixDQUtLLFlBTEwsRUFLbUJwQyxrQkFMbkIsRUFNRW9DLEVBTkYsQ0FNSyxZQU5MLEVBTW1CbkMsa0JBTm5CLEVBT0VtQyxFQVBGLENBT0ssVUFQTCxFQU9pQmxDLGdCQVBqQixFQVFFUixVQVJGLEdBUWV0RSxJQVJmLENBUW9CdUUsZUFScEIsRUFTR3lDLEVBVEgsQ0FTTSxLQVROLEVBU2EsWUFBVzthQUFFLENBQVUsSUFBVixFQUFnQmhILElBQWhCLENBQXFCeUUsYUFBckI7SUFUMUI7O2FBV1V3QyxLQUFWLENBQWdCMkYsSUFBaEI7SUFDRXRJLFVBREYsR0FDZXRFLElBRGYsQ0FDb0JzRSxhQURwQixFQUVHcUMsS0FGSCxDQUVTLE1BRlQsRUFFaUIsVUFBU2pHLENBQVQsRUFBWTtXQUFTMEQsV0FBV0gsTUFBTXZELENBQU4sQ0FBWCxDQUFQO0lBRi9CLEVBR0dnRyxJQUhILENBR1EsSUFIUixFQUdjZ0csY0FIZCxFQUlHaEcsSUFKSCxDQUlRLElBSlIsRUFJY2lHLGNBSmQsRUFLR2pHLElBTEgsQ0FLUSxHQUxSLEVBS2EsVUFBU2hHLENBQVQsRUFBWTtXQUFTeUQsUUFBUUgsR0FBR3RELENBQUgsQ0FBUixDQUFQO0lBTDNCLEVBTUdzRyxFQU5ILENBTU0sS0FOTixFQU1hLFlBQVc7V0FBUzlHLFNBQUEsQ0FBVSxJQUFWLEVBQWdCRixJQUFoQixDQUFxQlAsUUFBckIsQ0FBUDtJQU4xQjs7O1FBU0tnSSxJQUFMLEdBQ0VmLElBREYsQ0FDTyxPQURQLEVBQ2dCbEQsVUFBVSxPQUQxQixFQUVFYyxVQUZGLEdBRWV0RSxJQUZmLENBRW9Cd0UsY0FGcEIsRUFHR2tDLElBSEgsQ0FHUSxHQUhSLEVBR2EsQ0FIYixFQUlHTSxFQUpILENBSU0sS0FKTixFQUlhLFlBQVc7YUFBRSxDQUFVLElBQVYsRUFBZ0JoSCxJQUFoQixDQUFxQjBFLFlBQXJCO0lBSjFCLEVBS0dnRCxNQUxIO0dBL0JEOzs7VUF3Q1FuRSxLQUFULEdBQWlCLFVBQVNsRCxDQUFULEVBQVk7U0FDckJDLFVBQVVDLE1BQVYsSUFBb0JnRCxRQUFRbEQsQ0FBUixFQUFXVCxRQUEvQixJQUEyQzJELFNBQVMsRUFBM0Q7RUFERDs7VUFJU0MsT0FBVCxHQUFtQixVQUFTbkQsQ0FBVCxFQUFZO1NBQ3ZCQyxVQUFVQyxNQUFWLElBQW9CaUQsVUFBVW5ELENBQVYsRUFBYVQsUUFBakMsSUFBNkM0RCxPQUFwRDtFQUREOztVQUlTQyxNQUFULEdBQWtCLFVBQVNwRCxDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0JrRCxTQUFTcEQsQ0FBVCxFQUFZVCxRQUFoQyxJQUE0QzZELE1BQW5EO0VBREQ7O1VBSVNJLEdBQVQsR0FBZSxVQUFTeEQsQ0FBVCxFQUFZO1NBQ25CQyxVQUFVQyxNQUFWLElBQW9Cc0QsTUFBTXhELENBQU4sRUFBU1QsUUFBN0IsSUFBeUNpRSxHQUFoRDtFQUREOztVQUlTQyxDQUFULEdBQWEsVUFBU3pELENBQVQsRUFBWTtTQUNqQkMsVUFBVUMsTUFBVixJQUFvQnVELElBQUl6RCxDQUFKLEVBQU9ULFFBQTNCLElBQXVDa0UsQ0FBOUM7RUFERDs7VUFJU0MsQ0FBVCxHQUFhLFVBQVMxRCxDQUFULEVBQVk7U0FDakJDLFVBQVVDLE1BQVYsSUFBb0J3RCxJQUFJMUQsQ0FBSixFQUFPVCxRQUEzQixJQUF1Q21FLENBQTlDO0VBREQ7O1VBSVNDLEVBQVQsR0FBYyxVQUFTM0QsQ0FBVCxFQUFZO1NBQ2xCQyxVQUFVQyxNQUFWLElBQW9CeUQsS0FBSzNELENBQUwsRUFBUVQsUUFBNUIsSUFBd0NvRSxFQUEvQztFQUREOztVQUlTQyxLQUFULEdBQWlCLFVBQVM1RCxDQUFULEVBQVk7U0FDckJDLFVBQVVDLE1BQVYsSUFBb0IwRCxRQUFRNUQsQ0FBUixFQUFXVCxRQUEvQixJQUEyQ3FFLEtBQWxEO0VBREQ7O1VBSVNtRSxNQUFULEdBQWtCLFVBQVMvSCxDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0I2SCxTQUFTL0gsQ0FBVCxFQUFZVCxRQUFoQyxJQUE0Q3dJLE1BQW5EO0VBREQ7O1VBSVNDLE1BQVQsR0FBa0IsVUFBU2hJLENBQVQsRUFBWTtTQUN0QkMsVUFBVUMsTUFBVixJQUFvQjhILFNBQVNoSSxDQUFULEVBQVlULFFBQWhDLElBQTRDeUksTUFBbkQ7RUFERDs7VUFJU2xFLE9BQVQsR0FBbUIsVUFBUzlELENBQVQsRUFBWTtTQUN2QkMsVUFBVUMsTUFBVixJQUFvQjRELFVBQVU5RCxDQUFWLEVBQWFULFFBQWpDLElBQTZDdUUsT0FBcEQ7RUFERDs7VUFJU0MsVUFBVCxHQUFzQixVQUFTL0QsQ0FBVCxFQUFZO1NBQzFCQyxVQUFVQyxNQUFWLElBQW9CNkQsYUFBYS9ELENBQWIsRUFBZ0JULFFBQXBDLElBQWdEd0UsVUFBdkQ7RUFERDs7VUFJU0UsVUFBVCxHQUFzQixVQUFTakUsQ0FBVCxFQUFZO1NBQzFCQyxVQUFVQyxNQUFWLElBQW9CK0QsZ0JBQWFqRSxDQUFiLEVBQWdCVCxRQUFwQyxJQUFnRDBFLGFBQXZEO0VBREQ7O1VBSVNDLGVBQVQsR0FBMkIsVUFBU2xFLENBQVQsRUFBWTtTQUMvQkMsVUFBVUMsTUFBVixJQUFvQmdFLGtCQUFrQmxFLENBQWxCLEVBQXFCVCxRQUF6QyxJQUFxRDJFLGVBQTVEO0VBREQ7O1VBSVNDLGNBQVQsR0FBMEIsVUFBU25FLENBQVQsRUFBWTtTQUM5QkMsVUFBVUMsTUFBVixJQUFvQmlFLGlCQUFpQm5FLENBQWpCLEVBQW9CVCxRQUF4QyxJQUFvRDRFLGNBQTNEO0VBREQ7O1VBSVMvRSxRQUFULEdBQW9CLFVBQVNZLENBQVQsRUFBWTtTQUN4QkMsVUFBVUMsTUFBVixJQUFvQmQsV0FBV1ksQ0FBWCxFQUFjVCxRQUFsQyxJQUE4Q0gsUUFBckQ7RUFERDs7VUFJU2dGLGFBQVQsR0FBeUIsVUFBU3BFLENBQVQsRUFBWTtTQUM3QkMsVUFBVUMsTUFBVixJQUFvQmtFLGdCQUFnQnBFLENBQWhCLEVBQW1CVCxRQUF2QyxJQUFtRDZFLGFBQTFEO0VBREQ7O1VBSVNDLFlBQVQsR0FBd0IsVUFBU3JFLENBQVQsRUFBWTtTQUM1QkMsVUFBVUMsTUFBVixJQUFvQm1FLGVBQWVyRSxDQUFmLEVBQWtCVCxRQUF0QyxJQUFrRDhFLFlBQXpEO0VBREQ7O1VBSVNDLGlCQUFULEdBQTZCLFVBQVN0RSxDQUFULEVBQVk7U0FDakNDLFVBQVVDLE1BQVYsSUFBb0JvRSxvQkFBb0J0RSxDQUFwQixFQUF1QlQsUUFBM0MsSUFBdUQrRSxpQkFBOUQ7RUFERDs7VUFJU0Msa0JBQVQsR0FBOEIsVUFBU3ZFLENBQVQsRUFBWTtTQUNsQ0MsVUFBVUMsTUFBVixJQUFvQnFFLHFCQUFxQnZFLENBQXJCLEVBQXdCVCxRQUE1QyxJQUF3RGdGLGtCQUEvRDtFQUREOztVQUlTQyxrQkFBVCxHQUE4QixVQUFTeEUsQ0FBVCxFQUFZO1NBQ2xDQyxVQUFVQyxNQUFWLElBQW9Cc0UscUJBQXFCeEUsQ0FBckIsRUFBd0JULFFBQTVDLElBQXdEaUYsa0JBQS9EO0VBREQ7O1VBSVNDLGdCQUFULEdBQTRCLFVBQVN6RSxDQUFULEVBQVk7U0FDaENDLFVBQVVDLE1BQVYsSUFBb0J1RSxtQkFBbUJ6RSxDQUFuQixFQUFzQlQsUUFBMUMsSUFBc0RrRixnQkFBN0Q7RUFERDs7UUFJT2xGLFFBQVA7OztBQ3hLYyxTQUFTa04sS0FBVCxHQUFpQjs7S0FFM0J2SixLQUFKLEVBQ0NDLE9BREQsRUFFQ2pDLEdBRkQsRUFHQ21DLEtBSEQsRUFHUUMsTUFIUixFQUlDb0osbUJBSkQsRUFNQ3pJLGFBTkQsRUFPQzdFLFFBUEQ7O1VBU1NHLFFBQVQsQ0FBa0JDLFNBQWxCLEVBQTZCOzs7WUFHbEIyRCxXQUFXLE9BQXJCO2tCQUNhYyxpQkFBYyxVQUFTckUsQ0FBVCxFQUFZO1VBQVNBLEVBQUVpRixRQUFGLENBQVcsQ0FBWCxDQUFQO0dBQXpDO2FBQ1d6RixZQUFZLFlBQVc7VUFBU0ssU0FBUDtHQUFwQzs7WUFFVUMsSUFBVixDQUFlLFlBQVc7O09BRXJCaU4sYUFBYTlNLFNBQUEsQ0FBVSxJQUFWLEVBQ2Y0RyxTQURlLENBQ0wsTUFBTXRELFFBQVFzSCxPQUFSLENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLENBREQsRUFDNEI3SixJQUQ1QixDQUNpQyxDQUFDLENBQUQsQ0FEakMsRUFDc0M4RixLQUR0QyxFQUFqQjs7Y0FHV04sTUFBWCxDQUFrQixPQUFsQixFQUNFQyxJQURGLENBQ08sT0FEUCxFQUNnQmxELFVBQVUsUUFEMUIsRUFFRWtELElBRkYsQ0FFTyxZQUZQLEVBRXFCbkYsR0FGckIsRUFHRW1GLElBSEYsQ0FHTyxHQUhQLEVBR1loRCxRQUFNLENBSGxCLEVBSUVnRCxJQUpGLENBSU8sR0FKUCxFQUlZL0MsU0FBTyxDQUpuQixFQUtFK0MsSUFMRixDQUtPLE9BTFAsRUFLZ0IsQ0FMaEIsRUFNRUEsSUFORixDQU1PLFFBTlAsRUFNaUIsQ0FOakIsRUFPRUEsSUFQRixDQU9PLHFCQVBQLEVBTzhCcUcsb0JBQW9CRSxLQUFwQixHQUE0QixHQUE1QixHQUFrQ0Ysb0JBQW9CRyxXQVBwRixFQVFFdkcsS0FSRixDQVFRLFNBUlIsRUFRbUIsQ0FSbkIsRUFTRXJDLFVBVEYsR0FTZXRFLElBVGYsQ0FTb0JzRSxhQVRwQixFQVVHcUMsS0FWSCxDQVVTLFNBVlQsRUFVb0IsR0FWcEIsRUFXR0QsSUFYSCxDQVdRLEdBWFIsRUFXYSxDQVhiLEVBWUdBLElBWkgsQ0FZUSxHQVpSLEVBWWEsQ0FaYixFQWFHQSxJQWJILENBYVEsT0FiUixFQWFpQmhELEtBYmpCLEVBY0dnRCxJQWRILENBY1EsUUFkUixFQWNrQmhELEtBZGxCLEVBZUdzRCxFQWZILENBZU0sS0FmTixFQWVhLFlBQVc7YUFDckIsQ0FBVSxJQUFWLEVBQWdCaEgsSUFBaEIsQ0FBcUJQLFFBQXJCO0lBaEJIO0dBTEQ7OztVQTBCUThELEtBQVQsR0FBaUIsVUFBU2xELENBQVQsRUFBWTtTQUNyQkMsVUFBVUMsTUFBVixJQUFvQmdELFFBQVFsRCxDQUFSLEVBQVdULFFBQS9CLElBQTJDMkQsU0FBUyxFQUEzRDtFQUREOztVQUlTQyxPQUFULEdBQW1CLFVBQVNuRCxDQUFULEVBQVk7U0FDdkJDLFVBQVVDLE1BQVYsSUFBb0JpRCxVQUFVbkQsQ0FBVixFQUFhVCxRQUFqQyxJQUE2QzRELE9BQXBEO0VBREQ7O1VBSVNqQyxHQUFULEdBQWUsVUFBU2xCLENBQVQsRUFBWTtTQUNuQkMsVUFBVUMsTUFBVixJQUFvQmdCLE1BQU1sQixDQUFOLEVBQVNULFFBQTdCLElBQXlDMkIsR0FBaEQ7RUFERDs7VUFJU21DLEtBQVQsR0FBaUIsVUFBU3JELENBQVQsRUFBWTtTQUNyQkMsVUFBVUMsTUFBVixJQUFvQm1ELFFBQVFyRCxDQUFSLEVBQVdULFFBQS9CLElBQTJDOEQsS0FBbEQ7RUFERDs7VUFJU0MsTUFBVCxHQUFrQixVQUFTdEQsQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9Cb0QsU0FBU3RELENBQVQsRUFBWVQsUUFBaEMsSUFBNEMrRCxNQUFuRDtFQUREOztVQUlTb0osbUJBQVQsR0FBK0IsVUFBUzFNLENBQVQsRUFBWTtTQUNuQ0MsVUFBVUMsTUFBVixJQUFvQndNLHNCQUFzQjFNLENBQXRCLEVBQXlCVCxRQUE3QyxJQUF5RG1OLG1CQUFoRTtFQUREOztVQUlTekksVUFBVCxHQUFzQixVQUFTakUsQ0FBVCxFQUFZO1NBQzFCQyxVQUFVQyxNQUFWLElBQW9CK0QsZ0JBQWFqRSxDQUFiLEVBQWdCVCxRQUFwQyxJQUFnRDBFLGFBQXZEO0VBREQ7O1VBSVM3RSxRQUFULEdBQW9CLFVBQVNZLENBQVQsRUFBWTtTQUN4QkMsVUFBVUMsTUFBVixJQUFvQmQsV0FBV1ksQ0FBWCxFQUFjVCxRQUFsQyxJQUE4Q0gsUUFBckQ7RUFERDs7UUFJT0csUUFBUDs7O0FDNUVjLFNBQVNpSCxLQUFULEdBQWlCOztLQUUzQnRELEtBQUosRUFDQ0MsT0FERCxFQUVDQyxNQUZELEVBR0NJLEdBSEQsRUFHTUMsQ0FITixFQUdTQyxDQUhULEVBR1lDLEVBSFosRUFHZ0JDLEtBSGhCLEVBR3VCQyxJQUh2QixFQUlDa0UsTUFKRCxFQUlTQyxNQUpULEVBSWlCbEUsT0FKakIsRUFJMEJDLFVBSjFCLEVBS0NFLGFBTEQsRUFLYUMsZUFMYixFQUs4QkMsY0FMOUIsRUFNQy9FLFFBTkQsRUFNV2dGLGFBTlgsRUFNMEJDLFlBTjFCLEVBUUNLLFVBUkQsRUFRYW9JLE1BUmIsRUFRcUJDLE1BUnJCLEVBUTZCQyxFQVI3QixFQVFpQ0MsRUFSakM7O1VBVVMxTixRQUFULENBQWtCQyxTQUFsQixFQUE2Qjs7O1lBR2xCMkQsV0FBVyxPQUFyQjs7a0JBRWFjLGlCQUFjLFVBQVNyRSxDQUFULEVBQVk7VUFBU0EsRUFBRWlGLFFBQUYsQ0FBVyxDQUFYLENBQVA7R0FBekM7b0JBQ2tCWCxtQkFBbUIsVUFBU3RFLENBQVQsRUFBWTtVQUFTQSxFQUFFaUYsUUFBRixDQUFXLENBQVgsQ0FBUDtHQUFuRDttQkFDaUJWLGtCQUFrQixVQUFTdkUsQ0FBVCxFQUFZO1VBQVNBLEVBQUVpRixRQUFGLENBQVcsQ0FBWCxDQUFQO0dBQWpEOzthQUVXekYsWUFBWSxZQUFXO1VBQVNLLFNBQVA7R0FBcEM7a0JBQ2dCMkUsaUJBQWlCLFlBQVc7VUFBUzNFLFNBQVA7R0FBOUM7aUJBQ2U0RSxnQkFBZ0IsWUFBVztVQUFTNUUsU0FBUDtHQUE1Qzs7ZUFFYWlGLGNBQWMsVUFBU3JFLENBQVQsRUFBWTtVQUFTQSxDQUFQO0dBQXpDO1dBQ1N5TSxVQUFVLFFBQW5CO1dBQ1NDLFVBQVUsWUFBVztVQUFTLENBQVA7R0FBaEM7O1dBRVNHLGVBQVQsQ0FBeUI3TSxDQUF6QixFQUE0QjtVQUNwQjBILE9BQU90RSxFQUFFcEQsQ0FBRixDQUFQLEtBQWdCMEgsT0FBTzRDLFNBQVAsR0FBbUI1QyxPQUFPNEMsU0FBUCxLQUFtQixDQUF0QyxHQUEwQyxDQUExRCxDQUFQOzs7WUFHU2pMLElBQVYsQ0FBZSxVQUFTa0IsSUFBVCxFQUFlOzs7T0FHekIyRixTQUFTMUcsU0FBQSxDQUFVLElBQVYsRUFBZ0I0RyxTQUFoQixDQUEwQixNQUFNdEQsUUFBUXNILE9BQVIsQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsQ0FBaEMsRUFBMkQ3SixJQUEzRCxDQUFnRUEsSUFBaEUsRUFBc0UsVUFBU1AsQ0FBVCxFQUFZO1dBQVNtRCxJQUFJbkQsQ0FBSixDQUFQO0lBQXBGLEVBQ1hnRyxJQURXLENBQ04sT0FETSxFQUNHbEQsVUFBVSxTQURiLENBQWI7OztPQUlJZ0ssY0FBYzVHLE9BQU9HLEtBQVAsR0FDaEJOLE1BRGdCLENBQ1QsTUFEUyxFQUVmQyxJQUZlLENBRVYsT0FGVSxFQUVEbEQsVUFBVSxRQUZULENBQWxCOztlQUtFa0QsSUFERixDQUNPLEdBRFAsRUFDWTZHLGVBRFosRUFFRTdHLElBRkYsQ0FFTyxHQUZQLEVBRVkyQixPQUFPLENBQVAsQ0FGWixFQUdFMUIsS0FIRixDQUdRLGFBSFIsRUFHdUJ3RyxNQUh2QixFQUlFeEcsS0FKRixDQUlRLG1CQUpSLEVBSTZCLFNBSjdCLEVBS0V6QyxJQUxGLENBS08sVUFBU3hELENBQVQsRUFBWTtXQUFTcUUsV0FBV2IsS0FBS3hELENBQUwsQ0FBWCxDQUFQO0lBTHJCLEVBTUU0RCxVQU5GLEdBTWV0RSxJQU5mLENBTW9CdUUsZUFOcEI7O0lBUUd5QyxFQVJILENBUU0sS0FSTixFQVFhLFlBQVc7YUFBRSxDQUFVLElBQVYsRUFBZ0JoSCxJQUFoQixDQUFxQnlFLGFBQXJCO0lBUjFCOztlQVVZd0MsS0FBWixDQUFrQkwsTUFBbEI7SUFDRUYsSUFERixDQUNPLElBRFAsRUFDYTJHLEVBRGIsRUFFRTNHLElBRkYsQ0FFTyxJQUZQLEVBRWE0RyxFQUZiLEVBR0U1RyxJQUhGLENBR08sV0FIUCxFQUdvQixVQUFTaEcsQ0FBVCxFQUFZZ0MsQ0FBWixFQUFlO1dBQzFCLGFBQWEsT0FBTzBLLE1BQVAsS0FBa0IsVUFBbEIsR0FBK0JBLE9BQU8xTSxDQUFQLEVBQVVnQyxDQUFWLENBQS9CLEdBQThDMEssTUFBM0QsSUFDSixHQURJLEdBQ0VHLGdCQUFnQjdNLENBQWhCLENBREYsR0FDdUIsR0FEdkIsR0FDNkIySCxPQUFPdEUsRUFBRXJELENBQUYsQ0FBUCxDQUQ3QixHQUM0QyxHQURuRDtJQUpGLEVBT0U0RCxVQVBGLEdBT2V0RSxJQVBmLENBT29Cc0UsYUFQcEIsRUFRR3FDLEtBUkgsQ0FRUyxNQVJULEVBUWlCLFVBQVNqRyxDQUFULEVBQVk7V0FBUzBELFdBQVdILE1BQU12RCxDQUFOLENBQVgsQ0FBUDtJQVIvQixFQVNHaUcsS0FUSCxDQVNTLFdBVFQsRUFTc0IsVUFBU2pHLENBQVQsRUFBWTtXQUFTc0QsTUFBTUcsT0FBTixHQUFnQkEsUUFBUUgsR0FBR3RELENBQUgsQ0FBUixJQUFpQixJQUFqQyxHQUF3Q1osU0FBL0M7SUFUcEMsRUFVRzZHLEtBVkgsQ0FVUyxhQVZULEVBVXdCd0csTUFWeEIsRUFXR3pHLElBWEgsQ0FXUSxHQVhSLEVBV2E2RyxlQVhiLEVBWUc3RyxJQVpILENBWVEsR0FaUixFQVlhLFVBQVNoRyxDQUFULEVBQVk7V0FBUzJILE9BQU90RSxFQUFFckQsQ0FBRixDQUFQLENBQVA7SUFaM0IsRUFhR3dELElBYkgsQ0FhUSxVQUFTeEQsQ0FBVCxFQUFZO1dBQVNxRSxXQUFXYixLQUFLeEQsQ0FBTCxDQUFYLENBQVA7SUFidEIsRUFjR3NHLEVBZEgsQ0FjTSxLQWROLEVBY2EsWUFBVzthQUFHLENBQVUsSUFBVixFQUFnQmhILElBQWhCLENBQXFCUCxRQUFyQjtJQWQzQjs7O1VBaUJPZ0ksSUFBUCxHQUNFZixJQURGLENBQ08sT0FEUCxFQUNnQmxELFVBQVUsT0FEMUIsRUFFRWMsVUFGRixHQUVldEUsSUFGZixDQUVvQndFLGNBRnBCOztJQUlHd0MsRUFKSCxDQUlNLEtBSk4sRUFJYSxZQUFXO2FBQUUsQ0FBVSxJQUFWLEVBQWdCaEgsSUFBaEIsQ0FBcUIwRSxZQUFyQjtJQUoxQixFQUtHZ0QsTUFMSDtHQXRDRDs7O1VBK0NRbkUsS0FBVCxHQUFpQixVQUFTbEQsQ0FBVCxFQUFZO1NBQ3JCQyxVQUFVQyxNQUFWLElBQW9CZ0QsUUFBUWxELENBQVIsRUFBV1QsUUFBL0IsSUFBMkMyRCxTQUFTLEVBQTNEO0VBREQ7O1VBSVNDLE9BQVQsR0FBbUIsVUFBU25ELENBQVQsRUFBWTtTQUN2QkMsVUFBVUMsTUFBVixJQUFvQmlELFVBQVVuRCxDQUFWLEVBQWFULFFBQWpDLElBQTZDNEQsT0FBcEQ7RUFERDs7VUFJU0MsTUFBVCxHQUFrQixVQUFTcEQsQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9Ca0QsU0FBU3BELENBQVQsRUFBWVQsUUFBaEMsSUFBNEM2RCxNQUFuRDtFQUREOztVQUlTSSxHQUFULEdBQWUsVUFBU3hELENBQVQsRUFBWTtTQUNuQkMsVUFBVUMsTUFBVixJQUFvQnNELE1BQU14RCxDQUFOLEVBQVNULFFBQTdCLElBQXlDaUUsR0FBaEQ7RUFERDs7VUFJU0MsQ0FBVCxHQUFhLFVBQVN6RCxDQUFULEVBQVk7U0FDakJDLFVBQVVDLE1BQVYsSUFBb0J1RCxJQUFJekQsQ0FBSixFQUFPVCxRQUEzQixJQUF1Q2tFLENBQTlDO0VBREQ7O1VBSVNDLENBQVQsR0FBYSxVQUFTMUQsQ0FBVCxFQUFZO1NBQ2pCQyxVQUFVQyxNQUFWLElBQW9Cd0QsSUFBSTFELENBQUosRUFBT1QsUUFBM0IsSUFBdUNtRSxDQUE5QztFQUREOztVQUlTQyxFQUFULEdBQWMsVUFBUzNELENBQVQsRUFBWTtTQUNsQkMsVUFBVUMsTUFBVixJQUFvQnlELEtBQUszRCxDQUFMLEVBQVFULFFBQTVCLElBQXdDb0UsRUFBL0M7RUFERDs7VUFJU0MsS0FBVCxHQUFpQixVQUFTNUQsQ0FBVCxFQUFZO1NBQ3JCQyxVQUFVQyxNQUFWLElBQW9CMEQsUUFBUTVELENBQVIsRUFBV1QsUUFBL0IsSUFBMkNxRSxLQUFsRDtFQUREOztVQUlTQyxJQUFULEdBQWdCLFVBQVM3RCxDQUFULEVBQVk7U0FDcEJDLFVBQVVDLE1BQVYsSUFBb0IyRCxPQUFPN0QsQ0FBUCxFQUFVVCxRQUE5QixJQUEwQ3NFLElBQWpEO0VBREQ7O1VBSVNrRSxNQUFULEdBQWtCLFVBQVMvSCxDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0I2SCxTQUFTL0gsQ0FBVCxFQUFZVCxRQUFoQyxJQUE0Q3dJLE1BQW5EO0VBREQ7O1VBSVNDLE1BQVQsR0FBa0IsVUFBU2hJLENBQVQsRUFBWTtTQUN0QkMsVUFBVUMsTUFBVixJQUFvQjhILFNBQVNoSSxDQUFULEVBQVlULFFBQWhDLElBQTRDeUksTUFBbkQ7RUFERDs7VUFJU2xFLE9BQVQsR0FBbUIsVUFBUzlELENBQVQsRUFBWTtTQUN2QkMsVUFBVUMsTUFBVixJQUFvQjRELFVBQVU5RCxDQUFWLEVBQWFULFFBQWpDLElBQTZDdUUsT0FBcEQ7RUFERDs7VUFJU0MsVUFBVCxHQUFzQixVQUFTL0QsQ0FBVCxFQUFZO1NBQzFCQyxVQUFVQyxNQUFWLElBQW9CNkQsYUFBYS9ELENBQWIsRUFBZ0JULFFBQXBDLElBQWdEd0UsVUFBdkQ7RUFERDs7VUFJU0UsVUFBVCxHQUFzQixVQUFTakUsQ0FBVCxFQUFZO1NBQzFCQyxVQUFVQyxNQUFWLElBQW9CK0QsZ0JBQWFqRSxDQUFiLEVBQWdCVCxRQUFwQyxJQUFnRDBFLGFBQXZEO0VBREQ7O1VBSVNDLGVBQVQsR0FBMkIsVUFBU2xFLENBQVQsRUFBWTtTQUMvQkMsVUFBVUMsTUFBVixJQUFvQmdFLGtCQUFrQmxFLENBQWxCLEVBQXFCVCxRQUF6QyxJQUFxRDJFLGVBQTVEO0VBREQ7O1VBSVNDLGNBQVQsR0FBMEIsVUFBU25FLENBQVQsRUFBWTtTQUM5QkMsVUFBVUMsTUFBVixJQUFvQmlFLGlCQUFpQm5FLENBQWpCLEVBQW9CVCxRQUF4QyxJQUFvRDRFLGNBQTNEO0VBREQ7O1VBSVMvRSxRQUFULEdBQW9CLFVBQVNZLENBQVQsRUFBWTtTQUN4QkMsVUFBVUMsTUFBVixJQUFvQmQsV0FBV1ksQ0FBWCxFQUFjVCxRQUFsQyxJQUE4Q0gsUUFBckQ7RUFERDs7VUFJU2dGLGFBQVQsR0FBeUIsVUFBU3BFLENBQVQsRUFBWTtTQUM3QkMsVUFBVUMsTUFBVixJQUFvQmtFLGdCQUFnQnBFLENBQWhCLEVBQW1CVCxRQUF2QyxJQUFtRDZFLGFBQTFEO0VBREQ7O1VBSVNDLFlBQVQsR0FBd0IsVUFBU3JFLENBQVQsRUFBWTtTQUM1QkMsVUFBVUMsTUFBVixJQUFvQm1FLGVBQWVyRSxDQUFmLEVBQWtCVCxRQUF0QyxJQUFrRDhFLFlBQXpEO0VBREQ7O1VBSVNLLFVBQVQsR0FBc0IsVUFBUzFFLENBQVQsRUFBWTtTQUMxQkMsVUFBVUMsTUFBVixJQUFvQndFLGFBQWExRSxDQUFiLEVBQWdCVCxRQUFwQyxJQUFnRG1GLFVBQXZEO0VBREQ7O1VBSVNvSSxNQUFULEdBQWtCLFVBQVM5TSxDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0I0TSxTQUFTOU0sQ0FBVCxFQUFZVCxRQUFoQyxJQUE0Q3VOLE1BQW5EO0VBREQ7O1VBSVNDLE1BQVQsR0FBa0IsVUFBUy9NLENBQVQsRUFBWTtTQUN0QkMsVUFBVUMsTUFBVixJQUFvQjZNLFNBQVMvTSxDQUFULEVBQVlULFFBQWhDLElBQTRDd04sTUFBbkQ7RUFERDs7VUFJU0MsRUFBVCxHQUFjLFVBQVNoTixDQUFULEVBQVk7U0FDbEJDLFVBQVVDLE1BQVYsSUFBb0I4TSxLQUFLaE4sQ0FBTCxFQUFRVCxRQUE1QixJQUF3Q3lOLEVBQS9DO0VBREQ7O1VBSVNDLEVBQVQsR0FBYyxVQUFTak4sQ0FBVCxFQUFZO1NBQ2xCQyxVQUFVQyxNQUFWLElBQW9CK00sS0FBS2pOLENBQUwsRUFBUVQsUUFBNUIsSUFBd0MwTixFQUEvQztFQUREOztRQUlPMU4sUUFBUDs7O0FDM0tNLFNBQVM2TixJQUFULEdBQWdCO1FBQ2ZDLFVBQVVDLFNBQVYsQ0FBb0JDLE9BQXBCLENBQTRCLE1BQTVCLElBQXNDLENBQUMsQ0FBOUM7Q0FHRCxBQUFPOztBQ1JRLFNBQVNDLEdBQVQsR0FBZTs7S0FFekJySyxPQUFKLEVBQ0NFLEtBREQsRUFDUUMsTUFEUixFQUdDbUssT0FIRCxFQUlDZixtQkFKRCxFQUtDRyxXQUxELEVBT0M1SSxhQVBELEVBT2FDLGVBUGIsRUFPOEJDLGNBUDlCLEVBUUMvRSxRQVJELEVBUVdnRixhQVJYLEVBUTBCQyxZQVIxQjs7VUFVUzlFLFFBQVQsQ0FBa0JDLFNBQWxCLEVBQTZCOztZQUVsQkUsSUFBVixDQUFlLFVBQVNrQixJQUFULEVBQWVDLEtBQWYsRUFBc0I7OzthQUcxQnNDLFdBQVcsS0FBckI7YUFDVXNLLFdBQVcsRUFBRSxLQUFLLENBQVAsRUFBVSxLQUFLLENBQWYsRUFBa0IsU0FBU3BLLEtBQTNCLEVBQWtDLFVBQVVDLE1BQTVDLEVBQXJCOztjQUVXbEUsWUFBWSxZQUFXO1dBQVNLLFNBQVA7SUFBcEM7bUJBQ2dCMkUsaUJBQWlCLFlBQVc7V0FBUzNFLFNBQVA7SUFBOUM7a0JBQ2U0RSxnQkFBZ0IsWUFBVztXQUFTNUUsU0FBUDtJQUE1Qzs7bUJBRWF3RSxpQkFBYyxVQUFTckUsQ0FBVCxFQUFZO1dBQVNBLEVBQUVpRixRQUFGLENBQVcsQ0FBWCxDQUFQO0lBQXpDO3FCQUNrQlgsbUJBQW1CLFVBQVN0RSxDQUFULEVBQVk7V0FBU0EsRUFBRWlGLFFBQUYsQ0FBVyxDQUFYLENBQVA7SUFBbkQ7b0JBQ2lCVixrQkFBa0IsVUFBU3ZFLENBQVQsRUFBWTtXQUFTQSxFQUFFaUYsUUFBRixDQUFXLENBQVgsQ0FBUDtJQUFqRDs7O09BR0c2SSxTQUFTckssS0FBVCxHQUFpQkEsS0FBakIsSUFBMEJxSyxTQUFTcEssTUFBVCxHQUFrQkEsTUFBL0MsRUFBdUQ7MEJBQ2hDLFVBQXRCOzs7T0FHR3FLLEtBQUs5TixTQUFBLENBQVUsSUFBVixFQUFnQndHLElBQWhCLENBQXFCLElBQXJCLENBQVQ7OztPQUdJbUgsTUFBTTNOLFNBQUEsQ0FBVSxJQUFWLEVBQWdCNEcsU0FBaEIsQ0FBMEIsTUFBTWtILEVBQU4sR0FBVyxPQUFYLEdBQXFCOU0sS0FBL0MsRUFBc0RELElBQXRELENBQTJEQSxJQUEzRCxFQUNQeUYsSUFETyxDQUNGLE9BREUsRUFDT2xELFVBQVUsU0FEakIsQ0FBVjs7O09BSUl1RCxLQUFKLEdBQ0VOLE1BREYsQ0FDUyxLQURULEVBRUdDLElBRkgsQ0FFUSxJQUZSLEVBRWNzSCxLQUFLLE9BQUwsR0FBZTlNLEtBRjdCLEVBR0d3RixJQUhILENBR1EsT0FIUixFQUdpQmxELFVBQVUsUUFIM0IsRUFJR2tELElBSkgsQ0FJUSxPQUpSLEVBSWlCaEQsS0FKakIsRUFLR2dELElBTEgsQ0FLUSxRQUxSLEVBS2tCL0MsTUFMbEIsRUFNRytDLElBTkgsQ0FNUSxTQU5SLEVBTW1Cb0gsUUFBUWhLLENBQVIsR0FBWSxHQUFaLEdBQWtCZ0ssUUFBUS9KLENBQTFCLEdBQThCLEdBQTlCLEdBQW9DK0osUUFBUXBLLEtBQTVDLEdBQW9ELEdBQXBELEdBQTBEb0ssUUFBUW5LLE1BTnJGLEVBT0crQyxJQVBILENBT1EscUJBUFIsRUFPK0IrRyxTQUFTLE1BQVQsR0FBa0JWLHVCQUF1QixVQVB4RSxFQVFHckcsSUFSSCxDQVFRLGFBUlIsRUFRdUJ3RyxlQUFlLE1BUnRDLEVBU0d4RyxJQVRILENBU1EsU0FUUixFQVNtQitHLFNBQVMsS0FBVCxHQUFpQjNOLFNBVHBDLEVBVUc0RyxJQVZILENBVVEsT0FWUixFQVVpQitHLFNBQVMsNEJBQVQsR0FBd0MzTixTQVZ6RCxFQVdHRSxJQVhILENBV1F5RSxhQVhSLEVBWUd3QyxLQVpILENBWVM0RyxHQVpUO0lBYUk3TixJQWJKLENBYVNQLFFBYlQ7OztPQWdCSWdJLElBQUosR0FDRWYsSUFERixDQUNPLE9BRFAsRUFDZ0JsRCxVQUFVLE9BRDFCLEVBRUV4RCxJQUZGLENBRU8wRSxZQUZQLEVBR0VnRCxNQUhGO0dBMUNEOzs7VUFpRFFsRSxPQUFULEdBQW1CLFVBQVNuRCxDQUFULEVBQVk7U0FDdkJDLFVBQVVDLE1BQVYsSUFBb0JpRCxVQUFVbkQsQ0FBVixFQUFhVCxRQUFqQyxJQUE2QzRELE9BQXBEO0VBREQ7O1VBSVNFLEtBQVQsR0FBaUIsVUFBU3JELENBQVQsRUFBWTtTQUNyQkMsVUFBVUMsTUFBVixJQUFvQm1ELFFBQVFyRCxDQUFSLEVBQVdULFFBQS9CLElBQTJDOEQsS0FBbEQ7RUFERDs7VUFJU0MsTUFBVCxHQUFrQixVQUFTdEQsQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9Cb0QsU0FBU3RELENBQVQsRUFBWVQsUUFBaEMsSUFBNEMrRCxNQUFuRDtFQUREOztVQUlTbUssT0FBVCxHQUFtQixVQUFTek4sQ0FBVCxFQUFZO1NBQ3ZCQyxVQUFVQyxNQUFWLElBQW9CdU4sVUFBVXpOLENBQVYsRUFBYVQsUUFBakMsSUFBNkNrTyxPQUFwRDtFQUREOztVQUlTZixtQkFBVCxHQUErQixVQUFTMU0sQ0FBVCxFQUFZO1NBQ25DQyxVQUFVQyxNQUFWLElBQW9Cd00sc0JBQXNCMU0sQ0FBdEIsRUFBeUJULFFBQTdDLElBQXlEbU4sbUJBQWhFO0VBREQ7O1VBSVNHLFdBQVQsR0FBdUIsVUFBUzdNLENBQVQsRUFBWTtTQUMzQkMsVUFBVUMsTUFBVixJQUFvQjJNLGNBQWM3TSxDQUFkLEVBQWlCVCxRQUFyQyxJQUFpRHNOLFdBQXhEO0VBREQ7O1VBSVM1SSxVQUFULEdBQXNCLFVBQVNqRSxDQUFULEVBQVk7U0FDMUJDLFVBQVVDLE1BQVYsSUFBb0IrRCxnQkFBYWpFLENBQWIsRUFBZ0JULFFBQXBDLElBQWdEMEUsYUFBdkQ7RUFERDs7VUFJU0MsZUFBVCxHQUEyQixVQUFTbEUsQ0FBVCxFQUFZO1NBQy9CQyxVQUFVQyxNQUFWLElBQW9CZ0Usa0JBQWtCbEUsQ0FBbEIsRUFBcUJULFFBQXpDLElBQXFEMkUsZUFBNUQ7RUFERDs7VUFJU0MsY0FBVCxHQUEwQixVQUFTbkUsQ0FBVCxFQUFZO1NBQzlCQyxVQUFVQyxNQUFWLElBQW9CaUUsaUJBQWlCbkUsQ0FBakIsRUFBb0JULFFBQXhDLElBQW9ENEUsY0FBM0Q7RUFERDs7VUFJUy9FLFFBQVQsR0FBb0IsVUFBU1ksQ0FBVCxFQUFZO1NBQ3hCQyxVQUFVQyxNQUFWLElBQW9CZCxXQUFXWSxDQUFYLEVBQWNULFFBQWxDLElBQThDSCxRQUFyRDtFQUREOztVQUlTZ0YsYUFBVCxHQUF5QixVQUFTcEUsQ0FBVCxFQUFZO1NBQzdCQyxVQUFVQyxNQUFWLElBQW9Ca0UsZ0JBQWdCcEUsQ0FBaEIsRUFBbUJULFFBQXZDLElBQW1ENkUsYUFBMUQ7RUFERDs7VUFJU0MsWUFBVCxHQUF3QixVQUFTckUsQ0FBVCxFQUFZO1NBQzVCQyxVQUFVQyxNQUFWLElBQW9CbUUsZUFBZXJFLENBQWYsRUFBa0JULFFBQXRDLElBQWtEOEUsWUFBekQ7RUFERDs7UUFJTzlFLFFBQVA7OztBQy9HYyxTQUFTcU8sTUFBVCxHQUFrQjs7S0FFNUJ6SyxPQUFKLEVBRUNFLEtBRkQsRUFFUUMsTUFGUixFQUdDdUssV0FIRCxFQUlDdEssTUFKRCxFQU1DQyxHQU5ELEVBTU1DLENBTk4sRUFNU0MsQ0FOVCxFQU1ZQyxFQU5aLEVBTWdCQyxLQU5oQixFQU11QkMsSUFOdkIsRUFPQ2tFLE1BUEQsRUFPU0MsTUFQVCxFQU9pQmxFLE9BUGpCLEVBTzBCQyxVQVAxQixFQVNDa0UsTUFURCxFQVNTakUsTUFUVCxFQVNpQmtFLE9BVGpCLEVBVUNDLE9BVkQsRUFVVUMsT0FWVixFQVVtQkMsUUFWbkIsRUFVNkIzRCxVQVY3QixFQVlDVCxhQVpELEVBWWFDLGVBWmIsRUFZOEJDLGNBWjlCLEVBY0MySixNQWRELEVBY1NDLE1BZFQsRUFjaUJDLE1BZGpCLEVBY3lCQyxNQWR6QixFQWNpQ0MsTUFkakMsRUFjeUNDLE1BZHpDLEVBY2lEQyxNQWRqRCxFQWN5REMsTUFkekQsRUFlQ2pQLFFBZkQsRUFlV2dGLGFBZlgsRUFlMEJDLFlBZjFCOztVQWlCUzlFLFFBQVQsQ0FBa0JDLFNBQWxCLEVBQTZCOzs7WUFHbEIyRCxXQUFXLFFBQXJCOztrQkFFYWMsaUJBQWMsVUFBU3JFLENBQVQsRUFBWTtVQUFTQSxFQUFFaUYsUUFBRixDQUFXLENBQVgsQ0FBUDtHQUF6QztvQkFDa0JYLG1CQUFtQixVQUFTdEUsQ0FBVCxFQUFZO1VBQVNBLEVBQUVpRixRQUFGLENBQVcsQ0FBWCxDQUFQO0dBQW5EO21CQUNpQlYsa0JBQWtCLFVBQVN2RSxDQUFULEVBQVk7VUFBU0EsRUFBRWlGLFFBQUYsQ0FBVyxDQUFYLENBQVA7R0FBakQ7O2FBRVd6RixZQUFZLFlBQVc7VUFBU0ssU0FBUDtHQUFwQztrQkFDZ0IyRSxpQkFBaUIsWUFBVztVQUFTM0UsU0FBUDtHQUE5QztpQkFDZTRFLGdCQUFnQixZQUFXO1VBQVM1RSxTQUFQO0dBQTVDOztZQUVVQyxJQUFWLENBQWUsVUFBU2tCLElBQVQsRUFBZTs7O09BRzFCaU4sZ0JBQWdCLGFBQW5CLEVBQWtDO1FBQzdCUyxRQUFRakwsUUFBUUMsTUFBcEI7O1lBRVEsS0FBS2lMLFdBQWI7YUFDU2xMLFFBQVFpTCxLQUFqQjs7OztPQUlFdkcsTUFBSCxFQUFXQSxPQUFPaEcsS0FBUCxDQUFhLENBQUMsQ0FBRCxFQUFJeEMsU0FBU3dGLFlBQVQsRUFBSixDQUFiO09BQ1JpRCxNQUFILEVBQVdBLE9BQU9qRyxLQUFQLENBQWEsQ0FBQ3hDLFNBQVMwRixhQUFULEVBQUQsRUFBMkIsQ0FBM0IsQ0FBYjs7O0lBR1YsQ0FBQzhDLE1BQUQsRUFBU3RFLENBQVQsQ0FBRCxFQUFjLENBQUN1RSxNQUFELEVBQVN0RSxDQUFULENBQWQsRUFBMkIsQ0FBQ0ksT0FBRCxFQUFVSCxFQUFWLENBQTNCLEVBQTBDLENBQUNJLFVBQUQsRUFBYUgsS0FBYixDQUExQyxFQUErRHFJLE9BQS9ELENBQXVFLFVBQVN1QyxDQUFULEVBQVk7UUFDL0VBLEVBQUUsQ0FBRixDQUFILEVBQVM7U0FDTEEsRUFBRSxDQUFGLEVBQUssU0FBTCxDQUFILEVBQW9CO1FBQ2pCLENBQUYsRUFBSzFNLE1BQUwsQ0FBWTBNLEVBQUUsQ0FBRixFQUFLLFNBQUwsRUFBZ0I3TyxJQUFoQixDQUFxQixJQUFyQixFQUEyQmlCLElBQTNCLEVBQWlDNE4sRUFBRSxDQUFGLENBQWpDLENBQVo7OztTQUdFQSxFQUFFLENBQUYsRUFBSyxRQUFMLENBQUgsRUFBbUI7UUFDaEIsQ0FBRixFQUFLek0sS0FBTCxDQUFXeU0sRUFBRSxDQUFGLEVBQUssUUFBTCxFQUFlN08sSUFBZixDQUFvQixJQUFwQixFQUEwQmlCLElBQTFCLEVBQWdDNE4sRUFBRSxDQUFGLEVBQUsxTSxNQUFMLEVBQWhDLENBQVg7OztJQVBIOzs7T0FhSThMLFNBQVMsQ0FBQ0UsTUFBRCxFQUFTQyxNQUFULEVBQWlCQyxNQUFqQixFQUF5QkMsTUFBekIsRUFBaUNDLE1BQWpDLEVBQXlDQyxNQUF6QyxFQUFpREMsTUFBakQsRUFBeURDLE1BQXpELEVBQ1hJLE1BRFcsQ0FDSixVQUFTdkwsS0FBVCxFQUFnQjtXQUNoQkEsVUFBVXpELFNBQVYsSUFBdUIsQ0FBQ3lELE1BQU1BLEtBQU4sR0FBYzRFLElBQTdDO0lBRlcsRUFJWHpDLElBSlcsQ0FJTixVQUFTbUcsQ0FBVCxFQUFZQyxDQUFaLEVBQWU7V0FDYixDQUFDRCxFQUFFdEksS0FBRixHQUFVMkUsTUFBVixJQUFvQixDQUFyQixLQUEyQjRELEVBQUV2SSxLQUFGLEdBQVUyRSxNQUFWLElBQW9CLENBQS9DLENBQVA7SUFMVyxFQU9YaEYsR0FQVyxDQU9QLFVBQVNLLEtBQVQsRUFBZ0I7UUFDakJBLE1BQU1HLEtBQU4sSUFBZSxDQUFDSCxNQUFNRyxLQUFOLEVBQW5CLEVBQWtDSCxNQUFNRyxLQUFOLENBQVk5RCxTQUFTd0YsWUFBVCxFQUFaO1FBQy9CN0IsTUFBTUksTUFBTixJQUFnQixDQUFDSixNQUFNSSxNQUFOLEVBQXBCLEVBQW9DSixNQUFNSSxNQUFOLENBQWEvRCxTQUFTMEYsYUFBVCxFQUFiO1FBQ2pDL0IsTUFBTUssTUFBTixJQUFnQixDQUFDTCxNQUFNSyxNQUFOLEVBQXBCLEVBQW9DTCxNQUFNSyxNQUFOLENBQWEsRUFBRW1FLEtBQUssQ0FBUCxFQUFVRixPQUFPLENBQWpCLEVBQW9CRyxRQUFRLENBQTVCLEVBQStCRixNQUFNLENBQXJDLEVBQWI7O0tBR25DLENBQUMsS0FBRCxFQUFRakUsR0FBUixDQURELEVBRUMsQ0FBQyxHQUFELEVBQU1DLENBQU4sQ0FGRCxFQUdDLENBQUMsR0FBRCxFQUFNQyxDQUFOLENBSEQsRUFJQyxDQUFDLElBQUQsRUFBT0MsRUFBUCxDQUpELEVBS0MsQ0FBQyxPQUFELEVBQVVDLEtBQVYsQ0FMRCxFQU1DLENBQUMsTUFBRCxFQUFTQyxJQUFULENBTkQsRUFRQyxDQUFDLFFBQUQsRUFBV29FLE1BQVgsQ0FSRCxFQVNDLENBQUMsUUFBRCxFQUFXakUsTUFBWCxDQVRELEVBVUMsQ0FBQyxTQUFELEVBQVlrRSxPQUFaLENBVkQsRUFZQyxDQUFDLFNBQUQsRUFBWUMsT0FBWixDQVpELEVBYUMsQ0FBQyxTQUFELEVBQVlDLE9BQVosQ0FiRCxFQWNDLENBQUMsVUFBRCxFQUFhQyxRQUFiLENBZEQsRUFlQyxDQUFDLFlBQUQsRUFBZTNELFVBQWYsQ0FmRCxFQWlCQyxDQUFDLFlBQUQsRUFBZVQsYUFBZixDQWpCRCxFQWtCQyxDQUFDLGlCQUFELEVBQW9CQyxlQUFwQixDQWxCRCxFQW1CQyxDQUFDLGdCQUFELEVBQW1CQyxjQUFuQixDQW5CRCxFQW9CRThILE9BcEJGLENBb0JVLFVBQVN1QyxDQUFULEVBQVk7U0FDbEJ0TCxNQUFNc0wsRUFBRSxDQUFGLENBQU4sS0FBZSxDQUFDdEwsTUFBTXNMLEVBQUUsQ0FBRixDQUFOLEdBQW5CLEVBQWtDdEwsTUFBTXNMLEVBQUUsQ0FBRixDQUFOLEVBQVlBLEVBQUUsQ0FBRixDQUFaO0tBckJuQzs7O1FBeUJHdEwsTUFBTTZFLE1BQVQsRUFBaUI7U0FDYixDQUFDN0UsTUFBTTZFLE1BQU4sRUFBSixFQUFvQjtZQUNiQSxNQUFOLENBQWFBLE1BQWI7TUFERCxNQUVPO1VBQ0g3RSxNQUFNNkUsTUFBTixHQUFlLFNBQWYsQ0FBSCxFQUE4QjthQUN2QkEsTUFBTixHQUFlakcsTUFBZixDQUFzQm9CLE1BQU02RSxNQUFOLEdBQWUsU0FBZixFQUEwQnBJLElBQTFCLENBQStCLElBQS9CLEVBQXFDaUIsSUFBckMsRUFBMkNzQyxNQUFNTyxDQUFOLEVBQTNDLENBQXRCOztZQUVLc0UsTUFBTixHQUFlaEcsS0FBZixDQUFxQixDQUFDLENBQUQsRUFBSXhDLFNBQVN3RixZQUFULEVBQUosQ0FBckI7Ozs7UUFJQzdCLE1BQU04RSxNQUFULEVBQWlCO1NBQ2IsQ0FBQzlFLE1BQU04RSxNQUFOLEVBQUosRUFBb0I7WUFDYkEsTUFBTixDQUFhQSxNQUFiO01BREQsTUFFTztVQUNIOUUsTUFBTThFLE1BQU4sR0FBZSxTQUFmLENBQUgsRUFBOEI7YUFDdkJBLE1BQU4sR0FBZWxHLE1BQWYsQ0FBc0JvQixNQUFNOEUsTUFBTixHQUFlLFNBQWYsRUFBMEJySSxJQUExQixDQUErQixJQUEvQixFQUFxQ2lCLElBQXJDLEVBQTJDc0MsTUFBTVEsQ0FBTixFQUEzQyxDQUF0Qjs7WUFFS3NFLE1BQU4sR0FBZWpHLEtBQWYsQ0FBcUIsQ0FBQ3hDLFNBQVMwRixhQUFULEVBQUQsRUFBMkIsQ0FBM0IsQ0FBckI7Ozs7UUFJQy9CLE1BQU1ZLE9BQVQsRUFBa0I7U0FDZCxDQUFDWixNQUFNWSxPQUFOLEVBQUosRUFBcUI7WUFDZEEsT0FBTixDQUFjQSxPQUFkO01BREQsTUFFTztVQUNIWixNQUFNWSxPQUFOLEdBQWdCLFNBQWhCLENBQUgsRUFBK0I7YUFDeEJBLE9BQU4sR0FBZ0JoQyxNQUFoQixDQUF1Qm9CLE1BQU1ZLE9BQU4sR0FBZ0IsU0FBaEIsRUFBMkJuRSxJQUEzQixDQUFnQyxJQUFoQyxFQUFzQ2lCLElBQXRDLEVBQTRDc0MsTUFBTVMsRUFBTixFQUE1QyxDQUF2Qjs7O1VBR0VULE1BQU1ZLE9BQU4sR0FBZ0IsUUFBaEIsQ0FBSCxFQUE4QjthQUN2QkEsT0FBTixHQUFnQi9CLEtBQWhCLENBQXNCbUIsTUFBTVksT0FBTixHQUFnQixRQUFoQixFQUEwQm5FLElBQTFCLENBQStCLElBQS9CLEVBQXFDaUIsSUFBckMsRUFBMkNzQyxNQUFNWSxPQUFOLEdBQWdCaEMsTUFBaEIsRUFBM0MsQ0FBdEI7Ozs7O1FBS0FvQixNQUFNYSxVQUFULEVBQXFCO1NBQ2pCLENBQUNiLE1BQU1hLFVBQU4sRUFBSixFQUF3QjtZQUNqQkEsVUFBTixDQUFpQkEsVUFBakI7TUFERCxNQUVPO1VBQ0hiLE1BQU1hLFVBQU4sR0FBbUIsU0FBbkIsQ0FBSCxFQUFrQzthQUMzQkEsVUFBTixHQUFtQmpDLE1BQW5CLENBQTBCb0IsTUFBTWEsVUFBTixHQUFtQixTQUFuQixFQUE4QnBFLElBQTlCLENBQW1DLElBQW5DLEVBQXlDaUIsSUFBekMsRUFBK0NzQyxNQUFNVSxLQUFOLEVBQS9DLENBQTFCOzs7VUFHRVYsTUFBTWEsVUFBTixHQUFtQixRQUFuQixDQUFILEVBQWlDO2FBQzFCQSxVQUFOLEdBQW1CaEMsS0FBbkIsQ0FBeUJtQixNQUFNYSxVQUFOLEdBQW1CLFFBQW5CLEVBQTZCcEUsSUFBN0IsQ0FBa0MsSUFBbEMsRUFBd0NpQixJQUF4QyxFQUE4Q3NDLE1BQU1hLFVBQU4sR0FBbUJqQyxNQUFuQixFQUE5QyxDQUF6Qjs7Ozs7V0FLSW9CLEtBQVA7SUF2RlcsQ0FBYjs7O1lBMkZTd0wsV0FBVCxDQUFxQjFJLElBQXJCLEVBQTJCMkksU0FBM0IsRUFBc0M7O1FBRWpDZixTQUFTNUgsS0FBS1MsU0FBTCxDQUFlLFFBQWYsQ0FBYixDQUZxQzs7O1dBSzlCN0YsSUFBUCxDQUFZK04sVUFBVTlMLEdBQVYsQ0FBYyxVQUFTeEMsQ0FBVCxFQUFZZ0MsQ0FBWixFQUFlO1lBQVNBLENBQVA7S0FBL0IsQ0FBWixFQUF5RHFFLEtBQXpELEdBQ0VOLE1BREYsQ0FDUyxHQURULEVBRUdDLElBRkgsQ0FFUSxPQUZSLEVBRWlCLFVBQVNoRyxDQUFULEVBQVk7WUFBUyxZQUFZQSxDQUFuQjtLQUYvQixFQUdHZ0csSUFISCxDQUdRLFdBSFIsRUFHcUIsVUFBU2hHLENBQVQsRUFBWTtTQUMxQmlGLFFBQVEsRUFBWjtTQUNDc0osWUFBWUQsVUFBVXRPLENBQVYsRUFBYTZDLEtBQWIsR0FBcUIwTCxTQURsQzs7U0FHR0EsU0FBSCxFQUFjO1VBQ1ZBLFVBQVVDLFNBQVYsS0FBd0JELFVBQVVDLFNBQVYsQ0FBb0JwTCxDQUFwQixJQUF5Qm1MLFVBQVVDLFNBQVYsQ0FBb0JuTCxDQUFyRSxDQUFILEVBQTRFO2dCQUNsRSxpQkFBaUJrTCxVQUFVQyxTQUFWLENBQW9CcEwsQ0FBcEIsSUFBeUIsQ0FBMUMsSUFBK0MsSUFBL0MsSUFBdURtTCxVQUFVQyxTQUFWLENBQW9CbkwsQ0FBcEIsSUFBeUIsQ0FBaEYsSUFBcUYsR0FBOUY7OztVQUdFa0wsVUFBVS9NLEtBQVYsS0FBb0IrTSxVQUFVL00sS0FBVixDQUFnQjRCLENBQWhCLElBQXFCbUwsVUFBVS9NLEtBQVYsQ0FBZ0I2QixDQUF6RCxDQUFILEVBQWdFO2dCQUN0RCxhQUFha0wsVUFBVS9NLEtBQVYsQ0FBZ0I0QixDQUFoQixJQUFxQixDQUFsQyxJQUF1QyxJQUF2QyxJQUErQ21MLFVBQVUvTSxLQUFWLENBQWdCNkIsQ0FBaEIsSUFBcUIsQ0FBcEUsSUFBeUUsR0FBbEY7OztVQUdFa0wsVUFBVTdCLE1BQVYsSUFBb0I2QixVQUFVN0IsTUFBVixDQUFpQnZCLENBQXhDLEVBQTJDO2dCQUNqQyxjQUFjb0QsVUFBVTdCLE1BQVYsQ0FBaUJ2QixDQUFqQixJQUFzQixDQUFwQyxJQUF5QyxJQUF6QyxJQUFpRG9ELFVBQVU3QixNQUFWLENBQWlCdEosQ0FBakIsSUFBc0IsQ0FBdkUsSUFBNEUsSUFBNUUsSUFBb0ZtTCxVQUFVN0IsTUFBVixDQUFpQnJKLENBQWpCLElBQXNCLENBQTFHLElBQStHLEdBQXhIOzs7O1lBSUs0QixVQUFVLEVBQVYsR0FBZUEsTUFBTXZFLElBQU4sRUFBZixHQUE4QnRCLFNBQXJDO0tBckJIOztTQXdCS2dILFNBQUwsQ0FBZSxRQUFmLEVBQXlCL0csSUFBekIsQ0FBOEIsVUFBU0gsUUFBVCxFQUFtQnNCLEtBQW5CLEVBQTBCO2NBQ3ZELENBQVUsSUFBVixFQUFnQkcsS0FBaEIsQ0FBc0JKLElBQXRCLEVBQTRCakIsSUFBNUIsQ0FBaUNnUCxVQUFVOU4sS0FBVixDQUFqQztLQUREOzs7V0FLT3VHLElBQVAsR0FDRUMsTUFERjs7OztZQUtELENBQVUsSUFBVixFQUFnQlosU0FBaEIsQ0FBMEIsVUFBMUIsRUFBc0M3RixJQUF0QyxDQUEyQyxDQUFDLENBQUQsQ0FBM0MsRUFBZ0Q4RixLQUFoRCxHQUNFTixNQURGLENBQ1MsR0FEVCxFQUVHQyxJQUZILENBRVEsT0FGUixFQUVpQixTQUZqQixFQUU0QnlJLElBRjVCLENBRWlDLFFBRmpDOztPQUlJQyxPQUFPQyxNQUNUN0wsT0FEUyxDQUNEQSxPQURDLEVBRVRFLEtBRlMsQ0FFSHdLLGdCQUFnQixhQUFoQixHQUFnQ3BPLFNBQWhDLEdBQTRDNEQsS0FGekMsRUFHVEMsTUFIUyxDQUdGdUssZ0JBQWdCLGFBQWhCLEdBQWdDcE8sU0FBaEMsR0FBNEM2RCxNQUgxQyxFQUlUbUssT0FKUyxDQUlELEVBQUUsS0FBSyxDQUFQLEVBQVUsS0FBSyxDQUFmLEVBQWtCLFNBQVNwSyxLQUEzQixFQUFrQyxVQUFVQyxNQUE1QyxFQUpDLENBQVg7O09BTUlrSyxTQUFNM04sU0FBQSxDQUFVLElBQVYsRUFBZ0JtQixLQUFoQixDQUFzQixDQUFDLENBQUQsQ0FBdEIsRUFBMkJyQixJQUEzQixDQUFnQ29QLElBQWhDLEVBQXNDN0ksTUFBdEMsQ0FBNkMsS0FBN0MsQ0FBVjtPQUNDK0ksT0FBT3pCLE9BQUkvRyxTQUFKLENBQWMsT0FBZCxFQUF1QjdGLElBQXZCLENBQTRCLENBQUMsQ0FBRCxDQUE1QixDQURSOztRQUdLOEYsS0FBTCxHQUNFTixNQURGLENBQ1MsR0FEVCxFQUVHQyxJQUZILENBRVEsT0FGUixFQUVpQixNQUZqQixFQUdHQSxJQUhILENBR1EsV0FIUixFQUdxQixlQUFlOUMsT0FBT2tFLElBQXRCLEdBQTZCLEdBQTdCLEdBQW1DbEUsT0FBT21FLEdBQTFDLEdBQWdELEdBSHJFOztlQUtZN0gsU0FBQSxDQUFVLElBQVYsRUFBZ0I0RyxTQUFoQixDQUEwQixPQUExQixDQUFaLEVBQWdEbUgsTUFBaEQ7R0FoTEQ7OztVQW9MUXpLLE9BQVQsR0FBbUIsVUFBU25ELENBQVQsRUFBWTtTQUN2QkMsVUFBVUMsTUFBVixJQUFvQmlELFVBQVVuRCxDQUFWLEVBQWFULFFBQWpDLElBQTZDNEQsT0FBcEQ7RUFERDs7VUFJU0UsS0FBVCxHQUFpQixVQUFTckQsQ0FBVCxFQUFZO1NBQ3JCQyxVQUFVQyxNQUFWLElBQW9CbUQsUUFBUXJELENBQVIsRUFBV1QsUUFBL0IsSUFBMkM4RCxLQUFsRDtFQUREOztVQUlTQyxNQUFULEdBQWtCLFVBQVN0RCxDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0JvRCxTQUFTdEQsQ0FBVCxFQUFZVCxRQUFoQyxJQUE0QytELE1BQW5EO0VBREQ7O1VBSVN1SyxXQUFULEdBQXVCLFVBQVM3TixDQUFULEVBQVk7U0FDM0JDLFVBQVVDLE1BQVYsSUFBb0IyTixjQUFjN04sQ0FBZCxFQUFpQlQsUUFBckMsSUFBaURzTyxXQUF4RDtFQUREOztVQUlTdEssTUFBVCxHQUFrQixVQUFTdkQsQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9CcUQsU0FBU3ZELENBQVQsRUFBWVQsUUFBaEMsSUFBNENnRSxNQUFuRDtFQUREOztVQUlTMkwsU0FBVCxHQUFxQixVQUFTbFAsQ0FBVCxFQUFZO1NBQ3pCQyxVQUFVQyxNQUFWLElBQW9CcUQsT0FBT21FLEdBQVAsR0FBYTFILENBQWIsRUFBZ0JULFFBQXBDLElBQWdEZ0UsT0FBT21FLEdBQTlEO0VBREQ7O1VBSVN5SCxXQUFULEdBQXVCLFVBQVNuUCxDQUFULEVBQVk7U0FDM0JDLFVBQVVDLE1BQVYsSUFBb0JxRCxPQUFPaUUsS0FBUCxHQUFleEgsQ0FBZixFQUFrQlQsUUFBdEMsSUFBa0RnRSxPQUFPaUUsS0FBaEU7RUFERDs7VUFJUzRILFlBQVQsR0FBd0IsVUFBU3BQLENBQVQsRUFBWTtTQUM1QkMsVUFBVUMsTUFBVixJQUFvQnFELE9BQU9vRSxNQUFQLEdBQWdCM0gsQ0FBaEIsRUFBbUJULFFBQXZDLElBQW1EZ0UsT0FBT29FLE1BQWpFO0VBREQ7O1VBSVMwSCxVQUFULEdBQXNCLFVBQVNyUCxDQUFULEVBQVk7U0FDMUJDLFVBQVVDLE1BQVYsSUFBb0JxRCxPQUFPK0wsSUFBUCxHQUFjdFAsQ0FBZCxFQUFpQlQsUUFBckMsSUFBaURnRSxPQUFPK0wsSUFBL0Q7RUFERDs7VUFJU3ZLLFlBQVQsR0FBd0IsWUFBVztTQUMzQjFCLFFBQVFFLE9BQU9pRSxLQUFmLEdBQXVCakUsT0FBT2tFLElBQXJDO0VBREQ7O1VBSVN4QyxhQUFULEdBQXlCLFlBQVc7U0FDNUIzQixTQUFTQyxPQUFPbUUsR0FBaEIsR0FBc0JuRSxPQUFPb0UsTUFBcEM7RUFERDs7VUFJU25FLEdBQVQsR0FBZSxVQUFTeEQsQ0FBVCxFQUFZO1NBQ25CQyxVQUFVQyxNQUFWLElBQW9Cc0QsTUFBTXhELENBQU4sRUFBU1QsUUFBN0IsSUFBeUNpRSxHQUFoRDtFQUREOztVQUlTQyxDQUFULEdBQWEsVUFBU3pELENBQVQsRUFBWTtTQUNqQkMsVUFBVUMsTUFBVixJQUFvQnVELElBQUl6RCxDQUFKLEVBQU9ULFFBQTNCLElBQXVDa0UsQ0FBOUM7RUFERDs7VUFJU0MsQ0FBVCxHQUFhLFVBQVMxRCxDQUFULEVBQVk7U0FDakJDLFVBQVVDLE1BQVYsSUFBb0J3RCxJQUFJMUQsQ0FBSixFQUFPVCxRQUEzQixJQUF1Q21FLENBQTlDO0VBREQ7O1VBSVNDLEVBQVQsR0FBYyxVQUFTM0QsQ0FBVCxFQUFZO1NBQ2xCQyxVQUFVQyxNQUFWLElBQW9CeUQsS0FBSzNELENBQUwsRUFBUVQsUUFBNUIsSUFBd0NvRSxFQUEvQztFQUREOztVQUlTQyxLQUFULEdBQWlCLFVBQVM1RCxDQUFULEVBQVk7U0FDckJDLFVBQVVDLE1BQVYsSUFBb0IwRCxRQUFRNUQsQ0FBUixFQUFXVCxRQUEvQixJQUEyQ3FFLEtBQWxEO0VBREQ7O1VBSVNDLElBQVQsR0FBZ0IsVUFBUzdELENBQVQsRUFBWTtTQUNwQkMsVUFBVUMsTUFBVixJQUFvQjJELE9BQU83RCxDQUFQLEVBQVVULFFBQTlCLElBQTBDc0UsSUFBakQ7RUFERDs7VUFJU2tFLE1BQVQsR0FBa0IsVUFBUy9ILENBQVQsRUFBWTtTQUN0QkMsVUFBVUMsTUFBVixJQUFvQjZILFNBQVMvSCxDQUFULEVBQVlULFFBQWhDLElBQTRDd0ksTUFBbkQ7RUFERDs7VUFJU0MsTUFBVCxHQUFrQixVQUFTaEksQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9COEgsU0FBU2hJLENBQVQsRUFBWVQsUUFBaEMsSUFBNEN5SSxNQUFuRDtFQUREOztVQUlTbEUsT0FBVCxHQUFtQixVQUFTOUQsQ0FBVCxFQUFZO1NBQ3ZCQyxVQUFVQyxNQUFWLElBQW9CNEQsVUFBVTlELENBQVYsRUFBYVQsUUFBakMsSUFBNkN1RSxPQUFwRDtFQUREOztVQUlTQyxVQUFULEdBQXNCLFVBQVMvRCxDQUFULEVBQVk7U0FDMUJDLFVBQVVDLE1BQVYsSUFBb0I2RCxhQUFhL0QsQ0FBYixFQUFnQlQsUUFBcEMsSUFBZ0R3RSxVQUF2RDtFQUREOztVQUlTa0UsTUFBVCxHQUFrQixVQUFTakksQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9CK0gsU0FBU2pJLENBQVQsRUFBWVQsUUFBaEMsSUFBNEMwSSxNQUFuRDtFQUREOztVQUlTakUsTUFBVCxHQUFrQixVQUFTaEUsQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9COEQsU0FBU2hFLENBQVQsRUFBWVQsUUFBaEMsSUFBNEN5RSxNQUFuRDtFQUREOztVQUlTa0UsT0FBVCxHQUFtQixVQUFTbEksQ0FBVCxFQUFZO1NBQ3ZCQyxVQUFVQyxNQUFWLElBQW9CZ0ksVUFBVWxJLENBQVYsRUFBYVQsUUFBakMsSUFBNkMySSxPQUFwRDtFQUREOztVQUlTQyxPQUFULEdBQW1CLFVBQVNuSSxDQUFULEVBQVk7U0FDdkJDLFVBQVVDLE1BQVYsSUFBb0JpSSxVQUFVbkksQ0FBVixFQUFhVCxRQUFqQyxJQUE2QzRJLE9BQXBEO0VBREQ7O1VBSVNDLE9BQVQsR0FBbUIsVUFBU3BJLENBQVQsRUFBWTtTQUN2QkMsVUFBVUMsTUFBVixJQUFvQmtJLFVBQVVwSSxDQUFWLEVBQWFULFFBQWpDLElBQTZDNkksT0FBcEQ7RUFERDs7VUFJU0MsUUFBVCxHQUFvQixVQUFTckksQ0FBVCxFQUFZO1NBQ3hCQyxVQUFVQyxNQUFWLElBQW9CbUksV0FBV3JJLENBQVgsRUFBY1QsUUFBbEMsSUFBOEM4SSxRQUFyRDtFQUREOztVQUlTM0QsVUFBVCxHQUFzQixVQUFTMUUsQ0FBVCxFQUFZO1NBQzFCQyxVQUFVQyxNQUFWLElBQW9Cd0UsYUFBYTFFLENBQWIsRUFBZ0JULFFBQXBDLElBQWdEbUYsVUFBdkQ7RUFERDs7VUFJU1QsVUFBVCxHQUFzQixVQUFTakUsQ0FBVCxFQUFZO1NBQzFCQyxVQUFVQyxNQUFWLElBQW9CK0QsZ0JBQWFqRSxDQUFiLEVBQWdCVCxRQUFwQyxJQUFnRDBFLGFBQXZEO0VBREQ7O1VBSVNDLGVBQVQsR0FBMkIsVUFBU2xFLENBQVQsRUFBWTtTQUMvQkMsVUFBVUMsTUFBVixJQUFvQmdFLGtCQUFrQmxFLENBQWxCLEVBQXFCVCxRQUF6QyxJQUFxRDJFLGVBQTVEO0VBREQ7O1VBSVNDLGNBQVQsR0FBMEIsVUFBU25FLENBQVQsRUFBWTtTQUM5QkMsVUFBVUMsTUFBVixJQUFvQmlFLGlCQUFpQm5FLENBQWpCLEVBQW9CVCxRQUF4QyxJQUFvRDRFLGNBQTNEO0VBREQ7O1VBSVMvRSxRQUFULEdBQW9CLFVBQVNZLENBQVQsRUFBWTtTQUN4QkMsVUFBVUMsTUFBVixJQUFvQmQsV0FBV1ksQ0FBWCxFQUFjVCxRQUFsQyxJQUE4Q0gsUUFBckQ7RUFERDs7VUFJU2dGLGFBQVQsR0FBeUIsVUFBU3BFLENBQVQsRUFBWTtTQUM3QkMsVUFBVUMsTUFBVixJQUFvQmtFLGdCQUFnQnBFLENBQWhCLEVBQW1CVCxRQUF2QyxJQUFtRDZFLGFBQTFEO0VBREQ7O1VBSVNDLFlBQVQsR0FBd0IsVUFBU3JFLENBQVQsRUFBWTtTQUM1QkMsVUFBVUMsTUFBVixJQUFvQm1FLGVBQWVyRSxDQUFmLEVBQWtCVCxRQUF0QyxJQUFrRDhFLFlBQXpEO0VBREQ7O1VBSVN5SixNQUFULEdBQWtCLFVBQVM5TixDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0I0TixTQUFTOU4sQ0FBVCxFQUFZVCxRQUFoQyxJQUE0Q3VPLE1BQW5EO0VBREQ7O1VBSVNDLE1BQVQsR0FBa0IsVUFBUy9OLENBQVQsRUFBWTtTQUN0QkMsVUFBVUMsTUFBVixJQUFvQjZOLFNBQVMvTixDQUFULEVBQVlULFFBQWhDLElBQTRDd08sTUFBbkQ7RUFERDs7VUFJU0MsTUFBVCxHQUFrQixVQUFTaE8sQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9COE4sU0FBU2hPLENBQVQsRUFBWVQsUUFBaEMsSUFBNEN5TyxNQUFuRDtFQUREOztVQUlTQyxNQUFULEdBQWtCLFVBQVNqTyxDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0IrTixTQUFTak8sQ0FBVCxFQUFZVCxRQUFoQyxJQUE0QzBPLE1BQW5EO0VBREQ7O1VBSVNDLE1BQVQsR0FBa0IsVUFBU2xPLENBQVQsRUFBWTtTQUN0QkMsVUFBVUMsTUFBVixJQUFvQmdPLFNBQVNsTyxDQUFULEVBQVlULFFBQWhDLElBQTRDMk8sTUFBbkQ7RUFERDs7VUFJU0MsTUFBVCxHQUFrQixVQUFTbk8sQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9CaU8sU0FBU25PLENBQVQsRUFBWVQsUUFBaEMsSUFBNEM0TyxNQUFuRDtFQUREOztVQUlTQyxNQUFULEdBQWtCLFVBQVNwTyxDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0JrTyxTQUFTcE8sQ0FBVCxFQUFZVCxRQUFoQyxJQUE0QzZPLE1BQW5EO0VBREQ7O1VBSVNDLE1BQVQsR0FBa0IsVUFBU3JPLENBQVQsRUFBWTtTQUN0QkMsVUFBVUMsTUFBVixJQUFvQm1PLFNBQVNyTyxDQUFULEVBQVlULFFBQWhDLElBQTRDOE8sTUFBbkQ7RUFERDs7UUFJTzlPLFFBQVA7Ozs7Ozs7OztBQy9YTSxTQUFTZ1EsTUFBVCxDQUFnQkMsTUFBaEIsRUFBd0JDLE1BQXhCLEVBQWdDOztLQUVsQ0QsV0FBVy9QLFNBQWYsRUFBMEI7U0FDbEJnUSxNQUFQOzs7TUFHSSxJQUFJQyxDQUFULElBQWNELE1BQWQsRUFBc0I7TUFDakJBLE9BQU9FLGNBQVAsQ0FBc0JELENBQXRCLENBQUosRUFBOEI7T0FDekJFLFFBQU9ILE9BQU9DLENBQVAsQ0FBUCxLQUFvQixRQUF4QixFQUFrQztXQUMxQkEsQ0FBUCxJQUFZSCxPQUFPQyxPQUFPRSxDQUFQLENBQVAsRUFBa0JELE9BQU9DLENBQVAsQ0FBbEIsQ0FBWjtJQURELE1BRU87V0FDQ0EsQ0FBUCxJQUFZRCxPQUFPQyxDQUFQLENBQVo7Ozs7UUFJSUYsTUFBUDs7O0FBR0QsQUFBTyxTQUFTSyxJQUFULENBQWNDLElBQWQsRUFBb0JDLEdBQXBCLEVBQXlCO0tBQzNCQyxVQUFVLEVBQWQ7O01BRUksSUFBSU4sQ0FBUixJQUFhSyxHQUFiLEVBQWtCO01BQ2QsQ0FBQ0QsSUFBRCxJQUFTQSxLQUFLSixDQUFMLE1BQVlLLElBQUlMLENBQUosQ0FBeEIsRUFBZ0M7T0FDNUJFLFFBQU9HLElBQUlMLENBQUosQ0FBUCxLQUFpQixRQUFwQixrQ0FBOEQ7WUFDdERJLFFBQVEsRUFBZjtTQUNJdEIsSUFBSXFCLEtBQUtDLEtBQUtKLENBQUwsQ0FBTCxFQUFjSyxJQUFJTCxDQUFKLENBQWQsQ0FBUjtTQUNHLENBQUNPLFFBQVF6QixDQUFSLENBQUosRUFDQ3dCLFFBQVFOLENBQVIsSUFBYWxCLENBQWI7S0FKRixNQUtPO1lBQ0VrQixDQUFSLElBQWFLLElBQUlMLENBQUosQ0FBYjs7OztRQUlJTSxPQUFQOzs7O0FBSUQsQUFBTyxTQUFTRSxPQUFULENBQWlCQyxNQUFqQixFQUF5QkMsU0FBekIsRUFBb0M7YUFDOUJBLGFBQWEsR0FBekI7S0FDSUMsU0FBUyxFQUFiOztVQUVTckUsT0FBVCxDQUFpQnNFLE9BQWpCLEVBQTBCQyxRQUExQixFQUFvQztNQUNoQ0MsT0FBT0YsT0FBUCxNQUFvQkEsT0FBdkIsRUFBZ0M7VUFDeEJDLFFBQVAsSUFBbUJELE9BQW5CO0dBREQsTUFFTyxJQUFHRyxNQUFNQyxPQUFOLENBQWNKLE9BQWQsQ0FBSCxFQUEyQjtRQUM3QixJQUFJak8sSUFBSSxDQUFSLEVBQVdzTyxJQUFJTCxRQUFRcFEsTUFBM0IsRUFBbUNtQyxJQUFJc08sQ0FBdkMsRUFBMEN0TyxHQUExQztZQUNTaU8sUUFBUWpPLENBQVIsQ0FBUixFQUFvQmtPLFdBQVcsR0FBWCxHQUFpQmxPLENBQWpCLEdBQXFCLEdBQXpDO0lBQ0QsSUFBSXNPLE1BQU0sQ0FBVixFQUNDTixPQUFPRSxRQUFQLElBQW1CLEVBQW5CO0dBSkssTUFLQTtPQUNGTixVQUFVLElBQWQ7UUFDSSxJQUFJUCxDQUFSLElBQWFZLE9BQWIsRUFBc0I7Y0FDWCxLQUFWO1lBQ1FBLFFBQVFaLENBQVIsQ0FBUixFQUFvQmEsV0FBV0EsV0FBV0gsU0FBWCxHQUF1QlYsQ0FBbEMsR0FBc0NBLENBQTFEOztPQUVFTyxXQUFXTSxRQUFkLEVBQXdCRixPQUFPRSxRQUFQLElBQW1CLEVBQW5COzs7U0FHbEJKLE1BQVIsRUFBZ0IsRUFBaEI7UUFDT0UsTUFBUDs7OztBQUlELEFBQU8sU0FBU08sU0FBVCxDQUFtQlQsTUFBbkIsRUFBMkJDLFNBQTNCLEVBQXNDO2FBQ2hDQSxhQUFhLEdBQXpCOztLQUVJSSxPQUFPTCxNQUFQLE1BQW1CQSxNQUFuQixJQUE2Qk0sTUFBTUMsT0FBTixDQUFjUCxNQUFkLENBQWpDLEVBQ0MsT0FBT0EsTUFBUDs7S0FFR1UsUUFBUSxJQUFJQyxNQUFKLENBQVcsWUFBWVYsU0FBWixHQUF3Qix3QkFBbkMsRUFBNkQsR0FBN0QsQ0FBWjtLQUNDQyxTQUFTLEVBRFY7O01BR0ksSUFBSVgsQ0FBUixJQUFhUyxNQUFiLEVBQXFCO01BQ2hCRyxVQUFVRCxNQUFkO01BQ0NFLFdBQVcsRUFEWjtNQUVDUSxJQUFJRixNQUFNRyxJQUFOLENBQVd0QixDQUFYLENBRkw7U0FHTXFCLENBQU4sRUFBUzthQUNFVCxRQUFRQyxRQUFSLE1BQXNCRCxRQUFRQyxRQUFSLElBQXFCUSxFQUFFLENBQUYsSUFBTyxFQUFQLEdBQVksRUFBdkQsQ0FBVjtjQUNXQSxFQUFFLENBQUYsS0FBUUEsRUFBRSxDQUFGLENBQW5CO09BQ0lGLE1BQU1HLElBQU4sQ0FBV3RCLENBQVgsQ0FBSjs7VUFFT2EsUUFBUixJQUFvQkosT0FBT1QsQ0FBUCxDQUFwQjs7UUFFTVcsT0FBTyxFQUFQLEtBQWNBLE1BQXJCOzs7QUFHRCxBQUFPLFNBQVNKLE9BQVQsQ0FBaUJnQixDQUFqQixFQUFvQjtRQUNuQixRQUFPQSxDQUFQLHlDQUFPQSxDQUFQLE9BQWEsUUFBYixLQUEwQkEsTUFBTSxJQUFOLElBQWNULE9BQU9sTyxJQUFQLENBQVkyTyxDQUFaLEVBQWUvUSxNQUFmLEtBQTBCLENBQWxFLENBQVA7OztBQUdELEFBQU8sU0FBU2dSLFNBQVQsQ0FBbUJmLE1BQW5CLEVBQTJCZ0IsSUFBM0IsRUFBaUM7S0FDbkNDLFFBQVFELEtBQUtFLEtBQUwsQ0FBVyxHQUFYLENBQVo7S0FDQ2YsVUFBVUgsTUFEWDs7TUFHSSxJQUFJOU4sSUFBSSxDQUFaLEVBQWVBLElBQUkrTyxNQUFNbFIsTUFBekIsRUFBaUMsRUFBRW1DLENBQW5DLEVBQXNDO01BQ2xDaU8sUUFBUWMsTUFBTS9PLENBQU4sQ0FBUixLQUFxQjVDLFNBQXhCLEVBQW1DO1VBQzNCQSxTQUFQO0dBREQsTUFFTzthQUNJNlEsUUFBUWMsTUFBTS9PLENBQU4sQ0FBUixDQUFWOzs7UUFHS2lPLE9BQVA7Ozs7QUFJRCxBQUFPLFNBQVNnQixvQkFBVCxDQUE4QkMsT0FBOUIsRUFBdUNDLFFBQXZDLEVBQWlEOztVQUU5Q0MsYUFBVCxDQUF1QmpHLENBQXZCLEVBQTBCQyxDQUExQixFQUE2Qjs7T0FDeEIsSUFBSXBKLElBQUksQ0FBUixFQUFXcVAsTUFBTWxHLEVBQUV0TCxNQUF2QixFQUErQm1DLElBQUlxUCxHQUFuQyxFQUF3Q3JQLEdBQXhDLEVBQThDO09BQzFDbUosRUFBRW5KLENBQUYsS0FBUW9KLENBQVgsRUFBYyxPQUFPLElBQVA7O1NBRVIsS0FBUDs7O0tBR0drRyxVQUFVSixPQUFkOzs7UUFHTUksV0FBV0EsUUFBUUMsUUFBUixLQUFxQixDQUFoQyxJQUFxQ0QsUUFBUUMsUUFBUixLQUFxQixFQUFoRSxFQUFvRTtZQUN6REQsUUFBUUUsVUFBbEI7OztLQUdFRixPQUFILEVBQVk7TUFDUEcsTUFBTUgsUUFBUUksZ0JBQVIsQ0FBeUJQLFFBQXpCLENBQVY7TUFDQ2xCLFVBQVVpQixRQUFRTSxVQURuQjs7U0FHTXZCLFdBQVcsQ0FBQ21CLGNBQWNLLEdBQWQsRUFBbUJ4QixPQUFuQixDQUFsQixFQUErQzs7YUFDcENBLFFBQVF1QixVQUFsQjs7U0FFTXZCLE9BQVAsQ0FQVzs7UUFTTCxJQUFQOzs7c0RBSUQsQUFBTzs7QUNuSVAsSUFBSTBCLFdBQVcsSUFBZjtJQUNDQyxTQUFTLEtBRFY7SUFFQ0MsWUFBWSxFQUZiOztBQUlBLEFBQU8sU0FBU0MsVUFBVCxHQUFzQjs7S0FFekJILFFBQUgsRUFBYSxPQUFPQSxRQUFQOztZQUVGOztTQUVILGVBQVNoUyxDQUFULEVBQVk7VUFDWEMsVUFBVUMsTUFBVixJQUFvQitSLFNBQVNqUyxDQUFULEVBQVksSUFBaEMsSUFBd0NpUyxNQUEvQztHQUhTOztZQU1BLGtCQUFTalMsQ0FBVCxFQUFZO1VBQ2RDLFVBQVVDLE1BQVYsSUFBb0JnUyxZQUFZbFMsQ0FBWixFQUFlLElBQW5DLElBQTJDa1MsU0FBbEQ7R0FQUzs7UUFVSixjQUFTakIsQ0FBVCxFQUFZOztPQUVibUIsT0FBTyxJQUFYOztPQUVHbkIsRUFBRW9CLE1BQUYsSUFBWXBCLEVBQUVvQixNQUFGLENBQVNuUyxNQUFULEdBQWtCLENBQWpDLEVBQW9DO1NBQy9CLElBQUltQyxDQUFSLElBQWE0TyxFQUFFb0IsTUFBZixFQUF1QjtTQUNsQkMsUUFBUXJCLEVBQUVvQixNQUFGLENBQVNoUSxDQUFULENBQVo7O1NBRUcsUUFBT2lRLEtBQVAseUNBQU9BLEtBQVAsT0FBaUIsUUFBcEIsRUFBOEI7V0FDeEJDLE1BQUwsQ0FBWUQsS0FBWjtNQURELE1BRU87O1dBRURDLE1BQUwsQ0FBWXJCLFVBQVVzQixTQUFTLGFBQVQsR0FBVixFQUFxQ0YsS0FBckMsQ0FBWjs7Ozs7T0FNQXJCLEVBQUV3QixVQUFGLElBQWdCeEIsRUFBRXdCLFVBQUYsQ0FBYXZTLE1BQWIsR0FBc0IsQ0FBekMsRUFBNEM7O1FBRXZDd1MsV0FBUTdTLFFBQUEsRUFBWjs7U0FFSSxJQUFJOFMsQ0FBUixJQUFhMUIsRUFBRXdCLFVBQWYsRUFBMkI7Y0FDcEJHLEtBQU4sQ0FBWS9TLE9BQVosRUFBcUJvUixFQUFFd0IsVUFBRixDQUFhRSxDQUFiLENBQXJCOzs7YUFHS0UsUUFBTixDQUFlLFVBQVN2UixLQUFULEVBQWdCK08sTUFBaEIsRUFBd0I7U0FDbkMvTyxLQUFILEVBQVUsTUFBTUEsS0FBTjs7VUFFTixJQUFJd1IsQ0FBUixJQUFhekMsTUFBYixFQUFxQjtXQUNma0MsTUFBTCxDQUFZbEMsT0FBT3lDLENBQVAsQ0FBWjtVQUNHLENBQUNBLENBQUQsS0FBT3pDLE9BQU9uUSxNQUFQLEdBQWdCLENBQTFCLEVBQTZCO1lBQ3ZCcVMsTUFBTCxDQUFZdEIsRUFBRThCLFVBQWQ7WUFDS1gsSUFBTDs7O0tBUEg7SUFSRCxNQW1CTztTQUNERyxNQUFMLENBQVl0QixFQUFFOEIsVUFBZDtTQUNLLElBQUw7OztZQUdRQyxJQUFULENBQWMvQixDQUFkLEVBQWlCO1FBQ2IsOEJBQThCZ0MsSUFBOUIsQ0FBbUN2RixTQUFTd0YsVUFBNUMsQ0FBSCxFQUE0RDtPQUN6REMsS0FBRixDQUFRLElBQVIsRUFBY0MsT0FBZCxDQUFzQjFGLFFBQXRCO0tBREQsTUFFTztjQUNHMkYsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQVc7UUFDdERGLEtBQUYsQ0FBUSxJQUFSLEVBQWNDLE9BQWQsQ0FBc0IxRixRQUF0QjtNQUREOzs7O1VBTUssSUFBUDtHQTlEUzs7T0FpRUwsYUFBU2xLLEdBQVQsRUFBY3lOLENBQWQsRUFBaUI7T0FDbEIsQ0FBQ0EsRUFBRXFDLE1BQUgsSUFBYXJDLEVBQUUsVUFBRixDQUFoQixFQUErQjtNQUM1QnFDLE1BQUYsR0FBVyxZQUFXO1lBQVNqUyxLQUFLUCxLQUFMLENBQVdPLEtBQUtrUyxTQUFMLENBQWV0QyxFQUFFLFVBQUYsQ0FBZixDQUFYLENBQVA7S0FBeEI7O2FBRVN6TixHQUFWLElBQWlCeU4sQ0FBakI7VUFDTyxJQUFQO0dBdEVTOztVQXlFRixnQkFBU0EsQ0FBVCxFQUFZOztPQUVoQixDQUFDQSxDQUFKLEVBQU8sT0FBTyxJQUFQOztPQUVKUixNQUFNQyxPQUFOLENBQWNPLENBQWQsQ0FBSCxFQUFxQjtTQUNoQixJQUFJNU8sQ0FBUixJQUFhNE8sQ0FBYixFQUFnQjtVQUNWc0IsTUFBTCxDQUFZdEIsRUFBRTVPLENBQUYsQ0FBWjs7SUFGRixNQUlPO1NBQ0YsSUFBSW1CLEdBQVIsSUFBZXlOLENBQWYsRUFBa0I7VUFDWnVDLEdBQUwsQ0FBU2hRLEdBQVQsRUFBY3lOLEVBQUV6TixHQUFGLENBQWQ7Ozs7VUFJSyxJQUFQO0dBdkZTOztVQTBGRixnQkFBU0EsR0FBVCxFQUFjO1VBQ2QwTyxVQUFVMU8sR0FBVixDQUFQO0dBM0ZTOztVQThGRixnQkFBUzJILElBQVQsRUFBZTdGLEtBQWYsRUFBc0JtTyxPQUF0QixFQUErQjtPQUNuQ3hULFVBQVVDLE1BQVYsR0FBbUIsQ0FBdEIsRUFBeUI7V0FDakIsS0FBS29ULE1BQUwsQ0FBWSxJQUFaLEVBQWtCclQsVUFBVSxDQUFWLENBQWxCLEVBQWdDd1QsT0FBaEMsQ0FBUDs7O09BR0VuTyxLQUFILEVBQVU7UUFDTkEsTUFBTW9PLElBQVQsRUFBZTtTQUNWQSxPQUFPLEtBQUtDLE1BQUwsQ0FBWXJPLE1BQU1vTyxJQUFsQixDQUFYO1NBQ0dBLFNBQVNqVSxTQUFaLEVBQXVCO1lBQ2hCLG9CQUFvQjZGLE1BQU1vTyxJQUExQixHQUFpQyxHQUF2Qzs7WUFFTSxPQUFPQSxLQUFLSixNQUFaLEtBQXVCLFVBQXZCLEdBQW9DSSxLQUFLSixNQUFMLENBQVksSUFBWixFQUFrQixNQUFsQixFQUEwQmhPLEtBQTFCLEVBQWlDbU8sT0FBakMsQ0FBcEMsR0FBZ0ZDLEtBQUtKLE1BQTVGO0tBTEQsTUFNTzthQUNDbkksSUFBUDtXQUNLLE9BQUw7V0FDSzhGLElBQUksRUFBUjtZQUNJLElBQUk2QixDQUFSLElBQWF4TixLQUFiLEVBQW9CO1VBQ2pCQSxNQUFNd04sQ0FBTixFQUFTYyxTQUFYLElBQXdCLEtBQUtDLGdCQUFMLENBQXNCdk8sTUFBTXdOLENBQU4sRUFBU2hTLEtBQS9CLENBQXhCOztjQUVNbVEsQ0FBUDs7O1dBR0k2QyxJQUFJLEtBQUtELGdCQUFMLENBQXNCdk8sS0FBdEIsQ0FBUjtjQUNPd08sSUFBSUEsQ0FBSixHQUFReE8sS0FBZjs7OztHQXJITTs7a0JBMkhNLHdCQUFTNkYsSUFBVCxFQUFlN0YsS0FBZixFQUFzQm1PLE9BQXRCLEVBQStCQyxJQUEvQixFQUFxQztRQUNoRHZJLElBQUosSUFBWTdGLEtBQVosRUFBbUI7UUFDZm9PLEtBQUt2SSxJQUFMLENBQUgsRUFBZTthQUNQQSxJQUFQO1dBQ0ssS0FBTDtXQUNLLEdBQUw7V0FDSyxHQUFMO1dBQ0ssSUFBTDtXQUNLLE9BQUw7V0FDSyxNQUFMO1dBQ0ssT0FBTDtXQUNLLFFBQUw7V0FDSyxRQUFMO1dBQ0ssU0FBTDtZQUNNQSxJQUFMLEVBQVd4TCxJQUFYLENBQWdCLElBQWhCLEVBQXNCLEtBQUtrVSxnQkFBTCxDQUFzQnZPLE1BQU02RixJQUFOLENBQXRCLEVBQW1DdUksSUFBbkMsQ0FBdEI7OztXQUdJLFNBQUw7V0FDSyxTQUFMO1dBQ0ssVUFBTDtXQUNLLFlBQUw7WUFDTXZJLElBQUwsRUFBV3hMLElBQVgsQ0FBZ0IsSUFBaEIsRUFBc0IsS0FBS2tVLGdCQUFMLENBQXNCdk8sTUFBTTZGLElBQU4sQ0FBdEIsQ0FBdEI7OztXQUdJLGFBQUw7V0FDSyxhQUFMO1dBQ0ssY0FBTDtZQUNNQSxJQUFMLEVBQVd4TCxJQUFYLENBQWdCLElBQWhCLEVBQXNCMkYsTUFBTTZGLElBQU4sRUFBWWtHLEtBQVosQ0FBa0IsR0FBbEIsRUFBdUJ4TyxHQUF2QixDQUEyQixVQUFTeEMsQ0FBVCxFQUFZO2VBQVMwVCxNQUFNMVQsQ0FBTixJQUFXQSxDQUFYLEdBQWUsQ0FBQ0EsQ0FBdkI7UUFBekMsQ0FBdEI7OztXQUdJLFlBQUw7V0FDSyxpQkFBTDtXQUNLLGdCQUFMO1lBQ004SyxJQUFMLEVBQVd4TCxJQUFYLENBQWdCLElBQWhCLEVBQXNCLEtBQUtxVSxnQkFBTCxDQUFzQjdJLElBQXRCLEVBQTRCN0YsTUFBTTZGLElBQU4sQ0FBNUIsQ0FBdEI7Ozs7WUFJS0EsSUFBTCxFQUFXeEwsSUFBWCxDQUFnQixJQUFoQixFQUFzQixLQUFLMlQsTUFBTCxDQUFZbkksSUFBWixFQUFrQjdGLE1BQU02RixJQUFOLENBQWxCLEVBQStCc0ksT0FBL0IsQ0FBdEI7Ozs7VUFJSUMsSUFBUDtHQXBLUzs7b0JBdUtRLDBCQUFTdkksSUFBVCxFQUFlN0YsS0FBZixFQUFzQjtPQUNuQzJPLE9BQU8zTyxNQUFNMk8sSUFBTixHQUFhLEtBQUtOLE1BQUwsQ0FBWXJPLE1BQU0yTyxJQUFsQixFQUF3QlgsTUFBeEIsRUFBYixHQUFnRDdULFNBQTNEO09BQ0N5VSxRQUFRLEtBQUtMLGdCQUFMLENBQXNCdk8sTUFBTTRPLEtBQTVCLEtBQXNDNU8sTUFBTTRPLEtBRHJEO09BRUNyUCxXQUFXLEtBQUtnUCxnQkFBTCxDQUFzQnZPLE1BQU1ULFFBQTVCLEtBQXlDUyxNQUFNVCxRQUYzRDs7VUFJTyxVQUFTakYsQ0FBVCxFQUFZO1FBQ2ZxVSxJQUFILEVBQVNyVSxFQUFFcVUsSUFBRixDQUFPQSxJQUFQO1FBQ05DLEtBQUgsRUFBVXRVLEVBQUVzVSxLQUFGLENBQVFBLEtBQVI7UUFDUHJQLFFBQUgsRUFBYWpGLEVBQUVpRixRQUFGLENBQVdBLFFBQVg7V0FDTmpGLENBQVA7SUFKRDtHQTVLUzs7ZUFvTEcscUJBQVN1TCxJQUFULEVBQWU3RixLQUFmLEVBQXNCbU8sT0FBdEIsRUFBK0JDLElBQS9CLEVBQXFDO1FBQzdDLElBQUlTLEtBQVIsSUFBaUI3TyxLQUFqQixFQUF3QjtRQUNwQm9PLEtBQUtTLEtBQUwsQ0FBSCxFQUFnQjtTQUNYTCxJQUFJLEtBQUtSLE1BQUwsQ0FBWWEsS0FBWixFQUFtQjdPLE1BQU02TyxLQUFOLENBQW5CLENBQVI7U0FDR0EsVUFBVSxRQUFWLElBQXNCQSxVQUFVLE9BQW5DLEVBQTRDO1VBQ3hDLE9BQU9MLENBQVAsS0FBYSxVQUFoQixFQUE0QjtZQUN0QixNQUFNSyxLQUFYLElBQW9CTCxDQUFwQjtPQURELE1BRU8sSUFBR3JELE1BQU1DLE9BQU4sQ0FBY29ELENBQWQsTUFBcUJBLEVBQUUsQ0FBRixNQUFTclUsU0FBVCxJQUFzQmdSLE1BQU1DLE9BQU4sQ0FBY29ELEVBQUUsQ0FBRixDQUFkLENBQTNDLENBQUgsRUFBb0U7WUFDckUsTUFBTUssS0FBWCxJQUFvQixVQUFTdlQsSUFBVCxFQUFla0IsTUFBZixFQUF1QjtZQUN0Q08sQ0FBSjthQUNJQSxJQUFJUCxPQUFPNUIsTUFBZixFQUF1Qm1DLElBQUl5UixFQUFFNVQsTUFBN0IsRUFBcUNtQyxHQUFyQyxFQUEwQzthQUN0Q3lSLEVBQUV6UixDQUFGLENBQUgsRUFBUyxPQUFPeVIsRUFBRXpSLENBQUYsQ0FBUDs7YUFFTkEsSUFBSXlSLEVBQUU1VCxNQUFWLEVBQWtCbUMsS0FBSyxDQUF2QixFQUEwQkEsR0FBMUIsRUFBK0I7YUFDM0J5UixFQUFFelIsQ0FBRixDQUFILEVBQVMsT0FBT3lSLEVBQUV6UixDQUFGLENBQVA7O1FBTlg7T0FETSxNQVVBLElBQUdvTyxNQUFNQyxPQUFOLENBQWNvRCxDQUFkLENBQUgsRUFBcUI7WUFDdEJLLEtBQUwsRUFBWUwsQ0FBWjtPQURNLE1BRUE7WUFDREssS0FBTCxFQUFZTCxFQUFFekMsS0FBRixDQUFRLEdBQVIsRUFBYXhPLEdBQWIsQ0FBaUIsVUFBU3hDLENBQVQsRUFBWTtlQUFTLENBQUMwVCxNQUFNMVQsQ0FBTixDQUFELEdBQVksQ0FBQ0EsQ0FBYixHQUFpQkEsQ0FBeEI7UUFBL0IsQ0FBWjs7TUFoQkYsTUFrQk87V0FDRDhULEtBQUwsRUFBWUwsQ0FBWjs7OztVQUlJSixJQUFQO0dBL01TOztvQkFrTlEsMEJBQVNwTyxLQUFULEVBQWdCb08sSUFBaEIsRUFBc0I7O09BRXBDLE9BQU9wTyxLQUFQLEtBQWlCLFFBQXBCLEVBQThCLE9BQU9BLEtBQVA7OztPQUcxQndPLElBQUksS0FBS0gsTUFBTCxDQUFZck8sS0FBWixDQUFSO09BQ0N3TixDQUREO09BQ0lzQixDQURKO09BQ081SSxDQURQO09BQ1VDLENBRFY7T0FDYXhGLENBRGI7O09BR0c2TixDQUFILEVBQU0sT0FBT0EsRUFBRVIsTUFBRixFQUFQOzs7T0FHRnZDLElBQUl6TCxNQUFNK08sS0FBTixDQUFZLHNCQUFaLENBQVI7O09BRUd0RCxDQUFILEVBQU07UUFDREEsRUFBRSxDQUFGLENBQUo7O1lBRU9BLEVBQUUsQ0FBRixDQUFQOztVQUVLLE1BQUw7YUFDUSxVQUFTMVEsQ0FBVCxFQUFZaVUsT0FBWixFQUFxQjtjQUNwQkEsVUFBVXhCLENBQVYsR0FBY3pTLEVBQUV5UyxDQUFGLENBQXJCO09BREQ7O1VBSUksUUFBTDthQUNRLFVBQVN6UyxDQUFULEVBQVlpVSxPQUFaLEVBQXFCO2NBQ3BCQSxVQUFVelUsT0FBQSxDQUFRUSxDQUFSLEVBQVcsQ0FBQ3lTLENBQVosQ0FBVixHQUEyQnpTLEVBQUVSLE9BQUEsQ0FBUVEsQ0FBUixFQUFXLENBQUN5UyxDQUFaLENBQUYsQ0FBbEM7T0FERDs7VUFJSSxPQUFMO2FBQ1EsWUFBVztjQUNWQSxDQUFQO09BREQ7O1VBSUksTUFBTDthQUNRLFlBQVc7Y0FDVkEsRUFBRXpCLEtBQUYsQ0FBUSxHQUFSLENBQVA7T0FERDs7VUFJSSxRQUFMO2FBQ1EsVUFBU2hSLENBQVQsRUFBWTtjQUNYcVQsS0FBS2xRLEdBQUwsR0FBV25ELEVBQUUsQ0FBRixDQUFYLEVBQWlCLElBQWpCLENBQVA7T0FERDs7VUFJSSxNQUFMO2FBQ1EsVUFBU0EsQ0FBVCxFQUFZO2NBQ1hxVCxLQUFLalEsQ0FBTCxHQUFTcEQsRUFBRSxDQUFGLENBQVQsRUFBZSxJQUFmLENBQVA7T0FERDs7VUFJSSxNQUFMO2FBQ1EsVUFBU0EsQ0FBVCxFQUFZO2NBQ1hxVCxLQUFLaFEsQ0FBTCxHQUFTckQsRUFBRSxDQUFGLENBQVQsRUFBZSxJQUFmLENBQVA7T0FERDs7VUFJSSxPQUFMO2FBQ1EsVUFBU0EsQ0FBVCxFQUFZO2NBQ1hxVCxLQUFLL1AsRUFBTCxHQUFVdEQsRUFBRSxDQUFGLENBQVYsRUFBZ0IsSUFBaEIsQ0FBUDtPQUREOztVQUlJLFVBQUw7YUFDUSxVQUFTQSxDQUFULEVBQVk7Y0FDWHFULEtBQUs5UCxLQUFMLEdBQWF2RCxFQUFFLENBQUYsQ0FBYixFQUFtQixJQUFuQixDQUFQO09BREQ7O1VBSUksU0FBTDthQUNRLFVBQVNBLENBQVQsRUFBWTtjQUNYcVQsS0FBSzdQLElBQUwsR0FBWXhELEVBQUUsQ0FBRixDQUFaLEVBQWtCLElBQWxCLENBQVA7T0FERDs7VUFJSSxLQUFMO1VBQ0l5UyxNQUFNLEVBQVQsRUFBYTtjQUNMLFVBQVNsUyxJQUFULEVBQWUyVCxRQUFmLEVBQXlCO2VBQ3hCM1QsS0FBS2lDLEdBQUwsQ0FBUyxVQUFTeEMsQ0FBVCxFQUFZO2dCQUNwQmtVLFNBQVNsVSxDQUFULENBQVA7U0FETSxDQUFQO1FBREQ7OzthQU9NLFVBQVNPLElBQVQsRUFBZTtjQUNkQSxLQUFLaUMsR0FBTCxDQUFTLFVBQVN4QyxDQUFULEVBQVk7ZUFDcEJBLEVBQUV5UyxDQUFGLENBQVA7UUFETSxDQUFQO09BREQ7O1VBTUksT0FBTDthQUNRLFVBQVNsUyxJQUFULEVBQWU7Y0FDZEEsS0FBS2lDLEdBQUwsQ0FBUyxVQUFTeEMsQ0FBVCxFQUFZO2VBQ3BCQSxFQUFFUixPQUFBLENBQVFRLENBQVIsRUFBVyxDQUFDeVMsQ0FBWixDQUFGLENBQVA7UUFETSxDQUFQO09BREQ7O1VBTUksUUFBTDtVQUNJQSxNQUFNLEVBQVQsRUFBYTtjQUNMLFVBQVNsUyxJQUFULEVBQWUyVCxRQUFmLEVBQXlCO2VBQ3hCMVUsU0FBQSxDQUFVZSxLQUFLaUMsR0FBTCxDQUFTLFVBQVN4QyxDQUFULEVBQVk7Z0JBQzlCLENBQUNrVSxTQUFTbFUsQ0FBVCxDQUFSO1NBRGdCLENBQVYsQ0FBUDtRQUREOzs7YUFPTSxVQUFTTyxJQUFULEVBQWU7Y0FDZGYsU0FBQSxDQUFVZSxLQUFLaUMsR0FBTCxDQUFTLFVBQVN4QyxDQUFULEVBQVk7ZUFDOUIsQ0FBQ0EsRUFBRXlTLENBQUYsQ0FBUjtRQURnQixDQUFWLENBQVA7T0FERDs7VUFNSSxVQUFMO2FBQ1EsVUFBU2xTLElBQVQsRUFBZTtjQUNkZixTQUFBLENBQVVlLEtBQUtpQyxHQUFMLENBQVMsVUFBU3hDLENBQVQsRUFBWTtlQUM5QixDQUFDQSxFQUFFUixPQUFBLENBQVFRLENBQVIsRUFBVyxDQUFDeVMsQ0FBWixDQUFGLENBQVI7UUFEZ0IsQ0FBVixDQUFQO09BREQ7O1VBTUksWUFBTDtVQUNJQSxNQUFNLEVBQVQsRUFBYTtjQUNMLFVBQVNsUyxJQUFULEVBQWUyVCxRQUFmLEVBQXlCO2VBQ3hCMVUsU0FBQSxDQUFVZSxLQUFLaUMsR0FBTCxDQUFTLFVBQVN4QyxDQUFULEVBQVk7Z0JBQzlCLENBQUNrVSxTQUFTbFUsQ0FBVCxDQUFSO1NBRGdCLEVBRWRtVSxNQUZjLENBRVAsQ0FGTyxDQUFWLENBQVA7UUFERDs7O2FBT00sVUFBUzVULElBQVQsRUFBZTtjQUNkZixTQUFBLENBQVVlLEtBQUtpQyxHQUFMLENBQVMsVUFBU3hDLENBQVQsRUFBWTtlQUM5QixDQUFDQSxFQUFFeVMsQ0FBRixDQUFSO1FBRGdCLEVBRWQwQixNQUZjLENBRVAsQ0FGTyxDQUFWLENBQVA7T0FERDs7VUFNSSxjQUFMO2FBQ1EsVUFBUzVULElBQVQsRUFBZTtjQUNkZixTQUFBLENBQVVlLEtBQUtpQyxHQUFMLENBQVMsVUFBU3hDLENBQVQsRUFBWTtlQUM5QixDQUFDQSxFQUFFUixPQUFBLENBQVFRLENBQVIsRUFBVyxDQUFDeVMsQ0FBWixDQUFGLENBQVI7UUFEZ0IsRUFFZDBCLE1BRmMsQ0FFUCxDQUZPLENBQVYsQ0FBUDtPQUREOztVQU1JLE1BQUw7YUFDUSxVQUFTNVQsSUFBVCxFQUFlO2NBQ2RmLE9BQUEsQ0FBUWUsS0FBSyxDQUFMLENBQVIsQ0FBUDtPQUREOztVQUlJLFFBQUw7YUFDUSxVQUFTQSxJQUFULEVBQWU7Y0FDZGYsT0FBQSxDQUFRZSxLQUFLLENBQUwsQ0FBUixFQUFpQixDQUFDa1MsQ0FBbEIsQ0FBUDtPQUREOztVQUlJLFNBQUw7YUFDUSxVQUFTelMsQ0FBVCxFQUFZZ0MsQ0FBWixFQUFlO2NBQ2RBLElBQUl5USxDQUFYO09BREQ7O1VBSUksY0FBTDtVQUNLQSxFQUFFekIsS0FBRixDQUFRLEdBQVIsQ0FBSjthQUNPLFVBQVNoUixDQUFULEVBQVk7Y0FDWEEsRUFBRTBRLEVBQUUsQ0FBRixDQUFGLElBQVVBLEVBQUUsQ0FBRixDQUFqQjtPQUREOztVQUlJLFFBQUw7YUFDUWxSLFNBQUEsQ0FBVWlULENBQVYsQ0FBUDs7VUFFSSxZQUFMO2FBQ1FqVCxhQUFBLENBQWNpVCxDQUFkLENBQVA7O1VBRUksYUFBTDtjQUNRQSxDQUFQO1lBQ0ssR0FBTDtlQUNRLFVBQVN6UyxDQUFULEVBQVk7Z0JBQ1hvVSxXQUFXcFUsRUFBRWdVLEtBQUYsQ0FBUSxnQkFBUixFQUEwQixDQUExQixDQUFYLElBQTJDLElBQWxEO1NBREQ7O1lBSUksR0FBTDtlQUNRLFVBQVNoVSxDQUFULEVBQVk7Z0JBQ1hvVSxXQUFXcFUsRUFBRWdVLEtBQUYsQ0FBUSxnQkFBUixFQUEwQixDQUExQixDQUFYLElBQTJDLElBQWxEO1NBREQ7O1lBSUksR0FBTDtlQUNRLFVBQVNoVSxDQUFULEVBQVk7Z0JBQ1hvVSxXQUFXcFUsRUFBRWdVLEtBQUYsQ0FBUSxnQkFBUixFQUEwQixDQUExQixDQUFYLElBQTJDLE9BQWxEO1NBREQ7O1lBSUksR0FBTDtlQUNRLFVBQVNoVSxDQUFULEVBQVk7Z0JBQ1hvVSxXQUFXcFUsRUFBRWdVLEtBQUYsQ0FBUSxnQkFBUixFQUEwQixDQUExQixDQUFYLElBQTJDLFVBQWxEO1NBREQ7OztlQUtPLFVBQVNoVSxDQUFULEVBQVk7Z0JBQ1gsQ0FBQ0EsQ0FBUjtTQUREOzs7VUFLRyxXQUFMO2FBQ1FSLFlBQUEsQ0FBYWlULENBQWIsQ0FBUDs7VUFFSSxVQUFMO2FBQ1FqVCxXQUFBLENBQVlpVCxDQUFaLENBQVA7O1VBRUksVUFBTDthQUNRalQsV0FBQSxDQUFZaVQsQ0FBWixDQUFQOztVQUVJLFdBQUw7VUFDS0EsRUFBRXpCLEtBQUYsQ0FBUSxHQUFSLENBQUo7VUFDSXhSLGlCQUFBLEdBQW9CaUMsTUFBcEIsQ0FBMkIsQ0FBQyxDQUFDZ1IsRUFBRSxDQUFGLENBQUYsQ0FBM0IsRUFBb0MvUSxLQUFwQyxDQUEwQyxDQUFDK1EsRUFBRSxDQUFGLENBQUQsRUFBT0EsRUFBRSxDQUFGLENBQVAsQ0FBMUMsQ0FBSjs7YUFFTyxVQUFTelMsQ0FBVCxFQUFZO2NBQ1grVCxFQUFFL1QsRUFBRXlTLEVBQUUsQ0FBRixDQUFGLENBQUYsQ0FBUDtPQUREOztVQUlJLGFBQUw7VUFDS0EsRUFBRXpCLEtBQUYsQ0FBUSxHQUFSLENBQUo7VUFDSXhSLGlCQUFBLEdBQW9CaUMsTUFBcEIsQ0FBMkIsQ0FBQyxDQUFDZ1IsRUFBRSxDQUFGLENBQUYsQ0FBM0IsRUFBb0MvUSxLQUFwQyxDQUEwQyxDQUFDK1EsRUFBRSxDQUFGLENBQUQsRUFBT0EsRUFBRSxDQUFGLENBQVAsQ0FBMUMsQ0FBSjs7YUFFTyxVQUFTelMsQ0FBVCxFQUFZO2NBQ1grVCxFQUFFL1QsRUFBRVIsT0FBQSxDQUFRUSxDQUFSLEVBQVcsQ0FBQ3lTLEVBQUUsQ0FBRixDQUFaLENBQUYsQ0FBRixDQUFQO09BREQ7O1VBSUksZ0JBQUw7VUFDS0EsRUFBRXpCLEtBQUYsQ0FBUSxHQUFSLENBQUo7VUFDSXlCLEVBQUUsQ0FBRixDQUFKO1VBQ0lBLEVBQUUsQ0FBRixDQUFKO1VBQ0lBLEVBQUUsQ0FBRixLQUFRLEdBQVo7O2FBRU9qVCxpQkFBQSxDQUFrQjZVLEtBQWxCLENBQXdCek8sQ0FBeEIsRUFBMkJ1RixDQUEzQixFQUE4QkMsQ0FBOUIsQ0FBUDs7VUFFSSxnQkFBTDtVQUNLcUgsRUFBRXpCLEtBQUYsQ0FBUSxHQUFSLENBQUo7VUFDSXlCLEVBQUUsQ0FBRixDQUFKO1VBQ0lBLEVBQUUsQ0FBRixDQUFKOzthQUVPalQsaUJBQUEsQ0FBa0IyTCxDQUFsQixFQUFxQkMsQ0FBckIsQ0FBUDs7VUFFSSxnQkFBTDtVQUNLcUgsRUFBRXpCLEtBQUYsQ0FBUSxHQUFSLENBQUo7VUFDSXlCLEVBQUUsQ0FBRixDQUFKO1VBQ0lBLEVBQUUsQ0FBRixDQUFKOzthQUVPalQsaUJBQUEsQ0FBa0IyTCxDQUFsQixFQUFxQkMsQ0FBckIsQ0FBUDs7VUFFSSxnQkFBTDtVQUNLcUgsRUFBRXpCLEtBQUYsQ0FBUSxHQUFSLENBQUo7VUFDSXlCLEVBQUUsQ0FBRixDQUFKO1VBQ0lBLEVBQUUsQ0FBRixDQUFKOzthQUVPalQsaUJBQUEsQ0FBa0IyTCxDQUFsQixFQUFxQkMsQ0FBckIsQ0FBUDs7VUFFSSxzQkFBTDtVQUNLcUgsRUFBRXpCLEtBQUYsQ0FBUSxHQUFSLENBQUo7VUFDSXlCLEVBQUUsQ0FBRixDQUFKO1VBQ0lBLEVBQUUsQ0FBRixDQUFKO1VBQ0lBLEVBQUUsQ0FBRixLQUFRLEdBQVo7O2FBRU9qVCx1QkFBQSxDQUF3QjZVLEtBQXhCLENBQThCek8sQ0FBOUIsRUFBaUN1RixDQUFqQyxFQUFvQ0MsQ0FBcEMsQ0FBUDs7O1lBR00sK0JBQStCbkcsS0FBL0IsR0FBdUMsR0FBN0M7Ozs7VUFJSzdGLFNBQVA7R0FsZFM7O1lBcWRBLGtCQUFTaVEsQ0FBVCxFQUFZO09BQ2pCO1FBQ0FBLEVBQUVILE1BQUwsRUFBYTtTQUNSb0YsSUFBSSxLQUFLaEIsTUFBTCxDQUFZakUsRUFBRUgsTUFBZCxDQUFSOztTQUVHb0YsTUFBTWxWLFNBQVQsRUFBb0I7WUFDYixzQkFBc0JpUSxFQUFFSCxNQUF4QixHQUFpQyxHQUF2Qzs7O1NBR0csS0FBS3FGLFVBQUwsQ0FBZ0JELEVBQUVyQixNQUFGLEVBQWhCLENBQUo7U0FDSXpELEtBQUs4RSxDQUFMLEVBQVFqRixDQUFSLENBQUo7O1NBRUlwTixVQUFPa08sT0FBT2xPLElBQVAsQ0FBWXFTLENBQVosQ0FBWDtVQUNJLElBQUl0UyxDQUFSLElBQWFDLE9BQWIsRUFBbUI7VUFDZHdRLElBQUl4USxRQUFLRCxDQUFMLENBQVI7VUFDR3NTLEVBQUU3QixDQUFGLEVBQUt2RCxNQUFMLElBQWVHLEVBQUVvRCxDQUFGLENBQWxCLEVBQXdCO1NBQ3JCQSxDQUFGLEVBQUt2RCxNQUFMLEdBQWNvRixFQUFFN0IsQ0FBRixFQUFLdkQsTUFBbkI7U0FDRXVELENBQUYsSUFBTyxLQUFLK0IsUUFBTCxDQUFjbkYsRUFBRW9ELENBQUYsQ0FBZCxDQUFQOzs7OztXQUtJcEQsQ0FBUDtJQXJCRCxDQXVCRSxPQUFNcE8sS0FBTixFQUFhO1VBQ1Isc0JBQXNCRCxLQUFLa1MsU0FBTCxDQUFlN0QsQ0FBZixDQUF0QixHQUEwQyxLQUExQyxHQUFrRHBPLEtBQXhEOztHQTllUTs7Y0FrZkUsb0JBQVNvTyxDQUFULEVBQVk7T0FDbkI7UUFDQUEsRUFBRUgsTUFBTCxFQUFhO1NBQ1JvRixJQUFJLEtBQUtoQixNQUFMLENBQVlqRSxFQUFFSCxNQUFkLENBQVI7U0FDR29GLE1BQU1sVixTQUFULEVBQW9CO1lBQ2Isc0JBQXNCaVEsRUFBRUgsTUFBeEIsR0FBaUMsR0FBdkM7OztTQUdHLEtBQUtxRixVQUFMLENBQWdCRCxFQUFFckIsTUFBRixFQUFoQixDQUFKO1NBQ0kvRCxPQUFPb0YsQ0FBUCxFQUFVakYsQ0FBVixDQUFKOzs7UUFHR3BOLFVBQU9rTyxPQUFPbE8sSUFBUCxDQUFZb04sQ0FBWixDQUFYO1NBQ0ksSUFBSXJOLENBQVIsSUFBYUMsT0FBYixFQUFtQjtTQUNkd1EsSUFBSXhRLFFBQUtELENBQUwsQ0FBUjtTQUNHdU4sUUFBT0YsRUFBRW9ELENBQUYsQ0FBUCxNQUFnQixRQUFuQixFQUE2QjtRQUMxQkEsQ0FBRixJQUFPLEtBQUs4QixVQUFMLENBQWdCbEYsRUFBRW9ELENBQUYsQ0FBaEIsQ0FBUDs7OztXQUlLcEQsQ0FBUDtJQW5CRCxDQXFCRSxPQUFNcE8sS0FBTixFQUFhO1VBQ1Isd0JBQXdCRCxLQUFLa1MsU0FBTCxDQUFlN0QsQ0FBZixDQUF4QixHQUE0QyxLQUE1QyxHQUFvRHBPLEtBQTFEOztHQXpnQlE7O1VBNmdCRixnQkFBUzBFLElBQVQsRUFBZTBKLENBQWYsRUFBa0I7VUFDbEJBLEVBQUVvRixNQUFUOztPQUVJbFUsT0FBT1MsS0FBS2tTLFNBQUwsQ0FBZSxLQUFLc0IsUUFBTCxDQUFjbkYsQ0FBZCxDQUFmLENBQVg7T0FDQ3FGLGFBQWEvTyxLQUFLZ1AsYUFBTCxDQUFtQixZQUFuQixDQURkOztVQUdRLGtCQUFrQmhQLEtBQUsySCxFQUF2QixHQUE0QiwyREFBNUIsR0FDTCxjQURLLEdBQ1kvTSxLQUFLNkosT0FBTCxDQUFhLEtBQWIsRUFBb0IsUUFBcEIsRUFBOEJBLE9BQTlCLENBQXNDLEtBQXRDLEVBQTZDLEtBQTdDLENBRFosR0FDbUUsSUFEbkUsR0FFTCxHQUZLLEdBR0osNkRBSEksSUFJSHNLLGFBQWFBLFdBQVdFLFNBQXhCLEdBQW9DLGFBSmpDLElBSWtELGVBSmxELEdBS04sV0FMRjtHQW5oQlM7O1dBMmhCRCxpQkFBU2pQLElBQVQsRUFBZTtXQUNoQkEsS0FBSzRMLFFBQVo7U0FDSyxDQUFMOztTQUNLO1VBQ0M7V0FDQ2xDLElBQUlyTyxLQUFLUCxLQUFMLENBQVdrRixLQUFLa1AsWUFBTCxDQUFrQixVQUFsQixDQUFYLENBQVI7T0FERCxDQUVFLE9BQU01VCxLQUFOLEVBQWE7YUFDUiwyQkFBMkJBLEtBQWpDOzs7VUFHRyxLQUFLc1QsVUFBTCxDQUFnQmxGLENBQWhCLENBQUo7OztVQUdHQSxFQUFFcEosS0FBTCxFQUFZO2dCQUNYLENBQVVOLElBQVYsRUFBZ0JyRyxJQUFoQixDQUFxQixLQUFLMlQsTUFBTCxDQUFZLElBQVosRUFBa0I1RCxFQUFFcEosS0FBcEIsQ0FBckI7OztVQUdHL0csV0FBVyxLQUFLK1QsTUFBTCxDQUFZLElBQVosRUFBa0I1RCxFQUFFblEsUUFBcEIsQ0FBZjtVQUNDb0IsU0FBUyxLQUFLMlMsTUFBTCxDQUFZLElBQVosRUFBa0I1RCxFQUFFL08sTUFBcEIsRUFBNEIsQ0FBQ3BCLFFBQUQsQ0FBNUIsQ0FEVjtVQUVDNFYsWUFBWSxLQUFLN0IsTUFBTCxDQUFZLElBQVosRUFBa0I1RCxFQUFFeUYsU0FBcEIsRUFBK0IsQ0FBQ3hVLE1BQUQsQ0FBL0IsQ0FGYjs7O2VBS0EsQ0FBVXFGLElBQVYsRUFBZ0JyRyxJQUFoQixDQUFxQndWLGFBQWF4VSxNQUFsQztNQW5CRCxDQW9CRSxPQUFNVyxLQUFOLEVBQWE7ZUFDZCxDQUFVMEUsSUFBVixFQUNFSSxNQURGLENBQ1MsWUFEVCxFQUVFQyxJQUZGLENBRU8sT0FGUCxFQUVnQixlQUZoQixFQUdFRCxNQUhGLENBR1MsTUFIVCxFQUlHdkMsSUFKSCxDQUlRLDRCQUE0QnZDLEtBQTVCLEdBQW9DLEdBSjVDOzs7OztTQVNHLENBQUwsQ0FoQ0E7U0FpQ0ssRUFBTDs7U0FDSzhULFFBQVFwUCxLQUFLK0wsZ0JBQUwsQ0FBc0IsWUFBdEIsQ0FBWjtTQUNHcUQsS0FBSCxFQUFVO1dBQ0wsSUFBSS9TLENBQVIsSUFBYStTLEtBQWIsRUFBb0I7WUFDZGhDLE9BQUwsQ0FBYWdDLE1BQU0vUyxDQUFOLENBQWI7Ozs7OztZQU1LLElBQVA7O0dBdmtCUTs7bUJBMmtCTyx5QkFBU2dULFFBQVQsRUFBbUI7T0FDL0JoRixTQUFTLEVBQWI7O2NBRVdJLE1BQU1DLE9BQU4sQ0FBYzJFLFFBQWQsSUFBMEJBLFFBQTFCLEdBQXFDQSxTQUFTaEUsS0FBVCxDQUFlLEdBQWYsQ0FBaEQ7O1FBRUssS0FBSSxJQUFJN04sR0FBUixJQUFlME8sU0FBZixFQUEwQjtRQUMxQmpCLElBQUlpQixVQUFVMU8sR0FBVixDQUFSOztRQUVHeU4sRUFBRW9FLFFBQUwsRUFBZTtVQUNWLElBQUloVCxJQUFJLENBQVosRUFBZUEsSUFBSWdULFNBQVNuVixNQUE1QixFQUFvQ21DLEdBQXBDLEVBQXlDO1VBQ3JDNE8sRUFBRW9FLFFBQUYsQ0FBV2hULENBQVgsS0FBaUJnVCxTQUFTaFQsQ0FBVCxDQUFwQixFQUFpQztnQkFDdkJpVCxHQUFUOzs7T0FHQTlSLEdBQUYsR0FBUUEsR0FBUjtZQUNPakIsSUFBUCxDQUFZME8sQ0FBWjs7O1VBR0taLE1BQVA7O0VBN2xCRjs7UUFpbUJPMkIsUUFBUDs7O0FBR0QsQUFBTyxTQUFTdUQsSUFBVCxDQUFjdEUsQ0FBZCxFQUFpQjtRQUNoQmtCLGFBQWFvRCxJQUFiLENBQWtCdEUsQ0FBbEIsQ0FBUDs7O0FDOW1CTSxJQUFNdUUsVUFBVTtpQkFDTjtTQUNSLFdBRFE7ZUFFRixnQkFGRTtZQUdMLENBQUMsTUFBRCxDQUhLO1VBSVAsa0JBQVc7VUFDWDNWLFlBQVA7O0VBTm9COztrQkFVTDtTQUNULFlBRFM7ZUFFSCxnQkFGRztZQUdOLENBQUMsTUFBRCxDQUhNO1VBSVIsa0JBQVc7VUFDWEEsYUFBUDs7RUFmb0I7O29CQW1CSDtTQUNYLGVBRFc7ZUFFTCxlQUZLO1lBR1IsQ0FBQyxPQUFELEVBQVUsU0FBVixDQUhRO1VBSVYsZ0JBQVNzUyxVQUFULEVBQXFCaEgsSUFBckIsRUFBMkI3RixLQUEzQixFQUFrQ21PLE9BQWxDLEVBQTJDO1VBQzNDdEIsV0FBV3NELFdBQVgsQ0FBdUJ0SyxJQUF2QixFQUE2QjdGLEtBQTdCLEVBQW9DbU8sT0FBcEMsRUFBNkM1VCxlQUFBLEVBQTdDLENBQVA7O0VBeEJvQjs7aUJBNEJOO1NBQ1IsWUFEUTtlQUVGLFlBRkU7WUFHTCxDQUFDLE9BQUQsRUFBVSxTQUFWLENBSEs7VUFJUCxnQkFBU3NTLFVBQVQsRUFBcUJoSCxJQUFyQixFQUEyQjdGLEtBQTNCLEVBQWtDbU8sT0FBbEMsRUFBMkM7VUFDM0N0QixXQUFXc0QsV0FBWCxDQUF1QnRLLElBQXZCLEVBQTZCN0YsS0FBN0IsRUFBb0NtTyxPQUFwQyxFQUE2QzVULFlBQUEsRUFBN0MsQ0FBUDs7RUFqQ29COztrQkFxQ0w7U0FDVCxhQURTO2VBRUgsYUFGRztZQUdOLENBQUMsT0FBRCxFQUFVLFNBQVYsQ0FITTtVQUlSLGdCQUFTc1MsVUFBVCxFQUFxQmhILElBQXJCLEVBQTJCN0YsS0FBM0IsRUFBa0NtTyxPQUFsQyxFQUEyQztVQUMzQ3RCLFdBQVdzRCxXQUFYLENBQXVCdEssSUFBdkIsRUFBNkI3RixLQUE3QixFQUFvQ21PLE9BQXBDLEVBQTZDNVQsYUFBQSxFQUE3QyxDQUFQOztFQTFDb0I7O21CQThDSjtTQUNWLGNBRFU7ZUFFSixjQUZJO1lBR1AsQ0FBQyxPQUFELEVBQVUsWUFBVixDQUhPO1VBSVQsZ0JBQVNzUyxVQUFULEVBQXFCaEgsSUFBckIsRUFBMkI3RixLQUEzQixFQUFrQ21PLE9BQWxDLEVBQTJDO1VBQzNDdEIsV0FBV3NELFdBQVgsQ0FBdUJ0SyxJQUF2QixFQUE2QjdGLEtBQTdCLEVBQW9DbU8sT0FBcEMsRUFBNkM1VCxjQUFBLEVBQTdDLENBQVA7O0VBbkRvQjs7aUJBdUROO1NBQ1IsbUJBRFE7ZUFFRixtQkFGRTtZQUdMLENBQUMsT0FBRCxFQUFVLFlBQVYsQ0FISztVQUlQLGdCQUFTc1MsVUFBVCxFQUFxQmhILElBQXJCLEVBQTJCN0YsS0FBM0IsRUFBa0NtTyxPQUFsQyxFQUEyQztVQUMzQ3RCLFdBQVdzRCxXQUFYLENBQXVCdEssSUFBdkIsRUFBNkI3RixLQUE3QixFQUFvQ21PLE9BQXBDLEVBQTZDNVQsWUFBQSxFQUE3QyxDQUFQOztFQTVEb0I7O3FCQWdFRjtTQUNaLGdCQURZO2VBRU4sZ0JBRk07WUFHVCxDQUFDLE9BQUQsQ0FIUztVQUlYLGtCQUFXO1VBQ1hBLGdCQUFBLEVBQVA7O0VBckVvQjs7c0JBeUVEO1NBQ2IsaUJBRGE7ZUFFUCxpQkFGTztZQUdWLENBQUMsT0FBRCxDQUhVO1VBSVosZ0JBQVNzUyxVQUFULEVBQXFCaEgsSUFBckIsRUFBMkI3RixLQUEzQixFQUFrQ21PLE9BQWxDLEVBQTJDO1VBQzNDdEIsV0FBV3NELFdBQVgsQ0FBdUJ0SyxJQUF2QixFQUE2QjdGLEtBQTdCLEVBQW9DbU8sT0FBcEMsRUFBNkM1VCxpQkFBQSxFQUE3QyxDQUFQOztFQTlFb0I7O3VCQWtGQTtTQUNkLGtCQURjO2VBRVIsa0JBRlE7WUFHWCxDQUFDLE9BQUQsQ0FIVztVQUliLGdCQUFTc1MsVUFBVCxFQUFxQmhILElBQXJCLEVBQTJCN0YsS0FBM0IsRUFBa0M7T0FDckN2RCxRQUFRb1EsV0FBVzBCLGdCQUFYLENBQTRCdk8sTUFBTXZELEtBQWxDLEtBQTRDb1EsV0FBV3dCLE1BQVgsQ0FBa0JyTyxNQUFNdkQsS0FBeEIsRUFBK0J1UixNQUEvQixFQUF4RDtPQUNDYyxJQUFJdlUsa0JBQUEsQ0FBbUJrQyxLQUFuQixDQURMO0tBRUUsU0FBRixJQUFlb1EsV0FBVzBCLGdCQUFYLENBQTRCdk8sTUFBTXhELE1BQWxDLENBQWY7VUFDT3NTLENBQVA7O0VBMUZvQjs7aUJBOEZOO1NBQ1IsWUFEUTtlQUVGLFlBRkU7WUFHTCxDQUFDLE9BQUQsQ0FISztVQUlQLGdCQUFTakMsVUFBVCxFQUFxQmhILElBQXJCLEVBQTJCN0YsS0FBM0IsRUFBa0NtTyxPQUFsQyxFQUEyQztVQUMzQ3RCLFdBQVdzRCxXQUFYLENBQXVCdEssSUFBdkIsRUFBNkI3RixLQUE3QixFQUFvQ21PLE9BQXBDLEVBQTZDNVQsWUFBQSxFQUE3QyxDQUFQOztFQW5Hb0I7Ozs7a0JBeUdMO1NBQ1QsWUFEUztlQUVILFlBRkc7WUFHTixDQUFDLFlBQUQsQ0FITTtVQUlSLGtCQUFXO1VBQ1hBLGFBQUEsRUFBUDs7RUE5R29COztrQkFrSEw7U0FDVCxRQURTO2VBRUgsZUFGRztZQUdOLENBQUMsTUFBRCxDQUhNO1VBSVIsa0JBQVc7VUFDWEEsYUFBUDs7RUF2SG9COztnQkEySFA7U0FDUCxZQURPO2VBRUQseUJBRkM7WUFHSixDQUFDLE1BQUQsQ0FISTtVQUlOLGtCQUFXO1VBQ1hBLFdBQVA7O0VBaElvQjs7Z0JBb0lQO1NBQ1AsV0FETztlQUVELHdCQUZDO1lBR0osQ0FBQyxNQUFELENBSEk7VUFJTixrQkFBVztVQUNYQSxXQUFQOztFQXpJb0I7O2lCQTZJTjtTQUNSLE9BRFE7ZUFFRixvQkFGRTtZQUdMLENBQUMsTUFBRCxDQUhLO1VBSVAsa0JBQVc7VUFDWEEsWUFBUDs7RUFsSm9COztlQXNKUjtTQUNOLFlBRE07ZUFFQSx5QkFGQTtZQUdILENBQUMsTUFBRCxDQUhHO1VBSUwsa0JBQVc7VUFDWEEsVUFBUDs7RUEzSm9COztlQStKUjtTQUNOLGFBRE07ZUFFQSwwQkFGQTtZQUdILENBQUMsTUFBRCxDQUhHO1VBSUwsa0JBQVc7VUFDWEEsVUFBUDs7RUFwS29COztrQkF3S0w7U0FDVCxRQURTO2VBRUgsdUJBRkc7WUFHTixDQUFDLE1BQUQsQ0FITTtVQUlSLGtCQUFXO1VBQ1hBLGFBQVA7O0VBN0tvQjs7bUJBaUxKO1NBQ1YsU0FEVTtlQUVKLG9CQUZJO1lBR1AsQ0FBQyxNQUFELENBSE87VUFJVCxrQkFBVztVQUNYQSxjQUFQOztFQXRMb0I7O2dCQTBMUDtTQUNQLE1BRE87ZUFFRCxxQ0FGQztZQUdKLENBQUMsTUFBRCxDQUhJO1VBSU4sa0JBQVc7VUFDWEEsV0FBUDs7RUEvTG9COztrQkFtTUw7U0FDVCxRQURTO2VBRUgsbUJBRkc7WUFHTixDQUFDLE1BQUQsQ0FITTtVQUlSLGtCQUFXO1VBQ1hBLGFBQVA7O0VBeE1vQjs7OztZQThNWDtTQUNILE1BREc7ZUFFRywyREFGSDtZQUdBLENBQUMsZ0JBQUQsQ0FIQTtVQUlGLGdCQUFTc1MsVUFBVCxFQUFxQmhILElBQXJCLEVBQTJCN0YsS0FBM0IsRUFBa0NtTyxPQUFsQyxFQUEyQztVQUMzQ3RCLFdBQVd1RCxjQUFYLENBQTBCdkssSUFBMUIsRUFBZ0M3RixLQUFoQyxFQUF1Q21PLE9BQXZDLEVBQWdENVQsT0FBQSxFQUFoRCxDQUFQOztFQW5Ob0I7O2tCQXVOTDtTQUNULGFBRFM7ZUFFSCxtRUFGRztZQUdOLENBQUMsZ0JBQUQsQ0FITTtVQUlSLGtCQUFXO1VBQ1hBLGFBQUEsRUFBUDs7RUE1Tm9COztZQWdPWDtTQUNILE1BREc7ZUFFRyw0REFGSDtZQUdBLENBQUMsZ0JBQUQsQ0FIQTtVQUlGLGtCQUFXO1VBQ1hBLE9BQUEsRUFBUDs7RUFyT29COztrQkF5T0w7U0FDVCxPQURTO2VBRUgsbUVBRkc7WUFHTixDQUFDLE9BQUQsRUFBVSxPQUFWLENBSE07VUFJUixrQkFBVztVQUNYQSxhQUFQOztFQTlPb0I7O3dCQWtQQztTQUNmLGNBRGU7ZUFFVCwwRUFGUztZQUdaLENBQUMsT0FBRCxFQUFVLE9BQVYsQ0FIWTtVQUlkLGtCQUFXO1VBQ1hBLG1CQUFQOztFQXZQb0I7O3NCQTJQRDtTQUNiLFlBRGE7ZUFFUCx3RUFGTztZQUdWLENBQUMsT0FBRCxFQUFVLE9BQVYsQ0FIVTtVQUlaLGtCQUFXO1VBQ1hBLGlCQUFQOztFQWhRb0I7O21CQW9RSjtTQUNWLFFBRFU7ZUFFSixvS0FGSTtZQUdQLENBQUMsT0FBRCxDQUhPO1VBSVQsZ0JBQVNzTCxJQUFULEVBQWU3RixLQUFmLEVBQXNCO1VBQ3RCekYsY0FBQSxDQUFlOFYsSUFBZixDQUFvQnJRLE1BQU1xUSxJQUFOLElBQWMsSUFBbEMsQ0FBUDs7RUF6UW9COztxQkE2UUY7U0FDWixVQURZO2VBRU4sb0lBRk07WUFHVCxDQUFDLE9BQUQsRUFBVSxVQUFWLENBSFM7VUFJWCxrQkFBVztVQUNYOVYsZ0JBQVA7O0VBbFJvQjs7MkJBc1JJO1NBQ2xCLGlCQURrQjtlQUVaLDZFQUZZO1lBR2YsQ0FBQyxPQUFELEVBQVUsVUFBVixDQUhlO1VBSWpCLGdCQUFTc0wsSUFBVCxFQUFlN0YsS0FBZixFQUFzQjtVQUN0QnpGLHNCQUFBLENBQXVCK1YsT0FBdkIsQ0FBK0J0USxNQUFNc1EsT0FBTixJQUFpQixDQUFoRCxDQUFQOztFQTNSb0I7O3lCQStSRTtTQUNoQixlQURnQjtlQUVWLHNFQUZVO1lBR2IsQ0FBQyxPQUFELEVBQVUsVUFBVixDQUhhO1VBSWYsZ0JBQVN6SyxJQUFULEVBQWU3RixLQUFmLEVBQXNCO1VBQ3RCekYsb0JBQUEsQ0FBcUIrVixPQUFyQixDQUE2QnRRLE1BQU1zUSxPQUFOLElBQWlCLENBQTlDLENBQVA7O0VBcFNvQjs7dUJBd1NBO1NBQ2QsYUFEYztlQUVSLGlHQUZRO1lBR1gsQ0FBQyxPQUFELEVBQVUsYUFBVixDQUhXO1VBSWIsZ0JBQVN6SyxJQUFULEVBQWU3RixLQUFmLEVBQXNCO1VBQ3RCekYsa0JBQUEsQ0FBbUJnVyxLQUFuQixDQUF5QnZRLE1BQU11USxLQUFOLElBQWUsR0FBeEMsQ0FBUDs7RUE3U29COzs2QkFpVE07U0FDcEIsb0JBRG9CO2VBRWQsd0dBRmM7WUFHakIsQ0FBQyxPQUFELEVBQVUsYUFBVixDQUhpQjtVQUluQixnQkFBUzFLLElBQVQsRUFBZTdGLEtBQWYsRUFBc0I7VUFDdEJ6Rix3QkFBQSxDQUF5QmdXLEtBQXpCLENBQStCdlEsTUFBTXVRLEtBQU4sSUFBZSxHQUE5QyxDQUFQOztFQXRUb0I7OzJCQTBUSTtTQUNsQixrQkFEa0I7ZUFFWixpR0FGWTtZQUdmLENBQUMsT0FBRCxFQUFVLGFBQVYsQ0FIZTtVQUlqQixnQkFBUzFLLElBQVQsRUFBZTdGLEtBQWYsRUFBc0I7VUFDdEJ6RixzQkFBQSxDQUF1QmdXLEtBQXZCLENBQTZCdlEsTUFBTXVRLEtBQU4sSUFBZSxHQUE1QyxDQUFQOztFQS9Ub0I7O21CQW1VSjtTQUNWLFFBRFU7ZUFFSixtREFGSTtZQUdQLENBQUMsT0FBRCxFQUFVLFFBQVYsQ0FITztVQUlULGtCQUFXO1VBQ1hoVyxjQUFQOztFQXhVb0I7O3lCQTRVRTtTQUNoQixlQURnQjtlQUVWLGtIQUZVO1lBR2IsQ0FBQyxPQUFELEVBQVUsUUFBVixDQUhhO1VBSWYsa0JBQVc7VUFDWEEsb0JBQVA7O0VBalZvQjs7c0JBcVZEO1NBQ2IsWUFEYTtlQUVQLHVGQUZPO1lBR1YsQ0FBQyxPQUFELEVBQVUsVUFBVixDQUhVO1VBSVosa0JBQVc7VUFDWEEsaUJBQVA7O0VBMVZvQjs7c0JBOFZEO1NBQ2IsWUFEYTtlQUVQLHVGQUZPO1lBR1YsQ0FBQyxPQUFELEVBQVUsVUFBVixDQUhVO1VBSVosa0JBQVc7VUFDWEEsaUJBQVA7O0VBbldvQjs7b0JBdVdIO1NBQ1gsU0FEVztlQUVMLHdHQUZLO1lBR1IsQ0FBQyxPQUFELENBSFE7VUFJVixrQkFBVztVQUNYQSxlQUFQOztFQTVXb0I7O2lCQWdYTjtTQUNSLE1BRFE7ZUFFRixtSEFGRTtZQUdMLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FISztVQUlQLGtCQUFXO1VBQ1hBLFlBQVA7O0VBclhvQjs7c0JBeVhEO1NBQ2IsWUFEYTtlQUVQLG1IQUZPO1lBR1YsQ0FBQyxPQUFELEVBQVUsTUFBVixDQUhVO1VBSVosa0JBQVc7VUFDWEEsaUJBQVA7O0VBOVhvQjs7dUJBa1lBO1NBQ2QsYUFEYztlQUVSLG1IQUZRO1lBR1gsQ0FBQyxPQUFELEVBQVUsTUFBVixDQUhXO1VBSWIsa0JBQVc7VUFDWEEsa0JBQVA7O0VBdllvQjs7Ozt3QkE2WUM7U0FDZixhQURlO2VBRVQsNEVBRlM7WUFHWixDQUFDLFFBQUQsRUFBVyxhQUFYLENBSFk7VUFJZCxrQkFBVztVQUNYQSxtQkFBUDs7RUFsWm9COzt3QkFzWkM7U0FDZixhQURlO2VBRVQsK0VBRlM7WUFHWixDQUFDLFFBQUQsRUFBVyxhQUFYLENBSFk7VUFJZCxrQkFBVztVQUNYQSxtQkFBUDs7RUEzWm9COzt5QkErWkU7U0FDaEIsY0FEZ0I7ZUFFViwrRUFGVTtZQUdiLENBQUMsUUFBRCxFQUFXLGFBQVgsQ0FIYTtVQUlmLGtCQUFXO1VBQ1hBLG9CQUFQOztFQXBhb0I7O3lCQXdhRTtTQUNoQixjQURnQjtlQUVWLCtFQUZVO1lBR2IsQ0FBQyxRQUFELEVBQVcsYUFBWCxDQUhhO1VBSWYsa0JBQVc7VUFDWEEsb0JBQVA7O0VBN2FvQjs7MEJBaWJHO1NBQ2pCLFNBRGlCO2VBRVgsb05BRlc7WUFHZCxDQUFDLGFBQUQsRUFBZ0IsWUFBaEIsRUFBOEIsc0JBQTlCLENBSGM7VUFJaEIsa0JBQVc7VUFDWEEscUJBQVA7O0VBdGJvQjs7MEJBMGJHO1NBQ2pCLFNBRGlCO2VBRVgsNE1BRlc7WUFHZCxDQUFDLGFBQUQsRUFBZ0IsWUFBaEIsRUFBOEIsc0JBQTlCLENBSGM7VUFJaEIsa0JBQVc7VUFDWEEscUJBQVA7O0VBL2JvQjs7d0JBbWNDO1NBQ2YsT0FEZTtlQUVULDBNQUZTO1lBR1osQ0FBQyxhQUFELEVBQWdCLFlBQWhCLEVBQThCLHNCQUE5QixDQUhZO1VBSWQsa0JBQVc7VUFDWEEsbUJBQVA7O0VBeGNvQjs7eUJBNGNFO1NBQ2hCLFFBRGdCO2VBRVYsMk1BRlU7WUFHYixDQUFDLGFBQUQsRUFBZ0IsWUFBaEIsRUFBOEIsc0JBQTlCLENBSGE7VUFJZixrQkFBVztVQUNYQSxvQkFBUDs7RUFqZG9COzt1QkFxZEE7U0FDZCxNQURjO2VBRVIsaUtBRlE7WUFHWCxDQUFDLGFBQUQsRUFBZ0IsWUFBaEIsRUFBOEIsc0JBQTlCLENBSFc7VUFJYixrQkFBVztVQUNYQSxrQkFBUDs7RUExZG9COzt1QkE4ZEE7U0FDZCxNQURjO2VBRVIsd0lBRlE7WUFHWCxDQUFDLGFBQUQsRUFBZ0IsWUFBaEIsRUFBOEIsc0JBQTlCLENBSFc7VUFJYixrQkFBVztVQUNYQSxrQkFBUDs7RUFuZW9COzswQkF1ZUc7U0FDakIsU0FEaUI7ZUFFWCw4T0FGVztZQUdkLENBQUMsYUFBRCxFQUFnQixZQUFoQixFQUE4QixzQkFBOUIsQ0FIYztVQUloQixrQkFBVztVQUNYQSxxQkFBUDs7RUE1ZW9COzttQ0FnZlk7U0FDMUIsbUJBRDBCO2VBRXBCLG9JQUZvQjtZQUd2QixDQUFDLGFBQUQsRUFBZ0IsWUFBaEIsRUFBOEIsc0JBQTlCLENBSHVCO1VBSXpCLGtCQUFXO1VBQ1hBLDhCQUFQOzs7Q0FyZkk7O0FDRlAsYUFBZSxVQUFTaVcsU0FBVCxFQUFvQjtNQUM3QkMsSUFBSUQsVUFBVTVWLE1BQVYsR0FBbUIsQ0FBbkIsR0FBdUIsQ0FBL0I7TUFBa0M4VixTQUFTLElBQUl2RixLQUFKLENBQVVzRixDQUFWLENBQTNDO01BQXlEMVQsSUFBSSxDQUE3RDtTQUNPQSxJQUFJMFQsQ0FBWDtXQUFxQjFULENBQVAsSUFBWSxNQUFNeVQsVUFBVXJULEtBQVYsQ0FBZ0JKLElBQUksQ0FBcEIsRUFBdUIsRUFBRUEsQ0FBRixHQUFNLENBQTdCLENBQWxCO0dBQ2QsT0FBTzJULE1BQVA7OztBQ0RGLGFBQWVBLE9BQU8sa0RBQVAsQ0FBZjs7QUNBQSxZQUFlQSxPQUFPLGtEQUFQLENBQWY7O0FDQUEsYUFBZUEsT0FBTywwRUFBUCxDQUFmOztBQ0FBLGNBQWVBLE9BQU8sd0RBQVAsQ0FBZjs7QUNBQSxjQUFlQSxPQUFPLGtEQUFQLENBQWY7O0FDQUEsV0FBZUEsT0FBTyx3REFBUCxDQUFmOztBQ0FBLFdBQWVBLE9BQU8sa0RBQVAsQ0FBZjs7QUNBQSxXQUFlQSxPQUFPLDBFQUFQLENBQWY7O0FDRkEsYUFBZSxVQUFTQyxXQUFULEVBQXNCQyxPQUF0QixFQUErQkMsU0FBL0IsRUFBMEM7Y0FDM0NBLFNBQVosR0FBd0JELFFBQVFDLFNBQVIsR0FBb0JBLFNBQTVDO1lBQ1VGLFdBQVYsR0FBd0JBLFdBQXhCOzs7QUFHRixBQUFPLFNBQVMxRyxRQUFULENBQWdCNkcsTUFBaEIsRUFBd0JDLFVBQXhCLEVBQW9DO01BQ3JDRixZQUFZM0YsT0FBTzhDLE1BQVAsQ0FBYzhDLE9BQU9ELFNBQXJCLENBQWhCO09BQ0ssSUFBSTNTLEdBQVQsSUFBZ0I2UyxVQUFoQjtjQUFzQzdTLEdBQVYsSUFBaUI2UyxXQUFXN1MsR0FBWCxDQUFqQjtHQUM1QixPQUFPMlMsU0FBUDs7O0FDTkssU0FBU0csS0FBVCxHQUFpQjs7QUFFakIsSUFBSUMsVUFBUyxHQUFiO0FBQ0EsSUFBSUMsWUFBVyxJQUFJRCxPQUFuQjs7QUFFUCxJQUFJRSxNQUFNLHFCQUFWO0lBQ0lDLE1BQU0sK0NBRFY7SUFFSUMsTUFBTSxnREFGVjtJQUdJQyxTQUFTLGtCQUhiO0lBSUlDLFNBQVMsa0JBSmI7SUFLSUMsZUFBZSxJQUFJaEcsTUFBSixDQUFXLFlBQVksQ0FBQzJGLEdBQUQsRUFBTUEsR0FBTixFQUFXQSxHQUFYLENBQVosR0FBOEIsTUFBekMsQ0FMbkI7SUFNSU0sZUFBZSxJQUFJakcsTUFBSixDQUFXLFlBQVksQ0FBQzZGLEdBQUQsRUFBTUEsR0FBTixFQUFXQSxHQUFYLENBQVosR0FBOEIsTUFBekMsQ0FObkI7SUFPSUssZ0JBQWdCLElBQUlsRyxNQUFKLENBQVcsYUFBYSxDQUFDMkYsR0FBRCxFQUFNQSxHQUFOLEVBQVdBLEdBQVgsRUFBZ0JDLEdBQWhCLENBQWIsR0FBb0MsTUFBL0MsQ0FQcEI7SUFRSU8sZ0JBQWdCLElBQUluRyxNQUFKLENBQVcsYUFBYSxDQUFDNkYsR0FBRCxFQUFNQSxHQUFOLEVBQVdBLEdBQVgsRUFBZ0JELEdBQWhCLENBQWIsR0FBb0MsTUFBL0MsQ0FScEI7SUFTSVEsZUFBZSxJQUFJcEcsTUFBSixDQUFXLFlBQVksQ0FBQzRGLEdBQUQsRUFBTUMsR0FBTixFQUFXQSxHQUFYLENBQVosR0FBOEIsTUFBekMsQ0FUbkI7SUFVSVEsZ0JBQWdCLElBQUlyRyxNQUFKLENBQVcsYUFBYSxDQUFDNEYsR0FBRCxFQUFNQyxHQUFOLEVBQVdBLEdBQVgsRUFBZ0JELEdBQWhCLENBQWIsR0FBb0MsTUFBL0MsQ0FWcEI7O0FBWUEsSUFBSVUsUUFBUTthQUNDLFFBREQ7Z0JBRUksUUFGSjtRQUdKLFFBSEk7Y0FJRSxRQUpGO1NBS0gsUUFMRztTQU1ILFFBTkc7VUFPRixRQVBFO1NBUUgsUUFSRztrQkFTTSxRQVROO1FBVUosUUFWSTtjQVdFLFFBWEY7U0FZSCxRQVpHO2FBYUMsUUFiRDthQWNDLFFBZEQ7Y0FlRSxRQWZGO2FBZ0JDLFFBaEJEO1NBaUJILFFBakJHO2tCQWtCTSxRQWxCTjtZQW1CQSxRQW5CQTtXQW9CRCxRQXBCQztRQXFCSixRQXJCSTtZQXNCQSxRQXRCQTtZQXVCQSxRQXZCQTtpQkF3QkssUUF4Qkw7WUF5QkEsUUF6QkE7YUEwQkMsUUExQkQ7WUEyQkEsUUEzQkE7YUE0QkMsUUE1QkQ7ZUE2QkcsUUE3Qkg7a0JBOEJNLFFBOUJOO2NBK0JFLFFBL0JGO2NBZ0NFLFFBaENGO1dBaUNELFFBakNDO2NBa0NFLFFBbENGO2dCQW1DSSxRQW5DSjtpQkFvQ0ssUUFwQ0w7aUJBcUNLLFFBckNMO2lCQXNDSyxRQXRDTDtpQkF1Q0ssUUF2Q0w7Y0F3Q0UsUUF4Q0Y7WUF5Q0EsUUF6Q0E7ZUEwQ0csUUExQ0g7V0EyQ0QsUUEzQ0M7V0E0Q0QsUUE1Q0M7Y0E2Q0UsUUE3Q0Y7YUE4Q0MsUUE5Q0Q7ZUErQ0csUUEvQ0g7ZUFnREcsUUFoREg7V0FpREQsUUFqREM7YUFrREMsUUFsREQ7Y0FtREUsUUFuREY7UUFvREosUUFwREk7YUFxREMsUUFyREQ7UUFzREosUUF0REk7U0F1REgsUUF2REc7ZUF3REcsUUF4REg7UUF5REosUUF6REk7WUEwREEsUUExREE7V0EyREQsUUEzREM7YUE0REMsUUE1REQ7VUE2REYsUUE3REU7U0E4REgsUUE5REc7U0ErREgsUUEvREc7WUFnRUEsUUFoRUE7aUJBaUVLLFFBakVMO2FBa0VDLFFBbEVEO2dCQW1FSSxRQW5FSjthQW9FQyxRQXBFRDtjQXFFRSxRQXJFRjthQXNFQyxRQXRFRDt3QkF1RVksUUF2RVo7YUF3RUMsUUF4RUQ7Y0F5RUUsUUF6RUY7YUEwRUMsUUExRUQ7YUEyRUMsUUEzRUQ7ZUE0RUcsUUE1RUg7aUJBNkVLLFFBN0VMO2dCQThFSSxRQTlFSjtrQkErRU0sUUEvRU47a0JBZ0ZNLFFBaEZOO2tCQWlGTSxRQWpGTjtlQWtGRyxRQWxGSDtRQW1GSixRQW5GSTthQW9GQyxRQXBGRDtTQXFGSCxRQXJGRztXQXNGRCxRQXRGQztVQXVGRixRQXZGRTtvQkF3RlEsUUF4RlI7Y0F5RkUsUUF6RkY7Z0JBMEZJLFFBMUZKO2dCQTJGSSxRQTNGSjtrQkE0Rk0sUUE1Rk47bUJBNkZPLFFBN0ZQO3FCQThGUyxRQTlGVDttQkErRk8sUUEvRlA7bUJBZ0dPLFFBaEdQO2dCQWlHSSxRQWpHSjthQWtHQyxRQWxHRDthQW1HQyxRQW5HRDtZQW9HQSxRQXBHQTtlQXFHRyxRQXJHSDtRQXNHSixRQXRHSTtXQXVHRCxRQXZHQztTQXdHSCxRQXhHRzthQXlHQyxRQXpHRDtVQTBHRixRQTFHRTthQTJHQyxRQTNHRDtVQTRHRixRQTVHRTtpQkE2R0ssUUE3R0w7YUE4R0MsUUE5R0Q7aUJBK0dLLFFBL0dMO2lCQWdISyxRQWhITDtjQWlIRSxRQWpIRjthQWtIQyxRQWxIRDtRQW1ISixRQW5ISTtRQW9ISixRQXBISTtRQXFISixRQXJISTtjQXNIRSxRQXRIRjtVQXVIRixRQXZIRTtpQkF3SEssUUF4SEw7T0F5SEwsUUF6SEs7YUEwSEMsUUExSEQ7YUEySEMsUUEzSEQ7ZUE0SEcsUUE1SEg7VUE2SEYsUUE3SEU7Y0E4SEUsUUE5SEY7WUErSEEsUUEvSEE7WUFnSUEsUUFoSUE7VUFpSUYsUUFqSUU7VUFrSUYsUUFsSUU7V0FtSUQsUUFuSUM7YUFvSUMsUUFwSUQ7YUFxSUMsUUFySUQ7YUFzSUMsUUF0SUQ7UUF1SUosUUF2SUk7ZUF3SUcsUUF4SUg7YUF5SUMsUUF6SUQ7T0EwSUwsUUExSUs7UUEySUosUUEzSUk7V0E0SUQsUUE1SUM7VUE2SUYsUUE3SUU7YUE4SUMsUUE5SUQ7VUErSUYsUUEvSUU7U0FnSkgsUUFoSkc7U0FpSkgsUUFqSkc7Y0FrSkUsUUFsSkY7VUFtSkYsUUFuSkU7ZUFvSkc7Q0FwSmY7O0FBdUpBQyxPQUFPZixLQUFQLEVBQWMxUyxLQUFkLEVBQXFCO2VBQ04sdUJBQVc7V0FDZixLQUFLMFQsR0FBTCxHQUFXQyxXQUFYLEVBQVA7R0FGaUI7WUFJVCxvQkFBVztXQUNaLEtBQUtELEdBQUwsS0FBYSxFQUFwQjs7Q0FMSjs7QUFTQSxBQUFlLFNBQVMxVCxLQUFULENBQWU1QixTQUFmLEVBQXVCO01BQ2hDK08sQ0FBSjtjQUNTLENBQUMvTyxZQUFTLEVBQVYsRUFBY2pCLElBQWQsR0FBcUJ5VyxXQUFyQixFQUFUO1NBQ08sQ0FBQ3pHLElBQUk2RixPQUFPNUYsSUFBUCxDQUFZaFAsU0FBWixDQUFMLEtBQTZCK08sSUFBSTBHLFNBQVMxRyxFQUFFLENBQUYsQ0FBVCxFQUFlLEVBQWYsQ0FBSixFQUF3QixJQUFJMkcsR0FBSixDQUFTM0csS0FBSyxDQUFMLEdBQVMsR0FBVixHQUFrQkEsS0FBSyxDQUFMLEdBQVMsS0FBbkMsRUFBNENBLEtBQUssQ0FBTCxHQUFTLEdBQVYsR0FBa0JBLElBQUksSUFBakUsRUFBeUUsQ0FBQ0EsSUFBSSxHQUFMLEtBQWEsQ0FBZCxHQUFvQkEsSUFBSSxHQUFoRyxFQUFzRyxDQUF0RyxDQUFyRDtNQUNELENBQUNBLElBQUk4RixPQUFPN0YsSUFBUCxDQUFZaFAsU0FBWixDQUFMLElBQTRCMlYsS0FBS0YsU0FBUzFHLEVBQUUsQ0FBRixDQUFULEVBQWUsRUFBZixDQUFMLENBQTVCO0lBQ0EsQ0FBQ0EsSUFBSStGLGFBQWE5RixJQUFiLENBQWtCaFAsU0FBbEIsQ0FBTCxJQUFrQyxJQUFJMFYsR0FBSixDQUFRM0csRUFBRSxDQUFGLENBQVIsRUFBY0EsRUFBRSxDQUFGLENBQWQsRUFBb0JBLEVBQUUsQ0FBRixDQUFwQixFQUEwQixDQUExQixDQUFsQztJQUNBLENBQUNBLElBQUlnRyxhQUFhL0YsSUFBYixDQUFrQmhQLFNBQWxCLENBQUwsSUFBa0MsSUFBSTBWLEdBQUosQ0FBUTNHLEVBQUUsQ0FBRixJQUFPLEdBQVAsR0FBYSxHQUFyQixFQUEwQkEsRUFBRSxDQUFGLElBQU8sR0FBUCxHQUFhLEdBQXZDLEVBQTRDQSxFQUFFLENBQUYsSUFBTyxHQUFQLEdBQWEsR0FBekQsRUFBOEQsQ0FBOUQsQ0FBbEM7SUFDQSxDQUFDQSxJQUFJaUcsY0FBY2hHLElBQWQsQ0FBbUJoUCxTQUFuQixDQUFMLElBQW1DNFYsS0FBSzdHLEVBQUUsQ0FBRixDQUFMLEVBQVdBLEVBQUUsQ0FBRixDQUFYLEVBQWlCQSxFQUFFLENBQUYsQ0FBakIsRUFBdUJBLEVBQUUsQ0FBRixDQUF2QixDQUFuQztJQUNBLENBQUNBLElBQUlrRyxjQUFjakcsSUFBZCxDQUFtQmhQLFNBQW5CLENBQUwsSUFBbUM0VixLQUFLN0csRUFBRSxDQUFGLElBQU8sR0FBUCxHQUFhLEdBQWxCLEVBQXVCQSxFQUFFLENBQUYsSUFBTyxHQUFQLEdBQWEsR0FBcEMsRUFBeUNBLEVBQUUsQ0FBRixJQUFPLEdBQVAsR0FBYSxHQUF0RCxFQUEyREEsRUFBRSxDQUFGLENBQTNELENBQW5DO0lBQ0EsQ0FBQ0EsSUFBSW1HLGFBQWFsRyxJQUFiLENBQWtCaFAsU0FBbEIsQ0FBTCxJQUFrQzZWLEtBQUs5RyxFQUFFLENBQUYsQ0FBTCxFQUFXQSxFQUFFLENBQUYsSUFBTyxHQUFsQixFQUF1QkEsRUFBRSxDQUFGLElBQU8sR0FBOUIsRUFBbUMsQ0FBbkMsQ0FBbEM7SUFDQSxDQUFDQSxJQUFJb0csY0FBY25HLElBQWQsQ0FBbUJoUCxTQUFuQixDQUFMLElBQW1DNlYsS0FBSzlHLEVBQUUsQ0FBRixDQUFMLEVBQVdBLEVBQUUsQ0FBRixJQUFPLEdBQWxCLEVBQXVCQSxFQUFFLENBQUYsSUFBTyxHQUE5QixFQUFtQ0EsRUFBRSxDQUFGLENBQW5DLENBQW5DO0lBQ0FxRyxNQUFNekgsY0FBTixDQUFxQjNOLFNBQXJCLElBQStCMlYsS0FBS1AsTUFBTXBWLFNBQU4sQ0FBTCxDQUEvQixHQUNBQSxjQUFXLGFBQVgsR0FBMkIsSUFBSTBWLEdBQUosQ0FBUUksR0FBUixFQUFhQSxHQUFiLEVBQWtCQSxHQUFsQixFQUF1QixDQUF2QixDQUEzQixHQUNBLElBVk47OztBQWFGLFNBQVNILElBQVQsQ0FBYzVCLENBQWQsRUFBaUI7U0FDUixJQUFJMkIsR0FBSixDQUFRM0IsS0FBSyxFQUFMLEdBQVUsSUFBbEIsRUFBd0JBLEtBQUssQ0FBTCxHQUFTLElBQWpDLEVBQXVDQSxJQUFJLElBQTNDLEVBQWlELENBQWpELENBQVA7OztBQUdGLFNBQVM2QixJQUFULENBQWM3TCxDQUFkLEVBQWlCOUYsQ0FBakIsRUFBb0J3RixDQUFwQixFQUF1QkQsQ0FBdkIsRUFBMEI7TUFDcEJBLEtBQUssQ0FBVCxFQUFZTyxJQUFJOUYsSUFBSXdGLElBQUlxTSxHQUFaO1NBQ0wsSUFBSUosR0FBSixDQUFRM0wsQ0FBUixFQUFXOUYsQ0FBWCxFQUFjd0YsQ0FBZCxFQUFpQkQsQ0FBakIsQ0FBUDs7O0FBR0YsQUFBTyxTQUFTdU0sVUFBVCxDQUFvQjlHLENBQXBCLEVBQXVCO01BQ3hCLEVBQUVBLGFBQWFxRixLQUFmLENBQUosRUFBMkJyRixJQUFJck4sTUFBTXFOLENBQU4sQ0FBSjtNQUN2QixDQUFDQSxDQUFMLEVBQVEsT0FBTyxJQUFJeUcsR0FBSixFQUFQO01BQ0p6RyxFQUFFcUcsR0FBRixFQUFKO1NBQ08sSUFBSUksR0FBSixDQUFRekcsRUFBRWxGLENBQVYsRUFBYWtGLEVBQUVoTCxDQUFmLEVBQWtCZ0wsRUFBRXhGLENBQXBCLEVBQXVCd0YsRUFBRWhILE9BQXpCLENBQVA7OztBQUdGLEFBQU8sU0FBU3FOLEdBQVQsQ0FBYXZMLENBQWIsRUFBZ0I5RixDQUFoQixFQUFtQndGLENBQW5CLEVBQXNCeEIsT0FBdEIsRUFBK0I7U0FDN0JoSyxVQUFVQyxNQUFWLEtBQXFCLENBQXJCLEdBQXlCNlgsV0FBV2hNLENBQVgsQ0FBekIsR0FBeUMsSUFBSTJMLEdBQUosQ0FBUTNMLENBQVIsRUFBVzlGLENBQVgsRUFBY3dGLENBQWQsRUFBaUJ4QixXQUFXLElBQVgsR0FBa0IsQ0FBbEIsR0FBc0JBLE9BQXZDLENBQWhEOzs7QUFHRixBQUFPLFNBQVN5TixHQUFULENBQWEzTCxDQUFiLEVBQWdCOUYsQ0FBaEIsRUFBbUJ3RixDQUFuQixFQUFzQnhCLE9BQXRCLEVBQStCO09BQy9COEIsQ0FBTCxHQUFTLENBQUNBLENBQVY7T0FDSzlGLENBQUwsR0FBUyxDQUFDQSxDQUFWO09BQ0t3RixDQUFMLEdBQVMsQ0FBQ0EsQ0FBVjtPQUNLeEIsT0FBTCxHQUFlLENBQUNBLE9BQWhCOzs7QUFHRm9OLE9BQU9LLEdBQVAsRUFBWUosR0FBWixFQUFpQi9ILFNBQU8rRyxLQUFQLEVBQWM7WUFDbkIsa0JBQVN4RCxDQUFULEVBQVk7UUFDaEJBLEtBQUssSUFBTCxHQUFZMEQsU0FBWixHQUF1QnRVLEtBQUs4VixHQUFMLENBQVN4QixTQUFULEVBQW1CMUQsQ0FBbkIsQ0FBM0I7V0FDTyxJQUFJNEUsR0FBSixDQUFRLEtBQUszTCxDQUFMLEdBQVMrRyxDQUFqQixFQUFvQixLQUFLN00sQ0FBTCxHQUFTNk0sQ0FBN0IsRUFBZ0MsS0FBS3JILENBQUwsR0FBU3FILENBQXpDLEVBQTRDLEtBQUs3SSxPQUFqRCxDQUFQO0dBSDJCO1VBS3JCLGdCQUFTNkksQ0FBVCxFQUFZO1FBQ2RBLEtBQUssSUFBTCxHQUFZeUQsT0FBWixHQUFxQnJVLEtBQUs4VixHQUFMLENBQVN6QixPQUFULEVBQWlCekQsQ0FBakIsQ0FBekI7V0FDTyxJQUFJNEUsR0FBSixDQUFRLEtBQUszTCxDQUFMLEdBQVMrRyxDQUFqQixFQUFvQixLQUFLN00sQ0FBTCxHQUFTNk0sQ0FBN0IsRUFBZ0MsS0FBS3JILENBQUwsR0FBU3FILENBQXpDLEVBQTRDLEtBQUs3SSxPQUFqRCxDQUFQO0dBUDJCO09BU3hCLGVBQVc7V0FDUCxJQUFQO0dBVjJCO2VBWWhCLHVCQUFXO1dBQ2QsS0FBSyxLQUFLOEIsQ0FBVixJQUFlLEtBQUtBLENBQUwsSUFBVSxHQUExQixJQUNDLEtBQUssS0FBSzlGLENBQVYsSUFBZSxLQUFLQSxDQUFMLElBQVUsR0FEMUIsSUFFQyxLQUFLLEtBQUt3RixDQUFWLElBQWUsS0FBS0EsQ0FBTCxJQUFVLEdBRjFCLElBR0MsS0FBSyxLQUFLeEIsT0FBVixJQUFxQixLQUFLQSxPQUFMLElBQWdCLENBSDdDO0dBYjJCO1lBa0JuQixvQkFBVztRQUNmdUIsSUFBSSxLQUFLdkIsT0FBYixDQUFzQnVCLElBQUl1SSxNQUFNdkksQ0FBTixJQUFXLENBQVgsR0FBZXRKLEtBQUsrVixHQUFMLENBQVMsQ0FBVCxFQUFZL1YsS0FBS2lELEdBQUwsQ0FBUyxDQUFULEVBQVlxRyxDQUFaLENBQVosQ0FBbkI7V0FDZixDQUFDQSxNQUFNLENBQU4sR0FBVSxNQUFWLEdBQW1CLE9BQXBCLElBQ0R0SixLQUFLK1YsR0FBTCxDQUFTLENBQVQsRUFBWS9WLEtBQUtpRCxHQUFMLENBQVMsR0FBVCxFQUFjakQsS0FBS2dXLEtBQUwsQ0FBVyxLQUFLbk0sQ0FBaEIsS0FBc0IsQ0FBcEMsQ0FBWixDQURDLEdBQ3FELElBRHJELEdBRUQ3SixLQUFLK1YsR0FBTCxDQUFTLENBQVQsRUFBWS9WLEtBQUtpRCxHQUFMLENBQVMsR0FBVCxFQUFjakQsS0FBS2dXLEtBQUwsQ0FBVyxLQUFLalMsQ0FBaEIsS0FBc0IsQ0FBcEMsQ0FBWixDQUZDLEdBRXFELElBRnJELEdBR0QvRCxLQUFLK1YsR0FBTCxDQUFTLENBQVQsRUFBWS9WLEtBQUtpRCxHQUFMLENBQVMsR0FBVCxFQUFjakQsS0FBS2dXLEtBQUwsQ0FBVyxLQUFLek0sQ0FBaEIsS0FBc0IsQ0FBcEMsQ0FBWixDQUhDLElBSUFELE1BQU0sQ0FBTixHQUFVLEdBQVYsR0FBZ0IsT0FBT0EsQ0FBUCxHQUFXLEdBSjNCLENBQVA7O0NBcEJhLENBQWpCOztBQTRCQSxTQUFTcU0sSUFBVCxDQUFjN1MsQ0FBZCxFQUFpQm9QLENBQWpCLEVBQW9CekQsQ0FBcEIsRUFBdUJuRixDQUF2QixFQUEwQjtNQUNwQkEsS0FBSyxDQUFULEVBQVl4RyxJQUFJb1AsSUFBSXpELElBQUltSCxHQUFaLENBQVosS0FDSyxJQUFJbkgsS0FBSyxDQUFMLElBQVVBLEtBQUssQ0FBbkIsRUFBc0IzTCxJQUFJb1AsSUFBSTBELEdBQVIsQ0FBdEIsS0FDQSxJQUFJMUQsS0FBSyxDQUFULEVBQVlwUCxJQUFJOFMsR0FBSjtTQUNWLElBQUlLLEdBQUosQ0FBUW5ULENBQVIsRUFBV29QLENBQVgsRUFBY3pELENBQWQsRUFBaUJuRixDQUFqQixDQUFQOzs7QUFHRixBQUFPLFNBQVM0TSxVQUFULENBQW9CbkgsQ0FBcEIsRUFBdUI7TUFDeEJBLGFBQWFrSCxHQUFqQixFQUFzQixPQUFPLElBQUlBLEdBQUosQ0FBUWxILEVBQUVqTSxDQUFWLEVBQWFpTSxFQUFFbUQsQ0FBZixFQUFrQm5ELEVBQUVOLENBQXBCLEVBQXVCTSxFQUFFaEgsT0FBekIsQ0FBUDtNQUNsQixFQUFFZ0gsYUFBYXFGLEtBQWYsQ0FBSixFQUEyQnJGLElBQUlyTixNQUFNcU4sQ0FBTixDQUFKO01BQ3ZCLENBQUNBLENBQUwsRUFBUSxPQUFPLElBQUlrSCxHQUFKLEVBQVA7TUFDSmxILGFBQWFrSCxHQUFqQixFQUFzQixPQUFPbEgsQ0FBUDtNQUNsQkEsRUFBRXFHLEdBQUYsRUFBSjtNQUNJdkwsSUFBSWtGLEVBQUVsRixDQUFGLEdBQU0sR0FBZDtNQUNJOUYsSUFBSWdMLEVBQUVoTCxDQUFGLEdBQU0sR0FEZDtNQUVJd0YsSUFBSXdGLEVBQUV4RixDQUFGLEdBQU0sR0FGZDtNQUdJdEcsU0FBTWpELEtBQUtpRCxHQUFMLENBQVM0RyxDQUFULEVBQVk5RixDQUFaLEVBQWV3RixDQUFmLENBSFY7TUFJSXdNLE1BQU0vVixLQUFLK1YsR0FBTCxDQUFTbE0sQ0FBVCxFQUFZOUYsQ0FBWixFQUFld0YsQ0FBZixDQUpWO01BS0l6RyxJQUFJOFMsR0FMUjtNQU1JMUQsSUFBSTZELE1BQU05UyxNQU5kO01BT0l3TCxJQUFJLENBQUNzSCxNQUFNOVMsTUFBUCxJQUFjLENBUHRCO01BUUlpUCxDQUFKLEVBQU87UUFDRHJJLE1BQU1rTSxHQUFWLEVBQWVqVCxJQUFJLENBQUNpQixJQUFJd0YsQ0FBTCxJQUFVMkksQ0FBVixHQUFjLENBQUNuTyxJQUFJd0YsQ0FBTCxJQUFVLENBQTVCLENBQWYsS0FDSyxJQUFJeEYsTUFBTWdTLEdBQVYsRUFBZWpULElBQUksQ0FBQ3lHLElBQUlNLENBQUwsSUFBVXFJLENBQVYsR0FBYyxDQUFsQixDQUFmLEtBQ0FwUCxJQUFJLENBQUMrRyxJQUFJOUYsQ0FBTCxJQUFVbU8sQ0FBVixHQUFjLENBQWxCO1NBQ0F6RCxJQUFJLEdBQUosR0FBVXNILE1BQU05UyxNQUFoQixHQUFzQixJQUFJOFMsR0FBSixHQUFVOVMsTUFBckM7U0FDSyxFQUFMO0dBTEYsTUFNTztRQUNEd0wsSUFBSSxDQUFKLElBQVNBLElBQUksQ0FBYixHQUFpQixDQUFqQixHQUFxQjNMLENBQXpCOztTQUVLLElBQUltVCxHQUFKLENBQVFuVCxDQUFSLEVBQVdvUCxDQUFYLEVBQWN6RCxDQUFkLEVBQWlCTSxFQUFFaEgsT0FBbkIsQ0FBUDs7O0FBR0YsQUFBTyxTQUFTb08sR0FBVCxDQUFhclQsQ0FBYixFQUFnQm9QLENBQWhCLEVBQW1CekQsQ0FBbkIsRUFBc0IxRyxPQUF0QixFQUErQjtTQUM3QmhLLFVBQVVDLE1BQVYsS0FBcUIsQ0FBckIsR0FBeUJrWSxXQUFXcFQsQ0FBWCxDQUF6QixHQUF5QyxJQUFJbVQsR0FBSixDQUFRblQsQ0FBUixFQUFXb1AsQ0FBWCxFQUFjekQsQ0FBZCxFQUFpQjFHLFdBQVcsSUFBWCxHQUFrQixDQUFsQixHQUFzQkEsT0FBdkMsQ0FBaEQ7OztBQUdGLFNBQVNrTyxHQUFULENBQWFuVCxDQUFiLEVBQWdCb1AsQ0FBaEIsRUFBbUJ6RCxDQUFuQixFQUFzQjFHLE9BQXRCLEVBQStCO09BQ3hCakYsQ0FBTCxHQUFTLENBQUNBLENBQVY7T0FDS29QLENBQUwsR0FBUyxDQUFDQSxDQUFWO09BQ0t6RCxDQUFMLEdBQVMsQ0FBQ0EsQ0FBVjtPQUNLMUcsT0FBTCxHQUFlLENBQUNBLE9BQWhCOzs7QUFHRm9OLE9BQU9jLEdBQVAsRUFBWUUsR0FBWixFQUFpQjlJLFNBQU8rRyxLQUFQLEVBQWM7WUFDbkIsa0JBQVN4RCxDQUFULEVBQVk7UUFDaEJBLEtBQUssSUFBTCxHQUFZMEQsU0FBWixHQUF1QnRVLEtBQUs4VixHQUFMLENBQVN4QixTQUFULEVBQW1CMUQsQ0FBbkIsQ0FBM0I7V0FDTyxJQUFJcUYsR0FBSixDQUFRLEtBQUtuVCxDQUFiLEVBQWdCLEtBQUtvUCxDQUFyQixFQUF3QixLQUFLekQsQ0FBTCxHQUFTbUMsQ0FBakMsRUFBb0MsS0FBSzdJLE9BQXpDLENBQVA7R0FIMkI7VUFLckIsZ0JBQVM2SSxDQUFULEVBQVk7UUFDZEEsS0FBSyxJQUFMLEdBQVl5RCxPQUFaLEdBQXFCclUsS0FBSzhWLEdBQUwsQ0FBU3pCLE9BQVQsRUFBaUJ6RCxDQUFqQixDQUF6QjtXQUNPLElBQUlxRixHQUFKLENBQVEsS0FBS25ULENBQWIsRUFBZ0IsS0FBS29QLENBQXJCLEVBQXdCLEtBQUt6RCxDQUFMLEdBQVNtQyxDQUFqQyxFQUFvQyxLQUFLN0ksT0FBekMsQ0FBUDtHQVAyQjtPQVN4QixlQUFXO1FBQ1ZqRixJQUFJLEtBQUtBLENBQUwsR0FBUyxHQUFULEdBQWUsQ0FBQyxLQUFLQSxDQUFMLEdBQVMsQ0FBVixJQUFlLEdBQXRDO1FBQ0lvUCxJQUFJTCxNQUFNL08sQ0FBTixLQUFZK08sTUFBTSxLQUFLSyxDQUFYLENBQVosR0FBNEIsQ0FBNUIsR0FBZ0MsS0FBS0EsQ0FEN0M7UUFFSXpELElBQUksS0FBS0EsQ0FGYjtRQUdJMkgsS0FBSzNILElBQUksQ0FBQ0EsSUFBSSxHQUFKLEdBQVVBLENBQVYsR0FBYyxJQUFJQSxDQUFuQixJQUF3QnlELENBSHJDO1FBSUltRSxLQUFLLElBQUk1SCxDQUFKLEdBQVEySCxFQUpqQjtXQUtPLElBQUlaLEdBQUosQ0FDTGMsUUFBUXhULEtBQUssR0FBTCxHQUFXQSxJQUFJLEdBQWYsR0FBcUJBLElBQUksR0FBakMsRUFBc0N1VCxFQUF0QyxFQUEwQ0QsRUFBMUMsQ0FESyxFQUVMRSxRQUFReFQsQ0FBUixFQUFXdVQsRUFBWCxFQUFlRCxFQUFmLENBRkssRUFHTEUsUUFBUXhULElBQUksR0FBSixHQUFVQSxJQUFJLEdBQWQsR0FBb0JBLElBQUksR0FBaEMsRUFBcUN1VCxFQUFyQyxFQUF5Q0QsRUFBekMsQ0FISyxFQUlMLEtBQUtyTyxPQUpBLENBQVA7R0FmMkI7ZUFzQmhCLHVCQUFXO1dBQ2YsQ0FBQyxLQUFLLEtBQUttSyxDQUFWLElBQWUsS0FBS0EsQ0FBTCxJQUFVLENBQXpCLElBQThCTCxNQUFNLEtBQUtLLENBQVgsQ0FBL0IsS0FDQyxLQUFLLEtBQUt6RCxDQUFWLElBQWUsS0FBS0EsQ0FBTCxJQUFVLENBRDFCLElBRUMsS0FBSyxLQUFLMUcsT0FBVixJQUFxQixLQUFLQSxPQUFMLElBQWdCLENBRjdDOztDQXZCYSxDQUFqQjs7O0FBOEJBLFNBQVN1TyxPQUFULENBQWlCeFQsQ0FBakIsRUFBb0J1VCxFQUFwQixFQUF3QkQsRUFBeEIsRUFBNEI7U0FDbkIsQ0FBQ3RULElBQUksRUFBSixHQUFTdVQsS0FBSyxDQUFDRCxLQUFLQyxFQUFOLElBQVl2VCxDQUFaLEdBQWdCLEVBQTlCLEdBQ0ZBLElBQUksR0FBSixHQUFVc1QsRUFBVixHQUNBdFQsSUFBSSxHQUFKLEdBQVV1VCxLQUFLLENBQUNELEtBQUtDLEVBQU4sS0FBYSxNQUFNdlQsQ0FBbkIsSUFBd0IsRUFBdkMsR0FDQXVULEVBSEMsSUFHSyxHQUhaOzs7QUNyVUssSUFBSUUsVUFBVXZXLEtBQUtzRCxFQUFMLEdBQVUsR0FBeEI7QUFDUCxBQUFPLElBQUlrVCxVQUFVLE1BQU14VyxLQUFLc0QsRUFBekI7O0FDR1AsSUFBSW1ULEtBQUssRUFBVDtJQUNJQyxLQUFLLFFBRFQ7SUFFSUMsS0FBSyxDQUZUO0lBR0lDLEtBQUssUUFIVDtJQUlJQyxLQUFLLElBQUksRUFKYjtJQUtJQyxLQUFLLElBQUksRUFMYjtJQU1JQyxLQUFLLElBQUlELEVBQUosR0FBU0EsRUFObEI7SUFPSUUsS0FBS0YsS0FBS0EsRUFBTCxHQUFVQSxFQVBuQjs7QUFTQSxTQUFTRyxVQUFULENBQW9CbEksQ0FBcEIsRUFBdUI7TUFDakJBLGFBQWFtSSxHQUFqQixFQUFzQixPQUFPLElBQUlBLEdBQUosQ0FBUW5JLEVBQUVOLENBQVYsRUFBYU0sRUFBRXpGLENBQWYsRUFBa0J5RixFQUFFeEYsQ0FBcEIsRUFBdUJ3RixFQUFFaEgsT0FBekIsQ0FBUDtNQUNsQmdILGFBQWFvSSxHQUFqQixFQUFzQjtRQUNoQnJVLElBQUlpTSxFQUFFak0sQ0FBRixHQUFNeVQsT0FBZDtXQUNPLElBQUlXLEdBQUosQ0FBUW5JLEVBQUVOLENBQVYsRUFBYXpPLEtBQUtvWCxHQUFMLENBQVN0VSxDQUFULElBQWNpTSxFQUFFekMsQ0FBN0IsRUFBZ0N0TSxLQUFLcVgsR0FBTCxDQUFTdlUsQ0FBVCxJQUFjaU0sRUFBRXpDLENBQWhELEVBQW1EeUMsRUFBRWhILE9BQXJELENBQVA7O01BRUUsRUFBRWdILGFBQWF5RyxHQUFmLENBQUosRUFBeUJ6RyxJQUFJOEcsV0FBVzlHLENBQVgsQ0FBSjtNQUNyQnhGLElBQUkrTixRQUFRdkksRUFBRWxGLENBQVYsQ0FBUjtNQUNJUCxJQUFJZ08sUUFBUXZJLEVBQUVoTCxDQUFWLENBRFI7TUFFSTBLLElBQUk2SSxRQUFRdkksRUFBRXhGLENBQVYsQ0FGUjtNQUdJaEksSUFBSWdXLFFBQVEsQ0FBQyxZQUFZaE8sQ0FBWixHQUFnQixZQUFZRCxDQUE1QixHQUFnQyxZQUFZbUYsQ0FBN0MsSUFBa0RpSSxFQUExRCxDQUhSO01BSUlsVixJQUFJK1YsUUFBUSxDQUFDLFlBQVloTyxDQUFaLEdBQWdCLFlBQVlELENBQTVCLEdBQWdDLFlBQVltRixDQUE3QyxJQUFrRGtJLEVBQTFELENBSlI7TUFLSWEsSUFBSUQsUUFBUSxDQUFDLFlBQVloTyxDQUFaLEdBQWdCLFlBQVlELENBQTVCLEdBQWdDLFlBQVltRixDQUE3QyxJQUFrRG1JLEVBQTFELENBTFI7U0FNTyxJQUFJTSxHQUFKLENBQVEsTUFBTTFWLENBQU4sR0FBVSxFQUFsQixFQUFzQixPQUFPRCxJQUFJQyxDQUFYLENBQXRCLEVBQXFDLE9BQU9BLElBQUlnVyxDQUFYLENBQXJDLEVBQW9EekksRUFBRWhILE9BQXRELENBQVA7OztBQUdGLEFBQWUsU0FBUzBQLEdBQVQsQ0FBYWhKLENBQWIsRUFBZ0JuRixDQUFoQixFQUFtQkMsQ0FBbkIsRUFBc0J4QixPQUF0QixFQUErQjtTQUNyQ2hLLFVBQVVDLE1BQVYsS0FBcUIsQ0FBckIsR0FBeUJpWixXQUFXeEksQ0FBWCxDQUF6QixHQUF5QyxJQUFJeUksR0FBSixDQUFRekksQ0FBUixFQUFXbkYsQ0FBWCxFQUFjQyxDQUFkLEVBQWlCeEIsV0FBVyxJQUFYLEdBQWtCLENBQWxCLEdBQXNCQSxPQUF2QyxDQUFoRDs7O0FBR0YsQUFBTyxTQUFTbVAsR0FBVCxDQUFhekksQ0FBYixFQUFnQm5GLENBQWhCLEVBQW1CQyxDQUFuQixFQUFzQnhCLE9BQXRCLEVBQStCO09BQy9CMEcsQ0FBTCxHQUFTLENBQUNBLENBQVY7T0FDS25GLENBQUwsR0FBUyxDQUFDQSxDQUFWO09BQ0tDLENBQUwsR0FBUyxDQUFDQSxDQUFWO09BQ0t4QixPQUFMLEdBQWUsQ0FBQ0EsT0FBaEI7OztBQUdGb04sT0FBTytCLEdBQVAsRUFBWU8sR0FBWixFQUFpQnBLLFNBQU8rRyxLQUFQLEVBQWM7WUFDbkIscUJBQVN4RCxDQUFULEVBQVk7V0FDYixJQUFJc0csR0FBSixDQUFRLEtBQUt6SSxDQUFMLEdBQVNnSSxNQUFNN0YsS0FBSyxJQUFMLEdBQVksQ0FBWixHQUFnQkEsQ0FBdEIsQ0FBakIsRUFBMkMsS0FBS3RILENBQWhELEVBQW1ELEtBQUtDLENBQXhELEVBQTJELEtBQUt4QixPQUFoRSxDQUFQO0dBRjJCO1VBSXJCLG1CQUFTNkksQ0FBVCxFQUFZO1dBQ1gsSUFBSXNHLEdBQUosQ0FBUSxLQUFLekksQ0FBTCxHQUFTZ0ksTUFBTTdGLEtBQUssSUFBTCxHQUFZLENBQVosR0FBZ0JBLENBQXRCLENBQWpCLEVBQTJDLEtBQUt0SCxDQUFoRCxFQUFtRCxLQUFLQyxDQUF4RCxFQUEyRCxLQUFLeEIsT0FBaEUsQ0FBUDtHQUwyQjtPQU94QixrQkFBVztRQUNWdkcsSUFBSSxDQUFDLEtBQUtpTixDQUFMLEdBQVMsRUFBVixJQUFnQixHQUF4QjtRQUNJbE4sSUFBSXNRLE1BQU0sS0FBS3ZJLENBQVgsSUFBZ0I5SCxDQUFoQixHQUFvQkEsSUFBSSxLQUFLOEgsQ0FBTCxHQUFTLEdBRHpDO1FBRUlrTyxJQUFJM0YsTUFBTSxLQUFLdEksQ0FBWCxJQUFnQi9ILENBQWhCLEdBQW9CQSxJQUFJLEtBQUsrSCxDQUFMLEdBQVMsR0FGekM7UUFHSW9OLEtBQUtlLFFBQVFsVyxDQUFSLENBQVQ7UUFDSWtWLEtBQUtnQixRQUFRblcsQ0FBUixDQUFUO1FBQ0lxVixLQUFLYyxRQUFRRixDQUFSLENBQVQ7V0FDTyxJQUFJaEMsR0FBSixDQUNMbUMsUUFBUyxZQUFZcFcsQ0FBWixHQUFnQixZQUFZQyxDQUE1QixHQUFnQyxZQUFZZ1csQ0FBckQsQ0FESztZQUVHLENBQUMsU0FBRCxHQUFhalcsQ0FBYixHQUFpQixZQUFZQyxDQUE3QixHQUFpQyxZQUFZZ1csQ0FBckQsQ0FGSyxFQUdMRyxRQUFTLFlBQVlwVyxDQUFaLEdBQWdCLFlBQVlDLENBQTVCLEdBQWdDLFlBQVlnVyxDQUFyRCxDQUhLLEVBSUwsS0FBS3pQLE9BSkEsQ0FBUDs7Q0FkYSxDQUFqQjs7QUF1QkEsU0FBU3dQLE9BQVQsQ0FBaUI3WixDQUFqQixFQUFvQjtTQUNYQSxJQUFJc1osRUFBSixHQUFTaFgsS0FBSzhWLEdBQUwsQ0FBU3BZLENBQVQsRUFBWSxJQUFJLENBQWhCLENBQVQsR0FBOEJBLElBQUlxWixFQUFKLEdBQVNGLEVBQTlDOzs7QUFHRixTQUFTYSxPQUFULENBQWlCaGEsQ0FBakIsRUFBb0I7U0FDWEEsSUFBSW9aLEVBQUosR0FBU3BaLElBQUlBLENBQUosR0FBUUEsQ0FBakIsR0FBcUJxWixNQUFNclosSUFBSW1aLEVBQVYsQ0FBNUI7OztBQUdGLFNBQVNjLE9BQVQsQ0FBaUJwVyxDQUFqQixFQUFvQjtTQUNYLE9BQU9BLEtBQUssU0FBTCxHQUFpQixRQUFRQSxDQUF6QixHQUE2QixRQUFRdkIsS0FBSzhWLEdBQUwsQ0FBU3ZVLENBQVQsRUFBWSxJQUFJLEdBQWhCLENBQVIsR0FBK0IsS0FBbkUsQ0FBUDs7O0FBR0YsU0FBUytWLE9BQVQsQ0FBaUIvVixDQUFqQixFQUFvQjtTQUNYLENBQUNBLEtBQUssR0FBTixLQUFjLE9BQWQsR0FBd0JBLElBQUksS0FBNUIsR0FBb0N2QixLQUFLOFYsR0FBTCxDQUFTLENBQUN2VSxJQUFJLEtBQUwsSUFBYyxLQUF2QixFQUE4QixHQUE5QixDQUEzQzs7O0FBR0YsU0FBU3FXLFVBQVQsQ0FBb0I3SSxDQUFwQixFQUF1QjtNQUNqQkEsYUFBYW9JLEdBQWpCLEVBQXNCLE9BQU8sSUFBSUEsR0FBSixDQUFRcEksRUFBRWpNLENBQVYsRUFBYWlNLEVBQUV6QyxDQUFmLEVBQWtCeUMsRUFBRU4sQ0FBcEIsRUFBdUJNLEVBQUVoSCxPQUF6QixDQUFQO01BQ2xCLEVBQUVnSCxhQUFhbUksR0FBZixDQUFKLEVBQXlCbkksSUFBSWtJLFdBQVdsSSxDQUFYLENBQUo7TUFDckJqTSxJQUFJOUMsS0FBSzZYLEtBQUwsQ0FBVzlJLEVBQUV4RixDQUFiLEVBQWdCd0YsRUFBRXpGLENBQWxCLElBQXVCa04sT0FBL0I7U0FDTyxJQUFJVyxHQUFKLENBQVFyVSxJQUFJLENBQUosR0FBUUEsSUFBSSxHQUFaLEdBQWtCQSxDQUExQixFQUE2QjlDLEtBQUs4WCxJQUFMLENBQVUvSSxFQUFFekYsQ0FBRixHQUFNeUYsRUFBRXpGLENBQVIsR0FBWXlGLEVBQUV4RixDQUFGLEdBQU13RixFQUFFeEYsQ0FBOUIsQ0FBN0IsRUFBK0R3RixFQUFFTixDQUFqRSxFQUFvRU0sRUFBRWhILE9BQXRFLENBQVA7OztBQUdGLEFBQU8sU0FBU2dRLEdBQVQsQ0FBYWpWLENBQWIsRUFBZ0J3SixDQUFoQixFQUFtQm1DLENBQW5CLEVBQXNCMUcsT0FBdEIsRUFBK0I7U0FDN0JoSyxVQUFVQyxNQUFWLEtBQXFCLENBQXJCLEdBQXlCNFosV0FBVzlVLENBQVgsQ0FBekIsR0FBeUMsSUFBSXFVLEdBQUosQ0FBUXJVLENBQVIsRUFBV3dKLENBQVgsRUFBY21DLENBQWQsRUFBaUIxRyxXQUFXLElBQVgsR0FBa0IsQ0FBbEIsR0FBc0JBLE9BQXZDLENBQWhEOzs7QUFHRixBQUFPLFNBQVNvUCxHQUFULENBQWFyVSxDQUFiLEVBQWdCd0osQ0FBaEIsRUFBbUJtQyxDQUFuQixFQUFzQjFHLE9BQXRCLEVBQStCO09BQy9CakYsQ0FBTCxHQUFTLENBQUNBLENBQVY7T0FDS3dKLENBQUwsR0FBUyxDQUFDQSxDQUFWO09BQ0ttQyxDQUFMLEdBQVMsQ0FBQ0EsQ0FBVjtPQUNLMUcsT0FBTCxHQUFlLENBQUNBLE9BQWhCOzs7QUFHRm9OLE9BQU9nQyxHQUFQLEVBQVlZLEdBQVosRUFBaUIxSyxTQUFPK0csS0FBUCxFQUFjO1lBQ25CLHFCQUFTeEQsQ0FBVCxFQUFZO1dBQ2IsSUFBSXVHLEdBQUosQ0FBUSxLQUFLclUsQ0FBYixFQUFnQixLQUFLd0osQ0FBckIsRUFBd0IsS0FBS21DLENBQUwsR0FBU2dJLE1BQU03RixLQUFLLElBQUwsR0FBWSxDQUFaLEdBQWdCQSxDQUF0QixDQUFqQyxFQUEyRCxLQUFLN0ksT0FBaEUsQ0FBUDtHQUYyQjtVQUlyQixtQkFBUzZJLENBQVQsRUFBWTtXQUNYLElBQUl1RyxHQUFKLENBQVEsS0FBS3JVLENBQWIsRUFBZ0IsS0FBS3dKLENBQXJCLEVBQXdCLEtBQUttQyxDQUFMLEdBQVNnSSxNQUFNN0YsS0FBSyxJQUFMLEdBQVksQ0FBWixHQUFnQkEsQ0FBdEIsQ0FBakMsRUFBMkQsS0FBSzdJLE9BQWhFLENBQVA7R0FMMkI7T0FPeEIsa0JBQVc7V0FDUGtQLFdBQVcsSUFBWCxFQUFpQjdCLEdBQWpCLEVBQVA7O0NBUmEsQ0FBakI7O0FDN0ZBLElBQUk0QyxJQUFJLENBQUMsT0FBVDtJQUNJQyxJQUFJLENBQUMsT0FEVDtJQUVJQyxJQUFJLENBQUMsT0FGVDtJQUdJQyxJQUFJLENBQUMsT0FIVDtJQUlJQyxJQUFJLENBQUMsT0FKVDtJQUtJQyxLQUFLRCxJQUFJRCxDQUxiO0lBTUlHLEtBQUtGLElBQUlILENBTmI7SUFPSU0sUUFBUU4sSUFBSUMsQ0FBSixHQUFRQyxJQUFJSCxDQVB4Qjs7QUFTQSxTQUFTUSxnQkFBVCxDQUEwQnpKLENBQTFCLEVBQTZCO01BQ3ZCQSxhQUFhMEosU0FBakIsRUFBNEIsT0FBTyxJQUFJQSxTQUFKLENBQWMxSixFQUFFak0sQ0FBaEIsRUFBbUJpTSxFQUFFbUQsQ0FBckIsRUFBd0JuRCxFQUFFTixDQUExQixFQUE2Qk0sRUFBRWhILE9BQS9CLENBQVA7TUFDeEIsRUFBRWdILGFBQWF5RyxHQUFmLENBQUosRUFBeUJ6RyxJQUFJOEcsV0FBVzlHLENBQVgsQ0FBSjtNQUNyQmxGLElBQUlrRixFQUFFbEYsQ0FBRixHQUFNLEdBQWQ7TUFDSTlGLElBQUlnTCxFQUFFaEwsQ0FBRixHQUFNLEdBRGQ7TUFFSXdGLElBQUl3RixFQUFFeEYsQ0FBRixHQUFNLEdBRmQ7TUFHSWtGLElBQUksQ0FBQzhKLFFBQVFoUCxDQUFSLEdBQVk4TyxLQUFLeE8sQ0FBakIsR0FBcUJ5TyxLQUFLdlUsQ0FBM0IsS0FBaUN3VSxRQUFRRixFQUFSLEdBQWFDLEVBQTlDLENBSFI7TUFJSUksS0FBS25QLElBQUlrRixDQUpiO01BS0ltQyxJQUFJLENBQUN3SCxLQUFLclUsSUFBSTBLLENBQVQsSUFBY3lKLElBQUlRLEVBQW5CLElBQXlCUCxDQUxqQztNQU1JakcsSUFBSWxTLEtBQUs4WCxJQUFMLENBQVVsSCxJQUFJQSxDQUFKLEdBQVE4SCxLQUFLQSxFQUF2QixLQUE4Qk4sSUFBSTNKLENBQUosSUFBUyxJQUFJQSxDQUFiLENBQTlCLENBTlI7O01BT1F5RCxJQUFJbFMsS0FBSzZYLEtBQUwsQ0FBV2pILENBQVgsRUFBYzhILEVBQWQsSUFBb0JsQyxPQUFwQixHQUE4QixHQUFsQyxHQUF3Q1osR0FQaEQ7U0FRTyxJQUFJNkMsU0FBSixDQUFjM1YsSUFBSSxDQUFKLEdBQVFBLElBQUksR0FBWixHQUFrQkEsQ0FBaEMsRUFBbUNvUCxDQUFuQyxFQUFzQ3pELENBQXRDLEVBQXlDTSxFQUFFaEgsT0FBM0MsQ0FBUDs7O0FBR0YsQUFBZSxTQUFTNFEsU0FBVCxDQUFtQjdWLENBQW5CLEVBQXNCb1AsQ0FBdEIsRUFBeUJ6RCxDQUF6QixFQUE0QjFHLE9BQTVCLEVBQXFDO1NBQzNDaEssVUFBVUMsTUFBVixLQUFxQixDQUFyQixHQUF5QndhLGlCQUFpQjFWLENBQWpCLENBQXpCLEdBQStDLElBQUkyVixTQUFKLENBQWMzVixDQUFkLEVBQWlCb1AsQ0FBakIsRUFBb0J6RCxDQUFwQixFQUF1QjFHLFdBQVcsSUFBWCxHQUFrQixDQUFsQixHQUFzQkEsT0FBN0MsQ0FBdEQ7OztBQUdGLEFBQU8sU0FBUzBRLFNBQVQsQ0FBbUIzVixDQUFuQixFQUFzQm9QLENBQXRCLEVBQXlCekQsQ0FBekIsRUFBNEIxRyxPQUE1QixFQUFxQztPQUNyQ2pGLENBQUwsR0FBUyxDQUFDQSxDQUFWO09BQ0tvUCxDQUFMLEdBQVMsQ0FBQ0EsQ0FBVjtPQUNLekQsQ0FBTCxHQUFTLENBQUNBLENBQVY7T0FDSzFHLE9BQUwsR0FBZSxDQUFDQSxPQUFoQjs7O0FBR0ZvTixPQUFPc0QsU0FBUCxFQUFrQkUsU0FBbEIsRUFBNkJ0TCxTQUFPK0csS0FBUCxFQUFjO1lBQy9CLHFCQUFTeEQsQ0FBVCxFQUFZO1FBQ2hCQSxLQUFLLElBQUwsR0FBWTBELFNBQVosR0FBdUJ0VSxLQUFLOFYsR0FBTCxDQUFTeEIsU0FBVCxFQUFtQjFELENBQW5CLENBQTNCO1dBQ08sSUFBSTZILFNBQUosQ0FBYyxLQUFLM1YsQ0FBbkIsRUFBc0IsS0FBS29QLENBQTNCLEVBQThCLEtBQUt6RCxDQUFMLEdBQVNtQyxDQUF2QyxFQUEwQyxLQUFLN0ksT0FBL0MsQ0FBUDtHQUh1QztVQUtqQyxtQkFBUzZJLENBQVQsRUFBWTtRQUNkQSxLQUFLLElBQUwsR0FBWXlELE9BQVosR0FBcUJyVSxLQUFLOFYsR0FBTCxDQUFTekIsT0FBVCxFQUFpQnpELENBQWpCLENBQXpCO1dBQ08sSUFBSTZILFNBQUosQ0FBYyxLQUFLM1YsQ0FBbkIsRUFBc0IsS0FBS29QLENBQTNCLEVBQThCLEtBQUt6RCxDQUFMLEdBQVNtQyxDQUF2QyxFQUEwQyxLQUFLN0ksT0FBL0MsQ0FBUDtHQVB1QztPQVNwQyxrQkFBVztRQUNWakYsSUFBSStPLE1BQU0sS0FBSy9PLENBQVgsSUFBZ0IsQ0FBaEIsR0FBb0IsQ0FBQyxLQUFLQSxDQUFMLEdBQVMsR0FBVixJQUFpQnlULE9BQTdDO1FBQ0k5SCxJQUFJLENBQUMsS0FBS0EsQ0FEZDtRQUVJbkYsSUFBSXVJLE1BQU0sS0FBS0ssQ0FBWCxJQUFnQixDQUFoQixHQUFvQixLQUFLQSxDQUFMLEdBQVN6RCxDQUFULElBQWMsSUFBSUEsQ0FBbEIsQ0FGNUI7UUFHSW1LLE9BQU81WSxLQUFLb1gsR0FBTCxDQUFTdFUsQ0FBVCxDQUhYO1FBSUkrVixPQUFPN1ksS0FBS3FYLEdBQUwsQ0FBU3ZVLENBQVQsQ0FKWDtXQUtPLElBQUkwUyxHQUFKLENBQ0wsT0FBTy9HLElBQUluRixLQUFLME8sSUFBSVksSUFBSixHQUFXWCxJQUFJWSxJQUFwQixDQUFYLENBREssRUFFTCxPQUFPcEssSUFBSW5GLEtBQUs0TyxJQUFJVSxJQUFKLEdBQVdULElBQUlVLElBQXBCLENBQVgsQ0FGSyxFQUdMLE9BQU9wSyxJQUFJbkYsS0FBSzhPLElBQUlRLElBQVQsQ0FBWCxDQUhLLEVBSUwsS0FBSzdRLE9BSkEsQ0FBUDs7Q0FmeUIsQ0FBN0I7O0FDdENPLFNBQVMrUSxLQUFULENBQWVoQyxFQUFmLEVBQW1CaUMsRUFBbkIsRUFBdUJDLEVBQXZCLEVBQTJCQyxFQUEzQixFQUErQkMsRUFBL0IsRUFBbUM7TUFDcENuQyxLQUFLRCxLQUFLQSxFQUFkO01BQWtCRSxLQUFLRCxLQUFLRCxFQUE1QjtTQUNPLENBQUMsQ0FBQyxJQUFJLElBQUlBLEVBQVIsR0FBYSxJQUFJQyxFQUFqQixHQUFzQkMsRUFBdkIsSUFBNkIrQixFQUE3QixHQUNGLENBQUMsSUFBSSxJQUFJaEMsRUFBUixHQUFhLElBQUlDLEVBQWxCLElBQXdCZ0MsRUFEdEIsR0FFRixDQUFDLElBQUksSUFBSWxDLEVBQVIsR0FBYSxJQUFJQyxFQUFqQixHQUFzQixJQUFJQyxFQUEzQixJQUFpQ2lDLEVBRi9CLEdBR0ZqQyxLQUFLa0MsRUFISixJQUdVLENBSGpCOzs7QUFNRixjQUFlLFVBQVNDLE1BQVQsRUFBaUI7TUFDMUJ0RixJQUFJc0YsT0FBT25iLE1BQVAsR0FBZ0IsQ0FBeEI7U0FDTyxVQUFTTixDQUFULEVBQVk7UUFDYnlDLElBQUl6QyxLQUFLLENBQUwsR0FBVUEsSUFBSSxDQUFkLEdBQW1CQSxLQUFLLENBQUwsSUFBVUEsSUFBSSxDQUFKLEVBQU9tVyxJQUFJLENBQXJCLElBQTBCN1QsS0FBS29aLEtBQUwsQ0FBVzFiLElBQUltVyxDQUFmLENBQXJEO1FBQ0ltRixLQUFLRyxPQUFPaFosQ0FBUCxDQURUO1FBRUk4WSxLQUFLRSxPQUFPaFosSUFBSSxDQUFYLENBRlQ7UUFHSTRZLEtBQUs1WSxJQUFJLENBQUosR0FBUWdaLE9BQU9oWixJQUFJLENBQVgsQ0FBUixHQUF3QixJQUFJNlksRUFBSixHQUFTQyxFQUgxQztRQUlJQyxLQUFLL1ksSUFBSTBULElBQUksQ0FBUixHQUFZc0YsT0FBT2haLElBQUksQ0FBWCxDQUFaLEdBQTRCLElBQUk4WSxFQUFKLEdBQVNELEVBSjlDO1dBS09GLE1BQU0sQ0FBQ3BiLElBQUl5QyxJQUFJMFQsQ0FBVCxJQUFjQSxDQUFwQixFQUF1QmtGLEVBQXZCLEVBQTJCQyxFQUEzQixFQUErQkMsRUFBL0IsRUFBbUNDLEVBQW5DLENBQVA7R0FORjs7O0FDVkYsZUFBZSxVQUFTM1gsQ0FBVCxFQUFZO1NBQ2xCLFlBQVc7V0FDVEEsQ0FBUDtHQURGOzs7QUNDRixTQUFTOFgsTUFBVCxDQUFnQi9QLENBQWhCLEVBQW1CbkwsQ0FBbkIsRUFBc0I7U0FDYixVQUFTVCxDQUFULEVBQVk7V0FDVjRMLElBQUk1TCxJQUFJUyxDQUFmO0dBREY7OztBQUtGLFNBQVNtYixXQUFULENBQXFCaFEsQ0FBckIsRUFBd0JDLENBQXhCLEVBQTJCL0gsQ0FBM0IsRUFBOEI7U0FDckI4SCxJQUFJdEosS0FBSzhWLEdBQUwsQ0FBU3hNLENBQVQsRUFBWTlILENBQVosQ0FBSixFQUFvQitILElBQUl2SixLQUFLOFYsR0FBTCxDQUFTdk0sQ0FBVCxFQUFZL0gsQ0FBWixJQUFpQjhILENBQXpDLEVBQTRDOUgsSUFBSSxJQUFJQSxDQUFwRCxFQUF1RCxVQUFTOUQsQ0FBVCxFQUFZO1dBQ2pFc0MsS0FBSzhWLEdBQUwsQ0FBU3hNLElBQUk1TCxJQUFJNkwsQ0FBakIsRUFBb0IvSCxDQUFwQixDQUFQO0dBREY7OztBQUtGLEFBQU8sU0FBUytYLEdBQVQsQ0FBYWpRLENBQWIsRUFBZ0JDLENBQWhCLEVBQW1CO01BQ3BCcEwsSUFBSW9MLElBQUlELENBQVo7U0FDT25MLElBQUlrYixPQUFPL1AsQ0FBUCxFQUFVbkwsSUFBSSxHQUFKLElBQVdBLElBQUksQ0FBQyxHQUFoQixHQUFzQkEsSUFBSSxNQUFNNkIsS0FBS2dXLEtBQUwsQ0FBVzdYLElBQUksR0FBZixDQUFoQyxHQUFzREEsQ0FBaEUsQ0FBSixHQUF5RXFiLFNBQVMzSCxNQUFNdkksQ0FBTixJQUFXQyxDQUFYLEdBQWVELENBQXhCLENBQWhGOzs7QUFHRixBQUFPLFNBQVNrSixLQUFULENBQWVoUixDQUFmLEVBQWtCO1NBQ2hCLENBQUNBLElBQUksQ0FBQ0EsQ0FBTixNQUFhLENBQWIsR0FBaUJpWSxPQUFqQixHQUEyQixVQUFTblEsQ0FBVCxFQUFZQyxDQUFaLEVBQWU7V0FDeENBLElBQUlELENBQUosR0FBUWdRLFlBQVloUSxDQUFaLEVBQWVDLENBQWYsRUFBa0IvSCxDQUFsQixDQUFSLEdBQStCZ1ksU0FBUzNILE1BQU12SSxDQUFOLElBQVdDLENBQVgsR0FBZUQsQ0FBeEIsQ0FBdEM7R0FERjs7O0FBS0YsQUFBZSxTQUFTbVEsT0FBVCxDQUFpQm5RLENBQWpCLEVBQW9CQyxDQUFwQixFQUF1QjtNQUNoQ3BMLElBQUlvTCxJQUFJRCxDQUFaO1NBQ09uTCxJQUFJa2IsT0FBTy9QLENBQVAsRUFBVW5MLENBQVYsQ0FBSixHQUFtQnFiLFNBQVMzSCxNQUFNdkksQ0FBTixJQUFXQyxDQUFYLEdBQWVELENBQXhCLENBQTFCOzs7QUN0QmEsQ0FBQyxDQUFBLFNBQVNvUSxRQUFULENBQWtCbFksQ0FBbEIsRUFBcUI7TUFDL0JFLFdBQVE4USxNQUFNaFIsQ0FBTixDQUFaOztXQUVTNFQsTUFBVCxDQUFhdUUsS0FBYixFQUFvQkMsR0FBcEIsRUFBeUI7UUFDbkIvUCxJQUFJbkksU0FBTSxDQUFDaVksUUFBUUUsSUFBU0YsS0FBVCxDQUFULEVBQTBCOVAsQ0FBaEMsRUFBbUMsQ0FBQytQLE1BQU1DLElBQVNELEdBQVQsQ0FBUCxFQUFzQi9QLENBQXpELENBQVI7UUFDSTlGLElBQUlyQyxTQUFNaVksTUFBTTVWLENBQVosRUFBZTZWLElBQUk3VixDQUFuQixDQURSO1FBRUl3RixJQUFJN0gsU0FBTWlZLE1BQU1wUSxDQUFaLEVBQWVxUSxJQUFJclEsQ0FBbkIsQ0FGUjtRQUdJeEIsVUFBVTBSLFFBQVFFLE1BQU01UixPQUFkLEVBQXVCNlIsSUFBSTdSLE9BQTNCLENBSGQ7V0FJTyxVQUFTckssQ0FBVCxFQUFZO1lBQ1htTSxDQUFOLEdBQVVBLEVBQUVuTSxDQUFGLENBQVY7WUFDTXFHLENBQU4sR0FBVUEsRUFBRXJHLENBQUYsQ0FBVjtZQUNNNkwsQ0FBTixHQUFVQSxFQUFFN0wsQ0FBRixDQUFWO1lBQ01xSyxPQUFOLEdBQWdCQSxRQUFRckssQ0FBUixDQUFoQjthQUNPaWMsUUFBUSxFQUFmO0tBTEY7OztTQVNFbkgsS0FBSixHQUFZa0gsUUFBWjs7U0FFT3RFLE1BQVA7Q0FuQmEsQ0FBQSxFQW9CWixDQXBCWSxDQUFmOztBQXNCQSxTQUFTMEUsU0FBVCxDQUFtQkMsTUFBbkIsRUFBMkI7U0FDbEIsVUFBU2pHLE1BQVQsRUFBaUI7UUFDbEJELElBQUlDLE9BQU85VixNQUFmO1FBQ0k2TCxJQUFJLElBQUkwRSxLQUFKLENBQVVzRixDQUFWLENBRFI7UUFFSTlQLElBQUksSUFBSXdLLEtBQUosQ0FBVXNGLENBQVYsQ0FGUjtRQUdJdEssSUFBSSxJQUFJZ0YsS0FBSixDQUFVc0YsQ0FBVixDQUhSO1FBSUkxVCxDQUpKO1FBSU91QixRQUpQO1NBS0t2QixJQUFJLENBQVQsRUFBWUEsSUFBSTBULENBQWhCLEVBQW1CLEVBQUUxVCxDQUFyQixFQUF3QjtpQkFDZDBaLElBQVMvRixPQUFPM1QsQ0FBUCxDQUFULENBQVI7UUFDRUEsQ0FBRixJQUFPdUIsU0FBTW1JLENBQU4sSUFBVyxDQUFsQjtRQUNFMUosQ0FBRixJQUFPdUIsU0FBTXFDLENBQU4sSUFBVyxDQUFsQjtRQUNFNUQsQ0FBRixJQUFPdUIsU0FBTTZILENBQU4sSUFBVyxDQUFsQjs7UUFFRXdRLE9BQU9sUSxDQUFQLENBQUo7UUFDSWtRLE9BQU9oVyxDQUFQLENBQUo7UUFDSWdXLE9BQU94USxDQUFQLENBQUo7YUFDTXhCLE9BQU4sR0FBZ0IsQ0FBaEI7V0FDTyxVQUFTckssQ0FBVCxFQUFZO2VBQ1htTSxDQUFOLEdBQVVBLEVBQUVuTSxDQUFGLENBQVY7ZUFDTXFHLENBQU4sR0FBVUEsRUFBRXJHLENBQUYsQ0FBVjtlQUNNNkwsQ0FBTixHQUFVQSxFQUFFN0wsQ0FBRixDQUFWO2FBQ09nRSxXQUFRLEVBQWY7S0FKRjtHQWhCRjs7O0FBeUJGLEFBQU8sSUFBSXNZLFdBQVdGLFVBQVVoQixPQUFWLENBQWYsQ0FDUCxBQUFPOztBQ3REUCxhQUFlLFVBQVN4UCxDQUFULEVBQVlDLENBQVosRUFBZTtTQUNyQkQsSUFBSSxDQUFDQSxDQUFMLEVBQVFDLEtBQUtELENBQWIsRUFBZ0IsVUFBUzVMLENBQVQsRUFBWTtXQUMxQjRMLElBQUlDLElBQUk3TCxDQUFmO0dBREY7OztBQ0NGLElBQUl1YyxNQUFNLDZDQUFWO0lBQ0lDLE1BQU0sSUFBSXRMLE1BQUosQ0FBV3FMLElBQUkxTSxNQUFmLEVBQXVCLEdBQXZCLENBRFY7O0FBR0EsU0FBUzRNLElBQVQsQ0FBYzVRLENBQWQsRUFBaUI7U0FDUixZQUFXO1dBQ1RBLENBQVA7R0FERjs7O0FBS0YsU0FBUzZRLEdBQVQsQ0FBYTdRLENBQWIsRUFBZ0I7U0FDUCxVQUFTN0wsQ0FBVCxFQUFZO1dBQ1Y2TCxFQUFFN0wsQ0FBRixJQUFPLEVBQWQ7R0FERjtDQUtGOztBQ0FBO3NCQUVBOztBQ2hCQSxTQUFTaWIsV0FBVCxDQUFtQlksTUFBbkIsRUFBd0I7U0FDZCxTQUFTYyxjQUFULENBQXdCN1ksQ0FBeEIsRUFBMkI7UUFDN0IsQ0FBQ0EsQ0FBTDs7YUFFU21YLFlBQVQsQ0FBbUJnQixLQUFuQixFQUEwQkMsR0FBMUIsRUFBK0I7VUFDekI5VyxJQUFJeVcsT0FBSSxDQUFDSSxRQUFRVyxVQUFlWCxLQUFmLENBQVQsRUFBZ0M3VyxDQUFwQyxFQUF1QyxDQUFDOFcsTUFBTVUsVUFBZVYsR0FBZixDQUFQLEVBQTRCOVcsQ0FBbkUsQ0FBUjtVQUNJb1AsSUFBSXhRLFFBQU1pWSxNQUFNekgsQ0FBWixFQUFlMEgsSUFBSTFILENBQW5CLENBRFI7VUFFSXpELElBQUkvTSxRQUFNaVksTUFBTWxMLENBQVosRUFBZW1MLElBQUluTCxDQUFuQixDQUZSO1VBR0kxRyxVQUFVckcsUUFBTWlZLE1BQU01UixPQUFaLEVBQXFCNlIsSUFBSTdSLE9BQXpCLENBSGQ7YUFJTyxVQUFTckssQ0FBVCxFQUFZO2NBQ1hvRixDQUFOLEdBQVVBLEVBQUVwRixDQUFGLENBQVY7Y0FDTXdVLENBQU4sR0FBVUEsRUFBRXhVLENBQUYsQ0FBVjtjQUNNK1EsQ0FBTixHQUFVQSxFQUFFek8sS0FBSzhWLEdBQUwsQ0FBU3BZLENBQVQsRUFBWThELENBQVosQ0FBRixDQUFWO2NBQ011RyxPQUFOLEdBQWdCQSxRQUFRckssQ0FBUixDQUFoQjtlQUNPaWMsUUFBUSxFQUFmO09BTEY7OztpQkFTUW5ILEtBQVYsR0FBa0I2SCxjQUFsQjs7V0FFTzFCLFlBQVA7R0FuQkssQ0FvQkosQ0FwQkksQ0FBUDs7O0FBdUJGLEFBQWVBLFlBQVVZLEdBQVYsQ0FBZjtBQUNBLEFBQU8sSUFBSWdCLGdCQUFnQjVCLFlBQVVqWCxPQUFWLENBQXBCOztBQzFCUCxXQUFlLFVBQVM4WSxNQUFULEVBQWlCO1NBQ3ZCQyxTQUFvQkQsT0FBT0EsT0FBT3hjLE1BQVAsR0FBZ0IsQ0FBdkIsQ0FBcEIsQ0FBUDs7O0FDQUssSUFBSXdjLFNBQVMsSUFBSWpNLEtBQUosQ0FBVSxDQUFWLEVBQWErRCxNQUFiLENBQ2xCLG9CQURrQixFQUVsQiwwQkFGa0IsRUFHbEIsZ0NBSGtCLEVBSWxCLHNDQUprQixFQUtsQiw0Q0FMa0IsRUFNbEIsa0RBTmtCLEVBT2xCLHdEQVBrQixFQVFsQiw4REFSa0IsRUFTbEIsb0VBVGtCLEVBVWxCM1IsR0FWa0IsQ0FVZG1ULE1BVmMsQ0FBYjs7QUFZUCxXQUFlNEcsS0FBS0YsTUFBTCxDQUFmOztBQ1pPLElBQUlBLFdBQVMsSUFBSWpNLEtBQUosQ0FBVSxDQUFWLEVBQWErRCxNQUFiLENBQ2xCLG9CQURrQixFQUVsQiwwQkFGa0IsRUFHbEIsZ0NBSGtCLEVBSWxCLHNDQUprQixFQUtsQiw0Q0FMa0IsRUFNbEIsa0RBTmtCLEVBT2xCLHdEQVBrQixFQVFsQiw4REFSa0IsRUFTbEIsb0VBVGtCLEVBVWxCM1IsR0FWa0IsQ0FVZG1ULE1BVmMsQ0FBYjs7QUFZUCxXQUFlNEcsS0FBS0YsUUFBTCxDQUFmOztBQ1pPLElBQUlBLFdBQVMsSUFBSWpNLEtBQUosQ0FBVSxDQUFWLEVBQWErRCxNQUFiLENBQ2xCLG9CQURrQixFQUVsQiwwQkFGa0IsRUFHbEIsZ0NBSGtCLEVBSWxCLHNDQUprQixFQUtsQiw0Q0FMa0IsRUFNbEIsa0RBTmtCLEVBT2xCLHdEQVBrQixFQVFsQiw4REFSa0IsRUFTbEIsb0VBVGtCLEVBVWxCM1IsR0FWa0IsQ0FVZG1ULE1BVmMsQ0FBYjs7QUFZUCxXQUFlNEcsS0FBS0YsUUFBTCxDQUFmOztBQ1pPLElBQUlBLFdBQVMsSUFBSWpNLEtBQUosQ0FBVSxDQUFWLEVBQWErRCxNQUFiLENBQ2xCLG9CQURrQixFQUVsQiwwQkFGa0IsRUFHbEIsZ0NBSGtCLEVBSWxCLHNDQUprQixFQUtsQiw0Q0FMa0IsRUFNbEIsa0RBTmtCLEVBT2xCLHdEQVBrQixFQVFsQiw4REFSa0IsRUFTbEIsb0VBVGtCLEVBVWxCM1IsR0FWa0IsQ0FVZG1ULE1BVmMsQ0FBYjs7QUFZUCxXQUFlNEcsS0FBS0YsUUFBTCxDQUFmOztBQ1pPLElBQUlBLFdBQVMsSUFBSWpNLEtBQUosQ0FBVSxDQUFWLEVBQWErRCxNQUFiLENBQ2xCLG9CQURrQixFQUVsQiwwQkFGa0IsRUFHbEIsZ0NBSGtCLEVBSWxCLHNDQUprQixFQUtsQiw0Q0FMa0IsRUFNbEIsa0RBTmtCLEVBT2xCLHdEQVBrQixFQVFsQiw4REFSa0IsRUFTbEIsb0VBVGtCLEVBVWxCM1IsR0FWa0IsQ0FVZG1ULE1BVmMsQ0FBYjs7QUFZUCxXQUFlNEcsS0FBS0YsUUFBTCxDQUFmOztBQ1pPLElBQUlBLFdBQVMsSUFBSWpNLEtBQUosQ0FBVSxDQUFWLEVBQWErRCxNQUFiLENBQ2xCLG9CQURrQixFQUVsQiwwQkFGa0IsRUFHbEIsZ0NBSGtCLEVBSWxCLHNDQUprQixFQUtsQiw0Q0FMa0IsRUFNbEIsa0RBTmtCLEVBT2xCLHdEQVBrQixFQVFsQiw4REFSa0IsRUFTbEIsb0VBVGtCLEVBVWxCM1IsR0FWa0IsQ0FVZG1ULE1BVmMsQ0FBYjs7QUFZUCxXQUFlNEcsS0FBS0YsUUFBTCxDQUFmOztBQ1pPLElBQUlBLFdBQVMsSUFBSWpNLEtBQUosQ0FBVSxDQUFWLEVBQWErRCxNQUFiLENBQ2xCLG9CQURrQixFQUVsQiwwQkFGa0IsRUFHbEIsZ0NBSGtCLEVBSWxCLHNDQUprQixFQUtsQiw0Q0FMa0IsRUFNbEIsa0RBTmtCLEVBT2xCLHdEQVBrQixFQVFsQiw4REFSa0IsRUFTbEIsb0VBVGtCLEVBVWxCM1IsR0FWa0IsQ0FVZG1ULE1BVmMsQ0FBYjs7QUFZUCxhQUFlNEcsS0FBS0YsUUFBTCxDQUFmOztBQ1pPLElBQUlBLFdBQVMsSUFBSWpNLEtBQUosQ0FBVSxDQUFWLEVBQWErRCxNQUFiLENBQ2xCLG9CQURrQixFQUVsQiwwQkFGa0IsRUFHbEIsZ0NBSGtCLEVBSWxCLHNDQUprQixFQUtsQiw0Q0FMa0IsRUFNbEIsa0RBTmtCLEVBT2xCLHdEQVBrQixFQVFsQiw4REFSa0IsRUFTbEIsb0VBVGtCLEVBVWxCM1IsR0FWa0IsQ0FVZG1ULE1BVmMsQ0FBYjs7QUFZUCxhQUFlNEcsS0FBS0YsUUFBTCxDQUFmOztBQ1pPLElBQUlBLFdBQVMsSUFBSWpNLEtBQUosQ0FBVSxDQUFWLEVBQWErRCxNQUFiLENBQ2xCLG9CQURrQixFQUVsQiwwQkFGa0IsRUFHbEIsZ0NBSGtCLEVBSWxCLHNDQUprQixFQUtsQiw0Q0FMa0IsRUFNbEIsa0RBTmtCLEVBT2xCLHdEQVBrQixFQVFsQiw4REFSa0IsRUFTbEIsb0VBVGtCLEVBVWxCM1IsR0FWa0IsQ0FVZG1ULE1BVmMsQ0FBYjs7QUFZUCxlQUFlNEcsS0FBS0YsUUFBTCxDQUFmOztBQ1pPLElBQUlBLFdBQVMsSUFBSWpNLEtBQUosQ0FBVSxDQUFWLEVBQWErRCxNQUFiLENBQ2xCLG9CQURrQixFQUVsQiwwQkFGa0IsRUFHbEIsZ0NBSGtCLEVBSWxCLHNDQUprQixFQUtsQiw0Q0FMa0IsRUFNbEIsa0RBTmtCLEVBT2xCLHdEQVBrQixFQVFsQjNSLEdBUmtCLENBUWRtVCxNQVJjLENBQWI7O0FBVVAsV0FBZTRHLEtBQUtGLFFBQUwsQ0FBZjs7QUNWTyxJQUFJQSxZQUFTLElBQUlqTSxLQUFKLENBQVUsQ0FBVixFQUFhK0QsTUFBYixDQUNsQixvQkFEa0IsRUFFbEIsMEJBRmtCLEVBR2xCLGdDQUhrQixFQUlsQixzQ0FKa0IsRUFLbEIsNENBTGtCLEVBTWxCLGtEQU5rQixFQU9sQix3REFQa0IsRUFRbEIzUixHQVJrQixDQVFkbVQsTUFSYyxDQUFiOztBQVVQLFdBQWU0RyxLQUFLRixTQUFMLENBQWY7O0FDVk8sSUFBSUEsWUFBUyxJQUFJak0sS0FBSixDQUFVLENBQVYsRUFBYStELE1BQWIsQ0FDbEIsb0JBRGtCLEVBRWxCLDBCQUZrQixFQUdsQixnQ0FIa0IsRUFJbEIsc0NBSmtCLEVBS2xCLDRDQUxrQixFQU1sQixrREFOa0IsRUFPbEIsd0RBUGtCLEVBUWxCM1IsR0FSa0IsQ0FRZG1ULE1BUmMsQ0FBYjs7QUFVUCxXQUFlNEcsS0FBS0YsU0FBTCxDQUFmOztBQ1ZPLElBQUlBLFlBQVMsSUFBSWpNLEtBQUosQ0FBVSxDQUFWLEVBQWErRCxNQUFiLENBQ2xCLG9CQURrQixFQUVsQiwwQkFGa0IsRUFHbEIsZ0NBSGtCLEVBSWxCLHNDQUprQixFQUtsQiw0Q0FMa0IsRUFNbEIsa0RBTmtCLEVBT2xCLHdEQVBrQixFQVFsQjNSLEdBUmtCLENBUWRtVCxNQVJjLENBQWI7O0FBVVAsV0FBZTRHLEtBQUtGLFNBQUwsQ0FBZjs7QUNWTyxJQUFJQSxZQUFTLElBQUlqTSxLQUFKLENBQVUsQ0FBVixFQUFhK0QsTUFBYixDQUNsQixvQkFEa0IsRUFFbEIsMEJBRmtCLEVBR2xCLGdDQUhrQixFQUlsQixzQ0FKa0IsRUFLbEIsNENBTGtCLEVBTWxCLGtEQU5rQixFQU9sQix3REFQa0IsRUFRbEIzUixHQVJrQixDQVFkbVQsTUFSYyxDQUFiOztBQVVQLGFBQWU0RyxLQUFLRixTQUFMLENBQWY7O0FDVk8sSUFBSUEsWUFBUyxJQUFJak0sS0FBSixDQUFVLENBQVYsRUFBYStELE1BQWIsQ0FDbEIsb0JBRGtCLEVBRWxCLDBCQUZrQixFQUdsQixnQ0FIa0IsRUFJbEIsc0NBSmtCLEVBS2xCLDRDQUxrQixFQU1sQixrREFOa0IsRUFPbEIsd0RBUGtCLEVBUWxCM1IsR0FSa0IsQ0FRZG1ULE1BUmMsQ0FBYjs7QUFVUCxXQUFlNEcsS0FBS0YsU0FBTCxDQUFmOztBQ1ZPLElBQUlBLFlBQVMsSUFBSWpNLEtBQUosQ0FBVSxDQUFWLEVBQWErRCxNQUFiLENBQ2xCLG9CQURrQixFQUVsQiwwQkFGa0IsRUFHbEIsZ0NBSGtCLEVBSWxCLHNDQUprQixFQUtsQiw0Q0FMa0IsRUFNbEIsa0RBTmtCLEVBT2xCLHdEQVBrQixFQVFsQjNSLEdBUmtCLENBUWRtVCxNQVJjLENBQWI7O0FBVVAsV0FBZTRHLEtBQUtGLFNBQUwsQ0FBZjs7QUNWTyxJQUFJQSxZQUFTLElBQUlqTSxLQUFKLENBQVUsQ0FBVixFQUFhK0QsTUFBYixDQUNsQixvQkFEa0IsRUFFbEIsMEJBRmtCLEVBR2xCLGdDQUhrQixFQUlsQixzQ0FKa0IsRUFLbEIsNENBTGtCLEVBTWxCLGtEQU5rQixFQU9sQix3REFQa0IsRUFRbEIzUixHQVJrQixDQVFkbVQsTUFSYyxDQUFiOztBQVVQLFdBQWU0RyxLQUFLRixTQUFMLENBQWY7O0FDVk8sSUFBSUEsWUFBUyxJQUFJak0sS0FBSixDQUFVLENBQVYsRUFBYStELE1BQWIsQ0FDbEIsb0JBRGtCLEVBRWxCLDBCQUZrQixFQUdsQixnQ0FIa0IsRUFJbEIsc0NBSmtCLEVBS2xCLDRDQUxrQixFQU1sQixrREFOa0IsRUFPbEIsd0RBUGtCLEVBUWxCM1IsR0FSa0IsQ0FRZG1ULE1BUmMsQ0FBYjs7QUFVUCxhQUFlNEcsS0FBS0YsU0FBTCxDQUFmOztBQ1ZPLElBQUlBLFlBQVMsSUFBSWpNLEtBQUosQ0FBVSxDQUFWLEVBQWErRCxNQUFiLENBQ2xCLG9CQURrQixFQUVsQiwwQkFGa0IsRUFHbEIsZ0NBSGtCLEVBSWxCLHNDQUprQixFQUtsQiw0Q0FMa0IsRUFNbEIsa0RBTmtCLEVBT2xCLHdEQVBrQixFQVFsQjNSLEdBUmtCLENBUWRtVCxNQVJjLENBQWI7O0FBVVAsV0FBZTRHLEtBQUtGLFNBQUwsQ0FBZjs7QUNWTyxJQUFJQSxZQUFTLElBQUlqTSxLQUFKLENBQVUsQ0FBVixFQUFhK0QsTUFBYixDQUNsQixvQkFEa0IsRUFFbEIsMEJBRmtCLEVBR2xCLGdDQUhrQixFQUlsQixzQ0FKa0IsRUFLbEIsNENBTGtCLEVBTWxCLGtEQU5rQixFQU9sQix3REFQa0IsRUFRbEIzUixHQVJrQixDQVFkbVQsTUFSYyxDQUFiOztBQVVQLGFBQWU0RyxLQUFLRixTQUFMLENBQWY7O0FDVk8sSUFBSUEsWUFBUyxJQUFJak0sS0FBSixDQUFVLENBQVYsRUFBYStELE1BQWIsQ0FDbEIsb0JBRGtCLEVBRWxCLDBCQUZrQixFQUdsQixnQ0FIa0IsRUFJbEIsc0NBSmtCLEVBS2xCLDRDQUxrQixFQU1sQixrREFOa0IsRUFPbEIsd0RBUGtCLEVBUWxCM1IsR0FSa0IsQ0FRZG1ULE1BUmMsQ0FBYjs7QUFVUCxhQUFlNEcsS0FBS0YsU0FBTCxDQUFmOztBQ1ZPLElBQUlBLFlBQVMsSUFBSWpNLEtBQUosQ0FBVSxDQUFWLEVBQWErRCxNQUFiLENBQ2xCLG9CQURrQixFQUVsQiwwQkFGa0IsRUFHbEIsZ0NBSGtCLEVBSWxCLHNDQUprQixFQUtsQiw0Q0FMa0IsRUFNbEIsa0RBTmtCLEVBT2xCLHdEQVBrQixFQVFsQjNSLEdBUmtCLENBUWRtVCxNQVJjLENBQWI7O0FBVVAsWUFBZTRHLEtBQUtGLFNBQUwsQ0FBZjs7QUNWTyxJQUFJQSxZQUFTLElBQUlqTSxLQUFKLENBQVUsQ0FBVixFQUFhK0QsTUFBYixDQUNsQixvQkFEa0IsRUFFbEIsMEJBRmtCLEVBR2xCLGdDQUhrQixFQUlsQixzQ0FKa0IsRUFLbEIsNENBTGtCLEVBTWxCLGtEQU5rQixFQU9sQix3REFQa0IsRUFRbEIzUixHQVJrQixDQVFkbVQsTUFSYyxDQUFiOztBQVVQLGFBQWU0RyxLQUFLRixTQUFMLENBQWY7O0FDVk8sSUFBSUEsWUFBUyxJQUFJak0sS0FBSixDQUFVLENBQVYsRUFBYStELE1BQWIsQ0FDbEIsb0JBRGtCLEVBRWxCLDBCQUZrQixFQUdsQixnQ0FIa0IsRUFJbEIsc0NBSmtCLEVBS2xCLDRDQUxrQixFQU1sQixrREFOa0IsRUFPbEIsd0RBUGtCLEVBUWxCM1IsR0FSa0IsQ0FRZG1ULE1BUmMsQ0FBYjs7QUFVUCxZQUFlNEcsS0FBS0YsU0FBTCxDQUFmOztBQ1ZPLElBQUlBLFlBQVMsSUFBSWpNLEtBQUosQ0FBVSxDQUFWLEVBQWErRCxNQUFiLENBQ2xCLG9CQURrQixFQUVsQiwwQkFGa0IsRUFHbEIsZ0NBSGtCLEVBSWxCLHNDQUprQixFQUtsQiw0Q0FMa0IsRUFNbEIsa0RBTmtCLEVBT2xCLHdEQVBrQixFQVFsQjNSLEdBUmtCLENBUWRtVCxNQVJjLENBQWI7O0FBVVAsY0FBZTRHLEtBQUtGLFNBQUwsQ0FBZjs7QUNWTyxJQUFJQSxZQUFTLElBQUlqTSxLQUFKLENBQVUsQ0FBVixFQUFhK0QsTUFBYixDQUNsQixvQkFEa0IsRUFFbEIsMEJBRmtCLEVBR2xCLGdDQUhrQixFQUlsQixzQ0FKa0IsRUFLbEIsNENBTGtCLEVBTWxCLGtEQU5rQixFQU9sQix3REFQa0IsRUFRbEIzUixHQVJrQixDQVFkbVQsTUFSYyxDQUFiOztBQVVQLFdBQWU0RyxLQUFLRixTQUFMLENBQWY7O0FDVk8sSUFBSUEsWUFBUyxJQUFJak0sS0FBSixDQUFVLENBQVYsRUFBYStELE1BQWIsQ0FDbEIsb0JBRGtCLEVBRWxCLDBCQUZrQixFQUdsQixnQ0FIa0IsRUFJbEIsc0NBSmtCLEVBS2xCLDRDQUxrQixFQU1sQixrREFOa0IsRUFPbEIsd0RBUGtCLEVBUWxCM1IsR0FSa0IsQ0FRZG1ULE1BUmMsQ0FBYjs7QUFVUCxjQUFlNEcsS0FBS0YsU0FBTCxDQUFmOztBQ1hPLElBQU1HLHdCQUF3QjtvQkFDakI7U0FDWCxRQURXO2VBRUwsOEVBRks7WUFHUixDQUFDLFFBQUQsRUFBVyxhQUFYLENBSFE7VUFJVixrQkFBVztVQUNYaGQsTUFBUDs7RUFOa0M7O21CQVVsQjtTQUNWLFFBRFU7ZUFFSiw4RUFGSTtZQUdQLENBQUMsUUFBRCxFQUFXLGFBQVgsQ0FITztVQUlULGtCQUFXO1VBQ1hBLEtBQVA7O0VBZmtDOztvQkFtQmpCO1NBQ1gsUUFEVztlQUVMLCtFQUZLO1lBR1IsQ0FBQyxRQUFELEVBQVcsYUFBWCxDQUhRO1VBSVYsa0JBQVc7VUFDWEEsTUFBUDs7RUF4QmtDOztxQkE0QmhCO1NBQ1osVUFEWTtlQUVOLDZFQUZNO1lBR1QsQ0FBQyxRQUFELEVBQVcsYUFBWCxDQUhTO1VBSVgsa0JBQVc7VUFDWEEsT0FBUDs7RUFqQ2tDOztxQkFxQ2hCO1NBQ1osVUFEWTtlQUVOLDhFQUZNO1lBR1QsQ0FBQyxRQUFELEVBQVcsYUFBWCxDQUhTO1VBSVgsa0JBQVc7VUFDWEEsT0FBUDs7RUExQ2tDOztrQkE4Q25CO1NBQ1QsT0FEUztlQUVILDZFQUZHO1lBR04sQ0FBQyxRQUFELEVBQVcsYUFBWCxDQUhNO1VBSVIsa0JBQVc7VUFDWEEsSUFBUDs7RUFuRGtDOztrQkF1RG5CO1NBQ1QsT0FEUztlQUVILDhFQUZHO1lBR04sQ0FBQyxRQUFELEVBQVcsYUFBWCxDQUhNO1VBSVIsa0JBQVc7VUFDWEEsSUFBUDs7RUE1RGtDOztrQkFnRW5CO1NBQ1QsT0FEUztlQUVILCtFQUZHO1lBR04sQ0FBQyxRQUFELEVBQVcsYUFBWCxDQUhNO1VBSVIsa0JBQVc7VUFDWEEsSUFBUDs7RUFyRWtDOzs7O2tCQTJFbkI7U0FDVCxNQURTO2VBRUgsMklBRkc7WUFHTixDQUFDLFFBQUQsRUFBVyxXQUFYLENBSE07VUFJUixrQkFBVztVQUNYQSxNQUFQOztFQWhGa0M7O2tCQW9GbkI7U0FDVCxNQURTO2VBRUgsMklBRkc7WUFHTixDQUFDLFFBQUQsRUFBVyxXQUFYLENBSE07VUFJUixrQkFBVztVQUNYQSxRQUFQOztFQXpGa0M7O2tCQTZGbkI7U0FDVCxNQURTO2VBRUgsMklBRkc7WUFHTixDQUFDLFFBQUQsRUFBVyxXQUFYLENBSE07VUFJUixrQkFBVztVQUNYQSxRQUFQOztFQWxHa0M7O2tCQXNHbkI7U0FDVCxNQURTO2VBRUgsMklBRkc7WUFHTixDQUFDLFFBQUQsRUFBVyxXQUFYLENBSE07VUFJUixrQkFBVztVQUNYQSxRQUFQOztFQTNHa0M7O2tCQStHbkI7U0FDVCxNQURTO2VBRUgsMklBRkc7WUFHTixDQUFDLFFBQUQsRUFBVyxXQUFYLENBSE07VUFJUixrQkFBVztVQUNYQSxRQUFQOztFQXBIa0M7O2tCQXdIbkI7U0FDVCxNQURTO2VBRUgsMklBRkc7WUFHTixDQUFDLFFBQUQsRUFBVyxXQUFYLENBSE07VUFJUixrQkFBVztVQUNYQSxRQUFQOztFQTdIa0M7O29CQWlJakI7U0FDWCxRQURXO2VBRUwsNklBRks7WUFHUixDQUFDLFFBQUQsRUFBVyxXQUFYLENBSFE7VUFJVixrQkFBVztVQUNYQSxRQUFQOztFQXRJa0M7O29CQTBJakI7U0FDWCxRQURXO2VBRUwsNklBRks7WUFHUixDQUFDLFFBQUQsRUFBVyxXQUFYLENBSFE7VUFJVixrQkFBVztVQUNYQSxRQUFQOztFQS9Ja0M7O3NCQW1KZjtTQUNiLFVBRGE7ZUFFUCwrSUFGTztZQUdWLENBQUMsUUFBRCxFQUFXLFdBQVgsQ0FIVTtVQUlaLGtCQUFXO1VBQ1hBLFFBQVA7O0VBeEprQzs7OzttQkE4SmxCO1NBQ1YsT0FEVTtlQUVKLDZJQUZJO1lBR1AsQ0FBQyxRQUFELEVBQVcsWUFBWCxFQUF5QixZQUF6QixDQUhPO1VBSVQsa0JBQVc7VUFDWEEsU0FBUDs7RUFuS2tDOztvQkF1S2pCO1NBQ1gsUUFEVztlQUVMLDhJQUZLO1lBR1IsQ0FBQyxRQUFELEVBQVcsWUFBWCxFQUF5QixZQUF6QixDQUhRO1VBSVYsa0JBQVc7VUFDWEEsU0FBUDs7RUE1S2tDOzttQkFnTGxCO1NBQ1YsT0FEVTtlQUVKLDZJQUZJO1lBR1AsQ0FBQyxRQUFELEVBQVcsWUFBWCxFQUF5QixZQUF6QixDQUhPO1VBSVQsa0JBQVc7VUFDWEEsU0FBUDs7RUFyTGtDOztxQkF5TGhCO1NBQ1osU0FEWTtlQUVOLCtJQUZNO1lBR1QsQ0FBQyxRQUFELEVBQVcsWUFBWCxFQUF5QixZQUF6QixDQUhTO1VBSVgsa0JBQVc7VUFDWEEsU0FBUDs7RUE5TGtDOztxQkFrTWhCO1NBQ1osU0FEWTtlQUVOLCtJQUZNO1lBR1QsQ0FBQyxRQUFELEVBQVcsWUFBWCxFQUF5QixZQUF6QixDQUhTO1VBSVgsa0JBQVc7VUFDWEEsU0FBUDs7RUF2TWtDOztrQkEyTW5CO1NBQ1QsTUFEUztlQUVILDRJQUZHO1lBR04sQ0FBQyxRQUFELEVBQVcsWUFBWCxFQUF5QixZQUF6QixDQUhNO1VBSVIsa0JBQVc7VUFDWEEsU0FBUDs7RUFoTmtDOztrQkFvTm5CO1NBQ1QsTUFEUztlQUVILDRJQUZHO1lBR04sQ0FBQyxRQUFELEVBQVcsWUFBWCxFQUF5QixXQUF6QixDQUhNO1VBSVIsa0JBQVc7VUFDWEEsUUFBUDs7RUF6TmtDOztrQkE2Tm5CO1NBQ1QsTUFEUztlQUVILDRJQUZHO1lBR04sQ0FBQyxRQUFELEVBQVcsWUFBWCxFQUF5QixXQUF6QixDQUhNO1VBSVIsa0JBQVc7VUFDWEEsU0FBUDs7RUFsT2tDOztrQkFzT25CO1NBQ1QsTUFEUztlQUVILDRJQUZHO1lBR04sQ0FBQyxRQUFELEVBQVcsWUFBWCxFQUF5QixXQUF6QixDQUhNO1VBSVIsa0JBQVc7VUFDWEEsU0FBUDs7RUEzT2tDOztrQkErT25CO1NBQ1QsTUFEUztlQUVILDRJQUZHO1lBR04sQ0FBQyxRQUFELEVBQVcsWUFBWCxFQUF5QixXQUF6QixDQUhNO1VBSVIsa0JBQVc7VUFDWEEsU0FBUDs7RUFwUGtDOztvQkF3UGpCO1NBQ1gsUUFEVztlQUVMLDhJQUZLO1lBR1IsQ0FBQyxRQUFELEVBQVcsWUFBWCxFQUF5QixXQUF6QixDQUhRO1VBSVYsa0JBQVc7VUFDWEEsU0FBUDs7RUE3UGtDOztrQkFpUW5CO1NBQ1QsTUFEUztlQUVILDRJQUZHO1lBR04sQ0FBQyxRQUFELEVBQVcsWUFBWCxFQUF5QixXQUF6QixDQUhNO1VBSVIsa0JBQVc7VUFDWEEsU0FBUDs7RUF0UWtDOztrQkEwUW5CO1NBQ1QsTUFEUztlQUVILDRJQUZHO1lBR04sQ0FBQyxRQUFELEVBQVcsWUFBWCxFQUF5QixXQUF6QixDQUhNO1VBSVIsa0JBQVc7VUFDWEEsU0FBUDs7RUEvUWtDOztrQkFtUm5CO1NBQ1QsTUFEUztlQUVILDRJQUZHO1lBR04sQ0FBQyxRQUFELEVBQVcsWUFBWCxFQUF5QixXQUF6QixDQUhNO1VBSVIsa0JBQVc7VUFDWEEsU0FBUDs7RUF4UmtDOztvQkE0UmpCO1NBQ1gsUUFEVztlQUVMLDhJQUZLO1lBR1IsQ0FBQyxRQUFELEVBQVcsWUFBWCxFQUF5QixXQUF6QixDQUhRO1VBSVYsa0JBQVc7VUFDWEEsU0FBUDs7RUFqU2tDOztrQkFxU25CO1NBQ1QsTUFEUztlQUVILDRJQUZHO1lBR04sQ0FBQyxRQUFELEVBQVcsWUFBWCxFQUF5QixXQUF6QixDQUhNO1VBSVIsa0JBQVc7VUFDWEEsU0FBUDs7RUExU2tDOztvQkE4U2pCO1NBQ1gsUUFEVztlQUVMLDhJQUZLO1lBR1IsQ0FBQyxRQUFELEVBQVcsWUFBWCxFQUF5QixXQUF6QixDQUhRO1VBSVYsa0JBQVc7VUFDWEEsU0FBUDs7RUFuVGtDOztvQkF1VGpCO1NBQ1gsUUFEVztlQUVMLDhJQUZLO1lBR1IsQ0FBQyxRQUFELEVBQVcsWUFBWCxFQUF5QixXQUF6QixDQUhRO1VBSVYsa0JBQVc7VUFDWEEsU0FBUDs7RUE1VGtDOzs7O3VCQWtVZDtTQUNkLE1BRGM7ZUFFUiwySUFGUTtZQUdYLENBQUMsYUFBRCxFQUFnQixXQUFoQixDQUhXO1VBSWIsa0JBQVc7VUFDWEEsSUFBUDs7RUF2VWtDOzt1QkEyVWQ7U0FDZCxNQURjO2VBRVIsMklBRlE7WUFHWCxDQUFDLGFBQUQsRUFBZ0IsV0FBaEIsQ0FIVztVQUliLGtCQUFXO1VBQ1hBLElBQVA7O0VBaFZrQzs7dUJBb1ZkO1NBQ2QsTUFEYztlQUVSLDJJQUZRO1lBR1gsQ0FBQyxhQUFELEVBQWdCLFdBQWhCLENBSFc7VUFJYixrQkFBVztVQUNYQSxJQUFQOztFQXpWa0M7O3VCQTZWZDtTQUNkLE1BRGM7ZUFFUiwySUFGUTtZQUdYLENBQUMsYUFBRCxFQUFnQixXQUFoQixDQUhXO1VBSWIsa0JBQVc7VUFDWEEsSUFBUDs7RUFsV2tDOzt1QkFzV2Q7U0FDZCxNQURjO2VBRVIsMklBRlE7WUFHWCxDQUFDLGFBQUQsRUFBZ0IsV0FBaEIsQ0FIVztVQUliLGtCQUFXO1VBQ1hBLElBQVA7O0VBM1drQzs7dUJBK1dkO1NBQ2QsTUFEYztlQUVSLDJJQUZRO1lBR1gsQ0FBQyxhQUFELEVBQWdCLFdBQWhCLENBSFc7VUFJYixrQkFBVztVQUNYQSxJQUFQOztFQXBYa0M7O3lCQXdYWjtTQUNoQixRQURnQjtlQUVWLDZJQUZVO1lBR2IsQ0FBQyxhQUFELEVBQWdCLFdBQWhCLENBSGE7VUFJZixrQkFBVztVQUNYQSxNQUFQOztFQTdYa0M7O3lCQWlZWjtTQUNoQixRQURnQjtlQUVWLDZJQUZVO1lBR2IsQ0FBQyxhQUFELEVBQWdCLFdBQWhCLENBSGE7VUFJZixrQkFBVztVQUNYQSxNQUFQOztFQXRZa0M7OzJCQTBZVjtTQUNsQixVQURrQjtlQUVaLCtJQUZZO1lBR2YsQ0FBQyxhQUFELEVBQWdCLFdBQWhCLENBSGU7VUFJakIsa0JBQVc7VUFDWEEsUUFBUDs7RUEvWWtDOzs7O3dCQXFaYjtTQUNmLE9BRGU7ZUFFVCw2SUFGUztZQUdaLENBQUMsYUFBRCxFQUFnQixZQUFoQixFQUE4QixZQUE5QixDQUhZO1VBSWQsa0JBQVc7VUFDWEEsS0FBUDs7RUExWmtDOzt5QkE4Wlo7U0FDaEIsUUFEZ0I7ZUFFViw4SUFGVTtZQUdiLENBQUMsYUFBRCxFQUFnQixZQUFoQixFQUE4QixZQUE5QixDQUhhO1VBSWYsa0JBQVc7VUFDWEEsTUFBUDs7RUFuYWtDOzt3QkF1YWI7U0FDZixPQURlO2VBRVQsNklBRlM7WUFHWixDQUFDLGFBQUQsRUFBZ0IsWUFBaEIsRUFBOEIsWUFBOUIsQ0FIWTtVQUlkLGtCQUFXO1VBQ1hBLEtBQVA7O0VBNWFrQzs7MEJBZ2JYO1NBQ2pCLFNBRGlCO2VBRVgsK0lBRlc7WUFHZCxDQUFDLGFBQUQsRUFBZ0IsWUFBaEIsRUFBOEIsWUFBOUIsQ0FIYztVQUloQixrQkFBVztVQUNYQSxPQUFQOztFQXJia0M7OzBCQXliWDtTQUNqQixTQURpQjtlQUVYLCtJQUZXO1lBR2QsQ0FBQyxhQUFELEVBQWdCLFlBQWhCLEVBQThCLFlBQTlCLENBSGM7VUFJaEIsa0JBQVc7VUFDWEEsT0FBUDs7RUE5YmtDOzt1QkFrY2Q7U0FDZCxNQURjO2VBRVIsNElBRlE7WUFHWCxDQUFDLGFBQUQsRUFBZ0IsWUFBaEIsRUFBOEIsWUFBOUIsQ0FIVztVQUliLGtCQUFXO1VBQ1hBLElBQVA7O0VBdmNrQzs7dUJBMmNkO1NBQ2QsTUFEYztlQUVSLDRJQUZRO1lBR1gsQ0FBQyxhQUFELEVBQWdCLFlBQWhCLEVBQThCLFdBQTlCLENBSFc7VUFJYixrQkFBVztVQUNYQSxJQUFQOztFQWhka0M7O3VCQW9kZDtTQUNkLE1BRGM7ZUFFUiw0SUFGUTtZQUdYLENBQUMsYUFBRCxFQUFnQixZQUFoQixFQUE4QixXQUE5QixDQUhXO1VBSWIsa0JBQVc7VUFDWEEsSUFBUDs7RUF6ZGtDOzt1QkE2ZGQ7U0FDZCxNQURjO2VBRVIsNElBRlE7WUFHWCxDQUFDLGFBQUQsRUFBZ0IsWUFBaEIsRUFBOEIsV0FBOUIsQ0FIVztVQUliLGtCQUFXO1VBQ1hBLElBQVA7O0VBbGVrQzs7dUJBc2VkO1NBQ2QsTUFEYztlQUVSLDRJQUZRO1lBR1gsQ0FBQyxhQUFELEVBQWdCLFlBQWhCLEVBQThCLFdBQTlCLENBSFc7VUFJYixrQkFBVztVQUNYQSxJQUFQOztFQTNla0M7O3lCQStlWjtTQUNoQixRQURnQjtlQUVWLDhJQUZVO1lBR2IsQ0FBQyxhQUFELEVBQWdCLFlBQWhCLEVBQThCLFdBQTlCLENBSGE7VUFJZixrQkFBVztVQUNYQSxNQUFQOztFQXBma0M7O3VCQXdmZDtTQUNkLE1BRGM7ZUFFUiw0SUFGUTtZQUdYLENBQUMsYUFBRCxFQUFnQixZQUFoQixFQUE4QixXQUE5QixDQUhXO1VBSWIsa0JBQVc7VUFDWEEsSUFBUDs7RUE3ZmtDOzt1QkFpZ0JkO1NBQ2QsTUFEYztlQUVSLDRJQUZRO1lBR1gsQ0FBQyxhQUFELEVBQWdCLFlBQWhCLEVBQThCLFdBQTlCLENBSFc7VUFJYixrQkFBVztVQUNYQSxJQUFQOztFQXRnQmtDOzt1QkEwZ0JkO1NBQ2QsTUFEYztlQUVSLDRJQUZRO1lBR1gsQ0FBQyxhQUFELEVBQWdCLFlBQWhCLEVBQThCLFdBQTlCLENBSFc7VUFJYixrQkFBVztVQUNYQSxJQUFQOztFQS9nQmtDOzt5QkFtaEJaO1NBQ2hCLFFBRGdCO2VBRVYsOElBRlU7WUFHYixDQUFDLGFBQUQsRUFBZ0IsWUFBaEIsRUFBOEIsV0FBOUIsQ0FIYTtVQUlmLGtCQUFXO1VBQ1hBLE1BQVA7O0VBeGhCa0M7O3VCQTRoQmQ7U0FDZCxNQURjO2VBRVIsNElBRlE7WUFHWCxDQUFDLGFBQUQsRUFBZ0IsWUFBaEIsRUFBOEIsV0FBOUIsQ0FIVztVQUliLGtCQUFXO1VBQ1hBLElBQVA7O0VBamlCa0M7O3lCQXFpQlo7U0FDaEIsUUFEZ0I7ZUFFViw4SUFGVTtZQUdiLENBQUMsYUFBRCxFQUFnQixZQUFoQixFQUE4QixXQUE5QixDQUhhO1VBSWYsa0JBQVc7VUFDWEEsTUFBUDs7RUExaUJrQzs7eUJBOGlCWjtTQUNoQixRQURnQjtlQUVWLDhJQUZVO1lBR2IsQ0FBQyxhQUFELEVBQWdCLFlBQWhCLEVBQThCLFdBQTlCLENBSGE7VUFJZixrQkFBVztVQUNYQSxNQUFQOzs7Q0FuakJJLENBd2pCUDs7QUMxakJPLElBQUlpZCxRQUFRLElBQUlyTSxLQUFKLENBQVUsQ0FBVixFQUFhK0QsTUFBYixDQUFvQixDQUN0QyxDQUFDLFNBQUQsQ0FEc0MsRUFFdEMsQ0FBQyxTQUFELEVBQVcsU0FBWCxDQUZzQyxFQUd0QyxDQUFDLFNBQUQsRUFBVyxTQUFYLEVBQXFCLFNBQXJCLENBSHNDLEVBSXRDLENBQUMsU0FBRCxFQUFXLFNBQVgsRUFBcUIsU0FBckIsRUFBK0IsU0FBL0IsQ0FKc0MsRUFLdEMsQ0FBQyxTQUFELEVBQVcsU0FBWCxFQUFxQixTQUFyQixFQUErQixTQUEvQixFQUF5QyxTQUF6QyxDQUxzQyxFQU10QyxDQUFDLFNBQUQsRUFBVyxTQUFYLEVBQXFCLFNBQXJCLEVBQStCLFNBQS9CLEVBQXlDLFNBQXpDLEVBQW1ELFNBQW5ELENBTnNDLEVBT3RDLENBQUMsU0FBRCxFQUFXLFNBQVgsRUFBcUIsU0FBckIsRUFBK0IsU0FBL0IsRUFBeUMsU0FBekMsRUFBbUQsU0FBbkQsRUFBNkQsU0FBN0QsQ0FQc0MsRUFRdEMsQ0FBQyxTQUFELEVBQVcsU0FBWCxFQUFxQixTQUFyQixFQUErQixTQUEvQixFQUF5QyxTQUF6QyxFQUFtRCxTQUFuRCxFQUE2RCxTQUE3RCxFQUF1RSxTQUF2RSxDQVJzQyxFQVN0QyxDQUFDLFNBQUQsRUFBVyxTQUFYLEVBQXFCLFNBQXJCLEVBQStCLFNBQS9CLEVBQXlDLFNBQXpDLEVBQW1ELFNBQW5ELEVBQTZELFNBQTdELEVBQXVFLFNBQXZFLEVBQWlGLFNBQWpGLENBVHNDLENBQXBCLENBQVo7O0FBWVAsQUFBTyxJQUFJdUksUUFBUSxJQUFJdE0sS0FBSixDQUFVLENBQVYsRUFBYStELE1BQWIsQ0FBb0IsQ0FDdEMsQ0FBQyxTQUFELEVBQVcsU0FBWCxFQUFxQixTQUFyQixDQURzQyxFQUV0QyxDQUFDLFNBQUQsRUFBVyxTQUFYLEVBQXFCLFNBQXJCLEVBQStCLFNBQS9CLENBRnNDLEVBR3RDLENBQUMsU0FBRCxFQUFXLFNBQVgsRUFBcUIsU0FBckIsRUFBK0IsU0FBL0IsRUFBeUMsU0FBekMsQ0FIc0MsRUFJdEMsQ0FBQyxTQUFELEVBQVcsU0FBWCxFQUFxQixTQUFyQixFQUErQixTQUEvQixFQUF5QyxTQUF6QyxFQUFtRCxTQUFuRCxDQUpzQyxFQUt0QyxDQUFDLFNBQUQsRUFBVyxTQUFYLEVBQXFCLFNBQXJCLEVBQStCLFNBQS9CLEVBQXlDLFNBQXpDLEVBQW1ELFNBQW5ELEVBQTZELFNBQTdELENBTHNDLEVBTXRDLENBQUMsU0FBRCxFQUFXLFNBQVgsRUFBcUIsU0FBckIsRUFBK0IsU0FBL0IsRUFBeUMsU0FBekMsRUFBbUQsU0FBbkQsRUFBNkQsU0FBN0QsRUFBdUUsU0FBdkUsQ0FOc0MsRUFPdEMsQ0FBQyxTQUFELEVBQVcsU0FBWCxFQUFxQixTQUFyQixFQUErQixTQUEvQixFQUF5QyxTQUF6QyxFQUFtRCxTQUFuRCxFQUE2RCxTQUE3RCxFQUF1RSxTQUF2RSxFQUFpRixTQUFqRixDQVBzQyxDQUFwQixDQUFaOztBQVVQLEFBQU8sSUFBSXdJLFFBQVEsQ0FBQyxTQUFELEVBQVksU0FBWixFQUF1QixTQUF2QixFQUFrQyxTQUFsQyxFQUE2QyxTQUE3QyxFQUF3RCxTQUF4RCxFQUFtRSxTQUFuRSxFQUE4RSxTQUE5RSxFQUF5RixTQUF6RixDQUFaOzs7Ozs7QUFNUCxBQUFPLElBQUlDLFNBQVMsSUFBSXhNLEtBQUosQ0FBVSxDQUFWLEVBQWErRCxNQUFiLENBQW9CLENBQ3ZDLENBQUMsU0FBRCxFQUFXLFNBQVgsRUFBcUIsU0FBckIsQ0FEdUMsRUFFdkMsQ0FBQyxTQUFELEVBQVcsU0FBWCxFQUFxQixTQUFyQixFQUErQixTQUEvQixDQUZ1QyxFQUd2QyxDQUFDLFNBQUQsRUFBVyxTQUFYLEVBQXFCLFNBQXJCLEVBQStCLFNBQS9CLEVBQXlDLFNBQXpDLENBSHVDLEVBSXZDLENBQUMsU0FBRCxFQUFXLFNBQVgsRUFBcUIsU0FBckIsRUFBK0IsU0FBL0IsRUFBeUMsU0FBekMsRUFBbUQsU0FBbkQsQ0FKdUMsRUFLdkMsQ0FBQyxTQUFELEVBQVcsU0FBWCxFQUFxQixTQUFyQixFQUErQixTQUEvQixFQUF5QyxTQUF6QyxFQUFtRCxTQUFuRCxFQUE2RCxTQUE3RCxDQUx1QyxFQU12QyxDQUFDLFNBQUQsRUFBVyxTQUFYLEVBQXFCLFNBQXJCLEVBQStCLFNBQS9CLEVBQXlDLFNBQXpDLEVBQW1ELFNBQW5ELEVBQTZELFNBQTdELEVBQXVFLFNBQXZFLENBTnVDLEVBT3ZDLENBQUMsU0FBRCxFQUFXLFNBQVgsRUFBcUIsU0FBckIsRUFBK0IsU0FBL0IsRUFBeUMsU0FBekMsRUFBbUQsU0FBbkQsRUFBNkQsU0FBN0QsRUFBdUUsU0FBdkUsRUFBaUYsU0FBakYsQ0FQdUMsQ0FBcEIsQ0FBYjs7QUFVUCxBQUFPLElBQUkwSSxTQUFTLElBQUl6TSxLQUFKLENBQVUsQ0FBVixFQUFhK0QsTUFBYixDQUFvQixDQUN2QyxDQUFDLFNBQUQsRUFBVyxTQUFYLEVBQXFCLFNBQXJCLENBRHVDLEVBRXZDLENBQUMsU0FBRCxFQUFXLFNBQVgsRUFBcUIsU0FBckIsRUFBK0IsU0FBL0IsQ0FGdUMsRUFHdkMsQ0FBQyxTQUFELEVBQVcsU0FBWCxFQUFxQixTQUFyQixFQUErQixTQUEvQixFQUF5QyxTQUF6QyxDQUh1QyxFQUl2QyxDQUFDLFNBQUQsRUFBVyxTQUFYLEVBQXFCLFNBQXJCLEVBQStCLFNBQS9CLEVBQXlDLFNBQXpDLEVBQW1ELFNBQW5ELENBSnVDLEVBS3ZDLENBQUMsU0FBRCxFQUFXLFNBQVgsRUFBcUIsU0FBckIsRUFBK0IsU0FBL0IsRUFBeUMsU0FBekMsRUFBbUQsU0FBbkQsRUFBNkQsU0FBN0QsQ0FMdUMsRUFNdkMsQ0FBQyxTQUFELEVBQVcsU0FBWCxFQUFxQixTQUFyQixFQUErQixTQUEvQixFQUF5QyxTQUF6QyxFQUFtRCxTQUFuRCxFQUE2RCxTQUE3RCxFQUF1RSxTQUF2RSxDQU51QyxFQU92QyxDQUFDLFNBQUQsRUFBVyxTQUFYLEVBQXFCLFNBQXJCLEVBQStCLFNBQS9CLEVBQXlDLFNBQXpDLEVBQW1ELFNBQW5ELEVBQTZELFNBQTdELEVBQXVFLFNBQXZFLEVBQWlGLFNBQWpGLENBUHVDLENBQXBCLENBQWI7O0FDcENBLElBQUlzSSxVQUFRamQsaUJBQUEsQ0FBa0IsU0FBbEIsRUFBNkIsU0FBN0IsQ0FBWjtBQUNQLEFBQU8sSUFBSWtkLFVBQVFsZCxpQkFBQSxDQUFrQixTQUFsQixFQUE2QixTQUE3QixDQUFaO0FBQ1AsQUFBTyxJQUFJc2QsT0FBT3RkLGlCQUFBLENBQWtCLFNBQWxCLEVBQTRCLFNBQTVCLENBQVg7O0FDdUNBLElBQU11ZCxXQUFXOzswQkFFRTtTQUNqQixvQkFEaUI7ZUFFWCxvQkFGVztZQUdkLENBQUMsV0FBRCxDQUhjO1VBSWhCLGdCQUFTakwsVUFBVCxFQUFxQmhILElBQXJCLEVBQTJCN0YsS0FBM0IsRUFBa0NtTyxPQUFsQyxFQUEyQztPQUM5QzdULElBQUl1UyxXQUFXdUQsY0FBWCxDQUEwQnZLLElBQTFCLEVBQWdDN0YsS0FBaEMsRUFBdUNtTyxPQUF2QyxFQUFnRDRKLFlBQWhELENBQVI7O0tBRUVqZSxRQUFGLENBQVcsVUFBU0ksU0FBVCxFQUFvQjtjQUNwQkUsSUFBVixDQUFlLFlBQVc7U0FDckIwUyxPQUFPLElBQVg7YUFDUW5HLE9BQVIsQ0FBZ0IsVUFBU3VDLENBQVQsRUFBWTtlQUMzQixDQUFVNEQsSUFBVixFQUFnQnpTLElBQWhCLENBQXFCNk8sQ0FBckI7TUFERDtLQUZEO0lBREQ7O1VBU081TyxDQUFQOztFQWxCcUI7OzhCQXNCTSxrQ0FBUzZULE9BQVQsRUFBa0I7U0FDdkMsVUFBU2pVLFNBQVQsRUFBb0I7YUFDaEJFLElBQVYsQ0FBZSxZQUFXO1FBQ3JCMFMsT0FBTyxJQUFYO1lBQ1FuRyxPQUFSLENBQWdCLFVBQVN1QyxDQUFULEVBQVk7Y0FDM0IsQ0FBVTRELElBQVYsRUFBZ0J6UyxJQUFoQixDQUFxQjZPLENBQXJCO0tBREQ7SUFGRDtHQUREO0VBdkJzQjs7OEJBaUNNLGtDQUFTMkQsVUFBVCxFQUFxQmhILElBQXJCLEVBQTJCN0YsS0FBM0IsRUFBa0M7U0FDdkQsVUFBUzFFLElBQVQsRUFBZTtPQUNsQjBFLEtBQUgsRUFBVTtRQUNMeEUsUUFBUSxFQUFaOztTQUVJLElBQUl1QixDQUFSLElBQWFpRCxNQUFNeEUsS0FBbkIsRUFBMEI7U0FDckIwSyxJQUFJMkcsV0FBVzBCLGdCQUFYLENBQTRCdk8sTUFBTXhFLEtBQU4sQ0FBWXVCLENBQVosRUFBZXVSLFNBQTNDLEtBQXlEdE8sTUFBTXhFLEtBQU4sQ0FBWXVCLENBQVosRUFBZXVSLFNBQWhGO1NBQ0NsRSxJQUFJeUMsV0FBVzBCLGdCQUFYLENBQTRCdk8sTUFBTXhFLEtBQU4sQ0FBWXVCLENBQVosRUFBZWliLE1BQTNDLEtBQXNEaFksTUFBTXhFLEtBQU4sQ0FBWXVCLENBQVosRUFBZWliLE1BRDFFOztTQUdHLE9BQU85UixDQUFQLEtBQWEsVUFBaEIsRUFBNEI7VUFDdkJBLEVBQUU3TCxJQUFGLENBQU8sSUFBUCxFQUFhaUIsSUFBYixDQUFKOztXQUVLNEssQ0FBTixJQUFXa0UsQ0FBWDs7O1dBR005TyxLQUFLaUMsR0FBTCxDQUFTLFVBQVN4QyxDQUFULEVBQVk7VUFDdkIsSUFBSW1MLENBQVIsSUFBYTFLLEtBQWIsRUFBb0I7VUFDaEIsT0FBT0EsTUFBTTBLLENBQU4sQ0FBUCxLQUFvQixVQUF2QixFQUFtQztTQUNoQ0EsQ0FBRixJQUFPMUssTUFBTTBLLENBQU4sRUFBUzdMLElBQVQsQ0FBYyxJQUFkLEVBQW9CVSxFQUFFbUwsQ0FBRixDQUFwQixDQUFQOzs7WUFHS25MLENBQVA7S0FOTSxDQUFQOztHQWRGO0VBbENzQjs7a0JBNEROO1NBQ1QsWUFEUztlQUVILDRCQUZHO1lBR04sQ0FBQyxRQUFELENBSE07VUFJUixnQkFBUzhSLFVBQVQsRUFBcUJoSCxJQUFyQixFQUEyQjdGLEtBQTNCLEVBQWtDbU8sT0FBbEMsRUFBMkM7T0FDOUM3VCxJQUFJdVMsV0FBV3VELGNBQVgsQ0FBMEJ2SyxJQUExQixFQUFnQzdGLEtBQWhDLEVBQXVDbU8sT0FBdkMsRUFBZ0Q4SixLQUFoRCxDQUFSO0tBQ0U5YyxjQUFGLENBQWlCMFIsV0FBV3dCLE1BQVgsQ0FBa0IsMkJBQWxCLEVBQStDaFUsSUFBL0MsQ0FBb0QsSUFBcEQsRUFBMER3UyxVQUExRCxFQUFzRWhILElBQXRFLEVBQTRFN0YsS0FBNUUsQ0FBakI7S0FDRWxHLFFBQUYsQ0FBVytTLFdBQVd3QixNQUFYLENBQWtCLDJCQUFsQixFQUErQ2hVLElBQS9DLENBQW9ELElBQXBELEVBQTBEOFQsT0FBMUQsQ0FBWDtVQUNPN1QsQ0FBUDs7RUFwRXFCOzttQkF3RUw7U0FDVixhQURVO2VBRUosYUFGSTtZQUdQLENBQUMsUUFBRCxDQUhPO1VBSVQsZ0JBQVN1UyxVQUFULEVBQXFCaEgsSUFBckIsRUFBMkI3RixLQUEzQixFQUFrQ21PLE9BQWxDLEVBQTJDO09BQzlDN1QsSUFBSXVTLFdBQVd1RCxjQUFYLENBQTBCdkssSUFBMUIsRUFBZ0M3RixLQUFoQyxFQUF1Q21PLE9BQXZDLEVBQWdEK0osUUFBaEQsQ0FBUjtLQUNFL2MsY0FBRixDQUFpQjBSLFdBQVd3QixNQUFYLENBQWtCLDJCQUFsQixFQUErQ2hVLElBQS9DLENBQW9ELElBQXBELEVBQTBEd1MsVUFBMUQsRUFBc0VoSCxJQUF0RSxFQUE0RTdGLEtBQTVFLENBQWpCO0tBQ0VsRyxRQUFGLENBQVcrUyxXQUFXd0IsTUFBWCxDQUFrQiwyQkFBbEIsRUFBK0NoVSxJQUEvQyxDQUFvRCxJQUFwRCxFQUEwRDhULE9BQTFELENBQVg7VUFDTzdULENBQVA7O0VBaEZxQjs7Ozs7Ozs7Ozs7Ozs7O3NCQWlHRjtTQUNiLFdBRGE7ZUFFUCxvQkFGTztZQUdWLENBQUMsT0FBRCxDQUhVO1VBSVosZ0JBQVN1UyxVQUFULEVBQXFCaEgsSUFBckIsRUFBMkI3RixLQUEzQixFQUFrQ21PLE9BQWxDLEVBQTJDO1VBQzNDdEIsV0FBV3VELGNBQVgsQ0FBMEJ2SyxJQUExQixFQUFnQzdGLEtBQWhDLEVBQXVDbU8sT0FBdkMsRUFBZ0RnSyxVQUFoRCxDQUFQOztFQXRHcUI7OzJCQTBHRztTQUNsQixnQkFEa0I7ZUFFWix3QkFGWTtZQUdmLENBQUMsT0FBRCxDQUhlO1VBSWpCLGdCQUFTdEwsVUFBVCxFQUFxQmhILElBQXJCLEVBQTJCN0YsS0FBM0IsRUFBa0NtTyxPQUFsQyxFQUEyQztVQUMzQ3RCLFdBQVd1RCxjQUFYLENBQTBCdkssSUFBMUIsRUFBZ0M3RixLQUFoQyxFQUF1Q21PLE9BQXZDLEVBQWdEaUssZUFBaEQsQ0FBUDs7RUEvR3FCOzt1QkFtSEQ7U0FDZCw2QkFEYztlQUVSLGtCQUZRO1lBR1gsQ0FBQyxVQUFELEVBQWEsV0FBYixDQUhXO1VBSWIsZ0JBQVN2TCxVQUFULEVBQXFCaEgsSUFBckIsRUFBMkI3RixLQUEzQixFQUFrQ21PLE9BQWxDLEVBQTJDO1VBQzNDdEIsV0FBV3VELGNBQVgsQ0FBMEJ2SyxJQUExQixFQUFnQzdGLEtBQWhDLEVBQXVDbU8sT0FBdkMsRUFBZ0RrSyxRQUFoRCxDQUFQOztFQXhIcUI7O3VCQTRIRDtTQUNkLFFBRGM7ZUFFUixpQkFGUTtZQUdYLENBQUMsVUFBRCxDQUhXO1VBSWIsZ0JBQVN4TCxVQUFULEVBQXFCaEgsSUFBckIsRUFBMkI3RixLQUEzQixFQUFrQ21PLE9BQWxDLEVBQTJDO1VBQzNDdEIsV0FBV3VELGNBQVgsQ0FBMEJ2SyxJQUExQixFQUFnQzdGLEtBQWhDLEVBQXVDbU8sT0FBdkMsRUFBZ0RtSyxRQUFoRCxDQUFQOztFQWpJcUI7OzJCQXFJRztTQUNsQixZQURrQjtlQUVaLHFCQUZZO1lBR2YsQ0FBQyxVQUFELENBSGU7VUFJakIsZ0JBQVN6TCxVQUFULEVBQXFCaEgsSUFBckIsRUFBMkI3RixLQUEzQixFQUFrQ21PLE9BQWxDLEVBQTJDO09BQzlDN1QsSUFBSXVTLFdBQVd1RCxjQUFYLENBQTBCdkssSUFBMUIsRUFBZ0M3RixLQUFoQyxFQUF1Q21PLE9BQXZDLEVBQWdEb0ssWUFBaEQsQ0FBUjtPQUNDdFQsT0FBTzNLLEVBQUUySyxJQUFGLEVBRFI7O1lBR1N1VCxjQUFULENBQXdCdFAsQ0FBeEIsRUFBMkI7UUFDdkIsT0FBT0EsQ0FBUCxLQUFhLFFBQWhCLEVBQTBCLE9BQU9BLENBQVA7UUFDdkJpQyxNQUFNQyxPQUFOLENBQWNsQyxDQUFkLENBQUgsRUFBcUI7VUFDaEIsSUFBSW5NLElBQUksQ0FBWixFQUFlQSxJQUFJbU0sRUFBRXRPLE1BQXJCLEVBQTZCbUMsR0FBN0IsRUFBa0M7VUFDOUJtTSxFQUFFbk0sQ0FBRixDQUFILEVBQVMsT0FBT3liLGVBQWV0UCxFQUFFbk0sQ0FBRixDQUFmLENBQVA7Ozs7VUFJTHliLGVBQWV2VCxJQUFmLENBQVA7S0FDRUEsSUFBRixDQUFPQSxJQUFQO1VBQ08zSyxDQUFQOztFQXZKcUI7O3NCQTJKRjtTQUNiLE9BRGE7ZUFFUCxnQkFGTztZQUdWLENBQUMsVUFBRCxDQUhVO1VBSVosZ0JBQVN1UyxVQUFULEVBQXFCaEgsSUFBckIsRUFBMkI3RixLQUEzQixFQUFrQ21PLE9BQWxDLEVBQTJDO1VBQzNDdEIsV0FBV3VELGNBQVgsQ0FBMEJ2SyxJQUExQixFQUFnQzdGLEtBQWhDLEVBQXVDbU8sT0FBdkMsRUFBZ0RzSyxPQUFoRCxDQUFQOztFQWhLcUI7O3FCQW9LSDtTQUNaLE1BRFk7ZUFFTixvQkFGTTtZQUdULENBQUMsVUFBRCxDQUhTO1VBSVgsZ0JBQVM1TCxVQUFULEVBQXFCaEgsSUFBckIsRUFBMkI3RixLQUEzQixFQUFrQ21PLE9BQWxDLEVBQTJDO1VBQzNDdEIsV0FBV3VELGNBQVgsQ0FBMEJ2SyxJQUExQixFQUFnQzdGLEtBQWhDLEVBQXVDbU8sT0FBdkMsRUFBZ0R1SyxNQUFoRCxDQUFQOztFQXpLcUI7O29CQTZLSjtTQUNYLEtBRFc7ZUFFTCxjQUZLO1lBR1IsQ0FBQyxVQUFELENBSFE7VUFJVixnQkFBUzdMLFVBQVQsRUFBcUJoSCxJQUFyQixFQUEyQjdGLEtBQTNCLEVBQWtDbU8sT0FBbEMsRUFBMkM7T0FDOUM3VCxJQUFJdVMsV0FBV3VELGNBQVgsQ0FBMEJ2SyxJQUExQixFQUFnQzdGLEtBQWhDLEVBQXVDbU8sT0FBdkMsRUFBZ0R3SyxLQUFoRCxDQUFSOztLQUVFM1osaUJBQUYsQ0FBb0IsVUFBU2pFLENBQVQsRUFBWTtRQUMzQjZkLFNBQVM1TSxxQkFBcUIsSUFBckIsRUFBMkIsUUFBM0IsQ0FBYjtRQUNDNk0sVUFBVXRlLFNBQUEsQ0FBVXFlLE1BQVYsRUFBa0JoWSxNQUFsQixDQUF5QixXQUF6QixDQURYOztZQUdRckMsSUFBUixDQUFheEMsS0FBS2tTLFNBQUwsQ0FBZWxULENBQWYsRUFBa0JvSyxPQUFsQixDQUEwQixTQUExQixFQUFxQyxFQUFyQyxFQUF5Q0EsT0FBekMsQ0FBaUQsSUFBakQsRUFBdUQsSUFBdkQsQ0FBYjtJQUpEOztLQU9FbEcsa0JBQUYsQ0FBcUIsWUFBVztRQUMzQjJaLFNBQVM1TSxxQkFBcUIsSUFBckIsRUFBMkIsUUFBM0IsQ0FBYjtRQUNDNk0sVUFBVXRlLFNBQUEsQ0FBVXFlLE1BQVYsRUFBa0JoWSxNQUFsQixDQUF5QixXQUF6QixDQURYOztZQUdRNEksSUFBUixDQUFhLFFBQWI7SUFKRDs7S0FPRXRLLGtCQUFGLENBQXFCLFVBQVNuRSxDQUFULEVBQVk7UUFDNUI2ZCxTQUFTNU0scUJBQXFCLElBQXJCLEVBQTJCLFFBQTNCLENBQWI7UUFDQzZNLFVBQVV0ZSxTQUFBLENBQVVxZSxNQUFWLEVBQWtCaFksTUFBbEIsQ0FBeUIsV0FBekIsQ0FEWDs7WUFHUXJDLElBQVIsQ0FBYXhDLEtBQUtrUyxTQUFMLENBQWVsVCxDQUFmLEVBQWtCb0ssT0FBbEIsQ0FBMEIsU0FBMUIsRUFBcUMsRUFBckMsRUFBeUNBLE9BQXpDLENBQWlELElBQWpELEVBQXVELElBQXZELENBQWI7SUFKRDs7VUFPTzdLLENBQVA7O0VBek1xQjs7b0JBNk1KO1NBQ1gsS0FEVztlQUVMLGNBRks7WUFHUixDQUFDLFVBQUQsQ0FIUTtVQUlWLGdCQUFTdVMsVUFBVCxFQUFxQmhILElBQXJCLEVBQTJCN0YsS0FBM0IsRUFBa0NtTyxPQUFsQyxFQUEyQztPQUM5QzdULElBQUl1UyxXQUFXdUQsY0FBWCxDQUEwQnZLLElBQTFCLEVBQWdDN0YsS0FBaEMsRUFBdUNtTyxPQUF2QyxFQUFnRDJLLE9BQWhELENBQVI7O0tBRUU5WixpQkFBRixDQUFvQixVQUFTakUsQ0FBVCxFQUFZO1FBQzNCNmQsU0FBUzVNLHFCQUFxQixJQUFyQixFQUEyQixRQUEzQixDQUFiO1FBQ0M2TSxVQUFVdGUsU0FBQSxDQUFVcWUsTUFBVixFQUFrQmhZLE1BQWxCLENBQXlCLFdBQXpCLENBRFg7O1lBR1FyQyxJQUFSLENBQWF4QyxLQUFLa1MsU0FBTCxDQUFlbFQsRUFBRU8sSUFBakIsRUFBdUI2SixPQUF2QixDQUErQixTQUEvQixFQUEwQyxFQUExQyxFQUE4Q0EsT0FBOUMsQ0FBc0QsSUFBdEQsRUFBNEQsSUFBNUQsQ0FBYjtJQUpEOztLQU9FbEcsa0JBQUYsQ0FBcUIsWUFBVztRQUMzQjJaLFNBQVM1TSxxQkFBcUIsSUFBckIsRUFBMkIsUUFBM0IsQ0FBYjtRQUNDNk0sVUFBVXRlLFNBQUEsQ0FBVXFlLE1BQVYsRUFBa0JoWSxNQUFsQixDQUF5QixXQUF6QixDQURYOztZQUdRNEksSUFBUixDQUFhLFFBQWI7SUFKRDs7S0FPRXRLLGtCQUFGLENBQXFCLFVBQVNuRSxDQUFULEVBQVk7UUFDNUI2ZCxTQUFTNU0scUJBQXFCLElBQXJCLEVBQTJCLFFBQTNCLENBQWI7UUFDQzZNLFVBQVV0ZSxTQUFBLENBQVVxZSxNQUFWLEVBQWtCaFksTUFBbEIsQ0FBeUIsV0FBekIsQ0FEWDs7WUFHUXJDLElBQVIsQ0FBYXhDLEtBQUtrUyxTQUFMLENBQWVsVCxFQUFFTyxJQUFqQixFQUF1QjZKLE9BQXZCLENBQStCLFNBQS9CLEVBQTBDLEVBQTFDLEVBQThDQSxPQUE5QyxDQUFzRCxJQUF0RCxFQUE0RCxJQUE1RCxDQUFiO0lBSkQ7O1VBT083SyxDQUFQOztFQXpPcUI7O3VCQTZPRDtTQUNkLFFBRGM7ZUFFUixpQkFGUTtZQUdYLENBQUMsVUFBRCxDQUhXO1VBSWIsZ0JBQVN1UyxVQUFULEVBQXFCaEgsSUFBckIsRUFBMkI3RixLQUEzQixFQUFrQ21PLE9BQWxDLEVBQTJDO09BQzlDN1QsSUFBSXVTLFdBQVd1RCxjQUFYLENBQTBCdkssSUFBMUIsRUFBZ0M3RixLQUFoQyxFQUF1Q21PLE9BQXZDLEVBQWdENEssUUFBaEQsQ0FBUjs7S0FFRS9aLGlCQUFGLENBQW9CLFVBQVNqRSxDQUFULEVBQVk7UUFDM0I2ZCxTQUFTNU0scUJBQXFCLElBQXJCLEVBQTJCLFFBQTNCLENBQWI7UUFDQzZNLFVBQVV0ZSxTQUFBLENBQVVxZSxNQUFWLEVBQWtCaFksTUFBbEIsQ0FBeUIsV0FBekIsQ0FEWDs7WUFHUXJDLElBQVIsQ0FBYXhDLEtBQUtrUyxTQUFMLENBQWVsVCxFQUFFTyxJQUFGLENBQU9BLElBQXRCLEVBQTRCNkosT0FBNUIsQ0FBb0MsU0FBcEMsRUFBK0MsRUFBL0MsRUFBbURBLE9BQW5ELENBQTJELElBQTNELEVBQWlFLElBQWpFLENBQWI7SUFKRDs7S0FPRWxHLGtCQUFGLENBQXFCLFlBQVc7UUFDM0IyWixTQUFTNU0scUJBQXFCLElBQXJCLEVBQTJCLFFBQTNCLENBQWI7UUFDQzZNLFVBQVV0ZSxTQUFBLENBQVVxZSxNQUFWLEVBQWtCaFksTUFBbEIsQ0FBeUIsV0FBekIsQ0FEWDs7WUFHUTRJLElBQVIsQ0FBYSxRQUFiO0lBSkQ7O0tBT0V0SyxrQkFBRixDQUFxQixVQUFTbkUsQ0FBVCxFQUFZO1FBQzVCNmQsU0FBUzVNLHFCQUFxQixJQUFyQixFQUEyQixRQUEzQixDQUFiO1FBQ0M2TSxVQUFVdGUsU0FBQSxDQUFVcWUsTUFBVixFQUFrQmhZLE1BQWxCLENBQXlCLFdBQXpCLENBRFg7O1lBR1FyQyxJQUFSLENBQWF4QyxLQUFLa1MsU0FBTCxDQUFlbFQsRUFBRU8sSUFBRixDQUFPQSxJQUF0QixFQUE0QjZKLE9BQTVCLENBQW9DLFNBQXBDLEVBQStDLEVBQS9DLEVBQW1EQSxPQUFuRCxDQUEyRCxJQUEzRCxFQUFpRSxJQUFqRSxDQUFiO0lBSkQ7O1VBT083SyxDQUFQOztFQXpRcUI7O3FCQTZRSDtTQUNaLE1BRFk7ZUFFTixlQUZNO1lBR1QsQ0FBQyxVQUFELENBSFM7VUFJWCxnQkFBU3VTLFVBQVQsRUFBcUJoSCxJQUFyQixFQUEyQjdGLEtBQTNCLEVBQWtDbU8sT0FBbEMsRUFBMkM7VUFDM0N0QixXQUFXdUQsY0FBWCxDQUEwQnZLLElBQTFCLEVBQWdDN0YsS0FBaEMsRUFBdUNtTyxPQUF2QyxFQUFnRDZLLFFBQWhELENBQVA7O0VBbFJxQjs7b0JBc1JKO1NBQ1gsS0FEVztlQUVMLGNBRks7WUFHUixDQUFDLFVBQUQsQ0FIUTtVQUlWLGdCQUFTbk0sVUFBVCxFQUFxQmhILElBQXJCLEVBQTJCN0YsS0FBM0IsRUFBa0NtTyxPQUFsQyxFQUEyQztPQUM5QzdULElBQUl1UyxXQUFXdUQsY0FBWCxDQUEwQnZLLElBQTFCLEVBQWdDN0YsS0FBaEMsRUFBdUNtTyxPQUF2QyxFQUFnRDhLLEtBQWhELENBQVI7S0FDRWphLGlCQUFGLENBQW9CLFVBQVNqRSxDQUFULEVBQVk7UUFDM0I2ZCxTQUFTNU0scUJBQXFCLElBQXJCLEVBQTJCLFFBQTNCLENBQWI7UUFDQzZNLFVBQVV0ZSxTQUFBLENBQVVxZSxNQUFWLEVBQWtCaFksTUFBbEIsQ0FBeUIsV0FBekIsQ0FEWDs7WUFHUXJDLElBQVIsQ0FBYXhDLEtBQUtrUyxTQUFMLENBQWVsVCxDQUFmLEVBQWtCb0ssT0FBbEIsQ0FBMEIsU0FBMUIsRUFBcUMsRUFBckMsRUFBeUNBLE9BQXpDLENBQWlELElBQWpELEVBQXVELElBQXZELENBQWI7SUFKRDs7S0FPRWxHLGtCQUFGLENBQXFCLFlBQVc7UUFDM0IyWixTQUFTNU0scUJBQXFCLElBQXJCLEVBQTJCLFFBQTNCLENBQWI7UUFDQzZNLFVBQVV0ZSxTQUFBLENBQVVxZSxNQUFWLEVBQWtCaFksTUFBbEIsQ0FBeUIsV0FBekIsQ0FEWDs7WUFHUTRJLElBQVIsQ0FBYSxRQUFiO0lBSkQ7O0tBT0V0SyxrQkFBRixDQUFxQixVQUFTbkUsQ0FBVCxFQUFZO1FBQzVCNmQsU0FBUzVNLHFCQUFxQixJQUFyQixFQUEyQixRQUEzQixDQUFiO1FBQ0M2TSxVQUFVdGUsU0FBQSxDQUFVcWUsTUFBVixFQUFrQmhZLE1BQWxCLENBQXlCLFdBQXpCLENBRFg7O1lBR1FyQyxJQUFSLENBQWF4QyxLQUFLa1MsU0FBTCxDQUFlbFQsQ0FBZixFQUFrQm9LLE9BQWxCLENBQTBCLFNBQTFCLEVBQXFDLEVBQXJDLEVBQXlDQSxPQUF6QyxDQUFpRCxJQUFqRCxFQUF1RCxJQUF2RCxDQUFiO0lBSkQ7O1VBT083SyxDQUFQOztFQWpUcUI7O3NCQXFURjtTQUNiLE9BRGE7ZUFFUCxnQkFGTztZQUdWLENBQUMsVUFBRCxDQUhVO1VBSVosZ0JBQVN1UyxVQUFULEVBQXFCaEgsSUFBckIsRUFBMkI3RixLQUEzQixFQUFrQ21PLE9BQWxDLEVBQTJDO1VBQzNDdEIsV0FBV3VELGNBQVgsQ0FBMEJ2SyxJQUExQixFQUFnQzdGLEtBQWhDLEVBQXVDbU8sT0FBdkMsRUFBZ0QrSyxPQUFoRCxDQUFQOztFQTFUcUI7O3lCQThUQztTQUNoQixXQURnQjtlQUVWLG9CQUZVO1lBR2IsQ0FBQyxVQUFELENBSGE7VUFJZixnQkFBU3JNLFVBQVQsRUFBcUJoSCxJQUFyQixFQUEyQjdGLEtBQTNCLEVBQWtDbU8sT0FBbEMsRUFBMkM7T0FDOUM3VCxJQUFJdVMsV0FBV3VELGNBQVgsQ0FBMEJ2SyxJQUExQixFQUFnQzdGLEtBQWhDLEVBQXVDbU8sT0FBdkMsRUFBZ0RnTCxVQUFoRCxDQUFSOztLQUVFbmEsaUJBQUYsQ0FBb0IsVUFBU2pFLENBQVQsRUFBWTtRQUMzQjZkLFNBQVM1TSxxQkFBcUIsSUFBckIsRUFBMkIsUUFBM0IsQ0FBYjtRQUNDNk0sVUFBVXRlLFNBQUEsQ0FBVXFlLE1BQVYsRUFBa0JoWSxNQUFsQixDQUF5QixXQUF6QixDQURYOztZQUdRckMsSUFBUixDQUFheEMsS0FBS2tTLFNBQUwsQ0FBZWxULEVBQUVPLElBQWpCLEVBQXVCNkosT0FBdkIsQ0FBK0IsU0FBL0IsRUFBMEMsRUFBMUMsRUFBOENBLE9BQTlDLENBQXNELElBQXRELEVBQTRELElBQTVELENBQWI7SUFKRDs7S0FPRWxHLGtCQUFGLENBQXFCLFlBQVc7UUFDM0IyWixTQUFTNU0scUJBQXFCLElBQXJCLEVBQTJCLFFBQTNCLENBQWI7UUFDQzZNLFVBQVV0ZSxTQUFBLENBQVVxZSxNQUFWLEVBQWtCaFksTUFBbEIsQ0FBeUIsV0FBekIsQ0FEWDs7WUFHUTRJLElBQVIsQ0FBYSxRQUFiO0lBSkQ7O0tBT0V0SyxrQkFBRixDQUFxQixVQUFTbkUsQ0FBVCxFQUFZO1FBQzVCNmQsU0FBUzVNLHFCQUFxQixJQUFyQixFQUEyQixRQUEzQixDQUFiO1FBQ0M2TSxVQUFVdGUsU0FBQSxDQUFVcWUsTUFBVixFQUFrQmhZLE1BQWxCLENBQXlCLFdBQXpCLENBRFg7O1lBR1FyQyxJQUFSLENBQWF4QyxLQUFLa1MsU0FBTCxDQUFlbFQsRUFBRU8sSUFBakIsRUFBdUI2SixPQUF2QixDQUErQixTQUEvQixFQUEwQyxFQUExQyxFQUE4Q0EsT0FBOUMsQ0FBc0QsSUFBdEQsRUFBNEQsSUFBNUQsQ0FBYjtJQUpEOztVQU9PN0ssQ0FBUDs7RUExVnFCOzswQkE4VkU7U0FDakIsWUFEaUI7ZUFFWCxxQkFGVztZQUdkLENBQUMsVUFBRCxDQUhjO1VBSWhCLGdCQUFTdVMsVUFBVCxFQUFxQmhILElBQXJCLEVBQTJCN0YsS0FBM0IsRUFBa0NtTyxPQUFsQyxFQUEyQztPQUM5QzdULElBQUl1UyxXQUFXdUQsY0FBWCxDQUEwQnZLLElBQTFCLEVBQWdDN0YsS0FBaEMsRUFBdUNtTyxPQUF2QyxFQUFnRGlMLFdBQWhELENBQVI7O0tBRUVwYSxpQkFBRixDQUFvQixVQUFTakUsQ0FBVCxFQUFZO1FBQzNCNmQsU0FBUzVNLHFCQUFxQixJQUFyQixFQUEyQixRQUEzQixDQUFiO1FBQ0M2TSxVQUFVdGUsU0FBQSxDQUFVcWUsTUFBVixFQUFrQmhZLE1BQWxCLENBQXlCLFdBQXpCLENBRFg7O1lBR1FyQyxJQUFSLENBQWF4QyxLQUFLa1MsU0FBTCxDQUFlbFQsRUFBRU8sSUFBRixDQUFPQSxJQUF0QixFQUE0QjZKLE9BQTVCLENBQW9DLFNBQXBDLEVBQStDLEVBQS9DLEVBQW1EQSxPQUFuRCxDQUEyRCxJQUEzRCxFQUFpRSxJQUFqRSxDQUFiO0lBSkQ7O0tBT0VsRyxrQkFBRixDQUFxQixZQUFXO1FBQzNCMlosU0FBUzVNLHFCQUFxQixJQUFyQixFQUEyQixRQUEzQixDQUFiO1FBQ0M2TSxVQUFVdGUsU0FBQSxDQUFVcWUsTUFBVixFQUFrQmhZLE1BQWxCLENBQXlCLFdBQXpCLENBRFg7O1lBR1E0SSxJQUFSLENBQWEsUUFBYjtJQUpEOztLQU9FdEssa0JBQUYsQ0FBcUIsVUFBU25FLENBQVQsRUFBWTtRQUM1QjZkLFNBQVM1TSxxQkFBcUIsSUFBckIsRUFBMkIsUUFBM0IsQ0FBYjtRQUNDNk0sVUFBVXRlLFNBQUEsQ0FBVXFlLE1BQVYsRUFBa0JoWSxNQUFsQixDQUF5QixXQUF6QixDQURYOztZQUdRckMsSUFBUixDQUFheEMsS0FBS2tTLFNBQUwsQ0FBZWxULEVBQUVPLElBQUYsQ0FBT0EsSUFBdEIsRUFBNEI2SixPQUE1QixDQUFvQyxTQUFwQyxFQUErQyxFQUEvQyxFQUFtREEsT0FBbkQsQ0FBMkQsSUFBM0QsRUFBaUUsSUFBakUsQ0FBYjtJQUpEOztVQU9PN0ssQ0FBUDs7RUExWHFCOztvQkE4WEo7U0FDWCxRQURXO2VBRUwsUUFGSztZQUdSLENBQUMsUUFBRCxFQUFXLGFBQVgsQ0FIUTtVQUlWLGtCQUFXO1VBQ1grZSxLQUFQOztFQW5ZcUI7O29CQXVZSjtTQUNYLGFBRFc7ZUFFTCxhQUZLO1lBR1IsQ0FBQyxRQUFELEVBQVcsWUFBWCxFQUF5QixZQUF6QixDQUhRO1VBSVYsa0JBQVc7VUFDWEMsS0FBUDs7RUE1WXFCOztvQkFnWko7U0FDWCxhQURXO2VBRUwsYUFGSztZQUdSLENBQUMsUUFBRCxFQUFXLFlBQVgsRUFBeUIsWUFBekIsQ0FIUTtVQUlWLGtCQUFXO1VBQ1hDLEtBQVA7O0VBclpxQjs7c0JBeVpGO1NBQ2IsU0FEYTtlQUVQLGdCQUZPO1lBR1YsQ0FBQyxRQUFELENBSFU7VUFJWixrQkFBVztVQUNYQyxLQUFQOztFQTlacUI7O3FCQWthSDtTQUNaLGNBRFk7ZUFFTix1QkFGTTtZQUdULENBQUMsUUFBRCxFQUFXLFlBQVgsRUFBeUIsV0FBekIsQ0FIUztVQUlYLGtCQUFXO1VBQ1hDLE1BQVA7O0VBdmFxQjs7cUJBMmFIO1NBQ1osY0FEWTtlQUVOLDBCQUZNO1lBR1QsQ0FBQyxRQUFELEVBQVcsWUFBWCxFQUF5QixXQUF6QixDQUhTO1VBSVgsa0JBQVc7VUFDWEMsTUFBUDs7RUFoYnFCOzs7eUJBcWJDO1NBQ2hCLGFBRGdCO2VBRVYsbUJBRlU7WUFHYixDQUFDLGFBQUQsRUFBZ0IsWUFBaEIsRUFBOEIsWUFBOUIsQ0FIYTtVQUlmLGtCQUFXO1VBQ1hDLE9BQVA7O0VBMWJxQjs7eUJBOGJDO1NBQ2hCLGFBRGdCO2VBRVYsbUJBRlU7WUFHYixDQUFDLGFBQUQsRUFBZ0IsWUFBaEIsRUFBOEIsWUFBOUIsQ0FIYTtVQUlmLGtCQUFXO1VBQ1hDLE9BQVA7O0VBbmNxQjs7d0JBdWNBO1NBQ2YsWUFEZTtlQUVULHNCQUZTO1lBR1osQ0FBQyxhQUFELEVBQWdCLFlBQWhCLEVBQThCLFdBQTlCLENBSFk7VUFJZCxrQkFBVztVQUNYQyxJQUFQOzs7Q0E1Y0k7O0FDM0NBLElBQU1DLGFBQWE7eUJBQ0Q7V0FDZCxjQURjO2lCQUVSLDRCQUZRO2NBR1gsQ0FBQyxPQUFELENBSFc7Y0FJWDthQUNGLHVCQURFO2FBRUY7WUFDQSxlQURBO2lCQUVLO0lBSkg7ZUFNQztZQUNILG9CQURHO2FBRUYsR0FGRTtjQUdELEdBSEM7bUJBSUksYUFKSjtjQUtELEVBQUUsT0FBTyxFQUFULEVBQWEsU0FBUyxFQUF0QixFQUEwQixVQUFVLEVBQXBDLEVBQXdDLFFBQVEsRUFBaEQ7SUFYQTtZQWFGO1lBQ0Esd0JBREE7a0JBRU07ZUFDSDtlQUNBOztLQUpIO2NBT0U7ZUFDQztlQUNBOztLQVRIO2VBWUc7ZUFDQTtlQUNBOzs7OztFQWhDVzs7K0JBdUNLO1dBQ3BCLHFCQURvQjtpQkFFZCwyQkFGYztjQUdqQixDQUFDLE9BQUQsRUFBVSxnQkFBVixFQUE0QixNQUE1QixDQUhpQjtjQUlqQjthQUNEO1lBQ0QsZUFEQztpQkFFSSxPQUZKO2FBR0Q7Y0FDQzttQkFDTSxXQUROO2dCQUVHOzs7SUFQRjtlQVdDO1NBQ04sV0FETTtTQUVOLFdBRk07V0FHSixXQUhJO2FBSUYsV0FKRTtjQUtEO2FBQ0QsY0FEQztlQUVDLE9BRkQ7cUJBR08sR0FIUDtxQkFJTztLQVROO2NBV0Q7YUFDRCxnQkFEQztlQUVDO0tBYkE7a0JBZUc7YUFDTCxpQkFESztlQUVILE9BRkc7Y0FHSjtLQWxCQztjQW9CRjthQUNBLGtCQURBO2VBRUU7O0lBakNEO2FBb0NGOztFQS9FYzs7d0JBbUZGO1dBQ2IsYUFEYTtpQkFFUCxtQkFGTztjQUdWLENBQUMsT0FBRCxFQUFVLGdCQUFWLEVBQTRCLEtBQTVCLENBSFU7Y0FJVjthQUNELHVCQURDO2VBRUM7Y0FDRDthQUNEOztJQUpDO2FBT0Q7O0VBOUZhOztpQ0FrR087V0FDdEIsd0JBRHNCO2lCQUVoQiw4QkFGZ0I7Y0FHbkIsQ0FBQyxPQUFELEVBQVUsZ0JBQVYsRUFBNEIsS0FBNUIsQ0FIbUI7Y0FJbkI7ZUFDQztZQUNKLFdBREk7Y0FFRDtjQUNBLEtBREE7Y0FFQSxLQUZBO2VBR0M7S0FMQTtjQU9EO2FBQ0QsbUJBREM7V0FFSDs7SUFWRzthQWFEOztFQW5IYTs7Z0NBdUhNO1dBQ3JCLGFBRHFCO2lCQUVmLHNCQUZlO2NBR2xCLENBQUMsT0FBRCxDQUhrQjtjQUlsQjthQUNGLHVCQURFO2FBRUQ7O0VBN0hhOzt3QkFpSUY7V0FDYixhQURhO2lCQUVQLG1CQUZPO2NBR1YsQ0FBQyxPQUFELEVBQVUsZ0JBQVYsRUFBNEIsS0FBNUIsQ0FIVTtjQUlWO2FBQ0Q7WUFDRCxlQURDO2lCQUVJLE9BRko7YUFHRDtjQUNDO21CQUNNLFdBRE47Z0JBRUc7OztJQVBGO2VBV0M7U0FDTixXQURNO1NBRU4sV0FGTTtXQUdKLFdBSEk7YUFJRixXQUpFO1lBS0gsV0FMRztrQkFNRzthQUNMLGlCQURLO2VBRUgsT0FGRztjQUdKO0tBVEM7Y0FXRjthQUNBOztJQXZCQzthQTBCRjs7RUEvSmM7O2lDQW1LTztXQUN0Qix3QkFEc0I7aUJBRWhCLDhCQUZnQjtjQUduQixDQUFDLE9BQUQsRUFBVSxnQkFBVixFQUE0QixLQUE1QixDQUhtQjtjQUluQjtlQUNDO2NBQ0Q7YUFDRCxzQkFEQzttQkFFSztjQUNMLGlCQURLO2dCQUVILEdBRkc7ZUFHSjs7O0lBUEQ7YUFXRjs7RUFsTGM7O2dDQXNMTTtXQUNyQixhQURxQjtpQkFFZixzQkFGZTtjQUdsQixDQUFDLE9BQUQsQ0FIa0I7Y0FJbEI7YUFDRix1QkFERTthQUVEOztFQTVMYTs7MEJBZ01BO1dBQ2YsZUFEZTtpQkFFVCxxQkFGUztjQUdaLENBQUMsT0FBRCxFQUFVLGdCQUFWLEVBQTRCLE9BQTVCLENBSFk7Y0FJWjthQUNEO1lBQ0QsZUFEQztpQkFFSSxPQUZKO2FBR0Q7Y0FDQzttQkFDTSxXQUROO2dCQUVHOzs7SUFQRjtlQVdDO1NBQ04sV0FETTtTQUVOLFdBRk07V0FHSixXQUhJO2FBSUYsV0FKRTtZQUtILFdBTEc7a0JBTUc7YUFDTCxpQkFESztlQUVILE9BRkc7Y0FHSjtLQVRDO2NBV0Y7YUFDQSxpQkFEQTtlQUVFLFFBRkY7WUFHRDtxQkFDUzs7O0lBMUJQO2FBOEJGOztFQWxPYzs7bUNBc09TO1dBQ3hCLDBCQUR3QjtpQkFFbEIsZ0NBRmtCO2NBR3JCLENBQUMsT0FBRCxFQUFVLGdCQUFWLEVBQTRCLE9BQTVCLENBSHFCO2NBSXJCO2VBQ0M7Y0FDRDthQUNELHNCQURDO21CQUVLO2NBQ0wsaUJBREs7Z0JBRUgsR0FGRztlQUdKO01BTEQ7WUFPRjtxQkFDUzs7O0lBVlA7YUFjRjs7RUF4UGM7O2tDQTRQUTtXQUN2QixlQUR1QjtpQkFFakIsd0JBRmlCO2NBR3BCLENBQUMsT0FBRCxDQUhvQjtjQUlwQjthQUNGLHVCQURFO2FBRUQ7O0VBbFFhOzs4QkFzUUk7V0FDbkIsb0JBRG1CO2lCQUViLDBCQUZhO2NBR2hCLENBQUMsT0FBRCxFQUFVLGVBQVYsRUFBMkIsTUFBM0IsQ0FIZ0I7Y0FJaEI7YUFDRDtpQkFDSSxPQURKO2FBRUE7Y0FDQzttQkFDSyxXQURMLEVBQ2tCLFVBQVU7TUFGN0I7Y0FJQzttQkFDSyxXQURMLEVBQ2tCLFVBQVU7OztJQVI1QjtlQVlDO1NBQ04sV0FETTtTQUVQLFdBRk87YUFHSCxXQUhHO2NBSUQ7YUFDRixnQkFERTtlQUVBO0tBTkM7Y0FRRDthQUNELGdCQURDO2VBRUE7S0FWQztrQkFZRTthQUNMLGlCQURLO2VBRUgsT0FGRztjQUdKO0tBZkU7Y0FpQkQ7YUFDRCxrQkFEQztlQUVBLFFBRkE7ZUFHQSxRQUhBO2NBSUQsS0FKQztjQUtELEtBTEM7ZUFNQTs7SUFuQ0E7YUFzQ0Y7O0VBaFRjOzt5QkFvVEQ7V0FDZCxjQURjO2lCQUVSLG9CQUZRO2NBR1gsQ0FBQyxPQUFELEVBQVUsZUFBVixFQUEyQixNQUEzQixDQUhXO2NBSVg7YUFDRix1QkFERTtlQUVBO2NBQ0Q7ZUFDQztLQUZBO2NBSUQ7YUFDRCxrQkFEQzthQUVEO2NBQ0M7OztJQVRDO2FBYUY7O0VBclVjOztpQ0F5VU87V0FDdEIsd0JBRHNCO2lCQUVoQixzQ0FGZ0I7Y0FHbkIsQ0FBQyxPQUFELEVBQVUsZUFBVixFQUEyQixNQUEzQixDQUhtQjtjQUluQjthQUNGLHVCQURFO2VBRUE7VUFDTCxXQURLO2VBRUE7YUFDRixjQURFO2VBRUEsVUFGQTtjQUdEO0tBTEM7Y0FPRDthQUNEOztJQVZFO2FBYUY7O0VBMVZjOztpQ0E4Vk87V0FDdEIsY0FEc0I7aUJBRWhCLHVCQUZnQjtjQUduQixDQUFDLE9BQUQsQ0FIbUI7Y0FJbkI7YUFDRix1QkFERTthQUVEOztFQXBXYTs7cUNBd1dXO1dBQzFCLDhCQUQwQjtpQkFFcEIsaUNBRm9CO2NBR3ZCLENBQUMsT0FBRCxFQUFVLGVBQVYsRUFBMkIsTUFBM0IsQ0FIdUI7Y0FJdkI7YUFDRix1QkFERTtlQUVBO2NBQ0Q7ZUFDQztLQUZBO2NBSUQ7YUFDRCxrQkFEQzthQUVEO2NBQ0MsU0FERDtlQUVHO2VBQ0Q7Ozs7SUFYQTthQWdCRjs7RUE1WGM7O3NDQWdZWTtXQUMzQiw2QkFEMkI7aUJBRXJCLDRDQUZxQjtjQUd4QixDQUFDLE9BQUQsRUFBVSxlQUFWLEVBQTJCLFNBQTNCLENBSHdCO2NBSXhCO2FBQ0YsdUJBREU7YUFFRDthQUNBO2NBQ0M7bUJBQ0s7TUFGTjtjQUlDO21CQUNLOzs7SUFSTDtlQVlDO2NBQ0Q7Y0FDQTtLQUZDO1NBSU4sV0FKTTtTQUtOLFdBTE07Y0FNRDtlQUNDO0tBUEE7Y0FTRDtlQUNDO0tBVkE7Y0FZRDtlQUNDLFFBREQ7ZUFFQyxRQUZEO2VBR0M7S0FmQTtZQWlCSCxXQWpCRztjQWtCRDthQUNEO0tBbkJFO2NBcUJEO2FBQ0QsbUJBREM7ZUFFQyxPQUZEO1dBR0gsS0FIRztnQkFJRTtjQUNGLGdCQURFO2dCQUVBLGFBRkE7ZUFHRDs7S0E1QkE7V0ErQkosV0EvQkk7ZUFnQ0E7YUFDRixjQURFO2VBRUEsVUFGQTtjQUdEO0tBbkNDO1VBcUNMO0lBakRJO2FBbUREOztFQXZiYTs7b0NBMmJVO1dBQ3pCLGlCQUR5QjtpQkFFbkIsMEJBRm1CO2NBR3RCLENBQUMsT0FBRCxDQUhzQjtjQUl0QjthQUNGLHVCQURFO2FBRUQ7OztDQWpjTjs7QUNBQSxJQUFNQyxrQkFBa0I7OzJCQUVKO1dBQ2hCLGdCQURnQjtpQkFFVixzQkFGVTtjQUdiLENBQUMsT0FBRCxFQUFVLG1CQUFWLEVBQStCLFFBQS9CLENBSGE7Y0FJYjthQUNEO1lBQ0QsZUFEQztpQkFFSSxPQUZKO2FBR0Q7Y0FDQzttQkFDTSxXQUROO2dCQUVHOzs7SUFQRjtlQVdDO2FBQ0YsR0FERTtjQUVELEdBRkM7bUJBR0ksYUFISjtjQUlELEVBQUUsT0FBTyxFQUFULEVBQWEsU0FBUyxFQUF0QixFQUEwQixVQUFVLEVBQXBDLEVBQXdDLFFBQVEsRUFBaEQsRUFKQztTQUtOLFdBTE07U0FNTixXQU5NO2FBT0YsV0FQRTtZQVFILFdBUkc7a0JBU0c7YUFDTCxpQkFESztlQUVILE9BRkc7Y0FHSjtLQVpDO2NBY0Y7YUFDQSxvQkFEQTthQUVBO2lCQUNJO01BSEo7YUFLQTtjQUNDO01BTkQ7ZUFRRTs7SUFqQ0Q7WUFvQ0Y7WUFDQSx3QkFEQTtrQkFFTTtlQUNIO2VBQ0E7O0tBSkg7Y0FPRTtlQUNDO2VBQ0E7O0tBVEg7ZUFZRztlQUNBO2VBQ0E7OztJQWxERDthQXNERjs7RUE1RG1COztvQ0FnRUs7V0FDekIsMkJBRHlCO2lCQUVuQixpQ0FGbUI7Y0FHdEIsQ0FBQyxPQUFELEVBQVUsbUJBQVYsRUFBK0IsUUFBL0IsQ0FIc0I7Y0FJdEI7ZUFDQztVQUNMLFdBREs7ZUFFQTthQUNGLGNBREU7ZUFFQSxpQkFGQTtjQUdEO0tBTEM7Y0FPRDthQUNELHVCQURDO2FBRUQ7aUJBQ0k7TUFISDthQUtEO2NBQ0M7TUFOQTttQkFRSztjQUNMLGlCQURLO2dCQUVILEdBRkc7ZUFHSjs7O0lBbkJEO2FBdUJGOztFQTNGbUI7O21DQStGSTtXQUN4QixnQkFEd0I7aUJBRWxCLHlCQUZrQjtjQUdyQixDQUFDLE9BQUQsQ0FIcUI7Y0FJckI7YUFDRix1QkFERTthQUVEOztFQXJHa0I7OzhCQXlHRDtXQUNuQixvQkFEbUI7aUJBRWIsMEJBRmE7Y0FHaEIsQ0FBQyxPQUFELEVBQVUsbUJBQVYsRUFBK0IsT0FBL0IsQ0FIZ0I7Y0FJaEI7YUFDRDtZQUNELGVBREM7aUJBRUksT0FGSjthQUdEO2NBQ0M7bUJBQ00sV0FETjtnQkFFRzs7O0lBUEY7ZUFXQzthQUNGLEdBREU7Y0FFRCxHQUZDO21CQUdJLGFBSEo7Y0FJRCxFQUFFLE9BQU8sRUFBVCxFQUFhLFNBQVMsRUFBdEIsRUFBMEIsVUFBVSxFQUFwQyxFQUF3QyxRQUFRLEVBQWhELEVBSkM7U0FLTixXQUxNO1NBTU4sV0FOTTthQU9GLFdBUEU7WUFRSCxXQVJHO2tCQVNHO2FBQ0wsaUJBREs7ZUFFSCxPQUZHO2NBR0o7S0FaQztjQWNGO2FBQ0EsdUJBREE7YUFFQTtpQkFDSTtNQUhKO2VBS0U7O0lBOUJEO1lBaUNGO1lBQ0Esd0JBREE7a0JBRU07ZUFDSDtlQUNBOztLQUpIO2NBT0U7ZUFDQztlQUNBOztLQVRIO2VBWUc7ZUFDQTtlQUNBOzs7SUEvQ0Q7YUFtREY7OztDQWhLTDs7QUNBQSxJQUFNQyxZQUFZOzRCQUNHO1dBQ2pCLGtCQURpQjtpQkFFWCx3QkFGVztjQUdkLENBQUMsT0FBRCxFQUFVLGFBQVYsRUFBeUIsTUFBekIsQ0FIYztjQUlkO2FBQ0YsdUJBREU7YUFFRjthQUNBO2NBQ0M7bUJBQ0ssV0FETDtnQkFFRTtNQUhIO2NBS0M7bUJBQ0ssV0FETDtnQkFFRTs7O0lBVkQ7ZUFjQTtTQUNOLFdBRE07U0FFTixXQUZNO2FBR0YsV0FIRTtjQUlEO2FBQ0QsY0FEQztlQUVDO0tBTkE7Y0FRRDthQUNELGdCQURDO2VBRUM7S0FWQTtrQkFZRzthQUNMLGlCQURLO2VBRUgsT0FGRztjQUdKO0tBZkM7Y0FpQkQ7YUFDRCxrQkFEQztjQUVBLEtBRkE7Y0FHQSxLQUhBO2VBSUMsS0FKRDtlQUtDLFFBTEQ7ZUFNQzs7SUFyQ0E7YUF3Q0Y7O0VBN0NhOzt5QkFpREE7V0FDZCxrQ0FEYztpQkFFUiwwQ0FGUTtjQUdYLENBQUMsT0FBRCxFQUFVLGFBQVYsQ0FIVztjQUlYO2FBQ0YsdUJBREU7ZUFFQTtjQUNBO1lBQ0Y7S0FGRTtjQUlEO2FBQ0Qsa0JBREM7V0FFSCxXQUZHO2FBR0Q7Y0FDQzs7S0FSQztjQVdEO2FBQ0QsaUJBREM7YUFFRDtjQUNDO01BSEE7Z0JBS0U7Y0FDRixnQkFERTtnQkFFQSxhQUZBO2VBR0Q7O0tBbkJBO1VBc0JMLFdBdEJLO2NBdUJEO2FBQ0QsbUJBREM7Z0JBRUU7Y0FDRixnQkFERTtnQkFFQSxhQUZBO2VBR0Q7TUFMRDtXQU9IO0tBOUJJO1lBZ0NIO0lBbENHO2FBb0NGOzs7Q0F6Rkw7O0FDQUEsSUFBTUMsbUJBQW1CO29DQUNJO1dBQ3pCLGVBRHlCO2lCQUVuQixpQ0FGbUI7Y0FHdEIsQ0FBQyxPQUFELEVBQVUsY0FBVixFQUEwQixlQUExQixDQUhzQjtjQUl0QjthQUNGLHVCQURFO2FBRUY7YUFDQTtjQUNDO21CQUNLLFdBREw7Z0JBRUU7TUFISDtjQUtDO21CQUNLLFdBREw7Z0JBRUU7TUFQSDtjQVNDO21CQUNLLFdBREw7Z0JBRUU7OztJQWREO2VBa0JBO1NBQ04sV0FETTtTQUVOLFdBRk07Y0FHRDthQUNELGdCQURDO2VBRUM7S0FMQSxFQU1SLFVBQVM7YUFDSCxnQkFERztlQUVEO0tBUkE7a0JBVUc7YUFDTCxpQkFESztlQUVILFFBRkc7Y0FHSjtLQWJDO2NBZUQ7YUFDRCxrQkFEQztjQUVBLEtBRkE7Y0FHQSxLQUhBO2VBSUMsS0FKRDtlQUtDLFFBTEQ7ZUFNQztLQXJCQTtjQXVCRDthQUNELGtCQURDO1VBRUosV0FGSTthQUdEO2NBQ0M7TUFKQTtjQU1BLFdBTkE7Y0FPQTtLQTlCQztjQWdDRDthQUNELGtCQURDO1VBRUosV0FGSTthQUdEO2NBQ0M7TUFKQTtjQU1BLFdBTkE7Y0FPQTs7SUF6REM7YUE0REY7O0VBakVvQjs4Q0FvRWM7V0FDbkMsMEJBRG1DO2lCQUU3QixpRUFGNkI7Y0FHaEMsQ0FBQyxPQUFELEVBQVUsY0FBVixFQUEwQixnQkFBMUIsQ0FIZ0M7Y0FJaEM7YUFDRix1QkFERTthQUVEO2FBQ0E7Y0FDQzttQkFDSyxXQURMO2dCQUVFO01BSEg7Y0FLQzttQkFDSyxXQURMO2dCQUVFOzs7SUFWRjtlQWNDO1NBQ04sV0FETTtTQUVOLFdBRk07YUFHRixXQUhFO2NBSUQ7YUFDRCxjQURDO2VBRUMsT0FGRDtxQkFHTyxHQUhQO3FCQUlPO0tBUk47Y0FVRDthQUNELGdCQURDO2VBRUM7S0FaQTtrQkFjRzthQUNMLGlCQURLO2VBRUgsR0FGRztjQUdKO0tBakJDO2NBbUJEO2FBQ0Qsa0JBREM7Y0FFQSxLQUZBO2NBR0EsS0FIQTtlQUlDO0tBdkJBO2NBeUJEO2FBQ0QsaUJBREM7Y0FFQSxXQUZBO21CQUdLO2NBQ0wsaUJBREs7Z0JBRUgsR0FGRztlQUdKO01BTkQ7VUFRSjtLQWpDSztjQW1DRDthQUNELGlCQURDO1VBRUosV0FGSTtjQUdBO0tBdENDO2NBd0NEO2FBQ0QsbUJBREM7VUFFSixXQUZJO2NBR0EsV0FIQTthQUlELFdBSkM7bUJBS0s7Y0FDTCxpQkFESztnQkFFSCxHQUZHO2VBR0o7TUFSRDtXQVVIO0tBbERJO2NBb0REO2FBQ0QsbUJBREM7VUFFSixXQUZJO2NBR0EsV0FIQTthQUlELFdBSkM7V0FLSDs7SUF2RUc7WUEwRUY7V0FDRDtJQTNFRzthQTZFRDs7O0NBckpOOztBQ0FBLElBQU1DLGVBQWU7dUNBQ1c7V0FDNUIsMkJBRDRCO2lCQUV0QixxTkFGc0I7Y0FHekIsQ0FBQyxPQUFELEVBQVUsU0FBVixDQUh5QjtjQUl6QjthQUNEO1lBQ0Q7SUFGRTtlQUlDO2tCQUNHO2NBQ0o7O0lBTkE7YUFTRDs7RUFkZTs7d0NBa0JZO1dBQzdCLDRCQUQ2QjtpQkFFdkIsNkhBRnVCO2NBRzFCLENBQUUsT0FBRixFQUFXLFNBQVgsQ0FIMEI7Y0FJMUI7YUFDRDthQUNBO2NBQ0M7bUJBQ0ssV0FETDtnQkFFRTs7S0FKSDtZQU9EO0lBUkU7ZUFVQzthQUNGLFdBREU7a0JBRUc7YUFDTCxvQkFESztlQUVILGFBRkc7Y0FHSjtLQUxDO2NBT0Q7ZUFDQztnQkFDQzs7O0lBbkJGO2FBdUJEOztFQTdDZTs7MENBaURjO1dBQy9CLDZCQUQrQjtpQkFFekIsMk5BRnlCO2NBRzVCLENBQUMsT0FBRCxFQUFVLFNBQVYsQ0FINEI7Y0FJNUI7YUFDRCx1QkFEQzthQUVEO2FBQ0E7Y0FDQzttQkFDSyxXQURMO2dCQUVFOztLQUpIO1lBT0Q7SUFURTtlQVdDO2NBQ0QsR0FEQztjQUVEO2NBQ0E7S0FIQzthQUtGLFdBTEU7Y0FNRDtlQUNDO0tBUEE7Y0FTRDtlQUNDO0tBVkE7a0JBWUc7YUFDTCxvQkFESztlQUVILGFBRkc7Y0FHSjtLQWZDO2NBaUJEO2NBQ0E7eUJBQ1c7TUFGWDtjQUlBO3lCQUNXO01BTFg7ZUFPQztLQXhCQTtjQTBCRDtnQkFDRTtnQkFDQSxhQURBO2VBRUQ7O0tBN0JBO2VBZ0NBO2NBQ0Q7S0FqQ0M7VUFtQ0w7SUE5Q0k7YUFnREQ7O0VBckdlOztrREF5R3NCO1dBQ3ZDLDBCQUR1QztpQkFFakMsd0VBRmlDO2NBR3BDLENBQUMsT0FBRCxFQUFVLFNBQVYsQ0FIb0M7Y0FJcEM7YUFDRCx1QkFEQzthQUVEO1lBQ0QsNkRBREM7aUJBRUk7SUFKSDtlQU1DO2tCQUNHO2NBQ0o7O0lBUkE7YUFXRDs7RUF4SGU7O3FDQTRIUztXQUMxQix5QkFEMEI7aUJBRXBCLDhKQUZvQjtjQUd2QixDQUFDLE9BQUQsRUFBVSxTQUFWLENBSHVCO2NBSXZCO2FBQ0Qsd0JBREM7YUFFRDtZQUNELG9FQURDO2lCQUVJO0lBSkg7ZUFNQztjQUNEO2VBQ0M7S0FGQTtrQkFJRztjQUNKOztJQVhBO2FBY0Q7O0VBOUllOztxQ0FrSlM7V0FDMUIsd0JBRDBCO2lCQUVwQixtTkFGb0I7Y0FHdkIsQ0FBQyxPQUFELEVBQVUsU0FBVixDQUh1QjtjQUl2QjtlQUNDO2tCQUNHO2NBQ0o7O0lBSEE7YUFNRjtZQUNBO0lBUEU7YUFTRDs7RUEvSmU7O3lDQW1LYTtXQUM5QixpQ0FEOEI7aUJBRXhCLGlHQUZ3QjtjQUczQixDQUFDLE9BQUQsRUFBVSxTQUFWLENBSDJCO2NBSTNCO2FBQ0Qsd0JBREM7YUFFRDtZQUNEO0lBSEU7ZUFLQztrQkFDRztjQUNKO0tBRkM7Y0FJRDtvQkFDTTs7SUFWTjthQWFEOztFQXBMZTs7K0NBd0xtQjtXQUNwQyxtQ0FEb0M7aUJBRTlCLHdHQUY4QjtjQUdqQyxDQUFDLE9BQUQsRUFBVSxTQUFWLENBSGlDO2NBSWpDO2FBQ0QsdUJBREM7YUFFRDtZQUNELHVFQURDO2lCQUVJO0lBSkg7ZUFNQztjQUNEO2VBQ0M7S0FGQTtrQkFJRztjQUNKO0tBTEM7Y0FPRDthQUNELG1CQURDO2NBRUEsRUFBRSxVQUFVLENBQUMsQ0FBYixFQUZBO1lBR0YsMENBSEU7NEJBSWM7ZUFDYixVQURhO3FCQUVQO01BTlA7bUJBUUs7Y0FDTCxlQURLO2VBRUosR0FGSTtrQkFHRDs7O0lBeEJKO1lBNEJGO1dBQ0Q7SUE3Qkc7YUErQkQ7O0VBM05lOzttREErTnVCO1dBQ3hDLHdDQUR3QztpQkFFbEMsNGJBRmtDO2NBR3JDLENBQUMsT0FBRCxFQUFVLFNBQVYsQ0FIcUM7Y0FJckM7YUFDRCx1QkFEQzthQUVEO1lBQ0QsZ0JBREM7V0FFRjtJQUpHO2VBTUM7YUFDRixXQURFO2NBRUQ7cUJBQ087S0FITjtjQUtEO2VBQ0M7S0FOQTtrQkFRRzthQUNMLG1CQURLO2VBRUgsVUFGRztjQUdKO0tBWEM7Y0FhRDtvQkFDTSxjQUROO2NBRUE7eUJBQ1c7O0tBaEJWO2tCQW1CRzthQUNMLFlBREs7Y0FFSixjQUZJO2lCQUdEOztJQTVCSDthQStCRCw4QkEvQkM7Z0JBZ0NFO1lBQ0osdUJBREk7Z0JBRUEsTUFGQTtjQUdGOzs7RUF0UWM7O3dDQTJRWTtXQUM3QixrQ0FENkI7aUJBRXZCLHNIQUZ1QjtjQUcxQixDQUFDLE9BQUQsRUFBVSxTQUFWLENBSDBCO2NBSTFCO2FBQ0QsdUJBREM7YUFFRDtZQUNGLDBFQURFO2lCQUVJO0lBSkg7ZUFNQztjQUNEO2NBQ0E7S0FGQztrQkFJRztjQUNKO0tBTEM7Y0FPRDtvQkFDTTtLQVJMO2NBVUQ7b0JBQ007O0lBakJOO2FBb0JEOztFQW5TZTs7b0NBdVNRO1dBQ3pCLCtDQUR5QjtpQkFFbkIsNEZBRm1CO2NBR3RCLENBQUMsT0FBRCxFQUFVLFNBQVYsQ0FIc0I7Y0FJdEI7YUFDRCx1QkFEQzthQUVEO1lBQ0QsOEdBREM7aUJBRUk7SUFKSDtlQU1DO2tCQUNHO2NBQ0o7O0lBUkE7YUFXRDs7O0NBdFROOztBQ0dRLFNBQVNDLE1BQVQsR0FBa0I7O0tBRTVCdmMsS0FBSixFQUNDQyxPQURELEVBRUNDLE1BRkQsRUFHQ0MsS0FIRCxFQUdRQyxNQUhSLEVBSUNDLE1BSkQsRUFLQ0MsR0FMRCxFQUtNQyxDQUxOLEVBS1NDLENBTFQsRUFLWUUsS0FMWixFQU1DbUUsTUFORCxFQU1TQyxNQU5ULEVBTWlCakUsVUFOakIsRUFPQ0UsYUFQRCxFQU9hQyxlQVBiLEVBTzhCQyxjQVA5QixFQVFDL0UsUUFSRCxFQVFXZ0YsYUFSWCxFQVEwQkMsWUFSMUIsRUFTQ0MsaUJBVEQsRUFTb0JDLGtCQVRwQixFQVVDQyxrQkFWRCxFQVVxQkMsZ0JBVnJCLEVBWUMrQixLQVpELEVBYUNrWixRQWJELEVBY0NDLGdCQWRELEVBZUNqYixVQWZELEVBZ0JDa2IsTUFoQkQ7O1VBa0JTcmdCLFFBQVQsQ0FBa0JDLFNBQWxCLEVBQTZCOzs7a0JBR2Z5RSxpQkFBYyxVQUFTckUsQ0FBVCxFQUFZO1VBQVNBLEVBQUVpRixRQUFGLENBQVcsQ0FBWCxDQUFQO0dBQXpDO29CQUNrQlgsbUJBQW1CLFVBQVN0RSxDQUFULEVBQVk7VUFBU0EsRUFBRWlGLFFBQUYsQ0FBVyxDQUFYLENBQVA7R0FBbkQ7bUJBQ2lCVixrQkFBa0IsVUFBU3ZFLENBQVQsRUFBWTtVQUFTQSxFQUFFaUYsUUFBRixDQUFXLENBQVgsQ0FBUDtHQUFqRDs7YUFFV3pGLFlBQVksWUFBVztVQUFTSyxTQUFQO0dBQXBDO2tCQUNnQjJFLGlCQUFpQixZQUFXO1VBQVMzRSxTQUFQO0dBQTlDO2lCQUNlNEUsZ0JBQWdCLFlBQVc7VUFBUzVFLFNBQVA7R0FBNUM7O3NCQUVvQjZFLHFCQUFxQixZQUFXO1VBQVM3RSxTQUFQO0dBQXREO3VCQUNxQjhFLHNCQUFzQixZQUFXO1VBQVM5RSxTQUFQO0dBQXhEOzt1QkFFcUIrRSxzQkFBc0IsWUFBVztVQUFTL0UsU0FBUDtHQUF4RDtxQkFDbUJnRixvQkFBb0IsWUFBVztVQUFTaEYsU0FBUDtHQUFwRDs7WUFFVTBELFdBQVcsUUFBckI7O2FBRVd1YyxZQUFZLE1BQXZCO3FCQUNtQkMsb0JBQW9CLEVBQXZDO1dBQ1NwUSxPQUFPLEVBQUVsTSxPQUFPLEVBQVQsRUFBYUMsUUFBUSxFQUFyQixFQUF5QjBILFNBQVMsSUFBbEMsRUFBUCxFQUFpRDRVLE1BQWpELENBQVQ7O1lBRVVsZ0IsSUFBVixDQUFlLFVBQVNrQixJQUFULEVBQWU7O09BRXpCa0UsSUFBSXZGLFNBQVN3RixZQUFULEVBQVI7T0FDQy9DLFlBQVMwQyxhQUFhN0UsU0FBQSxDQUFVNkUsVUFBVixDQUFiLEdBQXFDLFVBQVNyRSxDQUFULEVBQVk7V0FBU0EsQ0FBUDtJQUQ3RDs7T0FHSTJGLE9BQU9uRyxTQUFBLENBQVUsSUFBVixDQUFYOzs7T0FHSW9HLElBQUlELEtBQUtFLE1BQUwsQ0FBWSxHQUFaLENBQVI7O09BRUdELEVBQUVFLEtBQUYsRUFBSCxFQUFjO1FBQ1RILEtBQUtJLE1BQUwsQ0FBWSxHQUFaLEVBQ0ZDLElBREUsQ0FDRyxPQURILEVBQ1lsRCxPQURaLEVBRUZrRCxJQUZFLENBRUcsV0FGSCxFQUVnQixZQUFXO2FBQ3RCcVosUUFBUDs7V0FFSyxPQUFMO2NBQ1EsZ0JBQWdCNWEsSUFBSThhLE9BQU92YyxLQUEzQixJQUFvQyxNQUEzQzs7O2NBR081RCxTQUFQOztLQVRDLENBQUo7O01BYUUyRyxNQUFGLENBQVMsTUFBVCxFQUNFQyxJQURGLENBQ08sT0FEUCxFQUNnQixPQURoQixFQUVFQyxLQUZGLENBRVEsYUFGUixFQUV1Qm9aLGFBQWEsTUFBYixHQUFzQixPQUF0QixHQUFnQyxLQUZ2RCxFQUdFclosSUFIRixDQUdPLElBSFAsRUFHYSxRQUhiLEVBSUV4QyxJQUpGLENBSU8yQyxVQUFVLFVBQVYsR0FBdUJBLE1BQU01RixJQUFOLENBQXZCLEdBQXFDNEYsS0FKNUM7OztXQU9NekMsV0FBVzhiLFFBQVgsRUFBUDs7U0FFS2hnQixpQkFBQSxHQUFvQmdnQixRQUFwQixFQUFMO1VBQ001WixDQUFMLEVBQVEsV0FBUixFQUFxQixDQUFDcEcsTUFBQSxDQUFPa0UsV0FBV2pDLE1BQVgsRUFBUCxJQUE0QixDQUE3QixFQUFnQzBTLE1BQWhDLENBQXVDelEsV0FBV2pDLE1BQVgsRUFBdkMsQ0FBckI7OztTQUdJakMsa0JBQUEsR0FBcUJnZ0IsUUFBckIsRUFBTDtTQUNLQyxPQUFPLENBQUMvYixXQUFXakMsTUFBWCxHQUFvQixDQUFwQixJQUF5QmlDLFdBQVdqQyxNQUFYLEdBQW9CLENBQXBCLENBQTFCLEtBQXFENmQsbUJBQWlCLENBQXRFLENBQVg7U0FDQ3RFLFNBQVMsRUFEVjs7VUFHSSxJQUFJaFosSUFBSSxDQUFaLEVBQWVBLElBQUlzZCxnQkFBbkIsRUFBcUN0ZCxHQUFyQyxFQUEwQztlQUNoQ2daLE9BQU83RyxNQUFQLENBQWN6USxXQUFXakMsTUFBWCxHQUFvQixDQUFwQixJQUF5Qk8sSUFBSXlkLElBQTNDLENBQVQ7OztVQUdJN1osQ0FBTCxFQUFRLFlBQVIsRUFBc0JvVixNQUF0Qjs7OztVQUlLcFYsQ0FBTCxFQUFRLFNBQVIsRUFBbUJsQyxXQUFXakMsTUFBWCxFQUFuQjs7O1lBR1FpZSxJQUFULENBQWM5WixDQUFkLEVBQWlCeU4sSUFBakIsRUFBdUIySCxNQUF2QixFQUErQjs7O01BRzVCblYsTUFBRixDQUFTLFlBQVQsRUFDRUcsSUFERixDQUNPLFdBRFAsRUFDb0IsZ0JBQ2ZxWixhQUFhLE1BQWIsR0FBc0IsRUFBdEIsR0FBMkIsQ0FBQyxFQURiLElBRWhCLElBRmdCLEdBRVJyRSxPQUFPbmIsTUFBUCxHQUFnQjBmLE9BQU90YyxNQUF2QixHQUFnQ3NjLE9BQU81VSxPQUYvQixHQUUwQyxHQUg5RDs7UUFLSWdWLE9BQU8vWixFQUFFUSxTQUFGLENBQVksT0FBWixDQUFYOztRQUVJd1osWUFBWUQsS0FBS3BmLElBQUwsQ0FBVXlhLE1BQVYsRUFDZDNVLEtBRGMsR0FDTk4sTUFETSxDQUNDLEdBREQsRUFFYkMsSUFGYSxDQUVSLE9BRlEsRUFFQyxNQUZELEVBR2JBLElBSGEsQ0FHUixXQUhRLEVBR0ssVUFBU2hHLENBQVQsRUFBWWdDLENBQVosRUFBZTtZQUFTLGtCQUFtQkEsSUFBSXVkLE9BQU90YyxNQUFYLEdBQW9Cc2MsT0FBTzVVLE9BQTlDLEdBQXlELEdBQWhFO0tBSHRCLENBQWhCOztjQUtVNUUsTUFBVixDQUFpQixNQUFqQixFQUNFQyxJQURGLENBQ08sT0FEUCxFQUNnQixRQURoQixFQUVFQSxJQUZGLENBRU8sT0FGUCxFQUVnQnVaLE9BQU92YyxLQUZ2QixFQUdFZ0QsSUFIRixDQUdPLFFBSFAsRUFHaUJ1WixPQUFPdGMsTUFIeEI7O2NBS1U4QyxNQUFWLENBQWlCLE1BQWpCLEVBQ0VDLElBREYsQ0FDTyxXQURQLEVBQ29CLFlBQVc7YUFDdEJxWixRQUFQOztXQUVLLE9BQUw7Y0FDUSxvQkFBcUIsTUFBTUUsT0FBT3RjLE1BQWxDLEdBQTRDLEdBQW5EOzs7Y0FHTyxnQkFBZ0JzYyxPQUFPdmMsS0FBUCxHQUFlLEVBQS9CLElBQXFDLElBQXJDLEdBQTZDLE1BQU11YyxPQUFPdGMsTUFBMUQsR0FBb0UsR0FBM0U7O0tBUkgsRUFXRStDLElBWEYsQ0FXTyxJQVhQLEVBV2EsUUFYYixFQVlFQyxLQVpGLENBWVEsYUFaUixFQVl1QixZQUFXO2FBQ3pCb1osUUFBUDs7V0FFSyxPQUFMO2NBQ1EsS0FBUDs7O2NBR08sT0FBUDs7S0FuQkg7O2NBdUJVOVksS0FBVixDQUFnQm9aLElBQWhCLEVBQXNCOVosTUFBdEIsQ0FBNkIsTUFBN0IsRUFDRWpDLFVBREYsR0FDZXRFLElBRGYsQ0FDb0JzRSxhQURwQixFQUVHcUMsS0FGSCxDQUVTLE1BRlQsRUFFaUIsVUFBU2pHLENBQVQsRUFBWTtZQUFTMEQsV0FBVzFELENBQVgsQ0FBUDtLQUYvQjs7Y0FJVXVHLEtBQVYsQ0FBZ0JvWixJQUFoQixFQUFzQjlaLE1BQXRCLENBQTZCLE1BQTdCLEVBQ0VyQyxJQURGLENBQ08sVUFBVXhELENBQVYsRUFBYWdDLENBQWIsRUFBZ0I7O2FBRWRxUixJQUFQOztXQUVLLFdBQUw7V0FDSXJSLE1BQU0sQ0FBVCxFQUFZLE9BQU8sTUFBTUwsVUFBT3FaLE9BQU8sQ0FBUCxDQUFQLENBQWI7V0FDVGhaLE1BQU1nWixPQUFPbmIsTUFBUCxHQUFnQixDQUF6QixFQUE0QixPQUFPLE1BQU04QixVQUFPM0IsQ0FBUCxDQUFiO2NBQ3JCMkIsVUFBT3FaLE9BQU9oWixDQUFQLENBQVAsSUFBb0IsR0FBcEIsR0FBMEJMLFVBQU9xWixPQUFPaFosSUFBSSxDQUFYLENBQVAsQ0FBakM7OztjQUdPTCxVQUFPM0IsQ0FBUCxDQUFQOztLQVhIOztTQWVLK0csSUFBTCxHQUNFbkQsVUFERixHQUNldEUsSUFEZixDQUNvQndFLGNBRHBCLEVBRUdtQyxLQUZILENBRVMsTUFGVCxFQUVpQixhQUZqQixFQUdHZSxNQUhIOztHQWxIRjs7O1VBMEhRbkUsS0FBVCxHQUFpQixVQUFTbEQsQ0FBVCxFQUFZO1NBQ3JCQyxVQUFVQyxNQUFWLElBQW9CZ0QsUUFBUWxELENBQVIsRUFBV1QsUUFBL0IsSUFBMkMyRCxTQUFTLEVBQTNEO0VBREQ7O1VBSVNDLE9BQVQsR0FBbUIsVUFBU25ELENBQVQsRUFBWTtTQUN2QkMsVUFBVUMsTUFBVixJQUFvQmlELFVBQVVuRCxDQUFWLEVBQWFULFFBQWpDLElBQTZDNEQsT0FBcEQ7RUFERDs7VUFJU0MsTUFBVCxHQUFrQixVQUFTcEQsQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9Ca0QsU0FBU3BELENBQVQsRUFBWVQsUUFBaEMsSUFBNEM2RCxNQUFuRDtFQUREOztVQUlTQyxLQUFULEdBQWlCLFVBQVNyRCxDQUFULEVBQVk7U0FDckJDLFVBQVVDLE1BQVYsSUFBb0JtRCxRQUFRckQsQ0FBUixFQUFXVCxRQUEvQixJQUEyQzhELEtBQWxEO0VBREQ7O1VBSVNDLE1BQVQsR0FBa0IsVUFBU3RELENBQVQsRUFBWTtTQUN0QkMsVUFBVUMsTUFBVixJQUFvQm9ELFNBQVN0RCxDQUFULEVBQVlULFFBQWhDLElBQTRDK0QsTUFBbkQ7RUFERDs7VUFJU0MsTUFBVCxHQUFrQixVQUFTdkQsQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9CcUQsU0FBU3ZELENBQVQsRUFBWVQsUUFBaEMsSUFBNENnRSxNQUFuRDtFQUREOztVQUlTd0IsWUFBVCxHQUF3QixZQUFXO1NBQzNCMUIsUUFBUUUsT0FBT2lFLEtBQWYsR0FBdUJqRSxPQUFPa0UsSUFBckM7RUFERDs7VUFJU3hDLGFBQVQsR0FBeUIsWUFBVztTQUM1QjNCLFNBQVNDLE9BQU9tRSxHQUFoQixHQUFzQm5FLE9BQU9vRSxNQUFwQztFQUREOztVQUlTbkUsR0FBVCxHQUFlLFVBQVN4RCxDQUFULEVBQVk7U0FDbkJDLFVBQVVDLE1BQVYsSUFBb0JzRCxNQUFNeEQsQ0FBTixFQUFTVCxRQUE3QixJQUF5Q2lFLEdBQWhEO0VBREQ7O1VBSVNDLENBQVQsR0FBYSxVQUFTekQsQ0FBVCxFQUFZO1NBQ2pCQyxVQUFVQyxNQUFWLElBQW9CdUQsSUFBSXpELENBQUosRUFBT1QsUUFBM0IsSUFBdUNrRSxDQUE5QztFQUREOztVQUlTQyxDQUFULEdBQWEsVUFBUzFELENBQVQsRUFBWTtTQUNqQkMsVUFBVUMsTUFBVixJQUFvQndELElBQUkxRCxDQUFKLEVBQU9ULFFBQTNCLElBQXVDbUUsQ0FBOUM7RUFERDs7VUFJU0UsS0FBVCxHQUFpQixVQUFTNUQsQ0FBVCxFQUFZO1NBQ3JCQyxVQUFVQyxNQUFWLElBQW9CMEQsUUFBUTVELENBQVIsRUFBV1QsUUFBL0IsSUFBMkNxRSxLQUFsRDtFQUREOztVQUlTbUUsTUFBVCxHQUFrQixVQUFTL0gsQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9CNkgsU0FBUy9ILENBQVQsRUFBWVQsUUFBaEMsSUFBNEN3SSxNQUFuRDtFQUREOztVQUlTQyxNQUFULEdBQWtCLFVBQVNoSSxDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0I4SCxTQUFTaEksQ0FBVCxFQUFZVCxRQUFoQyxJQUE0Q3lJLE1BQW5EO0VBREQ7O1VBSVNqRSxVQUFULEdBQXNCLFVBQVMvRCxDQUFULEVBQVk7U0FDMUJDLFVBQVVDLE1BQVYsSUFBb0I2RCxhQUFhL0QsQ0FBYixFQUFnQlQsUUFBcEMsSUFBZ0R3RSxVQUF2RDtFQUREOztVQUlTRSxVQUFULEdBQXNCLFVBQVNqRSxDQUFULEVBQVk7U0FDMUJDLFVBQVVDLE1BQVYsSUFBb0IrRCxnQkFBYWpFLENBQWIsRUFBZ0JULFFBQXBDLElBQWdEMEUsYUFBdkQ7RUFERDs7VUFJU0MsZUFBVCxHQUEyQixVQUFTbEUsQ0FBVCxFQUFZO1NBQy9CQyxVQUFVQyxNQUFWLElBQW9CZ0Usa0JBQWtCbEUsQ0FBbEIsRUFBcUJULFFBQXpDLElBQXFEMkUsZUFBNUQ7RUFERDs7VUFJU0MsY0FBVCxHQUEwQixVQUFTbkUsQ0FBVCxFQUFZO1NBQzlCQyxVQUFVQyxNQUFWLElBQW9CaUUsaUJBQWlCbkUsQ0FBakIsRUFBb0JULFFBQXhDLElBQW9ENEUsY0FBM0Q7RUFERDs7VUFJUy9FLFFBQVQsR0FBb0IsVUFBU1ksQ0FBVCxFQUFZO1NBQ3hCQyxVQUFVQyxNQUFWLElBQW9CZCxXQUFXWSxDQUFYLEVBQWNULFFBQWxDLElBQThDSCxRQUFyRDtFQUREOztVQUlTZ0YsYUFBVCxHQUF5QixVQUFTcEUsQ0FBVCxFQUFZO1NBQzdCQyxVQUFVQyxNQUFWLElBQW9Ca0UsZ0JBQWdCcEUsQ0FBaEIsRUFBbUJULFFBQXZDLElBQW1ENkUsYUFBMUQ7RUFERDs7VUFJU0MsWUFBVCxHQUF3QixVQUFTckUsQ0FBVCxFQUFZO1NBQzVCQyxVQUFVQyxNQUFWLElBQW9CbUUsZUFBZXJFLENBQWYsRUFBa0JULFFBQXRDLElBQWtEOEUsWUFBekQ7RUFERDs7VUFJU0MsaUJBQVQsR0FBNkIsVUFBU3RFLENBQVQsRUFBWTtTQUNqQ0MsVUFBVUMsTUFBVixJQUFvQm9FLG9CQUFvQnRFLENBQXBCLEVBQXVCVCxRQUEzQyxJQUF1RCtFLGlCQUE5RDtFQUREOztVQUlTQyxrQkFBVCxHQUE4QixVQUFTdkUsQ0FBVCxFQUFZO1NBQ2xDQyxVQUFVQyxNQUFWLElBQW9CcUUscUJBQXFCdkUsQ0FBckIsRUFBd0JULFFBQTVDLElBQXdEZ0Ysa0JBQS9EO0VBREQ7O1VBSVNDLGtCQUFULEdBQThCLFVBQVN4RSxDQUFULEVBQVk7U0FDbENDLFVBQVVDLE1BQVYsSUFBb0JzRSxxQkFBcUJ4RSxDQUFyQixFQUF3QlQsUUFBNUMsSUFBd0RpRixrQkFBL0Q7RUFERDs7VUFJU0MsZ0JBQVQsR0FBNEIsVUFBU3pFLENBQVQsRUFBWTtTQUNoQ0MsVUFBVUMsTUFBVixJQUFvQnVFLG1CQUFtQnpFLENBQW5CLEVBQXNCVCxRQUExQyxJQUFzRGtGLGdCQUE3RDtFQUREOztVQUlTK0IsS0FBVCxHQUFpQixVQUFTeEcsQ0FBVCxFQUFZO1NBQ3JCQyxVQUFVQyxNQUFWLElBQW9Cc0csUUFBUXhHLENBQVIsRUFBV1QsUUFBL0IsSUFBMkNpSCxLQUFsRDtFQUREOztVQUlTa1osUUFBVCxHQUFvQixVQUFTMWYsQ0FBVCxFQUFZO1NBQ3hCQyxVQUFVQyxNQUFWLElBQW9Cd2YsV0FBVzFmLENBQVgsRUFBY1QsUUFBbEMsSUFBOENtZ0IsUUFBckQ7RUFERDs7VUFJU0MsZ0JBQVQsR0FBNEIsVUFBUzNmLENBQVQsRUFBWTtTQUNoQ0MsVUFBVUMsTUFBVixJQUFvQnlmLG1CQUFtQjNmLENBQW5CLEVBQXNCVCxRQUExQyxJQUFzRG9nQixnQkFBN0Q7RUFERDs7VUFJU2piLFVBQVQsR0FBc0IsVUFBUzFFLENBQVQsRUFBWTtTQUMxQkMsVUFBVUMsTUFBVixJQUFvQndFLGFBQWExRSxDQUFiLEVBQWdCVCxRQUFwQyxJQUFnRG1GLFVBQXZEO0VBREQ7O1VBSVNrYixNQUFULEdBQWtCLFVBQVM1ZixDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0IwZixTQUFTNWYsQ0FBVCxFQUFZVCxRQUFoQyxJQUE0Q3FnQixNQUFuRDtFQUREOztRQUlPcmdCLFFBQVA7OztBQzlSYyxTQUFTMmdCLE1BQVQsR0FBZ0I7O0tBRTFCaGQsS0FBSixFQUNDQyxPQURELEVBRUNDLE1BRkQsRUFHQ0ksR0FIRCxFQUdNQyxDQUhOLEVBR1NDLENBSFQsRUFHWUUsS0FIWixFQUlDbUUsTUFKRCxFQUlTQyxNQUpULEVBSWlCakUsVUFKakIsRUFLQ0UsYUFMRCxFQUthQyxlQUxiLEVBSzhCQyxjQUw5QixFQU1DL0UsUUFORCxFQU1XZ0YsYUFOWCxFQU0wQkMsWUFOMUIsRUFRQzZiLE9BUkQsRUFTQ0MsV0FURCxFQVNjaFcsZUFUZCxFQVVDM0QsS0FWRDs7VUFZU2pILFFBQVQsQ0FBa0JDLFNBQWxCLEVBQTZCOzs7WUFHbEIyRCxXQUFXLE1BQXJCOztrQkFFYWMsaUJBQWMsVUFBU3JFLENBQVQsRUFBWTtVQUFTQSxFQUFFaUYsUUFBRixDQUFXLENBQVgsQ0FBUDtHQUF6QztvQkFDa0JYLG1CQUFtQixVQUFTdEUsQ0FBVCxFQUFZO1VBQVNBLEVBQUVpRixRQUFGLENBQVcsQ0FBWCxDQUFQO0dBQW5EO21CQUNpQlYsa0JBQWtCLFVBQVN2RSxDQUFULEVBQVk7VUFBU0EsRUFBRWlGLFFBQUYsQ0FBVyxDQUFYLENBQVA7R0FBakQ7O2FBRVd6RixZQUFZLFlBQVc7VUFBU0ssU0FBUDtHQUFwQztrQkFDZ0IyRSxpQkFBaUIsWUFBVztVQUFTM0UsU0FBUDtHQUE5QztpQkFDZTRFLGdCQUFnQixZQUFXO1VBQVM1RSxTQUFQO0dBQTVDOzs7V0FHUzRNLGNBQVQsQ0FBd0JoTSxDQUF4QixFQUEyQjtVQUNuQjBILE9BQU90RSxFQUFFcEQsQ0FBRixDQUFQLEtBQWdCMEgsT0FBTzRDLFNBQVAsR0FBbUI1QyxPQUFPNEMsU0FBUCxLQUFtQixDQUF0QyxHQUEwQyxDQUExRCxDQUFQOzs7V0FHUTJCLGNBQVQsQ0FBd0JqTSxDQUF4QixFQUEyQjtVQUNuQjJILE9BQU90RSxFQUFFckQsQ0FBRixDQUFQLEtBQWdCMkgsT0FBTzJDLFNBQVAsR0FBbUIzQyxPQUFPMkMsU0FBUCxLQUFtQixDQUF0QyxHQUEwQyxDQUExRCxDQUFQOzs7WUFHTXVWLFdBQVFyZ0IsT0FBQSxFQUFmOztZQUVVSCxJQUFWLENBQWUsVUFBU2tCLElBQVQsRUFBZTs7V0FFckI0RixTQUFTLFlBQVc7V0FBUyxFQUFQO0lBQTlCOztXQUdFL0MsQ0FERixDQUNJNEksY0FESixFQUVFM0ksQ0FGRixDQUVJNEksY0FGSjs7T0FJSThULFlBQVl4ZixLQUFLQSxLQUFLVixNQUFMLEdBQWMsQ0FBbkIsQ0FBaEI7OztPQUdJb0gsUUFBUXpILFNBQUEsQ0FBVSxJQUFWLEVBQWdCNEcsU0FBaEIsQ0FBMEIsTUFBTXRELFFBQVFzSCxPQUFSLENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLENBQWhDLEVBQTJEN0osSUFBM0QsQ0FBZ0UsQ0FBQyxDQUFELENBQWhFLEVBQ1R5RixJQURTLENBQ0osT0FESSxFQUNLbEQsVUFBVSxTQURmLENBQVo7T0FHQ29ELFNBQVMxRyxTQUFBLENBQVUsSUFBVixFQUFnQjRHLFNBQWhCLENBQTBCLFFBQTFCLEVBQW9DN0YsSUFBcEMsQ0FBeUMsQ0FBQyxDQUFELENBQXpDLEVBQ1B5RixJQURPLENBQ0YsT0FERSxFQUNPLGNBRFAsQ0FIVjs7O1NBT01LLEtBQU4sR0FBY04sTUFBZCxDQUFxQixNQUFyQixFQUNFQyxJQURGLENBQ08sT0FEUCxFQUNnQmxELFVBQVUsUUFEMUIsRUFFRW1ELEtBRkYsQ0FFUSxRQUZSLEVBRWtCLFlBQVc7V0FDcEJ2QyxXQUFXSCxNQUFNaEQsSUFBTixDQUFYLENBQVA7SUFIRixFQUtFMEYsS0FMRixDQUtRLGNBTFIsRUFLd0I2WixXQUx4QixFQU1FN1osS0FORixDQU1RLGtCQU5SLEVBTTRCNkQsZUFONUIsRUFPRTdELEtBUEYsQ0FPUSxNQVBSLEVBT2dCLE1BUGhCLEVBUUVNLEtBUkYsQ0FRUVUsS0FSUjtJQVNHdEcsS0FUSCxDQVNTSixJQVRULEVBVUdxRCxVQVZILEdBVWdCdEUsSUFWaEIsQ0FVcUJzRSxhQVZyQixFQVdJb0MsSUFYSixDQVdTLEdBWFQsRUFXYzZaLE9BWGQsRUFZSXZaLEVBWkosQ0FZTyxLQVpQLEVBWWMsWUFBVztXQUNkOUcsU0FBQSxDQUFVLElBQVYsRUFBZ0JGLElBQWhCLENBQXFCUCxRQUFyQixDQUFQO0lBYko7O1VBZ0JPc0gsS0FBUCxHQUFlTixNQUFmLENBQXNCLE1BQXRCLEVBQ0VDLElBREYsQ0FDTyxPQURQLEVBQ2dCLGFBRGhCLEVBRUV4QyxJQUZGLENBRU8sT0FBTzJDLEtBQVAsS0FBaUIsVUFBakIsR0FBOEJBLE1BQU01RixJQUFOLENBQTlCLEdBQTRDNEYsS0FGbkQsRUFHRUksS0FIRixDQUdRTCxNQUhSO0lBSUdGLElBSkgsQ0FJUSxHQUpSLEVBSWEwQixPQUFPdEUsRUFBRTJjLFNBQUYsQ0FBUCxDQUpiLEVBS0cvWixJQUxILENBS1EsSUFMUixFQUtjLFFBTGQsRUFNR0EsSUFOSCxDQU1RLElBTlIsRUFNYyxRQU5kLEVBT0dwQyxVQVBILEdBT2dCdEUsSUFQaEIsQ0FPcUJzRSxhQVByQixFQVFJb0MsSUFSSixDQVFTLEdBUlQsRUFRYzJCLE9BQU90RSxFQUFFMGMsU0FBRixDQUFQLENBUmQsRUFTSTlaLEtBVEosQ0FTVSxNQVRWLEVBU2tCLFlBQVc7V0FDbEJ2QyxXQUFXSCxNQUFNaEQsSUFBTixDQUFYLENBQVA7SUFWSjs7O1NBY013RyxJQUFOLEdBQ0VmLElBREYsQ0FDTyxPQURQLEVBQ2dCbEQsVUFBVSxPQUQxQixFQUVFYyxVQUZGLEdBRWV0RSxJQUZmLENBRW9Cd0UsY0FGcEIsRUFHR3dDLEVBSEgsQ0FHTSxLQUhOLEVBR2EsWUFBVzthQUNyQixDQUFVLElBQVYsRUFBZ0JoSCxJQUFoQixDQUFxQjBFLFlBQXJCO0lBSkgsRUFNR2dELE1BTkg7O1VBUU9ELElBQVAsR0FDRWYsSUFERixDQUNPLE9BRFAsRUFDZ0IsWUFEaEIsRUFFRXBDLFVBRkYsR0FFZXRFLElBRmYsQ0FFb0J3RSxjQUZwQixFQUdHbUMsS0FISCxDQUdTLFNBSFQsRUFHb0IsQ0FIcEIsRUFJR2UsTUFKSDtHQXhERDs7O1VBZ0VRbkUsS0FBVCxHQUFpQixVQUFTbEQsQ0FBVCxFQUFZO1NBQ3JCQyxVQUFVQyxNQUFWLElBQW9CZ0QsUUFBUWxELENBQVIsRUFBV1QsUUFBL0IsSUFBMkMyRCxTQUFTLEVBQTNEO0VBREQ7O1VBSVNDLE9BQVQsR0FBbUIsVUFBU25ELENBQVQsRUFBWTtTQUN2QkMsVUFBVUMsTUFBVixJQUFvQmlELFVBQVVuRCxDQUFWLEVBQWFULFFBQWpDLElBQTZDNEQsT0FBcEQ7RUFERDs7VUFJU0MsTUFBVCxHQUFrQixVQUFTcEQsQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9Ca0QsU0FBU3BELENBQVQsRUFBWVQsUUFBaEMsSUFBNEM2RCxNQUFuRDtFQUREOztVQUlTSSxHQUFULEdBQWUsVUFBU3hELENBQVQsRUFBWTtTQUNuQkMsVUFBVUMsTUFBVixJQUFvQnNELE1BQU14RCxDQUFOLEVBQVNULFFBQTdCLElBQXlDaUUsR0FBaEQ7RUFERDs7VUFJU0MsQ0FBVCxHQUFhLFVBQVN6RCxDQUFULEVBQVk7U0FDakJDLFVBQVVDLE1BQVYsSUFBb0J1RCxJQUFJekQsQ0FBSixFQUFPVCxRQUEzQixJQUF1Q2tFLENBQTlDO0VBREQ7O1VBSVNDLENBQVQsR0FBYSxVQUFTMUQsQ0FBVCxFQUFZO1NBQ2pCQyxVQUFVQyxNQUFWLElBQW9Cd0QsSUFBSTFELENBQUosRUFBT1QsUUFBM0IsSUFBdUNtRSxDQUE5QztFQUREOztVQUlTRSxLQUFULEdBQWlCLFVBQVM1RCxDQUFULEVBQVk7U0FDckJDLFVBQVVDLE1BQVYsSUFBb0IwRCxRQUFRNUQsQ0FBUixFQUFXVCxRQUEvQixJQUEyQ3FFLEtBQWxEO0VBREQ7O1VBSVNtRSxNQUFULEdBQWtCLFVBQVMvSCxDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0I2SCxTQUFTL0gsQ0FBVCxFQUFZVCxRQUFoQyxJQUE0Q3dJLE1BQW5EO0VBREQ7O1VBSVNDLE1BQVQsR0FBa0IsVUFBU2hJLENBQVQsRUFBWTtTQUN0QkMsVUFBVUMsTUFBVixJQUFvQjhILFNBQVNoSSxDQUFULEVBQVlULFFBQWhDLElBQTRDeUksTUFBbkQ7RUFERDs7VUFJU2pFLFVBQVQsR0FBc0IsVUFBUy9ELENBQVQsRUFBWTtTQUMxQkMsVUFBVUMsTUFBVixJQUFvQjZELGFBQWEvRCxDQUFiLEVBQWdCVCxRQUFwQyxJQUFnRHdFLFVBQXZEO0VBREQ7O1VBSVNFLFVBQVQsR0FBc0IsVUFBU2pFLENBQVQsRUFBWTtTQUMxQkMsVUFBVUMsTUFBVixJQUFvQitELGdCQUFhakUsQ0FBYixFQUFnQlQsUUFBcEMsSUFBZ0QwRSxhQUF2RDtFQUREOztVQUlTQyxlQUFULEdBQTJCLFVBQVNsRSxDQUFULEVBQVk7U0FDL0JDLFVBQVVDLE1BQVYsSUFBb0JnRSxrQkFBa0JsRSxDQUFsQixFQUFxQlQsUUFBekMsSUFBcUQyRSxlQUE1RDtFQUREOztVQUlTQyxjQUFULEdBQTBCLFVBQVNuRSxDQUFULEVBQVk7U0FDOUJDLFVBQVVDLE1BQVYsSUFBb0JpRSxpQkFBaUJuRSxDQUFqQixFQUFvQlQsUUFBeEMsSUFBb0Q0RSxjQUEzRDtFQUREOztVQUlTL0UsUUFBVCxHQUFvQixVQUFTWSxDQUFULEVBQVk7U0FDeEJDLFVBQVVDLE1BQVYsSUFBb0JkLFdBQVdZLENBQVgsRUFBY1QsUUFBbEMsSUFBOENILFFBQXJEO0VBREQ7O1VBSVNnRixhQUFULEdBQXlCLFVBQVNwRSxDQUFULEVBQVk7U0FDN0JDLFVBQVVDLE1BQVYsSUFBb0JrRSxnQkFBZ0JwRSxDQUFoQixFQUFtQlQsUUFBdkMsSUFBbUQ2RSxhQUExRDtFQUREOztVQUlTQyxZQUFULEdBQXdCLFVBQVNyRSxDQUFULEVBQVk7U0FDNUJDLFVBQVVDLE1BQVYsSUFBb0JtRSxlQUFlckUsQ0FBZixFQUFrQlQsUUFBdEMsSUFBa0Q4RSxZQUF6RDtFQUREOztVQUlTNmIsSUFBVCxHQUFnQixVQUFTbGdCLENBQVQsRUFBWTtTQUNwQkMsVUFBVUMsTUFBVixJQUFvQmdnQixVQUFPbGdCLENBQVAsRUFBVVQsUUFBOUIsSUFBMEMyZ0IsT0FBakQ7RUFERDs7VUFJU0MsV0FBVCxHQUF1QixVQUFTbmdCLENBQVQsRUFBWTtTQUMzQkMsVUFBVUMsTUFBVixJQUFvQmlnQixjQUFjbmdCLENBQWQsRUFBaUJULFFBQXJDLElBQWlENGdCLFdBQXhEO0VBREQ7O1VBSVNoVyxlQUFULEdBQTJCLFVBQVNuSyxDQUFULEVBQVk7U0FDL0JDLFVBQVVDLE1BQVYsSUFBb0JpSyxrQkFBa0JuSyxDQUFsQixFQUFxQlQsUUFBekMsSUFBcUQ0SyxlQUE1RDtFQUREOztVQUlTM0QsS0FBVCxHQUFpQixVQUFTeEcsQ0FBVCxFQUFZO1NBQ3JCQyxVQUFVQyxNQUFWLElBQW9Cc0csUUFBUXhHLENBQVIsRUFBV1QsUUFBL0IsSUFBMkNpSCxLQUFsRDtFQUREOztRQUlPakgsUUFBUDs7O0FDdExjLFNBQVM4Z0IsU0FBVCxHQUFxQjs7S0FFL0JuZCxLQUFKLEVBQ0NDLE9BREQsRUFFQ0UsS0FGRCxFQUVRQyxNQUZSLEVBR0NDLE1BSEQsRUFJQ0UsQ0FKRCxFQUlJQyxDQUpKLEVBSU9DLEVBSlAsRUFJV0MsS0FKWCxFQUlrQkMsSUFKbEIsRUFLQ0MsT0FMRCxFQU1DQyxVQU5ELEVBT0NDLE1BUEQsRUFRQ3FCLElBUkQsRUFTQ3BCLGFBVEQsRUFTYUMsZUFUYixFQVM4QkMsY0FUOUIsRUFVQy9FLFFBVkQsRUFVV2dGLGFBVlgsRUFVMEJDLFlBVjFCLEVBV0NDLGlCQVhELEVBV29CQyxrQkFYcEIsRUFZQ0Msa0JBWkQsRUFZcUJDLGdCQVpyQixFQWNDcUcsS0FkRCxFQWVDQyxPQWZEOztVQWlCU3hMLFFBQVQsQ0FBa0JDLFNBQWxCLEVBQTZCOzs7a0JBR2Z5RSxpQkFBYyxVQUFTckUsQ0FBVCxFQUFZO1VBQVNBLEVBQUVpRixRQUFGLENBQVcsQ0FBWCxDQUFQO0dBQXpDO29CQUNrQlgsbUJBQW1CLFVBQVN0RSxDQUFULEVBQVk7VUFBU0EsRUFBRWlGLFFBQUYsQ0FBVyxDQUFYLENBQVA7R0FBbkQ7bUJBQ2lCVixrQkFBa0IsVUFBU3ZFLENBQVQsRUFBWTtVQUFTQSxFQUFFaUYsUUFBRixDQUFXLENBQVgsQ0FBUDtHQUFqRDs7YUFFV3pGLFlBQVksWUFBVztVQUFTSyxTQUFQO0dBQXBDO2tCQUNnQjJFLGlCQUFpQixZQUFXO1VBQVMzRSxTQUFQO0dBQTlDO2lCQUNlNEUsZ0JBQWdCLFlBQVc7VUFBUzVFLFNBQVA7R0FBNUM7O3NCQUVvQjZFLHFCQUFxQixZQUFXO1VBQVM3RSxTQUFQO0dBQXREO3VCQUNxQjhFLHNCQUFzQixZQUFXO1VBQVM5RSxTQUFQO0dBQXhEOzt1QkFFcUIrRSxzQkFBc0IsWUFBVztVQUFTL0UsU0FBUDtHQUF4RDtxQkFDbUJnRixvQkFBb0IsWUFBVztVQUFTaEYsU0FBUDtHQUFwRDs7WUFFVTBELFdBQVcsV0FBckI7O1VBRVEySCxTQUFTLEVBQUVFLFNBQVMsR0FBWCxFQUFqQjtZQUNVRCxXQUFXLEVBQXJCOztNQUVJakcsSUFBSXZGLFNBQVN3RixZQUFULEVBQVI7TUFDQ0MsSUFBSXpGLFNBQVMwRixhQUFULEVBREw7TUFFQ2dHLFdBQVcvSSxLQUFLaUQsR0FBTCxDQUFTTCxDQUFULEVBQVlFLENBQVosQ0FGWjs7TUFJSTZGLFNBQVNoTCxPQUFBLEdBQ1hxTCxJQURXLENBQ04sQ0FBQ0QsUUFBRCxFQUFXQSxRQUFYLENBRE0sRUFFWEQsT0FGVyxDQUVIRixNQUFNRSxPQUFOLElBQWlCLEdBRmQsQ0FBYjs7WUFJVXRMLElBQVYsQ0FBZSxVQUFTa0IsSUFBVCxFQUFlOztPQUUxQixDQUFDQSxLQUFLdUssSUFBVCxFQUFlO1dBQ1AsRUFBRUEsTUFBTSxNQUFSLEVBQWdCQyxVQUFVeEssSUFBMUIsRUFBUDs7O09BR0d5SyxPQUFPeEwsWUFBQSxDQUFheUwsUUFBUTFLLElBQVIsQ0FBYixFQUNUMkssR0FEUyxDQUNMLFVBQVNsTCxDQUFULEVBQVk7V0FBU0EsRUFBRWlGLEtBQVQ7SUFEVCxFQUVURCxJQUZTLENBRUosVUFBU21HLENBQVQsRUFBWUMsQ0FBWixFQUFlO1dBQVNwRyxPQUFPQSxLQUFLbUcsRUFBRWxHLEtBQVAsRUFBY21HLEVBQUVuRyxLQUFoQixDQUFQLEdBQWdDLElBQXZDO0lBRmIsQ0FBWDs7VUFJTytGLElBQVA7O09BRUlyRixPQUFPbkcsU0FBQSxDQUFVLElBQVYsQ0FBWDs7O09BR0lvRyxJQUFJRCxLQUFLRSxNQUFMLENBQVksR0FBWixDQUFSO09BQ0dELEVBQUVFLEtBQUYsRUFBSCxFQUFjO1FBQ1RILEtBQUtJLE1BQUwsQ0FBWSxHQUFaLEVBQ0ZDLElBREUsQ0FDRyxXQURILEVBQ2dCLGdCQUFnQnZCLElBQUUsQ0FBRixHQUFNbUcsV0FBUyxDQUEvQixJQUFvQyxJQUFwQyxJQUE0Q2pHLElBQUUsQ0FBRixHQUFNaUcsV0FBUyxDQUEzRCxJQUFnRSxHQURoRixDQUFKOzs7O09BS0VoRixFQUFFQyxNQUFGLENBQVMsUUFBVCxFQUFtQkMsS0FBbkIsRUFBSCxFQUErQjtNQUM1QkMsTUFBRixDQUFTLE1BQVQsRUFDRUMsSUFERixDQUNPLE9BRFAsRUFDZ0IsT0FEaEIsRUFFRUEsSUFGRixDQUVPLFdBRlAsRUFFb0IsZUFBZTRFLFFBQWYsR0FBMEIsR0FBMUIsR0FBZ0NqRyxDQUFoQyxHQUFvQyxHQUZ4RCxFQUdFc0IsS0FIRixDQUdRLGFBSFIsRUFHdUIsS0FIdkIsRUFJRXpDLElBSkYsQ0FJTyxZQUFXO1lBQ1QsT0FBT0csTUFBUCxLQUFrQixVQUFsQixHQUErQkEsT0FBT3BELEtBQUt3SyxRQUFaLENBQS9CLEdBQXVEcEgsTUFBOUQ7S0FMRjs7OztPQVVHMEgsVUFBVXpGLEVBQUVRLFNBQUYsQ0FBWSxNQUFNdEQsUUFBUXNILE9BQVIsQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsQ0FBbEIsRUFDWjdKLElBRFksQ0FDUHlLLEtBQUtELFFBREUsRUFDUSxVQUFTL0ssQ0FBVCxFQUFZO1dBQVNBLEVBQUVPLElBQUYsQ0FBTytLLFdBQVAsR0FBcUIsR0FBckIsR0FBMkJ0TCxFQUFFTyxJQUFGLENBQU9nTCxTQUF6QztJQUR0QixFQUVYdkYsSUFGVyxDQUVOLE9BRk0sRUFFR2xELFVBQVUsU0FGYixDQUFkOzs7V0FLUXVELEtBQVIsR0FDRU4sTUFERixDQUNTLE1BRFQsRUFFR0MsSUFGSCxDQUVRLE9BRlIsRUFFaUJsRCxVQUFVLFFBRjNCLEVBR0drRCxJQUhILENBR1EsV0FIUixFQUdxQixVQUFTaEcsQ0FBVCxFQUFZO1dBQVMsZUFBZUEsRUFBRW9ELENBQWpCLEdBQXFCLEdBQXJCLEdBQTJCcEQsRUFBRXFELENBQTdCLEdBQWlDLEdBQXhDO0lBSG5DLEVBSUcyQyxJQUpILENBSVEsSUFKUixFQUljLFFBSmQsRUFLR3hDLElBTEgsQ0FLUSxVQUFTeEQsQ0FBVCxFQUFZO1dBQVN3RCxLQUFLeEQsRUFBRU8sSUFBRixDQUFPQSxJQUFaLENBQVA7SUFMdEIsRUFNRzBGLEtBTkgsQ0FNUyxXQU5ULEVBTXNCLEtBTnRCLEVBT0dBLEtBUEgsQ0FPUyxhQVBULEVBT3dCLFFBUHhCLEVBUUdBLEtBUkgsQ0FRUyxNQVJULEVBUWlCLFVBQVNqRyxDQUFULEVBQVk7V0FBUzBELFdBQVdILE1BQU12RCxFQUFFTyxJQUFGLENBQU9BLElBQWIsQ0FBWCxDQUFQO0lBUi9CLEVBU0crRixFQVRILENBU00sV0FUTixFQVNtQnJDLGlCQVRuQixFQVVHcUMsRUFWSCxDQVVNLFlBVk4sRUFVb0JwQyxrQkFWcEIsRUFXR29DLEVBWEgsQ0FXTSxZQVhOLEVBV29CbkMsa0JBWHBCLEVBWUdtQyxFQVpILENBWU0sVUFaTixFQVlrQmxDLGdCQVpsQixFQWFHOUUsSUFiSCxDQWFReUUsYUFiUixFQWNHd0MsS0FkSCxDQWNTOEUsT0FkVDtJQWVJekgsVUFmSixHQWVpQnRFLElBZmpCLENBZXNCc0UsYUFmdEIsRUFnQktvQyxJQWhCTCxDQWdCVSxXQWhCVixFQWdCdUIsVUFBU2hHLENBQVQsRUFBWTtXQUFTLGVBQWVBLEVBQUVvRCxDQUFqQixHQUFxQixHQUFyQixHQUEyQnBELEVBQUVxRCxDQUE3QixHQUFpQyxHQUF4QztJQWhCckMsRUFpQks0QyxLQWpCTCxDQWlCVyxNQWpCWCxFQWlCbUIsVUFBU2pHLENBQVQsRUFBWTtXQUFTMEQsV0FBV0gsTUFBTXZELEVBQUVPLElBQUYsQ0FBT0EsSUFBYixDQUFYLENBQVA7SUFqQmpDLEVBa0JLMEYsS0FsQkwsQ0FrQlcsV0FsQlgsRUFrQndCLFVBQVNqRyxDQUFULEVBQVk7V0FBU3lELFVBQVVBLFFBQVFILEdBQUd0RCxFQUFFTyxJQUFGLENBQU9BLElBQVYsQ0FBUixJQUEyQixJQUFyQyxHQUE0Q25CLFNBQW5EO0lBbEJ0QyxFQW1CS2tILEVBbkJMLENBbUJRLEtBbkJSLEVBbUJlLFlBQVc7YUFBRSxDQUFVLElBQVYsRUFBZ0JoSCxJQUFoQixDQUFxQlAsUUFBckI7SUFuQjVCOzs7V0FzQlFnSSxJQUFSLEdBQ0VmLElBREYsQ0FDTyxPQURQLEVBQ2dCbEQsVUFBVSxPQUQxQixFQUVFYyxVQUZGLEdBRWV0RSxJQUZmLENBRW9Cd0UsY0FGcEIsRUFHR3dDLEVBSEgsQ0FHTSxLQUhOLEVBR2EsWUFBVzthQUFFLENBQVUsSUFBVixFQUFnQmhILElBQWhCLENBQXFCMEUsWUFBckI7SUFIMUIsRUFJR2dELE1BSkg7OztZQU9TaUUsT0FBVCxDQUFpQkQsSUFBakIsRUFBdUI7UUFDbEJDLFVBQVUsRUFBZDs7YUFFU1UsT0FBVCxDQUFpQmIsSUFBakIsRUFBdUJuRixJQUF2QixFQUE2QjtTQUN6QkEsS0FBS29GLFFBQVIsRUFBa0I7V0FDWkEsUUFBTCxDQUFjYSxPQUFkLENBQXNCLFVBQVNDLEtBQVQsRUFBZ0I7ZUFDN0JsRyxLQUFLbUYsSUFBYixFQUFtQmUsS0FBbkI7T0FERDtNQURELE1BSU9aLFFBQVEvSSxJQUFSLENBQWEsRUFBRW9KLGFBQWFSLElBQWYsRUFBcUJTLFdBQVduSSxFQUFFdUMsSUFBRixDQUFoQyxFQUF5Q1YsT0FBTzVCLEVBQUVzQyxJQUFGLENBQWhELEVBQXlEcEYsTUFBTW9GLElBQS9ELEVBQWI7OztZQUdBLElBQVIsRUFBY3FGLElBQWQ7V0FDTyxFQUFFRCxVQUFVRSxPQUFaLEVBQVA7O0dBL0VGOzs7VUFvRlFwSSxLQUFULEdBQWlCLFVBQVNsRCxDQUFULEVBQVk7U0FDckJDLFVBQVVDLE1BQVYsSUFBb0JnRCxRQUFRbEQsQ0FBUixFQUFXVCxRQUEvQixJQUEyQzJELFNBQVMsRUFBM0Q7RUFERDs7VUFJU0MsT0FBVCxHQUFtQixVQUFTbkQsQ0FBVCxFQUFZO1NBQ3ZCQyxVQUFVQyxNQUFWLElBQW9CaUQsVUFBVW5ELENBQVYsRUFBYVQsUUFBakMsSUFBNkM0RCxPQUFwRDtFQUREOztVQUlTRSxLQUFULEdBQWlCLFVBQVNyRCxDQUFULEVBQVk7U0FDckJDLFVBQVVDLE1BQVYsSUFBb0JtRCxRQUFRckQsQ0FBUixFQUFXVCxRQUEvQixJQUEyQzhELEtBQWxEO0VBREQ7O1VBSVNDLE1BQVQsR0FBa0IsVUFBU3RELENBQVQsRUFBWTtTQUN0QkMsVUFBVUMsTUFBVixJQUFvQm9ELFNBQVN0RCxDQUFULEVBQVlULFFBQWhDLElBQTRDK0QsTUFBbkQ7RUFERDs7VUFJU0MsTUFBVCxHQUFrQixVQUFTdkQsQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9CcUQsU0FBU3ZELENBQVQsRUFBWVQsUUFBaEMsSUFBNENnRSxNQUFuRDtFQUREOztVQUlTd0IsWUFBVCxHQUF3QixZQUFXO1NBQzNCMUIsUUFBUUUsT0FBT2lFLEtBQWYsR0FBdUJqRSxPQUFPa0UsSUFBckM7RUFERDs7VUFJU3hDLGFBQVQsR0FBeUIsWUFBVztTQUM1QjNCLFNBQVNDLE9BQU9tRSxHQUFoQixHQUFzQm5FLE9BQU9vRSxNQUFwQztFQUREOztVQUlTbEUsQ0FBVCxHQUFhLFVBQVN6RCxDQUFULEVBQVk7U0FDakJDLFVBQVVDLE1BQVYsSUFBb0J1RCxJQUFJekQsQ0FBSixFQUFPVCxRQUEzQixJQUF1Q2tFLENBQTlDO0VBREQ7O1VBSVNDLENBQVQsR0FBYSxVQUFTMUQsQ0FBVCxFQUFZO1NBQ2pCQyxVQUFVQyxNQUFWLElBQW9Cd0QsSUFBSTFELENBQUosRUFBT1QsUUFBM0IsSUFBdUNtRSxDQUE5QztFQUREOztVQUlTQyxFQUFULEdBQWMsVUFBUzNELENBQVQsRUFBWTtTQUNsQkMsVUFBVUMsTUFBVixJQUFvQnlELEtBQUszRCxDQUFMLEVBQVFULFFBQTVCLElBQXdDb0UsRUFBL0M7RUFERDs7VUFJU0MsS0FBVCxHQUFpQixVQUFTNUQsQ0FBVCxFQUFZO1NBQ3JCQyxVQUFVQyxNQUFWLElBQW9CMEQsUUFBUTVELENBQVIsRUFBV1QsUUFBL0IsSUFBMkNxRSxLQUFsRDtFQUREOztVQUlTQyxJQUFULEdBQWdCLFVBQVM3RCxDQUFULEVBQVk7U0FDcEJDLFVBQVVDLE1BQVYsSUFBb0IyRCxPQUFPN0QsQ0FBUCxFQUFVVCxRQUE5QixJQUEwQ3NFLElBQWpEO0VBREQ7O1VBSVNDLE9BQVQsR0FBbUIsVUFBUzlELENBQVQsRUFBWTtTQUN2QkMsVUFBVUMsTUFBVixJQUFvQjRELFVBQVU5RCxDQUFWLEVBQWFULFFBQWpDLElBQTZDdUUsT0FBcEQ7RUFERDs7VUFJU0MsVUFBVCxHQUFzQixVQUFTL0QsQ0FBVCxFQUFZO1NBQzFCQyxVQUFVQyxNQUFWLElBQW9CNkQsYUFBYS9ELENBQWIsRUFBZ0JULFFBQXBDLElBQWdEd0UsVUFBdkQ7RUFERDs7VUFJU0MsTUFBVCxHQUFrQixVQUFTaEUsQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9COEQsU0FBU2hFLENBQVQsRUFBWVQsUUFBaEMsSUFBNEN5RSxNQUFuRDtFQUREOztVQUlTcUIsSUFBVCxHQUFnQixVQUFTckYsQ0FBVCxFQUFZO1NBQ3BCQyxVQUFVQyxNQUFWLElBQW9CbUYsT0FBT3JGLENBQVAsRUFBVVQsUUFBOUIsSUFBMEM4RixJQUFqRDtFQUREOztVQUlTcEIsVUFBVCxHQUFzQixVQUFTakUsQ0FBVCxFQUFZO1NBQzFCQyxVQUFVQyxNQUFWLElBQW9CK0QsZ0JBQWFqRSxDQUFiLEVBQWdCVCxRQUFwQyxJQUFnRDBFLGFBQXZEO0VBREQ7O1VBSVNDLGVBQVQsR0FBMkIsVUFBU2xFLENBQVQsRUFBWTtTQUMvQkMsVUFBVUMsTUFBVixJQUFvQmdFLGtCQUFrQmxFLENBQWxCLEVBQXFCVCxRQUF6QyxJQUFxRDJFLGVBQTVEO0VBREQ7O1VBSVNDLGNBQVQsR0FBMEIsVUFBU25FLENBQVQsRUFBWTtTQUM5QkMsVUFBVUMsTUFBVixJQUFvQmlFLGlCQUFpQm5FLENBQWpCLEVBQW9CVCxRQUF4QyxJQUFvRDRFLGNBQTNEO0VBREQ7O1VBSVMvRSxRQUFULEdBQW9CLFVBQVNZLENBQVQsRUFBWTtTQUN4QkMsVUFBVUMsTUFBVixJQUFvQmQsV0FBV1ksQ0FBWCxFQUFjVCxRQUFsQyxJQUE4Q0gsUUFBckQ7RUFERDs7VUFJU2dGLGFBQVQsR0FBeUIsVUFBU3BFLENBQVQsRUFBWTtTQUM3QkMsVUFBVUMsTUFBVixJQUFvQmtFLGdCQUFnQnBFLENBQWhCLEVBQW1CVCxRQUF2QyxJQUFtRDZFLGFBQTFEO0VBREQ7O1VBSVNDLFlBQVQsR0FBd0IsVUFBU3JFLENBQVQsRUFBWTtTQUM1QkMsVUFBVUMsTUFBVixJQUFvQm1FLGVBQWVyRSxDQUFmLEVBQWtCVCxRQUF0QyxJQUFrRDhFLFlBQXpEO0VBREQ7O1VBSVNDLGlCQUFULEdBQTZCLFVBQVN0RSxDQUFULEVBQVk7U0FDakNDLFVBQVVDLE1BQVYsSUFBb0JvRSxvQkFBb0J0RSxDQUFwQixFQUF1QlQsUUFBM0MsSUFBdUQrRSxpQkFBOUQ7RUFERDs7VUFJU0Msa0JBQVQsR0FBOEIsVUFBU3ZFLENBQVQsRUFBWTtTQUNsQ0MsVUFBVUMsTUFBVixJQUFvQnFFLHFCQUFxQnZFLENBQXJCLEVBQXdCVCxRQUE1QyxJQUF3RGdGLGtCQUEvRDtFQUREOztVQUlTQyxrQkFBVCxHQUE4QixVQUFTeEUsQ0FBVCxFQUFZO1NBQ2xDQyxVQUFVQyxNQUFWLElBQW9Cc0UscUJBQXFCeEUsQ0FBckIsRUFBd0JULFFBQTVDLElBQXdEaUYsa0JBQS9EO0VBREQ7O1VBSVNDLGdCQUFULEdBQTRCLFVBQVN6RSxDQUFULEVBQVk7U0FDaENDLFVBQVVDLE1BQVYsSUFBb0J1RSxtQkFBbUJ6RSxDQUFuQixFQUFzQlQsUUFBMUMsSUFBc0RrRixnQkFBN0Q7RUFERDs7VUFJUzBILElBQVQsR0FBZ0IsVUFBU25NLENBQVQsRUFBWTtTQUNwQkMsVUFBVUMsTUFBVixJQUFvQjRLLFFBQVE5SyxDQUFSLEVBQVdULFFBQS9CLElBQTJDdUwsS0FBbEQ7RUFERDs7VUFJU0QsTUFBVCxHQUFrQixVQUFTN0ssQ0FBVCxFQUFZO1NBQ3RCQyxVQUFVQyxNQUFWLElBQW9CNkssVUFBVS9LLENBQVYsRUFBYVQsUUFBakMsSUFBNkN3TCxPQUFwRDtFQUREOztRQUlPeEwsUUFBUDs7O0FDclBjLFNBQVM2RixLQUFULEdBQWU7O0tBRXpCbEMsS0FBSixFQUNDQyxPQURELEVBRUNDLE1BRkQsRUFHQ0MsS0FIRCxFQUdRQyxNQUhSLEVBSUNDLE1BSkQsRUFLQ0MsR0FMRCxFQUtNQyxDQUxOLEVBS1NDLENBTFQsRUFLWUUsS0FMWixFQUttQkMsSUFMbkIsRUFNQ0UsVUFORCxFQU9DQyxNQVBELEVBUUNDLGFBUkQsRUFRYUMsZUFSYixFQVE4QkMsY0FSOUIsRUFTQy9FLFFBVEQsRUFTV2dGLGFBVFgsRUFTMEJDLFlBVDFCLEVBVUNDLGlCQVZELEVBVW9CQyxrQkFWcEIsRUFXQ0Msa0JBWEQsRUFXcUJDLGdCQVhyQixFQWFDRSxJQWJELEVBY0NDLElBZEQ7O1VBZ0JTckYsUUFBVCxDQUFrQkMsU0FBbEIsRUFBNkI7OztrQkFHZnlFLGlCQUFjLFVBQVNyRSxDQUFULEVBQVk7VUFBU0EsRUFBRWlGLFFBQUYsQ0FBVyxDQUFYLENBQVA7R0FBekM7b0JBQ2tCWCxtQkFBbUIsVUFBU3RFLENBQVQsRUFBWTtVQUFTQSxFQUFFaUYsUUFBRixDQUFXLENBQVgsQ0FBUDtHQUFuRDttQkFDaUJWLGtCQUFrQixVQUFTdkUsQ0FBVCxFQUFZO1VBQVNBLEVBQUVpRixRQUFGLENBQVcsQ0FBWCxDQUFQO0dBQWpEOzthQUVXekYsWUFBWSxZQUFXO1VBQVNLLFNBQVA7R0FBcEM7a0JBQ2dCMkUsaUJBQWlCLFlBQVc7VUFBUzNFLFNBQVA7R0FBOUM7aUJBQ2U0RSxnQkFBZ0IsWUFBVztVQUFTNUUsU0FBUDtHQUE1Qzs7c0JBRW9CNkUscUJBQXFCLFlBQVc7VUFBUzdFLFNBQVA7R0FBdEQ7dUJBQ3FCOEUsc0JBQXNCLFlBQVc7VUFBUzlFLFNBQVA7R0FBeEQ7O3VCQUVxQitFLHNCQUFzQixZQUFXO1VBQVMvRSxTQUFQO0dBQXhEO3FCQUNtQmdGLG9CQUFvQixZQUFXO1VBQVNoRixTQUFQO0dBQXBEOztZQUVVMEQsV0FBVyxLQUFyQjs7U0FFT3dCLFFBQVEsRUFBZjtTQUNPQyxRQUFRLEVBQWY7O01BRUlFLElBQUl2RixTQUFTd0YsWUFBVCxFQUFSO01BQ0NDLElBQUl6RixTQUFTMEYsYUFBVCxFQURMO01BRUNDLFNBQVNoRCxLQUFLaUQsR0FBTCxDQUFTTCxDQUFULEVBQVlFLENBQVosSUFBaUIsQ0FGM0I7O01BSUlJLFNBQU12RixNQUFBLEdBQ1J3RixJQURRLENBQ0gsSUFERyxFQUVSQyxLQUZRLENBRUYsVUFBU2pGLENBQVQsRUFBWTtVQUFTcUQsRUFBRXJELENBQUYsQ0FBUDtHQUZaLEVBR1JrRixVQUhRLENBR0daLEtBQUtZLFVBQUwsR0FBbUJaLEtBQUtZLFVBQUwsR0FBa0JyRCxLQUFLc0QsRUFBdkIsR0FBMEIsR0FBN0MsR0FBbUQsQ0FIdEQsRUFJUkMsUUFKUSxDQUlDZCxLQUFLYyxRQUFMLEdBQWdCZCxLQUFLYyxRQUFMLEdBQWdCdkQsS0FBS3NELEVBQXJCLEdBQXdCLEdBQXhDLEdBQThDLElBQUl0RCxLQUFLc0QsRUFKeEQsRUFLUkUsUUFMUSxDQUtDZixLQUFLZSxRQUFMLEdBQWdCZixLQUFLZSxRQUFMLEdBQWdCeEQsS0FBS3NELEVBQXJCLEdBQXdCLEdBQXhDLEdBQThDLENBTC9DLENBQVY7O01BT0lHLFNBQU05RixNQUFBLEdBQ1JnRyxXQURRLENBQ0lqQixLQUFLaUIsV0FBTCxHQUFtQlgsU0FBU04sS0FBS2lCLFdBQWpDLEdBQStDLENBRG5ELEVBRVJELFdBRlEsQ0FFSVYsTUFGSixDQUFWOztZQUlVeEYsSUFBVixDQUFlLFVBQVNrQixJQUFULEVBQWU7O09BRXpCb0YsT0FBT25HLFNBQUEsQ0FBVSxJQUFWLENBQVg7OztPQUdJb0csSUFBSUQsS0FBS0UsTUFBTCxDQUFZLEdBQVosQ0FBUjtPQUNHRCxFQUFFRSxLQUFGLEVBQUgsRUFBYztRQUNUSCxLQUFLSSxNQUFMLENBQVksR0FBWixFQUNGQyxJQURFLENBQ0csV0FESCxFQUNnQixlQUFldkIsSUFBSSxDQUFuQixHQUF1QixHQUF2QixHQUE2QkUsSUFBSSxDQUFqQyxHQUFxQyxHQURyRCxDQUFKOzs7T0FJRWlCLEVBQUVDLE1BQUYsQ0FBUyxRQUFULEVBQW1CQyxLQUFuQixFQUFILEVBQStCO01BQzVCQyxNQUFGLENBQVMsTUFBVCxFQUNFQyxJQURGLENBQ08sT0FEUCxFQUNnQixPQURoQixFQUVFQSxJQUZGLENBRU8sSUFGUCxFQUVhLE9BRmIsRUFHRUMsS0FIRixDQUdRLGFBSFIsRUFHdUIsUUFIdkIsRUFJRXpDLElBSkYsQ0FJTyxZQUFXO1lBQ1QsT0FBT0csTUFBUCxLQUFrQixVQUFsQixHQUErQkEsT0FBT3BELElBQVAsQ0FBL0IsR0FBOENvRCxNQUFyRDtLQUxGOzs7O09BV0dzYyxPQUFPcmEsRUFBRVEsU0FBRixDQUFZLE1BQU10RCxRQUFRc0gsT0FBUixDQUFnQixHQUFoQixFQUFxQixHQUFyQixDQUFsQixFQUNUN0osSUFEUyxDQUNKd0UsT0FBSXhFLElBQUosQ0FESSxFQUNPLFVBQVNQLENBQVQsRUFBWTtXQUFTbUQsSUFBSW5ELEVBQUVPLElBQU4sQ0FBUDtJQURyQixFQUVSeUYsSUFGUSxDQUVILE9BRkcsRUFFTWxELFVBQVUsU0FGaEIsQ0FBWDs7O1FBS0t1RCxLQUFMLEdBQ0VOLE1BREYsQ0FDUyxNQURULEVBRUdDLElBRkgsQ0FFUSxPQUZSLEVBRWlCbEQsVUFBVSxRQUYzQixFQUdHa0QsSUFISCxDQUdRLEdBSFIsRUFHYVYsTUFIYixFQUlHVyxLQUpILENBSVMsTUFKVCxFQUlpQixVQUFTakcsQ0FBVCxFQUFZO1dBQVMwRCxXQUFXSCxNQUFNdkQsRUFBRU8sSUFBUixDQUFYLENBQVA7SUFKL0IsRUFLRytGLEVBTEgsQ0FLTSxXQUxOLEVBS21CckMsaUJBTG5CLEVBTUdxQyxFQU5ILENBTU0sWUFOTixFQU1vQnBDLGtCQU5wQixFQU9Hb0MsRUFQSCxDQU9NLFlBUE4sRUFPb0JuQyxrQkFQcEIsRUFRR21DLEVBUkgsQ0FRTSxVQVJOLEVBUWtCbEMsZ0JBUmxCLEVBU0c5RSxJQVRILENBU1F5RSxhQVRSLEVBVUd3QyxLQVZILENBVVMwWixJQVZUO0lBV0lyYyxVQVhKLEdBV2lCdEUsSUFYakIsQ0FXc0JzRSxhQVh0QixFQVlLNEMsU0FaTCxDQVllLEdBWmYsRUFZb0IwWixRQVpwQixFQWFLamEsS0FiTCxDQWFXLE1BYlgsRUFhbUIsVUFBU2pHLENBQVQsRUFBWTtXQUFTMEQsV0FBV0gsTUFBTXZELEVBQUVPLElBQVIsQ0FBWCxDQUFQO0lBYmpDLEVBY0srRixFQWRMLENBY1EsS0FkUixFQWNlLFlBQVc7YUFBRSxDQUFVLElBQVYsRUFBZ0JoSCxJQUFoQixDQUFxQlAsUUFBckI7SUFkNUI7OztRQWlCS2dJLElBQUwsR0FDRWYsSUFERixDQUNPLE9BRFAsRUFDZ0JsRCxVQUFVLE9BRDFCLEVBRUVjLFVBRkYsR0FFZXRFLElBRmYsQ0FFb0J3RSxjQUZwQixFQUdHMEMsU0FISCxDQUdhLEdBSGIsRUFHa0IwWixTQUFTLENBQVQsQ0FIbEIsRUFJRzVaLEVBSkgsQ0FJTSxLQUpOLEVBSWEsWUFBVzthQUFFLENBQVUsSUFBVixFQUFnQmhILElBQWhCLENBQXFCMEUsWUFBckI7SUFKMUIsRUFLR2dELE1BTEg7O1lBT1NrWixRQUFULENBQWtCL1UsQ0FBbEIsRUFBcUI7UUFDakIsQ0FBQyxJQUFKLEVBQVUsT0FBTyxZQUFXO1lBQVM3RixPQUFJLENBQUosQ0FBUDtLQUFwQjs7UUFFTnRELElBQUl4QyxjQUFBLENBQWUsS0FBS2lILFFBQXBCLEVBQThCMEUsQ0FBOUIsQ0FBUjtTQUNLMUUsUUFBTCxHQUFnQnpFLEVBQUUsQ0FBRixDQUFoQjtXQUNPLFVBQVN6QyxDQUFULEVBQVk7WUFDWCtGLE9BQUl0RCxFQUFFekMsQ0FBRixDQUFKLENBQVA7S0FERDs7R0F6REY7OztVQWdFUXNELEtBQVQsR0FBaUIsVUFBU2xELENBQVQsRUFBWTtTQUNyQkMsVUFBVUMsTUFBVixJQUFvQmdELFFBQVFsRCxDQUFSLEVBQVdULFFBQS9CLElBQTJDMkQsU0FBUyxFQUEzRDtFQUREOztVQUlTQyxPQUFULEdBQW1CLFVBQVNuRCxDQUFULEVBQVk7U0FDdkJDLFVBQVVDLE1BQVYsSUFBb0JpRCxVQUFVbkQsQ0FBVixFQUFhVCxRQUFqQyxJQUE2QzRELE9BQXBEO0VBREQ7O1VBSVNDLE1BQVQsR0FBa0IsVUFBU3BELENBQVQsRUFBWTtTQUN0QkMsVUFBVUMsTUFBVixJQUFvQmtELFNBQVNwRCxDQUFULEVBQVlULFFBQWhDLElBQTRDNkQsTUFBbkQ7RUFERDs7VUFJU0MsS0FBVCxHQUFpQixVQUFTckQsQ0FBVCxFQUFZO1NBQ3JCQyxVQUFVQyxNQUFWLElBQW9CbUQsUUFBUXJELENBQVIsRUFBV1QsUUFBL0IsSUFBMkM4RCxLQUFsRDtFQUREOztVQUlTQyxNQUFULEdBQWtCLFVBQVN0RCxDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0JvRCxTQUFTdEQsQ0FBVCxFQUFZVCxRQUFoQyxJQUE0QytELE1BQW5EO0VBREQ7O1VBSVNDLE1BQVQsR0FBa0IsVUFBU3ZELENBQVQsRUFBWTtTQUN0QkMsVUFBVUMsTUFBVixJQUFvQnFELFNBQVN2RCxDQUFULEVBQVlULFFBQWhDLElBQTRDZ0UsTUFBbkQ7RUFERDs7VUFJU3dCLFlBQVQsR0FBd0IsWUFBVztTQUMzQjFCLFFBQVFFLE9BQU9pRSxLQUFmLEdBQXVCakUsT0FBT2tFLElBQXJDO0VBREQ7O1VBSVN4QyxhQUFULEdBQXlCLFlBQVc7U0FDNUIzQixTQUFTQyxPQUFPbUUsR0FBaEIsR0FBc0JuRSxPQUFPb0UsTUFBcEM7RUFERDs7VUFJU25FLEdBQVQsR0FBZSxVQUFTeEQsQ0FBVCxFQUFZO1NBQ25CQyxVQUFVQyxNQUFWLElBQW9Cc0QsTUFBTXhELENBQU4sRUFBU1QsUUFBN0IsSUFBeUNpRSxHQUFoRDtFQUREOztVQUlTQyxDQUFULEdBQWEsVUFBU3pELENBQVQsRUFBWTtTQUNqQkMsVUFBVUMsTUFBVixJQUFvQnVELElBQUl6RCxDQUFKLEVBQU9ULFFBQTNCLElBQXVDa0UsQ0FBOUM7RUFERDs7VUFJU0MsQ0FBVCxHQUFhLFVBQVMxRCxDQUFULEVBQVk7U0FDakJDLFVBQVVDLE1BQVYsSUFBb0J3RCxJQUFJMUQsQ0FBSixFQUFPVCxRQUEzQixJQUF1Q21FLENBQTlDO0VBREQ7O1VBSVNFLEtBQVQsR0FBaUIsVUFBUzVELENBQVQsRUFBWTtTQUNyQkMsVUFBVUMsTUFBVixJQUFvQjBELFFBQVE1RCxDQUFSLEVBQVdULFFBQS9CLElBQTJDcUUsS0FBbEQ7RUFERDs7VUFJU0MsSUFBVCxHQUFnQixVQUFTN0QsQ0FBVCxFQUFZO1NBQ3BCQyxVQUFVQyxNQUFWLElBQW9CMkQsT0FBTzdELENBQVAsRUFBVVQsUUFBOUIsSUFBMENzRSxJQUFqRDtFQUREOztVQUlTRSxVQUFULEdBQXNCLFVBQVMvRCxDQUFULEVBQVk7U0FDMUJDLFVBQVVDLE1BQVYsSUFBb0I2RCxhQUFhL0QsQ0FBYixFQUFnQlQsUUFBcEMsSUFBZ0R3RSxVQUF2RDtFQUREOztVQUlTQyxNQUFULEdBQWtCLFVBQVNoRSxDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0I4RCxTQUFTaEUsQ0FBVCxFQUFZVCxRQUFoQyxJQUE0Q3lFLE1BQW5EO0VBREQ7O1VBSVNDLFVBQVQsR0FBc0IsVUFBU2pFLENBQVQsRUFBWTtTQUMxQkMsVUFBVUMsTUFBVixJQUFvQitELGdCQUFhakUsQ0FBYixFQUFnQlQsUUFBcEMsSUFBZ0QwRSxhQUF2RDtFQUREOztVQUlTQyxlQUFULEdBQTJCLFVBQVNsRSxDQUFULEVBQVk7U0FDL0JDLFVBQVVDLE1BQVYsSUFBb0JnRSxrQkFBa0JsRSxDQUFsQixFQUFxQlQsUUFBekMsSUFBcUQyRSxlQUE1RDtFQUREOztVQUlTQyxjQUFULEdBQTBCLFVBQVNuRSxDQUFULEVBQVk7U0FDOUJDLFVBQVVDLE1BQVYsSUFBb0JpRSxpQkFBaUJuRSxDQUFqQixFQUFvQlQsUUFBeEMsSUFBb0Q0RSxjQUEzRDtFQUREOztVQUlTL0UsUUFBVCxHQUFvQixVQUFTWSxDQUFULEVBQVk7U0FDeEJDLFVBQVVDLE1BQVYsSUFBb0JkLFdBQVdZLENBQVgsRUFBY1QsUUFBbEMsSUFBOENILFFBQXJEO0VBREQ7O1VBSVNnRixhQUFULEdBQXlCLFVBQVNwRSxDQUFULEVBQVk7U0FDN0JDLFVBQVVDLE1BQVYsSUFBb0JrRSxnQkFBZ0JwRSxDQUFoQixFQUFtQlQsUUFBdkMsSUFBbUQ2RSxhQUExRDtFQUREOztVQUlTQyxZQUFULEdBQXdCLFVBQVNyRSxDQUFULEVBQVk7U0FDNUJDLFVBQVVDLE1BQVYsSUFBb0JtRSxlQUFlckUsQ0FBZixFQUFrQlQsUUFBdEMsSUFBa0Q4RSxZQUF6RDtFQUREOztVQUlTQyxpQkFBVCxHQUE2QixVQUFTdEUsQ0FBVCxFQUFZO1NBQ2pDQyxVQUFVQyxNQUFWLElBQW9Cb0Usb0JBQW9CdEUsQ0FBcEIsRUFBdUJULFFBQTNDLElBQXVEK0UsaUJBQTlEO0VBREQ7O1VBSVNDLGtCQUFULEdBQThCLFVBQVN2RSxDQUFULEVBQVk7U0FDbENDLFVBQVVDLE1BQVYsSUFBb0JxRSxxQkFBcUJ2RSxDQUFyQixFQUF3QlQsUUFBNUMsSUFBd0RnRixrQkFBL0Q7RUFERDs7VUFJU0Msa0JBQVQsR0FBOEIsVUFBU3hFLENBQVQsRUFBWTtTQUNsQ0MsVUFBVUMsTUFBVixJQUFvQnNFLHFCQUFxQnhFLENBQXJCLEVBQXdCVCxRQUE1QyxJQUF3RGlGLGtCQUEvRDtFQUREOztVQUlTQyxnQkFBVCxHQUE0QixVQUFTekUsQ0FBVCxFQUFZO1NBQ2hDQyxVQUFVQyxNQUFWLElBQW9CdUUsbUJBQW1CekUsQ0FBbkIsRUFBc0JULFFBQTFDLElBQXNEa0YsZ0JBQTdEO0VBREQ7O1VBSVNrQixHQUFULEdBQWUsVUFBUzNGLENBQVQsRUFBWTtTQUNuQkMsVUFBVUMsTUFBVixJQUFvQjBFLE9BQU81RSxDQUFQLEVBQVVULFFBQTlCLElBQTBDcUYsSUFBakQ7RUFERDs7VUFJU1EsR0FBVCxHQUFlLFVBQVNwRixDQUFULEVBQVk7U0FDbkJDLFVBQVVDLE1BQVYsSUFBb0J5RSxPQUFPM0UsQ0FBUCxFQUFVVCxRQUE5QixJQUEwQ29GLElBQWpEO0VBREQ7O1FBSU9wRixRQUFQOzs7QUNuT2MsU0FBU2loQixRQUFULEdBQW9COztLQUU5QnJkLE9BQUosRUFDQ3NkLEdBREQ7O1VBR1NsaEIsUUFBVCxDQUFrQkMsU0FBbEIsRUFBNkI7O1lBRWxCRSxJQUFWLENBQWUsWUFBVzs7T0FFdEIrZ0IsR0FBSCxFQUFRO1FBQ0h6YSxPQUFPbkcsU0FBQSxDQUFVLElBQVYsQ0FBWDtRQUNDNmdCLFlBQVkxYSxLQUFLRSxNQUFMLENBQVksT0FBWixDQURiOztRQUdHd2EsVUFBVXZhLEtBQVYsRUFBSCxFQUFzQjtpQkFDVEgsS0FBS0ksTUFBTCxDQUFZLE9BQVosRUFBcUJDLElBQXJCLENBQTBCLE1BQTFCLEVBQWtDLFVBQWxDLENBQVo7OztjQUdTeEMsSUFBVixDQUFlNGMsSUFBSWhXLE9BQUosQ0FBWSxNQUFaLEVBQW9CLE1BQU16RSxLQUFLSyxJQUFMLENBQVUsSUFBVixDQUExQixDQUFmOztHQVZGOzs7VUFlUWxELE9BQVQsR0FBbUIsVUFBU25ELENBQVQsRUFBWTtTQUN2QkMsVUFBVUMsTUFBVixJQUFvQmlELFVBQVVuRCxDQUFWLEVBQWFULFFBQWpDLElBQTZDNEQsT0FBcEQ7RUFERDs7VUFJU3NkLEdBQVQsR0FBZSxVQUFTemdCLENBQVQsRUFBWTtTQUNuQkMsVUFBVUMsTUFBVixJQUFvQnVnQixNQUFNemdCLENBQU4sRUFBU1QsUUFBN0IsSUFBeUNraEIsR0FBaEQ7RUFERDs7UUFJT2xoQixRQUFQOzs7QUM5QmMsU0FBU29oQixhQUFULEdBQXlCOzs7S0FHbkN4ZCxPQUFKLEVBQ0N5ZCxPQURELEVBRUNDLE1BRkQsRUFHQ0MsVUFIRCxFQUlDTCxHQUpEOztVQU1TbGhCLFFBQVQsQ0FBa0JDLFNBQWxCLEVBQTZCOztZQUVsQkUsSUFBVixDQUFlLFlBQVc7O09BRXRCb2hCLGNBQWNELE1BQWQsSUFBd0JELE9BQXhCLElBQW1DSCxHQUF0QyxFQUEyQzs7UUFFdEN6YSxPQUFPbkcsU0FBQSxDQUFVLElBQVYsQ0FBWDtRQUNDNmdCLFlBQVkxYSxLQUFLRSxNQUFMLENBQVksT0FBWixDQURiO1FBRUNtSyxTQUFTLEVBRlY7O1FBSUdxUSxVQUFVdmEsS0FBVixFQUFILEVBQXNCO2lCQUNUSCxLQUFLSSxNQUFMLENBQVksT0FBWixFQUFxQkMsSUFBckIsQ0FBMEIsTUFBMUIsRUFBa0MsVUFBbEMsQ0FBWjs7O1FBR0V5YSxVQUFILEVBQWU7ZUFDSixxREFBVjtlQUNVQyxjQUFjRCxVQUFkLENBQVY7ZUFDVSxLQUFWOzs7UUFHRUQsTUFBSCxFQUFXO2VBQ0EscUZBQVY7ZUFDVUUsY0FBY0YsTUFBZCxDQUFWO2VBQ1UsS0FBVjs7O1FBR0VELE9BQUgsRUFBWTtlQUNELHNEQUFWO2VBQ1VHLGNBQWNILE9BQWQsQ0FBVjtlQUNVLEtBQVY7OztRQUdFSCxHQUFILEVBQVE7ZUFDR0EsSUFBSWhXLE9BQUosQ0FBWSxNQUFaLEVBQW9CLE1BQU16RSxLQUFLSyxJQUFMLENBQVUsSUFBVixDQUExQixJQUE2QyxJQUF2RDs7O2NBR1N4QyxJQUFWLENBQWV3TSxNQUFmOzs7WUFHUTBRLGFBQVQsQ0FBdUI5UCxDQUF2QixFQUEwQjtRQUNyQm1ELElBQUksRUFBUjtRQUNDOVIsVUFBT2tPLE9BQU9sTyxJQUFQLENBQVkyTyxDQUFaLENBRFI7O1NBR0ksSUFBSTZCLENBQVIsSUFBYXhRLE9BQWIsRUFBbUI7VUFDYkEsUUFBS3dRLENBQUwsSUFBVSxHQUFWLEdBQWdCOU0sS0FBS0ssSUFBTCxDQUFVLElBQVYsQ0FBaEIsR0FBa0MsR0FBdkM7O1NBRUkyYSxRQUFReFEsT0FBT2xPLElBQVAsQ0FBWTJPLEVBQUUzTyxRQUFLd1EsQ0FBTCxDQUFGLENBQVosQ0FBWjtVQUNJLElBQUkvRyxDQUFSLElBQWFpVixLQUFiLEVBQW9CO1dBQ2JBLE1BQU1qVixDQUFOLElBQVcsR0FBWCxHQUFpQmtGLEVBQUUzTyxRQUFLd1EsQ0FBTCxDQUFGLEVBQVdrTyxNQUFNalYsQ0FBTixDQUFYLENBQWpCLEdBQXdDLEdBQTlDOzs7V0FHS3FJLElBQUksR0FBWDs7R0FqREY7OztVQXNEUWpSLE9BQVQsR0FBbUIsVUFBU25ELENBQVQsRUFBWTtTQUN2QkMsVUFBVUMsTUFBVixJQUFvQmlELFVBQVVuRCxDQUFWLEVBQWFULFFBQWpDLElBQTZDNEQsT0FBcEQ7RUFERDs7VUFJU3lkLE9BQVQsR0FBbUIsVUFBUzVnQixDQUFULEVBQVk7U0FDdkJDLFVBQVVDLE1BQVYsSUFBb0IwZ0IsVUFBVTVnQixDQUFWLEVBQWFULFFBQWpDLElBQTZDcWhCLE9BQXBEO0VBREQ7O1VBSVNDLE1BQVQsR0FBa0IsVUFBUzdnQixDQUFULEVBQVk7U0FDdEJDLFVBQVVDLE1BQVYsSUFBb0IyZ0IsU0FBUzdnQixDQUFULEVBQVlULFFBQWhDLElBQTRDc2hCLE1BQW5EO0VBREQ7O1VBSVNDLFVBQVQsR0FBc0IsVUFBUzlnQixDQUFULEVBQVk7U0FDMUJDLFVBQVVDLE1BQVYsSUFBb0I0Z0IsYUFBYTlnQixDQUFiLEVBQWdCVCxRQUFwQyxJQUFnRHVoQixVQUF2RDtFQUREOztVQUlTTCxHQUFULEdBQWUsVUFBU3pnQixDQUFULEVBQVk7U0FDbkJDLFVBQVVDLE1BQVYsSUFBb0J1Z0IsTUFBTXpnQixDQUFOLEVBQVNULFFBQTdCLElBQXlDa2hCLEdBQWhEO0VBREQ7O1FBSU9saEIsUUFBUDs7O0FDdkZELElBQUkwaEIsVUFBVSxPQUFkO0FBQ0FDLFFBQVFELE9BQVIsR0FBa0JBLE9BQWxCLENBRUEsQUFDQSxBQUNBLEFBQ0EsQUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
