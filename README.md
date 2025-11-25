# BootBlog

BootBlog is a command-line RSS aggregator (lovingly called gator, because it has to be in there for the CLI test) built as part of the Boot.dev backend development curriculum.  
It lets users register, follow RSS feeds, fetch posts, and browse recent content using a custom PostgreSQL-backed CLI.

## Requirements

Before running BootBlog, you’ll need:

- **Node.js** v20+  
- **npm**  
- **PostgreSQL** (a running local database)
- **Git** (optional but recommended)

This project uses:
- TypeScript
- Drizzle ORM
- postgres-js
- fast-xml-parser

## Setup

### 1. Clone the Repository

git clone https://github.com/OffDutyTaoist/BootBlog.git
cd BootBlog

2. Install Dependencies
npm install

3. Create Your Config File

BootBlog uses a configuration file in your home directory:

~/.gatorconfig.json

Create it manually:

{
  "db_url": "postgres://postgres:postgres@localhost:5432/gator?sslmode=disable"
}


Replace the connection string with your actual local PostgreSQL credentials.

This file will be updated automatically when you log in.

4. Run Database Migrations
npx drizzle-kit migrate


This will create all required tables in your gator database.

5. Start the CLI

All commands run through:

npm run start <command> [args...]

Commands Overview
register <username>

Registers a new user into the database.

Example: npm run start register eric

login <username>

Logs in the user (must already be registered).

Example: npm run start login eric

users

Prints all users, marking the current logged-in user.

npm run start users

addfeed "<name>" "<url>"

Adds a new RSS feed and automatically follows it.

npm run start addfeed "Boot.dev Blog" "https://blog.boot.dev/index.xml"

follow <feed_url>

Follow an existing feed by URL.

npm run start follow "https://news.ycombinator.com/rss"

unfollow <feed_url>

Unfollow a feed you previously followed.

npm run start unfollow "https://news.ycombinator.com/rss"

following

Lists all the feeds the current user is following.

npm run start following

feeds

Lists every feed stored in the database.

npm run start feeds

browse [limit]

Shows the most recent posts from the feeds you're following.
Defaults to 2 posts.

npm run start browse
npm run start browse 10

reset

Deletes all users, feeds, follows, and posts.
Useful during development.

npm run start reset

agg <duration>

Runs the RSS aggregator loop.
Fetches feeds continuously and stores new posts in the database.

Duration example formats:

500ms

5s

1m

1h

Example:

npm run start agg 30s


Stop with Ctrl+C.

Notes

Always ensure you run the aggregator in a separate terminal.

Avoid too-short durations when fetching feeds. Be kind to external servers.

Your config file stores only the DB URL and your current login, not passwords or feed data.

License

This project is created for educational use with Boot.dev.
Feel free to modify and extend it.
