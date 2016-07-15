const assert = require('chai').assert;
const RatingService = require('../modules/rating.service');
const Rating = new RatingService();


describe('Rating Service', function() {

    describe('ELO Calculation', function() {
        it('should return the change +15.2 when passed the parameters: 2200, 2400, 20, 1', function() {
            assert.equal(15.19, Rating.elo(2200,2400, 20, 1).change);
        });
    });

    describe('ECF Calculation', function() {
        it('should return the grade 250 when passed the parameters: 180, 200, 1', function() {
            assert.equal(250, Rating.ecf(180,200, 1).change);
        });
    });

    describe('Convert ECF Grade to ELO Rating', function() {
        it('should return the elo rating 2200 when given the ecf grade 200', function() {
            assert.equal(2200, Rating.convertToElo(200));
        })
    });

    describe('Convert ELO Rating to ECF Grade', function() {
        it('should return the ecf grade 200 when give the elo rating 2200', function() {
            assert.equal(200, Rating.convertToEcf(2200));
        })
    });

})
