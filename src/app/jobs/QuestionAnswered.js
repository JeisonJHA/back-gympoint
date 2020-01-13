import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Mail from '../../lib/Mail';

class QuestionAnswered {
  get key() {
    return 'QuestionAnswered';
  }

  async handle({ data }) {
    const { question, user, answer } = data;
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
  }
}

export default new QuestionAnswered();
