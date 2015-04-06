//@exclude
'use strict';
/* jshint unused:false */
//@endexclude


var pageBuilder = (function() {

    var pageBuilder = {};

    /**
     * Sets the page number of the page param
     * @param  {int} page
     * @return {RequestParamsBuilder} RequestParamsBuilder
     */
    pageBuilder.page = function(page) {
        this.params.pagination = this.params.pagination || {};
        this.params.pagination.page = page;
        return this;
    };

    /**
     * Sets the page size of the page param
     * @param  {int} size
     * @return {RequestParamsBuilder} RequestParamsBuilder
     */
    pageBuilder.pageSize = function(size) {
        this.params.pagination = this.params.pagination || {};
        this.params.pagination.size = size;
        return this;
    };

    /**
     * Sets the page number and page size of the page param
     * @param  {int} size
     * @return {RequestParamsBuilder} RequestParamsBuilder
     */
    pageBuilder.pageParam = function(page, size) {
        this.params.pagination = this.params.pagination || {};
        this.params.pagination.page = page;
        this.params.pagination.size = size;
        return this;
    };

    return pageBuilder;


})();