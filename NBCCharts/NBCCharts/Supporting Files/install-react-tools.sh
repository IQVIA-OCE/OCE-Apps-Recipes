#!/bin/sh

echo "xcode-select path: $(xcode-select -p)"
echo "$(xcode-select -v)"

switchToXcodeCLT() {
    sudo xcode-select --switch '/Applications/Xcode.app'

    if [ $? -eq 0 ]; then
        echo "☑︎ Successfully switched to Xcode Command Line Tools."
    else
        echo "☒ Failed to switch to Xcode Command Line Tools."
        echo "Please, download and install them manually."
        echo "Take into account your macOS and Xcode versions."
        echo "https://developer.apple.com/download"

        exit 1
    fi
}

if ! [ -x "$(command -v brew)" ]; then
    # Switch to Xcode before installing brew because it throws an error if it is not possible
    switchToXcodeCLT

    echo "brew is not found. Installing now..."
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
else
    echo "☑︎ brew is installed $(brew --version)"
fi

# brew downloads and sets the latest CLT so need to switch back.
switchToXcodeCLT

if ! [ -x "$(command -v node)" ]; then
    echo "☐ node is not found. Installing now..."
    brew install node
else
    echo "☑︎ Node.js is installed $(node --version)"
fi

if ! [ -x "$(command -v watchman)" ]; then
    echo "☐ watchman is not found. Installing now..."
    brew install watchman
else
    echo "☑︎ watchman is installed"
fi

if ! [ -x "$(command -v npm)" ]; then
    echo "☐ npm is not found. Installing now..."
    npm install -g react-native-cli
else
    echo "☑︎ npm is installed $(npm --version)"
fi

if ! [ -x "$(command -v yarn)" ]; then
    echo "☐ yarn is not found. Installing now..."
    brew install yarn
else
    echo "☑︎ yarn is installed $(yarn --version)"
fi
