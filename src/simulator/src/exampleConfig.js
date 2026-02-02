export const exampleConfig = {
  Input: [
    { x: 100, y: 200, label: 'A', output: 'A_out' },
    { x: 100, y: 260, label: 'B', output: 'B_out' },
  ],

  Output: [
    { x: 480, y: 180, label: 'SUM', input: 'SUM_port' },
    { x: 480, y: 300, label: 'CARRY', input: 'CARRY_port' },
  ],

  XorGate: [
    {
      x: 280,
      y: 180,
      inp: ['A_xor', 'B_xor'],
      output1: 'XOR_out',
    },
  ],

  AndGate: [
    {
      x: 280,
      y: 300,
      inp: ['A_and', 'B_and'],
      output1: 'AND_out',
    },
  ],

  wires: [
    // A fan-out
    { node1: 'A_out', node2: 'A_xor' },
    { node1: 'A_out', node2: 'A_and' },

    // B fan-out
    { node1: 'B_out', node2: 'B_xor' },
    { node1: 'B_out', node2: 'B_and' },

    // Gate outputs
    { node1: 'XOR_out', node2: 'SUM_port' },
    { node1: 'AND_out', node2: 'CARRY_port' },
  ],
}
