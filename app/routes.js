module.exports = function (app) {

    //****** Front-end routes ************************************
    //Route to handle all angular requests
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html');
    });

};