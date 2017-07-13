/* dgf-tinymce-plugin v.0.9.8, 2017-07-06T12:46:49.017Z, Copyright (c) 2016-2017 Thomas Müller Flury */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('tinymce'), require('dgf')) :
	typeof define === 'function' && define.amd ? define(['tinymce', 'dgf'], factory) :
	(factory(global.tinymce,global.dgf));
}(this, (function (tinymce,dgf) { 'use strict';

var ascending = function (a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
};

var bisector = function (compare) {
  if (compare.length === 1) compare = ascendingComparator(compare);
  return {
    left: function left(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;else hi = mid;
      }
      return lo;
    },
    right: function right(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;else lo = mid + 1;
      }
      return lo;
    }
  };
};

function ascendingComparator(f) {
  return function (d, x) {
    return ascending(f(d), x);
  };
}

var ascendingBisect = bisector(ascending);
var bisectRight = ascendingBisect.right;

function pair(a, b) {
  return [a, b];
}

var number = function (x) {
  return x === null ? NaN : +x;
};

var extent = function (values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min,
      max;

  if (valueof == null) {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = max = value;
        while (++i < n) {
          // Compare the remaining values.
          if ((value = values[i]) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  } else {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = max = value;
        while (++i < n) {
          // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  }

  return [min, max];
};

var identity = function (x) {
  return x;
};

var sequence = function (start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
};

var e10 = Math.sqrt(50);
var e5 = Math.sqrt(10);
var e2 = Math.sqrt(2);

var ticks = function (start, stop, count) {
    var reverse = stop < start,
        i = -1,
        n,
        ticks,
        step;

    if (reverse) n = start, start = stop, stop = n;

    if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

    if (step > 0) {
        start = Math.ceil(start / step);
        stop = Math.floor(stop / step);
        ticks = new Array(n = Math.ceil(stop - start + 1));
        while (++i < n) {
            ticks[i] = (start + i) * step;
        }
    } else {
        start = Math.floor(start * step);
        stop = Math.ceil(stop * step);
        ticks = new Array(n = Math.ceil(start - stop + 1));
        while (++i < n) {
            ticks[i] = (start - i) / step;
        }
    }

    if (reverse) ticks.reverse();

    return ticks;
};

function tickIncrement(start, stop, count) {
    var step = (stop - start) / Math.max(0, count),
        power = Math.floor(Math.log(step) / Math.LN10),
        error = step / Math.pow(10, power);
    return power >= 0 ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power) : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}

function tickStep(start, stop, count) {
    var step0 = Math.abs(stop - start) / Math.max(0, count),
        step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
        error = step0 / step1;
    if (error >= e10) step1 *= 10;else if (error >= e5) step1 *= 5;else if (error >= e2) step1 *= 2;
    return stop < start ? -step1 : step1;
}

var sturges = function (values) {
  return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
};

var threshold = function (values, p, valueof) {
  if (valueof == null) valueof = number;
  if (!(n = values.length)) return;
  if ((p = +p) <= 0 || n < 2) return +valueof(values[0], 0, values);
  if (p >= 1) return +valueof(values[n - 1], n - 1, values);
  var n,
      i = (n - 1) * p,
      i0 = Math.floor(i),
      value0 = +valueof(values[i0], i0, values),
      value1 = +valueof(values[i0 + 1], i0 + 1, values);
  return value0 + (value1 - value0) * (i - i0);
};

var merge = function (arrays) {
  var n = arrays.length,
      m,
      i = -1,
      j = 0,
      merged,
      array;

  while (++i < n) {
    j += arrays[i].length;
  }merged = new Array(j);

  while (--n >= 0) {
    array = arrays[n];
    m = array.length;
    while (--m >= 0) {
      merged[--j] = array[m];
    }
  }

  return merged;
};

var min = function (values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min;

  if (valueof == null) {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = value;
        while (++i < n) {
          // Compare the remaining values.
          if ((value = values[i]) != null && min > value) {
            min = value;
          }
        }
      }
    }
  } else {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = value;
        while (++i < n) {
          // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  return min;
};

function length(d) {
  return d.length;
}

var noop = { value: function value() {} };

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || t in _) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function (t) {
    var name = "",
        i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return { type: t, name: name };
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function on(typename, callback) {
    var _ = this._,
        T = parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length;

    // If no callback was specified, return the callback of the given type and name.
    if (arguments.length < 2) {
      while (++i < n) {
        if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
      }return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);else if (callback == null) for (t in _) {
        _[t] = set(_[t], typename.name, null);
      }
    }

    return this;
  },
  copy: function copy() {
    var copy = {},
        _ = this._;
    for (var t in _) {
      copy[t] = _[t].slice();
    }return new Dispatch(copy);
  },
  call: function call(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) {
      args[i] = arguments[i + 2];
    }if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) {
      t[i].value.apply(that, args);
    }
  },
  apply: function apply(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) {
      t[i].value.apply(that, args);
    }
  }
};

function get(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({ name: name, value: callback });
  return type;
}

var xhtml = "http://www.w3.org/1999/xhtml";

var namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

var namespace = function (name) {
  var prefix = name += "",
      i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? { space: namespaces[prefix], local: name } : name;
};

function creatorInherit(name) {
  return function () {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === xhtml && document.documentElement.namespaceURI === xhtml ? document.createElement(name) : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function () {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

var creator = function (name) {
  var fullname = namespace(name);
  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
};

var matcher = function matcher(selector) {
  return function () {
    return this.matches(selector);
  };
};

if (typeof document !== "undefined") {
  var element = document.documentElement;
  if (!element.matches) {
    var vendorMatches = element.webkitMatchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector;
    matcher = function matcher(selector) {
      return function () {
        return vendorMatches.call(this, selector);
      };
    };
  }
}

var matcher$1 = matcher;

var filterEvents = {};

var event = null;

if (typeof document !== "undefined") {
  var element$1 = document.documentElement;
  if (!("onmouseenter" in element$1)) {
    filterEvents = { mouseenter: "mouseover", mouseleave: "mouseout" };
  }
}

function filterContextListener(listener, index, group) {
  listener = contextListener(listener, index, group);
  return function (event) {
    var related = event.relatedTarget;
    if (!related || related !== this && !(related.compareDocumentPosition(this) & 8)) {
      listener.call(this, event);
    }
  };
}

function contextListener(listener, index, group) {
  return function (event1) {
    var event0 = event; // Events can be reentrant (e.g., focus).
    event = event1;
    try {
      listener.call(this, this.__data__, index, group);
    } finally {
      event = event0;
    }
  };
}

function parseTypenames$1(typenames) {
  return typenames.trim().split(/^|\s+/).map(function (t) {
    var name = "",
        i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return { type: t, name: name };
  });
}

function onRemove(typename) {
  return function () {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;else delete this.__on;
  };
}

function onAdd(typename, value, capture) {
  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
  return function (d, i, group) {
    var on = this.__on,
        o,
        listener = wrap(value, i, group);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, capture);
    o = { type: typename.type, name: typename.name, value: value, listener: listener, capture: capture };
    if (!on) this.__on = [o];else on.push(o);
  };
}

var selection_on = function (typename, value, capture) {
  var typenames = parseTypenames$1(typename + ""),
      i,
      n = typenames.length,
      t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  if (capture == null) capture = false;
  for (i = 0; i < n; ++i) {
    this.each(on(typenames[i], value, capture));
  }return this;
};

function none() {}

var selector = function (selector) {
  return selector == null ? none : function () {
    return this.querySelector(selector);
  };
};

var selection_select = function (select) {
  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new Selection(subgroups, this._parents);
};

function empty$1() {
  return [];
}

var selectorAll = function (selector) {
  return selector == null ? empty$1 : function () {
    return this.querySelectorAll(selector);
  };
};

var selection_selectAll = function (select) {
  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection(subgroups, parents);
};

var selection_filter = function (match) {
  if (typeof match !== "function") match = matcher$1(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection(subgroups, this._parents);
};

var sparse = function (update) {
  return new Array(update.length);
};

var selection_enter = function () {
  return new Selection(this._enter || this._groups.map(sparse), this._parents);
};

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function appendChild(child) {
    return this._parent.insertBefore(child, this._next);
  },
  insertBefore: function insertBefore(child, next) {
    return this._parent.insertBefore(child, next);
  },
  querySelector: function querySelector(selector) {
    return this._parent.querySelector(selector);
  },
  querySelectorAll: function querySelectorAll(selector) {
    return this._parent.querySelectorAll(selector);
  }
};

var constant$1 = function (x) {
  return function () {
    return x;
  };
};

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length;

  // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Put any non-null nodes that don’t fit into exit.
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = {},
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
      if (keyValue in nodeByKeyValue) {
        exit[i] = node;
      } else {
        nodeByKeyValue[keyValue] = node;
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = keyPrefix + key.call(parent, data[i], i, data);
    if (node = nodeByKeyValue[keyValue]) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue[keyValue] = null;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && nodeByKeyValue[keyValues[i]] === node) {
      exit[i] = node;
    }
  }
}

var selection_data = function (value, key) {
  if (!value) {
    data = new Array(this.size()), j = -1;
    this.each(function (d) {
      data[++j] = d;
    });
    return data;
  }

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = constant$1(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = value.call(parent, parent && parent.__data__, j, parents),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength) {}
        previous._next = next || null;
      }
    }
  }

  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
};

var selection_exit = function () {
  return new Selection(this._exit || this._groups.map(sparse), this._parents);
};

var selection_merge = function (selection) {

  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection(merges, this._parents);
};

var selection_order = function () {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
};

var selection_sort = function (compare) {
  if (!compare) compare = ascending$1;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  return new Selection(sortgroups, this._parents).order();
};

function ascending$1(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

var selection_call = function () {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
};

var selection_nodes = function () {
  var nodes = new Array(this.size()),
      i = -1;
  this.each(function () {
    nodes[++i] = this;
  });
  return nodes;
};

var selection_node = function () {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
};

var selection_size = function () {
  var size = 0;
  this.each(function () {
    ++size;
  });
  return size;
};

var selection_empty = function () {
  return !this.node();
};

var selection_each = function (callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
};

function attrRemove(name) {
  return function () {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function () {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function () {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function () {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

var selection_attr = function (name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
  }

  return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
};

var window$1 = function (node) {
    return node.ownerDocument && node.ownerDocument.defaultView || // node is a Node
    node.document && node // node is a Window
    || node.defaultView; // node is a Document
};

function styleRemove(name) {
  return function () {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, value, priority) {
  return function () {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction(name, value, priority) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);else this.style.setProperty(name, v, priority);
  };
}

var selection_style = function (name, value, priority) {
  var node;
  return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : window$1(node = this.node()).getComputedStyle(node, null).getPropertyValue(name);
};

function propertyRemove(name) {
  return function () {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function () {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];else this[name] = v;
  };
}

var selection_property = function (name, value) {
  return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
};

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function add(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function remove(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function contains(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node),
      i = -1,
      n = names.length;
  while (++i < n) {
    list.add(names[i]);
  }
}

function classedRemove(node, names) {
  var list = classList(node),
      i = -1,
      n = names.length;
  while (++i < n) {
    list.remove(names[i]);
  }
}

function classedTrue(names) {
  return function () {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function () {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function () {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

var selection_classed = function (name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()),
        i = -1,
        n = names.length;
    while (++i < n) {
      if (!list.contains(names[i])) return false;
    }return true;
  }

  return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
};

function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function () {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function () {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

var selection_text = function (value) {
  return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
};

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function () {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function () {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

var selection_html = function (value) {
  return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
};

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

var selection_raise = function () {
  return this.each(raise);
};

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

var selection_lower = function () {
  return this.each(lower);
};

var selection_append = function (name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function () {
    return this.appendChild(create.apply(this, arguments));
  });
};

function constantNull() {
  return null;
}

var selection_insert = function (name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function () {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
};

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

var selection_remove = function () {
  return this.each(remove);
};

var selection_datum = function (value) {
    return arguments.length ? this.property("__data__", value) : this.node().__data__;
};

function dispatchEvent(node, type, params) {
  var window = window$1(node),
      event = window.CustomEvent;

  if (event) {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function () {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function () {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

var selection_dispatch = function (type, params) {
  return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
};

var root = [null];

function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection([[document.documentElement]], root);
}

Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: selection_select,
  selectAll: selection_selectAll,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  merge: selection_merge,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch
};

var select = function (selector) {
    return typeof selector === "string" ? new Selection([[document.querySelector(selector)]], [document.documentElement]) : new Selection([[selector]], root);
};

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

function color(format) {
  var m;
  format = (format + "").trim().toLowerCase();
  return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb(m >> 8 & 0xf | m >> 4 & 0x0f0, m >> 4 & 0xf | m & 0xf0, (m & 0xf) << 4 | m & 0xf, 1) // #f00
  ) : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
  : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
  : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
  : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
  : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
  : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
  : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
  : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
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
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min,
      l = (max + min) / 2;
  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;else if (g === max) h = (b - r) / s + 2;else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
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

var constant$3 = function (x) {
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
  return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$3(isNaN(a) ? b : a);
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function (a, b) {
    return b - a ? exponential(a, b, y) : constant$3(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant$3(isNaN(a) ? b : a);
}

var interpolateRgb = ((function rgbGamma(y) {
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

var array$1 = function (a, b) {
  var nb = b ? b.length : 0,
      na = a ? Math.min(nb, a.length) : 0,
      x = new Array(nb),
      c = new Array(nb),
      i;

  for (i = 0; i < na; ++i) {
    x[i] = interpolateValue(a[i], b[i]);
  }for (; i < nb; ++i) {
    c[i] = b[i];
  }return function (t) {
    for (i = 0; i < na; ++i) {
      c[i] = x[i](t);
    }return c;
  };
};

var date = function (a, b) {
  var d = new Date();
  return a = +a, b -= a, function (t) {
    return d.setTime(a + b * t), d;
  };
};

var reinterpolate = function (a, b) {
  return a = +a, b -= a, function (t) {
    return a + b * t;
  };
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var object = function (a, b) {
  var i = {},
      c = {},
      k;

  if (a === null || (typeof a === "undefined" ? "undefined" : _typeof(a)) !== "object") a = {};
  if (b === null || (typeof b === "undefined" ? "undefined" : _typeof(b)) !== "object") b = {};

  for (k in b) {
    if (k in a) {
      i[k] = interpolateValue(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }

  return function (t) {
    for (k in i) {
      c[k] = i[k](t);
    }return c;
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

var interpolateString = function (a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0,
      // scan index for next number in b
  am,
      // current match in a
  bm,
      // current match in b
  bs,
      // string preceding current number in b, if any
  i = -1,
      // index in s
  s = [],
      // string constants and placeholders
  q = []; // number interpolators

  // Coerce inputs to strings.
  a = a + "", b = b + "";

  // Interpolate pairs of numbers in a & b.
  while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) {
      // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) {
      // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else {
      // interpolate non-matching numbers
      s[++i] = null;
      q.push({ i: i, x: reinterpolate(am, bm) });
    }
    bi = reB.lastIndex;
  }

  // Add remains of b.
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  }

  // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.
  return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function (t) {
    for (var i = 0, o; i < b; ++i) {
      s[(o = q[i]).i] = o.x(t);
    }return s.join("");
  });
};

var interpolateValue = function (a, b) {
    var t = typeof b === "undefined" ? "undefined" : _typeof(b),
        c;
    return b == null || t === "boolean" ? constant$3(b) : (t === "number" ? reinterpolate : t === "string" ? (c = color(b)) ? (b = c, interpolateRgb) : interpolateString : b instanceof color ? interpolateRgb : b instanceof Date ? date : Array.isArray(b) ? array$1 : isNaN(b) ? object : reinterpolate)(a, b);
};

var interpolateRound = function (a, b) {
  return a = +a, b -= a, function (t) {
    return Math.round(a + b * t);
  };
};

var degrees = 180 / Math.PI;

var identity$2 = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};

var decompose = function (a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX: scaleX,
    scaleY: scaleY
  };
};

var cssNode;
var cssRoot;
var cssView;
var svgNode;

function parseCss(value) {
  if (value === "none") return identity$2;
  if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
  cssNode.style.transform = value;
  value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
  cssRoot.removeChild(cssNode);
  value = value.slice(7, -1).split(",");
  return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
}

function parseSvg(value) {
  if (value == null) return identity$2;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return identity$2;
  value = value.matrix;
  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
}

function interpolateTransform(parse, pxComma, pxParen, degParen) {

  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }

  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({ i: i - 4, x: reinterpolate(xa, xb) }, { i: i - 2, x: reinterpolate(ya, yb) });
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }

  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180) b += 360;else if (b - a > 180) a += 360; // shortest path
      q.push({ i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: reinterpolate(a, b) });
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }

  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({ i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: reinterpolate(a, b) });
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }

  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({ i: i - 4, x: reinterpolate(xa, xb) }, { i: i - 2, x: reinterpolate(ya, yb) });
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }

  return function (a, b) {
    var s = [],
        // string constants and placeholders
    q = []; // number interpolators
    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null; // gc
    return function (t) {
      var i = -1,
          n = q.length,
          o;
      while (++i < n) {
        s[(o = q[i]).i] = o.x(t);
      }return s.join("");
    };
  };
}

var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

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

var frame = 0;
var timeout = 0;
var interval = 0;
var pokeDelay = 1000;
var taskHead;
var taskTail;
var clockLast = 0;
var clockNow = 0;
var clockSkew = 0;
var clock = (typeof performance === "undefined" ? "undefined" : _typeof(performance)) === "object" && performance.now ? performance : Date;
var setFrame = typeof requestAnimationFrame === "function" ? requestAnimationFrame : function (f) {
  setTimeout(f, 17);
};

function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}

function clearNow() {
  clockNow = 0;
}

function Timer() {
  this._call = this._time = this._next = null;
}

Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function restart(callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;else taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function stop() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};

function timer(callback, delay, time) {
  var t = new Timer();
  t.restart(callback, delay, time);
  return t;
}

function timerFlush() {
  now(); // Get the current time, if not already set.
  ++frame; // Pretend we’ve set an alarm, if we haven’t already.
  var t = taskHead,
      e;
  while (t) {
    if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
    t = t._next;
  }
  --frame;
}

function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}

function poke() {
  var now = clock.now(),
      delay = now - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
}

function nap() {
  var t0,
      t1 = taskHead,
      t2,
      time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}

function sleep(time) {
  if (frame) return; // Soonest alarm already set, or will be.
  if (timeout) timeout = clearTimeout(timeout);
  var delay = time - clockNow;
  if (delay > 24) {
    if (time < Infinity) timeout = setTimeout(wake, delay);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) clockLast = clockNow, interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}

var timeout$1 = function (callback, delay, time) {
  var t = new Timer();
  delay = delay == null ? 0 : +delay;
  t.restart(function (elapsed) {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
};

var emptyOn = dispatch("start", "end", "interrupt");
var emptyTween = [];

var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;

var schedule = function (node, name, id, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};else if (id in schedules) return;
  create(node, id, {
    name: name,
    index: index, // For context during callback.
    group: group, // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
};

function init$1(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id]) || schedule.state > CREATED) throw new Error("too late");
  return schedule;
}

function set$2(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id]) || schedule.state > STARTING) throw new Error("too late");
  return schedule;
}

function get$2(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id])) throw new Error("too late");
  return schedule;
}

function create(node, id, self) {
  var schedules = node.__transition,
      tween;

  // Initialize the self timer when the transition is created.
  // Note the actual delay is not known until the first callback!
  schedules[id] = self;
  self.timer = timer(schedule, 0, self.time);

  function schedule(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start, self.delay, self.time);

    // If the elapsed delay is less than our first sleep, start immediately.
    if (self.delay <= elapsed) start(elapsed - self.delay);
  }

  function start(elapsed) {
    var i, j, n, o;

    // If the state is not SCHEDULED, then we previously errored on start.
    if (self.state !== SCHEDULED) return stop();

    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name) continue;

      // While this element already has a starting transition during this frame,
      // defer starting an interrupting transition until that transition has a
      // chance to tick (and possibly end); see d3/d3-transition#54!
      if (o.state === STARTED) return timeout$1(start);

      // Interrupt the active transition, if any.
      // Dispatch the interrupt event.
      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }

      // Cancel any pre-empted transitions. No interrupt event is dispatched
      // because the cancelled transitions never started. Note that this also
      // removes this transition from the pending list!
      else if (+i < id) {
          o.state = ENDED;
          o.timer.stop();
          delete schedules[i];
        }
    }

    // Defer the first tick to end of the current frame; see d3/d3#1576.
    // Note the transition may be canceled after start and before the first tick!
    // Note this must be scheduled before the start event; see d3/d3-transition#16!
    // Assuming this is successful, subsequent callbacks go straight to tick.
    timeout$1(function () {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    });

    // Dispatch the start event.
    // Note this must be done before the tween are initialized.
    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING) return; // interrupted
    self.state = STARTED;

    // Initialize the tween, deleting null tween.
    tween = new Array(n = self.tween.length);
    for (i = 0, j = -1; i < n; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }
    tween.length = j + 1;
  }

  function tick(elapsed) {
    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
        i = -1,
        n = tween.length;

    while (++i < n) {
      tween[i].call(null, t);
    }

    // Dispatch the end event.
    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }

  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id];
    for (var i in schedules) {
      return;
    } // eslint-disable-line no-unused-vars
    delete node.__transition;
  }
}

var interrupt = function (node, name) {
  var schedules = node.__transition,
      schedule,
      active,
      empty = true,
      i;

  if (!schedules) return;

  name = name == null ? null : name + "";

  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) {
      empty = false;continue;
    }
    active = schedule.state > STARTING && schedule.state < ENDING;
    schedule.state = ENDED;
    schedule.timer.stop();
    if (active) schedule.on.call("interrupt", node, node.__data__, schedule.index, schedule.group);
    delete schedules[i];
  }

  if (empty) delete node.__transition;
};

var selection_interrupt = function (name) {
  return this.each(function () {
    interrupt(this, name);
  });
};

function tweenRemove(id, name) {
  var tween0, tween1;
  return function () {
    var schedule = set$2(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }

    schedule.tween = tween1;
  };
}

function tweenFunction(id, name, value) {
  var tween0, tween1;
  if (typeof value !== "function") throw new Error();
  return function () {
    var schedule = set$2(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t = { name: name, value: value }, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }
      if (i === n) tween1.push(t);
    }

    schedule.tween = tween1;
  };
}

var transition_tween = function (name, value) {
  var id = this._id;

  name += "";

  if (arguments.length < 2) {
    var tween = get$2(this.node(), id).tween;
    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }
    return null;
  }

  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
};

function tweenValue(transition, name, value) {
  var id = transition._id;

  transition.each(function () {
    var schedule = set$2(this, id);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  });

  return function (node) {
    return get$2(node, id).value[name];
  };
}

var interpolate$$1 = function (a, b) {
    var c;
    return (typeof b === "number" ? reinterpolate : b instanceof color ? interpolateRgb : (c = color(b)) ? (b = c, interpolateRgb) : interpolateString)(a, b);
};

function attrRemove$1(name) {
  return function () {
    this.removeAttribute(name);
  };
}

function attrRemoveNS$1(fullname) {
  return function () {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant$1(name, interpolate$$1, value1) {
  var value00, interpolate0;
  return function () {
    var value0 = this.getAttribute(name);
    return value0 === value1 ? null : value0 === value00 ? interpolate0 : interpolate0 = interpolate$$1(value00 = value0, value1);
  };
}

function attrConstantNS$1(fullname, interpolate$$1, value1) {
  var value00, interpolate0;
  return function () {
    var value0 = this.getAttributeNS(fullname.space, fullname.local);
    return value0 === value1 ? null : value0 === value00 ? interpolate0 : interpolate0 = interpolate$$1(value00 = value0, value1);
  };
}

function attrFunction$1(name, interpolate$$1, value) {
  var value00, value10, interpolate0;
  return function () {
    var value0,
        value1 = value(this);
    if (value1 == null) return void this.removeAttribute(name);
    value0 = this.getAttribute(name);
    return value0 === value1 ? null : value0 === value00 && value1 === value10 ? interpolate0 : interpolate0 = interpolate$$1(value00 = value0, value10 = value1);
  };
}

function attrFunctionNS$1(fullname, interpolate$$1, value) {
  var value00, value10, interpolate0;
  return function () {
    var value0,
        value1 = value(this);
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    value0 = this.getAttributeNS(fullname.space, fullname.local);
    return value0 === value1 ? null : value0 === value00 && value1 === value10 ? interpolate0 : interpolate0 = interpolate$$1(value00 = value0, value10 = value1);
  };
}

var transition_attr = function (name, value) {
  var fullname = namespace(name),
      i = fullname === "transform" ? interpolateTransformSvg : interpolate$$1;
  return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS$1 : attrRemove$1)(fullname) : (fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, i, value + ""));
};

function attrTweenNS(fullname, value) {
  function tween() {
    var node = this,
        i = value.apply(node, arguments);
    return i && function (t) {
      node.setAttributeNS(fullname.space, fullname.local, i(t));
    };
  }
  tween._value = value;
  return tween;
}

function attrTween(name, value) {
  function tween() {
    var node = this,
        i = value.apply(node, arguments);
    return i && function (t) {
      node.setAttribute(name, i(t));
    };
  }
  tween._value = value;
  return tween;
}

var transition_attrTween = function (name, value) {
  var key = "attr." + name;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  var fullname = namespace(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
};

function delayFunction(id, value) {
  return function () {
    init$1(this, id).delay = +value.apply(this, arguments);
  };
}

function delayConstant(id, value) {
  return value = +value, function () {
    init$1(this, id).delay = value;
  };
}

var transition_delay = function (value) {
  var id = this._id;

  return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id, value)) : get$2(this.node(), id).delay;
};

function durationFunction(id, value) {
  return function () {
    set$2(this, id).duration = +value.apply(this, arguments);
  };
}

function durationConstant(id, value) {
  return value = +value, function () {
    set$2(this, id).duration = value;
  };
}

var transition_duration = function (value) {
  var id = this._id;

  return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id, value)) : get$2(this.node(), id).duration;
};

function easeConstant(id, value) {
  if (typeof value !== "function") throw new Error();
  return function () {
    set$2(this, id).ease = value;
  };
}

var transition_ease = function (value) {
  var id = this._id;

  return arguments.length ? this.each(easeConstant(id, value)) : get$2(this.node(), id).ease;
};

var transition_filter = function (match) {
  if (typeof match !== "function") match = matcher$1(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Transition(subgroups, this._parents, this._name, this._id);
};

var transition_merge = function (transition) {
  if (transition._id !== this._id) throw new Error();

  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Transition(merges, this._parents, this._name, this._id);
};

function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function (t) {
    var i = t.indexOf(".");
    if (i >= 0) t = t.slice(0, i);
    return !t || t === "start";
  });
}

function onFunction(id, name, listener) {
  var on0,
      on1,
      sit = start(name) ? init$1 : set$2;
  return function () {
    var schedule = sit(this, id),
        on = schedule.on;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

    schedule.on = on1;
  };
}

var transition_on = function (name, listener) {
  var id = this._id;

  return arguments.length < 2 ? get$2(this.node(), id).on.on(name) : this.each(onFunction(id, name, listener));
};

function removeFunction(id) {
  return function () {
    var parent = this.parentNode;
    for (var i in this.__transition) {
      if (+i !== id) return;
    }if (parent) parent.removeChild(this);
  };
}

var transition_remove = function () {
  return this.on("end.remove", removeFunction(this._id));
};

var transition_select = function (select$$1) {
  var name = this._name,
      id = this._id;

  if (typeof select$$1 !== "function") select$$1 = selector(select$$1);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select$$1.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule(subgroup[i], name, id, i, subgroup, get$2(node, id));
      }
    }
  }

  return new Transition(subgroups, this._parents, name, id);
};

var transition_selectAll = function (select$$1) {
  var name = this._name,
      id = this._id;

  if (typeof select$$1 !== "function") select$$1 = selectorAll(select$$1);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children = select$$1.call(node, node.__data__, i, group), child, inherit = get$2(node, id), k = 0, l = children.length; k < l; ++k) {
          if (child = children[k]) {
            schedule(child, name, id, k, children, inherit);
          }
        }
        subgroups.push(children);
        parents.push(node);
      }
    }
  }

  return new Transition(subgroups, parents, name, id);
};

var Selection$1 = selection.prototype.constructor;

var transition_selection = function () {
  return new Selection$1(this._groups, this._parents);
};

function styleRemove$1(name, interpolate$$2) {
    var value00, value10, interpolate0;
    return function () {
        var style = window$1(this).getComputedStyle(this, null),
            value0 = style.getPropertyValue(name),
            value1 = (this.style.removeProperty(name), style.getPropertyValue(name));
        return value0 === value1 ? null : value0 === value00 && value1 === value10 ? interpolate0 : interpolate0 = interpolate$$2(value00 = value0, value10 = value1);
    };
}

function styleRemoveEnd(name) {
    return function () {
        this.style.removeProperty(name);
    };
}

function styleConstant$1(name, interpolate$$2, value1) {
    var value00, interpolate0;
    return function () {
        var value0 = window$1(this).getComputedStyle(this, null).getPropertyValue(name);
        return value0 === value1 ? null : value0 === value00 ? interpolate0 : interpolate0 = interpolate$$2(value00 = value0, value1);
    };
}

function styleFunction$1(name, interpolate$$2, value) {
    var value00, value10, interpolate0;
    return function () {
        var style = window$1(this).getComputedStyle(this, null),
            value0 = style.getPropertyValue(name),
            value1 = value(this);
        if (value1 == null) value1 = (this.style.removeProperty(name), style.getPropertyValue(name));
        return value0 === value1 ? null : value0 === value00 && value1 === value10 ? interpolate0 : interpolate0 = interpolate$$2(value00 = value0, value10 = value1);
    };
}

var transition_style = function (name, value, priority) {
    var i = (name += "") === "transform" ? interpolateTransformCss : interpolate$$1;
    return value == null ? this.styleTween(name, styleRemove$1(name, i)).on("end.style." + name, styleRemoveEnd(name)) : this.styleTween(name, typeof value === "function" ? styleFunction$1(name, i, tweenValue(this, "style." + name, value)) : styleConstant$1(name, i, value + ""), priority);
};

function styleTween(name, value, priority) {
  function tween() {
    var node = this,
        i = value.apply(node, arguments);
    return i && function (t) {
      node.style.setProperty(name, i(t), priority);
    };
  }
  tween._value = value;
  return tween;
}

var transition_styleTween = function (name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
};

function textConstant$1(value) {
  return function () {
    this.textContent = value;
  };
}

function textFunction$1(value) {
  return function () {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}

var transition_text = function (value) {
  return this.tween("text", typeof value === "function" ? textFunction$1(tweenValue(this, "text", value)) : textConstant$1(value == null ? "" : value + ""));
};

var transition_transition = function () {
  var name = this._name,
      id0 = this._id,
      id1 = newId();

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit = get$2(node, id0);
        schedule(node, name, id1, i, group, {
          time: inherit.time + inherit.delay + inherit.duration,
          delay: 0,
          duration: inherit.duration,
          ease: inherit.ease
        });
      }
    }
  }

  return new Transition(groups, this._parents, name, id1);
};

var id = 0;

function Transition(groups, parents, name, id) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id;
}

function transition(name) {
  return selection().transition(name);
}

function newId() {
  return ++id;
}

var selection_prototype = selection.prototype;

