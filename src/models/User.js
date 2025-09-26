const { EntitySchema } = require('typeorm');

const User = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    email: {
      type: 'varchar',
      length: 255,
      unique: true,
      nullable: false,
    },
    password: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    role: {
      type: 'varchar',
      length: 20,
      default: 'Staff',
      nullable: false,
    },
    phone: {
      type: 'varchar',
      length: 20,
      nullable: true,
    },
    city: {
      type: 'varchar',
      length: 100,
      nullable: true,
    },
    country: {
      type: 'varchar',
      length: 100,
      nullable: true,
    },
    createdAt: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updatedAt: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
});

module.exports = User;
