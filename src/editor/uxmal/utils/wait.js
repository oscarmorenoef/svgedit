/**
 * Wait for a given number of milliseconds
 * @param {number} ms - The number of milliseconds to wait
 * @returns {Promise<void>}
 */
export async function wait(ms){
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}