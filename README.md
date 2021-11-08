# Discord-M1

> This project is a fork of [Discord-M1](https://github.com/17hoehbr/Discord-M1), with support for screen sharing, badges, and tweaks to keep the native application's look and feel on macOS.

An ARM64 native Discord desktop app for M1 Macs, based on [17hoehbr](https://github.com/17hoehbr)'s work.

## Working features

 - Voice calls
 - Screen sharing (entire screens and individual windows)
 - Badges (notifications count on the Discord icon)
 - Right-clicking to bring the context menu
 - Video calls popout (inside another window)

# How to install

 1. Head to the [releases page](https://github.com/yannhodiesne/Discord-M1/releases) and download the latest version.
 2. Open the .dmg (or .zip) file and copy the application inside the Applications folder.
 3. Enjoy !

# Building from source

## Requirements

 - Have Xcode installed and run it at least once to install required tools
 - Node.js 14.16.0 or above (https://nodejs.org/en/)
 - The yarn package manager (https://classic.yarnpkg.com/en/docs/install)

> As of today, Node 17 fails to compile one of the project's dependencies  
> I recommend to use Node 16 while waiting for `node-gyp` to fix this issue

## Build the application

1. Clone the project

```$ git clone https://github.com/yannhodiesne/Discord-M1.git```

2. Navigate to the project's folder

```$ cd Discord-M1```

3. Install the required dependencies

```$ yarn install```

4. Compile and package the application

```$ yarn dist```

5. You can now find the `Discord-vX.X.X-arm64.dmg` file inside `Discord-M1/dist` and the `Discord.app` file inside `Discord-M1/dist/mac-arm64`

> Alternatively you can run the app directly from source using `yarn start`, but it will be slower as it is intended for development purposes

# FAQ

## Screen sharing is opening the System Preferences even when Discord already has the permission

As Discord-M1 and the official Discord client share the same name, you need to ensure both of them (or at least Discord-M1) has the permission to share your screen.  

## Screen sharing still does not work!!!!

On some very rare occasions, macOS can become confused by thinking the screen sharing permission has been granted to Discord-M1, when it is in fact still pointing to the official client.  
To work around this bug, you can reset the screen sharing rights as pointed by [Hasuuka](https://github.com/Hasuuka) in [this comment](https://github.com/yannhodiesne/Discord-M1/issues/23#issuecomment-963147664): `sudo tccutil reset ScreenCapture`

# Contributors

This project exists thanks to all the people who contribute.

<a href="https://github.com/yannhodiesne/Discord-M1/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=yannhodiesne/Discord-M1" />
</a>

# Credits

Made with [Electron-Builder](https://www.electron.build/).

Kudos to [17hoehbr](https://github.com/17hoehbr) for his original work on an M1-friendly Discord client.

Screen sharing support would not have been possible without these ressources and their authors :
 - [Hacking Together a Native Version of Discord for M1 Macs](https://rthr.me/2021/03/discord-native-apple-silicon/)
 - [WesselKroos' comment on electron/electron#16513](https://github.com/electron/electron/issues/16513#issuecomment-602070250)

Badge count support would not have been possible without [Randomblock1](https://gist.github.com/Randomblock1)'s work : [JavaScript code for Nativefier Discord to add a counter and native style](https://gist.github.com/Randomblock1/b8cd3948ce0b4688b874f2643a2a6941)
