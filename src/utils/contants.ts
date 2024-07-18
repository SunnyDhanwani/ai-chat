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

const FEEDBACK_REPLY_MESSAGES = [
  "Thanks for your feedback! May your day be as epic as a chart-topping hit. 🎶 Have a fantastic day!",
  "Your feedback made our day! Here's wishing you a day filled with catchy tunes and unforgettable moments.",
  "Thanks for the feedback! Hope your day is as fabulous as a number-one single!",
  "We appreciate your feedback! May your day be full of top-chart vibes and good times.",
  "Thanks for sharing your thoughts! Here's to a day as bright and inspiring as a summer anthem.",
  "Your feedback was music to our ears! Have a day that's as memorable as your favorite song.",
  "Thanks for the feedback! Wishing you a day filled with endless good vibes and a soundtrack to match.",
  "Your feedback hit the right notes! May your day be as uplifting as a feel-good hit.",
  "We're grateful for your feedback! Hope your day is as dynamic and exciting as a live concert experience.",
  "Thanks for your feedback! Here's to a day as delightful and energizing as a playlist full of classics!",
];

const ENCRYPTION_KEY = CryptoJS.enc.Hex.parse("SENTISUM");
const IV = CryptoJS.enc.Hex.parse("00000000000000000000000000000000"); // 16 bytes IV for AES

export { EMPTY_STATE_MESSAGES, FEEDBACK_REPLY_MESSAGES, ENCRYPTION_KEY, IV };
