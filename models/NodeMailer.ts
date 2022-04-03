import nodemail from 'nodemailer'
import dedent from 'dedent'

export const sendEmail = async (emailAddress: string, recoveryCode: string) => {
  const mailer = nodemail.createTransport({
    host: process.env.MAILER_HOST,
    port: parseInt(process.env.MAILER_PORT),
    secure: true,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD
    }
  })

  const url = (() => {
    if (process.env.NODE_ENV === 'production') {
      return `https://abrakadabra.vercel.app/recovery?recoverycode=${recoveryCode}`
    } else {
      return `http://localhost:3000/recovery?recoverycode=${recoveryCode}`
    }
  })()

  await mailer.sendMail({
    from: process.env.MAILER_USER,
    to: emailAddress,
    subject: 'Recuperar conta do Abrakadabra',
    html: dedent(`
    <h1>Abrakadabra - Recuperação de conta</h1>
    <br/>
    <a href="${url}">
      Clique aqui para recuperar sua conta
    </a>
    `)
  })
}