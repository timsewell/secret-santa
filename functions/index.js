const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodeMailer = require('nodemailer');

exports.santaMailer = functions.region('europe-west2')
    .firestore.document('mail/{mailId}')
    .onCreate(async (snapshot, context) => {
        const params = snapshot.data();

        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'thesecretsantamachine@gmail.com',
                pass: 'sxpegwroxxxkvxcy'
            }
        });

        const sendConfirmation = (aOptions) => {
            let mailOptions = {
                to: 'sewell.tim@gmail.com',
                subject: 'Secret Santa message sent',
                html: 'Sent to ' + params.name + '(' + aOptions.to + ') at ' + new Date()
            };
            send(mailOptions);
        };

        const send = (mailOptions) => {
            return transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    snapshot.ref.update({
                        sent: false,
                        sendTime: new Date(),
                        error: error
                    });
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
                snapshot.ref.update({
                    sent: true,
                    sendTime: new Date()
                });
            });
        };

        let mailOptions = {
            to: params.to,
            subject: params.message.subject,
            html: params.message.html,
            text: params.message.text
        };
        await send(mailOptions);
        sendConfirmation(mailOptions);
});
