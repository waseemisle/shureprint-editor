# Shureprint – Mini Price Tier Editor

A full-stack web application for managing product variants and their tiered pricing. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Product Management**: Browse and filter products by name and category
- **Variant Display**: View product variants with plain-English option descriptions
- **Price Tier Management**: Add, edit, and delete quantity-based pricing tiers
- **Form Validation**: Comprehensive validation for price tier inputs
- **Responsive Design**: Modern, mobile-friendly UI
- **Real-time Updates**: Instant UI updates after data changes

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Data Storage**: In-memory JSON file (easily replaceable with database)
- **Styling**: Tailwind CSS with custom components
- **Validation**: Client-side and server-side validation

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── products/      # Product endpoints
│   │   ├── variants/      # Variant endpoints
│   │   └── price-tiers/   # Price tier CRUD operations
│   ├── products/[id]/     # Product detail page
│   ├── variants/[id]/     # Variant detail with price management
│   └── page.tsx           # Home page (product list)
├── data/
│   └── seed.json          # Initial data
├── lib/
│   ├── database.ts        # Data access layer
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # TypeScript interfaces
```

## Data Model

### Product
- `id`: Unique identifier
- `name`: Product name
- `category`: Product category

### Variant
- `id`: Unique identifier
- `productId`: Reference to parent product
- `sku`: Stock keeping unit
- `options`: Key-value pairs of variant options
- `active`: Boolean status

### PriceTier
- `id`: Unique identifier
- `variantId`: Reference to parent variant
- `minQty`: Minimum quantity for this tier
- `price`: Price per unit

## API Endpoints

### Products
- `GET /api/products` - List all products (with optional name/category filters)
- `GET /api/products/[id]` - Get specific product

### Variants
- `GET /api/variants?productId=[id]` - Get variants for a product
- `GET /api/variants/[id]` - Get specific variant

### Price Tiers
- `GET /api/price-tiers?variantId=[id]` - Get price tiers for a variant
- `POST /api/price-tiers` - Create new price tier
- `PUT /api/price-tiers` - Update existing price tier
- `DELETE /api/price-tiers?id=[id]` - Delete price tier

## Key Features

### Plain-English Option Display
The app converts technical option keys and values into readable text:
- `inside_print_colors` → "Inside Print Colors"
- `"3"` → "3 Colors"
- `"yes"` → "Yes"
- `"kraft"` → "Kraft"

### Validation Rules
- Minimum quantity must be an integer ≥ 1
- Price must be > 0
- No duplicate minimum quantities per variant
- Tiers are automatically sorted by minimum quantity

### User Experience
- Loading states for all async operations
- Success/error messages with auto-dismiss
- Confirmation dialogs for destructive actions
- Responsive design for mobile and desktop
- Intuitive navigation with breadcrumbs

## Development Notes

### Tech Choices & Tradeoffs

- **Next.js App Router**: Chosen for modern React patterns and built-in API routes
- **In-memory JSON storage**: Simple for MVP, easily replaceable with database
- **Tailwind CSS**: Rapid styling with consistent design system
- **TypeScript**: Type safety and better developer experience
- **Client-side validation**: Immediate feedback, backed by server validation

### Data Storage
Currently uses an in-memory JSON file (`src/data/seed.json`). Data persists during the session but resets on server restart. For production, this would be replaced with:
- SQLite with Prisma ORM
- PostgreSQL/MySQL
- Any other database solution

### What I'd Do Next
1. **Database Integration**: Replace in-memory storage with persistent database
2. **Authentication**: Add user authentication and authorization
3. **Bulk Operations**: Import/export functionality for price tiers
4. **Advanced Filtering**: More sophisticated product and variant filtering
5. **Audit Trail**: Track changes to price tiers over time
6. **Testing**: Add comprehensive unit and integration tests
7. **Performance**: Implement caching and pagination for large datasets

## Sample Data

The app comes pre-loaded with sample data including:
- 3 products (Kraft Grocery Bag, Hot Cup 12oz, Matchbook)
- 5 variants with different options
- 5 price tiers with quantity breaks

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is for demonstration purposes.
=======
# shureprint-editor
Shureprint Mini Price Tier Editor - Full-stack app for managing product variants and tiered pricing
>>>>>>> 059e34e9e1a6fe068de40c5e16b6c8d960d980e6
