import findUp from 'find-up'
import path from 'path'

const projectDir = process.cwd()
const rootDir = path.dirname(findUp.sync('.git') || process.cwd())
const node_modules = path.resolve(rootDir, 'node_modules')
const packageJSON = path.resolve(projectDir, 'package.json')
const projectSrc = path.resolve(projectDir, 'src')

export const paths = {
  project: projectDir,
  packageJSON,
  dist: path.resolve(projectDir, 'dist'),
  root: rootDir,
  node_modules,
  cache: path.join(node_modules, '.cache'),
}

export const getFileInProjectFolder = (file: string, start = projectDir) => path.resolve(projectDir, file)
export const getFileInSRCFolder = (file: string, start = projectSrc) => path.resolve(projectSrc, file)

export const defaultExtensions = ['.ts', '.tsx', '.js', '.mjs', '.json']

export const test = {
  code: /\.(t|j)sx?$/,
  node_modules: /node_modules/,
  sass: /\.s(a|c)ss$/,
}
