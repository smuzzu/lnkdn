    const fs = require('fs');
    const nodemailer = require('nodemailer');
    require('dotenv').config();

    const destinationAddress = process.env.ENV_DESTINATION_ADDRESS;
    const smtpHostName = process.env.ENV_SMTP_HOST_NAME;
    const smtpPassword = process.env.ENV_SMTP_PASSWORD;
    const smtpUserName = process.env.ENV_SMTP_USERNAME;

    // Create a transporter object using your SMTP server details
    const transporter = nodemailer.createTransport({
        host: smtpHostName,
        port: 587, 
        secure: false, 
        auth: {
            user: smtpUserName,
            pass: smtpPassword
        }
    });

    // Configure email options
    var mailOptions = {
        from: smtpUserName,
        to: destinationAddress,
        subject: 'Test Email from Node.js 2',
        text: 'This is a test email sent using Nodemailer.'
    };


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