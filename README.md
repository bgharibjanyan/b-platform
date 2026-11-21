This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## MySQL database

B Platform uses MySQL 8.4 for its CMS. Run these commands from Debian WSL with Node.js 22.15 or later and Docker Compose.

~~~sh
# If no .env.local exists yet, copy .env.example and set MYSQL_PASSWORD and DATABASE_URL.
docker compose --env-file .env.local up -d --wait mysql
npm ci
npm run dev
~~~

The Compose service provisions the b_platform schema and its application account on a persistent volume. If you already have a MySQL server, set DATABASE_URL to that server instead. URL-encode special characters in the password portion of DATABASE_URL.

Run npm run db:init to apply the schema and install the BFO Consulting and Arpharma pages without starting Next.js. On a fresh database the URLs are /1/ and /3/. The update uses existing company URLs when it finds matching records, retains previous revisions, and archives the old sample page. Later starts preserve edits made in the CMS. When the MySQL database has no company records, initialization imports the existing .data/b-platform.sqlite file if present. It copies revision history, drafts, published pages, and their related records in one transaction. The source file stays available as a backup.

Use npm run db:import-sqlite to require a SQLite import into an empty target. Set B_PLATFORM_LEGACY_SQLITE_PATH for a different source file. Stop the old SQLite app before importing so its latest saved drafts are included.

| Tables | Relationship |
| --- | --- |
| `subscription_plans`, `companies` | Each company has a plan. |
| `cms_block_types` | Each CMS block type has a minimum plan. |
| `cms_revisions`, `cms_company_heads` | Each company owns a history of revisions. Its current editor and published revisions are tracked independently. |
| `cms_pages` | Each revision has Armenian, English, and Russian page records. |
| `cms_blocks`, `cms_navigation_links`, `cms_footer_links` | Each language page owns ordered blocks, navigation links, and footer links. Block content and settings use JSON fields for the different block types. |
| `schema_migrations` | Records the SQL migrations applied to this database file. |

Save draft and Submit for review each write a MySQL revision in one transaction. The public page reads the approved revision. An editor with an older database version must reload before saving again.

For a Node.js deployment, set DATABASE_URL and B_PLATFORM_ADMIN_PASSWORD on the server. The admin username is admin. The current Sites manifest describes a static preview, so it does not run this MySQL-backed Next.js server.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
