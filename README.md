# Air Quality Index App 🌤️

A beautiful, real-time air quality monitoring application built with Next.js that provides comprehensive air quality data and weather information for cities worldwide.

[Air Quality App Screenshot](https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?q=80&w=800&auto=format&fit=crop)

## ✨ Features

- **Real-time Air Quality Data**: Get up-to-date AQI values and pollution levels
- **Weather Information**: Temperature, humidity, wind speed, and visibility
- **Detailed Pollutant Breakdown**: PM2.5, PM10, NO₂, O₃, CO, and SO₂ levels
- **Color-coded AQI Scale**: Visual indicators for air quality levels (Good to Hazardous)
- **Beautiful UI**: Glassmorphism design with backdrop blur effects
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Global Coverage**: Search for any city worldwide
- **Error Handling**: User-friendly error messages and loading states

## 🚀 Technologies Used

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling and responsive design
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API requests
- **OpenWeatherMap API** - Weather and air quality data

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **OpenWeatherMap API Key** (free account required)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/air-quality-app.git
   cd air-quality-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Get OpenWeatherMap API Key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Go to "My API Keys" section
   - Copy your API key (may take up to 2 hours to activate)

4. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_WEATHER_KEY=your_openweathermap_api_key_here
   ```
   
   **Important**: Replace `your_openweathermap_api_key_here` with your actual API key

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌍 Usage

1. **Search for a city**: Enter any city name in the search bar
2. **View results**: Get instant air quality and weather data
3. **Understand AQI levels**:
   - 🟢 **Good (0-50)**: Air quality is satisfactory
   - 🟡 **Moderate (51-100)**: Acceptable for most people
   - 🟠 **Unhealthy for Sensitive Groups (101-150)**: Sensitive individuals may experience problems
   - 🔴 **Unhealthy (151-200)**: Everyone may experience problems
   - 🟣 **Very Unhealthy (201-300)**: Health alert for everyone
   - 🔴 **Hazardous (301+)**: Emergency conditions

## 📁 Project Structure

```
air-quality-app/
├── app/
│   ├── page.tsx          # Main application component
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Global styles
│   └── favicon.ico       # App icon
├── public/               # Static assets
├── .env.local           # Environment variables (create this)
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
├── next.config.js       # Next.js configuration
└── README.md           # Project documentation
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_WEATHER_KEY` | OpenWeatherMap API key | Yes |

### API Endpoints Used

- **Geocoding API**: Convert city names to coordinates
- **Air Pollution API**: Get air quality data
- **Current Weather API**: Get weather information

## 🎨 Customization

### Changing the Background Image

Replace the Unsplash image URL in `page.tsx`:
```jsx
<Image
  src="your-custom-background-image-url"
  alt="Air quality"
  // ... other props
/>
```

### Modifying Colors

The app uses Tailwind CSS. Update colors in the component or modify the Tailwind config:
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Add your custom colors
      }
    }
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **"City not found" error**
   - Check spelling of city name
   - Try full city name or "City, Country" format
   - Ensure API key is valid and activated

2. **API key errors**
   - Verify `.env.local` file exists and has correct format
   - Restart development server after adding API key
   - Check if API key is activated (can take up to 2 hours)

3. **Can't scroll the page**
   - This was fixed by changing `overflow-hidden` to `overflow-auto`
   - Clear browser cache if issue persists

4. **Data not displaying**
   - Check browser console for API errors
   - Verify network connectivity
   - Ensure API key has proper permissions

### Debug Mode

Enable detailed logging by checking the browser console. The app logs:
- API requests and responses
- Geocoding results
- Error details

## 📱 Responsive Design

The app is fully responsive and works on:
- 📱 **Mobile phones** (320px and up)
- 📱 **Tablets** (768px and up)
- 💻 **Desktops** (1024px and up)
- 🖥️ **Large screens** (1440px and up)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `out` folder to Netlify
3. Add environment variables in Netlify dashboard

### Environment Variables for Production

Remember to add your environment variables to your hosting platform:
- `NEXT_PUBLIC_WEATHER_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather and air quality APIs
- [Unsplash](https://unsplash.com/) for the beautiful background images
- [Lucide](https://lucide.dev/) for the clean and modern icons
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [OpenWeatherMap API documentation](https://openweathermap.org/api)
3. Open an issue on GitHub

---

**Made with ❤️ by [Sana Fathima]**

*Stay informed about air quality and protect your health!*
