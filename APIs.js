import PowerShell from 'node-powershell';
import Sudoer from 'sudo-prompt';
import os from 'os';

const encodePowershell = function(...commands) {
    console.info(commands);
    let bytes = Array.from(new TextEncoder().encode(commands.join('\n')));
    let byteString = bytes.map(b => String.fromCharCode(b) + String.fromCharCode(0)).join('');
    return btoa(byteString);
};

const powerShell = function(...commands) {
    return `PowerShell -EncodedCommand ${encodePowershell(...commands)}`;
};

export function sudo(cmd) {
    return new Promise((resolve, reject) => {
        Sudoer.exec(cmd, { name: 'Elevate privileges' }, function(error, stdout, stderr) {
            error ? reject(error) : resolve(stdout || stderr);
        });
    });
};

export function registerActiveDirectoryComputer(username, password, path, computerName) {
    return sudo(powerShell(
        `$password = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("${btoa(password)}")) | ConvertTo-SecureString -asPlainText -Force`,
        `$credentials = New-Object System.Management.Automation.PSCredential ("${username}", $password)`,
        `Add-Computer -DomainName RAMS.adp.vcu.edu -OUPath "${path}" ${os.hostname().toUpperCase() == computerName ? '' : `-NewName "${computerName}" `}-Credential $credentials -Force`
    ));
};
