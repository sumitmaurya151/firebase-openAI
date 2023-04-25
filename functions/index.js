const functions = require("firebase-functions");

//return response from openAI based on input 
exports.fetchCompletions = functions.https.onRequest(async (data, response) => {
  const userInput = data.query.userInput;
  if (!userInput) {
    throw new functions.https.HttpsError("invalid-argument", "User input is required.");
  }

  try {
    const {Configuration, OpenAIApi} = require("openai");

    // Authenticate with OpenAI API using API key
    const configuration = new Configuration({
      apiKey: "OPENAI_API_KEY",
    });
    const openai = new OpenAIApi(configuration);

    // Generate response using OpenAI API
    async function runCompletion() {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: userInput,
      });

      // Return generated response to client
      response.send(completion.data.choices[0].text);
    }
    runCompletion();
  } catch (err) {
    console.log(err);
    throw new functions.https.HttpsError("internal", "Error generating response.");
  }
});


