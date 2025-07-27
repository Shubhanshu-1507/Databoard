# Databoard : Data Analyst Dashboard

A comprehensive, full-stack data analysis dashboard that allows authenticated users to upload CSV datasets, explore automated analytics, and create interactive visualizations.

## 🚀 Features

### Authentication & User Management
- **User Registration & Login**: Secure authentication with Firebase Auth
- **Protected Routes**: Only authenticated users can access dashboard features
- **User Profiles**: View account information and upload history

### Data Upload & Processing
- **Drag & Drop Interface**: Intuitive CSV file upload with drag-and-drop support
- **Client-side Parsing**: Fast CSV parsing using PapaParse
- **Schema Detection**: Automatic column type inference (numeric, categorical, datetime)
- **Large File Support**: Handles large CSV files efficiently

### Automated Analytics
- **Comprehensive Statistics**: For each column, calculates:
  - **Numeric Columns**: Mean, median, mode, standard deviation, min/max, percentiles, skewness, kurtosis, outliers
  - **Categorical Columns**: Unique counts, frequency distributions, top values
  - **DateTime Columns**: Range analysis, unique dates
- **Missing Data Analysis**: Identifies and quantifies missing values
- **Correlation Matrix**: Pearson correlation coefficients for numeric columns

### Interactive Visualizations
- **Multiple Chart Types**: Histograms, bar charts, pie charts, scatter plots
- **Interactive Controls**: Toggle chart visibility, customize displays
- **Export Functionality**: Download charts as PNG images
- **Responsive Design**: Works on desktop, tablet, and mobile

### Data Export & Sharing
- **Analytics Export**: Download comprehensive statistics as JSON
- **Chart Export**: Save visualizations as high-quality PNG files
- **Data Persistence**: Store dataset metadata in Firebase Firestore

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **React Router** - Client-side routing
- **React Hot Toast** - Toast notifications

### Backend & Services
- **Firebase Authentication** - User authentication and management
- **Firebase Firestore** - NoSQL database for user data and metadata
- **Firebase Hosting** - Static site hosting (optional)

### Data Processing
- **PapaParse** - CSV parsing and streaming
- **Day.js** - Date/time manipulation
- **html2canvas** - Chart export functionality

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd data-analyst-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Get your Firebase configuration

4. **Configure environment variables**
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── DataCard.jsx    # Column statistics display
│   ├── ChartSection.jsx # Chart rendering and controls
│   ├── CorrelationMatrix.jsx # Correlation heatmap
│   ├── MissingDataPanel.jsx # Missing data analysis
│   ├── Navbar.jsx      # Navigation component
│   └── ProtectedRoute.jsx # Authentication guard
├── contexts/           # React context providers
│   ├── AuthContext.jsx # Authentication state
│   └── DataContext.jsx # Data and analytics state
├── pages/              # Page components
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Login.jsx       # Login page
│   ├── Signup.jsx      # Registration page
│   ├── Upload.jsx      # File upload page
│   └── Profile.jsx     # User profile page
├── utils/              # Utility functions
│   └── analytics.js    # Data analysis algorithms
├── config/             # Configuration files
│   └── firebase.js     # Firebase configuration
├── App.jsx             # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles
```

## 📊 Usage

### 1. Authentication
- Create an account or sign in with existing credentials
- All dashboard features require authentication

### 2. Upload Data
- Navigate to the Upload page
- Drag and drop a CSV file or click to browse
- The system will automatically process and analyze your data

### 3. Explore Analytics
- View comprehensive statistics for each column
- Examine missing data patterns
- Explore correlations between numeric columns

### 4. Create Visualizations
- Toggle different chart types for each column
- Export charts as PNG images
- Download analytics data as JSON

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- Uses ESLint for code linting
- Follows React best practices
- Consistent component structure

## 🚀 Deployment

### Firebase Hosting
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase:
   ```bash
   firebase init hosting
   ```

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

### Netlify (Alternative)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the code comments

## 🔮 Future Enhancements

- [ ] Advanced filtering and data subsetting
- [ ] Machine learning insights and predictions
- [ ] Real-time data streaming
- [ ] Collaborative dashboards
- [ ] Advanced export formats (PDF, Excel)
- [ ] Custom chart themes and styling
- [ ] Data validation and cleaning tools
- [ ] API endpoints for external data sources 