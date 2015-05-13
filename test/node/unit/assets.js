'use strict';
/* jshint camelcase:false */

var corbel = require('../../../dist/corbel.js'),
    chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect;

describe('In Assets module we can', function() {

    var sandbox = sinon.sandbox.create();
    var CONFIG = {

        clientId: 'clientId',
        clientSecret: 'clientSecret',

        scopes: ['silkroad-qa:client', 'resources:send_event_bus', 'resources:test:test_operations', 'resources:music:read_catalog', 'resources:music:streaming'],

        urlBase: 'https://{{module}}-corbel.io/'

    };

    var ASSET_URL = CONFIG.urlBase.replace('{{module}}', 'assets') + 'asset';

    var corbelDriver = corbel.getDriver(CONFIG);

    var corbelRequestStub;

    beforeEach(function() {
        corbelRequestStub = sandbox.stub(corbel.request, 'send');
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('create one asset', function() {
        corbelRequestStub.returns(Promise.resolve());
        var testData = '{\'test_object\':\'test\'}';
        corbelDriver.assets().create(testData);

        var callRequestParam = corbelRequestStub.getCall(0).args[0];
        expect(callRequestParam.url).to.be.equal(ASSET_URL);
        expect(callRequestParam.method).to.be.equal('POST');
        expect(callRequestParam.data).to.be.equal(testData);
    });

    it('get my user assets', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));

        var response = corbelDriver.assets().get();

        var callRequestParam = corbelRequestStub.getCall(0).args[0];
        expect(callRequestParam.url).to.be.equal(ASSET_URL);
        expect(callRequestParam.method).to.be.equal('GET');
    });

    it('get my user assets all with params', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));
        var params = {
            query: [{
                '$eq': {
                    field: 'value'
                }
            }],
            pagination: {
                size: 2,
                page: 3
            },
            sort: {
                field: 'asc'
            }
        };

        var response = corbelDriver.assets().get(params);

        var callRequestParam = corbelRequestStub.getCall(0).args[0];
        expect(callRequestParam.url).to.be.equal(ASSET_URL + '?api:query=[{"$eq":{"field":"value"}}]&api:sort={"field":"asc"}&api:page=3&api:pageSize=2');
        expect(callRequestParam.query).to.be.equal();
        expect(callRequestParam.method).to.be.equal('GET');
    });

    it('get all assets', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));

        var response = corbelDriver.assets('all').get();

        var callRequestParam = corbelRequestStub.getCall(0).args[0];
        expect(callRequestParam.url).to.be.equal(ASSET_URL + '/all');
        expect(callRequestParam.method).to.be.equal('GET');
    });

    it('get all with params', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));
        var params = {
            query: [{
                '$eq': {
                    field: 'value'
                }
            }],
            pagination: {
                size: 2,
                page: 3
            },
            sort: {
                field: 'asc'
            }
        };

        var response = corbelDriver.assets('all').get(params);

        var callRequestParam = corbelRequestStub.getCall(0).args[0];
        expect(callRequestParam.url).to.be.equal(ASSET_URL + '/all?' + 'api:query=[{"$eq":{"field":"value"}}]&api:sort={"field":"asc"}&api:page=3&api:pageSize=2');
        expect(callRequestParam.method).to.be.equal('GET');
    });

    it('delete one asset', function() {
        corbelRequestStub.returns(Promise.resolve());
        var assetId = 1;

        var response = corbelDriver.assets(assetId).delete();

        var callRequestParam = corbelRequestStub.getCall(0).args[0];
        expect(callRequestParam.url).to.be.equal(ASSET_URL + '/' + assetId);
        expect(callRequestParam.method).to.be.equal('DELETE');
    });

    it('get access', function() {
        corbelRequestStub.returns(Promise.resolve());
        corbelDriver.assets().access();

        var callRequestParam = corbelRequestStub.getCall(0).args[0];
        expect(callRequestParam.url).to.be.equal(ASSET_URL + '/access');
        expect(callRequestParam.method).to.be.equal('GET');
        expect(callRequestParam.headers['No-Redirect']).to.be.equal(true);
    });

});
