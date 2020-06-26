// Express
const express = require("express");
const app = express();
app.listen(process.env.PORT);
app.get("/", (request, response) => {
  //client.login(process.env.TOKEN)
  return response.send("<h1>HELLO</h1>");
});

// MySQL
const mysql = require("mysql2")
const connection = mysql.createPool({
  user: "GM5DQI3hct",
  database: "GM5DQI3hct",
  password: process.env.DBPASS,
  host: "remotemysql.com"
})

module.exports.connection = connection

// Package setup
const fetch = require("node-fetch");
const u = require("./utils.js");
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client({ disableEveryone: true });
let webhook;

// Command handler
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./commands", (err, files) => {
  if (!files) return console.log("There are no files to load...");
  const jsfiles = files.filter(f => f.split(".").pop() === "js");
  jsfiles.forEach((file, index) => {
    const props = require(`./commands/${file}`);
    console.log(`${file} loaded!`);
    client.commands.set(props.help.name, props);
    if (props.help.aliases)
      props.help.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
  });
});

// Defining the prefix
client.prefix = "!";

// Message event
client.on("message", async msg => {
  if (msg.type === "PINS_ADD" && msg.channel.name === "suggestions")
    return msg.delete(500);

  // MC Notification
  if (
    msg.author.id === client.user.id &&
    msg.channel.name === "discord-and-minecraft" &&
    msg.content.split(" ")[1] === "**Server" &&
    msg.content.split(" ")[3] === "started**"
  )
    msg.channel.send(`${msg.guild.roles.cache.find(r => r.name === "Server")}`);

  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;

  // Bot Chat
  if (msg.channel.name === "bot-chat") {
    if (!msg.content.startsWith(client.prefix)) {
      const message = msg.content;
      /*if (!message.match(/\w+/gi)) {
        msg.channel.send("Unknown caracters found in message!").then(mesg => {
          mesg.delete(10000);
          msg.delete(10000);
        });
        return;
      }*/
      if (message.startsWith("-")) return;
      msg.channel.startTyping();
      const r = await fetch(
        encodeURI(`https://acobot-brainshop-ai-v1.p.rapidapi.com/get?bid=178&key=sX5A2PcYZbsN5EY6&uid=mashape&msg=${message}`),
        {
          headers: {
            "Content-Type": "application/json",
            "x-rapidapi-host": "acobot-brainshop-ai-v1.p.rapidapi.com",
	          "x-rapidapi-key": "2e55a127a2msh9292691d1821a35p19c403jsnf6732d176f6b"
          }
        }
      );
      const re = await r.json().catch(e => {
        msg.channel.stopTyping()
        msg.channel.send("There was an error while fetching the response from the message: " + message)
      });
      msg.channel.stopTyping();
      msg.channel.send(re.cnt, {tts: true});
    }
  }

  // Suggestion function
  if (msg.channel.name === "suggestions") {
    let wantsToSuggest = true;
    if (msg.member.hasPermission("MANAGE_CHANNELS")) {
      if (!msg.content.startsWith("!suggest ")) {
        wantsToSuggest = false;
      } else {
        msg.content = msg.content.substring(9, msg.content.length);
        if (msg.content.length === 0) wantsToSuggest = false;
      }
    }
    if (wantsToSuggest) {
      msg.delete({timeout: 500});
      const embed = new Discord.MessageEmbed()
        .setAuthor(msg.guild.name, msg.guild.iconURL({format: "png"}))
        .setTitle("**Suggestion**")
        .setColor("GREEN")
        .setDescription(msg.content)
        .setFooter(
          `Suggested By ${msg.author.tag}`,
          msg.author.displayAvatarURL({format: "png"})
        );
      await msg.channel.send(embed).then(async message => {
        await message.react("613728573492166666");
        await message.react("613729322108452868");
      });
    }
  }

  if (!msg.content.startsWith(client.prefix)) return;

  // Command Runner
  const args = msg.content
    .slice(client.prefix.length)
    .trim()
    .split(" ");
  const cmd = args.shift().toLowerCase();
  let command;
  if (client.commands.has(cmd)) {
    command = client.commands.get(cmd);
    command.run(client, msg, args).catch(e => {
      console.log(e)
      msg.channel.send("There was an error, please contact the bot creator if the issue persists")
      msg.delete({timeout: 500})
    });
  } else if (client.aliases.has(cmd)) {
    command = client.commands.get(client.aliases.get(cmd));
    command.run(client, msg, args).catch(e => {
      console.log(e)
      msg.channel.send("There was an error, please contact the bot creator if the issue persists")
      msg.delete({timeout: 500})
    });
  }
});

