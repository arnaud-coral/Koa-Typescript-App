import nodemailer from 'nodemailer';
import config from '../config/constants';

const MAILSERVER_HOST = config.mailserverHost;
const MAILSERVER_PORT = config.mailserverPort;
const MAILSERVER_USER = config.mailserverUser;
const MAILSERVER_PWD = config.mailserverPassword;
const MAILSERVER_FROM = config.mailserverFrom;

class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: MAILSERVER_HOST,
            port: MAILSERVER_PORT,
            secure: false,
            auth: {
                user: MAILSERVER_USER,
                pass: MAILSERVER_PWD,
            },
        });
    }

    async sendEmail(to: string, subject: string, text: string) {
        const mailOptions = {
            from: MAILSERVER_FROM,
            to: to,
            subject: subject,
            text: text,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}

export default new EmailService();
