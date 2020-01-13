import * as Yup from 'yup';
import { addMonths, parseISO, startOfDay, compareAsc, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Op } from 'sequelize';

import Plan from '../models/Plan';
import Student from '../models/Student';
import Enrollment from '../models/Enrollment';
import Mail from '../../lib/Mail';

class EnrollmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      student_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }
    const { plan_id, student_id, start_date } = req.body;
    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }
    const end_date = addMonths(parseISO(start_date), plan.duration);

    const existsEnrollment = await Enrollment.findOne({
      where: {
        plan_id,
        student_id,
        end_date: { [Op.gt]: start_date },
      },
    });

    if (existsEnrollment) {
      return res
        .status(400)
        .json({ error: 'This Student is already on an enrollment.' });
    }

    const price = plan.price * plan.duration;
    await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula realizada',
      template: 'newEnrollment',
      context: {
        student: student.name,
        start: format(parseISO(start_date), "'dia' dd 'de' MMMM", {
          locale: ptBR,
        }),
        end: format(end_date, "'dia' dd 'de' MMMM", {
          locale: ptBR,
        }),
        plan: plan.title,
        price,
      },
    });
    return res.json({ end_date, price });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number(),
      student_id: Yup.number(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const enrollment = await Enrollment.findByPk(req.params.id);

    const { plan_id, student_id } = req.body;
    let { start_date } = req.body;
    start_date = parseISO(start_date);

    if (
      enrollment.student_id === student_id &&
      enrollment.plan_id === plan_id &&
      compareAsc(startOfDay(enrollment.start_date), startOfDay(start_date)) ===
        0
    ) {
      return res
        .status(400)
        .json({ error: 'There is no change in the enrollment.' });
    }
    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const end_date = startOfDay(addMonths(start_date, plan.duration));

    const existsEnrollment = await Enrollment.findOne({
      where: {
        plan_id,
        student_id,
        end_date: { [Op.gt]: start_date },
      },
    });

    if (existsEnrollment && existsEnrollment.id !== enrollment.id) {
      return res
        .status(400)
        .json({ error: 'This Student is already on an enrollment.' });
    }

    const price = plan.price * plan.duration;
    await enrollment.update({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });
    return res.json({ student_id, plan_id, start_date, end_date, price });
  }

  async index(req, res) {
    const enrollment = await Enrollment.findAll({
      attributes: ['plan_id', 'student_id', 'start_date', 'end_date', 'price'],
    });
    return res.json(enrollment);
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id);
    await enrollment.destroy();
    return res.send();
  }
}

export default new EnrollmentController();
