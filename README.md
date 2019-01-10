# Webpack parts
Type and null safe, composable, webpack config for typescript.

## Example
#### Basic shape
```typescript
  const configFactory: ChainableConfigDefinition = 
    config =>
      reader.of({ ...config })

  const myDefaults = {}
  const myEnvironment: UserConfig = {
    target: 'node',
    dist: '...'
  }

  const myConfig = 
    configFactory(myDefaults)
      .run(myEnvironment)
```

#### Extending `UserConfig` with type interference
```typescript
interface MyCustomConfig extends UserConfig {
  babelConfig: any
  ssr: boolean
}

const configFactory: ChainableConfigDefinition<MyCustomConfig> = config => 
  makeConfig<MyCustomConfig>(config)
    .chain(chainableDefaults)

const myConfig = 
  configFactory(myDefaults)
    .run(myEnvironment)
```

* or with module module augmentation feature - benefit is that, there is no need to pass extra parameter
```typescript
declare module '@hungry/webpack-parts' {
  interface UserConfig {
    yourCustomConfigInterface: MyExtraConfig
  }
}
```
[You can find babel example within loaders.](src/loaders/types.ts)

#### Asking for UserConfig when chaining
```typescript
const setDevTool: ConfigPart<DevTool> = asks(userConfig =>
  isProduction(userConfig)
    ? 'source-map'
    : 'cheap-eval-source-map'
)

const configFactory = myConfig
  .ap(setDevTool.map(withDevTool.set)) // read (ask) and write (lens)
```

#### With `webpack dev server`
```typescript
  configSomehow()
    .ap(attachDevServer.map(devServer.set))
    .run(myEnvironment)
```

#### Working with HMR
* there is a helper which adding all needed hmr scripts based upon env to run, `addHMRScripts`
```typescript
  myConfig.chain(config =>
    asks(({ hmr, env }) => withEntry.set(({
      main: hmr && (env === 'development' || env === 'none')
        ? addHMRScripts(getFileInSRCFolder('index.browser.tsx'), config)
        : getFileInSRCFolder('index.browser.tsx'),
      static: getFileInSRCFolder('index.ssr.tsx'),
    }))(config))
```
* why?
when running `webpack-dev-server` with `hot` it assumes that all entry points needs to be compiled with `hmr` and it is causing some issues during `ssr` rendering.
I like this approach better since it is clear to which entry point extra code will be added.

#### More advance shape
You can find a more advance example within [`src/factory.ts`]('src/factory.ts') file.

```typescript
const chainableDefaults: ChainableConfigDefinition = config =>
  reader
    .of({ ...config })
    .map(umdOutput)
    .map(setExtensions)
    .map(setMainFields)
    .ap(setDevTool.map(withDevTool.set))
    .ap(setWebpackMode.map(withMode.set))
    .ap(sassRules.map(applyRuleAtTheEnd))
    .ap(codeRules.map(applyRuleAtTheEnd))
    .ap(outputEnv.map(partialOutput =>
      withOutput.modify(output => ({ ...output, ...partialOutput }))))
    .ap(pluginsBundle.map(applyPluginAtTheEnd))
    .chain(graphqlRule)
```

## How to use it
It is used in conjunction with [`@hungry/webpack-parallel`](https://github.com/hungry-consulting/webpack-parallel) - dev friendly builder and watcher for webpack.

### Working example
You can find basic working example within [`webpack-parallel/tests`](https://github.com/hungry-consulting/webpack-parallel/blob/master/__tests__/fixtures/configs.ts).

## Motivation
In world of monorepos, there could be a tons of different configurations - at some point I had low level of trust on existing solutions, and production grade configs were hard to track and understand at first sight, so I needed something more bulletproof, easy to change - something which would sound correct without too much details.
For me it was hard to create n-variation to any occasions and be fluent with that since code was growing and I was afraid that at some point I will loose momentum, so general idea behind this is - allow to provide any change, however within context where it will be used rather than having it prepare somewhere, far away from context. This makes config more flexible and provide abstraction over structure, so it should be pretty safe for the future and even providing any experimental configuration does not end up with total crash.

## Implementation details
Whole configuration is based upon monad `Reader` and `Lenses`. Reader give you ability to compose any chunk of information and ability to run it within some part of common configuration. Lenses allow you to override any path in immutable type safe way. 
Previously I was using `ramda` but it was hard to keep it small and type safe - I was not satisfied by type interference. So if you are still using `ramda` in typescript world, please have a look on `fp-ts` and `monocle-ts` library, since for me it was a game changer. Cheers!