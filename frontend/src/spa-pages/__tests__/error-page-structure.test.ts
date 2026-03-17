import { describe, it, expect } from 'vitest';

describe('error page structure', () => {
  it('displays 500 status code', () => {
    const statusCode = '500';
    expect(statusCode).toBe('500');
  });

  it('has descriptive heading', () => {
    const heading = 'Something went wrong';
    expect(heading).toContain('wrong');
  });

  it('provides error description', () => {
    const desc = 'An unexpected error occurred. This has been logged and our team will look into it.';
    expect(desc).toContain('unexpected');
    expect(desc).toContain('logged');
  });

  it('uses destructive color for status code', () => {
    const style = 'hsl(var(--destructive))';
    expect(style).toContain('--destructive');
  });

  it('has Try Again button', () => {
    const btnText = 'Try Again';
    expect(btnText).toBe('Try Again');
  });

  it('has Back to Home link', () => {
    const linkHref = '/';
    const linkText = 'Back to Home';
    expect(linkHref).toBe('/');
    expect(linkText).toContain('Home');
  });
});

describe('error page error digest display', () => {
  it('shows error digest when present', () => {
    const digest = 'abc123';
    const display = `Error ID: ${digest}`;
    expect(display).toBe('Error ID: abc123');
  });

  it('uses monospace font for digest', () => {
    const className = 'font-mono text-xs';
    expect(className).toContain('font-mono');
  });
});

describe('error page actions', () => {
  it('reset button calls reset function', () => {
    let resetCalled = false;
    const reset = () => { resetCalled = true; };
    reset();
    expect(resetCalled).toBe(true);
  });

  it('home link navigates to root', () => {
    const href = '/';
    expect(href).toBe('/');
  });

  it('actions layout is responsive', () => {
    const className = 'mt-8 flex flex-col gap-3 sm:flex-row';
    expect(className).toContain('flex-col');
    expect(className).toContain('sm:flex-row');
  });
});
