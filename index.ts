import Discord from "discord.js";
import fs from "fs";
import fetch from "node-fetch";

import { token, serverID } from "./config.json";

const Client = new Discord.Client({
	intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
});

Client.login(token);

Client.once("ready", async () => {
	console.log(`Logged in as ${Client.user?.tag}`);

	const guild = Client.guilds.cache.get(serverID);

	if (!guild) {
		console.log(
			"Could not find guild. Am I added to the guild?"
		);
		process.exit();
	}

	console.log(
		`Found guild:\nName: ${guild.name}\nChannels: ${
			(await guild.channels.fetch()).size
		}\nMembers: ${guild.memberCount}`
	);

	let channelCount = 0;
	let messageCount = 0;
	let fileCount = 0;

	const member = guild.members.cache.get(
		Client.user?.id ?? ""
	);

	if (!member) return;

	guild.channels.cache.forEach(async (channel) => {
		if (
			!channel.permissionsFor(member).has("VIEW_CHANNEL")
		) {
			console.log(
				`Missing permissions for ${channel.name}, Skipping`
			);
			return;
		}
		const c = await channel.fetch();
		if (c.isText()) {
			let messageFetchLoop = true;
			let lastMessage: string | undefined = undefined;
            channelCount ++
			while (messageFetchLoop) {
				await c.messages
					.fetch({
						limit: 100,
						before: lastMessage ? lastMessage : undefined,
					})
					.then(async (collection) => {
						console.log(
							`${channelCount} Channels Processed | ${messageCount} Messages processed | ${fileCount} files processed | Batch Size: ${collection.size}`
						);

						messageCount += collection.size;

						lastMessage =
							collection.at(collection.size - 1)?.id ?? "";

						if (collection.size < 100) {
							messageFetchLoop = false;
						}

						const f = collection.filter(
							(m) => m.attachments.size > 0
						);

						f.forEach(async (message) => {
							message.attachments.forEach(
								async (attatchment) => {
									fetch(attatchment.url).then(
										async (res) => {
											const b = await res.buffer();
											directoryCheck(
												`./data/${channel.name}/`
											);
											fs.writeFileSync(
												`./data/${channel.name}/${attatchment.name}`,
												b
											);

											fileCount++;
										}
									).catch((err) => {
                                        console.log("Failed Fetch, skipping")
                                    })
								}
							);
						});

						if (!messageFetchLoop) return;
					});
			}
		}

		channelCount++;
	});
});

function directoryCheck(dir: string) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	return;
}
