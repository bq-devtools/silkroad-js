//@exclude
'use strict';
/* global corbel */
//@endexclude

(function() {
    /**
     * Create a AuthorizationBuilder for resource managing requests.
     *
     * @param {Object} clientParams  Initial params
     *
     * @return {corbel.Oauth.AuthorizationBuilder}
     */
    corbel.Oauth.prototype.authorization = function(clientParams) {
        console.log('oauthInterface.authorization', clientParams);

        corbel.Oauth._checkProp(clientParams, ['responseType'], 'Invalid client parameters');
        clientParams.responseType = clientParams.responseType.toLowerCase();
        corbel.Oauth._validateResponseType(clientParams.responseType);
        if (clientParams.responseType.toLowerCase() === 'code') {
            corbel.Oauth._checkProp(clientParams, ['redirectUri'], 'Invalid client parameters');
        }
        clientParams.clientId = clientParams.clientId || corbel.Config.get('oauthClientId');
        var params = {
            contentType: corbel.Oauth._URL_ENCODED,
            data: corbel.Oauth._trasformParams(clientParams),
            // http://stackoverflow.com/questions/1557602/jquery-and-ajax-response-header
            noRedirect: true
        };
        var authorization = new AuthorizationBuilder(params);
        authorization.driver = this.driver;
        return authorization;
    };

    /**
     * A builder for authorization management requests.
     *
     * @param {Object} params  Initial params
     *
     * @class
     * @memberOf corbel.Oauth.AuthorizationBuilder
     */
    var AuthorizationBuilder = corbel.Oauth.AuthorizationBuilder = corbel.Services.BaseServices.inherit({

        constructor: function(params) {
            this.params = params;
            this.uri = 'oauth';
        },
        /**
         * Deprecated, use loginWithCookie instead
         * @method
         * @memberOf corbel.Oauth.AuthorizationBuilder
         * @return {Promise} Q promise that resolves to a redirection to redirectUri or rejects with a 404 {@link CorbelError}
         */
        dialog: function() {
            console.log('oauthInterface.authorization.dialog');
            return this.loginWithCookie();
        },
        /**
         * Does a login with stored cookie in oauth server
         * @method
         * @memberOf corbel.Oauth.AuthorizationBuilder
         * @return {Promise} Q promise that resolves to a redirection to redirectUri or rejects with a 404 {@link CorbelError}
         */
        loginWithCookie: function() {
            console.log('oauthInterface.authorization.dialog');
            // make request, generate oauth cookie, then redirect manually
            return this.request({
                url: this._buildUri(this.uri + '/authorize'),
                method: corbel.request.method.GET,
                dataType: 'text',
                withCredentials: true,
                data: this.params,
                query: this.params.data ? corbel.utils.serializeParams(this.params.data) : null
            }).then(function(res) {
                res.data = corbel.Services.getLocationId(res);
                return res;
            });
        },
        /**
         * Does a login in oauth server
         * @method
         * @memberOf corbel.Oauth.AuthorizationBuilder
         * @param  {String} username The username of the user to log in
         * @param  {String} password The password of the user
         * @return {Promise}         Q promise that resolves to a redirection to redirectUri or rejects with a {@link SilkRoadError}
         */
        login: function(username, password, setCookie) {
            console.log('oauthInterface.authorization.login', username + ':' + password);
            this.params.username = username;
            this.params.password = password;
            this.params.setCookie = setCookie;
            this.params.withCredentials = true;
            // make request, generate oauth cookie, then redirect manually
            return this.request({
                url: this._buildUri(this.uri + '/authorize'),
                method: corbel.request.method.POST,
                data: this.params
            }).then(function(res) {
                res.data = corbel.Services.getLocationId(res);
                return res;
            });
        },
        /**
         * Sign out from oauth server
         * @method
         * @memberOf corbel.Oauth.SignOutBuilder
         * @return {Promise}     promise that resolves empty when the sign out process completes or rejects with a {@link SilkRoadError}
         */
        signout: function() {
            console.log('oauthInterface.authorization.signOut');
            delete this.params.data;
            return this.request({
                url: this._buildUri(this.uri + '/signout'),
                method: corbel.request.method.GET,
                withCredentials: true
            }).then(function(res) {
                res.data = corbel.Services.getLocationId(res);
                return res;
            });
        },

        _buildUri: corbel.Oauth._buildUri
    });
})();
