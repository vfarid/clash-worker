var clash = {
    port: 7890,
    "socks-port": 7891,
    "allow-lan": false,
    mode: "rule",
    "log-level": "info",
    "external-controller": "127.0.0.1:9090",
    dns: {
        "enable": true,
        "ipv6": false,
        "enhanced-mode": "fake-ip",
        "nameserver": [
            "114.114.114.114",
            "223.5.5.5",
            "8.8.8.8",
            "9.9.9.9",
            "1.1.1.1",
            "https://dns.google/dns-query",
            "tls://dns.google:853"
        ]
    },
    proxies: <object>[],
    "proxy-groups": <object>[],
    rules: [
        "GEOIP,IR,DIRECT",
        "DOMAIN-SUFFIX,ir,DIRECT",
        // "IP-CIDR,127.0.0.0/8,DIRECT",
        // "IP-CIDR,192.168.0.0/16,DIRECT",
        // "IP-CIDR,172.16.0.0/12,DIRECT",
        // "IP-CIDR,10.0.0.0/8,DIRECT",
        "MATCH,All"
    ],
}

import yaml from 'js-yaml'

export function toClash(configList: Array<object>): string {
    clash.proxies = configList.map((conf: any) => (({provider, merged, ...others}) => others)(conf))
    const groupedConfigs:any = configList.reduce((group: {[key: string]: any}, conf: any) => {
        if (!group[conf.merged ? 'Worker' : 'Original']) {
            group[conf.merged ? 'Worker' : 'Original'] = [];
        }
        group[conf.merged ? 'Worker' : 'Original'].push(conf);
        return group;
    }, {});
    var proxyTiers: any = []
    for (const worker in groupedConfigs) {
        groupedConfigs[worker] = groupedConfigs[worker].reduce((group: {[key: string]: any}, conf: any) => {
            if (!group[conf.provider]) {
                group[conf.provider] = [];
            }
            group[conf.provider].push(conf.name);
            return group;
        }, {});

        for (const provider in groupedConfigs[worker]) {
            proxyTiers[worker + "-" + provider] = groupedConfigs[worker][provider]
        }
    }
    var proxyGroups = [
        {
            name: "All",
            type: "select",
            proxies: [
                "All - UrlTest",
                "All - Fallback",
                "All - LoadBalance(ch)",
                "All - LoadBalance(rr)",
            ].concat(Object.keys(proxyTiers)),
        },
        {
            name: "All - UrlTest",
            type: "url-test",
            url: "http://clients3.google.com/generate_204",
            interval: 600,
            proxies: Object.keys(proxyTiers),
        },
        {
            name: "All - Fallback",
            type: "fallback",
            url: "http://clients3.google.com/generate_204",
            interval: 600,
            proxies: Object.keys(proxyTiers),
        },
        {
            name: "All - LoadBalance(ch)",
            type: "load-balance",
            strategy: "consistent-hashing",
            url: "http://clients3.google.com/generate_204",
            interval: 600,
            proxies: Object.keys(proxyTiers),
        },
        {
            name: "All - LoadBalance(rr)",
            type: "load-balance",
            strategy: "round-robin",
            url: "http://clients3.google.com/generate_204",
            interval: 600,
            proxies: Object.keys(proxyTiers),
        },
    ]
    for (const tier in proxyTiers) {
        proxyGroups.push({
            name: tier,
            type: "url-test",
            url: "http://clients3.google.com/generate_204",
            interval: 600,
            proxies: proxyTiers[tier],
        })
    }

    clash['proxy-groups'] = proxyGroups
    return yaml.dump(clash)
}