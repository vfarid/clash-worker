/*!
  * Clash Subscription Worker (v2ray) v1.0
  * Copyright 2023 Vahid Farid (https://twitter.com/vahidfarid)
  * Licensed under GPLv3 (https://github.com/vfarid/clash-worker/blob/main/Licence.md)
  */

const MAX_CONFIGS: number = 1000
const INCLUDE_ORIGINAL: boolean = true
const ONLY_ORIGINAL: boolean = false
const SELECTED_TYPES: Array<string> = ["vmess", "ss", "ssr", "trojan", "snell", "http", "socks5"]
const SELECTED_PROVIDERS: Array<string> = []

const configProviders: any = {
  "mahdibland": "https://raw.githubusercontent.com/mahdibland/SSAggregator/master/sub/sub_merge_yaml.yml",
  "mfuu": "https://raw.githubusercontent.com/mfuu/v2ray/master/clash.yaml",
  "peasoft": "https://raw.githubusercontent.com/peasoft/NoMoreWalls/master/list.yml",
  "getnode": "https://raw.githubusercontent.com/a2470982985/getNode/main/clash.yaml",
  "nodefree": "https://raw.githubusercontent.com/mlabalabala/v2ray-node/main/nodefree4clash.txt",
  "clashnode": "https://raw.githubusercontent.com/mlabalabala/v2ray-node/main/clashnode4clash.txt",
}

const ipProviderLink: string = "https://raw.githubusercontent.com/vfarid/cf-clean-ips/main/list.json"

var selectedTypes: Array<string> = SELECTED_TYPES
var selectedProviders: Array<string> = SELECTED_PROVIDERS
var operators: Array<string> = []
var cleanIPs: Array<any> = []
var maxConfigs: number = MAX_CONFIGS
var includeOriginalConfigs: boolean = INCLUDE_ORIGINAL
var onlyOriginalConfigs: boolean = ONLY_ORIGINAL

