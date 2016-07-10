function runner() {
    var counter = 0;
    setInterval(function() {
        if(counter % 5 === 0) {
            console.log('Keep alive!', counter);
        }
        counter ++;
    }, 1000);
}

runner();
