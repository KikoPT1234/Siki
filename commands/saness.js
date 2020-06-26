const Discord = require("discord.js")

module.exports.run = async (client, msg, args) => {
    if (args[0]) msg.channel.send(`${args.join(" ")}, WANNA HAVE A BAD TOM?`, {files: [{attachment: "https://cdn.glitch.com/751421fa-5d9b-40d6-9679-a5d6a54d2de2%2FMy%20Video.mp3?v=1573583163950", name: "saness.mp3"}, {attachment: "https://cdn.glitch.com/751421fa-5d9b-40d6-9679-a5d6a54d2de2%2FSANESS.gif?v=1573583218292", name: "saness.gif"}]})
    else msg.channel.send(`WANNA HAVE A BAD TOM?`, {files: [{attachment: "https://cdn.glitch.com/751421fa-5d9b-40d6-9679-a5d6a54d2de2%2FMy%20Video.mp3?v=1573583163950", name: "saness.mp3"}, {attachment: "https://cdn.glitch.com/751421fa-5d9b-40d6-9679-a5d6a54d2de2%2FSANESS.gif?v=1573583218292", name: "saness.gif"}]})
}

module.exports.help = {
    name: "saness",
    aliases: ["sans", "mogolovonio"],
    description: "SANESS! WANNA HAVE A BAD TOM?"
}