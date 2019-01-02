import { UserConfig, Plugin } from '../parts'

export type PluginAware = (input: UserConfig) => Plugin
export type PluginBundle = (input: UserConfig) => Plugin[]