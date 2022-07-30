"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.version = void 0;
const build_utils_1 = require("@vercel/build-utils");
const execa_1 = require("execa");
exports.version = 3;
async function build() {
    console.log("vercel-swift Building...");
    await (0, execa_1.commandSync)(`curl https://download.swift.org/experimental-use-only/repo/amazonlinux/releases/2/swiftlang.repo -o /tmp/etc/yum.repos.d/swiftlang.repo`, { shell: true, stdio: 'inherit' });
    await (0, execa_1.commandSync)(`amazon-linux-extras install epel`, { shell: true, stdio: 'inherit' });
    await (0, execa_1.commandSync)(`yum install swiftlang`, { shell: true, stdio: 'inherit' });
    await (0, execa_1.commandSync)(`swift build -c release`, { shell: true, stdio: 'inherit' });
    const lambda = await (0, build_utils_1.createLambda)({
        files: { 'bootstrap': new build_utils_1.FileFsRef({ mode: 0o755, fsPath: '.build/release/MyLambda' }) },
        // files: {'bootstrap': new FileFsRef({ mode: 0o755, fsPath: '.build/arm64-apple-macosx/debug/MyLambda' })},
        handler: 'bootstrap',
        runtime: 'provided',
    });
    return {
        output: lambda,
        watch: [
        // Dependent files to trigger a rebuild in `vercel dev` go here…
        ],
        routes: [
        // If your Runtime needs to define additional routing, define it here…
        ],
    };
}
exports.build = build;
