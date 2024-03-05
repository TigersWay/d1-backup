const { yellow } = require('picocolors');
const { writeFileSync } = require('node:fs');

module.exports = async (options) => {
  const url = `https://api.cloudflare.com/client/v4/accounts/${options.account}/d1/database/${options.d1}`;

  const callAPI = async (api = '', method = 'GET', body = null) => {
    try {
      return await fetch(`${url}${api ? `/${api}` : ''}`, {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${options.token}`
        },
        method,
        body
      })
        .then((response) => response.json())
        .then((response) => response.result);
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  };

  const append = (line = '', flag = 'a') => writeFileSync(options.file, line + '\n', { flag });

  const quoted = (o) =>
    Object.values(o)
      .map((v) => (typeof v === 'string' ? `'${v.replaceAll(`'`, `''`)}'` : v == null ? 'null' : v))
      .join(',');

  const infos = await callAPI();
  console.log(
    `D1: name: ${yellow(infos.name)} | region: ${yellow(infos.running_in_region)} | size: ${yellow(
      (infos.file_size / 1000000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    )} MB`
  );

  const tables = (
    await callAPI(
      'query',
      'POST',
      JSON.stringify({
        sql: "SELECT name, sql FROM sqlite_master WHERE type = 'table' AND sql IS NOT NULL ORDER BY rootpage",
        params: []
      })
    )
  ).shift().results;

  append(`-- ${infos.name} Backup: ${new Date().toISOString()} --\n`, 'w');

  for (const table of tables) {
    if (table.name.startsWith('_cf_') || table.name.startsWith('sqlite_'));
    else {
      process.stdout.write(table.name + ' ');

      append(`DROP TABLE IF EXISTS "${table.name}";`);
      append(`${table.sql};`);

      const columns = (
        await callAPI(
          'query',
          'POST',
          JSON.stringify({
            sql: `PRAGMA table_info("${table.name}")`,
            params: []
          })
        )
      )
        .shift()
        .results.map((e) => e.name);
      const values = (
        await callAPI(
          'query',
          'POST',
          JSON.stringify({
            sql: `SELECT "${columns.join('","')}" FROM "${table.name}"`,
            params: []
          })
        )
      ).shift().results;

      while (values.length) {
        const tmpValues = values.splice(0, options.limit);
        append(`INSERT INTO "${table.name}" ("${columns.join('","')}") VALUES`);
        tmpValues.forEach((value, index, array) => append(`\t(${quoted(value)})${index < array.length - 1 ? ',' : ';'}`));
        process.stdout.write('.');
      }

      append('\n');
      console.log();
    }
  }
  append(`DELETE FROM sqlite_sequence;`); // Should always exist in any populated D1 database
};
