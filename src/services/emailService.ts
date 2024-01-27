import nodemailer from 'nodemailer';
import crypto from 'crypto';
import config from '../config/constants';

const MAILSERVER_HOST = config.mailserverHost;
const MAILSERVER_PORT = config.mailserverPort;
const MAILSERVER_USER = config.mailserverUser;
const MAILSERVER_PWD = config.mailserverPassword;
const MAILSERVER_FROM = config.mailserverFrom;
const VALIDATION_LINK = config.validationLink;

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

    generateEmailValidationToken() {
        const token = crypto.randomBytes(20).toString('hex');
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 24);
        return { token, expiration };
    }

    sendValidationEmail(email: string, token: string) {
        const validationLink = `${VALIDATION_LINK}${token}`;
        this.sendEmail(
            email,
            'Email Validation',
            `Please validate your email: ${validationLink}`
        );
    }
}

export default new EmailService();
