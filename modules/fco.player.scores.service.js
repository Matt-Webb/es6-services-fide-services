
const playerService = require( './baku.team.service' );


playerService.getPlayers().then( players => {

    JSON.parse( players ).forEach( player => {

        let total = 0;

        try {
            player.roundResults.forEach( result => {
                total += result.points;
            });

            playerService.updatePlayerCurrentTotal( player.id, total ).then( data => {
                console.log( data );
            }, error => {
                console.log( error );
            })

        } catch (e) {
            console.log( e );
        }
    });

});
