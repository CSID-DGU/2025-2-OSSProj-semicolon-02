const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const projectRoot = __dirname;
const defaultConfig = getDefaultConfig(projectRoot);

module.exports = mergeConfig(defaultConfig, {
  projectRoot,         
  watchFolders: [],    
  resolver: {
    sourceExts: ['ts', 'tsx', 'js', 'jsx', 'json'],
  },
  watcher: {
    // node_modules 내부의 빌드 디렉토리 무시
    blockList: [
      /.*\/node_modules\/.*\/\.cxx\/.*/,
      /.*\/node_modules\/.*\/android\/\.cxx\/.*/,
      /.*\/node_modules\/.*\/android\/build\/.*/,
    ],
  },
});
