const Discord = require('discord.js')
const Client = new Discord.Client()

/**
 * @type [string]
 */
const allowedRoles = process.env.ALLOWED_ROLES.split(',')
const botToken = process.env.BOT_TOKEN
const prefix = process.env.PREFIX

// allowed strings
const allowedString = allowedRoles.sort().map(role => `- ${role}`).join('\n')

Client.on('message', msg => {
  if (!msg.content.startsWith(prefix)
    || msg.author.bot
  ) return

  if (msg.content.startsWith(`${prefix}role`)) {

    // Get args
    const args = msg.content.split(" ");

    if (args.length < 2 || args[1] == '--help') {
      msg.channel.send(`Voilà les rôles disponibles :
${allowedString}
Tape \`${prefix}role <role_name>\` pour te l'ajouter ou te le supprimer`)

      return
    }

    // Get the role
    const role = msg.guild.roles.find(role => role.name === args[1].toLowerCase())

    if (!role || role === null) {
      msg.channel.send(`Oh oh, ce rôle n'existe pas.`)
        .then(msg => msg.delete(2000))
        .then(() => msg.delete())
      return
    }

    if (allowedRoles.indexOf(role.name) === -1) {
      msg.channel.send(`Eh, ce groupe est interdit !\nPour avoir une liste des rôles autorisés tape \`${prefix}role --help\`.`)
        .then(msg => msg.delete(2000))
        .then(() => msg.delete())
      return
    }

    const memberHasRole = msg.member.roles.find(role => role.name === args[1].toLowerCase())

    if (!memberHasRole) {
      msg.member.addRole(role).catch(console.error);
      msg.channel.send(`Tu as reçu le rôle ${role}`, {reply: msg.member})
        .then(msg => msg.delete(2000))
        .then(() => msg.delete())
    } else {
      msg.member.removeRole(role).catch(console.error);
      msg.channel.send(`Tu n'as plus le rôle ${role}`, {reply: msg.member})
        .then(msg => msg.delete(2000))
        .then(() => msg.delete())
    }

    return
  }
})

Client.on('ready', () => {
  Client.user.setActivity(`${prefix}role --help`)
  console.log(`Ready to set roles in ${Client.channels.size} channels on ${Client.guilds.size} servers, for a total of ${Client.users.size} users.`)
})

Client.on('error', e => { console.error(e) })

Client.login(botToken)
