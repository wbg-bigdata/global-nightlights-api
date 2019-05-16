exports.up = function (knex) {
  return knex.schema.createTable('observations', function (t) {
    t.string('positionId');
    t.decimal('rade9', null);
    t.decimal('rad', null);
    t.timestamp('scanned_at', {useTz: false});
    t.index('positionId');
    t.index('scanned_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('observations');
};
