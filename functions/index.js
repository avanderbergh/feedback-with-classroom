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
    const document = language.document({ content: text});

    document.detectSyntax()
        .then(results => {
            let myResponse = [];
            let tokens = results[0];
            for (let token of tokens) {
                if (token.partOfSpeech.tag == 'NOUN') {
                    let verb = tokens[token.dependencyEdge.headTokenIndex];
                    if (verb.partOfSpeech.tag == 'VERB') {
                        myResponse.push(verb.lemma.concat(' ', token.lemma));
                    }
                };
            }
            response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send(myResponse);
        }
    ).catch(err => {
        console.error('ERROR:', err);
        response.send(err);
    });
});