Transition.prototype = transition.prototype = {
  constructor: Transition,
  select: transition_select,
  selectAll: transition_selectAll,
  filter: transition_filter,
  merge: transition_merge,
  selection: transition_selection,
  transition: transition_transition,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: transition_on,
  attr: transition_attr,
  attrTween: transition_attrTween,
  style: transition_style,
  styleTween: transition_styleTween,
  text: transition_text,
  remove: transition_remove,
  tween: transition_tween,
  delay: transition_delay,
  duration: transition_duration,
  ease: transition_ease
};

function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}

var exponent = 3;

var polyIn = function custom(e) {
  e = +e;

  function polyIn(t) {
    return Math.pow(t, e);
  }

  polyIn.exponent = custom;

  return polyIn;
}(exponent);

var polyOut = function custom(e) {
  e = +e;

  function polyOut(t) {
    return 1 - Math.pow(1 - t, e);
  }

  polyOut.exponent = custom;

  return polyOut;
}(exponent);

var polyInOut = function custom(e) {
  e = +e;

  function polyInOut(t) {
    return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
  }

  polyInOut.exponent = custom;

  return polyInOut;
}(exponent);

var overshoot = 1.70158;

var backIn = function custom(s) {
  s = +s;

  function backIn(t) {
    return t * t * ((s + 1) * t - s);
  }

  backIn.overshoot = custom;

  return backIn;
}(overshoot);

var backOut = function custom(s) {
  s = +s;

  function backOut(t) {
    return --t * t * ((s + 1) * t + s) + 1;
  }

  backOut.overshoot = custom;

  return backOut;
}(overshoot);

var backInOut = function custom(s) {
  s = +s;

  function backInOut(t) {
    return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
  }

  backInOut.overshoot = custom;

  return backInOut;
}(overshoot);

var tau = 2 * Math.PI;
var amplitude = 1;
var period = 0.3;

var elasticIn = function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

  function elasticIn(t) {
    return a * Math.pow(2, 10 * --t) * Math.sin((s - t) / p);
  }

  elasticIn.amplitude = function (a) {
    return custom(a, p * tau);
  };
  elasticIn.period = function (p) {
    return custom(a, p);
  };

  return elasticIn;
}(amplitude, period);

var elasticOut = function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

  function elasticOut(t) {
    return 1 - a * Math.pow(2, -10 * (t = +t)) * Math.sin((t + s) / p);
  }

  elasticOut.amplitude = function (a) {
    return custom(a, p * tau);
  };
  elasticOut.period = function (p) {
    return custom(a, p);
  };

  return elasticOut;
}(amplitude, period);

var elasticInOut = function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

  function elasticInOut(t) {
    return ((t = t * 2 - 1) < 0 ? a * Math.pow(2, 10 * t) * Math.sin((s - t) / p) : 2 - a * Math.pow(2, -10 * t) * Math.sin((s + t) / p)) / 2;
  }

  elasticInOut.amplitude = function (a) {
    return custom(a, p * tau);
  };
  elasticInOut.period = function (p) {
    return custom(a, p);
  };

  return elasticInOut;
}(amplitude, period);

var defaultTiming = {
  time: null, // Set on use.
  delay: 0,
  duration: 250,
  ease: cubicInOut
};

function inherit(node, id) {
  var timing;
  while (!(timing = node.__transition) || !(timing = timing[id])) {
    if (!(node = node.parentNode)) {
      return defaultTiming.time = now(), defaultTiming;
    }
  }
  return timing;
}

var selection_transition = function (name) {
  var id, timing;

  if (name instanceof Transition) {
    id = name._id, name = name._name;
  } else {
    id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
  }

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        schedule(node, name, id, i, group, timing || inherit(node, id));
      }
    }
  }

  return new Transition(groups, this._parents, name, id);
};

selection.prototype.interrupt = selection_interrupt;
selection.prototype.transition = selection_transition;

var X = {
  name: "x",
  handles: ["e", "w"].map(type),
  input: function input(x, e) {
    return x && [[x[0], e[0][1]], [x[1], e[1][1]]];
  },
  output: function output(xy) {
    return xy && [xy[0][0], xy[1][0]];
  }
};

var Y = {
  name: "y",
  handles: ["n", "s"].map(type),
  input: function input(y, e) {
    return y && [[e[0][0], y[0]], [e[1][0], y[1]]];
  },
  output: function output(xy) {
    return xy && [xy[0][1], xy[1][1]];
  }
};

var XY = {
  name: "xy",
  handles: ["n", "e", "s", "w", "nw", "ne", "se", "sw"].map(type),
  input: function input(xy) {
    return xy;
  },
  output: function output(xy) {
    return xy;
  }
};

function type(t) {
  return { type: t };
}

var pi$1 = Math.PI;

var tau$1 = pi$1 * 2;
var max$1 = Math.max;

var pi$2 = Math.PI;
var tau$2 = 2 * pi$2;
var epsilon$1 = 1e-6;
var tauEpsilon = tau$2 - epsilon$1;

function Path() {
  this._x0 = this._y0 = // start of current subpath
  this._x1 = this._y1 = null; // end of current subpath
  this._ = "";
}

function path() {
  return new Path();
}

Path.prototype = path.prototype = {
  constructor: Path,
  moveTo: function moveTo(x, y) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
  },
  closePath: function closePath() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._ += "Z";
    }
  },
  lineTo: function lineTo(x, y) {
    this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  quadraticCurveTo: function quadraticCurveTo(x1, y1, x, y) {
    this._ += "Q" + +x1 + "," + +y1 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  bezierCurveTo: function bezierCurveTo(x1, y1, x2, y2, x, y) {
    this._ += "C" + +x1 + "," + +y1 + "," + +x2 + "," + +y2 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  arcTo: function arcTo(x1, y1, x2, y2, r) {
    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
    var x0 = this._x1,
        y0 = this._y1,
        x21 = x2 - x1,
        y21 = y2 - y1,
        x01 = x0 - x1,
        y01 = y0 - y1,
        l01_2 = x01 * x01 + y01 * y01;

    // Is the radius negative? Error.
    if (r < 0) throw new Error("negative radius: " + r);

    // Is this path empty? Move to (x1,y1).
    if (this._x1 === null) {
      this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
    }

    // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
    else if (!(l01_2 > epsilon$1)) {}

      // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
      // Equivalently, is (x1,y1) coincident with (x2,y2)?
      // Or, is the radius zero? Line to (x1,y1).
      else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon$1) || !r) {
          this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
        }

        // Otherwise, draw an arc!
        else {
            var x20 = x2 - x0,
                y20 = y2 - y0,
                l21_2 = x21 * x21 + y21 * y21,
                l20_2 = x20 * x20 + y20 * y20,
                l21 = Math.sqrt(l21_2),
                l01 = Math.sqrt(l01_2),
                l = r * Math.tan((pi$2 - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
                t01 = l / l01,
                t21 = l / l21;

            // If the start tangent is not coincident with (x0,y0), line to.
            if (Math.abs(t01 - 1) > epsilon$1) {
              this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
            }

            this._ += "A" + r + "," + r + ",0,0," + +(y01 * x20 > x01 * y20) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
          }
  },
  arc: function arc(x, y, r, a0, a1, ccw) {
    x = +x, y = +y, r = +r;
    var dx = r * Math.cos(a0),
        dy = r * Math.sin(a0),
        x0 = x + dx,
        y0 = y + dy,
        cw = 1 ^ ccw,
        da = ccw ? a0 - a1 : a1 - a0;

    // Is the radius negative? Error.
    if (r < 0) throw new Error("negative radius: " + r);

    // Is this path empty? Move to (x0,y0).
    if (this._x1 === null) {
      this._ += "M" + x0 + "," + y0;
    }

    // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
    else if (Math.abs(this._x1 - x0) > epsilon$1 || Math.abs(this._y1 - y0) > epsilon$1) {
        this._ += "L" + x0 + "," + y0;
      }

    // Is this arc empty? We’re done.
    if (!r) return;

    // Does the angle go the wrong way? Flip the direction.
    if (da < 0) da = da % tau$2 + tau$2;

    // Is this a complete circle? Draw two arcs to complete the circle.
    if (da > tauEpsilon) {
      this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
    }

    // Is this arc non-empty? Draw an arc!
    else if (da > epsilon$1) {
        this._ += "A" + r + "," + r + ",0," + +(da >= pi$2) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
      }
  },
  rect: function rect(x, y, w, h) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + +w + "v" + +h + "h" + -w + "Z";
  },
  toString: function toString() {
    return this._;
  }
};

var prefix = "$";

function Map() {}

Map.prototype = map$1.prototype = {
  constructor: Map,
  has: function has(key) {
    return prefix + key in this;
  },
  get: function get(key) {
    return this[prefix + key];
  },
  set: function set(key, value) {
    this[prefix + key] = value;
    return this;
  },
  remove: function remove(key) {
    var property = prefix + key;
    return property in this && delete this[property];
  },
  clear: function clear() {
    for (var property in this) {
      if (property[0] === prefix) delete this[property];
    }
  },
  keys: function keys() {
    var keys = [];
    for (var property in this) {
      if (property[0] === prefix) keys.push(property.slice(1));
    }return keys;
  },
  values: function values() {
    var values = [];
    for (var property in this) {
      if (property[0] === prefix) values.push(this[property]);
    }return values;
  },
  entries: function entries() {
    var entries = [];
    for (var property in this) {
      if (property[0] === prefix) entries.push({ key: property.slice(1), value: this[property] });
    }return entries;
  },
  size: function size() {
    var size = 0;
    for (var property in this) {
      if (property[0] === prefix) ++size;
    }return size;
  },
  empty: function empty() {
    for (var property in this) {
      if (property[0] === prefix) return false;
    }return true;
  },
  each: function each(f) {
    for (var property in this) {
      if (property[0] === prefix) f(this[property], property.slice(1), this);
    }
  }
};

function map$1(object, f) {
  var map = new Map();

  // Copy constructor.
  if (object instanceof Map) object.each(function (value, key) {
    map.set(key, value);
  });

  // Index array by numeric index or specified key function.
  else if (Array.isArray(object)) {
      var i = -1,
          n = object.length,
          o;

      if (f == null) while (++i < n) {
        map.set(i, object[i]);
      } else while (++i < n) {
        map.set(f(o = object[i], i, object), o);
      }
    }

    // Convert object to map.
    else if (object) for (var key in object) {
        map.set(key, object[key]);
      }return map;
}

function Set() {}

var proto = map$1.prototype;

Set.prototype = set$3.prototype = {
  constructor: Set,
  has: proto.has,
  add: function add(value) {
    value += "";
    this[prefix + value] = value;
    return this;
  },
  remove: proto.remove,
  clear: proto.clear,
  values: proto.keys,
  size: proto.size,
  empty: proto.empty,
  each: proto.each
};

function set$3(object, f) {
  var set = new Set();

  // Copy constructor.
  if (object instanceof Set) object.each(function (value) {
    set.add(value);
  });

  // Otherwise, assume it’s an array.
  else if (object) {
      var i = -1,
          n = object.length;
      if (f == null) while (++i < n) {
        set.add(object[i]);
      } else while (++i < n) {
        set.add(f(object[i], i, object));
      }
    }

  return set;
}

var keys = function (map) {
  var keys = [];
  for (var key in map) {
    keys.push(key);
  }return keys;
};

function objectConverter(columns) {
  return new Function("d", "return {" + columns.map(function (name, i) {
    return JSON.stringify(name) + ": d[" + i + "]";
  }).join(",") + "}");
}

function customConverter(columns, f) {
  var object = objectConverter(columns);
  return function (row, i) {
    return f(object(row), i, columns);
  };
}

// Compute unique columns in order of discovery.
function inferColumns(rows) {
  var columnSet = Object.create(null),
      columns = [];

  rows.forEach(function (row) {
    for (var column in row) {
      if (!(column in columnSet)) {
        columns.push(columnSet[column] = column);
      }
    }
  });

  return columns;
}

var dsv = function (delimiter) {
  var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
      delimiterCode = delimiter.charCodeAt(0);

  function parse(text, f) {
    var convert,
        columns,
        rows = parseRows(text, function (row, i) {
      if (convert) return convert(row, i - 1);
      columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
    });
    rows.columns = columns;
    return rows;
  }

  function parseRows(text, f) {
    var EOL = {},
        // sentinel value for end-of-line
    EOF = {},
        // sentinel value for end-of-file
    rows = [],
        // output rows
    N = text.length,
        I = 0,
        // current character index
    n = 0,
        // the current line number
    t,
        // the current token
    eol; // is the current token followed by EOL?

    function token() {
      if (I >= N) return EOF; // special case: end of file
      if (eol) return eol = false, EOL; // special case: end of line

      // special case: quotes
      var j = I,
          c;
      if (text.charCodeAt(j) === 34) {
        var i = j;
        while (i++ < N) {
          if (text.charCodeAt(i) === 34) {
            if (text.charCodeAt(i + 1) !== 34) break;
            ++i;
          }
        }
        I = i + 2;
        c = text.charCodeAt(i + 1);
        if (c === 13) {
          eol = true;
          if (text.charCodeAt(i + 2) === 10) ++I;
        } else if (c === 10) {
          eol = true;
        }
        return text.slice(j + 1, i).replace(/""/g, "\"");
      }

      // common case: find next delimiter or newline
      while (I < N) {
        var k = 1;
        c = text.charCodeAt(I++);
        if (c === 10) eol = true; // \n
        else if (c === 13) {
            eol = true;if (text.charCodeAt(I) === 10) ++I, ++k;
          } // \r|\r\n
          else if (c !== delimiterCode) continue;
        return text.slice(j, I - k);
      }

      // special case: last token before EOF
      return text.slice(j);
    }

    while ((t = token()) !== EOF) {
      var a = [];
      while (t !== EOL && t !== EOF) {
        a.push(t);
        t = token();
      }
      if (f && (a = f(a, n++)) == null) continue;
      rows.push(a);
    }

    return rows;
  }

  function format(rows, columns) {
    if (columns == null) columns = inferColumns(rows);
    return [columns.map(formatValue).join(delimiter)].concat(rows.map(function (row) {
      return columns.map(function (column) {
        return formatValue(row[column]);
      }).join(delimiter);
    })).join("\n");
  }

  function formatRows(rows) {
    return rows.map(formatRow).join("\n");
  }

  function formatRow(row) {
    return row.map(formatValue).join(delimiter);
  }

  function formatValue(text) {
    return text == null ? "" : reFormat.test(text += "") ? "\"" + text.replace(/\"/g, "\"\"") + "\"" : text;
  }

  return {
    parse: parse,
    parseRows: parseRows,
    format: format,
    formatRows: formatRows
  };
};

var csv = dsv(",");

var csvParse = csv.parse;

var tsv = dsv("\t");

var tsvParse = tsv.parse;

var tree_add = function (d) {
  var x = +this._x.call(null, d),
      y = +this._y.call(null, d);
  return add(this.cover(x, y), x, y, d);
};

function add(tree, x, y, d) {
  if (isNaN(x) || isNaN(y)) return tree; // ignore invalid points

  var parent,
      node = tree._root,
      leaf = { data: d },
      x0 = tree._x0,
      y0 = tree._y0,
      x1 = tree._x1,
      y1 = tree._y1,
      xm,
      ym,
      xp,
      yp,
      right,
      bottom,
      i,
      j;

  // If the tree is empty, initialize the root as a leaf.
  if (!node) return tree._root = leaf, tree;

  // Find the existing leaf for the new point, or add it.
  while (node.length) {
    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm;else x1 = xm;
    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym;else y1 = ym;
    if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
  }

  // Is the new point is exactly coincident with the existing point?
  xp = +tree._x.call(null, node.data);
  yp = +tree._y.call(null, node.data);
  if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;

  // Otherwise, split the leaf node until the old and new point are separated.
  do {
    parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm;else x1 = xm;
    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym;else y1 = ym;
  } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | xp >= xm));
  return parent[j] = node, parent[i] = leaf, tree;
}

function addAll(data) {
  var d,
      i,
      n = data.length,
      x,
      y,
      xz = new Array(n),
      yz = new Array(n),
      x0 = Infinity,
      y0 = Infinity,
      x1 = -Infinity,
      y1 = -Infinity;

  // Compute the points and their extent.
  for (i = 0; i < n; ++i) {
    if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
    xz[i] = x;
    yz[i] = y;
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }

  // If there were no (valid) points, inherit the existing extent.
  if (x1 < x0) x0 = this._x0, x1 = this._x1;
  if (y1 < y0) y0 = this._y0, y1 = this._y1;

  // Expand the tree to cover the new points.
  this.cover(x0, y0).cover(x1, y1);

  // Add the new points.
  for (i = 0; i < n; ++i) {
    add(this, xz[i], yz[i], data[i]);
  }

  return this;
}

var tree_cover = function (x, y) {
  if (isNaN(x = +x) || isNaN(y = +y)) return this; // ignore invalid points

  var x0 = this._x0,
      y0 = this._y0,
      x1 = this._x1,
      y1 = this._y1;

  // If the quadtree has no extent, initialize them.
  // Integer extent are necessary so that if we later double the extent,
  // the existing quadrant boundaries don’t change due to floating point error!
  if (isNaN(x0)) {
    x1 = (x0 = Math.floor(x)) + 1;
    y1 = (y0 = Math.floor(y)) + 1;
  }

  // Otherwise, double repeatedly to cover.
  else if (x0 > x || x > x1 || y0 > y || y > y1) {
      var z = x1 - x0,
          node = this._root,
          parent,
          i;

      switch (i = (y < (y0 + y1) / 2) << 1 | x < (x0 + x1) / 2) {
        case 0:
          {
            do {
              parent = new Array(4), parent[i] = node, node = parent;
            } while ((z *= 2, x1 = x0 + z, y1 = y0 + z, x > x1 || y > y1));
            break;
          }
        case 1:
          {
            do {
              parent = new Array(4), parent[i] = node, node = parent;
            } while ((z *= 2, x0 = x1 - z, y1 = y0 + z, x0 > x || y > y1));
            break;
          }
        case 2:
          {
            do {
              parent = new Array(4), parent[i] = node, node = parent;
            } while ((z *= 2, x1 = x0 + z, y0 = y1 - z, x > x1 || y0 > y));
            break;
          }
        case 3:
          {
            do {
              parent = new Array(4), parent[i] = node, node = parent;
            } while ((z *= 2, x0 = x1 - z, y0 = y1 - z, x0 > x || y0 > y));
            break;
          }
      }

      if (this._root && this._root.length) this._root = node;
    }

    // If the quadtree covers the point already, just return.
    else return this;

  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  return this;
};

var tree_data = function () {
  var data = [];
  this.visit(function (node) {
    if (!node.length) do {
      data.push(node.data);
    } while (node = node.next);
  });
  return data;
};

var tree_extent = function (_) {
    return arguments.length ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1]) : isNaN(this._x0) ? undefined : [[this._x0, this._y0], [this._x1, this._y1]];
};

var Quad = function (node, x0, y0, x1, y1) {
  this.node = node;
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
};

var tree_find = function (x, y, radius) {
  var data,
      x0 = this._x0,
      y0 = this._y0,
      x1,
      y1,
      x2,
      y2,
      x3 = this._x1,
      y3 = this._y1,
      quads = [],
      node = this._root,
      q,
      i;

  if (node) quads.push(new Quad(node, x0, y0, x3, y3));
  if (radius == null) radius = Infinity;else {
    x0 = x - radius, y0 = y - radius;
    x3 = x + radius, y3 = y + radius;
    radius *= radius;
  }

  while (q = quads.pop()) {

    // Stop searching if this quadrant can’t contain a closer node.
    if (!(node = q.node) || (x1 = q.x0) > x3 || (y1 = q.y0) > y3 || (x2 = q.x1) < x0 || (y2 = q.y1) < y0) continue;

    // Bisect the current quadrant.
    if (node.length) {
      var xm = (x1 + x2) / 2,
          ym = (y1 + y2) / 2;

      quads.push(new Quad(node[3], xm, ym, x2, y2), new Quad(node[2], x1, ym, xm, y2), new Quad(node[1], xm, y1, x2, ym), new Quad(node[0], x1, y1, xm, ym));

      // Visit the closest quadrant first.
      if (i = (y >= ym) << 1 | x >= xm) {
        q = quads[quads.length - 1];
        quads[quads.length - 1] = quads[quads.length - 1 - i];
        quads[quads.length - 1 - i] = q;
      }
    }

    // Visit this point. (Visiting coincident points isn’t necessary!)
    else {
        var dx = x - +this._x.call(null, node.data),
            dy = y - +this._y.call(null, node.data),
            d2 = dx * dx + dy * dy;
        if (d2 < radius) {
          var d = Math.sqrt(radius = d2);
          x0 = x - d, y0 = y - d;
          x3 = x + d, y3 = y + d;
          data = node.data;
        }
      }
  }

  return data;
};

var tree_remove = function (d) {
  if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this; // ignore invalid points

  var parent,
      node = this._root,
      retainer,
      previous,
      next,
      x0 = this._x0,
      y0 = this._y0,
      x1 = this._x1,
      y1 = this._y1,
      x,
      y,
      xm,
      ym,
      right,
      bottom,
      i,
      j;

  // If the tree is empty, initialize the root as a leaf.
  if (!node) return this;

  // Find the leaf node for the point.
  // While descending, also retain the deepest parent with a non-removed sibling.
  if (node.length) while (true) {
    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm;else x1 = xm;
    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym;else y1 = ym;
    if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
    if (!node.length) break;
    if (parent[i + 1 & 3] || parent[i + 2 & 3] || parent[i + 3 & 3]) retainer = parent, j = i;
  }

  // Find the point to remove.
  while (node.data !== d) {
    if (!(previous = node, node = node.next)) return this;
  }if (next = node.next) delete node.next;

  // If there are multiple coincident points, remove just the point.
  if (previous) return next ? previous.next = next : delete previous.next, this;

  // If this is the root point, remove it.
  if (!parent) return this._root = next, this;

  // Remove this leaf.
  next ? parent[i] = next : delete parent[i];

  // If the parent now contains exactly one leaf, collapse superfluous parents.
  if ((node = parent[0] || parent[1] || parent[2] || parent[3]) && node === (parent[3] || parent[2] || parent[1] || parent[0]) && !node.length) {
    if (retainer) retainer[j] = node;else this._root = node;
  }

  return this;
};

function removeAll(data) {
  for (var i = 0, n = data.length; i < n; ++i) {
    this.remove(data[i]);
  }return this;
}

var tree_root = function () {
  return this._root;
};

var tree_size = function () {
  var size = 0;
  this.visit(function (node) {
    if (!node.length) do {
      ++size;
    } while (node = node.next);
  });
  return size;
};

var tree_visit = function (callback) {
  var quads = [],
      q,
      node = this._root,
      child,
      x0,
      y0,
      x1,
      y1;
  if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
  while (q = quads.pop()) {
    if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
      var xm = (x0 + x1) / 2,
          ym = (y0 + y1) / 2;
      if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
      if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
      if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
      if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
    }
  }
  return this;
};

var tree_visitAfter = function (callback) {
  var quads = [],
      next = [],
      q;
  if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
  while (q = quads.pop()) {
    var node = q.node;
    if (node.length) {
      var child,
          x0 = q.x0,
          y0 = q.y0,
          x1 = q.x1,
          y1 = q.y1,
          xm = (x0 + x1) / 2,
          ym = (y0 + y1) / 2;
      if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
      if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
      if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
      if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
    }
    next.push(q);
  }
  while (q = next.pop()) {
    callback(q.node, q.x0, q.y0, q.x1, q.y1);
  }
  return this;
};

function defaultX(d) {
  return d[0];
}

var tree_x = function (_) {
  return arguments.length ? (this._x = _, this) : this._x;
};

function defaultY(d) {
  return d[1];
}

var tree_y = function (_) {
  return arguments.length ? (this._y = _, this) : this._y;
};

function quadtree(nodes, x, y) {
  var tree = new Quadtree(x == null ? defaultX : x, y == null ? defaultY : y, NaN, NaN, NaN, NaN);
  return nodes == null ? tree : tree.addAll(nodes);
}

function Quadtree(x, y, x0, y0, x1, y1) {
  this._x = x;
  this._y = y;
  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  this._root = undefined;
}

function leaf_copy(leaf) {
  var copy = { data: leaf.data },
      next = copy;
  while (leaf = leaf.next) {
    next = next.next = { data: leaf.data };
  }return copy;
}

var treeProto = quadtree.prototype = Quadtree.prototype;

treeProto.copy = function () {
  var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
      node = this._root,
      nodes,
      child;

  if (!node) return copy;

  if (!node.length) return copy._root = leaf_copy(node), copy;

  nodes = [{ source: node, target: copy._root = new Array(4) }];
  while (node = nodes.pop()) {
    for (var i = 0; i < 4; ++i) {
      if (child = node.source[i]) {
        if (child.length) nodes.push({ source: child, target: node.target[i] = new Array(4) });else node.target[i] = leaf_copy(child);
      }
    }
  }

  return copy;
};

treeProto.add = tree_add;
treeProto.addAll = addAll;
treeProto.cover = tree_cover;
treeProto.data = tree_data;
treeProto.extent = tree_extent;
treeProto.find = tree_find;
treeProto.remove = tree_remove;
treeProto.removeAll = removeAll;
treeProto.root = tree_root;
treeProto.size = tree_size;
treeProto.visit = tree_visit;
treeProto.visitAfter = tree_visitAfter;
treeProto.x = tree_x;
treeProto.y = tree_y;

// Computes the decimal coefficient and exponent of the specified number x with
// significant digits p, where x is positive and p is in [1, 21] or undefined.
// For example, formatDecimal(1.23) returns ["123", 0].
var formatDecimal = function (x, p) {
  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
  var i,
      coefficient = x.slice(0, i);

  // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
  return [coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient, +x.slice(i + 1)];
};

var exponent$1 = function (x) {
  return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
};

var formatGroup = function (grouping, thousands) {
  return function (value, width) {
    var i = value.length,
        t = [],
        j = 0,
        g = grouping[0],
        length = 0;

    while (i > 0 && g > 0) {
      if (length + g + 1 > width) g = Math.max(1, width - length);
      t.push(value.substring(i -= g, i + g));
      if ((length += g + 1) > width) break;
      g = grouping[j = (j + 1) % grouping.length];
    }

    return t.reverse().join(thousands);
  };
};

var formatNumerals = function (numerals) {
  return function (value) {
    return value.replace(/[0-9]/g, function (i) {
      return numerals[+i];
    });
  };
};

var formatDefault = function (x, p) {
  x = x.toPrecision(p);

  out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) {
    switch (x[i]) {
      case ".":
        i0 = i1 = i;break;
      case "0":
        if (i0 === 0) i0 = i;i1 = i;break;
      case "e":
        break out;
      default:
        if (i0 > 0) i0 = 0;break;
    }
  }

  return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
};

var prefixExponent;

var formatPrefixAuto = function (x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1],
        i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
        n = coefficient.length;
    return i === n ? coefficient : i > n ? coefficient + new Array(i - n + 1).join("0") : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i) : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
};

var formatRounded = function (x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1];
    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + new Array(exponent - coefficient.length + 2).join("0");
};

var formatTypes = {
  "": formatDefault,
  "%": function _(x, p) {
    return (x * 100).toFixed(p);
  },
  "b": function b(x) {
    return Math.round(x).toString(2);
  },
  "c": function c(x) {
    return x + "";
  },
  "d": function d(x) {
    return Math.round(x).toString(10);
  },
  "e": function e(x, p) {
    return x.toExponential(p);
  },
  "f": function f(x, p) {
    return x.toFixed(p);
  },
  "g": function g(x, p) {
    return x.toPrecision(p);
  },
  "o": function o(x) {
    return Math.round(x).toString(8);
  },
  "p": function p(x, _p) {
    return formatRounded(x * 100, _p);
  },
  "r": formatRounded,
  "s": formatPrefixAuto,
  "X": function X(x) {
    return Math.round(x).toString(16).toUpperCase();
  },
  "x": function x(_x) {
    return Math.round(_x).toString(16);
  }
};

// [[fill]align][sign][symbol][0][width][,][.precision][type]
var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;

function formatSpecifier(specifier) {
  return new FormatSpecifier(specifier);
}

formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

function FormatSpecifier(specifier) {
  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);

  var match,
      fill = match[1] || " ",
      align = match[2] || ">",
      sign = match[3] || "-",
      symbol = match[4] || "",
      zero = !!match[5],
      width = match[6] && +match[6],
      comma = !!match[7],
      precision = match[8] && +match[8].slice(1),
      type = match[9] || "";

  // The "n" type is an alias for ",g".
  if (type === "n") comma = true, type = "g";

  // Map invalid types to the default format.
  else if (!formatTypes[type]) type = "";

  // If zero fill is specified, padding goes after sign and before digits.
  if (zero || fill === "0" && align === "=") zero = true, fill = "0", align = "=";

  this.fill = fill;
  this.align = align;
  this.sign = sign;
  this.symbol = symbol;
  this.zero = zero;
  this.width = width;
  this.comma = comma;
  this.precision = precision;
  this.type = type;
}

FormatSpecifier.prototype.toString = function () {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width == null ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0)) + this.type;
};

var identity$3 = function (x) {
  return x;
};

var prefixes = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];

var formatLocale = function (locale) {
  var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$3,
      currency = locale.currency,
      decimal = locale.decimal,
      numerals = locale.numerals ? formatNumerals(locale.numerals) : identity$3,
      percent = locale.percent || "%";

  function newFormat(specifier) {
    specifier = formatSpecifier(specifier);

    var fill = specifier.fill,
        align = specifier.align,
        sign = specifier.sign,
        symbol = specifier.symbol,
        zero = specifier.zero,
        width = specifier.width,
        comma = specifier.comma,
        precision = specifier.precision,
        type = specifier.type;

    // Compute the prefix and suffix.
    // For SI-prefix, the suffix is lazily computed.
    var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
        suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? percent : "";

    // What format function should we use?
    // Is this an integer type?
    // Can this type generate exponential notation?
    var formatType = formatTypes[type],
        maybeSuffix = !type || /[defgprs%]/.test(type);

    // Set the default precision if not specified,
    // or clamp the specified precision to the supported range.
    // For significant precision, it must be in [1, 21].
    // For fixed precision, it must be in [0, 20].
    precision = precision == null ? type ? 6 : 12 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));

    function format(value) {
      var valuePrefix = prefix,
          valueSuffix = suffix,
          i,
          n,
          c;

      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value;

        // Perform the initial formatting.
        var valueNegative = value < 0;
        value = formatType(Math.abs(value), precision);

        // If a negative value rounds to zero during formatting, treat as positive.
        if (valueNegative && +value === 0) valueNegative = false;

        // Compute the prefix and suffix.
        valuePrefix = (valueNegative ? sign === "(" ? sign : "-" : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
        valueSuffix = valueSuffix + (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + (valueNegative && sign === "(" ? ")" : "");

        // Break the formatted value into the integer “value” part that can be
        // grouped, and fractional or exponential “suffix” part that is not.
        if (maybeSuffix) {
          i = -1, n = value.length;
          while (++i < n) {
            if (c = value.charCodeAt(i), 48 > c || c > 57) {
              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
              value = value.slice(0, i);
              break;
            }
          }
        }
      }

      // If the fill character is not "0", grouping is applied before padding.
      if (comma && !zero) value = group(value, Infinity);

      // Compute the padding.
      var length = valuePrefix.length + value.length + valueSuffix.length,
          padding = length < width ? new Array(width - length + 1).join(fill) : "";

      // If the fill character is "0", grouping is applied after padding.
      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

      // Reconstruct the final output based on the desired alignment.
      switch (align) {
        case "<":
          value = valuePrefix + value + valueSuffix + padding;break;
        case "=":
          value = valuePrefix + padding + value + valueSuffix;break;
        case "^":
          value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);break;
        default:
          value = padding + valuePrefix + value + valueSuffix;break;
      }

      return numerals(value);
    }

    format.toString = function () {
      return specifier + "";
    };

    return format;
  }

  function formatPrefix(specifier, value) {
    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
        e = Math.max(-8, Math.min(8, Math.floor(exponent$1(value) / 3))) * 3,
        k = Math.pow(10, -e),
        prefix = prefixes[8 + e / 3];
    return function (value) {
      return f(k * value) + prefix;
    };
  }

  return {
    format: newFormat,
    formatPrefix: formatPrefix
  };
};

