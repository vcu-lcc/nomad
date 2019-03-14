import Sudoer from 'sudo-prompt';
import os from 'os';



export function sudo(cmd,cb) {
    return new Promise((resolve, reject) => {
        Sudoer.exec(cmd, { name: 'Elevate privileges' }, function(error, stdout, stderr) {
		
            error ? reject(error) : cb();resolve(stdout || stderr);
        });
    });
};

export function namePC(computerName, cb) {
    sudo(`scutil --set HostName ${computerName}`,cb);
};

export function restartPC() {
    return sudo('reboot now');
}
