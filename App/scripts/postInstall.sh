vim node_modules/react-native-push-notification/android/build.gradle

# run patch-package to create a .patch file
yarn patch-package react-native-push-notification

# # commit the patch file to share the fix with your team
# git add patches/react-native-push-notificatione+3.14.15.patch
# git commit -m "fix brokenFile.js in react-native-push-notification"