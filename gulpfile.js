const gulp = require('gulp')
const exec = require('child_process').exec;
const argv = require('yargs').argv;
const jeditor = require('gulp-json-editor');

let versionType = 'patch';
let package = {};

const printLog = (type, msg) => {
    const type_message = (type == null) ? '[SUCCESS] ' : '[FAILED] ';
    if (msg) console.log(type_message + msg);
    if (type != null) process.exit(0);
}

// const joinBranchToModul = (modules, branch) => {
//     Object.keys(modules).map((k) => {
//         let value = modules[k].toString();
//         if (value.indexOf('bitbucket.org/dataowldev') >= 0) {
//             if(value.indexOf('#') >= 0)
//                 modules[k] = value.substring(0, value.indexOf('#'));
//             modules[k] = `${modules[k]}#${branch}`
//         }
//     })
//     return modules;
// }

gulp.task('version-patch', ['go-to-branch'], (cb) => {
    exec('npm version patch', err => cb(err))
})

gulp.task('version-minor', ['go-to-branch'], (cb) => {
    exec('npm version minor', err => cb(err))
})

gulp.task('version-major', ['go-to-branch'], (cb) => {
    exec('npm version major', err => cb(err))
})

gulp.task('remove-package-lock', (cb) => {
    exec('rm -f package-lock.json', err => cb(err))
})

gulp.task('update-package-modules', (cb) => {
    return gulp.src('./package.json')
    // .pipe(jeditor((json) => {
    //     if(json.dependencies)
    //         json.dependencies = joinBranchToModul(json.dependencies, argv.branch);
    //     return json;
    // }))
    .pipe(gulp.dest('./'))
})

gulp.task('get-package', (cb) => {
    return gulp.src('./package.json').pipe(jeditor(json => package = json))
})

gulp.task('go-to-branch', (cb) => {
    exec(`git checkout ${argv.branch} && git pull`, err => cb(err))
})

gulp.task('docker-login', (cb) => {
    exec('docker login --username dockerrepobuket --password 55855771jasojan', err => cb(err))
})

gulp.task('docker-build', ['remove-package-lock', 'update-package-modules', 'docker-login'], (cb) => {
    exec(`docker build -t ${package.name} .`, err => cb(err))
})

gulp.task('docker-tag', ['docker-build'], (cb) => {
    let tag = `docker tag ${package.name} ${package.name}:${argv.branch}`;
    exec(`${tag}${package.version} && ${tag}.latest`, err => cb(err))
})

gulp.task('docker-push', ['docker-tag'], (cb) => {
    let image = `${package.name}:${argv.branch}`;
    exec(`docker push ${image}${package.version} && docker push ${image}.latest`, err => cb(err))
    console.log("======================= PUSHED IMAGES ===========================");
    console.log(`IMAGE: ${image}${package.version}`);
    console.log(`IMAGE: ${image}.latest`);
    console.log("==================================================================");
})

gulp.task('deploy', [`version-${versionType}`, 'get-package'], (cb) => {

    const branch = argv.branch;

    if(argv.version_type && argv.version_type != true)
        versionType = argv.version_type

    if (!branch || branch == true) printLog(true, 'BRANCH_NAME is required');

    gulp.start('docker-push')

})

gulp.task('default', () => {
    console.log("========================= COMMANDS ==============================");
    console.log('gulp deploy --branch BRANCH_NAME --version_type NAME (patch, minor, major)');
    console.log("=================================================================");
});
