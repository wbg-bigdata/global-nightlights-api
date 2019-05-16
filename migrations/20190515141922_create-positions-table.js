exports.up = function (knex) {
  return knex.schema.createTable('positions', function (t) {
    t.string('id').primary();
    t.specificType('geometry', 'GEOMETRY(Point, 4326)');
    t.decimal('population', null);
    t.decimal('n_sets', null);
    t.index('geometry', 'positions_geometry_gix', 'GIST');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('positions');
};
