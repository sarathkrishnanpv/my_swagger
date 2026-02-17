# Quick Start Guide - API Documentation Interface

## 🎯 Getting Started in 3 Steps

### Step 1: Start the Server
```bash
npm run dev
```
Server will start at: **http://localhost:3000**

### Step 2: Authenticate
1. Click the **"Authorize"** button (top-right corner)
2. Enter your Bearer token
3. Click **"Save Token"**
4. Token is now stored and will be used for all requests

### Step 3: Test an Endpoint
1. Browse endpoints in the left sidebar
2. Click on any endpoint to view details
3. Click **"Try It Out"**
4. Fill in parameters
5. Click **"Execute Request"**
6. View the response!

---

## 📚 API Categories

The API is organized into 9 main categories:

1. **Checklist CRUD** - Create, read, update, delete checklists
2. **Checklist Operations** - Toggle, move, copy, reorder operations
3. **Checklist Tasks** - Manage tasks within checklists
4. **Assignment & Due Dates** - Assign members and set deadlines
5. **Checklist Reports** - Create and manage reports
6. **Report Tasks** - Manage tasks within reports
7. **Templates** - Template management and operations
8. **Groups** - Group management within templates
9. **Card APIs** - Card-specific checklist operations

---

## 🎨 UI Components

### Sidebar
- **Search Bar**: Filter endpoints by name, path, or method
- **Categories**: Expandable sections for each API category
- **Endpoint Count**: Shows number of endpoints per category
- **Color-Coded Methods**: 
  - 🔵 GET (Blue)
  - 🟢 POST (Green)
  - 🟠 PUT (Orange)
  - 🔴 DELETE (Red)
  - 🟣 PATCH (Purple)

### Request Builder
- **Path Parameters**: Required URL parameters (e.g., `:id`)
- **Query Parameters**: Optional filters and options
- **Request Body**: JSON editor for POST/PUT/PATCH requests
- **cURL Command**: Auto-generated cURL equivalent

### Response Viewer
- **Status Badge**: Color-coded HTTP status
- **Metrics**: Response time (ms) and size (bytes)
- **Headers**: Expandable response headers section
- **Body**: Syntax-highlighted JSON with line numbers
- **Copy Button**: Copy response to clipboard

---

## 🔑 Authentication Details

### How It Works
1. Token is stored in browser's `localStorage`
2. Key: `bearer_token`
3. Automatically included in all requests
4. Persists across page refreshes
5. Cleared only on logout

### Security Notes
- ⚠️ Only use in secure environments
- ⚠️ Never share your token
- ⚠️ Logout when done on shared computers

---

## 💡 Pro Tips

### Keyboard Shortcuts
- **Enter**: Execute request (when in input field)
- **ESC**: Close modal
- **Ctrl+F**: Search (browser default)

### Best Practices
1. **Test GET requests first** - They're safe and don't modify data
2. **Use example values** - Many parameters have example values pre-filled
3. **Check required fields** - Look for red asterisk (*)
4. **Copy cURL commands** - Share with team or use in scripts
5. **Monitor response times** - Identify slow endpoints

### Common Workflows

#### Testing a New Endpoint
1. Search for the endpoint name
2. Read the description and parameters
3. Fill in required parameters
4. Execute and verify response
5. Copy cURL for documentation

#### Debugging API Issues
1. Check authentication status
2. Verify all required parameters
3. Examine request body format
4. Review response status and error message
5. Check response headers for clues

#### Creating Documentation
1. Execute the request successfully
2. Copy the cURL command
3. Copy the response JSON
4. Document expected parameters
5. Share with team

---

## 🐛 Common Issues & Solutions

### Issue: "401 Unauthorized"
**Solution**: Click "Authorize" and enter a valid Bearer token

### Issue: "404 Not Found"
**Solution**: Check path parameters - ensure IDs are valid

### Issue: "400 Bad Request"
**Solution**: Verify request body JSON is valid and matches schema

### Issue: "CORS Error"
**Solution**: API server must allow requests from localhost:3000

### Issue: Token not persisting
**Solution**: Check if browser is in incognito mode or localStorage is disabled

---

## 📊 Response Status Codes

| Code Range | Color | Meaning |
|------------|-------|---------|
| 200-299 | 🟢 Green | Success |
| 300-399 | 🟡 Yellow | Redirect |
| 400-499 | 🟠 Orange | Client Error |
| 500-599 | 🔴 Red | Server Error |

---

## 🎓 Example Workflow

### Creating a Checklist

1. **Select Endpoint**: "Create Checklist" (POST /api/v2/check-lists)

2. **Fill Request Body**:
```json
{
  "name": "My New Checklist",
  "board_id": "507f1f77bcf86cd799439011",
  "board_list_id": "507f1f77bcf86cd799439012",
  "type": "BOARD_LIST",
  "description": "Test checklist"
}
```

3. **Execute**: Click "Execute Request"

4. **Verify**: Check for 200/201 status code

5. **Copy ID**: Save the returned checklist ID for future operations

### Updating a Checklist

1. **Select Endpoint**: "Update Checklist" (PUT /api/v2/check-lists/:id)

2. **Enter Path Parameter**: 
   - `id`: Use the ID from previous step

3. **Fill Request Body**:
```json
{
  "name": "Updated Checklist Name",
  "status": "COMPLETED"
}
```

4. **Execute**: Click "Execute Request"

5. **Verify**: Check response shows updated values

---

## 🚀 Advanced Features

### Filtering Endpoints
Use search to find specific endpoints:
- By name: "Create"
- By path: "/tasks"
- By method: "POST"

### Bulk Operations
Some endpoints support bulk operations:
- Bulk Reorder Checklists
- Reorder Tasks
- Reorder Groups

### Template Operations
Work with templates:
1. Create template
2. Add groups
3. Add checklists to groups
4. Apply template to cards

---

## 📞 Need Help?

- **Documentation**: Check the README.md
- **API Docs**: Review endpoint descriptions
- **Console**: Open browser DevTools for detailed errors
- **Team**: Contact your development team

---

**Happy Testing! 🎉**
