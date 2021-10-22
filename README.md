# Discord-M1

> This project is a fork of [Discord-M1](https://github.com/17hoehbr/Discord-M1), with support for screen sharing, and tweaks to keep the native application look on macOS.

An ARM64 native Discord desktop app for M1 Macs, based on [17hoehbr](https://github.com/17hoehbr)'s work.

Based on the original author's [apple-music-electron](https://github.com/17hoehbr/apple-music-electron) project for Linux.
  
# Building from source

Requirements: Have Xcode installed
              Be sure to install Node.JS via https://nodejs.org/
              Install YARN https://classic.yarnpkg.com/en/docs/install
              You can install also YARN via the brew package manager with ```brew install yarn```


1. Clone project

```$ git clone https://github.com/yannhodiesne/Discord-M1.git```

2. Navigate to folder 

```$ cd Discord-M1```

3. Install dependencies

```$ yarn install```

4. Compile

```$ yarn dist```

Alternatively you can run the app directly from source using
```$ yarn start```


# Credits

Made with [Electron-Builder](https://www.electron.build/).

Kudos to [17hoehbr](https://github.com/17hoehbr) for his original work on an M1-compliant Discord client.

Screen sharing support would not have been possible without these ressources and their authors :
 - [Hacking Together a Native Version of Discord for M1 Macs](https://rthr.me/2021/03/discord-native-apple-silicon/)
 - [WesselKroos' comment on electron/electron#16513](https://github.com/electron/electron/issues/16513#issuecomment-602070250)
