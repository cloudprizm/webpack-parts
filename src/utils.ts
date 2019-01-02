import { addDevServerEntrypoints } from 'webpack-dev-server'
import { Configuration } from './parts'

export const addHMRScripts =
  (entry: string | string[], config: Configuration) => {
    const cfg = { entry: Array.isArray(entry) ? entry : [entry] }
    addDevServerEntrypoints(cfg, { ...config.devServer })
    return cfg.entry
  }