var locale$1;
var format;
var formatPrefix;

defaultLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});

function defaultLocale(definition) {
  locale$1 = formatLocale(definition);
  format = locale$1.format;
  formatPrefix = locale$1.formatPrefix;
  return locale$1;
}

// Adds floating point numbers with twice the normal precision.
// Reference: J. R. Shewchuk, Adaptive Precision Floating-Point Arithmetic and
// Fast Robust Geometric Predicates, Discrete & Computational Geometry 18(3)
// 305–363 (1997).
// Code adapted from GeographicLib by Charles F. F. Karney,
// http://geographiclib.sourceforge.net/

var adder = function () {
  return new Adder();
};

function Adder() {
  this.reset();
}

Adder.prototype = {
  constructor: Adder,
  reset: function reset() {
    this.s = // rounded value
    this.t = 0; // exact error
  },
  add: function add(y) {
    _add(temp, y, this.t);
    _add(this, temp.s, this.s);
    if (this.s) this.t += temp.t;else this.s = temp.t;
  },
  valueOf: function valueOf() {
    return this.s;
  }
};

var temp = new Adder();

function _add(adder, a, b) {
  var x = adder.s = a + b,
      bv = x - a,
      av = x - bv;
  adder.t = a - av + (b - bv);
}

var epsilon$2 = 1e-6;

var pi$3 = Math.PI;
var halfPi$2 = pi$3 / 2;
var quarterPi = pi$3 / 4;
var tau$3 = pi$3 * 2;


var radians = pi$3 / 180;

var abs = Math.abs;
var atan = Math.atan;
var atan2 = Math.atan2;
var cos$1 = Math.cos;





var sin$1 = Math.sin;

var sqrt = Math.sqrt;


function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi$3 : Math.acos(x);
}

function asin(x) {
  return x > 1 ? halfPi$2 : x < -1 ? -halfPi$2 : Math.asin(x);
}

function noop$1() {}

function streamGeometry(geometry, stream) {
  if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) {
    streamGeometryType[geometry.type](geometry, stream);
  }
}

var streamObjectType = {
  Feature: function Feature(object, stream) {
    streamGeometry(object.geometry, stream);
  },
  FeatureCollection: function FeatureCollection(object, stream) {
    var features = object.features,
        i = -1,
        n = features.length;
    while (++i < n) {
      streamGeometry(features[i].geometry, stream);
    }
  }
};

var streamGeometryType = {
  Sphere: function Sphere(object, stream) {
    stream.sphere();
  },
  Point: function Point(object, stream) {
    object = object.coordinates;
    stream.point(object[0], object[1], object[2]);
  },
  MultiPoint: function MultiPoint(object, stream) {
    var coordinates = object.coordinates,
        i = -1,
        n = coordinates.length;
    while (++i < n) {
      object = coordinates[i], stream.point(object[0], object[1], object[2]);
    }
  },
  LineString: function LineString(object, stream) {
    streamLine(object.coordinates, stream, 0);
  },
  MultiLineString: function MultiLineString(object, stream) {
    var coordinates = object.coordinates,
        i = -1,
        n = coordinates.length;
    while (++i < n) {
      streamLine(coordinates[i], stream, 0);
    }
  },
  Polygon: function Polygon(object, stream) {
    streamPolygon(object.coordinates, stream);
  },
  MultiPolygon: function MultiPolygon(object, stream) {
    var coordinates = object.coordinates,
        i = -1,
        n = coordinates.length;
    while (++i < n) {
      streamPolygon(coordinates[i], stream);
    }
  },
  GeometryCollection: function GeometryCollection(object, stream) {
    var geometries = object.geometries,
        i = -1,
        n = geometries.length;
    while (++i < n) {
      streamGeometry(geometries[i], stream);
    }
  }
};

function streamLine(coordinates, stream, closed) {
  var i = -1,
      n = coordinates.length - closed,
      coordinate;
  stream.lineStart();
  while (++i < n) {
    coordinate = coordinates[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);
  }stream.lineEnd();
}

function streamPolygon(coordinates, stream) {
  var i = -1,
      n = coordinates.length;
  stream.polygonStart();
  while (++i < n) {
    streamLine(coordinates[i], stream, 1);
  }stream.polygonEnd();
}

var geoStream = function (object, stream) {
  if (object && streamObjectType.hasOwnProperty(object.type)) {
    streamObjectType[object.type](object, stream);
  } else {
    streamGeometry(object, stream);
  }
};

var areaRingSum = adder();

var areaSum = adder();
var lambda00;
var phi00;
var lambda0;
var cosPhi0;
var sinPhi0;

function cartesian(spherical) {
  var lambda = spherical[0],
      phi = spherical[1],
      cosPhi = cos$1(phi);
  return [cosPhi * cos$1(lambda), cosPhi * sin$1(lambda), sin$1(phi)];
}



function cartesianCross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

// TODO return a




// TODO return d
function cartesianNormalizeInPlace(d) {
  var l = sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
  d[0] /= l, d[1] /= l, d[2] /= l;
}

var lambda0$1;
var phi0;
var lambda1;
var phi1;
var lambda2;
var lambda00$1;
var phi00$1;
var p0;
var deltaSum = adder();
var ranges;
var range;

var W0;
var X0;
var Y0;
var Z0; // previous point

// Generates a circle centered at [0°, 0°], with a given radius and precision.

var clipBuffer = function () {
  var lines = [],
      line;
  return {
    point: function point(x, y) {
      line.push([x, y]);
    },
    lineStart: function lineStart() {
      lines.push(line = []);
    },
    lineEnd: noop$1,
    rejoin: function rejoin() {
      if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
    },
    result: function result() {
      var result = lines;
      lines = [];
      line = null;
      return result;
    }
  };
};

var pointEqual = function (a, b) {
  return abs(a[0] - b[0]) < epsilon$2 && abs(a[1] - b[1]) < epsilon$2;
};

function Intersection(point, points, other, entry) {
  this.x = point;
  this.z = points;
  this.o = other; // another intersection
  this.e = entry; // is an entry?
  this.v = false; // visited
  this.n = this.p = null; // next & previous
}

// A generalized polygon clipping algorithm: given a polygon that has been cut
// into its visible line segments, and rejoins the segments by interpolating
// along the clip edge.
var clipPolygon = function (segments, compareIntersection, startInside, interpolate, stream) {
  var subject = [],
      clip = [],
      i,
      n;

  segments.forEach(function (segment) {
    if ((n = segment.length - 1) <= 0) return;
    var n,
        p0 = segment[0],
        p1 = segment[n],
        x;

    // If the first and last points of a segment are coincident, then treat as a
    // closed ring. TODO if all rings are closed, then the winding order of the
    // exterior ring should be checked.
    if (pointEqual(p0, p1)) {
      stream.lineStart();
      for (i = 0; i < n; ++i) {
        stream.point((p0 = segment[i])[0], p0[1]);
      }stream.lineEnd();
      return;
    }

    subject.push(x = new Intersection(p0, segment, null, true));
    clip.push(x.o = new Intersection(p0, null, x, false));
    subject.push(x = new Intersection(p1, segment, null, false));
    clip.push(x.o = new Intersection(p1, null, x, true));
  });

  if (!subject.length) return;

  clip.sort(compareIntersection);
  link$1(subject);
  link$1(clip);

  for (i = 0, n = clip.length; i < n; ++i) {
    clip[i].e = startInside = !startInside;
  }

  var start = subject[0],
      points,
      point;

  while (1) {
    // Find first unvisited intersection.
    var current = start,
        isSubject = true;
    while (current.v) {
      if ((current = current.n) === start) return;
    }points = current.z;
    stream.lineStart();
    do {
      current.v = current.o.v = true;
      if (current.e) {
        if (isSubject) {
          for (i = 0, n = points.length; i < n; ++i) {
            stream.point((point = points[i])[0], point[1]);
          }
        } else {
          interpolate(current.x, current.n.x, 1, stream);
        }
        current = current.n;
      } else {
        if (isSubject) {
          points = current.p.z;
          for (i = points.length - 1; i >= 0; --i) {
            stream.point((point = points[i])[0], point[1]);
          }
        } else {
          interpolate(current.x, current.p.x, -1, stream);
        }
        current = current.p;
      }
      current = current.o;
      points = current.z;
      isSubject = !isSubject;
    } while (!current.v);
    stream.lineEnd();
  }
};

function link$1(array) {
  if (!(n = array.length)) return;
  var n,
      i = 0,
      a = array[0],
      b;
  while (++i < n) {
    a.n = b = array[i];
    b.p = a;
    a = b;
  }
  a.n = b = array[0];
  b.p = a;
}

// TODO Use d3-polygon’s polygonContains here for the ring check?
// TODO Eliminate duplicate buffering in clipBuffer and polygon.push?

var sum$1 = adder();

var polygonContains = function (polygon, point) {
  var lambda = point[0],
      phi = point[1],
      normal = [sin$1(lambda), -cos$1(lambda), 0],
      angle = 0,
      winding = 0;

  sum$1.reset();

  for (var i = 0, n = polygon.length; i < n; ++i) {
    if (!(m = (ring = polygon[i]).length)) continue;
    var ring,
        m,
        point0 = ring[m - 1],
        lambda0 = point0[0],
        phi0 = point0[1] / 2 + quarterPi,
        sinPhi0 = sin$1(phi0),
        cosPhi0 = cos$1(phi0);

    for (var j = 0; j < m; ++j, lambda0 = lambda1, sinPhi0 = sinPhi1, cosPhi0 = cosPhi1, point0 = point1) {
      var point1 = ring[j],
          lambda1 = point1[0],
          phi1 = point1[1] / 2 + quarterPi,
          sinPhi1 = sin$1(phi1),
          cosPhi1 = cos$1(phi1),
          delta = lambda1 - lambda0,
          sign$$1 = delta >= 0 ? 1 : -1,
          absDelta = sign$$1 * delta,
          antimeridian = absDelta > pi$3,
          k = sinPhi0 * sinPhi1;

      sum$1.add(atan2(k * sign$$1 * sin$1(absDelta), cosPhi0 * cosPhi1 + k * cos$1(absDelta)));
      angle += antimeridian ? delta + sign$$1 * tau$3 : delta;

      // Are the longitudes either side of the point’s meridian (lambda),
      // and are the latitudes smaller than the parallel (phi)?
      if (antimeridian ^ lambda0 >= lambda ^ lambda1 >= lambda) {
        var arc = cartesianCross(cartesian(point0), cartesian(point1));
        cartesianNormalizeInPlace(arc);
        var intersection = cartesianCross(normal, arc);
        cartesianNormalizeInPlace(intersection);
        var phiArc = (antimeridian ^ delta >= 0 ? -1 : 1) * asin(intersection[2]);
        if (phi > phiArc || phi === phiArc && (arc[0] || arc[1])) {
          winding += antimeridian ^ delta >= 0 ? 1 : -1;
        }
      }
    }
  }

  // First, determine whether the South pole is inside or outside:
  //
  // It is inside if:
  // * the polygon winds around it in a clockwise direction.
  // * the polygon does not (cumulatively) wind around it, but has a negative
  //   (counter-clockwise) area.
  //
  // Second, count the (signed) number of times a segment crosses a lambda
  // from the point to the South pole.  If it is zero, then the point is the
  // same side as the South pole.

  return (angle < -epsilon$2 || angle < epsilon$2 && sum$1 < -epsilon$2) ^ winding & 1;
};

var lengthSum = adder();
var lambda0$2;
var sinPhi0$1;
var cosPhi0$1;

var lengthStream = {
  sphere: noop$1,
  point: noop$1,
  lineStart: lengthLineStart,
  lineEnd: noop$1,
  polygonStart: noop$1,
  polygonEnd: noop$1
};

function lengthLineStart() {
  lengthStream.point = lengthPointFirst;
  lengthStream.lineEnd = lengthLineEnd;
}

function lengthLineEnd() {
  lengthStream.point = lengthStream.lineEnd = noop$1;
}

function lengthPointFirst(lambda, phi) {
  lambda *= radians, phi *= radians;
  lambda0$2 = lambda, sinPhi0$1 = sin$1(phi), cosPhi0$1 = cos$1(phi);
  lengthStream.point = lengthPoint;
}

function lengthPoint(lambda, phi) {
  lambda *= radians, phi *= radians;
  var sinPhi = sin$1(phi),
      cosPhi = cos$1(phi),
      delta = abs(lambda - lambda0$2),
      cosDelta = cos$1(delta),
      sinDelta = sin$1(delta),
      x = cosPhi * sinDelta,
      y = cosPhi0$1 * sinPhi - sinPhi0$1 * cosPhi * cosDelta,
      z = sinPhi0$1 * sinPhi + cosPhi0$1 * cosPhi * cosDelta;
  lengthSum.add(atan2(sqrt(x * x + y * y), z));
  lambda0$2 = lambda, sinPhi0$1 = sinPhi, cosPhi0$1 = cosPhi;
}

var length$1 = function (object) {
  lengthSum.reset();
  geoStream(object, lengthStream);
  return +lengthSum;
};

var coordinates = [null, null];
var object$1 = { type: "LineString", coordinates: coordinates };

var distance = function (a, b) {
  coordinates[0] = a;
  coordinates[1] = b;
  return length$1(object$1);
};

var containsGeometryType = {
  Sphere: function Sphere() {
    return true;
  },
  Point: function Point(object, point) {
    return containsPoint(object.coordinates, point);
  },
  MultiPoint: function MultiPoint(object, point) {
    var coordinates = object.coordinates,
        i = -1,
        n = coordinates.length;
    while (++i < n) {
      if (containsPoint(coordinates[i], point)) return true;
    }return false;
  },
  LineString: function LineString(object, point) {
    return containsLine(object.coordinates, point);
  },
  MultiLineString: function MultiLineString(object, point) {
    var coordinates = object.coordinates,
        i = -1,
        n = coordinates.length;
    while (++i < n) {
      if (containsLine(coordinates[i], point)) return true;
    }return false;
  },
  Polygon: function Polygon(object, point) {
    return containsPolygon(object.coordinates, point);
  },
  MultiPolygon: function MultiPolygon(object, point) {
    var coordinates = object.coordinates,
        i = -1,
        n = coordinates.length;
    while (++i < n) {
      if (containsPolygon(coordinates[i], point)) return true;
    }return false;
  },
  GeometryCollection: function GeometryCollection(object, point) {
    var geometries = object.geometries,
        i = -1,
        n = geometries.length;
    while (++i < n) {
      if (containsGeometry(geometries[i], point)) return true;
    }return false;
  }
};

function containsGeometry(geometry, point) {
  return geometry && containsGeometryType.hasOwnProperty(geometry.type) ? containsGeometryType[geometry.type](geometry, point) : false;
}

function containsPoint(coordinates, point) {
  return distance(coordinates, point) === 0;
}

function containsLine(coordinates, point) {
  var ab = distance(coordinates[0], coordinates[1]),
      ao = distance(coordinates[0], point),
      ob = distance(point, coordinates[1]);
  return ao + ob <= ab + epsilon$2;
}

function containsPolygon(coordinates, point) {
  return !!polygonContains(coordinates.map(ringRadians), pointRadians(point));
}

function ringRadians(ring) {
  return ring = ring.map(pointRadians), ring.pop(), ring;
}

function pointRadians(point) {
  return [point[0] * radians, point[1] * radians];
}

var areaSum$1 = adder();
var areaRingSum$1 = adder();
var x00;
var y00;
var x0$1;
var y0$1;

// TODO Enforce positive area for exterior, negative area for interior?

var X0$1 = 0;
var Y0$1 = 0;
var Z0$1 = 0;

var lengthSum$1 = adder();
var lengthRing;
var x00$2;
var y00$2;
var x0$4;
var y0$4;

var clip = function (pointVisible, clipLine, interpolate, start) {
  return function (rotate, sink) {
    var line = clipLine(sink),
        rotatedStart = rotate.invert(start[0], start[1]),
        ringBuffer = clipBuffer(),
        ringSink = clipLine(ringBuffer),
        polygonStarted = false,
        polygon,
        segments,
        ring;

    var clip = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: function polygonStart() {
        clip.point = pointRing;
        clip.lineStart = ringStart;
        clip.lineEnd = ringEnd;
        segments = [];
        polygon = [];
      },
      polygonEnd: function polygonEnd() {
        clip.point = point;
        clip.lineStart = lineStart;
        clip.lineEnd = lineEnd;
        segments = merge(segments);
        var startInside = polygonContains(polygon, rotatedStart);
        if (segments.length) {
          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
          clipPolygon(segments, compareIntersection, startInside, interpolate, sink);
        } else if (startInside) {
          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
          sink.lineStart();
          interpolate(null, null, 1, sink);
          sink.lineEnd();
        }
        if (polygonStarted) sink.polygonEnd(), polygonStarted = false;
        segments = polygon = null;
      },
      sphere: function sphere() {
        sink.polygonStart();
        sink.lineStart();
        interpolate(null, null, 1, sink);
        sink.lineEnd();
        sink.polygonEnd();
      }
    };

    function point(lambda, phi) {
      var point = rotate(lambda, phi);
      if (pointVisible(lambda = point[0], phi = point[1])) sink.point(lambda, phi);
    }

    function pointLine(lambda, phi) {
      var point = rotate(lambda, phi);
      line.point(point[0], point[1]);
    }

    function lineStart() {
      clip.point = pointLine;
      line.lineStart();
    }

    function lineEnd() {
      clip.point = point;
      line.lineEnd();
    }

    function pointRing(lambda, phi) {
      ring.push([lambda, phi]);
      var point = rotate(lambda, phi);
      ringSink.point(point[0], point[1]);
    }

    function ringStart() {
      ringSink.lineStart();
      ring = [];
    }

    function ringEnd() {
      pointRing(ring[0][0], ring[0][1]);
      ringSink.lineEnd();

      var clean = ringSink.clean(),
          ringSegments = ringBuffer.result(),
          i,
          n = ringSegments.length,
          m,
          segment,
          point;

      ring.pop();
      polygon.push(ring);
      ring = null;

      if (!n) return;

      // No intersections.
      if (clean & 1) {
        segment = ringSegments[0];
        if ((m = segment.length - 1) > 0) {
          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
          sink.lineStart();
          for (i = 0; i < m; ++i) {
            sink.point((point = segment[i])[0], point[1]);
          }sink.lineEnd();
        }
        return;
      }

      // Rejoin connected segments.
      // TODO reuse ringBuffer.rejoin()?
      if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));

      segments.push(ringSegments.filter(validSegment));
    }

    return clip;
  };
};

function validSegment(segment) {
  return segment.length > 1;
}

// Intersections are sorted along the clip edge. For both antimeridian cutting
// and circle clipping, the same comparison is used.
function compareIntersection(a, b) {
  return ((a = a.x)[0] < 0 ? a[1] - halfPi$2 - epsilon$2 : halfPi$2 - a[1]) - ((b = b.x)[0] < 0 ? b[1] - halfPi$2 - epsilon$2 : halfPi$2 - b[1]);
}

clip(function () {
  return true;
}, clipAntimeridianLine, clipAntimeridianInterpolate, [-pi$3, -halfPi$2]);

// Takes a line and cuts into visible segments. Return values: 0 - there were
// intersections or the line was empty; 1 - no intersections; 2 - there were
// intersections, and the first and last segments should be rejoined.
function clipAntimeridianLine(stream) {
  var lambda0 = NaN,
      phi0 = NaN,
      sign0 = NaN,
      _clean; // no intersections

  return {
    lineStart: function lineStart() {
      stream.lineStart();
      _clean = 1;
    },
    point: function point(lambda1, phi1) {
      var sign1 = lambda1 > 0 ? pi$3 : -pi$3,
          delta = abs(lambda1 - lambda0);
      if (abs(delta - pi$3) < epsilon$2) {
        // line crosses a pole
        stream.point(lambda0, phi0 = (phi0 + phi1) / 2 > 0 ? halfPi$2 : -halfPi$2);
        stream.point(sign0, phi0);
        stream.lineEnd();
        stream.lineStart();
        stream.point(sign1, phi0);
        stream.point(lambda1, phi0);
        _clean = 0;
      } else if (sign0 !== sign1 && delta >= pi$3) {
        // line crosses antimeridian
        if (abs(lambda0 - sign0) < epsilon$2) lambda0 -= sign0 * epsilon$2; // handle degeneracies
        if (abs(lambda1 - sign1) < epsilon$2) lambda1 -= sign1 * epsilon$2;
        phi0 = clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1);
        stream.point(sign0, phi0);
        stream.lineEnd();
        stream.lineStart();
        stream.point(sign1, phi0);
        _clean = 0;
      }
      stream.point(lambda0 = lambda1, phi0 = phi1);
      sign0 = sign1;
    },
    lineEnd: function lineEnd() {
      stream.lineEnd();
      lambda0 = phi0 = NaN;
    },
    clean: function clean() {
      return 2 - _clean; // if intersections, rejoin first and last segments
    }
  };
}

function clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1) {
  var cosPhi0,
      cosPhi1,
      sinLambda0Lambda1 = sin$1(lambda0 - lambda1);
  return abs(sinLambda0Lambda1) > epsilon$2 ? atan((sin$1(phi0) * (cosPhi1 = cos$1(phi1)) * sin$1(lambda1) - sin$1(phi1) * (cosPhi0 = cos$1(phi0)) * sin$1(lambda0)) / (cosPhi0 * cosPhi1 * sinLambda0Lambda1)) : (phi0 + phi1) / 2;
}

function clipAntimeridianInterpolate(from, to, direction, stream) {
  var phi;
  if (from == null) {
    phi = direction * halfPi$2;
    stream.point(-pi$3, phi);
    stream.point(0, phi);
    stream.point(pi$3, phi);
    stream.point(pi$3, 0);
    stream.point(pi$3, -phi);
    stream.point(0, -phi);
    stream.point(-pi$3, -phi);
    stream.point(-pi$3, 0);
    stream.point(-pi$3, phi);
  } else if (abs(from[0] - to[0]) > epsilon$2) {
    var lambda = from[0] < to[0] ? pi$3 : -pi$3;
    phi = direction * lambda / 2;
    stream.point(-lambda, phi);
    stream.point(0, phi);
    stream.point(lambda, phi);
  } else {
    stream.point(to[0], to[1]);
  }
}

var cosMinDistance = cos$1(30 * radians); // cos(minimum angular distance)

// A composite projection for the United States, configured by default for
// 960×500. The projection also works quite well at 960×600 if you change the
// scale to 1285 and adjust the translate accordingly. The set of standard
// parallels for each region comes from USGS, which is published here:
// http://egsc.usgs.gov/isb/pubs/MapProjections/projections.html#albers

function azimuthalRaw(scale) {
  return function (x, y) {
    var cx = cos$1(x),
        cy = cos$1(y),
        k = scale(cx * cy);
    return [k * cy * sin$1(x), k * sin$1(y)];
  };
}

function azimuthalInvert(angle) {
  return function (x, y) {
    var z = sqrt(x * x + y * y),
        c = angle(z),
        sc = sin$1(c),
        cc = cos$1(c);
    return [atan2(x * sc, z * cc), asin(z && y * sc / z)];
  };
}

var azimuthalEqualAreaRaw = azimuthalRaw(function (cxcy) {
  return sqrt(2 / (1 + cxcy));
});

azimuthalEqualAreaRaw.invert = azimuthalInvert(function (z) {
  return 2 * asin(z / 2);
});

var azimuthalEquidistantRaw = azimuthalRaw(function (c) {
  return (c = acos(c)) && c / sin$1(c);
});

azimuthalEquidistantRaw.invert = azimuthalInvert(function (z) {
  return z;
});

function count(node) {
  var sum = 0,
      children = node.children,
      i = children && children.length;
  if (!i) sum = 1;else while (--i >= 0) {
    sum += children[i].value;
  }node.value = sum;
}

var node_count = function () {
  return this.eachAfter(count);
};

var node_each = function (callback) {
  var node = this,
      current,
      next = [node],
      children,
      i,
      n;
  do {
    current = next.reverse(), next = [];
    while (node = current.pop()) {
      callback(node), children = node.children;
      if (children) for (i = 0, n = children.length; i < n; ++i) {
        next.push(children[i]);
      }
    }
  } while (next.length);
  return this;
};

var node_eachBefore = function (callback) {
  var node = this,
      nodes = [node],
      children,
      i;
  while (node = nodes.pop()) {
    callback(node), children = node.children;
    if (children) for (i = children.length - 1; i >= 0; --i) {
      nodes.push(children[i]);
    }
  }
  return this;
};

var node_eachAfter = function (callback) {
  var node = this,
      nodes = [node],
      next = [],
      children,
      i,
      n;
  while (node = nodes.pop()) {
    next.push(node), children = node.children;
    if (children) for (i = 0, n = children.length; i < n; ++i) {
      nodes.push(children[i]);
    }
  }
  while (node = next.pop()) {
    callback(node);
  }
  return this;
};

var node_sum = function (value) {
  return this.eachAfter(function (node) {
    var sum = +value(node.data) || 0,
        children = node.children,
        i = children && children.length;
    while (--i >= 0) {
      sum += children[i].value;
    }node.value = sum;
  });
};

var node_sort = function (compare) {
  return this.eachBefore(function (node) {
    if (node.children) {
      node.children.sort(compare);
    }
  });
};

var node_path = function (end) {
  var start = this,
      ancestor = leastCommonAncestor(start, end),
      nodes = [start];
  while (start !== ancestor) {
    start = start.parent;
    nodes.push(start);
  }
  var k = nodes.length;
  while (end !== ancestor) {
    nodes.splice(k, 0, end);
    end = end.parent;
  }
  return nodes;
};

function leastCommonAncestor(a, b) {
  if (a === b) return a;
  var aNodes = a.ancestors(),
      bNodes = b.ancestors(),
      c = null;
  a = aNodes.pop();
  b = bNodes.pop();
  while (a === b) {
    c = a;
    a = aNodes.pop();
    b = bNodes.pop();
  }
  return c;
}

var node_ancestors = function () {
  var node = this,
      nodes = [node];
  while (node = node.parent) {
    nodes.push(node);
  }
  return nodes;
};

var node_descendants = function () {
  var nodes = [];
  this.each(function (node) {
    nodes.push(node);
  });
  return nodes;
};

var node_leaves = function () {
  var leaves = [];
  this.eachBefore(function (node) {
    if (!node.children) {
      leaves.push(node);
    }
  });
  return leaves;
};

var node_links = function () {
  var root = this,
      links = [];
  root.each(function (node) {
    if (node !== root) {
      // Don’t include the root’s parent, if any.
      links.push({ source: node.parent, target: node });
    }
  });
  return links;
};

function hierarchy(data, children) {
  var root = new Node(data),
      valued = +data.value && (root.value = data.value),
      node,
      nodes = [root],
      child,
      childs,
      i,
      n;

  if (children == null) children = defaultChildren;

  while (node = nodes.pop()) {
    if (valued) node.value = +node.data.value;
    if ((childs = children(node.data)) && (n = childs.length)) {
      node.children = new Array(n);
      for (i = n - 1; i >= 0; --i) {
        nodes.push(child = node.children[i] = new Node(childs[i]));
        child.parent = node;
        child.depth = node.depth + 1;
      }
    }
  }

  return root.eachBefore(computeHeight);
}

function node_copy() {
  return hierarchy(this).eachBefore(copyData);
}

function defaultChildren(d) {
  return d.children;
}

function copyData(node) {
  node.data = node.data.data;
}

function computeHeight(node) {
  var height = 0;
  do {
    node.height = height;
  } while ((node = node.parent) && node.height < ++height);
}

function Node(data) {
  this.data = data;
  this.depth = this.height = 0;
  this.parent = null;
}

Node.prototype = hierarchy.prototype = {
  constructor: Node,
  count: node_count,
  each: node_each,
  eachAfter: node_eachAfter,
  eachBefore: node_eachBefore,
  sum: node_sum,
  sort: node_sort,
  path: node_path,
  ancestors: node_ancestors,
  descendants: node_descendants,
  leaves: node_leaves,
  links: node_links,
  copy: node_copy
};

function Node$2(value) {
  this._ = value;
  this.next = null;
}

var treemapDice = function (parent, x0, y0, x1, y1) {
  var nodes = parent.children,
      node,
      i = -1,
      n = nodes.length,
      k = parent.value && (x1 - x0) / parent.value;

  while (++i < n) {
    node = nodes[i], node.y0 = y0, node.y1 = y1;
    node.x0 = x0, node.x1 = x0 += node.value * k;
  }
};

function TreeNode(node, i) {
  this._ = node;
  this.parent = null;
  this.children = null;
  this.A = null; // default ancestor
  this.a = this; // ancestor
  this.z = 0; // prelim
  this.m = 0; // mod
  this.c = 0; // change
  this.s = 0; // shift
  this.t = null; // thread
  this.i = i; // number
}

TreeNode.prototype = Object.create(Node.prototype);

// Node-link tree diagram using the Reingold-Tilford "tidy" algorithm

var treemapSlice = function (parent, x0, y0, x1, y1) {
  var nodes = parent.children,
      node,
      i = -1,
      n = nodes.length,
      k = parent.value && (y1 - y0) / parent.value;

  while (++i < n) {
    node = nodes[i], node.x0 = x0, node.x1 = x1;
    node.y0 = y0, node.y1 = y0 += node.value * k;
  }
};

function squarifyRatio(ratio, parent, x0, y0, x1, y1) {
  var rows = [],
      nodes = parent.children,
      row,
      nodeValue,
      i0 = 0,
      i1 = 0,
      n = nodes.length,
      dx,
      dy,
      value = parent.value,
      sumValue,
      minValue,
      maxValue,
      newRatio,
      minRatio,
      alpha,
      beta;

  while (i0 < n) {
    dx = x1 - x0, dy = y1 - y0;

    // Find the next non-empty node.
    do {
      sumValue = nodes[i1++].value;
    } while (!sumValue && i1 < n);
    minValue = maxValue = sumValue;
    alpha = Math.max(dy / dx, dx / dy) / (value * ratio);
    beta = sumValue * sumValue * alpha;
    minRatio = Math.max(maxValue / beta, beta / minValue);

    // Keep adding nodes while the aspect ratio maintains or improves.
    for (; i1 < n; ++i1) {
      sumValue += nodeValue = nodes[i1].value;
      if (nodeValue < minValue) minValue = nodeValue;
      if (nodeValue > maxValue) maxValue = nodeValue;
      beta = sumValue * sumValue * alpha;
      newRatio = Math.max(maxValue / beta, beta / minValue);
      if (newRatio > minRatio) {
        sumValue -= nodeValue;break;
      }
      minRatio = newRatio;
    }

    // Position and record the row orientation.
    rows.push(row = { value: sumValue, dice: dx < dy, children: nodes.slice(i0, i1) });
    if (row.dice) treemapDice(row, x0, y0, x1, value ? y0 += dy * sumValue / value : y1);else treemapSlice(row, x0, y0, value ? x0 += dx * sumValue / value : x1, y1);
    value -= sumValue, i0 = i1;
  }

  return rows;
}

