 'use strict';
 describe('corbel-js browser', function() {

     var sandbox;

     this.timeout(4000);

     beforeEach(function() {
         sandbox = sinon.sandbox.create();
     });

     afterEach(function() {
         sandbox.restore();
     });


     it('corbel-js namespace exists and exports as global', function() {
         expect(window).to.include.keys('corbel');
     });

     it('corbel-js contains all modules', function() {
         expect(window.corbel).to.include.keys('request');
     });


     describe('request module', function() {

         var server,
             url = 'http://localhost:3000/',
             request,
             errorResponse = [400, {
                     'Content-Type': 'application/json',
                     'Access-Controll-Allow-origin': '*',
                     'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE'
                 },
                 JSON.stringify({
                     error: 'error'
                 })
             ],
             successResponse = [200, {
                     'Content-Type': 'application/json',
                     'Access-Controll-Allow-origin': '*',
                     'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE'
                 },
                 JSON.stringify({
                     result: 'result'
                 })
             ];

         before(function() {
             server = sinon.fakeServer.create();
             request = window.corbel.request;
         });

         after(function() {
             server.restore();
         });

         beforeEach(function() {

             server.respondWith(successResponse);

         });

         it('should has own properties', function() {
             expect(request).to.include.keys('send');
         });


         it('send method accepts all http verbs', function() {

             request.send({
                 method: 'GET',
                 url: url
             });

             request.send({
                 method: 'POST',
                 url: url
             });

             request.send({
                 method: 'PUT',
                 url: url
             });

             request.send({
                 method: 'HEAD',
                 url: url
             });

         });

         it('send method throws an error if no url setting', function() {

             var fn = function() {
                 return request.send({
                     method: 'GET'
                 });
             };

             expect(fn).to.throw('undefined:url');
         });

         it('send mehtod returns a promise', function() {

             var promise = request.send({
                 method: 'GET',
                 url: url
             });

             expect(promise).to.be.instanceof(Promise);
         });

         it('send mehtod returns a promise and resolve it', function(done) {

             var resolveCallback = function() {};

             var spyResolve = sandbox.spy(resolveCallback);

             var promise = request.send({
                 method: 'GET',
                 url: url
             });

             server.respond(successResponse);

             promise.then(function() {
                 spyResolve();
                 expect(spyResolve.calledOnce).to.be.equal(true);
                 done();
             });

         });

         it('send mehtod returns a promise and reject it', function() {
             var errorCallback = function() {};

             var spyError = sandbox.spy(errorCallback);

             var promise = request.send({
                 method: 'GET',
                 url: url
             });

             server.respond(errorResponse);

             promise.then(function() {
                 spyError();
                 expect(spyError.calledOnce).to.be.equal(true);
             });

         });


         it('send mehtod accepts a success callback', function() {
             var successCallback = function() {

                 },
                 spySuccessCallback = sandbox.spy(successCallback);

             request.send({
                 method: 'GET',
                 url: url,
                 success: function() {
                     spySuccessCallback();
                 }
             });

             server.respond(successResponse);

             expect(spySuccessCallback.called).to.be.equal(true);

         });

         it('success callback expect responseText, xhr.status , xhr object', function() {
             var successCallback = function() {},
                 spySuccessCallback = sandbox.spy(successCallback);

             request.send({
                 method: 'GET',
                 url: url,
                 success: function() {
                     spySuccessCallback.apply(this, arguments);
                 }
             });

             server.respond(successResponse);

             expect(spySuccessCallback.getCall(0).args[0]).to.be.a('string');
             expect(spySuccessCallback.getCall(0).args[1]).to.be.a('number');
             expect(spySuccessCallback.getCall(0).args[2]).to.be.an('object');

         });

         it('send mehtod accepts an error callback', function() {
             var errorCallback = function() {

                 },
                 spyErrorCallback = sandbox.spy(errorCallback);

             request.send({
                 method: 'GET',
                 url: url,
                 error: function() {
                     spyErrorCallback();
                 },
                 success: function() {
                     window.console.log('a');
                 }
             });

             server.respond(errorResponse);

             expect(spyErrorCallback.calledOnce).to.be.equal(true);

         });


     });


 });