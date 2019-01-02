import {
  styleLoader,
  bulmaVariantsToDS,
  cssLoaderWithTypeGeneration,
  sassLoader,
  babelLoader,
  basicCSSLoader,
  tsLoader,
  LoadersBundle,
} from './loaders'

import { LoaderRule } from './parts'
import { ask, asks } from 'fp-ts/lib/Reader'
import { test } from './shared'

export const sassLibraryDevelopmentLoaders: LoadersBundle = input => [
  styleLoader(),
  bulmaVariantsToDS(),
  cssLoaderWithTypeGeneration(),
  sassLoader(),
]

export const sassDevelopmentLoaders: LoadersBundle = input => [
  styleLoader(),
  basicCSSLoader(),
  sassLoader(),
]

export type LazyLoaderRule = (bundle: LoadersBundle) => LoaderRule

export const makeSassRule: LazyLoaderRule =
  loadersBundle =>
    asks((userConfig) => ({
      test: test.sass,
      exclude: test.node_modules,
      use: loadersBundle(userConfig),
    }))

export const makeCodeRule: LazyLoaderRule =
  loadersBundle =>
    ask()
      .map((env) => ({
        test: test.code,
        exclude: test.node_modules,
        use: loadersBundle(env)
      }))

export const minimalCodeLoaders: LoadersBundle = input => [
  babelLoader(input.babelConfig),
  tsLoader()
]

export const defaultSassRules = makeSassRule(sassDevelopmentLoaders)
export const librarySassRules = makeSassRule(sassLibraryDevelopmentLoaders)
export const defaultCodeRules = makeCodeRule(minimalCodeLoaders)
