/** A five-petal plum blossom as one closed path, centred on the origin. */
export function blossomPath(r: number): string {
  const pr = r * 0.46;
  return Array.from({ length: 5 }, (_, k) => {
    const a = (k * 72 * Math.PI) / 180;
    const cx = Math.sin(a) * r * 0.54;
    const cy = -Math.cos(a) * r * 0.54;
    return `M${(cx + pr).toFixed(2)} ${cy.toFixed(2)} A${pr.toFixed(2)} ${pr.toFixed(2)} 0 1 0 ${(cx - pr).toFixed(2)} ${cy.toFixed(2)} A${pr.toFixed(2)} ${pr.toFixed(2)} 0 1 0 ${(cx + pr).toFixed(2)} ${cy.toFixed(2)}Z`;
  }).join('');
}
