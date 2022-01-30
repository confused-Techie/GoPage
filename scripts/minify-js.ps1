echo "Terser currently breaks some JS Functionality. Not reccommended for use yet."
terser ./assets/js/home.js -o ./assets/dist/home.min.js --compress ecma=12 --keep-classnames --keep-fnames;
terser ./assets/js/langHandler.js -o ./assets/dist/langHandler.min.js --compress ecma=12 --keep-classnames --keep-fnames;
terser ./assets/js/linkhealth.js -o ./assets/dist/langHandler.min.js --compress ecma=12 --keep-classnames --keep-fnames;
terser ./assets/js/pluginhandler.js -o ./assets/dist/pluginhandler.min.js --compress ecma=12 --keep-classnames --keep-fnames;
terser ./assets/js/pluginLoad.js -o ./assets/dist/pluginLoad.min.js --compress ecma=12 --keep-classnames --keep-fnames;
terser ./assets/js/pluginRepo.js -o ./assets/dist/pluginRepo.min.js --compress ecma=12 --keep-classnames --keep-fnames;
terser ./assets/js/settings.js -o ./assets/dist/settings.min.js --compress ecma=12 --keep-classnames --keep-fnames;
terser ./assets/js/universal.js -o ./assets/dist/universal.min.js --compress ecma=12 --keep-classnames --keep-fnames;;
terser ./assets/js/universe.js -o ./assets/dist/universe.min.js --compress ecma=12 --keep-classnames --keep-fnames;;
terser ./assets/js/uploadImage.js -o ./assets/dist/uploadImage.min.js --compress ecma=12 --keep-classnames --keep-fnames;;
