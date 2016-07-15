'use strict';


class  RatingService {

    constructor() {

    }

    elo(playerRating, opponentRating, kFactor, result) {

        const _pR = parseInt(playerRating, 10);
        const _oR = parseInt(opponentRating, 10);
        const _k = parseInt(kFactor, 10);
        const _r = parseInt(result, 10);

        const transformPR = Math.pow(10, (_pR / 400));
        const transformOR = Math.pow(10, (_oR / 400));

        const expectation = transformPR / (transformPR + transformOR);

        const outcome = _pR + _k * (_r - expectation);

        const data = {
            current: _pR,
            opponent: _oR,
            result: _r,
            change: (outcome - _pR).toFixed(2),
            newRating: Math.round(outcome),
            accum: null
        };

        return data;
    }

    ecf() {

    }



}

module.exports = RatingService;
