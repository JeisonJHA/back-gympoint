import Sequelize from 'sequelize';

import {
  User,
  Student,
  Plan,
  Enrollment,
  Checkin,
  HelpOrders,
} from '../app/models';

import databaseConfig from '../config/database';

const models = [User, Student, Plan, Enrollment, Checkin, HelpOrders];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
