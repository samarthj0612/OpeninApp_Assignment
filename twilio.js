require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNo = process.env.TWILIO_PHONE_NO;

if (!accountSid || !authToken || !twilioPhoneNo) {
  console.error("Missing Twilio environment variables. Make sure to set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NO.");
  process.exit(1); // Exit the process with an error code
}

const twilio = require("twilio");
const client = twilio(accountSid, authToken);

const makeCall = (recipientContactNo, cb) => {
  if (!recipientContactNo || !/^\+\d+$/.test(recipientContactNo)) {
    console.error("Invalid recipient phone number.");
    return;
  }

  client.calls
    .create({
      url: "http://demo.twilio.com/docs/voice.xml", // replace with your TwiML URL
      to: recipientContactNo,
      from: twilioPhoneNo,
    })
    .then((call) => {
      console.log("Call SID:", call.sid)
      cb(null);
    })
    .catch((error) => {
      console.error("Error making the call:", error.message)
      cb(error);
    });
};

module.exports = { makeCall };
