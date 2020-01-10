import Sequelize from 'sequelize';

import { User, Student, Plan } from '../app/models';

import databaseConfig from '../config/database';

const models = [User, Student, Plan];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
