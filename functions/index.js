const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodeMailer = require('nodemailer');

exports.santaMailer = functions.region('europe-west2')
    .firestore.document('mail/{mailId}')
    .onCreate(async (snapshot, context) => {
        return new Promise(async (resolve, reject) => {
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
                    html: 'Sent to ' + params.name +
                        '(' + aOptions.to + ') at ' + new Date()
                };
                send(mailOptions, true);
            };

            const send = (mailOptions, isLast) => {
                return transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        if (!isLast) {
                            snapshot.ref.update({
                                sent: false,
                                sendTime: new Date(),
                                error: error
                            });
                        }
                        else {
                            reject(error);
                        }
                    }
                    console.log('Message %s sent: %s',
                        info.messageId,
                        info.response);
                    if (!isLast) {
                        snapshot.ref.update({
                            sent: true,
                            sendTime: new Date()
                        });
                    }
                    else {
                        resolve();
                    }
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
});
