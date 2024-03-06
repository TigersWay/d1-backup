# d1-backup (Cloudflare tools) ![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/tigersway/d1-backup?style=flat-square) ![GitHub last commit](https://img.shields.io/github/last-commit/tigersway/d1-backup?style=flat-square) ![GitHub issues](https://img.shields.io/github/issues/tigersway/d1-backup?style=flat-square)

This script helps you to create a SQL backup file of a Cloudflare D1 SQLite database. Based on the same idea as [Cretezy/cloudflare-d1-backup](https://github.com/Cretezy/cloudflare-d1-backup), it uses the [HTTP D1 API](https://developers.cloudflare.com/api/operations/cloudflare-d1-query-database) to query for table definitions and data, then outputs SQL commands to allow recreation of an equivalent/same database.

This script exists because of troubles with SQLite "generated columns".

## Usage [![npm](https://img.shields.io/npm/dm/d1-backup?label=npmjs&logo=npm&style=flat-square) ![npm](https://img.shields.io/npm/dt/d1-backup?label=npmjs&logo=npm&style=flat-square)](https://www.npmjs.com/package/@tigersway/d1-backup)

To run the CLI, you need to prepare:

- Your `Cloudflare account ID`.\
  This can be found as the ID in the URL on the dashboard after `dash.cloudflare.com/`, or in the sidebar as "Account ID".
- Your `Cloudflare D1 database ID`.\
  This can be found with each D1 page as "Database ID".
- And your `Cloudflare API key`.
  This can be created as an "API token" (User icon / "My Profile" / "API Tokens") with 2 permissions: Account/D1 write access (the CLI will never write to your database) & Account.Analytics.

These keys can be set in a `.env` file or as command line parameters.

```shell
Usage: @tigersway/d1-backup [options] [file]

Cloudflare D1 SQL backup downloader.

Arguments:
  file                 file (default: "./backup.sql")

Options:
  --token <token>      Cloudflare API Token
  --account <account>  Cloudflare account ID
  --d1 <database>      Cloudflare D1 uuid
  -l,--limit <limit>   number of values in each insert (default: 100)
  -v,--version         output the version number
  -h, --help           display help for command
```

## Restoring a backup

```bash
npx wrangler d1 execute <database> --file=<backup.sql> [--local]
```
