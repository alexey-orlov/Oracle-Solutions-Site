// n8n Code node "Deployment settings". Everything specific to one installation of
// the sender lives here and nowhere in the shared repo (mail/README.md,
// "Deployment"): the repository it reads, its From identity, its test inbox and
// where failures are reported. The repo ships this file with placeholders; the
// running workflow holds the real values, and a code update never overwrites it.
return [{
  json: {
    repo: "OWNER/REPOSITORY",          // the site repository on GitHub, read through the GitHub read credential
    ref: "main",                       // the branch the sender reads
    fromName: "Sender name",           // the From line's display name
    fromAddress: "sender@example.com", // must be the mailbox the send credential signs in as
    testInbox: "tester@example.com",   // test mode: every practice notice and every kit reply goes here
    alertChatId: "TELEGRAM_CHAT_ID"    // where failures are reported; the Telegram credential's bot must be in that chat
  }
}];
