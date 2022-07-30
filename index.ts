import {createLambda, FileFsRef} from "@vercel/build-utils";
import {commandSync} from "execa";

export const version = 3;

export async function build() {
  console.log("vercel-swift Building...");
  await commandSync(
      `curl https://download.swift.org/experimental-use-only/repo/amazonlinux/releases/2/swiftlang.repo -o /etc/yum.repos.d/swiftlang.repo`,
      { shell: true, stdio: 'inherit' }
  );
  await commandSync(
      `amazon-linux-extras install epel`,
      { shell: true, stdio: 'inherit' }
  );
  await commandSync(
      `yum install swiftlang`,
      { shell: true, stdio: 'inherit' }
  );
  await commandSync(
      `swift build -c release`,
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

