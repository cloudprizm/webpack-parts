export interface BabelLoaderConfig {
  babelrc?: boolean,
  plugins?: string[],
  presets?: string[],
}

export const babelLoader = (options: BabelLoaderConfig = {
  babelrc: false,
  plugins: [],
  presets: [],
}) => ({
  loader: 'babel-loader',
  options,
})
