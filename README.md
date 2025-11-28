# TinyLink — URL Shortener (MERN)

TinyLink is a simple URL shortener built as a take-home assignment.  
It allows users to create short links, view statistics, manage links, and handle redirects with click tracking.

## 🚀 Live Demo
Frontend: https://tiny-link-url-shortner-sigma.vercel.app  
Backend API: https://tinylink-k4vl.onrender.com

---

## Features

### Core Functionality
- Create short links (POST /api/links)
- List all links (GET /api/links)
- View stats for a link (GET /api/links/:code)
- Delete a link (DELETE /api/links/:code)
- Redirect to original URL (/:code)
- Click count increments with every redirect
- /healthz endpoint for health check

### UI Features
- Clean and responsive React interface
- Error handling & form validation
- Stats page for each link
- Dashboard listing all shortened URLs

---

## Tech Stack

### Frontend
- React.js (Vite)
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- CORS enabled

---

## Project Structure

---

## API Endpoints

### Health Check
GET /healthz

### Create Link
POST /api/links  
Body example:
{
  "url": "https://google.com"
}

### Get All Links
GET /api/links

### Link Stats
GET /api/links/:code

### Delete Link
DELETE /api/links/:code

### Redirect
GET /:code → Redirects to the original URL

---

## Environment Variables

### Backend (.env)
MONGO_URI=  
PORT=5000  
BASE_URL=https://tinylink-k4vl.onrender.com  

### Frontend (.env)
VITE_API_URL=https://tinylink-k4vl.onrender.com

---

## Run Locally

### Backend
cd backend  
npm install  
npm start  

### Frontend
cd frontend  
npm install  
npm run dev  

---

## Notes
- Backend `.env` is ignored for security.
- Frontend `.env` is public because client-side apps cannot hide values.
- Both deployments (frontend + backend) are fully functional.

---

## Author
**Vikash Mishra**  
GitHub: https://github.com/Vikash-Mishra06
