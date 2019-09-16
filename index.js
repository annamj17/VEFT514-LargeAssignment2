// Here the web service should be setup and routes declared
const express = require('express');
const app = express();



// TODO: Setup all routes
app.get('/api/artists', function(req,res) {
    return res.json({ hi: 'hi' });
});





// http://localhost:3000
app.listen(3000, function() {
    console.log('Server is listening on port 3000');
}); 