# JubGoong Web App

A web-based shrimp weight tracking system for seafood trading businesses. This is a React TypeScript webapp conversion of the iOS JubGoong app.

## Features

- **Lot Management**: Create and manage multiple shipment lots
- **Transport Tracking**: Track multiple transports per lot
- **Basket Weight Recording**: Record individual basket weights with timestamps
- **Auto-Decimal Mode**: Convert voice-to-text input (e.g., "567" → 5.67 kg)
- **Price Calculator**: Calculate pricing with deductions
- **PDF Export**: Generate detailed reports for each lot
- **Local Storage**: All data persists in browser storage
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd jubgoong-webapp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

### Preview Production Build

```bash
npm run preview
```

## Usage

### Creating a Lot

1. Click "New Lot" on the home screen
2. The lot will be created with a default name (e.g., "Lot 1")
3. Edit the lot name and default basket weight as needed

### Adding Transports

1. Select a lot to view its details
2. Click "Add Transport" to create a new transport
3. Configure transport settings:
   - Transport name
   - Basket weight (empty basket weight)
   - Quick-add weight (for frequent weights)
   - Auto-decimal mode (converts "567" to 5.67 kg)

### Recording Basket Weights

1. Expand a transport by clicking on it
2. Use the manual input to enter specific weights
3. Or use the "Quick Add" button for preset weights
4. Enable auto-decimal mode for easier voice-to-text input

### Setting Prices

1. Expand a transport
2. Click "Set Price" in the Price Calculator section
3. Enter:
   - Price per kg (in Thai Baht)
   - Deduction percentage
4. View calculated base price, deduction, and final price

### Exporting Reports

1. View a lot's details
2. Click "Export PDF" to generate a comprehensive report
3. The PDF includes:
   - Lot summary statistics
   - All transport details
   - Individual basket listings
   - Price calculations

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **PDF Generation**: jsPDF
- **Storage**: Browser localStorage
- **Styling**: CSS3 with CSS Variables

## Data Structure

```
Lot
├── name
├── defaultBasketWeight
├── transports[]
    ├── Transport
    │   ├── name
    │   ├── basketWeight
    │   ├── pricePerKg
    │   ├── deductionPercentage
    │   └── baskets[]
    │       └── Basket
    │           ├── weight
    │           └── timestamp
```

## Data Persistence

- All data is automatically saved to browser localStorage
- Data persists between sessions
- No backend server required
- Data is stored per browser/device

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Modern browsers with ES2020 support and localStorage enabled.

## Development

### Project Structure

```
jubgoong-webapp/
├── src/
│   ├── components/      # React components
│   ├── models/          # TypeScript interfaces
│   ├── services/        # Storage & PDF services
│   ├── styles/          # CSS files
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
└── vite.config.ts       # Vite config
```

### Key Components

- **App.tsx**: Main application with state management
- **LotList.tsx**: Display all lots
- **LotDetail.tsx**: Lot details and transport management
- **TransportCard.tsx**: Individual transport with settings
- **BasketInput.tsx**: Add basket weights
- **BasketList.tsx**: Display and edit baskets
- **PriceCalculator.tsx**: Calculate pricing

## Deployment

### Static Hosting

This app can be deployed to any static hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop the `dist` folder
- **GitHub Pages**: Use the `gh-pages` branch
- **AWS S3**: Upload the `dist` folder

### Environment Variables

No environment variables required. The app runs entirely client-side.

## License

Copyright © 2025. All rights reserved.

## Support

For issues or questions, please refer to the original iOS app documentation or contact the development team.
