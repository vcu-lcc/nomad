import Sudoer from 'sudo-prompt';
import os from 'os';



export function sudo(cmd) {
    return new Promise((resolve, reject) => {
        Sudoer.exec(cmd, { name: 'Elevate privileges' }, function(error, stdout, stderr) {
            error ? reject(error) : resolve(stdout || stderr);
        });
    });
};

export function namePC(computerName) {
    return sudo(`hostname ${computerName}`);
};

export function restartPC() {
    return sudo('reboot now');
}
