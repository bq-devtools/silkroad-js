//@exclude
'use strict';
/* global corbel */
//@endexclude

(function() {

    /**
     * A builder for token requests
     * @class
     * @memberOf Iam
     */
    var TokenBuilder = corbel.Iam.TokenBuilder = function() {
        this.uri = 'oauth/token';
    };

    /**
     * Creates a TokenBuilder for token requests
     * @return {corbel.Iam.TokenBuilder}
     */
    corbel.Iam.prototype.token = function() {
        var tokenBuilder = new TokenBuilder(this.driver);
        tokenBuilder.driver = this.driver;
        return tokenBuilder;
    };

    TokenBuilder.prototype._buildUri = corbel.Iam._buildUri;

    TokenBuilder.prototype._getJwt = function(params) {
        if (params.jwt) {
            return params.jwt;
        }
        if (params.claims) {
            params.claims.aud = params.claims.aud || corbel.Iam.AUD;
            return corbel.jwt.generate(params.claims);
        } else {
            throw new Error('Create token request must contains either jwt or claims parameter');
        }
    };

    TokenBuilder.prototype._doGetTokenRequest = function(uri, params, setCookie) {
        var args = {
            url: this._buildUri(uri),
            method: corbel.services.method.GET,
            query: corbel.utils.param(corbel.utils.extend({
                assertion: this._getJwt(params),
                'grant_type': corbel.Iam.GRANT_TYPE
            }, params.oauth))
        };

        if (setCookie) {
            args.headers = {
                RequestCookie: 'true'
            };
        }

        return corbel.request.send(args);
    };

    TokenBuilder.prototype._doPostTokenRequest = function(uri, params, setCookie) {
        var args = {
            url: this._buildUri(uri),
            method: corbel.services.method.POST,
            data: {
                assertion: this._getJwt(params),
                'grant_type': corbel.Iam.GRANT_TYPE
            },
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
        };

        if (setCookie) {
            args.headers = {
                RequestCookie: 'true'
            };
        }
        return corbel.request.send(args);
    };

    /**
     * Creates a token to connect with iam
     * @method
     * @memberOf corbel.Iam.TokenBuilder
     * @param  {Object} params          Parameters to authorice
     * @param {String} [params.jwt]     Assertion to generate the token
     * @param {Object} [params.claims]  Claims to generate the token
     * @param {Boolean} [setCookie]     Sends 'RequestCookie' to server
     * @return {Promise}                Q promise that resolves to an AccessToken {Object} or rejects with a {@link corbelError}
     */
    TokenBuilder.prototype.create = function(params, setCookie) {
        // console.log('iamInterface.token.create', params);
        // we need params to create access token
        corbel.validate.isValue(params, 'Create token request must contains params');
        // if there are oauth params this mean we should do use the GET verb
        if (params.oauth) {
            return this._doGetTokenRequest(this.uri, params, setCookie);
        }
        // otherwise we use the traditional POST verb.
        return this._doPostTokenRequest(this.uri, params, setCookie);
    };

    /**
     * Refresh a token to connect with iam
     * @method
     * @memberOf corbel.Iam.TokenBuilder
     * @param {String} [refresh_token]   Token to refresh an AccessToken
     * @param {String} [scopes]          Scopes to the AccessToken
     * @return {Promise}                 Q promise that resolves to an AccesToken {Object} or rejects with a {@link corbelError}
     */
    TokenBuilder.prototype.refresh = function(refreshToken, scopes) {
        // console.log('iamInterface.token.refresh', refreshToken);
        // we need refresh token to refresh access token
        corbel.validate.isValue(refreshToken, 'Refresh access token request must contains refresh token');
        // we need create default claims to refresh access token
        var params = {
            'claims': corbel.jwt.createClaims({
                'refresh_token': refreshToken
            })
        };
        if (scopes) {
            params.claims.scope = scopes;
        }
        // we use the traditional POST verb to refresh access token.
        return this._doPostTokenRequest(this.uri, params);
    };

})();
