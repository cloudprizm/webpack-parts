import { Options } from 'ts-loader'

export const tsLoader =
  (options = {}, loader = (options: Partial<Options>) => ({
    loader: 'ts-loader',
    options: {
      happyPackMode: true,
      transpileOnly: true,
      ...options,
    }
  })) => loader(options)