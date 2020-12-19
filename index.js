require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

const TOKEN = process.env.TOKEN;

bot.on('ready', async (client) => {
    console.info(`Logged in as ${bot.user.tag}!`);
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function MsgAlert(pubsubMessage) {
    try {
        const responseEmbed = new Discord.MessageEmbed()
            .setColor("#ff0f0f")
            .setTitle(`${process.env.GCPPROJECT} GCP Budget Alert`)
            .setDescription(`<@${process.env.GCPADMIN}> Check your GCP Console, Potential DDOS/Unknown Costs Overruns! **[View GCP Console](${process.env.GCPCONSOLEURL})**`)
            .addFields(
                { name: 'BudgetDisplayName', value: (pubsubMessage.budgetDisplayName) ? pubsubMessage.budgetDisplayName : 'None' },
                { name: 'alertThresholdExceeded', value: (pubsubMessage.alertThresholdExceeded) ? `${pubsubMessage.alertThresholdExceeded * 100}%` : 'None' },
                { name: 'costAmount', value: (pubsubMessage.costAmount) ? `$${pubsubMessage.costAmount}` : 'None' },
                { name: 'costIntervalStart', value: (pubsubMessage.costIntervalStart) ? pubsubMessage.costIntervalStart : 'None' },
                { name: 'budgetAmount', value: (pubsubMessage.budgetAmount) ? `$${pubsubMessage.budgetAmount}` : 'None' },
                { name: 'budgetAmountType', value: (pubsubMessage.budgetAmountType) ? pubsubMessage.budgetAmountType : 'None' },
                { name: 'currencyCode', value: (pubsubMessage["currencyCode"]) ? pubsubMessage["currencyCode"] : 'None' }
            )
            .setFooter(`${process.env.URL}`);

        bot.channels.cache.get(process.env.CHANNEL).send(responseEmbed)
        bot.channels.cache.get(process.env.CHANNEL).send(`<@${process.env.GCPADMIN}>`)
    } catch (err) {
        bot.channels.cache.get(process.env.CHANNEL).send(`<@${process.env.BOTADMIN}> BOT ERROR`)
    }
    await sleep(3000)
    process.exit(0)
}

// exports.discordalert = async (pubsubMessage, context) => {
//     console.log("Running Bot!")
//     console.log("Puibsub msg")
//     // console.log(Buffer.from(pubsubMessage, 'base64').toJSON())
//     // console.log("Puibsub msg data")
//     const data = Buffer.from(pubsubMessage.data, 'base64').toString()
//     const json = JSON.parse(data)
//     // console.log(data)
//     console.log(json)
//     // console.log(typeof json)
//     bot.login(TOKEN);
//     await sleep(3000)
//     await MsgAlert(json)
//     return;
// };

async function test() {
    bot.login(TOKEN);
    await sleep(3000)
    MsgAlert({
        "budgetDisplayName": "name-of-budget",
        "alertThresholdExceeded": 1.0,
        "costAmount": 100.01,
        "costIntervalStart": "2019-01-01T00:00:00Z",
        "budgetAmount": 100.00,
        "budgetAmountType": "SPECIFIED_AMOUNT",
        "currencyCode": "USD"
    })
}

test()