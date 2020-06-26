const Discord = require("discord.js");
const Minesweeper = require("discord.js-minesweeper");

module.exports.run = async (client, msg, args) => {
  const width = parseInt(args[0]) || 9;
  const height = parseInt(args[1]) || 9;
  const nOfMines = parseInt(args[2]) || 10;

  const ms = await new Minesweeper({
    rows: height,
    columns: width,
    mines: nOfMines
  });

  const matrix = await ms.start();

  return matrix
    ? msg.channel.send(matrix).catch(e => {
        console.error(e);
        msg.channel
          .send(":x: Failed to send message: **" + e + "**")
          .then(message => {
            msg.delete({ timeout: 5000 });
            message.delete({ timeout: 5000 });
          });
      })
    : msg.channel
        .send(":x: Failed to generate minesweeper based on data provided")
        .then(message => message.delete({ timeout: 5000 }));
};

module.exports.help = {
  name: "minesweeper",
  aliases: ["ms"],
  description: "Play minesweeper",
  usage: "!minesweeper [width = 9] [height = 9] [number of mines = 10]"
};
