import { Client, Collection, GatewayIntents } from '../deps.ts'
import { Command, Event } from '../types/mod.ts'
import env from './env.ts'

class ExtendedClient extends Client {
	public commands: Collection<string, Command> = new Collection()
	public events: Collection<string, Event> = new Collection()
	public env = env

	public async init() {
		this.connect(this.env.TOKEN, [
			GatewayIntents.DIRECT_MESSAGES,
			GatewayIntents.GUILDS,
			GatewayIntents.GUILD_MESSAGES
		])

		for await (const dir of Deno.readDir('./commands')) {
			for await (const file of Deno.readDir(`./commands/${dir.name}`)) {
				const { command } = await import(
					`../Commands/${dir.name}/${file.name}`
				)
				
				this.commands.set(command.name, command)
			}
		}

		for await (const file of Deno.readDir(`./events`)) {
			const { event } = await import(`../Events/${file.name}`)
			this.events.set(event.name, event)
			this.on(event.name, event.run.bind(null, this))
		}
	}
}

export default ExtendedClient
