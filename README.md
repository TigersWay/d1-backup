# d1-backup (Cloudflare tools)

This script can create a SQL backup of a Cloudflare D1 SQLite database. It uses the [HTTP D1 API](https://developers.cloudflare.com/api/operations/cloudflare-d1-query-database) to query for table definitions and data, then outputs SQL commands to recreate the same database.

Based on the same idea as [Cretezy/cloudflare-d1-backup](https://github.com/Cretezy/cloudflare-d1-backup), using D1 API it's slower but doesn't need a worker.

## Usage

To run the CLI, you need:

- Your `Cloudflare account ID`.\
  This can be found as the ID in the URL on the dashboard after `dash.cloudflare.com/`, or in the sidebar as "Account ID".
- Your `Cloudflare D1 database ID`.\
  This can be found with each D1 page as "Database ID".
- And your `Cloudflare API key`.
  This can be created as an "API token" (User icon / "My Profile" / "API Tokens") with D1 write access (the CLI will never write to your database).

```bash
CLOUDFLARE_D1_ACCOUNT_ID=... CLOUDFLARE_D1_DATABASE_ID=... CLOUDFLARE_D1_API_KEY=... npx @tigersway/d1-backup
```

As you can see, the CLI supports inlined env variables, reading from an `.env` file or even passing parameters

## Restoring a backup

```bash
npx wrangler d1 execute <database> --file=<backup.sql>
```
