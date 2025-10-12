import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Counter from './Counter.svelte';

describe('Counter Component', () => {
  it('renders with initial count of 0', () => {
    render(Counter);

    const counterValue = screen.getByText('0');
    expect(counterValue).toBeInTheDocument();
  });

  it('displays the title', () => {
    render(Counter);

    const title = screen.getByText('Interactive Counter');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('counter__title');
  });

  it('increments count when + button is clicked', async () => {
    render(Counter);

    const incrementButton = screen.getByText('+');
    await fireEvent.click(incrementButton);

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('decrements count when - button is clicked', async () => {
    render(Counter);

    const decrementButton = screen.getByText('-');
    await fireEvent.click(decrementButton);

    expect(screen.getByText('-1')).toBeInTheDocument();
  });

  it('resets count to 0 when Reset button is clicked', async () => {
    render(Counter);

    // Increment a few times
    const incrementButton = screen.getByText('+');
    await fireEvent.click(incrementButton);
    await fireEvent.click(incrementButton);
    await fireEvent.click(incrementButton);

    expect(screen.getByText('3')).toBeInTheDocument();

    // Reset
    const resetButton = screen.getByText('Reset');
    await fireEvent.click(resetButton);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles multiple increment operations', async () => {
    render(Counter);

    const incrementButton = screen.getByText('+');

    await fireEvent.click(incrementButton);
    expect(screen.getByText('1')).toBeInTheDocument();

    await fireEvent.click(incrementButton);
    expect(screen.getByText('2')).toBeInTheDocument();

    await fireEvent.click(incrementButton);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('handles mixed increment and decrement operations', async () => {
    render(Counter);

    const incrementButton = screen.getByText('+');
    const decrementButton = screen.getByText('-');

    await fireEvent.click(incrementButton);
    await fireEvent.click(incrementButton);
    expect(screen.getByText('2')).toBeInTheDocument();

    await fireEvent.click(decrementButton);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders all buttons', () => {
    render(Counter);

    expect(screen.getByText('+')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('applies correct CSS classes to buttons', () => {
    render(Counter);

    const incrementButton = screen.getByText('+');
    const decrementButton = screen.getByText('-');
    const resetButton = screen.getByText('Reset');

    expect(incrementButton).toHaveClass('counter__button', 'counter__button--increment');
    expect(decrementButton).toHaveClass('counter__button', 'counter__button--decrement');
    expect(resetButton).toHaveClass('counter__button', 'counter__button--reset');
  });
});
