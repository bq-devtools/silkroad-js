'use strict';

var corbel = require('../../../dist/corbel.js'),
  chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon');

describe('corbel.Services', function() {

  var sandbox;

  this.timeout(4000);

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('contains expected static methods', function() {
    expect(corbel.Services).to.include.key('getLocationId');
    expect(corbel.Services).to.include.key('addEmptyJson');
  });

  it('contains expected static constants', function() {
    expect(corbel.Services._FORCE_UPDATE_TEXT).to.be.a('string');
    expect(corbel.Services._FORCE_UPDATE_MAX_RETRIES).to.be.a('number');
    expect(corbel.Services._FORCE_UPDATE_STATUS).to.be.a('string');
    expect(corbel.Services._FORCE_UPDATE_STATUS_CODE).to.be.a('number');
    expect(corbel.Services._UNAUTHORIZED_STATUS_CODE).to.be.a('number');
  });

  it('corbel.Services.getLocationId returns undefined with invalid response or location', function() {
    // undefined responseObject
    var response = corbel.Services.getLocationId();
    expect(response).to.be.equal(undefined);

    // empty responseObject
    response = corbel.Services.getLocationId({});
    expect(response).to.be.equal(undefined);

    // empty xhr location header
    response = corbel.Services.getLocationId({
      xhr: {
        getResponseHeader: function() {
          return undefined;
        }
      }
    });
    expect(response).to.be.equal(undefined);

    // empty location header
    response = corbel.Services.getLocationId({
      response: {
        headers: {}
      }
    });
    expect(response).to.be.equal(undefined);
  });

  it('corbel.Services.getLocationId returns id with valid response or location', function() {

    var validLocation = '/some/location/locationId';

    var browserResponse = {
      xhr: {
        getResponseHeader: function() {
          return validLocation;
        }
      }
    };
    var nodeResponse = {
      response: {
        headers: {
          location: validLocation
        }
      }
    };

    var response = corbel.Services.getLocationId(browserResponse);
    expect(response).to.be.equal('locationId');

    response = corbel.Services.getLocationId(nodeResponse);
    expect(response).to.be.equal('locationId');

  });


  describe('corbel.Services.addEmptyJson', function() {

    it('returns expected value with falsy values for "json" types', function() {
      var response = corbel.Services.addEmptyJson(undefined, 'json');
      expect(response).to.be.equal('{}');

      response = corbel.Services.addEmptyJson(false, 'json');
      expect(response).to.be.equal('{}');

      response = corbel.Services.addEmptyJson(0, 'json');
      expect(response).to.be.equal('{}');

      response = corbel.Services.addEmptyJson('', 'json');
      expect(response).to.be.equal('{}');
    });

    it('returns expected value with falsy values for "no-json" types', function() {
      var response = corbel.Services.addEmptyJson(undefined, 'text');
      expect(response).to.be.equal(undefined);

      response = corbel.Services.addEmptyJson(false, 'text');
      expect(response).to.be.equal(false);

      response = corbel.Services.addEmptyJson(0, 'text');
      expect(response).to.be.equal(0);

      response = corbel.Services.addEmptyJson('', 'text');
      expect(response).to.be.equal('');
    });

  });

  describe('instance', function() {
    var driver = corbel.getDriver({
        urlBase: 'urlBase/',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        audience: 'audience'
      }),
      service,
      requestStub;

    beforeEach(function() {
      service = new corbel.Services(driver);
      requestStub = sandbox.stub(corbel.request, 'send');
    });

    it('has expected methods', function() {
      expect(service).to.respondTo('request');
      expect(service).to.respondTo('_doRequest');
      expect(service).to.respondTo('_refreshHandler');
      expect(service).to.respondTo('_addAuthorization');
      expect(service).to.respondTo('_buildParams');
      expect(service).to.respondTo('_buildUri');
    });

    describe('when calling a request', function() {

      describe('with a success response', function() {

        it('returns success response', function(done) {

          requestStub.returns(Promise.resolve('data'));

          service.request({
            method: 'GET',
            url: 'url'
          }).then(function(response) {
            expect(response).to.be.equal('data');
            done();
          });

        });

        it('do not retry the request', function(done) {

          requestStub.returns(Promise.resolve('data'));
          var spy = sandbox.spy(service, '_refreshHandler');

          service.request({
            method: 'GET',
            url: 'url'
          }).then(function() {
            expect(spy.callCount).to.be.equal(0);
            done();
          });

        });

      });

      describe('with a rejected response', function() {

        describe('because of force_update', function() {

          it('triggers force update handler and rejects promise', function(done) {

            // reset force_update counter
            driver.config.set(corbel.Services._FORCE_UPDATE_STATUS, 0);

            var spyRefresh = sandbox.spy(service, '_refreshHandler');
            var spyDoRequest = sandbox.spy(service, '_doRequest');
            var spyToken = sandbox.spy(service.driver.iam, 'token');

            // stub request
            requestStub.onCall(0).returns(Promise.reject({
              status: corbel.Services._FORCE_UPDATE_STATUS_CODE,
              textStatus: corbel.Services._FORCE_UPDATE_TEXT
            }));


            service.request({
              method: 'GET',
              url: 'url'
            }).catch(function() {

              var retries = driver.config.get(corbel.Services._FORCE_UPDATE_STATUS);

              expect(retries).to.be.equal(1);

              expect(spyRefresh.callCount).to.be.equal(0);
              expect(spyToken.callCount).to.be.equal(0);
              expect(spyDoRequest.callCount).to.be.equal(1);
              done();
            });

          });

        });

        describe('because of unauthorized', function() {

          var tokenObjectExample = {
              accessToken: 'accessToken',
              refreshToken: 'refreshToken',
              expiresAt: 123123
            },
            spyRefresh,
            spyDoRequest,
            stubToken,
            spyTokenRefresh,
            scopesExample = 'scopes',
            newToken = {
              accessToken: 'newToken',
              refreshToken: 'newRefreshToken',
              expiresAt: 111111
            };

          beforeEach(function() {
            driver.config.set(corbel.Iam.IAM_TOKEN, tokenObjectExample);
            driver.config.set(corbel.Iam.IAM_TOKEN_SCOPES, scopesExample);

            spyRefresh = sandbox.spy(service, '_refreshHandler');
            spyDoRequest = sandbox.spy(service, '_doRequest');

            var tokenBuilder = driver.iam.token();
            spyTokenRefresh = sandbox.spy(tokenBuilder, 'refresh');
            stubToken = sandbox.stub(driver.iam, 'token').returns(tokenBuilder);

            // stub request
            requestStub.onCall(0).returns(Promise.reject({
              status: corbel.Services._UNAUTHORIZED_STATUS_CODE,
              error: 'unauthorized'
            }));

          });

          it('tries to refresh token', function(done) {

            // stub refresh token
            requestStub.onCall(1).returns(Promise.resolve({
              status: 200,
              data: newToken
            }));

            // stub retry request
            requestStub.onCall(2).returns(Promise.resolve({
              status: 200,
              data: 'responseData'
            }));

            service.request({
              method: 'GET',
              url: 'url'
            }).then(function() {
              expect(spyRefresh.calledOnce).to.be.equal(true);
              expect(stubToken.calledOnce).to.be.equal(true);
              expect(spyTokenRefresh.calledOnce).to.be.equal(true);
              done();
            });

          });

          it('rejects after limit UNAUTHORIZED retries', function(done) {

            // stub refresh token
            requestStub.onCall(1).returns(Promise.resolve({
              status: 200,
              data: newToken
            }));
            // stub retry request
            requestStub.onCall(2).returns(Promise.reject({
              status: corbel.Services._UNAUTHORIZED_STATUS_CODE,
              error: 'unauthorized'
            }));
            // stub refresh token
            requestStub.onCall(3).returns(Promise.resolve({
              status: 200,
              data: newToken
            }));
            // stub retry request
            requestStub.onCall(4).returns(Promise.resolve({
              status: 200,
              data: 'responseData'
            }));

            service.request({
              method: 'GET',
              url: 'url'
            })
              .catch(function(response) {
                expect(response.status).to.equals(401);
                expect(requestStub.callCount).to.be.equal(3);
                expect(spyRefresh.callCount).to.be.equal(1);
                expect(stubToken.callCount).to.be.equal(1);
                expect(spyTokenRefresh.callCount).to.be.equal(1);
                done();
              });

          });

          describe('in refresh token handler', function() {
            it('if fails, return original error', function(done) {

              // stub refresh token
              requestStub.onCall(1).returns(Promise.reject({
                status: corbel.Services._UNAUTHORIZED_STATUS_CODE,
                error: 'unauthorized'
              }));

              service.request({
                method: 'GET',
                url: 'url'
              }).catch(function(response) {
                expect(spyRefresh.calledOnce).to.be.equal(true);
                expect(spyRefresh.calledOnce).to.be.equal(true);
                expect(stubToken.calledOnce).to.be.equal(true);
                expect(spyTokenRefresh.calledOnce).to.be.equal(true);
                expect(spyDoRequest.calledOnce).to.be.equal(true);

                expect(response.status).to.be.equal(401);
                expect(response.error).to.be.equal('unauthorized');

                done();
              });

            });

            describe('if success', function() {

              beforeEach(function() {

                // stub refresh token
                requestStub.onCall(1).returns(Promise.resolve({
                  status: 200,
                  data: newToken
                }));
              });

              it('retries request', function(done) {

                // stub retry request
                requestStub.onCall(2).returns(Promise.resolve({
                  status: 200,
                  data: 'responseData'
                }));

                service.request({
                  method: 'GET',
                  url: 'url'
                }).then(function() {
                  expect(spyRefresh.callCount).to.be.equal(1);
                  expect(spyDoRequest.callCount).to.be.equal(2);
                  expect(stubToken.calledOnce).to.be.equal(true);
                  expect(spyTokenRefresh.calledOnce).to.be.equal(true);

                  var args0 = spyDoRequest.getCall(0).args[0];
                  var args1 = spyDoRequest.getCall(1).args[0];

                  console.log('headers0', args0.headers.Authorization);
                  console.log('headers1', args1.headers.Authorization);
                  expect(args0.url).to.be.equal(args1.url);
                  expect(args0.method).to.be.equal(args1.method);
                  expect(args0.contentType).to.be.equal(args1.contentType);
                  expect(args0.dataType).to.be.equal(args1.dataType);
                  expect(args0.data).to.be.equal(args1.data);

                  //@TODO: sinon mantains reference accross the args received on the calls
                  //a deeper look probes that the first call receives the correct header "accessToken"
                  //but sinon does not store it properly
                  //expect(args0.headers.Authorization).to.be.equal('Bearer accessToken');
                  expect(args1.headers.Authorization).to.be.equal('Bearer newToken');

                  done();
                });


              });

              describe('in retry request', function() {

                it('if success, returns response', function(done) {

                  // stub retry request
                  requestStub.onCall(2).returns(Promise.resolve({
                    status: 200,
                    data: 'responseData'
                  }));

                  service.request({
                    method: 'GET',
                    url: 'url'
                  }).then(function(response) {
                    expect(response.data).to.be.equal('responseData');

                    done();
                  });


                });

                it('if error, return error', function(done) {

                  // stub retry request
                  requestStub.onCall(2).returns(Promise.reject({
                    status: 444,
                    error: 'other-error'
                  }));

                  service.request({
                    method: 'GET',
                    url: 'url'
                  }).catch(function(response) {
                    expect(response.status).to.be.equal(401);
                    expect(response.error).to.be.equal('unauthorized');

                    done();
                  });


                });


              });

            });


          });
        });

        describe('with client authorization', function() {
          afterEach(function() {
            corbel.Services._UNAUTHORIZED_MAX_RETRIES = 1;
          });

          describe('Configured with credentials', function() {

            var generatedAccessToken = corbel.jwt.generate({
              iss: 'example',
              aud: 'example',
              scope: 'example'
            }, 'secret');

            var tokenObjectExample = {
                accessToken: 'accessToken',
                expiresAt: 123123
              },
              clientId = 'example',
              clientSecret = 'example',
              scopesExample = 'scopes',
              newToken = {
                accessToken: generatedAccessToken,
                expiresAt: 111111
              };

            var tokenBuilder, spyRefreshHandler, spyCreateToken, stubToken;
            var spyConfigSet;

            beforeEach(function() {

              driver.config.set(corbel.Iam.IAM_TOKEN, tokenObjectExample);

              driver.config.set('clientSecret', clientSecret);
              driver.config.set('clientId', clientId);
              driver.config.set('scopes', scopesExample);

              tokenBuilder = driver.iam.token();
              spyCreateToken = sandbox.spy(tokenBuilder, 'create');

              stubToken = sandbox.stub(driver.iam, 'token').returns(tokenBuilder);

              spyRefreshHandler = sandbox.spy(service, '_refreshHandler');
              spyConfigSet = sandbox.spy(driver.config, 'set');

              // stub request
              requestStub.onCall(0).returns(Promise.reject({
                status: corbel.Services._UNAUTHORIZED_STATUS_CODE,
                error: 'unauthorized'
              }));

            });

            it('refreshes token more than one time if needed', function(done) {
              corbel.Services._UNAUTHORIZED_MAX_RETRIES = 3;

              // stub refresh token
              requestStub.onCall(1).returns(Promise.resolve({
                status: 200,
                data: newToken
              }));

              // stub retry request
              requestStub.onCall(2).returns(Promise.reject({
                status: corbel.Services._UNAUTHORIZED_STATUS_CODE,
                error: 'unauthorized'
              }));

              // stub refresh token
              requestStub.onCall(3).returns(Promise.resolve({
                status: 200,
                data: newToken
              }));

              // stub retry request
              requestStub.onCall(4).returns(Promise.resolve({
                status: 203,
                data: 'responseData'
              }));

              service.request({
                method: 'GET',
                url: 'url'
              })
                .then(function(response) {
                  expect(response.status).to.equals(203);
                  //It has setted in the config the new data
                  expect(spyConfigSet.callCount).to.be.above(2);
                  expect(spyConfigSet.calledWith(corbel.Iam.IAM_TOKEN)).to.be.equal(true);
                  expect(spyConfigSet.calledWith(corbel.Iam.IAM_DOMAIN)).to.be.equal(true);
                  expect(spyConfigSet.calledWith(corbel.Iam.IAM_TOKEN_SCOPES)).to.be.equal(true);

                  expect(spyRefreshHandler.callCount).to.be.equal(2);
                  expect(stubToken.callCount).to.be.equal(2);
                  expect(spyCreateToken.callCount).to.be.equal(2);
                  done();
                });

            });
          });

          describe('Configured without credentials, only with iamToken', function() {

            var generatedAccessToken = corbel.jwt.generate({
              iss: 'example',
              aud: 'example',
              scope: 'example'
            }, 'secret');

            var tokenObjectExample = {
                accessToken: 'accessToken',
                expiresAt: 123123
              },
              newToken = {
                accessToken: generatedAccessToken,
                expiresAt: 111111
              };

            var tokenBuilder, spyRefreshHandler, spyCreateToken, stubToken;
            var spyConfigSet;

            beforeEach(function() {

              driver.config.set(corbel.Iam.IAM_TOKEN, tokenObjectExample);
              driver.config.set('clientSecret', null);
              driver.config.set('clientId', null);
              driver.config.set('scopes', null);

              tokenBuilder = driver.iam.token();
              spyCreateToken = sandbox.spy(tokenBuilder, 'create');

              stubToken = sandbox.stub(driver.iam, 'token').returns(tokenBuilder);

              spyRefreshHandler = sandbox.spy(service, '_refreshHandler');
              spyConfigSet = sandbox.spy(driver.config, 'set');

              // stub request
              requestStub.onCall(0).returns(Promise.reject({
                status: corbel.Services._UNAUTHORIZED_STATUS_CODE,
                error: 'unauthorized'
              }));

            });

            it('tries to refresh token but fails as credentials are not provided', function(done) {
              // stub refresh token (has not to be called), but leave it for mocking a failing case
              // otherwise it will pass the test but the functionality may be broken
              requestStub.onCall(1).returns(Promise.resolve({
                status: 200,
                data: newToken
              }));

              // stub retry request (has not to be called), but leave it for mocking a failing case
              // otherwise it will pass the test but the functionality may be broken
              requestStub.onCall(2).returns(Promise.resolve({
                status: 203,
                data: 'responseData'
              }));

              service.request({
                method: 'GET',
                url: 'url'
              })
                .catch(function(response) {
                  expect(response.status).to.equals(401);
                  //It has setted in the config the new data
                  expect(requestStub.callCount).to.be.equal(1);
                  expect(spyConfigSet.callCount).to.be.equal(1);
                  expect(spyConfigSet.calledWith(corbel.Services._UNAUTHORIZED_NUM_RETRIES, 0)).to.be.equal(true);
                  expect(spyRefreshHandler.callCount).to.be.equal(1);
                  expect(stubToken.callCount).to.be.equal(1);
                  expect(spyCreateToken.callCount).to.be.equal(1);
                  done();
                });

            });
          });

        });


        describe('because of whatever, returns error response', function() {

        });

      });

    });

  });

});