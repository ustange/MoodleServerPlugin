/**
 * This component provides methods to execute basic operations.
 * @module util
 * @requires
 */

define(['jquery'], function($) {

  window.addEventListener('message', function (e) {

    if (e.data.event === "eexcess.newResults") {
      var url = M.cfg.wwwroot + '/blocks/eexcess/eexcess_history_save.php';
      var userid = this.userID;
      var respErr = this.respError;
      var userHistory = JSON.stringify(e.data.data);

      Y.io(url, {
        data: {
          userid: userid,
          history: userHistory
        },
        method: 'POST',
        on: {
          success: function () {
            if (respErr !== false) {
              window.console.log(respErr);
            } else {
              window.console.log("response");
            }
          }
        }
      });
    } else if (
      e.data.event === "eexcess.log.itemCitedAsImage"
      || e.data.event === "eexcess.log.itemCitedAsText"
    ) {
      var url = M.cfg.wwwroot + '/blocks/eexcess/eexcess_references_save.php';
      var current_uri = window.location.href;
      var current_title = Y.one('head title').get('text');
      var userid = this.userID;
      var respErr = this.respError;
      var reference_json = JSON.stringify(e.data.data);

      Y.io(url, {
        data: {
          userid: userid,
          current_uri: current_uri,
          current_title: current_title,
          event: e.data.event,
          reference_json: reference_json
        },
        method: 'POST',
        on: {
          success: function () {
            if (respErr !== false) {
              window.console.log(respErr);
            } else {
              window.console.log("response");
            }
          }
        }
      });
    }

    console.log(e.data);
  });


  /**
   * @class
   */
  var util = {

    /**
     * Determines if two arrays have elements in common.
     * @method intersect
     * @param {Array} arr1 An array of strings.
     * @param {Array} arr2 Another array of strings.
     * @return {Boolean} True if the two arrays have an element in common; False otherwise.
     */
    intersect: function (arr1, arr2) {
      var intersect = false;
      for (var i = 0; (i < arr1.length) && (!intersect); i++) {
        intersect = this.contains(arr2, arr1[i]);
      }
      return intersect;
    },

    /**
     * Determines if an element appears in an array.
     * @method contains
     * @param {Array} array An array of string.
     * @param {String} term A string.
     * @return {Boolean} True if term is an element of the array; False otherwise.
     */
    contains: function (array, term) {
      var found = false;
      for (var i = 0; (i < array.length) && (!found); i++) {
        found = (array[i] == term);
      }
      return found;
    },

    /**
     * Merges two arrays (it's not a union).
     * @method merge
     * @param {Array} arr1 An array.
     * @param {Array} arr2 Another array.
     * @return {Array} An array containing all the elements of arr1 and arr2 (possibly with duplicates).
     */
    merge: function (arr1, arr2) {
      var arr = new Array();
      for (var i = 0; i < arr1.length; i++) {
        arr[i] = arr1[i];
      }
      var cnt = arr1.length;
      for (var j = 0; j < arr2.length; j++) {
        if (!this.contains(arr, arr2[j])) {
          arr[cnt + j] = arr2[j];
          cnt++;
        }
      }
      return arr;
    },

    /**
     * Determines the number of instances of a string in another string.
     * @method nbInstances
     * @param {String} words A string composed of words.
     * @param {String} word A word.
     * @return {Integer} The number of times word appears in words.
     */
    nbInstances: function (words, word) {
      words = words.toLowerCase();
      word = word.toLowerCase();
      var array = words.split(word);
      return (array.length - 1);
    },

    /**
     * Gives today's date.
     * @method today
     * @return {Date} The current date.
     */
    today: function () {
      return new Date();
    },

    /**
     * Gives yesterday's date (current time, but a day before).
     * @method yesterday
     * @return {Date} Yesterday's date.
     */
    yesterday: function () {
      var d = new Date();
      d.setDate(d.getDay() - 1);
      return d;
    },

    /**
     * Determines if a date happened (strictly) before another one.
     * For instance, before(yesterday(), today()) returns True,
     * before(today(), yesterday()) returns False, and
     * before(today(), today()) returns False.
     * @method
     * @param {Date} d1 A date.
     * @param {Date} d2 Another date.
     * @return True if d1 happened before d2; False otherwise.
     */
    before: function (d1, d2) {
      var t1 = d1.getTime();
      var t2 = d2.getTime();
      return (t1 < t2);
    }

  };

  return util;
});