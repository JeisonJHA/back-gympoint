import * as Yup from 'yup';

import QuestionAnswered from '../jobs/QuestionAnswered';
import Queue from '../../lib/Queue';
import { HelpOrders, Student, User } from '../models';

class HelpOrdersController {
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    await HelpOrders.create({
      student_id: req.params.id,
      question: req.body.question,
    });
    return res.json();
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const question = await HelpOrders.findByPk(req.params.id, {
      include: [
        {
          model: Student,
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    const { answer } = req.body;

    if (question.answer) {
      return res
        .status(400)
        .json({ error: 'This question was already answered.' });
    }

    await question.update({ answer, answered_at: new Date() });
    const user = await User.findByPk(req.userId);

    await Queue.add(QuestionAnswered.key, {
      question,
      user,
      answer,
    });

    return res.json();
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const questions = await HelpOrders.findAll({
      where: { student_id: req.params.id, answered_at: null },
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(questions);
  }
}

export default new HelpOrdersController();
