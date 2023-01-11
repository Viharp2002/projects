const fs = require("fs");
const pdf = require("pdf-creator-node");
const html = fs.readFileSync("index.html", "utf8");
const nodemailer = require("nodemailer");

const genPdf = (der) => {
    var options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        header: {
            height: "80mm",
            contents: '<div style="text-align: center; font-size: 100px">Users Details</div>'
        },
        footer: {
            height: "70mm",
            contents: {
                first: 'Cover page',
                default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                last: 'Last Page'
            }
        }
    };
 
    var document = {
        html: html,
        data: {
            details: der,
        },
        path: "./output.pdf",
        type: "",
    };

    pdf.create(document, options).then((res) => {
        console.log(res);
    }).catch((error) => {
        console.error(error);
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.ADMIN_MAIL,
            pass: process.env.ADMIN_PSD
        }
    });

    const mailOptions = {
        from: 'viharp2002@gmail.com',
        to: der.mail,
        subject: der.schem,
        text: "Dear user you have resgistered in this scheme successfully.kindly check the attached pdf please",
        attachments: [
            { filename: 'output.pdf', path: './output.pdf' }
        ]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Email sent: " + info.response);
        }
    });
}

module.exports = genPdf;