require("dotenv").config();

const Parser = require("rss-parser");
const nodemailer = require("nodemailer");

const parser = new Parser();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("PASS LENGTH:", process.env.EMAIL_PASS?.length);

const keywords = [
  "frontend",
  "front-end",
  "react",
  "javascript",
  "web developer",
  "software engineer",
  "ui developer",
];

async function main() {
  const feed = await parser.parseURL(
    "https://remoteok.com/remote-dev-jobs.rss",
  );

  const matchingJobs = [];

  feed.items.forEach((job) => {
    const title = job.title.toLowerCase();

    if (keywords.some((keyword) => title.includes(keyword))) {
      matchingJobs.push({
        title: job.title,
        link: job.link,
      });
    }
  });

  if (matchingJobs.length === 0) {
    console.log("No matching jobs found.");
    return;
  }

  const emailBody = matchingJobs
    .map((job) => `${job.title}\n${job.link}\n`)
    .join("\n------------------------\n");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Frontend Job Alert (${matchingJobs.length} jobs)`,
    text: emailBody,
  });

  console.log(`Email sent successfully! Found ${matchingJobs.length} jobs.`);
}

main().catch(console.error);
