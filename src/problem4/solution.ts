// The problem does not state clearly what to do with interger that is negative, so I asume that I would throw an error in case the number is under 0

// Time Complexity: 0(n)
// Space Complexity: 0(n)
function sum_to_n_a(n: number): number {
    if (n < 0) throw new Error('Invalid number to do sum')
    if (n==0 || n==1) return n;
    return n + sum_to_n_a(n-1);
}

// Time Complexity: 0(n)
// Space Complexity: 0(1)
function sum_to_n_b(n: number): number {
    if (n < 0) throw new Error('Invalid number to do sum')
    let total = 0;
	for (let i = 1; i <= n; i++)
        total +=i;
    return total;
}

// Time Complexity: 0(1)
// Space Complexity: 0(1)
function sum_to_n_c(n: number): number {
    if (n < 0) throw new Error('Invalid number to do sum');
	return n * (n + 1) / 2
}
