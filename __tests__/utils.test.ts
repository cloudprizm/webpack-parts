import { addHMRScripts } from '../src/utils'

test('adding hmr scripts to entry', () => {
  const devServer = {
    port: 9999,
    host: 'localhost',
    inline: true,
    hot: true
  }
  const decoratedEntryPoint = addHMRScripts('./src/some-entrypoint', { devServer })
  expect(decoratedEntryPoint).toMatchSnapshot()
})