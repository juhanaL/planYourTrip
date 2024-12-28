# Plan Your Trip

https://planyourtrip.onrender.com/

Plan Your Trip is a web service intended to help users choose a destination and plan for their next trip. The service currently includes two main functionalities:
1. **Weather map:** Choose any destination around the world on an interactive map to view the nearest webcam images and check out the current weather and local time.
2. **Trip To Do:** Plan your next trip using a reorderable to do list. The list supports drag and drop actions and autoscrolling, and is usable both on computer and touch devices. 

## Key features
1. **Responsive design:** Plan your trip is designed to work seamlessly and pleasantly on all screen sizes and orientations, using mouse or touch interface.
2. **Draggable to do items and autoscrolling:** To do items can easily, fluently and intuitively be sorted by dragging and dropping. Dynamic autoscrolling makes reordering longer lists pleasant. Drag and drop and autoscrolling works both with mouse and touch. 
3. **Token based anonymous login for Trip To Do:** JSON Web Token is used to anonymously and automatically log in users in the Trip To Do functionality, in order to securely store to do items in a database and access them later when using the same device and browser.
4. **Dynamic navigation bar:** The expandable navigation bar works seamlessly, regardless of page layout or device, both as a sidebar or a topbar.
5. **Integration of multiple external APIs and interactive Leaflet map:** The weather map functionality interactively fetches and combines information from multiple external APIs, to create an useful, interesting and fun user experience.

## Used technology
### Frontend
- React
- TypeScript
- CSS
- Vitest
- Style: Airbnb
### Backend
- Node.js
- Express
- TypeScript
- Jest
- PostgreSQL (Supabase)
- Style: Airbnb
### End-to-end testing
- Playwright
- TypeScript
### Hosting
- Render

## Local installation and running tests
### Requirements:
For full functionality a '.env' file must be created in 'planYourTrip/backend' and the following must be defined in it:
1. **PORT=YourPortHere** The port for running backend locally.
2. **WEATHER_API_KEY=YourAPIKeyHere** API key for openweathermap.org. More info at: https://openweathermap.org/appid
3. **X_WINDY_API_KEY=YourAPIKeyHere** API key for Windy Webcams API. More info at: https://api.windy.com/webcams
4. **DATABASE_URL=YourDBURLHere** Connection string for a PostgreSQL database. For Superbase DB free tier (used in project), more info here: https://supabase.com/pricing
5. **SECRET=YourSecretStringHere** Any self defined string, used for generation and validation of JSON Web Tokens.
### Frontend
In 'planYourTrip/frontend':
1. **To install dependencies:** 'npm install'
2. **To run locally:** 'npm run dev' (backend must be running locally for full functionality)
3. **To run tests:** 'npm run test'
### Backend
In 'planYourTrip/backend':
1. **To install dependencies:** 'npm install'
2. **To run in development mode locally:** 'npm run dev' (uses latest build of frontend in 'planYourTrip/backend/dist/' and production database)
3. **To run tests:** 'npm run test' (uses testing database)
4. **To build frontend and backend:** 'npm run build:full'
5. **To run in production mode locally:** 'npm run start' (uses latest build of backend and frontend in 'planYourTrip/backend/dist/' and production database)
6. **To run in testing mode locally:** 'npm run start:test' (uses testing database)
### End-to-end testing
In 'planYourTrip/e2e':
1. **To install dependencies:** 'npm install'
2. **To run Playwright tests:** First run frontend locally ('npm run dev' in 'planYourTrip/frontend') and backend locally in testing mode ('npm run start:test' in 'planYourTrip/backend'). Then 'npm run test' in 'planYourTrip/e2e'.

## Author
Juhana Laakso 
2024