// Returns the 2D cross product of AB and AC vectors, i.e., the z-component of
// the 3D cross product in a quadrant I Cartesian coordinate system (+x is
// right, +y is up). Returns a positive value if ABC is counter-clockwise,
// negative if clockwise, and zero if the points are collinear.
var cross$1 = function (a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
};

function lexicographicOrder(a, b) {
    return a[0] - b[0] || a[1] - b[1];
}

// Computes the upper convex hull per the monotone chain algorithm.
// Assumes points.length >= 3, is sorted by x, unique in y.
// Returns an array of indices into points in left-to-right order.
function computeUpperHullIndexes(points) {
    var n = points.length,
        indexes = [0, 1],
        size = 2;

    for (var i = 2; i < n; ++i) {
        while (size > 1 && cross$1(points[indexes[size - 2]], points[indexes[size - 1]], points[i]) <= 0) {
            --size;
        }indexes[size++] = i;
    }

    return indexes.slice(0, size); // remove popped points
}

var slice$3 = [].slice;

var noabort = {};

function poke$1(q) {
  if (!q._start) {
    try {
      start$1(q);
    } // let the current task complete
    catch (e) {
      if (q._tasks[q._ended + q._active - 1]) _abort(q, e); // task errored synchronously
      else if (!q._data) throw e; // await callback errored synchronously
    }
  }
}

function start$1(q) {
  while (q._start = q._waiting && q._active < q._size) {
    var i = q._ended + q._active,
        t = q._tasks[i],
        j = t.length - 1,
        c = t[j];
    t[j] = end(q, i);
    --q._waiting, ++q._active;
    t = c.apply(null, t);
    if (!q._tasks[i]) continue; // task finished synchronously
    q._tasks[i] = t || noabort;
  }
}

function end(q, i) {
  return function (e, r) {
    if (!q._tasks[i]) return; // ignore multiple callbacks
    --q._active, ++q._ended;
    q._tasks[i] = null;
    if (q._error != null) return; // ignore secondary errors
    if (e != null) {
      _abort(q, e);
    } else {
      q._data[i] = r;
      if (q._waiting) poke$1(q);else maybeNotify(q);
    }
  };
}

function _abort(q, e) {
  var i = q._tasks.length,
      t;
  q._error = e; // ignore active callbacks
  q._data = undefined; // allow gc
  q._waiting = NaN; // prevent starting

  while (--i >= 0) {
    if (t = q._tasks[i]) {
      q._tasks[i] = null;
      if (t.abort) {
        try {
          t.abort();
        } catch (e) {/* ignore */}
      }
    }
  }

  q._active = NaN; // allow notification
  maybeNotify(q);
}

function maybeNotify(q) {
  if (!q._active && q._call) {
    var d = q._data;
    q._data = undefined; // allow gc
    q._call(q._error, d);
  }
}

var request = function (url, callback) {
  var request,
      event = dispatch("beforesend", "progress", "load", "error"),
      _mimeType,
      headers = map$1(),
      xhr = new XMLHttpRequest(),
      _user = null,
      _password = null,
      _response,
      _responseType,
      _timeout = 0;

  // If IE does not support CORS, use XDomainRequest.
  if (typeof XDomainRequest !== "undefined" && !("withCredentials" in xhr) && /^(http(s)?:)?\/\//.test(url)) xhr = new XDomainRequest();

  "onload" in xhr ? xhr.onload = xhr.onerror = xhr.ontimeout = respond : xhr.onreadystatechange = function (o) {
    xhr.readyState > 3 && respond(o);
  };

  function respond(o) {
    var status = xhr.status,
        result;
    if (!status && hasResponse(xhr) || status >= 200 && status < 300 || status === 304) {
      if (_response) {
        try {
          result = _response.call(request, xhr);
        } catch (e) {
          event.call("error", request, e);
          return;
        }
      } else {
        result = xhr;
      }
      event.call("load", request, result);
    } else {
      event.call("error", request, o);
    }
  }

  xhr.onprogress = function (e) {
    event.call("progress", request, e);
  };

  request = {
    header: function header(name, value) {
      name = (name + "").toLowerCase();
      if (arguments.length < 2) return headers.get(name);
      if (value == null) headers.remove(name);else headers.set(name, value + "");
      return request;
    },

    // If mimeType is non-null and no Accept header is set, a default is used.
    mimeType: function mimeType(value) {
      if (!arguments.length) return _mimeType;
      _mimeType = value == null ? null : value + "";
      return request;
    },

    // Specifies what type the response value should take;
    // for instance, arraybuffer, blob, document, or text.
    responseType: function responseType(value) {
      if (!arguments.length) return _responseType;
      _responseType = value;
      return request;
    },

    timeout: function timeout(value) {
      if (!arguments.length) return _timeout;
      _timeout = +value;
      return request;
    },

    user: function user(value) {
      return arguments.length < 1 ? _user : (_user = value == null ? null : value + "", request);
    },

    password: function password(value) {
      return arguments.length < 1 ? _password : (_password = value == null ? null : value + "", request);
    },

    // Specify how to convert the response content to a specific type;
    // changes the callback value on "load" events.
    response: function response(value) {
      _response = value;
      return request;
    },

    // Alias for send("GET", …).
    get: function get(data, callback) {
      return request.send("GET", data, callback);
    },

    // Alias for send("POST", …).
    post: function post(data, callback) {
      return request.send("POST", data, callback);
    },

    // If callback is non-null, it will be used for error and load events.
    send: function send(method, data, callback) {
      xhr.open(method, url, true, _user, _password);
      if (_mimeType != null && !headers.has("accept")) headers.set("accept", _mimeType + ",*/*");
      if (xhr.setRequestHeader) headers.each(function (value, name) {
        xhr.setRequestHeader(name, value);
      });
      if (_mimeType != null && xhr.overrideMimeType) xhr.overrideMimeType(_mimeType);
      if (_responseType != null) xhr.responseType = _responseType;
      if (_timeout > 0) xhr.timeout = _timeout;
      if (callback == null && typeof data === "function") callback = data, data = null;
      if (callback != null && callback.length === 1) callback = fixCallback(callback);
      if (callback != null) request.on("error", callback).on("load", function (xhr) {
        callback(null, xhr);
      });
      event.call("beforesend", request, xhr);
      xhr.send(data == null ? null : data);
      return request;
    },

    abort: function abort() {
      xhr.abort();
      return request;
    },

    on: function on() {
      var value = event.on.apply(event, arguments);
      return value === event ? request : value;
    }
  };

  if (callback != null) {
    if (typeof callback !== "function") throw new Error("invalid callback: " + callback);
    return request.get(callback);
  }

  return request;
};

function fixCallback(callback) {
  return function (error, xhr) {
    callback(error == null ? xhr : null);
  };
}

function hasResponse(xhr) {
  var type = xhr.responseType;
  return type && type !== "text" ? xhr.response // null on error
  : xhr.responseText; // "" on error
}

var type$1 = function (defaultMimeType, response) {
  return function (url, callback) {
    var r = request(url).mimeType(defaultMimeType).response(response);
    if (callback != null) {
      if (typeof callback !== "function") throw new Error("invalid callback: " + callback);
      return r.get(callback);
    }
    return r;
  };
};

type$1("text/html", function (xhr) {
  return document.createRange().createContextualFragment(xhr.responseText);
});

type$1("application/json", function (xhr) {
  return JSON.parse(xhr.responseText);
});

type$1("text/plain", function (xhr) {
  return xhr.responseText;
});

type$1("application/xml", function (xhr) {
  var xml = xhr.responseXML;
  if (!xml) throw new Error("parse error");
  return xml;
});

var dsv$1 = function (defaultMimeType, parse) {
  return function (url, row, callback) {
    if (arguments.length < 3) callback = row, row = null;
    var r = request(url).mimeType(defaultMimeType);
    r.row = function (_) {
      return arguments.length ? r.response(responseOf(parse, row = _)) : row;
    };
    r.row(row);
    return callback ? r.get(callback) : r;
  };
};

function responseOf(parse, row) {
  return function (request$$1) {
    return parse(request$$1.responseText, row);
  };
}

dsv$1("text/csv", csvParse);

dsv$1("text/tab-separated-values", tsvParse);

var array$2 = Array.prototype;

var map$3 = array$2.map;
var slice$4 = array$2.slice;

var implicit = { name: "implicit" };

var constant$9 = function (x) {
  return function () {
    return x;
  };
};

var number$1 = function (x) {
  return +x;
};

var unit = [0, 1];

function deinterpolateLinear(a, b) {
  return (b -= a = +a) ? function (x) {
    return (x - a) / b;
  } : constant$9(b);
}

function deinterpolateClamp(deinterpolate) {
  return function (a, b) {
    var d = deinterpolate(a = +a, b = +b);
    return function (x) {
      return x <= a ? 0 : x >= b ? 1 : d(x);
    };
  };
}

function reinterpolateClamp(reinterpolate) {
  return function (a, b) {
    var r = reinterpolate(a = +a, b = +b);
    return function (t) {
      return t <= 0 ? a : t >= 1 ? b : r(t);
    };
  };
}

function bimap(domain, range$$1, deinterpolate, reinterpolate) {
  var d0 = domain[0],
      d1 = domain[1],
      r0 = range$$1[0],
      r1 = range$$1[1];
  if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate(r1, r0);else d0 = deinterpolate(d0, d1), r0 = reinterpolate(r0, r1);
  return function (x) {
    return r0(d0(x));
  };
}

function polymap(domain, range$$1, deinterpolate, reinterpolate) {
  var j = Math.min(domain.length, range$$1.length) - 1,
      d = new Array(j),
      r = new Array(j),
      i = -1;

  // Reverse descending domains.
  if (domain[j] < domain[0]) {
    domain = domain.slice().reverse();
    range$$1 = range$$1.slice().reverse();
  }

  while (++i < j) {
    d[i] = deinterpolate(domain[i], domain[i + 1]);
    r[i] = reinterpolate(range$$1[i], range$$1[i + 1]);
  }

  return function (x) {
    var i = bisectRight(domain, x, 1, j) - 1;
    return r[i](d[i](x));
  };
}



// deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
// reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
function continuous(deinterpolate, reinterpolate) {
  var domain = unit,
      range$$1 = unit,
      interpolate$$1 = interpolateValue,
      clamp = false,
      piecewise,
      output,
      input;

  function rescale() {
    piecewise = Math.min(domain.length, range$$1.length) > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }

  function scale(x) {
    return (output || (output = piecewise(domain, range$$1, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate, interpolate$$1)))(+x);
  }

  scale.invert = function (y) {
    return (input || (input = piecewise(range$$1, domain, deinterpolateLinear, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
  };

  scale.domain = function (_) {
    return arguments.length ? (domain = map$3.call(_, number$1), rescale()) : domain.slice();
  };

  scale.range = function (_) {
    return arguments.length ? (range$$1 = slice$4.call(_), rescale()) : range$$1.slice();
  };

  scale.rangeRound = function (_) {
    return range$$1 = slice$4.call(_), interpolate$$1 = interpolateRound, rescale();
  };

  scale.clamp = function (_) {
    return arguments.length ? (clamp = !!_, rescale()) : clamp;
  };

  scale.interpolate = function (_) {
    return arguments.length ? (interpolate$$1 = _, rescale()) : interpolate$$1;
  };

  return rescale();
}

function deinterpolate(a, b) {
  return (b = Math.log(b / a)) ? function (x) {
    return Math.log(x / a) / b;
  } : constant$9(b);
}

function reinterpolate$1(a, b) {
  return a < 0 ? function (t) {
    return -Math.pow(-b, t) * Math.pow(-a, 1 - t);
  } : function (t) {
    return Math.pow(b, t) * Math.pow(a, 1 - t);
  };
}

function pow10(x) {
  return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
}

function powp(base) {
  return base === 10 ? pow10 : base === Math.E ? Math.exp : function (x) {
    return Math.pow(base, x);
  };
}

function logp(base) {
  return base === Math.E ? Math.log : base === 10 && Math.log10 || base === 2 && Math.log2 || (base = Math.log(base), function (x) {
    return Math.log(x) / base;
  });
}

var t0$1 = new Date();
var t1$1 = new Date();

function newInterval(floori, offseti, count, field) {

  function interval(date) {
    return floori(date = new Date(+date)), date;
  }

  interval.floor = interval;

  interval.ceil = function (date) {
    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
  };

  interval.round = function (date) {
    var d0 = interval(date),
        d1 = interval.ceil(date);
    return date - d0 < d1 - date ? d0 : d1;
  };

  interval.offset = function (date, step) {
    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
  };

  interval.range = function (start, stop, step) {
    var range = [];
    start = interval.ceil(start);
    step = step == null ? 1 : Math.floor(step);
    if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
    do {
      range.push(new Date(+start));
    } while ((offseti(start, step), floori(start), start < stop));
    return range;
  };

  interval.filter = function (test) {
    return newInterval(function (date) {
      if (date >= date) while (floori(date), !test(date)) {
        date.setTime(date - 1);
      }
    }, function (date, step) {
      if (date >= date) while (--step >= 0) {
        while (offseti(date, 1), !test(date)) {}
      } // eslint-disable-line no-empty
    });
  };

  if (count) {
    interval.count = function (start, end) {
      t0$1.setTime(+start), t1$1.setTime(+end);
      floori(t0$1), floori(t1$1);
      return Math.floor(count(t0$1, t1$1));
    };

    interval.every = function (step) {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null : !(step > 1) ? interval : interval.filter(field ? function (d) {
        return field(d) % step === 0;
      } : function (d) {
        return interval.count(0, d) % step === 0;
      });
    };
  }

  return interval;
}

var millisecond = newInterval(function () {
  // noop
}, function (date, step) {
  date.setTime(+date + step);
}, function (start, end) {
  return end - start;
});

// An optimized implementation for this simple case.
millisecond.every = function (k) {
  k = Math.floor(k);
  if (!isFinite(k) || !(k > 0)) return null;
  if (!(k > 1)) return millisecond;
  return newInterval(function (date) {
    date.setTime(Math.floor(date / k) * k);
  }, function (date, step) {
    date.setTime(+date + step * k);
  }, function (start, end) {
    return (end - start) / k;
  });
};

var durationSecond$1 = 1e3;
var durationMinute$1 = 6e4;
var durationHour$1 = 36e5;
var durationDay$1 = 864e5;
var durationWeek$1 = 6048e5;

var second = newInterval(function (date) {
  date.setTime(Math.floor(date / durationSecond$1) * durationSecond$1);
}, function (date, step) {
  date.setTime(+date + step * durationSecond$1);
}, function (start, end) {
  return (end - start) / durationSecond$1;
}, function (date) {
  return date.getUTCSeconds();
});

var minute = newInterval(function (date) {
  date.setTime(Math.floor(date / durationMinute$1) * durationMinute$1);
}, function (date, step) {
  date.setTime(+date + step * durationMinute$1);
}, function (start, end) {
  return (end - start) / durationMinute$1;
}, function (date) {
  return date.getMinutes();
});

var hour = newInterval(function (date) {
  var offset = date.getTimezoneOffset() * durationMinute$1 % durationHour$1;
  if (offset < 0) offset += durationHour$1;
  date.setTime(Math.floor((+date - offset) / durationHour$1) * durationHour$1 + offset);
}, function (date, step) {
  date.setTime(+date + step * durationHour$1);
}, function (start, end) {
  return (end - start) / durationHour$1;
}, function (date) {
  return date.getHours();
});

var day = newInterval(function (date) {
  date.setHours(0, 0, 0, 0);
}, function (date, step) {
  date.setDate(date.getDate() + step);
}, function (start, end) {
  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$1) / durationDay$1;
}, function (date) {
  return date.getDate() - 1;
});

function weekday(i) {
  return newInterval(function (date) {
    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    date.setHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setDate(date.getDate() + step * 7);
  }, function (start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$1) / durationWeek$1;
  });
}

var sunday = weekday(0);
var monday = weekday(1);
var tuesday = weekday(2);
var wednesday = weekday(3);
var thursday = weekday(4);
var friday = weekday(5);
var saturday = weekday(6);

var month = newInterval(function (date) {
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
}, function (date, step) {
  date.setMonth(date.getMonth() + step);
}, function (start, end) {
  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}, function (date) {
  return date.getMonth();
});

var year = newInterval(function (date) {
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
}, function (date, step) {
  date.setFullYear(date.getFullYear() + step);
}, function (start, end) {
  return end.getFullYear() - start.getFullYear();
}, function (date) {
  return date.getFullYear();
});

// An optimized implementation for this simple case.
year.every = function (k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function (date) {
    date.setFullYear(Math.floor(date.getFullYear() / k) * k);
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setFullYear(date.getFullYear() + step * k);
  });
};

var utcMinute = newInterval(function (date) {
  date.setUTCSeconds(0, 0);
}, function (date, step) {
  date.setTime(+date + step * durationMinute$1);
}, function (start, end) {
  return (end - start) / durationMinute$1;
}, function (date) {
  return date.getUTCMinutes();
});

var utcHour = newInterval(function (date) {
  date.setUTCMinutes(0, 0, 0);
}, function (date, step) {
  date.setTime(+date + step * durationHour$1);
}, function (start, end) {
  return (end - start) / durationHour$1;
}, function (date) {
  return date.getUTCHours();
});

var utcDay = newInterval(function (date) {
  date.setUTCHours(0, 0, 0, 0);
}, function (date, step) {
  date.setUTCDate(date.getUTCDate() + step);
}, function (start, end) {
  return (end - start) / durationDay$1;
}, function (date) {
  return date.getUTCDate() - 1;
});

function utcWeekday(i) {
  return newInterval(function (date) {
    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    date.setUTCHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setUTCDate(date.getUTCDate() + step * 7);
  }, function (start, end) {
    return (end - start) / durationWeek$1;
  });
}

var utcSunday = utcWeekday(0);
var utcMonday = utcWeekday(1);
var utcTuesday = utcWeekday(2);
var utcWednesday = utcWeekday(3);
var utcThursday = utcWeekday(4);
var utcFriday = utcWeekday(5);
var utcSaturday = utcWeekday(6);

var utcMonth = newInterval(function (date) {
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
}, function (date, step) {
  date.setUTCMonth(date.getUTCMonth() + step);
}, function (start, end) {
  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}, function (date) {
  return date.getUTCMonth();
});

var utcYear = newInterval(function (date) {
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
}, function (date, step) {
  date.setUTCFullYear(date.getUTCFullYear() + step);
}, function (start, end) {
  return end.getUTCFullYear() - start.getUTCFullYear();
}, function (date) {
  return date.getUTCFullYear();
});

// An optimized implementation for this simple case.
utcYear.every = function (k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function (date) {
    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step * k);
  });
};

function localDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
    date.setFullYear(d.y);
    return date;
  }
  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
}

function utcDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
    date.setUTCFullYear(d.y);
    return date;
  }
  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
}

function newYear(y) {
  return { y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0 };
}

function formatLocale$1(locale) {
  var locale_dateTime = locale.dateTime,
      locale_date = locale.date,
      locale_time = locale.time,
      locale_periods = locale.periods,
      locale_weekdays = locale.days,
      locale_shortWeekdays = locale.shortDays,
      locale_months = locale.months,
      locale_shortMonths = locale.shortMonths;

  var periodRe = formatRe(locale_periods),
      periodLookup = formatLookup(locale_periods),
      weekdayRe = formatRe(locale_weekdays),
      weekdayLookup = formatLookup(locale_weekdays),
      shortWeekdayRe = formatRe(locale_shortWeekdays),
      shortWeekdayLookup = formatLookup(locale_shortWeekdays),
      monthRe = formatRe(locale_months),
      monthLookup = formatLookup(locale_months),
      shortMonthRe = formatRe(locale_shortMonths),
      shortMonthLookup = formatLookup(locale_shortMonths);

  var formats = {
    "a": formatShortWeekday,
    "A": formatWeekday,
    "b": formatShortMonth,
    "B": formatMonth,
    "c": null,
    "d": formatDayOfMonth,
    "e": formatDayOfMonth,
    "H": formatHour24,
    "I": formatHour12,
    "j": formatDayOfYear,
    "L": formatMilliseconds,
    "m": formatMonthNumber,
    "M": formatMinutes,
    "p": formatPeriod,
    "S": formatSeconds,
    "U": formatWeekNumberSunday,
    "w": formatWeekdayNumber,
    "W": formatWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatYear,
    "Y": formatFullYear,
    "Z": formatZone,
    "%": formatLiteralPercent
  };

  var utcFormats = {
    "a": formatUTCShortWeekday,
    "A": formatUTCWeekday,
    "b": formatUTCShortMonth,
    "B": formatUTCMonth,
    "c": null,
    "d": formatUTCDayOfMonth,
    "e": formatUTCDayOfMonth,
    "H": formatUTCHour24,
    "I": formatUTCHour12,
    "j": formatUTCDayOfYear,
    "L": formatUTCMilliseconds,
    "m": formatUTCMonthNumber,
    "M": formatUTCMinutes,
    "p": formatUTCPeriod,
    "S": formatUTCSeconds,
    "U": formatUTCWeekNumberSunday,
    "w": formatUTCWeekdayNumber,
    "W": formatUTCWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatUTCYear,
    "Y": formatUTCFullYear,
    "Z": formatUTCZone,
    "%": formatLiteralPercent
  };

  var parses = {
    "a": parseShortWeekday,
    "A": parseWeekday,
    "b": parseShortMonth,
    "B": parseMonth,
    "c": parseLocaleDateTime,
    "d": parseDayOfMonth,
    "e": parseDayOfMonth,
    "H": parseHour24,
    "I": parseHour24,
    "j": parseDayOfYear,
    "L": parseMilliseconds,
    "m": parseMonthNumber,
    "M": parseMinutes,
    "p": parsePeriod,
    "S": parseSeconds,
    "U": parseWeekNumberSunday,
    "w": parseWeekdayNumber,
    "W": parseWeekNumberMonday,
    "x": parseLocaleDate,
    "X": parseLocaleTime,
    "y": parseYear,
    "Y": parseFullYear,
    "Z": parseZone,
    "%": parseLiteralPercent
  };

  // These recursive directive definitions must be deferred.
  formats.x = newFormat(locale_date, formats);
  formats.X = newFormat(locale_time, formats);
  formats.c = newFormat(locale_dateTime, formats);
  utcFormats.x = newFormat(locale_date, utcFormats);
  utcFormats.X = newFormat(locale_time, utcFormats);
  utcFormats.c = newFormat(locale_dateTime, utcFormats);

  function newFormat(specifier, formats) {
    return function (date) {
      var string = [],
          i = -1,
          j = 0,
          n = specifier.length,
          c,
          pad,
          format;

      if (!(date instanceof Date)) date = new Date(+date);

      while (++i < n) {
        if (specifier.charCodeAt(i) === 37) {
          string.push(specifier.slice(j, i));
          if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);else pad = c === "e" ? " " : "0";
          if (format = formats[c]) c = format(date, pad);
          string.push(c);
          j = i + 1;
        }
      }

      string.push(specifier.slice(j, i));
      return string.join("");
    };
  }

  function newParse(specifier, newDate) {
    return function (string) {
      var d = newYear(1900),
          i = parseSpecifier(d, specifier, string += "", 0);
      if (i != string.length) return null;

      // The am-pm flag is 0 for AM, and 1 for PM.
      if ("p" in d) d.H = d.H % 12 + d.p * 12;

      // Convert day-of-week and week-of-year to day-of-year.
      if ("W" in d || "U" in d) {
        if (!("w" in d)) d.w = "W" in d ? 1 : 0;
        var day$$1 = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
        d.m = 0;
        d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$$1 + 5) % 7 : d.w + d.U * 7 - (day$$1 + 6) % 7;
      }

      // If a time zone is specified, all fields are interpreted as UTC and then
      // offset according to the specified time zone.
      if ("Z" in d) {
        d.H += d.Z / 100 | 0;
        d.M += d.Z % 100;
        return utcDate(d);
      }

      // Otherwise, all fields are in local time.
      return newDate(d);
    };
  }

  function parseSpecifier(d, specifier, string, j) {
    var i = 0,
        n = specifier.length,
        m = string.length,
        c,
        parse;

    while (i < n) {
      if (j >= m) return -1;
      c = specifier.charCodeAt(i++);
      if (c === 37) {
        c = specifier.charAt(i++);
        parse = parses[c in pads ? specifier.charAt(i++) : c];
        if (!parse || (j = parse(d, string, j)) < 0) return -1;
      } else if (c != string.charCodeAt(j++)) {
        return -1;
      }
    }

    return j;
  }

  function parsePeriod(d, string, i) {
    var n = periodRe.exec(string.slice(i));
    return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseShortWeekday(d, string, i) {
    var n = shortWeekdayRe.exec(string.slice(i));
    return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseWeekday(d, string, i) {
    var n = weekdayRe.exec(string.slice(i));
    return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseShortMonth(d, string, i) {
    var n = shortMonthRe.exec(string.slice(i));
    return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseMonth(d, string, i) {
    var n = monthRe.exec(string.slice(i));
    return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseLocaleDateTime(d, string, i) {
    return parseSpecifier(d, locale_dateTime, string, i);
  }

  function parseLocaleDate(d, string, i) {
    return parseSpecifier(d, locale_date, string, i);
  }

  function parseLocaleTime(d, string, i) {
    return parseSpecifier(d, locale_time, string, i);
  }

  function formatShortWeekday(d) {
    return locale_shortWeekdays[d.getDay()];
  }

  function formatWeekday(d) {
    return locale_weekdays[d.getDay()];
  }

  function formatShortMonth(d) {
    return locale_shortMonths[d.getMonth()];
  }

  function formatMonth(d) {
    return locale_months[d.getMonth()];
  }

  function formatPeriod(d) {
    return locale_periods[+(d.getHours() >= 12)];
  }

  function formatUTCShortWeekday(d) {
    return locale_shortWeekdays[d.getUTCDay()];
  }

  function formatUTCWeekday(d) {
    return locale_weekdays[d.getUTCDay()];
  }

  function formatUTCShortMonth(d) {
    return locale_shortMonths[d.getUTCMonth()];
  }

  function formatUTCMonth(d) {
    return locale_months[d.getUTCMonth()];
  }

  function formatUTCPeriod(d) {
    return locale_periods[+(d.getUTCHours() >= 12)];
  }

  return {
    format: function format(specifier) {
      var f = newFormat(specifier += "", formats);
      f.toString = function () {
        return specifier;
      };
      return f;
    },
    parse: function parse(specifier) {
      var p = newParse(specifier += "", localDate);
      p.toString = function () {
        return specifier;
      };
      return p;
    },
    utcFormat: function utcFormat(specifier) {
      var f = newFormat(specifier += "", utcFormats);
      f.toString = function () {
        return specifier;
      };
      return f;
    },
    utcParse: function utcParse(specifier) {
      var p = newParse(specifier, utcDate);
      p.toString = function () {
        return specifier;
      };
      return p;
    }
  };
}

var pads = { "-": "", "_": " ", "0": "0" };
var numberRe = /^\s*\d+/;
var percentRe = /^%/;
var requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

function pad(value, fill, width) {
  var sign = value < 0 ? "-" : "",
      string = (sign ? -value : value) + "",
      length = string.length;
  return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
}

function requote(s) {
  return s.replace(requoteRe, "\\$&");
}

function formatRe(names) {
  return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
}

function formatLookup(names) {
  var map = {},
      i = -1,
      n = names.length;
  while (++i < n) {
    map[names[i].toLowerCase()] = i;
  }return map;
}

function parseWeekdayNumber(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.w = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.U = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.W = +n[0], i + n[0].length) : -1;
}

function parseFullYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 4));
  return n ? (d.y = +n[0], i + n[0].length) : -1;
}

function parseYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
}

function parseZone(d, string, i) {
  var n = /^(Z)|([+-]\d\d)(?:\:?(\d\d))?/.exec(string.slice(i, i + 6));
  return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
}

function parseMonthNumber(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
}

function parseDayOfMonth(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.d = +n[0], i + n[0].length) : -1;
}

function parseDayOfYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
}

function parseHour24(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.H = +n[0], i + n[0].length) : -1;
}

function parseMinutes(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.M = +n[0], i + n[0].length) : -1;
}

function parseSeconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.S = +n[0], i + n[0].length) : -1;
}

function parseMilliseconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.L = +n[0], i + n[0].length) : -1;
}

function parseLiteralPercent(d, string, i) {
  var n = percentRe.exec(string.slice(i, i + 1));
  return n ? i + n[0].length : -1;
}

function formatDayOfMonth(d, p) {
  return pad(d.getDate(), p, 2);
}

function formatHour24(d, p) {
  return pad(d.getHours(), p, 2);
}

function formatHour12(d, p) {
  return pad(d.getHours() % 12 || 12, p, 2);
}

function formatDayOfYear(d, p) {
  return pad(1 + day.count(year(d), d), p, 3);
}

function formatMilliseconds(d, p) {
  return pad(d.getMilliseconds(), p, 3);
}

function formatMonthNumber(d, p) {
  return pad(d.getMonth() + 1, p, 2);
}

function formatMinutes(d, p) {
  return pad(d.getMinutes(), p, 2);
}

function formatSeconds(d, p) {
  return pad(d.getSeconds(), p, 2);
}

function formatWeekNumberSunday(d, p) {
  return pad(sunday.count(year(d), d), p, 2);
}

function formatWeekdayNumber(d) {
  return d.getDay();
}

function formatWeekNumberMonday(d, p) {
  return pad(monday.count(year(d), d), p, 2);
}

function formatYear(d, p) {
  return pad(d.getFullYear() % 100, p, 2);
}

function formatFullYear(d, p) {
  return pad(d.getFullYear() % 10000, p, 4);
}

function formatZone(d) {
  var z = d.getTimezoneOffset();
  return (z > 0 ? "-" : (z *= -1, "+")) + pad(z / 60 | 0, "0", 2) + pad(z % 60, "0", 2);
}

function formatUTCDayOfMonth(d, p) {
  return pad(d.getUTCDate(), p, 2);
}

function formatUTCHour24(d, p) {
  return pad(d.getUTCHours(), p, 2);
}

function formatUTCHour12(d, p) {
  return pad(d.getUTCHours() % 12 || 12, p, 2);
}

function formatUTCDayOfYear(d, p) {
  return pad(1 + utcDay.count(utcYear(d), d), p, 3);
}

function formatUTCMilliseconds(d, p) {
  return pad(d.getUTCMilliseconds(), p, 3);
}

function formatUTCMonthNumber(d, p) {
  return pad(d.getUTCMonth() + 1, p, 2);
}

function formatUTCMinutes(d, p) {
  return pad(d.getUTCMinutes(), p, 2);
}

function formatUTCSeconds(d, p) {
  return pad(d.getUTCSeconds(), p, 2);
}

function formatUTCWeekNumberSunday(d, p) {
  return pad(utcSunday.count(utcYear(d), d), p, 2);
}

function formatUTCWeekdayNumber(d) {
  return d.getUTCDay();
}

function formatUTCWeekNumberMonday(d, p) {
  return pad(utcMonday.count(utcYear(d), d), p, 2);
}

function formatUTCYear(d, p) {
  return pad(d.getUTCFullYear() % 100, p, 2);
}

function formatUTCFullYear(d, p) {
  return pad(d.getUTCFullYear() % 10000, p, 4);
}

function formatUTCZone() {
  return "+0000";
}

function formatLiteralPercent() {
  return "%";
}

var locale$2;
var timeFormat;
var timeParse;
var utcFormat;
var utcParse;

defaultLocale$1({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});

