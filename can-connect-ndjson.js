var connect = require("can-connect");
var sortedSetJSON = require("can-connect/helpers/sorted-set-json");
var ndJSONStream = require("can-ndjson-stream");

module.exports = connect.behavior("data-ndjson", function(baseConnection) {
  return {
    hydrateList: function(listData, set){
      set = set || this.listSet(listData);
      var id = sortedSetJSON( set );
      var list = baseConnection.hydrateList.call(this, listData, set);

      if(this._getHydrateListCallbacks[id]) {
        this._getHydrateListCallbacks[id].shift()(list);
        if(!this._getHydrateListCallbacks[id].length){
          delete this._getHydrateListCallbacks[id];
        }
      }
      return list;
    },
    _getHydrateListCallbacks: {},
    _getHydrateList: function(set, callback){
      var id = sortedSetJSON(set);
      if(!this._getHydrateListCallbacks[id]) {
        this._getHydrateListCallbacks[id]= [];
      }
      this._getHydrateListCallbacks[id].push(callback);
    },

    getListData: function(set) {
      var fetchPromise = fetch(this.ndjson);
      this._getHydrateList(set, function(list) {
        fetchPromise.then(function(response) {
          console.log("start");
          return ndJSONStream(response.body);
        }).then(function(itemStream) {
          var reader = itemStream.getReader();
          reader.read().then(function read(result) {
            if (result.done) {
              console.log("Done.");
              return;
            }
            console.log(result.value);
            list.push(result.value);
            reader.read().then(read);
          });
        });
      });

      return fetchPromise.then(function() {
        return {
          data: []
        };
      });
    }
  };
});