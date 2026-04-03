/**
 * Gera números aleatórios criptograficamente seguros usando Web Crypto API
 * com rejection sampling para evitar viés de modulo
 */
export function getSecureRandomInt(min: number, max: number): number {
  const range = max - min;
  const bitsNeeded = Math.ceil(Math.log2(range));
  const bytesNeeded = Math.ceil(bitsNeeded / 8);
  const maxValue = Math.pow(2, bitsNeeded);
  
  let result: number;
  
  do {
    const randomBytes = new Uint8Array(bytesNeeded);
    crypto.getRandomValues(randomBytes);
    
    result = 0;
    for (let i = 0; i < bytesNeeded; i++) {
      result = (result << 8) + randomBytes[i];
    }
    
    // Rejection sampling: se o valor estiver fora do range válido, tenta novamente
  } while (result >= maxValue - (maxValue % range));
  
  return min + (result % range);
}

/**
 * Embaralha um array usando Fisher-Yates shuffle com Web Crypto API
 */
export function secureArrayShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(0, i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Seleciona N elementos aleatórios de um array sem repetição
 */
export function selectRandomElements<T>(array: T[], count: number): T[] {
  if (count >= array.length) {
    return secureArrayShuffle(array);
  }
  
  const shuffled = secureArrayShuffle(array);
  return shuffled.slice(0, count);
}
