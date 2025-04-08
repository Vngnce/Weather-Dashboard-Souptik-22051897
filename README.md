# React Weather Dashboard

A simple web application built with React.js and Tailwind CSS that allows users to search for a city and view its current weather information using the OpenWeatherMap API.

## Live Demo

[Link to your deployed app on Vercel/Netlify will go here]

## Features

*   City search functionality
*   Display of current weather conditions:
    *   City Name & Country
    *   Temperature (°C)
    *   Feels Like Temperature (°C)
    *   Weather Condition (e.g., Clouds, Rain) & Description
    *   Humidity (%)
    *   Wind Speed (m/s)
    *   Weather Icon
*   Loading state indicator during API calls
*   User-friendly error handling for invalid cities or API issues
*   Responsive design for desktop and mobile
*   Clean UI with subtle animations

## Tech Stack

*   **Frontend:** React.js (Vite)
*   **Styling:** Tailwind CSS
*   **HTTP Client:** Axios
*   **API:** OpenWeatherMap Current Weather API
*   **Deployment:** Vercel / Netlify (Update based on your choice)

## API Integration

*   This project uses the [OpenWeatherMap Current Weather Data API](https://openweathermap.org/current).
*   A free API key is required. You can obtain one by signing up on the OpenWeatherMap website.
*   The API key must be stored in an environment variable named `VITE_OPENWEATHERMAP_API_KEY` in a `.env` file at the project root. **Do not commit your `.env` file or API key directly into the code or to Git.**
*   The free tier has limitations (e.g., 60 calls per minute).

## Setup and Installation

1.  **Clone the repository (or download the code):**
    ```bash
    # If cloning from Git:
    # git clone https://github.com/your-username/weather-dashboard.git
    # cd weather-dashboard

    # If manually creating files, ensure you are in the weather-dashboard directory
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    *   Create a `.env` file in the project root (`weather-dashboard/`).
    *   Add your OpenWeatherMap API key:
        ```
        VITE_OPENWEATHERMAP_API_KEY=YOUR_ACTUAL_API_KEY
        ```
    *   Ensure `.env` is listed in your `.gitignore` file.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should be running on `http://localhost:5173` (or another port if 5173 is busy).

5.  **Build for production:**
    ```bash
    npm run build
    ```
    This creates an optimized build in the `dist` folder.

## Deployment Instructions

**Using Vercel:**

1.  Push your code to a GitHub/GitLab/Bitbucket repository.
2.  Sign up/log in to [Vercel](https://vercel.com/).
3.  Import the repository.
4.  Configure the Project:
    *   Vercel should auto-detect Vite settings.
    *   Go to Project Settings -> Environment Variables.
    *   Add `VITE_OPENWEATHERMAP_API_KEY` with your API key as the value. Make sure it's available for Production deployments.
5.  Click Deploy.

**Using Netlify:**

1.  Push your code to a GitHub/GitLab/Bitbucket repository.
2.  Sign up/log in to [Netlify](https://netlify.com/).
3.  "Add new site" -> "Import an existing project".
4.  Configure Build Settings:
    *   Build command: `npm run build`
    *   Publish directory: `dist`
5.  Configure Environment Variables:
    *   Go to Site Settings -> Build & Deploy -> Environment -> Environment variables.
    *   Add `VITE_OPENWEATHERMAP_API_KEY` with your API key as the value.
6.  Trigger deploy.

## Screenshots (Optional)

(Add screenshots of your running application here)

## Loom Video (Optional)

(Add a link to a Loom video demonstrating the app's functionality)