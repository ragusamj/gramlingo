/* eslint-disable */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.mapcolorizer = global.mapcolorizer || {})));
}(this, (function (exports) { 'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var Path = function () {
    function Path(neighbors, startIndex) {
        classCallCheck(this, Path);

        this.values = this.plot(neighbors, startIndex || 0);
    }

    createClass(Path, [{
        key: "plot",
        value: function plot(neighbors, startIndex) {
            var path = [];
            var cache = {};
            this.addNeighborsToPath(neighbors, startIndex, cache, path);
            this.addWithoutNeighborsToPath(neighbors, cache, path);
            return path;
        }
    }, {
        key: "addNeighborsToPath",
        value: function addNeighborsToPath(neighbors, index, cache, path) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = neighbors[index][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var neighbor = _step.value;

                    if (!cache[neighbor]) {
                        cache[neighbor] = true;
                        path.push(neighbor);
                        this.addNeighborsToPath(neighbors, neighbor, cache, path);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "addWithoutNeighborsToPath",
        value: function addWithoutNeighborsToPath(neighbors, cache, path) {
            for (var i = 0; i < neighbors.length; i++) {
                if (!cache[i]) {
                    path.unshift(i);
                }
            }
        }
    }]);
    return Path;
}();

var BacktrackingColorizer = function () {
    function BacktrackingColorizer(neighbors, options) {
        classCallCheck(this, BacktrackingColorizer);


        options = options || {};
        this.numberOfColors = options.numberOfColors || 10;
        this.startIndexIslands = options.startIndexIslands || 0;
        this.maxAttempts = options.maxAttempts || neighbors.length * 100;

        var path = options.path || new Path(neighbors);

        this.attempts = 0;
        this.colors = [].concat(toConsumableArray(Array(neighbors.length)));
        this.walk(path.values, neighbors, 0);
        this.colorCount = this.countColors();
    }

    createClass(BacktrackingColorizer, [{
        key: "walk",
        value: function walk(path, neighbors, index) {
            var feature = path[index];
            if (feature === undefined || neighbors[feature] === undefined) {
                this.solved = true;
                return true;
            }
            if (++this.attempts >= this.maxAttempts) {
                this.solved = false;
                return true;
            }
            if (neighbors[feature].length === 0) {
                this.startIndexIslands = this.startIndexIslands >= this.numberOfColors ? 0 : this.startIndexIslands;
                this.colors[feature] = this.startIndexIslands++;
                return this.walk(path, neighbors, index + 1);
            }
            for (var color = 0; color < this.numberOfColors; color++) {
                if (this.isFree(color, neighbors[feature])) {
                    this.colors[feature] = color;
                    if (this.walk(path, neighbors, index + 1)) {
                        return true;
                    }
                    this.colors[feature] = undefined;
                }
            }
            return false;
        }
    }, {
        key: "isFree",
        value: function isFree(color, neighbors) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = neighbors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var neighbor = _step.value;

                    if (this.colors[neighbor] === color) {
                        return false;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return true;
        }
    }, {
        key: "countColors",
        value: function countColors() {
            var colorCount = 0;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.colors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var color = _step2.value;

                    colorCount = Math.max(colorCount, color || 0);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return colorCount + 1;
        }
    }]);
    return BacktrackingColorizer;
}();

var isNumeric = function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

var Polygon = function () {
    function Polygon() {
        classCallCheck(this, Polygon);
    }

    createClass(Polygon, null, [{
        key: "isGeoJSON",
        value: function isGeoJSON(object) {
            return Array.isArray(object) && this.isPlain(object[0]);
        }
    }, {
        key: "isPlain",
        value: function isPlain(object) {
            return Array.isArray(object) && Array.isArray(object[0]) && object[0].length === 2 && isNumeric(object[0][0]) && isNumeric(object[0][1]);
        }
    }]);
    return Polygon;
}();

var BoundingBox = function () {
    function BoundingBox(object) {
        classCallCheck(this, BoundingBox);


        this.x1 = this.y1 = Infinity;
        this.x2 = this.y2 = -Infinity;

        if (Polygon.isGeoJSON(object)) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = object[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var points = _step.value;

                    this.reduce(points);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        } else if (Polygon.isPlain(object)) {
            this.reduce(object);
        }
    }

    createClass(BoundingBox, [{
        key: "reduce",
        value: function reduce(points) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = points[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var point = _step2.value;

                    this.x1 = Math.min(this.x1, point[0]);
                    this.y1 = Math.min(this.y1, point[1]);
                    this.x2 = Math.max(this.x2, point[0]);
                    this.y2 = Math.max(this.y2, point[1]);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: "intersects",
        value: function intersects(other) {
            return this.x1 < other.x2 && this.x2 > other.x1 && this.y1 < other.y2 && this.y2 > other.y1;
        }
    }]);
    return BoundingBox;
}();

var Features = function () {
    function Features(object, strategy) {
        classCallCheck(this, Features);

        this.values = this.map(object.features || object, strategy);
    }

    createClass(Features, [{
        key: "map",
        value: function map(object, strategy) {
            return object.map(function (item, i) {
                var feature = {
                    index: i,
                    shapes: []
                };
                if (item.geometry) {
                    if (item.geometry.type === "Polygon") {
                        feature.shapes.push(new strategy(item.geometry.coordinates));
                    }
                    if (item.geometry.type === "MultiPolygon") {
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = item.geometry.coordinates[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var coordinates = _step.value;

                                feature.shapes.push(new strategy(coordinates));
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                    }
                } else {
                    feature.shapes.push(new strategy(item));
                }
                return feature;
            });
        }
    }]);
    return Features;
}();

var Neighbors = function () {
    function Neighbors(features) {
        classCallCheck(this, Neighbors);

        this.values = this.intersect(features);
    }

    createClass(Neighbors, [{
        key: "intersect",
        value: function intersect(features) {
            return features.map(function (feature) {
                var neighbors = [];
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = feature.shapes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var shape = _step.value;
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = feature.possibleNeighbors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var nfeature = _step2.value;
                                var _iteratorNormalCompletion3 = true;
                                var _didIteratorError3 = false;
                                var _iteratorError3 = undefined;

                                try {
                                    for (var _iterator3 = nfeature.shapes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                        var nshape = _step3.value;

                                        if (nfeature.index !== feature.index && neighbors.indexOf(nfeature.index) === -1 && nshape.intersects(shape)) {
                                            neighbors.push(nfeature.index);
                                        }
                                    }
                                } catch (err) {
                                    _didIteratorError3 = true;
                                    _iteratorError3 = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                            _iterator3.return();
                                        }
                                    } finally {
                                        if (_didIteratorError3) {
                                            throw _iteratorError3;
                                        }
                                    }
                                }
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return neighbors;
            });
        }
    }]);
    return Neighbors;
}();

var BoundingBoxes = function BoundingBoxes(polygons) {
    classCallCheck(this, BoundingBoxes);

    var bboxes = new Features(polygons, BoundingBox);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = bboxes.values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var feature = _step.value;

            feature.possibleNeighbors = bboxes.values;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    this.neighbors = new Neighbors(bboxes.values);
};

var Ring = function () {
    function Ring(object) {
        classCallCheck(this, Ring);


        this.points = [];

        if (Polygon.isGeoJSON(object)) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = object[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var points = _step.value;

                    this.quantize(points);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        } else if (Polygon.isPlain(object)) {
            this.quantize(object);
        }
    }

    createClass(Ring, [{
        key: "quantize",
        value: function quantize(points) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = points[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var point = _step2.value;

                    this.points.push([Math.floor(point[0]), Math.floor(point[1])]);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: "intersects",
        value: function intersects(other) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.points[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var t = _step3.value;
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = other.points[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var o = _step4.value;

                            if (t[0] === o[0] && t[1] === o[1]) {
                                return true;
                            }
                        }
                    } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                _iterator4.return();
                            }
                        } finally {
                            if (_didIteratorError4) {
                                throw _iteratorError4;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return false;
        }
    }]);
    return Ring;
}();

var Rings = function Rings(featureCollection) {
    classCallCheck(this, Rings);

    var bboxes = new BoundingBoxes(featureCollection);
    var rings = new Features(featureCollection, Ring);
    var i = 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = rings.values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var feature = _step.value;

            feature.possibleNeighbors = bboxes.neighbors.values[i].map(function (n) {
                return rings.values[n];
            });
            i++;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    this.neighbors = new Neighbors(rings.values);
};

exports.BacktrackingColorizer = BacktrackingColorizer;
exports.BoundingBox = BoundingBox;
exports.BoundingBoxes = BoundingBoxes;
exports.Features = Features;
exports.Neighbors = Neighbors;
exports.Path = Path;
exports.Polygon = Polygon;
exports.Ring = Ring;
exports.Rings = Rings;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=map-colorizer.js.map
