const execa = require('execa');
const {createLambda, FileFsRef} = require("@vercel/build-utils");

exports.version = 3;

async function build(opts) {
  console.log("vercel-swift Building...");
  await execa(
      `curl https://download.swift.org/experimental-use-only/repo/amazonlinux/releases/2/swiftlang.repo > /etc/yum.repos.d/swiftlang.repo`,
      [],
      { shell: true, stdio: 'inherit' }
  );
  await execa(
      `amazon-linux-extras install epel`,
      [],
      { shell: true, stdio: 'inherit' }
  );
  await execa(
      `yum install swiftlang`,
      [],
      { shell: true, stdio: 'inherit' }
  );
  await execa(
      `swift build -c release`,
      [],
      { shell: true, stdio: 'inherit' }
  );
  const lambda = await createLambda({
    files: {'bootstrap': new FileFsRef({ mode: 0o755, fsPath: '.build/release/MyLambda' })},
    // files: {'bootstrap': new FileFsRef({ mode: 0o755, fsPath: '.build/arm64-apple-macosx/debug/MyLambda' })},
    handler: 'bootstrap',
    runtime: 'provided',
  })
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
