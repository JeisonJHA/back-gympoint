import Sequelize, { Model } from 'sequelize';

class Students extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        age: Sequelize.INTEGER,
        weight: Sequelize.DECIMAL,
        height: Sequelize.DECIMAL,
      },
      { sequelize }
    );
    return this;
  }
}

export default Students;
