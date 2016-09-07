"use strict";

const teamService = require( '../baku.team.service' );

teamService.getTeam().then( players => {

    JSON.parse( players ).forEach( player )

});
