# React Express App

A simple React.js application with Express backend that displays product listings with add to cart functionality.

## Features

- **Frontend (React)**: Modern React application with product listings and shopping cart
- **Backend (Express)**: RESTful API with product and cart endpoints
- **Responsive Design**: Mobile-friendly interface
- **Real-time Cart Updates**: Add/remove items from cart with live updates

## Project Structure

```
react-express-app/
├── backend/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductList.js
│   │   │   └── Cart.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── package.json
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd react-express-app
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

## Running the Application

### Option 1: Run both frontend and backend together
```bash
npm run dev
```

### Option 2: Run frontend and backend separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001

## API Endpoints

### Products
- `GET /api/products` - Get all products

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:productId` - Remove item from cart

## Sample Products

The app comes with two sample products:
1. **Wireless Headphones** - $99.99
2. **Smart Watch** - $199.99

## Features Overview

### Frontend Components

- **App.js**: Main application component with state management
- **ProductList.js**: Displays product cards with add to cart buttons
- **Cart.js**: Shows cart items with remove functionality

### Backend Features

- CORS enabled for cross-origin requests
- In-memory storage for cart (resets on server restart)
- RESTful API design
- Error handling for invalid requests

## Development

### Adding New Products

To add new products, edit the `products` array in `backend/server.js`:

```javascript
const products = [
  {
    id: 3,
    name: "New Product",
    price: 149.99,
    description: "Product description",
    image: "https://via.placeholder.com/300x200?text=New+Product"
  }
  // ... existing products
];
```

### Styling

The application uses CSS modules with responsive design. Main styles are in `frontend/src/App.css`.

## Troubleshooting

1. **Port conflicts**: Make sure ports 3000 and 5001 are available
2. **CORS issues**: The backend has CORS enabled, but ensure the frontend is making requests to the correct backend URL
3. **Dependencies**: Run `npm run install-all` if you encounter module not found errors

## Technologies Used

- **Frontend**: React, CSS3
- **Backend**: Node.js, Express.js
- **Development**: Concurrently (for running both servers)

## License

This project is open source and available under the MIT License.
