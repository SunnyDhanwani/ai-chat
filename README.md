# AI Chat Web App

A feature-rich AI chat application with authenticated and guest user modes, allowing users to interact, share, and rate AI-generated messages. Built with modern web technologies like React, Redux, and TailwindCSS.

You can access the live website at: [https://ai-chat-henna-beta.vercel.app/](https://ai-chat-henna-beta.vercel.app/)

## Features

1. **Guest Login**: Allows users to chat without an account; chat history is deleted upon page refresh.
2. **Authenticated User**: Currently a dummy implementation
3. **Authenticated Routes**: Secure access to chat route based on authentication.
4. **Rich Text Editor**: Enhance your messages with rich formatting.
5. **Like/Dislike AI Messages**: Hover over AI messages to like or dislike them.
6. **Share Chat**: Only available for authenticated users; restricted for guest users as the feature is frontend-only.
7. **Rate and Feedback**: Provide a rating and feedback once the chat ends.

## Technology Stack

- **React v18**
- **Redux**
- **TailwindCSS**
- **tiptap**
- **TypeScript**

## Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/SunnyDhanwani/ai-chat.git
   cd ai-chat
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Environment Variables
   Create a .env file in the root directory and add the following variables:

    ```bash
    REACT_APP_BASE_URL = "https://ai-chat-webapp.api.com"
    REACT_APP_DUMMY_EMAIL = "johndoe@gmail.com"
    REACT_APP_DUMMY_PASSWORD = "12345678"
    ```

4. Running the Project

    ```bash
    npm run start
    ```

5. Authentication credentials

    ```bash
    email: johndoe@gmail.com
    password: 12345678
    ```
