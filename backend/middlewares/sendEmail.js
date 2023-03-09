const nodeMailer = require("nodemailer");

exports.sendEmail =async(options)=>{
    
        var transporter = nodeMailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "ce95d9714d33f8",
              pass: "f659993db6c7f4"
            }
          });

        const mailOptions = {
            from:process.env.SMPT_MAIL,
            to:options.email,
            subject:options.subject,
            text:options.message
        };

        await transporter.sendMail(mailOptions);
    
};