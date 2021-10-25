# Discord-M1

> This project is a fork of [Discord-M1](https://github.com/17hoehbr/Discord-M1), with support for screen sharing, and tweaks to keep the native application's look on macOS.

An ARM64 native Discord desktop app for M1 Macs, based on [17hoehbr](https://github.com/17hoehbr)'s work.

Based on the original author's [apple-music-electron](https://github.com/17hoehbr/apple-music-electron) project for Linux.

# How to install

 1. Head to the [releases page](https://github.com/yannhodiesne/Discord-M1/releases) and download the latest version.
 2. Open the .dmg file and copy the application **anywhere but not inside your Applications folder**.
 3. Open a terminal, and type `sudo xattr -rd com.apple.quarantine ` (with a space at the end), then drag the Discord application onto the terminal before pressing Enter.
> Running a command starting with `sudo` is usually a very bad idea, but I promise this one is safe.
 4. Enter your password, and press Enter.
 5. Enjoy !

> Steps 2 and 3 are mandatory because I did not pay Apple's 99$ fee to sign the application.  
> Putting the application inside the Applications folder will break the screen sharing feature, as Apple restricts the permissions of unsigned apps.

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

# FAQ

## Why is macOS is telling me the application is damaged and cannot be opened?

It happens because you dit not run, or made a mistake when running the terminal command inside the *How to install* section.
Follow the instructions inside the *How to install* section, and feel free to blame Apple for their developer's fee.

## Why is the share screen button opening the System Preferences but I still cannot share my screen?

It happens because you moved Discord inside the Applications folder.  
Apple is restricting the permissions of unsigned applications inside of this folder, to ensure only trusted ones can interact with some parts of the system.  
Follow the instructions inside the *How to install* section, and feel free to blame Apple for their developer's fee.

# Credits

Made with [Electron-Builder](https://www.electron.build/).

Kudos to [17hoehbr](https://github.com/17hoehbr) for his original work on an M1-friendly Discord client.

Screen sharing support would not have been possible without these ressources and their authors :
 - [Hacking Together a Native Version of Discord for M1 Macs](https://rthr.me/2021/03/discord-native-apple-silicon/)
 - [WesselKroos' comment on electron/electron#16513](https://github.com/electron/electron/issues/16513#issuecomment-602070250)

Badge count support would not have been possible without [Randomblock1](https://gist.github.com/Randomblock1)'s work : [JavaScript code for Nativefier Discord to add a counter and native style](https://gist.github.com/Randomblock1/b8cd3948ce0b4688b874f2643a2a6941)
