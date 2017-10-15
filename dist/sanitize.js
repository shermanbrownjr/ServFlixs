var colors = require('colors');

var sanitize = (args) => {
    var smbClient = args.smbClient;

    var cleanYifyDirectories = () => {

        smbClient.readdir('Movies', (err, files) => {

            var directories = _.filter(files, function (o) {
                return o != '_.DS_Store' || o != 'DS_Store';
            });

            directories.forEach((dir) => {

                var newDirName = dir.split('.').join(' ');
                newDirName = _.replace(newDirName, 'YIFY', '');
                newDirName = _.replace(newDirName, 'x264', '');
                newDirName = _.replace(newDirName, 'BluRay', '');
                newDirName = _.replace(newDirName, '1080p', '');
                newDirName = _.replace(newDirName, '720p', '');
                newDirName = _.replace(newDirName, 'HDRip', '');
                newDirName = _.replace(newDirName, 'AC3-JYK', '');
                newDirName = _.replace(newDirName, 'BRRip', '');
                newDirName = _.replace(newDirName, 'XviD', '');
                newDirName = _.replace(newDirName, 'GAZ', '');
                newDirName = _.replace(newDirName, 'BrRip', '');
                newDirName = _.replace(newDirName, 'HSBS', '');
                newDirName = _.replace(newDirName, '3D', '');
                newDirName = _.replace(newDirName, 'BRrip', '');
                newDirName = _.replace(newDirName, 'AC3-CaLLioPE_MoNTEDiaZ', '');
                newDirName = _.replace(newDirName, 'BOKUTOX', '');
                newDirName = _.replace(newDirName, 'AC3-HDLiTE', '');
                newDirName = _.replace(newDirName, 'UNRATED EXTENDED', '');
                newDirName = _.replace(newDirName, 'HC', '');
                newDirName = _.replace(newDirName, '(', '');
                newDirName = _.replace(newDirName, ')', '');
                newDirName = _.replace(newDirName, '[', '');
                newDirName = _.replace(newDirName, ']', '');
                newDirName = _.replace(newDirName, 'BDRip', '');
                newDirName = _.replace(newDirName, 'H264', '');
                newDirName = _.replace(newDirName, 'AAC', '');
                newDirName = _.replace(newDirName, '-', '');
                newDirName = _.replace(newDirName, 'KiNGDOM', '');
                newDirName = _.replace(newDirName, '  ', ' ');
                newDirName = newDirName.trim();

                smb2Client.exists(`Movies\\${newDirName}`, (err, exists) => {
                    if (err) {
                        console.log(colors.bgRed.yellow(err));
                        return;
                    }

                    if (!exists) {
                        smb2Client.rename(`Movies\\${dir}`, `Movies\\${newDirName}`, function (err) {
                            if (err) {
                                console.log(colors.bgRed.yellow(err));
                                return;
                            }

                            console.log(`${dir} sanitized to ${newDirName}`);
                        });
                    }
                });

            });

            if (err) {
                console.log(colors.bgRed.yellow(err));
                return;
            }

        });
    }

    return {
        cleanYifyDirectories: cleanYifyDirectories
    };
}

module.exports = sanitize;