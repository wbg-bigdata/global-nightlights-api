exports.up = function (knex) {
  return knex.schema.createTable('countries', function (t) {
    t.string('id').primary();
    t.string('name');
    t.string('bbox');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('countries');
};
