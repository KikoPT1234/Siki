const Discord = require("discord.js")

module.exports.run = async (client, msg, args) => {
    if (args[0]) msg.channel.send(`${args[0]} is gone!`, {files: [{attachment: "https://cdn.glitch.com/751421fa-5d9b-40d6-9679-a5d6a54d2de2%2FNoisestorm%20%20Crab%20Rave%20Monstercat%20Release-arabsong-top.mp3?v=1573545494581", name: "crab-rave.mp3"}, {attachment: "https://cdn.glitch.com/751421fa-5d9b-40d6-9679-a5d6a54d2de2%2Fcr.gif?v=1573576106966", name: "crab-rave.gif"}]})
    else msg.channel.send(`Crab rave yey`, {files: [{attachment: "https://cdn.glitch.com/751421fa-5d9b-40d6-9679-a5d6a54d2de2%2FNoisestorm%20%20Crab%20Rave%20Monstercat%20Release-arabsong-top.mp3?v=1573545494581", name: "crab-rave.mp3"}, {attachment: "https://cdn.glitch.com/751421fa-5d9b-40d6-9679-a5d6a54d2de2%2Fcr.gif?v=1573576106966", name: "crab-rave.gif"}]})
}

module.exports.help = {
    name: "crabrave",
    aliases: ["cr", "crab-rave", "rave", "crab"],
    description: "Crab Rave."
}