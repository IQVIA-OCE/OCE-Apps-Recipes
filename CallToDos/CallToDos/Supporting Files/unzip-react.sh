#!/bin/sh

while :; do
    case $1 in
    --pods-path=?*)
        readonly PODS_PATH="${1#*=}"
        ;;
    *)
        break
        ;;
    esac

    shift
done

[[ -z "${PODS_PATH}" ]] && {
    echo "--pods-path is empty"
    exit 1
}

readonly react_folder_path="./CallToDos/react"
mkdir -p "${react_folder_path}"

find "${PODS_PATH}" -maxdepth 1 -iname "*.zip" | while read archive_path; do
    zip_name=$(basename "${archive_path}")

    unzip -o "${PODS_PATH}/${zip_name}" -d "${react_folder_path}"

    echo "${archive_path}"

    if [ $? -eq 0 ]; then
        echo "✅ Succeeded: react sources unzipped"
    else
        echo "❌ Failed: react sources cannot be unzipped"
        exit 1
    fi
done
