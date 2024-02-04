#!/bin/bash
clear
echo "  _______            __       _______ __          __            "
echo " |   _   .---.-.----|  |_    |   _   |__.-----.--|  .-----.----."
echo " |.  1   |  _  |   _|   _|   |.  1___|  |     |  _  |  -__|   _|"
echo " |.  ____|___._|__| |____|   |.  __) |__|__|__|_____|_____|__|  "
echo " |:  |                       |:  |                              "
echo " |::.|                       |::.|                              "
echo " \`---'                       \`---'                              "
echo ""

#sleep 2

# get version number from package.json
currentVersion=$(grep -Eoi '"version": "\d+\.\d+\.\d+",' ./package.json)
currentVersion="${currentVersion/\"version\": /""}"
currentVersion="${currentVersion//\"/""}"
currentVersion="${currentVersion/,/""}"

# show version number to see if we want to update
echo "Current Version: $currentVersion"
echo "Would you like to update the version?"
printf "Enter the new version number, or hit Enter to use current version (x.x.x): "
read -r newVersion

# check if input is valid
valid="^[0-9]+\.[0-9]+\.[0-9]+$"
if [[ ! $newVersion =~ $valid && $newVersion != "" ]]; then
  echo "Invalid input, exiting!"
  exit
fi

# check to see if version is different, if it is, update package.json
if [[ $currentVersion == "$newVersion" || $newVersion == "" ]]
then
  echo "Keeping version $currentVersion!"
  newVersion=$currentVersion
else
  # ask if we want to commit it to the project repo
  echo "Would you like to commit the version change? (y/n)"
  printf " : "
  read -r yn
  printf "Updating version in package.json..."
  sed -i '' "1,+5 s|$currentVersion|$newVersion|g" ./package.json
  echo "Done."
  if [[ $yn == "y" || $yn == "Y" ]]; then
    echo "Committing version update..."
    git add package.json
    git commit -m "Version update to $newVersion"
    git push
  else
    echo "Skipping version commit!"
  fi
fi
echo

# build the app
npm run build

# cleanup
printf "Cleaning up/Moving files around..."
if [ -d /Users/mpfthprblmtq/Git/mpfthprblmtq.github.io/projects/part-finder ]; then
  rm -r /Users/mpfthprblmtq/Git/mpfthprblmtq.github.io/projects/part-finder
fi
mv build /Users/mpfthprblmtq/Git/mpfthprblmtq.github.io/projects/part-finder
echo "Done."

# deploy
echo "Deploying..."
# shellcheck disable=SC2164
cd /Users/mpfthprblmtq/Git/mpfthprblmtq.github.io
git add projects/part-finder/.
git commit -m "Deploying version $newVersion of Part Finder"
git push
echo "Done."