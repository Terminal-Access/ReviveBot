const Influx = require('influx');
const influx = new Influx.InfluxDB({
 host: process.env.INFLUX_HOST,
 database: 'discord',
 schema: [
    {
      measurement: 'statistics',
      fields: {
        tag: Influx.FieldType.STRING,
        type: Influx.FieldType.STRING
      }
      tags: [
        'discord'
      ]
    }
  ]
});
module.exports = influx;