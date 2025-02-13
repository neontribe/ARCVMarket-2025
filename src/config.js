import pjson from '../package.json';

// --- Defaults ---
let env = 'production',
    apiBase = 'https://voucher-admin.alexandrarose.org.uk/api',
    appVersion = pjson.version,
    useMocks = false;

// --- Env Specific ---
if (location.hostname.match(/voucher-staging/)) {
    env = 'staging';
    apiBase = 'https://voucher-admin-staging.alexandrarose.org.uk/api';
}

if (location.hostname.match(/localhost|(\.(dev|test))$/)) {
    env = 'development';
    apiBase =
        import.meta.env.VITE_API_BASE ||
        window.location.protocol + '//arcv-service.test/api';
    useMocks = import.meta.env.VITE_USE_MOCKS;
}
console.log('ENV:', import.meta.env.MODE);
console.log('apiBase', apiBase);
console.log('useMocks', useMocks);

export default {
    apiBase: apiBase,
    env: env,
    appVersion: appVersion,
    useMocks: useMocks
};
