
const playerService = require( './baku.team.service' );
let counter = 0;

playerService.getPlayers().then( players => {

    JSON.parse( players ).forEach( player => {

        let total = 0;

        try {
            player.roundResults.forEach( result => {
                total += result.points;
            });

            setTimeout(() => {
                playerService.updatePlayerCurrentTotal( player.id, total ).then( data => {
                    console.log( data.name );
                }, error => {
                    console.log( error );
                });
            }, counter * 10);

            counter++;

        } catch (e) {
            console.log( e );
        }
    });

});
