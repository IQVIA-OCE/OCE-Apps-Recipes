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

export RCT_METRO_PORT="${METRO_PORT:=8084}"

#kill Metro Bundler on port 8084 if already started
if [ "$DEBUG_OCEFRAMEWORKS_BUILD" == "true" ]; then (lsof -nP -iTCP -sTCP:LISTEN | grep :${RCT_METRO_PORT}); fi
kill $(lsof -nP -iTCP -sTCP:LISTEN | grep :${RCT_METRO_PORT} | awk '{print $2}') && echo "Previous instance of Metro Bundler is killed" || echo "Previous instance of Metro Bundler is not found in memory"
echo "waiting 5 sec ..."
sleep 5
if [ "$DEBUG_OCEFRAMEWORKS_BUILD" == "true" ]; then (lsof -nP -iTCP -sTCP:LISTEN | grep :${RCT_METRO_PORT}); fi

echo "RCT_METRO_PORT> ${RCT_METRO_PORT}"

echo "export RCT_METRO_PORT=${RCT_METRO_PORT}" >"${package_json_path}/node_modules/react-native/scripts/.packager.env"
if [ -z "${RCT_NO_LAUNCH_PACKAGER+xxx}" ]; then
    if nc -w 5 -z localhost ${RCT_METRO_PORT}; then
        if ! curl -s "http://localhost:${RCT_METRO_PORT}/status" | grep -q "packager-status:running"; then
            echo "Port ${RCT_METRO_PORT} already in use, packager is either not running or not running correctly" 
            exit 2
        fi
    else
        SCRIPT="cd '${package_json_path}'; yarn start;"

        exec osascript <<EOF
        tell application "Terminal"
            activate
            do script "${SCRIPT}"
        end tell
EOF
    fi
fi
