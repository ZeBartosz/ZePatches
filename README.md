# ZePatches

ZePatches is a web application that utilises the Steam API to provide detailed information about games. Users can track events and patches for their favourite games, receive notifications about updates, and stay up-to-date with the latest news.

## Features

- **Game Details:** Retrieve detailed information about games using the Steam API.
- **Events and Patches:** View upcoming and recent events or patches for specific games.
- **Favourite Games:** Mark games as favourites to track them easily.
- **Notifications:** Get notified in real-time whenever a favourite game has new events or patches.

## Technologies Used

- **Backend:** Laravel
- **Frontend:** React with Inertia.js
- **Websockets:** Reverb for real-time notifications
- **Styling:** Tailwind CSS with motion plugin
- **Authentication:** Steam login via Laravel Socialite

## Installation

Follow these steps to get the project up and running locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/ZeBartosz/ZePatches.git
   cd ZePatches
   ```

2. Install dependencies:
   ```bash
   composer install
   npm install
   ```

3. Copy the environment configuration file:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file:
   - Set up your database credentials.
   - Add your Steam API key.
   - Configure the WebSocket broadcaster (Reverb).

5. Run the migrations:
   ```bash
   php artisan migrate
   ```

6. Start the development servers:
   ```bash
   php artisan serve
   npm run dev
   ```

## Usage

1. Open the application in your browser (default: `http://localhost:8000`).
2. Log in using your Steam account.
3. Browse games and mark your favourites.
4. Receive notifications for updates to your favourite games in real-time.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

1. Fork the repository.
2. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to your fork:
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

Feel free to reach out for any questions or feedback:
- **GitHub:** [ZeBartosz](https://github.com/ZeBartosz)

---

Enjoy tracking your games with ZePatches! 🚀
