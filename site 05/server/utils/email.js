const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendConfirmationEmail = async (appointment) => {
  try {
    const { client, professional, service, startTime, status } = appointment;

    const statusMessages = {
      PENDING: 'pendente de confirmação',
      CONFIRMED: 'confirmado',
      COMPLETED: 'concluído',
      CANCELLED: 'cancelado'
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
          .info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
          .status { display: inline-block; padding: 5px 10px; border-radius: 3px; font-weight: bold; }
          .status.pending { background: #ffc107; color: #000; }
          .status.confirmed { background: #4CAF50; color: white; }
          .status.completed { background: #2196F3; color: white; }
          .status.cancelled { background: #f44336; color: white; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Agendamento ${statusMessages[status]}</h1>
          </div>
          <div class="content">
            <p>Olá ${client.name},</p>
            
            <div class="info">
              <h3>Detalhes do Agendamento</h3>
              <p><strong>Serviço:</strong> ${service.name}</p>
              <p><strong>Profissional:</strong> ${professional.name}</p>
              <p><strong>Data e Hora:</strong> ${new Date(startTime).toLocaleString('pt-BR')}</p>
              <p><strong>Status:</strong> <span class="status ${status.toLowerCase()}">${statusMessages[status]}</span></p>
            </div>

            ${status === 'PENDING' ? '<p>Por favor, confirme seu agendamento acessando nosso sistema.</p>' : ''}
            ${status === 'CONFIRMED' ? '<p>Seu agendamento está confirmado! Esperamos você.</p>' : ''}
            ${status === 'CANCELLED' ? '<p>Seu agendamento foi cancelado. Entre em contato conosco se precisar reagendar.</p>' : ''}

            <p>Atenciosamente,<br>Equipe de Agendamento</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Sistema de Agendamento" <${process.env.EMAIL_USER}>`,
      to: client.email,
      subject: `Agendamento ${statusMessages[status]} - ${service.name}`,
      html
    });

    console.log(`Email de confirmação enviado para ${client.email}`);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
};

const sendReminderEmail = async (appointment, hoursBefore) => {
  try {
    const { client, professional, service, startTime } = appointment;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
          .info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Lembrete de Agendamento</h1>
          </div>
          <div class="content">
            <p>Olá ${client.name},</p>
            
            <p>Este é um lembrete de que você tem um agendamento em ${hoursBefore} hora(s):</p>
            
            <div class="info">
              <h3>Detalhes do Agendamento</h3>
              <p><strong>Serviço:</strong> ${service.name}</p>
              <p><strong>Profissional:</strong> ${professional.name}</p>
              <p><strong>Data e Hora:</strong> ${new Date(startTime).toLocaleString('pt-BR')}</p>
            </div>

            <p>Esperamos você!</p>

            <p>Atenciosamente,<br>Equipe de Agendamento</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Sistema de Agendamento" <${process.env.EMAIL_USER}>`,
      to: client.email,
      subject: `Lembrete: Agendamento em ${hoursBefore}h - ${service.name}`,
      html
    });

    console.log(`Email de lembrete enviado para ${client.email}`);
  } catch (error) {
    console.error('Erro ao enviar lembrete:', error);
    throw error;
  }
};

module.exports = { sendConfirmationEmail, sendReminderEmail };

