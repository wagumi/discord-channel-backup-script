const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const fs = require("fs");

//バックアップを取りたいチャンネルに対して読み取り権限のあるBOTのトークンID
const DISCORD_TOKEN = "xxx.xxxxx";

//バックアップを取るチャンネルのID
const CHANNEL_ID = "914960638365810753";

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
let messages = [];

const getMessages = async (id = null) => {
	const result = await rest.get(
		`${Routes.channelMessages(CHANNEL_ID)}?limit=100&before=${id}`,
	);
	messages = [...messages, ...result];
	console.log(result[result.length - 1].id);
	if (result.length === 100) {
		await getMessages(result[result.length - 1].id);
	}
};

(async () => {
	await getMessages("2000000000000000000");
	fs.writeFileSync(
		`./backup_${CHANNEL_ID}.json`,
		JSON.stringify(messages, null, 2),
	);
})();
