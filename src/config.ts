const cfPorts: Array<number> = [
	443,
	2053,
	2083,
	2087,
	2096,
	8443,
]

const domainList: Array<string> = [
	"discord.com",
	"laravel.com",
	"cdnjs.com",
	"www.speedtest.net",
	"workers.dev",
	"nginx.com",
	"chat.openai.com",
	"auth0.openai.com",
	"codepen.io",
	"api.jquery.com"
]

const supportedCiphers: Array<string> = [
	"none",
	"auto",
	"plain",
	"aes-128-cfb",
	"aes-192-cfb",
	"aes-256-cfb",
	"rc4-md5",
	"chacha20-ietf",
	"xchacha20",
	"chacha20-ietf-poly1305",
]
  
import { isIp, isValidUUID } from "./helpers"

export function mixConfig(
	cnf: any,
	url: URL,
	ip: string,
	operator: string,
	provider: string,
): object {
	try {
		var conf = {...cnf};
		if (!conf.tls && conf.network == "ws") {
			return {}
		}

		var addr = null
		if (conf.servername) {
			addr = conf.servername
		} else if (conf["ws-opts"] && conf["ws-opts"].headers.Host && !isIp(conf["ws-opts"].headers.Host)) {
			addr = conf["ws-opts"].headers.Host
		} else if (conf.server && !isIp(conf.server)) {
			addr = conf.server
		}
		if (!addr) {
			return {}
		}
		if (!conf.port) {
			conf.port = 443
		}

		if (!cfPorts.includes(conf.port)) {
			return {}
		}

		if (addr.endsWith('.workers.dev')) {
			// Already merged with worker
			const part1 = conf["ws-opts"].path.split("/").pop()
			const part2 = conf["ws-opts"].path.substring(0, conf["ws-opts"].path.length - part1.length - 1)
			var path = ""
			if (part1.includes(":")) {
				addr = part1.replace(/^\//g, "").split(":")
				conf.port = parseInt(addr[1])
				addr = addr[0]
				path = "/" + part2.replace(/^\//g, "")
			} else if (part2.includes(":")) {
				addr = part2.replace(/^\//g, "").split(":")
				conf.port = parseInt(addr[1])
				addr = addr[0]
				path = "/" + part1.replace(/^\//g, "")
			} else if (part1.includes(".")) {
				addr = part1.replace(/^\//g, "")
				conf.port = 443
				path = "/" + part2.replace(/^\//g, "")
			} else {
				addr = part2.replace(/^\//g, "")
				conf.port = 443
				path = "/" + part1.replace(/^\//g, "")
			}
			conf["ws-opts"].path = path
		}

		if (provider) {
			conf.name =  conf.name + "-" + provider
		}

		conf.name = conf.name + "-worker-" + operator.toLocaleLowerCase()
		conf["ws-opts"].headers.Host = url.hostname
		conf.servername = url.hostname
		if (ip) {
			conf.server = ip
		} else {
			conf.server = domainList[Math.floor(Math.random() * domainList.length)]
		}

		conf.path = "/" + addr + (conf["ws-opts"].path ? "/" + conf["ws-opts"].path.replace(/^\//g, "") : "")
		conf.provider = provider
		conf.merged = true
		return conf
	} catch (e) {
		return {}
	}
}

export function validateConfig(
	cnf: any,
	provider: string
): object {
	try {
		var conf = {...cnf};

		if (["ss", "ssr"].includes(conf.type) && !supportedCiphers.includes(conf.cipher)) {
			return {}
		}
		if (conf.uuid && !isValidUUID(conf.uuid)) {
			console.log("invalid uuid", conf.uuid)
			return {}
		}

		conf.name = conf.name + "-" + provider
		conf.provider = provider
		conf.merged = false
		return conf
	} catch (e) {
		return {}
	}
}
