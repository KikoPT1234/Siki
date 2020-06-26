const Discord = require("discord.js")
const fs = require("fs")

module.exports.run = async (client, msg, args) => {
    const at = new Discord.MessageAttachment("./memberCountGraph.png", "graph.png")
    msg.channel.send("", {
        files: [at]
    })
}

module.exports.help = {
    name: "stats",
    aliases: ["chart"],
    description: "Server Statistics",
    usage: "!stats",
    ignore: true
}