const functions = require("firebase-functions");
const admin = require("firebase-admin");
const speech = require("@google-cloud/speech");

admin.initializeApp();
const client = new speech.SpeechClient();

exports.transcribeAudio = functions.https.onRequest(async (req, res) => {
  try {
    // Ensure audioUrl is passed in the request body
    const gcsUri = req.body.audioUrl;

    // Google Cloud Speech-to-Text request
    const [response] = await client.recognize({
      audio: {uri: gcsUri},
      config: {
        encoding: "LINEAR16", // encoding format
        sampleRateHertz: 16000, // sample rate
        languageCode: "en-US", // language
      },
    });

    // Extract the transcription from the response
    const transcription = response.results
        .map((result) => result.alternatives[0].transcript)
        .join("\n");

    // Return the transcription in the response
    res.status(200).send({
      transcription,
    });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    res.status(500).send("Error transcribing audio");
  }
});
