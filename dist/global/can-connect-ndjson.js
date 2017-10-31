/*[global-shim-start]*/
(function(exports, global, doEval) {
	// jshint ignore:line
	var origDefine = global.define;

	var get = function(name) {
		var parts = name.split("."),
			cur = global,
			i;
		for (i = 0; i < parts.length; i++) {
			if (!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var set = function(name, val) {
		var parts = name.split("."),
			cur = global,
			i,
			part,
			next;
		for (i = 0; i < parts.length - 1; i++) {
			part = parts[i];
			next = cur[part];
			if (!next) {
				next = cur[part] = {};
			}
			cur = next;
		}
		part = parts[parts.length - 1];
		cur[part] = val;
	};
	var useDefault = function(mod) {
		if (!mod || !mod.__esModule) return false;
		var esProps = { __esModule: true, default: true };
		for (var p in mod) {
			if (!esProps[p]) return false;
		}
		return true;
	};

	var hasCjsDependencies = function(deps) {
		return (
			deps[0] === "require" && deps[1] === "exports" && deps[2] === "module"
		);
	};

	var modules =
		(global.define && global.define.modules) ||
		(global._define && global._define.modules) ||
		{};
	var ourDefine = (global.define = function(moduleName, deps, callback) {
		var module;
		if (typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for (i = 0; i < deps.length; i++) {
			args.push(
				exports[deps[i]]
					? get(exports[deps[i]])
					: modules[deps[i]] || get(deps[i])
			);
		}
		// CJS has no dependencies but 3 callback arguments
		if (hasCjsDependencies(deps) || (!deps.length && callback.length)) {
			module = { exports: {} };
			args[0] = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args[1] = module.exports;
			args[2] = module;
		} else if (!args[0] && deps[0] === "exports") {
			// Babel uses the exports and module object.
			module = { exports: {} };
			args[0] = module.exports;
			if (deps[1] === "module") {
				args[1] = module;
			}
		} else if (!args[0] && deps[0] === "module") {
			args[0] = { id: moduleName };
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		result = module && module.exports ? module.exports : result;
		modules[moduleName] = result;

		// Set global exports
		var globalExport = exports[moduleName];
		if (globalExport && !get(globalExport)) {
			if (useDefault(result)) {
				result = result["default"];
			}
			set(globalExport, result);
		}
	});
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function() {
		// shim for @@global-helpers
		var noop = function() {};
		return {
			get: function() {
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load) {
				doEval(__load.source, global);
			}
		};
	});
})(
	{},
	typeof self == "object" && self.Object == Object ? self : window,
	function(__$source__, __$global__) {
		// jshint ignore:line
		eval("(function() { " + __$source__ + " \n }).call(__$global__);");
	}
);

/*can-connect-ndjson@0.1.1#can-connect-ndjson*/
define('can-connect-ndjson', [
    'require',
    'exports',
    'module',
    'can-connect',
    'can-connect/helpers/sorted-set-json',
    'can-ndjson-stream',
    'can-reflect',
    'can-namespace'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        var connect = require('can-connect');
        var sortedSetJSON = require('can-connect/helpers/sorted-set-json');
        var ndJSONStream = require('can-ndjson-stream');
        var canReflect = require('can-reflect');
        var namespace = require('can-namespace');
        var connectNdjson = connect.behavior('data-ndjson', function (baseConnection) {
            try {
                new ReadableStream();
                window.fetch();
            } catch (err) {
                return {};
            }
            return {
                hydrateList: function (listData, set) {
                    set = set || this.listSet(listData);
                    var id = sortedSetJSON(set);
                    var list = baseConnection.hydrateList.call(this, listData, set);
                    if (this._getHydrateListCallbacks[id]) {
                        this._getHydrateListCallbacks[id].shift()(list);
                        if (!this._getHydrateListCallbacks[id].length) {
                            delete this._getHydrateListCallbacks[id];
                        }
                    }
                    return list;
                },
                _getHydrateListCallbacks: {},
                _getHydrateList: function (set, callback) {
                    var id = sortedSetJSON(set);
                    if (!this._getHydrateListCallbacks[id]) {
                        this._getHydrateListCallbacks[id] = [];
                    }
                    this._getHydrateListCallbacks[id].push(callback);
                },
                getListData: function (set) {
                    var fetchPromise = fetch(this.ndjson || this.url);
                    this._getHydrateList(set, function (list) {
                        function streamerr(e) {
                            canReflect.setKeyValue(list, 'isStreaming', false);
                            canReflect.setKeyValue(list, 'streamError', e);
                        }
                        fetchPromise.then(function (response) {
                            canReflect.setKeyValue(list, 'isStreaming', true);
                            return ndJSONStream(response.body);
                        }).then(function (itemStream) {
                            var reader = itemStream.getReader();
                            reader.read().then(function read(result) {
                                if (result.done) {
                                    canReflect.setKeyValue(list, 'isStreaming', false);
                                    return;
                                }
                                list.push(result.value);
                                reader.read().then(read, streamerr);
                            }, streamerr);
                        });
                    });
                    return fetchPromise.then(function () {
                        return { data: [] };
                    });
                }
            };
        });
        module.exports = namespace.connectNdjson = connectNdjson;
    }(function () {
        return this;
    }(), require, exports, module));
});
/*[global-shim-end]*/
(function(global) { // jshint ignore:line
	global._define = global.define;
	global.define = global.define.orig;
}
)(typeof self == "object" && self.Object == Object ? self : window);