import CryptoJS from "crypto-js";

const EMPTY_STATE_MESSAGES = [
  "Whisper your message and let magic unfold.",
  "Unleash your message and ignite ideas.",
  "Release your message and watch words soar.",
  "Craft your message and spark a dialogue.",
  "Breathe your message and unleash dreams.",
  "Compose your message and start the dance.",
  "Deliver your message and release whispers.",
  "Illuminate your message and light the stars.",
  "Weave your message and craft a symphony.",
  "Express your message and paint with words.",
];

const ENCRYPTION_KEY = CryptoJS.enc.Hex.parse("SENTISUM");
const IV = CryptoJS.enc.Hex.parse("00000000000000000000000000000000"); // 16 bytes IV for AES

export { EMPTY_STATE_MESSAGES, ENCRYPTION_KEY, IV };
