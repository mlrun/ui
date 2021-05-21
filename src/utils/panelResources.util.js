export const selectMemoryOptions = {
  unitCpu: [
    { label: 'cpu', id: 'cpu' },
    { label: 'millicpu', id: 'millicpu' }
  ],
  unitMemory: [
    { label: 'Bytes', id: 'Bytes' },
    { label: 'KB', id: 'KB' },
    { label: 'KiB', id: 'KiB' },
    { label: 'MB', id: 'MB' },
    { label: 'MiB', id: 'MiB' },
    { label: 'GB', id: 'GB' },
    { label: 'GiB', id: 'GiB' },
    { label: 'TB', id: 'TB' },
    { label: 'TiB', id: 'TiB' },
    { label: 'PB', id: 'PB' },
    { label: 'PiB', id: 'PiB' },
    { label: 'EB', id: 'EB' },
    { label: 'EiB', id: 'EiB' }
  ]
}

export const generateCpuValue = cpu =>
  cpu.match(/m/) ? cpu.slice(0, cpu.length - 1) : cpu

export const generateMemoryValue = memory =>
  memory.match(/[a-zA-Z]/)
    ? memory.slice(0, memory.match(/[a-zA-Z]/).index)
    : memory
