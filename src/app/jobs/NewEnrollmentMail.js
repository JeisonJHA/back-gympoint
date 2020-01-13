import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Mail from '../../lib/Mail';

class NewEnrollmentMail {
  get key() {
    return 'NewEnrollmentMail';
  }

  async handle({ data }) {
    const { student, plan, price, start_date, end_date } = data;
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
  }
}

export default new NewEnrollmentMail();
