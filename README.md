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

#### More advance shape
This is not part of library, this is only example of composition.

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