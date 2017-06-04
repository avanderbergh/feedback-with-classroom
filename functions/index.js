var functions = require('firebase-functions');
const Language = require('@google-cloud/language');

exports.helloWorld = functions.https.onRequest((request, response) => {

    const body = JSON.parse(request.body);
    
    // Your Google Cloud Platform project ID
    const projectId = 'brilliant-badger';

    // Instantiates a client
    const language = Language({
        projectId: projectId
    });

    // The text to analyze
    const text = body.text;

    // Detects the syntax of the text
    language.annotate(text)
    .then((results) => {
        response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
        response.send(results);
    })
    .catch((err) => {
        console.error('ERROR:', err);
        response.send(err);
    });
});