function defaultLocale$1(definition) {
  locale$2 = formatLocale$1(definition);
  timeFormat = locale$2.format;
  timeParse = locale$2.parse;
  utcFormat = locale$2.utcFormat;
  utcParse = locale$2.utcParse;
  return locale$2;
}

var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

function formatIsoNative(date) {
    return date.toISOString();
}

var formatIso = Date.prototype.toISOString ? formatIsoNative : utcFormat(isoSpecifier);

function parseIsoNative(string) {
  var date = new Date(string);
  return isNaN(date) ? null : date;
}

var parseIso = +new Date("2000-01-01T00:00:00.000Z") ? parseIsoNative : utcParse(isoSpecifier);

var colors = function (s) {
  return s.match(/.{6}/g).map(function (x) {
    return "#" + x;
  });
};

colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

colors("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6");

colors("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9");

colors("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");

cubehelixLong(cubehelix(300, 0.5, 0.0), cubehelix(-240, 0.5, 1.0));

var warm = cubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

var cool = cubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

var rainbow = cubehelix();

var constant$10 = function (x) {
  return function constant() {
    return x;
  };
};

function Linear(context) {
  this._context = context;
}

Linear.prototype = {
  areaStart: function areaStart() {
    this._line = 0;
  },
  areaEnd: function areaEnd() {
    this._line = NaN;
  },
  lineStart: function lineStart() {
    this._point = 0;
  },
  lineEnd: function lineEnd() {
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function point(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0:
        this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
      case 1:
        this._point = 2; // proceed
      default:
        this._context.lineTo(x, y);break;
    }
  }
};

var curveLinear = function (context) {
  return new Linear(context);
};

function x$3(p) {
  return p[0];
}

function y$3(p) {
  return p[1];
}

function sign$1(x) {
  return x < 0 ? -1 : 1;
}

// Calculate the slopes of the tangents (Hermite-type interpolation) based on
// the following paper: Steffen, M. 1990. A Simple Method for Monotonic
// Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
// NOV(II), P. 443, 1990.
function slope3(that, x2, y2) {
  var h0 = that._x1 - that._x0,
      h1 = x2 - that._x1,
      s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
      s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
      p = (s0 * h1 + s1 * h0) / (h0 + h1);
  return (sign$1(s0) + sign$1(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
}

// Calculate a one-sided slope.
function slope2(that, t) {
  var h = that._x1 - that._x0;
  return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
}

// According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
// "you can express cubic Hermite interpolation in terms of cubic Bézier curves
// with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
function _point$3(that, t0, t1) {
  var x0 = that._x0,
      y0 = that._y0,
      x1 = that._x1,
      y1 = that._y1,
      dx = (x1 - x0) / 3;
  that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
}

function MonotoneX(context) {
  this._context = context;
}

MonotoneX.prototype = {
  areaStart: function areaStart() {
    this._line = 0;
  },
  areaEnd: function areaEnd() {
    this._line = NaN;
  },
  lineStart: function lineStart() {
    this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN;
    this._point = 0;
  },
  lineEnd: function lineEnd() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);break;
      case 3:
        _point$3(this, this._t0, slope2(this, this._t0));break;
    }
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function point(x, y) {
    var t1 = NaN;

    x = +x, y = +y;
    if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
    switch (this._point) {
      case 0:
        this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
      case 1:
        this._point = 2;break;
      case 2:
        this._point = 3;_point$3(this, slope2(this, t1 = slope3(this, x, y)), t1);break;
      default:
        _point$3(this, this._t0, t1 = slope3(this, x, y));break;
    }

    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
    this._t0 = t1;
  }
};

function MonotoneY(context) {
  this._context = new ReflectContext(context);
}

(MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function (x, y) {
  MonotoneX.prototype.point.call(this, y, x);
};

function ReflectContext(context) {
  this._context = context;
}

ReflectContext.prototype = {
  moveTo: function moveTo(x, y) {
    this._context.moveTo(y, x);
  },
  closePath: function closePath() {
    this._context.closePath();
  },
  lineTo: function lineTo(x, y) {
    this._context.lineTo(y, x);
  },
  bezierCurveTo: function bezierCurveTo(x1, y1, x2, y2, x, y) {
    this._context.bezierCurveTo(y1, x1, y2, x2, y, x);
  }
};

function createBorderEdge(left, v0, v1) {
  var edge = [v0, v1];
  edge.left = left;
  return edge;
}



// Liang–Barsky line clipping.
function clipEdge(edge, x0, y0, x1, y1) {
  var a = edge[0],
      b = edge[1],
      ax = a[0],
      ay = a[1],
      bx = b[0],
      by = b[1],
      t0 = 0,
      t1 = 1,
      dx = bx - ax,
      dy = by - ay,
      r;

  r = x0 - ax;
  if (!dx && r > 0) return;
  r /= dx;
  if (dx < 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  } else if (dx > 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  }

  r = x1 - ax;
  if (!dx && r < 0) return;
  r /= dx;
  if (dx < 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  } else if (dx > 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  }

  r = y0 - ay;
  if (!dy && r > 0) return;
  r /= dy;
  if (dy < 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  } else if (dy > 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  }

  r = y1 - ay;
  if (!dy && r < 0) return;
  r /= dy;
  if (dy < 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  } else if (dy > 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  }

  if (!(t0 > 0) && !(t1 < 1)) return true; // TODO Better check?

  if (t0 > 0) edge[0] = [ax + t0 * dx, ay + t0 * dy];
  if (t1 < 1) edge[1] = [ax + t1 * dx, ay + t1 * dy];
  return true;
}

function connectEdge(edge, x0, y0, x1, y1) {
  var v1 = edge[1];
  if (v1) return true;

  var v0 = edge[0],
      left = edge.left,
      right = edge.right,
      lx = left[0],
      ly = left[1],
      rx = right[0],
      ry = right[1],
      fx = (lx + rx) / 2,
      fy = (ly + ry) / 2,
      fm,
      fb;

  if (ry === ly) {
    if (fx < x0 || fx >= x1) return;
    if (lx > rx) {
      if (!v0) v0 = [fx, y0];else if (v0[1] >= y1) return;
      v1 = [fx, y1];
    } else {
      if (!v0) v0 = [fx, y1];else if (v0[1] < y0) return;
      v1 = [fx, y0];
    }
  } else {
    fm = (lx - rx) / (ry - ly);
    fb = fy - fm * fx;
    if (fm < -1 || fm > 1) {
      if (lx > rx) {
        if (!v0) v0 = [(y0 - fb) / fm, y0];else if (v0[1] >= y1) return;
        v1 = [(y1 - fb) / fm, y1];
      } else {
        if (!v0) v0 = [(y1 - fb) / fm, y1];else if (v0[1] < y0) return;
        v1 = [(y0 - fb) / fm, y0];
      }
    } else {
      if (ly < ry) {
        if (!v0) v0 = [x0, fm * x0 + fb];else if (v0[0] >= x1) return;
        v1 = [x1, fm * x1 + fb];
      } else {
        if (!v0) v0 = [x1, fm * x1 + fb];else if (v0[0] < x0) return;
        v1 = [x0, fm * x0 + fb];
      }
    }
  }

  edge[0] = v0;
  edge[1] = v1;
  return true;
}

function cellHalfedgeStart(cell, edge) {
  return edge[+(edge.left !== cell.site)];
}

function cellHalfedgeEnd(cell, edge) {
  return edge[+(edge.left === cell.site)];
}

var epsilon$4 = 1e-6;


var cells;

var edges;

function triangleArea(a, b, c) {
  return (a[0] - c[0]) * (b[1] - a[1]) - (a[0] - b[0]) * (c[1] - a[1]);
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
function unflatten$1(object, separator) {
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



// See: http://stackoverflow.com/questions/14234560/javascript-how-to-get-parent-element-by-selector


/* See: https://gist.github.com/jasonrhodes/2321581 */

var colors$1 = function (specifier) {
  var n = specifier.length / 6 | 0,
      colors = new Array(n),
      i = 0;
  while (i < n) {
    colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
  }return colors;
};

colors$1("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666");

colors$1("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666");

colors$1("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928");

colors$1("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2");

colors$1("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc");

colors$1("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999");

colors$1("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3");

colors$1("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f");

var ramp$1 = function (scheme) {
  return rgbBasis(scheme[scheme.length - 1]);
};

var scheme = new Array(3).concat("d8b365f5f5f55ab4ac", "a6611adfc27d80cdc1018571", "a6611adfc27df5f5f580cdc1018571", "8c510ad8b365f6e8c3c7eae55ab4ac01665e", "8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e", "8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e", "8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e", "5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30", "5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30").map(colors$1);

ramp$1(scheme);

var scheme$1 = new Array(3).concat("af8dc3f7f7f77fbf7b", "7b3294c2a5cfa6dba0008837", "7b3294c2a5cff7f7f7a6dba0008837", "762a83af8dc3e7d4e8d9f0d37fbf7b1b7837", "762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837", "762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837", "762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837", "40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b", "40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b").map(colors$1);

ramp$1(scheme$1);

var scheme$2 = new Array(3).concat("e9a3c9f7f7f7a1d76a", "d01c8bf1b6dab8e1864dac26", "d01c8bf1b6daf7f7f7b8e1864dac26", "c51b7de9a3c9fde0efe6f5d0a1d76a4d9221", "c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221", "c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221", "c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221", "8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419", "8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419").map(colors$1);

ramp$1(scheme$2);

var scheme$3 = new Array(3).concat("998ec3f7f7f7f1a340", "5e3c99b2abd2fdb863e66101", "5e3c99b2abd2f7f7f7fdb863e66101", "542788998ec3d8daebfee0b6f1a340b35806", "542788998ec3d8daebf7f7f7fee0b6f1a340b35806", "5427888073acb2abd2d8daebfee0b6fdb863e08214b35806", "5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b35806", "2d004b5427888073acb2abd2d8daebfee0b6fdb863e08214b358067f3b08", "2d004b5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b358067f3b08").map(colors$1);

ramp$1(scheme$3);

var scheme$4 = new Array(3).concat("ef8a62f7f7f767a9cf", "ca0020f4a58292c5de0571b0", "ca0020f4a582f7f7f792c5de0571b0", "b2182bef8a62fddbc7d1e5f067a9cf2166ac", "b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac", "b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac", "b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac", "67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061", "67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061").map(colors$1);

ramp$1(scheme$4);

var scheme$5 = new Array(3).concat("ef8a62ffffff999999", "ca0020f4a582bababa404040", "ca0020f4a582ffffffbababa404040", "b2182bef8a62fddbc7e0e0e09999994d4d4d", "b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d", "b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d", "b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d", "67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a", "67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a").map(colors$1);

ramp$1(scheme$5);

var scheme$6 = new Array(3).concat("fc8d59ffffbf91bfdb", "d7191cfdae61abd9e92c7bb6", "d7191cfdae61ffffbfabd9e92c7bb6", "d73027fc8d59fee090e0f3f891bfdb4575b4", "d73027fc8d59fee090ffffbfe0f3f891bfdb4575b4", "d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4", "d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4", "a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695", "a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695").map(colors$1);

ramp$1(scheme$6);

var scheme$7 = new Array(3).concat("fc8d59ffffbf91cf60", "d7191cfdae61a6d96a1a9641", "d7191cfdae61ffffbfa6d96a1a9641", "d73027fc8d59fee08bd9ef8b91cf601a9850", "d73027fc8d59fee08bffffbfd9ef8b91cf601a9850", "d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850", "d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850", "a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837", "a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837").map(colors$1);

ramp$1(scheme$7);

var scheme$8 = new Array(3).concat("fc8d59ffffbf99d594", "d7191cfdae61abdda42b83ba", "d7191cfdae61ffffbfabdda42b83ba", "d53e4ffc8d59fee08be6f59899d5943288bd", "d53e4ffc8d59fee08bffffbfe6f59899d5943288bd", "d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd", "d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd", "9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2", "9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2").map(colors$1);

ramp$1(scheme$8);

var scheme$9 = new Array(3).concat("e5f5f999d8c92ca25f", "edf8fbb2e2e266c2a4238b45", "edf8fbb2e2e266c2a42ca25f006d2c", "edf8fbccece699d8c966c2a42ca25f006d2c", "edf8fbccece699d8c966c2a441ae76238b45005824", "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824", "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b").map(colors$1);

ramp$1(scheme$9);

var scheme$10 = new Array(3).concat("e0ecf49ebcda8856a7", "edf8fbb3cde38c96c688419d", "edf8fbb3cde38c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b").map(colors$1);

ramp$1(scheme$10);

var scheme$11 = new Array(3).concat("e0f3dba8ddb543a2ca", "f0f9e8bae4bc7bccc42b8cbe", "f0f9e8bae4bc7bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081").map(colors$1);

ramp$1(scheme$11);

var scheme$12 = new Array(3).concat("fee8c8fdbb84e34a33", "fef0d9fdcc8afc8d59d7301f", "fef0d9fdcc8afc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000").map(colors$1);

ramp$1(scheme$12);

var scheme$13 = new Array(3).concat("ece2f0a6bddb1c9099", "f6eff7bdc9e167a9cf02818a", "f6eff7bdc9e167a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636").map(colors$1);

ramp$1(scheme$13);

var scheme$14 = new Array(3).concat("ece7f2a6bddb2b8cbe", "f1eef6bdc9e174a9cf0570b0", "f1eef6bdc9e174a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858").map(colors$1);

ramp$1(scheme$14);

var scheme$15 = new Array(3).concat("e7e1efc994c7dd1c77", "f1eef6d7b5d8df65b0ce1256", "f1eef6d7b5d8df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f").map(colors$1);

ramp$1(scheme$15);

var scheme$16 = new Array(3).concat("fde0ddfa9fb5c51b8a", "feebe2fbb4b9f768a1ae017e", "feebe2fbb4b9f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a").map(colors$1);

ramp$1(scheme$16);

var scheme$17 = new Array(3).concat("edf8b17fcdbb2c7fb8", "ffffcca1dab441b6c4225ea8", "ffffcca1dab441b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58").map(colors$1);

ramp$1(scheme$17);

var scheme$18 = new Array(3).concat("f7fcb9addd8e31a354", "ffffccc2e69978c679238443", "ffffccc2e69978c67931a354006837", "ffffccd9f0a3addd8e78c67931a354006837", "ffffccd9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529").map(colors$1);

ramp$1(scheme$18);

var scheme$19 = new Array(3).concat("fff7bcfec44fd95f0e", "ffffd4fed98efe9929cc4c02", "ffffd4fed98efe9929d95f0e993404", "ffffd4fee391fec44ffe9929d95f0e993404", "ffffd4fee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506").map(colors$1);

ramp$1(scheme$19);

var scheme$20 = new Array(3).concat("ffeda0feb24cf03b20", "ffffb2fecc5cfd8d3ce31a1c", "ffffb2fecc5cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026").map(colors$1);

ramp$1(scheme$20);

var scheme$21 = new Array(3).concat("deebf79ecae13182bd", "eff3ffbdd7e76baed62171b5", "eff3ffbdd7e76baed63182bd08519c", "eff3ffc6dbef9ecae16baed63182bd08519c", "eff3ffc6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b").map(colors$1);

ramp$1(scheme$21);

var scheme$22 = new Array(3).concat("e5f5e0a1d99b31a354", "edf8e9bae4b374c476238b45", "edf8e9bae4b374c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b").map(colors$1);

ramp$1(scheme$22);

var scheme$23 = new Array(3).concat("f0f0f0bdbdbd636363", "f7f7f7cccccc969696525252", "f7f7f7cccccc969696636363252525", "f7f7f7d9d9d9bdbdbd969696636363252525", "f7f7f7d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000").map(colors$1);

ramp$1(scheme$23);

var scheme$24 = new Array(3).concat("efedf5bcbddc756bb1", "f2f0f7cbc9e29e9ac86a51a3", "f2f0f7cbc9e29e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d").map(colors$1);

ramp$1(scheme$24);

var scheme$25 = new Array(3).concat("fee0d2fc9272de2d26", "fee5d9fcae91fb6a4acb181d", "fee5d9fcae91fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d").map(colors$1);

ramp$1(scheme$25);

var scheme$26 = new Array(3).concat("fee6cefdae6be6550d", "feeddefdbe85fd8d3cd94701", "feeddefdbe85fd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704").map(colors$1);

ramp$1(scheme$26);

var greys = new Array(1).concat([["#cccccc"], ["#e3e3e3", "#696969"], ["#e3e3e3", "#a4a4a4", "#696969"], ["#e3e3e3", "#b9b9b9", "#8f8f8f", "#696969"], ["#e3e3e3", "#c2c2c2", "#a4a4a4", "#858585", "#696969"], ["#e3e3e3", "#cacaca", "#b0b0b0", "#979797", "#808080", "#696969"], ["#e3e3e3", "#cecece", "#b9b9b9", "#a4a4a4", "#8f8f8f", "#7c7c7c", "#696969"], ["#e3e3e3", "#d0d0d0", "#bebebe", "#adadad", "#9b9b9b", "#8a8a8a", "#797979", "#696969"], ["#e3e3e3", "#d3d3d3", "#c2c2c2", "#b3b3b3", "#a4a4a4", "#949494", "#858585", "#787878", "#696969"]]);

var blues = new Array(3).concat([["#ddd4e8", "#866aba", "#00008b"], ["#ddd4e8", "#a38cca", "#6648ab", "#00008b"], ["#ddd4e8", "#b29ed1", "#866aba", "#5537a3", "#00008b"], ["#ddd4e8", "#bba8d6", "#977ec4", "#7356b1", "#4a2d9e", "#00008b"], ["#ddd4e8", "#c0b0d9", "#a38cca", "#866aba", "#6648ab", "#42279b", "#00008b"], ["#ddd4e8", "#c4b5db", "#ac96ce", "#9378c1", "#785bb4", "#5c3fa6", "#3c2299", "#00008b"], ["#ddd4e8", "#c8b8dd", "#b29ed1", "#9c84c6", "#866aba", "#6e51af", "#5537a3", "#381e97", "#00008b"]]);



/*
	source: http://gka.github.io/palettes/
*/

var ylOrDr = new Array(3).concat([["#ffff00", "#d98300", "#8b0000"], ["#ffff00", "#edaa00", "#c15f01", "#8b0000"], ["#ffff00", "#f5be00", "#d98300", "#b44c02", "#8b0000"], ["#ffff00", "#f9ca00", "#e59b00", "#cb6c01", "#ac4002", "#8b0000"], ["#ffff00", "#fbd300", "#edaa00", "#d98300", "#c15f01", "#a73802", "#8b0000"], ["#ffff00", "#fdda00", "#f2b600", "#e29400", "#cf7401", "#ba5401", "#a33102", "#8b0000"], ["#ffff00", "#fdde00", "#f5be00", "#e8a100", "#d98300", "#c76801", "#b44c02", "#a02e02", "#8b0000"]]);

var dgOrDr = new Array(3).concat([["#006400", "#ff8c00", "#8b0000"], ["#006400", "#a48b00", "#ee4d00", "#8b0000"], ["#006400", "#798500", "#ff8c00", "#db3301", "#8b0000"], ["#006400", "#618100", "#c98d00", "#f96600", "#cd2401", "#8b0000"], ["#006400", "#4f7c00", "#a48b00", "#ff8c00", "#ee4d00", "#c31c02", "#8b0000"], ["#006400", "#437a00", "#8b8800", "#d78e00", "#fc6f00", "#e33e00", "#bb1502", "#8b0000"], ["#006400", "#3b7800", "#798500", "#b98d00", "#ff8c00", "#f55c00", "#db3301", "#b61102", "#8b0000"]]);

var greys$1 = interpolateRgb("#d3d3d3", "#2a2a2a");
var blues$1 = interpolateRgb("#add8e6", "#222b2e");
var blRd = interpolateRgb("#0000ff", "#ff0000");

function getCookie(name) {
	var nameeq = name + "=";
	var ca = document.cookie.split(";");
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == " ") {
			c = c.substring(1);
		}if (c.indexOf(nameeq) == 0) return c.substring(nameeq.length, c.length);
	}
	return "";
}

function setCookie(name, value, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	var expires = "expires=" + d.toUTCString();
	document.cookie = name + "=" + value + "; " + expires;
}

function randomId() {
	return "dgf_" + Math.round(Math.random() * 10000);
}

function formFactory(tagFactory$$1) {
	var registry = {},
	    cache = {};

	return {
		add: function add(key, o) {
			registry[key] = o;
			return this;
		},

		addAll: function addAll(o) {
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
			return registry[key];
		},

		create: function create(prefix, p) {
			if (p.dialog) {
				return this.lookup(p.dialog).create(this, prefix, p);
			}

			if (typeof p === "string") {
				return this.lookup(p).create(this, prefix, p);
			}

			if (p.extend && this.lookup(p.extend)) {
				return this.lookup(p.extend).create(this, prefix, p);
			}

			if (p.type) {
				return this.lookup(p.type).create(this, prefix, p);
			}

			return undefined;
		},

		getTagFactory: function getTagFactory() {
			return tagFactory$$1;
		},

		validate: function validate(p) {
			function cleanup(o) {
				if ((typeof o === "undefined" ? "undefined" : _typeof(o)) === "object") {
					for (var k in o) {
						if (k === "reader") {
							if (o.reader.type !== "dgf.readerDSV" && !o.reader.cacheData) {
								delete o.reader.data;
							}
						}

						if (o[k] === "dgf.schedulerUndefined" || o[k] === "dgf.readerUndefined" || o[k] === "dgf.containerTemplateUndefined" || o[k] === "dgf.templateUndefined" || o[k] === "dgf.styleUndefined") {
							for (var m in o) {
								delete o[m];
							}
							continue;
						}

						if (isEmpty(o[k]) || o[k] === "n/a" || typeof o[k] === "string" && o[k].trim().length === 0) {
							delete o[k];
							continue;
						}

						if (["width", "height", "top", "right", "bottom", "left", "xTicks", "yTicks", "y1Ticks"].indexOf(k) > -1) {
							if (!isNaN(o[k])) {
								o[k] = +o[k];
							}
						}

						if (o[k]) cleanup(o[k]);
					}

					for (var l in o) {
						if (isEmpty(o[l])) {
							delete o[l];
						}
					}
				}
				return o;
			}
			p = cleanup(p);
			return p;
		},

		// Create a menu tree based on the registered objects categories
		typesByCategory: function typesByCategory(category) {

			category = Array.isArray(category) ? category : category.split(",");

			var cached = cache[category.join("_")];

			if (cached) return cached;

			var types = this.getTagFactory().typesByCategory(category),
			    result = [];

			function path$$1(result, category) {
				for (var i = 0; i < result.length; i++) {
					if (result[i].menu && result[i].text === category[0]) {
						if (category[1]) {
							return path$$1(result[i].menu, category.slice(1));
						}
						return result[i].menu.sort(function (a, b) {
							return ascending(a.text, b.text);
						});
					}
				}

				var m = [];
				result.push({ text: category[0], menu: m });

				if (category[1]) {
					return path$$1(m, category.slice(1));
				}

				return m;
			}

			for (var i in types) {
				var t = types[i],
				    p = path$$1(result, t.category);

				switch (t.category[0]) {
					default:
						p.push({ text: t.title, value: t.key });
				}
			}

			if (result[0] && result[0].menu) {
				result = result[0].menu.sort(function (a, b) {
					return ascending(a.text, b.text);
				});
				cache[category.join("_")] = result;
			}

			return result;
		},

		changeType: function changeType(prefix, type, control) {
			var rootControl = control.getRoot(),
			    tabControl = rootControl.items()[0],
			    data = rootControl.toJSON();

			data[prefix + "type"] = type;

			var dialog = this.create("dialog_", unflatten$1(data)),
			    newTabControl = tinymce.ui.Factory.create({
				type: "tabpanel",
				items: dialog.body
			});

			rootControl.replace(tabControl, newTabControl);

			// Remove all children from the tabpanel
			var tabElement = document.getElementById(rootControl._id + "-body");
			while (tabElement.firstChild) {
				tabElement.removeChild(tabElement.firstChild);
			}

			// Render the new tabpanel
			newTabControl.renderTo(tabElement).reflow();

			// Activate the tab
			var activeTabId = tabControl.activeTabId,
			    activeTabIndex = activeTabId ? +activeTabId.match(/\d+/)[0] : 0;

			newTabControl.activateTab(activeTabIndex);
			setCookie(data.nodeId + ":activeTabId", activeTabId, 60);

			rootControl.fromJSON(data);
			this.setMenu(rootControl, unflatten$1(data));
		},

		// Set the menues after loading the data
		setMenu: function setMenu(control, data) {
			if (data.reader) {
				var reader = this.getTagFactory().create(null, data.reader);

				reader.callback(function (selection$$1) {

					if (selection$$1.datum() && selection$$1.datum()[0]) {
						var keys$$1 = keys(selection$$1.datum()[0]),
						    menu,
						    controls;

						// Attributes
						menu = [{ text: "n/a", value: "n/a" }].concat(keys$$1.map(function (k) {
							return { text: k, value: k };
						})).concat([{ text: "keysAt", menu: keys$$1.map(function (k, i) {
								return { text: i + "", value: "keysAt(" + i + ")" };
							}) }]);

						controls = control.find(".parsemap");

						for (i in controls) {
							if (controls[i].settings) {
								controls[i].settings.menu = menu;
								controls[i].disabled(false);
							}
						}

						// Data
						menu = [{ text: "n/a", value: "n/a" }].concat(keys$$1.map(function (k) {
							return { text: k, value: "data(" + k + ")" };
						})).concat([{ text: "dataAt", menu: keys$$1.map(function (k, i) {
								return { text: i + "", value: "dataAt(" + i + ")" };
							}) }]).concat([{ text: "keysAt", menu: keys$$1.map(function (k, i) {
								return { text: i + "", value: "keysAt(" + i + ")" };
							}) }]).concat([{ text: "key", menu: ["xKey", "yKey", "y1Key", "colorKey", "textKey", "keyKey"].map(function (k) {
								return { text: k, value: k + "()" };
							})
						}]).concat([{ text: "const", menu: keys$$1.map(function (k) {
								return { text: k, value: "const(" + k + ")" };
							}) }]);

						controls = control.find(".datamap");

						for (i in controls) {
							if (controls[i].settings) {
								controls[i].settings.menu = menu;
								controls[i].disabled(false);
							}
						}

						// Domain
						menu = [{ text: "n/a", value: "n/a" }];

						menu.push({ text: "map", menu: [{ text: "auto", value: "map()" }].concat(keys$$1.map(function (k) {
								return { text: k, value: "map(" + k + ")" };
							})).concat([{ text: "mapAt", menu: keys$$1.map(function (k, i) {
									return { text: i + "", value: "mapAt(" + i + ")" };
								}) }]) });

						menu.push({ text: "extent", menu: [{ text: "auto", value: "extent()" }].concat(keys$$1.map(function (k) {
								return { text: k, value: "extent(" + k + ")" };
							})).concat([{ text: "extentAt", menu: keys$$1.map(function (k, i) {
									return { text: i + "", value: "extentAt(" + i + ")" };
								}) }]) });

						menu.push({ text: "extentZero", menu: [{ text: "auto", value: "extentZero()" }].concat(keys$$1.map(function (k) {
								return { text: k, value: "extentZero(" + k + ")" };
							})).concat([{ text: "extentZeroAt", menu: keys$$1.map(function (k, i) {
									return { text: i + "", value: "extentZeroAt(" + i + ")" };
								}) }]) });

						menu.push({ text: "keys", value: "keys()" });

						controls = control.find(".domainmap");

						for (i in controls) {
							if (controls[i].settings) {
								controls[i].settings.menu = menu;
								controls[i].disabled(false);
							}
						}

						// Transitions
						var intervals = [0, 50, 100, 250, 500, 1000, 2500, 5000, 10000];

						// delay
						menu = [{ text: "n/a", value: "n/a" }];

						menu.push({ text: "absolute", menu: intervals.map(function (k) {
								return { text: k + " ms", value: k };
							}) });

						menu.push({ text: "indexed", menu: intervals.map(function (k) {
								return { text: k + " ms", value: "indexed(" + k + ")" };
							}) });

						menu.push({ text: "proportional", menu: keys$$1.map(function (k) {
								return { text: k, menu: intervals.map(function (l) {
										return { text: l + " ms", value: "proportional(" + k + "," + l + ")" };
									}) };
							}) });

						controls = control.find(".delaymap");

						for (var i in controls) {
							if (controls[i].settings) {
								controls[i].settings.menu = menu;
								controls[i].disabled(false);
							}
						}

						// duration
						menu = [{ text: "n/a", value: "n/a" }];

						menu.push({ text: "absolute", menu: intervals.map(function (k) {
								return { text: k + " ms", value: k };
							}) });

						menu.push({ text: "indexed", menu: intervals.map(function (k) {
								return { text: k + " ms", value: "indexed(" + k + ")" };
							}) });

						menu.push({ text: "proportional", menu: keys$$1.map(function (k) {
								return { text: k, menu: intervals.map(function (l) {
										return { text: l + " ms", value: "proportional(" + k + "," + l + ")" };
									}) };
							}) });

						controls = control.find(".durationmap");

						for (i in controls) {
							if (controls[i].settings) {
								controls[i].settings.menu = menu;
								controls[i].disabled(false);
							}
						}
					}
				});

				// Disable controls until data is loaded (and menu set)
				control.find(".datamap").disabled(true);
				control.find(".domainmap").disabled(true);
				control.find(".delaymap").disabled(true);
				control.find(".durationmap").disabled(true);

				select(document.createDocumentFragment()).call(reader);
			}
		},

		postRenderDialog: function postRenderDialog(event$$1, data) {
			// Adjust size
			var control = event$$1.control.getRoot();
			control.reflow();

			var w = Math.min(control._layoutRect.w, 0.95 * window.innerWidth),
			    h = Math.min(control._layoutRect.h, 0.95 * window.innerHeight);

			control.resizeTo(w, h);

			// Set active tab
			var tabpanel = event$$1.target.rootControl.items().toArray()[0],
			    activeTabId = getCookie(data.nodeId + ":activeTabId"),
			    activeTabIndex = activeTabId ? +activeTabId.match(/\d+/)[0] : 0;

			if (activeTabIndex < tabpanel.items().length) tabpanel.activateTab(activeTabIndex);

			// Calculate the menues
			this.setMenu(event$$1.control.getRoot(), data);
		}
	};
}

var formDialogLayers = {
	"dgf.dialogLayersLarge": {
		create: function create(formFactory, prefix, data) {
			return {
				type: "form",
				title: "Insert/Edit Diagram",
				id: "dialog_form",
				data: flatten(data),
				bodyType: "tabpanel",
				autoScroll: true,
				onPostRender: function onPostRender(event) {
					formFactory.postRenderDialog(event, data);
				},

				onShowTab: function onShowTab(event) {
					var activeTabId = event.target.rootControl.items().toArray()[0].activeTabId;
					setCookie(data.nodeId + ":activeTabId", activeTabId, 60);
				},

				body: [formFactory.create("", "dgf.setupForm"), formFactory.create("scheduler_", data.scheduler || "dgf.schedulerUndefined"), formFactory.create("reader_", data.reader || "dgf.readerUndefined"), formFactory.create("template_", data.template || "dgf.containerTemplateUndefined"), formFactory.create("template_layer0_", data.template && data.template.layer0 ? data.template.layer0.type : "dgf.templateUndefined"), formFactory.create("template_layer1_", data.template && data.template.layer1 ? data.template.layer1.type : "dgf.templateUndefined"), formFactory.create("template_layer2_", data.template && data.template.layer2 ? data.template.layer2.type : "dgf.templateUndefined"), formFactory.create("template_layer3_", data.template && data.template.layer3 ? data.template.layer3.type : "dgf.templateUndefined"), formFactory.create("template_layer4_", data.template && data.template.layer4 ? data.template.layer4.type : "dgf.templateUndefined"), formFactory.create("template_layer5_", data.template && data.template.layer5 ? data.template.layer5.type : "dgf.templateUndefined"), formFactory.create("template_layer6_", data.template && data.template.layer6 ? data.template.layer6.type : "dgf.templateUndefined"), formFactory.create("style_", data.style || "dgf.styleUndefined")]
			};
		}
	},

	"dgf.dialogLayersMedium": {
		create: function create(formFactory, prefix, data) {
			return {
				type: "form",
				title: "Insert/Edit Diagram",
				id: "dialog_form",
				data: flatten(data),
				bodyType: "tabpanel",
				autoScroll: true,
				onPostRender: function onPostRender(event) {
					formFactory.postRenderDialog(event, data);
				},

				onShowTab: function onShowTab(event) {
					var activeTabId = event.target.rootControl.items().toArray()[0].activeTabId;
					setCookie(data.nodeId + ":activeTabId", activeTabId, 60);
				},

				body: [formFactory.create("", "dgf.setupForm"), formFactory.create("scheduler_", data.scheduler || "dgf.schedulerUndefined"), formFactory.create("reader_", data.reader || "dgf.readerUndefined"), {
					type: "form",
					title: "Template",
					defaults: {},
					items: [formFactory.create("template_", "dgf.fieldsetSizeMargin"), formFactory.create("template_", "dgf.fieldsetData"), formFactory.create("template_", "dgf.fieldsetScales"), formFactory.create("template_", "dgf.fieldsetTransitions")]
				}, formFactory.create("style_", data.style || "dgf.styleUndefined")]
			};
		}
	},

	"dgf.dialogLayersSmall": {
		create: function create(formFactory, prefix, data) {
			return {
				type: "form",
				title: "Insert/Edit Diagram",
				id: "dialog_form",
				data: flatten(data),
				bodyType: "tabpanel",
				autoScroll: true,
				onPostRender: function onPostRender(event) {
					formFactory.postRenderDialog(event, data);
				},

				onShowTab: function onShowTab(event) {
					var activeTabId = event.target.rootControl.items().toArray()[0].activeTabId;
					setCookie(data.nodeId + ":activeTabId", activeTabId, 60);
				},

				body: [formFactory.create("", "dgf.setupForm"), formFactory.create("reader_", data.reader || "dgf.readerUndefined"), {
					type: "form",
					title: "Template",
					defaults: {},
					items: [formFactory.create("template_", "dgf.fieldsetSizeMargin"), formFactory.create("template_", "dgf.fieldsetData"), formFactory.create("template_", "dgf.fieldsetScalesSmall")]
				}, formFactory.create("style_", data.style || "dgf.styleUndefined")]
			};
		}
	}
};

var formLayers = {
	"dgf.templateLayers": {
		create: function create(formFactory, prefix) {
			return {
				type: "form",
				title: "Template",
				defaults: {},
				items: [formFactory.create(prefix, "dgf.listboxContainerTemplateType"), formFactory.create(prefix, "dgf.fieldsetSizeMargin"), formFactory.create(prefix, "dgf.fieldsetData"), formFactory.create(prefix, "dgf.fieldsetScales"), formFactory.create(prefix, "dgf.fieldsetTransitions")]
			};
		}
	}
};

var formParts = {

	"dgf.listboxSchedulerType": {
		create: function create(formFactory, prefix) {
			return {
				type: "listbox",
				name: prefix + "type",
				label: "type",
				values: [{ text: "n/a", value: "dgf.schedulerUndefined" }].concat(formFactory.typesByCategory(["scheduler"])),
				maxWidth: 250,
				tooltip: "Type of the scheduler.",

				onSelect: function onSelect(event$$1) {
					formFactory.changeType(prefix, event$$1.target.value(), event$$1.target);
				}
			};
		}
	},

	"dgf.listboxReaderType": {
		create: function create(formFactory, prefix) {
			return {
				type: "listbox",
				name: prefix + "type",
				label: "type",
				values: [{ text: "n/a", value: "dgf.readerUndefined" }].concat(formFactory.typesByCategory(["reader"])),
				maxWidth: 250,
				tooltip: "Type of the reader.",

				onSelect: function onSelect(event$$1) {
					formFactory.changeType(prefix, event$$1.target.value(), event$$1.target);
					var rootControl = event$$1.control.getRoot();
					formFactory.setMenu(rootControl, unflatten$1(rootControl.toJSON()));
				}
			};
		}
	},

	"dgf.listboxContainerTemplateType": {
		create: function create(formFactory, prefix) {
			return {
				type: "listbox",
				name: prefix + "type",
				label: "type",
				values: [{ text: "n/a", value: "dgf.containerTemplateUndefined" }].concat(formFactory.typesByCategory(["template", "container"])),
				maxWidth: 250,
				tooltip: "Type of the container template.",

				onSelect: function onSelect(event$$1) {
					formFactory.changeType(prefix, event$$1.target.value(), event$$1.target);
				}
			};
		}
	},

	"dgf.listboxTemplateType": {
		create: function create(formFactory, prefix) {
			return {
				type: "listbox",
				name: prefix + "type",
				label: "type",
				values: [{ text: "n/a", value: "dgf.templateUndefined" }].concat(formFactory.typesByCategory(["template"])),
				maxWidth: 250,
				tooltip: "Type of the layer template.",

				onSelect: function onSelect(event$$1) {
					formFactory.changeType(prefix, event$$1.target.value(), event$$1.target);
				}
			};
		}
	},

	"dgf.listboxStyleType": {
		create: function create(formFactory, prefix) {
			return {
				type: "listbox",
				name: prefix + "type",
				label: "type",
				values: [{ text: "n/a", value: "dgf.styleUndefined" }].concat(formFactory.typesByCategory(["style"])),
				maxWidth: 250,
				tooltip: "Type of the stylesheet.",

				onSelect: function onSelect(event$$1) {
					formFactory.changeType(prefix, event$$1.target.value(), event$$1.target);
				}
			};
		}
	},

	"dgf.valuesNumberFormat": {
		create: function create() {
			var values$$1 = [];

			values$$1.push({ text: "fixed", menu: [0, 1, 2, 3, 4, 8].map(function (k) {
					return { text: k + " digit" + (k != 1 ? "s" : ""), value: "format(,." + k + "f)" };
				}) });

			values$$1.push({ text: "rounded", menu: [0, 1, 2, 3, 4, 8].map(function (k) {
					return { text: k + " digit" + (k != 1 ? "s" : ""), value: "format(,." + k + "r)" };
				}) });

			values$$1.push({ text: "percent %", menu: [0, 1, 2, 3, 4, 8].map(function (k) {
					return { text: k + " digit" + (k != 1 ? "s" : ""), value: "format(,." + k + "%)" };
				}) });

			values$$1.push({ text: "si-prefix", menu: [0, 1, 2, 3, 4, 8].map(function (k) {
					return { text: k + " digit" + (k != 1 ? "s" : ""), value: "format(,." + k + "s)" };
				}) });

			values$$1.push({ text: "exponent", menu: [0, 1, 2, 3, 4, 8].map(function (k) {
					return { text: k + " digit" + (k != 1 ? "s" : ""), value: "format(,." + k + "e)" };
				}) });

			values$$1.push({ text: "hexadeximal", menu: [{ text: "upper case", value: "#format(X)" }, { text: "lower case", value: "format(x)" }] });

			values$$1.push({ text: "currency $ (rounded)", menu: [0, 1, 2, 4].map(function (k) {
					return { text: k + " digit" + (k != 1 ? "s" : ""), value: "format($,." + k + "r)" };
				}) });

			return values$$1;
		}
	},

	"dgf.valuesTimeFormat": {
		create: function create() {
			var now$$1 = new Date();
			return [{ text: "date", menu: [{ text: "Y-m-d - " + timeFormat("%Y-%m-%d")(now$$1), value: "timeFormat(%Y-%m-%d)" }, { text: "m/d/Y - " + timeFormat("%x")(now$$1), value: "timeFormat(%x)" }, { text: "Y/m/d - " + timeFormat("%Y/%m/%d")(now$$1), value: "timeFormat(%Y/%m/%d)" }, { text: "d.m.Y - " + timeFormat("%d.%m.%Y")(now$$1), value: "timeFormat(%d.%m.%Y)" }, { text: "Ymd - " + timeFormat("%Y%m%d")(now$$1), value: "timeFormat(%Y%m%d)" }, { text: "a, d. b y - " + timeFormat("%a, %d. %b %y")(now$$1), value: "timeFormat(%a, %d. %b %y)" }, { text: "A, d. B Y - " + timeFormat("%A, %d. %B %Y")(now$$1), value: "timeFormat(%A, %d. %B %Y)" }, { text: "y/m - " + timeFormat("%y/%m")(now$$1), value: "timeFormat(%y/%m)" }, { text: "y-m - " + timeFormat("%y-%m")(now$$1), value: "timeFormat(%y-%m)" }, { text: "m.y - " + timeFormat("%m.%y")(now$$1), value: "timeFormat(%m.%y)" }, { text: "b y - " + timeFormat("%b %y")(now$$1), value: "timeFormat(%b %y)" }, { text: "B Y - " + timeFormat("%B %Y")(now$$1), value: "timeFormat(%B %Y)" }, { text: "Y  - " + timeFormat("%Y")(now$$1), value: "timeFormat(%Y)" }

				//{ text: "iso - " + d3.isoFormat("%Y-%m-%dT%H:%M:%S.%LZ")(now), value: "isoFormat(%Y-%m-%dT%H:%M:%S.%LZ)" }
				] }, { text: "date/time", menu: [{ text: "Y-m-d H:M:S - " + timeFormat("%Y-%m-%d %X")(now$$1), value: "timeFormat(%Y-%m-%d %X)" }, { text: "m/d/Y H:M:S - " + timeFormat("%x %X")(now$$1), value: "timeFormat(%x %X)" }, { text: "Y/m/d H:M:S - " + timeFormat("%Y/%m/%d %X")(now$$1), value: "timeFormat(%Y/%m/%d %X)" }, { text: "d.m.Y H:M:S - " + timeFormat("%d.%m.%Y %X")(now$$1), value: "timeFormat(%d.%m.%Y %X)" }, { text: "a, d. b y H:M:S - " + timeFormat("%a, %d. %b %y %X")(now$$1), value: "timeFormat(%a, %d. %b %y %X)" }, { text: "A, d. B Y H:M:S - " + timeFormat("%A, %d. %B %Y %X")(now$$1), value: "timeFormat(%A, %d. %B %Y %X)" }, { text: "YmdHMS - " + timeFormat("%Y%m%d%H%M%S")(now$$1), value: "timeFormat(%Y%m%d%H%M%S)" }] }, { text: "time", menu: [{ text: "H:M:S - " + timeFormat("%X")(now$$1), value: "timeFormat(%X)" }, { text: "H:M - " + timeFormat("%H:%M")(now$$1), value: "timeFormat(%H:%M)" }, { text: "I:M:S p - " + timeFormat("%I:%M:%S %p")(now$$1), value: "timeFormat(%I:%M:%S %p)" }, { text: "I:M p - " + timeFormat("%I:%M %p")(now$$1), value: "timeFormat(%I:%M %p)" }, { text: "H:M:S UTC Z - " + timeFormat("%X UTC%Z")(now$$1), value: "timeFormat(%X UTC%Z)" }, { text: "H:M:S.ms - " + timeFormat("%H:%M:%S.%L")(now$$1), value: "timeFormat(%H:%M:%S.%L)" }] }, { text: "utc", menu: [{ text: "Y-m-d (utc) - " + utcFormat("%Y-%m-%d")(now$$1), value: "utcFormat(%Y-%m-%d)" }, { text: "m/d/Y (utc) - " + utcFormat("%x")(now$$1), value: "utcFormat(%x)" }, { text: "Y/m/d (utc) - " + utcFormat("%Y/%m/%d")(now$$1), value: "utcFormat(%Y/%m/%d)" }, { text: "d.m.Y (utc) - " + utcFormat("%d.%m.%Y")(now$$1), value: "utcFormat(%d.%m.%Y)" }, { text: "Ymd (utc) - " + utcFormat("%Y%m%d")(now$$1), value: "utcFormat(%Y%m%d)" }, { text: "iso (utc) - " + utcFormat("%Y-%m-%dT%H:%M:%S.%LZ")(now$$1), value: "utcFormat(%Y-%m-%dT%H:%M:%S.%LZ)" }, { text: "Y-m-d H:M:S (utc) - " + utcFormat("%Y-%m-%d %X")(now$$1), value: "utcFormat(%Y-%m-%d %X)" }, { text: "m/d/Y H:M:S (utc) - " + utcFormat("%x %X")(now$$1), value: "utcFormat(%x %X)" }, { text: "Y/m/d H:M:S (utc) - " + utcFormat("%Y/%m/%d %X")(now$$1), value: "utcFormat(%Y/%m/%d %X)" }, { text: "d.m.Y H:M:S (utc) - " + utcFormat("%d.%m.%Y %X")(now$$1), value: "utcFormat(%d.%m.%Y %X)" }, { text: "H:M:S (utc) - " + utcFormat("%X")(now$$1), value: "utcFormat(%X)" }, { text: "H:M (utc) - " + utcFormat("%H:%M")(now$$1), value: "utcFormat(%H:%M)" }, { text: "I:M:S p (utc) - " + utcFormat("%I:%M:%S %p")(now$$1), value: "utcFormat(%I:%M:%S %p)" }, { text: "I:M p (utc) - " + utcFormat("%I:%M %p")(now$$1), value: "utcFormat(%I:%M %p)" }, { text: "H:M:S UTC Z (utc) - " + utcFormat("%X UTC%Z")(now$$1), value: "utcFormat(%X UTC%Z)" }, { text: "H:M:S.ms (utc) - " + utcFormat("%H:%M:%S.%L")(now$$1), value: "utcFormat(%H:%M:%S.%L)" }] }];
		}
	},

	"dgf.valuesNumberParse": {
		create: function create() {
			return [{ text: "Number", value: "numberParse()" }, { text: "Percent %", value: "numberParse(%)" }, { text: "Kilo", value: "numberParse(K)" }, { text: "Million", value: "numberParse(M)" }, { text: "Billion", value: "numberParse(B)" }];
		}
	},

	"dgf.valuesTimeParse": {
		create: function create() {
			var now$$1 = new Date();
			return [{ text: "date", menu: [{ text: "Y-m-d - " + timeFormat("%Y-%m-%d")(now$$1), value: "timeParse(%Y-%m-%d)" }, { text: "m/d/Y - " + timeFormat("%x")(now$$1), value: "timeParse(%x)" }, { text: "Y/m/d - " + timeFormat("%Y/%m/%d")(now$$1), value: "timeParse(%Y/%m/%d)" }, { text: "d.m.Y - " + timeFormat("%d.%m.%Y")(now$$1), value: "timeParse(%d.%m.%Y)" }, { text: "Ymd - " + timeFormat("%Y%m%d")(now$$1), value: "timeParse(%Y%m%d)" }, { text: "a, d. b y - " + timeFormat("%a, %d. %b %y")(now$$1), value: "timeParse(%a, %d. %b %y)" }, { text: "A, d. B Y - " + timeFormat("%A, %d. %B %Y")(now$$1), value: "timeParse(%A, %d. %B %Y)" }, { text: "y/m - " + timeFormat("%y/%m")(now$$1), value: "timeParse(%y/%m)" }, { text: "y-m - " + timeFormat("%y-%m")(now$$1), value: "timeParse(%y-%m)" }, { text: "m.y - " + timeFormat("%m.%y")(now$$1), value: "timeParse(%m.%y)" }, { text: "b y - " + timeFormat("%b %y")(now$$1), value: "timeParse(%b %y)" }, { text: "B Y - " + timeFormat("%B %Y")(now$$1), value: "timeParse(%B %Y)" }, { text: "Y  - " + timeFormat("%Y")(now$$1), value: "timeParse(%Y)" }] }, { text: "date/time", menu: [{ text: "Y-m-d H:M:S - " + timeFormat("%Y-%m-%d %X")(now$$1), value: "timeParse(%Y-%m-%d %X)" }, { text: "m/d/Y H:M:S - " + timeFormat("%x %X")(now$$1), value: "timeParse(%x %X)" }, { text: "Y/m/d H:M:S - " + timeFormat("%Y/%m/%d %X")(now$$1), value: "timeParse(%Y/%m/%d %X)" }, { text: "d.m.Y H:M:S - " + timeFormat("%d.%m.%Y %X")(now$$1), value: "timeParse(%d.%m.%Y %X)" }, { text: "a, d. b y H:M:S - " + timeFormat("%a, %d. %b %y %X")(now$$1), value: "timeParse(%a, %d. %b %y %X)" }, { text: "A, d. B Y H:M:S - " + timeFormat("%A, %d. %B %Y %X")(now$$1), value: "timeParse(%A, %d. %B %Y %X)" }, { text: "YmdHMS - " + timeFormat("%Y%m%d%H%M%S")(now$$1), value: "timeParse(%Y%m%d%H%M%S)" }] }, { text: "time", menu: [{ text: "H:M:S - " + timeFormat("%X")(now$$1), value: "timeParse(%X)" }, { text: "H:M - " + timeFormat("%H:%M")(now$$1), value: "timeParse(%H:%M)" }, { text: "I:M:S p - " + timeFormat("%I:%M:%S %p")(now$$1), value: "timeParse(%I:%M:%S %p)" }, { text: "I:M p - " + timeFormat("%I:%M %p")(now$$1), value: "timeParse(%I:%M %p)" }, { text: "H:M:S UTC Z - " + timeFormat("%X UTC%Z")(now$$1), value: "timeParse(%X UTC%Z)" }, { text: "H:M:S.ms - " + timeFormat("%H:%M:%S.%L")(now$$1), value: "timeParse(%H:%M:%S.%L)" }] }, { text: "utc", menu: [{ text: "Y-m-d (utc) - " + utcFormat("%Y-%m-%d")(now$$1), value: "utcFormat(%Y-%m-%d)" }, { text: "m/d/Y (utc) - " + utcFormat("%x")(now$$1), value: "utcFormat(%x)" }, { text: "Y/m/d (utc) - " + utcFormat("%Y/%m/%d")(now$$1), value: "utcFormat(%Y/%m/%d)" }, { text: "d.m.Y (utc) - " + utcFormat("%d.%m.%Y")(now$$1), value: "utcFormat(%d.%m.%Y)" }, { text: "Ymd (utc) - " + utcFormat("%Y%m%d")(now$$1), value: "utcFormat(%Y%m%d)" }, { text: "iso (utc) - " + utcFormat("%Y-%m-%dT%H:%M:%S.%LZ")(now$$1), value: "utcFormat(%Y-%m-%dT%H:%M:%S.%LZ)" }, { text: "Y-m-d H:M:S (utc) - " + utcFormat("%Y-%m-%d %X")(now$$1), value: "utcFormat(%Y-%m-%d %X)" }, { text: "m/d/Y H:M:S (utc) - " + utcFormat("%x %X")(now$$1), value: "utcFormat(%x %X)" }, { text: "Y/m/d H:M:S (utc) - " + utcFormat("%Y/%m/%d %X")(now$$1), value: "utcFormat(%Y/%m/%d %X)" }, { text: "d.m.Y H:M:S (utc) - " + utcFormat("%d.%m.%Y %X")(now$$1), value: "utcFormat(%d.%m.%Y %X)" }, { text: "H:M:S (utc) - " + utcFormat("%X")(now$$1), value: "utcFormat(%X)" }, { text: "H:M (utc) - " + utcFormat("%H:%M")(now$$1), value: "utcFormat(%H:%M)" }, { text: "I:M:S p (utc) - " + utcFormat("%I:%M:%S %p")(now$$1), value: "utcFormat(%I:%M:%S %p)" }, { text: "I:M p (utc) - " + utcFormat("%I:%M %p")(now$$1), value: "utcFormat(%I:%M %p)" }, { text: "H:M:S UTC Z (utc) - " + utcFormat("%X UTC%Z")(now$$1), value: "utcFormat(%X UTC%Z)" }, { text: "H:M:S.ms (utc) - " + utcFormat("%H:%M:%S.%L")(now$$1), value: "utcFormat(%H:%M:%S.%L)" }] }];
		}
	},

	"dgf.valuesIntervalMillis": {
		create: function create() {
			return [{ text: "20 seconds", value: 20000 }, { text: "1 minute", value: 60000 }, { text: "5 minutes", value: 300000 }, { text: "20 minutes", value: 1200000 }, { text: "1 hour", value: 3600000 }, { text: "12 hours", value: 43200000 }, { text: "24 hours", value: 86400000 }];
		}
	},

	"dgf.valuesCSSWidth": {
		create: function create() {
			return [{ text: "100%", value: "100%" }, { text: "90%", value: "90%" }, { text: "80%", value: "80%" }, { text: "60%", value: "60%" }, { text: "50%", value: "50%" }, { text: "40%", value: "40%" }, { text: "30%", value: "30%" }, { text: "25%", value: "25%" }, { text: "more", menu: [{ text: "100% content-box", value: "100% content-box" }, { text: "75% content-box", value: "75% content-box" }, { text: "50% content-box", value: "50% content-box" }, { text: "max-content", value: "max-content" }, { text: "min-content", value: "min-content" }, { text: "available", value: "available" }, { text: "fit-content", value: "fit-content" }, { text: "auto", value: "auto" }, { text: "inherit", value: "inherit" }, { text: "initial", value: "initial" }, { text: "unset", value: "unset" }] }];
		}
	},

	"dgf.valuesCSSFloat": {
		create: function create() {
			return [{ text: "none", value: "none" }, { text: "left", value: "left" }, { text: "right", value: "right" }, { text: "inline-start", value: "inline-start" }, { text: "inline-end", value: "inline-end" }, { text: "inherit", value: "inherit" }, { text: "initial", value: "initial" }, { text: "unset", value: "unset" }];
		}
	},

	"dgf.valuesCSSClear": {
		create: function create() {
			return [{ text: "none", value: "none" }, { text: "left", value: "left" }, { text: "right", value: "right" }, { text: "both", value: "both" }, { text: "inline-start", value: "inline-start" }, { text: "inline-end", value: "inline-end" }, { text: "inherit", value: "inherit" }];
		}
	},

	"dgf.valuesFontSize": {
		create: function create() {
			return [{ text: "xx-small", value: "xx-small" }, { text: "x-small", value: "x-small" }, { text: "small", value: "small" }, { text: "medium", value: "medium" }, { text: "large", value: "large" }, { text: "x-large", value: "x-large" }, { text: "xx-large", value: "xx-large" }, { text: "larger", value: "larger" }, { text: "smaller", value: "smaller" }];
		}
	},

	"dgf.valuesPreserveAspectRatioAlign": {
		create: function create() {
			return [{ text: "xMidYMid", value: "xMidYMid" }, { text: "xMinYMin", value: "xMinYMin" }, { text: "xMidYMin", value: "xMidYMin" }, { text: "xMaxYMin", value: "xMaxYMin" }, { text: "xMinYMid", value: "xMinYMid" }, { text: "xMaxYMid", value: "xMaxYMid" }, { text: "xMinYMax", value: "xMinYMax" }, { text: "xMidYMax", value: "xMidYMax" }, { text: "xMaxYMax", value: "xMaxYMax" }, { text: "none", value: "none" }];
		}
	},

	"dgf.valuesPreserveAspectRatioMeetOrSlice": {
		create: function create() {
			return [{ text: "meet", value: "meet" }, { text: "slice", value: "slice" }];
		}
	},

	"dgf.valuesRotate": {
		create: function create() {
			return [{ text: "-15", value: "-15" }, { text: "-30", value: "-30" }, { text: "-45", value: "-45" }, { text: "-60", value: "-60" }, { text: "-90", value: "-90" }];
		}
	},

	"dgf.valuesTextAnchor": {
		create: function create() {
			return [{ text: "start", value: "start" }, { text: "middle", value: "middle" }, { text: "end", value: "end" }];
		}
	},

	"dgf.valuesStrokeWidth": {
		create: function create() {
			return [{ text: "xx-small", value: "0.5px" }, { text: "x-small", value: "1px" }, { text: "small", value: "2px" }, { text: "medium", value: "4px" }, { text: "large", value: "8px" }, { text: "x-large", value: "16px" }, { text: "xx-large", value: "32px" }];
		}
	},

	"dgf.valuesStrokeDashArray": {
		create: function create() {
			return [{ text: ". . . . .", value: "2,2" }, { text: "-------", value: "5,1" }, { text: "- - - -", value: "5,5" }, { text: "-  -  -  -", value: "5,10" }, { text: "-- -- -", value: "15,10,5,10" }];
		}
	},

	"dgf.valuesColorName": {
		create: function create() {
			return [{ text: "a - o", menu: [{ text: "aqua", value: "aqua" }, { text: "black", value: "black" }, { text: "blue", value: "blue" }, { text: "fuchsia", value: "fuchsia" }, { text: "gray", value: "gray" }, { text: "lime", value: "lime" }, { text: "maroon", value: "maroon" }, { text: "navy", value: "navy" }, { text: "olive", value: "olive" }, { text: "orange", value: "orange" }] }, { text: "p - z", menu: [{ text: "purple", value: "purple" }, { text: "red", value: "red" }, { text: "silver", value: "silver" }, { text: "teal", value: "teal" }, { text: "transparent", value: "transparent" }, { text: "white", value: "white" }, { text: "yellow", value: "yellow" }] }, { text: "extended", menu: [{ text: "aliceblue - chartreuse", menu: [{ text: "aliceblue", value: "aliceblue" }, { text: "antiquewhite", value: "antiquewhite" }, { text: "aquamarine", value: "aquamarine" }, { text: "azure", value: "azure" }, { text: "beige", value: "beige" }, { text: "bisque", value: "bisque" }, { text: "blanchedalmond", value: "blanchedalmond" }, { text: "blueviolet", value: "blueviolet" }, { text: "brown", value: "brown" }, { text: "burlywood", value: "burlywood" }, { text: "cadetblue", value: "cadetblue" }, { text: "chartreuse", value: "chartreuse" }] }, { text: "chocolate - darkkhaki", menu: [{ text: "chocolate", value: "chocolate" }, { text: "coral", value: "coral" }, { text: "cornflowerblue", value: "cornflowerblue" }, { text: "cornsilk", value: "cornsilk" }, { text: "crimson", value: "crimson" }, { text: "darkblue", value: "darkblue" }, { text: "darkcyan", value: "darkcyan" }, { text: "darkgoldenrod", value: "darkgoldenrod" }, { text: "darkgray", value: "darkgray" }, { text: "darkgreen", value: "darkgreen" }, { text: "darkgrey", value: "darkgrey" }, { text: "darkkhaki", value: "darkkhaki" }] }, { text: "darkmagenta - darkviolet", menu: [{ text: "darkmagenta", value: "darkmagenta" }, { text: "darkolivegreen", value: "darkolivegreen" }, { text: "darkorange", value: "darkorange" }, { text: "darkorchid", value: "darkorchid" }, { text: "darkred", value: "darkred" }, { text: "darksalmon", value: "darksalmon" }, { text: "darkseagreen", value: "darkseagreen" }, { text: "darkslateblue", value: "darkslateblue" }, { text: "darkslategray", value: "darkslategray" }, { text: "darkslategrey", value: "darkslategrey" }, { text: "darkturquoise", value: "darkturquoise" }, { text: "darkviolet", value: "darkviolet" }] }, { text: "deeppink - goldenrod", menu: [{ text: "deeppink", value: "deeppink" }, { text: "deepskyblue", value: "deepskyblue" }, { text: "dimgray", value: "dimgray" }, { text: "dimgrey", value: "dimgrey" }, { text: "dodgerblue", value: "dodgerblue" }, { text: "firebrick", value: "firebrick" }, { text: "floralwhite", value: "floralwhite" }, { text: "forestgreen", value: "forestgreen" }, { text: "gainsboro", value: "gainsboro" }, { text: "ghostwhite", value: "ghostwhite" }, { text: "gold", value: "gold" }, { text: "goldenrod", value: "goldenrod" }] }, { text: "greenyellow - lemonchiffon", menu: [{ text: "greenyellow", value: "greenyellow" }, { text: "grey", value: "grey" }, { text: "honeydew", value: "honeydew" }, { text: "hotpink", value: "hotpink" }, { text: "indianred", value: "indianred" }, { text: "indigo", value: "indigo" }, { text: "ivory", value: "ivory" }, { text: "khaki", value: "khaki" }, { text: "lavender", value: "lavender" }, { text: "lavenderblush", value: "lavenderblush" }, { text: "lawngreen", value: "lawngreen" }, { text: "lemonchiffon", value: "lemonchiffon" }] }, { text: "lightblue - lightslategray", menu: [{ text: "lightblue", value: "lightblue" }, { text: "lightcoral", value: "lightcoral" }, { text: "lightcyan", value: "lightcyan" }, { text: "lightgoldenrodyellow", value: "lightgoldenrodyellow" }, { text: "lightgray", value: "lightgray" }, { text: "lightgreen", value: "lightgreen" }, { text: "lightgrey", value: "lightgrey" }, { text: "lightpink", value: "lightpink" }, { text: "lightsalmon", value: "lightsalmon" }, { text: "lightseagreen", value: "lightseagreen" }, { text: "lightskyblue", value: "lightskyblue" }, { text: "lightslategray", value: "lightslategray" }] }, { text: "lightsteelblue - mediumturquoise", menu: [{ text: "lightsteelblue", value: "lightsteelblue" }, { text: "lightyellow", value: "lightyellow" }, { text: "limegreen", value: "limegreen" }, { text: "linen", value: "linen" }, { text: "mediumaquamarine", value: "mediumaquamarine" }, { text: "mediumblue", value: "mediumblue" }, { text: "mediumorchid", value: "mediumorchid" }, { text: "mediumpurple", value: "mediumpurple" }, { text: "mediumseagreen", value: "mediumseagreen" }, { text: "mediumslateblue", value: "mediumslateblue" }, { text: "mediumspringgreen", value: "mediumspringgreen" }, { text: "mediumturquoise", value: "mediumturquoise" }] }, { text: "mediumvioletred - palegreen", menu: [{ text: "mediumvioletred", value: "mediumvioletred" }, { text: "midnightblue", value: "midnightblue" }, { text: "mintcream", value: "mintcream" }, { text: "mistyrose", value: "mistyrose" }, { text: "moccasin", value: "moccasin" }, { text: "navajowhite", value: "navajowhite" }, { text: "oldlace", value: "oldlace" }, { text: "olivedrab", value: "olivedrab" }, { text: "orangered", value: "orangered" }, { text: "orchid", value: "orchid" }, { text: "palegoldenrod", value: "palegoldenrod" }, { text: "palegreen", value: "palegreen" }] }, { text: "paleturquoise - seagreen", menu: [{ text: "paleturquoise", value: "paleturquoise" }, { text: "palevioletred", value: "palevioletred" }, { text: "papayawhip", value: "papayawhip" }, { text: "peachpuff", value: "peachpuff" }, { text: "pink", value: "pink" }, { text: "plum", value: "plum" }, { text: "powderblue", value: "powderblue" }, { text: "rosybrown", value: "rosybrown" }, { text: "royalblue", value: "royalblue" }, { text: "saddlebrown", value: "saddlebrown" }, { text: "salmon", value: "salmon" }, { text: "sandybrown", value: "sandybrown" }, { text: "seagreen", value: "seagreen" }] }, { text: "seashell - turquoise", menu: [{ text: "seashell", value: "seashell" }, { text: "sienna", value: "sienna" }, { text: "skyblue", value: "skyblue" }, { text: "slateblue", value: "slateblue" }, { text: "slategray", value: "slategray" }, { text: "snow", value: "snow" }, { text: "springgreen", value: "springgreen" }, { text: "steelblue", value: "steelblue" }, { text: "tan", value: "tan" }, { text: "thistle", value: "thistle" }, { text: "tomato", value: "tomato" }, { text: "turquoise", value: "turquoise" }] }, { text: "violet - rebeccapurple", menu: [{ text: "violet", value: "violet" }, { text: "wheat", value: "wheat" }, { text: "whitesmoke", value: "whitesmoke" }, { text: "yellowgreen", value: "yellowgreen" }, { text: "rebeccapurple", value: "rebeccapurple" }] }] }];
		}
	},

	"dgf.valuesInterpolateCustom": {
		create: function create() {
			return [{ text: "interpolateRgb", value: "interpolateRgb(lightgrey,black,1.0)" }, { text: "interpolateHsl", value: "interpolateHsl(lightgrey,black,1.0)" }, { text: "interpolateLab", value: "interpolateLab(lightgrey,black)" }, { text: "interpolateHcl", value: "interpolateHcl(lightgrey,black)" }, { text: "interpolateCubehelix", value: "interpolateCubehelix(lightgrey,black,1.0)" }];
		}
	},

	"dgf.fieldsetParseData": {
		create: function create(formFactory, prefix) {
			return {
				type: "fieldset",
				label: "parse",
				layout: "grid",
				columns: 2,
				defaults: {},
				items: [{ type: "label", text: "attribute" }, { type: "label", text: "parse" }, {
					type: "combobox",
					classes: "parsemap",
					name: prefix + "parse_rule0_attribute",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					tooltip: "Attribute of the data. Ex. x / y"
				}, {
					type: "combobox",
					name: prefix + "parse_rule0_parser",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }, { text: "number", menu: formFactory.lookup("dgf.valuesNumberParse").create() }, { text: "time", menu: formFactory.lookup("dgf.valuesTimeParse").create() }],
					tooltip: "Parser for the data attribute."
				}, {
					type: "combobox",
					classes: "parsemap",
					name: prefix + "parse_rule1_attribute",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					tooltip: "Attribute of the data. Ex. x / y"
				}, {
					type: "combobox",
					name: prefix + "parse_rule1_parser",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }, { text: "number", menu: formFactory.lookup("dgf.valuesNumberParse").create() }, { text: "time", menu: formFactory.lookup("dgf.valuesTimeParse").create() }],
					tooltip: "Parser for the data attribute."
				}, {
					type: "combobox",
					classes: "parsemap",
					name: prefix + "parse_rule2_attribute",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					tooltip: "Attribute of the data. Ex. x / y"
				}, {
					type: "combobox",
					name: prefix + "parse_rule2_parser",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }, { text: "number", menu: formFactory.lookup("dgf.valuesNumberParse").create() }, { text: "time", menu: formFactory.lookup("dgf.valuesTimeParse").create() }],
					tooltip: "Parser for the data attribute."
				}, {
					type: "combobox",
					classes: "parsemap",
					name: prefix + "parse_rule3_attribute",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					tooltip: "Attribute of the data. Ex. x / y"
				}, {
					type: "combobox",
					name: prefix + "parse_rule3_parser",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }, { text: "number", menu: formFactory.lookup("dgf.valuesNumberParse").create() }, { text: "time", menu: formFactory.lookup("dgf.valuesTimeParse").create() }],
					tooltip: "Parser for the data attribute."
				}, {
					type: "combobox",
					classes: "parsemap",
					name: prefix + "parse_rule4_attribute",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					tooltip: "Attribute of the data. Ex. x / y"
				}, {
					type: "combobox",
					name: prefix + "parse_rule4_parser",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }, { text: "number", menu: formFactory.lookup("dgf.valuesNumberParse").create() }, { text: "time", menu: formFactory.lookup("dgf.valuesTimeParse").create() }],
					tooltip: "Parser for the data attribute."
				}]
			};
		}
	},

	"dgf.fieldsetSizeMargin": {
		create: function create(formFactory, prefix) {
			return {
				type: "fieldset",
				label: "size & margin",
				layout: "grid",
				columns: 3,
				defaults: {
					type: "textbox",
					subtype: "number",
					maxWidth: 60
				},

				items: [{
					name: prefix + "width",
					label: "width",
					tooltip: "Width of the chart"
				}, {
					name: prefix + "height",
					label: "height",
					tooltip: "Height of the chart"
				}, {
					type: "listbox",
					name: prefix + "inheritSize",
					label: "inherit",
					values: [{ text: "n/a", value: "n/a" }, { text: "none", value: "none" }, { text: "client width", value: "clientWidth" }],
					maxWidth: 120,
					tooltip: "Inherit the with of an ancestor"
				}, {
					name: prefix + "margin_top",
					label: "top",
					tooltip: "Margin top"
				}, {
					name: prefix + "margin_right",
					label: "right",
					tooltip: "Margin right"
				}, { type: "spacer" }, {
					name: prefix + "margin_bottom",
					label: "bottom",
					tooltip: "Margin bottom"
				}, {
					name: prefix + "margin_left",
					label: "left",
					tooltip: "Margin left"
				}, { type: "spacer" }]
			};
		}
	},

	"dgf.fieldsetPreserveAspectRatio": {
		create: function create(formFactory, prefix) {
			return {
				type: "fieldset",
				label: "aspect ratio",
				tooltip: "preserveAspectRatio indicates how referenced images should be fitted with respect to the reference rectangle.",
				layout: "grid",
				columns: 2,
				items: [{
					type: "listbox",
					name: prefix + "preserveAspectRatio_align",
					values: formFactory.create(prefix, "dgf.valuesPreserveAspectRatioAlign"),
					label: "align",
					tooltip: "Force uniform scaling."
				}, {
					type: "listbox",
					name: prefix + "preserveAspectRatio_meetOrSlice",
					values: formFactory.create(prefix, "dgf.valuesPreserveAspectRatioMeetOrSlice"),
					label: "meet/slice",
					tooltip: "Scale the graphic such that: aspect ratio is preserved, the entire viewBox is visible within the viewport. Meet: the viewBox is scaled up as much as possible. Slice: the viewBox is scaled down as much as possible."
				}]
			};
		}
	},

	"dgf.fieldsetData": {
		create: function create(formFactory, prefix) {
			return {
				type: "fieldset",
				label: "data",
				layout: "grid",
				columns: 3,
				defaults: {
					type: "combobox",
					classes: "datamap",
					minWidth: 125
				},
				items: [{
					name: prefix + "x",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					label: "x",
					tooltip: "x attribute of the data. Ex. x / d(1)"
				}, {
					name: prefix + "y",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					label: "y",
					tooltip: "y attribute of the data. Ex. y / d(2)"
				}, {
					name: prefix + "y1",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					label: "y1",
					tooltip: "y1 attribute of the data. Ex. y1 / d(3)"
				}, {
					name: prefix + "key",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					label: "key",
					tooltip: "key attribute of the data. Ex. id / d(0)"
				}, {
					name: prefix + "color",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					label: "color",
					tooltip: "color attribute of the data. Ex. green / red, green, blue"
				}, {
					name: prefix + "text",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					label: "text",
					tooltip: "text attribute of the data. Ex. comment / y"
				}]
			};
		}
	},

	"dgf.fieldsetScales": {
		create: function create(formFactory, prefix) {
			return {
				type: "fieldset",
				label: "scales",
				layout: "grid",
				columns: 2,
				defaults: {},
				items: [{
					type: "listbox",
					name: prefix + "xScale_type",
					label: "x",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.typesByCategory("scale")),
					tooltip: "Type of the x-scale."
				}, {
					type: "combobox",
					classes: "domainmap",
					name: prefix + "xScale_domain",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					label: "domain",
					tooltip: "Domain of the x-scale. Ex. map(x) / x,y / extenty1ero(y) / keys() / value,first,second"
				}, { type: "spacer" }, {
					type: "slider",
					subtype: "number",
					name: prefix + "xScale_paddingInner",
					minValue: 0,
					maxValue: 1,
					label: "inner",
					tooltip: "Inner padding of the x-scale. Ex. 0.1 / 0.5",
					ondragend: function ondragend(event$$1) {
						event$$1.control.value(Math.round(event$$1.value * 100) / 100);
					}
				}, { type: "spacer" }, {
					type: "slider",
					subtype: "number",
					name: prefix + "xScale_paddingOuter",
					minValue: 0,
					maxValue: 1,
					label: "outer",
					tooltip: "Outer padding of the x-scale. Ex. 0.1 / 0.5",
					ondragend: function ondragend(event$$1) {
						event$$1.control.value(Math.round(event$$1.value * 100) / 100);
					}
				}, {
					type: "listbox",
					name: prefix + "yScale_type",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.typesByCategory("scale")),
					label: "y",
					tooltip: "Type of the y-scale."
				}, {
					type: "combobox",
					classes: "domainmap",
					name: prefix + "yScale_domain",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					label: "domain",
					tooltip: "Domain of the y-scale. Ex. extent(y) / map(y) / 0,10"
				}, { type: "spacer" }, {
					type: "slider",
					subtype: "number",
					name: prefix + "yScale_paddingInner",
					minValue: 0,
					maxValue: 1,
					label: "inner",
					tooltip: "Inner padding of the y-scale. Ex. 0.1 / 0.5",
					ondragend: function ondragend(event$$1) {
						event$$1.control.value(Math.round(event$$1.value * 100) / 100);
					}
				}, { type: "spacer" }, {
					type: "slider",
					subtype: "number",
					name: prefix + "yScale_paddingOuter",
					minValue: 0,
					maxValue: 1,
					label: "outer",
					tooltip: "Outer padding of the y-scale. Ex. 0.1 / 0.5",
					ondragend: function ondragend(event$$1) {
						event$$1.control.value(Math.round(event$$1.value * 100) / 100);
					}
				}, {
					type: "listbox",
					name: prefix + "y1Scale_type",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.typesByCategory("scale")),
					label: "y1",
					tooltip: "Type of the y1-scale."
				}, {
					type: "combobox",
					classes: "domainmap",
					name: prefix + "y1Scale_domain",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					label: "domain",
					tooltip: "Domain of the y1-scale. Ex. extent(y) / map(x) / 0,10"
				}, { type: "spacer" }, {
					type: "textbox",
					name: prefix + "y1Scale_range",
					label: "range",
					tooltip: "Range of the y1-scale. Ex. 0,10"
				}, {
					type: "listbox",
					name: prefix + "colorScale_type",
					label: "color",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.typesByCategory("scale")),
					tooltip: "Type of the color scale. Use Sequential Scale for range interpolate."
				}, {
					type: "combobox",
					classes: "domainmap",
					name: prefix + "colorScale_domain",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					label: "domain",
					tooltip: "Domain of the color scale. Ex. map(x) / x,y / extentZero(y) / keys() / 5,9,10"
				}, { type: "spacer" }, {
					type: "combobox",
					name: prefix + "colorScale_range",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.typesByCategory("scheme")).concat([{ text: "single color", menu: formFactory.create(prefix, "dgf.valuesColorName") }]).concat([{ text: "interpolate", menu: formFactory.typesByCategory("interpolate").concat([{ text: "custom", menu: formFactory.create(prefix, "dgf.valuesInterpolateCustom") }])
					}]),
					label: "range",
					tooltip: "Range of the color scale. Use interpolators in combination with a Sequential Scales. Ex. red,green,blue / dgf.schemeFews9 / d3.interpolateGreys)"
				}]
			};
		}
	},

	"dgf.fieldsetScalesSmall": {
		create: function create(formFactory, prefix) {
			return {
				type: "fieldset",
				label: "scales",
				layout: "grid",
				columns: 2,
				defaults: {},
				items: [{
					type: "listbox",
					name: prefix + "y1Scale_type",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.typesByCategory("scale")),
					label: "y1",
					tooltip: "Type of the y1-scale."
				}, {
					type: "combobox",
					classes: "domainmap",
					name: prefix + "y1Scale_domain",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					label: "domain",
					tooltip: "Domain of the y1-scale. Ex. extent(y) / map(x) / 0,10"
				}, { type: "spacer" }, {
					type: "textbox",
					name: prefix + "y1Scale_range",
					label: "range",
					tooltip: "Range of the y1-scale. Ex. 0,10"
				}, {
					type: "listbox",
					name: prefix + "colorScale_type",
					label: "color",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.typesByCategory("scale")),
					tooltip: "Type of the color scale. Use Sequential Scale for range interpolate."
				}, {
					type: "combobox",
					classes: "domainmap",
					name: prefix + "colorScale_domain",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }, { text: "Custom List", value: "list(0,5,10)" }],
					label: "domain",
					tooltip: "Domain of the color scale. Ex. map() / map(x) / x,y, / extentZero(y) / keys() / 5,9,10"
				}, { type: "spacer" }, {
					type: "combobox",
					name: prefix + "colorScale_range",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.typesByCategory("scheme")).concat([{ text: "single color", menu: formFactory.create(prefix, "dgf.valuesColorName") }]).concat([{ text: "interpolate", menu: formFactory.typesByCategory("interpolate").concat([{ text: "custom", menu: formFactory.create(prefix, "dgf.valuesInterpolateCustom") }])
					}]),
					label: "range",
					tooltip: "Range of the color scale. Use interpolators in combination with Sequential Scales. Ex. list(red,green,blue) / dgf.schemeFews9 / interpolate(hsl,green,red,0.5) / #interpolate(d3.interpolateGreys)"
				}]
			};
		}
	},

	"dgf.fieldsetScalesColor": {
		create: function create(formFactory, prefix) {
			return {
				type: "fieldset",
				label: "scales",
				layout: "grid",
				columns: 2,
				defaults: {},
				items: [{
					type: "listbox",
					name: prefix + "colorScale_type",
					label: "color",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.typesByCategory("scale")),
					tooltip: "Type of the color scale. Use Sequential Scale for range interpolate."
				}, {
					type: "combobox",
					classes: "domainmap",
					name: prefix + "colorScale_domain",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }, { text: "Custom List", value: "list(0,5,10)" }],
					label: "domain",
					tooltip: "Domain of the color scale. Ex. map() / map(x) / x,y, / extentZero(y) / keys() / 5,9,10"
				}, { type: "spacer" }, {
					type: "combobox",
					name: prefix + "colorScale_range",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.typesByCategory("scheme")).concat([{ text: "single color", menu: formFactory.create(prefix, "dgf.valuesColorName") }]).concat([{ text: "interpolate", menu: formFactory.typesByCategory("interpolate").concat([{ text: "custom", menu: formFactory.create(prefix, "dgf.valuesInterpolateCustom") }])
					}]),
					label: "range",
					tooltip: "Range of the color scale. Use interpolators in combination with Sequential Scales. Ex. list(red,green,blue) / dgf.schemeFews9 / interpolate(hsl,green,red,0.5) / #interpolate(d3.interpolateGreys)"
				}]
			};
		}
	},

	"dgf.fieldsetText": {
		create: function create(formFactory, prefix) {
			return {
				type: "fieldset",
				label: "text",
				layout: "grid",
				columns: 2,
				items: [{
					type: "combobox",
					name: prefix + "textFormat",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }, { text: "number", menu: formFactory.create(prefix, "dgf.valuesNumberFormat") }, { text: "time", menu: formFactory.create(prefix, "dgf.valuesTimeFormat") }],
					label: "format",
					tooltip: "Format of the text."
				}, { type: "spacer" }, {
					type: "combobox",
					name: prefix + "anchor",
					value: "n/a",
					label: "anchor",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.create(prefix, "dgf.valuesTextAnchor")),
					tooltip: "Anchor of the text. Ex. middle, start, end"
				}, {
					type: "combobox",
					name: prefix + "rotate",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.create(prefix, "dgf.valuesRotate")),
					label: "rotate",
					tooltip: "Rotation angle of the text. Ex. -30 / -90"
				}, {
					type: "textbox",
					name: prefix + "dx",
					label: "delta x",
					tooltip: "Delta x of the text. Ex. 100 / 1em / threshold(x,0,1em,-1em)"
				}, {
					type: "textbox",
					name: prefix + "dy",
					label: "delta y",
					tooltip: "Delta y of the text. Ex. 100 / 1em / threshold(y,0,1em,-1em)"
				}]
			};
		}
	},

	"dgf.fieldsetTextSmall": {
		create: function create(formFactory, prefix) {
			return {
				type: "fieldset",
				label: "text",
				layout: "grid",
				columns: 2,
				items: [{
					type: "combobox",
					name: prefix + "textFormat",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }, { text: "number", menu: formFactory.create(prefix, "dgf.valuesNumberFormat") }, { text: "time", menu: formFactory.create(prefix, "dgf.valuesTimeFormat") }],
					label: "format",
					tooltip: "Format of the text."
				}, { type: "spacer" }]
			};
		}
	},

	"dgf.fieldsetLine": {
		create: function create(formFactory, prefix) {
			return {
				type: "fieldset",
				label: "line",
				layout: "grid",
				columns: 2,
				items: [{
					type: "listbox",
					name: prefix + "line_type",
					value: "d3.line",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.typesByCategory("line generator")),
					label: "type",
					tooltip: "Line generator."
				}, { type: "spacer" }, {
					type: "listbox",
					name: prefix + "line_curve_type",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.typesByCategory("curve")),
					label: "curve",
					tooltip: "Curve of the line."
				}, {
					type: "slider",
					subtype: "number",
					name: prefix + "line_curve_tension",
					minValue: 0.0,
					maxValue: 1.0,
					label: "tension",
					tooltip: "Tension of the curve (Cardinal).",
					ondragend: function ondragend(event$$1) {
						event$$1.control.value(Math.round(event$$1.value * 100) / 100);
					}
				}, { type: "spacer" }, {
					type: "slider",
					subtype: "number",
					name: prefix + "line_curve_alpha",
					minValue: 0.0,
					maxValue: 1.0,
					label: "alpha",
					tooltip: "Alpha of the curve (CatmullRom).",
					ondragend: function ondragend(event$$1) {
						event$$1.control.value(Math.round(event$$1.value * 100) / 100);
					}
				}, { type: "spacer" }, {
					type: "slider",
					subtype: "number",
					name: prefix + "line_curve_beta",
					minValue: 0.0,
					maxValue: 1.0,
					label: "beta",
					tooltip: "Beta of the curve (Bundle).",
					ondragend: function ondragend(event$$1) {
						event$$1.control.value(Math.round(event$$1.value * 100) / 100);
					}
				}, {
					type: "combobox",
					name: prefix + "strokeWidth",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.create(prefix, "dgf.valuesStrokeWidth")),
					label: "stroke",
					tooltip: "Stroke width of the line."
				}, {
					type: "combobox",
					name: prefix + "strokeDashArray",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.create(prefix, "dgf.valuesStrokeDashArray")),
					label: "dash",
					tooltip: "Stroke dash array of the line. Ex. 5,5 / 5,10,5"
				}, {
					type: "combobox",
					classes: "datamap",
					name: prefix + "label",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					label: "label",
					tooltip: "Label of the line."
				}]
			};
		}
	},

	"dgf.fieldsetPie": {
		create: function create(formFactory, prefix) {
			return {
				type: "fieldset",
				label: "pie",
				layout: "grid",
				columns: 3,
				defaults: {
					type: "textbox",
					subtype: "number",
					step: 5,
					maxWidth: 80
				},
				items: [{
					type: "combobox",
					subtype: null,
					classes: "datamap",
					name: prefix + "yLabel",
					label: "label",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					maxWidth: 160,
					tooltip: "The label to display for y values."
				}, { type: "spacer" }, { type: "spacer" }, {
					name: prefix + "arc_innerRadius",
					label: "inner radius",
					step: 0.05,
					tooltip: "Inner radius of the arc in % of the outer radius.",
					ondragend: function ondragend(event$$1) {
						event$$1.control.value(event$$1.value);
					}
				}, { type: "spacer" }, { type: "spacer" }, {
					name: prefix + "pie_startAngle",
					label: "angle start",
					tooltip: "Start angle of the pie in degrees.",
					ondragend: function ondragend(event$$1) {
						event$$1.control.value(event$$1.value);
					}
				}, {
					name: prefix + "pie_endAngle",
					label: "end",
					tooltip: "End angle of the pie in degrees.",
					ondragend: function ondragend(event$$1) {
						event$$1.control.value(event$$1.value);
					}
				}, {
					name: prefix + "pie_padAngle",
					label: "pad",
					step: 0.5,
					tooltip: "Pad angle of the pie in degrees.",
					ondragend: function ondragend(event$$1) {
						event$$1.control.value(event$$1.value);
					}
				}]
			};
		}
	},

	"dgf.fieldsetBackground": {
		create: function create(formFactory, prefix) {
			return {
				type: "fieldset",
				label: "background",
				layout: "grid",
				columns: 3,
				defaults: {},
				items: [{
					type: "combobox",
					name: prefix + "fill",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.typesByCategory("scheme")).concat([{ text: "single color", menu: formFactory.create(prefix, "dgf.valuesColorName") }]),
					label: "fill",
					tooltip: "Fill color of the background"
				}, {
					type: "textbox",
					subtype: "number",
					name: prefix + "opacity",
					label: "opacity",
					step: 0.05,
					minValue: 0,
					maxValue: 1,
					tooltip: "Opacity of the background"
				}, { type: "spacer" }]
			};
		}
	},

	"dgf.fieldsetBubble": {
		create: function create(formFactory, prefix) {
			return {
				type: "fieldset",
				label: "bubble",
				layout: "grid",
				columns: 2,
				defaults: {},
				items: [{
					type: "listbox",
					name: prefix + "sort_type",
					values: [{ text: "n/a", value: "n/a" }, { text: "ascending", value: "d3.ascending" }, { text: "descending", value: "d3.descending" }],
					label: "sort",
					tooltip: "Sort order of the bubbles"
				}, {
					type: "textbox",
					subtype: "number",
					step: 0.5,
					name: prefix + "pack_padding",
					label: "padding",
					tooltip: "The padding between the bubbles."
				}, {
					type: "combobox",
					name: prefix + "stroke_width",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.create(prefix, "dgf.valuesStrokeWidth")),
					label: "stroke",
					tooltip: "Stroke width of the line."
				}, {
					type: "combobox",
					name: prefix + "stroke_dashArray",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.create(prefix, "dgf.valuesStrokeDashArray")),
					label: "dash",
					tooltip: "Stroke dash array of the line. Ex. 5,5 / 5,10,5"
				}, {
					type: "combobox",
					subtype: null,
					classes: "datamap",
					name: prefix + "yLabel",
					label: "label",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					tooltip: "The label to display for y values."
				}, {
					type: "checkbox",
					name: prefix + "bubble_noFill",
					label: "no fill",
					tooltip: "Do not fill the bubbles."
				}]
			};
		}
	},

	"dgf.fieldsetPackLabel": {
		create: function create(formFactory, prefix) {
			return {
				type: "fieldset",
				label: "label",
				layout: "grid",
				columns: 2,
				defaults: {},
				items: [{
					type: "listbox",
					name: prefix + "sort_type",
					values: [{ text: "n/a", value: "n/a" }, { text: "ascending", value: "d3.ascending" }, { text: "descending", value: "d3.descending" }],
					label: "sort",
					tooltip: "Sort order of the bubbles"
				}, {
					type: "textbox",
					subtype: "number",
					step: 0.5,
					name: prefix + "pack_padding",
					label: "padding",
					tooltip: "The padding between the bubbles."
				}, {
					type: "combobox",
					subtype: null,
					classes: "datamap",
					name: prefix + "yLabel",
					label: "label",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					tooltip: "The label to display for y values."
				}, { type: "spacer" }]
			};
		}
	},

	"dgf.fieldsetAxis": {
		create: function create(formFactory, prefix) {
			return {
				type: "fieldset",
				label: "axis",
				layout: "grid",
				columns: 4,
				defaults: {
					minWidth: 100,
					maxWidth: 200
				},
				items: [{
					type: "spacer"
				}, {
					type: "label",
					text: "x-axis"
				}, {
					type: "label",
					text: "y-axis"
				}, {
					type: "label",
					text: "y1-axis"
				}, {
					type: "label",
					text: "label"
				}, {
					type: "combobox",
					classes: "datamap",
					name: prefix + "xLabel",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					tooltip: "The label to display for x values."
				}, {
					type: "combobox",
					classes: "datamap",
					name: prefix + "yLabel",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					tooltip: "The label to display for y values."
				}, {
					type: "combobox",
					classes: "datamap",
					name: prefix + "y1Label",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					tooltip: "The label to display for y1 values."
				}, {
					type: "label",
					text: "ticks"
				}, {
					type: "textbox",
					subtype: "number",
					name: prefix + "xTicks",
					value: "n/a",
					tooltip: "Number of ticks of the x-axis. Ex. 3 / 5"
				}, {
					type: "textbox",
					subtype: "number",
					name: prefix + "yTicks",
					value: "n/a",
					tooltip: "Number of ticks of the y-axis. Ex. 3 / 5"
				}, {
					type: "textbox",
					subtype: "number",
					name: prefix + "y1Ticks",
					value: "n/a",
					tooltip: "Number of ticks of the y1-axis. Ex. 3 / 5"
				}, {
					type: "label",
					text: "tick values"
				}, {
					type: "textbox",
					name: prefix + "xTickValues",
					tooltip: "Tick values of the x-axis. Ex. 0,5,10"
				}, {
					type: "textbox",
					name: prefix + "yTickValues",
					tooltip: "Tick values of the y-axis. Ex. 0,5,10"
				}, {
					type: "textbox",
					name: prefix + "y1TickValues",
					tooltip: "Tick values of the y1-axis. Ex. 0,5,10"
				}, {
					type: "label",
					text: "tick rotate"
				}, {
					type: "combobox",
					name: prefix + "xTickRotate",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.create(prefix, "dgf.valuesRotate")),
					tooltip: "Tick rotation of the x-axis. Ex. -45"
				}, {
					type: "combobox",
					name: prefix + "yTickRotate",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.create(prefix, "dgf.valuesRotate")),
					tooltip: "Tick rotation of the y-axis. Ex. -45"
				}, {
					type: "combobox",
					name: prefix + "y1TickRotate",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.create(prefix, "dgf.valuesRotate")),
					tooltip: "Tick rotation of the y1-axis. Ex. -45"
				}, {
					type: "label",
					text: "format"
				}, {
					type: "combobox",
					name: prefix + "xFormat",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }, { text: "number", menu: formFactory.create(prefix, "dgf.valuesNumberFormat") }, { text: "time", menu: formFactory.create(prefix, "dgf.valuesTimeFormat") }],
					tooltip: "The display format for x values."
				}, {
					type: "combobox",
					name: prefix + "yFormat",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }, { text: "number", menu: formFactory.create(prefix, "dgf.valuesNumberFormat") }, { text: "time", menu: formFactory.create(prefix, "dgf.valuesTimeFormat") }],
					tooltip: "The display format for y values."
				}, {
					type: "combobox",
					name: prefix + "y1Format",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }, { text: "number", menu: formFactory.create(prefix, "dgf.valuesNumberFormat") }, { text: "time", menu: formFactory.create(prefix, "dgf.valuesTimeFormat") }],
					tooltip: "The display format for y1 values."
				}, {
					type: "label",
					text: "grid"
				}, {
					type: "combobox",
					name: prefix + "xGrid_strokeDashArray",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.create(prefix, "dgf.valuesStrokeDashArray")),
					tooltip: "Stroke dash array of the x grid. Ex. 5,5 / 5,10,5"
				}, {
					type: "combobox",
					name: prefix + "yGrid_strokeDashArray",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.create(prefix, "dgf.valuesStrokeDashArray")),
					tooltip: "Stroke dash array of the y grid. Ex. 5,5 / 5,10,5"
				}, {
					type: "combobox",
					name: prefix + "y1Grid_strokeDashArray",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.create(prefix, "dgf.valuesStrokeDashArray")),
					tooltip: "Stroke dash array of the y1 grid. Ex. 5,5 / 5,10,5"
				}, {
					type: "label",
					text: "hide"
				}, {
					type: "checkbox",
					name: prefix + "xHide",
					tooltip: "Hide the x-axis."
				}, {
					type: "checkbox",
					name: prefix + "yHide",
					tooltip: "Hide the y-axis."
				}, {
					type: "checkbox",
					name: prefix + "y1Hide",
					tooltip: "Hide the y1-axis."
				}]
			};
		}
	},

	"dgf.fieldsetTransitions": {
		create: function create(formFactory, prefix) {
			return {
				type: "fieldset",
				label: "transitions",
				layout: "grid",
				columns: 3,
				defaults: {
					minWidth: 100,
					maxWidth: 200
				},
				items: [{
					type: "label",
					text: "ease",
					label: " "
				}, {
					type: "label",
					text: "delay"
				}, {
					type: "label",
					text: "duration"
				}, {
					type: "listbox",
					name: prefix + "transition_ease",
					value: "n/a",
					label: "update",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.typesByCategory("ease")),
					tooltip: "Easing of the transition."
				}, {
					type: "combobox",
					classes: "delaymap",
					name: prefix + "transition_delay",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					tooltip: "Delay of the transition in ms. Ex. 500 / indexed(500)"
				}, {
					type: "combobox",
					classes: "durationmap",
					name: prefix + "transition_duration",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					tooltip: "Duration of the transition in ms. Ex. 500 / indexed(500)"
				}, {
					type: "listbox",
					name: prefix + "enterTransition_ease",
					label: "enter",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.typesByCategory("ease")),
					tooltip: "Easing of the transition."
				}, {
					type: "combobox",
					classes: "delaymap",
					name: prefix + "enterTransition_delay",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					tooltip: "Delay of the transition in ms. Ex. 500 / indexed(500)"
				}, {
					type: "combobox",
					classes: "durationmap",
					name: prefix + "enterTransition_duration",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					tooltip: "Duration of the transition in ms. Ex. 500 / indexed(500)"
				}, {
					type: "listbox",
					name: prefix + "exitTransition_ease",
					value: "n/a",
					label: "exit",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.typesByCategory("ease")),
					tooltip: "Easing of the transition."
				}, {
					type: "combobox",
					classes: "delaymap",
					name: prefix + "exitTransition_delay",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					tooltip: "Delay of the transition in ms. Ex. 500 / indexed(500)"
				}, {
					type: "combobox",
					classes: "durationmap",
					name: prefix + "exitTransition_duration",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					tooltip: "Duration of the transition in ms. Ex. 500 / indexed(500)"
				}]
			};
		}
	},

	"dgf.fieldsetTransitionsSmall": {
		create: function create(formFactory, prefix) {
			return {
				type: "fieldset",
				label: "transitions",
				layout: "grid",
				columns: 3,
				defaults: {
					minWidth: 100,
					maxWidth: 200
				},
				items: [{
					type: "label",
					text: "ease",
					label: " "
				}, {
					type: "label",
					text: "delay"
				}, {
					type: "label",
					text: "duration"
				}, {
					type: "listbox",
					name: prefix + "transition_ease",
					label: " ",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.typesByCategory("ease")),
					tooltip: "Easing of the transition."
				}, {
					type: "combobox",
					classes: "delaymap",
					name: prefix + "transition_delay",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					tooltip: "Delay of the transition in ms. Ex. 500 / indexed(500)"
				}, {
					type: "combobox",
					classes: "durationmap",
					name: prefix + "transition_duration",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }],
					tooltip: "Duration of the transition in ms. Ex. 500 / indexed(500)"
				}]
			};
		}
	},

	"dgf.fieldsetLayer": {
		create: function create(formFactory, prefix) {
			return {
				type: "fieldset",
				label: "layer",
				layout: "grid",
				columns: 3,
				defaults: {
					minWidth: 100,
					maxWidth: 200
				},
				items: [{
					type: "textbox",
					subtype: "number",
					name: prefix + "layer_zIndex",
					label: "z-index",
					tooltip: "z-index of the layer."
				}, {
					type: "checkbox",
					name: prefix + "layer_hide",
					label: "hide",
					tooltip: "Hide the layer."
				}, { type: "spacer" }, {
					type: "textbox",
					subtype: "number",
					name: prefix + "layer_transform_translate_x",
					step: 5,
					label: "translate x",
					tooltip: "x translation of the layer."
				}, {
					type: "textbox",
					subtype: "number",
					name: prefix + "layer_transform_translate_y",
					step: 5,
					label: "translate y",
					tooltip: "y translation of the layer."
				}, { type: "spacer" }, {
					type: "textbox",
					subtype: "number",
					name: prefix + "layer_transform_scale_x",
					step: 0.1,
					label: "scale x",
					tooltip: "x scale of the layer."
				}, {
					type: "textbox",
					subtype: "number",
					name: prefix + "layer_transform_scale_y",
					step: 0.1,
					label: "scale y",
					tooltip: "y scale of the layer."
				}, { type: "spacer" }, {
					type: "textbox",
					subtype: "number",
					name: prefix + "layer_transform_rotate_a",
					step: 5,
					label: "rotate a",
					tooltip: "Rotation angle of the layer in degrees."
				}, {
					type: "textbox",
					subtype: "number",
					name: prefix + "layer_transform_rotate_x",
					step: 5,
					label: "rotate x",
					tooltip: "Rotation x point of the layer."
				}, {
					type: "textbox",
					subtype: "number",
					name: prefix + "layer_transform_rotate_y",
					step: 5,
					label: "rotate y",
					tooltip: "Rotation y point of the layer."
				}]
			};
		}
	},

	"dgf.fieldsetStyleFigure": {
		create: function create(formFactory, prefix) {
			return {
				type: "fieldset",
				label: "figure",
				tooltip: "Styles applied to the figure.",
				layout: "grid",
				columns: 3,
				defaults: {
					minWidth: 100,
					maxWidth: 200
				},
				items: [{
					type: "label",
					text: "width",
					label: " "
				}, {
					type: "label",
					text: "float"
				}, {
					type: "label",
					text: "clear"
				}, {
					type: "combobox",
					name: prefix + "smartphone_figure_width",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.create(prefix, "dgf.valuesCSSWidth")),
					value: "n/a",
					label: "smartphone",
					tooltip: "Width of the figure on smartphones."
				}, {
					type: "listbox",
					name: prefix + "smartphone_figure_float",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.create(prefix, "dgf.valuesCSSFloat")),
					tooltip: "The float CSS property specifies that an element should be placed along the left or right side of its container, where text and inline elements will wrap around it."
				}, {
					type: "listbox",
					name: prefix + "smartphone_figure_clear",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.create(prefix, "dgf.valuesCSSClear")),
					tooltip: "The clear CSS property specifies whether an element can be next to floating elements that precede it or must be moved down (cleared) below them."
				}, {
					type: "combobox",
					name: prefix + "tablet_figure_width",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.create(prefix, "dgf.valuesCSSWidth")),
					value: "n/a",
					label: "tablet",
					tooltip: "Width of the figure on tablets."
				}, {
					type: "listbox",
					name: prefix + "tablet_figure_float",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.create(prefix, "dgf.valuesCSSFloat")),
					tooltip: "The float CSS property specifies that an element should be placed along the left or right side of its container, where text and inline elements will wrap around it."
				}, {
					type: "listbox",
					name: prefix + "tablet_figure_clear",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.create(prefix, "dgf.valuesCSSClear")),
					tooltip: "The clear CSS property specifies whether an element can be next to floating elements that precede it or must be moved down (cleared) below them."
				}, {
					type: "combobox",
					name: prefix + "desktop_figure_width",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.create(prefix, "dgf.valuesCSSWidth")),
					value: "n/a",
					label: "desktop",
					tooltip: "Width of the figure on desktops."
				}, {
					type: "listbox",
					name: prefix + "desktop_figure_float",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.create(prefix, "dgf.valuesCSSFloat")),
					tooltip: "The float CSS property specifies that an element should be placed along the left or right side of its container, where text and inline elements will wrap around it."
				}, {
					type: "listbox",
					name: prefix + "desktop_figure_clear",
					values: [{ text: "n/a", value: "n/a" }].concat(formFactory.create(prefix, "dgf.valuesCSSClear")),
					tooltip: "The clear CSS property specifies whether an element can be next to floating elements that precede it or must be moved down (cleared) below them."
				}]
			};
		}
	}
};

