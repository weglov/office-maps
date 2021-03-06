var Fetch = require('whatwg-fetch');
var Fetch = require('fetch-ie8');
var rootUrl = 'http://office.ren-tv.com/company/officemap/zonelist.php';

module.exports = {
  get: function(e) {
    return fetch(rootUrl, {
      credentials: ''
    })
    .then(function(response) {
      return response.json()
    })
  },
  array: function(arr, zone) {
          var array = [];
      for(var idx = 0, l = arr.length;idx < l;idx++) {
        if (arr[idx] && arr[idx].zone === zone) {
          array.push(arr[idx]);
        }
      }
      return array;
  }
};
