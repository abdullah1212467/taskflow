const { Worker } = require("bullmq");
const redisConnection = require("../config/redis_config");
const sendEmail = require("../utils/sendEmail.js");

const emailWorker = new Worker(
    "emailQueue",
    async (job) => {

        if (job.name === "sendVerificationEmail") {

            const { to, otp } = job.data;

            await sendEmail({
                to,
                subject: "Verify Your Email",
               html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Email Verification</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

<div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 0 15px rgba(0,0,0,.08);">

<div style="background:#2563eb;padding:25px;text-align:center;">
<h1 style="color:white;margin:0;">TaskFlow</h1>
</div>

<div style="padding:35px;">

<h2 style="color:#333;">Verify Your Email</h2>

<p style="color:#555;font-size:16px;">
Thank you for registering with <strong>TaskFlow</strong>.
Please use the verification code below to activate your account.
</p>

<div
style="
margin:30px auto;
width:220px;
text-align:center;
padding:18px;
font-size:34px;
font-weight:bold;
letter-spacing:8px;
background:#f8f9fa;
border:2px dashed #2563eb;
border-radius:8px;
color:#2563eb;
">
${otp}
</div>

<p style="color:#555;">
This OTP will expire in
<strong>5 minutes.</strong>
</p>

<p style="color:#888;font-size:14px;">
If you didn't create an account, you can safely ignore this email.
</p>

</div>

<div style="background:#f8f9fa;padding:20px;text-align:center;color:#777;font-size:13px;">
© ${new Date().getFullYear()} TaskFlow. All rights reserved.
</div>

</div>

</body>
</html>
`,
            });

            console.log("✅ Verification email sent");
        }
         if (job.name === "sendForgotPasswordEmail") {

      await sendEmail({
        to: job.data.to,
        subject: "Reset Your Password",
       html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Reset Your Password</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

<div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 0 15px rgba(0,0,0,.08);">

<div style="background:#2563eb;padding:25px;text-align:center;">
<h1 style="color:white;margin:0;">TaskFlow</h1>
</div>

<div style="padding:35px;">

<h2 style="color:#333;">Reset Your Password</h2>

<p style="color:#555;font-size:16px;">
We received a request to reset the password for your <strong>TaskFlow</strong> account.
Use the OTP below to continue.
</p>

<div
style="
margin:30px auto;
width:220px;
text-align:center;
padding:18px;
font-size:34px;
font-weight:bold;
letter-spacing:8px;
background:#f8f9fa;
border:2px dashed #2563eb;
border-radius:8px;
color:#2563eb;
">
${job.data.OTP}
</div>

<p style="color:#555;">
This OTP is valid for <strong>5 minutes</strong>.
</p>

<p style="color:#555;">
If you didn't request a password reset, you can safely ignore this email.
Your password will remain unchanged.
</p>

<div style="margin-top:30px;padding:15px;background:#fff8e1;border-left:4px solid #f59e0b;border-radius:5px;">
<p style="margin:0;color:#555;font-size:14px;">
🔒 <strong>Security Tip:</strong> Never share this OTP with anyone. The TaskFlow team will never ask you for your verification code.
</p>
</div>

</div>

<div style="background:#f8f9fa;padding:20px;text-align:center;color:#777;font-size:13px;">
© ${new Date().getFullYear()} TaskFlow. All rights reserved.
</div>

</div>

</body>
</html>
`
      });
    //   job.data.otp

      console.log("✅ Forgot password email sent");
    }

    },
    {
        connection: redisConnection,
    }
);

module.exports = emailWorker;