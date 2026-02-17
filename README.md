# API Documentation & Testing Interface

A professional, interactive API documentation and testing tool built with Next.js 14, inspired by Swagger UI and Postman. This application provides a beautiful, modern interface for exploring and testing the Checklist V2 API.

![API Documentation Interface](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3+-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🚀 Features

### Core Functionality
- ✅ **Interactive API Testing** - Execute real API calls directly from the browser
- ✅ **Bearer Token Authentication** - Secure authentication with localStorage persistence
- ✅ **Dynamic Request Builder** - Auto-generated forms for path/query parameters and request bodies
- ✅ **Beautiful Response Viewer** - Syntax-highlighted JSON with collapsible tree view
- ✅ **cURL Command Generation** - Copy equivalent cURL commands for any request
- ✅ **Comprehensive Documentation** - All 70+ endpoints organized by category

### UI/UX Excellence
- 🎨 **Modern Dark Theme** - Sleek gradient design with glassmorphism effects
- 🔍 **Smart Search** - Filter endpoints by name, path, or HTTP method
- 📱 **Responsive Design** - Works perfectly on desktop and tablet
- ⚡ **Fast & Smooth** - Optimized performance with smooth animations
- 🎯 **Color-Coded Methods** - Visual distinction for GET, POST, PUT, DELETE, PATCH
- 📊 **Response Metrics** - Status codes, response time, and payload size

### Developer Experience
- 🔐 **Persistent Authentication** - Token stored in localStorage across sessions
- 📝 **Request/Response History** - View previous API calls (via browser state)
- 🎛️ **Collapsible Sections** - Clean, organized interface with expandable panels
- 🚨 **Error Handling** - Clear error messages with detailed debugging info
- ⌨️ **Keyboard Shortcuts** - Enter to execute, ESC to close modals

## 📋 Prerequisites

- **Node.js** 18.17 or later
- **npm** or **yarn** package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🛠️ Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd my_swagger
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Quick Start Guide

### 1. Authenticate
- Click the **"Authorize"** button in the top-right corner
- Enter your Bearer token in the modal
- Click **"Save Token"** - your token will be stored locally
- You'll see a green **"Authenticated ✓"** badge when successful

### 2. Browse Endpoints
- Use the **left sidebar** to navigate through API categories
- Click on any category to expand and view endpoints
- Use the **search bar** to filter endpoints by name, path, or method

### 3. Test an Endpoint
- Select an endpoint from the sidebar
- Click **"Try It Out"** to expand the request builder
- Fill in required parameters (marked with red asterisk *)
- Enter query parameters and request body (for POST/PUT/PATCH)
- Click **"Execute Request"** to make the API call

### 4. View Response
- See the **status code** with color coding (green = success, red = error)
- View **response time** and **payload size**
- Inspect the **JSON response** with syntax highlighting
- Expand **Response Headers** to see all headers
- Click **"Copy Response"** to copy JSON to clipboard

### 5. Generate cURL
- Scroll down to see the **cURL Command** section
- Click **"Copy"** to copy the equivalent cURL command
- Use it in terminal or share with team members

## 📁 Project Structure

```
my_swagger/
├── app/
│   ├── components/
│   │   ├── ApiEndpointView.tsx    # Main endpoint display component
│   │   ├── AuthModal.tsx          # Authentication modal
│   │   ├── RequestBuilder.tsx     # Dynamic request form builder
│   │   ├── ResponseViewer.tsx     # Response display with syntax highlighting
│   │   └── Sidebar.tsx            # Navigation sidebar
│   ├── types/
│   │   └── api.ts                 # TypeScript interfaces
│   ├── utils/
│   │   └── apiParser.ts           # API documentation parser
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main page component
├── public/                        # Static assets
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.js             # Tailwind configuration
└── README.md                      # This file
```

## 🎨 Technology Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript 5+
- **Styling:** TailwindCSS 3+
- **HTTP Client:** Axios
- **Syntax Highlighting:** react-syntax-highlighter
- **Markdown Rendering:** react-markdown
- **Icons:** Lucide React

## 🔧 Configuration

### Base API URL
The base URL is configured in `app/page.tsx`:
```typescript
const BASE_URL = 'https://api.myproperty.devateam.com';
```

To change the API endpoint, modify this constant.

### Adding New Endpoints
Edit `app/utils/apiParser.ts` and add new endpoint definitions:
```typescript
endpoints.push({
  id: 'unique-id',
  name: 'Endpoint Name',
  method: 'GET',
  path: '/api/v2/your-endpoint',
  category: 'Category Name',
  description: 'Endpoint description',
  parameters: [
    { name: 'param', in: 'query', type: 'string', required: false }
  ],
  requestBody: { /* schema */ }
});
```

## 🚀 Production Build

To create a production-ready build:

```bash
npm run build
npm start
```

The optimized build will be available at `http://localhost:3000`

## 🎯 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🔐 Security Notes

- **Bearer tokens are stored in localStorage** - Only use this tool in secure environments
- **Never commit tokens** to version control
- **HTTPS recommended** for production deployments
- **CORS** must be configured on the API server to allow browser requests

## 🌟 Key Features Explained

### Authentication Flow
1. User clicks "Authorize" button
2. Modal opens with token input field
3. Token is saved to `localStorage` with key `bearer_token`
4. All subsequent requests include `Authorization: Bearer {token}` header
5. Token persists across page refreshes
6. User can logout to clear the token

### Request Execution
1. User fills in parameters and body
2. Path parameters replace `:param` placeholders in URL
3. Query parameters are appended as `?key=value&key2=value2`
4. Request body is parsed as JSON (for POST/PUT/PATCH)
5. Axios makes the HTTP request with proper headers
6. Response is captured with timing metrics
7. Results are displayed with syntax highlighting

### Response Display
- **Status Code:** Color-coded badge (green/yellow/orange/red)
- **Timing:** Milliseconds from request start to completion
- **Size:** Byte size of response payload
- **Headers:** Expandable section showing all response headers
- **Body:** JSON formatted with line numbers and syntax highlighting

## 🐛 Troubleshooting

### CORS Errors
If you see CORS errors in the console:
- The API server must allow requests from `http://localhost:3000`
- Contact your backend team to configure CORS headers
- Alternatively, use a CORS proxy for development

### Token Not Persisting
- Check browser localStorage in DevTools (Application → Local Storage)
- Ensure you're not in incognito/private mode
- Clear browser cache and try again

### Endpoints Not Loading
- Check the browser console for errors
- Verify `apiParser.ts` has valid endpoint definitions
- Ensure all imports are correct

## 📝 License

This project is created for internal use. All rights reserved.

## 🤝 Contributing

This is an internal tool. For improvements or bug fixes:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit for review

## 📞 Support

For issues or questions:
- Check the browser console for error messages
- Review the API documentation
- Contact the development team

---

**Built with ❤️ using Next.js, TypeScript, and TailwindCSS**
