// Express
const express = require("express");
const app = express();
app.listen(process.env.PORT);
app.get("/", (request, response) => {
  return response.send("<h1>HELLO</h1>");
});

// Package setup
const fetch = require("node-fetch");
const u = require("./utils.js");
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client({ disableEveryone: true });

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
  if (msg.content.match(/[למנסעפצקרשתםןףץאבגדהוזחטיכך]/)) msg.delete(500).then(() => msg.channel.send("No hebrew").then(m => m.delete(5000)))
  if (msg.type === "PINS_ADD" && msg.channel.name === "suggestions") return msg.delete(500);
  
  // MC Notification
  if (msg.author.id === client.user.id && msg.channel.name === "discord-and-minecraft" && msg.content.split(" ")[1] === "**Server" && msg.content.split(" ")[3] === "started**") msg.channel.send(`${msg.guild.roles.find(r => r.name === "Server")}`)
  
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;

  // Bot Chat
  if (msg.channel.name === "bot-chat") {
    if (!msg.content.startsWith(client.prefix)) {
      const message = msg.content;
      if (!message.match(/\w+/gi)) {
        msg.channel.send("Unknown caracters found in message!").then(mesg => {
          mesg.delete(10000);
          msg.delete(10000);
        });
        return;
      }
      if (message.startsWith("-")) return;
      msg.channel.startTyping();
      const r = await fetch(
        `https://some-random-api.ml/chatbot?message=${message}`
      );
      const re = await r.json();
      msg.channel.stopTyping();
      msg.channel.send(re.response);
    }
  }

  // Suggestion function
  if (msg.channel.name === "suggestions") {
    if (!msg.member.hasPermission("MANAGE_CHANNELS")) {
      msg.delete(500);
      const embed = new Discord.RichEmbed()
        .setAuthor(msg.guild.name, msg.guild.iconURL)
        .setTitle("**Suggestion**")
        .setColor("GREEN")
        .setDescription(msg.content)
        .setFooter(`Suggested By ${msg.author.tag}`, msg.author.displayAvatarURL);
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
    command.run(client, msg, args);
  } else if (client.aliases.has(cmd)) {
    command = client.commands.get(client.aliases.get(cmd));
    command.run(client, msg, args);
  }
});