import yaml from 'js-yaml'
import { landingPage } from "./landing"
import { mixConfig, validateConfig } from "./config"
import { getMultipleRandomElements } from "./helpers"
import { toClash } from "./clash"

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname.replace(/^\/|\/$/g, "")
    const parts = path.split("/")
    const type = parts[0].toLowerCase()
    if (type === "clash") {
      // var link = 'https://raw.githubusercontent.com/mfuu/v2ray/master/clash.yaml'
      // var json = yaml.load(await fetch(link).then(r => r.text()))
      // return new Response(JSON.stringify(json))

  	  if (parts[1] !== undefined) {
        if (parts[1].includes(".") || parts[1].includes(":")) { // Subdomain or IP
          cleanIPs = parts[1].toLowerCase().trim().split(",").map((ip: string) => {return {ip: ip, operator: "IP"}})
          operators = ["IP"]
        } else { // Operator code
          try {
            operators = parts[1].toUpperCase().trim().split(",")
            cleanIPs = await fetch(ipProviderLink)
              .then((r: Response) => r.json())
              .then((j: any) => j.ipv4)
            cleanIPs = cleanIPs.filter((el: any) => operators.includes(el.operator))
          } catch (e) { }
        }
      }

      if (url.searchParams.has("max")) {
        maxConfigs = parseInt(url.searchParams.get("max") as string)
        if (!maxConfigs) {
          maxConfigs = MAX_CONFIGS
        }
      }

      if (url.searchParams.has("original")) {
        const original = url.searchParams.get("original") as string
        includeOriginalConfigs = ["1", "true", "yes", "y"].includes(original.toLowerCase())
      }

      if (includeOriginalConfigs && url.searchParams.has("merge")) {
        const merge = url.searchParams.get("merge") as string
        onlyOriginalConfigs = !["1", "true", "yes", "y"].includes(merge.toLowerCase())
      }

      if (url.searchParams.has("type")) {
        selectedTypes = (url.searchParams.get("type") as string).toLocaleLowerCase().split(",").map((s: string) => s.trim())
      }

      if (url.searchParams.has("provider")) {
        selectedProviders = (url.searchParams.get("provider") as string).toLocaleLowerCase().split(",").map((s: string) => s.trim())
      }

      if (includeOriginalConfigs && !onlyOriginalConfigs) {
        maxConfigs = Math.floor(maxConfigs / 2)
      }

      var configList: Array<any> = []
      var acceptableConfigList: Array<any> = []
      var finalConfigList: Array<any> = []
      var newConfigs: any
      const configPerList: number = Math.floor(maxConfigs / Object.keys(configProviders).length)
      for (const provider in configProviders) {
        try {
          if (selectedProviders.length > 0 && !selectedProviders.includes(provider)) {
            continue
          }
          const content: string = await fetch(configProviders[provider]).then(r => r.text())
          const json: any = yaml.load(content)
          newConfigs = json.proxies;
          if (!onlyOriginalConfigs) {
            acceptableConfigList.push({
              name: provider,
              count: configPerList,
              configs: newConfigs.filter((cnf: any) => cnf.type == "vmess"),
              mergedConfigs: null,
            })
          }
          if (includeOriginalConfigs) {
            configList.push({
              name: provider,
              count: configPerList,
              configs: newConfigs.filter((cnf: any) => selectedTypes.includes(cnf.type)),
              renamedConfigs: null,
            })
          }
        } catch (e) { }
      }

      var ipList = []
      if (!cleanIPs.length) {
        operators = ["General"]
        cleanIPs = [{ip: "", operator: "General"}]
      }

      for (const operator of operators) {
        var ipList = cleanIPs.filter(el => el.operator == operator).slice(0, 5)
        var ip = ipList[Math.floor(Math.random() * ipList.length)].ip
        for (const i in acceptableConfigList) {
          const el = acceptableConfigList[i]
          acceptableConfigList[i].mergedConfigs = el.configs
            .map((cnf: any) => mixConfig(cnf, url, ip, operator, el.name))
            .filter((cnf: any) => cnf.merged && cnf.name)
        }
        var remaining = 0
        for (var i = 0; i < 5; i++) {
          for (const el of acceptableConfigList) {
            if (el.count > el.mergedConfigs.length) {
              remaining = remaining + el.count - el.mergedConfigs.length
              el.count = el.mergedConfigs.length
            } else if (el.count < el.mergedConfigs.length && remaining > 0) {
              el.count = el.count + Math.ceil(remaining / 3)
              remaining = remaining - Math.ceil(remaining / 3)
            }
          }
        }
        for (const el of acceptableConfigList) {
          finalConfigList = finalConfigList.concat(
            getMultipleRandomElements(el.mergedConfigs, el.count)
          )
        }
      }

      if (includeOriginalConfigs) {
        for (const i in configList) {
          const el = configList[i]
          configList[i].renamedConfigs = el.configs
            .map((cnf: any) => validateConfig(cnf, el.name))
            .filter((cnf: any) => cnf.name)
        }
        var remaining = 0
        for (var i = 0; i < 5; i++) {
          for (const el of configList) {
            if (el.count > el.renamedConfigs.length) {
              remaining = remaining + el.count - el.renamedConfigs.length
              el.count = el.renamedConfigs.length
            } else if (el.count < el.renamedConfigs.length && remaining > 0) {
              el.count = el.count + Math.ceil(remaining / 3)
              remaining = remaining - Math.ceil(remaining / 3)
            }
          }
        }
        for (const el of configList) {
          finalConfigList = finalConfigList.concat(
            getMultipleRandomElements(el.renamedConfigs, el.count)
          )
        }
      }
      return new Response(toClash(finalConfigList))
    } else if (path) {
      const addrPath = url.pathname.replace(/^\/|\/$/g, "")
      const newUrl = new URL("https://" + addrPath)
      return fetch(new Request(newUrl, request))
    } else {
      return landingPage(url)
    }
  }
}
