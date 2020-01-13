import { Op } from 'sequelize';
import { startOfWeek, endOfWeek } from 'date-fns';

import Checkin from '../models/Checkin';

class CheckinController {
  async store(req, res) {
    const student_id = req.params.id;
    const today = new Date();
    const weekCheckins = await Checkin.findAndCountAll({
      where: {
        student_id,
        created_at: { [Op.between]: [startOfWeek(today), endOfWeek(today)] },
      },
    });
    if (weekCheckins.count >= 7) {
      return res
        .status(400)
        .json({ error: 'User has reached the maximum checkins for the week.' });
    }
    await Checkin.create({ student_id });
    return res.send();
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const student_id = req.params.id;
    const stutendCheckins = await Checkin.findAll({
      where: { student_id },
      order: ['created_at'],
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(stutendCheckins);
  }
}

export default new CheckinController();