// Guild Member Update event
client.on("guildMemberUpdate", (oldM, newM) => {
  if (!(newM.nickname ? newM.nickname.match(/[a-zA-Z1-9`~!@#$%^&*()_+{}|":?><,./;'\[\]=-\\'"]/) : false || newM.user.username.match(/[a-zA-Z1-9`~!@#$%^&*()_+{}|":?><,./;'\[\]=-\\'"]/))) newM.setNickname("WRITABLE NAME PLS")
})

// Guild Member Add event
client.on("guildMemberAdd", async member => {
  if (!member.user.username.match(/[a-zA-Z1-9`~!@#$%^&*()_+{}|":?><,./;'\[\]=-\\'"]/)) member.setNickname("WRITABLE NAME PLS")
  const embed = new Discord.RichEmbed()
    .setTitle("**Member Joined**")
    .setDescription(`${member.user.tag} has joined the server!`)
    .setColor("GREEN")
    .setImage(member.user.displayAvatarURL)
    .setFooter(`There are now ${member.guild.members.size} members on the server.`, member.guild.iconURL)
  member.guild.channels.find(c => c.name === "join-leave").send(embed)
  member.addRole(member.guild.roles.find(r => r.name === "Player"));
  member.guild.channels
    .find(c => c.name === "welcome")
    .send(
      `Welcome ${member} to the server! Please read the message sent above.`
    )
    .then(msg => msg.delete(30000));
});

// Guild Member Remove event
client.on("guildMemberRemove", async member => {
  const embed = new Discord.RichEmbed()
    .setTitle("**Member Left**")
    .setDescription(`${member.user.tag} has left the server!`)
    .setColor("RED")
    .setImage(member.user.displayAvatarURL)
    .setFooter(`There are now ${member.guild.members.size} members on the server.`, member.guild.iconURL)
  member.guild.channels.find(c => c.name === "join-leave").send(embed)
});

// Ready Event
client.on("ready", async () => {
  console.log(client.user.username + " is ready!");
  client.user.setActivity("the Discord Server", { type: "WATCHING" });
});

client.on("raw", packet => {
  if (!["MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE"].includes(packet.t))
    return;
  const channel = client.channels.get(packet.d.channel_id);
  if (channel.messages.has(packet.d.message_id)) return;
  channel.fetchMessage(packet.d.message_id).then(message => {
    const emoji = packet.d.emoji.id
      ? `${packet.d.emoji.name}:${packet.d.emoji.id}`
      : packet.d.emoji.name;
    const reaction = message.reactions.get(emoji);
    if (reaction)
      reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
    if (packet.t === "MESSAGE_REACTION_ADD") {
      client.emit(
        "messageReactionAdd",
        reaction,
        client.users.get(packet.d.user_id)
      );
    }
    if (packet.t === "MESSAGE_REACTION_REMOVE") {
      client.emit(
        "messageReactionRemove",
        reaction,
        client.users.get(packet.d.user_id)
      );
    }
  });
});

// Suggestions
client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.channel.name !== "suggestions") return;
  if (user.bot) return;
  reaction.message.embeds.forEach(embed => {
    if (embed.footer.text.split(" By ")[1] === user.tag) reaction.remove(user);
  });
  reaction.users = await reaction.fetchUsers();
  reaction.message.reactions.find(
    r => r.emoji.id !== reaction.emoji.id
  ).users = await reaction.message.reactions
    .find(r => r.emoji.id !== reaction.emoji.id)
    .fetchUsers();
  //console.log(reaction);
  if (reaction.users.has(user.id)) {
    if (
      reaction.message.reactions
        .find(r => r.emoji.id !== reaction.emoji.id)
        .users.has(user.id)
    )
      reaction.remove(user);
  }
  reaction.message.reactions.forEach(r => {
    if (!r.users.has(client.user.id)) reaction.message.react(r.emoji.id);
  });
  if (
    reaction.message.reactions.find(r => r.emoji.id === "613728573492166666")
      .count >=
      10 &&
    reaction.message.reactions.find(r => r.emoji.name === "no").count <=
      reaction.message.reactions.find(r => r.emoji.name === "yes").count / 2
  )
    reaction.message.pin();
  else reaction.message.unpin();
});

client.on("messageReactionRemove", async (reaction, user) => {
  if (reaction.message.channel.name !== "suggestions") return;
  if (
    reaction.message.reactions.find(r => r.emoji.id === "613728573492166666")
      .count >=
      10 &&
    reaction.message.reactions.find(r => r.emoji.name === "no").count <=
      reaction.message.reactions.find(r => r.emoji.name === "yes").count / 2
  )
    reaction.message.pin();
  else reaction.message.unpin();
});

// Roles
client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.channel.name === "roles") {
    //console.log(reaction)
    if (reaction.emoji.name === "🗓") reaction.message.guild.members.get(user.id).addRole(reaction.message.guild.roles.find(r => r.name === "Changelog"))
    if (reaction.emoji.name === "📢") reaction.message.guild.members.get(user.id).addRole(reaction.message.guild.roles.find(r => r.name === "Announcements"))
    if (reaction.emoji.name === "yes") reaction.message.guild.members.get(user.id).addRole(reaction.message.guild.roles.find(r => r.name === "Server"))
    if (reaction.emoji.name === "⚔") reaction.message.guild.members.get(user.id).addRole(reaction.message.guild.roles.find(r => r.name === "Polls"))
  }
})

client.on("messageReactionRemove", async (reaction, user) => {
  if (reaction.message.channel.name === "roles") {
    if (reaction.emoji.name === "🗓") reaction.message.guild.members.get(user.id).removeRole(reaction.message.guild.roles.find(r => r.name === "Changelog"))
    if (reaction.emoji.name === "📢") reaction.message.guild.members.get(user.id).removeRole(reaction.message.guild.roles.find(r => r.name === "Announcements"))
    if (reaction.emoji.name === "yes") reaction.message.guild.members.get(user.id).removeRole(reaction.message.guild.roles.find(r => r.name === "Server"))
    if (reaction.emoji.name === "⚔") reaction.message.guild.members.get(user.id).removeRole(reaction.message.guild.roles.find(r => r.name === "Polls"))
  }
})


// Login
client.login(process.env.TOKEN).catch(e => console.log(e));
