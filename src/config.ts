const envMode: string = import.meta.env.MODE;

interface IConfig {
  APIURL: string,
  name: string,
}

const base: IConfig = {
  APIURL:  "http://127.0.0.2",
  name: "Foundation"
}

const development: IConfig = {
  ...base
}

const production: IConfig = {
  ...base,
  APIURL: "http://api.cooocc.com"
}

const config: Record<string, IConfig> = {
  development,
  production
}

export default config[envMode];