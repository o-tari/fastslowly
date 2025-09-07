# FastSlowly - Intermittent Fasting Tracker

A comprehensive Progressive Web App (PWA) for tracking intermittent fasting with customizable protocols, detailed analytics, and offline support.

## Features

### Core Functionality
- **Fasting Timer**: Customizable protocols (16:8, 18:6, 20:4, OMAD, 5:2, custom)
- **Progress Tracking**: Visual countdown with progress ring and percentage
- **Daily Logs**: Track fasting hours, weight, hydration, mood, and notes
- **Analytics**: Charts and insights for streaks, weight change, and trends
- **Timeline View**: Historical view of all fasting sessions

### PWA & Offline Support
- **Installable**: Works on desktop and mobile devices
- **Offline Mode**: Full functionality without internet connection
- **Data Persistence**: IndexedDB and LocalStorage for robust data storage
- **Background Sync**: Automatic data synchronization when back online

### Accessibility & Customization
- **Dark/Light Mode**: Automatic theme switching
- **Accessibility Features**: High contrast, text-to-speech, reduced motion
- **Customizable Units**: Weight (kg/lbs) and temperature units
- **Notification Settings**: Configurable reminders and alerts

### Data Management
- **Export/Import**: Backup and restore your data
- **Privacy Controls**: Granular settings for data sharing
- **Safety Guidelines**: Comprehensive health disclaimers and warnings

## Tech Stack

- **Frontend**: React 18, Redux Toolkit, React Router
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for data visualization
- **PWA**: Vite PWA Plugin with service workers
- **Storage**: IndexedDB + LocalStorage for offline support
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fastslowly
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## Usage

### Starting a Fast
1. Navigate to the Timer page
2. Select your preferred fasting protocol
3. Click "Start Fasting" to begin
4. Use pause/resume controls as needed

### Logging Daily Data
1. Go to the Logs page
2. Select a date or use today's date
3. Fill in your fasting hours, weight, hydration, and mood
4. Add any notes about your experience
5. Mark as complete when finished

### Viewing Analytics
1. Visit the Analytics page
2. View your progress charts and insights
3. Track streaks, weight changes, and trends
4. Use time range filters for different periods

### Customizing Settings
1. Access the Settings page
2. Configure theme, notifications, and accessibility options
3. Set your preferred units and privacy settings
4. Manage data export/import and backup options

## Safety & Health Guidelines

⚠️ **Important**: This app is for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider before starting any fasting regimen, especially if you have existing health conditions.

### Who Should Not Fast
- Pregnant or breastfeeding women
- People with diabetes or eating disorders
- Children and adolescents under 18
- Those with certain medical conditions or medications

### Warning Signs
Stop fasting immediately if you experience:
- Severe dizziness or lightheadedness
- Extreme fatigue or weakness
- Nausea or vomiting
- Irregular heartbeat
- Severe headaches
- Fainting or loss of consciousness

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)
- UI components inspired by modern design systems
- Health guidelines based on current medical research

## Support

For support, feature requests, or bug reports, please open an issue on GitHub.

---

**Remember**: Your health and safety are the top priority. Always listen to your body and consult healthcare professionals when needed.
