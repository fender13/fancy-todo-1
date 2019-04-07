const nodemailer = require('nodemailer')
const ENV = require('dotenv')
ENV.config()

var transport = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  auth: {
    user: process.env.EMAIL_SERVER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    ciphers:'SSLv3'
  }
})

module.exports = (req, res) => {
  const dataUser = req.dataUser
  const projectDetail = req.dataProject

  let mailOptions = {
    from: `"Fancy-ToDo 👻" <${process.env.EMAIL_SERVER}>`, // sender address
    to: `${dataUser.email}`, // list of receivers
    subject: "Hello ✔", // Subject line
    // text: "Hello world?", // plain text body
    html: `<p style="text-align: center;"><strong>My Fancy ToDo</strong></p>
    <p>&nbsp;</p>
    <p>Dear ${dataUser.username}</p>
    <p>${projectDetail.ProjectOwner.username} mengajak anda bergabung untuk enyelesaikan Project ${projectDetail.projectName}.</p>
    <p>Jika bersedia harap untuk melakukan click untuk link di bawah ini:</p>
    <p>&nbsp;</p>
    <p style="text-align: center;"><a href=http://localhost:3000/projects/${projectDetail._id}/${dataUser._id}>Click Here to Accept Invitation</a></p>
    <p>&nbsp;</p>
    <p><span style="color: #212121; font-family: 'Segoe UI', 'Segoe UI Web (West European)', 'Segoe UI', -apple-system, system-ui, Roboto, 'Helvetica Neue', sans-serif; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: #ffffff; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">Sincerely,</span><br style="-webkit-font-smoothing: antialiased; color: #212121; font-family: 'Segoe UI', 'Segoe UI Web (West European)', 'Segoe UI', -apple-system, system-ui, Roboto, 'Helvetica Neue', sans-serif; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: #ffffff; text-decoration-style: initial; text-decoration-color: initial;" /><br style="-webkit-font-smoothing: antialiased; color: #212121; font-family: 'Segoe UI', 'Segoe UI Web (West European)', 'Segoe UI', -apple-system, system-ui, Roboto, 'Helvetica Neue', sans-serif; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: #ffffff; text-decoration-style: initial; text-decoration-color: initial;" /><span style="color: #212121; font-family: 'Segoe UI', 'Segoe UI Web (West European)', 'Segoe UI', -apple-system, system-ui, Roboto, 'Helvetica Neue', sans-serif; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: #ffffff; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">My Fancy ToDo Support</span></p>` // html body
  }

  return transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({
        message: error.message
      })
    } else {
      res.status(200).json({
        message: `Pesan Berhasil Dikirim`, info
      })
    }
  })
}