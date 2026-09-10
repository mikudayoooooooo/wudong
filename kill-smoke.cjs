// 清理本 worktree 遗留的 node dev 进程（mwtsc/vite 等）
const { execSync } = require('child_process');
const out = execSync(
  `powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name='node.exe'\\" | Select-Object ProcessId,CommandLine | ConvertTo-Json"`,
  { encoding: 'utf-8' }
);
const list = JSON.parse(out || '[]');
const arr = Array.isArray(list) ? list : [list];
let killed = 0;
for (const p of arr) {
  const cmd = p.CommandLine || '';
  if (/admin-merge-test/.test(cmd) && /mwtsc|vite|bootstrap|midway/.test(cmd)) {
    try {
      execSync(`taskkill /PID ${p.ProcessId} /F /T`);
      console.log('killed', p.ProcessId, cmd.slice(0, 80));
      killed++;
    } catch (e) {
      console.log('skip', p.ProcessId, e.message.slice(0, 40));
    }
  }
}
console.log('done, killed =', killed);
