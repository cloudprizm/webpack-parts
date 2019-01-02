export const cssModulesOptions = {
  localIdentName: '[name]_[local]_[hash:4]',
  namedExport: true,
  modules: true,
  sourceMap: false,
  camelCase: true,
}

export const cssLoader =
  (loader: string) =>
    (options = {}) =>
      ({ loader, options: { ...cssModulesOptions, ...options } })

export const cssLoaderWithTypeGeneration = cssLoader('typings-for-css-modules-loader')

export const basicCSSLoader = cssLoader('css-loader')

export const styleLoader = (loader = 'style-loader') => ({ loader })

export const bulmaVariantsToDS = (loader = {
  loader: '@hungry/webpack-bulma-variants-to-bem-loader',
  options: {
    cache: {}
  }
}) => loader