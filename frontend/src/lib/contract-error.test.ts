import { ContractError } from '../lib/error-normalizer';
import { AsyncError } from '../lib/async-errors';

describe('ContractError', () => {
  it('should be an instance of AsyncError and Error', () => {
    const error = new ContractError('Message', 'CODE', 'testFunction');
    expect(error).toBeInstanceOf(ContractError);
    expect(error).toBeInstanceOf(AsyncError);
    expect(error).toBeInstanceOf(Error);
  });

  it('should correctly set the message, code, and functionName', () => {
    const message = 'Contract call failed';
    const code = 'ERR_123';
    const functionName = 'stake';
    const error = new ContractError(message, code, functionName);

    expect(error.message).toBe(message);
    expect(error.code).toBe(code);
    expect(error.functionName).toBe(functionName);
  });

  it('should use empty string as default functionName', () => {
    const error = new ContractError('Message', 'CODE');
    expect(error.functionName).toBe('');
  });

  it('should have the correct name property', () => {
    const error = new ContractError('Message', 'CODE');
    expect(error.name).toBe('ContractError');
  });
});
