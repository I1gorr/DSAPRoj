# City Route Optimizer 🚗🗺️

City Route Optimizer is an intelligent route planning web application that helps users determine the most efficient order in which to visit multiple locations within a city. It uses the HERE Maps API and graph-based logic to suggest routes and nearby places based on user preferences.

---

## 🌟 Features

- 🔎 Enter place names (no need for coordinates)
- 🗺️ View optimal route on interactive HERE Map
- 🍽️ Choose preferences (e.g., Restaurants, Hospitals, ATMs)
- 📍 Shows recommended POIs along the route
- 🎯 Highlights total and segment distances

---

## 🔧 Tech Stack

- HTML, CSS, JavaScript
- [HERE Maps API]
- Custom route and POI logic using Graph & Geocoding APIs

---

## 🚀 Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/DSAPRoj.git
cd DSAPRoj
```

2. **Add HERE API Key**

Open `routeOptimizer.js` and replace `YOUR_HERE_API_KEY` with your actual HERE API key:

```js
const platform = new H.service.Platform({
  apikey: 'YOUR_HERE_API_KEY'
});
```

3. **Run locally**

You can use any local HTTP server. Example using Python:

```bash
# Python 3.x
python -m http.server
```

Then open `http://localhost:8000` in your browser.

---

## 📂 Project Structure

```
├── index.html              # Main UI
├── styles.css              # Styling
├── script.js               # Input & UI handling
├── routeOptimizer.js       # Routing & HERE integration
└── README.md               # You're here
```

---

## 📌 Example Use Case

1. Type: `VIT Vellore` as start, `Marina Beach` as end
2. Choose `Restaurants` as preference
3. Click **Find Optimized Route**
4. App shows optimized route and recommended restaurants along the way

---

## 🛡️ License

This project is licensed for educational and non-commercial use.

---

