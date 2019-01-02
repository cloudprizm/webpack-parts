import { asks, reader } from 'fp-ts/lib/Reader'

import {
  applyRuleAtTheEnd,
  ChainableConfigDefinition,
  ConfigPart,
  DevTool,
  isProduction,
  Modes,
  Output,
  withDevTool,
  withExtensions,
  withMainFields,
  withMode,
  withOutput,
} from './parts'

import {
  defaultSassRules,
  defaultCodeRules,
} from './rules'

import { defaultExtensions } from './shared'

const umdOutput = withOutput.set({
  globalObject: 'this',
  libraryTarget: 'umd',
  umdNamedDefine: true
})

const outputEnv: ConfigPart<Output> = asks(env => ({
  filename: isProduction(env) ? '[name].[contenthash].js' : '[name].js',
  chunkFilename: isProduction(env) ? '[name].[contenthash].chunk.js' : '[name].chunk.js',
  path: env.dist,
  publicPath: env.publicPath || ''
}))

export const withLibraryOutput = withOutput.modify(output => ({
  ...output,
  libraryTarget: 'commonjs2',
}))

const setExtensions = withExtensions.set(defaultExtensions)
const setMainFields = withMainFields.set(['browser', 'main', 'module'])

const setWebpackMode: ConfigPart<Modes> = asks(userConfig => userConfig.env || 'none')
const setDevTool: ConfigPart<DevTool> = asks(userConfig =>
  isProduction(userConfig)
    ? 'source-map'
    : 'cheap-eval-source-map'
)

export const basicConfig: ChainableConfigDefinition = config =>
  reader
    .of({ ...config })
    .map(umdOutput)
    .map(setExtensions)
    .map(setMainFields)
    .ap(setDevTool.map(withDevTool.set))
    .ap(setWebpackMode.map(withMode.set))
    .ap(outputEnv.map(partialOutput =>
      withOutput.modify(output => ({ ...output, ...partialOutput }))))

export const minimalTypescriptWithSass: ChainableConfigDefinition = config =>
  basicConfig(config)
    .ap(defaultSassRules.map(applyRuleAtTheEnd))
    .ap(defaultCodeRules.map(applyRuleAtTheEnd))