var formReaderDSV = {
	"dgf.readerDSV": {
		create: function create(formFactory, prefix, data) {
			return {
				type: "form",
				title: "Reader",
				items: [formFactory.create(prefix, "dgf.listboxReaderType"), {
					type: "combobox",
					name: prefix + "delimiter",
					values: [{ text: "comma", value: "comma" }, { text: "tab", value: "tab" }, { text: "semicolon", value: "semicolon" }],
					value: ",",
					label: "delimiter",
					maxWidth: 250,
					tooltip: "Delimiter. Ex. comma-separated (csv), tab-separated (tsv)"
				}, {
					type: "textbox",
					name: prefix + "data",
					classes: "readerData",
					label: "data",
					multiline: true,
					minHeight: 300,
					style: "font-family: monospace; font-size: medium; line-height: 120%;",
					tooltip: "Data",
					onchange: function onchange(event) {
						var root = event.control.getRoot(),
						    p = unflatten$1(root.toJSON());

						p = formFactory.validate(p);
						formFactory.setMenu(root, p);
					}
				}, formFactory.lookup("dgf.fieldsetParseData").create(formFactory, prefix, data)]
			};
		}
	}
};

var formReaderJSON = {
	"dgf.readerJSON": {
		create: function create(formFactory, prefix, data) {
			return {
				type: "form",
				title: "Reader",
				items: [formFactory.create(prefix, "dgf.listboxReaderType"), {
					type: "panel",
					label: "url",
					layout: "flex",
					orient: "horiz",
					items: [{
						type: "textbox",
						name: prefix + "url",
						flex: 0.8,
						tooltip: "URL of the data"
					}, {
						type: "button",
						text: "load",
						onclick: function onclick(event$$1) {
							var rootControl = event$$1.control.getRoot(),
							    data = unflatten$1(rootControl.toJSON()),
							    control = rootControl.find(".readerData");

							control.value("Loading data...");

							if (data.reader) {
								data.reader.data = undefined;

								var reader = formFactory.getTagFactory().create(null, data.reader);
								reader.parserCallback(function (data) {
									return data;
								}).callback(function (node) {
									var data = node.datum();
									if (data) {
										control.value(JSON.stringify(data, null, "\t"));
										formFactory.setMenu(rootControl, unflatten$1(rootControl.toJSON()));
									}
								}).errorCallback(function (error) {
									var message = error;
									if (error.target) {
										message = error.target.statusText + " (" + error.target.status + ")";
									}
									control.value(message);
								});

								var node = select(document.createDocumentFragment());
								node.call(reader);
							}
						}
					}]
				}, {
					type: "textbox",
					classes: "readerData",
					name: prefix + "data",
					label: "data",
					multiline: true,
					minHeight: 300,
					style: "font-family: monospace; font-size: medium; line-height: 120%;",
					tooltip: "Data loaded"
				}, {
					type: "checkbox",
					name: prefix + "cacheData",
					label: "cache data",
					tooltip: "Cache data in data-dgf attribute."
				}, formFactory.lookup("dgf.fieldsetParseData").create(formFactory, prefix, data)]
			};
		}
	}
};

