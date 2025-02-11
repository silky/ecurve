var assert = require('assert')

var BigInteger = require('bigi')

var ecurve = require('../')
var ECCurveFp = ecurve.ECCurveFp
var ECPointFp = ecurve.ECPointFp
var getECParams = ecurve.getECParams

require('terst')

var fixtures = require('./fixtures/point')

describe('ECPointFp', function() {
  describe('+ decodeFrom()', function() {
    it('should be an static (class) method', function() {
      assert.equal(typeof ECPointFp.decodeFrom, 'function');
    });

    // secp256k1: p = 2^256 - 2^32 - 2^9 - 2^8 - 2^7 - 2^6 - 2^4 - 1
    var p = BigInteger.fromHex('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F');
    var a = BigInteger.ZERO;
    var b = BigInteger.fromHex('07');
    var curve = new ECCurveFp(p, a, b);
    
    var pubHex = '04d6d48c4a66a303856d9584a6ad49ce0965e9f0a5e4dcae878a3d017bd58ad7af3d0b920af7bd54626103848150f8b083edcba99d0a18f1035b6036da1500c6c0';
    var pubKey = new Buffer(pubHex, 'hex')
    var pubHexCompressed = '02d6d48c4a66a303856d9584a6ad49ce0965e9f0a5e4dcae878a3d017bd58ad7af';

    it('should work with uncompressed keys', function(){
      var pubPoint = ECPointFp.decodeFrom(curve, pubKey);
      assert.equal(pubHex, new Buffer(pubPoint.getEncoded(false)).toString('hex'))
    });

    it('should work with compressed keys', function() {
      var pubPoint = ECPointFp.decodeFrom(curve, pubKey);
      var pubKeyCompressed = pubPoint.getEncoded(true);
      var pubPointCompressed = ECPointFp.decodeFrom(curve, pubKeyCompressed);
      assert.equal(pubHex, new Buffer(pubPointCompressed.getEncoded(false)).toString('hex'));
      assert.equal(new Buffer(pubKeyCompressed).toString('hex'), new Buffer(pubPointCompressed.getEncoded(true)).toString('hex'));
      assert.equal(pubHexCompressed, new Buffer(pubKeyCompressed).toString('hex'));

    })

    it('decodes the correct point', function() {
      fixtures.valid.forEach(function(f) {
        var curve = getECParams('secp256k1').curve
        var buffer = new Buffer(f.hex, 'hex')

        var decoded = ECPointFp.decodeFrom(curve, buffer)
        assert.equal(decoded.getX().toBigInteger().toString(), f.x)
        assert.equal(decoded.getY().toBigInteger().toString(), f.y)
        //assert.equal(decoded.compressed, f.compressed) //TODO: maybed add this
      }) 
    })

    fixtures.invalid.forEach(function(f) {
      it('throws on ' + f.description, function() {
        var curve = getECParams('secp256k1').curve
        var buffer = new Buffer(f.hex, 'hex')

        assert.throws(function() {
          ECPointFp.decodeFrom(curve, buffer)
        }, /Invalid sequence length|Invalid sequence tag/)
      })
    })
  })

  describe('- getEncoded()', function() {
    it('should properly get the encoded version', function() {
      fixtures.valid.forEach(function(f) {
        var curve = getECParams('secp256k1').curve
        var Q = new ECPointFp(curve, curve.fromBigInteger(new BigInteger(f.x)), curve.fromBigInteger(new BigInteger(f.y)))

        var encoded = Q.getEncoded(f.compressed)
        assert.equal(encoded.toString('hex'), f.hex)
      })
    })

    describe('> when compressed flag is set to true', function() {
      describe('> when false is passed', function() {
        it('should return encoded (not compressed)', function() {
          var x = "55066263022277343669578718895168534326250603453777594175500187360389116729240"
          var y = "32670510020758816978083085130507043184471273380659243275938904335757337482424"
          var res = "0479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8"
          var curve = getECParams('secp256k1').curve
          var doCompress = false

          var Q = new ECPointFp(curve, curve.fromBigInteger(new BigInteger(x)), curve.fromBigInteger(new BigInteger(y)))
          Q.compressed = true
          var encoded = Q.getEncoded(doCompress)
          EQ (encoded.toString('hex'), res)
        })
      })

      describe('> when true is passed', function() {
        it('should return encoded (not compressed)', function() {
          var x = "55066263022277343669578718895168534326250603453777594175500187360389116729240"
          var y = "32670510020758816978083085130507043184471273380659243275938904335757337482424"
          var res = "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"
          var curve = getECParams('secp256k1').curve
          var doCompress = true

          var Q = new ECPointFp(curve, curve.fromBigInteger(new BigInteger(x)), curve.fromBigInteger(new BigInteger(y)))
          Q.compressed = true
          var encoded = Q.getEncoded(doCompress)
          EQ (encoded.toString('hex'), res)
        })
      })
    })

    describe('> when compressed flag is set to false', function() {
      describe('> when false is passed', function() {
        it('should return encoded (not compressed)', function() {
          var x = "55066263022277343669578718895168534326250603453777594175500187360389116729240"
          var y = "32670510020758816978083085130507043184471273380659243275938904335757337482424"
          var res = "0479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8"
          var curve = getECParams('secp256k1').curve
          var doCompress = false

          var Q = new ECPointFp(curve, curve.fromBigInteger(new BigInteger(x)), curve.fromBigInteger(new BigInteger(y)))
          Q.compressed = false
          var encoded = Q.getEncoded(doCompress)
          EQ (encoded.toString('hex'), res)
        })
      })

      describe('> when true is passed', function() {
        it('should return encoded (not compressed)', function() {
          var x = "55066263022277343669578718895168534326250603453777594175500187360389116729240"
          var y = "32670510020758816978083085130507043184471273380659243275938904335757337482424"
          var res = "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"
          var curve = getECParams('secp256k1').curve
          var doCompress = true

          var Q = new ECPointFp(curve, curve.fromBigInteger(new BigInteger(x)), curve.fromBigInteger(new BigInteger(y)))
          Q.compressed = false
          var encoded = Q.getEncoded(doCompress)
          EQ (encoded.toString('hex'), res)
        })
      })
    })

    describe('> when getEncoded() has no parameter', function() {
      describe('> when compressed flag is set to false', function() {
        it('should return encoded (not compressed)', function() {
          var x = "55066263022277343669578718895168534326250603453777594175500187360389116729240"
          var y = "32670510020758816978083085130507043184471273380659243275938904335757337482424"
          var res = "0479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8"
          var curve = getECParams('secp256k1').curve

          var Q = new ECPointFp(curve, curve.fromBigInteger(new BigInteger(x)), curve.fromBigInteger(new BigInteger(y)))
          Q.compressed = false
          var encoded = Q.getEncoded()
          EQ (encoded.toString('hex'), res)
        })
      })

      describe('> when compressed flag is set to true', function() {
        it('should return encoded (not compressed)', function() {
          var x = "55066263022277343669578718895168534326250603453777594175500187360389116729240"
          var y = "32670510020758816978083085130507043184471273380659243275938904335757337482424"
          var res = "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"
          var curve = getECParams('secp256k1').curve

          var Q = new ECPointFp(curve, curve.fromBigInteger(new BigInteger(x)), curve.fromBigInteger(new BigInteger(y)))
          Q.compressed = true
          var encoded = Q.getEncoded()
          EQ (encoded.toString('hex'), res)
        })
      })
    })
  })

  describe('- equals()', function() {
    var p = BigInteger.fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F");
    var a = BigInteger.ZERO;
    var b = BigInteger.fromHex("07");
    var n = BigInteger.fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141");
    var curve = new ECCurveFp(p, a, b);

    it('should return true when points are equal', function() {
      var x1 = BigInteger.fromHex("79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798")
      var y1 = BigInteger.fromHex("483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8")
      var G1 = new ECPointFp(curve, curve.fromBigInteger(x1), curve.fromBigInteger(y1))

      var x2 = BigInteger.fromHex("79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798")
      var y2 = BigInteger.fromHex("483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8")
      var G2 = new ECPointFp(curve, curve.fromBigInteger(x2), curve.fromBigInteger(y2))

      T (G1.equals(G2))
      T (G2.equals(G1))
    })

    it('should return false when points are not equal', function() {
      var x1 = BigInteger.fromHex("79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798")
      var y1 = BigInteger.fromHex("483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8")
      var G1 = new ECPointFp(curve, curve.fromBigInteger(x1), curve.fromBigInteger(y1))

      var x2 = BigInteger.fromHex("79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F817FF")
      var y2 = BigInteger.fromHex("483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8")
      var G2 = new ECPointFp(curve, curve.fromBigInteger(x2), curve.fromBigInteger(y2))

      F (G1.equals(G2))
      F (G2.equals(G1))
    })
  })
})