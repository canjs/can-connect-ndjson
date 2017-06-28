/*can-connect-ndjson@0.0.1#can-connect-ndjson*/
var connect = require('can-connect');
var sortedSetJSON = require('can-connect/helpers/sorted-set-json');
var ndJSONStream = require('can-ndjson-stream');
module.exports = connect.behavior('data-ndjson', function (baseConnection) {
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
                    list.set('isStreaming', false);
                    list.set('streamError', e);
                }
                fetchPromise.then(function (response) {
                    list.set('isStreaming', true);
                    return ndJSONStream(response.body);
                }).then(function (itemStream) {
                    var reader = itemStream.getReader();
                    reader.read().then(function read(result) {
                        if (result.done) {
                            list.set('isStreaming', false);
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