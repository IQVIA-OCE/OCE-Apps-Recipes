while [ $# -gt 0 ]; do
  case "$1" in
    --react-folder-path=*)
      package_json_path="${1#*=}"
      ;;
    --metro-config-path=*)
      metro_config_path="${1#*=}"
      ;;
    *)

      exit 1
  esac
  shift
done

[[ -z "$package_json_path" ]] && {
    echo "--react-folder-path is empty"
    exit 1
}

[[ -z "$metro_config_path" ]] && {
    echo "--metro-config-path is empty"
    exit 1
}


# getting metro port from config
if which python3 > /dev/null 2>&1; then
    METRO_PORT=`cat "$metro_config_path" | python3 -c "import sys, json; print(json.load(sys.stdin)['port'])"`
elif which python2 > /dev/null 2>&1; then
    METRO_PORT=`cat "$metro_config_path" | python2 -c "import sys, json; print json.load(sys.stdin)['port']"`
else
    echo "No Python executable is found."
fi


echo "package_json_path> ${package_json_path}"

cd "${package_json_path}"
yarn install
cd -

# This script is a copy-paste from the project in path /node_modules/react-native/React/React.xcodeproj
# Possible issues may arrise in future.
export RCT_METRO_PORT="${METRO_PORT:=8084}"

echo "RCT_METRO_PORT> ${RCT_METRO_PORT}"

echo "export RCT_METRO_PORT=${RCT_METRO_PORT}" >"${package_json_path}/node_modules/react-native/scripts/.packager.env"
if [ -z "${RCT_NO_LAUNCH_PACKAGER+xxx}" ]; then
    if nc -w 5 -z localhost ${RCT_METRO_PORT}; then
        if ! curl -s "http://localhost:${RCT_METRO_PORT}/status" | grep -q "packager-status:running"; then
            echo "Port ${RCT_METRO_PORT} already in use, packager is either not running or not running correctly"
            exit 2
        fi
    else



        SCRIPT="export RCT_METRO_PORT=$RCT_METRO_PORT; sh \\\"${package_json_path}/node_modules/react-native/scripts/launchPackager.command\\\""

        exec osascript <<EOF
        tell application "Terminal"
            activate
            do script "${SCRIPT}"
        end tell
EOF

        #open "${package_json_path}/node_modules/react-native/scripts/launchPackager.command" || echo "Can't start packager automatically"
    fi
fi
