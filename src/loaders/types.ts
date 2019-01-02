import { UserConfig, RuleSetLoader } from '../parts'
import { BabelLoaderConfig } from './babel'

declare module '../parts' {
  interface UserConfig {
    babelConfig: BabelLoaderConfig
  }
}

export type LoaderAware = (input: Partial<UserConfig>) => RuleSetLoader
export type LoadersBundle = (input: Partial<UserConfig>) => Array<LoaderAware | RuleSetLoader>