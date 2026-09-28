export const trades = [
    { id: 't1', symbol: 'AAPL', side: 'Long', result: 'Win', r: 1.2, pnl: 120, date: '2026-09-20' },
    { id: 't2', symbol: 'EURUSD', side: 'Short', result: 'Loss', r: -0.5, pnl: -50, date: '2026-09-20' },
    { id: 't3', symbol: 'BTCUSD', side: 'Long', result: 'Win', r: 2.1, pnl: 210, date: '2026-09-19' },
];

export const profile = { name: "Jane Trader", email: "jane@example.com" };

export const playbook = [
    { id: 'p1', name: 'Demand Zone', rules: 6, examples: 5 },
    { id: 'p2', name: 'Supply Zone', rules: 5, examples: 3 },
    { id: 'p3', name: 'Break & Retest', rules: 4, examples: 2 },
];

export const analytics = {
    totalTrades: 42,
    winRate: 0.57,
    netR: 12.4,
    avgR: 0.29,
};
