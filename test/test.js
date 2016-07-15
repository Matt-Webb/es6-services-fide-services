const assert = require('chai').assert;
const RatingService = require('../modules/rating.service');
const Rating = new RatingService();


describe('Rating Service', function() {
    describe('Elo Calculation', function() {
        it('shout return the value 15.2', function() {
            assert.equal(15.19, Rating.elo(2200,2400, 20, 1).change);
        });
    });
})
