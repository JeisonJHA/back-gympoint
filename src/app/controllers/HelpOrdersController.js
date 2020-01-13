import * as Yup from 'yup';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

import { HelpOrders, Student, User } from '../models';
import Mail from '../../lib/Mail';

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
    await question.update({ answer, answered_at: new Date() });

    if (question.answer) {
      return res
        .status(400)
        .json({ error: 'This question was already answered.' });
    }
    const user = await User.findByPk(req.userId);
    await Mail.sendMail({
      to: `${question.Student.name} <${question.Student.email}>`,
      subject: 'Pergunta respondida',
      template: 'questionAnswered',
      context: {
        student: question.Student.name,
        user: user.name,
        answer,
        date: format(new Date(), "dd 'de' MMMM", {
          locale: ptBR,
        }),
      },
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