// Guild Member Update event
client.on("guildMemberUpdate", (oldM, newM) => {
  if (
    !(newM.nickname
      ? newM.nickname.match(/[a-zA-Z1-9`~!@#$%^&*()_+{}|":?><,./;'\[\]=-\\'"]/)
      : false ||
        newM.user.username.match(
          /[a-zA-Z1-9`~!@#$%^&*()_+{}|":?><,./;'\[\]=-\\'"]/
        ))
  )
    newM.setNickname("WRITABLE NAME PLS");
});

// Guild Member Add event
client.on("guildMemberAdd", async member => {
  if (
    !member.user.username.match(
      /[a-zA-Z1-9`~!@#$%^&*()_+{}|":?><,./;'\[\]=-\\'"]/
    )
  )
    member.setNickname("WRITABLE NAME PLS");
  const embed = new Discord.MessageEmbed()
    .setTitle("**Member Joined**")
    .setDescription(`${member.user.tag} has joined the server!`)
    .setColor("GREEN")
    .setImage(member.user.displayAvatarURL({format: "png"}))
    .setFooter(
      `There are now ${member.guild.members.cache.size} members on the server.`,
      member.guild.iconURL({format: "png"})
    );
  member.guild.channels.cache.find(c => c.name === "join-leave").send(embed);
  member.roles.add(member.guild.roles.cache.find(r => r.name === "Player"));
  member.guild.channels.cache
    .find(c => c.name === "welcome")
    .send(
      `Welcome ${member} to the server! Please read the message sent above.`
    )
    .then(msg => msg.delete({timeout: 30000}));
});

// Guild Member Remove event
client.on("guildMemberRemove", async member => {
  const embed = new Discord.MessageEmbed()
    .setTitle("**Member Left**")
    .setDescription(`${member.user.tag} has left the server!`)
    .setColor("RED")
    .setImage(member.user.displayAvatarURL({format: "png"}))
    .setFooter(
      `There are now ${member.guild.members.cache.size} members on the server.`,
      member.guild.iconURL({format: "png"})
    );
  member.guild.channels.cache.find(c => c.name === "join-leave").send(embed);
});

// Ready Event
client.on("ready", async () => {

  member()
  setInterval(member, 1800000)
  
  client.channels.cache.get("685797705746087997").send("restart")

  console.log(" ")
  console.log("" + client.user.username + " is ready!");
  console.log(" ")

  client.user.setActivity("the Discord Server", { type: "WATCHING" });
});

client.on("raw", packet => {
  if (!["MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE"].includes(packet.t))
    return;
  const channel = client.channels.cache.get(packet.d.channel_id);
  if (channel.messages.cache.has(packet.d.message_id)) return;
  channel.messages.fetch(packet.d.message_id).then(message => {
    const emoji = packet.d.emoji.id
      ? `${packet.d.emoji.name}:${packet.d.emoji.id}`
      : packet.d.emoji.name;
    const reaction = message.reactions.cache.find(r => r.emoji.id === packet.d.emoji.id);
    if (reaction) {
      reaction.users = new Discord.ReactionUserManager(client, null, reaction)
      reaction.users.cache = new Discord.Collection()
      reaction.users.cache.set(packet.d.user_id, client.users.cache.get(packet.d.user_id));
    }
    if (packet.t === "MESSAGE_REACTION_ADD") {
      client.emit(
        "messageReactionAdd",
        reaction,
        client.users.cache.get(packet.d.user_id)
      );
    }
    if (packet.t === "MESSAGE_REACTION_REMOVE") {
      client.emit(
        "messageReactionRemove",
        reaction,
        client.users.cache.get(packet.d.user_id)
      );
    }
  });
});

// Suggestions
client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.channel.name !== "suggestions") return;
  if (user.bot) return;
  reaction.message.embeds.forEach(embed => {
    if (embed.footer.text.split(" By ")[1] === user.tag) reaction.users.remove(user);
  });
  reaction.users.cache = await reaction.users.fetch();
  reaction.message.reactions.cache.find(
    r => r.emoji.id !== reaction.emoji.id
  ).users.cache = await reaction.message.reactions.cache
    .find(r => r.emoji.id !== reaction.emoji.id)
    .users.fetch();
  if (reaction.users.cache.has(user.id)) {
    if (
      reaction.message.reactions.cache
        .find(r => r.emoji.id !== reaction.emoji.id)
        .users.cache.has(user.id)
    )
      reaction.users.remove(user);
  }
  reaction.message.reactions.cache.forEach(r => {
    if (!r.users.cache.has(client.user.id)) reaction.message.react(r.emoji.id);
  });
  if (
    reaction.message.reactions.cache.find(r => r.emoji.id === "613728573492166666")
      .count >= 10 &&
    reaction.message.reactions.cache.find(r => r.emoji.name === "no").count <=
      reaction.message.reactions.cache.find(r => r.emoji.name === "yes").count / 2
  )
    reaction.message.pin();
  else reaction.message.unpin();
});

client.on("messageReactionRemove", async (reaction, user) => {
  if (reaction.message.channel.name !== "suggestions") return;
  if (
    reaction.message.reactions.cache.find(r => r.emoji.id === "613728573492166666")
      .count >= 10 &&
    reaction.message.reactions.cache.find(r => r.emoji.name === "no").count <=
      reaction.message.reactions.cache.find(r => r.emoji.name === "yes").count / 2
  )
    reaction.message.pin();
  else reaction.message.unpin();
});

// Roles
client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.channel.name === "roles") {
    //console.log(reaction)
    if (reaction.emoji.name === "🗓")
      reaction.message.guild.members.cache
        .get(user.id)
        .roles.add(
          reaction.message.guild.roles.cache.find(r => r.name === "Changelog")
        );
    if (reaction.emoji.name === "📢")
      reaction.message.guild.members.cache
        .get(user.id)
        .roles.add(
          reaction.message.guild.roles.cache.find(r => r.name === "Announcements")
        );
    if (reaction.emoji.name === "yes")
      reaction.message.guild.members.cache
        .get(user.id)
        .roles.add(reaction.message.guild.roles.cache.find(r => r.name === "Server"));
    if (reaction.emoji.name === "⚔")
      reaction.message.guild.members.cache
        .get(user.id)
        .roles.add(reaction.message.guild.roles.cache.find(r => r.name === "Polls"));
  }
});

client.on("messageReactionRemove", async (reaction, user) => {
  if (reaction.message.channel.name === "roles") {
    if (reaction.emoji.name === "🗓")
      reaction.message.guild.members.cache
        .get(user.id)
        .roles.remove(
          reaction.message.guild.roles.cache.find(r => r.name === "Changelog")
        );
    if (reaction.emoji.name === "📢")
      reaction.message.guild.members.cache
        .get(user.id)
        .roles.remove(
          reaction.message.guild.roles.cache.find(r => r.name === "Announcements")
        );
    if (reaction.emoji.name === "yes")
      reaction.message.guild.members.cache
        .get(user.id)
        .roles.remove(
          reaction.message.guild.roles.cache.find(r => r.name === "Server")
        );
    if (reaction.emoji.name === "⚔")
      reaction.message.guild.members.cache
        .get(user.id)
        .roles.remove(
          reaction.message.guild.roles.cache.find(r => r.name === "Polls")
        );
  }
});

// Login
client.login(process.env.TOKEN).catch(console.error)

function member() {
  let date = new Date()
  date = new Date(date.getTime() - 86400000)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  date.setHours(0)
  connection.query("SELECT * FROM `Member Count`", (error, results, fields) => {
    if (error) return console.log(error)
    if (results.filter(r => r.Date === date.getTime()).length === 0) {
      return connection.query(`INSERT INTO \`Member Count\` (Date, Count) VALUES (${date.getTime()}, ${client.guilds.cache.get("570888169575153694").members.cache.size})`, () => {
        const chart = require("./chart.js")
        chart()
        .then(() => {
          console.log("Chart Updated")
        })
        .catch(console.log)
      })
    }
    const chart = require("./chart.js")
    chart()
    .then(() => {
      console.log("Chart Loaded")
    })
    .catch(console.log)
  })
}