import { spawn } from 'child_process'

const preview = spawn(
  'dotenv',
  ['-e', '.env.development.mf', '--', 'vite', 'preview', '--port', '5179'],
  { stdio: 'inherit', shell: true }
)

preview.on('exit', code => process.exit(code ?? 0))
