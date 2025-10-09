    const fs = require('fs');
    const nodemailer = require('nodemailer');
    require('dotenv').config();

    const destinationAddress = process.env.ENV_DESTINATION_ADDRESS;
    const smtpHostName = process.env.ENV_SMTP_HOST_NAME;
    const smtpPassword = process.env.ENV_SMTP_PASSWORD;
    const smtpUserName = process.env.ENV_SMTP_USERNAME;

    console.log(destinationAddress);
    console.log(smtpHostName);
    console.log(smtpPassword);
    console.log(smtpUserName);

    // Create a transporter object using your SMTP server details
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: smtpUserName,
            pass: smtpPassword
        }
    });

    // Configure email options
    var mailOptions = {
        from: '',
        to: '',
        subject: '',
        text: ''
    };

    mailOptions.from = 'Joseph Mailer <${smtpUserName}>';
    mailOptions.to= 'sebamuzzu@gmail.com';
    mailOptions.subject='new email'; 

    const filePath = 'mySyncOutput.txt';
    let fileContent = '';

    try {
        mailOptions.text = fs.readFileSync(filePath, 'utf-8');
        console.log("File content:", fileContent);
    } catch (error) {
        console.error("Error reading file:", error);
    }

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });