'use strict'
/* jshint camelcase:false */
/* globals describe it beforeEach afterEach */

var corbel = require('../../../dist/corbel.js')
var chai = require('chai')
var sinon = require('sinon')
var expect = chai.expect

describe('corbel BORROW module', function () {
  var sandbox = sinon.sandbox.create()
  var CONFIG = {
    clientId: 'clientId',
    clientSecret: 'clientSecret',

    scopes: ['silkroad-qa:client', 'resources:send_event_bus', 'resources:test:test_operations', 'resources:music:read_catalog', 'resources:music:streaming'],

    urlBase: 'https://{{module}}-corbel.io/'

  }

  var BORROW_END_POINT = CONFIG.urlBase.replace('{{module}}', 'borrow') + 'resource'

  var USER_BORROW_END_POINT = CONFIG.urlBase.replace('{{module}}', 'borrow') + 'user'

  var LENDER_BORROW_END_POINT = CONFIG.urlBase.replace('{{module}}', 'borrow') + 'lender'

  var corbelDriver = corbel.getDriver(CONFIG)

  var corbelRequestStub
  var borrow

  beforeEach(function () {
    corbelDriver = corbel.getDriver(CONFIG)
    borrow = corbelDriver.borrow
    corbelRequestStub = sandbox.stub(corbel.request, 'send').returns(Promise.resolve())
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('we can with a loanable resources', function () {
    it('add loanable resource', function () {
      corbelRequestStub.returns(Promise.resolve())
      var loanableResource = {}

      corbelDriver.borrow.resource().add(loanableResource)

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(BORROW_END_POINT)
      expect(callRequestParam.method).to.be.equal('POST')
    })

    it('get (undefined) loanable resource', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))
      expect(function () {
        corbelDriver.borrow.resource().get()
      }).to.throw('id value is mandatory and cannot be undefined')
    })

    it('get loanable resource', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.resource('idResource').get()

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(BORROW_END_POINT + '/idResource')
      expect(callRequestParam.method).to.be.equal('GET')
    })

    it('delete (undefined) loanable resource', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))
      expect(function () {
        corbelDriver.borrow.resource().delete()
      }).to.throw('id value is mandatory and cannot be undefined')
    })

    it('delete loanable resource', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.resource('idResource').delete()

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(BORROW_END_POINT + '/idResource')
      expect(callRequestParam.method).to.be.equal('DELETE')
    })

    it('add license to (undefined) loanable resource', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))
      var license = {}

      expect(function () {
        corbelDriver.borrow.resource().addLicense(license)
      }).to.throw('id value is mandatory and cannot be undefined')
    })

    it('add license to loanable resource', function () {
      corbelRequestStub.returns(Promise.resolve())
      var license = {}

      corbelDriver.borrow.resource('idResource').addLicense(license)

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(BORROW_END_POINT + '/idResource/license')
      expect(callRequestParam.method).to.be.equal('POST')
    })

    it('apply for any user using an undefined resourceId', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      expect(function () {
        corbelDriver.borrow.resource().applyFor('userId')
      }).to.throw('id value is mandatory and cannot be undefined')
    })

    it('apply for any user using an undefined userId', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      expect(function () {
        corbelDriver.borrow.resource('resourceId').applyFor()
      }).to.throw('userId value is mandatory and cannot be undefined')
    })

    it('apply for any user', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.resource('idResource').applyFor('userId')

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(BORROW_END_POINT + '/idResource/loan/userId')
      expect(callRequestParam.method).to.be.equal('PUT')
    })

    it('apply for logged user using an undefined resourceId', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      expect(function () {
        corbelDriver.borrow.resource().applyForMe()
      }).to.throw('id value is mandatory and cannot be undefined')
    })

    it('apply for logged user', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.resource('idResource').applyForMe()

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(BORROW_END_POINT + '/idResource/loan/me')
      expect(callRequestParam.method).to.be.equal('PUT')
    })

    it('get lent of any user using an undefined resourceId', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      expect(function () {
        corbelDriver.borrow.resource().getLentOf('userId')
      }).to.throw('id value is mandatory and cannot be undefined')
    })

    it('get lent of any user using an undefined userId', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      expect(function () {
        corbelDriver.borrow.resource('resourceId').getLentOf()
      }).to.throw('userId value is mandatory and cannot be undefined')
    })

    it('get lent of any user', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.resource('idResource').getLentOf('userId')

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(BORROW_END_POINT + '/idResource/loan/userId')
      expect(callRequestParam.method).to.be.equal('GET')
    })

    it('get lent of logged user using an undefined resourceId', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      expect(function () {
        corbelDriver.borrow.resource().getMyLent()
      }).to.throw('id value is mandatory and cannot be undefined')
    })

    it('get lent of logged user', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.resource('idResource').getMyLent()

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(BORROW_END_POINT + '/idResource/loan/me')
      expect(callRequestParam.method).to.be.equal('GET')
    })

    it('return loan of any user using an undefined resourceId', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      expect(function () {
        corbelDriver.borrow.resource().returnLoanOf('userId')
      }).to.throw('id value is mandatory and cannot be undefined')
    })

    it('return loan of any user using an undefined userId', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      expect(function () {
        corbelDriver.borrow.resource('resourceId').returnLoanOf()
      }).to.throw('userId value is mandatory and cannot be undefined')
    })

    it('return loan of any user', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.resource('idResource').returnLoanOf('userId')

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(BORROW_END_POINT + '/idResource/loan/userId')
      expect(callRequestParam.method).to.be.equal('DELETE')
    })

    it('return loan of logged user using an undefined resourceId', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      expect(function () {
        corbelDriver.borrow.resource().returnMyLoan()
      }).to.throw('id value is mandatory and cannot be undefined')
    })

    it('return loan of logged user', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.resource('idResource').returnMyLoan()

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(BORROW_END_POINT + '/idResource/loan/me')
      expect(callRequestParam.method).to.be.equal('DELETE')
    })

    it('renew loan for any user using an undefined resourceId', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      expect(function () {
        corbelDriver.borrow.resource().renewFor('userId')
      }).to.throw('id value is mandatory and cannot be undefined')
    })

    it('renew loan for any user using an undefined userId', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      expect(function () {
        corbelDriver.borrow.resource('idResource').renewFor()
      }).to.throw('userId value is mandatory and cannot be undefined')
    })

    it('renew loan for any user', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.resource('idResource').renewFor('userId')

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(BORROW_END_POINT + '/idResource/renewal/userId')
      expect(callRequestParam.method).to.be.equal('PUT')
    })

    it('renew loan for logged user using an undefined resourceId', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      expect(function () {
        corbelDriver.borrow.resource().renewForMe()
      }).to.throw('id value is mandatory and cannot be undefined')
    })

    it('renew loan for logged user', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.resource('idResource').renewForMe()

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(BORROW_END_POINT + '/idResource/renewal/me')
      expect(callRequestParam.method).to.be.equal('PUT')
    })

    it('reserve for any user using an undefined resourceId', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      expect(function () {
        corbelDriver.borrow.resource().reserveFor('userId')
      }).to.throw('id value is mandatory and cannot be undefined')
    })

    it('reserve for any user using an undefined userId', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      expect(function () {
        corbelDriver.borrow.resource('idResource').reserveFor()
      }).to.throw('userId value is mandatory and cannot be undefined')
    })

    it('reserve for any user', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.resource('idResource').reserveFor('userId')

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(BORROW_END_POINT + '/idResource/reservation/userId')
      expect(callRequestParam.method).to.be.equal('PUT')
    })

    it('reserve for me user using an undefined resourceId', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      expect(function () {
        corbelDriver.borrow.resource().reserveForMe()
      }).to.throw('id value is mandatory and cannot be undefined')
    })

    it('reserve for me user', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.resource('idResource').reserveForMe()

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(BORROW_END_POINT + '/idResource/reservation/me')
      expect(callRequestParam.method).to.be.equal('PUT')
    })

    it('cancel reservation for any user using an undefined resourceId', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      expect(function () {
        corbelDriver.borrow.resource().cancelReservationFor('userId')
      }).to.throw('id value is mandatory and cannot be undefined')
    })

    it('cancel reservation for any user using an undefined userId', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      expect(function () {
        corbelDriver.borrow.resource('idResource').cancelReservationFor()
      }).to.throw('userId value is mandatory and cannot be undefined')
    })

    it('cancel reservation for any user', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.resource('idResource').cancelReservationFor('userId')

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(BORROW_END_POINT + '/idResource/reservation/userId')
      expect(callRequestParam.method).to.be.equal('DELETE')
    })

    it('cancel reservation for logged user using an undefined resourceId', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      expect(function () {
        corbelDriver.borrow.resource().cancelMyReservation()
      }).to.throw('id value is mandatory and cannot be undefined')
    })

    it('cancel reservation for logged user', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.resource('idResource').cancelMyReservation()

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(BORROW_END_POINT + '/idResource/reservation/me')
      expect(callRequestParam.method).to.be.equal('DELETE')
    })

    it('get history for any user using an undefined userId', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      expect(function () {
        corbelDriver.borrow.resource('idResource').getHistoryOf()
      }).to.throw('userId value is mandatory and cannot be undefined')
    })

    it('get history for any user', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.resource().getHistoryOf('userId')

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(BORROW_END_POINT + '/history/userId')
      expect(callRequestParam.method).to.be.equal('GET')
    })

    it('get history for logged user', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.resource().getMyHistory()

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(BORROW_END_POINT + '/history/me')
      expect(callRequestParam.method).to.be.equal('GET')
    })

    it('get full history', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.resource().getFullHistory()

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(BORROW_END_POINT + '/history/')
      expect(callRequestParam.method).to.be.equal('GET')
    })
  })

  describe('we can like a user', function () {
    it('get all reservations of any user', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.user('userId').getAllReservations()

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(USER_BORROW_END_POINT + '/userId/reservation')
      expect(callRequestParam.method).to.be.equal('GET')
    })

    it('get all reservations of logged user', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.user().getAllReservations()

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(USER_BORROW_END_POINT + '/me/reservation')
      expect(callRequestParam.method).to.be.equal('GET')
    })

    it('get all loans of any user', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.user('userId').getAllLoans()

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(USER_BORROW_END_POINT + '/userId/loan')
      expect(callRequestParam.method).to.be.equal('GET')
    })

    it('get all loans of logged user', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.user().getAllLoans()

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(USER_BORROW_END_POINT + '/me/loan')
      expect(callRequestParam.method).to.be.equal('GET')
    })
  })

  describe('we can lender operations', function () {
    it('add lender', function () {
      corbelRequestStub.returns(Promise.resolve())
      var lender = {}

      corbelDriver.borrow.lender().create(lender)

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(LENDER_BORROW_END_POINT)
      expect(callRequestParam.method).to.be.equal('POST')
    })

    it('get lender', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.lender('lenderId').get()

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(LENDER_BORROW_END_POINT + '/lenderId')
      expect(callRequestParam.method).to.be.equal('GET')
    })

    it('get all lender', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.lender().getAll()

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(LENDER_BORROW_END_POINT + '/all')
      expect(callRequestParam.method).to.be.equal('GET')
    })

    it('get my lender', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.lender().get()

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(LENDER_BORROW_END_POINT)
      expect(callRequestParam.method).to.be.equal('GET')
    })

    it('update lender', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))
      var lender = {}

      corbelDriver.borrow.lender('lenderId').update(lender)

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(LENDER_BORROW_END_POINT + '/lenderId')
      expect(callRequestParam.method).to.be.equal('PUT')
    })

    it('update my lender', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))
      var lender = {}

      corbelDriver.borrow.lender().update(lender)

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(LENDER_BORROW_END_POINT)
      expect(callRequestParam.method).to.be.equal('PUT')
    })

    it('delete lender', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.lender('lenderId').delete()

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(LENDER_BORROW_END_POINT + '/lenderId')
      expect(callRequestParam.method).to.be.equal('DELETE')
    })

    it('delete my lender', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      corbelDriver.borrow.lender().delete()

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(LENDER_BORROW_END_POINT)
      expect(callRequestParam.method).to.be.equal('DELETE')
    })

    it('get all reservations', function () {
      corbelRequestStub.returns(Promise.resolve('OK'))

      borrow.lender().getAllReservations()

      var callRequestParam = corbel.request.send.firstCall.args[0]
      expect(callRequestParam.url).to.be.equal(LENDER_BORROW_END_POINT + '/reservation')
      expect(callRequestParam.method).to.be.equal('GET')
    })
  })
})
