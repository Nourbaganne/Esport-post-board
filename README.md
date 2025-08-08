# 🎮 Esports LFG Post Board

A modern web application for gamers to find teammates and build their esports squad. Built with Next.js, Supabase, and Tailwind CSS.

## ✨ Features

### 🎯 Core Functionality
- **Create Posts**: Share your gaming preferences, rank, and region
- **Filter & Search**: Find teammates by game, role, rank, and region
- **Real-time Updates**: Live updates when new posts are created
- **User Authentication**: Secure sign-up and sign-in with Supabase Auth
- **Profile Management**: Custom usernames and user profiles

### 🎮 Gaming Features
- **Game Selection**: Support for multiple esports titles
- **Role-based Matching**: Find players for specific roles (DPS, Support, Tank, etc.)
- **Rank System**: Display and filter by player ranks
- **Regional Matching**: Connect with players in your region
- **Post Descriptions**: Detailed descriptions with 200 character limit

### 🎨 Modern UI/UX
- **Dark Theme**: Beautiful dark mode interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Engaging hover effects and transitions
- **Modern Components**: Built with Radix UI and shadcn/ui
- **Toast Notifications**: User-friendly feedback system

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Beautiful icons

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication
- **date-fns** - Date utility library

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/esport-post-board.git
cd esport-post-board
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key

#### Set Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Run Database Migrations
```bash
# If using Supabase CLI
supabase db push

# Or manually run the migration in your Supabase dashboard
# Copy the contents of supabase/migrations/20250808120903_dusty_temple.sql
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

### Tables

#### `profiles`
- `id` (UUID, PK) - References auth.users
- `username` (text, unique) - Display name
- `created_at` (timestamp) - Account creation date

#### `posts`
- `id` (UUID, PK) - Unique post identifier
- `user_id` (UUID, FK) - References profiles.id
- `game` (text) - Game title (indexed)
- `role` (text) - Player role (indexed)
- `rank` (text, nullable) - Player rank (indexed)
- `region` (text) - Server region (indexed)
- `description` (text) - Post description (max 200 chars)
- `created_at` (timestamp) - Post creation time

### Security
- Row Level Security (RLS) enabled on all tables
- Users can read all profiles and posts
- Users can only modify their own data
- Posts are linked to profiles via foreign key

### Indexes
- Individual indexes on filterable columns
- Composite index for common filter combinations
- Optimized for fast queries

## 🎯 Usage

### Creating Posts
1. Sign up or sign in to your account
2. Click "Create Post" button
3. Fill in your gaming details:
   - Select your game
   - Choose your role
   - Add your rank (optional)
   - Select your region
   - Write a description (max 200 characters)
4. Submit your post

### Finding Teammates
1. Browse posts on the homepage
2. Use filters to narrow down results:
   - Filter by game
   - Filter by region
   - Filter by rank
3. Click on posts to see details
4. Contact players through their descriptions

### Managing Your Posts
- View all your posts on the homepage
- Edit or delete your own posts
- Real-time updates when posts are modified

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Project Structure
```
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── create/            # Post creation page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── Navbar.tsx        # Navigation component
│   ├── PostCard.tsx      # Post display component
│   └── PostFilters.tsx   # Filter component
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Helper functions
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
└── supabase/             # Database migrations
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend-as-a-Service
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Happy Gaming! 🎮**
