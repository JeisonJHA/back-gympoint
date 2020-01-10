import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .required()
        .moreThan(0),
      price: Yup.number()
        .required()
        .moreThan(0),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const planExists = await Plan.findOne({
      where: { title: req.body.title },
    });
    if (planExists) {
      return res.status(400).json({ error: 'Plan already exists.' });
    }
    const { id, title, duration, price } = await Plan.create(req.body);
    return res.json({ id, title, duration, price });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number().moreThan(0),
      price: Yup.number().moreThan(0),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists.' });
    }
    if (req.body.title && plan.title !== req.body.title) {
      const planExists = await Plan.findOne({
        where: { title: req.body.title },
      });
      if (planExists) {
        return res
          .status(400)
          .json({ error: 'There is already a Plan with this title.' });
      }
    }
    const { id, title, duration, price } = await plan.update(req.body);
    return res.json({ id, title, duration, price });
  }

  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
    });
    return res.json(plans);
  }
}

export default new PlanController();
