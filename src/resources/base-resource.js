(function() {
    //@exclude
    'use strict';
    //@endexclude

    corbel.Resources.BaseResource = corbel.Services.inherit({

        /**
         * Helper function to build the request uri
         * @param  {String} srcType     Type of the resource
         * @param  {String} srcId       Id of the resource
         * @param  {String} relType     Type of the relationed resource
         * @param  {String} destId      Information of the relationed resource
         * @return {String}             Uri to perform the request
         */
        buildUri: function(srcType, srcId, destType, destId) {

            var urlBase = this.driver.config.get('resourcesEndpoint', null) ?
                this.driver.config.get('resourcesEndpoint') :
                this.driver.config.get('urlBase')
                  .replace(corbel.Config.URL_BASE_PLACEHOLDER, corbel.Resources.moduleName)
                  .replace(corbel.Config.URL_BASE_PORT_PLACEHOLDER, this._buildPort(this.driver.config));

            var domain = this.driver.config.get(corbel.Iam.IAM_DOMAIN, 'unauthenticated');
            var uri = urlBase + domain +'/resource/' + srcType;

            if (srcId) {
                uri += '/' + srcId;
                if (destType) {
                    uri += '/' + destType;
                    if (destId) {
                        uri += ';r=' + destType + '/' + destId;
                    }
                }
            }

            return uri;
        },

        _buildPort: function(config) {
          return config.get('resourcesPort', null) || corbel.Resources.defaultPort;
        },

        request: function(args) {
            var params = corbel.utils.extend(this.params, args);

            this.params = {}; //reset instance params

            args.query = corbel.utils.serializeParams(params);

            //call service request implementation
            return corbel.Services.prototype.request.apply(this, [args].concat(Array.prototype.slice.call(arguments, 1)));
        },

        getURL: function(params) {
            return this.buildUri(this.type, this.srcId, this.destType) + (params ? '?' + corbel.utils.serializeParams(params) : '');
        },

        getDefaultOptions: function(options) {
            var defaultOptions = options ? corbel.utils.clone(options) : {};

            return defaultOptions;
        }

    });

    // extend for inherit requestParamsBuilder methods extensible for all Resources object
    corbel.utils.extend(corbel.Resources.BaseResource.prototype, corbel.requestParamsBuilder.prototype);

    return corbel.Resources.BaseResource;

})();