var formReaderTestData = {
	"dgf.readerTestData": {
		create: function create(formFactory, prefix, data) {
			return {
				type: "form",
				title: "Reader",
				items: [formFactory.create(prefix, "dgf.listboxReaderType"), {
					type: "listbox",
					name: prefix + "xType",
					value: "n/a",
					values: [{ text: "n/a", value: "n/a" }, { text: "ordinal", value: "ordinal" }, { text: "continous", value: "continous" }, { text: "date", value: "date" }],
					label: "type x",
					maxWidth: 100,
					tooltip: "Type of the x values. Ex. ordinal / continous, date"
				}, {
					type: "textbox",
					name: prefix + "yMin",
					value: 0,
					label: "min y",
					maxWidth: 100,
					tooltip: "Minimum y value generated. Ex. 0 / -10"
				}, {
					type: "textbox",
					name: prefix + "yMax",
					value: 100,
					label: "max y",
					maxWidth: 100,
					tooltip: "Maximum y value generated. Ex. 0 / 10"
				}, {
					type: "textbox",
					name: prefix + "rows",
					label: "rows",
					value: 9,
					maxWidth: 100,
					tooltip: "Number of rows. Ex. 8",
					onchange: function onchange(event$$1) {
						formFactory.setMenu(event$$1.control.getRoot(), unflatten$1(event$$1.control.getRoot().toJSON()));
					}
				}, {
					type: "slider",
					name: prefix + "exitProbability",
					label: "exit prob",
					minValue: 0,
					maxValue: 1,
					maxWidth: 200,
					tooltip: "Probability that an item will exit the data set."
				}, {
					type: "button",
					text: "create",
					label: " ",
					maxWidth: 100,
					onclick: function onclick(event$$1) {
						var rootControl = event$$1.control.getRoot(),
						    data = unflatten$1(rootControl.toJSON()),
						    control = rootControl.find(".readerData");

						control.value("Loading data...");

						if (data.reader) {
							var reader = formFactory.getTagFactory().create(data.reader);
							reader.parserCallback(function (data) {
								return data;
							}).callback(function (node) {
								var data = node.datum();
								if (data) {
									control.value(JSON.stringify(data, undefined, 4));
								}
							});

							var node = select(document.createDocumentFragment());
							node.call(reader);
						}
					}
				}, {
					type: "textbox",
					classes: "readerData",
					disabled: true,
					label: "data",
					multiline: true,
					minHeight: 320,
					style: "font-family: monospace; font-size: medium; line-height: 120%;",
					tooltip: "Data loaded"
				}, formFactory.lookup("dgf.fieldsetParseData").create(formFactory, prefix, data)]
			};
		}
	}
};

var formSchedulerInterval = {
	"dgf.schedulerInterval": {
		create: function create(formFactory, prefix) {
			return {
				type: "form",
				title: "Scheduler",
				items: [formFactory.create(prefix, "dgf.listboxSchedulerType"), {
					type: "combobox",
					name: prefix + "interval",
					values: formFactory.create(prefix, "dgf.valuesIntervalMillis"),
					value: "20000",
					label: "interval [ms]",
					maxWidth: 120,
					tooltip: "Interval in milli-seconds"
				}, {
					type: "textbox",
					subtype: "number",
					name: prefix + "repeat",
					value: 3,
					label: "repeat",
					maxWidth: 120,
					tooltip: "Times to repeat. -1 = forever"
				}]
			};
		}
	}
};

var formSetup = {
	"dgf.setupForm": {
		create: function create(formFactory, prefix, data) {
			return {
				type: "form",
				id: "setup_form",
				title: "Setup",
				items: [{
					type: "listbox",
					name: "extend",
					label: "extend",
					values: formFactory.typesByCategory("setup"),
					maxWidth: 250,
					disabled: true,
					tooltip: "General setup",
					onselect: function onselect(event) {

						var rootControl = event.target.rootControl,
						    dialogControl = rootControl.controlIdLookup["dialog_form"],
						    setup = event.target.value();

						if (setup !== "") {
							var saveData = unflatten$1(rootControl.toJSON());

							data = formFactory.getTagFactory().decompress({ extend: setup });
							data.nodeId = saveData.nodeId;
							data.reader = saveData.reader;

							var dialog = formFactory.create("dialog_", data),
							    tabControl = tinymce.ui.Factory.create({
								type: "tabpanel",
								items: dialog.body
							});

							dialogControl.replace(dialogControl.items()[0], tabControl);

							var tabpanelElm = document.getElementById("dialog_form-body");

							while (tabpanelElm.firstChild) {
								tabpanelElm.removeChild(tabpanelElm.firstChild);
							}

							tabControl.renderTo(tabpanelElm).reflow();
							dialogControl.fromJSON(flatten(data));
						}
					}
				}, {
					type: "listbox",
					name: "dialog",
					label: "dialog",
					values: [{ text: "small", value: "dgf.dialogLayersSmall" }, { text: "medium", value: "dgf.dialogLayersMedium" }, { text: "large", value: "dgf.dialogLayersLarge" }],
					maxWidth: 250,
					tooltip: "Dialog"
				}, {
					type: "textbox",
					name: "nodeId",
					label: "node id",
					maxWidth: 250,
					tooltip: "The id of the node"
				}, {
					type: "textbox",
					label: "setup",
					multiline: true,
					minHeight: 400,
					style: "font-family: monospace; font-size: medium; line-height: 120%;",
					tooltip: "data-dgf attribute content.",
					onPostRender: function onPostRender(event) {
						var rootControl = event.control.getRoot(),
						    data = unflatten$1(rootControl.data.data);

						delete data.nodeId;

						var dgf$$1 = formFactory.getTagFactory().compress(data);

						var setup = {
							"my.setupNewSetup": {
								"title": "New Setup",
								"description": "This is a new setup.",
								"category": ["setup", "my setups"],
								"data-dgf": dgf$$1
							}
						};

						event.control.value(JSON.stringify(setup, null, "\t"));
					}
				}, {
					type: "textbox",
					label: "html",
					multiline: true,
					minHeight: 200,
					style: "font-family: monospace; font-size: medium; line-height: 120%;",
					tooltip: "Use this html code to display the diagram in a webpage.",
					onPostRender: function onPostRender(event) {
						var rootControl = event.control.getRoot(),
						    p = unflatten$1(rootControl.data.data);

						var node = tinymce.activeEditor.contentDocument.getElementById(p.nodeId);

						if (node) {
							var html = formFactory.getTagFactory().toHtml(node, p);
							html = html.replace(/contenteditable=\"true\"/gi, "contenteditable=\"false\"");
							html = html.replace(/\"/g, "'");
							html = html.replace(/\&quot;/g, "\"");
							event.control.value(html);
						}
					}
				}]
			};
		}
	}
};

var formStylePlainCSS = {
	"dgf.stylePlainCSS": {
		create: function create(formFactory, prefix) {
			return {
				type: "form",
				title: "Style",
				defaults: {},
				items: [formFactory.create(prefix, "dgf.listboxStyleType"), {
					type: "textbox",
					name: prefix + "css",
					label: "css",
					multiline: true,
					minHeight: 400,
					style: "font-family: monospace; font-size: medium; line-height: 120%;",
					tooltip: "CSS rules. Use #id to set rules to the context of the chart. Ex. #id text { font-size: 1.5em; }"
				}]
			};
		}
	}
};

var formStyleResponsiveCSS = {
	"dgf.styleResponsiveCSS": {
		create: function create(formFactory, prefix) {
			return {
				type: "form",
				title: "Style",
				defaults: {},
				items: [formFactory.create(prefix, "dgf.listboxStyleType"), formFactory.create(prefix, "dgf.fieldsetStyleFigure"), {
					type: "textbox",
					name: prefix + "css",
					label: "css",
					multiline: true,
					minHeight: 300,
					style: "font-family: monospace; font-size: medium; line-height: 120%;",
					tooltip: "CSS rules. Use #id to set rules to the context of the chart. Ex. #id text { font-size: 1.5em; }"
				}]
			};
		}
	}
};

var formTemplateArcLabel = {
	"dgf.templateArcLabel": {
		create: function create(formFactory, prefix) {
			return {
				type: "form",
				title: "Arc Label",
				defaults: {},
				items: [formFactory.create(prefix, "dgf.listboxTemplateType"), formFactory.create(prefix, "dgf.fieldsetData"), formFactory.create(prefix, "dgf.fieldsetScalesSmall"), formFactory.create(prefix, "dgf.fieldsetPie"), formFactory.create(prefix, "dgf.fieldsetTextSmall"), formFactory.create(prefix, "dgf.fieldsetTransitions"), formFactory.create(prefix, "dgf.fieldsetLayer")]
			};
		}
	}
};

var formTemplateAxis = {
	"dgf.templateAxis": {
		create: function create(formFactory, prefix) {
			return {
				type: "form",
				title: "Axis",
				defaults: {},
				items: [formFactory.create(prefix, "dgf.listboxTemplateType"), formFactory.create(prefix, "dgf.fieldsetData"), formFactory.create(prefix, "dgf.fieldsetScales"), formFactory.create(prefix, "dgf.fieldsetAxis"), formFactory.create(prefix, "dgf.fieldsetLayer")]
			};
		}
	}
};

var formTemplateBackground = {
	"dgf.templateBackground": {
		create: function create(formFactory, prefix) {
			return {
				type: "form",
				title: "Background",
				defaults: {},
				items: [formFactory.create(prefix, "dgf.listboxTemplateType"), formFactory.create(prefix, "dgf.fieldsetBackground"), formFactory.create(prefix, "dgf.fieldsetTransitionsSmall"), formFactory.create(prefix, "dgf.fieldsetLayer")]
			};
		}
	}
};

var formTemplateBar = {
	"dgf.templateBar": {
		create: function create(formFactory, prefix) {
			return {
				type: "form",
				title: "Bar",
				defaults: {},
				items: [formFactory.create(prefix, "dgf.listboxTemplateType"), formFactory.create(prefix, "dgf.fieldsetData"), formFactory.create(prefix, "dgf.fieldsetScales"), formFactory.create(prefix, "dgf.fieldsetTransitions"), formFactory.create(prefix, "dgf.fieldsetLayer")]
			};
		}
	}
};

var formTemplateBubble = {
	"dgf.templateBubble": {
		create: function create(formFactory, prefix) {
			return {
				type: "form",
				title: "Bubble",
				defaults: {},
				items: [formFactory.create(prefix, "dgf.listboxTemplateType"), formFactory.create(prefix, "dgf.fieldsetData"), formFactory.create(prefix, "dgf.fieldsetScalesColor"), formFactory.create(prefix, "dgf.fieldsetBubble"), formFactory.create(prefix, "dgf.fieldsetTransitions"), formFactory.create(prefix, "dgf.fieldsetLayer")]
			};
		}
	}
};

var formTemplateDot = {
	"dgf.templateDot": {
		create: function create(formFactory, prefix) {
			return {
				type: "form",
				title: "Dot",
				defaults: {},
				items: [formFactory.create(prefix, "dgf.listboxTemplateType"), formFactory.create(prefix, "dgf.fieldsetData"), formFactory.create(prefix, "dgf.fieldsetScales"), formFactory.create(prefix, "dgf.fieldsetTransitions"), formFactory.create(prefix, "dgf.fieldsetLayer")]
			};
		}
	}
};

var formTemplateImage = {
	"dgf.templateImage": {
		create: function create(formFactory, prefix) {
			return {
				type: "form",
				title: "Image",
				defaults: {},
				items: [formFactory.create(prefix, "dgf.listboxTemplateType"), {
					type: "textbox",
					name: prefix + "url",
					label: "url",
					style: "font-family: monospace;"
				}, formFactory.create(prefix, "dgf.fieldsetPreserveAspectRatio"), formFactory.create(prefix, "dgf.fieldsetTransitionsSmall"), formFactory.create(prefix, "dgf.fieldsetLayer")]
			};
		}
	}
};

var formTemplateLabel = {
	"dgf.templateLabel": {
		create: function create(formFactory, prefix) {
			return {
				type: "form",
				title: "Label",
				defaults: {},
				items: [formFactory.create(prefix, "dgf.listboxTemplateType"), formFactory.create(prefix, "dgf.fieldsetData"), formFactory.create(prefix, "dgf.fieldsetScales"), formFactory.create(prefix, "dgf.fieldsetText"), formFactory.create(prefix, "dgf.fieldsetTransitions"), formFactory.create(prefix, "dgf.fieldsetLayer")]
			};
		}
	}
};

var formTemplateLegend = {
	"dgf.templateLegend": {
		create: function create(formFactory, prefix) {
			return {
				type: "form",
				title: "Legend",
				defaults: {},
				items: [formFactory.create(prefix, "dgf.listboxTemplateType"), formFactory.create(prefix, "dgf.fieldsetData"), formFactory.create(prefix, "dgf.fieldsetScales"), {
					type: "fieldset",
					label: "legend",
					layout: "grid",
					columns: 3,
					defaults: {
						maxWidth: 160
					},
					items: [{
						type: "combobox",
						subtype: null,
						classes: "datamap",
						name: prefix + "label",
						label: "label",
						value: "n/a",
						values: [{ text: "n/a", value: "n/a" }],
						tooltip: "The label to display for the legend."
					}, {
						type: "listbox",
						name: prefix + "position",
						label: "position",
						value: "n/a",
						values: [{ text: "n/a", value: "n/a" }, { text: "left", value: "left" }, { text: "right", value: "right" }],
						tooltip: "Position of the legend"
					}, {
						type: "combobox",
						name: prefix + "textFormat",
						value: "n/a",
						values: [{ text: "n/a", value: "n/a" }, { text: "number", menu: formFactory.create(prefix, "dgf.valuesNumberFormat") }, { text: "time", menu: formFactory.create(prefix, "dgf.valuesTimeFormat") }],
						label: "format",
						tooltip: "Format of the text."
					}, {
						type: "textbox",
						subtype: "number",
						name: prefix + "handle_width",
						step: 1,
						label: "handle width",
						maxWidth: 80,
						tooltip: "Width of the handle to draw"
					}, {
						type: "textbox",
						subtype: "number",
						name: prefix + "handle_height",
						step: 1,
						label: "height",
						maxWidth: 80,
						tooltip: "Height of the handle to draw"
					}, {
						type: "textbox",
						subtype: "number",
						name: prefix + "handle_padding",
						step: 0.05,
						label: "padding",
						maxWidth: 80,
						tooltip: "Padding between the handles"
					}, {
						type: "textbox",
						subtype: "number",
						name: prefix + "interpolateSteps",
						step: 1,
						label: "steps",
						maxWidth: 80,
						tooltip: "Number of steps for interpolated scales"
					}, { type: "spacer" }, { type: "spacer" }]
				}, formFactory.create(prefix, "dgf.fieldsetTransitions"), formFactory.create(prefix, "dgf.fieldsetLayer")]
			};
		}
	}
};

var formTemplateLine = {
	"dgf.templateLine": {
		create: function create(formFactory, prefix) {
			return {
				type: "form",
				title: "Line",
				defaults: {},
				items: [formFactory.create(prefix, "dgf.listboxTemplateType"), formFactory.create(prefix, "dgf.fieldsetData"), formFactory.create(prefix, "dgf.fieldsetScales"), formFactory.create(prefix, "dgf.fieldsetLine"), formFactory.create(prefix, "dgf.fieldsetTransitions"), formFactory.create(prefix, "dgf.fieldsetLayer")]
			};
		}
	}
};

var formTemplatePie = {
	"dgf.templatePie": {
		create: function create(formFactory, prefix) {
			return {
				type: "form",
				title: "Pie",
				defaults: {},
				items: [formFactory.create(prefix, "dgf.listboxTemplateType"), formFactory.create(prefix, "dgf.fieldsetData"), formFactory.create(prefix, "dgf.fieldsetScalesSmall"), formFactory.create(prefix, "dgf.fieldsetPie"), formFactory.create(prefix, "dgf.fieldsetTransitions"), formFactory.create(prefix, "dgf.fieldsetLayer")]
			};
		}
	}
};

var formTemplatePackLabel = {
	"dgf.templatePackLabel": {
		create: function create(formFactory, prefix) {
			return {
				type: "form",
				title: "Pack Label",
				defaults: {},
				items: [formFactory.create(prefix, "dgf.listboxTemplateType"), formFactory.create(prefix, "dgf.fieldsetData"), formFactory.create(prefix, "dgf.fieldsetScalesSmall"), formFactory.create(prefix, "dgf.fieldsetPackLabel"), formFactory.create(prefix, "dgf.fieldsetTransitions"), formFactory.create(prefix, "dgf.fieldsetLayer")]
			};
		}
	}
};

var formTypeUndefined = {
	"dgf.schedulerUndefined": {
		create: function create(formFactory, prefix) {
			return {
				type: "form",
				title: "Scheduler",
				defaults: {},
				items: [formFactory.create(prefix, "dgf.listboxSchedulerType")]
			};
		}
	},

	"dgf.readerUndefined": {
		create: function create(formFactory, prefix) {
			return {
				type: "form",
				title: "Reader",
				defaults: {},
				items: [formFactory.create(prefix, "dgf.listboxReaderType")]
			};
		}
	},

	"dgf.containerTemplateUndefined": {
		create: function create(formFactory, prefix) {
			return {
				type: "form",
				title: "Container",
				defaults: {},
				items: [formFactory.create(prefix, "dgf.listboxContainerTemplateType")]
			};
		}
	},

	"dgf.templateUndefined": {
		create: function create(formFactory, prefix) {
			return {
				type: "form",
				title: "Layer",
				defaults: {},
				items: [formFactory.create(prefix, "dgf.listboxTemplateType")]
			};
		}
	},

	"dgf.styleUndefined": {
		create: function create(formFactory, prefix) {
			return {
				type: "form",
				title: "Style",
				defaults: {},
				items: [formFactory.create(prefix, "dgf.listboxStyleType")]
			};
		}
	}
};

function defaultFormFactory(tagFactory$$1) {
	return formFactory(tagFactory$$1).addAll([formDialogLayers, formLayers, formParts, formReaderDSV, formReaderJSON, formReaderTestData, formSchedulerInterval, formSetup, formStylePlainCSS, formStyleResponsiveCSS, formTemplateArcLabel, formTemplateAxis, formTemplateBackground, formTemplateBar, formTemplateBubble, formTemplateDot, formTemplateImage, formTemplateLabel, formTemplateLegend, formTemplateLine, formTemplatePackLabel, formTemplatePie, formTypeUndefined]);
}

tinymce.PluginManager.add("dgf", function (editor, url) {

	var tagFactory$$1, formFactory$$1;

	/*eslint-disable */
	editor.on("PreInit", function () {
		tagFactory$$1 = dgf.tagFactory();
		formFactory$$1 = defaultFormFactory(tagFactory$$1);
	});

	editor.on("LoadContent", function (event) {
		var ready = setInterval(function () {
			if (tagFactory$$1.ready()) {
				clearInterval(ready);
				tagFactory$$1.process(event.target.contentDocument);
			}
		}, 50);
	});

	editor.on("BeforeSetContent", function (event) {
		event.content = removeFigureContent(event.content);
		event.content = setFigcaptionEditable(event.content, true);
	});

	editor.on("SaveContent", function (event) {
		event.content = removeFigureContent(event.content);
	});

	editor.on("PostProcess", function (event) {
		event.content = removeFigureContent(event.content);
		event.content = setFigcaptionEditable(event.content, false);
	});

	editor.on("BeforeAddUndo", function (event) {
		event.level.content = removeFigureContent(event.level.content);
	});

	editor.on("Undo", function (event) {
		tagFactory$$1.process(event.target.contentDocument);
	});

	editor.on("Redo", function (event) {
		tagFactory$$1.process(event.target.contentDocument);
	});

	editor.on("DblClick", function (event) {
		var node = dgf.findParentBySelector(event.target, "figure[data-dgf]");
		if (node) {
			if (event.target.nodeName !== "FIGCAPTION" && !dgf.findParentBySelector(event.target, "figcaption")) {
				showDialog(node.getAttribute("data-dgf"));
			}
		}
	});

	var lastTap = 0,
	    timeout;
	editor.on("touchend", function (event) {
		var currentTime = new Date().getTime(),
		    tapLength = currentTime - lastTap;

		clearTimeout(timeout);

		if (tapLength < 500 && tapLength > 0) {
			var node = dgf.findParentBySelector(event.target, "figure[data-dgf]");
			if (node) {
				if (event.target.nodeName !== "FIGCAPTION" && !dgf.findParentBySelector(event.target, "figcaption")) {
					showDialog(node.getAttribute("data-dgf"));
				}
			}
			//event.preventDefault();
		} else {
			timeout = setTimeout(function () {
				clearTimeout(timeout);
			}, 500);
		}
		lastTap = currentTime;
	});

	function showDialog(data) {
		var node = editor.selection.getNode();

		data = tagFactory$$1.decompress(JSON.parse(data));
		data.nodeId = data.nodeId || node.id || randomId();

		var dialog = formFactory$$1.create("", data);

		dialog.onSubmit = function () {
			var p = this.toJSON();
			p = dgf.unflatten(p);
			p = dgf.extend(data, p);
			p = formFactory$$1.validate(p);

			node.id = p.nodeId || node.id;

			var html = tagFactory$$1.toHtml(node, p);

			if (!node.hasAttribute("data-dgf")) {
				editor.undoManager.transact(function () {
					editor.insertContent(html);
				});
			} else {
				editor.undoManager.transact(function () {
					var rng = editor.dom.createRng();
					rng.selectNode(node);
					editor.selection.setRng(rng);
					editor.selection.setContent(html);
				});
			}
		};

		dialog.onClose = function () {
			if (node && node.id) {
				node = editor.dom.select("#" + node.id)[0];
				editor.selection.select(node);
				tagFactory$$1.process(node);
			}
		};

		editor.windowManager.open(dialog);
	}

	editor.addMenuItem("dgf", {
		text: "Diagram",
		context: "insert",
		disabled: true,

		onPostRender: function onPostRender() {
			loadMenu(this);
		},

		onselect: function onselect(event) {
			showDialog("{ \"extend\": \"" + event.control.value() + "\"}");
		}
	});

	editor.addButton("dgf", {
		type: "menubutton",
		id: "dgf_button",
		image: url + "/chart-bar.png",
		tooltip: "Insert/Edit Diagram",
		stateSelector: "figure[data-dgf]",
		disabled: true,

		onPostRender: function onPostRender() {
			loadMenu(this);
		},

		onclick: function onclick(event) {
			var node = editor.selection.getNode();

			if (event.control.type === "menubutton" && node.hasAttribute("data-dgf")) {
				event.control.hideMenu();
				showDialog(node.getAttribute("data-dgf"));
			}
		},

		onselect: function onselect(event) {
			showDialog("{ \"extend\": \"" + event.control.value() + "\"}");
		}
	});

	editor.addCommand("dgf", showDialog);

	function loadMenu(control) {
		var ready = setInterval(function () {
			if (tagFactory$$1 && tagFactory$$1.ready()) {
				clearInterval(ready);
				control.state.data.menu = control.settings.menu = formFactory$$1.typesByCategory("setup");
				control.disabled(false);
			}
		}, 50);
	}

	function removeFigureContent(content) {
		return content.replace(/(<figure[\s\S]*?data-dgf[\s\S]*?>[\s\S]*?<\/figcaption>)[\s\S]*?(<\/figure>)/gi, "$1$2").replace(/data-mce-selected="1"/gi, "");
	}

	function setFigcaptionEditable(content, value) {
		var regex = /(<figure[\s\S]*?data-dgf[\s\S]*?>[\s\S]*?<figcaption[\s\S]*?contenteditable=)\"[\s\S]*?\"([\s\S]*?<\/figcaption>[\s\S]*?<\/figure>)/gi;
		return value ? content.replace(regex, "$1\"true\"$2") : content.replace(regex, "$1\"false\"$2");
	}
});

})));